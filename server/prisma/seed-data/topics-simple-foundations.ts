import type { SimpleExplanation } from './topics-simple';
import type { TopicTricks } from './topics-tricks';

/**
 * Beginner explanations and memory hooks for the foundation topics.
 *
 * These entries matter more than most: they are the *first* thing a reader
 * meets in SQL, REST, auth and system design. If the on-ramp itself assumes
 * knowledge, the reader concludes the subject is not for them and stops — which
 * is exactly what the difficulty audit found was happening.
 *
 * Both maps live in one file because they cover the same seventeen topics and
 * were written together, so the analogy in the simple layer and the hook in the
 * tricks layer deliberately reuse the same image.
 */

export const SIMPLE_FOUNDATIONS: Record<string, SimpleExplanation> = {
  /* ─────────────────────────────── SQL ─────────────────────────────── */

  'sql-what-is-a-database': {
    simple: `**Think of a filing cabinet in an office.**

- The **cabinet** is the database.
- Each **drawer** is a table — one drawer for customers, one for orders.
- Each **sheet of paper** in a drawer is a row — one customer.
- Each **box on the sheet** is a column — name, phone, city.

That is the whole picture. Everything else is detail.

**So why not just keep notes in a book?**

Because a book breaks the moment more than one person needs it:

- Two people write on the same page at once and one gets overwritten
- You want "everyone in Delhi who spent over ₹500 last week" and now you are reading every page by hand
- Someone knocks over a cup of tea

The cabinet handles all of that. It lets many people work at once, finds things instantly, and does not lose your work if the lights go out.

**One more idea, and it is the important one.**

Every sheet gets a **number** nobody else has. Two customers can both be called Priya. They cannot both be customer 41.

That number is how the orders drawer points back at the right customer — the order says "customer 41", and there is exactly one of those.

**Remember:** a database is a filing cabinet that many people can safely use at once.`,
    simpleHi: `**Office ki file almari socho.**

- **Almari** database hai.
- Har **daraz** ek table hai — ek daraz customers ki, ek orders ki.
- Daraz mein rakha har **panna** ek row hai — ek customer.
- Panne par bana har **khaana** ek column hai — naam, phone, sheher.

Poori tasveer bas itni hai. Baaki sab tafseel hai.

**To bas ek copy mein likh lein?**

Kyunki copy usi pal toot jati hai jab ek se zyada logon ko chahiye:

- Do log ek hi panne par ek saath likhte hain aur ek ka likha mit jata hai
- Aapko chahiye "Delhi ke wo sab jinhone pichhle hafte ₹500 se zyada kharch kiye" aur ab aap har panna haath se padh rahe ho
- Kisi ne chai gira di

Almari ye sab sambhal leti hai. Kai log ek saath kaam kar sakte hain, cheez turant mil jati hai, aur bijli jaye to aapka kaam nahi jata.

**Ek aur baat, aur wahi sabse zaroori hai.**

Har panne ko ek **number** milta hai jo kisi aur ke paas nahi. Do customers ka naam Priya ho sakta hai. Dono customer 41 nahi ho sakte.

Usi number se orders wali daraz sahi customer par ishara karti hai — order kehta hai "customer 41", aur waisa theek ek hi hai.

**Yaad rakho:** database wo file almari hai jise kai log ek saath surakshit tareeke se use kar sakte hain.`,
  },

  'sql-insert-update-delete': {
    simple: `**Three things you can do to a filing cabinet.**

- **INSERT** — add a new sheet
- **UPDATE** — change what is written on a sheet
- **DELETE** — take a sheet out and bin it

You already know how these work. The only new part is the words.

**Now the part that has cost real companies real money.**

Every one of these can take a condition — *"the sheet for customer 41"*. That condition is called WHERE.

**Leave the condition out, and it applies to every sheet in the drawer.**

- "Change the city to Mumbai" — for *one* customer? Or for **all forty thousand**?
- "Throw this sheet away" — or **empty the entire drawer**?

There is no "are you sure?". There is no undo. It takes less than a second.

This is genuinely one of the most famous ways people destroy a real database, and it is almost always someone who was *about* to type the condition next.

**The habit that saves you:** before you change anything, ask to *see* it first. If asking "show me the sheets this would affect" gives you the one sheet you meant, only then change it.

**Remember:** no condition means everything. Look before you change.`,
    simpleHi: `**File almari ke saath teen kaam ho sakte hain.**

- **INSERT** — naya panna jodo
- **UPDATE** — panne par likha badlo
- **DELETE** — panna nikaal kar phenk do

Aapko pehle se pata hai ye kaise hote hain. Naya sirf naam hai.

**Ab wo hissa jisne asli companies ka asli paisa liya hai.**

Inme se har ek ke saath ek shart lag sakti hai — *"customer 41 wala panna"*. Us shart ko WHERE kehte hain.

**Shart chhod do, aur ye daraz ke har panne par lag jata hai.**

- "Sheher Mumbai kar do" — *ek* customer ka? Ya **poore chalis hazaar** ka?
- "Ye panna phenk do" — ya **poori daraz khaali kar do**?

Na "pakka?" poochha jata hai. Na undo hai. Ek second se kam lagta hai.

Ye sach mein asli database barbaad karne ke sabse mashhoor tareekon mein se ek hai, aur lagbhag hamesha wo insaan hota hai jo agle pal shart type karne *hi wala* tha.

**Wo aadat jo bachati hai:** kuch badalne se pehle use *dekhne* ko maango. "Ye jin panno par lagega wo dikhao" poochhne par agar wahi ek panna aaye jo aapko chahiye tha, tabhi badlo.

**Yaad rakho:** shart nahi to sab kuch. Badalne se pehle dekho.`,
  },

  'sql-data-types-and-constraints': {
    simple: `**Think of a form with printed rules.**

Some boxes say **"required"**. Some say **"numbers only"**. Some say **"must be unique"**.

Those printed rules are called constraints, and the cabinet itself enforces them. Hand in a form breaking one and it comes straight back — no matter who you are.

**Why put the rules on the form instead of just being careful?**

Because "just be careful" fails. Not because people are careless, but because there are **many doors** into that cabinet: the website, the phone app, the admin panel, an import from a spreadsheet, someone typing directly at 11 at night.

Every one of those doors can forget the rule. The form cannot.

**Two rules worth knowing on day one.**

**Money needs its own kind of box.** The ordinary "number" box is slightly imprecise — it is designed for measuring, not counting rupees. Use it for money and you get amounts that are off by a fraction of a paisa, which nobody notices until the yearly accounts refuse to add up.

**Time needs to know which clock.** "3 o'clock" means nothing on its own. Three o'clock *where*? Store the moment, not the reading on one wall clock, or the day you get a customer in another country every old record becomes a guess.

**Remember:** put the rules on the form, because there are more doors than you think.`,
    simpleHi: `**Aisa form socho jis par niyam chhape hon.**

Kuch khaanon par likha hai **"zaroori"**. Kuch par **"sirf number"**. Kuch par **"alag hona chahiye"**.

Yahi chhape hue niyam constraints kehlate hain, aur almari khud unhe lagu karti hai. Niyam todne wala form jama karo aur wo seedha wapas aa jata hai — chahe aap koi bhi hon.

**Niyam form par kyun, bas dhyan se kaam kyun nahi?**

Kyunki "bas dhyan rakho" fail hota hai. Isliye nahi ki log laparwah hain, balki isliye ki us almari tak **kai darwaze** hain: website, phone app, admin panel, spreadsheet se import, aur raat 11 baje seedha type karta koi.

In darwazon mein se har ek niyam bhool sakta hai. Form nahi bhool sakta.

**Do niyam jo pehle din jaanne layak hain.**

**Paise ka apna alag khaana hota hai.** Aam "number" wala khaana thoda kaccha hai — wo naapne ke liye bana hai, rupaye ginne ke liye nahi. Paise ke liye use karo to raashi paise ke bhi kisi hisse se idhar-udhar hoti hai, jo kisi ko tab tak nahi dikhta jab tak saal ka hisaab milna band na ho jaye.

**Waqt ko pata hona chahiye kaunsi ghadi.** "Teen baje" akela kuch nahi kehta. *Kahan* ke teen baje? Wo pal jama karo, kisi ek deewar ghadi ka reading nahi, warna jis din doosre desh ka customer aayega us din har purana record andaza ban jayega.

**Yaad rakho:** niyam form par lagao, kyunki darwaze aapke andaze se zyada hain.`,
  },

  /* ─────────────────────────────── REST ─────────────────────────────── */

  'rest-what-is-an-api': {
    simple: `**Think of a restaurant.**

You are hungry. You do **not** walk into the kitchen, find the rice and start cooking. You sit down, look at a **menu**, tell a **waiter** what you want, and food comes back.

That menu is an API.

It tells you two things: what you are allowed to ask for, and what you will get. You never need to know how the kitchen works — and the kitchen can be completely rebuilt tomorrow without changing how you order.

**Why can the app not just go into the kitchen?**

Three reasons, and they are all serious:

1. **The keys.** To reach the food store directly you would need the store keys. Anything a phone app carries, anyone can read out of it. Now everybody has the keys.
2. **The rules.** "You may only see *your* orders" has to be decided by someone the customer cannot argue with. That is the waiter, not the customer.
3. **Change.** Move to a bigger kitchen and every customer would have to learn a new layout. With a menu in between, only the kitchen changes.

**What you send, in plain words**

- *What kind of thing* you want done — fetch, add, change, remove
- *Which thing* — order number 41
- *Who you are* — your membership card
- *The details* — two coffees

And what comes back: **did it work**, and **the thing itself**.

**Remember:** the app talks to the waiter. Never to the kitchen.`,
    simpleHi: `**Ek restaurant socho.**

Aapko bhookh lagi hai. Aap rasoi mein ghus kar chawal dhoondh kar khud **nahi** pakate. Aap baithte ho, **menu** dekhte ho, **waiter** ko batate ho ki kya chahiye, aur khana aa jata hai.

Wo menu hi API hai.

Wo do baatein batata hai: aap kya maang sakte ho, aur kya milega. Rasoi kaise chalti hai ye jaanne ki zaroorat hi nahi — aur rasoi kal poori badal jaye to bhi aapke order karne ka tareeka wahi rehta hai.

**App seedha rasoi mein kyun nahi ja sakti?**

Teen wajah, aur teeno gambhir hain:

1. **Chaabiyan.** Seedha bhandar tak jaane ke liye bhandar ki chaabi chahiye. Phone app jo bhi le kar chalti hai, use koi bhi usme se padh sakta hai. Ab chaabiyan sabke paas hain.
2. **Niyam.** "Aap sirf *apne* orders dekh sakte ho" ye faisla kisi aise ka hona chahiye jisse customer behes na kar sake. Wo waiter hai, customer nahi.
3. **Badlav.** Badi rasoi mein jao aur har customer ko naya naksha seekhna padta. Beech mein menu ho to sirf rasoi badalti hai.

**Aap kya bhejte ho, saade shabdon mein**

- *Kis tarah ka kaam* karwana hai — laana, jodna, badalna, hataana
- *Kaunsi cheez* — order number 41
- *Aap kaun ho* — aapka membership card
- *Tafseel* — do coffee

Aur wapas kya aata hai: **kaam hua ya nahi**, aur **khud wo cheez**.

**Yaad rakho:** app waiter se baat karti hai. Rasoi se kabhi nahi.`,
  },

  'rest-http-methods-and-status': {
    simple: `**Two lists, and both are shorter than they look.**

**What you can ask for**

- **GET** — *show me* something
- **POST** — *add* something new
- **PUT / PATCH** — *change* something (PUT replaces the whole thing, PATCH changes one part)
- **DELETE** — *remove* something

**One rule matters more than the rest:** "show me" must never change anything.

Sounds obvious. But people build a "show me" link that quietly deletes something, and then a program that was just checking links politely visits every one of them — and everything is gone. Nobody did anything wrong; the link lied about what it was.

**What comes back**

Every answer starts with a number, and the **first digit** tells you the whole story:

- **2** — it worked
- **3** — look somewhere else
- **4** — **you** asked for something wrong
- **5** — **I** broke

That is it. *Four is your fault, five is mine.*

You will meet a handful often: **200** fine · **201** created it · **400** your request made no sense · **401** I do not know who you are · **403** I know, and no · **404** no such thing · **500** I broke.

**The mistake that makes everything harder**

Saying "it worked" and then writing "it did not work" inside the answer.

Now nobody can tell success from failure without reading the whole reply — not the app, not the alarm system that was supposed to notice things breaking. Say it failed *in the number*, where everyone is already looking.

**Remember:** four is your fault, five is mine.`,
    simpleHi: `**Do list, aur dono dikhne se chhoti hain.**

**Aap kya maang sakte ho**

- **GET** — kuch *dikhao*
- **POST** — kuch naya *jodo*
- **PUT / PATCH** — kuch *badlo* (PUT poori cheez badal deta hai, PATCH ek hissa)
- **DELETE** — kuch *hatao*

**Ek niyam baaki sabse zyada matter karta hai:** "dikhao" se kabhi kuch badalna nahi chahiye.

Saaf baat lagti hai. Par log "dikhao" wala link bana dete hain jo chupchaap kuch mita deta hai, aur phir koi program jo bas links jaanch raha tha sharafat se har link khol deta hai — aur sab kuch gaya. Kisi ne kuch galat nahi kiya; link ne apne baare mein jhoot bola tha.

**Wapas kya aata hai**

Har jawab ek number se shuru hota hai, aur **pehla ank** poori kahani bata deta hai:

- **2** — chal gaya
- **3** — kahin aur dekho
- **4** — **aapne** kuch galat maanga
- **5** — **main** toota

Bas. *Chaar aapki galti, paanch meri.*

Kuch aapko baar-baar milenge: **200** theek · **201** bana diya · **400** aapki baat samajh nahi aayi · **401** mujhe nahi pata aap kaun ho · **403** pata hai, aur nahi · **404** aisi koi cheez nahi · **500** main toota.

**Wo galti jo sab mushkil kar deti hai**

"Chal gaya" kehna aur phir jawab ke andar likhna "nahi chala".

Ab poora jawab padhe bina koi nahi bata sakta ki safal hua ya nahi — na app, na wo alarm jo tootne par bajna tha. Fail hona *number mein* batao, jahan sabki nazar pehle se hai.

**Yaad rakho:** chaar aapki galti, paanch meri.`,
  },

  'rest-error-handling': {
    simple: `**Think of how a good shop tells you something went wrong.**

A bad shop says *"Error 0x8004005 at line 92 of billing.cpp"*. You learn nothing, and you have accidentally been shown the inside of their till system.

A good shop says *"That card was declined — try another one?"* Short, true, and it tells you what to do next.

**Three rules make every error message good.**

**1. Always the same shape.** If every problem is reported the same way, the app only has to learn one way of listening. Five different formats means five things to get right, so nobody gets any of them right.

**2. Give the machine a code and the person a sentence.** The app checks a short code that never changes. The human reads a sentence that can be reworded any time without breaking anything.

**3. Never show the insides.** When something breaks badly, the details — which file, which line, which database — are useful to *you* and are a gift to someone trying to break in. Write the full story in your own notebook. Show the visitor one calm sentence.

**And one that catches everybody**

When someone gets a password wrong, do **not** say "there is no account with that email".

You have just told a stranger which email addresses are real. That is a list they did not have a second ago. Say "email or password is wrong" — true, unhelpful to them, and perfectly clear to the actual owner.

**Remember:** loud in your notebook, quiet on the screen.`,
    simpleHi: `**Socho ki achhi dukaan galti kaise batati hai.**

Buri dukaan kehti hai *"Error 0x8004005 at line 92 of billing.cpp"*. Aapko kuch samajh nahi aata, aur galti se unke till system ka andar dikh gaya.

Achhi dukaan kehti hai *"Wo card mana ho gaya — doosra try karein?"* Chhota, sach, aur aage kya karna hai wo bhi bata deta hai.

**Teen niyam har error message ko achha bana dete hain.**

**1. Hamesha ek jaisa dhaancha.** Har samasya ek hi tarah batayi jaye to app ko sunne ka ek hi tareeka seekhna padta hai. Paanch alag format matlab paanch cheezein theek karni hain, isliye koi bhi theek nahi hoti.

**2. Machine ko code do, insaan ko vaakya.** App ek chhota code dekhti hai jo kabhi nahi badalta. Insaan wo vaakya padhta hai jise kabhi bhi badla ja sakta hai bina kuch tode.

**3. Andar ka kabhi mat dikhao.** Jab kuch buri tarah toote, tafseel — kaunsi file, kaunsi line, kaunsa database — *aapke* kaam ki hai aur sendh maarne wale ke liye tohfa. Poori kahani apni copy mein likho. Aane wale ko ek shaant vaakya dikhao.

**Aur ek jo sabko pakadta hai**

Jab kisi ka password galat ho, to ye **mat** kaho ki "is email ka koi account nahi hai".

Aapne abhi ek ajnabi ko bata diya ki kaunse email asli hain. Ek second pehle tak wo list uske paas thi hi nahi. Kaho "email ya password galat hai" — sach, uske kaam ka nahi, aur asli maalik ke liye bilkul saaf.

**Yaad rakho:** apni copy mein zor se, screen par chupchaap.`,
  },

  'rest-auth-in-apis': {
    simple: `**Think of a building with a security desk.**

Every time you walk in, you show your pass. **Every** time — even if you were here ten minutes ago. The desk has no memory of you at all.

That sounds rude, but it is what makes the building work: no one has to remember every visitor, and any guard can check any pass.

**Three kinds of pass**

- **A card you carry and show** — you decide when to take it out. Works everywhere, but if someone lifts it from your pocket, they are you.
- **A stamp on your hand** — shown automatically at every door. Convenient, and it means you might get walked through a door you did not intend to go through.
- **A contractor's badge** — belongs to a *company*, not a person. For deliveries and machines, never for staff.

**The mistake that lets people into rooms they should not enter**

The guard checks your pass and it is valid. So they let you into **room 41**.

But your pass never said room 41 was yours. It only said who you are.

Somebody types 41 instead of 40 — sometimes by accident, sometimes not — and walks into a stranger's room. The pass was real. Nobody checked whether the room was theirs.

**So there are always two questions, never one:**

1. *Who are you?* — the pass
2. *Is this yours?* — the room

Answering only the first is one of the most common real security holes there is.

**Remember:** a valid pass says who. It never says which.`,
    simpleHi: `**Aisi building socho jahan security desk hai.**

Har baar andar aate waqt aap apna pass dikhate ho. **Har** baar — chahe das minute pehle hi aaye the. Desk ko aapki koi yaad hai hi nahi.

Ye rukha lagta hai, par isi se building chalti hai: kisi ko har aane wale ko yaad rakhne ki zaroorat nahi, aur koi bhi guard koi bhi pass jaanch sakta hai.

**Teen tarah ke pass**

- **Jo card aap rakhte ho aur dikhate ho** — kab nikalna hai ye aap tay karte ho. Har jagah chalta hai, par kisi ne jeb se nikaal liya to wo aap hi hai.
- **Haath par lagi mohar** — har darwaze par khud dikh jati hai. Aasan, aur iska matlab ye bhi ki aap kisi aise darwaze se guzar sakte ho jahan jaana hi nahi tha.
- **Contractor ka badge** — kisi *company* ka hai, insaan ka nahi. Delivery aur machinon ke liye, staff ke liye kabhi nahi.

**Wo galti jisse log un kamron mein pahunch jate hain jahan nahi jaana chahiye**

Guard aapka pass jaanchta hai, wo sahi hai. To wo aapko **kamra 41** mein jaane deta hai.

Par aapke pass par kabhi nahi likha tha ki kamra 41 aapka hai. Us par sirf ye likha tha ki aap kaun ho.

Koi 40 ki jagah 41 type kar deta hai — kabhi galti se, kabhi nahi — aur kisi ajnabi ke kamre mein pahunch jata hai. Pass asli tha. Kamra uska hai ya nahi, ye kisi ne jaancha hi nahi.

**Isliye hamesha do sawaal hote hain, ek nahi:**

1. *Aap kaun ho?* — pass
2. *Kya ye aapka hai?* — kamra

Sirf pehle ka jawab dena sabse aam asli security ke chhedon mein se ek hai.

**Yaad rakho:** sahi pass batata hai kaun. Kaunsa kabhi nahi batata.`,
  },

  'rest-documentation-and-testing': {
    simple: `**Two questions about a machine you built.**

*"How is someone else supposed to use this?"* — that is documentation.
*"Does it still do what I said it does?"* — that is testing.

**On the instructions**

Instructions written by hand, next to the machine, go **out of date within a month**. Someone changes a button and forgets the sheet.

And out-of-date instructions are **worse than none at all** — because people trust them. No instructions and I ask you. Wrong instructions and I confidently build the wrong thing.

So: have the machine describe itself. If the instructions come out of the machine, they cannot disagree with it.

**On the checks**

You could test the tiny pieces — does this one gear turn? Useful, and fast.

But the things that actually break are almost never a broken gear. They are:

- a lever nobody connected
- a lock fitted on the wrong side of the door
- a slot that changed shape, so the thing that plugs into it no longer fits

So the checks worth having are the ones that use the machine **the way a real person does** — put something in one end, see what comes out.

**The two checks people forget**

- Check that things **do not** come out that should not — no keys, no insides, no other people's paperwork.
- Check that a **stranger genuinely cannot** open your drawer. That one check is worth more than ten checks of a working button.

**Remember:** let the machine write its own instructions, and test it the way people actually use it.`,
    simpleHi: `**Apni banayi machine ke baare mein do sawaal.**

*"Koi doosra ise kaise use karega?"* — ye documentation hai.
*"Kya ye ab bhi wahi karti hai jo maine kaha tha?"* — ye testing hai.

**Nirdeshon ke baare mein**

Haath se likhe nirdesh, machine ke bagal mein, **mahine bhar mein purane** ho jate hain. Koi button badal deta hai aur parcha bhool jata hai.

Aur purane nirdesh **na hone se bhi bure** hain — kyunki log un par bharosa karte hain. Nirdesh na ho to main aapse poochh lunga. Galat nirdesh ho to main poore bharose ke saath galat cheez bana dunga.

Isliye: machine se khud apna hulia likhwao. Nirdesh machine se hi nikle to wo machine se alag ho hi nahi sakte.

**Jaanchon ke baare mein**

Aap chhote hisse jaanch sakte ho — kya ye ek gear ghoomta hai? Kaam ka, aur tez.

Par sach mein toot ta kya hai, wo lagbhag kabhi toota gear nahi hota. Wo hote hain:

- ek lever jise kisi ne joda hi nahi
- darwaze ke galat taraf laga taala
- ek khaana jiski shakal badal gayi, isliye usme lagne wali cheez ab fit hi nahi hoti

Isliye rakhne layak jaanch wo hai jo machine ko **waise use kare jaise asli insaan karta hai** — ek sire se kuch daalo, dekho doosre se kya nikalta hai.

**Do jaanch jo log bhool jate hain**

- Jaancho ki wo cheezein **na nikle** jo nahi nikalni chahiye — na chaabiyan, na andar ka, na doosron ke kagaz.
- Jaancho ki koi **ajnabi sach mein** aapki daraz na khol sake. Wo ek jaanch chalte hue button ki das jaanchon se zyada keemti hai.

**Yaad rakho:** machine se uske apne nirdesh likhwao, aur use waise jaancho jaise log sach mein use karte hain.`,
  },

  /* ─────────────────────────────── Auth ─────────────────────────────── */

  'auth-what-is-authentication': {
    simple: `**Two words that look alike and are not.**

At an airport:

- Your **passport** proves *who you are*.
- Your **boarding pass** says *where you may go* — seat 14C. Not the cockpit.

The passport is authentication. The boarding pass is authorisation.

Having a real passport does not let you into the cockpit. **Proving who you are is not permission.** Those are two separate checks, and doing only the first is a security hole, not a shortcut.

**How logging in actually works**

1. You type your password
2. The shop **scrambles** it
3. The shop compares that scramble with the scramble it stored when you signed up
4. Same? Then it hands you a pass to carry
5. From then on, you show the pass — not the password

Notice step 2. The shop **never keeps your actual password.** It keeps the scramble. So even if someone steals the shop's entire notebook, your password is not in it.

Scrambling only works one way. You can turn a password into a scramble; you cannot turn a scramble back into a password.

**One small thing that matters a lot**

If you get your password wrong, a good shop says *"email or password is wrong"*.

It does **not** say *"that email is not registered"* — because that tells a stranger which addresses are real, and they were only guessing.

**Remember:** passport says who. Boarding pass says where. You need both.`,
    simpleHi: `**Do shabd jo ek jaise dikhte hain aur hain nahi.**

Airport par:

- Aapka **passport** sabit karta hai *aap kaun ho*.
- Aapka **boarding pass** batata hai *aap kahan ja sakte ho* — seat 14C. Cockpit nahi.

Passport authentication hai. Boarding pass authorisation.

Asli passport hone se cockpit nahi khulta. **Ye sabit karna ki aap kaun ho, ijazat nahi hai.** Ye do alag jaanch hain, aur sirf pehli karna security ka chhed hai, shortcut nahi.

**Login sach mein kaise hota hai**

1. Aap password type karte ho
2. Dukaan use **ghol deti hai**
3. Dukaan us ghole hue ko us ghole hue se milati hai jo sign up ke waqt jama kiya tha
4. Ek jaisa? To wo aapko rakhne ke liye ek pass de deti hai
5. Uske baad aap pass dikhate ho — password nahi

Doosra kadam dekho. Dukaan **aapka asli password kabhi nahi rakhti.** Wo ghola hua rakhti hai. Isliye koi dukaan ki poori copy chura le, to bhi usme aapka password hai hi nahi.

Ghol na sirf ek taraf chalta hai. Password se ghola hua ban sakta hai; ghole hue se password wapas nahi ban sakta.

**Ek chhoti baat jo bahut matter karti hai**

Password galat ho to achhi dukaan kehti hai *"email ya password galat hai"*.

Wo ye **nahi** kehti ki *"ye email registered hi nahi hai"* — kyunki isse ajnabi ko pata chal jata hai ki kaunse pate asli hain, aur wo to bas andaza laga raha tha.

**Yaad rakho:** passport batata hai kaun. Boarding pass batata hai kahan. Dono chahiye.`,
  },

  'auth-cookies-and-sessions': {
    simple: `**Think of a cloakroom at a wedding.**

You hand over your coat. They give you a **little numbered ticket** — 47.

The ticket is not your coat. It does not even describe your coat. Anyone reading it learns nothing except "47". But hand it back and you get your coat, because *they* wrote down what 47 means.

That ticket is a **cookie**. Their notebook is the **session**.

**Two nice things follow from this.**

**Your pocket does the work.** Once you have the ticket, you do not have to remember anything. It comes out at the counter automatically.

**They can cancel it.** Cross out entry 47 in the notebook and the ticket is worthless instantly. That is what logging out is — and it is proper, immediate and complete.

**And one thing to be careful about**

Because the ticket comes out **automatically**, it also comes out when you did not mean it to. Someone could get you to walk past the counter without realising, and the ticket does its job anyway.

That is why real tickets have rules printed on them: *this counter only*, *this building only*, *staff cannot photocopy it*. Boring rules, and they are the entire defence.

**One warning**

If the cloakroom keeps its notebook **in one person's head**, and that person goes home, everyone's tickets stop working. Write it in a book on the desk, where any attendant can read it.

**Remember:** the ticket is in your pocket. The notebook is theirs — and that is why they can cancel it.`,
    simpleHi: `**Shaadi ke cloakroom ki soch socho.**

Aap apna coat dete ho. Wo aapko ek **chhota number wala token** dete hain — 47.

Token aapka coat nahi hai. Wo aapke coat ka hulia bhi nahi batata. Use padh kar kisi ko "47" ke alawa kuch pata nahi chalta. Par wapas do aur coat mil jata hai, kyunki *unhone* likh rakha hai ki 47 ka matlab kya hai.

Wo token **cookie** hai. Unki copy **session** hai.

**Isse do achhi baatein nikalti hain.**

**Kaam aapki jeb karti hai.** Token mil jane ke baad aapko kuch yaad nahi rakhna. Counter par wo khud nikal aata hai.

**Wo use radd kar sakte hain.** Copy mein entry 47 kaat do aur token turant bekaar. Logout yahi hai — aur ye theek, turant aur poora hota hai.

**Aur ek baat jisme savdhani chahiye**

Token **khud** nikal aata hai, isliye wo tab bhi nikal aata hai jab aapka irada nahi tha. Koi aapko bina bataye counter ke paas se guzarwa sakta hai, aur token apna kaam kar hi deta hai.

Isiliye asli token par niyam chhape hote hain: *sirf yahi counter*, *sirf yahi building*, *staff iski photocopy nahi kar sakta*. Boring niyam, aur poora bachaav wahi hai.

**Ek chetavni**

Agar cloakroom apni copy **ek aadmi ke dimaag mein** rakhta hai, aur wo ghar chala jaye, to sabke token kaam karna band kar denge. Use mez par rakhi kitaab mein likho, jahan koi bhi attendant padh sake.

**Yaad rakho:** token aapki jeb mein hai. Copy unki hai — aur isiliye wo use radd kar sakte hain.`,
  },

  'auth-oauth-and-social-login': {
    simple: `**Think of a hotel key card.**

You check in. The front desk does **not** hand you the master key to the whole building.

They give you a card that opens **your room only**, works **only while you are staying**, and can be **switched off from the desk** at any moment — without changing a single lock.

That is the whole idea behind "Sign in with Google".

**What it replaces, and why that matters**

The bad old way: a website asks for your Google password. Now that website holds the key to your **entire** Google account — email, photos, everything. And the only way to take it back is to change your password everywhere.

The good way: the website sends you **to Google**. You log in on **Google's own page** — the website never sees you type anything. Google asks *"this site wants your name and email. Allow?"* You say yes. Google tells the website just those two things.

**Two details worth noticing**

**You leave and come back.** For a moment you are genuinely on Google's website, not theirs. That is the point — your password only ever goes to Google.

**They only get what you agreed to.** Name and email, not your inbox. And you can take it back later from Google's settings, without changing your password.

**The one thing that must be checked**

When you come back, the site has to make sure it is **you** returning, and not somebody who arranged that trip.

It does this by sending a secret scribble out with you and checking it is the same one on your return. Skip that, and someone can quietly log you into *their* account instead of yours.

**Remember:** a room key, not the master key. And your password only goes to the place that already has it.`,
    simpleHi: `**Hotel ka key card socho.**

Aap check in karte ho. Front desk aapko poori building ki master key **nahi** deta.

Wo aapko wo card deta hai jo **sirf aapka kamra** kholta hai, **sirf aapke rukne tak** chalta hai, aur **desk se kabhi bhi band** kiya ja sakta hai — bina ek bhi taala badle.

"Sign in with Google" ke peeche poora vichaar yahi hai.

**Ye kiski jagah leta hai, aur wo kyun matter karta hai**

Purana bura tareeka: koi website aapka Google password maangti hai. Ab us website ke paas aapke **poore** Google account ki chaabi hai — email, photos, sab kuch. Aur use wapas lene ka ek hi tareeka hai, har jagah password badalna.

Achha tareeka: website aapko **Google par** bhej deti hai. Aap **Google ke apne page** par login karte ho — website aapko kuch type karte dekhti hi nahi. Google poochhta hai *"ye site aapka naam aur email chahti hai. Ijazat?"* Aap haan kehte ho. Google website ko bas wo do cheezein batata hai.

**Do baatein dhyan dene layak**

**Aap jaate ho aur wapas aate ho.** Kuch pal ke liye aap sach mein Google ki website par hote ho, unki nahi. Yahi baat hai — aapka password sirf Google tak jata hai.

**Unhe wahi milta hai jiski aapne haan ki.** Naam aur email, aapka inbox nahi. Aur aap ise baad mein Google ki settings se wapas le sakte ho, bina password badle.

**Ek cheez jo jaanchni hi hai**

Wapas aate waqt site ko pakka karna hota hai ki laut ne wale **aap** ho, koi aisa nahi jisne ye poora chakkar goth a ho.

Iske liye wo aapke saath ek gupt nishaan bhejti hai aur wapasi par milati hai ki wahi hai. Ise chhod do, aur koi aapko chupchaap *apne* account mein login karwa sakta hai, aapke mein nahi.

**Yaad rakho:** kamre ki chaabi, master key nahi. Aur aapka password sirf wahin jata hai jiske paas wo pehle se hai.`,
  },

  'auth-authorisation-and-roles': {
    simple: `**You are inside the building. Now: which doors open?**

Three ways to decide, from simplest to fanciest:

**1. Is it yours?** Your locker, your bag, your order. Most doors in most buildings work exactly like this, and it is by far the most common answer.

**2. What is your job?** Visitor, staff, manager. The badge colour opens a set of doors. Simple, and enough for nearly everything.

**3. The full rulebook.** *"A manager may approve spending under ₹50,000, in their own department, on a working day."* Powerful — and now nobody is quite sure why a door did or did not open, which is its own kind of problem.

Start with "is it yours". Add badges when you need them. Only write the rulebook when badges genuinely cannot say what you mean.

**The hole this is really about**

Someone is properly signed in. Their pass is real. They look at the address bar, see **order 41**, and type **42**.

If nobody checks that order 42 belongs to them, they are now reading a stranger's order. Nothing was hacked. A number was changed.

This is one of the most common serious holes in real systems, and it **never shows up in testing** — because whoever tests it is looking at their own data, where the check passing and the check being absent look identical.

**Two habits that prevent it**

**Hiding a button is not a lock.** The door is still there. Anyone who knows the address can walk up to it directly. Check at the door, not in the signage.

**When in doubt, say no.** If your rules do not cover a situation, refuse it. A system that allows anything it does not recognise will meet something it does not recognise.

**Remember:** signed in is not allowed in. Always check whose it is.`,
    simpleHi: `**Aap building ke andar ho. Ab: kaunse darwaze khulenge?**

Tay karne ke teen tareeke, simple se lekar shandar tak:

**1. Kya ye aapka hai?** Aapka locker, aapka bag, aapka order. Zyadatar buildings ke zyadatar darwaze theek aise hi chalte hain, aur yahi sabse aam jawab hai.

**2. Aapka kaam kya hai?** Visitor, staff, manager. Badge ka rang darwazon ka ek set kholta hai. Simple, aur lagbhag har cheez ke liye kaafi.

**3. Poori niyam ki kitaab.** *"Manager apne hi department mein, kaam ke din, ₹50,000 se kam ka kharch manzoor kar sakta hai."* Shaktishali — aur ab kisi ko theek se pata nahi ki koi darwaza khula ya nahi khula to kyun, jo apne aap mein ek samasya hai.

"Kya ye aapka hai" se shuru karo. Zaroorat par badge jodo. Niyam ki kitaab tabhi likho jab badge sach mein wo baat keh hi na sakein.

**Asli chhed jiske baare mein ye sab hai**

Koi theek se signed in hai. Uska pass asli hai. Wo address bar dekhta hai, **order 41** dikhta hai, aur **42** type kar deta hai.

Agar koi ye nahi jaanchta ki order 42 uska hai, to ab wo kisi ajnabi ka order padh raha hai. Kuch hack nahi hua. Ek number badla gaya.

Ye asli systems ke sabse aam gambhir chhedon mein se ek hai, aur ye **testing mein kabhi nahi dikhta** — kyunki jo test karta hai wo apna hi data dekhta hai, jahan jaanch ka hona aur na hona bilkul ek jaisa dikhta hai.

**Do aadatein jo ise rokti hain**

**Button chhupana taala nahi hai.** Darwaza wahin hai. Jise pata hai wo seedha uske paas ja sakta hai. Darwaze par jaancho, board par nahi.

**Shak ho to mana karo.** Aapke niyam kisi haal ko nahi dhakte to use mana kar do. Jo system apni samajh se bahar ki har cheez allow karta hai, use kabhi na kabhi samajh se bahar ka kuch mil hi jayega.

**Yaad rakho:** signed in hona andar aane ki ijazat nahi hai. Hamesha jaancho ki cheez kiski hai.`,
  },

  /* ────────────────────────── System design ────────────────────────── */

  'sd-what-is-system-design': {
    simple: `**This is not a quiz. It is a conversation.**

Someone says *"design a photo-sharing app"* and waits. That short sentence is deliberately missing almost everything, and **noticing that is the first thing being tested.**

**What they are watching for**

1. Do you **ask** before you build?
2. Do you start **simple**, or immediately reach for the most complicated thing you have heard of?
3. Can you say what each choice **costs**?
4. Can you explain it so someone else could build it?

Notice that "did you name the right technology" is not on that list.

**The order that keeps you out of trouble**

**Ask.** Who uses this? How many? What must it actually do? What is *not* included?

**Count, out loud.** A thousand people doing ten things a day is ten thousand things a day. That is about **one every nine seconds**. Now you know you are not building anything dramatic — and you found that out in twenty seconds.

**Draw the boring version.** App → server → store. Genuinely start here.

**Ask what breaks first** as it gets bigger. Fix only that.

**Say the cost.** *"I would keep a copy of this so it loads faster. The copy can be a minute out of date — fine for a photo count, not fine for a bank balance."*

**The answer that sounds best**

*"It depends — on how many people, and on whether being slightly out of date is acceptable."*

That sounds like hedging. It is not. It is the honest answer, and the person who says it immediately looks more experienced than the person who says "use microservices" before asking a single question.

**The most common mistake**

Building for a million people when you were told there are a thousand.

That is not being careful. It is more expensive, it breaks more often, and every future change gets harder. Say what you would do **now**, and what would make you change your mind.

**Remember:** ask, count, start boring, then fix what actually breaks.`,
    simpleHi: `**Ye quiz nahi hai. Ye baat-cheet hai.**

Koi kehta hai *"ek photo-sharing app design karo"* aur ruk jata hai. Us chhote vaakya mein jaan-boojh kar lagbhag sab kuch chhoda gaya hai, aur **ye dekh lena hi pehli jaanch hai.**

**Wo kya dekh rahe hain**

1. Banane se pehle aap **poochhte** ho?
2. Aap **simple** shuru karte ho, ya turant sabse mushkil cheez utha lete ho jiska naam suna hai?
3. Aap bata sakte ho ki har chunaav ki **keemat** kya hai?
4. Aap ise itna saaf samjha sakte ho ki koi aur bana le?

Dhyan do "aapne sahi technology ka naam liya" us list mein hai hi nahi.

**Wo kram jo musibat se bachata hai**

**Poochho.** Ise kaun use karta hai? Kitne log? Ise karna kya hai? Kya *shamil nahi* hai?

**Bol kar gino.** Ek hazaar log din mein das kaam karein to das hazaar kaam roz. Yani lagbhag **har nau second mein ek**. Ab aapko pata hai ki koi dramatic cheez nahi ban rahi — aur ye bees second mein pata chal gaya.

**Boring roop banao.** App → server → store. Sach mein yahin se shuru karo.

**Poochho ki badhne par sabse pehle kya toot ega.** Sirf wahi theek karo.

**Keemat batao.** *"Main iski ek copy rakhunga taaki jaldi khule. Copy ek minute purani ho sakti hai — photo ki ginti ke liye theek, bank balance ke liye nahi."*

**Wo jawab jo sabse achha lagta hai**

*"Ye nirbhar karta hai — kitne log hain, aur thoda purana data manzoor hai ya nahi."*

Ye bachne wala jawab lagta hai. Hai nahi. Ye imaandar jawab hai, aur jo ise kehta hai wo us insaan se turant zyada tajurbedar lagta hai jo ek bhi sawaal poochhe bina "microservices use karo" keh deta hai.

**Sabse aam galti**

Das lakh logon ke liye banana jab aapko bataya gaya tha ki ek hazaar hain.

Ye savdhani nahi hai. Ye zyada mehnga hai, zyada toot ta hai, aur aage ka har badlav mushkil ho jata hai. Batao ki **abhi** kya karoge, aur kya hone par apna mann badloge.

**Yaad rakho:** poochho, gino, boring se shuru karo, phir jo sach mein toote use theek karo.`,
  },

  'sd-client-server-and-dns': {
    simple: `**What happens between pressing enter and seeing the page.**

Think of posting a letter to someone whose address you only half know.

**1. Look up the address.** You know the *name* — "example.com" — but the postal system needs a **number**. So you ask directory enquiries. They may already remember the answer, which is why this is usually instant.

**2. Open a line.** Before sending anything, the two sides say hello and agree they can hear each other. Three quick messages back and forth.

**3. Agree on a secret.** If it is a private conversation, both sides now agree on a code, and each checks the other is genuinely who they claim. This is the padlock in the address bar.

**4. Finally, ask.** *"Please send me the home page."*

**5. They do the work** — possibly handing it to whichever of their several staff is free.

**6. The answer comes back**, and your browser reads it, notices it also needs pictures and styling, and goes back for those too.

**Why anyone cares about steps 1 to 3**

**Nothing you actually wanted has moved yet.** All that hello-ing takes time, and it takes *more* time the further away the other side is.

That is the entire reason for keeping copies of websites in different countries — not because the copy is faster, but because it is **closer**, and every one of those back-and-forths gets shorter.

**Two words people mix up**

- **How long one letter takes** — mostly about distance
- **How much fits in one van** — about size

A huge van that takes three days is wonderful for furniture and terrible for conversation.

**Remember:** most of the wait is saying hello. That is why closer is faster.`,
    simpleHi: `**Enter dabane aur page dikhne ke beech kya hota hai.**

Aisa chitthi bhejna socho jiska pata aapko aadha hi pata hai.

**1. Pata dhoondho.** Aapko *naam* pata hai — "example.com" — par daak ko **number** chahiye. To aap directory se poochhte ho. Unhe shayad jawab pehle se yaad ho, isiliye ye aksar turant hota hai.

**2. Line kholo.** Kuch bhejne se pehle dono taraf hello kehte hain aur pakka karte hain ki ek doosre ko sun paa rahe hain. Teen chhote sandesh aage-peeche.

**3. Ek raaz par razi ho.** Baat nijee ho to dono taraf ab ek code par razi hote hain, aur har ek jaanchta hai ki doosra sach mein wahi hai jo keh raha hai. Address bar ka taala yahi hai.

**4. Aakhirkar, maango.** *"Kripya mujhe home page bhejo."*

**5. Wo kaam karte hain** — shayad apne kai logon mein se jo khaali ho use de kar.

**6. Jawab wapas aata hai**, aur aapka browser use padhta hai, dekhta hai ki tasveerein aur sajawat bhi chahiye, aur unke liye dobara jata hai.

**Kadam 1 se 3 ki parwah kyun**

**Jo aap sach mein chahte the wo abhi hila hi nahi.** Ye saara hello-hello waqt leta hai, aur doosra sira jitna door ho utna *zyada* waqt leta hai.

Websites ki copies alag deshon mein rakhne ki poori wajah yahi hai — isliye nahi ki copy tez hai, balki isliye ki wo **paas** hai, aur har aana-jaana chhota ho jata hai.

**Do shabd jo log ghulaate hain**

- **Ek chitthi mein kitna waqt** — zyadatar doori ki baat
- **Ek van mein kitna aata hai** — size ki baat

Badi van jo teen din leti hai, furniture ke liye shandar hai aur baat-cheet ke liye bekaar.

**Yaad rakho:** zyadatar intezaar hello kehne mein jata hai. Isiliye paas hona tez hona hai.`,
  },

  'sd-load-balancing': {
    simple: `**One counter, or several?**

A shop with one counter works fine until the queue reaches the door. Then you open more counters and put someone at the front pointing people to whichever is free.

That person is a **load balancer**.

They do something else, quietly, that matters more: if a counter stops working, they simply stop sending anyone to it. Customers never find out.

**The rule that makes several counters possible**

**Any counter must be able to serve any customer.**

That sounds obvious, and it is exactly what people get wrong.

If counter 1 wrote your order on a notepad **under its own desk**, then when you come back and get sent to counter 3, they have no idea who you are. You have to start again.

So anything worth remembering must go somewhere **all** the counters can see — a shared book on the back wall, not a private notepad.

**Same for anything you handed in.** Leave a parcel at counter 2 and it must go to the shared store room. Left under counter 2's desk, it may as well not exist.

**The tempting shortcut, and why it is a trap**

You could give each customer a card saying "always go to counter 1". Then the private notepad works.

But now counter 1 has a queue while counter 4 is idle. And when counter 1 closes for lunch, everyone assigned to it is stuck anyway. You did not solve the problem; you postponed it and made the queues uneven.

**One last thing**

The person at the front should check the counters are **actually serving**, not just that someone is standing there. A counter with a smiling attendant and no till is still useless — and customers sent to it will simply wait.

**Remember:** any counter, any customer. Nothing private under the desk.`,
    simpleHi: `**Ek counter, ya kai?**

Ek counter wali dukaan tab tak theek hai jab tak line darwaze tak na pahunch jaye. Phir aap aur counter kholte ho aur aage ek aadmi khada karte ho jo logon ko batata hai ki kaunsa khaali hai.

Wo aadmi **load balancer** hai.

Wo chupchaap ek aur kaam karta hai jo zyada matter karta hai: koi counter band ho jaye to wo bas usme kisi ko bhejna band kar deta hai. Customers ko pata bhi nahi chalta.

**Wo niyam jisse kai counter mumkin hote hain**

**Koi bhi counter kisi bhi customer ko sambhal sake.**

Ye saaf baat lagti hai, aur log theek yahi galat karte hain.

Agar counter 1 ne aapka order **apni hi mez ke neeche** rakhi copy mein likha, to jab aap wapas aa kar counter 3 par bheje jate ho, unhe pata hi nahi aap kaun ho. Aapko phir se shuru karna padta hai.

Isliye jo bhi yaad rakhne layak hai wo wahan jaye jahan **saare** counter dekh sakein — peechhe deewar par tangi saanjhi kitaab mein, kisi ki nijee copy mein nahi.

**Jo aapne jama kiya uske liye bhi wahi.** Counter 2 par parcel chhodo to wo saanjhe store room mein jana chahiye. Counter 2 ki mez ke neeche pada hai to wo hone na hone barabar hai.

**Lubhavana shortcut, aur wo trap kyun hai**

Aap har customer ko ek card de sakte ho jis par likha ho "hamesha counter 1 par jao". Phir nijee copy chal jayegi.

Par ab counter 1 par line hai jabki counter 4 khaali baitha hai. Aur counter 1 khaane ke liye band ho to us par lage sab log waise bhi phanse hain. Aapne samasya hal nahi ki; use taal diya aur lines asamaan kar di.

**Ek aakhri baat**

Aage khade aadmi ko ye jaanchna chahiye ki counter **sach mein kaam kar rahe hain**, sirf ye nahi ki wahan koi khada hai. Muskurate attendant wala counter jiske paas till hi na ho, phir bhi bekaar hai — aur wahan bheje gaye customers bas intezaar karte rahenge.

**Yaad rakho:** koi bhi counter, koi bhi customer. Mez ke neeche kuch nijee nahi.`,
  },

  'sd-choosing-a-database': {
    simple: `**Which cupboard should things go in?**

Almost always: **the ordinary one with labelled shelves.**

Most information has relationships — this order belongs to that customer, who lives at that address. Ordinary shelves with labels handle relationships beautifully, and they refuse to let you file an order under a customer who does not exist.

**When something else is right**

- Things whose **shape genuinely varies** → a box you can put anything in
- Things you need **very fast and do not mind losing** → a small tray on the desk (this one is a *helper*, not a replacement)
- **Searching through lots of text** → something built for searching

Using two different cupboards for two different jobs is normal. Using two different cupboards for the *same* job is a mess.

**When the shelves get busy, in this order**

1. **Add an index** — a contents page. An astonishing number of "we need something bigger" problems turn out to be a missing contents page. Check this first, always.
2. **Keep a copy of what everyone asks for** on the desk, so you stop walking to the cupboard.
3. **Make copies of the whole cupboard** for people who only want to *read*. Most people only read.
4. **Only then** consider splitting things across several cupboards.

**Why step 4 is last**

Once your things are in three cupboards, "find everything about this customer" means opening all three and combining the results by hand. And if you split them the wrong way, one cupboard ends up holding everything popular while the others sit empty — and you cannot easily undo it.

**The catch with step 3**

A copy is always slightly behind. Someone who writes something and looks at a copy a moment later may not see their own change — which looks exactly like a bug, and gets reported as one.

**Remember:** ordinary shelves, a contents page, a copy on the desk. Most people never need more.`,
    simpleHi: `**Cheezein kis almari mein rakhein?**

Lagbhag hamesha: **wahi aam almari jiski shelves par label lage hain.**

Zyadatar jaankari mein rishte hote hain — ye order us customer ka hai, jo us pate par rehta hai. Label wali aam shelves rishte bahut achhe se sambhalti hain, aur wo aisa order rakhne hi nahi deti jiska customer hai hi nahi.

**Kab kuch aur sahi hai**

- Aisi cheezein jinki **shakal sach mein badalti hai** → aisa dibba jisme kuch bhi daal sako
- Aisi cheezein jo **bahut jaldi chahiye aur kho jayein to chalega** → mez par rakhi chhoti tray (ye *madadgaar* hai, jagah lene wali nahi)
- **Bahut saare text mein dhoondhna** → dhoondhne ke liye bani cheez

Do alag kaam ke liye do alag almari use karna normal hai. *Ek hi* kaam ke liye do alag almari use karna gadbad hai.

**Shelves vyast ho jayein to, isi kram mein**

1. **Index lagao** — vishay-suchi. Hairaan karne wali baat ye ki "hume kuch bada chahiye" wali bahut si samasyaayein ek chhooti hui vishay-suchi nikalti hain. Ise pehle dekho, hamesha.
2. **Jo sab maangte hain uski copy** mez par rakho, taaki almari tak chalna band ho.
3. **Poori almari ki copies banao** un logon ke liye jo sirf *padhna* chahte hain. Zyadatar log sirf padhte hain.
4. **Tabhi** socho ki cheezein kai almariyon mein baanti jayein.

**Chautha kadam aakhir mein kyun hai**

Ek baar cheezein teen almariyon mein aa gayi, to "is customer ke baare mein sab kuch dhoondho" ka matlab hai teeno kholna aur natije haath se jodna. Aur agar aapne galat tareeke se baanta, to ek almari mein sab kuch lokpriya bhara reh jata hai aur baaki khaali baithi hain — aur ise aasani se palta nahi ja sakta.

**Teesre kadam ka pech**

Copy hamesha thodi peeche hoti hai. Jo koi kuch likh kar agle hi pal copy dekhe, use apna hi badlav na dikhe — aur ye bilkul bug jaisa lagta hai, aur bug ki tarah report bhi hota hai.

**Yaad rakho:** aam shelves, ek vishay-suchi, mez par ek copy. Zyadatar logon ko isse zyada kabhi nahi chahiye.`,
  },

  'sd-worked-example': {
    simple: `**Someone asks: "build the thing that turns a long link into a short one."**

Here is how to answer, and the order matters more than the answer.

**Step 1 — ask, do not draw**

How many links a day? Do people click them a lot more than they make them? Do we need to count clicks? Do links ever expire?

Say a million new links a day, and each one gets clicked about a hundred times.

**Step 2 — count. This is the step that decides everything.**

A million a day sounds enormous. Divide it by the seconds in a day and it is **about twelve a second**.

Twelve. A single ordinary computer does not notice twelve of anything.

Clicks are a hundred times that — around **twelve hundred a second**. Real, but still not exotic.

**You have just learned the most important fact in the whole problem, and it took ten seconds of arithmetic.** Anyone who starts describing a giant distributed system has skipped this step.

**Step 3 — draw the boring version**

Someone gives you a long link, you make up a short code, you write down the pair. Someone visits the short code, you look it up and send them on.

That is it. One list of pairs.

**Step 4 — what breaks first?**

Not the writing — twelve a second is nothing. It is the **looking up**, twelve hundred times a second.

And here is the lucky part: **once written, a pair never changes.** That makes it perfect to keep a copy of on the desk. Most links are boring and never clicked; a few are wildly popular. So the desk copy will answer nearly everything.

**Step 5 — say what it costs**

*"If I send people on in a way their browser remembers, repeat visits never reach me — cheaper, but I can no longer count clicks. Since counting was a requirement, I will accept the extra visits."*

**That sentence is the whole interview.** Not the diagram — the fact that you knew there was a choice, and said what you were giving up.

**Remember:** count before you design. The numbers usually say "smaller than you feared".`,
    simpleHi: `**Koi kehta hai: "wo cheez banao jo lambe link ko chhota bana de."**

Jawab aise dena chahiye, aur kram jawab se zyada matter karta hai.

**Kadam 1 — poochho, drawing mat banao**

Roz kitne link? Log inhe banane se kahin zyada click karte hain? Click ginne hain? Link kabhi khatam hote hain?

Maan lo roz das lakh naye link, aur har ek par lagbhag sau click.

**Kadam 2 — gino. Yahi kadam sab kuch tay karta hai.**

Das lakh roz bahut bada lagta hai. Ise din ke seconds se baanto aur ye **lagbhag baarah per second** nikalta hai.

Baarah. Ek aam computer ko kisi bhi cheez ke baarah ka pata bhi nahi chalta.

Clicks uske sau guna hain — lagbhag **baarah sau per second**. Asli, par phir bhi ajooba nahi.

**Aapne abhi poore sawaal ka sabse zaroori tathya jaan liya, aur ismein das second ka hisaab laga.** Jo koi seedha ek vishaal distributed system ka hulia batane lage, usne yahi kadam chhod diya.

**Kadam 3 — boring roop banao**

Koi aapko lamba link deta hai, aap ek chhota code bana lete ho, aur jodi likh lete ho. Koi chhota code kholta hai, aap use dhoondh kar aage bhej dete ho.

Bas. Jodiyon ki ek list.

**Kadam 4 — sabse pehle kya toot ega?**

Likhna nahi — baarah per second kuch bhi nahi. **Dhoondhna** toot ega, baarah sau baar per second.

Aur yahan achhi baat ye hai: **ek baar likhne ke baad jodi kabhi badalti hi nahi.** Isse wo mez par copy rakhne ke liye bilkul sahi ban jati hai. Zyadatar link boring hain aur kabhi click nahi hote; kuch bahut lokpriya hain. Isliye mez wali copy lagbhag har cheez ka jawab de degi.

**Kadam 5 — keemat batao**

*"Agar main logon ko aise aage bhejun ki unka browser yaad rakh le, to dobara aane wale mujh tak pahunchte hi nahi — sasta, par main click gin hi nahi paunga. Ginna zaroorat thi, isliye main extra visits manzoor karunga."*

**Wahi vaakya poora interview hai.** Diagram nahi — ye baat ki aapko pata tha ki ek chunaav hai, aur aapne bataya ki aap kya chhod rahe ho.

**Yaad rakho:** design se pehle gino. Numbers aksar kehte hain "jitna dara the utna bada nahi hai".`,
  },
};

