import type { SimpleExplanation } from './topics-simple';
import type { TopicTricks } from './topics-tricks';

/**
 * Beginner explanations and memory hooks for deployment, security and schema.
 *
 * These three categories are where experienced people accidentally write for
 * other experienced people, because the subject matter is genuinely operational
 * — so the simple layer here works harder than usual to stay concrete.
 *
 * The tricks lean on consequence rather than mechanism. In this material the
 * thing worth remembering is almost never "how" but "what happens if you get it
 * wrong", and consequences are what the brain keeps.
 */

export const SIMPLE_OPS: Record<string, SimpleExplanation> = {
  /* ───────────────────────────── Deployment ───────────────────────────── */

  'deploy-what-deployment-means': {
    simple: `**Think of moving a kitchen from your home to a restaurant.**

At home everything works. You know where the knife is, your oven runs slightly hot, and you have that one pan.

Move to a professional kitchen and none of that is true. Different oven, different pans, and now sixty people are waiting.

Deploying is that move. Three steps:

1. **Pack** — turn your work into a box that can travel
2. **Ship** — get the box to the restaurant
3. **Run** — unpack it and start cooking, with *that* kitchen's equipment

**"But it worked at home"** is not an excuse — it is a description of the actual problem. Your home kitchen and the restaurant are different, and every difference is somewhere a dish can go wrong at the worst moment.

**Two habits fix most of it**

**Bring your own equipment.** If you pack the oven along with the recipe, the oven behaves the same everywhere. That is what containers do.

**Pack once.** Do not repack the box for each restaurant. Whatever you tested is exactly what should arrive — otherwise you tested one thing and served another.

**And one more thing**

Cooking is only part of it. You also need someone to relight the stove if it goes out, a way to hear complaints, and a way to put yesterday's menu back if today's is a disaster.

Without those, you have food. You do not have a restaurant.

**Remember:** pack once, bring your own equipment, and have a way back.`,
    simpleHi: `**Rasoi ko ghar se restaurant le jaana socho.**

Ghar par sab chalta hai. Aapko pata hai chaaku kahan hai, aapka oven thoda zyada garam hota hai, aur wo ek khaas kadhai hai.

Professional rasoi mein jao aur inme se kuch bhi sach nahi. Alag oven, alag bartan, aur ab saath log intezaar kar rahe hain.

Deploy karna wahi shift hai. Teen kadam:

1. **Pack** — apne kaam ko aise dibbe mein daalo jo safar kar sake
2. **Ship** — dibba restaurant tak pahunchao
3. **Run** — khol kar pakana shuru karo, *us* rasoi ke saamaan se

**"Par ghar par to chal raha tha"** bahana nahi hai — wo asli samasya ka hulia hai. Aapki ghar ki rasoi aur restaurant alag hain, aur har farak wo jagah hai jahan sabse bure waqt par khana bigad sakta hai.

**Do aadatein zyadatar theek kar deti hain**

**Apna saamaan saath le jao.** Recipe ke saath oven bhi pack karo, to oven har jagah ek jaisa chalega. Containers yahi karte hain.

**Ek baar pack karo.** Har restaurant ke liye dibba dobara mat bharo. Jo aapne test kiya, theek wahi pahunchna chahiye — warna test kuch kiya aur parosa kuch aur.

**Aur ek baat**

Pakana sirf ek hissa hai. Aapko koi chahiye jo chulha bujhne par dobara jalaye, shikayat sunne ka rasta chahiye, aur aaj ka menu tabaahi ho to kal ka wapas laane ka tareeka chahiye.

Inke bina aapke paas khana hai. Restaurant nahi.

**Yaad rakho:** ek baar pack karo, apna saamaan le jao, aur wapas jaane ka rasta rakho.`,
  },

  'deploy-where-to-host': {
    simple: `**Where should your restaurant be?**

Five choices, and each one is really a question about *how much work you want to do yourself*.

**1. Rent a table in a food court.** They handle electricity, cleaning, security. You just cook.
Expensive per plate. You start today.

**2. Pay per dish cooked.** No rent at all — you are only charged when someone orders. Wonderful when nobody comes.
But the stove is cold between orders, so the first dish after a quiet spell is slow. And there is a limit on how long you can cook one thing.

**3. Rent an empty shop.** Cheapest by a long way. It is also empty — you install everything, you fix the plumbing, and when something breaks at 2am, the person who gets the call is you.

**4. Rent a kitchen with staff.** Somewhere in between.

**5. Build a chain with a logistics department.** Genuinely powerful, and it needs a full-time person just to run it. For one restaurant, this is how you end up managing a chain instead of cooking.

**The question nobody asks and everybody should**

Not *"which is cheapest?"* but **"who gets woken up, and do we have that person?"**

The empty shop is a quarter of the price. It also costs you a day a week and your sleep. If you count your own time, it may not be cheaper at all.

**The honest answer for most people:** rent the table, or rent the shop if someone genuinely enjoys plumbing. Almost nobody needs the logistics department.

**Remember:** you are not choosing a price. You are choosing how much of the building is your problem.`,
    simpleHi: `**Aapka restaurant kahan hona chahiye?**

Paanch chunaav, aur har ek asal mein ye sawaal hai ki *aap khud kitna kaam karna chahte ho*.

**1. Food court mein ek table kiraye par.** Bijli, safai, suraksha wo sambhalte hain. Aap bas pakate ho.
Har plate mehngi. Aap aaj hi shuru kar dete ho.

**2. Har banaye gaye dish ka paisa.** Kiraya bilkul nahi — paisa tabhi lagta hai jab koi order kare. Jab koi na aaye tab shandar.
Par orders ke beech chulha thanda rehta hai, isliye khaali waqt ke baad pehla dish dheema hota hai. Aur ek cheez kitni der pakayi ja sakti hai, uski seema hai.

**3. Khaali dukaan kiraye par.** Bade antar se sabse sasti. Wo khaali bhi hai — sab aap lagate ho, plumbing aap theek karte ho, aur raat 2 baje kuch toote to phone aapko aata hai.

**4. Staff wali rasoi kiraye par.** Beech ka kuch.

**5. Logistics department ke saath chain khado.** Sach mein shaktishali, aur ise chalane ke liye poore samay ka ek insaan chahiye. Ek restaurant ke liye, isi tarah aap pakane ki jagah chain sambhalne lagte ho.

**Wo sawaal jo koi nahi poochhta aur sabko poochhna chahiye**

*"Sabse sasta kaunsa hai?"* nahi, balki **"kise uthaya jayega, aur kya hamare paas wo insaan hai?"**

Khaali dukaan chauthai daam ki hai. Wo aapka hafte ka ek din aur aapki neend bhi leti hai. Apna waqt gino, to shayad wo sasti hai hi nahi.

**Zyadatar logon ke liye imaandar jawab:** table kiraye par lo, ya dukaan tab jab kisi ko sach mein plumbing pasand ho. Logistics department lagbhag kisi ko nahi chahiye.

**Yaad rakho:** aap daam nahi chun rahe. Aap ye chun rahe ho ki building ka kitna hissa aapki samasya hai.`,
  },

  'deploy-config-and-secrets': {
    simple: `**Two kinds of note you carry.**

**Settings** — which shop, what time it opens, which colour the sign is. Boring, and different at each branch.

**Keys** — the actual keys to the safe.

Both are "things the app needs". They are not the same, and mixing them is how bad days start.

**Why settings must not be written inside the machine**

If the shop's address is welded onto the machine, moving the machine means rebuilding it. Keep settings on a card you slot in, and the same machine works at every branch.

**Three rules about keys**

**Never in the shared notebook.** Once a key is written in the notebook everyone copies, it is out. Crossing it out does nothing — the copies already exist.

**Never on the shopfront.** Anything the customer can see is public. There is no such thing as a secret written where visitors can read it — and that includes anything sent to their browser.

**If a key leaks, change the lock.** Not "delete the page it was written on". The lock. That is the only thing that actually helps, and it feels excessive right up until the moment it turns out not to be.

**One habit worth having**

Check every setting **the moment you open**, not when the first customer asks for something.

A shop that refuses to open because the safe key is missing is a good outcome. A shop that opens, looks fine, and fails in front of a customer is not.

**Remember:** settings on a card, keys never written down where others can copy them, and if one leaks — change the lock.`,
    simpleHi: `**Do tarah ke parche jo aap saath rakhte ho.**

**Settings** — kaunsi dukaan, kab khulti hai, board ka rang kya hai. Boring, aur har branch par alag.

**Chaabiyan** — tijori ki asli chaabiyan.

Dono "wo cheezein hain jo app ko chahiye". Ye ek nahi hain, aur inhe ghula dena bure din ki shuruaat hai.

**Settings machine ke andar kyun nahi likhni chahiye**

Dukaan ka pata machine par welding se laga do, to machine hilane ka matlab hai use dobara banana. Settings ek card par rakho jo slot mein lagta hai, aur wahi machine har branch par chal jayegi.

**Chaabiyon ke teen niyam**

**Saanjhi copy mein kabhi nahi.** Ek baar chaabi us copy mein likh di jise sab copy karte hain, to wo bahar ja chuki. Use kaatne se kuch nahi hota — copies pehle hi ban chuki hain.

**Dukaan ke aage kabhi nahi.** Jo customer dekh sakta hai wo sarvajanik hai. Jahan aane wale padh sakein wahan likha "raaz" hota hi nahi — aur ismein wo sab bhi hai jo unke browser tak jata hai.

**Chaabi leak ho jaye to taala badlo.** "Wo panna phaad do" nahi. Taala. Sirf yahi sach mein kaam aata hai, aur ye zyada lagta hai theek us pal tak jab pata chalta hai ki nahi tha.

**Ek rakhne layak aadat**

Har setting **kholte hi** jaancho, pehle customer ke maangne par nahi.

Wo dukaan jo tijori ki chaabi na hone par khulne se mana kar de, achha natija hai. Wo dukaan jo khul jaye, theek dikhe, aur customer ke saamne fail ho — nahi.

**Yaad rakho:** settings card par, chaabiyan wahan kabhi nahi jahan doosre copy kar sakein, aur ek leak ho jaye to taala badlo.`,
  },

  'deploy-ci-cd': {
    simple: `**A conveyor belt with checkpoints.**

Every time someone changes something, it goes on the belt and passes a series of inspectors before it reaches customers.

**Put the fast inspectors first.**

The one who checks spelling takes two seconds. The one who cooks the dish and tastes it takes five minutes. Obviously the speller goes first — otherwise you wait five minutes to be told about a typo.

**Two things make a belt useless**

**Too slow.** If it takes half an hour, people stop waiting and start walking round it. Now you have a belt nobody uses and a false sense of safety.

**Unreliable.** If an inspector fails things randomly, everyone learns to just press "check again" until it passes. And on the day something is genuinely wrong, they press "check again".

That second one is worse than having no inspector, because it *trains* people to ignore the alarm.

**The belt must not be optional**

If someone can carry the dish past the inspectors when they are in a hurry, then the inspection is a suggestion. And people are always in a hurry exactly when it matters.

**The bit that surprises people**

While you swap the old dish for the new one, **both are on the counter at the same time**. For a few minutes, some customers get the old one and some get the new.

That is fine — unless you also changed what the plates look like. Then half your customers get food on a plate that no longer exists.

**Remember:** fast checks first, and never let anyone walk round the belt.`,
    simpleHi: `**Checkpoints wala conveyor belt.**

Jab bhi koi kuch badalta hai, wo belt par jata hai aur customers tak pahunchne se pehle kai inspectors se guzarta hai.

**Tez inspectors pehle rakho.**

Spelling dekhne wala do second leta hai. Dish pakane aur chakhne wala paanch minute. Zaahir hai spelling wala pehle — warna typo ka pata chalne mein paanch minute lagenge.

**Do cheezein belt ko bekaar kar deti hain**

**Bahut dheema.** Aadha ghanta lage to log intezaar chhod kar uske bagal se nikalne lagte hain. Ab aapke paas wo belt hai jise koi use nahi karta aur suraksha ka jhoota ehsaas.

**Bharosemand nahi.** Koi inspector kabhi bhi fail kar de, to sab "dobara jaancho" dabana seekh jate hain. Aur jis din sach mein kuch galat hota hai, us din bhi wo "dobara jaancho" dabate hain.

Doosri baat inspector na hone se buri hai, kyunki ye logon ko alarm nazarandaz karna *sikha* deti hai.

**Belt optional nahi honi chahiye**

Agar koi jaldi mein dish ko inspectors ke bagal se le ja sakta hai, to jaanch sirf sujhav hai. Aur logon ko jaldi theek tab hoti hai jab ye sabse zyada matter karta hai.

**Wo hissa jo chaunkata hai**

Purani dish ko nayi se badalte waqt **dono ek saath counter par hoti hain**. Kuch minute ke liye kuch customers ko purani milti hai aur kuch ko nayi.

Ye theek hai — jab tak aapne plate ki shakal na badli ho. Phir aadhe customers ko us plate par khana milta hai jo ab hai hi nahi.

**Yaad rakho:** tez jaanch pehle, aur kisi ko belt ke bagal se mat nikalne do.`,
  },

  'deploy-zero-downtime': {
    simple: `**Changing the tyres without stopping the car.**

You want to update the shop while people are still buying things. Nobody should see a "closed" sign.

The way it works: open the new counter, check it is actually ready, send customers there, and only then close the old one — after it finishes serving whoever is already standing at it.

**That last bit is the part people skip.** If you shut the old counter while someone is mid-purchase, they lose their order. Let it finish, then close it.

**Now the thing that catches everyone**

For a few minutes, **the old counter and the new counter are both open.** Some customers are at each.

That is fine when you have only changed the food. It is a disaster when you have changed **the forms**.

Say you rename a box on the order form. The moment you print the new forms, the old counter — still serving people — is looking for a box that no longer exists. Every single one of its customers fails, until it closes.

**So you do it in four small steps instead**

1. **Add** the new box. Nobody uses it yet, nothing breaks.
2. **Fill in both** boxes for a while.
3. **Start reading** the new box. If this goes wrong, step back — the old box is still filled in.
4. **Remove** the old box, once nothing looks at it.

Slower, and each step is individually safe. That is the trade.

**One more nice trick**

Bring the new dish in with a switch that starts turned off. If it goes wrong, you flick the switch — you do not have to redo the whole changeover in a panic.

**Remember:** both counters are open at once. Never move a box while someone is still looking for it.`,
    simpleHi: `**Gaadi roke bina tyre badalna.**

Aap dukaan update karna chahte ho jab log abhi bhi kharid rahe hain. Kisi ko "band hai" ka board nahi dikhna chahiye.

Tareeka: naya counter kholo, jaancho ki wo sach mein taiyar hai, customers ko wahan bhejo, aur tabhi purana band karo — uske baad jab wo apne saamne khade logon ko nipta le.

**Aakhri baat wahi hai jise log chhod dete hain.** Kisi ki kharidari ke beech purana counter band kar diya, to uska order chala gaya. Use poora hone do, phir band karo.

**Ab wo cheez jo sabko pakadti hai**

Kuch minute ke liye **purana aur naya, dono counter khule hote hain.** Kuch customers har ek par hain.

Ye theek hai jab aapne sirf khana badla ho. Ye tabaahi hai jab aapne **form** badle hon.

Maano aapne order form ka ek khaana rename kar diya. Naye form chhapte hi purana counter — jo abhi bhi logon ko nipta raha hai — aisa khaana dhoondh raha hai jo hai hi nahi. Uske har customer ka kaam fail hota hai, jab tak wo band na ho.

**Isliye aap ise chaar chhote kadamon mein karte ho**

1. Naya khaana **jodo**. Abhi koi use nahi karta, kuch nahi toot ta.
2. Kuch der **dono khaane bharo**.
3. Naye khaane ko **padhna shuru karo**. Kuch bigde to peeche hato — purana khaana abhi bhi bhara hai.
4. Purana khaana **hatao**, jab koi use dekhta hi na ho.

Dheema, aur har kadam apne aap mein surakshit. Yahi sauda hai.

**Ek aur achha tareeka**

Nayi dish aise switch ke saath laao jo band shuru hota hai. Kuch bigde to switch palat do — poora badlav ghabra kar dobara nahi karna padta.

**Yaad rakho:** dono counter ek saath khule hain. Jise koi abhi dhoondh raha ho, wo khaana kabhi mat hilao.`,
  },

  'deploy-observability': {
    simple: `**You cannot fix what you cannot see.**

Three ways of watching a shop:

- **A diary** — write down what happened. *"3:14, customer asked for a refund."*
- **A dashboard** — numbers over time. How many customers, how many complaints, how long the queue is.
- **A trail** — following one customer through the whole shop.

**The one habit worth more than the rest**

**Give every customer a ticket number, and write that number on everything.**

Then when someone says *"something went wrong at about half two"*, you look up one number instead of reading the entire afternoon.

**Never write down secrets.** The diary is kept for months and read by people who were not there. Card numbers and passwords do not go in it — ever.

**The number that lies to you**

*"Average wait: two minutes."* Sounds fine.

But that can mean ninety-five people waited thirty seconds and five people waited an hour. The average looks healthy while those five are never coming back.

So look at the **worst** experiences, not the typical one. The typical one is not the one people complain about.

**When should an alarm ring?**

Only when a **person needs to do something right now**.

An alarm for "the kitchen is busy" rings all day. People start ignoring it. Then it rings for a fire and they ignore that too.

Ring the alarm for *"customers are being turned away"* — something someone actually feels. Everything else is a note in the diary.

**Remember:** ticket numbers on everything, watch the worst case, and only ring the bell when someone must act.`,
    simpleHi: `**Jo dikh nahi raha use theek nahi kar sakte.**

Dukaan dekhne ke teen tareeke:

- **Diary** — kya hua wo likho. *"3:14, customer ne refund maanga."*
- **Dashboard** — samay ke saath numbers. Kitne customers, kitni shikayat, line kitni lambi.
- **Peecha** — ek customer ka poori dukaan mein safar.

**Wo ek aadat jo baaki sabse zyada keemti hai**

**Har customer ko ticket number do, aur wo number har cheez par likho.**

Phir jab koi kahe *"dhai baje ke aas-paas kuch gadbad hui"*, to aap poori dopahar padhne ki jagah ek number dhoondh lete ho.

**Raaz kabhi mat likho.** Diary mahinon rakhi jati hai aur unhe padhi jati hai jo wahan the hi nahi. Card number aur passwords usme kabhi nahi jaate.

**Wo number jo aapse jhoot bolta hai**

*"औsat intezaar: do minute."* Theek lagta hai.

Par iska matlab ye ho sakta hai ki pachanve logon ne tees second ruke aur paanch logon ne ek ghanta. औsat theek dikhta hai jabki wo paanch kabhi wapas nahi aane wale.

Isliye **sabse bure** tajurbe dekho, aam wala nahi. Shikayat aam wale par nahi hoti.

**Alarm kab bajna chahiye?**

Sirf tab jab **kisi insaan ko abhi kuch karna ho**.

"Rasoi vyast hai" wala alarm din bhar bajta hai. Log use nazarandaz karne lagte hain. Phir wo aag ke liye bajta hai aur wo use bhi nazarandaz kar dete hain.

Alarm us baat par bajao ki *"customers ko wapas bheja ja raha hai"* — jo kisi ko sach mein mehsoos hota hai. Baaki sab diary mein ek note hai.

**Yaad rakho:** har cheez par ticket number, sabse bura haal dekho, aur ghanti tabhi bajao jab kisi ko kuch karna ho.`,
  },

  'deploy-migrations-in-production': {
    simple: `**Rearranging the shelves while the shop is full.**

At home you have twelve books. Moving them takes a second.

The shop has fifty thousand. And while you are moving them, **nobody else can reach the shelf** — every customer stands and waits.

That is the whole problem. On your own computer, changing the shape of your data is instant. On the real thing, with real amounts of data, the same change can lock the shelf for minutes — and every customer is stuck behind you.

**The part that catches people out**

Even *waiting* to start is a problem.

If someone else is at the shelf when you arrive, you queue. And everyone who arrives after you queues **behind you**. So a change that has not even started yet can bring the shop to a stop.

The fix: **give up quickly.** Tell yourself "if I cannot get to the shelf in three seconds, I will come back later". A change that gives up is a small annoyance. A change that waits is a closed shop.

**Do it in small safe pieces**

Want every book to have a label, and none may be blank?

Do not do it in one go. **Add** the empty label. **Fill them in a few hundred at a time**, with pauses so others can reach the shelf. **Then** make the rule that none may be blank — which is now instant, because they are all already filled.

**Two rules that save you**

**Never edit a change you already made.** Write a new one. Otherwise your notes and the actual shelves quietly disagree, and nobody finds out until something falls over.

**Know how long putting it all back takes.** Not "we have a copy" — *how many hours* to restore it. That number is your real worst case, and most people have never measured it.

**Remember:** small pieces, pauses in between, and give up fast rather than blocking the queue.`,
    simpleHi: `**Bhari dukaan mein shelves dobara lagana.**

Ghar par aapke paas barah kitaabein hain. Unhe hilane mein ek second lagta hai.

Dukaan mein pachas hazaar hain. Aur jab tak aap hila rahe ho, **koi aur us shelf tak nahi pahunch sakta** — har customer khada intezaar karta hai.

Poori samasya yahi hai. Apne computer par data ki shakal badalna turant hota hai. Asli cheez par, asli maatra ke saath, wahi badlav shelf ko kai minute lock kar sakta hai — aur har customer aapke peeche atka hai.

**Wo hissa jo logon ko fasata hai**

*Shuru karne ka intezaar* bhi samasya hai.

Aap pahunche aur koi aur pehle se shelf par hai, to aap line mein lagte ho. Aur aapke baad aane wala har koi **aapke peeche** lagta hai. To wo badlav jo shuru bhi nahi hua, dukaan rok sakta hai.

Hal: **jaldi haar maan lo.** Khud se kaho "teen second mein shelf tak nahi pahuncha to baad mein aaunga". Haar maan lene wala badlav chhoti chidh hai. Intezaar karne wala badlav band dukaan hai.

**Chhote surakshit tukdon mein karo**

Chahte ho har kitaab par label ho, aur koi khaali na ho?

Ek saath mat karo. Khaali label **jodo**. **Kuch sau ek baar mein bharo**, beech mein ruk kar taaki doosre shelf tak pahunch sakein. **Phir** niyam banao ki koi khaali na ho — jo ab turant hai, kyunki sab pehle se bhare hain.

**Do niyam jo bachate hain**

**Jo badlav kar chuke use kabhi mat badlo.** Naya likho. Warna aapke notes aur asli shelves chupchaap alag ho jate hain, aur kuch girne tak kisi ko pata nahi chalta.

**Jaano ki sab wapas rakhne mein kitna waqt lagta hai.** "Hamare paas copy hai" nahi — *kitne ghante* lagenge. Wahi number aapka asli sabse bura haal hai, aur zyadatar logon ne use kabhi naapa hi nahi.

**Yaad rakho:** chhote tukde, beech mein viraam, aur line rokne ki jagah jaldi haar maan lo.`,
  },

  'deploy-scaling-and-cost': {
    simple: `**The shop is busy. What do you do?**

Most people's first instinct is "open another shop". That is usually the **fourth** best answer.

**Try these in order:**

1. **Find out what is actually slow.** Watch. Is it the till? The kitchen? One dish everyone orders? Guessing is expensive and usually wrong.
2. **Fix the slow thing.** Astonishingly often it is one item nobody organised — the equivalent of the popular product being kept in the back room.
3. **Keep the popular thing near the counter** so you stop walking to the back.
4. **Get a bigger shop.** One decision, no new complexity.
5. **Then**, if you must, open a second shop — and now you need to keep them in step, which is its own job.

**Bills people do not expect**

- **Delivery out.** You budgeted for stock coming in. Sending things *out* is charged too, and it is the line that surprises people in their first busy month.
- **Space you booked for your busiest hour**, sitting empty the other twenty-three.
- **Keeping every receipt forever** — storage is not free, and nobody reads a receipt from three months ago.
- **Your own time.** A cheaper shop that costs you a day a week is not cheaper.

**One thing to set up today**

Ask to be told when the bill goes above what you expected.

Not a limit — a **message**. The way this goes wrong is quiet: something loops, or one query starts scanning everything, and it charges you for a week before anyone notices.

**The mistake worth avoiding**

Building for a thousand customers a day when you have ten. It costs money now, there is more to go wrong now, and it defends against a crowd that may never arrive.

**Remember:** find the slow thing before you buy anything, and ask to be told when the bill moves.`,
    simpleHi: `**Dukaan par bheed hai. Aap kya karoge?**

Zyadatar logon ka pehla vichaar hota hai "doosri dukaan kholo". Wo aksar **chautha** sabse achha jawab hota hai.

**Isi kram mein aazmao:**

1. **Pata karo sach mein dheema kya hai.** Dekho. Till? Rasoi? Wo ek dish jo sab maangte hain? Andaza mehnga hai aur aksar galat.
2. **Dheemi cheez theek karo.** Hairaan karne wali baat: aksar wo ek cheez hoti hai jise kisi ne jamaya hi nahi — jaise lokpriya saamaan peechhe wale kamre mein rakha ho.
3. **Lokpriya cheez counter ke paas rakho** taaki peeche chalna band ho.
4. **Badi dukaan lo.** Ek faisla, koi nayi uljhan nahi.
5. **Phir**, agar zaroori ho, doosri dukaan kholo — aur ab dono ko saath rakhna padta hai, jo apne aap mein ek kaam hai.

**Wo bill jinki ummeed nahi hoti**

- **Bahar bhejna.** Aapne aane wale maal ka budget banaya tha. Cheezein *bahar* bhejne ka bhi paisa lagta hai, aur pehle vyast mahine mein yahi line chaunkati hai.
- **Wo jagah jo aapne sabse vyast ghante ke liye book ki**, baaki teis ghante khaali padi.
- **Har rasid hamesha rakhna** — jagah muft nahi hai, aur teen mahine purani rasid koi nahi padhta.
- **Aapka apna waqt.** Sasti dukaan jo hafte ka ek din leti hai, sasti nahi hai.

**Ek cheez jo aaj set karni chahiye**

Kaho ki bill ummeed se upar jaye to aapko bataya jaye.

Seema nahi — **sandesh**. Ye chupchaap bigadta hai: koi cheez loop mein chalti rehti hai, ya koi query sab kuch chhaanne lagti hai, aur kisi ke dhyan mein aane se pehle hafte bhar paisa le leti hai.

**Wo galti jisse bachna chahiye**

Roz ek hazaar customers ke liye banana jab aapke paas das hain. Abhi paisa lagta hai, abhi bigadne ko zyada hai, aur wo us bheed se bachata hai jo shayad kabhi aayegi hi nahi.

**Yaad rakho:** kuch khareedne se pehle dheemi cheez dhoondho, aur bill hile to bataye jaane ko kaho.`,
  },

  'deploy-incidents-and-rollback': {
    simple: `**Something is on fire. What first?**

**Put it out.** Not "work out why it started". Put it out.

The most common mistake is a clever person standing in a burning kitchen, fascinated by *how* the fire started, while customers cannot get their food.

**The order is:**

1. **Stop the harm.** Put yesterday's version back, turn the new thing off — whatever makes it stop.
2. **Tell people.** *"We know, we are on it."* Costs nothing, and stops a hundred people asking.
3. **Now** work out why.
4. **Write it down**, in the next day or two, while you still remember.

**Going back must be easy**

If putting yesterday's version back is difficult, people will not do it. They will try to fix the new one while it is on fire — and a five-minute problem becomes a two-hour one.

Practise it on a quiet afternoon. Nobody should be learning how to do it at 3am.

**The thing you cannot undo**

You can put yesterday's food back. You **cannot** un-throw-away yesterday's records.

That is why changes to how things are stored are made in tiny careful steps, while changes to the code can be bold — one is reversible and one is not.

**When you write down what happened, do not name who did it**

Not to be nice. For a practical reason: if people expect to be blamed, they stop telling you things. Then you lose the details that would have stopped it happening again.

The useful question is never *"who pressed the button?"* but **"how was it possible for that button to do that?"**

**And one honest question**

*How did we find out?*

If the answer is "a customer told us", the problem is not the fire. It is that you had no smoke alarm.

**Remember:** put it out first, be able to go back, and blame the kitchen, not the cook.`,
    simpleHi: `**Kuch mein aag lagi hai. Pehle kya?**

**Bujhao.** "Pata karo lagi kaise" nahi. Bujhao.

Sabse aam galti ye hai ki koi chalak insaan jalti rasoi mein khada hai, is baat mein magan ki aag lagi *kaise*, jabki customers ko khana nahi mil raha.

**Kram ye hai:**

1. **Nuksaan roko.** Kal ka version wapas lao, nayi cheez band karo — jo bhi ise roke.
2. **Logon ko batao.** *"Hume pata hai, hum dekh rahe hain."* Kuch nahi leta, aur sau logon ka poochhna rok deta hai.
3. **Ab** wajah dhoondho.
4. **Likho**, agle ek-do din mein, jab tak yaad hai.

**Wapas jaana aasan hona chahiye**

Kal ka version wapas laana mushkil hoga to log wo karenge hi nahi. Wo jalti hui nayi cheez ko theek karne ki koshish karenge — aur paanch minute ki samasya do ghante ki ban jayegi.

Kisi shaant dopahar mein abhyas karo. Raat 3 baje koi ye seekh na raha ho.

**Wo cheez jo palti nahi ja sakti**

Aap kal ka khana wapas la sakte ho. Aap kal ke phenke hue records wapas **nahi** la sakte.

Isiliye cheezein kaise rakhi jati hain uske badlav chhote-chhote savdhan kadamon mein hote hain, jabki code ke badlav bold ho sakte hain — ek palta ja sakta hai aur ek nahi.

**Jo hua wo likhte waqt, karne wale ka naam mat likho**

Achha banne ke liye nahi. Ek practical wajah se: log dosh ki ummeed karenge to aapko cheezein batana band kar denge. Phir aap wahi tafseel kho denge jo ise dobara hone se rokti.

Kaam ka sawaal kabhi *"button kisne dabaya?"* nahi hota, balki **"us button ke liye ye karna mumkin kaise tha?"** hota hai.

**Aur ek imaandar sawaal**

*Hume pata kaise chala?*

Jawab "customer ne bataya" hai, to samasya aag nahi hai. Samasya ye hai ki aapke paas smoke alarm tha hi nahi.

**Yaad rakho:** pehle bujhao, wapas jaa sakna zaroori hai, aur dosh rasoi ko do, bawarchi ko nahi.`,
  },

  /* ───────────────────────────── Security ─────────────────────────────── */

  'sec-thinking-about-security': {
    simple: `**Four questions, asked while you build — not after.**

1. **What is worth stealing here?** Money, people's details, or simply your shop being open.
2. **Who would bother?** Mostly nobody in particular — it is a machine trying every door on the street, all day, forever. It will find your shop within hours of you opening.
3. **How would they get in?** Front door, back door, the window someone left open, the delivery driver.
4. **If one lock fails, what then?** Is there a second one, or is that it?

That fourth question is the important one. **Every lock eventually fails.** The question is whether that is a bad afternoon or the end of the business.

**The rule that fixes most beginner mistakes**

**They are not using your front door.**

You designed a nice shop with a counter and a queue and a sign saying "staff only". An attacker sees none of that. They walk straight up to the back wall and try the handle.

So: **hiding a button does nothing.** Greying it out does nothing. Not showing a page does nothing. If the door exists, it must be locked — properly, at the door.

**Give everyone the smallest key that works**

The person who waters the plants does not need the safe key. When someone's key is copied — and eventually one is — the size of that key decides the size of the problem.

**When in doubt, say no.** A lock that opens when it is confused will one day be confused.

**Do not invent your own locks.** Buy one that thousands of people have tried to pick. Yours has been tested by one person, briefly, who already knew the answer.

**Remember:** every lock fails eventually. Ask what is behind it.`,
    simpleHi: `**Chaar sawaal, banate waqt poochhe — baad mein nahi.**

1. **Yahan churane layak kya hai?** Paisa, logon ki tafseel, ya bas aapki dukaan ka khula rehna.
2. **Kaun mehnat karega?** Zyadatar koi khaas nahi — wo ek machine hai jo poori gali ka har darwaza aazma rahi hai, din bhar, hamesha. Aapki dukaan khulne ke ghanton mein wo use dhoondh legi.
3. **Wo andar kaise aayenge?** Aage ka darwaza, peeche ka, wo khidki jo kisi ne khuli chhodi, delivery wala.
4. **Ek taala fail ho jaye to?** Doosra hai, ya bas itna hi tha?

Chautha sawaal zaroori hai. **Har taala kabhi na kabhi fail hota hai.** Sawaal ye hai ki wo ek buri dopahar hai ya dhande ka ant.

**Wo niyam jo zyadatar shuruaati galtiyan theek karta hai**

**Wo aapka aage wala darwaza use nahi kar rahe.**

Aapne counter, line aur "sirf staff" ka board wali achhi dukaan banayi. Hamlawar ko inme se kuch nahi dikhta. Wo seedha peechhe ki deewar tak jaata hai aur handle ghumata hai.

Isliye: **button chhupane se kuch nahi hota.** Use dhundhla karne se kuch nahi hota. Page na dikhane se kuch nahi hota. Darwaza hai to use taala lagna chahiye — theek se, darwaze par.

**Har kisi ko sabse chhoti chaabi do jo kaam kar de**

Paudhon mein paani daalne wale ko tijori ki chaabi nahi chahiye. Jab kisi ki chaabi copy hogi — aur kabhi na kabhi hogi — to us chaabi ka size samasya ka size tay karega.

**Shak ho to mana karo.** Wo taala jo uljhan mein khul jata hai, kisi din uljhan mein padega hi.

**Apne taale mat banao.** Wo khareedo jise hazaaron logon ne kholne ki koshish ki hai. Aapke taale ko ek insaan ne, thodi der, aazmaya hai — aur use jawab pehle se pata tha.

**Yaad rakho:** har taala kabhi na kabhi fail hota hai. Poochho ki uske peeche kya hai.`,
  },

  'sec-https-and-headers': {
    simple: `**Sending a postcard versus a sealed letter.**

On a postcard, everyone who handles it can read it. Worse — and people forget this part — they can **rub something out and write something else**, and you would never know.

That is a website without the padlock. Not just "people can see your password", but "the page you received may not be the page that was sent". Someone on the same wifi can change it on the way.

The padlock gives you three things: nobody can read it, nobody can change it, and you know the letter really came from who it says.

It is free now. There is no reason left not to.

**Then: a few instructions you attach to every letter**

Small notes to the browser, each switching off a whole category of trouble:

- *"Always use the sealed envelope for us, never a postcard — do not even try."*
- *"Only run instructions from people on this list."* This one is the powerful one: even if a stranger slips a note into your page, the browser refuses to follow it.
- *"Do not guess what kind of file this is. I told you."*
- *"Do not let anyone put my shop inside a frame in their shop."* Otherwise they show your real shop behind their invisible window, and customers click *their* buttons thinking they are yours.
- *"Do not tell other websites which page they came from."*

**The good news:** most of these are one line to switch on. The list one takes real work, because it also blocks things you did put there on purpose — so turn it on in "just tell me what would have broken" mode first.

**Remember:** sealed letters, not postcards. Then a few notes that turn off whole categories of trouble.`,
    simpleHi: `**Postcard bhejna aur band lifafa bhejna.**

Postcard ko jo bhi haath lagata hai wo padh sakta hai. Isse bura — aur log yahi hissa bhool jate hain — wo **kuch mita kar kuch aur likh sakte hain**, aur aapko pata bhi nahi chalega.

Taale ke bina website yahi hai. Sirf "log aapka password dekh sakte hain" nahi, balki "jo page aapko mila wo shayad wo hai hi nahi jo bheja gaya tha". Usi wifi par baitha koi use raste mein badal sakta hai.

Taala teen cheezein deta hai: koi padh nahi sakta, koi badal nahi sakta, aur aapko pata hai ki chitthi sach mein usi ki hai jiska naam likha hai.

Ab ye muft hai. Na karne ki koi wajah nahi bachi.

**Phir: kuch nirdesh jo aap har chitthi ke saath lagate ho**

Browser ke liye chhote note, har ek poori ek kism ki musibat band kar deta hai:

- *"Hamare liye hamesha band lifafa, postcard kabhi nahi — koshish bhi mat karo."*
- *"Nirdesh sirf is list ke logon ke maano."* Ye wala shaktishali hai: koi ajnabi aapke page mein parcha ghusa bhi de, to browser use maanne se mana kar deta hai.
- *"Andaza mat lagao ki ye kis kism ki file hai. Maine bata diya."*
- *"Kisi ko meri dukaan apni dukaan ke frame mein mat lagane do."* Warna wo aapki asli dukaan apni adrishya khidki ke peeche dikhate hain, aur customers *unke* button dabate hain ye samajh kar ki aapke hain.
- *"Doosri websites ko mat batao ki wo kis page se aaye."*

**Achhi khabar:** inme se zyadatar ek line mein chalu ho jate hain. List wale mein asli mehnat lagti hai, kyunki wo wo cheezein bhi rok deta hai jo aapne jaan-boojh kar rakhi thi — isliye pehle "bas bata do kya toot ta" wale mode mein chalao.

**Yaad rakho:** postcard nahi, band lifafe. Phir kuch note jo poori-poori kism ki musibat band kar dete hain.`,
  },

  'sec-owasp-top-ten': {
    simple: `**A list of the ten ways shops actually get robbed.**

Not clever, film-style break-ins. The ordinary ones that happen every day.

**The biggest, by a long way:** *"the door was unlocked."* Someone walks in and looks at a customer's file — not because they broke anything, but because **nobody checked whether it was theirs**. This is number one for a reason.

The rest, briefly:

2. **Postcards instead of letters** — sending things in the open, or writing down secrets carelessly.
3. **Letting instructions in through the letterbox** — someone posts a note and your staff follow it as if you had written it.
4. **A bad plan** — the flaw is in the design, not the building. Like a spare key under a mat that everybody knows about.
5. **Left as it came** — default password unchanged, back door propped open, a sign in the window listing what is inside.
6. **A part you bought is faulty** — your building is fine; the lock you installed has a known flaw.
7. **A door anyone can keep trying** — no limit on guesses, so a machine simply tries every combination.
8. **Trusting a delivery you did not check.**
9. **Nobody watching** — the robbery lasted three months because there were no cameras.
10. **Sending your own staff to fetch something** — a customer says "go collect a parcel from this address", and the address is your own storeroom, which they could never reach themselves.

**What is underneath all of them**

Nearly every one is the same mistake: **believing something you were told, or believing a lock cannot be got around.**

And notice that number one — plain, boring, "nobody checked if it was yours" — is the most common. Security is much less exciting than people expect, which is probably why it keeps happening.

**Remember:** the most common robbery is an unlocked door, not a clever thief.`,
    simpleHi: `**Un das tareekon ki list jinse dukaanein sach mein loot ti hain.**

Filmon wali chalak sendh nahi. Wo aam wale jo roz hote hain.

**Sabse bada, bade antar se:** *"darwaza khula tha."* Koi andar aata hai aur kisi customer ki file dekh leta hai — isliye nahi ki usne kuch toda, balki isliye ki **kisi ne jaancha hi nahi ki wo uski hai ya nahi**. Ye number ek wajah se hai.

Baaki, chhote mein:

2. **Chitthi ki jagah postcard** — cheezein khule mein bhejna, ya raaz laparwahi se likh dena.
3. **Letterbox se nirdesh andar aane dena** — koi parcha daal deta hai aur aapka staff use aise maanta hai jaise aapne likha ho.
4. **Buri yojna** — khaami design mein hai, building mein nahi. Jaise chatai ke neeche rakhi extra chaabi jiske baare mein sabko pata hai.
5. **Jaisa aaya waisa chhoda** — default password nahi badla, peeche ka darwaza tika hua khula, khidki par board jisme andar ka saamaan likha hai.
6. **Khareeda hua hissa kharab hai** — aapki building theek hai; jo taala lagaya usme maalum khaami hai.
7. **Aisa darwaza jise koi bhi aazmata reh sake** — andaze ki koi seema nahi, to machine bas har combination aazma leti hai.
8. **Bina jaanche aayi delivery par bharosa.**
9. **Koi dekh hi nahi raha** — chori teen mahine chali kyunki camera the hi nahi.
10. **Apne hi staff ko kuch laane bhejna** — customer kehta hai "is pate se parcel le aao", aur wo pata aapka apna storeroom hai, jahan wo khud kabhi nahi pahunch sakta tha.

**In sabke neeche kya hai**

Lagbhag har ek wahi galti hai: **jo bataya gaya us par bharosa, ya is baat par bharosa ki taala paar nahi kiya ja sakta.**

Aur dhyan do ki number ek — saada, boring, "kisi ne jaancha hi nahi ki ye aapka hai" — sabse aam hai. Security logon ki ummeed se kahin kam romanchak hai, aur shayad isiliye ye hoti rehti hai.

**Yaad rakho:** sabse aam chori khula darwaza hai, chalak chor nahi.`,
  },

  'sec-injection-and-validation': {
    simple: `**Someone writes their name as: "Rahul. Also, empty the safe."**

You read the form aloud to your assistant. Your assistant hears an instruction and empties the safe.

Nothing was hacked. **A form got read out as if it were a command.**

Every injection attack in the world is that one mistake wearing different clothes.

**The fix is not "look for suspicious words"**

You could try to spot dangerous phrases. You will lose — people invent new phrasings faster than you can list them, and you are guessing at someone else's imagination.

The real fix is to **never mix the two channels**. Hand your assistant the instruction and the form **separately**, and tell them: *"this part is the instruction, this part is just a name — whatever it says."*

Now it does not matter what the customer wrote. It can never be an instruction, because it did not arrive on the instruction channel.

**The same trick, three places**

- Asking your records something → keep the question and the values apart
- Running something on the machine → hand over the pieces separately, never one sentence
- Showing something on a page → make sure text is displayed as text, never followed as an instruction

**On checking forms**

**Say what is allowed. Do not try to list what is banned.**

"A number between 1 and 100" is a complete rule. "Anything except these bad words" has holes you have not thought of yet — and someone else has.

**And put a length limit on everything.** Not for neatness: if a box expects a name and someone posts a novel, you have a problem that has nothing to do with what the novel said.

**Remember:** the form is not the instruction. Keep them on separate channels.`,
    simpleHi: `**Koi apna naam likhta hai: "Rahul. Aur haan, tijori khaali kar do."**

Aap form apne sahayak ko padh kar sunate ho. Sahayak use hukum samajh kar tijori khaali kar deta hai.

Kuch hack nahi hua. **Form ko hukum ki tarah padh diya gaya.**

Duniya ka har injection hamla wahi ek galti hai, alag kapdon mein.

**Hal ye nahi hai ki "shakki shabd dhoondho"**

Aap khatarnaak vaakya pakadne ki koshish kar sakte ho. Aap haar jaoge — log aapki list se tez naye tareeke banate hain, aur aap kisi aur ki kalpna ka andaza laga rahe ho.

Asli hal ye hai ki **dono raste kabhi mile hi nahi**. Sahayak ko hukum aur form **alag-alag** do, aur kaho: *"ye hissa hukum hai, ye hissa bas ek naam hai — usme jo bhi likha ho."*

Ab farak nahi padta customer ne kya likha. Wo hukum ban hi nahi sakta, kyunki wo hukum wale raste se aaya hi nahi.

**Wahi tareeka, teen jagah**

- Apne records se kuch poochhna → sawaal aur values alag rakho
- Machine par kuch chalana → tukde alag-alag do, ek vaakya kabhi nahi
- Page par kuch dikhana → pakka karo ki text text ki tarah dikhe, hukum ki tarah maana na jaye

**Form jaanchne par**

**Batao kya allowed hai. Kya mana hai wo ginane ki koshish mat karo.**

"1 se 100 ke beech ka number" poora niyam hai. "In bure shabdon ke alawa kuch bhi" mein wo chhed hain jinke baare mein aapne abhi socha nahi — aur kisi aur ne soch liya hai.

**Aur har cheez par lambai ki seema lagao.** Safai ke liye nahi: agar ek khaane mein naam chahiye aur koi upanyaas bhej de, to aapke saamne wo samasya hai jiska us upanyaas ke likhe se koi lena-dena hi nahi.

**Yaad rakho:** form hukum nahi hai. Dono ko alag raste par rakho.`,
  },

  'sec-rate-limiting-and-abuse': {
    simple: `**One person is allowed to try the lock. A machine is not.**

A human who forgets their PIN tries three or four times. A machine tries **a million**, and it does not get bored, and it never goes home.

So you put a limit on the door: *"five wrong tries and you wait fifteen minutes."*

Suddenly a million attempts would take years. The lock did not change. The **rate** did.

**Not every door needs the same limit**

Asking the time is cheap. Asking for a full printed report costs you real effort. Give the expensive doors a tighter limit — one rule for everything is either too loose for the costly doors or too tight for the free ones.

**The bit that is easy to get wrong**

If you count wrong tries **per person's account**, then anyone can lock *you* out by deliberately failing your login all day. You have handed strangers a button that disables real customers.

If you count **per visitor**, an attacker just uses a thousand different addresses.

So count both together — this visitor, on this account.

**The one that costs real money**

A short code sent to a phone is six digits. That is a million possibilities, which a machine works through in minutes.

Expiring it is not enough. You must also say **"five wrong guesses and this code is dead"**. With that, six digits is safe. Without it, it is decoration.

**Places people forget to put a limit**

Signing up (or you get ten thousand fake customers), "send me that email again" (or you become a spam machine), uploading files (or your storeroom fills up), and anything that costs you money each time you do it.

**Remember:** the lock is fine. Limit how fast it can be tried.`,
    simpleHi: `**Ek insaan ko taala aazmane ki ijazat hai. Machine ko nahi.**

Jo insaan apna PIN bhool jaye wo teen-chaar baar aazmata hai. Machine **das lakh** baar aazmati hai, use bore nahi hota, aur wo ghar nahi jati.

Isliye aap darwaze par seema lagate ho: *"paanch galat koshish aur pandrah minute ruko."*

Achanak das lakh koshishon mein saal lag jayenge. Taala nahi badla. **Raftaar** badli.

**Har darwaze ki seema ek jaisi nahi honi chahiye**

Samay poochhna sasta hai. Poori chhapi hui report maangna asli mehnat leta hai. Mehnge darwazon ko sakht seema do — sab par ek niyam ya to mehnge darwazon ke liye dheela hoga ya muft walon ke liye sakht.

**Wo hissa jo aasani se galat hota hai**

Galat koshishein **har account ke hisaab se** gino, to koi bhi din bhar jaan-boojh kar aapka login fail karke *aapko* bahar kar sakta hai. Aapne ajnabiyon ko wo button de diya jo asli customers band kar deta hai.

**Har aane wale ke hisaab se** gino, to hamlawar hazaar alag pate use kar leta hai.

Isliye dono saath gino — ye aane wala, is account par.

**Wo jiski asli keemat hai**

Phone par bheja gaya code chhah ank ka hota hai. Ye das lakh sambhavnaayein hain, jinhe machine minaton mein nipta deti hai.

Use expire karna kaafi nahi. Aapko ye bhi kehna hoga ki **"paanch galat andaze aur ye code mar gaya"**. Uske saath chhah ank surakshit hain. Uske bina wo sajawat hai.

**Wo jagah jahan log seema lagana bhool jate hain**

Sign up (warna das hazaar nakli customers), "wo email dobara bhejo" (warna aap khud spam machine ban jate ho), file upload (warna storeroom bhar jata hai), aur har wo cheez jiska har baar aapko paisa lagta hai.

**Yaad rakho:** taala theek hai. Ye seemit karo ki use kitni tezi se aazmaya ja sakta hai.`,
  },

  'sec-dependencies-and-supply-chain': {
    simple: `**Most of your shop was built by strangers.**

You wrote a little of it. The rest — the till, the shelves, the lock, the lights — came from other people. And those parts came with *their* parts, from people you have never heard of.

Every one of them is inside your shop, with the same access you have.

**How that goes wrong**

- Someone who makes a popular part has their workshop broken into, and the next batch has something extra in it
- A part is named almost exactly like the popular one — one letter off — and you grabbed the wrong box
- A part that was fine for ten years gets sold to someone new
- **And the one people do not expect:** unpacking a part can *run instructions*. Just opening the box does something.

That last one matters more than it sounds, because the machine that assembles your shop unpacks all of them — and it is holding your keys while it does.

**The habits that actually help**

**Write down exactly which version of each part you used, and install exactly that.** Otherwise today's build quietly uses a slightly different part than the one you tested — and "slightly different" is where surprises live.

**Have someone check the known-faulty list every time**, not once when you remember.

**Take the updates in small regular batches.** A year of skipped updates arrives as one terrifying pile that nobody wants to review.

**Use fewer parts.** Every part is trust handed to a stranger. For four lines of work, write it yourself.

**On the warning list:** not every warning matters. A flaw in a tool you only use while building is very different from a flaw in the front door. Fixing everything blindly teaches people to ignore the list — which is worse than reading it honestly.

**Remember:** you did not build most of your shop. Know what you installed, and keep it current.`,
    simpleHi: `**Aapki dukaan ka zyadatar hissa ajnabiyon ne banaya hai.**

Aapne thoda sa likha. Baaki — till, shelves, taala, batti — doosre logon se aaya. Aur un hisson ke saath *unke* hisse aaye, un logon se jinka naam aapne kabhi suna hi nahi.

Inme se har ek aapki dukaan ke andar hai, utni hi pahunch ke saath jitni aapki hai.

**Ye kaise bigadta hai**

- Kisi lokpriya hissa banane wale ki workshop mein sendh lagti hai, aur agle batch mein kuch extra aa jata hai
- Koi hissa lokpriya wale se lagbhag hoobahoo naam wala hai — ek akshar ka farak — aur aapne galat dibba utha liya
- Jo hissa das saal theek tha wo kisi naye ko bech diya jata hai
- **Aur jiski ummeed nahi hoti:** hissa kholna hi *nirdesh chala sakta hai*. Sirf dibba kholne se kuch ho jata hai.

Aakhri baat sunne se zyada matter karti hai, kyunki jo machine aapki dukaan jodti hai wo un sabko kholti hai — aur us waqt uske paas aapki chaabiyan hoti hain.

**Wo aadatein jo sach mein madad karti hain**

**Likh lo ki har hisse ka theek kaunsa version use kiya, aur bilkul wahi lagao.** Warna aaj ka build chupchaap us hisse se thoda alag use karta hai jo aapne test kiya tha — aur "thoda alag" wahi jagah hai jahan chaunkane wali cheezein rehti hain.

**Har baar kisi se maalum-kharab list jaanchwao**, ek baar jab yaad aaye tab nahi.

**Updates chhote niyamit batch mein lo.** Saal bhar ke chhoote updates ek daravne dher ki tarah aate hain jise koi review nahi karna chahta.

**Kam hisse use karo.** Har hissa kisi ajnabi ko diya gaya bharosa hai. Chaar line ke kaam ke liye khud likh lo.

**Chetavni list par:** har chetavni matter nahi karti. Sirf banate waqt use hone wale auzaar ki khaami aage ke darwaze ki khaami se bahut alag hai. Aankh band karke sab theek karna logon ko list nazarandaz karna sikha deta hai — jo use imaandari se padhne se bura hai.

**Yaad rakho:** aapki dukaan ka zyadatar hissa aapne nahi banaya. Jaano kya lagaya hai, aur use naya rakho.`,
  },

  'sec-file-uploads': {
    simple: `**A stranger hands you a parcel and asks you to keep it.**

This is one of the most dangerous things you can agree to, and it looks completely harmless.

**Three things on the parcel are just… what they wrote**

- **The name on it.** They chose it. It might say "holiday-photo", and it might contain instructions for finding your storeroom.
- **What kind of parcel it says it is.** They wrote that too.
- **What it looks like.** Also them.

So: **open it and look at what is actually inside.** Real things have a recognisable shape at the start — you can tell a photo from a document without trusting the label.

**And use your own name for it.** Never file it under the name they wrote. That name is theirs, and it can be a set of directions.

**The part that actually causes the damage**

You keep the parcel. Later, someone else asks to see it, and you hand it over **from behind your counter**.

Now whatever is inside is standing in your shop, wearing your uniform. It can do things only your staff can do — because as far as everyone is concerned, it came from you.

So hand out other people's parcels **from a different building**, and hand them over **sealed**, so nobody opens them on your premises.

**Two more, quickly**

**Set limits.** No size limit means someone fills your storeroom with one delivery. That is not clever, and it works.

**Check what is written in the margins of photos.** Pictures quietly carry where they were taken. Publish someone's profile picture and you may have published their home address — and they will not have expected that.

**Remember:** open the parcel yourself, rename it yourself, and never hand it out from behind your own counter.`,
    simpleHi: `**Ek ajnabi aapko parcel deta hai aur rakhne ko kehta hai.**

Ye un sabse khatarnaak cheezon mein se ek hai jinki aap haan keh sakte ho, aur ye bilkul seedhi-saadi lagti hai.

**Parcel par teen cheezein bas… unki likhi hui hain**

- **Us par likha naam.** Wo unhone chuna. Us par "chhutti-ki-photo" likha ho sakta hai, aur andar aapke storeroom tak pahunchne ke nirdesh ho sakte hain.
- **Wo kis kism ka parcel hai.** Wo bhi unhone likha.
- **Wo dikhta kaisa hai.** Wo bhi unka.

Isliye: **use kholo aur dekho andar sach mein kya hai.** Asli cheezon ki shuruaat mein ek pehchan wali shakal hoti hai — aap label par bharosa kiye bina photo aur document mein farak kar sakte ho.

**Aur use apna naam do.** Unke likhe naam se kabhi file mat karo. Wo naam unka hai, aur wo raste ka nirdesh ho sakta hai.

**Wo hissa jo sach mein nuksaan karta hai**

Aap parcel rakh lete ho. Baad mein koi aur use dekhna chahta hai, aur aap use **apne counter ke peeche se** dete ho.

Ab andar jo bhi hai wo aapki dukaan mein khada hai, aapki wardi pehne. Wo wo kaam kar sakta hai jo sirf aapka staff kar sakta hai — kyunki sabke hisaab se wo aapki taraf se aaya hai.

Isliye doosron ke parcel **alag building se** do, aur **band** do, taaki koi unhe aapke ahaate mein khole hi nahi.

**Do aur, jaldi se**

**Seema lagao.** Size ki seema nahi, to koi ek hi delivery mein aapka storeroom bhar deta hai. Ye chalaki nahi hai, aur ye chal jata hai.

**Photos ke haashiye par likha dekho.** Tasveerein chupchaap ye le kar chalti hain ki wo kahan li gayi thi. Kisi ki profile picture prakashit karo aur ho sakta hai aapne uska ghar ka pata prakashit kar diya — aur usne ye socha bhi nahi tha.

**Yaad rakho:** parcel khud kholo, khud naam do, aur use apne counter ke peeche se kabhi mat baanto.`,
  },

  'sec-privacy-and-pii': {
    simple: `**The strongest lock is not owning the thing.**

Every detail you collect about a person is something you now have to guard, hand over if they ask, and delete if they insist.

Every detail you **never collected** is none of those things.

So before adding a box to a form, ask what it is *for*. "It might be useful one day" is how businesses end up guarding a room full of things nobody can explain.

**Store the answer, not the raw fact.** Do you need someone's date of birth, or do you need to know they are over eighteen? Keep the second one. It answers the question and it cannot embarrass anyone.

**Set an end date.** Anything with no date on it is kept forever by default. Forever is a long time to be responsible for something.

**Never write personal details in the daily diary.** Logs get kept for months, sent to other companies, and read by people who were not involved. Names, phones, card numbers do not belong there.

**The one people find out about the hard way**

Someone says *"delete everything you have about me."*

You delete their row. Done?

**No.** Their details are also in the backup, the diary, the analytics, the email system, the support tool, and last night's copy. Deleting one row is not deleting.

Which is why it is worth knowing, *before* someone asks, everywhere a person's details actually live.

**One honest exception**

Some records must be kept — a bill has to say what was bought and by whom, and the law often insists. That is a real reason, and it must be a real reason, not "it was easier to keep it".

**Remember:** what you never collected cannot leak, cannot be demanded, and cannot be deleted wrongly.`,
    simpleHi: `**Sabse mazboot taala wo cheez na rakhna hai.**

Kisi insaan ke baare mein aap jo bhi jama karte ho, wo ab aapko bachani hai, maange jaane par deni hai, aur zid karne par mitani hai.

Jo aapne **kabhi jama hi nahi ki**, uske saath inme se kuch nahi karna.

Isliye form mein khaana jodne se pehle poochho ki wo *kis liye* hai. "Kisi din kaam aa sakta hai" wahi tareeka hai jisse dhande us kamre ki rakhwali karne lagte hain jisme rakhi cheezon ka koi jawab hi nahi de sakta.

**Jawab rakho, kaccha tathya nahi.** Aapko kisi ki janm tareekh chahiye, ya ye jaanna hai ki wo atharah se upar hai? Doosra rakho. Wo sawaal ka jawab deta hai aur kisi ko sharminda nahi kar sakta.

**Ek ant ki tareekh rakho.** Jis cheez par tareekh nahi, wo default se hamesha rehti hai. Hamesha kisi cheez ki zimmedari uthana lamba samay hai.

**Rozana ki diary mein nijee tafseel kabhi mat likho.** Logs mahinon rakhe jate hain, doosri companies ko jate hain, aur unhe wo log padhte hain jo shamil the hi nahi. Naam, phone, card number wahan nahi jaate.

**Wo baat jo logon ko mushkil raste se pata chalti hai**

Koi kehta hai *"mere baare mein sab kuch mita do."*

Aap uski row mita dete ho. Ho gaya?

**Nahi.** Uski tafseel backup mein bhi hai, diary mein, analytics mein, email system mein, support tool mein, aur kal raat ki copy mein. Ek row mitana mitana nahi hai.

Isiliye ye *pehle se* jaanna kaam ka hai — kisi ke maangne se pehle — ki kisi insaan ki tafseel sach mein kahan-kahan rehti hai.

**Ek imaandar apwaad**

Kuch records rakhne padte hain — bill mein likha hona chahiye ki kya khareeda aur kisne, aur kanoon aksar iski zid karta hai. Ye asli wajah hai, aur ise asli wajah hona chahiye, "rakhna aasan tha" nahi.

**Yaad rakho:** jo aapne jama hi nahi kiya wo na leak ho sakta hai, na maanga ja sakta hai, na galat mitaya ja sakta hai.`,
  },

  /* ────────────────────────────── Schema ──────────────────────────────── */

  'schema-how-to-model': {
    simple: `**Underline the nouns.**

Read what the thing is supposed to do: *"customers place orders for products."*

Underline the things that exist on their own — **customers**, **orders**, **products**. Those are your drawers. That is genuinely most of the work.

**Then: who points at whom?**

One customer has many orders. So which one holds the connection?

**The pointer always goes on the "many" side.** The order carries "I belong to customer 41". The customer does not carry a list of orders — there could be a thousand.

That one rule settles most of the confusion beginners have here.

**Then: what must always be true?**

- Every order belongs to somebody
- A total is never below zero
- Two people cannot share an email

Write those into the drawers themselves, so nobody can file a form that breaks them — no matter which door they came in through.

**Two questions that catch mistakes early**

**"What happens when this changes?"** A product's price goes up. If last year's receipt just points at "the product's price", every old receipt silently changes to today's price. So the receipt keeps its **own copy of the price from that day**. That is not being wasteful — that is being correct.

**"Can I write down something impossible?"** If a form can say two contradictory things at once, you will one day find one that does.

**Three things that go wrong**

- **One giant drawer** with thirty boxes, most of them empty for most forms
- **Too many drawers**, so answering any question means opening five
- **"a, b, c" written in one box** — you cannot search it, sort it, or count it. If it is a list, it needs its own drawer.

**The test:** try writing down the five questions you will ask most often. If they are painful, the drawers are wrong — and now is much cheaper than later.

**Remember:** underline the nouns, put the pointer on the "many" side, and store the price from that day.`,
    simpleHi: `**Sangya rekhankit karo.**

Padho ki cheez ko karna kya hai: *"customers products ke liye orders dete hain."*

Un cheezon ko rekhankit karo jo apne aap mein hain — **customers**, **orders**, **products**. Yahi aapki darazein hain. Sach mein zyadatar kaam yahi hai.

**Phir: kaun kis par ishara karta hai?**

Ek customer ke kai orders hain. To connection kaun rakhega?

**Ishara hamesha "kai" wali taraf jata hai.** Order rakhta hai "main customer 41 ka hoon". Customer orders ki list nahi rakhta — wo hazaar ho sakte hain.

Yahi ek niyam shuruaat ki zyadatar uljhan khatam kar deta hai.

**Phir: hamesha kya sach hona chahiye?**

- Har order kisi ka hai
- Total kabhi zero se neeche nahi
- Do log ek email saanjha nahi kar sakte

Inhe darazon mein hi likh do, taaki koi aisa form file kar hi na sake jo inhe tode — chahe wo kisi bhi darwaze se aaya ho.

**Do sawaal jo galtiyan jaldi pakadte hain**

**"Ye badle to kya hoga?"** Product ka daam badhta hai. Agar pichhle saal ki rasid bas "product ke daam" par ishara karti hai, to har purani rasid chupchaap aaj ka daam dikhane lagti hai. Isliye rasid **us din ke daam ki apni copy** rakhti hai. Ye fizool kharchi nahi — ye sahi hona hai.

**"Kya main kuch namumkin likh sakta hoon?"** Agar ek form ek saath do virodhi baatein keh sakta hai, to kisi din aisa ek form milega hi.

**Teen cheezein jo bigadti hain**

- **Ek vishaal daraz** jisme tees khaane hain, aur zyadatar forms ke liye zyadatar khaali
- **Bahut zyada darazein**, jisse koi bhi sawaal poochhne ke liye paanch kholni padti hain
- **Ek khaane mein "a, b, c" likhna** — na dhoondh sakte ho, na sort, na gin. Agar wo list hai to uski apni daraz chahiye.

**Jaanch:** wo paanch sawaal likhne ki koshish karo jo aap sabse zyada poochhoge. Wo takleef dein, to darazein galat hain — aur abhi baad se kahin sasta hai.

**Yaad rakho:** sangya rekhankit karo, ishara "kai" wali taraf rakho, aur us din ka daam jama karo.`,
  },

  'schema-keys-and-ids': {
    simple: `**Every record needs a number nobody else has.**

Three ways to hand them out, and the choice is annoyingly hard to change later.

**1. Count upwards: 1, 2, 3…**

Simple, small, easy to read. And it **tells everyone things you did not mean to say.**

If a customer sees they are number 41, they know you have about 41 customers. They can also try 42 and see whose it is. And a competitor can sign up twice a month and work out exactly how fast you are growing, from the gap.

**2. Long random jumbles**

Nobody can guess them and nobody can count them. Better.

But there is a cost people miss: because they are random, each new record files itself in a **random place**. Imagine a filing cabinet where every new sheet goes in a random spot instead of at the back — you are constantly shuffling to make room.

**3. Random-looking, but in order (the modern answer)**

Unguessable *and* each one files at the back. You get the privacy without the shuffling. For a new system, this is usually the right choice.

**Do not use something real as the number**

Email seems perfect — everyone has one, they are unique. Then someone changes theirs, and now every single thing that pointed at them is pointing at nothing.

Use a meaningless number as the identity, and keep "no two people share an email" as a **separate rule**. You get both, and neither breaks the other.

**Decide early.** Changing this after there are records means finding and rewriting every single pointer, everywhere. It is one of the genuinely painful ones.

**Remember:** counting upwards tells people how many you have. Pick something unguessable, but keep it in order.`,
    simpleHi: `**Har record ko ek number chahiye jo kisi aur ke paas na ho.**

Baantne ke teen tareeke, aur chunaav baad mein badalna chidhane ki had tak mushkil hai.

**1. Ginti: 1, 2, 3…**

Simple, chhota, padhne mein aasan. Aur ye **logon ko wo baatein bata deta hai jo aapne kehni hi nahi thi.**

Customer dekhta hai ki wo number 41 hai, to use pata chal jata hai ki aapke lagbhag 41 customers hain. Wo 42 bhi aazma kar dekh sakta hai ki wo kiska hai. Aur pratispardhi mahine mein do baar sign up karke antar se nikaal sakta hai ki aap kitni tezi se badh rahe ho.

**2. Lambe random jumble**

Na koi anuman laga sakta hai na gin sakta hai. Behtar.

Par ek keemat hai jo log chhod dete hain: ye random hain, isliye har naya record **kisi bhi jagah** file ho jata hai. Aisi almari socho jahan har naya panna peeche lagne ki jagah kahin bhi ghus jata hai — aap lagatar jagah banane ke liye khiskaate rehte ho.

**3. Random dikhne wale, par kram mein (aaj ka jawab)**

Anuman se bahar *aur* har ek peeche file hota hai. Niji ta bhi milti hai aur khiskana bhi nahi padta. Naye system ke liye aam taur par yahi sahi chunaav hai.

**Kisi asli cheez ko number mat banao**

Email perfect lagta hai — sabke paas hai, alag hai. Phir koi apna badal leta hai, aur ab us par ishara karti har ek cheez khaali jagah par ishara kar rahi hai.

Pehchan ke liye bemaani number rakho, aur "do logon ka email ek nahi ho sakta" ko **alag niyam** ki tarah rakho. Dono milte hain, aur ek doosre ko todta nahi.

**Jaldi tay karo.** Records aane ke baad ise badalna matlab har ek ishara dhoondh kar dobara likhna, har jagah. Ye sach mein dukhdayi wali cheezon mein se ek hai.

**Yaad rakho:** ginti logon ko bata deti hai ki aapke paas kitne hain. Aisa chuno jiska anuman na lage, par kram mein rahe.`,
  },

  'schema-advanced-relational-patterns': {
    simple: `**What if a note can belong to two different kinds of thing?**

A comment might be on a photo, or on an article. Two different drawers. How do you file it?

**The tempting answer** is to write "photo, number 7" on the comment and leave it there.

It works. And you have just given up the one thing the cabinet was good at: it can no longer check whether photo 7 exists. File a comment on a photo that was deleted years ago, and nothing complains. Ever.

**A better version:** give the comment two slots — "photo" and "article" — and a rule saying **exactly one must be filled**. Now the cabinet can still check both, and it can still catch a pointer to nothing.

**When one kind of thing has several flavours**

Employees and contractors are both people, but only one has a salary.

- **Put them all in one drawer** with a "type" box. Quick, and now most forms have empty boxes, and you cannot say "salary is required — but only for employees".
- **Give each its own drawer**, sharing a common one for what they have in common. Tidier, and you open two drawers instead of one.

**The pattern to avoid**

Someone eventually suggests: *"let us have one drawer that just holds 'thing, property, value', so we can store anything!"*

You have now built a filing cabinet **inside** your filing cabinet. Nothing has a type, no rule can be checked, and answering the simplest question means reassembling every record by hand.

**Trees — categories inside categories**

Start with the simplest: each item just remembers its parent. Reading a whole branch takes a little work; moving something is one change. Only reach for the clever versions when reading branches is genuinely the thing you do all day.

**What all of these share**

Every one trades **the cabinet's ability to check things** for **flexibility**. That is sometimes right. Just know that each time, a rule moves out of the cabinet and into your head — where it will eventually be forgotten.

**Remember:** flexibility is bought with checking. Know what you are spending.`,
    simpleHi: `**Agar ek note do alag kism ki cheezon ka ho sakta ho to?**

Comment photo par ho sakta hai, ya article par. Do alag darazein. Use file kahan karein?

**Lubhavana jawab** ye hai ki comment par "photo, number 7" likh do aur chhod do.

Ye chalta hai. Aur aapne wahi ek cheez chhod di jisme almari achhi thi: ab wo jaanch hi nahi sakti ki photo 7 hai bhi ya nahi. Saalon pehle mit i hui photo par comment file karo, aur koi kuch nahi kehta. Kabhi nahi.

**Behtar roop:** comment ko do slot do — "photo" aur "article" — aur ek niyam ki **theek ek bhara hona chahiye**. Ab almari dono jaanch sakti hai, aur khaali jagah par ishara bhi pakad sakti hai.

**Jab ek kism ki cheez ke kai roop hon**

Employee aur contractor dono insaan hain, par salary sirf ek ki hai.

- **Sabko ek daraz mein** rakho ek "type" khaane ke saath. Jaldi, aur ab zyadatar forms mein khaali khaane hain, aur aap ye keh hi nahi sakte ki "salary zaroori hai — par sirf employees ke liye".
- **Har ek ki apni daraz**, aur jo saanjha hai uske liye ek common. Zyada saaf, aur ek ki jagah do darazein khulti hain.

**Wo pattern jisse bachna chahiye**

Koi na koi kehta hai: *"ek daraz banate hain jisme bas 'cheez, gun, value' rahe, taaki kuch bhi rakh sakein!"*

Aapne apni almari ke **andar** ek aur almari bana li. Kisi cheez ka type nahi, koi niyam jaancha nahi ja sakta, aur sabse simple sawaal ka jawab dene ke liye har record haath se jodna padta hai.

**Trees — categories ke andar categories**

Sabse simple se shuru karo: har cheez bas apna maa-baap yaad rakhti hai. Poori shakha padhne mein thodi mehnat lagti hai; kuch hilana ek badlav hai. Chalak roop tabhi uthao jab shakhaayein padhna sach mein aapka din bhar ka kaam ho.

**In sabme saanjha kya hai**

Har ek **almari ki jaanchne ki kshamta** ko **lachak** ke badle deta hai. Kabhi ye sahi hota hai. Bas jaano ki har baar ek niyam almari se nikal kar aapke dimaag mein aa jata hai — jahan wo kabhi na kabhi bhula diya jayega.

**Yaad rakho:** lachak jaanch ke badle khareedi jati hai. Jaano aap kya kharch kar rahe ho.`,
  },

  'schema-history-and-audit': {
    simple: `**Rubbing something out destroys the answer to a question you have not been asked yet.**

You change an order from "waiting" to "sent". Fine.

Six months later someone asks *"when was this sent?"* — and there is no answer. Not a hard one. **No answer at all.** You rubbed it out.

**Four ways to keep the past, from cheapest to most serious**

**1. Do not actually throw things away.** Instead of removing the form, mark it "cancelled". You can bring it back, and now **every single search must remember to skip the cancelled ones** — and forgetting once, in one place, makes deleted things reappear.

**2. Keep a separate notebook of changes.** *"3:14, Priya changed the price from 200 to 250."* Never edited, only added to. Answers "who did this" without cluttering the main drawer. And a notebook that can be edited proves nothing, so it must be add-only.

**3. Keep every version.** Instead of changing the price, write a new line: *"250, from March onwards"*. Now you can answer "what was the price in February?" — which is a question businesses ask constantly.

**4. Only write down what happened, and work out the current state from it.** Complete history, and a genuinely large amount of work. Right for things that are naturally a sequence of events — money moving, an order's life. A big mistake for an ordinary shop.

**What most people actually need**

Do not throw things away. Keep a notebook for anything sensitive. Keep every version only where someone genuinely asks about the past — prices, contracts, permissions.

**One thing that is not optional**

A receipt must show the name, address and price **from that day**. Not today's. If it looks them up fresh, reprinting last year's receipt shows today's address — which is wrong, and in a lot of places illegal.

**Remember:** rubbing out is permanent. Decide what you will be asked later, before you rub anything out.`,
    simpleHi: `**Kuch mitana us sawaal ka jawab khatam kar deta hai jo abhi poochha hi nahi gaya.**

Aap order ko "intezaar" se "bhej diya" kar dete ho. Theek.

Chhah mahine baad koi poochhta hai *"ye kab bheja gaya tha?"* — aur jawab hai hi nahi. Mushkil jawab nahi. **Koi jawab nahi.** Aapne use mita diya.

**Ateet rakhne ke chaar tareeke, saste se gambhir tak**

**1. Cheezein sach mein phenko mat.** Form hataane ki jagah use "radd" mark karo. Aap use wapas la sakte ho, aur ab **har ek khoj ko radd walon ko chhodna yaad rakhna hoga** — aur ek jagah, ek baar bhoolne par mit i hui cheezein wapas dikhne lagti hain.

**2. Badlavon ki alag copy rakho.** *"3:14, Priya ne daam 200 se 250 kiya."* Kabhi badli nahi jati, sirf usme joda jata hai. "Ye kisne kiya" ka jawab deti hai bina main daraz uljhaye. Aur jis copy ko badla ja sake wo kuch sabit nahi karti, isliye usme sirf jodna hi hona chahiye.

**3. Har version rakho.** Daam badalne ki jagah nayi line likho: *"250, March se aage"*. Ab aap "February mein daam kya tha?" ka jawab de sakte ho — aur dhande ye sawaal lagatar poochhte hain.

**4. Sirf likho ki kya hua, aur usse maujooda haalat nikalo.** Poora itihaas, aur sach mein bahut kaam. Un cheezon ke liye sahi jo swabhav se ghatnaon ka kram hain — paise ka aana-jana, order ka jeevan. Aam dukaan ke liye badi galti.

**Zyadatar logon ko sach mein kya chahiye**

Cheezein phenko mat. Sanvedansheel har cheez ke liye ek copy rakho. Har version sirf wahan rakho jahan koi sach mein ateet ke baare mein poochhta ho — daam, contracts, ijazatein.

**Ek cheez jo optional nahi hai**

Rasid par naam, pata aur daam **us din ka** hona chahiye. Aaj ka nahi. Wo taaza dhoondh kar dikhaye, to pichhle saal ki rasid dobara chhaapne par aaj ka pata dikhega — jo galat hai, aur bahut jagah gair-kanooni.

**Yaad rakho:** mitana hamesha ke liye hai. Kuch mitane se pehle tay karo ki aage kya poochha jayega.`,
  },

  'schema-multi-tenancy': {
    simple: `**One building, many companies, and their files must never mix.**

Three ways to arrange it:

**1. One big room, every file labelled with a company name.**
Cheapest and easiest to run. And the moment somebody fetches files without checking the label, **one company sees another company's paperwork.** That is not a bug you apologise for; that is a bug that ends the business.

**2. A separate locked room for each company, same building.**
Safer. But every time you rearrange the shelving, you have to do it in every room — and at three hundred rooms, that is your whole week.

**3. A separate building for each.**
Safest by far. Also the most expensive, and now you are running a hundred buildings.

**The mistake that matters more than everything else here**

With one big room, **every single time anyone fetches anything, they must check the label.** One person, one time, forgetting — and a customer sees files that are not theirs.

You cannot fix this by asking people to be careful. People are careful right up until the day they are in a hurry.

**So make the room itself refuse.** Set it up so that fetching without saying which company you are gets you **nothing at all**, instead of everything. Now forgetting is a bug you notice immediately, rather than a leak you notice in the news.

**And never let the visitor tell you which company they are.** Work it out from who they signed in as. Otherwise they simply say a different name.

**One small thing that catches people**

"No two customers may share an email" is probably wrong. It should be *"no two customers of the same company"*. Get it globally right and two different companies can never have the same customer — which they will, constantly.

**Remember:** never rely on remembering the label. Make the room refuse to hand anything over without it.`,
    simpleHi: `**Ek building, kai companies, aur unki files kabhi milni nahi chahiye.**

Teen tareeke:

**1. Ek bada kamra, har file par company ka naam.**
Sabse sasta aur chalane mein aasan. Aur jis pal koi bina label dekhe files uthata hai, **ek company ko doosri ke kagaz dikh jate hain.** Ye wo bug nahi jiske liye maafi maang li jaye; ye wo bug hai jo dhanda khatam kar deta hai.

**2. Har company ka apna band kamra, wahi building.**
Zyada surakshit. Par jab bhi shelving badalni ho, har kamre mein badalni padti hai — aur teen sau kamron par wo aapka poora hafta hai.

**3. Har ek ki apni building.**
Bade antar se sabse surakshit. Sabse mehngi bhi, aur ab aap sau buildings chala rahe ho.

**Wo galti jo yahan baaki sabse zyada matter karti hai**

Ek bade kamre mein, **jab bhi koi kuch uthaye, use label dekhna hi hoga.** Ek insaan, ek baar, bhool jaye — aur customer ko wo files dikh jati hain jo uski nahi.

Ise "dhyan rakho" kehne se theek nahi kiya ja sakta. Log dhyan rakhte hain theek us din tak jab unhe jaldi hoti hai.

**Isliye kamre se hi mana karwao.** Aisa set karo ki bina ye bataye ki aap kaunsi company ho, uthane par **kuch bhi nahi** milta, sab kuch nahi. Ab bhoolna wo bug hai jo turant dikhta hai, na ki wo leak jo khabar mein dikhta hai.

**Aur aane wale se kabhi mat poochho ki wo kaunsi company hai.** Ye us se nikalo ki wo kis naam se andar aaya. Warna wo bas doosra naam bata dega.

**Ek chhoti baat jo logon ko pakadti hai**

"Do customers ka email ek nahi ho sakta" shayad galat hai. Hona chahiye *"ek hi company ke do customers ka"*. Ise poori duniya ke liye sakht kar do aur do alag companies ke paas ek hi customer kabhi nahi ho sakta — jo baar-baar hoga.

**Yaad rakho:** label yaad rakhne par kabhi bharosa mat karo. Kamre se hi kehlwao ki bina uske kuch nahi milega.`,
  },

  'schema-nosql-modelling': {
    simple: `**Two ways to organise a kitchen, and both are right.**

**The tidy way:** every ingredient in its own labelled jar. Nothing repeated anywhere. To cook, you fetch from six jars — which is fine, because fetching is quick.

**The ready way:** each dish already prepared on its own tray, with everything it needs on it. Some things appear on several trays. But when an order comes, you hand over one tray.

Ordinary databases are the first. Document databases are the second — because for them, fetching from six places is **slow**, so you arrange things by what gets ordered rather than by what things are.

Neither is more advanced. They are different arrangements for different kitchens.

**How to decide what goes on the tray**

**Put it on the tray** if it is always served with the dish, and there is a sensible limit to how much of it there is. Someone's address goes with the person.

**Keep it in a jar** if it is big, shared between many dishes, or grows forever.

**Say it:** *served together, stored together.*

**The rule that prevents most disasters**

**Never put something on the tray that can grow forever.**

Comments on a post look completely fine with five. At fifty thousand, every tiny change means picking up and putting down an enormous tray — and there is a hard limit on tray size that you will hit.

**A useful middle way**

Keep the item in a jar, but write the two or three things you *always* show onto the tray anyway — the name and the price.

Now you do not fetch for every order. And the price on an old order **should** be the old price, so freezing it is right, not lazy.

**When to admit you chose wrong**

If you are constantly running to six jars anyway, or hand-fixing the same copied fact in a hundred places — this kitchen wanted the tidy arrangement. Noticing that early is worth much more than defending the choice.

**Remember:** arrange by what gets ordered. But never a tray that grows forever.`,
    simpleHi: `**Rasoi jamane ke do tareeke, aur dono sahi hain.**

**Saaf tareeka:** har saamaan apne label wale jar mein. Kahin kuch dohraya nahi. Pakane ke liye aap chhah jar se nikalte ho — jo theek hai, kyunki nikalna jaldi hota hai.

**Taiyar tareeka:** har dish apni tray par pehle se lagi hui, uske saath jo chahiye wo sab us par. Kuch cheezein kai trays par aati hain. Par order aane par aap ek tray pakda dete ho.

Aam databases pehla hain. Document databases doosra — kyunki unke liye chhah jagah se nikalna **dheema** hai, isliye wo cheezon ko unke swabhav se nahi, order ke hisaab se jamate hain.

Koi zyada advanced nahi hai. Ye alag rasoiyon ke liye alag jamawat hain.

**Tray par kya rakhna hai ye kaise tay karein**

**Tray par rakho** agar wo hamesha dish ke saath hi parosa jata hai, aur uski koi samajhdaar seema hai. Kisi ka pata us insaan ke saath jata hai.

**Jar mein rakho** agar wo bada hai, kai dishes mein saanjha hai, ya hamesha badhta rehta hai.

**Bolo:** *saath parosa jata hai to saath rakho.*

**Wo niyam jo zyadatar tabaahiyan rokta hai**

**Aisi cheez tray par kabhi mat rakho jo hamesha badh sakti ho.**

Post par comments paanch par bilkul theek lagte hain. Pachas hazaar par har chhote badlav ka matlab hai ek vishaal tray uthana aur rakhna — aur tray ke size ki ek pakki had hai jis tak aap pahunch hi jaoge.

**Ek kaam ka beech ka rasta**

Cheez jar mein rakho, par jo do-teen baatein aap *hamesha* dikhate ho unhe tray par likh hi lo — naam aur daam.

Ab har order par nikalna nahi padta. Aur purane order par daam **purana hi hona chahiye**, isliye use jamana sahi hai, aalas nahi.

**Kab maan lena chahiye ki chunaav galat tha**

Agar aap waise bhi lagatar chhah jar tak bhaag rahe ho, ya wahi copy ki hui baat sau jagah haath se theek kar rahe ho — to is rasoi ko saaf wali jamawat chahiye thi. Ye jaldi pehchan lena chunaav bachane se kahin zyada keemti hai.

**Yaad rakho:** order ke hisaab se jamao. Par aisi tray kabhi nahi jo hamesha badhti rahe.`,
  },
};

