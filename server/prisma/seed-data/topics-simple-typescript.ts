import type { SimpleExplanation } from './topics-simple';

/**
 * Beginner explanations for the TypeScript topics.
 *
 * Same rules as the other simple files: open with something from real life,
 * one idea per entry, no unexplained jargon, end with the line worth keeping.
 *
 * TypeScript is unusually easy to explain badly, because most explanations start
 * from the compiler. These start from the reader.
 */
export const SIMPLE_TYPESCRIPT: Record<string, SimpleExplanation> = {
  'ts-why-typescript': {
    simple: `**Think of labels on jars in a kitchen.**

JavaScript is a kitchen where every jar is unlabelled. You *think* the jar has sugar. You find out it was salt when someone tastes the tea.

TypeScript is the same kitchen with **labels on every jar**. Before you cook, you can read the label and know.

Two things people get wrong about the labels:

1. **The labels come off before serving.** When your code actually runs, every label is peeled away. The food is identical — the labels only helped *you*, while cooking.
2. **A label is not a taste test.** If someone hands you a jar and you write "sugar" on it yourself, the label says sugar. That does not make it sugar. This is why data from the internet still has to be checked properly.

So TypeScript catches "you used the wrong jar" while you write. It cannot catch "someone lied about what was in the jar".

**Remember:** TypeScript checks your code before it runs, then disappears.`,
    simpleHi: `**Rasoi mein jaron par label socho.**

JavaScript wo rasoi hai jahan kisi jar par label nahi hai. Aapko *lagta* hai jar mein cheeni hai. Pata tab chalta hai jab koi chai peekar bataye ki namak tha.

TypeScript wahi rasoi hai jahan **har jar par label** hai. Pakane se pehle label padho aur pata chal jaye.

Label ke baare mein do baatein log galat samajhte hain:

1. **Parosne se pehle label utar jate hain.** Jab aapka code sach mein chalta hai, har label hata diya jata hai. Khana bilkul wahi hota hai — label sirf *aapke* kaam aaye, pakate waqt.
2. **Label chakhna nahi hai.** Koi jar de aur aap khud us par "cheeni" likh do, to label cheeni kehta hai. Isse wo cheeni ban nahi jati. Isiliye internet se aaye data ko ab bhi theek se jaanchna padta hai.

To TypeScript "aapne galat jar use kar liya" likhte waqt pakad leta hai. "Kisi ne jar ke baare mein jhoot bola" wo nahi pakad sakta.

**Yaad rakho:** TypeScript code chalne se pehle jaanchta hai, phir gayab ho jata hai.`,
  },

  'ts-basic-types': {
    simple: `**Think of three kinds of unlabelled parcel.**

Most labels are boring and obvious: *text*, *number*, *yes/no*, *a list of things*.

Three are special, and interviewers love them:

**\`any\` — "do not check this parcel."**
You wave it through with no inspection. And here is the problem: everything you take *out* of it is also uninspected. One skipped check quietly skips the next ten.

**\`unknown\` — "we do not know what is in here yet."**
Also unopened, but the rule is: **you may not use it until you look inside.** That one rule is the whole difference. It is the safe version.

**\`never\` — "this parcel cannot exist."**
For situations that genuinely cannot happen. Its main job is to make the computer shout at you when you add a new option somewhere and forget to handle it in one place.

If you remember one line from this page: **use \`unknown\`, not \`any\`.**`,
    simpleHi: `**Teen tarah ke bina-label parcel socho.**

Zyadatar label boring aur saaf hain: *text*, *number*, *haan/na*, *cheezon ki list*.

Teen khaas hain, aur interview lene wale inhe bahut pasand karte hain:

**\`any\` — "is parcel ko mat jaancho."**
Aap bina jaanch ke jaane dete ho. Aur dikkat yahan hai: usme se jo bhi *nikaloge* wo bhi bina jaancha hoga. Ek chhoodi hui jaanch chupchaap agli das bhi chhod deti hai.

**\`unknown\` — "abhi pata nahi isme kya hai."**
Ye bhi khula nahi hai, par niyam ye hai: **andar dekhe bina use nahi kar sakte.** Wahi ek niyam poora farq hai. Ye surakshit roop hai.

**\`never\` — "ye parcel ho hi nahi sakta."**
Un haalaton ke liye jo sach mein nahi ho sakte. Iska asli kaam ye hai ki jab aap kahin naya option jodo aur ek jagah sambhalna bhool jao, to computer aap par chillaye.

Agar is page se ek line yaad rakhni ho: **\`any\` nahi, \`unknown\` use karo.**`,
  },

  'ts-inference-and-annotations': {
    simple: `**Think of writing a shopping list.**

If the list says "2 kg" next to "rice", you do not also need to write "this is a weight". Everyone can see that.

TypeScript is the same. If you write \`const price = 500\`, it already knows that is a number. Writing "this is a number" next to it adds nothing — and now there are **two** things to keep correct instead of one.

So where *should* you write the label?

**At the doors.** When something comes *into* a function, or goes *out* of one. Those are the places TypeScript cannot guess, because it does not know who will call you or what they will send.

Inside the room, let it work things out.

One small thing that trips everyone up: if a box can never be changed, TypeScript remembers **exactly** what is in it. If the box can be changed, it only remembers the *kind* of thing. That is why \`const\` and \`let\` behave differently.

**Remember:** label the doors, not the furniture.`,
    simpleHi: `**Saudе ki list likhna socho.**

List mein "chawal" ke aage "2 kg" likha hai, to saath mein "ye wazan hai" likhne ki zaroorat nahi. Sabko dikh raha hai.

TypeScript bhi aisa hi hai. \`const price = 500\` likha to use pehle se pata hai ki ye number hai. Uske aage "ye number hai" likhne se kuch nahi milta — aur ab **do** cheezein sahi rakhni padengi, ek ki jagah.

To label likhna *chahiye* kahan?

**Darwazon par.** Jab kuch function ke *andar* aaye, ya usse *bahar* jaye. Yahi wo jagah hain jo TypeScript andaza nahi laga sakta, kyunki use nahi pata kaun aapko bulayega aur kya bhejega.

Kamre ke andar use khud samajhne do.

Ek chhoti baat jo sabko fasati hai: agar dibba kabhi badal hi nahi sakta, to TypeScript **theek-theek** yaad rakhta hai ki usme kya hai. Agar dibba badal sakta hai, to sirf *kism* yaad rakhta hai. Isiliye \`const\` aur \`let\` alag bartaav karte hain.

**Yaad rakho:** darwazon par label lagao, furniture par nahi.`,
  },

  'ts-interfaces-vs-types': {
    simple: `**Both are ways of writing down "what this thing looks like."**

Imagine describing a person: name, age, phone number. You can write that description two ways, and for a plain description like this, **they are the same**. Anyone telling you one is always better is overcomplicating it.

The differences show up at the edges:

**Only \`type\` can say "one of these."**
"A traffic light is red, or yellow, or green." A list of choices. \`interface\` simply cannot express that.

**Only \`interface\` can be added to later.**
Write the same interface name twice and the two descriptions **join together**. That sounds strange until you need it: it is how you add your own field to something written by someone else — like adding "who is logged in" to a form that came with a library.

That is genuinely the main reason to pick one over the other.

**Remember:** \`type\` for choices, \`interface\` for shapes you or others may extend later.`,
    simpleHi: `**Dono "ye cheez dikhti kaisi hai" likhne ke tareeke hain.**

Ek insaan ka hulia socho: naam, umar, phone number. Ye hulia do tareeke se likha ja sakta hai, aur is tarah ke simple hulia ke liye **dono ek jaise hain**. Jo kahe ki ek hamesha behtar hai, wo baat ko zyada ghuma raha hai.

Farq kinaron par dikhta hai:

**Sirf \`type\` keh sakta hai "inme se koi ek."**
"Traffic light laal hai, ya peeli, ya hari." Chunaav ki list. \`interface\` ye keh hi nahi sakta.

**Sirf \`interface\` mein baad mein joda ja sakta hai.**
Ek hi interface ka naam do baar likho aur dono hulie **mil kar ek** ho jate hain. Ye ajeeb lagta hai jab tak zaroorat na pade: kisi aur ke likhe hue mein apna field jodne ka yahi tareeka hai — jaise library se aaye form mein "kaun login hai" jodna.

Ek ko doosre par chunne ki asli wajah sach mein yahi hai.

**Yaad rakho:** chunaav ke liye \`type\`, aisi shapes ke liye \`interface\` jinme aap ya koi aur baad mein jod sake.`,
  },

  'ts-functions': {
    simple: `**Think of a vending machine.**

You put something **in** (money, a code) and something comes **out** (a snack).

Typing a function is just writing that on the front of the machine: *"put in a number, get out text."*

Three everyday things:

**Some slots are optional.** You can add a note with your order, or not. Written with a little \`?\`.

**Some slots have a default.** If you do not choose a size, you get medium.

**Some machines take as many coins as you like.** One slot, any number of items.

The one genuinely surprising rule: if the machine's front says "this gives you nothing back", a machine that *does* give something back is still allowed. That seems wrong, but it is what lets you write short, tidy code without the computer complaining about a returned value you were ignoring anyway.

**Remember:** write what goes in and what comes out. That is the whole job.`,
    simpleHi: `**Ek vending machine socho.**

Aap kuch **daalte** ho (paise, ek code) aur kuch **nikalta** hai (ek snack).

Function type karna bas yahi baat machine ke aage likhna hai: *"number daalo, text milega."*

Teen rozmarra ki baatein:

**Kuch khaane optional hote hain.** Order ke saath note jodo, ya na jodo. Chhote se \`?\` se likha jata hai.

**Kuch khaanon mein default hota hai.** Size na chuno to medium mil jata hai.

**Kuch machine jitne chaho utne sikke le leti hain.** Ek khaana, kitni bhi cheezein.

Ek sach mein chaunkane wala niyam: agar machine ke aage likha ho "ye kuch wapas nahi deti", to wo machine jo kuch *deti hai* wo bhi chal jati hai. Ye galat lagta hai, par isi se aap chhota saaf code likh pate ho bina computer ke us laut i hui cheez par tokne ke jise aap waise bhi nazarandaz kar rahe the.

**Yaad rakho:** kya andar jata hai aur kya bahar aata hai, bas yahi likhna hai.`,
  },

  'ts-objects-and-optional': {
    simple: `**Think of a form you fill at a bank.**

Some boxes are **compulsory** — name, account number.
Some boxes are **optional** — middle name, nickname.
Some boxes are **already printed and cannot be changed** — your customer ID.

That is the whole idea. TypeScript lets you mark each box as one of those.

**One thing surprises everyone exactly once.**

If you hand the clerk a form with an **extra box you drew yourself**, they reject it — "there is no such box on this form".

But if you fill that same form at home, put it in an envelope, and post it, it goes through.

Same form, same extra box, different result. Why? Because when you hand something over **directly**, the clerk assumes an unexpected box is a mistake — probably a spelling error. When it arrives another way, they only check that the required boxes are filled.

It feels like a bug. It is not. It exists to catch typos, which is usually exactly what an unexpected box is.

**Remember:** required, optional, or fixed — and an extra box handed over directly gets questioned.`,
    simpleHi: `**Bank mein bharne wala form socho.**

Kuch khaane **zaroori** hain — naam, account number.
Kuch khaane **optional** hain — middle name, nickname.
Kuch khaane **pehle se chhape hain aur badal nahi sakte** — aapka customer ID.

Poora vichaar bas itna hai. TypeScript har khaane par inme se ek nishaan lagane deta hai.

**Ek baat har kisi ko theek ek baar chaunkati hai.**

Aap clerk ko wo form do jisme **aapne khud ek extra khaana bana diya**, to wo mana kar dega — "is form par aisa koi khaana hai hi nahi".

Par wahi form ghar par bhar kar, lifafe mein daal kar bhejo, to chal jata hai.

Wahi form, wahi extra khaana, alag natija. Kyun? Kyunki jab aap kuch **seedha** dete ho, clerk maanta hai ki anjaana khaana galti hai — shayad spelling ki. Doosre raaste se aaye to wo bas itna dekhta hai ki zaroori khaane bhare hain.

Ye bug lagta hai. Hai nahi. Ye typo pakadne ke liye hai, aur anjaana khaana aksar wahi hota hai.

**Yaad rakho:** zaroori, optional, ya pakka — aur seedha diya gaya extra khaana sawaal khada karta hai.`,
  },

  'ts-unions-and-narrowing': {
    simple: `**Think of a sealed envelope that is either a bill or a birthday card.**

Until you open it, what can you safely do? Only things that work for **both**. You can weigh it. You cannot "read the amount owed" — a birthday card has no amount.

Once you look inside and see it is a bill, *now* you can read the amount. That looking-inside step is the whole idea. The computer watches you check, and from that moment it knows which one you are holding.

**The best trick: put a label on the outside.**

Instead of two mystery envelopes, imagine every envelope has one word printed on it — "BILL" or "CARD". Now one glance tells you everything, and you can never accidentally look for an amount on a birthday card.

This is worth doing because it makes the impossible **impossible to even write down**. An envelope cannot be a bill *and* a card at once, so your code cannot pretend it is.

**One trap:** "if there is a number" is not the same as "if a number was given". Zero is a real number, but a quick check treats it as nothing. Same for empty text.

**Remember:** check first, then use. And a label on the outside beats guessing.`,
    simpleHi: `**Ek band lifafa socho jo ya to bill hai ya birthday card.**

Khole bina aap surakshit roop se kya kar sakte ho? Sirf wo jo **dono** ke saath chale. Aap use tol sakte ho. "Kitne paise dene hain" nahi padh sakte — birthday card par amount hota hi nahi.

Ek baar andar dekh liya aur bill nikla, *ab* amount padh sakte ho. Andar dekhne ka yahi kadam poora vichaar hai. Computer aapko jaanchte hue dekhta hai, aur usi pal se use pata hota hai ki aapke haath mein kaun sa hai.

**Sabse achha tareeka: bahar label laga do.**

Do rahasyamayi lifafon ki jagah socho ki har lifafe par ek shabd chhapa hai — "BILL" ya "CARD". Ab ek nazar mein sab pata, aur aap galti se birthday card par amount dhoondh hi nahi sakte.

Ye karna isliye theek hai kyunki isse jo namumkin hai wo **likha hi nahi ja sakta**. Lifafa ek saath bill *aur* card nahi ho sakta, isliye aapka code aisa dikha bhi nahi sakta.

**Ek trap:** "agar koi number hai" aur "agar number diya gaya tha" ek baat nahi. Zero asli number hai, par jaldbaazi wali jaanch use kuch-nahi maan leti hai. Khaali text ke saath bhi wahi.

**Yaad rakho:** pehle jaancho, phir use karo. Aur bahar laga label andaze se behtar hai.`,
  },

  'ts-enums-and-literals': {
    simple: `**Think of a dropdown with a fixed list of choices.**

An order can be *pending*, *paid*, or *shipped*. Nothing else. You want the computer to refuse anything not on that list.

There are two ways to write the list, and this is the one place they really differ:

**Way one — just write the choices down.** Nothing extra is created. When your program runs, the list has vanished, exactly like every other label in TypeScript.

**Way two — an "enum".** This one is different: it **actually builds something** that stays in your program after it runs. It is the only TypeScript feature that does.

Most of the time you do not need that extra thing, so the first way is simpler and lighter.

**One genuinely surprising catch.** If you make an enum out of numbers, the computer will happily accept *any* number — including one that is not on your list at all. The safety you wanted is not there. If you use an enum, use one made of words.

**Remember:** a plain list of choices disappears when the program runs. An enum does not.`,
    simpleHi: `**Ek dropdown socho jisme chunaav ki tay list hai.**

Order *pending* ho sakta hai, *paid*, ya *shipped*. Aur kuch nahi. Aap chahte ho ki computer us list se bahar ki har cheez mana kar de.

List likhne ke do tareeke hain, aur asli farq yahi ek jagah hai:

**Pehla tareeka — bas chunaav likh do.** Kuch extra nahi banta. Program chalte waqt list gayab ho jati hai, bilkul TypeScript ke har doosre label ki tarah.

**Doosra tareeka — "enum".** Ye alag hai: ye **sach mein kuch banata hai** jo program chalne ke baad bhi rehta hai. TypeScript ka ye akela feature aisa hai.

Zyadatar us extra cheez ki zaroorat nahi hoti, isliye pehla tareeka simple aur halka hai.

**Ek sach mein chaunkane wali baat.** Agar aap numbers ka enum banao, to computer khushi se *koi bhi* number le lega — wo bhi jo aapki list mein hai hi nahi. Jo surakshit hona chahiye tha wo hai hi nahi. Enum use karna hi hai to shabdon wala use karo.

**Yaad rakho:** simple chunaav ki list program chalte hi gayab ho jati hai. Enum nahi hoti.`,
  },

  'ts-null-safety': {
    simple: `**Think of a locker that might be empty.**

You walk up expecting your bag. Maybe it is there. Maybe it is not. If you reach in without looking and it is empty, you fall over.

"Empty" is the single most common cause of a program crashing. So TypeScript has a setting — and it is the most useful one it has — that makes it say: **"this locker might be empty. Deal with that."**

Three ways to deal with it:

**Look first.** "If there is a bag, take it."

**Have a backup.** "Give me the bag, or a spare one if it is empty." There are two ways to write this, and one of them has a nasty habit: it also treats *zero* and *empty text* as "nothing". If someone genuinely ordered zero items, that backup would quietly change it. Use the one that only reacts to a truly empty locker.

**Insist it is there.** "I promise the bag is there." The computer believes you and stops checking. If you are wrong, you fall over exactly as before — you just removed the warning. Use this rarely, and only when you can explain why you know.

**Remember:** the computer telling you "this might be empty" is doing you a favour.`,
    simpleHi: `**Ek locker socho jo khaali ho sakta hai.**

Aap apna bag lene jate ho. Shayad wo hai. Shayad nahi. Bina dekhe haath daal diya aur khaali nikla, to aap gir jate ho.

"Khaali" program crash hone ki sabse aam wajah hai. Isliye TypeScript mein ek setting hai — aur uski sabse kaam ki yahi hai — jo kehti hai: **"ye locker khaali ho sakta hai. Ise sambhalo."**

Sambhalne ke teen tareeke:

**Pehle dekho.** "Agar bag hai to lo."

**Backup rakho.** "Bag do, ya khaali ho to ek spare." Ise likhne ke do tareeke hain, aur ek ki gandi aadat hai: wo *zero* aur *khaali text* ko bhi "kuch nahi" maan leta hai. Kisi ne sach mein zero cheezein order ki hon, to wo backup chupchaap use badal dega. Wo wala use karo jo sirf sach mein khaali locker par chalta hai.

**Zid karo ki wo hai.** "Main wada karta hoon bag wahan hai." Computer maan leta hai aur jaanchna band kar deta hai. Aap galat hue to pehle jaise hi girte ho — bas chetavni hata di. Ye kam use karo, aur tabhi jab wajah bata sako.

**Yaad rakho:** computer ka "ye khaali ho sakta hai" kehna aap par ehsaan hai.`,
  },

  'ts-classes': {
    simple: `**Think of a blueprint for a house.**

A class is a blueprint. From one blueprint you build many houses, each with its own address and its own furniture.

The interesting part is **who is allowed in which room**:

- **public** — anyone can walk in (the living room)
- **private** — only people who live here (your bedroom)
- **protected** — family only, including children who move out and build their own house
- **readonly** — the address plaque; set when built, never changed after

**Here is the catch worth knowing.** TypeScript's "private" is a *sign on the door*, not a lock. It stops a polite person while they are drawing the plans. Once the house is actually built, anyone can walk in — because, remember, all the labels come off before the program runs.

If you want a **real lock**, JavaScript has one: a room marked with \`#\`. That one is genuinely shut.

**Remember:** a class is a blueprint. TypeScript's "private" is a sign; \`#\` is a lock.`,
    simpleHi: `**Ghar ka naksha socho.**

Class ek naksha hai. Ek naksha se kai ghar bante hain, har ek ka apna pata aur apna saamaan.

Mazedaar hissa ye hai ki **kaun kis kamre mein ja sakta hai**:

- **public** — koi bhi aa sakta hai (drawing room)
- **private** — sirf yahan rehne wale (aapka bedroom)
- **protected** — sirf parivaar, un bachchon samet jo alag ghar bana lein
- **readonly** — pate ki plate; banate waqt lagi, phir kabhi nahi badli

**Jaanne layak pech ye hai.** TypeScript ka "private" darwaze par *takhti* hai, taala nahi. Wo naksha banate waqt sharif aadmi ko rok deta hai. Ghar sach mein ban jane ke baad koi bhi andar aa sakta hai — kyunki, yaad rakho, program chalne se pehle saare label utar jate hain.

**Asli taala** chahiye to JavaScript mein hai: \`#\` se likha kamra. Wo sach mein band hai.

**Yaad rakho:** class ek naksha hai. TypeScript ka "private" takhti hai; \`#\` taala hai.`,
  },

  'ts-generics': {
    simple: `**Think of a lunchbox.**

A lunchbox does not care what you put in it. Rice, sandwich, fruit — it holds it.

But here is the thing you *do* want: when you open it, you should get back **exactly what you put in**. Put rice in, get rice out. A lunchbox that turned everything into "some food" would be useless.

That is generics. You write the box **once**, and it works for anything — while still remembering what went in.

The alternative is a box that shrugs and says "it is food, I do not know what kind". That is the lazy option, and it throws away the one thing you needed.

**Two useful extras:**

You can add a rule: *"this box only takes things that fit in a fridge."* Now you are allowed to assume anything inside is fridge-sized.

And you can ask for one specific compartment by name, and get back exactly what is in **that** compartment — not "something, somewhere in the box".

**Remember:** write it once, use it for anything, and never lose track of what went in.`,
    simpleHi: `**Ek tiffin socho.**

Tiffin ko farak nahi padta ki aap usme kya rakhte ho. Chawal, sandwich, phal — wo rakh leta hai.

Par jo aap *chahte* ho wo ye hai: kholne par aapko **bilkul wahi milna chahiye jo rakha tha**. Chawal rakho, chawal milo. Aisa tiffin jo har cheez ko "kuch khana" bana de, bekaar hai.

Yahi generics hai. Aap dabba **ek baar** likhte ho, aur wo har cheez ke liye chalta hai — aur yaad bhi rakhta hai ki andar kya gaya tha.

Doosra rasta wo dabba hai jo kandhe uchka kar kahe "khana hai, kaun sa nahi pata". Wo aalsi chunaav hai, aur wahi ek cheez phenk deta hai jiski aapko zaroorat thi.

**Do kaam ki baatein:**

Aap niyam jod sakte ho: *"is dabbe mein sirf wo cheezein jo fridge mein aa jayein."* Ab aap maan sakte ho ki andar jo bhi hai wo fridge ke naap ka hai.

Aur aap naam lekar ek khaas khaana maang sakte ho, aur bilkul wahi milega jo **us** khaane mein hai — "dabbe mein kahin kuch" nahi.

**Yaad rakho:** ek baar likho, har cheez ke liye chalao, aur andar kya gaya tha wo kabhi mat bhoolo.`,
  },

  'ts-utility-types': {
    simple: `**Think of a passport photocopy shop.**

You have one original document — a customer's full details. Now you need variations of it:

- The **form to create a new customer** — same as the original, but *without* the customer number, because that gets assigned afterwards.
- The **form to update details** — same again, but every box is *optional*, since you might only be changing the phone number.
- The **short version for a list** — just the name and the number.

You could type out all three from scratch. But then, when the original changes, you have **four** documents to update — and you will forget one. That forgotten one is a bug waiting months to happen.

TypeScript gives you a photocopier with settings: *"copy this, but leave out that box"*, *"copy this, but make everything optional"*, *"copy this, keep only these two boxes"*.

Now there is **one** original. Change it, and every copy updates itself.

**Remember:** never write the same shape twice. Copy it with a rule instead.`,
    simpleHi: `**Ek photocopy ki dukaan socho.**

Aapke paas ek asli document hai — customer ki poori details. Ab uske alag roop chahiye:

- **Naya customer banane ka form** — asli jaisa hi, par customer number *ke bina*, kyunki wo baad mein milta hai.
- **Details badalne ka form** — phir wahi, par har khaana *optional*, kyunki shayad sirf phone number badalna ho.
- **List ke liye chhota roop** — sirf naam aur number.

Aap teeno naye sire se likh sakte ho. Par phir jab asli badlega, **chaar** document badalne padenge — aur ek chhoot jayega. Wahi chhoota hua mahinon baad aane wala bug hai.

TypeScript aapko settings wali photocopier deta hai: *"ise copy karo par wo khaana chhod do"*, *"ise copy karo par sab optional kar do"*, *"ise copy karo, sirf ye do khaane rakho"*.

Ab **ek** asli hai. Use badlo, aur har copy khud badal jayegi.

**Yaad rakho:** ek hi shape do baar kabhi mat likho. Niyam ke saath copy karo.`,
  },

  'ts-tsconfig': {
    simple: `**Think of the settings on a spell-checker.**

You can set it to "only tell me about the really obvious mistakes", or "check everything properly". Same tool, very different amount of help.

TypeScript has one setting that matters far more than the rest. Turn it on, and it starts checking properly. Leave it off, and it lets almost everything through — and then people say "TypeScript never catches anything", which is true, because they switched the checking off.

There is a second setting worth knowing, and it is the honest one nobody likes: **"the tenth item in a list of three does not exist."**

Obvious when said out loud. But most code quietly assumes that if you ask for an item, one will be there. Turning this on makes the computer point that out — annoying at first, and it finds real bugs.

The rest of the settings mostly answer "which version of JavaScript should come out" and "where should I look for files". Important to get right once, then you forget them.

**Remember:** turn the strict setting on from day one. Adding it later is much harder.`,
    simpleHi: `**Spell-checker ki settings socho.**

Aap use "sirf bilkul saaf galtiyan batao" par laga sakte ho, ya "sab theek se jaancho" par. Ek hi tool, madad mein zameen-aasman ka farq.

TypeScript mein ek setting baaki sabse kahin zyada matter karti hai. Use chalu karo, wo theek se jaanchna shuru karta hai. Band chhod do, wo lagbhag sab kuch jaane deta hai — aur phir log kehte hain "TypeScript kuch pakadta hi nahi", jo sach hai, kyunki unhone jaanch band kar rakhi thi.

Ek doosri setting bhi jaanne layak hai, aur wo imaandar wali hai jo kisi ko pasand nahi: **"teen cheezon ki list mein dasvi cheez hoti hi nahi."**

Bol kar kaho to saaf hai. Par zyadatar code chupchaap maan leta hai ki cheez maango to milegi. Ye chalu karne par computer wo baat batata hai — pehle chidhata hai, aur asli bug pakadta hai.

Baaki settings zyadatar ye batati hain ki "JavaScript ka kaunsa version niklega" aur "files kahan dhoondhni hain". Ek baar theek karo, phir bhool jao.

**Yaad rakho:** strict setting pehle din se chalu karo. Baad mein lagana kahin zyada mushkil hai.`,
  },

  'ts-declarations-and-modules': {
    simple: `**Think of a borrowed appliance with no manual.**

Someone lends you a machine. It works, but there are no instructions — so you do not know which buttons exist or what they do.

Some appliances come **with** a manual in the box. Lovely, nothing to do.

Some have a manual written by other users and shared online. You go and fetch it.

And some have **nothing**. So you write down the bits you actually use: *"the green button starts it, the dial sets the time."* You are not building the machine — you are just writing down what is already there so you can use it safely.

**The other half of this idea is even more useful.**

Sometimes a machine is *almost* right, and you want to add one thing to it — a label on the front saying who is currently using it. You cannot rewrite someone else's machine. But you *can* add your own note to its manual, and from then on everyone reads both notes together as one.

That is how you attach "who is logged in" to a request that came from a library you did not write.

**Remember:** a manual describes something that already exists. Writing one does not build anything.`,
    simpleHi: `**Bina manual ke udhaar li hui machine socho.**

Kisi ne machine di. Chalti hai, par instructions nahi — to pata nahi kaunse button hain aur kya karte hain.

Kuch machine **manual ke saath** aati hain. Bahut achha, kuch karna nahi.

Kuch ka manual doosre users ne likh kar online rakha hai. Aap ja kar le aate ho.

Aur kuch ke paas **kuch nahi**. To aap sirf utna likh lete ho jitna aap use karte ho: *"hara button chalu karta hai, dial se samay set hota hai."* Aap machine bana nahi rahe — jo pehle se hai use likh rahe ho taaki surakshit tareeke se use kar sako.

**Is vichaar ka doosra aadha hissa aur bhi kaam ka hai.**

Kabhi machine *lagbhag* theek hoti hai aur usme ek cheez jodni hoti hai — aage ek label jo bataye ki abhi kaun use kar raha hai. Aap kisi aur ki machine dobara nahi likh sakte. Par uske manual mein apna note **jod sakte ho**, aur uske baad sab dono note ek saath padhte hain.

Isi tarah aap "kaun login hai" us request par lagate ho jo aapki nahi, kisi library ki likhi hui hai.

**Yaad rakho:** manual us cheez ka hulia hai jo pehle se maujood hai. Manual likhne se kuch banta nahi.`,
  },

  'ts-conditional-types': {
    simple: `**Think of a sorting rule at a post office.**

*"If the parcel is fragile, put it on the top shelf. Otherwise, the bottom shelf."*

That is an if/else — except it is deciding about **kinds of things**, not actual things, and it is decided while you write the code rather than while it runs.

**The part that surprises people:** if you hand over a *mixed sack* of parcels, the rule does not look at the sack. It **empties the sack and applies the rule to each parcel one at a time**, then puts the results into new sacks.

So "fragile or heavy" does not become one pile. It becomes two piles, sorted separately. Once you know that, a lot of confusing behaviour makes sense.

**The second idea is a fill-in-the-blank.**

*"If the parcel looks like \`a box containing ___\`, tell me what the blank was."* You are describing a shape with a gap, and asking the computer to report what fits in the gap.

That is how "what does this function give back?" is answered without you ever writing it down.

**Honest note:** this is the deep end. Most code never needs it. It matters when you are building tools other people use.

**Remember:** an if/else for types — and it unpacks mixed bags one item at a time.`,
    simpleHi: `**Post office ka chhantne ka niyam socho.**

*"Parcel nazuk hai to upar wale khaane mein rakho. Warna neeche wale mein."*

Ye if/else hai — bas ye **cheezon ki kism** ke baare mein faisla kar raha hai, asli cheezon ke baare mein nahi, aur ye faisla code likhte waqt hota hai, chalte waqt nahi.

**Jo hissa chaunkata hai:** aap *mila-jula bora* de do, to niyam bore ko nahi dekhta. Wo **bora khaali karta hai aur ek-ek parcel par niyam lagata hai**, phir natije naye boron mein daal deta hai.

To "nazuk ya bhaari" ek dher nahi banta. Wo do dher banta hai, alag-alag chhante hue. Ye pata chalte hi bahut sa uljhan wala bartaav samajh aa jata hai.

**Doosra vichaar khaali jagah bharna hai.**

*"Agar parcel aisa dikhta hai jaise \`ek dibba jisme ___ hai\`, to batao khaali jagah mein kya tha."* Aap ek hulia bata rahe ho jisme ek gap hai, aur computer se poochh rahe ho ki us gap mein kya baitha.

Isi tarah "ye function kya wapas deta hai" ka jawab milta hai bina aapke likhe.

**Imaandar baat:** ye gehra paani hai. Zyadatar code ko iski zaroorat kabhi nahi padti. Ye tab matter karta hai jab aap doosron ke liye tools bana rahe ho.

**Yaad rakho:** types ke liye if/else — aur ye mile-jule bore ko ek-ek karke kholta hai.`,
  },

  'ts-mapped-types': {
    simple: `**Think of going through a form, box by box, and changing every box the same way.**

*"Go through this whole form. Put a little tick next to every box meaning 'you may leave this blank'."*

You did not rewrite the form. You walked through it and applied one rule to every box. Now you have a second form, made automatically from the first.

Other rules you might apply:
- *"mark every box as 'cannot be changed'"*
- *"remove the 'optional' tick from every box"*
- *"rename every box to start with the word 'get'"*
- *"throw away every box that does not hold text"*

That last one is the clever one: if you say a box should become "nothing", it simply disappears from the new form. That is how you keep only the boxes you want.

**Why bother?** Because those photocopier tools from earlier — *"same but all optional"*, *"same but nothing can change"* — are **built exactly this way**. There is no magic inside them. Once you can write this, you can build your own.

**Remember:** walk every box, apply one rule, get a new form for free.`,
    simpleHi: `**Ek form par khaane-dar-khaane jaakar har khaane ko ek hi tarah badalna socho.**

*"Is poore form par jao. Har khaane ke aage chhota nishaan lagao jiska matlab hai 'ise khaali chhod sakte ho'."*

Aapne form dobara nahi likha. Aap us par chale aur har khaane par ek niyam laga diya. Ab doosra form hai, jo pehle se apne aap ban gaya.

Aur bhi niyam laga sakte ho:
- *"har khaane par 'badla nahi ja sakta' likh do"*
- *"har khaane se 'optional' ka nishaan hata do"*
- *"har khaane ka naam badal kar 'get' se shuru karo"*
- *"har wo khaana phenk do jisme text nahi hai"*

Aakhri wala chalak hai: agar aap kaho ki koi khaana "kuch nahi" ban jaye, to wo naye form se gayab ho jata hai. Isi tarah sirf apne matlab ke khaane bachte hain.

**Faayda kya?** Kyunki pehle wale photocopier ke tools — *"wahi par sab optional"*, *"wahi par kuch badal nahi sakta"* — **theek isi tarah bane hain**. Unke andar koi jaadu nahi. Ye likhna aa gaya to aap apne bana sakte ho.

**Yaad rakho:** har khaane par chalo, ek niyam lagao, naya form muft mein.`,
  },

  'ts-template-literal-types': {
    simple: `**Think of a rule about how a name must be written.**

*"Every seat number must be a row letter, then a dash, then a number."* A1, B7, C12. Not "aisle", not "near the window".

You are not listing every valid seat. You are describing the **pattern**, and anything not matching it gets refused.

Now combine two lists: sizes (small, large) and colours (red, blue). Cross them and you automatically get all four names: small-red, small-blue, large-red, large-blue. Two short lists, four exact answers — with none written by hand.

**Careful, though.** Cross a list of 100 with a list of 100 and you have asked for ten thousand names. The computer will try, and it will get very slow, and eventually give up.

**The best real use:** a web address like \`/users/:userId/orders/:orderId\`. From that one line of text, the computer can work out that there are exactly two blanks, named \`userId\` and \`orderId\` — and then refuse to let you ask for a third one that does not exist.

**Honest note:** this is the showiest corner of TypeScript and the easiest to overuse. Clever here is expensive later.

**Remember:** describe the pattern a piece of text must follow, and let the computer enforce it.`,
    simpleHi: `**Naam kaise likha jana chahiye, uska niyam socho.**

*"Har seat number mein pehle row ka akshar, phir dash, phir number."* A1, B7, C12. "Aisle" nahi, "khidki ke paas" nahi.

Aap har sahi seat gina nahi rahe. Aap **pattern** bata rahe ho, aur jo us se mel nahi khata wo mana ho jata hai.

Ab do list milao: size (chhota, bada) aur rang (laal, neela). Cross karo aur chaaron naam apne aap mil jate hain: chhota-laal, chhota-neela, bada-laal, bada-neela. Do chhoti list, chaar theek jawab — ek bhi haath se likha nahi.

**Par sambhalna.** 100 ki list ko 100 se cross karo aur aapne das hazaar naam maang liye. Computer koshish karega, bahut dheema hoga, aur aakhir mein haar maan lega.

**Sabse achha asli istemal:** \`/users/:userId/orders/:orderId\` jaisa web address. Us ek line se computer nikaal leta hai ki bilkul do khaali jagah hain, jinke naam \`userId\` aur \`orderId\` hain — aur phir teesri, jo hai hi nahi, maangne par mana kar deta hai.

**Imaandar baat:** ye TypeScript ka sabse dikhawe wala kona hai aur sabse aasani se zyada use ho jata hai. Yahan ki chalaki baad mein mehngi padti hai.

**Yaad rakho:** text ko kis pattern par chalna hai wo batao, aur computer se lagu karwao.`,
  },

  'ts-keyof-typeof-satisfies': {
    simple: `**Think of a menu board in a shop.**

The board already lists what you sell: tea, coffee, juice. Now you want a rule: *"an order must be one of the things on the board."*

You could write the list of allowed orders separately. Bad idea — add lassi to the board, forget the other list, and now nobody can order lassi even though it is right there on the wall.

Better: **point at the board.** *"Allowed orders = whatever is on the board."* Add lassi, and it is allowed automatically. One board, one truth.

That is the whole idea: instead of writing the same list twice, you build the rule **out of** the thing that already exists.

**One more useful trick.**

*"Check my board follows shop rules — but do not forget what is actually written on it."*

Without this, checking the board against the rules turns it into just "a board with some drinks on it", and you lose the specific list. With it, the board is checked **and** still says tea, coffee, juice.

**Remember:** never write the same list twice. Point at the one that already exists.`,
    simpleHi: `**Dukaan ka menu board socho.**

Board par pehle se likha hai ki kya bikta hai: chai, coffee, juice. Ab ek niyam chahiye: *"order board par likhi kisi cheez ka hi ho sakta hai."*

Aap allowed orders ki list alag se likh sakte ho. Bura vichaar — board par lassi jodo, doosri list bhoolo, aur ab koi lassi order nahi kar sakta halanki wo saamne deewar par likhi hai.

Behtar: **board ki taraf ishara karo.** *"Allowed orders = jo bhi board par hai."* Lassi jodo, wo apne aap allowed. Ek board, ek sach.

Poora vichaar yahi hai: wahi list do baar likhne ki jagah, niyam us cheez **se** banao jo pehle se maujood hai.

**Ek aur kaam ka tareeka.**

*"Jaancho ki mera board dukaan ke niyam maanta hai — par jo us par likha hai wo bhoolo mat."*

Iske bina, board ko niyam ke against jaanchne par wo sirf "kuch drinks wala board" ban jata hai, aur khaas list chali jati hai. Iske saath, board jaancha bhi jata hai **aur** ab bhi chai, coffee, juice kehta hai.

**Yaad rakho:** wahi list do baar kabhi mat likho. Jo pehle se hai uski taraf ishara karo.`,
  },

  'ts-react': {
    simple: `**Think of a component as a small machine, and props as the slots on its front.**

A button machine has a slot for the words on it and a slot for what happens when pressed. Writing down what each slot accepts is nearly all there is to typing React.

**The one mistake almost everyone makes once:**

You start an empty list and plan to fill it later. The computer looks at the empty list and thinks: *"a list of... nothing? Fine, this is a list that holds nothing."*

Then you try to add something, and it refuses — because you told it, without meaning to, that this list holds nothing at all.

The fix is one sentence: when you start something empty, **say what it will eventually hold**.

**One genuinely nice trick.** Instead of listing every setting a normal button already accepts — colour, disabled, size, the lot — you can say *"accept everything a normal button accepts, plus my own two extras."* One line, and your machine behaves like a built-in one.

**Remember:** describe the slots. And when you start something empty, say what goes in it.`,
    simpleHi: `**Component ko chhoti machine samjho, aur props ko uske aage bane khaane.**

Button machine mein ek khaana uske upar likhe shabdon ke liye hai aur ek khaana iske liye ki dabane par kya ho. Har khaana kya leta hai, bas yahi likhna React ko type karne ka lagbhag poora kaam hai.

**Wo ek galti jo lagbhag har koi ek baar karta hai:**

Aap khaali list shuru karte ho aur socte ho baad mein bharenge. Computer khaali list dekh kar sochta hai: *"kis cheez ki list? Kuch bhi nahi? Theek hai, ye aisi list hai jisme kuch nahi aata."*

Phir aap usme kuch daalne jate ho aur wo mana kar deta hai — kyunki aapne bina chahe use bata diya tha ki is list mein kuch aata hi nahi.

Hal ek line hai: khaali cheez shuru karte waqt **bata do ki usme aage kya aayega**.

**Ek sach mein achha tareeka.** Wo saari settings ginane ki jagah jo aam button pehle se leta hai — rang, disabled, size, sab — aap keh sakte ho *"jo aam button leta hai wo sab lo, aur mere do extra bhi."* Ek line, aur aapki machine built-in jaisi lagti hai.

**Yaad rakho:** khaane batao. Aur khaali cheez shuru karo to batao usme kya jayega.`,
  },

  'ts-node-express': {
    simple: `**Think of a parcel arriving at your shop.**

Someone posts you a box with a label saying "contains: one book, brand new".

Now — do you trust the label?

Of course not. Anyone can write anything on a label. You **open the box and check**.

This is the single most important idea for using TypeScript on a server, and the one people get wrong most often. When data arrives from the internet, you can *write down* what you expect it to be. That writing-down is just a label you made yourself. It does not open the box. It does not check anything. The box could contain a brick.

So the rule is simple:

**At the door, open every box and check it properly.** Use a real checking tool that looks at the actual contents and refuses what does not match.

**Inside the shop, the labels are trustworthy** — because you checked at the door.

And the neat part: write down what you expect *once*, use it both to check the box **and** as the label. One description, two jobs, and they can never disagree.

**Remember:** a label you wrote yourself is not an inspection. Check at the door.`,
    simpleHi: `**Aapki dukaan par parcel aane ki soch socho.**

Kisi ne dibba bheja jis par label hai "andar: ek kitaab, bilkul nayi".

Ab — kya aap label par bharosa karoge?

Bilkul nahi. Label par koi kuch bhi likh sakta hai. Aap **dibba khol kar jaanchte ho**.

Server par TypeScript use karne ka sabse zaroori vichaar yahi hai, aur log isi mein sabse zyada galti karte hain. Jab data internet se aata hai, aap *likh sakte ho* ki wo kya hona chahiye. Wo likhna bas ek label hai jo aapne khud banaya. Wo dibba kholta nahi. Kuch jaanchta nahi. Dibbe mein eent bhi ho sakti hai.

To niyam simple hai:

**Darwaze par har dibba khol kar theek se jaancho.** Asli jaanchne wala tool use karo jo sach mein andar dekhe aur jo mel na khaye use mana kar de.

**Dukaan ke andar label par bharosa kiya ja sakta hai** — kyunki aapne darwaze par jaanch liya.

Aur achhi baat: jo ummeed hai wo *ek baar* likho, usi se dibba bhi jaancho **aur** wahi label bhi ho. Ek hulia, do kaam, aur dono kabhi alag nahi ho sakte.

**Yaad rakho:** apna likha label jaanch nahi hai. Darwaze par jaancho.`,
  },

  'ts-common-errors': {
    simple: `**Think of a smoke alarm.**

It goes off. You have two options.

**Option one:** find out what is burning.
**Option two:** take the battery out.

Option two is faster. The house still burns down.

Almost every "how do I make this TypeScript error go away" question is asking for the battery. There are two well-known ways to remove the battery, and both work instantly, and both leave the fire.

**How to actually read the alarm**

Long error messages scare people off, so here is the trick: **read the last line first**. The computer explains the big problem at the top and the actual cause at the bottom. The bottom line usually names the one exact thing that does not match.

Then ask yourself one of two questions:

- *Does the computer know something I did not?* Usually yes — something might be empty, or might be a different kind of thing than you assumed. Then the fix is to check for it.
- *Do I know something the computer does not?* Sometimes. Then say so — but be able to explain why you are sure, because if you are wrong, it breaks later instead of now.

**Remember:** the error is the alarm, not the fire. Read the last line first.`,
    simpleHi: `**Smoke alarm socho.**

Wo bajne lagta hai. Aapke paas do raste hain.

**Pehla:** pata karo kya jal raha hai.
**Doosra:** battery nikaal do.

Doosra tez hai. Ghar phir bhi jal jata hai.

"Ye TypeScript error kaise hataun" wale lagbhag har sawaal mein battery maangi ja rahi hoti hai. Battery nikalne ke do mashhoor tareeke hain, dono turant chalte hain, aur dono aag chhod dete hain.

**Alarm ko sach mein kaise padhein**

Lambe error messages dara dete hain, isliye tareeka ye hai: **sabse pehle aakhri line padho**. Computer upar badi samasya batata hai aur asli wajah neeche. Aakhri line aksar wahi ek cheez batati hai jo mel nahi kha rahi.

Phir khud se do mein se ek sawaal poochho:

- *Kya computer ko kuch pata hai jo mujhe nahi tha?* Aksar haan — koi cheez khaali ho sakti hai, ya us kism ki nahi hai jo aapne maan li thi. Tab hal ye hai ki jaanch lagao.
- *Kya mujhe kuch pata hai jo computer ko nahi?* Kabhi-kabhi. Tab bata do — par wajah bata paana chahiye, kyunki galat hue to ye abhi ki jagah baad mein toot ega.

**Yaad rakho:** error alarm hai, aag nahi. Aakhri line pehle padho.`,
  },
};