export const TRICKS_FOUNDATIONS: Record<string, TopicTricks> = {
  /* ─────────────────────────────── SQL ─────────────────────────────── */

  'sql-what-is-a-database': {
    tricks: `### 🗄️ "Cabinet, drawer, sheet, box"

- Database = **cabinet**
- Table = **drawer**
- Row = **sheet**
- Column = **box on the sheet**

Four words, in order, smallest container to largest contents. Learn them once and the whole vocabulary stops being intimidating.

### 🔑 The two keys, in one line

- **Primary key** — *"which sheet is this?"*
- **Foreign key** — *"which sheet does this point at?"*

**Say it:** *"Primary is mine, foreign is theirs."*

### 📄 Why not a file?

Five failures, and it is worth being able to list them:

**"Two writers, big file, slow search, power cut, second server."**

Five beats. That is a complete answer to "why do we need a database" and it takes six seconds to say.

**Why this sticks:** the cabinet gives you a *spatial hierarchy*, and spatial memory is the oldest and most reliable system the brain has. You are not memorising four definitions — you are remembering one piece of furniture.`,
    tricksHi: `### 🗄️ "Almari, daraz, panna, khaana"

- Database = **almari**
- Table = **daraz**
- Row = **panna**
- Column = **panne par khaana**

Chaar shabd, kram se, bade se chhote tak. Ek baar seekh lo aur poori shabdavali darana band kar deti hai.

### 🔑 Do keys, ek line mein

- **Primary key** — *"ye kaunsa panna hai?"*
- **Foreign key** — *"ye kis panne par ishara karta hai?"*

**Bolo:** *"Primary mera, foreign unka."*

### 📄 File kyun nahi?

Paanch nakaamiyan, aur inhe ginana aana chahiye:

**"Do likhne wale, badi file, dheemi khoj, bijli gayi, doosra server."**

Paanch taal. "Database kyun chahiye" ka poora jawab yahi hai aur ise bolne mein chhah second lagte hain.

**Ye kyun tikta hai:** almari aapko *jagah wali sirhi* deti hai, aur jagah ki yaad dimaag ki sabse purani aur bharosemand system hai. Aap chaar definitions nahi rat rahe — aap ek furniture yaad rakh rahe ho.`,
  },

  'sql-insert-update-delete': {
    tricks: `### ☠️ "No WHERE means everywhere"

\`\`\`sql
UPDATE users SET city = 'Mumbai';   -- every user. All of them.
DELETE FROM users;                   -- gone.
\`\`\`

No confirmation. No undo. Milliseconds.

**Say it:** *"No WHERE, no mercy."*

Four words, and they should fire every single time your fingers type UPDATE or DELETE.

### 👀 The habit that has saved careers

**SELECT first. Then change the word.**

\`\`\`sql
SELECT * FROM users WHERE id = 7;   -- look at what comes back
DELETE   FROM users WHERE id = 7;   -- same line, one word changed
\`\`\`

Because the WHERE is already written and already proven, there is no window in which you could run a half-typed statement.

### 🧟 Soft delete

Do not remove the row — mark it dead with a \`deleted_at\`.

**The trade:** you can recover it, and now **every** read must remember \`WHERE deleted_at IS NULL\`. Forget it in one place and deleted things come back to life, which is a genuinely confusing bug.

**Say it:** *"Soft delete is cheap to write and expensive to remember."*

**Why this sticks:** "no WHERE, no mercy" rhymes and threatens. Threat plus rhyme is a strong combination, and this is a mistake with consequences severe enough to deserve it.`,
    tricksHi: `### ☠️ "WHERE nahi to sab kuch"

\`\`\`sql
UPDATE users SET city = 'Mumbai';   -- har user. Saare.
DELETE FROM users;                   -- gaye.
\`\`\`

Na pushti. Na undo. Milliseconds.

**Bolo:** *"WHERE nahi, to raham nahi."*

Chaar shabd, aur ye har us baar bajne chahiye jab ungliyan UPDATE ya DELETE type karein.

### 👀 Wo aadat jisne career bachaye hain

**Pehle SELECT. Phir shabd badlo.**

\`\`\`sql
SELECT * FROM users WHERE id = 7;   -- dekho kya aata hai
DELETE   FROM users WHERE id = 7;   -- wahi line, ek shabd badla
\`\`\`

WHERE pehle se likha aur sabit ho chuka hai, isliye aisa koi pal aata hi nahi jab aadhi-type ki statement chal jaye.

### 🧟 Soft delete

Row hatao mat — use \`deleted_at\` se dead mark karo.

**Sauda:** aap use wapas la sakte ho, aur ab **har** read ko \`WHERE deleted_at IS NULL\` yaad rakhna hoga. Ek jagah bhool jao aur mit i hui cheezein zinda ho jati hain, jo sach mein uljhane wala bug hai.

**Bolo:** *"Soft delete likhne mein sasta, yaad rakhne mein mehnga."*

**Ye kyun tikta hai:** "WHERE nahi to raham nahi" mein tuk bhi hai aur dhamki bhi. Tuk aur dhamki ka mel mazboot hai, aur ye galti itni gambhir hai ki isi layak hai.`,
  },

  'sql-data-types-and-constraints': {
    tricks: `### 💸 "Floats are for physics, not for rupees"

\`0.1 + 0.2\` is not \`0.3\` in binary floating point. Use \`NUMERIC\`, or store paise as a whole number.

The damage does not show up immediately. It shows up as a yearly report that is off by ₹4 and nobody can find where.

### ⏰ "TZ or regret"

\`TIMESTAMPTZ\`, always. Plain \`TIMESTAMP\` stores a clock reading with no idea which clock. Invisible until you have a second timezone, at which point every historical row is already ambiguous and cannot be fixed.

### 🚪 Why rules go in the database

**"More doors than you think."**

The API validates. But so does the admin panel, the import script, the migration, and the person on the console at 11pm. Every one of those can forget. The constraint cannot.

**Say it:** *"App for the message, database for the truth."*

### 🧨 ON DELETE — decide, do not default

- **CASCADE** — delete the parent, children vanish too
- **RESTRICT** — refuse while children exist
- **SET NULL** — keep the child, forget the parent

For anything financial, **RESTRICT**. Silently cascading away invoices is not a feature.

**Why this sticks:** each hook here attaches a *consequence*, not a rule — a report that will not balance, a row that cannot be fixed, an invoice that disappeared. Consequences survive; rules alone do not.`,
    tricksHi: `### 💸 "Float physics ke liye hain, rupaye ke liye nahi"

Binary floating point mein \`0.1 + 0.2\` \`0.3\` nahi hota. \`NUMERIC\` use karo, ya paise poore number mein rakho.

Nuksaan turant nahi dikhta. Wo saal ki us report mein dikhta hai jo ₹4 se nahi mil rahi aur kisi ko wajah nahi mil rahi.

### ⏰ "TZ ya pachhtava"

\`TIMESTAMPTZ\`, hamesha. Simple \`TIMESTAMP\` ghadi ka reading rakhta hai bina jaane kaunsi ghadi. Ye tab tak dikhta nahi jab tak doosra timezone na aaye, aur tab tak har purani row dhundhli ho chuki hoti hai aur theek nahi ho sakti.

### 🚪 Niyam database mein kyun

**"Darwaze aapke andaze se zyada hain."**

API jaanchti hai. Par admin panel bhi, import script bhi, migration bhi, aur raat 11 baje console par baitha insaan bhi. Inme se har ek bhool sakta hai. Constraint nahi bhool sakta.

**Bolo:** *"Message ke liye app, sach ke liye database."*

### 🧨 ON DELETE — tay karo, default mat maano

- **CASCADE** — maa-baap hatao, bachche bhi gaye
- **RESTRICT** — bachche hon to mana kar do
- **SET NULL** — bachcha rakho, maa-baap bhool jao

Paise se judi har cheez ke liye **RESTRICT**. Chupchaap invoices ka mit jana feature nahi hai.

**Ye kyun tikta hai:** yahan har hook ek *natija* jodta hai, niyam nahi — wo report jo milegi hi nahi, wo row jo theek nahi ho sakti, wo invoice jo gayab ho gayi. Natije bachte hain; akele niyam nahi.`,
  },

  /* ─────────────────────────────── REST ─────────────────────────────── */

  'rest-what-is-an-api': {
    tricks: `### 🍽️ "The menu, not the kitchen"

You order from a menu. You never walk into the kitchen. The kitchen can be rebuilt overnight and your order still works.

**Say it:** *"The app talks to the waiter, never the kitchen."*

That one line answers three separate interview questions: why the frontend cannot reach the database, what an API is *for*, and why an API is worth the extra layer.

### 🔑 Three reasons the kitchen is closed

**"Keys, rules, change."**

- **Keys** — database credentials in a browser are public
- **Rules** — "only your own orders" must be enforced where the user cannot edit it
- **Change** — swap the database and only the API changes

Three words. Say them in that order and you have a complete answer.

### 📦 The four parts of a request

**Method, URL, headers, body.** *What kind of action, on what, from whom, with what.*

**Why this sticks:** the restaurant is *already installed* in your memory — you have ordered food hundreds of times. Borrowing an existing, heavily-rehearsed structure costs almost nothing compared to building a new one.`,
    tricksHi: `### 🍽️ "Menu, rasoi nahi"

Aap menu se order karte ho. Rasoi mein kabhi nahi jaate. Rasoi raat bhar mein dobara ban jaye to bhi aapka order chalta hai.

**Bolo:** *"App waiter se baat karti hai, rasoi se kabhi nahi."*

Yahi ek line teen alag interview sawaalon ka jawab deti hai: frontend database tak kyun nahi pahunch sakta, API *kis liye* hai, aur ek extra parat ka faayda kya hai.

### 🔑 Rasoi band hone ki teen wajah

**"Chaabiyan, niyam, badlav."**

- **Chaabiyan** — browser mein database ke credentials sarvajanik hain
- **Niyam** — "sirf apne orders" wahan lagu ho jahan user badal na sake
- **Badlav** — database badlo aur sirf API badalti hai

Teen shabd. Isi kram mein bolo aur poora jawab tayaar hai.

### 📦 Request ke chaar hisse

**Method, URL, headers, body.** *Kis tarah ka kaam, kis par, kiski taraf se, kis cheez ke saath.*

**Ye kyun tikta hai:** restaurant aapki yaad mein *pehle se laga hua* hai — aap sau baar khana order kar chuke ho. Pehle se bani, bahut baar dohrayi gayi cheez udhaar lena nayi banane se lagbhag muft padta hai.`,
  },

  'rest-http-methods-and-status': {
    tricks: `### 🔢 "Four is your fault, five is mine"

- **2xx** worked · **3xx** look elsewhere · **4xx** your mistake · **5xx** my mistake

Six words, and they replace memorising forty codes. When you are deciding what to return, this is the only rule you need to reach for first.

### 🚪 401 vs 403 — the pair everyone swaps

- **401** — *"who are you?"* → the **door**
- **403** — *"I know who you are, and no."* → the **bouncer**

**Say it:** *"401 is the door, 403 is the bouncer."*

The two positions are spatially distinct, which is what stops them swapping in your memory.

### 🚫 "GET must not change anything"

An endpoint that deletes on a GET will eventually be triggered by a crawler, a prefetcher or a link checker that was only being helpful.

**Say it:** *"A crawler will find it."*

That is not a hypothetical — it is a well-documented way sites have deleted their own content.

### 😤 The lie that breaks everything downstream

Returning **200** with \`{"error": "..."}\` inside.

Now the client cannot tell success from failure without parsing, monitoring cannot count failures, and retries have nothing to trigger on.

**Say it:** *"Put the failure in the number."*

**Why this sticks:** "four is your fault, five is mine" is short, rhythmic and slightly accusatory. Mild confrontation is memorable in a way a neutral table of codes is not.`,
    tricksHi: `### 🔢 "Chaar aapki galti, paanch meri"

- **2xx** chala · **3xx** kahin aur dekho · **4xx** aapki galti · **5xx** meri galti

Chaar shabd, aur ye chalis codes ratne ki jagah le lete hain. Kya lautana hai ye tay karte waqt sabse pehle yahi niyam chahiye.

### 🚪 401 aur 403 — wo jodi jise sab badal dete hain

- **401** — *"aap kaun ho?"* → **darwaza**
- **403** — *"pata hai aap kaun ho, aur nahi."* → **bouncer**

**Bolo:** *"401 darwaza, 403 bouncer."*

Dono ki jagah alag hai, aur isi se ye yaad mein aapas mein nahi badalte.

### 🚫 "GET se kuch badalna nahi chahiye"

Jo endpoint GET par delete karta hai use kabhi na kabhi koi crawler, prefetcher ya link checker chala hi dega, jo bas madad kar raha tha.

**Bolo:** *"Crawler use dhoondh hi lega."*

Ye kalpna nahi hai — ise achhi tarah likha gaya hai ki sites ne apna hi content aise mitaya hai.

### 😤 Wo jhoot jo aage sab tod deta hai

Andar \`{"error": "..."}\` ke saath **200** lautana.

Ab client bina padhe safal aur asafal mein farak nahi kar sakta, monitoring failures gin nahi sakti, aur retry ke paas chalne ki wajah hi nahi.

**Bolo:** *"Nakaami number mein rakho."*

**Ye kyun tikta hai:** "chaar aapki galti, paanch meri" chhota, laydaar aur thoda ilzaam wala hai. Halki takraar us tarah yaad rehti hai jis tarah codes ki seedhi table nahi.`,
  },

  'rest-error-handling': {
    tricks: `### 📣 "Loud in the log, quiet in the response"

The server gets the stack trace, the request id and the user id. The visitor gets one calm sentence.

That single line decides almost every error-handling question correctly.

### 🏷️ "Code for the machine, message for the human"

- **code** — stable, never changes, safe to branch on
- **message** — reworded freely, never depended upon

Branch on a message and the first person to fix a typo breaks your client.

### 🕵️ The login rule

Never *"no account with that email"*. Always *"email or password is wrong"*.

The specific version hands an attacker a list of confirmed accounts they did not have a moment earlier.

**Say it:** *"Be vague about which half was wrong."*

### 4️⃣ The Express trap that catches everyone once

**Error middleware needs four arguments.**

\`(err, req, res, next)\` — write three and Express silently treats it as ordinary middleware, so errors never reach it and you spend an hour wondering why your handler never runs.

**Say it:** *"Four arguments or it is not an error handler."*

**Why this sticks:** the four-argument rule is *arbitrary and invisible* — nothing warns you. Arbitrary rules need a hook precisely because they cannot be re-derived from anything.`,
    tricksHi: `### 📣 "Log mein zor se, response mein chupchaap"

Server ko stack trace, request id aur user id milti hai. Aane wale ko ek shaant vaakya.

Yahi ek line error-handling ke lagbhag har sawaal ka sahi jawab de deti hai.

### 🏷️ "Machine ke liye code, insaan ke liye message"

- **code** — sthir, kabhi nahi badalta, is par shakha banana surakshit
- **message** — kabhi bhi badla ja sakta hai, is par nirbhar mat raho

Message par shakha banao aur pehla insaan jo typo theek karega wo aapka client tod dega.

### 🕵️ Login ka niyam

Kabhi *"is email ka account nahi"* nahi. Hamesha *"email ya password galat hai"*.

Khaas wala jawab hamlawar ko confirmed accounts ki wo list de deta hai jo ek pal pehle uske paas thi hi nahi.

**Bolo:** *"Kaunsa aadha galat tha, us par gol-mol raho."*

### 4️⃣ Express ka wo trap jo sabko ek baar pakadta hai

**Error middleware ko chaar argument chahiye.**

\`(err, req, res, next)\` — teen likho aur Express use chupchaap aam middleware maan leta hai, isliye errors us tak pahunchte hi nahi aur aap ek ghanta sochte ho ki handler chalta kyun nahi.

**Bolo:** *"Chaar argument, warna wo error handler nahi."*

**Ye kyun tikta hai:** chaar-argument wala niyam *bemaani aur adrishya* hai — koi chetavni nahi milti. Bemaani niyamon ko hook isliye chahiye kyunki unhe kisi cheez se dobara nikala hi nahi ja sakta.`,
  },

  'rest-auth-in-apis': {
    tricks: `### 🎫 "The pass says who. It never says which."

The single most useful sentence in API security.

A valid token proves **identity**. It does not prove that order 42 is yours. Someone edits the number in the URL, and if you only checked the token, they are reading a stranger's data.

**Say it:** *"Signed in is not allowed in."*

### 🔢 The attack, in one image

\`/orders/41\` → change to \`/orders/42\` → someone else's order.

Nothing was hacked. A digit was changed. It is called **IDOR**, and it is invisible in testing because testers look at their own data — where "the check works" and "there is no check" look identical.

### 🚫 "Never a token in a URL"

Query strings land in server logs, proxy logs, browser history and the \`Referer\` header sent to third parties.

**Say it:** *"URLs get written down."*

### 🍪 The storage trade-off, in one line

- **localStorage** — any XSS on your page can read it
- **httpOnly cookie** — scripts cannot read it, but it is sent automatically, which brings back CSRF

**Say it:** *"Pick your poison, then bring the antidote."* Cookie means you must also set \`SameSite\`.

**Why this sticks:** IDOR is *a single changed digit*. The smallness of the action against the size of the consequence is exactly the kind of mismatch the brain flags as worth keeping.`,
    tricksHi: `### 🎫 "Pass batata hai kaun. Kaunsa kabhi nahi."

API security ka sabse kaam ka vaakya.

Sahi token **pehchan** sabit karta hai. Ye nahi ki order 42 aapka hai. Koi URL mein number badal deta hai, aur agar aapne sirf token jaancha tha, to wo ajnabi ka data padh raha hai.

**Bolo:** *"Signed in hona andar aane ki ijazat nahi."*

### 🔢 Hamla, ek tasveer mein

\`/orders/41\` → badal kar \`/orders/42\` → kisi aur ka order.

Kuch hack nahi hua. Ek ank badla. Ise **IDOR** kehte hain, aur ye testing mein dikhta nahi kyunki tester apna hi data dekhte hain — jahan "jaanch chal rahi hai" aur "jaanch hai hi nahi" bilkul ek jaise dikhte hain.

### 🚫 "Token URL mein kabhi nahi"

Query strings server logs, proxy logs, browser history aur third parties ko jaate \`Referer\` header mein pahunch jati hain.

**Bolo:** *"URL likh liye jate hain."*

### 🍪 Storage ka sauda, ek line mein

- **localStorage** — aapke page par chalne wali koi bhi XSS ise padh sakti hai
- **httpOnly cookie** — scripts nahi padh sakti, par ye khud bhej di jati hai, jisse CSRF wapas aa jata hai

**Bolo:** *"Zeher chuno, phir uski dawa bhi lao."* Cookie chuni to \`SameSite\` bhi lagana hoga.

**Ye kyun tikta hai:** IDOR *ek badla hua ank* hai. Harkat ka chhota hona aur natije ka bada hona — yahi bemel dimaag rakhne layak mark karta hai.`,
  },

  'rest-documentation-and-testing': {
    tricks: `### 📖 "Generate the docs, do not write them"

Hand-written API docs are wrong within a month, and **wrong docs are worse than none** — people trust them and build against a contract you no longer honour.

**Say it:** *"Docs that can drift, will."*

If you already write validation schemas, generate the docs from those. One source, two outputs, and they cannot disagree.

### 🎯 Which tests actually pay

For an API, **integration tests** — a real request through the real routes.

Because production bugs are almost never "this function returns the wrong number". They are:

**"Route not mounted. Guard on the wrong side. Shape changed."**

Three failures, and unit tests with mocked boundaries pass straight through all three.

### 🕵️ The two assertions people forget

- **What must NOT appear** — no password hash, no stack trace, no internal ids
- **That a stranger genuinely cannot** read someone else's data

**Say it:** *"Test the door, not just the doorbell."*

One test proving an authorisation check works is worth ten testing a formatter.

### 📊 On coverage

100% coverage proves every line **ran**. It does not prove any line was **checked**. A test with no assertions gives full coverage and zero value.

**Why this sticks:** "route not mounted, guard on the wrong side, shape changed" is a *list of three real failures*, not an abstract argument for a test layer. Concrete failures are recalled; methodology arguments are not.`,
    tricksHi: `### 📖 "Docs banwao, likho mat"

Haath se likhi API docs mahine bhar mein galat ho jati hain, aur **galat docs na hone se buri hain** — log un par bharosa karke aise contract par code likhte hain jo aap ab nibhate hi nahi.

**Bolo:** *"Jo docs alag ho sakti hain, hongi."*

Agar aap validation schemas pehle se likhte ho, to docs unhi se banwao. Ek sach, do natije, aur ye alag ho hi nahi sakte.

### 🎯 Kaunse tests sach mein daam dete hain

API ke liye **integration tests** — asli routes se guzarti asli request.

Kyunki production ke bug lagbhag kabhi "ye function galat number lautata hai" nahi hote. Wo hote hain:

**"Route mount nahi hua. Guard galat taraf. Dhaancha badal gaya."**

Teen nakaamiyan, aur mocked boundaries wale unit tests teeno se seedhe nikal jate hain.

### 🕵️ Do jaanch jo log bhool jate hain

- **Kya nahi dikhna chahiye** — na password hash, na stack trace, na andar ki ids
- **Ki koi ajnabi sach mein** kisi aur ka data na padh sake

**Bolo:** *"Darwaza jaancho, sirf ghanti nahi."*

Ek test jo authorisation ki jaanch sabit kare, formatter ke das tests se zyada keemti hai.

### 📊 Coverage par

100% coverage sabit karta hai ki har line **chali**. Ye nahi ki koi line **jaanchi** gayi. Bina assertion wala test poora coverage deta hai aur zero keemat.

**Ye kyun tikta hai:** "route mount nahi hua, guard galat taraf, dhaancha badal gaya" *teen asli nakaamiyon ki list* hai, kisi test parat ke liye abstract dalil nahi. Thos nakaamiyan yaad rehti hain; methodology ki bahes nahi.`,
  },

  /* ─────────────────────────────── Auth ─────────────────────────────── */

  'auth-what-is-authentication': {
    tricks: `### 🛂 "Passport and boarding pass"

- **Passport** = authentication — *who are you*
- **Boarding pass** = authorisation — *where may you go*

A real passport does not get you into the cockpit. **Two checks, always.**

**Say it:** *"Passport says who, boarding pass says where."*

This is the cleanest way to keep authN and authZ apart, and it also carries the reason they must both happen.

### 🔒 "Hash, never store"

The server keeps a **scramble** of your password, not the password. Scrambling only goes one way.

So even a complete database leak does not hand over anyone's password.

**Say it:** *"One-way, always."*

Note **hashed, not encrypted** — encryption is reversible, which is precisely what you do not want here.

### 🤐 The vague-on-purpose rule

*"Email or password is wrong."* Never *"no such email"*.

The specific version converts a list of guessed emails into a list of confirmed accounts.

### 🔢 Two factors, not two passwords

Something you **know**, **have**, or **are**. Two passwords is the same factor twice — one leak opens both, so it is not 2FA at all.

**Why this sticks:** the airport is a *sequence you have physically walked through*. Procedural memory of a real routine is far more durable than a pair of similar-sounding definitions.`,
    tricksHi: `### 🛂 "Passport aur boarding pass"

- **Passport** = authentication — *aap kaun ho*
- **Boarding pass** = authorisation — *aap kahan ja sakte ho*

Asli passport se cockpit nahi khulta. **Do jaanch, hamesha.**

**Bolo:** *"Passport batata hai kaun, boarding pass batata hai kahan."*

authN aur authZ ko alag rakhne ka sabse saaf tareeka yahi hai, aur ye wajah bhi saath le kar chalta hai ki dono kyun zaroori hain.

### 🔒 "Hash karo, store kabhi nahi"

Server aapke password ka **ghola hua roop** rakhta hai, password nahi. Ghol na sirf ek taraf chalta hai.

Isliye poora database leak ho jaye to bhi kisi ka password kisi ko nahi milta.

**Bolo:** *"Ek tarfa, hamesha."*

Dhyan do **hashed, encrypted nahi** — encryption palta ja sakta hai, aur theek wahi yahan nahi chahiye.

### 🤐 Jaan-boojh kar gol-mol wala niyam

*"Email ya password galat hai."* Kabhi *"aisa koi email nahi"* nahi.

Khaas wala jawab andaze wali emails ki list ko confirmed accounts ki list bana deta hai.

### 🔢 Do factor, do password nahi

Jo aap **jaante** ho, **paas** hai, ya **ho**. Do password wahi factor do baar hai — ek leak dono khol deta hai, isliye wo 2FA hai hi nahi.

**Ye kyun tikta hai:** airport ek *aisa kram hai jise aap khud chal kar guzre ho*. Asli routine ki yaad milte-julte lagne wali do definitions se kahin zyada tikau hai.`,
  },

  'auth-cookies-and-sessions': {
    tricks: `### 🎟️ "Cloakroom ticket"

- The **ticket** in your pocket = the cookie. Just a number. Reading it tells you nothing.
- Their **notebook** = the session. It knows what number 47 means.

**The whole advantage in one line:** cross out entry 47 and the ticket is instantly worthless. **That is logout** — and it is exactly what a token cannot do.

**Say it:** *"They keep the notebook, so they can cancel it."*

### 🏷️ The four flags, as one sentence

**"Scripts can't read it, HTTPS only, same site only, and it expires."**

- \`httpOnly\` · \`secure\` · \`sameSite\` · \`maxAge\`

Miss \`httpOnly\` and any injected script reads the ticket. Miss \`sameSite\` and the automatic-attachment behaviour becomes CSRF.

### ⚠️ "Notebook in one head"

Keep sessions in one server's memory and the second server does not know your users. Restart it and everyone is logged out.

**Say it:** *"Put the notebook on the desk, not in someone's head."*

Shared storage — Redis, the database. This is the same statelessness rule that horizontal scaling depends on everywhere else, so learning it once pays twice.

**Why this sticks:** the ticket-and-notebook split is a *physical division of labour*, and it maps exactly onto client-side versus server-side. When the metaphor's structure matches the system's structure, you can rebuild the fact instead of recalling it.`,
    tricksHi: `### 🎟️ "Cloakroom ka token"

- Aapki jeb ka **token** = cookie. Bas ek number. Padh kar kuch pata nahi chalta.
- Unki **copy** = session. Use pata hai ki 47 ka matlab kya hai.

**Poora faayda ek line mein:** entry 47 kaat do aur token turant bekaar. **Yahi logout hai** — aur token theek yahi nahi kar sakta.

**Bolo:** *"Copy unke paas hai, isliye wo radd kar sakte hain."*

### 🏷️ Chaar flags, ek vaakya mein

**"Scripts padh nahi sakti, sirf HTTPS, sirf yahi site, aur ye khatam hoti hai."**

- \`httpOnly\` · \`secure\` · \`sameSite\` · \`maxAge\`

\`httpOnly\` chhoot gaya to page par aayi koi bhi script token padh legi. \`sameSite\` chhoot gaya to khud lag jane wala bartaav CSRF ban jata hai.

### ⚠️ "Copy ek dimaag mein"

Sessions ek server ki memory mein rakho aur doosre server ko aapke users ka pata hi nahi. Use restart karo aur sabka logout ho gaya.

**Bolo:** *"Copy mez par rakho, kisi ke dimaag mein nahi."*

Saanjha storage — Redis, database. Yahi statelessness wala niyam har jagah horizontal scaling chalata hai, isliye ek baar seekhna do baar daam deta hai.

**Ye kyun tikta hai:** token aur copy ka batwara *kaam ka sharirik batwara* hai, aur wo bilkul client-side aur server-side par baith ta hai. Jab upma ka dhaancha system ke dhanche se milta hai, to baat yaad karne ki jagah dobara bana li jati hai.`,
  },

  'auth-oauth-and-social-login': {
    tricks: `### 🏨 "Hotel key card, not the master key"

The desk gives you a card for **your room**, for **your stay**, cancellable **from the desk** without changing any locks.

That is exactly what OAuth grants: **limited, time-bound, revocable** access — instead of your password, which is unlimited, permanent and revocable only by changing it everywhere.

**Say it:** *"A room key, not the master key."*

### 🚶 "You leave and come back"

The key move: the site **sends you to Google**. You type your password on **Google's page**. The site never sees it.

**Say it:** *"Your password only goes where it already lives."*

### 🎲 The check that is not optional

The **state** parameter — a random value sent out and verified on return.

Without it, an attacker can start a login flow and trick you into finishing it, so you end up signed into **their** account. That is CSRF against login itself, and it is easy to leave out because everything works fine in testing.

**Say it:** *"Send a scribble, check the scribble."*

### ✉️ Never trust an unverified email

Some providers return emails they have not verified. Matching an existing account on one hands that account over.

**Why this sticks:** the hotel card carries **three properties at once** — limited scope, limited time, revocable — and you already know all three from real life. One object, three facts, no extra storage.`,
    tricksHi: `### 🏨 "Hotel ka key card, master key nahi"

Desk aapko **aapke kamre** ka card deta hai, **aapke rukne tak**, aur **desk se** radd ho sakta hai bina koi taala badle.

OAuth theek yahi deta hai: **seemit, samay tak, wapas liya ja sakne wala** access — aapke password ki jagah, jo asimit hai, hamesha ka hai, aur sirf har jagah badal kar wapas liya ja sakta hai.

**Bolo:** *"Kamre ki chaabi, master key nahi."*

### 🚶 "Aap jaate ho aur wapas aate ho"

Asli chaal: site aapko **Google par bhej deti hai**. Aap password **Google ke page** par type karte ho. Site use dekhti hi nahi.

**Bolo:** *"Aapka password sirf wahin jata hai jahan wo pehle se hai."*

### 🎲 Wo jaanch jo optional nahi hai

**state** parameter — ek random value jo bahar bheji jati hai aur wapasi par milayi jati hai.

Iske bina hamlawar login flow shuru karke aapse poora karwa sakta hai, aur aap **uske** account mein pahunch jate ho. Ye login par hi CSRF hai, aur ise chhodna aasan hai kyunki testing mein sab theek chalta hai.

**Bolo:** *"Nishaan bhejo, nishaan milao."*

### ✉️ Bina verify kiye email par bharosa nahi

Kuch providers wo email dete hain jo unhone verify nahi kiya. Us par purana account mila dena wo account de dena hai.

**Ye kyun tikta hai:** hotel card **ek saath teen khoobiyan** rakhta hai — seemit dayra, seemit samay, radd ho sakta hai — aur teeno aap asli zindagi se pehle se jaante ho. Ek cheez, teen baatein, koi extra jagah nahi.`,
  },

  'auth-authorisation-and-roles': {
    tricks: `### 🚪 "Signed in is not allowed in"

Three ways to decide what someone may do, simplest first:

1. **Is it yours?** — ownership. Covers most endpoints, and is the check most often missing.
2. **What is your role?** — RBAC. Enough for nearly everything else.
3. **The full rulebook** — ABAC. Powerful, and hard to debug.

**Say it:** *"Ownership, role, rulebook."* Three words, in the order you should adopt them.

### 🔢 The digit that opens someone else's door

\`/orders/41\` → \`/orders/42\`.

Real token. Real user. Someone else's data. **IDOR.**

It never shows up in testing, because testers look at their own records — where "the check works" and "there is no check" are indistinguishable.

**Say it:** *"Never trust an id from the client."*

### 🙈 "Hiding a button is not a lock"

The endpoint is still there and still callable with curl. UI is courtesy; the server is security.

### 🚫 "When in doubt, refuse"

Default deny, grant explicitly. A permission system that allows anything it does not recognise will eventually meet something it does not recognise.

**Say it:** *"Fail closed."*

### 🤫 404 over 403 for private things

Saying "forbidden" confirms the record exists. For something the user should not know about, "not found" is both safer and true from where they are standing.

**Why this sticks:** three of these hooks are *two or three words long*. Under interview pressure, short phrases survive; carefully-reasoned paragraphs do not.`,
    tricksHi: `### 🚪 "Signed in hona andar aane ki ijazat nahi"

Kaun kya kar sakta hai, ye tay karne ke teen tareeke, simple pehle:

1. **Kya ye aapka hai?** — maalikana. Zyadatar endpoints yahi chahte hain, aur yahi jaanch sabse zyada gayab hoti hai.
2. **Aapka role kya hai?** — RBAC. Baaki lagbhag har cheez ke liye kaafi.
3. **Poori niyam ki kitaab** — ABAC. Shaktishali, aur debug karna mushkil.

**Bolo:** *"Maalikana, role, kitaab."* Teen shabd, usi kram mein jisme apnane chahiye.

### 🔢 Wo ank jo kisi aur ka darwaza khol deta hai

\`/orders/41\` → \`/orders/42\`.

Asli token. Asli user. Kisi aur ka data. **IDOR.**

Ye testing mein kabhi nahi dikhta, kyunki tester apne hi records dekhte hain — jahan "jaanch chal rahi hai" aur "jaanch hai hi nahi" mein farak dikhta hi nahi.

**Bolo:** *"Client se aayi id par kabhi bharosa nahi."*

### 🙈 "Button chhupana taala nahi hai"

Endpoint wahin hai aur curl se ab bhi bulaya ja sakta hai. UI shishtachar hai; suraksha server hai.

### 🚫 "Shak ho to mana karo"

Default mana, ijazat saaf-saaf. Jo permission system apni samajh se bahar ki har cheez allow karta hai, use kabhi na kabhi samajh se bahar ka kuch mil hi jayega.

**Bolo:** *"Band rakh kar fail ho."*

### 🤫 Nijee cheezon ke liye 403 ki jagah 404

"Forbidden" kehna pushti kar deta hai ki record hai. Jiske baare mein user ko pata hi nahi hona chahiye, uske liye "not found" zyada surakshit bhi hai aur uski jagah se sach bhi.

**Ye kyun tikta hai:** inme se teen hook *do ya teen shabd ke* hain. Interview ke dabav mein chhote vaakya bachte hain; soch-samajh kar likhe paragraph nahi.`,
  },

  /* ────────────────────────── System design ────────────────────────── */

  'sd-what-is-system-design': {
    tricks: `### 🗣️ "It is a conversation, not a quiz"

The question is **deliberately** underspecified. Noticing that is the first thing being marked.

### 🪜 The five steps, as five words

**"Ask. Count. Draw. Break. Cost."**

1. **Ask** — who, how many, what is out of scope
2. **Count** — out loud, roughly
3. **Draw** — the boring version: client → server → database
4. **Break** — what fails first as it grows? Fix only that.
5. **Cost** — say what your choice gives up

Five words in order. Under pressure this is what you will actually be able to retrieve, and it is enough to run the whole interview.

### 🔢 Why counting is the step that matters

1M users × 10 actions/day ≈ **120 per second**.

That is small. Ten seconds of arithmetic tells you not to design a distributed system — and stops the most common failure in these interviews.

**Say it:** *"Do the maths before the architecture."*

### 💬 The phrase that signals seniority

**"It depends — on..."** followed by the actual dependency.

Answering instantly with "microservices and Kafka" sounds confident and scores badly, because it means you did not ask.

### ⚖️ Over-engineering is a failure, not caution

Designing for a million when told a thousand costs money, adds failure points, and slows every future change.

**Say it:** *"Build for now, and say what would change your mind."*

**Why this sticks:** "Ask, count, draw, break, cost" is a *five-beat sequence*. Sequences chunk into a single retrievable unit in a way that five separate pieces of advice never do.`,
    tricksHi: `### 🗣️ "Ye baat-cheet hai, quiz nahi"

Sawaal **jaan-boojh kar** adhoora hai. Ye dekh lena hi pehli jaanch hai.

### 🪜 Paanch kadam, paanch shabd

**"Poochho. Gino. Banao. Todo. Keemat."**

1. **Poochho** — kaun, kitne, kya scope se bahar
2. **Gino** — bol kar, mote-mote
3. **Banao** — boring roop: client → server → database
4. **Todo** — badhne par sabse pehle kya fail hoga? Sirf wahi theek karo.
5. **Keemat** — batao aapka chunaav kya chhod raha hai

Paanch shabd, kram mein. Dabav mein aapko yahi yaad aayega, aur poora interview chalane ke liye itna kaafi hai.

### 🔢 Ginna wahi kadam kyun hai jo matter karta hai

10 lakh users × 10 kaam/din ≈ **120 per second**.

Ye chhota hai. Das second ka hisaab bata deta hai ki distributed system design nahi karna — aur in interviews ki sabse aam nakaami rok deta hai.

### 💬 Wo vaakya jo tajurbe ka ishara deta hai

**"Ye nirbhar karta hai —"** aur uske baad asli nirbharta.

Turant "microservices aur Kafka" keh dena aatmavishwasi lagta hai aur number kam deta hai, kyunki iska matlab hai aapne poochha hi nahi.

### ⚖️ Over-engineering nakaami hai, savdhani nahi

Ek hazaar bataye jane par das lakh ke liye design karna paisa leta hai, tootne ki jagah badhata hai, aur aage ka har badlav dheema karta hai.

**Bolo:** *"Abhi ke liye banao, aur batao kya hone par mann badloge."*

**Ye kyun tikta hai:** "Poochho, gino, banao, todo, keemat" ek *paanch taal ka kram* hai. Kram ek hi yaad aane wali ikai ban jata hai, jo paanch alag salahein kabhi nahi banti.`,
  },

  'sd-client-server-and-dns': {
    tricks: `### 📬 "Address, hello, secret, ask"

Four steps before a single byte of your content moves:

1. **Address** — DNS turns a name into a number
2. **Hello** — TCP handshake opens the line
3. **Secret** — TLS agrees on encryption and checks identity
4. **Ask** — finally, the HTTP request

**Say it:** *"Address, hello, secret, ask."*

### 🌍 Why a CDN works

**Most of the wait is saying hello** — and every hello takes longer the further away the other side is.

A CDN does not make the server faster. It makes it **closer**, and shortens every single round trip.

**Say it:** *"Closer is faster, because hello is slow."*

That single sentence explains CDNs, edge computing and why keep-alive exists — three topics from one idea.

### 🚚 Latency vs bandwidth, in one image

- **Latency** — how long the van takes to arrive
- **Bandwidth** — how much fits in the van

A huge van that takes three days is wonderful for furniture and useless for conversation. They are independent, and confusing them leads to buying the wrong fix.

### ⏳ DNS is cached

That is why a DNS change does not take effect everywhere at once, and why lowering the TTL *before* a migration is a real technique rather than superstition.

**Why this sticks:** the four steps are *chronological*, and chronology is one of the structures the brain stores for free. You are remembering a journey, not a list.`,
    tricksHi: `### 📬 "Pata, hello, raaz, sawaal"

Aapke content ka ek byte hilne se pehle chaar kadam:

1. **Pata** — DNS naam ko number banata hai
2. **Hello** — TCP handshake line kholta hai
3. **Raaz** — TLS encryption par razi hota hai aur pehchan jaanchta hai
4. **Sawaal** — aakhirkar, HTTP request

**Bolo:** *"Pata, hello, raaz, sawaal."*

### 🌍 CDN chalta kyun hai

**Zyadatar intezaar hello kehne mein jata hai** — aur doosra sira jitna door ho, har hello utna lamba hota hai.

CDN server ko tez nahi karta. Wo use **paas** karta hai, aur har aana-jaana chhota kar deta hai.

**Bolo:** *"Paas hona tez hona hai, kyunki hello dheema hai."*

Yahi ek vaakya CDN, edge computing aur keep-alive teeno samjha deta hai — ek vichaar se teen topic.

### 🚚 Latency aur bandwidth, ek tasveer mein

- **Latency** — van pahunchne mein kitna waqt
- **Bandwidth** — van mein kitna aata hai

Badi van jo teen din leti hai, furniture ke liye shandar aur baat-cheet ke liye bekaar. Ye alag hain, aur inhe ghulane se galat hal khareeda jata hai.

### ⏳ DNS cache hota hai

Isiliye DNS ka badlav har jagah ek saath lagu nahi hota, aur isiliye migration se *pehle* TTL kam karna asli tareeka hai, koi tona nahi.

**Ye kyun tikta hai:** chaaron kadam *samay ke kram mein* hain, aur samay ka kram un dhanchon mein se ek hai jinhe dimaag muft mein jama karta hai. Aap list nahi, ek safar yaad rakh rahe ho.`,
  },

  'sd-load-balancing': {
    tricks: `### 🏪 "Any counter, any customer"

That is the whole requirement. If counter 1 keeps notes **under its own desk**, a customer sent to counter 3 has to start again.

So everything worth remembering goes on the **shared shelf**:

- Sessions → Redis
- Uploads → object storage
- Caches → shared, or accept each server has its own

**Say it:** *"Nothing private under the desk."*

### 📌 Sticky sessions are a postponement

Pinning a customer to one counter makes the private notepad work — and now that counter has a queue while another sits idle, and when it closes for lunch those customers are stuck anyway.

**Say it:** *"Sticky trades one problem for two."*

The genuine exception: Socket.IO's long-polling fallback sends several handshake requests that must reach the same server. There it is required, not a workaround.

### 🩺 "Standing there is not serving"

A health check that only proves the process is alive will happily keep sending traffic to a server whose database connection died.

But go too deep and one slow query pulls **every** server out of rotation at once.

**Say it:** *"Deep enough to catch a broken server, shallow enough not to remove them all."*

**Why this sticks:** "nothing private under the desk" is a *physical prohibition* you can picture. It is far easier to check your design against a picture than against the word "stateless".`,
    tricksHi: `### 🏪 "Koi bhi counter, koi bhi customer"

Poori shart yahi hai. Agar counter 1 **apni hi mez ke neeche** notes rakhta hai, to counter 3 par bheje gaye customer ko phir se shuru karna padega.

Isliye yaad rakhne layak har cheez **saanjhi shelf** par jati hai:

- Sessions → Redis
- Uploads → object storage
- Caches → saanjhe, ya maan lo har server ka apna hai

**Bolo:** *"Mez ke neeche kuch nijee nahi."*

### 📌 Sticky sessions taalna hai

Customer ko ek counter se baandh dene se nijee copy chal jati hai — aur ab us counter par line hai jabki doosra khaali baitha hai, aur khaane ke liye band ho to wo customers waise bhi phanse hain.

**Bolo:** *"Sticky ek samasya ke badle do deti hai."*

Asli apwaad: Socket.IO ka long-polling fallback kai handshake requests bhejta hai jinhe usi server par pahunchna hota hai. Wahan ye zaroori hai, jugaad nahi.

### 🩺 "Khada hona kaam karna nahi hai"

Jo health check sirf ye sabit kare ki process zinda hai, wo khushi se us server ko traffic bhejta rahega jiska database connection mar chuka hai.

Par bahut gehri jaanch ho to ek dheemi query **saare** servers ko ek saath bahar kar deti hai.

**Bolo:** *"Itni gehri ki toota server pakda jaye, itni halki ki sab bahar na ho jayein."*

**Ye kyun tikta hai:** "mez ke neeche kuch nijee nahi" ek *dikhne wali rok* hai. Apne design ko ek tasveer se milana "stateless" shabd se milane se kahin aasan hai.`,
  },

  'sd-choosing-a-database': {
    tricks: `### 🗄️ "Boring shelves, unless you have a reason"

Relational by default. Most data has relationships, and relational databases were built for exactly that.

**Say it:** *"Postgres until it hurts."*

Redis, Elasticsearch and the rest are **helpers alongside**, not replacements. Two stores for two jobs is normal; two stores for one job is a mess.

### 🪜 The scaling ladder, in order

**"Index. Cache. Replicas. Shard."**

Four words. And the honest observation that goes with them: **a genuinely large share of "we need to scale the database" is one missing index.** Check the query plan before anything else, every time.

### ⏱️ The replica bug that looks like a bug

A replica is always slightly behind. Someone writes, then immediately reads from a replica, and **does not see their own change**.

They will report it as a bug, because it looks exactly like one.

**Say it:** *"Read-after-write goes to the primary."*

### 🔪 Why sharding is last

Split across machines and cross-shard queries become slow or impossible, transactions get hard, and a bad shard key gives you one hot machine you cannot easily fix.

**Say it:** *"Sharding solves one problem and creates three."*

### ⚖️ "Eventually consistent" means correct soon, not wrong

Fine for a follower count. Unacceptable for a bank balance. The question is never "is staleness okay" but "**how** stale, and where".

**Why this sticks:** "Index, cache, replicas, shard" is *four beats in strict order*, and the order is the actual content — doing them out of order is precisely the mistake it prevents.`,
    tricksHi: `### 🗄️ "Boring shelves, jab tak wajah na ho"

Default relational. Zyadatar data mein rishte hote hain, aur relational databases theek isi ke liye bane the.

**Bolo:** *"Postgres, jab tak dard na ho."*

Redis, Elasticsearch waghera **saath dene wale** hain, jagah lene wale nahi. Do kaam ke liye do store normal hai; ek kaam ke liye do store gadbad hai.

### 🪜 Scaling ki seedhi, kram se

**"Index. Cache. Replicas. Shard."**

Chaar shabd. Aur inke saath imaandar baat: **"database scale karna padega" wale bahut se case ek chhoote hue index nikalte hain.** Har baar, kuch bhi karne se pehle query plan dekho.

### ⏱️ Replica ka wo bug jo bug jaisa dikhta hai

Replica hamesha thoda peeche hota hai. Koi likhta hai, phir turant replica se padhta hai, aur **apna hi badlav nahi dikhta**.

Wo ise bug ki tarah report karega, kyunki ye bilkul bug jaisa dikhta hai.

**Bolo:** *"Likhne ke baad ki read primary par."*

### 🔪 Sharding aakhir mein kyun

Machines mein baanto aur cross-shard queries dheemi ya namumkin ho jati hain, transactions mushkil ho jate hain, aur galat shard key ek garam machine de deti hai jise aasani se theek nahi kar sakte.

**Bolo:** *"Sharding ek samasya hal karta hai aur teen banata hai."*

### ⚖️ "Eventually consistent" matlab jaldi sahi, galat nahi

Follower count ke liye theek. Bank balance ke liye bilkul nahi. Sawaal kabhi "purana data chalega ya nahi" nahi hota, balki "**kitna** purana, aur kahan" hota hai.

**Ye kyun tikta hai:** "Index, cache, replicas, shard" *sakht kram mein chaar taal* hain, aur kram hi asli baat hai — inhe ulte kram mein karna theek wahi galti hai jise ye rokta hai.`,
  },

  'sd-worked-example': {
    tricks: `### 🔢 "Do the maths before the architecture"

1M links a day sounds enormous. Divide by 86,400 seconds and it is **twelve a second**.

Twelve. A laptop does not notice twelve of anything.

**That one division decides the entire design.** Anyone who starts describing a distributed system has skipped it.

**Say it:** *"Divide by 86,400 before you draw anything."*

### 📖 The shape of a good answer

**"Ask, count, draw boring, find the bottleneck, name the trade-off."**

For a URL shortener the bottleneck is **reads**, and the lucky part is that **a link never changes once written** — which is a cache's ideal case.

**Say it:** *"Write once, read forever — cache it."*

### 🎲 Random codes over sequential ids

Sequential means **guessable**, which leaks how many links exist and lets anyone enumerate them.

Random 7 characters gives 62⁷ ≈ 3.5 trillion. Collisions are rare — retry on the unique-constraint failure.

**Say it:** *"Sequential is countable."*

### ⚖️ The sentence that is actually the interview

*"301 is cached by the browser, so repeat visits never reach me — cheaper, but I lose click analytics. Analytics was a requirement, so I will use 302 and accept the traffic."*

Not the diagram. The fact that you **knew there was a choice** and said what you were giving up.

**Why this sticks:** "twelve a second" is a *shockingly small number* attached to a *deliberately large-sounding* requirement. That gap is what makes it stay, and it is the exact lesson the topic exists to teach.`,
    tricksHi: `### 🔢 "Architecture se pehle hisaab"

Roz 10 lakh link bahut bada lagta hai. 86,400 second se baanto aur ye **baarah per second** nikalta hai.

Baarah. Laptop ko kisi bhi cheez ke baarah ka pata nahi chalta.

**Wahi ek bhaag poora design tay kar deta hai.** Jo koi seedha distributed system ka hulia batane lage, usne ise chhod diya.

**Bolo:** *"Kuch banane se pehle 86,400 se baanto."*

### 📖 Achhe jawab ka dhaancha

**"Poochho, gino, boring banao, rukavat dhoondho, sauda batao."**

URL shortener mein rukavat **reads** hai, aur achhi baat ye ki **link ek baar likhne ke baad kabhi badalta hi nahi** — cache ke liye yahi sabse achha haal hai.

**Bolo:** *"Ek baar likho, hamesha padho — cache kar lo."*

### 🎲 Kramik id ki jagah random code

Kramik matlab **anuman layak**, jisse pata chal jata hai kitne link hain aur koi bhi unhe ek-ek karke khol sakta hai.

Random 7 akshar se 62⁷ ≈ 3.5 kharab. Takraar kam hoti hai — unique-constraint fail hone par dobara koshish.

**Bolo:** *"Kramik matlab gina ja sakta hai."*

### ⚖️ Wo vaakya jo asal mein poora interview hai

*"301 browser cache kar leta hai, isliye dobara aane wale mujh tak pahunchte hi nahi — sasta, par click analytics chali jati hai. Analytics zaroorat thi, isliye main 302 lunga aur extra traffic manzoor karunga."*

Diagram nahi. Ye baat ki aapko pata tha ki **ek chunaav hai** aur aapne bataya ki kya chhod rahe ho.

**Ye kyun tikta hai:** "baarah per second" ek *chaunkane wala chhota number* hai jo *jaan-boojh kar bada lagne wali* zaroorat se juda hai. Wahi faasla ise jama rakhta hai, aur yahi seekh is topic ke hone ki wajah hai.`,
  },
};
