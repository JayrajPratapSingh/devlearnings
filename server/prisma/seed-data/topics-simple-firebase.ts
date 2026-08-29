import type { SimpleExplanation } from './topics-simple';
import type { TopicTricks } from './topics-tricks';

/**
 * Beginner explanations and memory hooks for Firebase.
 *
 * The recurring image is a **shop with no counter staff**: customers reach the
 * stockroom themselves, so the only thing protecting anything is the rules
 * posted on the door. That single picture carries the security argument, the
 * "you did not remove the backend work" argument, and the reason rules must be
 * written first — which are the three things people get wrong.
 */

export const SIMPLE_FIREBASE: Record<string, SimpleExplanation> = {
  'firebase-what-is-it': {
    simple: `**A shop where customers walk into the stockroom themselves.**

Normally there is a counter. Customers ask, staff go and fetch, and staff decide what anyone is allowed to have.

Firebase removes the staff. Customers go straight to the shelves.

That is genuinely brilliant — nobody to hire, nobody to train, no queue — and it changes one thing completely.

**The rules on the door are now the only protection**

There is no one to say "you cannot take that". There is a notice on the stockroom door listing who may touch what, and **that notice is the entire security system**.

Get it wrong and everything is public. Not "harder to find" — anyone can walk in and take anything.

This is the most common way real Firebase projects leak data, and the reason is almost always that the notice was left for later.

**Three other things worth knowing before you start**

**You pay per item picked up.** Not by weight, not by the hour. A screen showing a hundred things costs a hundred pickups, every single time someone opens it. So *how* you fetch things becomes a spending decision.

**You cannot ask for two lists joined together.** Want orders *with* customer names? The stockroom will not do that. You store the customer name on the order too — duplicating on purpose.

**Leaving is hard.** The notice, the shelving system and the way you ask for things are all specific to this shop. Moving elsewhere means rebuilding, not repacking.

**So is it good?**

Yes — for small teams, for apps that need live updates, for anything working offline. It removes an enormous amount of work.

Just understand what it removed: it removed the **staff**, not the **decisions**. Someone still has to decide who can see what, how the shelves are arranged, and what it costs.

**Remember:** no counter staff. The notice on the door is your whole security system.`,
    simpleHi: `**Aisi dukaan jahan customers khud stockroom mein chale jate hain.**

Aam taur par ek counter hota hai. Customers maangte hain, staff jaakar laata hai, aur staff tay karta hai ki kise kya milega.

Firebase staff hata deta hai. Customers seedhe shelves tak jate hain.

Ye sach mein shandar hai — na kisi ko rakhna, na sikhana, na line — aur ye ek cheez poori tarah badal deta hai.

**Ab darwaze par laga notice hi ekmatra bachaav hai**

Koi nahi hai jo kahe "aap wo nahi le sakte". Stockroom ke darwaze par ek notice hai jisme likha hai kaun kya chhoo sakta hai, aur **wahi notice poora security system hai**.

Galat hua to sab kuch sarvajanik hai. "Dhoondhna mushkil" nahi — koi bhi andar aakar kuch bhi le ja sakta hai.

Asli Firebase projects mein data leak hone ka sabse aam tareeka yahi hai, aur wajah lagbhag hamesha ye hoti hai ki notice baad ke liye chhod diya gaya.

**Shuru karne se pehle teen aur baatein**

**Aap har uthayi hui cheez ka paisa dete ho.** Wazan se nahi, ghante se nahi. Sau cheezein dikhane wali screen har baar khulne par sau uthaav hai. Isliye aap cheezein *kaise* laate ho, ye kharch ka faisla ban jata hai.

**Aap do listein jodi hui nahi maang sakte.** Orders *ke saath* customer ke naam chahiye? Stockroom ye nahi karega. Aap customer ka naam order par bhi rakhte ho — jaan-boojh kar dohra kar.

**Nikalna mushkil hai.** Notice, shelf ka tareeka aur maangne ka tareeka — sab isi dukaan ke hain. Kahin aur jaane ka matlab hai dobara banana, saamaan pack karna nahi.

**To kya ye achha hai?**

Haan — chhoti teams ke liye, un apps ke liye jinhe live updates chahiye, offline chalne wali har cheez ke liye. Ye bahut sara kaam hata deta hai.

Bas ye samjho ki isne hataya kya: isne **staff** hataya, **faisle** nahi. Kisi ko ab bhi tay karna hai ki kaun kya dekh sakta hai, shelf kaise lage hain, aur kharch kitna hai.

**Yaad rakho:** counter par koi nahi. Darwaze ka notice hi aapka poora security system hai.`,
  },

  'firebase-auth': {
    simple: `**Someone else handles the "who are you" part.**

Sign-up, passwords, password resets, "sign in with Google", the six-digit code by text. All of it, in an afternoon, done properly.

That is a lot of fiddly, easy-to-get-wrong work you simply do not do.

**What you still have to do**

Firebase hands the person a **pass** proving who they are. It does not decide **what they may do** — that is still yours.

A real pass is not permission, the same way a real passport is not permission to enter the cockpit.

**Roles: the surprise**

You can write a label on someone's pass — "manager", "admin" — and the stockroom notice can read it.

Two things catch people:

**Only the trusted side can write those labels.** Never the customer. If a customer could label themselves "admin", the whole thing is theatre.

**And the label does not change instantly.** Passes are re-issued about once an hour. Make someone an admin and it may look like nothing happened — because they are still carrying the old pass. You can force a fresh one, and knowing that saves a confusing hour.

**The bug everyone ships once**

When your page loads, Firebase takes a moment to check whether someone is already signed in. During that moment it reports **"nobody"**.

Treat that as "logged out" and every visitor sees a flash of the login screen before being let in — including people who never logged out.

The fix is one line: keep a separate "still checking" state, and show nothing until the checking finishes.

**Remember:** it proves who. It never decides what. And "nobody" at the start means "still looking".`,
    simpleHi: `**"Aap kaun ho" wala hissa koi aur sambhal leta hai.**

Sign-up, passwords, password reset, "Google se sign in", message par chhah ank ka code. Ye sab, ek dopahar mein, theek se.

Ye bahut sara nakhrela, aasani se galat hone wala kaam hai jo aapko karna hi nahi padta.

**Aapko phir bhi kya karna hai**

Firebase insaan ko ek **pass** deta hai jo sabit karta hai ki wo kaun hai. Ye tay nahi karta ki **wo kya kar sakta hai** — wo ab bhi aapka kaam hai.

Asli pass ijazat nahi hai, theek waise hi jaise asli passport cockpit mein jaane ki ijazat nahi hai.

**Roles: chaunkane wali baat**

Aap kisi ke pass par label likh sakte ho — "manager", "admin" — aur stockroom ka notice use padh sakta hai.

Do baatein logon ko fasati hain:

**Wo label sirf bharosemand taraf likh sakti hai.** Customer kabhi nahi. Customer khud ko "admin" likh sake to poori cheez natak hai.

**Aur label turant nahi badalta.** Pass lagbhag har ghante dobara bante hain. Kisi ko admin banao aur lag sakta hai kuch hua hi nahi — kyunki wo abhi bhi purana pass le kar ghoom raha hai. Aap naya pass zabardasti bana sakte ho, aur ye jaanna ek uljhane wala ghanta bacha leta hai.

**Wo bug jo har koi ek baar ship karta hai**

Aapka page khulta hai to Firebase ko ye jaanchne mein ek pal lagta hai ki koi pehle se signed in hai ya nahi. Us pal mein wo batata hai **"koi nahi"**.

Use "logged out" maan lo aur har aane wale ko andar jaane se pehle login screen ki jhalak dikhti hai — un logon ko bhi jinhone kabhi logout kiya hi nahi.

Hal ek line ka hai: alag se "abhi jaanch chal rahi hai" wali haalat rakho, aur jaanch poori hone tak kuch mat dikhao.

**Yaad rakho:** ye sabit karta hai kaun. Ye kabhi tay nahi karta kya. Aur shuruaat mein "koi nahi" ka matlab hai "abhi dekh raha hoon".`,
  },

  'firestore-basics': {
    simple: `**A filing system, not a spreadsheet.**

- **Folders** hold **files**.
- A **file** is one record — one customer, one order.
- A file can have its **own folders** inside it. A customer's file can hold a folder of their orders.

That is it. Folders and files, alternating.

**Two things it does genuinely well**

**It tells you when something changes.** You do not check back. You ask to be told, and whenever anyone edits that file, your screen updates by itself. Chat apps, live dashboards — this is nearly free, and it is the main reason people choose it.

**It works with no internet.** It keeps a copy nearby. Read something and you get the local copy. Change something and the change waits, then goes through when you reconnect. On a phone this is enormously useful and you get it without asking.

**Three limits that shape everything you build**

**You cannot ask for two folders combined.** No "orders along with customer names". You fetch orders, and if you want the customer name it needs to already be written on the order.

**You pay per file picked up.** A list of a hundred is a hundred pickups. Every time. This is why "just load everything and filter it here" is an expensive habit.

**One file has a size limit**, and it can only be written to about **once a second**. So a single "total visitors" file that everybody increments becomes a traffic jam — and there is a standard trick for that specific problem.

**One thing that will surprise you**

Asking for something and getting **nothing back still costs you**. There is no free "check if it exists". Worth knowing before you write a loop that checks a thousand things.

**Remember:** folders and files, it tells you when things change, and every pickup is charged.`,
    simpleHi: `**File ka system, spreadsheet nahi.**

- **Folder** mein **files** hoti hain.
- **File** ek record hai — ek customer, ek order.
- File ke andar **apne folder** ho sakte hain. Customer ki file mein uske orders ka folder ho sakta hai.

Bas itna. Folder aur file, bari-bari.

**Do cheezein jo ye sach mein achhi karta hai**

**Kuch badle to ye bata deta hai.** Aapko dobara dekhne nahi jana. Aap batane ko keh dete ho, aur jab bhi koi wo file badalta hai, aapki screen khud update ho jati hai. Chat apps, live dashboards — ye lagbhag muft hai, aur log ise isi wajah se chunte hain.

**Ye bina internet ke chalta hai.** Ye paas mein ek copy rakhta hai. Kuch padho to local copy milti hai. Kuch badlo to badlav ruka rehta hai, aur wapas judte hi chala jata hai. Phone par ye bahut kaam ka hai aur ye bina maange milta hai.

**Teen seemayein jo aapke banaye har cheez ko aakaar deti hain**

**Aap do folder jode hue nahi maang sakte.** "Orders ke saath customer ke naam" nahi. Aap orders laate ho, aur customer ka naam chahiye to wo pehle se order par likha hona chahiye.

**Aap har uthayi file ka paisa dete ho.** Sau ki list sau uthaav hai. Har baar. Isiliye "sab load karke yahin chhaan lo" mehngi aadat hai.

**Ek file ki size ki seema hai**, aur us par lagbhag **ek second mein ek baar** hi likha ja sakta hai. Isliye ek hi "kul visitors" wali file jise sab badhate hain wo jam ban jati hai — aur us khaas samasya ka ek standard tareeka hai.

**Ek cheez jo aapko chaunkayegi**

Kuch maango aur **kuch na mile to bhi paisa lagta hai**. Muft mein "hai ya nahi" dekhna hota hi nahi. Hazaar cheezein jaanchne wala loop likhne se pehle ye jaanna theek hai.

**Yaad rakho:** folder aur file, badlav par ye bata deta hai, aur har uthaav ka paisa lagta hai.`,
  },

  'firestore-security-rules': {
    simple: `**This is the important one. If you read nothing else, read this.**

There is no one at the counter. Customers walk into the stockroom themselves.

So the **notice on the door** — who may touch what — is not *part* of your security. It **is** your security. All of it.

Write it badly and everything is public. Anyone who knows your shop exists can walk in and take the lot. This is not a warning about something that might happen; it is how real Firebase projects actually leak, and the cause is nearly always the same: the notice was left for later.

**Start by refusing everything**

Begin with "nobody may touch anything", then open specific things deliberately.

Start the other way — everything open, close things as you notice them — and you will not notice them all. Someone else will.

**The bit that confuses everyone**

You might expect the notice to quietly filter things. *"Only your own orders"* — so when someone asks for all orders, they get theirs, right?

**No.** The door checks whether **the whole request** is allowed. If someone asks for "all orders" and the notice says they may only have their own, the request is **refused entirely**. They do not get a filtered list. They get nothing.

They have to ask for *their* orders specifically, and then the notice confirms it.

This produces the classic *"my rules are right but nothing works"* confusion, and understanding it is the difference between rules that work and rules that were guessed at.

**Check what people write, not just what they read**

The notice can also say things like *"you may update your own file, but you may not change your own job title to manager"*.

There is no one else to check that. If the notice does not say it, anyone can promote themselves.

**And test it**

You can run the whole shop on your own machine and check: *can this person read that? Can that person read it too?* Both questions matter — especially the second, because a notice that is too generous passes every test where you only check that the right people get in.

**Remember:** the notice is the whole security system. Write it first, and test the refusals.`,
    simpleHi: `**Yahi zaroori wala hai. Aur kuch na padho to ye padho.**

Counter par koi nahi hai. Customers khud stockroom mein chale jate hain.

Isliye **darwaze ka notice** — kaun kya chhoo sakta hai — aapki security ka *hissa* nahi hai. Wahi aapki security **hai**. Poori.

Ise bura likho aur sab kuch sarvajanik hai. Jise pata hai ki aapki dukaan hai wo andar aakar sab utha sakta hai. Ye us cheez ki chetavni nahi hai jo ho sakti hai; asli Firebase projects sach mein aise hi leak hote hain, aur wajah lagbhag hamesha ek hi hai: notice baad ke liye chhod diya gaya.

**Sab kuch mana karke shuru karo**

"Koi kuch nahi chhoo sakta" se shuru karo, phir khaas cheezein soch kar kholo.

Ulta shuru karo — sab khula, jaise-jaise dikhe band karte jao — aur aapko sab dikhega nahi. Kisi aur ko dikhega.

**Wo hissa jo sabko uljhata hai**

Aap sochoge ki notice chupchaap chhaan dega. *"Sirf apne orders"* — to koi saare orders maange to use apne mil jayenge, na?

**Nahi.** Darwaza dekhta hai ki **poori guzarish** allowed hai ya nahi. Koi "saare orders" maange aur notice kehta ho ki sirf apne mil sakte hain, to guzarish **poori tarah mana** ho jati hai. Use chhaani hui list nahi milti. Use kuch nahi milta.

Use *apne* orders saaf-saaf maangne padte hain, aur phir notice uski pushti karta hai.

Isse classic *"mere rules theek hain par kuch chalta nahi"* wali uljhan aati hai, aur ise samajhna chalte rules aur andaze ke rules ka farak hai.

**Log kya likhte hain wo bhi jaancho, sirf kya padhte hain wo nahi**

Notice ye bhi keh sakta hai ki *"aap apni file badal sakte ho, par apna pad manager nahi kar sakte"*.

Ise jaanchne wala aur koi hai hi nahi. Notice na kahe to koi bhi khud ko promote kar sakta hai.

**Aur ise test karo**

Aap poori dukaan apni machine par chala kar jaanch sakte ho: *kya ye insaan wo padh sakta hai? Kya wo insaan bhi padh sakta hai?* Dono sawaal matter karte hain — khaaskar doosra, kyunki zyada udaar notice un saare tests pass kar leta hai jinme aap sirf ye dekhte ho ki sahi log andar aa rahe hain.

**Yaad rakho:** notice hi poora security system hai. Ise pehle likho, aur mana karne wale case test karo.`,
  },

  'firestore-queries': {
    simple: `**Asking for things has strict rules, and knowing them first saves redoing your shelves.**

The good news: asking for ten things costs the same whether the folder holds a thousand files or ten million. It never gets slower as you grow. That is genuinely unusual and genuinely valuable.

The price is that you can only ask in certain shapes.

**What you cannot ask for**

- **Two folders joined.** Not available. Ever.
- **"This OR that" across different fields.** Mostly not.
- **Two "greater than" conditions on different fields.** Only one field can have a range.
- **Search for words inside text.** You need a separate search service for that.

None of these are bugs. They are the trade for the speed never degrading.

**The habit that matters**

When a question is awkward to ask, the answer is almost never a cleverer question. **The answer is to change what you stored.**

Add a field. Write the customer name onto the order. Work out the total when it changes rather than when you display it.

That is genuinely backwards from a normal database, where you store things neatly and write clever questions. Here you store things awkwardly and ask simple questions. Getting comfortable with that inversion is most of learning Firestore.

**Two practical things**

**Always say how many you want.** A screen showing twenty items should ask for twenty. Without a limit you eventually ask for ten thousand and pay for all of them.

**Never fetch things just to count them.** There is a way to ask "how many?" that costs one operation instead of one per item. Fetching a folder to count its files is one of the most common expensive mistakes.

**And one that catches people at the worst moment:** some questions need to be registered in advance. It works on your machine, then fails in production because you registered it locally and never sent it up. Send it up.

**Remember:** change the data, not the question. And always say how many.`,
    simpleHi: `**Cheezein maangne ke sakht niyam hain, aur inhe pehle jaanna shelves dobara lagane se bacha leta hai.**

Achhi khabar: das cheezein maangne ka kharch wahi hai chahe folder mein hazaar files hon ya ek crore. Ye badhne par kabhi dheema nahi hota. Ye sach mein asaamanya aur sach mein keemti hai.

Keemat ye hai ki aap kuch khaas shakalon mein hi maang sakte ho.

**Aap kya nahi maang sakte**

- **Do folder jode hue.** Milta hi nahi. Kabhi nahi.
- **Alag fields par "ye YA wo".** Zyadatar nahi.
- **Alag fields par do "isse zyada" wali shartein.** Sirf ek field par range ho sakti hai.
- **Text ke andar shabd dhoondhna.** Uske liye alag search service chahiye.

Inme se koi bug nahi hai. Ye raftaar kabhi na girne ka sauda hai.

**Wo aadat jo matter karti hai**

Sawaal poochhna ajeeb lage to jawab lagbhag kabhi chalak sawaal nahi hota. **Jawab ye hai ki aapne jo rakha hai use badlo.**

Field jodo. Customer ka naam order par likho. Total dikhaate waqt nahi, badalte waqt nikalo.

Ye aam database se sach mein ulta hai, jahan aap cheezein saaf rakhte ho aur chalak sawaal likhte ho. Yahan aap cheezein ajeeb tareeke se rakhte ho aur simple sawaal poochhte ho. Is ulat ke saath sahaj ho jana hi Firestore seekhne ka zyadatar hissa hai.

**Do practical baatein**

**Hamesha batao kitne chahiye.** Bees cheezein dikhane wali screen bees maange. Bina seema ke aap kabhi na kabhi das hazaar maang loge aur sabka paisa doge.

**Sirf ginne ke liye cheezein kabhi mat laao.** "Kitne hain?" poochhne ka ek tareeka hai jo har cheez ke liye nahi, ek hi operation leta hai. Folder laa kar uski files ginna sabse aam mehngi galtiyon mein se ek hai.

**Aur ek jo sabse bure pal par pakadti hai:** kuch sawaal pehle se register karne padte hain. Wo aapki machine par chalta hai, phir production mein fail hota hai kyunki aapne use local mein register kiya aur upar bheja hi nahi. Upar bhejo.

**Yaad rakho:** data badlo, sawaal nahi. Aur hamesha batao kitne chahiye.`,
  },

  'firestore-data-modelling': {
    simple: `**Arrange your shelves around the screens you show, not the things you have.**

In a normal database you store each fact once, neatly, and assemble it when someone asks. Here you cannot assemble. So you store things **already assembled**.

The question stops being *"what are my things"* and becomes **"what does this screen need in one grab?"**

**Copying is the tool, not a shortcut**

A post that shows the author's name should **have the author's name written on it**. Not just their id.

Yes, that means the name is stored in two places. That is the intended design, not a compromise — it turns "fetch the posts, then fetch fifty authors" into "fetch the posts".

**The price:** when someone changes their name, the copies are old. Three choices, and picking on purpose matters:

- **Live with it.** A slightly out-of-date display name is usually fine, and this is the right answer more often than people expect.
- **Go and update the copies** automatically when the original changes.
- **Look it up fresh every time** — which defeats the entire point.

**The rule that prevents disasters**

**Never put a list that can grow forever inside one file.**

Comments inside a post looks perfectly fine with five. At fifty thousand it is dead — long before you hit the size limit, because *every single edit* rewrites the whole thing.

Growing lists go in their own folder underneath, which does not count towards the file's size and is not dragged along every time you open it.

**Counting is a special problem**

One file can only be written to about once a second. A single "views" counter that everybody increments will jam.

The standard answer: keep ten counters, add to a random one, and add them up when you display. Slightly odd, completely standard.

**The shift to internalise:** in a normal database, saving is simple and reading is clever. Here, **reading is simple and saving does the work.**

**Remember:** shelve for the screen. Copy on purpose. And never a list that grows forever inside one file.`,
    simpleHi: `**Shelves un screens ke hisaab se lagao jo aap dikhate ho, un cheezon ke hisaab se nahi jo aapke paas hain.**

Aam database mein aap har baat ek baar, saaf tareeke se rakhte ho aur maangne par jod dete ho. Yahan aap jod nahi sakte. Isliye aap cheezein **pehle se judi hui** rakhte ho.

Sawaal *"meri cheezein kya hain"* nahi rehta aur **"is screen ko ek uthaav mein kya chahiye?"** ban jata hai.

**Copy karna auzaar hai, shortcut nahi**

Jo post lekhak ka naam dikhati hai us par **lekhak ka naam likha hona chahiye**. Sirf uski id nahi.

Haan, iska matlab hai naam do jagah rakha hai. Yahi soch kar banaya gaya design hai, samjhauta nahi — isse "posts laao, phir pachas lekhak laao" bas "posts laao" ban jata hai.

**Keemat:** koi apna naam badle to copies purani ho jati hain. Teen chunaav, aur soch kar chunna matter karta hai:

- **Chalne do.** Thoda purana dikhne wala naam aksar theek hai, aur ye jawab logon ke andaze se zyada baar sahi hota hai.
- Asli badle to **copies apne aap update** karwa do.
- **Har baar taaza dhoondho** — jisse poora maqsad hi khatam ho jata hai.

**Wo niyam jo tabaahi rokta hai**

**Aisi list jo hamesha badh sakti ho, use ek file ke andar kabhi mat rakho.**

Post ke andar comments paanch par bilkul theek lagte hain. Pachas hazaar par wo mar chuka hai — size ki seema se bahut pehle, kyunki *har ek badlav* poori cheez dobara likhta hai.

Badhti listein neeche apne folder mein jati hain, jo file ke size mein nahi ginta aur har baar kholne par saath nahi aata.

**Ginna khaas samasya hai**

Ek file par lagbhag ek second mein ek baar hi likha ja sakta hai. Ek hi "views" counter jise sab badhate hain wo jam ho jayega.

Standard jawab: das counter rakho, kisi bhi ek mein jodo, aur dikhate waqt sab jod do. Thoda ajeeb, bilkul standard.

**Jo badlav andar utaarna hai:** aam database mein rakhna simple hai aur padhna chalak. Yahan **padhna simple hai aur kaam rakhna karta hai.**

**Yaad rakho:** screen ke liye shelf lagao. Jaan-boojh kar copy karo. Aur hamesha badhne wali list ek file ke andar kabhi nahi.`,
  },

  'firebase-realtime-and-offline': {
    simple: `**Two things that are genuinely excellent here.**

**It tells you when things change**

Normally you ask *"anything new?"* over and over. Here you say *"tell me when this changes"* — once — and your screen updates by itself whenever anyone edits it.

Chat, live scores, two people editing the same document. All of it, essentially free.

**But you must say when you are done listening**

When someone leaves the screen, tell it to stop. Forget, and it keeps sending updates for a screen nobody is looking at — **and you keep paying for them**.

This is the most common leak in Firebase apps, and it is one line to fix.

**And only listen where things actually change.** A settings page does not need a live feed. Paying for one is a habit worth breaking early.

**It works without internet**

Your change is applied **immediately on the phone**, before anyone confirms it. That is why the app feels instant — the tick appears at once, and the real save happens quietly afterwards.

If there is no signal, the change simply waits and goes through when there is.

**Three things that follow from that**

**"Saved" might only mean saved on the phone.** The confirmation you got may be from the local copy, not from the shop. Usually fine. Occasionally very much not — if it matters, wait for the real confirmation.

**If two people change the same thing offline, the last one to reconnect wins** and the other change quietly disappears. Nobody is told.

**And some things need the internet.** The careful "read it, check it, then change it" operation — booking the last seat, say — cannot work offline, because it needs to ask the shop what is true right now. Plan for that rather than discovering it.

**Remember:** say when you stop listening. And "saved" might just mean saved here.`,
    simpleHi: `**Do cheezein jo yahan sach mein shandar hain.**

**Kuch badle to ye bata deta hai**

Aam taur par aap baar-baar poochhte ho *"kuch naya?"*. Yahan aap ek baar kehte ho *"ye badle to batana"* — aur jab bhi koi use badalta hai, aapki screen khud update ho jati hai.

Chat, live score, ek hi document par do log. Ye sab, lagbhag muft.

**Par sunna band karna batana padta hai**

Koi screen se jaye to rukne ko kaho. Bhoolo, aur wo us screen ke updates bhejta rahega jise koi dekh hi nahi raha — **aur aap unka paisa dete rahoge**.

Firebase apps ka sabse aam leak yahi hai, aur ise theek karna ek line ka kaam hai.

**Aur sirf wahan suno jahan cheezein sach mein badalti hain.** Settings page ko live feed nahi chahiye. Uska paisa dena wo aadat hai jise jaldi chhodna chahiye.

**Ye bina internet ke chalta hai**

Aapka badlav **phone par turant** lag jata hai, kisi ke pushti karne se pehle. Isiliye app turant lagti hai — nishaan foran dikhta hai, aur asli save chupchaap baad mein hota hai.

Signal na ho to badlav bas ruka rehta hai aur signal aane par chala jata hai.

**Isse teen baatein nikalti hain**

**"Save ho gaya" ka matlab shayad sirf phone par save hua ho.** Jo pushti mili wo shayad local copy se hai, dukaan se nahi. Aksar theek hai. Kabhi bilkul nahi — matter kare to asli pushti ka intezaar karo.

**Do log offline mein wahi cheez badlein, to jo baad mein juda wo jeet ta hai** aur doosra badlav chupchaap gayab ho jata hai. Kisi ko bataya nahi jata.

**Aur kuch cheezon ko internet chahiye.** Wo savdhan wala "padho, jaancho, phir badlo" — jaise aakhri seat book karna — offline chal hi nahi sakta, kyunki use dukaan se poochhna hota hai ki abhi sach kya hai. Iski yojna banao, pata chalne ki jagah.

**Yaad rakho:** sunna band karna batao. Aur "save ho gaya" ka matlab shayad sirf yahin save hua ho.`,
  },

  'firebase-functions-and-storage': {
    simple: `**A back room for the things customers must not do themselves.**

You removed the counter staff — but a few jobs genuinely cannot happen out front. So you keep a small back room where your own code runs, away from customers.

**What belongs back there**

- **Anything with a secret key.** Charging a card, sending email. A key in the shop front is a key anyone can copy.
- **Handing out job titles.** Only the back room decides who is a manager. Obviously.
- **Tidying up after a change.** Someone changes their name, and now fifty copies of it need updating. The back room does that.

**Two things that genuinely bite**

**The back room takes a moment to wake up.** If nobody has used it for a while, the first request waits — sometimes a noticeable pause. Fine for background tidying, less fine for something someone is waiting on.

**It can trigger itself, forever.** Write a job that says *"when a post changes, update the post"* and it changes the post, which triggers it, which changes the post…

This spins at machine speed and the bill is real. **Write the stop condition before the logic**: check whether the thing you care about actually changed, and if not, do nothing.

**Also: it might run twice for the same event.** That is normal, not a fault. Make sure doing it twice is harmless.

**Files**

Uploads have their own notice on their own door — separate from the main one.

Because there is nobody in the middle, **the notice has to do the checking**: how big, what type. The file goes straight from the customer to the shelf without your code seeing it.

You *can* have the back room react afterwards — make a thumbnail, check it for viruses, write a record. But it happens after arrival, so the door has to be the thing that says no.

**Remember:** the back room is for secrets and tidying. And always write the "stop" before the "do".`,
    simpleHi: `**Ek peechhe ka kamra un kaamon ke liye jo customers khud nahi kar sakte.**

Aapne counter ka staff hata diya — par kuch kaam sach mein saamne nahi ho sakte. Isliye aap ek chhota peechhe ka kamra rakhte ho jahan aapka apna code chalta hai, customers se door.

**Wahan kya hona chahiye**

- **Jismein bhi gupt chaabi ho.** Card charge karna, email bhejna. Dukaan ke aage rakhi chaabi wo hai jise koi bhi copy kar le.
- **Pad baantna.** Kaun manager hai ye sirf peechhe ka kamra tay karta hai. Zaahir hai.
- **Badlav ke baad safai.** Koi apna naam badalta hai, aur ab uski pachas copies update karni hain. Wo peechhe ka kamra karta hai.

**Do cheezein jo sach mein kaat ti hain**

**Peechhe ke kamre ko jaagne mein ek pal lagta hai.** Kaafi der se koi na aaya ho to pehli guzarish rukti hai — kabhi dikhne layak. Peeche ki safai ke liye theek, kisi ke intezaar wali cheez ke liye kam theek.

**Ye khud ko chala sakta hai, hamesha ke liye.** Aisa kaam likho jo kahe *"post badle to post update karo"* aur wo post badalta hai, jisse wo chalta hai, jisse post badalta hai…

Ye machine ki raftaar se ghoomta hai aur bill asli hai. **Rukne ki shart logic se pehle likho**: jaancho ki jis cheez ki parwah hai wo sach mein badli ya nahi, aur nahi to kuch mat karo.

**Aur: ye ek hi event par do baar chal sakta hai.** Ye normal hai, khaami nahi. Pakka karo ki do baar karna nuksaan na kare.

**Files**

Uploads ka apna notice apne darwaze par hai — mukhya wale se alag.

Beech mein koi hai hi nahi, isliye **jaanchna notice ko hi hai**: kitna bada, kaunsi kism. File customer se seedhe shelf par jati hai, aapka code use dekhta bhi nahi.

Aap peechhe ke kamre se baad mein reaction karwa *sakte ho* — thumbnail banana, virus jaanchna, record likhna. Par wo pahunchne ke baad hota hai, isliye mana karne wala darwaza hi hona chahiye.

**Yaad rakho:** peechhe ka kamra raaz aur safai ke liye hai. Aur "karo" se pehle hamesha "ruko" likho.`,
  },

  'firebase-cost': {
    simple: `**You are charged per item picked up. Not by weight, not by the hour.**

This is the thing people understand last and should understand first.

A screen that shows a hundred items costs **a hundred pickups** — every single time anyone opens it. Ten people opening it ten times a day is ten thousand pickups, for one screen.

Nothing about writing that code suggests a price. That is exactly why the bills surprise people.

**Where the surprises come from**

**Counting by fetching.** Grabbing ten thousand files to show the number "10,000" costs ten thousand pickups. Every time. There is a way to just ask how many, and it costs one.

**Listening to everything.** A live feed with no limit on a growing folder charges for the initial load, then for every change, forever, for every person watching.

**A job that triggers itself.** Runs at machine speed until someone notices. This is the classic "left it overnight" story, and it is a real one.

**Fetching a whole file for one field.** There is no half-pickup. If a screen needs one number from a large file, that is a full pickup — worth a smaller summary file instead.

**Five habits that keep it sane**

1. **Always say how many you want.** No exceptions on anything a person sees.
2. **Never fetch things to count them.**
3. **Copy things onto other things** so one grab is enough. This is a cost decision as much as a shelving one.
4. **Only use live feeds where things actually change.**
5. **Ask to be told when the bill moves.** This is not optional. The failure is silent, and silence lasts until the invoice.

**Do the sums before you build**

*A thousand people × ten screens × twenty pickups.* One minute on paper, and it tells you whether the idea can afford to exist.

**And the honest bit:** Firebase is not expensive because of how much you have. It gets expensive because a screen picks up more than it needs, over and over. That is a design problem, and design problems have design fixes.

**Remember:** every pickup is charged. Say how many. Never fetch to count.`,
    simpleHi: `**Aapse har uthayi hui cheez ka paisa liya jata hai. Wazan se nahi, ghante se nahi.**

Ye wo cheez hai jise log sabse aakhir mein samajhte hain aur sabse pehle samajhni chahiye.

Sau cheezein dikhane wali screen **sau uthaav** leti hai — har ek baar jab koi use khole. Das log din mein das baar kholein to das hazaar uthaav, ek screen ke liye.

Wo code likhte waqt kuch bhi daam ka ishara nahi karta. Theek isiliye bill logon ko chaunkate hain.

**Chaunkane wali baatein kahan se aati hain**

**Laa kar ginna.** "10,000" number dikhane ke liye das hazaar files uthana das hazaar uthaav hai. Har baar. Bas ginti poochhne ka ek tareeka hai, aur wo ek leta hai.

**Sab kuch sunna.** Badhte folder par bina seema ka live feed pehle load ka paisa leta hai, phir har badlav ka, hamesha, har dekhne wale ke liye.

**Khud ko chalata kaam.** Machine ki raftaar se chalta hai jab tak kisi ka dhyan na jaye. "Raat bhar chhod diya tha" wali classic kahani yahi hai, aur wo asli hai.

**Ek field ke liye poori file laana.** Aadha uthaav hota hi nahi. Badi file se ek number chahiye to wo poora uthaav hai — iski jagah chhoti summary file behtar hai.

**Paanch aadatein jo ise samajhdaar rakhti hain**

1. **Hamesha batao kitne chahiye.** Jo bhi insaan dekhta hai usme koi chhoot nahi.
2. **Ginne ke liye cheezein kabhi mat laao.**
3. **Cheezein doosri cheezon par copy karo** taaki ek uthaav kaafi ho. Ye shelf lagane jitna hi kharch ka faisla hai.
4. **Live feed sirf wahan jahan cheezein sach mein badalti hain.**
5. **Bill hile to bataye jaane ko kaho.** Ye optional nahi hai. Nakaami chupchaap hoti hai, aur chuppi invoice tak chalti hai.

**Banane se pehle hisaab karo**

*Ek hazaar log × das screen × bees uthaav.* Kaagaz par ek minute, aur ye bata deta hai ki vichaar chalne layak hai ya nahi.

**Aur imaandar baat:** Firebase isliye mehnga nahi hota ki aapke paas kitna hai. Ye isliye mehnga hota hai ki koi screen zaroorat se zyada uthati hai, baar-baar. Ye design ki samasya hai, aur design ki samasyaon ka hal design mein hota hai.

**Yaad rakho:** har uthaav ka paisa. Batao kitne chahiye. Ginne ke liye kabhi mat laao.`,
  },

  'firebase-production': {
    simple: `**You can run the whole shop on your own computer. Do.**

There is a local version of everything — the stockroom, the passes, the back room. Use it from day one, for three reasons:

**You can test the door notice.** Actually check: can this person read that? Can that person? Since the notice is your **entire** security, this is not optional testing — it is the only way to be sure.

**It costs nothing and nobody shares it.** No corrupting a shared practice database, no bill.

**It is fast.** Tests run in seconds.

**Test the refusals, not just the permissions**

Everyone checks that the right person gets in. Far fewer check that the **wrong** person is turned away.

But a notice that is too generous passes every one of the first kind of test. The refusals are where the security actually lives.

**Separate shops for practice and real**

A completely separate setup for testing, not just a different shelf in the same room. A mistake while practising should be unable to touch anything real.

**Three things you have to send up separately**

The door notice, the registered questions, and the back room code. **They are not part of your app**, and forgetting them causes the classic problem: it worked on your machine, and production has an old notice or a missing question.

**Two realities nobody mentions early**

**There is no tidy way to change how files are shaped.** No migration command. You write a script that opens every file and rewrites it, and while it runs your app has to cope with both the old and the new shape. Plan that gap.

**Backups may not exist unless you set them up.** Deleting a folder is not undoable. "We assumed it was backed up" is a genuinely bad thing to find out.

**Before going live:** notice written and tested, questions registered and sent up, bill alert on, backups scheduled, and — most importantly — **no leftover "let everyone in" notice from your first afternoon**.

**Remember:** run it locally, test the refusals, and remember the notice ships separately.`,
    simpleHi: `**Aap poori dukaan apne computer par chala sakte ho. Chalao.**

Har cheez ka local roop hai — stockroom, pass, peechhe ka kamra. Ise pehle din se use karo, teen wajahon se:

**Aap darwaze ka notice test kar sakte ho.** Sach mein jaancho: kya ye insaan wo padh sakta hai? Kya wo insaan? Notice hi aapki **poori** security hai, isliye ye optional testing nahi hai — pakka karne ka yahi ek tareeka hai.

**Ismein kuch kharch nahi aur koi ise saanjha nahi karta.** Na saanjha practice database kharab hota hai, na bill.

**Ye tez hai.** Tests seconds mein chalte hain.

**Mana karne wale case test karo, sirf ijazat wale nahi**

Sab ye jaanchte hain ki sahi insaan andar aa raha hai. Kahin kam log ye jaanchte hain ki **galat** insaan wapas bheja ja raha hai.

Par zyada udaar notice pehli kism ke saare tests pass kar leta hai. Security asal mein mana karne walon mein rehti hai.

**Practice aur asli ke liye alag dukaan**

Testing ke liye bilkul alag setup, usi kamre mein doosri shelf nahi. Practice ke dauran ki galti asli cheez ko chhoo hi na sake.

**Teen cheezein alag se upar bhejni padti hain**

Darwaze ka notice, register kiye sawaal, aur peechhe ke kamre ka code. **Ye aapki app ka hissa nahi hain**, aur inhe bhoolne se classic samasya hoti hai: aapki machine par chal raha tha, aur production par purana notice hai ya sawaal hai hi nahi.

**Do sachaiyan jo koi jaldi nahi batata**

**Files ki shakal badalne ka koi saaf tareeka nahi hai.** Koi migration command nahi. Aap aisi script likhte ho jo har file kholti aur dobara likhti hai, aur us dauran aapki app ko purani aur nayi dono shakal sambhalni padti hai. Us gap ki yojna banao.

**Backups shayad na hon jab tak aap na lagao.** Folder mitana palta nahi ja sakta. "Hum maan rahe the ki backup hai" pata chalna sach mein buri baat hai.

**Live jaane se pehle:** notice likha aur test ho, sawaal register aur upar bheje hon, bill ka alert chalu ho, backups scheduled hon, aur — sabse zaroori — **pehli dopahar ka "sabko andar aane do" wala notice kahin bacha na ho**.

**Yaad rakho:** local mein chalao, mana karne wale test karo, aur yaad rakho ki notice alag se jata hai.`,
  },

  'firebase-vs-alternatives': {
    simple: `**Three ways to have a back end. The choice has real consequences.**

**Firebase** — the shop with no counter staff. Brilliant at telling you when things change, brilliant offline, brilliant on phones. Cannot join two lists. Charges per pickup. Hard to leave.

**Supabase** — a proper filing cabinet with an automatic front desk. You get real joins, proper questions, and a well-understood system underneath. Also open, so you could run it yourself.

**Your own** — you build the counter, hire the staff, and own everything. Total control, total responsibility.

**The question that decides it**

**Does your information have relationships?**

Customers have orders. Orders have items. Items belong to products. If that is your world — and for most applications it is — then a system that cannot join things will make you rebuild joins by hand, on every screen, forever.

That is the single most common reason Firebase projects become uncomfortable, and it shows up months in.

**When Firebase is genuinely the right answer**

Live updates are central. Offline matters. You are building for phones. The team is small and the data is not deeply relational. Chat, collaboration, mobile apps.

Those are real strengths, not consolation prizes.

**The thing to price at the start, not the end**

**Leaving.** Firebase's door notices, its way of asking questions, and its whole toolkit are specific to Firebase. Moving away is a rebuild.

The alternative sits on a standard, widely-used system, so moving away is a well-trodden path.

That difference is worth thinking about on day one, when it is a paragraph of thought — rather than on the day you need it, when it is a quarter of work.

**And one thing worth knowing:** you can take just the sign-in part of Firebase and use your own everything else. Common, and sensible.

**Remember:** if your data has relationships, that points away from Firebase. Choose it *for* live updates and offline, not because you would rather not build a back end.`,
    simpleHi: `**Back end rakhne ke teen tareeke. Chunaav ke asli natije hain.**

**Firebase** — bina counter staff wali dukaan. Badlav batane mein shandar, offline mein shandar, phone par shandar. Do listein jod nahi sakta. Har uthaav ka paisa. Chhodna mushkil.

**Supabase** — theek se bani file almari jiska front desk apne aap hai. Aapko asli joins, dhang ke sawaal, aur neeche ek achhi tarah samjha gaya system milta hai. Ye khula bhi hai, isliye aap ise khud bhi chala sakte ho.

**Apna** — aap counter banate ho, staff rakhte ho, aur sab kuch aapka. Poora kaabu, poori zimmedari.

**Wo sawaal jo faisla karta hai**

**Kya aapki jaankari mein rishte hain?**

Customers ke orders hote hain. Orders mein items. Items products se judte hain. Ye aapki duniya hai — aur zyadatar applications ke liye hai — to aisa system jo cheezein jod nahi sakta, aapse har screen par, hamesha, haath se joins dobara banwayega.

Firebase projects ke asahaj hone ki sabse aam wajah yahi hai, aur ye mahinon baad dikhti hai.

**Firebase kab sach mein sahi jawab hai**

Live updates केंद्र mein hon. Offline matter karta ho. Aap phone ke liye bana rahe ho. Team chhoti ho aur data gehra relational na ho. Chat, saath mein kaam, mobile apps.

Ye asli khoobiyan hain, dilasa nahi.

**Jo shuruaat mein tolna chahiye, ant mein nahi**

**Nikalna.** Firebase ke darwaze ke notice, sawaal poochhne ka tareeka, aur poora saamaan Firebase ke liye khaas hai. Wahan se hatna dobara banana hai.

Doosra vikalp ek standard, khoob istemal hone wale system par tika hai, isliye wahan se hatna chala hua rasta hai.

Ye farak pehle din sochne layak hai, jab wo ek paragraph ki soch hai — us din nahi jab zaroorat pade, jab wo teen mahine ka kaam hai.

**Aur ek jaanne layak baat:** aap Firebase ka sirf sign-in wala hissa le sakte ho aur baaki sab apna rakh sakte ho. Aam bhi hai aur samajhdaar bhi.

**Yaad rakho:** aapke data mein rishte hain to ishara Firebase se door hai. Ise live updates aur offline ke *liye* chuno, isliye nahi ki aap back end nahi banana chahte.`,
  },
};

