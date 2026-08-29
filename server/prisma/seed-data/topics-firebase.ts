import type { SeedCategory } from './topics-shared';

/**
 * Firebase: backend-as-a-service.
 *
 * The framing that makes this category cohere: **you deleted your backend, and
 * the things it was doing did not go away.** Authorisation, validation, data
 * modelling and cost control all still exist — they just moved somewhere less
 * familiar, and the security rules file is now the only thing standing between
 * a browser and your database.
 *
 * Three threads:
 *   · **Rules are the backend.** Not a supplement to server checks — there is
 *     no server. If the rules are wrong, the data is public.
 *   · **You pay per document.** Query shape is a billing decision, which is an
 *     unfamiliar coupling for people used to a fixed database bill.
 *   · **No joins.** The relational instinct is actively wrong here, and fighting
 *     that is the most common way projects go badly.
 */
export const firebaseCategory: SeedCategory = {
  slug: 'firebase',
  name: 'Firebase',
  description:
    'Backend-as-a-service — auth, Firestore, security rules, realtime, functions, and the cost and lock-in questions nobody asks until later.',
  icon: 'flame',
  group: 'backend',
  topics: [
    {
      slug: 'firebase-what-is-it',
      title: 'What Firebase is, and what you give up',
      difficulty: 'EASY',
      summary: 'A hosted backend you talk to directly from the client. It removes an enormous amount of work, and moves the responsibilities you removed somewhere less obvious.',
      summaryHi: 'Ek hosted backend jisse aap client se seedhe baat karte ho. Ye bahut sara kaam hata deta hai, aur jo zimmedariyan hatayi wo kam saaf jagah par chali jati hain.',
      content: `Firebase is a set of managed services — database, authentication, file storage, serverless functions, hosting, analytics — that your **client application talks to directly**, with no API server of your own in between.

That single architectural fact is the whole story, good and bad.

**What you genuinely get**

- No server to write, deploy, patch or scale
- Authentication with email, Google, Apple and phone in an afternoon rather than a fortnight
- **Realtime by default** — data changes push to connected clients with no WebSocket work
- **Offline support that actually works** — writes queue locally and sync on reconnect
- A generous free tier

For a small team shipping a product, this is a real multiplier. It is not a toy.

**What you give up, stated plainly**

**Your security rules are now your backend.** There is no server-side code between the browser and the database, so a rules file is the *only* thing preventing anyone from reading everything. Get it wrong and the data is public — and this is not hypothetical, it is one of the most common causes of real data leaks in Firebase projects.

**You pay per document read and write.** Not per gigabyte or per hour. A screen that loads a thousand documents costs a thousand reads, every time anyone opens it. Query shape becomes a billing decision, which is an unfamiliar coupling.

**There are no joins.** Firestore cannot join collections. You denormalise, duplicate and maintain consistency yourself, which is a genuine shift for anyone with relational instincts.

**Lock-in is real.** Security rules, Firestore queries and the client SDKs do not port. Migrating away is a rewrite, not a config change.

**When it is the right call**

Small team, product-shaped work, realtime or offline genuinely useful, and a data model that is not deeply relational. Chat, collaborative tools, mobile apps, MVPs.

**When it is not**

Complex reporting and aggregation, heavily relational data, strict cost predictability at scale, or a requirement to avoid vendor lock-in.

**The honest summary:** Firebase does not remove backend work. It removes backend *infrastructure* and relocates the backend *thinking* into rules, data modelling and query design. Teams that recognise that do well with it; teams that assume the thinking went away are the ones with the public database.`,
      contentHi: `Firebase managed services ka ek set hai — database, authentication, file storage, serverless functions, hosting, analytics — jinse aapki **client application seedhe baat karti hai**, beech mein aapka apna koi API server nahi.

Wahi ek architecture ka tathya poori kahani hai, achhi bhi aur buri bhi.

**Aapko sach mein kya milta hai**

- Na server likhna, na deploy, na patch, na scale
- Email, Google, Apple aur phone se authentication do hafte mein nahi, ek dopahar mein
- **Default se realtime** — data badle to judi clients tak push hota hai, bina kisi WebSocket kaam ke
- **Offline support jo sach mein chalta hai** — writes local mein line mein lagti hain aur wapas judte hi sync ho jati hain
- Achha khaasa free tier

Product bhej rahi chhoti team ke liye ye asli guna hai. Ye khilona nahi hai.

**Aap kya chhodte ho, saaf shabdon mein**

**Aapke security rules ab aapka backend hain.** Browser aur database ke beech koi server-side code hai hi nahi, isliye rules file *akeli* cheez hai jo kisi ko sab kuch padhne se rokti hai. Galat hui to data sarvajanik hai — aur ye kalpna nahi, Firebase projects mein asli data leak ki sabse aam wajahon mein se ek yahi hai.

**Aap har document read aur write ka paisa dete ho.** Gigabyte ya ghante ka nahi. Jo screen hazaar documents load karti hai wo har baar khulne par hazaar read hai. Query ki shakal billing ka faisla ban jati hai, aur ye anjaana jod hai.

**Joins hain hi nahi.** Firestore collections ko join nahi kar sakta. Aap denormalise karte ho, duplicate karte ho aur consistency khud sambhalte ho, jo relational soch wale kisi bhi insaan ke liye asli badlav hai.

**Lock-in asli hai.** Security rules, Firestore queries aur client SDKs port nahi hote. Yahan se hatna rewrite hai, config badalna nahi.

**Ye kab sahi chunaav hai**

Chhoti team, product jaisa kaam, realtime ya offline sach mein kaam ka, aur aisa data model jo gehra relational na ho. Chat, saath mein kaam karne wale tools, mobile apps, MVP.

**Kab nahi**

Mushkil reporting aur jodna, gehra relational data, bade paimane par kharch ka pakka anuman, ya vendor lock-in se bachne ki zaroorat.

**Imaandar saaransh:** Firebase backend ka kaam nahi hataata. Wo backend ka *infrastructure* hataata hai aur backend ki *soch* ko rules, data modelling aur query design mein le jata hai. Jo teams ye pehchan leti hain unke saath ye achha chalta hai; jo maan leti hain ki sochna khatam ho gaya, unka database sarvajanik hota hai.`,
      commonMistakes: [
        'Assuming that removing the server removed the backend work. Authorisation, validation and data modelling all still exist — they moved.',
        'Treating security rules as a later task. They are the only thing between a browser and the database.',
        'Bringing relational instincts to Firestore and then fighting the absence of joins for months.',
        'Ignoring lock-in until a migration is needed, at which point it is a rewrite rather than a config change.',
      ],
      interviewQuestions: [
        'What does Firebase actually replace, and what does it not?',
        'Why are security rules more critical in Firebase than in a traditional stack?',
        'When would you choose Firebase, and when would you avoid it?',
        'What does vendor lock-in mean concretely here?',
      ],
      practiceQuestions: [
        'List every responsibility your API server currently has, and say where each one goes in a Firebase architecture.',
        'For a project you know, write down what migrating away from Firebase would involve.',
      ],
      tags: ['firebase', 'baas', 'architecture', 'basics', 'must-know'],
    },

    {
      slug: 'firebase-auth',
      title: 'Firebase Authentication',
      difficulty: 'EASY',
      summary: 'Sign-in with email, Google, Apple or phone in an afternoon. It gives you identity — permissions are still your problem.',
      summaryHi: 'Email, Google, Apple ya phone se sign-in ek dopahar mein. Ye pehchan deta hai — ijazat ab bhi aapki samasya hai.',
      content: `Firebase Auth handles the part of authentication that is tedious and easy to get wrong: password hashing, email verification, reset flows, OAuth handshakes with Google and Apple, phone OTP, and session refresh.

**How it actually works**

The user signs in, Firebase issues a **JWT ID token** valid for one hour, and the SDK refreshes it automatically in the background. That token is attached to every Firestore and Storage request, and your **security rules** read it to decide what the user may do.

So the flow is: Auth proves *who*, rules decide *what*. Those are separate steps, and confusing them is the same mistake as anywhere else — a valid token is identity, never permission.

**Custom claims are the mechanism for roles**

You can attach small pieces of data to a user's token — \`{ role: 'admin' }\`, \`{ tenantId: 'x' }\` — and read them in security rules. This is how authorisation actually gets implemented.

Three things about claims that catch people:

- They can **only be set from a trusted environment** — the Admin SDK, usually in a Cloud Function. A client cannot set its own role, which is the entire point.
- They are limited to about **1000 bytes**. Claims are for identity facts, not application data.
- **They do not update instantly.** The token refreshes roughly hourly, so a role change takes effect on the next refresh unless you force one with \`getIdToken(true)\`. This causes a genuinely confusing "I made them an admin and nothing happened" bug.

**Server-side verification**

If you do have a backend, verify the token with the Admin SDK — never trust a uid sent in a request body. This is the Firebase version of "never trust an id from the client".

**Practical points worth knowing early**

**Email enumeration.** By default some error messages reveal whether an email is registered. There is a setting to prevent this, and it should be on.

**Account linking.** A user who signs up with email and later uses Google with the same address creates a conflict. Decide the behaviour deliberately rather than discovering it in support tickets.

**Anonymous auth** gives a real uid before sign-up, so a user can build a cart or a draft and keep it when they register. Genuinely useful, and easy to forget exists.

**\`onAuthStateChanged\` fires with \`null\` first** while the SDK restores the session. Treating that initial null as "logged out" produces a flash of the login screen on every page load — an extremely common bug with a one-line fix: track a separate "still loading" state.`,
      contentHi: `Firebase Auth authentication ka wo hissa sambhalta hai jo ubaau hai aur aasani se galat hota hai: password hashing, email verification, reset ke raste, Google aur Apple ke saath OAuth handshake, phone OTP, aur session refresh.

**Ye sach mein kaise chalta hai**

User sign in karta hai, Firebase ek ghante ke liye **JWT ID token** deta hai, aur SDK use peeche apne aap refresh karta rehta hai. Wo token har Firestore aur Storage request ke saath jata hai, aur aapke **security rules** use padh kar tay karte hain ki user kya kar sakta hai.

To flow ye hai: Auth *kaun* sabit karta hai, rules tay karte hain *kya*. Ye alag kadam hain, aur inhe ghulana wahi galti hai jo kahin aur hai — sahi token pehchan hai, ijazat kabhi nahi.

**Roles ka tareeka custom claims hai**

Aap user ke token par chhote data ke tukde laga sakte ho — \`{ role: 'admin' }\`, \`{ tenantId: 'x' }\` — aur unhe security rules mein padh sakte ho. Authorisation asal mein aise hi lagu hota hai.

Claims ke baare mein teen baatein jo logon ko fasati hain:

- Ye **sirf bharosemand jagah se set ho sakti hain** — Admin SDK se, aksar Cloud Function mein. Client apna role khud set nahi kar sakta, aur poori baat yahi hai.
- Inki seema lagbhag **1000 bytes** hai. Claims pehchan ke tathya ke liye hain, application ke data ke liye nahi.
- **Ye turant update nahi hoti.** Token lagbhag har ghante refresh hota hai, isliye role ka badlav agle refresh par lagu hota hai jab tak aap \`getIdToken(true)\` se zabardasti na karo. Isse "maine use admin bana diya aur kuch nahi hua" wala sach mein uljhane wala bug hota hai.

**Server par verification**

Agar aapka backend hai, to token Admin SDK se verify karo — request body mein bheje gaye uid par kabhi bharosa nahi. Ye "client se aayi id par kabhi bharosa nahi" ka Firebase roop hai.

**Jaldi jaanne layak practical baatein**

**Email enumeration.** Default mein kuch error messages bata dete hain ki email registered hai ya nahi. Ise rokne ki setting hai, aur wo chalu honi chahiye.

**Account linking.** Jo user email se sign up kare aur baad mein usi pate se Google use kare, wahan takraar hoti hai. Bartaav soch kar tay karo, support ticket mein pata chalne ki jagah.

**Anonymous auth** sign-up se pehle asli uid deta hai, isliye user cart ya draft bana sakta hai aur register karne par use rakh sakta hai. Sach mein kaam ka, aur aasani se bhula diya jata hai.

**\`onAuthStateChanged\` pehle \`null\` deta hai** jab tak SDK session bahal kar raha hota hai. Us pehle null ko "logged out" maan lena har page load par login screen ki jhalak deta hai — bahut aam bug jiska hal ek line ka hai: alag se "abhi load ho raha hai" wali state rakho.`,
      codeExample: `import { onAuthStateChanged, getIdToken } from 'firebase/auth';

// The initial null is "still checking", NOT "logged out".
// Missing this gives a flash of the login screen on every page load.
const [user, setUser] = useState<User | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => onAuthStateChanged(auth, (u) => {
  setUser(u);
  setLoading(false);        // ← the fix
}), []);

if (loading) return <Splash />;

// Roles live in custom claims, set ONLY from a trusted environment
// (Cloud Function, Admin SDK). A client cannot set its own role.
await admin.auth().setCustomUserClaims(uid, { role: 'admin' });

// Claims ride on the token, which refreshes hourly.
// Force a refresh or the change appears to do nothing.
await getIdToken(auth.currentUser!, true);`,
      commonMistakes: [
        'Treating the first null from onAuthStateChanged as logged out, causing a login-screen flash on every load.',
        'Expecting a custom claim change to apply immediately — the token refreshes hourly unless you force it.',
        'Trusting a uid sent from the client instead of verifying the ID token with the Admin SDK.',
        'Putting application data in custom claims, which are limited to about 1KB and ride on every request.',
      ],
      interviewQuestions: [
        'How does Firebase Auth connect to Firestore security rules?',
        'What are custom claims and where can they be set?',
        'Why does a role change appear not to take effect immediately?',
        'What is the first value from onAuthStateChanged and why does it matter?',
      ],
      practiceQuestions: [
        'Add a role claim via a Cloud Function and read it in a security rule.',
        'Implement auth state handling with no flash of the login screen.',
      ],
      tags: ['firebase', 'auth', 'basics', 'must-know'],
    },

    {
      slug: 'firestore-basics',
      title: 'Firestore: documents and collections',
      difficulty: 'EASY',
      summary: 'A document database with realtime sync and offline support. The data model is genuinely different, and treating it like SQL goes badly.',
      summaryHi: 'Realtime sync aur offline support wala document database. Data model sach mein alag hai, aur ise SQL maan kar chalna bura jata hai.',
      content: `**The structure**

- **Collection** — a named group of documents. \`users\`, \`orders\`.
- **Document** — a JSON-like record with an id. Max **1 MB**.
- **Subcollection** — a collection *inside* a document. \`users/u1/orders\`.

Documents and collections alternate: collection → document → collection → document. A document cannot directly contain a collection's worth of data; it contains fields, and may have subcollections beneath it.

**What Firestore genuinely gives you**

**Realtime.** Attach a listener and changes push to you. No polling, no WebSocket code. This is the headline feature and it is genuinely excellent.

**Offline.** The SDK caches locally, serves reads from cache when disconnected, and queues writes to replay on reconnect. Mobile apps get this essentially free, and it is hard to overstate how much work that saves.

**Automatic scaling** with no connection pool to manage.

**The constraints that shape everything**

**No joins.** You cannot query across collections. This is the single biggest adjustment.

**You pay per document read.** A list of 100 items costs 100 reads. Every time. This makes query shape a billing concern.

**1 MB per document**, and a **write limit of roughly one per second per document** — so a single counter document that everyone increments becomes a bottleneck. That specific case has a specific solution, which is why distributed counters exist.

**Queries are shallow by default** — a query on a collection does not return subcollection data. Collection group queries search all subcollections of the same name, and need their own index.

**Two things that surprise people immediately**

**Reads are billed even when the result is empty.** A query that matches nothing still costs a minimum. And a listener re-charges for documents that change.

**\`arrayUnion\` and \`increment\` are atomic**, which matters because two clients writing the same field otherwise overwrite each other. Reach for these rather than read-modify-write.

**Firestore vs Realtime Database:** Firestore is the newer one and the default for almost everything — richer queries, better scaling, per-document billing. The Realtime Database is a single JSON tree, cheaper for very high-frequency small updates, and worth knowing exists mainly so you do not confuse the two in documentation.`,
      contentHi: `**Dhaancha**

- **Collection** — documents ka naam wala group. \`users\`, \`orders\`.
- **Document** — id wala JSON jaisa record. Adhiktam **1 MB**.
- **Subcollection** — kisi document ke *andar* ek collection. \`users/u1/orders\`.

Documents aur collections bari-bari aate hain: collection → document → collection → document. Document seedhe collection jitna data nahi rakh sakta; usme fields hoti hain, aur uske neeche subcollections ho sakti hain.

**Firestore sach mein kya deta hai**

**Realtime.** Listener lagao aur badlav aap tak push hote hain. Na polling, na WebSocket code. Yahi mukhya feature hai aur ye sach mein shandar hai.

**Offline.** SDK local mein cache karta hai, connection na hone par cache se padhata hai, aur writes ko line mein rakh kar wapas judte hi chalata hai. Mobile apps ko ye lagbhag muft milta hai, aur isse kitna kaam bachta hai ye kam kehna hoga.

**Apne aap scaling**, bina kisi connection pool ke.

**Wo shartein jo sab kuch aakaar deti hain**

**Joins nahi hain.** Aap collections ke paar query nahi kar sakte. Sabse bada badlav yahi hai.

**Aap har document read ka paisa dete ho.** 100 cheezon ki list 100 read hai. Har baar. Isse query ki shakal billing ki baat ban jati hai.

**Har document 1 MB**, aur **har document par lagbhag ek write per second** ki seema — isliye ek counter document jise sab badhate hain wo rukavat ban jata hai. Us khaas case ka khaas hal hai, aur isiliye distributed counters hain.

**Queries default mein upar-upar ki hain** — collection par query subcollection ka data nahi laati. Collection group queries usi naam ki saari subcollections mein dhoondhti hain, aur unhe apna index chahiye.

**Do cheezein jo turant chaunkati hain**

**Natija khaali ho tab bhi read ka paisa lagta hai.** Jo query kuch match na kare uska bhi kam se kam kharch hai. Aur listener badalne wale documents ka phir se paisa leta hai.

**\`arrayUnion\` aur \`increment\` atomic hain**, aur ye matter karta hai kyunki wahi field likhte do clients warna ek doosre ko mita dete hain. Read-modify-write ki jagah inhe uthao.

**Firestore aur Realtime Database:** Firestore naya hai aur lagbhag har cheez ka default — richer queries, behtar scaling, per-document billing. Realtime Database ek hi JSON ped hai, bahut zyada baar hone wale chhote updates ke liye sasta, aur iska hona mukhya roop se isliye jaanna chahiye taaki documentation mein dono ghul na jayein.`,
      codeExample: `import { doc, collection, setDoc, increment, arrayUnion, serverTimestamp } from 'firebase/firestore';

// collection → document → subcollection → document
const orderRef = doc(db, 'users', uid, 'orders', orderId);

await setDoc(orderRef, {
  total: 499,
  createdAt: serverTimestamp(),     // server clock, not the device's
});

// Atomic operations: two clients writing this field will not clobber
// each other, which read-modify-write absolutely would.
await updateDoc(doc(db, 'posts', postId), {
  likeCount: increment(1),
  likedBy: arrayUnion(uid),
});

// A single hot document has a write limit of roughly 1/second.
// A counter everyone increments needs sharding — see distributed counters.`,
      commonMistakes: [
        'Designing the schema as if joins existed, then discovering months in that every screen needs several round trips.',
        'Read-modify-write on a shared field instead of increment/arrayUnion, so concurrent clients overwrite each other.',
        'A single counter document updated by every user, which hits the ~1 write per second per document limit.',
        'Assuming an empty query result is free. Reads are billed regardless.',
      ],
      interviewQuestions: [
        'How is Firestore structured, and what is a subcollection?',
        'What are the hard limits on a Firestore document?',
        'Why can you not do a join, and what do you do instead?',
        'When would you use the Realtime Database instead of Firestore?',
      ],
      practiceQuestions: [
        'Model a blog with posts, comments and authors in Firestore and note where you had to duplicate data.',
        'Implement a like counter that survives two people liking simultaneously.',
      ],
      tags: ['firebase', 'firestore', 'database', 'basics', 'must-know'],
    },

    {
      slug: 'firestore-security-rules',
      title: 'Security rules are your backend',
      difficulty: 'HARD',
      summary: 'With no server between the client and the database, the rules file is the only thing preventing anyone from reading everything. This is the most important topic here.',
      summaryHi: 'Client aur database ke beech koi server nahi, isliye rules file akeli cheez hai jo kisi ko sab kuch padhne se rokti hai. Yahan ka sabse zaroori topic yahi hai.',
      content: `In a normal stack, the browser talks to your API, and your API decides what is allowed. In Firebase the browser talks to the database directly, so **the rules file is the entire authorisation layer**.

If the rules are wrong, the data is public. Not "harder to reach" — public. Anyone can open the SDK in a console and read it.

This is one of the most common causes of real Firebase data leaks, and the reason is almost always the same: rules treated as a later task.

**The default must be deny**

\`\`\`
match /{document=**} { allow read, write: if false; }
\`\`\`

Start closed and open specific paths. The reverse — start open and close things — leaves holes you will not find until someone else does.

**The critical thing about rules: they filter, they do not query**

This is the concept people get wrong.

A rule does **not** silently add \`where\` clauses to a query. When a client runs a query, Firestore checks whether the rules allow **the entire result set** without evaluating each document. If a query could return a document the rules forbid, **the whole query is rejected**.

So a rule saying "you can read your own documents" does not turn \`getDocs(collection('orders'))\` into "your orders" — it makes that query fail entirely. The client must ask for its own orders explicitly, and the rule then confirms it.

That mismatch produces the classic *"my rules are right but the query fails"* confusion, and understanding it is what separates working rules from guessed rules.

**\`get()\` and \`exists()\` cost reads**

Rules can look up other documents to make a decision — checking a membership document, for instance. Each lookup is a **billed read** and adds latency. They are also limited in number per request. Use them, but know they are not free.

**Validate data, not just access**

Rules can enforce shape: required fields, types, value ranges, and that a user cannot change a field they should not. Since there is no server-side validation, this is where it lives.

The pattern that matters: prevent a user editing their own \`role\` field, or changing \`ownerId\` to someone else's.

**Test the rules**

The emulator suite runs rules locally and lets you write unit tests: *this user can read this, that user cannot*. Rules are code with security consequences, and they deserve tests more than most code does — not less.

**The judgement to carry:** write the rules alongside the feature, not afterwards. Retrofitting authorisation onto a schema designed without it is where the awkward, leaky compromises come from.`,
      contentHi: `Aam stack mein browser aapki API se baat karta hai, aur aapki API tay karti hai kya allowed hai. Firebase mein browser seedhe database se baat karta hai, isliye **rules file hi poori authorisation parat hai**.

Rules galat hui to data sarvajanik hai. "Pahunchna mushkil" nahi — sarvajanik. Koi bhi console mein SDK khol kar use padh sakta hai.

Firebase mein asli data leak ki sabse aam wajahon mein se ek yahi hai, aur wajah lagbhag hamesha ek hi hoti hai: rules ko baad ka kaam maan lena.

**Default mana hona chahiye**

\`\`\`
match /{document=**} { allow read, write: if false; }
\`\`\`

Band se shuru karo aur khaas raste kholo. Ulta — khula shuru karke band karna — aise chhed chhodta hai jo aapko tab tak nahi milte jab tak koi aur na dhoondh le.

**Rules ke baare mein zaroori baat: ye chhaante hain, query nahi karte**

Yahi vichaar log galat samajhte hain.

Rule query mein chupchaap \`where\` **nahi** jodta. Jab client query chalata hai, Firestore dekhta hai ki rules **poore natije** ko allow karte hain ya nahi, har document ko alag jaanche bina. Agar query aisa document laut a sakti hai jise rules mana karte hain, to **poori query mana ho jati hai**.

To "aap apne documents padh sakte ho" wala rule \`getDocs(collection('orders'))\` ko "aapke orders" nahi bana deta — wo us query ko poori tarah fail kar deta hai. Client ko apne orders saaf-saaf maangne padte hain, aur phir rule uski pushti karta hai.

Isi bemel se classic *"mere rules theek hain par query fail hoti hai"* wali uljhan aati hai, aur ise samajhna hi chalte rules aur andaze ke rules ka farak hai.

**\`get()\` aur \`exists()\` reads leti hain**

Rules faisla lene ke liye doosre documents dekh sakte hain — jaise koi membership document jaanchna. Har lookup ek **billed read** hai aur latency badhati hai. Har request mein inki ginti bhi seemit hai. Inhe use karo, par jaano ki ye muft nahi hain.

**Data validate karo, sirf pahunch nahi**

Rules shakal lagu kar sakte hain: zaroori fields, types, values ki range, aur ye ki user wo field na badle jo use nahi badalni chahiye. Server par validation hai hi nahi, isliye ye kaam yahin hota hai.

Jo pattern matter karta hai: user ko apni hi \`role\` field badalne se roko, ya \`ownerId\` kisi aur ka karne se.

**Rules test karo**

Emulator suite rules local mein chalata hai aur unit tests likhne deta hai: *ye user ye padh sakta hai, wo nahi*. Rules aise code hain jinke suraksha ke natije hain, aur inhe zyadatar code se zyada tests chahiye — kam nahi.

**Rakhne layak samajh:** rules feature ke saath likho, baad mein nahi. Jis schema ko authorisation soche bina banaya gaya ho us par baad mein authorisation chipkane se hi wo ajeeb, chhed wale samjhaute aate hain.`,
      codeExample: `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Start closed. Open specific paths deliberately.
    match /{document=**} { allow read, write: if false; }

    function signedIn() { return request.auth != null; }
    function isOwner(uid) { return signedIn() && request.auth.uid == uid; }

    match /users/{uid} {
      allow read: if isOwner(uid);

      // Validate, not just authorise. A user must not change their own role.
      allow update: if isOwner(uid)
        && request.resource.data.role == resource.data.role
        && request.resource.data.email is string;
    }

    match /orders/{orderId} {
      // Rules FILTER, they do not query. getDocs(collection('orders'))
      // is rejected entirely — the client must scope the query itself:
      //   query(collection('orders'), where('ownerId', '==', uid))
      allow read: if isOwner(resource.data.ownerId);

      // A client must not be able to create an order owned by someone else
      allow create: if isOwner(request.resource.data.ownerId)
        && request.resource.data.total is number
        && request.resource.data.total >= 0;
    }
  }
}`,
      commonMistakes: [
        'Leaving test-mode rules (allow all) in place past the first week — this is a public database.',
        'Expecting rules to filter a broad query. They reject it instead; the client must scope the query itself.',
        'Authorising access but not validating data, so a client can set its own role or reassign ownerId.',
        'Never testing rules, despite them being the only authorisation layer in the entire system.',
      ],
      interviewQuestions: [
        'Why are security rules more critical in Firebase than authorisation in a traditional API?',
        'Do rules filter query results? What actually happens?',
        'What does a `get()` inside a rule cost?',
        'How would you stop a user escalating their own role?',
      ],
      practiceQuestions: [
        'Write rules where users read only their own orders, and test both the allowed and denied cases in the emulator.',
        'Add validation preventing a client from changing ownerId or role.',
      ],
      tags: ['firebase', 'firestore', 'security', 'must-know'],
    },

    {
      slug: 'firestore-queries',
      title: 'Querying Firestore, and what it cannot do',
      difficulty: 'MEDIUM',
      summary: 'Fast and predictable within its limits, and the limits are strict. Knowing them upfront prevents a schema you have to redo.',
      summaryHi: 'Apni seemaon ke andar tez aur anuman layak, aur seemayein sakht hain. Inhe pehle jaanna aise schema se bachata hai jise dobara banana pade.',
      content: `Firestore queries are designed so performance depends on the **size of the result**, not the size of the collection. A query returning 10 documents costs the same whether the collection has a thousand or ten million. That is a genuinely good property, and it is bought with restrictions.

**The restrictions that shape your schema**

- **No joins.** None. You denormalise.
- **No \`OR\` across different fields.** \`in\` and \`array-contains-any\` cover some cases, capped at 30 values.
- **Range filters on one field only.** You cannot filter \`price > 100\` and \`date > x\` in the same query.
- **No full-text search.** Use Algolia, Typesense or an extension. \`>=\`/\`<\` prefix tricks work for "starts with" and nothing more.
- **No aggregation beyond count/sum/average.** Anything richer means precomputing.
- **\`!=\` and \`not-in\` are limited** and often better solved by restructuring.

**Indexes**

Single-field indexes are automatic. **Composite indexes** — needed whenever you combine filters and ordering — are not, but Firestore prints a link that creates the exact index required. Use it; hand-writing them is unnecessary.

Note that indexes cost storage and slow writes, and every index must be created before the query works in production. That last point is a deployment concern: a query that works locally can fail in production because the index was never deployed.

**Pagination is cursor-based, and that is a good thing**

\`startAfter(lastDoc)\` rather than offset. There is no "skip 5000", which means deep pages stay fast — offset-based pagination in other databases gets slower the further you go, and Firestore simply does not offer the slow option.

**The cost dimension**

Every document read is billed, so query shape is a spending decision:

- Use \`limit()\` on everything a user sees
- Never fetch a collection to count it — use \`getCountFromServer()\`, or keep a counter
- Fetch only what the screen needs

**The reflex worth building:** when a query is awkward, the answer is usually to **change the data**, not to fight the query language. Add a field, denormalise, precompute. In a relational database you write a cleverer query; in Firestore you write a simpler document.

That inversion is the hardest habit to acquire coming from SQL, and it is the one that makes the difference.`,
      contentHi: `Firestore queries aise bani hain ki performance **natije ke size** par nirbhar ho, collection ke size par nahi. 10 documents laut ane wali query ka kharch wahi hai chahe collection mein hazaar hon ya ek crore. Ye sach mein achha gun hai, aur ye rok-tok ke badle mila hai.

**Wo rok jo aapka schema aakaar deti hain**

- **Joins nahi.** Bilkul nahi. Aap denormalise karte ho.
- **Alag fields par \`OR\` nahi.** \`in\` aur \`array-contains-any\` kuch case dhak lete hain, 30 values tak.
- **Range filter sirf ek field par.** Aap ek hi query mein \`price > 100\` aur \`date > x\` nahi kar sakte.
- **Full-text search nahi.** Algolia, Typesense ya extension use karo. \`>=\`/\`<\` wale prefix tareeke "isse shuru hone wale" tak kaam karte hain, uske aage nahi.
- **count/sum/average ke alawa aggregation nahi.** Isse zyada kuch bhi pehle se nikaalna padta hai.
- **\`!=\` aur \`not-in\` seemit hain** aur aksar dhaancha badal kar behtar hal hote hain.

**Indexes**

Single-field indexes apne aap bante hain. **Composite indexes** — jab bhi aap filters aur ordering milao — apne aap nahi, par Firestore ek link chhapta hai jo theek wahi index bana deta hai. Use use karo; haath se likhna bewajah hai.

Dhyan do indexes storage lete hain aur writes dheemi karte hain, aur har index production mein query chalne se pehle banna chahiye. Aakhri baat deployment ki hai: jo query local par chalti hai wo production mein fail ho sakti hai kyunki index deploy hi nahi hua.

**Pagination cursor par hai, aur ye achhi baat hai**

Offset ki jagah \`startAfter(lastDoc)\`. "5000 chhodo" hota hi nahi, jiska matlab hai gehre page tez rehte hain — doosre databases mein offset wali pagination jitna aage jao utni dheemi hoti hai, aur Firestore dheema vikalp deta hi nahi.

**Kharch ka pehlu**

Har document read par paisa lagta hai, isliye query ki shakal kharch ka faisla hai:

- Jo bhi user dekhta hai us par \`limit()\` lagao
- Ginne ke liye poora collection kabhi mat laao — \`getCountFromServer()\` use karo, ya counter rakho
- Sirf wahi laao jo screen ko chahiye

**Banane layak aadat:** query ajeeb lage to jawab aksar **data badalna** hota hai, query bhasha se ladna nahi. Field jodo, denormalise karo, pehle se nikaalo. Relational database mein aap chalak query likhte ho; Firestore mein aap simple document likhte ho.

Ye ulat SQL se aane walon ke liye sabse mushkil aadat hai, aur yahi asli farak banati hai.`,
      codeExample: `import { query, where, orderBy, limit, startAfter, getCountFromServer } from 'firebase/firestore';

// Scope the query yourself — rules reject broad queries, they do not filter them
const q = query(
  collection(db, 'orders'),
  where('ownerId', '==', uid),
  where('status', '==', 'PAID'),
  orderBy('createdAt', 'desc'),
  limit(20),                          // limit everything a user sees
);
// Firestore will print a link creating the exact composite index this needs.
// Deploy that index, or the query works locally and fails in production.

// Cursor pagination — there is no "skip 5000", so deep pages stay fast
const next = query(q, startAfter(lastVisibleDoc), limit(20));

// Counting: never fetch documents to count them
const { data } = await getCountFromServer(
  query(collection(db, 'orders'), where('ownerId', '==', uid)),
);
console.log(data().count);            // one billed operation, not N reads

// Cannot do: range filters on two different fields
// where('price', '>', 100) AND where('createdAt', '>', x)   ❌
// Fix the DATA, not the query: precompute a field you can filter on once.`,
      commonMistakes: [
        'Fetching an entire collection to count it, paying one read per document for a single number.',
        'Designing a schema that needs range filters on two fields, then discovering Firestore allows one.',
        'Forgetting to deploy composite indexes, so a query that works locally fails in production.',
        'Fighting the query language instead of changing the data — in Firestore the document is what you reshape.',
      ],
      interviewQuestions: [
        'What can Firestore queries not do that SQL can?',
        'Why is Firestore query performance independent of collection size?',
        'How do you count documents without paying per document?',
        'Why is cursor pagination the only option, and why is that a good thing?',
      ],
      practiceQuestions: [
        'Write a query that needs a composite index and deploy the index.',
        'Take a query needing two range filters and redesign the data so it does not.',
      ],
      tags: ['firebase', 'firestore', 'queries', 'must-know'],
    },

    {
      slug: 'firestore-data-modelling',
      title: 'Modelling data without joins',
      difficulty: 'HARD',
      summary: 'Model around the screens you render, not the entities you have. Duplication is the tool, and keeping copies consistent is the cost.',
      summaryHi: 'Un screens ke hisaab se model karo jo aap dikhate ho, un entities ke hisaab se nahi jo aapke paas hain. Duplication auzaar hai, aur copies ko ek jaisa rakhna keemat.',
      content: `In SQL you normalise and let joins reassemble. Firestore has no joins, so **the shape of your documents is decided by the screens you render**.

The question is not "what are my entities" but **"what does each screen need in one read"**.

**Denormalisation is the tool, not a compromise**

A post document storing \`authorName\` and \`authorAvatar\` alongside \`authorId\` means the feed renders in one query instead of one query plus N author lookups. That is not a hack — it is the intended design.

The cost is consistency: when a user changes their name, those copies are stale. Three ways to handle it, and choosing deliberately matters:

- **Accept it.** A slightly stale display name is usually fine, and this is the right answer more often than people expect.
- **Fan out on write.** A Cloud Function updates the copies. Correct, and it costs writes.
- **Refetch on read.** Defeats the purpose. Rarely right.

**When to embed, when to reference, when to use a subcollection**

- **Embed** — small, bounded, always read together. An address inside a user.
- **Subcollection** — unbounded, or queried independently. A user's orders. Crucially, a subcollection does **not** count against the parent's 1 MB limit and is not fetched with the parent.
- **Reference** — shared between many parents. A product referenced by many orders.

**The rule that prevents most disasters:** never put an unbounded array in a document. Comments in an array looks fine at 5 and dies well before the 1 MB cap, because every update rewrites the whole document.

**Patterns worth knowing by name**

**Distributed counters.** A single document takes about one write per second. A counter everyone increments needs sharding: spread across N documents and sum them on read. This is the standard answer to a genuinely common problem.

**Denormalised membership.** Instead of a rule doing a \`get()\` on every access — which costs a read each time — store \`memberIds: [...]\` on the document and check with \`array-contains\`. Faster and cheaper, at the price of maintaining the array.

**Precomputed views.** If a screen needs data assembled from three places, have a Cloud Function maintain a document shaped exactly like that screen. Reads become one; writes do the work.

**The mental shift:** in SQL, writes are simple and reads are clever. In Firestore, **reads are simple and writes do the work**. Once that inverts in your head, the modelling stops feeling like a fight.`,
      contentHi: `SQL mein aap normalise karte ho aur joins use dobara jod dete hain. Firestore mein joins hain hi nahi, isliye **aapke documents ki shakal un screens se tay hoti hai jo aap dikhate ho**.

Sawaal "meri entities kya hain" nahi balki **"har screen ko ek read mein kya chahiye"** hai.

**Denormalisation auzaar hai, samjhauta nahi**

Jo post document \`authorId\` ke saath \`authorName\` aur \`authorAvatar\` rakhta hai, uska feed ek query mein banta hai, ek query aur N author lookup mein nahi. Ye jugaad nahi — yahi soch kar banaya gaya design hai.

Keemat consistency hai: user apna naam badle to wo copies purani ho jati hain. Isse nipatne ke teen tareeke, aur soch kar chunna matter karta hai:

- **Maan lo.** Thoda purana display name aksar theek hai, aur ye jawab logon ke andaze se zyada baar sahi hota hai.
- **Likhte waqt phailao.** Cloud Function copies update karta hai. Sahi, aur ismein writes lagti hain.
- **Padhte waqt dobara laao.** Ye poora maqsad hi khatam kar deta hai. Shayad hi sahi.

**Kab embed, kab reference, kab subcollection**

- **Embed** — chhota, seemit, hamesha saath padha jane wala. User ke andar pata.
- **Subcollection** — bina seema ka, ya alag se query hone wala. User ke orders. Zaroori baat: subcollection parent ki 1 MB seema mein **nahi** ginti aur parent ke saath aati bhi nahi.
- **Reference** — kai parents ke beech saanjha. Wo product jise kai orders reference karte hain.

**Wo niyam jo zyadatar tabaahi rokta hai:** document mein bina seema wali array kabhi mat rakho. Array mein comments 5 par theek lagte hain aur 1 MB ki had se bahut pehle mar jate hain, kyunki har update poora document dobara likhta hai.

**Naam se jaanne layak patterns**

**Distributed counters.** Ek document lagbhag ek write per second leta hai. Jise sab badhate hain us counter ko shard karna padta hai: N documents mein phailao aur padhte waqt jodo. Sach mein aam samasya ka standard jawab yahi hai.

**Denormalised membership.** Har access par rule mein \`get()\` karne ki jagah — jo har baar ek read leta hai — document par \`memberIds: [...]\` rakho aur \`array-contains\` se jaancho. Tez aur sasta, keemat mein array sambhalna.

**Pehle se bane views.** Kisi screen ko teen jagah se joda hua data chahiye to Cloud Function se theek us screen ki shakal ka document banwao. Reads ek ho jati hain; kaam writes karti hain.

**Soch ka badlav:** SQL mein writes simple hain aur reads chalak. Firestore mein **reads simple hain aur kaam writes karti hain**. Ye dimaag mein palat jaye to modelling ladai lagni band ho jati hai.`,
      codeExample: `// Model for the screen. This feed renders in ONE query.
// posts/{postId}
{
  title: 'Hello',
  authorId: 'u1',
  authorName: 'Asha',        // denormalised — intended design, not a hack
  authorAvatar: '/a.jpg',
  commentCount: 12,          // precomputed; never fetch to count
  createdAt: Timestamp,
}
// comments live in a SUBCOLLECTION: unbounded, and does not count
// against the parent document's 1MB limit
// posts/{postId}/comments/{commentId}

// Distributed counter: one document takes ~1 write/second.
// Shard it, and sum on read.
const SHARDS = 10;
await updateDoc(
  doc(db, 'counters', 'views', 'shards', String(Math.floor(Math.random() * SHARDS))),
  { count: increment(1) },
);

// Denormalised membership beats a get() in rules, which costs a read every time
// document: { memberIds: ['u1', 'u2'] }
// rule:     allow read: if request.auth.uid in resource.data.memberIds;`,
      commonMistakes: [
        'Normalising like SQL, then needing N extra reads per screen to reassemble what a join would have done.',
        'An unbounded array inside a document — fine at five items, fatal well before the 1MB cap.',
        'A single counter document incremented by every user, hitting the ~1 write/second limit.',
        'Fanning out on write for data where a slightly stale copy would have been perfectly acceptable.',
      ],
      interviewQuestions: [
        'How do you model a feed with author details when there are no joins?',
        'When does denormalised data need fan-out on write, and when can it be left stale?',
        'What is a distributed counter and what problem does it solve?',
        'Why does a subcollection not count against the parent document size?',
      ],
      practiceQuestions: [
        'Model a chat app: rooms, messages, members. Justify each embed, reference and subcollection.',
        'Implement a sharded counter and measure it against a single document under load.',
      ],
      tags: ['firebase', 'firestore', 'data-modelling', 'must-know'],
    },

    {
      slug: 'firebase-realtime-and-offline',
      title: 'Realtime listeners and offline support',
      difficulty: 'MEDIUM',
      summary: 'The genuine differentiator. Data changes push to clients, writes work offline — and both have billing and lifecycle consequences.',
      summaryHi: 'Asli alag pehchan yahi hai. Data badle to clients tak push hota hai, writes offline chalti hain — aur dono ke billing aur lifecycle ke natije hain.',
      content: `\`onSnapshot\` replaces \`getDocs\` and delivers the result immediately, then again every time the data changes. No polling, no WebSocket code, no reconnection logic.

For chat, dashboards, collaborative editing and presence, this removes most of the work.

**Three things about listeners that matter**

**Always unsubscribe.** \`onSnapshot\` returns a function; call it on unmount. Forget, and you leak listeners, keep receiving updates for screens nobody is looking at, and keep paying for them. This is the most common Firebase memory and billing leak.

**Reads are billed per changed document.** The first snapshot bills for every document; subsequent ones bill only for what changed. A listener on a busy collection is a recurring cost, not a one-off.

**\`metadata.hasPendingWrites\`** tells you a snapshot reflects a local write not yet confirmed. Firestore applies your write locally **immediately** — this is latency compensation, and it is why the UI feels instant. Use the flag when you need to show a "sending" state.

**Offline is genuinely good**

The SDK caches locally. Reads are served from cache when disconnected, and writes queue and replay on reconnect. On mobile this is enabled by default; on web you opt in with persistence.

**The consequences worth knowing:**

- A write that "succeeded" may only have succeeded **locally**. The promise resolves against the local cache. If you need server confirmation, wait for it explicitly.
- **Conflicts resolve last-write-wins** at the field level. Two users editing the same field offline means one silently loses. If that matters, use atomic operations or model to avoid the collision.
- The cache has a **size limit** and evicts.

**Transactions and batches**

- **\`writeBatch\`** — up to 500 writes, all or nothing. No reads.
- **\`runTransaction\`** — read then write atomically, with automatic retry on contention. **Does not work offline**, because it needs the server.

That last point catches people: a transaction in an offline-capable app simply fails when disconnected, so plan for it rather than discovering it in the field.

**The practical guidance:** use listeners where data genuinely changes and someone is watching. Use a one-off \`getDocs\` where it does not — a settings page does not need a live subscription, and paying for one is a habit worth breaking early.`,
      contentHi: `\`onSnapshot\` \`getDocs\` ki jagah leta hai aur natija turant deta hai, phir har baar jab data badle. Na polling, na WebSocket code, na dobara judne ki logic.

Chat, dashboards, saath mein editing aur presence ke liye ye zyadatar kaam hata deta hai.

**Listeners ke baare mein teen zaroori baatein**

**Hamesha unsubscribe karo.** \`onSnapshot\` ek function lauta ta hai; unmount par use bulao. Bhoolo, aur listeners leak hote hain, un screens ke updates aate rehte hain jinhe koi nahi dekh raha, aur unka paisa lagta rehta hai. Firebase ka sabse aam memory aur billing leak yahi hai.

**Har badle document ka read billed hai.** Pehla snapshot har document ka paisa leta hai; uske baad wale sirf badle hue ka. Vyast collection par lagaya listener baar-baar lagne wala kharch hai, ek baar ka nahi.

**\`metadata.hasPendingWrites\`** batata hai ki snapshot mein aisi local write hai jo abhi confirm nahi hui. Firestore aapki write local mein **turant** laga deta hai — ye latency compensation hai, aur isi se UI turant lagta hai. "Bhej raha hai" wali haalat dikhani ho to ye flag use karo.

**Offline sach mein achha hai**

SDK local mein cache karta hai. Connection na hone par reads cache se aati hain, aur writes line mein lag kar wapas judte hi chalti hain. Mobile par ye default chalu hai; web par aap persistence chalu karte ho.

**Jaanne layak natije:**

- Jo write "safal" hui wo shayad sirf **local** mein safal hui ho. Promise local cache ke against poora hota hai. Server ki pushti chahiye to uska saaf intezaar karo.
- **Takraar last-write-wins** se hal hoti hai, field ke star par. Do users offline mein wahi field badlein to ek chupchaap haar jata hai. Ye matter kare to atomic operations use karo ya aisa model banao ki takraar ho hi na.
- Cache ki **size ki seema** hai aur wo purani cheezein hataata hai.

**Transactions aur batches**

- **\`writeBatch\`** — 500 tak writes, sab ya kuch nahi. Reads nahi.
- **\`runTransaction\`** — atomic tareeke se padho phir likho, takraar par apne aap dobara koshish. **Offline nahi chalta**, kyunki ise server chahiye.

Aakhri baat logon ko fasati hai: offline chalne wali app mein transaction connection na hone par bas fail ho jata hai, isliye iski yojna banao, maidan mein pata chalne ki jagah.

**Practical salah:** listeners wahan use karo jahan data sach mein badalta hai aur koi dekh raha hai. Jahan nahi, wahan ek baar ka \`getDocs\` — settings page ko live subscription nahi chahiye, aur uska paisa dena wo aadat hai jise jaldi chhodna chahiye.`,
      codeExample: `import { onSnapshot, runTransaction, writeBatch } from 'firebase/firestore';

useEffect(() => {
  const unsub = onSnapshot(q, (snap) => {
    // Firestore applies your own writes locally FIRST — this is why the
    // UI feels instant. The flag tells you it is not yet confirmed.
    const pending = snap.metadata.hasPendingWrites;
    setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data(), pending })));
  });

  return unsub;          // ← forget this and you leak listeners AND billing
}, [q]);

// Batch: atomic, up to 500 writes, no reads
const batch = writeBatch(db);
batch.update(doc(db, 'posts', id), { likeCount: increment(1) });
batch.set(doc(db, 'posts', id, 'likes', uid), { at: serverTimestamp() });
await batch.commit();

// Transaction: read-then-write atomically.
// NOTE: does not work offline — it needs the server.
await runTransaction(db, async (tx) => {
  const snap = await tx.get(seatRef);
  if (snap.data()!.taken) throw new Error('Seat already taken');
  tx.update(seatRef, { taken: true, by: uid });
});`,
      commonMistakes: [
        'Not unsubscribing from listeners, which leaks memory and keeps billing for screens nobody is viewing.',
        'Using a realtime listener where a one-off read would do, paying continuously for static data.',
        'Assuming a resolved write promise means the server accepted it — offline, it resolved against the local cache.',
        'Relying on transactions in an offline-capable app, where they simply fail when disconnected.',
      ],
      interviewQuestions: [
        'How does Firestore make the UI feel instant before the server responds?',
        'What happens to a write made while offline?',
        'Why do transactions not work offline when batches do?',
        'How are listeners billed?',
      ],
      practiceQuestions: [
        'Build a live list with correct unsubscribe and a pending-write indicator.',
        'Test an offline write, then reconnect and observe when it actually reaches the server.',
      ],
      tags: ['firebase', 'firestore', 'realtime', 'offline'],
    },

    {
      slug: 'firebase-functions-and-storage',
      title: 'Cloud Functions and Storage',
      difficulty: 'MEDIUM',
      summary: 'The escape hatch for work a client must not do, and file handling. Cold starts and trigger loops are the two things that bite.',
      summaryHi: 'Un kaamon ka rasta jo client ko nahi karne chahiye, aur files sambhalna. Cold starts aur trigger loops — yahi do kaat te hain.',
      content: `**Cloud Functions** are server code without a server. They run in a **trusted environment**, which is exactly why they exist: some things must not happen on a client.

**Three trigger types**

- **HTTP / callable** — an endpoint. Callable functions pass auth context automatically, which is usually what you want.
- **Firestore triggers** — react to document create, update, delete. This is where fan-out, denormalisation and counters live.
- **Scheduled** — cron.

**What belongs in a function**

- Anything using a **secret** — payment providers, third-party APIs, email
- **Setting custom claims** (roles) — a client must never do this
- **Fan-out** — updating denormalised copies when a source changes
- Work a client should not be trusted with, or cannot do

**The two things that actually bite**

**Cold starts.** An idle function takes hundreds of milliseconds to seconds on first call. Mitigations: keep the bundle small, set minimum instances for latency-critical paths, and lazily initialise heavy dependencies rather than at module scope.

**Infinite trigger loops.** A function triggered by a write to \`posts\` that itself writes to \`posts\` will call itself. This runs up a real bill quickly and is a genuinely common accident.

Guard it: check whether the relevant field actually changed, and exit early if not. Write the guard first, before the logic.

**Idempotency.** Functions may run more than once for the same event — that is normal delivery behaviour, not a bug. Design so a duplicate run is harmless.

**Storage**

File uploads with their own **security rules**, separate from Firestore's.

The important points:

- **Validate size and content type in the rules**, since there is no server in the path
- Uploads go **direct from client to Storage** — bytes never touch a function, which is efficient and means a function cannot inspect them beforehand
- **Trigger a function on upload** for processing: resize an image, generate a thumbnail, scan for malware, write a Firestore record
- Never trust the client-supplied filename or content type — the same rule as any upload anywhere

**A cost note:** functions bill by invocation, duration and memory. A trigger on a high-write collection is a recurring cost that grows with usage, and it is easy to overlook because nothing about writing it suggests a per-event price.`,
      contentHi: `**Cloud Functions** bina server ke server code hain. Ye **bharosemand jagah** par chalte hain, aur ye hain hi isliye: kuch cheezein client par nahi honi chahiye.

**Teen tarah ke trigger**

- **HTTP / callable** — ek endpoint. Callable functions auth context apne aap le jate hain, aur aksar aapko wahi chahiye.
- **Firestore triggers** — document create, update, delete par reaction. Fan-out, denormalisation aur counters yahin rehte hain.
- **Scheduled** — cron.

**Function mein kya hona chahiye**

- Jo bhi **secret** use kare — payment providers, third-party APIs, email
- **Custom claims (roles) set karna** — client ko ye kabhi nahi karna chahiye
- **Fan-out** — source badalne par denormalised copies update karna
- Wo kaam jo client par bharosa nahi kiya ja sakta, ya wo kar hi nahi sakta

**Do cheezein jo sach mein kaat ti hain**

**Cold starts.** Khaali padi function pehle call par kuch sau milliseconds se kai second leti hai. Bachaav: bundle chhota rakho, latency wale raston par minimum instances set karo, aur bhaari dependencies module ke star par nahi, zaroorat par shuru karo.

**Anant trigger loop.** Jo function \`posts\` par write se chale aur khud \`posts\` mein likhe wo khud ko bulata rahega. Isse jaldi asli bill chadh jata hai aur ye sach mein aam haadsa hai.

Ise roko: jaancho ki wo field sach mein badli hai ya nahi, aur nahi to jaldi nikal jao. Logic se pehle ye rok likho.

**Idempotency.** Functions ek hi event ke liye ek se zyada baar chal sakte hain — ye normal delivery hai, bug nahi. Aisa banao ki dobara chalna nuksaan na kare.

**Storage**

File uploads apne **security rules** ke saath, Firestore se alag.

Zaroori baatein:

- **Size aur content type rules mein jaancho**, kyunki raste mein server hai hi nahi
- Uploads **client se seedhe Storage** jate hain — bytes kisi function ko chhute hi nahi, jo kaam ka hai aur iska matlab ye bhi ki function unhe pehle dekh nahi sakta
- Processing ke liye **upload par function trigger karo**: image resize, thumbnail, malware scan, Firestore record likhna
- Client ke diye filename ya content type par kabhi bharosa nahi — wahi niyam jo kahin bhi upload ka hai

**Kharch ki baat:** functions invocation, awadhi aur memory se bill hote hain. Bahut write hone wali collection par trigger baar-baar lagne wala kharch hai jo istemal ke saath badhta hai, aur ise chhodna aasan hai kyunki use likhte waqt kuch bhi per-event daam ka ishara nahi karta.`,
      codeExample: `import { onDocumentUpdated } from 'firebase-functions/v2/firestore';

// GUARD FIRST. A function that writes to the collection it listens to
// will call itself, and that bill arrives quickly.
export const fanOutAuthorName = onDocumentUpdated('users/{uid}', async (event) => {
  const before = event.data?.before.data();
  const after = event.data?.after.data();

  if (before?.name === after?.name) return;   // ← the guard, before any logic

  const posts = await db.collection('posts')
    .where('authorId', '==', event.params.uid).get();

  const batch = db.batch();
  posts.docs.forEach((d) => batch.update(d.ref, { authorName: after!.name }));
  await batch.commit();
});

// Roles can only be set from a trusted environment
export const setRole = onCall(async (request) => {
  if (request.auth?.token.role !== 'admin') throw new HttpsError('permission-denied', '');
  await admin.auth().setCustomUserClaims(request.data.uid, { role: request.data.role });
});

// Storage rules: no server in the path, so validate here
// match /uploads/{uid}/{file} {
//   allow write: if request.auth.uid == uid
//     && request.resource.size < 5 * 1024 * 1024
//     && request.resource.contentType.matches('image/.*');
// }`,
      commonMistakes: [
        'A Firestore trigger that writes back to the same collection without a guard, calling itself indefinitely.',
        'Assuming a function runs exactly once per event. Duplicate delivery is normal; design for idempotency.',
        'Initialising heavy dependencies at module scope, making every cold start slower than it needs to be.',
        'No size or content-type validation in Storage rules, since there is no server to do it.',
      ],
      interviewQuestions: [
        'What belongs in a Cloud Function rather than the client?',
        'How do you prevent an infinite trigger loop?',
        'What is a cold start and how do you reduce it?',
        'Where is upload validation enforced when bytes go straight to Storage?',
      ],
      practiceQuestions: [
        'Write a fan-out function with a change guard and test it does not re-trigger.',
        'Add Storage rules limiting uploads by size and content type, then try to defeat them.',
      ],
      tags: ['firebase', 'functions', 'storage', 'serverless'],
    },

    {
      slug: 'firebase-cost',
      title: 'Cost: how the bill actually works',
      difficulty: 'HARD',
      summary: 'You pay per document read, not per gigabyte. That makes query shape a spending decision, and it is where the surprise bills come from.',
      summaryHi: 'Aap har document read ka paisa dete ho, gigabyte ka nahi. Isse query ki shakal kharch ka faisla ban jati hai, aur chaunkane wale bill wahin se aate hain.',
      content: `The billing model is the thing people understand last and should understand first.

**What you are charged for**

- **Document reads** — every document returned, and a minimum for a query returning nothing
- **Document writes** and **deletes**
- Storage, network egress
- Function invocations, duration and memory

**Reads dominate**, and they scale with usage in a way that is easy to miss.

**Where surprise bills come from**

**Listing to count.** Fetching 10,000 documents to display a number costs 10,000 reads, every time anyone opens that screen. Use \`getCountFromServer()\` or a maintained counter.

**Unbounded listeners.** A listener with no \`limit()\` on a growing collection charges for the initial load and then for every change, forever, for every connected client.

**A trigger loop.** A function retriggering itself burns invocations and writes at machine speed. This is the classic "I left it running overnight" story.

**Loading more than the screen shows.** Fetching a full document to display one field still costs a full read. Firestore has no partial reads, so if a screen needs one field from a large document, consider a smaller summary document.

**N+1.** A list of 50 posts fetching each author separately is 51 reads instead of 50. Denormalise the author name.

**The rules that keep it sane**

1. **\`limit()\` on everything.** No exceptions for user-facing lists.
2. **Never fetch to count.**
3. **Denormalise to avoid follow-up reads** — this is a cost decision as much as a modelling one.
4. **One-off reads where data is static**; listeners only where it genuinely changes.
5. **Set a budget alert.** This is not optional. A runaway function or a bad query pattern can spend a great deal before anyone notices, and the failure mode is silent.

**Estimating before building**

Do the arithmetic the same way as any system design question: *daily active users × screens per session × reads per screen*.

1,000 users × 10 screens × 20 reads = 200,000 reads/day. That is small. But change "20 reads" to "fetch the whole collection" and it is not.

That calculation takes a minute and has cancelled many expensive designs cheaply.

**The honest framing:** Firebase is cheap at small scale and can become expensive at large scale **if the access patterns are wrong**. It is rarely expensive because of volume alone — it is expensive because a screen reads more than it needs, repeatedly. That is a design problem with a design fix.`,
      contentHi: `Billing ka model wo cheez hai jise log sabse aakhir mein samajhte hain aur sabse pehle samajhna chahiye.

**Aapse kis cheez ka paisa liya jata hai**

- **Document reads** — har laut aya document, aur kuch na laut ane wali query ka bhi kam se kam kharch
- **Document writes** aur **deletes**
- Storage, network egress
- Function invocations, awadhi aur memory

**Reads sabse bhaari hain**, aur ye istemal ke saath aise badhti hain jo aasani se chhoot jata hai.

**Chaunkane wale bill kahan se aate hain**

**Ginne ke liye list laana.** Ek number dikhane ke liye 10,000 documents laana har baar 10,000 read hai, jab bhi koi wo screen khole. \`getCountFromServer()\` ya sambhala hua counter use karo.

**Bina seema ke listeners.** Badhti collection par bina \`limit()\` wala listener pehle load ka paisa leta hai aur phir har badlav ka, hamesha, har judi client ke liye.

**Trigger loop.** Khud ko dobara chalata function machine ki raftaar se invocations aur writes jalata hai. "Raat bhar chalta chhod diya tha" wali classic kahani yahi hai.

**Screen se zyada load karna.** Ek field dikhane ke liye poora document laana bhi poore read ka paisa leta hai. Firestore mein aadha read hota hi nahi, isliye bade document se ek field chahiye to chhota summary document socho.

**N+1.** 50 posts ki list jo har author alag laati hai wo 50 ki jagah 51 read hai. Author ka naam denormalise karo.

**Wo niyam jo ise samajhdaar rakhte hain**

1. **Har cheez par \`limit()\`.** User ko dikhne wali lists mein koi chhoot nahi.
2. **Ginne ke liye kabhi mat laao.**
3. **Aage ki reads bachane ko denormalise karo** — ye modelling jitna hi kharch ka faisla hai.
4. Jahan data sthir hai wahan **ek baar ki reads**; listeners sirf wahan jahan wo sach mein badalta hai.
5. **Budget alert lagao.** Ye optional nahi hai. Bhaagta function ya kharab query pattern kisi ke dhyan mein aane se pehle bahut kharch kar sakta hai, aur nakaami chupchaap hoti hai.

**Banane se pehle andaza**

Hisaab waise hi karo jaise kisi bhi system design sawaal mein: *roz ke active users × har session ke screens × har screen ki reads*.

1,000 users × 10 screens × 20 reads = 2,00,000 reads/din. Ye chhota hai. Par "20 reads" ki jagah "poora collection laao" kar do aur ye chhota nahi rehta.

Ye hisaab ek minute leta hai aur kai mehnge designs saste mein radd kar chuka hai.

**Imaandar baat:** Firebase chhote paimane par sasta hai aur bade paimane par mehnga ho sakta hai **agar access ke tareeke galat hon**. Ye sirf maatra se mehnga shayad hi hota hai — ye isliye mehnga hota hai kyunki koi screen zaroorat se zyada padhti hai, baar-baar. Ye design ki samasya hai jiska hal design mein hai.`,
      codeExample: `// ❌ 10,000 reads every time someone opens the dashboard
const all = await getDocs(collection(db, 'orders'));
setCount(all.size);

// ✅ one billed aggregation
const snap = await getCountFromServer(collection(db, 'orders'));
setCount(snap.data().count);

// ❌ N+1: 50 posts, then 50 author lookups = 100 reads
for (const post of posts) {
  post.author = (await getDoc(doc(db, 'users', post.authorId))).data();
}

// ✅ denormalise authorName onto the post = 50 reads
// This is a COST decision as much as a modelling one.

// Estimate before building — one minute, and it cancels bad designs cheaply
const dailyReads = 1_000 /* users */ * 10 /* screens */ * 20 /* reads */;
console.log(dailyReads * 30, 'reads/month');   // then check the price table`,
      commonMistakes: [
        'Fetching a collection to display a count, paying one read per document for one number.',
        'Listeners without limit() on growing collections, billing continuously for every connected client.',
        'No budget alert, so a trigger loop or bad query pattern spends silently for days.',
        'Not estimating reads before building, then discovering the access pattern is uneconomic after launch.',
      ],
      interviewQuestions: [
        'What exactly are you billed for in Firestore?',
        'Why is fetching a collection to count it a problem?',
        'How does denormalisation reduce cost as well as latency?',
        'How would you estimate the monthly cost of a Firestore-backed screen?',
      ],
      practiceQuestions: [
        'Audit an app for queries without limit() and for count-by-fetching.',
        'Estimate monthly reads for your busiest screen at 10x current usage.',
      ],
      tags: ['firebase', 'firestore', 'cost', 'must-know'],
    },

    {
      slug: 'firebase-production',
      title: 'Emulators, testing and shipping',
      difficulty: 'MEDIUM',
      summary: 'The emulator suite is not optional. Rules need tests, environments need separating, and indexes need deploying.',
      summaryHi: 'Emulator suite optional nahi hai. Rules ko tests chahiye, environments alag chahiye, aur indexes deploy karne padte hain.',
      content: `**The emulator suite runs Firestore, Auth, Functions and Storage locally.** Use it from the first day, for three reasons that are each sufficient on their own:

- **Rules are testable.** You can assert that this user can read this document and that user cannot — which is the only way to be confident in the layer that is your entire authorisation.
- **No cost, no shared state.** Nobody is corrupting a shared dev database, and nobody is running up a bill.
- **Fast.** Tests run in seconds against a local instance.

Not using the emulator means testing authorisation by hand, against real data, and that is how leaks reach production.

**Separate projects per environment**

A distinct Firebase project for dev, staging and production. Not just separate collections — **separate projects**, so a mistake in staging cannot touch production data, and so quotas and billing are visible per environment.

**What must be deployed, not just written**

- **Security rules** — these live in a file and deploy separately from your app
- **Composite indexes** — a query working locally will fail in production if the index was not deployed
- **Functions**

That second one is a genuinely common production incident: it worked in development because the emulator does not require indexes the same way.

**Testing rules is the highest-value testing you can do here**

Because rules are the only authorisation layer, a rules test suite is worth more than most other tests in the project. Assert the denied cases as carefully as the allowed ones — a rule that allows too much passes every happy-path test.

**Two operational realities**

**There are no migrations.** Firestore has no schema, so changing a document shape means writing a script that reads and rewrites documents, and handling both shapes in the client while it runs. Plan for the transition period explicitly.

**Backups are not automatic on all tiers.** Set up scheduled exports. Deleting a collection is not reversible without one, and "we assumed it was backed up" is a bad discovery.

**Monitoring worth having**

Budget alerts, function error rates and cold start latency, and rules denials — a spike in permission-denied errors usually means either a bug or someone probing.

**The shipping checklist**: rules deployed and tested, indexes deployed, budget alert set, backups scheduled, App Check enabled to stop other clients using your project's API keys, and no test-mode rules anywhere.`,
      contentHi: `**Emulator suite Firestore, Auth, Functions aur Storage local mein chalata hai.** Ise pehle din se use karo, teen wajahon se jinme se har ek akeli kaafi hai:

- **Rules test hone layak ho jate hain.** Aap sabit kar sakte ho ki ye user ye document padh sakta hai aur wo nahi — aur us parat par bharosa karne ka yahi ek tareeka hai jo aapki poori authorisation hai.
- **Na kharch, na saanjhi state.** Koi saanjha dev database kharab nahi kar raha, aur koi bill nahi chadha raha.
- **Tez.** Tests local instance ke against seconds mein chalte hain.

Emulator na use karne ka matlab hai authorisation haath se, asli data par test karna, aur isi tarah leaks production tak pahunchte hain.

**Har environment ka apna project**

Dev, staging aur production ke liye alag Firebase project. Sirf alag collections nahi — **alag projects**, taaki staging ki galti production ke data ko chhu na sake, aur quotas aur billing har environment ke liye alag dikhein.

**Kya deploy karna hota hai, sirf likhna nahi**

- **Security rules** — ye file mein rehte hain aur aapki app se alag deploy hote hain
- **Composite indexes** — jo query local par chalti hai wo production mein fail hogi agar index deploy na hua ho
- **Functions**

Doosri baat sach mein aam production incident hai: development mein isliye chala kyunki emulator indexes ki utni zid nahi karta.

**Rules test karna yahan ki sabse keemti testing hai**

Rules hi akeli authorisation parat hain, isliye rules ka test suite project ke zyadatar doosre tests se zyada keemti hai. Mana kiye gaye case utni hi savdhani se jaancho jitni allowed wale — jo rule zyada allow karta hai wo har achhe raste ka test pass kar leta hai.

**Do operational sachaiyan**

**Migrations hain hi nahi.** Firestore mein schema nahi hai, isliye document ki shakal badalne ka matlab hai aisi script likhna jo documents padh kar dobara likhe, aur us dauran client mein dono shape sambhalna. Us beech ke samay ki yojna saaf-saaf banao.

**Backups har tier par apne aap nahi hote.** Scheduled exports lagao. Bina uske collection mitana palta nahi ja sakta, aur "hum maan rahe the ki backup hai" bura pata chalna hai.

**Rakhne layak monitoring**

Budget alerts, function ki error rate aur cold start latency, aur rules ke denials — permission-denied errors ka achanak badhna aksar ya to bug hai ya koi kured raha hai.

**Ship karne ki suchi**: rules deploy aur test ho, indexes deploy hon, budget alert lage, backups scheduled hon, App Check chalu ho taaki doosre clients aapke project ki API keys use na kar sakein, aur kahin bhi test-mode rules na hon.`,
      codeExample: `// Rules tests — the highest-value tests in a Firebase project,
// because rules are the ONLY authorisation layer.
import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';

test('a user reads only their own orders', async () => {
  const alice = testEnv.authenticatedContext('alice');
  const bob = testEnv.authenticatedContext('bob');

  await assertSucceeds(getDoc(doc(alice.firestore(), 'orders/alice-1')));

  // Assert the DENIED case just as carefully — a rule that allows too much
  // passes every happy-path test you write.
  await assertFails(getDoc(doc(bob.firestore(), 'orders/alice-1')));
});

// These deploy separately from your app. A query that works locally
// will fail in production if the index was never deployed.
//   firebase deploy --only firestore:rules
//   firebase deploy --only firestore:indexes
//   firebase deploy --only functions`,
      commonMistakes: [
        'Not using the emulator, so authorisation is tested by hand against real data.',
        'Sharing one Firebase project across environments, letting a staging mistake reach production data.',
        'Deploying the app but not the composite indexes, so queries that work locally fail in production.',
        'Assuming backups exist. Deleting a collection without one is not reversible.',
      ],
      interviewQuestions: [
        'Why is the emulator suite important beyond convenience?',
        'What has to be deployed separately from your application code?',
        'How do you change a document shape when there are no migrations?',
        'Why test the denied cases in security rules as carefully as the allowed ones?',
      ],
      practiceQuestions: [
        'Write rules unit tests covering both an allowed and a denied case.',
        'Write a migration script that rewrites a document shape while the old client is still running.',
      ],
      tags: ['firebase', 'testing', 'production', 'must-know'],
    },

    {
      slug: 'firebase-vs-alternatives',
      title: 'Firebase, Supabase or your own backend',
      difficulty: 'MEDIUM',
      summary: 'A decision with real consequences. Firebase for realtime and mobile, Supabase when the data is relational, your own when you need control.',
      summaryHi: 'Asli natijon wala faisla. Realtime aur mobile ke liye Firebase, data relational ho to Supabase, kaabu chahiye to apna backend.',
      content: `**Firebase** — document database, best-in-class realtime and offline, deep mobile integration, mature auth. Costs: no joins, per-document billing, real lock-in.

**Supabase** — Postgres with an auto-generated API, row-level security instead of rules, realtime over Postgres replication. You get **SQL, joins, transactions and migrations**, and it is open source so self-hosting is possible.

**Your own backend** — full control, no lock-in, and you own everything: auth, scaling, patching, on-call.

**How to actually choose**

**Choose Firebase when** the data is document-shaped, realtime or offline is genuinely central, you are mobile-first, and the team is small. Chat, collaborative tools, MVPs.

**Choose Supabase when** the data is relational — and most application data is. If you find yourself repeatedly wanting a join, that is the signal. Also when SQL familiarity matters, or when the possibility of self-hosting has value.

**Build your own when** you have complex business logic, need cost predictability at scale, have compliance requirements, or genuinely cannot accept lock-in.

**The honest observations**

**Most application data is relational.** Users have orders, orders have items. Choosing a document database for relational data means rebuilding joins by hand in application code, and that cost recurs on every screen. The absence of joins is the single most common reason Firebase projects become uncomfortable.

**Lock-in is asymmetric.** Moving off Firebase is a rewrite: rules, queries and SDK calls are all proprietary. Moving off Supabase is largely a Postgres migration, which is a well-understood operation. That difference is worth pricing at the start rather than the end.

**The realtime gap has narrowed.** Firebase's realtime was once a decisive advantage. Supabase realtime, and simply using WebSockets, have closed much of it — though Firebase's **offline** support is still genuinely ahead, and for mobile that can be the deciding factor on its own.

**You can mix.** Firebase Auth with your own backend is a common and sensible combination.

**The pragmatic default:** if you are unsure and the data has relationships, Postgres — via Supabase or otherwise — is the safer choice, because it stays adequate longer and the exit is cheaper. Choose Firebase deliberately, for realtime, offline or mobile, rather than as the default for "I do not want to write a backend".`,
      contentHi: `**Firebase** — document database, apni shreni ka sabse achha realtime aur offline, gehra mobile integration, paripakva auth. Keemat: joins nahi, per-document billing, asli lock-in.

**Supabase** — Postgres jiske upar apne aap bani API, rules ki jagah row-level security, Postgres replication par realtime. Aapko **SQL, joins, transactions aur migrations** milte hain, aur ye open source hai isliye khud host karna mumkin hai.

**Apna backend** — poora kaabu, koi lock-in nahi, aur sab kuch aapka: auth, scaling, patching, on-call.

**Chunein kaise**

**Firebase tab** jab data document jaisa ho, realtime ya offline sach mein केंद्र mein ho, aap mobile-first ho, aur team chhoti ho. Chat, saath mein kaam wale tools, MVP.

**Supabase tab** jab data relational ho — aur zyadatar application data relational hi hota hai. Aapko baar-baar join ki zaroorat mehsoos ho, to wahi ishara hai. Ya jab SQL ki jaankari matter karti ho, ya khud host karne ki sambhavna ki keemat ho.

**Apna banao tab** jab mushkil business logic ho, bade paimane par kharch ka pakka anuman chahiye, compliance ki shartein hon, ya aap sach mein lock-in sweekar na kar sako.

**Imaandar baatein**

**Zyadatar application data relational hota hai.** Users ke orders hote hain, orders mein items. Relational data ke liye document database chunne ka matlab hai application code mein joins haath se dobara banana, aur wo kharch har screen par dohrata hai. Firebase projects ke asahaj hone ki sabse aam wajah joins ka na hona hai.

**Lock-in asamaan hai.** Firebase se hatna rewrite hai: rules, queries aur SDK calls sab proprietary hain. Supabase se hatna zyadatar Postgres migration hai, jo achhi tarah samjha gaya kaam hai. Ye farak shuruaat mein tolna chahiye, ant mein nahi.

**Realtime ka faasla kam hua hai.** Firebase ka realtime kabhi nirnayak faayda tha. Supabase realtime, aur bas WebSockets use karna, isse kaafi paat chuke hain — halanki Firebase ka **offline** support ab bhi sach mein aage hai, aur mobile ke liye wo akela faisla kar sakta hai.

**Aap mila bhi sakte ho.** Firebase Auth ke saath apna backend aam aur samajhdaar mel hai.

**Practical default:** aap tay na kar pao aur data mein rishte hon, to Postgres — Supabase se ya kisi aur tareeke se — surakshit chunaav hai, kyunki wo lambe samay tak kaafi rehta hai aur nikas sasta hai. Firebase soch kar chuno, realtime, offline ya mobile ke liye — "mujhe backend nahi likhna" ke default ki tarah nahi.`,
      commonMistakes: [
        'Choosing Firebase for relational data, then rebuilding joins by hand on every screen.',
        'Not pricing lock-in at the start. Leaving Firebase is a rewrite; leaving Supabase is a Postgres migration.',
        'Assuming Firebase is the only option for realtime — that gap has narrowed considerably.',
        'Treating "I do not want to write a backend" as a sufficient reason, rather than choosing for realtime, offline or mobile.',
      ],
      interviewQuestions: [
        'When would you choose Firebase over Supabase, and vice versa?',
        'What does lock-in actually cost in each case?',
        'Why is "most application data is relational" an argument here?',
        'Can you use Firebase Auth without the rest of Firebase?',
      ],
      practiceQuestions: [
        'Take a project spec and argue for Firebase, then argue against it. Decide which case is stronger.',
        'Model the same feature in Firestore and in Postgres, and compare the query count per screen.',
      ],
      tags: ['firebase', 'architecture', 'comparison'],
    },
  ],
};
