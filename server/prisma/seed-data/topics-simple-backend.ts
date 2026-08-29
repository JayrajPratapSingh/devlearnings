import type { SimpleExplanation } from './topics-simple';

/** Beginner layer for the backend, data and tooling topics. Same rules apply. */
export const SIMPLE_BACKEND: Record<string, SimpleExplanation> = {
  /* ──────────────────────────── Node & Express ─────────────────────────── */

  'node-runtime-and-event-loop': {
    simple: `**JavaScript that escaped the browser.**

JavaScript used to only live inside web pages. Node is JavaScript running on your **computer** instead — so it can read files, talk to databases, and be a server.

Inside, Node is like a **restaurant with one waiter**:
- One waiter takes all orders (your JavaScript runs on one thread)
- He never stands waiting at the kitchen — he serves other tables
- When food is ready, he brings it

That is why Node handles thousands of users with one waiter: nobody waits, everybody gets served in turns.

**But:** if one customer asks the waiter to personally peel 10,000 potatoes, **everyone else waits**. That is a slow loop or heavy calculation blocking Node.

**Remember:** Node = JavaScript outside the browser, one waiter, never waiting.`,
    simpleHi: `**Browser se bahar nikla hua JavaScript.**

Pehle JavaScript sirf web pages ke andar chalta tha. Node wahi JavaScript hai jo aapke **computer** par chalta hai — isliye files padh sakta hai, database se baat kar sakta hai, server ban sakta hai.

Andar se Node **ek waiter wale restaurant** jaisa hai:
- Ek hi waiter saare orders leta hai (aapka JavaScript ek thread par chalta hai)
- Wo kitchen par khada intezar nahi karta — doosri tables sambhalta hai
- Khana taiyaar hone par le aata hai

Isiliye Node ek waiter se hazaron users sambhal leta hai: koi rukta nahi, sabka number aata hai.

**Par:** ek customer waiter se 10,000 aloo khud chhilwane lage, to **baaki sab wait karte hain**. Yahi dheema loop ya bhaari calculation Node ko block karna hai.

**Yaad rakho:** Node = browser ke bahar JavaScript, ek waiter, kabhi intezar nahi.`,
  },

  'node-modules-commonjs-esm': {
    simple: `**Two ways to borrow from a neighbour.**

Your code is split into files. To use something from another file, you must **export** it there and **import** it here.

Two styles exist because Node is old:

\`\`\`js
// CommonJS — the old way
module.exports = { add };
const { add } = require('./math');

// ESM — the modern way
export { add };
import { add } from './math.js';
\`\`\`

New projects use \`import\`. Add \`"type": "module"\` in package.json to turn it on.

One gotcha: a file's code runs **only once**, no matter how many files import it. The result is remembered and reused — which is why a database connection in a module behaves like one shared connection.

**Remember:** export to share, import to borrow.`,
    simpleHi: `**Padosi se udhaar lene ke do tareeke.**

Aapka code files mein bata hua hai. Doosri file ki cheez use karni ho to wahan **export** karo aur yahan **import**.

Do styles isliye hain kyunki Node purana hai:

\`\`\`js
// CommonJS — purana tareeka
module.exports = { add };
const { add } = require('./math');

// ESM — modern tareeka
export { add };
import { add } from './math.js';
\`\`\`

Naye projects \`import\` use karte hain. On karne ke liye package.json mein \`"type": "module"\` daalo.

Ek baat: file ka code **sirf ek baar** chalta hai, chahe kitni files use import karein. Result yaad rakha jata hai — isiliye module mein bana database connection ek hi shared connection ki tarah kaam karta hai.

**Yaad rakho:** share karne ko export, lene ko import.`,
  },

  'node-streams-buffers': {
    simple: `**Drinking from a straw, not swallowing the bucket.**

You want to move 2 GB of water. Two ways:
- Pick up the whole bucket at once → your arms break (out of memory)
- Use a **straw**, sip by sip → easy, no matter how big the bucket

A stream is the straw. Node reads a huge file in small sips, so memory stays small whether the file is 2 MB or 2 GB.

There is one more clever bit — **backpressure**. If the person drinking is slow, the straw says "stop pouring for a second". Without it, water spills everywhere (memory fills up).

\`\`\`js
await pipeline(readStream, gzip, writeStream);   // handles all of this
\`\`\`

**Remember:** big file? Use a straw, not the bucket.`,
    simpleHi: `**Straw se piyo, poori balti mat nigalo.**

2 GB paani hataana hai. Do tareeke:
- Poori balti ek saath uthao → haath toot jayenge (memory khatam)
- **Straw** se ghoont-ghoont piyo → aasan, balti kitni bhi badi ho

Stream wahi straw hai. Node badi file ko chhote ghoont mein padhta hai, isliye file 2 MB ho ya 2 GB, memory chhoti hi rehti hai.

Ek aur samajhdaari hai — **backpressure**. Peene wala dheema ho to straw kehta hai "thodi der mat daalo". Iske bina paani sab jagah gir jata hai (memory bhar jati hai).

\`\`\`js
await pipeline(readStream, gzip, writeStream);   // ye sab khud sambhal leta hai
\`\`\`

**Yaad rakho:** badi file? Straw use karo, balti nahi.`,
  },

  'express-middleware': {
    simple: `**Security checks at the airport.**

Your request is a passenger. Before reaching the plane (your code), it passes through gates in order:

\`\`\`
request → check ID → scan bag → boarding pass → ✈️ your route
\`\`\`

Each gate is a **middleware**. It can:
- let you through (\`next()\`)
- stop you and send you back (send a response)
- report a problem (\`next(err)\`)

**Order is everything.** Put the "flight not found" desk *before* the gates, and every passenger is told their flight does not exist.

The error-handling gate is special — it must take **four** things \`(err, req, res, next)\` and be placed **last**. Remove the unused \`next\` and Express stops recognising it as an error handler.

**Remember:** middleware = airport gates, in order.`,
    simpleHi: `**Airport ki security checks.**

Aapki request ek passenger hai. Plane (aapka code) tak pahunchne se pehle wo gates se guzarti hai, order mein:

\`\`\`
request → ID check → bag scan → boarding pass → ✈️ aapka route
\`\`\`

Har gate ek **middleware** hai. Wo:
- aage jaane de (\`next()\`)
- rok kar wapas bhej de (response bhej de)
- problem report kare (\`next(err)\`)

**Order sab kuch hai.** "Flight nahi mili" wala counter gates se *pehle* laga do, to har passenger ko yahi bola jayega.

Error wala gate special hai — usme **chaar** cheezein honi chahiye \`(err, req, res, next)\` aur wo **sabse aakhir** mein. Bekaar lagne wala \`next\` hata do to Express use error handler maanna hi band kar deta hai.

**Yaad rakho:** middleware = airport ke gates, order mein.`,
  },

  'express-layering': {
    simple: `**A restaurant's staff.**

- **Waiter (route/controller)** — takes your order, brings the food. Does not cook.
- **Chef (service)** — actually cooks. Never talks to customers.
- **Storeroom keeper (repository)** — the only one who touches the fridge (database).

Why bother? Because when something breaks, you know exactly whose job it was. And you can test the chef's cooking without opening the restaurant.

The one rule that keeps it honest: **the chef must never see the customer.** The moment your service function takes \`req\`, the separation is just decoration.

**Remember:** waiter takes orders, chef cooks, storekeeper touches the fridge.`,
    simpleHi: `**Restaurant ka staff.**

- **Waiter (route/controller)** — order leta hai, khana laata hai. Pakata nahi.
- **Chef (service)** — asal mein pakata hai. Customer se kabhi baat nahi karta.
- **Store wala (repository)** — sirf yahi fridge (database) ko haath lagata hai.

Fayda kya? Kuch bigde to pata hota hai kiska kaam tha. Aur chef ka khana bina restaurant khole test kar sakte ho.

Ek rule ise imaandar rakhta hai: **chef ko customer kabhi nahi dikhna chahiye.** Jis din aapka service function \`req\` lene laga, us din ye alag-alag hona sirf dikhawa reh gaya.

**Yaad rakho:** waiter order, chef khana, store wala fridge.`,
  },

  'express-validation': {
    simple: `**Never trust what comes through the door.**

Your website's form checks that the email looks right. Nice — but anyone can skip your website completely and talk to your server directly.

So the server must check **again**. Every single time.

\`\`\`
Browser check → for the user (nice message, fast)
Server check  → for safety  (this is the real one)
\`\`\`

**The dangerous mistake:** taking whatever the user sent and saving it straight into the database. Someone adds \`role: "admin"\` to the request and now they are an admin.

The fix: decide the exact list of fields you accept, and **throw away everything else**.

Also: being logged in is not the same as being allowed. Check that the note actually belongs to *this* user.

**Remember:** client checks are for comfort, server checks are for safety.`,
    simpleHi: `**Darwaze se jo aaye us par bharosa mat karo.**

Aapki website ka form check karta hai ki email sahi dikhta hai. Achha hai — par koi bhi aapki website chhod kar seedha server se baat kar sakta hai.

Isliye server ko **dobara** check karna hoga. Har baar.

\`\`\`
Browser check → user ke liye (achha message, tez)
Server check  → safety ke liye (asli check yahi hai)
\`\`\`

**Khatarnak galti:** user ne jo bheja use seedha database mein save kar dena. Koi request mein \`role: "admin"\` jod de aur wo admin ban jaye.

Ilaaj: exactly wo list tay karo jo aap accept karte ho, aur **baaki sab phenk do**.

Aur: logged in hona aur ijazat hona alag baat hai. Check karo ki wo note sach mein *isi* user ka hai.

**Yaad rakho:** client check aaram ke liye, server check safety ke liye.`,
  },

  'express-pagination-caching': {
    simple: `**Do not bring the whole library.**

Someone asks for books. You do not carry all 50,000 — you bring **20 at a time**. That is pagination.

The lazy way is "skip the first 100,000, then give me 20". But the librarian still has to *count past* 100,000 books every time. Deep pages get slower and slower.

The smart way: "give me 20 books **after this one**". Instant, no counting.

**Caching** = keeping a popular book on your desk instead of walking to the shelf each time. Great — but if a new edition arrives, you must remember to replace the one on your desk. Deciding *when to throw it away* is the hard part, not the keeping.

**Remember:** never return everything; cache only with a plan to refresh it.`,
    simpleHi: `**Poori library mat le aao.**

Koi kitaabein maangta hai. Aap saari 50,000 nahi laate — **ek baar mein 20** laate ho. Yahi pagination hai.

Aalsi tareeka hai "pehli 1,00,000 chhod kar 20 do". Par librarian ko har baar 1,00,000 kitaabein *gin kar* aage jaana padta hai. Gehre pages dheere hote jaate hain.

Samajhdaar tareeka: "**iske baad** wali 20 kitaabein do". Turant, koi ginti nahi.

**Caching** = popular kitaab ko shelf jaane ki jagah apni mez par rakh lena. Achha hai — par naya edition aaye to mez wali badalni padegi. Mushkil hissa rakhna nahi, *kab phenkna hai* wo tay karna hai.

**Yaad rakho:** sab kuch kabhi mat lauta o; cache tabhi jab refresh ka plan ho.`,
  },

  /* ─────────────────────────────── Python ──────────────────────────────── */

  'python-data-structures': {
    simple: `**Four containers, four jobs.**

- **list** \`[1, 2, 3]\` — a shopping list. Ordered, you can add and remove.
- **tuple** \`(1, 2)\` — a printed receipt. Ordered, but **cannot be changed**.
- **set** \`{1, 2}\` — a guest list. No duplicates, order does not matter.
- **dict** \`{"name": "Jay"}\` — a phone book. Look things up by name.

**The speed thing that matters in interviews:**

Finding something in a **list** = checking every item one by one.
Finding something in a **set** or **dict** = instant.

\`\`\`python
if x in big_list:   # slow — walks the whole list
if x in big_set:    # instant
\`\`\`

Turning a list into a set before searching is the single most common way to make slow Python fast.

**Remember:** list = order, set = unique + fast search, dict = name → value.`,
    simpleHi: `**Chaar container, chaar kaam.**

- **list** \`[1, 2, 3]\` — saudaa list. Order mein, add/remove kar sakte ho.
- **tuple** \`(1, 2)\` — chhapi hui receipt. Order mein, par **badal nahi sakte**.
- **set** \`{1, 2}\` — guest list. Duplicates nahi, order se farq nahi.
- **dict** \`{"name": "Jay"}\` — phone book. Naam se dhoondho.

**Speed wali baat jo interviews mein matter karti hai:**

**list** mein dhoondhna = ek-ek item check karna.
**set** ya **dict** mein dhoondhna = turant.

\`\`\`python
if x in big_list:   # dheema — poori list chalta hai
if x in big_set:    # turant
\`\`\`

Dhoondhne se pehle list ko set banana — dheeme Python ko tez karne ka sabse common tareeka.

**Yaad rakho:** list = order, set = unique + tez search, dict = naam → value.`,
  },

  'python-mutable-defaults': {
    simple: `**One shared plate for everyone.**

\`\`\`python
def add(item, plate=[]):     # ⚠️ ONE plate, made once
    plate.append(item)
    return plate

add("roti")   # ['roti']
add("dal")    # ['roti', 'dal']   😱 the roti is still there!
\`\`\`

Python makes that empty list **once**, when the function is written — not each time you call it. So every caller eats off the **same plate**.

The fix — give everyone a fresh plate:

\`\`\`python
def add(item, plate=None):
    if plate is None:
        plate = []
\`\`\`

Same trap with \`{}\`, \`set()\`, and \`datetime.now()\` as a default (that one freezes to the moment the program started).

**Remember:** never put \`[]\` or \`{}\` as a default value.`,
    simpleHi: `**Sabke liye ek hi plate.**

\`\`\`python
def add(item, plate=[]):     # ⚠️ EK plate, ek hi baar bani
    plate.append(item)
    return plate

add("roti")   # ['roti']
add("dal")    # ['roti', 'dal']   😱 roti abhi bhi padi hai!
\`\`\`

Python wo khaali list **ek hi baar** banata hai, jab function likha jata hai — har call par nahi. Isliye sab **ek hi plate** mein khaate hain.

Ilaaj — sabko nayi plate do:

\`\`\`python
def add(item, plate=None):
    if plate is None:
        plate = []
\`\`\`

Yahi trap \`{}\`, \`set()\`, aur default mein \`datetime.now()\` par bhi hai (wo program shuru hone ke waqt par freeze ho jata hai).

**Yaad rakho:** default value mein \`[]\` ya \`{}\` kabhi mat daalo.`,
  },

  'python-decorators': {
    simple: `**Gift wrapping.**

You have a gift. You wrap it in paper. It is the **same gift**, but now it looks different and maybe has a ribbon.

A decorator wraps a function. The function still does its job, but something extra happens around it — logging, timing, checking if you are logged in.

\`\`\`python
@timed              # this is the wrapping paper
def work():
    return sum(range(1000))
\`\`\`

\`@timed\` is just a shortcut for \`work = timed(work)\`.

One rule: put \`@functools.wraps(fn)\` on your wrapper. Without it, the gift **forgets its own name** — and tools that read function names (like FastAPI) break.

**Remember:** decorator = wrapping paper around a function.`,
    simpleHi: `**Gift wrapping.**

Aapke paas gift hai. Aapne use paper mein lapet diya. Gift **wahi** hai, bas ab alag dikhta hai aur shayad ribbon bhi hai.

Decorator function ko lapet deta hai. Function apna kaam karta rehta hai, par uske aas-paas kuch extra hota hai — logging, timing, ya check karna ki aap logged in ho.

\`\`\`python
@timed              # yahi wrapping paper hai
def work():
    return sum(range(1000))
\`\`\`

\`@timed\` bas \`work = timed(work)\` ka shortcut hai.

Ek rule: wrapper par \`@functools.wraps(fn)\` lagao. Iske bina gift **apna naam bhool jata hai** — aur jo tools function ka naam padhte hain (jaise FastAPI) wo toot jaate hain.

**Yaad rakho:** decorator = function ke upar wrapping paper.`,
  },

  'python-generators': {
    simple: `**A vending machine, not a warehouse.**

You need snacks. Two options:
- Buy the whole warehouse at once → nowhere to keep it
- Use a **vending machine** → one packet at a time, whenever you want

A generator is the vending machine. \`yield\` gives you one item and **pauses** until you ask for the next.

\`\`\`python
def numbers():
    for i in range(1_000_000_000):
        yield i          # gives one, then waits
\`\`\`

That loop over a billion numbers uses almost no memory, because it never holds them all.

One catch: a vending machine empties. Once you have taken everything, asking again gives you nothing — generators cannot be reused.

**Remember:** generator = one at a time, on demand.`,
    simpleHi: `**Vending machine, godaam nahi.**

Aapko snacks chahiye. Do option:
- Poora godaam ek saath khareed lo → rakhoge kahan
- **Vending machine** use karo → ek packet, jab chahiye tab

Generator wahi vending machine hai. \`yield\` ek item deta hai aur agle ki maang tak **ruk jata hai**.

\`\`\`python
def numbers():
    for i in range(1_000_000_000):
        yield i          # ek deta hai, phir rukta hai
\`\`\`

Ek arab numbers par ye loop lagbhag zero memory leta hai, kyunki wo kabhi sabko ek saath rakhta hi nahi.

Ek baat: vending machine khaali ho jati hai. Sab nikaal liya to dobara maangne par kuch nahi milta — generators dobara use nahi hote.

**Yaad rakho:** generator = ek baar mein ek, maang par.`,
  },

  'python-async': {
    simple: `**One cook, and why hiring helpers sometimes does not help.**

Python has a rule (the **GIL**): only **one** person can cook at a time, even if you hire ten cooks.

So:
- **Waiting jobs** (downloading, database, files) → helpers *do* help. While one waits for the oven, another can chop. Use \`async\`.
- **Actual cooking** (heavy maths) → helpers do **not** help, because only one may cook. You need a whole **separate kitchen** (multiprocessing).

\`\`\`python
results = await asyncio.gather(fetch(a), fetch(b))   # both wait together
\`\`\`

**The classic bug:** using \`time.sleep()\` inside async code. That is the cook falling asleep in the doorway — **nobody else can pass**. Use \`asyncio.sleep()\`.

**Remember:** async helps with waiting, not with thinking.`,
    simpleHi: `**Ek cook, aur helpers rakhne se hamesha fayda kyun nahi hota.**

Python ka ek rule hai (**GIL**): ek waqt par sirf **ek** hi bandaa paka sakta hai, chahe aap das cook rakh lo.

Isliye:
- **Intezar wale kaam** (download, database, files) → helpers ka *fayda hai*. Ek oven ka wait kar raha hai to doosra sabzi kaat sakta hai. \`async\` use karo.
- **Asli pakana** (bhaari calculation) → helpers ka **fayda nahi**, kyunki paka ek hi sakta hai. Poori **alag kitchen** chahiye (multiprocessing).

\`\`\`python
results = await asyncio.gather(fetch(a), fetch(b))   # dono saath wait karte hain
\`\`\`

**Classic bug:** async code ke andar \`time.sleep()\`. Ye cook ka darwaze mein hi so jaana hai — **koi guzar hi nahi sakta**. \`asyncio.sleep()\` use karo.

**Yaad rakho:** async intezar mein madad karta hai, sochne mein nahi.`,
  },

  /* ─────────────────────────── FastAPI & Django ────────────────────────── */

  'fastapi-routing-and-params': {
    simple: `**Your function signature is the form.**

In FastAPI you do not write validation code. You just say what **type** each thing is, and FastAPI does the checking for you.

\`\`\`python
@app.get("/users/{user_id}")
async def get_user(user_id: int, limit: int = 20):
    ...
\`\`\`

- \`user_id\` matches \`{user_id}\` in the URL → comes from the **path**
- \`limit\` is not in the path and has a default → comes from the **query** (\`?limit=5\`)

Send \`/users/abc\` and FastAPI rejects it before your code runs, because \`abc\` is not an \`int\`.

One trap: put \`/users/me\` **above** \`/users/{user_id}\`, or "me" gets treated as an id.

**Remember:** the type hint is the validation.`,
    simpleHi: `**Aapka function signature hi form hai.**

FastAPI mein validation ka code nahi likhna padta. Bas **type** bata do, FastAPI khud check kar leta hai.

\`\`\`python
@app.get("/users/{user_id}")
async def get_user(user_id: int, limit: int = 20):
    ...
\`\`\`

- \`user_id\` URL ke \`{user_id}\` se match karta hai → **path** se aata hai
- \`limit\` path mein nahi hai aur default hai → **query** se aata hai (\`?limit=5\`)

\`/users/abc\` bhejo to FastAPI aapka code chalne se pehle hi reject kar dega, kyunki \`abc\` \`int\` nahi hai.

Ek trap: \`/users/me\` ko \`/users/{user_id}\` se **upar** rakho, warna "me" ko id samajh liya jayega.

**Yaad rakho:** type hint hi validation hai.`,
  },

  'fastapi-pydantic': {
    simple: `**Two different forms: one to fill in, one to hand back.**

When someone signs up, they give you a **password**. When you show their profile, you must **never** send the password back.

So use two shapes:

\`\`\`python
class UserCreate(BaseModel):     # what comes IN
    email: EmailStr
    password: str

class UserOut(BaseModel):        # what goes OUT
    id: int
    email: EmailStr              # no password!
\`\`\`

Setting \`response_model=UserOut\` means FastAPI **removes anything not in that list** before sending. So even if your database object carries a password hash, it cannot leak.

**Remember:** separate the form you receive from the form you return.`,
    simpleHi: `**Do alag form: ek bharne ka, ek wapas dene ka.**

Sign up karte waqt user **password** deta hai. Profile dikhate waqt password kabhi wapas **nahi** bhejna chahiye.

Isliye do shapes rakho:

\`\`\`python
class UserCreate(BaseModel):     # jo ANDAR aata hai
    email: EmailStr
    password: str

class UserOut(BaseModel):        # jo BAHAR jata hai
    id: int
    email: EmailStr              # password nahi!
\`\`\`

\`response_model=UserOut\` set karne par FastAPI bhejne se pehle **us list ke bahar ka sab kuch hata deta hai**. Isliye database object mein password hash ho to bhi wo leak nahi hoga.

**Yaad rakho:** jo form lete ho aur jo lautate ho, dono alag rakho.`,
  },

  'fastapi-dependencies': {
    simple: `**Things every room needs.**

Every route needs the same few things: a database connection, the logged-in user. Writing that in each route is copy-paste and easy to forget.

\`Depends()\` says "before running me, go get this":

\`\`\`python
@app.get("/me")
async def me(user = Depends(get_current_user)):
    return user
\`\`\`

Two real wins:
- **Nobody forgets the lock.** Attach \`get_current_user\` to a whole router and no route can accidentally be public.
- **Testing is easy.** Swap the real database for a fake one with a single line.

A dependency using \`yield\` also **cleans up afterwards** — open the connection, hand it over, close it when done.

**Remember:** Depends = "fetch this for me first".`,
    simpleHi: `**Jo har kamre ko chahiye.**

Har route ko wahi kuch cheezein chahiye: database connection, logged-in user. Har route mein likhna copy-paste hai aur bhoolna aasan.

\`Depends()\` kehta hai "mujhe chalane se pehle ye le aao":

\`\`\`python
@app.get("/me")
async def me(user = Depends(get_current_user)):
    return user
\`\`\`

Do asli fayde:
- **Taala koi nahi bhoolta.** \`get_current_user\` poore router par laga do, koi route galti se public nahi ho sakta.
- **Testing aasan.** Ek line mein asli database ki jagah fake laga do.

\`yield\` wali dependency baad mein **cleanup bhi karti hai** — connection kholo, de do, kaam khatam hone par band kar do.

**Yaad rakho:** Depends = "ye pehle le aao mere liye".`,
  },

  'django-orm-and-queries': {
    simple: `**Going to the shop 101 times.**

You need 100 books and each book's author name. The lazy way:

\`\`\`python
for book in Book.objects.all():     # 1 trip: get books
    print(book.author.name)         # 100 more trips, one per book!
\`\`\`

That is **101 trips to the shop**. Each trip is fast, so it looks fine on your laptop — and falls apart with real users.

The fix: bring the authors along on the first trip.

\`\`\`python
Book.objects.select_related('author')   # 1 trip total
\`\`\`

- \`select_related\` → for "one thing" links (a book has one author)
- \`prefetch_related\` → for "many things" links (an author has many books)

**Remember:** N+1 = one trip, then one more per row. Bring everything in one trip.`,
    simpleHi: `**Dukaan ke 101 chakkar.**

Aapko 100 kitaabein aur har kitaab ke author ka naam chahiye. Aalsi tareeka:

\`\`\`python
for book in Book.objects.all():     # 1 chakkar: kitaabein
    print(book.author.name)         # 100 aur chakkar, har kitaab ke liye!
\`\`\`

Ye **dukaan ke 101 chakkar** hain. Har chakkar tez hai, isliye laptop par theek lagta hai — aur asli users par bikhar jata hai.

Ilaaj: pehle hi chakkar mein authors bhi le aao.

\`\`\`python
Book.objects.select_related('author')   # kul 1 chakkar
\`\`\`

- \`select_related\` → "ek cheez" wale links ke liye (ek kitaab ka ek author)
- \`prefetch_related\` → "kai cheezein" wale links ke liye (ek author ki kai kitaabein)

**Yaad rakho:** N+1 = ek chakkar, phir har row ke liye ek aur. Sab ek hi chakkar mein le aao.`,
  },

  'django-migrations': {
    simple: `**A diary of every change to your cupboard.**

You add a shelf. You write it in a diary. Your friend reads the diary and adds the same shelf to their cupboard. Now both cupboards match.

Migrations are that diary for your database.

- \`makemigrations\` → **write** what changed in the diary
- \`migrate\` → **actually do** what the diary says

Three rules:
1. **Commit the diary.** It is part of the code, not junk.
2. **Never edit a page others have already read.** Write a new page instead.
3. Adding a column that "cannot be empty" to a table that already has rows → what goes in those rows? Give a default, or do it in steps.

**Remember:** makemigrations writes the plan, migrate performs it.`,
    simpleHi: `**Almari ke har badlav ki diary.**

Aapne ek shelf lagayi. Diary mein likh diya. Aapke dost ne diary padhi aur apni almari mein wahi shelf lagayi. Ab dono almari ek jaisi hain.

Migrations aapke database ki wahi diary hain.

- \`makemigrations\` → kya badla, wo diary mein **likho**
- \`migrate\` → diary mein jo likha hai wo **sach mein karo**

Teen rules:
1. **Diary commit karo.** Ye code ka hissa hai, kachra nahi.
2. **Jo page doosre padh chuke hain use kabhi mat badlo.** Naya page likho.
3. Bhare hue table mein "khaali nahi ho sakta" wala column jodna → un rows mein kya jayega? Default do, ya steps mein karo.

**Yaad rakho:** makemigrations plan likhta hai, migrate use karta hai.`,
  },

  'django-rest-framework': {
    simple: `**A translator and a receptionist.**

- **Serializer** = the translator. Your database speaks Python, the internet speaks JSON. It translates both ways and checks the paperwork.
- **ViewSet** = the receptionist. Handles list, get one, create, update, delete for one thing.
- **Router** = builds all the URLs for you.
- **Permissions** = the guard deciding who gets in.

**The dangerous default:** DRF lets *everybody* in unless you say otherwise. Forget \`permission_classes\` on one endpoint and it is silently public. Set the default to "must be logged in" in settings.

**The other trap:** \`fields = '__all__'\` means "send every column". Add a secret column to the model later and it goes out over the API automatically. List your fields by hand.

**Remember:** lock the door by default, list your fields by hand.`,
    simpleHi: `**Ek translator aur ek receptionist.**

- **Serializer** = translator. Aapka database Python bolta hai, internet JSON. Ye dono taraf translate karta hai aur kaagaz check karta hai.
- **ViewSet** = receptionist. Ek cheez ke liye list, ek lao, banao, badlo, hatao — sab sambhalta hai.
- **Router** = saare URLs khud bana deta hai.
- **Permissions** = guard, jo tay karta hai kaun andar aayega.

**Khatarnak default:** DRF by default *sabko* andar aane deta hai. Ek endpoint par \`permission_classes\` bhool gaye to wo chupchaap public ho jata hai. Settings mein default "logged in hona zaroori" kar do.

**Doosra trap:** \`fields = '__all__'\` ka matlab hai "har column bhej do". Baad mein model mein koi secret column jodo aur wo apne aap API par chala jayega. Fields haath se likho.

**Yaad rakho:** darwaza default se band rakho, fields haath se likho.`,
  },

  'backend-framework-comparison': {
    simple: `**Ready-made thali vs à la carte vs empty kitchen.**

- **Django** = a full thali. Rice, dal, sabzi, admin panel, login, database — all served. Fast to start, but you eat what is on the plate.
- **FastAPI** = à la carte. Modern, fast, great for APIs, tells you the types. You still bring your own database tools.
- **Express** = an empty kitchen. Total freedom, and you cook literally everything yourself.

**How to choose:** what do you need on day one?
- Admin panel and login already built → **Django**
- A clean, fast, well-documented API → **FastAPI**
- Full control, and your team is all-in on JavaScript → **Express**

In an interview, never say one is "better". Say what you are optimising for, and what it costs.

**Remember:** thali = fast start, empty kitchen = full control.`,
    simpleHi: `**Ready thali vs à la carte vs khaali kitchen.**

- **Django** = poori thali. Chawal, dal, sabzi, admin panel, login, database — sab mil gaya. Shuru karna tez, par jo plate mein hai wahi khana hai.
- **FastAPI** = à la carte. Modern, tez, APIs ke liye badhiya, types khud batata hai. Database tools apne laane padte hain.
- **Express** = khaali kitchen. Poori azadi, aur sach mein sab kuch khud pakana padega.

**Kaise chuno:** pehle din kya chahiye?
- Admin panel aur login pehle se bane hue → **Django**
- Saaf, tez, achhe documented API → **FastAPI**
- Poora control, aur team poori JavaScript par → **Express**

Interview mein kabhi mat kaho ki ek "better" hai. Batao aap kya optimise kar rahe ho, aur uski keemat kya hai.

**Yaad rakho:** thali = tez shuruaat, khaali kitchen = poora control.`,
  },

  /* ──────────────────────────────── SQL ────────────────────────────────── */

  'sql-select-where-order': {
    simple: `**Talking to a very literal shopkeeper.**

\`\`\`sql
SELECT name, city      -- which columns do you want?
FROM users             -- from which register?
WHERE city = 'Delhi'   -- which rows?
ORDER BY name          -- in what order?
LIMIT 10;              -- how many?
\`\`\`

Read it as: *"From the users register, show me name and city, only for Delhi, sorted by name, first 10."*

**The one thing that confuses everyone:** SQL does not run in the order you write it. It picks the rows **first** (\`WHERE\`), and chooses what to display **later** (\`SELECT\`). That is why a nickname you invented in \`SELECT\` cannot be used in \`WHERE\` — it does not exist yet.

**And never write \`= NULL\`.** NULL means "unknown". Asking "is unknown equal to unknown?" gives... unknown. Use \`IS NULL\`.

**Remember:** WHERE runs before SELECT.`,
    simpleHi: `**Ek bahut literal dukaandaar se baat karna.**

\`\`\`sql
SELECT name, city      -- kaun se columns chahiye?
FROM users             -- kaun se register se?
WHERE city = 'Delhi'   -- kaun si rows?
ORDER BY name          -- kis order mein?
LIMIT 10;              -- kitni?
\`\`\`

Aise padho: *"users register se name aur city dikhao, sirf Delhi wale, naam se sorted, pehli 10."*

**Jo sabko confuse karta hai:** SQL us order mein nahi chalta jis order mein aap likhte ho. Wo **pehle** rows chunta hai (\`WHERE\`), aur kya dikhana hai wo **baad mein** (\`SELECT\`). Isiliye \`SELECT\` mein banaya hua nickname \`WHERE\` mein use nahi kar sakte — wo abhi bana hi nahi.

**Aur \`= NULL\` kabhi mat likho.** NULL ka matlab "pata nahi". "Kya pata-nahi, pata-nahi ke barabar hai?" ka jawab bhi... pata nahi. \`IS NULL\` use karo.

**Yaad rakho:** WHERE, SELECT se pehle chalta hai.`,
  },

  'sql-joins': {
    simple: `**Two registers, matched by roll number.**

Register 1 has students. Register 2 has their marks. To see both together, you **match them by roll number**. That is a JOIN.

- **INNER JOIN** — only students who have marks. No marks? Not shown.
- **LEFT JOIN** — **all** students. No marks? Shown with blanks.

\`\`\`sql
SELECT u.name, o.id
FROM users u
LEFT JOIN orders o ON o.user_id = u.id;
\`\`\`

**The trap that catches everybody.** You LEFT JOIN to keep users with no orders — then add \`WHERE o.status = 'paid'\`. The users with no orders have a *blank* status, blank fails the check, and they disappear. Your LEFT JOIN quietly became an INNER JOIN.

Fix: put that condition in the \`ON\` line, not \`WHERE\`.

**Remember:** LEFT JOIN keeps everyone on the left — until WHERE throws them out.`,
    simpleHi: `**Do register, roll number se milaye hue.**

Register 1 mein students hain. Register 2 mein unke marks. Dono saath dekhne ke liye **roll number se match** karte ho. Yahi JOIN hai.

- **INNER JOIN** — sirf wo students jinke marks hain. Marks nahi? Nahi dikhega.
- **LEFT JOIN** — **saare** students. Marks nahi? Khaali dikha kar bhi dikhega.

\`\`\`sql
SELECT u.name, o.id
FROM users u
LEFT JOIN orders o ON o.user_id = u.id;
\`\`\`

**Wo trap jo sabko pakadta hai.** Aapne LEFT JOIN kiya taaki bina order wale users bhi dikhein — phir \`WHERE o.status = 'paid'\` jod diya. Bina order wale users ka status *khaali* hai, khaali check fail karta hai, aur wo gayab ho jaate hain. Aapka LEFT JOIN chupchaap INNER JOIN ban gaya.

Ilaaj: wo condition \`ON\` wali line mein daalo, \`WHERE\` mein nahi.

**Yaad rakho:** LEFT JOIN left wale sabko rakhta hai — jab tak WHERE unhe nikaal na de.`,
  },

  'sql-group-by-aggregates': {
    simple: `**Sorting sweets into boxes and counting each box.**

You have 100 sweets of different flavours. \`GROUP BY flavour\` puts them into boxes — one box per flavour. Then you count each box.

\`\`\`sql
SELECT city, COUNT(*) FROM users GROUP BY city;
-- Delhi  → 2
-- Mumbai → 2
\`\`\`

**WHERE vs HAVING** — this always gets asked:
- \`WHERE\` — throw away sweets **before** boxing them
- \`HAVING\` — throw away whole **boxes** after counting

\`\`\`sql
WHERE age > 25          -- ignore young users first
GROUP BY city
HAVING COUNT(*) > 1     -- then drop cities with only one
\`\`\`

**One counting trap:** \`COUNT(*)\` counts rows even if they are blank. \`COUNT(o.id)\` counts only real orders. With a LEFT JOIN, that difference makes "0 orders" show up as "1".

**Remember:** WHERE filters sweets, HAVING filters boxes.`,
    simpleHi: `**Mithai ko dabbon mein baant kar ginna.**

Aapke paas alag-alag flavour ki 100 mithai hain. \`GROUP BY flavour\` unhe dabbon mein daal deta hai — har flavour ka ek dabba. Phir har dabba ginte ho.

\`\`\`sql
SELECT city, COUNT(*) FROM users GROUP BY city;
-- Delhi  → 2
-- Mumbai → 2
\`\`\`

**WHERE vs HAVING** — ye hamesha poocha jata hai:
- \`WHERE\` — dabbe mein daalne se **pehle** mithai hatao
- \`HAVING\` — ginne ke baad poore **dabbe** hatao

\`\`\`sql
WHERE age > 25          -- pehle chhote users hatao
GROUP BY city
HAVING COUNT(*) > 1     -- phir ek wale cities hatao
\`\`\`

**Ginne ka ek trap:** \`COUNT(*)\` khaali rows ko bhi ginta hai. \`COUNT(o.id)\` sirf asli orders ginta hai. LEFT JOIN ke saath isi farq se "0 orders" wala "1" dikhne lagta hai.

**Yaad rakho:** WHERE mithai chhaanta hai, HAVING dabbe.`,
  },

  'sql-subqueries-cte': {
    simple: `**Doing a big sum in steps.**

Instead of one giant confusing query, do it in named steps:

\`\`\`sql
WITH monthly AS (
  SELECT user_id, SUM(total) AS spent
  FROM orders GROUP BY user_id
)
SELECT name, spent FROM monthly JOIN users ...
\`\`\`

\`WITH\` gives a name to a middle step, exactly like writing \`x = ...\` before using \`x\`. Much easier to read and to fix.

**The slow thing to avoid:** a query that runs **once per row**. 10,000 rows = 10,000 little queries. Use a JOIN or a \`WITH\` step instead.

Also: \`EXISTS\` is usually safer than \`IN\`, because \`IN\` misbehaves badly when the inner list contains a blank.

**Remember:** WITH = give the middle step a name.`,
    simpleHi: `**Bada hisaab steps mein karna.**

Ek viraat confusing query ki jagah, naam wale steps mein karo:

\`\`\`sql
WITH monthly AS (
  SELECT user_id, SUM(total) AS spent
  FROM orders GROUP BY user_id
)
SELECT name, spent FROM monthly JOIN users ...
\`\`\`

\`WITH\` beech ke step ko naam de deta hai, bilkul jaise \`x = ...\` likh kar phir \`x\` use karte ho. Padhna aur theek karna dono aasan.

**Jo dheemi cheez bachani hai:** aisi query jo **har row par ek baar** chalti hai. 10,000 rows = 10,000 chhoti queries. Uski jagah JOIN ya \`WITH\` step use karo.

Aur: \`IN\` se \`EXISTS\` aksar safe hai, kyunki andar ki list mein ek bhi khaali value ho to \`IN\` bahut ajeeb behave karta hai.

**Yaad rakho:** WITH = beech ke step ko naam do.`,
  },

  'sql-indexes': {
    simple: `**The index page at the back of a book.**

You want the word "photosynthesis". Two ways:
- Read all 900 pages until you find it
- Look at the **index page**: "photosynthesis — page 412". Go straight there.

A database index is that index page. Without one, the database reads **every single row**.

But an index is not free: every time you add a new page to the book, you must also update the index. So indexes make reading fast and **writing slower**. Index what you search by — not everything.

**The order matters.** An index on \`(city, age)\` is like a phone book sorted by city, then age. Great for "Delhi people" and "Delhi people aged 25". Useless for "everyone aged 25" — because age is only sorted *within* each city.

**Remember:** index = the book's index page. Helps reading, costs writing.`,
    simpleHi: `**Kitaab ke peeche ka index page.**

Aapko "photosynthesis" shabd chahiye. Do tareeke:
- Poore 900 page padho jab tak mil na jaye
- **Index page** dekho: "photosynthesis — page 412". Seedha wahan jao.

Database ka index wahi index page hai. Uske bina database **har ek row** padhta hai.

Par index muft nahi hai: kitaab mein naya page jodo to index bhi update karna padta hai. Isliye index reading tez aur **writing dheemi** karte hain. Jispar search karte ho usi par index banao — har cheez par nahi.

**Order matter karta hai.** \`(city, age)\` par index ek aisi phone book hai jo pehle city se, phir age se sorted hai. "Delhi wale" aur "Delhi ke 25 saal wale" ke liye badhiya. "Sab 25 saal wale" ke liye bekaar — kyunki age sirf *har city ke andar* sorted hai.

**Yaad rakho:** index = kitaab ka index page. Padhna tez, likhna mehenga.`,
  },

  'sql-transactions-acid': {
    simple: `**Sending money — both halves or neither.**

You transfer ₹500 to a friend. Two things must happen:
1. ₹500 leaves your account
2. ₹500 enters their account

If the power goes out between them, the money **vanishes**. That must never be possible.

A **transaction** says: do both, or undo both. All or nothing.

\`\`\`sql
BEGIN;
  UPDATE accounts SET balance = balance - 500 WHERE id = 1;
  UPDATE accounts SET balance = balance + 500 WHERE id = 2;
COMMIT;
\`\`\`

**The bug this prevents.** Two people buy the last item at the same moment. Both read "stock = 1", both write "stock = 0", and you sold one item twice. The fix is to let the database do the subtraction:

\`\`\`sql
UPDATE products SET stock = stock - 1 WHERE id = 1 AND stock > 0;
\`\`\`

**Remember:** transaction = both halves, or neither.`,
    simpleHi: `**Paisa bhejna — dono hisse ya koi nahi.**

Aap dost ko ₹500 bhejte ho. Do cheezein honi chahiye:
1. ₹500 aapke account se nikle
2. ₹500 uske account mein aaye

Beech mein bijli chali jaye to paisa **gayab**. Aisa kabhi possible nahi hona chahiye.

**Transaction** kehta hai: dono karo, ya dono undo karo. Sab ya kuch nahi.

\`\`\`sql
BEGIN;
  UPDATE accounts SET balance = balance - 500 WHERE id = 1;
  UPDATE accounts SET balance = balance + 500 WHERE id = 2;
COMMIT;
\`\`\`

**Ye kaun sa bug rokta hai.** Do log ek hi waqt par aakhri item khareedte hain. Dono "stock = 1" padhte hain, dono "stock = 0" likh dete hain, aur ek item do baar bik gaya. Ilaaj ye hai ki ghatana database se karwao:

\`\`\`sql
UPDATE products SET stock = stock - 1 WHERE id = 1 AND stock > 0;
\`\`\`

**Yaad rakho:** transaction = dono hisse, ya ek bhi nahi.`,
  },

  'sql-injection': {
    simple: `**Someone writing extra words on your form.**

You build a question by **gluing** the user's text into it:

\`\`\`js
"SELECT * FROM users WHERE email = '" + email + "'"
\`\`\`

Now someone types \`' OR '1'='1\` as their email. Your question becomes "show me users where email is this **OR where 1 = 1**" — and 1 always equals 1. They just got **every user in your database**.

The fix is to stop gluing. Send the question and the values **separately**:

\`\`\`sql
SELECT * FROM users WHERE email = $1;
\`\`\`

Now the value can never become part of the question. It is data, not instructions — no matter what they type.

**Remember:** never glue user text into a query. Send values separately.`,
    simpleHi: `**Koi aapke form par extra shabd likh de.**

Aap sawaal banate ho user ka text **chipka kar**:

\`\`\`js
"SELECT * FROM users WHERE email = '" + email + "'"
\`\`\`

Ab koi email ki jagah \`' OR '1'='1\` type kar deta hai. Aapka sawaal ban jata hai "wo users dikhao jinka email ye hai **YA jahan 1 = 1**" — aur 1 hamesha 1 ke barabar hai. Use aapke database ke **saare users** mil gaye.

Ilaaj ye hai ki chipkana band karo. Sawaal aur values **alag-alag** bhejo:

\`\`\`sql
SELECT * FROM users WHERE email = $1;
\`\`\`

Ab value kabhi sawaal ka hissa ban hi nahi sakti. Wo data hai, instruction nahi — chahe kuch bhi type karein.

**Yaad rakho:** user ka text query mein kabhi mat chipkao. Values alag bhejo.`,
  },

  'db-normalization': {
    simple: `**Write it once, not everywhere.**

Bad: put the customer's phone number on **every** order.
- 50 orders = the same number written 50 times
- They change their number → you must fix 50 rows
- Miss one → your data now disagrees with itself

Good: keep customers in one place, orders in another, and orders just **point at** the customer.

That is normalisation: **each fact lives in exactly one place.**

The relationships:
- **one-to-many** — one customer, many orders → orders store the customer's id
- **many-to-many** — students and classes → a third table holding pairs

**When to break the rule:** copying the *price* into an order is correct — that is a record of what they actually paid. If the shop raises the price tomorrow, the old bill must not change.

**Remember:** one fact, one place — unless you are recording history.`,
    simpleHi: `**Ek baar likho, har jagah nahi.**

Bura: customer ka phone number **har** order par likh do.
- 50 orders = wahi number 50 baar
- Number badla → 50 rows theek karni padengi
- Ek chhoot gayi → aapka data khud se hi alag ho gaya

Achha: customers ek jagah, orders doosri jagah, aur orders bas customer ki taraf **ishara** karein.

Yahi normalisation hai: **har baat exactly ek jagah rehti hai.**

Relationships:
- **one-to-many** — ek customer, kai orders → orders customer ki id rakhte hain
- **many-to-many** — students aur classes → ek teesri table jo jode rakhti hai

**Rule kab todna hai:** order mein *price* copy karna sahi hai — wo record hai ki usne kitna diya. Kal dukaan daam badha de to purana bill nahi badalna chahiye.

**Yaad rakho:** ek baat, ek jagah — jab tak aap history record na kar rahe ho.`,
  },

  /* ─────────────────────────────── MongoDB ─────────────────────────────── */

  'mongo-documents': {
    simple: `**A folder of forms, not a spreadsheet.**

SQL is a **spreadsheet**: fixed columns, every row must fit them.

MongoDB is a **folder of filled-in forms**. Each form can have slightly different fields, and forms can have smaller forms stapled inside them.

\`\`\`js
{
  name: "Wireless Mouse",
  price: 499,
  tags: ["electronics"],              // a list, right there
  supplier: { name: "Acme", city: "Pune" }   // a form inside a form
}
\`\`\`

Word swaps: table → **collection**, row → **document**, column → **field**.

**But "no fixed columns" does not mean "no rules".** If you save \`price: 499\` in one form and \`price: "499"\` in another, searches for "under 1000" will silently skip half your data. The rules moved into *your code*; they did not disappear.

**Remember:** documents are forms in a folder — flexible, but still needs discipline.`,
    simpleHi: `**Bhare hue forms ka folder, spreadsheet nahi.**

SQL ek **spreadsheet** hai: columns fix, har row unme fit honi chahiye.

MongoDB **bhare hue forms ka folder** hai. Har form ke fields thode alag ho sakte hain, aur form ke andar chhote form nathhi ho sakte hain.

\`\`\`js
{
  name: "Wireless Mouse",
  price: 499,
  tags: ["electronics"],              // list, wahin par
  supplier: { name: "Acme", city: "Pune" }   // form ke andar form
}
\`\`\`

Shabd badal gaye: table → **collection**, row → **document**, column → **field**.

**Par "columns fix nahi" ka matlab "koi rule nahi" nahi hai.** Ek form mein \`price: 499\` aur doosre mein \`price: "499"\` save kiya, to "1000 se kam" wali search chupchaap aadha data chhod degi. Rules *aapke code* mein aa gaye; gayab nahi hue.

**Yaad rakho:** documents folder ke forms hain — flexible, par discipline phir bhi chahiye.`,
  },

  'mongo-crud': {
    simple: `**Editing a form vs throwing it away.**

\`\`\`js
insertOne({ name: "Mouse", price: 499 })   // add a form
find({ price: { $lt: 1000 } })             // find forms
updateOne({ _id }, { $set: { price: 449 } })  // edit a field
deleteOne({ _id })                         // bin it
\`\`\`

**The mistake everyone makes exactly once.** Forget \`$set\`:

\`\`\`js
updateOne({ _id }, { price: 449 })    // 💀
\`\`\`

That does not mean "change the price". It means "**replace this whole form with a form that only has a price**". Name, stock, tags — all gone.

**The second trap:** reading stock, subtracting 1 in your code, then saving. Two orders at the same moment both read 10, both save 9, and one sale disappears. Let Mongo do the subtraction:

\`\`\`js
updateOne({ _id, stock: { $gt: 0 } }, { $inc: { stock: -1 } })
\`\`\`

**Remember:** \`$set\` edits, no \`$set\` replaces everything.`,
    simpleHi: `**Form edit karna vs use phenk dena.**

\`\`\`js
insertOne({ name: "Mouse", price: 499 })   // naya form
find({ price: { $lt: 1000 } })             // forms dhoondho
updateOne({ _id }, { $set: { price: 449 } })  // ek field badlo
deleteOne({ _id })                         // phenk do
\`\`\`

**Wo galti jo har koi ek baar karta hai.** \`$set\` bhool jao:

\`\`\`js
updateOne({ _id }, { price: 449 })    // 💀
\`\`\`

Iska matlab "price badlo" nahi hai. Matlab hai "**poore form ko aise form se badal do jisme sirf price hai**". Name, stock, tags — sab gayab.

**Doosra trap:** stock padho, apne code mein 1 ghatao, phir save karo. Ek hi waqt par do orders dono 10 padhte hain, dono 9 likh dete hain, aur ek sale gayab. Ghatane ka kaam Mongo ko karne do:

\`\`\`js
updateOne({ _id, stock: { $gt: 0 } }, { $inc: { stock: -1 } })
\`\`\`

**Yaad rakho:** \`$set\` edit karta hai, bina \`$set\` sab kuch replace ho jata hai.`,
  },

  'mongo-query-operators': {
    simple: `**Ways to say "which ones?"**

\`\`\`js
{ price: { $lt: 1000 } }        // less than 1000
{ price: { $gte: 100 } }        // 100 or more
{ city: { $in: ['Delhi', 'Pune'] } }   // either one
{ phone: { $exists: true } }    // has this field at all
\`\`\`

**Arrays are surprisingly nice.** If \`tags\` is a list, this just works:

\`\`\`js
{ tags: "electronics" }   // any product whose tag list CONTAINS this
\`\`\`

No special operator needed. That one behaviour removes most of the join tables you would need in SQL.

**Ask for less.** By default you get the whole form back. If you only need two fields, say so — it is faster and lighter:

\`\`\`js
find(filter, { projection: { name: 1, price: 1 } })
\`\`\`

**Remember:** matching an array means "contains". Ask only for the fields you need.`,
    simpleHi: `**"Kaun se?" poochhne ke tareeke.**

\`\`\`js
{ price: { $lt: 1000 } }        // 1000 se kam
{ price: { $gte: 100 } }        // 100 ya usse zyada
{ city: { $in: ['Delhi', 'Pune'] } }   // in dono mein se koi
{ phone: { $exists: true } }    // ye field hai bhi ya nahi
\`\`\`

**Arrays kaafi achhe se chalte hain.** \`tags\` ek list hai to bas ye kaam karta hai:

\`\`\`js
{ tags: "electronics" }   // wo product jiski tag list mein ye HAI
\`\`\`

Koi special operator nahi chahiye. Bas isi ek behaviour se SQL wali zyadatar join tables khatam ho jaati hain.

**Kam maango.** Default mein poora form wapas aata hai. Sirf do fields chahiye to bata do — tez aur halka:

\`\`\`js
find(filter, { projection: { name: 1, price: 1 } })
\`\`\`

**Yaad rakho:** array match ka matlab "contains". Sirf zaroori fields maango.`,
  },

  'mongo-aggregation': {
    simple: `**A factory conveyor belt.**

Documents go in one end. They pass through machines in order, each one changing them, and the answer comes out the other end.

\`\`\`js
[
  { $match: { status: "paid" } },   // 1. keep only paid orders
  { $group: { _id: "$city", total: { $sum: "$amount" } } },  // 2. sum by city
  { $sort: { total: -1 } },         // 3. biggest first
  { $limit: 5 }                     // 4. top 5
]
\`\`\`

**Golden rule: put \`$match\` first.** Filter at the start and every later machine has fewer boxes to handle. Filter at the end and you did all that work for nothing.

**\`$unwind\`** splits a list into separate documents — an order with 3 items becomes 3 documents. Very useful, but it *multiplies* your boxes, so filter before it, never after.

**Remember:** conveyor belt, and always filter first.`,
    simpleHi: `**Factory ki conveyor belt.**

Documents ek sire se andar jaate hain. Order mein machines se guzarte hain, har machine unhe badalti hai, aur doosre sire se jawab nikalta hai.

\`\`\`js
[
  { $match: { status: "paid" } },   // 1. sirf paid orders rakho
  { $group: { _id: "$city", total: { $sum: "$amount" } } },  // 2. city se sum
  { $sort: { total: -1 } },         // 3. bade pehle
  { $limit: 5 }                     // 4. top 5
]
\`\`\`

**Golden rule: \`$match\` sabse pehle.** Shuru mein filter karo to aage har machine ko kam dabbe sambhalne padte hain. Aakhir mein filter kiya to saara kaam bekaar gaya.

**\`$unwind\`** list ko alag documents mein tod deta hai — 3 items wala order 3 documents. Bahut kaam ka, par ye dabbe *badha* deta hai, isliye usse pehle filter karo, baad mein nahi.

**Yaad rakho:** conveyor belt, aur hamesha pehle filter.`,
  },

  'mongo-indexes': {
    simple: `**Same index page, different book.**

Just like SQL: without an index, Mongo reads **every document**. With one, it jumps straight there.

Check which happened:

\`\`\`js
db.orders.find({ userId: id }).explain("executionStats")
// IXSCAN = used the index ✅   COLLSCAN = read everything ❌
\`\`\`

Look at **how many it read vs how many it returned**. Reading 100,000 to return 20 means the index is missing or wrong.

**Field order rule — ESR:**
1. **E**quality first — \`userId = 5\`
2. **S**ort next — \`createdAt\`
3. **R**ange last — \`price > 100\`

Two special ones worth knowing:
- **unique** — stops duplicate emails
- **TTL** — documents **delete themselves** after N seconds. Perfect for OTPs and sessions.

**Remember:** ESR — Equality, Sort, Range.`,
    simpleHi: `**Wahi index page, alag kitaab.**

SQL jaisa hi: index ke bina Mongo **har document** padhta hai. Index ke saath seedha wahan pahunch jata hai.

Kya hua ye check karo:

\`\`\`js
db.orders.find({ userId: id }).explain("executionStats")
// IXSCAN = index use hua ✅   COLLSCAN = sab padha ❌
\`\`\`

**Kitne padhe vs kitne laute** ye dekho. 20 lautane ke liye 1,00,000 padhna matlab index nahi hai ya galat hai.

**Field order ka rule — ESR:**
1. **E**quality pehle — \`userId = 5\`
2. **S**ort uske baad — \`createdAt\`
3. **R**ange aakhir mein — \`price > 100\`

Do special jo jaanne layak hain:
- **unique** — duplicate email rokta hai
- **TTL** — documents N seconds baad **khud delete** ho jaate hain. OTP aur sessions ke liye perfect.

**Yaad rakho:** ESR — Equality, Sort, Range.`,
  },

  'mongo-schema-design': {
    simple: `**Staple it inside, or write the address?**

You have an order with 3 items. Two choices:

**Staple the items inside the order** (embed):
- You always read them together anyway
- One read gets everything — no second trip

**Write the customer's address instead of stapling the whole customer** (reference):
- Because the same customer appears on 500 orders
- Stapling means updating 500 places when they move house

**The rule:**
- Read together + stays small → **staple it in**
- Shared by many + can grow forever → **write the address**

**The trap that kills apps.** One document cannot exceed **16 MB**. Staple a list that grows forever — an activity log, chat messages — and one day, in production, it stops working.

**Copying is sometimes right.** Put the *price* inside the order item. It records what the customer actually paid. If the price changes next month, the old bill must not change.

**Remember:** staple what you read together and that stays small.`,
    simpleHi: `**Andar nathhi kar do, ya pata likh do?**

Ek order hai jisme 3 items hain. Do choice:

**Items ko order ke andar nathhi kar do** (embed):
- Aap dono ko waise bhi saath hi padhte ho
- Ek read mein sab kuch — doosra chakkar nahi

**Poora customer nathhi karne ki jagah uska pata likh do** (reference):
- Kyunki wahi customer 500 orders par aata hai
- Nathhi karoge to ghar badalne par 500 jagah badalni padegi

**Rule:**
- Saath padha jata hai + chhota rehta hai → **andar nathhi karo**
- Bahut jagah shared + hamesha badh sakta hai → **pata likho**

**Wo trap jo apps maar deta hai.** Ek document **16 MB** se bada nahi ho sakta. Aisi list nathhi kar di jo hamesha badhti hai — activity log, chat messages — aur ek din, production mein, sab band.

**Copy karna kabhi-kabhi sahi hai.** Order item ke andar *price* rakho. Wo record hai ki customer ne kitna diya. Agle mahine daam badle to purana bill nahi badalna chahiye.

**Yaad rakho:** jo saath padha jata hai aur chhota rehta hai use nathhi karo.`,
  },

  'mongo-mongoose': {
    simple: `**Putting the rules back.**

MongoDB lets you save anything. That freedom becomes a problem fast.

Mongoose is a **rulebook** on top: this field must be a number, this one is required, this one defaults to "pending".

\`\`\`js
const orderSchema = new mongoose.Schema({
  total:  { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
});
\`\`\`

**\`populate()\`** follows an address and fetches the real thing. Handy — but it is a **second trip to the database**. Do it inside a loop and you are making hundreds of trips.

**A sneaky one:** if you hash passwords in a \`pre('save')\` hook, \`findOneAndUpdate\` **skips it** — and quietly saves the plain password. Route password changes through \`save()\`.

**Remember:** Mongoose = the rulebook Mongo does not have.`,
    simpleHi: `**Rules wapas lagana.**

MongoDB kuch bhi save karne deta hai. Ye azadi jaldi hi problem ban jati hai.

Mongoose upar se ek **rulebook** hai: ye field number hona chahiye, ye zaroori hai, iska default "pending" hai.

\`\`\`js
const orderSchema = new mongoose.Schema({
  total:  { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
});
\`\`\`

**\`populate()\`** pata follow karke asli cheez le aata hai. Kaam ka — par ye **database ka doosra chakkar** hai. Loop ke andar karoge to sau chakkar lag jayenge.

**Ek chupi hui baat:** agar aap \`pre('save')\` hook mein password hash karte ho, to \`findOneAndUpdate\` use **skip kar deta hai** — aur chupchaap plain password save kar deta hai. Password change \`save()\` se karao.

**Yaad rakho:** Mongoose = wo rulebook jo Mongo mein nahi hai.`,
  },

  'mongo-transactions': {
    simple: `**One form is safe. Two forms need a promise.**

Changing **one document** is always safe — Mongo never leaves it half-changed, no matter how big it is.

That is a design hint: **put things that change together into one document**, and you never need anything fancier.

But sometimes two separate documents must change together (reduce stock **and** create an order). Then you need a **transaction** — both, or neither.

They work, but:
- They need a proper Mongo setup (a replica set — Atlas has this)
- They are slower
- Needing one often means you should have stapled the data together instead

**One more thing:** when it really matters (money), tell Mongo to wait until **most servers** have the data (\`w: "majority"\`). Otherwise a crash at the wrong moment can lose a write it already confirmed.

**Remember:** one document = already safe. Two = you need a transaction.`,
    simpleHi: `**Ek form safe hai. Do forms ke liye waada chahiye.**

**Ek document** badalna hamesha safe hai — Mongo use kabhi aadha-adhoora nahi chhodta, chahe wo kitna bhi bada ho.

Ye ek design ishara hai: **jo saath badalta hai use ek document mein rakho**, phir kuch extra chahiye hi nahi.

Par kabhi-kabhi do alag documents saath badalne padte hain (stock kam karo **aur** order banao). Tab **transaction** chahiye — dono, ya ek bhi nahi.

Ye chalte hain, par:
- Sahi Mongo setup chahiye (replica set — Atlas mein hai)
- Dheeme hain
- Inki zarurat padna aksar matlab hai ki data saath nathhi karna chahiye tha

**Ek aur baat:** jab sach mein matter kare (paisa), to Mongo se kaho ki **zyadatar servers** tak data pahunchne tak ruko (\`w: "majority"\`). Warna galat waqt par crash ho to confirm kiya hua write bhi kho sakta hai.

**Yaad rakho:** ek document = pehle se safe. Do = transaction chahiye.`,
  },

  'mongo-vs-sql': {
    simple: `**Spreadsheet or folder of forms?**

**Use SQL (Postgres) when:**
- Things are connected — customers, orders, payments
- Getting it wrong costs money
- You want the **database itself** to refuse bad data

**Use MongoDB when:**
- Each record is read and written as a whole
- Records genuinely differ in shape
- You already know how you will search it

**The honest answer in an interview** is not "Mongo is modern" or "SQL is safer". It is: *"How will this data be read?"* — then name the trade-off.

Two facts people get wrong:
- Mongo **does** have transactions (since version 4)
- Postgres **can** store flexible JSON (JSONB)

So "I need flexible fields" alone is rarely a reason to leave SQL. Many real apps use both — SQL for money, Mongo for the catalogue.

**Remember:** ask how the data is read, not which is trendier.`,
    simpleHi: `**Spreadsheet ya forms ka folder?**

**SQL (Postgres) tab jab:**
- Cheezein aapas mein judi hain — customers, orders, payments
- Galti mehengi padti hai
- Aap chahte ho ki **database khud** galat data reject kare

**MongoDB tab jab:**
- Har record poora hi padha aur likha jata hai
- Records ke shapes sach mein alag hain
- Aapko pehle se pata hai kaise search karoge

**Interview mein imaandar jawab** "Mongo modern hai" ya "SQL safe hai" nahi hai. Wo hai: *"Ye data padha kaise jayega?"* — phir trade-off batao.

Do baatein jo log galat samajhte hain:
- Mongo mein transactions **hain** (version 4 se)
- Postgres flexible JSON **rakh sakta hai** (JSONB)

Isliye sirf "flexible fields chahiye" SQL chhodne ki wajah nahi hoti. Kai asli apps dono use karte hain — paise ke liye SQL, catalogue ke liye Mongo.

**Yaad rakho:** poochho data padha kaise jayega, ye nahi ki trendy kya hai.`,
  },

  /* ─────────────────────── REST, Auth, Design, Tools ───────────────────── */

  'rest-design-principles': {
    simple: `**Ordering at a counter.**

A REST API is a menu. Each item on the menu is a **thing** (a noun), and you say what you want to **do** with it (a verb):

\`\`\`
GET    /users        → show me the users
POST   /users        → add a new user
PATCH  /users/5      → change user 5
DELETE /users/5      → remove user 5
\`\`\`

The URL says *what*, the method says *what to do*. So \`/getUser\` is wrong — "get" is already the method.

**Status codes are the shopkeeper's reply:**

| Code | Means |
|---|---|
| 200 | here you go |
| 201 | created it |
| 400 | I could not understand you |
| **401** | **who are you?** (not logged in) |
| **403** | **I know you, but no** (logged in, not allowed) |
| 404 | no such thing |
| 500 | *my* mistake, sorry |

401 vs 403 is asked constantly.

**Remember:** URL = the noun, method = the verb.`,
    simpleHi: `**Counter par order dena.**

REST API ek menu hai. Menu ka har item ek **cheez** hai (noun), aur aap batate ho uske saath **kya karna** hai (verb):

\`\`\`
GET    /users        → users dikhao
POST   /users        → naya user jodo
PATCH  /users/5      → user 5 badlo
DELETE /users/5      → user 5 hatao
\`\`\`

URL batata hai *kya*, method batata hai *kya karna hai*. Isliye \`/getUser\` galat hai — "get" to method mein already hai.

**Status codes dukaandaar ka jawab hain:**

| Code | Matlab |
|---|---|
| 200 | ye lijiye |
| 201 | bana diya |
| 400 | aapki baat samajh nahi aayi |
| **401** | **aap kaun ho?** (login nahi) |
| **403** | **pata hai aap kaun ho, par nahi** (login hai, ijazat nahi) |
| 404 | aisi cheez hai hi nahi |
| 500 | *meri* galti, maaf karo |

401 vs 403 baar-baar poocha jata hai.

**Yaad rakho:** URL = noun, method = verb.`,
  },

  'rest-idempotency-versioning': {
    simple: `**Pressing the lift button twice.**

Press it once, press it ten times — the lift still comes once. That is **idempotent**: repeating it changes nothing extra.

- \`GET\`, \`PUT\`, \`DELETE\` → safe to repeat
- \`POST\` → **not safe**. Pressing "Pay" twice can charge you twice.

Why does this matter? Because the internet drops. Your payment goes through, the reply gets lost, and the app retries. Now you have been charged twice.

**The fix:** the app sends a unique ticket number with the request. If the server sees the same ticket again, it says "already did that, here is the same reply" instead of charging again.

**Versioning:** once other people use your API, you cannot rename things freely. Adding a new optional field is fine. Removing or renaming one breaks them — that needs \`/v2/\`.

**Remember:** POST is not safe to repeat unless you make it safe.`,
    simpleHi: `**Lift ka button do baar dabana.**

Ek baar dabao ya das baar — lift ek hi baar aayegi. Yahi **idempotent** hai: dohraane se kuch extra nahi hota.

- \`GET\`, \`PUT\`, \`DELETE\` → dohraana safe
- \`POST\` → **safe nahi**. "Pay" do baar dabane par do baar paise kat sakte hain.

Ye matter kyun karta hai? Kyunki internet kat jata hai. Aapka payment ho gaya, jawab kho gaya, aur app dobara try karta hai. Ab do baar paise kat gaye.

**Ilaaj:** app request ke saath ek unique ticket number bhejta hai. Server wahi ticket dobara dekhe to kehta hai "ye to kar chuka hoon, yahi jawab lo" — dobara paise nahi kaatta.

**Versioning:** jab doosre log aapka API use karne lagein, aap naam manmarzi se nahi badal sakte. Naya optional field jodna theek hai. Field hataana ya rename karna unhe todta hai — uske liye \`/v2/\` chahiye.

**Yaad rakho:** POST dohraana safe nahi, jab tak aap use safe na banao.`,
  },

  'auth-jwt-vs-sessions': {
    simple: `**Cinema ticket vs guest list.**

**Session = a guest list at the door.** The guard has a book with your name in it. Want to throw someone out? Cross out the name. Instant.

**JWT = a stamped ticket in your hand.** The guard just checks the stamp is real — no book needed. Faster, works anywhere.

**But** you cannot un-print a ticket. Someone steals it, and it works until it expires. "Logging out" only tears up *your* copy.

**So real apps use both:**
- A **ticket that expires in 15 minutes** (access token) — fast, and short-lived if stolen
- A **name on a list** to get new tickets (refresh token) — can be crossed out any time

**Where to keep it:** in a cookie marked \`httpOnly\`, which JavaScript **cannot read**. Putting it in \`localStorage\` means any bad script on your page can steal it.

**Remember:** short ticket + crossable list.`,
    simpleHi: `**Cinema ticket vs guest list.**

**Session = darwaze par guest list.** Guard ke paas book hai jisme aapka naam hai. Kisi ko nikalna hai? Naam kaat do. Turant.

**JWT = haath mein stamp lagi ticket.** Guard bas dekhta hai ki stamp asli hai — book ki zarurat nahi. Tez, aur kahin bhi chalta hai.

**Par** ticket ko wapas un-print nahi kar sakte. Koi chura le to expire hone tak chalti rahegi. "Logout" sirf *aapki* copy phaadta hai.

**Isliye asli apps dono use karte hain:**
- **15 minute mein expire hone wali ticket** (access token) — tez, aur chori ho to bhi kam der chalegi
- **Nayi ticket lene ke liye list par naam** (refresh token) — kabhi bhi kaata ja sakta hai

**Rakhna kahan hai:** \`httpOnly\` wali cookie mein, jise JavaScript **padh hi nahi sakta**. \`localStorage\` mein rakhoge to page ka koi bhi bura script use chura sakta hai.

**Yaad rakho:** chhoti ticket + kaatne layak list.`,
  },

  'auth-password-security': {
    simple: `**Never store the actual password.**

If someone steals your database, they must **not** get people's passwords.

So you never save the password. You save a **scrambled version** that cannot be unscrambled.

\`\`\`js
const hash = await bcrypt.hash(password, 12);   // saving up
await bcrypt.compare(typed, hash);              // checking later
\`\`\`

**Why bcrypt and not something faster?** Because fast is bad here. A thief with a stolen list will try billions of guesses. bcrypt is **deliberately slow** — it turns billions of guesses per second into a few. That slowness is the whole point.

**Two more things:**
- Say "**email or password is wrong**", never "no such email". Otherwise anyone can discover which emails have accounts.
- Limit login attempts, or someone will just keep guessing.

**Remember:** never store passwords, and slow is the feature.`,
    simpleHi: `**Asli password kabhi store mat karo.**

Koi aapka database chura le, to use logon ke passwords **nahi** milne chahiye.

Isliye aap password save karte hi nahi. Aap uska **ulta-pulta roop** save karte ho jo wapas seedha nahi ho sakta.

\`\`\`js
const hash = await bcrypt.hash(password, 12);   // save karte waqt
await bcrypt.compare(typed, hash);              // baad mein check
\`\`\`

**bcrypt hi kyun, koi tez cheez kyun nahi?** Kyunki yahan tez hona bura hai. Chori ki list wala chor arbon guesses karega. bcrypt **jaan-boojh kar dheema** hai — arbon guesses per second ko kuch hi bana deta hai. Wahi dheemapan asli maksad hai.

**Do aur baatein:**
- "**email ya password galat hai**" bolo, "aisa email nahi hai" kabhi nahi. Warna koi bhi pata kar lega kaun se emails registered hain.
- Login attempts limit karo, warna koi guess karta hi rahega.

**Yaad rakho:** password kabhi store nahi, aur dheema hona hi feature hai.`,
  },

  'auth-xss-csrf-cors': {
    simple: `**Three different dangers.**

**XSS — a stranger's code running on your page.**
Someone types \`<script>steal()</script>\` in a comment, and it *runs* for everyone who reads it. Now it can read anything JavaScript can read, including tokens in \`localStorage\`.
→ Fix: never treat user text as code. React does this for you by default.

**CSRF — your browser being tricked.**
You are logged into your bank. You visit a bad website. It quietly asks your bank to transfer money — and your browser **automatically attaches your cookie**, so the bank thinks it was you.
→ Fix: \`SameSite\` cookies, which tell the browser "do not send me from other sites".

**CORS — the most misunderstood.**
CORS is **not** a lock on your server. It is a rule for **browsers** only: "may this page read that site's reply?" A hacker using a script instead of a browser ignores it completely.
→ It protects users from other websites. It does not protect your API.

**Remember:** XSS = bad code on your page. CSRF = your cookie misused. CORS = a browser rule, not a lock.`,
    simpleHi: `**Teen alag khatre.**

**XSS — kisi ajnabi ka code aapke page par chalna.**
Koi comment mein \`<script>steal()</script>\` likh de, aur wo har padhne wale ke liye *chal jaye*. Ab wo sab kuch padh sakta hai jo JavaScript padh sakta hai, \`localStorage\` ke tokens samet.
→ Ilaaj: user ke text ko kabhi code mat samjho. React ye by default karta hai.

**CSRF — aapke browser ko bevakoof banana.**
Aap bank mein logged in ho. Aap ek buri website par jaate ho. Wo chupchaap aapke bank se paise transfer karne ko kehti hai — aur browser **apne aap aapki cookie laga deta hai**, isliye bank samajhta hai aapne kiya.
→ Ilaaj: \`SameSite\` cookies, jo browser ko kehti hain "doosri sites se mujhe mat bhejo".

**CORS — sabse zyada galat samjha jane wala.**
CORS aapke server ka **taala nahi hai**. Ye sirf **browsers** ka rule hai: "kya ye page us site ka jawab padh sakta hai?" Browser ki jagah script use karne wala hacker ise poori tarah ignore kar deta hai.
→ Ye users ko doosri websites se bachata hai. Aapke API ko nahi.

**Yaad rakho:** XSS = aapke page par bura code. CSRF = aapki cookie ka galat use. CORS = browser ka rule, taala nahi.`,
  },

  'sd-scaling-basics': {
    simple: `**One shop getting too busy.**

Too many customers. Two options:

- **Vertical** — make the shop bigger. Easy, but there is a limit to how big one shop can be.
- **Horizontal** — open more shops. No limit, but now the shops must **not keep anything private**. If your bill is only in shop 1's drawer, shop 2 cannot help you.

That is what "stateless" means: any shop can serve any customer.

**But before opening more shops, check whether the shop is actually the problem.** Usually it is not. Usually it is one slow thing:

1. A missing index, or asking the database 101 times instead of once
2. Then: keep popular answers ready (cache)
3. Then: more copies of the database for reading
4. Then: move slow jobs (emails, reports) to a queue
5. *Only then* more shops

**In an interview, always say what you would measure first.** Jumping to "microservices" without measuring is the classic wrong answer.

**Remember:** measure first; scaling out means keeping nothing local.`,
    simpleHi: `**Ek dukaan par bheed badh gayi.**

Bahut customers aa gaye. Do option:

- **Vertical** — dukaan badi kar lo. Aasan, par ek dukaan kitni badi ho sakti hai, uski limit hai.
- **Horizontal** — aur dukaanein kholo. Koi limit nahi, par ab dukaanon ko **kuch bhi apne paas nahi rakhna chahiye**. Aapka bill sirf dukaan 1 ke draaz mein hai to dukaan 2 madad nahi kar sakti.

Yahi "stateless" ka matlab hai: koi bhi dukaan kisi bhi customer ko sambhal le.

**Par aur dukaanein kholne se pehle dekho ki dukaan sach mein problem hai bhi ya nahi.** Aksar nahi hoti. Aksar ek dheemi cheez hoti hai:

1. Missing index, ya database se ek ki jagah 101 baar poochhna
2. Phir: popular jawab taiyaar rakho (cache)
3. Phir: padhne ke liye database ki aur copies
4. Phir: dheeme kaam (emails, reports) queue par bhejo
5. *Uske baad hi* aur dukaanein

**Interview mein hamesha batao ki aap pehle kya naapoge.** Bina naape "microservices" bolna classic galat jawab hai.

**Yaad rakho:** pehle naapo; scale out ka matlab hai kuch bhi local mat rakho.`,
  },

  'sd-caching-strategies': {
    simple: `**Keeping the popular book on your desk.**

Everyone asks for the same book. Instead of walking to the shelf every time, keep a copy **on your desk**. Much faster.

That is a cache.

**How it usually works:** check the desk first. Not there? Walk to the shelf, and put a copy on the desk for next time.

**The hard part is not keeping it — it is knowing when to throw it away.** If a new edition arrives and your desk still has the old one, you keep giving people wrong information. And a cache serving stale data is a bug you only find in production.

Two ways to handle it:
- Throw it away after N minutes (simple, slightly out of date)
- Throw it away the moment the real thing changes (accurate, but easy to forget a path)

**One more danger:** if the desk copy expires and 1000 people ask at the same instant, all 1000 run to the shelf at once. That stampede can take the shelf down.

**Remember:** caching is easy; deciding when to delete is the hard part.`,
    simpleHi: `**Popular kitaab apni mez par rakhna.**

Sab wahi kitaab maangte hain. Har baar shelf tak jaane ki jagah ek copy **mez par** rakh lo. Kaafi tez.

Yahi cache hai.

**Aam tareeka:** pehle mez dekho. Nahi hai? Shelf tak jao, aur agli baar ke liye copy mez par rakh do.

**Mushkil hissa rakhna nahi hai — ye jaanna hai ki kab phenkna hai.** Naya edition aa gaya aur mez par purana hi pada hai, to aap logon ko galat jaankari dete rahoge. Aur stale data dene wala cache aisa bug hai jo sirf production mein milta hai.

Do tareeke:
- N minute baad phenk do (simple, thoda purana ho sakta hai)
- Asli cheez badalte hi phenk do (sahi, par koi raasta bhoolna aasan)

**Ek aur khatra:** mez wali copy expire ho jaye aur 1000 log ek hi pal maangein, to 1000 log ek saath shelf tak bhaagte hain. Ye bhagdad shelf ko hi gira sakti hai.

**Yaad rakho:** cache karna aasan hai; kab delete karna hai — wahi mushkil hai.`,
  },

  'sd-queues-async': {
    simple: `**A token counter at the bank.**

You go to pay a bill. If the clerk did *your whole job* while you waited at the window, the queue behind you would never move.

Instead: you get a **token**, you go sit down, and someone processes it in the background.

That is a queue. Slow jobs — sending emails, generating reports, running someone's code — should not make the user wait. Take the request, hand back a token, do it behind the scenes.

**One rule matters most: assume every job runs twice.**

Queues usually guarantee "at least once", not "exactly once". A hiccup means the same job comes back. If that job sends an email, the user gets two. So each job must be **safe to repeat** — check "did I already do this?" before doing it.

**And never retry forever.** A job that always fails will retry endlessly and choke everything. Try a few times, then put it aside in a "problem" pile for a human.

**Remember:** hand back a token, and assume every job runs twice.`,
    simpleHi: `**Bank ka token counter.**

Aap bill bharne jaate ho. Agar clerk *aapka poora kaam* aapke saamne khade rehte hue karta, to peeche ki line kabhi aage hi na badhti.

Iski jagah: aapko **token** milta hai, aap baith jaate ho, aur koi peeche se use process karta hai.

Yahi queue hai. Dheeme kaam — email bhejna, report banana, kisi ka code chalana — user ko intezar nahi karwane chahiye. Request lo, token do, kaam peeche se karo.

**Ek rule sabse zyada matter karta hai: maan lo har job do baar chalega.**

Queues aksar "kam se kam ek baar" ki guarantee deti hain, "exactly ek baar" ki nahi. Zara si dikkat aur wahi job wapas aa jata hai. Wo job email bhejta ho to user ko do email jayenge. Isliye har job **dobara chalne layak safe** hona chahiye — karne se pehle poochho "ye maine pehle to nahi kiya?"

**Aur hamesha retry mat karo.** Jo job hamesha fail hota hai wo anant baar retry karke sab kuch jaam kar dega. Kuch baar try karo, phir use "problem" wale dher mein rakh do — koi insaan dekh lega.

**Yaad rakho:** token wapas do, aur maano har job do baar chalega.`,
  },

  'git-branching-and-history': {
    simple: `**Save points in a game.**

Git remembers every version of your work, so you can always go back.

- **commit** = a save point
- **branch** = a separate line of save points, so your experiment does not break the working game
- **merge** = bring your experiment back into the main game

**merge vs rebase**, in one line each:
- **merge** — keeps the real story, including the messy bits
- **rebase** — rewrites the story to look like a straight line

**The one rule you must not break:** only rebase work that is **still on your computer**. Once you have pushed it and others have it, rewriting the story means *their* history and yours no longer match — and that is a genuinely painful afternoon.

**Undoing safely:** if it is already pushed, use \`git revert\` (adds an "undo" save point) rather than deleting history.

**When you think you lost work:** \`git reflog\`. It remembers almost everything. It has saved a lot of people.

**Remember:** rebase before sharing, merge after.`,
    simpleHi: `**Game ke save points.**

Git aapke kaam ka har version yaad rakhta hai, taaki aap kabhi bhi wapas ja sako.

- **commit** = ek save point
- **branch** = save points ki alag line, taaki aapka experiment chalte hue game ko na tode
- **merge** = apna experiment wapas main game mein le aana

**merge vs rebase**, ek-ek line mein:
- **merge** — asli kahani rakhta hai, gadbad samet
- **rebase** — kahani dobara likh kar seedhi line bana deta hai

**Ek rule jo todna nahi hai:** rebase sirf us kaam ka karo jo **abhi aapke computer par hi hai**. Ek baar push kar diya aur doosron ke paas pahunch gaya, to kahani badalne ka matlab hai *unki* aur aapki history alag ho gayi — aur wo sach mein takleef bhari shaam hoti hai.

**Safe undo:** push ho chuka hai to \`git revert\` use karo (ek "undo" save point jodta hai), history mitane ki jagah.

**Jab lage kaam kho gaya:** \`git reflog\`. Ye lagbhag sab yaad rakhta hai. Bahut logon ko bacha chuka hai.

**Yaad rakho:** share karne se pehle rebase, baad mein merge.`,
  },

  'docker-fundamentals': {
    simple: `**A tiffin with the whole kitchen inside.**

"It works on my computer" — the oldest problem in programming.

Docker fixes it by packing your app **and everything it needs** (the right Node version, the libraries, the settings) into one sealed box. That box runs the same on your laptop, your friend's laptop, and the server.

- **image** = the recipe + all ingredients, sealed
- **container** = actually cooking it right now

You can start many containers from one image, like cooking the same recipe many times.

**Two things that make a real difference:**

1. **Order your steps well.** Install the ingredients *before* copying your code. Then changing one line of code does not re-download everything. This turns a 3-minute build into 5 seconds.
2. **Cook in one box, serve in a clean one.** Compilers and build tools do not need to ship to the server — copy just the finished food into a small clean box.

**Also:** anything written inside a container **dies with it**. To keep data, mount a volume.

**Remember:** image = recipe, container = cooking it.`,
    simpleHi: `**Tiffin jisme poori kitchen band hai.**

"Mere computer par to chal raha tha" — programming ki sabse purani samasya.

Docker ise aise theek karta hai: aapki app **aur uski har zaroorat** (sahi Node version, libraries, settings) ek band dabbe mein pack kar deta hai. Wo dabba aapke laptop, dost ke laptop aur server — sab par ek jaisa chalta hai.

- **image** = recipe + saare ingredients, seal kiye hue
- **container** = abhi sach mein pak raha khana

Ek image se kai containers chala sakte ho, jaise ek recipe se kai baar khana banana.

**Do cheezein asli farq laati hain:**

1. **Steps ka order theek rakho.** Ingredients code copy karne se *pehle* install karo. Phir code ki ek line badalne par sab dobara download nahi hoga. 3 minute ka build 5 second ka ho jata hai.
2. **Ek dabbe mein pakao, saaf dabbe mein parosо.** Compilers aur build tools server tak jaane ki zarurat nahi — sirf bana hua khana chhote saaf dabbe mein copy karo.

**Aur:** container ke andar jo likha, wo **uske saath hi mar jata hai**. Data rakhna hai to volume mount karo.

**Yaad rakho:** image = recipe, container = pakana.`,
  },

  'testing-pyramid': {
    simple: `**Checking a car.**

- **Unit test** — does the horn work? Test one small part alone. Instant. Write **lots** of these.
- **Integration test** — does pressing the pedal actually move the wheels? A few parts together. Slower. Write **some**.
- **End-to-end test** — actually drive the car around the block. Slowest and most fragile. Write **a handful**, for the journeys that really matter.

**The rule that matters more than the numbers:** test **what it does**, not **how it does it**.

A test that checks "did it call the \`calculateTotal\` function?" breaks every time you tidy up your code — while catching zero real bugs. A test that checks "does a ₹500 order come out as ₹500?" keeps working through any refactor.

**And every bug you fix deserves a test** that would have caught it. Otherwise it comes back.

**Remember:** many small tests, few big ones, and test behaviour not internals.`,
    simpleHi: `**Gaadi check karna.**

- **Unit test** — horn baj raha hai? Ek chhota hissa akela test karo. Turant. Aise **bahut** likho.
- **Integration test** — pedal dabane se pahiye sach mein ghoomte hain? Kuch hisse saath. Dheema. Aise **kuch** likho.
- **End-to-end test** — gaadi ko sach mein chala kar mohalle ka chakkar lagao. Sabse dheema aur nazuk. **Ginti ke** likho, sirf un safaron ke liye jo sach mein matter karte hain.

**Numbers se zyada matter karne wala rule:** test karo ki **kya karta hai**, ye nahi ki **kaise karta hai**.

Jo test dekhta hai "kya \`calculateTotal\` function call hua?" wo har baar code saaf karne par toot jayega — aur ek bhi asli bug nahi pakdega. Jo test dekhta hai "₹500 ka order ₹500 hi nikalta hai?" wo har refactor ke baad bhi chalta rahega.

**Aur har bug fix ke saath ek test** aana chahiye jo use pehle pakad leta. Warna wo wapas aayega.

**Yaad rakho:** bahut chhote tests, kam bade tests, aur behaviour test karo, andar ka kaam nahi.`,
  },
};