export const TRICKS_OPS: Record<string, TopicTricks> = {
  /* ───────────────────────────── Deployment ───────────────────────────── */

  'deploy-what-deployment-means': {
    tricks: `### 📦 "Pack, ship, run"

Three words, three stages, and different things break in each.

### 🔁 "Build once, promote the same box"

Rebuild per environment and you tested one thing and shipped another. That gap is where the surprise lives.

**Say it:** *"Test what you ship, ship what you tested."*

### 🏠 "Works on my machine" is a diagnosis, not an excuse

It names a real difference: Node version, env vars, installed tools, filesystem. Containers close the gap by shipping the runtime *with* the code.

### ✅ Deployed means more than running

**"Restarts, TLS, logs, health, rollback."**

Five things. Miss any and you have a process that runs, not an application that is deployed.

**Why this sticks:** the five-word checklist is *countable*. "Is it properly deployed?" becomes a question you can answer on your fingers rather than a vague feeling.`,
    tricksHi: `### 📦 "Pack, ship, run"

Teen shabd, teen kadam, aur har ek mein alag cheezein bigadti hain.

### 🔁 "Ek baar build, wahi dibba aage badhao"

Har environment ke liye dobara build karo aur aapne test kuch kiya aur bheja kuch aur. Wahi faasla chaunkane ki jagah hai.

**Bolo:** *"Jo bhejte ho wo test karo, jo test kiya wo bhejo."*

### 🏠 "Mere computer par chalta hai" nidaan hai, bahana nahi

Ye asli farak batata hai: Node version, env vars, lage hue tools, filesystem. Containers runtime ko code ke *saath* bhej kar ye faasla band karte hain.

### ✅ Deploy hone ka matlab chalne se zyada hai

**"Restart, TLS, logs, health, rollback."**

Paanch cheezein. Koi bhi chhooti to aapke paas chalta hua process hai, deploy hui application nahi.

**Ye kyun tikta hai:** paanch-shabd ki list *gini ja sakti hai*. "Kya ye theek se deploy hua hai?" ek dhundhle ehsaas ki jagah ungliyon par ginne wala sawaal ban jata hai.`,
  },

  'deploy-where-to-host': {
    tricks: `### 🛏️ "Who gets woken up?"

The question that actually decides hosting — not the monthly price.

A VPS is a quarter of the cost of a PaaS. It also costs patching, TLS renewal, monitoring, backups and your sleep. Count your own time and the ranking often flips.

**Say it:** *"Cheaper infrastructure, more expensive Tuesdays."*

### 🪜 The five options, in order of burden

**PaaS → serverless → containers → VPS → Kubernetes**

- **PaaS** — ship today, pay per unit
- **Serverless** — free at zero traffic, cold starts, **and it will exhaust your Postgres connections**
- **VPS** — cheapest per unit, you own everything
- **Kubernetes** — a full-time job

### ☠️ "Serverless plus Postgres needs a pooler"

Every cold start opens new connections. Postgres caps out around 100. This catches everyone once, and the fix is PgBouncer.

### ⚖️ The honest default

Most projects should start on a PaaS or one VPS with a managed database, and stay there far longer than the internet suggests.

**Say it:** *"Kubernetes for a two-person team spends the product budget on infrastructure."*

**Why this sticks:** "who gets woken up" reframes a *pricing* question as a *staffing* one — and that reframe is the actual insight, so the hook carries the lesson rather than pointing at it.`,
    tricksHi: `### 🛏️ "Kise uthaya jayega?"

Wo sawaal jo sach mein hosting tay karta hai — mahine ka daam nahi.

VPS PaaS ke chauthai daam ka hai. Wo patching, TLS renewal, monitoring, backups aur aapki neend bhi leta hai. Apna waqt gino aur kram aksar palat jata hai.

**Bolo:** *"Sasta infrastructure, mehnge mangalwaar."*

### 🪜 Paanch vikalp, bojh ke kram mein

**PaaS → serverless → containers → VPS → Kubernetes**

- **PaaS** — aaj ship karo, per unit paisa
- **Serverless** — zero traffic par muft, cold starts, **aur ye aapki Postgres connections khatam kar dega**
- **VPS** — per unit sabse sasta, sab kuch aapka
- **Kubernetes** — poore samay ka kaam

### ☠️ "Serverless aur Postgres ko pooler chahiye"

Har cold start nayi connections kholta hai. Postgres lagbhag 100 par ruk jata hai. Ye sabko ek baar pakadta hai, aur hal PgBouncer hai.

### ⚖️ Imaandar default

Zyadatar projects ko PaaS ya ek VPS aur managed database se shuru karna chahiye, aur wahan internet ke sujhav se kahin lambe tikna chahiye.

**Bolo:** *"Do logon ki team ke liye Kubernetes product ka budget infrastructure par kharch kar deta hai."*

**Ye kyun tikta hai:** "kise uthaya jayega" ek *daam* ke sawaal ko *staffing* ke sawaal mein badal deta hai — aur wahi asli samajh hai, isliye hook seekh ki taraf ishara nahi karta, use saath le kar chalta hai.`,
  },

  'deploy-config-and-secrets': {
    tricks: `### 🔑 "Settings on a card, keys in a safe"

Config differs per environment and comes from the environment. Secrets grant access and never touch git.

### 💀 "A leaked secret is rotated, not deleted"

Removing the commit does nothing. It is in every clone, every fork, and possibly a scraper's database within minutes.

**Say it:** *"Git history is forever."*

### 🚨 "If the browser downloads it, it is public"

\`VITE_\` and \`NEXT_PUBLIC_\` prefixes exist to make that explicit. Anything behind them is published to every visitor.

### 🛑 "Crash at boot, not at the first request"

Parse and validate every env var at startup. A process that refuses to start is a **good** outcome; one that starts broken and fails in front of a user is not.

**Say it:** *"Fail at boot or fail in public."*

**Why this sticks:** "rotate, do not delete" *contradicts the instinct*. The natural reaction to a leaked secret is to remove it, and knowing that the natural reaction is useless is exactly the thing worth encoding.`,
    tricksHi: `### 🔑 "Settings card par, chaabiyan tijori mein"

Config har environment mein alag hoti hai aur environment se aati hai. Secrets pahunch dete hain aur git ko kabhi nahi chhute.

### 💀 "Leak hua secret badla jata hai, mitaya nahi"

Commit hataane se kuch nahi hota. Wo har clone mein hai, har fork mein, aur minaton mein shayad kisi scraper ke database mein.

**Bolo:** *"Git ka itihaas hamesha ka hai."*

### 🚨 "Jo browser download karta hai wo sarvajanik hai"

\`VITE_\` aur \`NEXT_PUBLIC_\` prefix isiliye hain ki ye saaf ho. Unke peeche jo bhi hai wo har aane wale tak prakashit hai.

### 🛑 "Boot par crash karo, pehli request par nahi"

Har env var shuruaat mein parse aur jaancho. Jo process chalne se mana kar de wo **achha** natija hai; jo toota hua chal pade aur user ke saamne fail ho wo nahi.

**Bolo:** *"Boot par fail ho ya sabke saamne."*

**Ye kyun tikta hai:** "badlo, mitao mat" *sahaj pratikriya ke khilaf hai*. Leak hue secret par swabhavik pratikriya use hataana hai, aur ye jaanna ki wo swabhavik pratikriya bekaar hai — yahi jama karne layak baat hai.`,
  },

  'deploy-ci-cd': {
    tricks: `### 🏁 "Cheapest checks first"

Lint and typecheck take seconds; integration tests take minutes. Fail fast, so a typo is reported in thirty seconds rather than eight minutes.

### ⏱️ "Over ten minutes and people route around it"

A slow pipeline stops being a gate and becomes decoration. Speed is a correctness property here, not a nicety.

### 🎲 "A flaky test is worse than no test"

Teams learn to re-run rather than read. Then on the day something is genuinely broken, they re-run.

**Say it:** *"Flaky trains people to ignore."*

### 🚧 "CI that can be bypassed is a suggestion"

Require it before merge, or you are relying on discipline at exactly the moment someone is in a hurry.

### 🔀 The three strategies

- **Rolling** — gradual, two versions live
- **Blue-green** — instant rollback, double infrastructure briefly
- **Canary** — safest, most machinery

**All three run two versions at once.** Fine for code, dangerous for schema.

**Why this sticks:** "flaky trains people to ignore" states the *second-order* effect. The first-order cost of a flaky test is obvious; the reason it is worse than nothing is not, and that is the part worth carrying.`,
    tricksHi: `### 🏁 "Saste check pehle"

Lint aur typecheck second lete hain; integration tests minute. Jaldi fail ho, taaki typo aath minute nahi, tees second mein bataya jaye.

### ⏱️ "Das minute se upar aur log uske bagal se nikalne lagte hain"

Dheemi pipeline gate rehna band kar deti hai aur sajawat ban jati hai. Yahan raftaar sahi hone ka gun hai, sirf suvidha nahi.

### 🎲 "Kabhi bhi fail hone wala test na hone se bura hai"

Teams padhne ki jagah dobara chalana seekh jati hain. Phir jis din sach mein kuch toota hota hai, us din bhi wo dobara chalati hain.

**Bolo:** *"Flaky logon ko nazarandaz karna sikhata hai."*

### 🚧 "Jis CI ko bypass kiya ja sake wo sujhav hai"

Merge se pehle zaroori karo, warna aap theek us pal anushasan par nirbhar ho jab kisi ko jaldi hai.

### 🔀 Teen tareeke

- **Rolling** — dheere-dheere, do version live
- **Blue-green** — turant rollback, kuch der dugna infrastructure
- **Canary** — sabse surakshit, sabse zyada saamaan

**Teeno mein do version ek saath chalte hain.** Code ke liye theek, schema ke liye khatarnaak.

**Ye kyun tikta hai:** "flaky nazarandaz karna sikhata hai" *doosre darje ka* asar batata hai. Flaky test ka pehla nuksaan saaf hai; wo na hone se bura kyun hai ye nahi, aur wahi hissa saath le jaane layak hai.`,
  },

  'deploy-zero-downtime': {
    tricks: `### 👥 "Both versions are live at once"

For seconds or minutes, old and new code serve requests simultaneously. Fine for most changes, **fatal for schema changes**.

That one fact generates every rule in this topic.

### 4️⃣ Renaming a column takes four deploys

**"Add. Write both. Read new. Drop old."**

Four beats. Do it in one and the still-running old version queries a column that no longer exists — and every request it serves fails until it is replaced.

### 🚪 Graceful shutdown, in order

**"Fail health → wait → finish in-flight → close pools → exit."**

The wait matters: the load balancer needs time to notice before the process stops, or traffic arrives at something already shutting down.

**Say it:** *"Stop being chosen before you stop working."*

### 🎚️ Feature flags separate deploy from release

Ship it dark, turn it on gradually, flip it off if it misbehaves — no emergency deploy.

The cost: fifty stale flags make a codebase nobody can reason about. Delete them once decided.

**Why this sticks:** "add, write both, read new, drop old" is a *four-beat sequence you can chant*. Under the pressure of a live rename, a sequence survives where a paragraph of reasoning does not.`,
    tricksHi: `### 👥 "Dono version ek saath live hain"

Kuch second ya minute ke liye purana aur naya code ek saath requests serve karte hain. Zyadatar badlavon ke liye theek, **schema badlav ke liye jaanleva**.

Yahi ek baat is topic ka har niyam banati hai.

### 4️⃣ Column rename mein chaar deploy lagte hain

**"Jodo. Dono mein likho. Naye se padho. Purana hatao."**

Chaar taal. Ek mein karo aur abhi chal raha purana version aise column ko poochhta hai jo hai hi nahi — aur badle jaane tak uski har request fail hoti hai.

### 🚪 Graceful shutdown, kram mein

**"Health fail karo → ruko → chal rahi requests poori karo → pools band → exit."**

Rukna matter karta hai: load balancer ko process rukne se pehle dhyan dena hota hai, warna traffic band ho rahi cheez par pahunchta hai.

**Bolo:** *"Kaam rokne se pehle chuna jana band karo."*

### 🎚️ Feature flags deploy ko release se alag karte hain

Band karke bhejo, dheere-dheere chalu karo, gadbad ho to band kar do — emergency deploy nahi.

Keemat: pachas purane flags aisa codebase bana dete hain jise koi samajh nahi sakta. Faisla hone par unhe hata do.

**Ye kyun tikta hai:** "jodo, dono mein likho, naye se padho, purana hatao" ek *chaar taal ka kram hai jise dohraya ja sakta hai*. Live rename ke dabav mein kram bach jata hai, tark ka paragraph nahi.`,
  },

  'deploy-observability': {
    tricks: `### 🎫 "A request id on every line"

The single highest-value logging habit. A user says "something broke around 14:32" and one id takes you to exactly their requests instead of everyone's afternoon.

### 📊 "Averages lie, percentiles tell"

A 200ms average can hide 5% of users waiting eight seconds. The average is the number that looks healthy while people are leaving.

**Say it:** *"Watch p99, not the mean."*

### 🔔 "Alert on symptoms, not causes"

Error rate — something users feel. Not CPU, which may be entirely fine.

**And every alert must be actionable.** If the response is "yeah, that happens", it is noise — and noise trains people to ignore the page that matters. Alert fatigue is how outages get missed.

### 🩺 Liveness vs readiness

- **Liveness** — alive? If not, **restart**.
- **Readiness** — able to serve? If not, **take out of rotation**, leave running.

Conflate them and a service that lost its database connection gets killed and restarted forever, when it should have been left to recover.

**Say it:** *"Restart the dead, bench the unwell."*

**Why this sticks:** "restart the dead, bench the unwell" is a *contrast pair with parallel grammar*, and the two halves prescribe opposite actions — which is precisely the distinction people get wrong.`,
    tricksHi: `### 🎫 "Har line par request id"

Logging ki sabse keemti aadat. User kehta hai "14:32 ke aas-paas kuch toota" aur ek id seedha uski requests tak le jati hai, sabki dopahar tak nahi.

### 📊 "औsat jhoot bolta hai, percentile sach"

200ms ka औsat ye chhupa sakta hai ki 5% users aath second ruk rahe hain. औsat wahi number hai jo swasth dikhta hai jab log chhod kar ja rahe hote hain.

**Bolo:** *"p99 dekho, औsat nahi."*

### 🔔 "Lakshan par alert, kaaran par nahi"

Error rate — jise users mehsoos karte hain. CPU nahi, jo bilkul theek ho sakta hai.

**Aur har alert par kuch karna banta ho.** Jawab "haan, aisa hota rehta hai" hai to wo shor hai — aur shor logon ko us page ko nazarandaz karna sikha deta hai jo matter karta hai. Alert fatigue se hi outages chhoot jate hain.

### 🩺 Liveness aur readiness

- **Liveness** — zinda hai? Nahi to **restart**.
- **Readiness** — serve kar sakta hai? Nahi to **rotation se hatao**, chalta rehne do.

Inhe ghula do aur jis service ka database connection gaya use maara aur chalaya jata rahega, jabki use sambhalne dena chahiye tha.

**Bolo:** *"Murde ko restart, bimaar ko bench."*

**Ye kyun tikta hai:** "murde ko restart, bimaar ko bench" *samaanaantar vyakaran wala contrast pair* hai, aur dono aadhe ulte kaam batate hain — aur theek yahi farak log galat karte hain.`,
  },

  'deploy-migrations-in-production': {
    tricks: `### 🐘 "Instant on 50 rows, minutes on 50 million"

The whole risk in one sentence. Your laptop tells you nothing about production behaviour here.

### 🚦 "The lock queue is the outage"

A migration waiting for a lock blocks every query behind it. So a slow migration takes your app down **while it waits**, before doing anything at all.

**The fix:** \`lock_timeout\`. A migration that gives up fast is an annoyance; one that queues is an outage.

**Say it:** *"Fail fast beats queue quietly."*

### 🔒 Which operations bite

- \`ADD COLUMN\` nullable — **safe**
- \`CREATE INDEX\` — **locks writes**, use \`CONCURRENTLY\`
- \`ADD COLUMN NOT NULL\` — **rewrites the table**
- \`DROP COLUMN\` — fast, and **breaks the running old version**

### 4️⃣ NOT NULL safely

**"Nullable. Backfill in batches. Validate. Set NOT NULL."**

### ⛔ Two absolutes

**Never edit an applied migration** — your machine and production silently disagree, and nothing tells you until something breaks.

**Know your restore time.** Not "we have backups" — how many *hours*. That is your real worst case, and most people have never measured it.

**Why this sticks:** "the lock queue is the outage" is *counter-intuitive* — the damage happens before the migration does anything. Violated expectations get stored preferentially, which is exactly what you want for a rule this expensive to learn the hard way.`,
    tricksHi: `### 🐘 "50 rows par turant, 5 crore par kai minute"

Poora khatra ek vaakya mein. Yahan aapka laptop production ke bartaav ke baare mein kuch nahi batata.

### 🚦 "Lock ki line hi outage hai"

Lock ka intezaar karti migration apne peeche ki har query rok deti hai. Isliye dheemi migration **intezaar ke dauran hi** app band kar deti hai, kuch karne se pehle.

**Hal:** \`lock_timeout\`. Jaldi haar maanne wali migration chidh hai; line mein lagne wali outage.

**Bolo:** *"Jaldi fail hona chupchaap line mein lagne se behtar hai."*

### 🔒 Kaunse operation kaat te hain

- Nullable \`ADD COLUMN\` — **surakshit**
- \`CREATE INDEX\` — **writes lock karta hai**, \`CONCURRENTLY\` use karo
- \`ADD COLUMN NOT NULL\` — **table dobara likhta hai**
- \`DROP COLUMN\` — tez, aur **chal rahe purane version ko todta hai**

### 4️⃣ NOT NULL surakshit tareeke se

**"Nullable. Batches mein backfill. Validate. NOT NULL set karo."**

### ⛔ Do pakki baatein

**Lagi hui migration kabhi mat badlo** — aapki machine aur production chupchaap alag ho jate hain, aur kuch tootne tak koi nahi batata.

**Apna restore time jaano.** "Hamare paas backups hain" nahi — kitne *ghante*. Wahi aapka asli sabse bura haal hai, aur zyadatar logon ne use kabhi naapa hi nahi.

**Ye kyun tikta hai:** "lock ki line hi outage hai" *ulta lagta hai* — nuksaan migration ke kuch karne se pehle hota hai. Toothi ummeedein pehle jama hoti hain, aur is niyam ko mushkil raste se seekhna itna mehnga hai ki yahi chahiye.`,
  },

  'deploy-scaling-and-cost': {
    tricks: `### 🪜 "Measure. Index. Cache. Bigger. More."

Five words, in order. Most teams start at "more" and skip the first three — which is how you get a distributed system that is still slow.

**Say it:** *"An astonishing share of scaling problems are one missing index."*

### 💸 The bills nobody budgets

**"Egress, idle, logs, your time."**

- **Egress** — data *leaving* the cloud is charged, and it is the line that surprises people in their first busy month
- **Idle** — capacity provisioned for peak, empty the other 23 hours
- **Logs** — retention scales with traffic and can rival compute
- **Your time** — cheaper infrastructure that costs a day a week is not cheaper

### 📉 Sense of proportion

A few hundred requests per second on one decent server with a managed database and a CDN costs **tens** of dollars a month, not thousands. A much bigger bill at that scale means something is misconfigured, not expensive.

### 🔔 "Set a billing alert, not a limit"

The failure mode is quiet: a runaway loop or an unindexed query charging you for a week before anyone notices.

**Why this sticks:** "measure, index, cache, bigger, more" is a *sequence*, and the sequence is the content — doing them out of order is precisely the mistake it prevents.`,
    tricksHi: `### 🪜 "Naapo. Index. Cache. Bada. Zyada."

Paanch shabd, kram mein. Zyadatar teams "zyada" se shuru karti hain aur pehle teen chhod deti hain — aur isi tarah aisa distributed system banta hai jo ab bhi dheema hai.

**Bolo:** *"Scaling ki hairaan karne wali hissedari ek chhoote hue index ki hoti hai."*

### 💸 Wo bill jinka budget koi nahi banata

**"Egress, khaali kshamta, logs, aapka waqt."**

- **Egress** — cloud se data *bahar* jane ka paisa lagta hai, aur pehle vyast mahine mein yahi line chaunkati hai
- **Khaali kshamta** — peak ke liye rakhi, baaki 23 ghante khaali
- **Logs** — retention traffic ke saath badhta hai aur compute ki barabari kar sakta hai
- **Aapka waqt** — sasta infrastructure jo hafte ka ek din leta hai, sasta nahi hai

### 📉 Anupaat ka andaza

Kuch sau request per second, ek theek server, managed database aur CDN par, mahine ke **das-bees** dollar leta hai, hazaaron nahi. Us paimane par kaafi bada bill matlab kuch galat set hai, cheez mehngi nahi.

### 🔔 "Billing alert lagao, limit nahi"

Nakaami chupchaap hoti hai: koi bhaagta loop ya bina index wali query hafte bhar paisa leti rehti hai aur kisi ko pata nahi chalta.

**Ye kyun tikta hai:** "naapo, index, cache, bada, zyada" ek *kram* hai, aur kram hi asli baat hai — inhe ulte kram mein karna theek wahi galti hai jise ye rokta hai.`,
  },

  'deploy-incidents-and-rollback': {
    tricks: `### 🔥 "Put it out, then ask why"

The most common failure is a clever person debugging an interesting problem while users cannot log in.

**The order:** **Mitigate. Communicate. Diagnose. Write it up.**

Four beats, and the first one is the one people skip.

### ↩️ "If rollback is hard, nobody rolls back"

They fix forward under pressure instead, and a five-minute incident becomes two hours.

**Practise it on a quiet afternoon.** Nobody should be learning the procedure at 3am.

### 🗄️ "Code rolls back. Data does not."

Seconds to redeploy yesterday's build; a dropped column is gone. That asymmetry is exactly why migrations go in backward-compatible steps.

### 🙈 "Blame the system, not the person"

Not politeness — **accuracy**. If people expect blame they hide information, and you lose the details that would have prevented the next one.

**The useful question:** never *"who did this"* but *"how did the system let this happen"*.

### 🕵️ "How did we find out?"

If the answer is "a customer emailed", the problem is monitoring, not the bug.

**Why this sticks:** "how did we find out?" is a *question you ask yourself*, and self-directed questions get rehearsed every incident — which is far more durable than a fact about MTTD.`,
    tricksHi: `### 🔥 "Pehle bujhao, phir poochho kyun"

Sabse aam nakaami ye hai ki koi chalak insaan ek dilchasp samasya debug kar raha hai jabki users login hi nahi kar pa rahe.

**Kram:** **Roko. Batao. Wajah dhoondho. Likho.**

Chaar taal, aur pehla wahi hai jise log chhod dete hain.

### ↩️ "Rollback mushkil ho to koi rollback nahi karta"

Log dabav mein aage badh kar theek karne lagte hain, aur paanch minute ka incident do ghante ka ban jata hai.

**Kisi shaant dopahar mein abhyas karo.** Raat 3 baje koi tareeka seekh na raha ho.

### 🗄️ "Code wapas jata hai. Data nahi."

Kal ka build dobara deploy karne mein second; hata diya gaya column ja chuka. Yahi asamaanta wo wajah hai ki migrations peeche se mel khane wale kadamon mein hoti hain.

### 🙈 "System ko dosh do, insaan ko nahi"

Shishtachar nahi — **sachai**. Log dosh ki ummeed karenge to jaankari chhupayenge, aur aap wahi tafseel kho denge jo agli baar bachati.

**Kaam ka sawaal:** kabhi *"ye kisne kiya"* nahi, balki *"system ne ye hone kaise diya"*.

### 🕵️ "Hume pata kaise chala?"

Jawab "customer ne email kiya" hai, to samasya monitoring hai, bug nahi.

**Ye kyun tikta hai:** "hume pata kaise chala?" wo *sawaal hai jo aap khud se poochhte ho*, aur khud se poochhe sawaal har incident mein dohraye jate hain — jo MTTD ke tathya se kahin zyada tikau hai.`,
  },

  /* ───────────────────────────── Security ─────────────────────────────── */

  'sec-thinking-about-security': {
    tricks: `### 🚪 "The attacker does not use your UI"

They use curl. They never see your disabled button, your hidden field, or the page that only renders for admins.

**So every rule must be enforced on the server.** Client-side validation is user experience; server-side validation is security. They look similar and do completely different jobs.

### 🧅 "Every lock eventually fails"

That is the question behind defence in depth: if this control is bypassed, **is there anything else in the way?**

The answer decides whether it is a bad afternoon or the end of the business.

### 🔑 "Smallest key that works"

The email service does not need database write access. When something is compromised — and eventually something is — least privilege decides how far it spreads.

### 🚫 "Fail closed"

If the permission check errors, deny. A system that allows anything it does not recognise will meet something it does not recognise.

### 🔬 "Do not invent locks"

Yours was tested by one person, briefly, who already knew the answer. bcrypt was tested by thousands trying to break it.

**Why this sticks:** "the attacker does not use your UI" *reframes who you are building for*, and it single-handedly explains why hidden buttons, disabled fields and client validation are not security. One sentence, many corrected mistakes.`,
    tricksHi: `### 🚪 "Hamlawar aapka UI use nahi karta"

Wo curl use karta hai. Use aapka disabled button, chhupa field, ya sirf admins ko banta page kabhi nahi dikhta.

**Isliye har niyam server par lagu hona chahiye.** Client-side validation user experience hai; server-side validation suraksha. Ye dikhte ek jaise hain aur kaam bilkul alag karte hain.

### 🧅 "Har taala kabhi na kabhi fail hota hai"

Defence in depth ke peeche yahi sawaal hai: ye bachaav bypass ho jaye, to **raste mein aur kuch hai?**

Jawab tay karta hai ki ye buri dopahar hai ya dhande ka ant.

### 🔑 "Sabse chhoti chaabi jo kaam kar de"

Email service ko database mein likhne ka hak nahi chahiye. Jab kuch compromise hoga — aur kabhi na kabhi hoga — to least privilege tay karega ki wo kitna door phailta hai.

### 🚫 "Band rakh kar fail ho"

Permission jaanch error de to mana karo. Jo system apni samajh se bahar ki har cheez allow karta hai, use kabhi na kabhi samajh se bahar ka kuch milega.

### 🔬 "Apne taale mat banao"

Aapka taala ek insaan ne, thodi der, aazmaya — aur use jawab pehle se pata tha. bcrypt ko hazaaron ne todne ki koshish ki hai.

**Ye kyun tikta hai:** "hamlawar aapka UI use nahi karta" *ye badal deta hai ki aap kiske liye bana rahe ho*, aur akele hi samjha deta hai ki chhupe button, disabled fields aur client validation suraksha kyun nahi hain. Ek vaakya, kai galtiyan theek.`,
  },

  'sec-https-and-headers': {
    tricks: `### 📮 "Postcard or sealed letter"

Plain HTTP is a postcard: readable **and editable** in transit. Someone on the same wifi can inject a script into the page you receive.

TLS gives three things: **privacy, integrity, authenticity.**

**Say it:** *"Not just readable — changeable."* The second half is the part people forget.

### 🏷️ The headers, one line each

- **HSTS** — never try HTTP for us again
- **CSP** — only run scripts from this list
- **nosniff** — do not guess the file type
- **X-Frame-Options** — nobody frames my page
- **Referrer-Policy** — do not leak my URLs

### 🛡️ "CSP stops XSS from executing"

Even if injection succeeds, the script does not run. That is defence in depth working exactly as designed — and it is why CSP is worth the deployment effort.

**Deploy it report-only first**, or it breaks your own inline scripts and gets disabled entirely.

### 🚨 "CORS is a browser rule, not a firewall"

It stops a browser on another origin **reading** the response. The request often still arrives and still executes, and curl ignores CORS completely.

Volunteering this in an interview is a strong signal, because most candidates believe the opposite.

**Why this sticks:** the postcard covers *both* properties in one image — anyone can read it, and anyone can rub something out. The second is the surprising half, and surprise is what fixes it in memory.`,
    tricksHi: `### 📮 "Postcard ya band lifafa"

Plain HTTP postcard hai: raste mein **padha aur badla** ja sakta hai. Usi wifi par baitha koi aapke milne wale page mein script daal sakta hai.

TLS teen cheezein deta hai: **niji ta, akhandta, pramanikta.**

**Bolo:** *"Sirf padha nahi — badla bhi ja sakta hai."* Doosra aadha wahi hai jo log bhool jate hain.

### 🏷️ Headers, ek-ek line

- **HSTS** — hamare liye HTTP dobara kabhi mat aazmao
- **CSP** — scripts sirf is list se chalao
- **nosniff** — file ka type andaza mat lagao
- **X-Frame-Options** — koi mera page frame mein na lagaye
- **Referrer-Policy** — mere URL leak mat karo

### 🛡️ "CSP XSS ko chalne se rokta hai"

Injection safal ho jaye to bhi script chalti nahi. Ye defence in depth theek waise hi kaam karta hua hai — aur isiliye CSP lagane ki mehnat laayak hai.

**Pehle report-only mein lagao**, warna wo aapki apni inline scripts todta hai aur poori tarah band kar diya jata hai.

### 🚨 "CORS browser ka niyam hai, firewall nahi"

Wo doosre origin ke browser ko jawab **padhne** se rokta hai. Request aksar phir bhi pahunchti hai aur chalti hai, aur curl CORS ko poori tarah ginta hi nahi.

Interview mein khud ye bol dena mazboot ishara hai, kyunki zyadatar log iska ulta maante hain.

**Ye kyun tikta hai:** postcard ek hi tasveer mein *dono* baatein dhak leta hai — koi bhi padh sakta hai, aur koi bhi kuch mita sakta hai. Doosra aadha chaunkane wala hai, aur chaunkna hi use yaad mein jama deta hai.`,
  },

  'sec-owasp-top-ten': {
    tricks: `### 🥇 "Number one is a boring unlocked door"

**Broken access control** — the most common category by a wide margin, and the least glamorous. Someone changes 41 to 42 and reads a stranger's record. Nothing was broken; nothing was checked.

**Say it:** *"The common breach is boring."*

### 🔢 The ten, chunked into four groups

- **Access** — broken access control, authentication failures
- **Data** — crypto failures, privacy
- **Input** — injection, SSRF, integrity failures
- **Process** — insecure design, misconfiguration, vulnerable components, no monitoring

Four groups is memorable; ten items is not.

### 🕳️ SSRF, in one image

You ask your own server to fetch a URL the **user** supplied — and they supply your internal address. Your server reaches something they never could.

**Say it:** *"Never fetch a URL a stranger chose."*

### 🧵 The thread underneath

Nearly all ten are the same mistake: **trusting input, or trusting that a control cannot be bypassed.**

**Why this sticks:** "the common breach is boring" *corrects an expectation*. People prepare for clever attacks and get robbed by an unchecked id — and naming that gap is what redirects the effort.`,
    tricksHi: `### 🥇 "Number ek ek boring khula darwaza hai"

**Broken access control** — bade antar se sabse aam kism, aur sabse kam chamakdaar. Koi 41 ko 42 karta hai aur ajnabi ka record padh leta hai. Kuch toota nahi; kuch jaancha nahi gaya.

**Bolo:** *"Aam sendh boring hoti hai."*

### 🔢 Das, chaar group mein chunk karke

- **Pahunch** — broken access control, authentication failures
- **Data** — crypto failures, privacy
- **Input** — injection, SSRF, integrity failures
- **Prakriya** — insecure design, misconfiguration, vulnerable components, monitoring nahi

Chaar group yaad rehte hain; das cheezein nahi.

### 🕳️ SSRF, ek tasveer mein

Aap apne hi server se wo URL laane ko kehte ho jo **user** ne diya — aur wo aapka andar ka pata deta hai. Aapka server wahan pahunch jata hai jahan wo khud kabhi nahi pahunch sakta tha.

**Bolo:** *"Ajnabi ka chuna URL kabhi mat laao."*

### 🧵 Neeche ka dhaaga

Lagbhag saare das wahi ek galti hain: **input par bharosa, ya is baat par bharosa ki bachaav bypass nahi ho sakta.**

**Ye kyun tikta hai:** "aam sendh boring hoti hai" *ek ummeed theek karta hai*. Log chalak hamlon ki tayyari karte hain aur bina jaanchi id se lut te hain — aur us faasle ko naam dena hi mehnat ki disha badalta hai.`,
  },

  'sec-injection-and-validation': {
    tricks: `### 📋 "The form is not the instruction"

Someone writes their name as *"Rahul. Also, empty the safe."* You read the form aloud, and your assistant follows it.

Every injection is that one mistake: **data got read as a command.**

### 🛤️ "Two separate channels"

Parameters are not escaping. The query and the values travel **separately** — the database gets the shape first, then the data, so a value can never become part of the command.

That distinction matters: people who think it is escaping write their own escaping and get it wrong.

**Say it:** *"Query on one line, values on the other."*

### 🍃 NoSQL injects too

Send \`{"$ne": null}\` where a string was expected and it becomes an **operator**, matching the first user. Prove it is a string first.

### ✅ "Allow-list, never blocklist"

You cannot enumerate what an attacker will invent. Say what is permitted instead.

### 📏 "Length limits are a security control"

A 10 MB string in a field expecting 50 characters is a denial of service, and it has nothing to do with what the string said.

### 🚫 What cannot be parameterised

Table names, column names, sort direction, LIMIT. \`ORDER BY \${req.query.sort}\` is injection with extra steps. **Allow-list only.**

**Why this sticks:** "the form is not the instruction" *unifies five attacks into one idea*. Five separate defences are hard to recall; one principle that generates all five is not.`,
    tricksHi: `### 📋 "Form hukum nahi hai"

Koi apna naam likhta hai *"Rahul. Aur haan, tijori khaali kar do."* Aap form padh kar sunate ho, aur sahayak use maan leta hai.

Har injection wahi ek galti hai: **data ko hukum ki tarah padh liya gaya.**

### 🛤️ "Do alag raste"

Parameters escaping nahi hain. Query aur values **alag** jate hain — database ko pehle dhaancha milta hai, phir data, isliye koi value hukum ka hissa ban hi nahi sakti.

Ye farak matter karta hai: jo ise escaping samajhte hain wo apni escaping likh kar galat karte hain.

**Bolo:** *"Query ek line par, values doosri par."*

### 🍃 NoSQL bhi inject hota hai

Jahan string chahiye thi wahan \`{"$ne": null}\` bhejo aur wo **operator** ban jata hai, pehle user se match karta hua. Pehle sabit karo ki wo string hai.

### ✅ "Allow-list, blocklist kabhi nahi"

Hamlawar kya banayega ye ginana namumkin hai. Batao kya allowed hai.

### 📏 "Lambai ki seema suraksha ka niyantran hai"

50 akshar wale khaane mein 10 MB ki string denial of service hai, aur us string ke likhe se iska koi lena-dena nahi.

### 🚫 Jo parameterise nahi ho sakta

Table ke naam, column ke naam, sort ki disha, LIMIT. \`ORDER BY \${req.query.sort}\` kuch extra kadamon ke saath injection hai. **Sirf allow-list.**

**Ye kyun tikta hai:** "form hukum nahi hai" *paanch hamlon ko ek vichaar mein jod deta hai*. Paanch alag bachaav yaad rakhna mushkil hai; ek usool jo paanchon nikaal de, nahi.`,
  },

  'sec-rate-limiting-and-abuse': {
    tricks: `### 🤖 "A human tries four times. A machine tries a million."

Rate limiting does not change the lock. It changes **how fast it can be tried** — and that turns a million guesses into years.

### 🎯 "Limit by cost, not by count"

A search and a report generation are not equal. One global limit is too loose for expensive routes and too tight for cheap ones.

### 🔑 The login keying trap

- **Per account only** → anyone can lock a victim out by failing their login all day
- **Per IP only** → a distributed attack walks straight through

**Key by both:** this visitor, on this account.

**Say it:** *"IP alone lets them in. Account alone locks you out."*

### 🔢 "Six digits is a million guesses"

Expiry is not enough. An OTP needs **three** properties: short expiry, single use, **attempt limit**. Without the third, a script works through it in minutes.

### 🕳️ The surfaces people forget

**"Signup, resend email, upload, sockets, expensive queries."**

WebSocket events are the sneaky one — HTTP rate limiters never see them.

### 🌐 "In-process counters break at two servers"

Use Redis, or your limit is per-instance and quietly N times looser than you think.

**Why this sticks:** the login keying trap is a *symmetrical pair of failures* — each obvious fix creates the opposite problem. That symmetry makes it memorable and makes the correct answer derivable.`,
    tricksHi: `### 🤖 "Insaan chaar baar aazmata hai. Machine das lakh baar."

Rate limiting taala nahi badalta. Wo ye badalta hai ki **use kitni tezi se aazmaya ja sakta hai** — aur isse das lakh andaze saalon mein badal jate hain.

### 🎯 "Keemat se seema, ginti se nahi"

Search aur report banana barabar nahi. Ek global seema mehnge routes ke liye dheeli hai aur saste ke liye sakht.

### 🔑 Login ki keying ka trap

- **Sirf account se** → koi bhi din bhar aapka login fail karke aapko bahar kar sakta hai
- **Sirf IP se** → bikhra hua hamla seedha nikal jata hai

**Dono se key banao:** ye aane wala, is account par.

**Bolo:** *"Akela IP unhe andar aane deta hai. Akela account aapko bahar kar deta hai."*

### 🔢 "Chhah ank matlab das lakh andaze"

Expire hona kaafi nahi. OTP ko **teen** gun chahiye: jaldi expire, ek baar istemal, **koshish ki seema**. Teesre ke bina script minaton mein nipta deti hai.

### 🕳️ Wo jagah jo log bhool jate hain

**"Signup, email dobara bhejo, upload, sockets, mehngi queries."**

WebSocket events chalak wale hain — HTTP rate limiters unhe dekhte hi nahi.

### 🌐 "Process ke andar ki ginti do server par toot ti hai"

Redis use karo, warna aapki seema per-instance hai aur chupchaap N guna dheeli.

**Ye kyun tikta hai:** login keying ka trap *do samaanaantar nakaamiyon ki jodi* hai — har saaf dikhta hal ulti samasya bana deta hai. Yahi samaanta ise yaad rakhne layak banati hai aur sahi jawab khud nikalne layak.`,
  },

  'sec-dependencies-and-supply-chain': {
    tricks: `### 🏗️ "Most of your app was written by strangers"

A handful of direct dependencies, hundreds of transitive ones — all running with **your** privileges: your env vars, your database, your filesystem.

### 😱 "npm install runs code"

\`postinstall\` executes arbitrary code at install time — on your machine **and in CI, where the deploy credentials live**.

That second half is the part people have not thought about.

### 🔒 "\`npm ci\`, not \`npm install\`"

The single highest-value habit here. \`install\` can drift to a newer version; \`ci\` installs exactly the lockfile. Otherwise you tested one tree and shipped another.

**Say it:** *"Lockfile or lottery."*

### 📬 "Small regular updates, not an annual pile"

A year of skipped updates arrives as one terrifying batch nobody wants to review. Automate the PRs.

### 🧹 "Every dependency is trust handed to a stranger"

For four lines of work, write it yourself.

### ⚖️ Triage honestly

A prototype-pollution issue in a dev-only build tool is not an RCE in your HTTP framework. Fixing everything blindly teaches the team to ignore the report — worse than reading it properly.

**Why this sticks:** "npm install runs code" is *genuinely alarming and widely unknown*. Alarm plus novelty is a strong encoder, and this one changes behaviour immediately.`,
    tricksHi: `### 🏗️ "Aapki app ka zyadatar hissa ajnabiyon ne likha hai"

Kuch seedhi dependencies, sau se zyada unke andar wali — sab **aapke** adhikaron ke saath: aapke env vars, database, filesystem.

### 😱 "npm install code chalata hai"

\`postinstall\` install ke waqt koi bhi code chalata hai — aapki machine par **aur CI mein, jahan deploy ke credentials rehte hain**.

Doosra aadha wahi hissa hai jiske baare mein logon ne socha hi nahi.

### 🔒 "\`npm ci\`, \`npm install\` nahi"

Yahan ki sabse keemti aadat. \`install\` naye version par khisak sakta hai; \`ci\` bilkul lockfile lagata hai. Warna aapne test ek ped kiya aur bheja doosra.

**Bolo:** *"Lockfile ya lottery."*

### 📬 "Chhote niyamit updates, saal bhar ka dher nahi"

Saal bhar ke chhoote updates ek daravne batch ki tarah aate hain jise koi review nahi karna chahta. PR apne aap banwao.

### 🧹 "Har dependency kisi ajnabi ko diya gaya bharosa hai"

Chaar line ke kaam ke liye khud likh lo.

### ⚖️ Imaandari se chhanto

Sirf dev mein use hote build tool ka prototype-pollution aapke HTTP framework ke RCE jaisa nahi hai. Aankh band karke sab theek karna team ko report nazarandaz karna sikha deta hai — use theek se padhne se bura.

**Ye kyun tikta hai:** "npm install code chalata hai" *sach mein chaunkane wala aur bahut kam maalum* hai. Chaunkna aur naya-pan mazboot encoder hai, aur ye baat bartaav turant badal deti hai.`,
  },

  'sec-file-uploads': {
    tricks: `### 📦 "Never trust the name, the extension, or the type"

All three are chosen by the person handing you the parcel.

**Check the actual bytes.** Real file types have magic numbers at the start — you can tell a PNG from a script without trusting the label.

**Say it:** *"Open the box, do not read the label."*

### 🏷️ "Generate your own filename"

\`../../etc/passwd\` is a path traversal attempt. A UUID is not. Keep the original only as a display label.

### 💥 The one that causes the real damage

**An uploaded SVG or HTML served from your domain executes as your site.** It reads your cookies and acts as the user.

"It is just an image" is wrong — an SVG is XML and can carry a script tag.

**Two defences, use both:** a **different domain** for user content, and \`Content-Disposition: attachment\` so it downloads rather than renders.

### 📏 "No size limit is a denial of service"

Enforced by the parser, not after the file is in memory.

### 🗺️ "Photos carry GPS"

Strip EXIF. Publishing a profile picture should not publish someone's home address.

**Why this sticks:** "it is just an image" is a *sentence you have thought yourself*. Attacking a belief you actually hold is far more effective than adding a fact you did not.`,
    tricksHi: `### 📦 "Naam, extension aur type — teeno par bharosa nahi"

Teeno wo insaan chunta hai jo aapko parcel de raha hai.

**Asli bytes jaancho.** Asli file types ki shuruaat mein magic numbers hote hain — aap label par bharosa kiye bina PNG aur script mein farak kar sakte ho.

**Bolo:** *"Dibba kholo, label mat padho."*

### 🏷️ "Apna filename banao"

\`../../etc/passwd\` path traversal ki koshish hai. UUID nahi. Asli naam sirf dikhane ke label ki tarah rakho.

### 💥 Wo jo asli nuksaan karta hai

**Aapke domain se parosi gayi upload ki hui SVG ya HTML aapki site ki tarah chalti hai.** Wo aapki cookies padhti hai aur user ban kar kaam karti hai.

"Ye to bas image hai" galat hai — SVG XML hai aur usme script tag ho sakta hai.

**Do bachaav, dono use karo:** user content ke liye **alag domain**, aur \`Content-Disposition: attachment\` taaki wo render ki jagah download ho.

### 📏 "Size ki seema na hona denial of service hai"

Parser mein lagu, file memory mein aane ke baad nahi.

### 🗺️ "Photos GPS le kar chalti hain"

EXIF hatao. Profile picture prakashit karne se kisi ka ghar ka pata prakashit nahi hona chahiye.

**Ye kyun tikta hai:** "ye to bas image hai" wo *vaakya hai jo aapne khud socha hai*. Jis vishwas ko aap sach mein rakhte ho us par waar karna, naya tathya jodne se kahin zyada asardaar hai.`,
  },

  'sec-privacy-and-pii': {
    tricks: `### 🚫 "The data you never collected cannot leak"

The strongest privacy control, and it costs nothing. Before adding a field, ask what it is **for**. "It might be useful later" is how you acquire a liability with no matching benefit.

**Say it:** *"Store the answer, not the raw fact."*

Do you need date of birth, or **"over 18"**? Keep the second — it answers the question and cannot embarrass anyone.

### ⏳ "No deletion date means forever"

And forever is a long time to be liable for something nobody reads.

### 🗑️ "Delete is not one DELETE"

Their data is in the database, replicas, **backups, logs, analytics, the email provider and the support tool**.

Know where personal data lives **before** someone asks — a delete endpoint that clears one table is not deletion.

### 📓 "Never log PII"

Logs are retained for months, shipped to third parties, and read by people who do not need them. **Redact at the logger**, because someone will forget at a call site.

### 💳 "Do not store cards at all"

Use the provider's tokens. The sensitive data is then never yours to protect — which is strictly better than protecting it well.

**Why this sticks:** "the data you never collected cannot leak" is *a solution that requires no work*. Controls that reduce effort are adopted; controls that add effort are negotiated away.`,
    tricksHi: `### 🚫 "Jo data aapne jama hi nahi kiya wo leak nahi ho sakta"

Sabse mazboot privacy niyantran, aur ismein kuch kharch nahi. Field jodne se pehle poochho ki wo **kis liye** hai. "Aage kaam aa sakta hai" wahi tareeka hai jisse aap bina kisi faayde ke zimmedari kharid lete ho.

**Bolo:** *"Jawab rakho, kaccha tathya nahi."*

Aapko janm tareekh chahiye, ya **"18 se upar"**? Doosra rakho — wo sawaal ka jawab deta hai aur kisi ko sharminda nahi kar sakta.

### ⏳ "Mitane ki tareekh nahi to hamesha"

Aur hamesha kisi aisi cheez ki zimmedari uthana lamba samay hai jise koi padhta hi nahi.

### 🗑️ "Delete ek DELETE nahi hai"

Uska data database mein hai, replicas mein, **backups, logs, analytics, email provider aur support tool mein**.

Kisi ke maangne se **pehle** jaano ki nijee data kahan rehta hai — jo delete endpoint sirf ek table saaf kare wo mitana nahi hai.

### 📓 "PII kabhi log mat karo"

Logs mahinon rakhe jate hain, third parties ko jate hain, aur unhe wo padhte hain jinhe zaroorat nahi. **Redact logger par karo**, kyunki koi na koi call site par bhool jayega.

### 💳 "Card rakho hi mat"

Provider ke tokens use karo. Phir sanvedansheel data kabhi aapka bachane ka kaam banta hi nahi — jo use achhi tarah bachane se sakhti se behtar hai.

**Ye kyun tikta hai:** "jo jama hi nahi kiya wo leak nahi ho sakta" *aisa hal hai jisme kaam karna hi nahi padta*. Jo niyantran mehnat kam karte hain wo apnaye jate hain; jo mehnat badhate hain unse mol-bhaav hota hai.`,
  },

  /* ────────────────────────────── Schema ──────────────────────────────── */

  'schema-how-to-model': {
    tricks: `### ✏️ "Underline the nouns"

*"Customers place orders for products."* → three tables. Genuinely most of the work.

### 👉 "The foreign key goes on the many side"

One customer, many orders → the **order** carries \`customer_id\`. The customer does not carry a list.

That one rule settles most beginner confusion about which table gets the column.

### 💰 "Store the price from that day"

If an order references the product's **current** price, changing a price silently rewrites every historical invoice.

**This is not denormalisation for speed. It is correctness.** The same reasoning applies to names and addresses on invoices.

**Say it:** *"An invoice records the past, not the present."*

### 🚫 "Can I write something impossible?"

If a row can hold two contradictory states, the schema permits a bug. Tighten it until the invalid state cannot be written.

### 🧪 The test that works

Write the five queries your app will actually run. If they hurt, the model is wrong — and now is much cheaper than after there is data.

**Why this sticks:** "the foreign key goes on the many side" is a *single rule that resolves a recurring decision*. Rules that answer a question you face repeatedly get rehearsed by use.`,
    tricksHi: `### ✏️ "Sangya rekhankit karo"

*"Customers products ke liye orders dete hain."* → teen tables. Sach mein zyadatar kaam yahi hai.

### 👉 "Foreign key 'kai' wali taraf jati hai"

Ek customer, kai orders → **order** \`customer_id\` rakhta hai. Customer list nahi rakhta.

Yahi ek niyam is uljhan ko khatam kar deta hai ki column kis table mein jaye.

### 💰 "Us din ka daam jama karo"

Agar order product ke **maujooda** daam ko reference karta hai, to daam badalna chupchaap har purana invoice dobara likh deta hai.

**Ye raftaar ke liye denormalisation nahi hai. Ye sahi hona hai.** Yahi soch invoice par naam aur pate par bhi lagti hai.

**Bolo:** *"Invoice ateet likhta hai, vartaman nahi."*

### 🚫 "Kya main kuch namumkin likh sakta hoon?"

Agar ek row do virodhi haalat rakh sakti hai, to schema ek bug ki ijazat de raha hai. Ise itna kaso ki galat haalat likhi hi na ja sake.

### 🧪 Wo jaanch jo chalti hai

Wo paanch queries likho jo aapki app sach mein chalayegi. Wo takleef dein to model galat hai — aur abhi data aane ke baad se kahin sasta hai.

**Ye kyun tikta hai:** "foreign key 'kai' wali taraf" *ek niyam hai jo baar-baar aane wala faisla suljha deta hai*. Jo niyam aapke rozmarra ke sawaal ka jawab dete hain wo istemal se hi dohraye jate hain.`,
  },

  'schema-keys-and-ids': {
    tricks: `### 🔢 "Sequential ids are countable"

\`/orders/41\` tells anyone you have about 41 orders — and invites them to try 42.

A competitor signs up twice a month and measures your growth from the gap. That is a real, quiet leak of business information.

**Say it:** *"Counting up counts out loud."*

### 🎲 "Random UUIDs fragment the index"

Each insert lands in a random place in the B-tree, causing page splits and a much larger index. On a write-heavy table this is measurable.

### ✅ "UUID v7 / ULID: unguessable AND in order"

The modern default — the security property without the write penalty.

**Say it:** *"Random-looking, sequentially stored."*

### 📧 "Never make a real thing the key"

Email seems perfect until someone changes theirs, and every foreign key pointing at them must change too.

**Surrogate key as identity, unique constraint on the natural key.** You get both, and neither breaks the other.

### ⏰ "Decide early"

Changing a key type after there is data means rewriting every referencing foreign key in every table. This is one of the genuinely painful migrations.

**Why this sticks:** "counting up counts out loud" is *rhythmic and slightly witty*, and it encodes a leak most people never consider — which is precisely why it needs a hook.`,
    tricksHi: `### 🔢 "Kramik ids gine ja sakte hain"

\`/orders/41\` kisi ko bhi bata deta hai ki aapke lagbhag 41 orders hain — aur 42 aazmane ka nyota deta hai.

Pratispardhi mahine mein do baar sign up karke antar se aapki growth naap leta hai. Ye business ki jaankari ka asli, chupchaap leak hai.

**Bolo:** *"Ginti bol kar ginti hai."*

### 🎲 "Random UUID index ko bikher dete hain"

Har insert B-tree mein kisi bhi jagah girta hai, jisse page splits hote hain aur index kaafi bada. Write-heavy table par ye naapa ja sakta hai.

### ✅ "UUID v7 / ULID: anuman se bahar AUR kram mein"

Aaj ka default — suraksha ka gun, bina write ki keemat ke.

**Bolo:** *"Random dikhta, kram mein jama."*

### 📧 "Kisi asli cheez ko key mat banao"

Email perfect lagta hai jab tak koi apna badal na le, aur phir us par ishara karti har foreign key bhi badalni padti hai.

**Pehchan ke liye surrogate key, natural key par unique constraint.** Dono milte hain, aur ek doosre ko todta nahi.

### ⏰ "Jaldi tay karo"

Data aane ke baad key ka type badalna matlab har table ki har reference karti foreign key dobara likhna. Ye sach mein dukhdayi migrations mein se ek hai.

**Ye kyun tikta hai:** "ginti bol kar ginti hai" *laydaar aur thoda chatur* hai, aur wo leak jama karta hai jiske baare mein zyadatar log sochte hi nahi — aur isiliye use hook chahiye.`,
  },

  'schema-advanced-relational-patterns': {
    tricks: `### ⚖️ "Flexibility is bought with integrity"

The thread through every pattern here. Each time you make the schema more dynamic, a guarantee moves **out of the database and into your head** — where it will eventually be forgotten.

### 🔗 "Polymorphic means no foreign key"

\`commentable_type\` + \`commentable_id\` works, and the database can no longer check the target exists. A comment can point at a post deleted years ago and nothing complains.

**The fix that keeps integrity:** an **exclusive arc** — one nullable FK per target plus a CHECK that exactly one is set.

### 🚫 "EAV is a database inside your database"

No types, no constraints, every read is a pivot. **JSONB replaced it** and can at least be indexed.

Being able to say *why* EAV is wrong is a genuine interview signal.

### 🌳 Trees: start simple

**Adjacency list + \`WITH RECURSIVE\`.** Simple, and Postgres handles it well.

Reach for a closure table only when subtree reads are genuinely hot. Nested sets make reads fast and every move expensive — wrong for anything that changes.

**Why this sticks:** "flexibility is bought with integrity" is a *pricing statement*, and it turns four unrelated patterns into one decision you make four times. One principle beats four memorised structures.`,
    tricksHi: `### ⚖️ "Lachak integrity ke badle khareedi jati hai"

Yahan ke har pattern mein chalta dhaaga. Jab bhi aap schema ko zyada dynamic banate ho, ek guarantee **database se nikal kar aapke dimaag mein** aa jati hai — jahan wo kabhi na kabhi bhula di jayegi.

### 🔗 "Polymorphic matlab foreign key nahi"

\`commentable_type\` + \`commentable_id\` chalta hai, aur database ab jaanch nahi sakta ki target hai bhi ya nahi. Comment saalon pehle mit i hui post par ishara kar sakta hai aur koi kuch nahi kehta.

**Wo hal jo integrity bacha leta hai:** **exclusive arc** — har target ke liye ek nullable FK aur ek CHECK ki theek ek set ho.

### 🚫 "EAV aapke database ke andar ek database hai"

Na types, na constraints, har read ek pivot. **JSONB ne uski jagah le li** aur wo kam se kam index to ho sakta hai.

Ye bata paana ki EAV *kyun* galat hai, asli interview signal hai.

### 🌳 Trees: simple se shuru

**Adjacency list + \`WITH RECURSIVE\`.** Simple, aur Postgres ise achhe se sambhalta hai.

Closure table tabhi uthao jab subtree reads sach mein garam hon. Nested sets reads tez karte hain aur har hilana mehnga — jo badalti har cheez ke liye galat hai.

**Ye kyun tikta hai:** "lachak integrity ke badle khareedi jati hai" ek *keemat batane wala vaakya* hai, aur ye chaar alag patterns ko ek faisle mein badal deta hai jo aap chaar baar lete ho. Ek usool chaar rate hue dhaanchon ko haraata hai.`,
  },

  'schema-history-and-audit': {
    tricks: `### 🧽 "UPDATE destroys the answer to a question nobody has asked yet"

*"When did this ship?"* becomes unanswerable — not hard, **unanswerable**.

### 🪜 Four levels, cheapest first

**"Soft delete. Audit log. Versioned rows. Event sourcing."**

Most applications want the first two, plus the third only where the business genuinely asks about the past.

### 🔑 The soft-delete gotcha nobody expects

**It breaks UNIQUE.** A soft-deleted user still occupies their email address forever.

**The fix:** a partial unique index — \`UNIQUE (email) WHERE deleted_at IS NULL\`.

**Say it:** *"Soft delete needs a partial index."*

### 😤 "Forget the filter once and the dead come back"

Every query must remember \`WHERE deleted_at IS NULL\`. Use a view or a query-builder default — do not rely on discipline.

### ⚠️ "Event sourcing for CRUD is a large mistake"

Right for genuinely event-shaped domains — ledgers, order lifecycles. Wrong, expensively and permanently, for an ordinary app.

### 🧾 "An invoice must freeze what it recorded"

Name, address and price **at the time of sale**. Referencing current values means reprinting an old invoice shows today's data — wrong, and often illegal.

**Why this sticks:** the soft-delete/UNIQUE collision is a *bug you will not predict*. Unpredictable consequences of an ordinary decision are exactly the material that needs a hook, because reasoning will not get you there in time.`,
    tricksHi: `### 🧽 "UPDATE us sawaal ka jawab mita deta hai jo abhi poochha hi nahi gaya"

*"Ye kab bheja gaya?"* ka jawab nahi bachta — mushkil nahi, **hai hi nahi**.

### 🪜 Chaar darje, saste pehle

**"Soft delete. Audit log. Versioned rows. Event sourcing."**

Zyadatar applications ko pehle do chahiye, aur teesra sirf wahan jahan business sach mein ateet ke baare mein poochhta ho.

### 🔑 Soft-delete ka wo pech jiski ummeed nahi hoti

**Ye UNIQUE ko todta hai.** Soft-delete kiya user apna email hamesha ke liye ghere baitha hai.

**Hal:** partial unique index — \`UNIQUE (email) WHERE deleted_at IS NULL\`.

**Bolo:** *"Soft delete ko partial index chahiye."*

### 😤 "Ek baar filter bhoolo aur murde wapas aa jate hain"

Har query ko \`WHERE deleted_at IS NULL\` yaad rakhna hoga. View ya query-builder ka default use karo — anushasan par mat chhodo.

### ⚠️ "CRUD ke liye event sourcing badi galti hai"

Sach mein event jaise domains ke liye sahi — ledgers, order lifecycle. Aam app ke liye galat, mehngi aur hamesha ke liye.

### 🧾 "Invoice ko jo likha wo jama karna hoga"

Naam, pata aur daam **bikri ke waqt ka**. Maujooda values reference karoge to purana invoice dobara chhaapne par aaj ka data dikhega — galat, aur aksar gair-kanooni.

**Ye kyun tikta hai:** soft-delete aur UNIQUE ki takraar *wo bug hai jiska anuman aap nahi lagaoge*. Aam faisle ke anuman se bahar natije theek wahi saamaan hain jinhe hook chahiye, kyunki tark aapko waqt par wahan nahi pahunchayega.`,
  },

  'schema-multi-tenancy': {
    tricks: `### 🏢 "One forgotten WHERE is the whole company"

Shared schema means **every single query** must filter by tenant. One miss in one endpoint is a cross-tenant data leak — and the query looks perfectly correct in review.

**Say it:** *"You cannot fix this with discipline."*

### 🛡️ "Make the database refuse"

**Row-Level Security.** A forgotten filter then returns **nothing** instead of **everything**.

That inversion is the whole point: forgetting becomes a bug you notice immediately rather than a leak you notice in the news.

### 🚫 "tenant_id never comes from the request body"

Derive it from the authenticated session. Otherwise the user simply sends a different one.

### 🔑 "Uniqueness is per tenant"

\`UNIQUE (tenant_id, email)\`, not \`UNIQUE (email)\`. Get it globally right and two tenants can never share a customer — which they will, constantly.

### 🪜 The three models

**"Shared schema → schema per tenant → database per tenant."**

Cheapest and riskiest, to safest and most expensive. Most SaaS wants the first **with RLS**, moving heavy or regulated tenants out when there is a specific reason.

**Why this sticks:** "returns nothing instead of everything" describes a *failure mode inversion*, and that is the actual value of RLS. Understanding why it helps is what makes someone reach for it.`,
    tricksHi: `### 🏢 "Ek bhoola hua WHERE poori company hai"

Saanjha schema matlab **har ek query** ko tenant se filter karna hoga. Ek endpoint mein ek chook cross-tenant data leak hai — aur review mein query bilkul sahi dikhti hai.

**Bolo:** *"Ise anushasan se theek nahi kiya ja sakta."*

### 🛡️ "Database se mana karwao"

**Row-Level Security.** Phir bhoola hua filter **sab kuch** nahi, **kuch bhi nahi** lauta ta.

Yahi ulat asli baat hai: bhoolna wo bug ban jata hai jo turant dikhta hai, na ki wo leak jo khabar mein dikhta hai.

### 🚫 "tenant_id request body se kabhi nahi"

Use authenticated session se nikalo. Warna user bas doosra bhej dega.

### 🔑 "Uniqueness har tenant ke andar hai"

\`UNIQUE (tenant_id, email)\`, \`UNIQUE (email)\` nahi. Ise poori duniya ke liye sakht karo aur do tenants ek customer kabhi saanjha nahi kar sakte — jo baar-baar hoga.

### 🪜 Teen model

**"Saanjha schema → har tenant ka schema → har tenant ka database."**

Sabse sasta aur khatarnaak, se sabse surakshit aur mehnga. Zyadatar SaaS ko pehla chahiye **RLS ke saath**, aur khaas wajah hone par bhaari ya niyamon se bandhe tenants bahar.

**Ye kyun tikta hai:** "sab kuch nahi, kuch bhi nahi lauta ta" ek *nakaami ke tareeke ka ulat* batata hai, aur RLS ki asli keemat wahi hai. Ye samajhna hi kisi ko use uthane par majboor karta hai.`,
  },

  'schema-nosql-modelling': {
    tricks: `### 🍱 "Jars or trays"

- **SQL** — every ingredient in its own labelled jar. Fetch from six; fetching is cheap.
- **Document** — each dish pre-assembled on a tray. Hand over one thing.

Neither is more advanced. **SQL models the data; documents model the queries.**

**Say it:** *"Relational starts from the data. Documents start from the questions."*

### 🤝 "Read together, store together"

Embed when it is always read with the parent and is **bounded**. Reference when it is large, shared, or grows forever.

### 💣 "Never embed an unbounded array"

The single rule that prevents most document-modelling disasters.

Comments on a post look fine at five and die at fifty thousand — and **long before** the 16 MB cap, because every update rewrites the whole document.

**Say it:** *"Fine at five, fatal at fifty thousand."*

### 📋 "Extended reference: copy what you always show"

Reference the product, but store its name and price on the order.

And note the price **should** be frozen — that is correctness, not caching.

### 🚩 "When to admit it was relational"

\`$lookup\` everywhere, constant multi-document transactions, hand-maintained consistency. That is a **schema smell**, not a database limitation.

**Why this sticks:** "fine at five, fatal at fifty thousand" is *alliterative with a numeric contrast*. The two numbers make the failure concrete, and concrete failures are recalled where general warnings are not.`,
    tricksHi: `### 🍱 "Jar ya tray"

- **SQL** — har saamaan apne label wale jar mein. Chhah se nikalo; nikalna sasta hai.
- **Document** — har dish tray par pehle se lagi. Ek cheez pakda do.

Koi zyada advanced nahi. **SQL data model karta hai; documents queries model karte hain.**

**Bolo:** *"Relational data se shuru hota hai. Documents sawaalon se."*

### 🤝 "Saath padho to saath rakho"

Embed tab jab wo hamesha parent ke saath padha jaye aur uski **seema** ho. Reference tab jab wo bada ho, saanjha ho, ya hamesha badhta ho.

### 💣 "Bina seema wali array kabhi embed mat karo"

Wo ek niyam jo zyadatar document-modelling ki tabaahiyan rok deta hai.

Post par comments paanch par theek lagte hain aur pachas hazaar par mar jate hain — aur 16 MB ki had se **bahut pehle**, kyunki har update poora document dobara likhta hai.

**Bolo:** *"Paanch par theek, pachas hazaar par jaanleva."*

### 📋 "Extended reference: jo hamesha dikhate ho wo copy karo"

Product ko reference karo, par uska naam aur daam order par rakho.

Aur dhyan do daam **jama hona hi chahiye** — ye sahi hona hai, caching nahi.

### 🚩 "Kab maan lein ki ye relational tha"

Har jagah \`$lookup\`, baar-baar multi-document transactions, haath se sambhali consistency. Ye **schema ki badboo** hai, database ki kami nahi.

**Ye kyun tikta hai:** "paanch par theek, pachas hazaar par jaanleva" *tuk aur number ke farak ke saath* hai. Do number nakaami ko thos bana dete hain, aur thos nakaamiyan yaad rehti hain jabki aam chetavniyan nahi.`,
  },
};