export const TRICKS_FIREBASE: Record<string, TopicTricks> = {
  'firebase-what-is-it': {
    tricks: `### 🏪 "A shop with no counter staff"

Customers walk straight into the stockroom. That single image carries the whole category.

### 📋 "The notice on the door IS the security"

No server between browser and database means the rules file is the **entire** authorisation layer. Wrong rules mean public data — not "harder to reach", public.

**Say it:** *"You removed the staff, not the decisions."*

### 💸 "You pay per item picked up"

Not per gigabyte, not per hour. A screen showing 100 documents costs 100 reads **every time anyone opens it**, which makes query shape a spending decision.

### 🔗 "No joins. Ever."

You denormalise and maintain the copies yourself. This is the single biggest adjustment for anyone with relational instincts, and the most common reason projects become uncomfortable.

### 🚪 "Leaving is a rewrite"

Rules, queries and SDK calls are all proprietary. Price that on day one, when it is a paragraph of thought.

**Why this sticks:** "you removed the staff, not the decisions" *corrects the exact misconception* that causes the leaks. People believe Firebase removed backend work; it removed backend infrastructure and relocated the thinking.`,
    tricksHi: `### 🏪 "Bina counter staff wali dukaan"

Customers seedhe stockroom mein chale jate hain. Wahi ek tasveer poori shreni sambhal leti hai.

### 📋 "Darwaze ka notice HI security hai"

Browser aur database ke beech server nahi, isliye rules file **poori** authorisation parat hai. Galat rules matlab sarvajanik data — "pahunchna mushkil" nahi, sarvajanik.

**Bolo:** *"Aapne staff hataya, faisle nahi."*

### 💸 "Aap har uthayi cheez ka paisa dete ho"

Gigabyte ka nahi, ghante ka nahi. 100 documents dikhane wali screen **har baar khulne par** 100 read hai, aur isse query ki shakal kharch ka faisla ban jati hai.

### 🔗 "Joins nahi. Kabhi nahi."

Aap denormalise karte ho aur copies khud sambhalte ho. Relational soch wale kisi bhi insaan ke liye sabse bada badlav yahi hai, aur projects ke asahaj hone ki sabse aam wajah bhi.

### 🚪 "Nikalna rewrite hai"

Rules, queries aur SDK calls sab proprietary hain. Ise pehle din tolo, jab wo ek paragraph ki soch hai.

**Ye kyun tikta hai:** "aapne staff hataya, faisle nahi" *theek us galatfehmi ko sudhaarta hai* jisse leaks hote hain. Log maante hain Firebase ne backend ka kaam hataya; usne backend ka infrastructure hataya aur soch ko kahin aur bhej diya.`,
  },

  'firebase-auth': {
    tricks: `### 🎫 "Auth proves who. Rules decide what."

A valid token is identity, never permission — the same rule as everywhere else, and just as easy to forget here.

### 🏷️ "Claims are set from the trusted side only"

Roles ride on the token as custom claims, and **only the Admin SDK can write them**. A client setting its own role would make the entire system theatre.

### ⏰ "A role change looks like it did nothing"

Tokens refresh roughly hourly, so a new claim does not apply until then. \`getIdToken(true)\` forces it.

**Say it:** *"New role, old pass."*

This causes a genuinely confusing bug — everything is correct and nothing happens.

### 👻 "The first null means 'still checking'"

\`onAuthStateChanged\` fires with \`null\` while the SDK restores the session. Treat that as logged out and **every visitor sees a flash of the login screen**, including ones who never logged out.

**The fix is one line:** a separate loading state.

**Why this sticks:** "new role, old pass" is *three words describing an invisible cause*. The symptom — nothing happened — gives you no information, so the hook has to supply it.`,
    tricksHi: `### 🎫 "Auth sabit karta hai kaun. Rules tay karte hain kya."

Sahi token pehchan hai, ijazat kabhi nahi — wahi niyam jo har jagah hai, aur yahan bhoolna utna hi aasan.

### 🏷️ "Claims sirf bharosemand taraf se set hoti hain"

Roles token par custom claims ki tarah chalte hain, aur **inhe sirf Admin SDK likh sakta hai**. Client apna role set kar sake to poora system natak hai.

### ⏰ "Role ka badlav lagta hai kuch hua hi nahi"

Tokens lagbhag har ghante refresh hote hain, isliye nayi claim tab tak lagu nahi hoti. \`getIdToken(true)\` use zabardasti karwata hai.

**Bolo:** *"Naya role, purana pass."*

Isse sach mein uljhane wala bug hota hai — sab theek hai aur kuch nahi hota.

### 👻 "Pehle null ka matlab 'abhi jaanch rahe hain'"

\`onAuthStateChanged\` tab \`null\` deta hai jab SDK session bahal kar raha hota hai. Use logged out maan lo aur **har aane wale ko login screen ki jhalak dikhti hai**, un logon ko bhi jinhone kabhi logout nahi kiya.

**Hal ek line ka hai:** alag loading state.

**Ye kyun tikta hai:** "naya role, purana pass" *teen shabdon mein ek adrishya wajah* batata hai. Nishaani — kuch nahi hua — koi jaankari nahi deti, isliye hook ko wo deni padti hai.`,
  },

  'firestore-basics': {
    tricks: `### 📁 "Folders and files, alternating"

Collection → document → collection → document. A subcollection lives **under** a document and does not count against its 1MB limit.

### ⚡ "It tells you when things change"

The headline feature, and genuinely excellent: attach a listener and updates push to you. No polling, no WebSocket code.

### ✈️ "Offline works, and it works well"

Reads come from cache when disconnected, writes queue and replay. On mobile this is essentially free and saves an enormous amount of work.

### 🚧 The three hard limits

**"1MB per document. 1 write per second per document. No joins."**

That middle one is why a single counter everyone increments jams — and why distributed counters exist as a standard pattern.

### 💸 "Empty results still cost"

There is no free existence check. Worth knowing before writing a loop that checks a thousand things.

### ⚛️ "increment and arrayUnion are atomic"

Two clients doing read-modify-write on the same field overwrite each other. These do not.

**Why this sticks:** the three limits as one three-beat phrase is *countable and complete*. Under design pressure you need to know what the walls are, and three short facts fit where a paragraph does not.`,
    tricksHi: `### 📁 "Folder aur file, bari-bari"

Collection → document → collection → document. Subcollection document ke **neeche** rehti hai aur uski 1MB seema mein nahi ginti.

### ⚡ "Kuch badle to ye bata deta hai"

Mukhya feature, aur sach mein shandar: listener lagao aur updates aap tak push hote hain. Na polling, na WebSocket code.

### ✈️ "Offline chalta hai, aur achhe se chalta hai"

Connection na hone par reads cache se aati hain, writes line mein lag kar chalti hain. Mobile par ye lagbhag muft hai aur bahut kaam bachata hai.

### 🚧 Teen pakki seemayein

**"Har document 1MB. Har document par 1 write per second. Joins nahi."**

Beech wali wajah hai ki ek hi counter jise sab badhate hain wo jam ho jata hai — aur isiliye distributed counters standard pattern hain.

### 💸 "Khaali natije ka bhi paisa"

Muft mein "hai ya nahi" jaanchna hota hi nahi. Hazaar cheezein jaanchne wala loop likhne se pehle jaanne layak.

### ⚛️ "increment aur arrayUnion atomic hain"

Wahi field par read-modify-write karte do clients ek doosre ko mita dete hain. Ye nahi.

**Ye kyun tikta hai:** teen seemayein ek teen-taal vaakya mein *gini ja sakti hain aur poori hain*. Design ke dabav mein aapko deewarein pata honi chahiye, aur teen chhote tathya wahan aa jate hain jahan paragraph nahi aata.`,
  },

  'firestore-security-rules': {
    tricks: `### 🚨 "Rules ARE the backend"

There is no server. If the rules are wrong, the data is **public** — anyone can open the SDK in a console and read everything.

This is the leading cause of real Firebase data leaks, and the cause is nearly always the same: rules left for later.

**Say it:** *"Write the rules with the feature, not after."*

### 🔒 "Start with deny, open deliberately"

\`allow read, write: if false\` first. Starting open and closing gaps leaves holes you will not find — someone else will.

### 🎯 The concept everyone gets wrong

**Rules FILTER, they do not QUERY.**

A rule saying "you may read your own orders" does **not** turn \`getDocs(collection('orders'))\` into your orders. It **rejects that query entirely**. The client must scope the query itself.

**Say it:** *"Broad query, total refusal."*

This is the classic *"my rules are right but nothing works"* confusion.

### 💰 "\`get()\` inside a rule is a billed read"

Rules can look up other documents, and each lookup costs and adds latency. Useful, not free.

### ✍️ "Validate writes, not just reads"

Stop a user editing their own \`role\` or reassigning \`ownerId\`. There is no server to do it.

### 🧪 "Test the denials"

A rule that allows too much passes every happy-path test you write.

**Why this sticks:** "broad query, total refusal" *names the surprising behaviour in three words*. The surprise is what wastes hours, so the hook has to be reachable during the confusion.`,
    tricksHi: `### 🚨 "Rules HI backend hain"

Koi server nahi hai. Rules galat hui to data **sarvajanik** hai — koi bhi console mein SDK khol kar sab padh sakta hai.

Asli Firebase data leak ki sabse badi wajah yahi hai, aur wajah lagbhag hamesha ek: rules baad ke liye chhoda.

**Bolo:** *"Rules feature ke saath likho, baad mein nahi."*

### 🔒 "Deny se shuru, soch kar kholo"

Pehle \`allow read, write: if false\`. Khula shuru karke chhed band karna aise chhed chhodta hai jo aapko nahi milenge — kisi aur ko milenge.

### 🎯 Wo vichaar jo sab galat samajhte hain

**Rules CHHAANTE hain, QUERY nahi karte.**

"Aap apne orders padh sakte ho" wala rule \`getDocs(collection('orders'))\` ko aapke orders **nahi** banata. Wo us query ko **poori tarah mana** kar deta hai. Client ko khud query seemit karni padti hai.

**Bolo:** *"Chaudi query, poora inkaar."*

Yahi classic *"mere rules theek hain par kuch nahi chalta"* wali uljhan hai.

### 💰 "Rule ke andar \`get()\` ek billed read hai"

Rules doosre documents dekh sakte hain, aur har lookup ka paisa aur latency hai. Kaam ka, muft nahi.

### ✍️ "Writes bhi validate karo, sirf reads nahi"

User ko apni \`role\` badalne ya \`ownerId\` badalne se roko. Karne wala server hai hi nahi.

### 🧪 "Inkaar test karo"

Jo rule zyada allow karta hai wo aapke likhe har achhe raste ka test pass kar leta hai.

**Ye kyun tikta hai:** "chaudi query, poora inkaar" *chaunkane wale bartaav ko teen shabdon mein* naam deta hai. Chaunkna hi ghante barbaad karta hai, isliye hook uljhan ke dauran pahunch mein hona chahiye.`,
  },

  'firestore-queries': {
    tricks: `### 📏 "Cost scales with the result, not the collection"

Ten documents cost the same whether the collection holds a thousand or ten million. Genuinely unusual, and it is what the restrictions buy you.

### 🚫 What you cannot ask

**"No joins. No cross-field OR. One range field. No text search."**

Four limits. Knowing them before you design the schema saves redoing it.

### 🔄 The reflex that matters most

**When a query is awkward, change the DATA, not the query.**

In SQL you write a cleverer query. In Firestore you write a simpler document — add a field, denormalise, precompute.

**Say it:** *"Reshape the document, not the question."*

That inversion is the hardest habit coming from SQL, and the one that decides whether Firestore feels good or feels like a fight.

### 🔢 "Never fetch to count"

\`getCountFromServer()\` is one billed operation. Fetching a collection to count it is one read per document, every time.

### 📇 "Indexes deploy separately"

A query works locally and **fails in production** if the composite index was never deployed. Genuinely common production incident.

**Why this sticks:** "reshape the document, not the question" *states the inversion directly*. The instinct from SQL is strong and wrong here, so the hook has to contradict it explicitly rather than describe the alternative.`,
    tricksHi: `### 📏 "Kharch natije se badhta hai, collection se nahi"

Das documents ka kharch wahi hai chahe collection mein hazaar hon ya ek crore. Sach mein asaamanya, aur rok-tok isi ke badle hai.

### 🚫 Aap kya nahi maang sakte

**"Joins nahi. Alag fields par OR nahi. Ek range field. Text search nahi."**

Chaar seemayein. Schema banane se pehle inhe jaanna use dobara banane se bachata hai.

### 🔄 Sabse zaroori aadat

**Query ajeeb lage to DATA badlo, query nahi.**

SQL mein aap chalak query likhte ho. Firestore mein aap simple document likhte ho — field jodo, denormalise karo, pehle se nikaalo.

**Bolo:** *"Document ki shakal badlo, sawaal ki nahi."*

SQL se aane walon ke liye ye sabse mushkil aadat hai, aur yahi tay karti hai ki Firestore achha lagta hai ya ladai.

### 🔢 "Ginne ke liye kabhi mat laao"

\`getCountFromServer()\` ek billed operation hai. Ginne ke liye collection laana har document ka ek read hai, har baar.

### 📇 "Indexes alag se deploy hote hain"

Query local par chalti hai aur **production mein fail** hoti hai agar composite index deploy hi na hua ho. Sach mein aam production incident.

**Ye kyun tikta hai:** "document ki shakal badlo, sawaal ki nahi" *ulat ko seedhe kehta hai*. SQL wali aadat mazboot hai aur yahan galat, isliye hook ko use saaf-saaf kaatna padta hai, vikalp batana kaafi nahi.`,
  },

  'firestore-data-modelling': {
    tricks: `### 🖥️ "Model for the screen, not the entity"

The question is not *"what are my entities"* but **"what does this screen need in one read?"**

### 📋 "Duplication is the design, not a hack"

A post storing \`authorName\` renders a feed in one query instead of one plus fifty. That is intended.

**The cost is staleness**, and there are three honest answers: accept it, fan out on write, or refetch. Accepting it is right more often than people expect.

### 💣 "Never an unbounded array in a document"

Comments in an array look fine at five and die well before the 1MB cap, because **every update rewrites the whole document**. Unbounded goes in a subcollection.

### 🔟 "One counter jams at 1 write/second"

Shard it across ten documents, sum on read. Standard answer to a genuinely common problem.

### 🔄 The inversion to internalise

**"SQL: writes simple, reads clever. Firestore: reads simple, writes do the work."**

Once that flips in your head, modelling stops feeling like a fight.

**Why this sticks:** the SQL/Firestore inversion is *a single sentence containing both halves*. Learning the contrast rather than the rule means you can derive the right move in a situation the rule never covered.`,
    tricksHi: `### 🖥️ "Screen ke liye model karo, entity ke liye nahi"

Sawaal *"meri entities kya hain"* nahi balki **"is screen ko ek read mein kya chahiye?"** hai.

### 📋 "Duplication design hai, jugaad nahi"

\`authorName\` rakhne wali post feed ko ek query mein banati hai, ek aur pachas mein nahi. Yahi irada tha.

**Keemat puranapan hai**, aur teen imaandar jawab hain: maan lo, likhte waqt phailao, ya dobara laao. Maan lena logon ke andaze se zyada baar sahi hota hai.

### 💣 "Document mein bina seema wali array kabhi nahi"

Array mein comments paanch par theek lagte hain aur 1MB ki had se bahut pehle mar jate hain, kyunki **har update poora document dobara likhta hai**. Bina seema wali cheez subcollection mein jati hai.

### 🔟 "Ek counter 1 write/second par jam ho jata hai"

Use das documents mein shard karo, padhte waqt jodo. Sach mein aam samasya ka standard jawab.

### 🔄 Jo ulat andar utaarna hai

**"SQL: writes simple, reads chalak. Firestore: reads simple, kaam writes karti hain."**

Ye dimaag mein palat jaye to modelling ladai lagni band ho jati hai.

**Ye kyun tikta hai:** SQL/Firestore ka ulat *ek hi vaakya mein dono aadhe* rakhta hai. Niyam ki jagah farak seekhne se aap us haal mein bhi sahi chaal nikaal lete ho jise niyam ne dhaka hi nahi tha.`,
  },

  'firebase-realtime-and-offline': {
    tricks: `### 📡 "Ask once, get told forever"

\`onSnapshot\` replaces polling entirely. This is the headline feature and it genuinely is excellent.

### 🗑️ "Always unsubscribe"

Forget and you leak listeners, keep receiving updates for screens nobody is viewing, **and keep paying for them**. The most common Firebase leak, and one line to fix.

### 🎯 "Listeners where things change, one-off reads where they do not"

A settings page does not need a live subscription. Paying for one is a habit worth breaking early.

### ⚡ "Your write applies locally first"

That is latency compensation, and it is why the UI feels instant. \`hasPendingWrites\` tells you it is not yet confirmed.

**The consequence:** a resolved promise may mean **saved on the device**, not saved on the server.

**Say it:** *"Saved might mean saved here."*

### 🤝 "Offline conflicts are last-write-wins"

Two people editing the same field offline: one silently loses, and nobody is told.

### 🚫 "Transactions do not work offline"

They need the server. Batches do work. In an offline-capable app, plan for that rather than discovering it in the field.

**Why this sticks:** "saved might mean saved here" *undermines a word you trust*. Once "saved" becomes ambiguous, you check — which is exactly the behaviour required.`,
    tricksHi: `### 📡 "Ek baar poochho, hamesha bataya jaye"

\`onSnapshot\` polling ko poori tarah hata deta hai. Ye mukhya feature hai aur sach mein shandar hai.

### 🗑️ "Hamesha unsubscribe karo"

Bhoolo aur listeners leak hote hain, un screens ke updates aate rehte hain jinhe koi nahi dekh raha, **aur unka paisa lagta rehta hai**. Firebase ka sabse aam leak, aur hal ek line ka.

### 🎯 "Listeners wahan jahan badalta hai, ek baar ki reads jahan nahi"

Settings page ko live subscription nahi chahiye. Uska paisa dena wo aadat hai jise jaldi chhodna chahiye.

### ⚡ "Aapki write pehle local mein lagti hai"

Ye latency compensation hai, aur isi se UI turant lagta hai. \`hasPendingWrites\` batata hai ki wo abhi confirm nahi hui.

**Natija:** poora hua promise shayad ye kehta ho ki **device par save hua**, server par nahi.

**Bolo:** *"Save ka matlab shayad yahin save ho."*

### 🤝 "Offline takraar last-write-wins hai"

Do log offline mein wahi field badlein: ek chupchaap haar jata hai, aur kisi ko bataya nahi jata.

### 🚫 "Transactions offline nahi chalte"

Unhe server chahiye. Batches chalte hain. Offline chalne wali app mein iski yojna banao, maidan mein pata chalne ki jagah.

**Ye kyun tikta hai:** "save ka matlab shayad yahin save ho" *us shabd par shak daal deta hai jis par aap bharosa karte ho*. "Save" dhundhla hote hi aap jaanchte ho — aur theek yahi bartaav chahiye.`,
  },

  'firebase-functions-and-storage': {
    tricks: `### 🚪 "The back room, for things customers must not do"

Secrets, role assignment, fan-out. Anything a client cannot be trusted with, or cannot do.

### ♾️ "Write the guard before the logic"

A function triggered by writes to \`posts\` that itself writes to \`posts\` **calls itself**, at machine speed, until someone notices.

**Say it:** *"Check what changed, then act."*

The classic "left it running overnight" bill is this.

### 🔁 "It may run twice for one event"

Duplicate delivery is normal, not a fault. Design so a second run is harmless.

### 🥶 "Cold starts"

An idle function takes hundreds of milliseconds to seconds on first call. Keep bundles small, initialise heavy dependencies lazily, and set minimum instances only where latency matters.

### 📤 "Uploads bypass your code entirely"

Bytes go **client → Storage** directly. So size and content-type validation must live in the **Storage rules**, because there is no server in the path to do it.

A function can react *after* arrival — thumbnail, scan, record — but the door has to be what says no.

**Why this sticks:** "write the guard before the logic" is *an instruction about ordering*, not a fact about loops. Instructions get followed at the keyboard; facts get recalled after the bill.`,
    tricksHi: `### 🚪 "Peechhe ka kamra, un kaamon ke liye jo customers nahi kar sakte"

Raaz, role dena, fan-out. Jo bhi client par bharosa nahi kiya ja sakta, ya wo kar hi nahi sakta.

### ♾️ "Logic se pehle rok likho"

\`posts\` par write se chalne wala function jo khud \`posts\` mein likhta hai wo **khud ko bulata hai**, machine ki raftaar se, jab tak kisi ka dhyan na jaye.

**Bolo:** *"Kya badla jaancho, phir karo."*

"Raat bhar chalta chhod diya" wala classic bill yahi hai.

### 🔁 "Ek event par ye do baar chal sakta hai"

Dobara delivery normal hai, khaami nahi. Aisa banao ki doosri baar chalna nuksaan na kare.

### 🥶 "Cold starts"

Khaali padi function pehle call par kuch sau milliseconds se kai second leti hai. Bundle chhote rakho, bhaari dependencies zaroorat par shuru karo, aur minimum instances sirf wahan jahan latency matter karti hai.

### 📤 "Uploads aapke code ko poori tarah bypass karte hain"

Bytes seedhe **client → Storage** jate hain. Isliye size aur content-type ki jaanch **Storage rules** mein honi chahiye, kyunki raste mein karne wala server hai hi nahi.

Function pahunchne ke *baad* reaction kar sakta hai — thumbnail, scan, record — par mana karne wala darwaza hi hona chahiye.

**Ye kyun tikta hai:** "logic se pehle rok likho" *kram ka nirdesh hai*, loop ka tathya nahi. Nirdesh keyboard par maane jate hain; tathya bill ke baad yaad aate hain.`,
  },

  'firebase-cost': {
    tricks: `### 💸 "Per document, not per gigabyte"

The billing model people understand last and should understand first. A screen showing 100 items costs 100 reads **every time anyone opens it**.

### 🔢 "Never fetch to count"

10,000 documents to display one number, every time. \`getCountFromServer()\` is one billed operation.

**This is the most common expensive mistake.**

### 📉 The five habits

**"Limit everything. Never count by fetching. Denormalise. One-off reads for static data. Set a budget alert."**

The last one is not optional — the failure is **silent**, and silence lasts until the invoice.

### 🧮 "Do the sums first"

*Users × screens × reads per screen.* One minute on paper, and it tells you whether the design can afford to exist.

### 🎯 The honest framing

**Firebase is rarely expensive because of volume.** It gets expensive because a screen reads more than it needs, repeatedly.

**Say it:** *"That is a design problem, and design problems have design fixes."*

**Why this sticks:** "rarely expensive because of volume" *relocates the blame accurately*. People assume they outgrew the platform; knowing it is an access pattern means they look for a fix rather than a migration.`,
    tricksHi: `### 💸 "Per document, per gigabyte nahi"

Billing ka model jise log sabse aakhir mein samajhte hain aur sabse pehle samajhna chahiye. 100 cheezein dikhane wali screen **har baar khulne par** 100 read hai.

### 🔢 "Ginne ke liye kabhi mat laao"

Ek number dikhane ke liye 10,000 documents, har baar. \`getCountFromServer()\` ek billed operation hai.

**Sabse aam mehngi galti yahi hai.**

### 📉 Paanch aadatein

**"Har cheez par limit. Ginne ke liye mat laao. Denormalise karo. Sthir data ke liye ek baar ki reads. Budget alert lagao."**

Aakhri optional nahi hai — nakaami **chupchaap** hoti hai, aur chuppi invoice tak chalti hai.

### 🧮 "Hisaab pehle karo"

*Users × screens × har screen ki reads.* Kaagaz par ek minute, aur ye bata deta hai ki design chalne layak hai ya nahi.

### 🎯 Imaandar baat

**Firebase maatra ki wajah se shayad hi mehnga hota hai.** Ye isliye mehnga hota hai ki koi screen zaroorat se zyada padhti hai, baar-baar.

**Bolo:** *"Ye design ki samasya hai, aur design ki samasyaon ka hal design mein hota hai."*

**Ye kyun tikta hai:** "maatra ki wajah se shayad hi mehnga" *dosh ko theek jagah rakhta hai*. Log maante hain ki platform chhota pad gaya; ye jaanna ki access ka tareeka hai, unse migration ki jagah hal dhoondhwata hai.`,
  },

  'firebase-production': {
    tricks: `### 🧪 "Use the emulator from day one"

Rules become testable, tests cost nothing, and nobody corrupts a shared dev database. Since rules are your **entire** authorisation layer, this is not convenience — it is the only way to be confident.

### ❌ "Test the denials, not just the permissions"

**A rule that allows too much passes every happy-path test you write.**

Everyone checks the right person gets in. Far fewer check the wrong person is refused — and that is where the security actually lives.

### 📤 "Three things deploy separately"

**Rules, indexes, functions.** They are not part of your app bundle.

Forgetting indexes is a genuinely common production incident: it worked locally, and the query fails in production.

### 🔄 "There are no migrations"

Changing a document shape means a script that reads and rewrites, and a client that handles **both shapes** while it runs. Plan the transition window explicitly.

### 💾 "Backups may not exist"

Deleting a collection is not reversible. "We assumed it was backed up" is a bad discovery.

### 🚩 The go-live check

**No leftover test-mode rules.** That first-afternoon "allow all" is a public database.

**Why this sticks:** "a rule that allows too much passes every happy-path test" *explains why testing feels sufficient when it is not*. That gap is invisible by definition, so it has to be named.`,
    tricksHi: `### 🧪 "Emulator pehle din se use karo"

Rules test hone layak ho jate hain, tests mein kuch kharch nahi, aur koi saanjha dev database kharab nahi karta. Rules aapki **poori** authorisation parat hain, isliye ye suvidha nahi — bharosa karne ka yahi ek tareeka hai.

### ❌ "Inkaar test karo, sirf ijazat nahi"

**Jo rule zyada allow karta hai wo aapke likhe har achhe raste ka test pass kar leta hai.**

Sab ye jaanchte hain ki sahi insaan andar aa raha hai. Kahin kam ye ki galat insaan mana ho raha hai — aur security asal mein wahin rehti hai.

### 📤 "Teen cheezein alag deploy hoti hain"

**Rules, indexes, functions.** Ye aapke app bundle ka hissa nahi hain.

Indexes bhoolna sach mein aam production incident hai: local par chala, aur production mein query fail.

### 🔄 "Migrations hain hi nahi"

Document ki shakal badalne ka matlab hai aisi script jo padhe aur dobara likhe, aur aisa client jo us dauran **dono shape** sambhale. Us beech ke samay ki yojna saaf-saaf banao.

### 💾 "Backups shayad hon hi nahi"

Collection mitana palta nahi ja sakta. "Hum maan rahe the ki backup hai" bura pata chalna hai.

### 🚩 Live jaane ki jaanch

**Test-mode rules kahin bache na hon.** Pehli dopahar ka "sab allow" ek sarvajanik database hai.

**Ye kyun tikta hai:** "jo rule zyada allow karta hai wo har achhe raste ka test pass kar leta hai" *samjhata hai ki testing kaafi kyun lagti hai jab wo hai nahi*. Wo faasla parib hasha se adrishya hai, isliye use naam dena padta hai.`,
  },

  'firebase-vs-alternatives': {
    tricks: `### ❓ "Does your data have relationships?"

The question that decides it. Users have orders, orders have items — and **most application data is relational**.

A document database for relational data means rebuilding joins by hand on every screen, forever. That is the most common reason Firebase projects become uncomfortable, and it shows up months in.

### ✅ "Choose Firebase FOR something"

Realtime central, offline matters, mobile-first, small team, data not deeply relational. Those are real strengths.

**Say it:** *"Not because you would rather not write a backend."*

### 🚪 "Lock-in is asymmetric"

Leaving Firebase is a **rewrite** — rules, queries and SDK calls are all proprietary.
Leaving Supabase is largely a **Postgres migration** — a well-trodden path.

Price that on day one, when it is a paragraph of thought rather than a quarter of work.

### 📉 "The realtime gap narrowed"

It was once decisive. Supabase realtime and plain WebSockets closed much of it — though Firebase **offline** is still genuinely ahead, and for mobile that alone can decide it.

### 🔀 "You can mix"

Firebase Auth with your own backend is common and sensible.

**Why this sticks:** "not because you would rather not write a backend" *names the bad reason people actually choose it for*. Ruling out the wrong motivation is more useful than listing the right ones.`,
    tricksHi: `### ❓ "Kya aapke data mein rishte hain?"

Wo sawaal jo faisla karta hai. Users ke orders hote hain, orders mein items — aur **zyadatar application data relational hai**.

Relational data ke liye document database matlab har screen par, hamesha, haath se joins dobara banana. Firebase projects ke asahaj hone ki sabse aam wajah yahi hai, aur ye mahinon baad dikhti hai.

### ✅ "Firebase kisi cheez KE LIYE chuno"

Realtime केंद्र mein, offline matter karta ho, mobile-first, chhoti team, data gehra relational na ho. Ye asli khoobiyan hain.

**Bolo:** *"Isliye nahi ki aap backend nahi likhna chahte."*

### 🚪 "Lock-in asamaan hai"

Firebase se hatna **rewrite** hai — rules, queries aur SDK calls sab proprietary.
Supabase se hatna zyadatar **Postgres migration** hai — chala hua rasta.

Ise pehle din tolo, jab wo ek paragraph ki soch hai, teen mahine ka kaam nahi.

### 📉 "Realtime ka faasla kam hua"

Ye kabhi nirnayak tha. Supabase realtime aur simple WebSockets ne kaafi paat diya — halanki Firebase ka **offline** ab bhi sach mein aage hai, aur mobile ke liye wo akela faisla kar sakta hai.

### 🔀 "Aap mila sakte ho"

Firebase Auth ke saath apna backend aam aur samajhdaar hai.

**Ye kyun tikta hai:** "isliye nahi ki aap backend nahi likhna chahte" *us buri wajah ka naam leta hai jiske liye log ise sach mein chunte hain*. Galat wajah kaat dena sahi wajahein ginane se zyada kaam ka hai.`,
  },
};
