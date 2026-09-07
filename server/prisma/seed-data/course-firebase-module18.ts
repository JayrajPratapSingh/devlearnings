/**
 * Databases Complete Course — Module 18: Realtime Database & Firebase Data Modeling, lessons 1-3.
 * Part IV of the course: Firebase (module 2 of 2).
 *
 * Lesson 1: The Realtime Database JSON tree — one big JSON document, ref/child/
 *           push/set/update/remove, and the on() event model.
 * Lesson 2: Querying the RTDB — orderByChild/Key/Value, the single-sort-key limit,
 *           range filters, .indexOn, and shallow reads.
 * Lesson 3: RTDB vs Cloud Firestore — the two databases side by side and when to
 *           reach for each.
 *
 * NOTE: The Realtime Database is a hosted service with no offline engine, so the
 * examples here are illustrative — realistic SDK code and realistic results, not
 * machine-verified against a running database.
 */

import type { CourseLesson } from './course-js-module1';

export const FIREBASE_MODULE_18: CourseLesson[] = [
  {
    slug: 'rtdb-the-json-tree',
    title: 'The Realtime Database JSON Tree',
    titleHi: 'Realtime Database JSON Tree',
    description: 'The Realtime Database is a single giant JSON document. You address any node by its path, read and write subtrees, and attach listeners that push every change. There are no collections, no documents, no queries across the tree — just one nested object and the paths into it.',
    descriptionHi: 'Realtime Database ek single giant JSON document hai. Aap kisī bhi node ko iske path se address karте ho, subtrees read aur write karते ho, aur listeners attach karते ho jo har change push karते hain. Koi collections nahi, koi documents nahi, tree ke across koi queries nahi — bas ek nested object aur ismein paths.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 1,

    analogy: {
      en: '**One enormous org chart drawn on a single whiteboard, where every box has a name and either a value or more boxes inside it, and you point to any box by reading the path down to it — "company / engineering / backend / alice".** There is no filing cabinet of separate documents; it is all one connected drawing. You can wipe and redraw any box and everything under it (`set`), tweak a few labels without touching the rest (`update`), or add a new box with an auto-generated name (`push`). And you can put a live camera on any box so you are told the instant anything under it changes. The catch: if you point at "engineering" and ask for it, you get the entire engineering subtree — every team, every person — because the box and everything inside it come as one piece.',
      hi: '**Ek single whiteboard par bana ek enormous org chart, jahaan har box ka ek naam hai aur ya to ek value ya iske andar aur boxes, aur aap kisī bhi box ko uske neeche path padhkar point karте ho — "company / engineering / backend / alice".** Koi alag documents ki filing cabinet nahi; ye sab ek connected drawing hai. Aap kisī bhi box aur iske neeche sab кुछ wipe aur redraw kar sakते ho (`set`), кुछ labels tweak kar sakते ho baaki ko touch kiye bina (`update`), ya ek auto-generated naam ke saath ek naya box add kar sakते ho (`push`). Catch: agar aap "engineering" par point karके ise maangते ho, aapको poora engineering subtree milता hai.',
    },

    simple: `**THE WHOLE DATABASE IS ONE JSON OBJECT. Everything is a PATH into it.**

\`\`\`
{
  "users": {
    "u1": { "name": "Ravi", "plan": "pro" },
    "u2": { "name": "Meera", "plan": "free" }
  },
  "messages": {
    "-Nabc123": { "text": "hi", "from": "u1", "at": 1725700000000 }
  }
}
\`\`\`

**REFERENCES + WRITES:**
\`\`\`js
const db = getDatabase();
ref(db, "users/u1")                       // a reference to a path
await set(ref(db, "users/u1"), { name: "Ravi", plan: "pro" });   // overwrite this node
await update(ref(db, "users/u1"), { plan: "free" });             // patch keys, keep the rest
await remove(ref(db, "users/u1"));                               // delete this node + subtree
const newRef = push(ref(db, "messages"));                        // auto-generated push key
await set(newRef, { text: "hi", from: "u1" });
\`\`\`

**PUSH KEYS** (\`-Nabc123...\`) are time-ordered, URL-safe, collision-free IDs generated
CLIENT-SIDE. Sorting by key = chronological order.

**LISTENERS -- \`onValue\` fires now + on every change; \`onChildAdded\` per child:**
\`\`\`js
onValue(ref(db, "users/u1"), (snap) => console.log(snap.val()));   // whole node, every change
onChildAdded(ref(db, "messages"), (snap) => append(snap.val()));   // one call per existing + new child
\`\`\`

**READING A PATH RETURNS THE ENTIRE SUBTREE.** \`get(ref(db, "users"))\` downloads
EVERY user. Depth is not free -- shallow, wide trees beat deep ones.`,

    simpleHi: `**POORA DATABASE EK JSON OBJECT HAI. Sab кुछ ismein ek PATH hai.**

\`\`\`
{
  "users": {
    "u1": { "name": "Ravi", "plan": "pro" }
  },
  "messages": {
    "-Nabc123": { "text": "hi", "from": "u1" }
  }
}
\`\`\`

**REFERENCES + WRITES:**
\`\`\`js
const db = getDatabase();
await set(ref(db, "users/u1"), { name: "Ravi", plan: "pro" });   // is node ko overwrite karो
await update(ref(db, "users/u1"), { plan: "free" });             // keys patch karो, baaki rakhो
await remove(ref(db, "users/u1"));                               // is node + subtree delete karो
const newRef = push(ref(db, "messages"));                        // auto-generated push key
await set(newRef, { text: "hi", from: "u1" });
\`\`\`

**PUSH KEYS** (\`-Nabc123...\`) time-ordered, URL-safe, collision-free IDs hain jo CLIENT-SIDE generate hote hain.

**LISTENERS -- \`onValue\` abhi + har change par fire karता hai; \`onChildAdded\` prati child:**
\`\`\`js
onValue(ref(db, "users/u1"), (snap) => console.log(snap.val()));
onChildAdded(ref(db, "messages"), (snap) => append(snap.val()));
\`\`\`

**EK PATH READ KARNA POORA SUBTREE LAUTATA HAI.** \`get(ref(db, "users"))\` HAR user download karта hai. Depth free nahi hai -- shallow, wide trees deep se behtar hain.`,

    content: `## One JSON document

The Realtime Database (RTDB) is Firebase's original database, and its model is radically simple: **the entire database is a single JSON tree**. There are no tables, no collections, no documents. There is one nested object, rooted at the database URL, and every piece of data lives at a path within it like \`users/u1/name\`.

A path can point at:

- a **leaf value** — a string, number, boolean, or \`null\`;
- an **object** — which has named children, each of which is itself a leaf or an object.

Arrays are not a native type. If you write an array, RTDB stores it as an object with keys \`"0"\`, \`"1"\`, \`"2"\`. This is deliberate — see push keys below.

## References and writes

A **reference** (\`ref(db, path)\`) is a pointer to a location in the tree. The write operations:

- **\`set(ref, value)\`** — write \`value\` at this location, **replacing** whatever was there, including the entire subtree below it.
- **\`update(ref, { childKey: value, ... })\`** — a **multi-key patch**: each listed child key is written, other children at the location are left untouched. Keys can contain slashes to reach deeper (\`update(ref(db, "users/u1"), { "address/city": "Pune" })\`).
- **\`remove(ref)\`** — delete this location and everything under it (equivalent to \`set(ref, null)\`; writing \`null\` is how you delete in RTDB).
- **\`push(ref)\`** — generate a new child location with an auto key and return a reference to it; you then \`set\` data into it. \`push(ref, value)\` does both.

## Push keys

\`push()\` generates a key like \`-NpQr7sT9uVwXyZ\`. These keys are:

- **chronologically ordered** — a key generated later sorts after one generated earlier, because the key encodes a timestamp prefix. Ordering children by key gives you insertion order.
- **client-generated and collision-free** — the key includes random bits, so many clients pushing at once (even offline) never collide, and no server round trip is needed to get an ID.
- **URL-safe** — usable directly in paths.

This is why you never store a list as an array in RTDB: an array requires reindexing on insert/delete and two offline clients appending to it would both write index \`5\`. A pushed-key object has neither problem.

## Listeners

RTDB is real-time first. You attach listeners to a reference:

- **\`onValue(ref, cb)\`** — \`cb\` is called **immediately** with the current value at that location (the whole subtree, as one snapshot), and **again on every change** anywhere under it. \`snapshot.val()\` is the data; \`snapshot.exists()\` tells you if anything is there.
- **\`onChildAdded(ref, cb)\`** — \`cb\` is called **once for each existing child**, then once for **each new child** added later. Used for growing lists (a chat log) so you append one item at a time instead of re-rendering the whole list.
- **\`onChildChanged\`**, **\`onChildRemoved\`**, **\`onChildMoved\`** — the other granular child events.
- **\`get(ref)\`** — a **one-time read** (no listener). Returns a promise of the snapshot. Prefer a listener when you want live data; use \`get\` for a single fetch.

Every listener returns an **unsubscribe function**; call it when done, or use \`off(ref)\`.

## Depth is not free

Because a read returns the **entire subtree** at a path, the shape of your tree is a performance decision. \`get(ref(db, "users"))\` downloads every user and everything nested under each. \`onValue\` on \`rooms/room1\` where each room embeds all its messages means every new message re-delivers the whole room to every listener.

The rule that follows: **keep the tree shallow and wide, and split large or unbounded subtrees into separate top-level lists** keyed by ID, so you can read and listen to exactly the slice you need. Lesson 4 is about exactly this modeling discipline.`,

    contentHi: `## Ek JSON document

Realtime Database (RTDB) Firebase ka original database hai, aur iska model radically simple hai: **poora database ek single JSON tree hai**. Koi tables nahi, koi collections nahi, koi documents nahi. Ek nested object hai, database URL par rooted, aur har data ka tुkड़a ismein ek path par rehта hai jaisे \`users/u1/name\`.

Arrays ek native type nahi hain. Agar aap ek array likhते ho, RTDB ise keys \`"0"\`, \`"1"\`, \`"2"\` ke saath ek object ke roop mein store karता hai.

## References aur writes

- **\`set(ref, value)\`** — is location par \`value\` likhो, jo bhi tha use **replace** karте hue, poore subtree sameत.
- **\`update(ref, { childKey: value, ... })\`** — ek **multi-key patch**.
- **\`remove(ref)\`** — is location ko delete karो (\`set(ref, null)\` ke barabar).
- **\`push(ref)\`** — ek auto key ke saath ek naya child location generate karो.

## Push keys

\`push()\` \`-NpQr7sT9uVwXyZ\` jaisी ek key generate karता hai. Ye keys:
- **chronologically ordered** hain;
- **client-generated aur collision-free** hain;
- **URL-safe** hain.

Isliye aap RTDB mein ek list kabhi ek array ke roop mein store nahi karते.

## Listeners

- **\`onValue(ref, cb)\`** — \`cb\` **turant** current value ke saath call hota hai, aur **har change par phir se**.
- **\`onChildAdded(ref, cb)\`** — \`cb\` **har existing child ke liye ek baar** call hota hai, phir har naye child ke liye.
- **\`onChildChanged\`**, **\`onChildRemoved\`**, **\`onChildMoved\`**.
- **\`get(ref)\`** — ek **one-time read**.

Har listener ek **unsubscribe function** lautaता hai.

## Depth free nahi hai

Kyunki ek read ek path par **poora subtree** lautaता hai, aapke tree ka shape ek performance decision hai. \`get(ref(db, "users"))\` har user download karता hai.

Rule: **tree ko shallow aur wide rakhо, aur large ya unbounded subtrees ko ID se keyed alag top-level lists mein split karो.**`,

    examples: [
      {
        title: 'set replaces a subtree; update patches named children',
        titleHi: 'set ek subtree replace karta hai; update named children patch karta hai',
        code: `import { getDatabase, ref, set, update, get } from "firebase/database";
const db = getDatabase();

await set(ref(db, "users/u1"), { name: "Ravi", plan: "free", city: "Pune" });
await update(ref(db, "users/u1"), { plan: "pro" });   // only 'plan' changes

const snap = await get(ref(db, "users/u1"));
console.log(snap.val());`,
        output: `{ name: 'Ravi', plan: 'pro', city: 'Pune' }`,
        explain: '`set(ref, value)` writes the whole node, so the first call establishes `users/u1` with three fields. `update(ref, { plan: "pro" })` is a multi-key patch — it rewrites only `plan` and leaves `name` and `city` alone. The final read shows all three, with `plan` updated. `set` would have wiped the un-passed fields; `update` preserves them.',
        explainHi: '`set(ref, value)` poora node likhता hai, to pehla call `users/u1` ko teen fields ke saath establish karता hai. `update(ref, { plan: "pro" })` ek multi-key patch hai — ye sirf `plan` rewrite karता hai aur `name` aur `city` ko chhoड़ deता hai. Final read teenो dikhाता hai, `plan` updated. `set` un-passed fields ko mita deta; `update` unhe preserve karता hai.',
      },
      {
        title: 'push generates a chronologically-ordered, collision-free key client-side',
        titleHi: 'push ek chronologically-ordered, collision-free key client-side generate karta hai',
        code: `import { getDatabase, ref, push, set, get } from "firebase/database";
const db = getDatabase();

const r1 = push(ref(db, "messages"));
await set(r1, { text: "first", from: "u1" });
const r2 = push(ref(db, "messages"));
await set(r2, { text: "second", from: "u2" });

console.log(r1.key, "<", r2.key, "->", r1.key < r2.key);
const all = await get(ref(db, "messages"));
console.log(Object.values(all.val()).map((m) => m.text));`,
        output: `-Nx1aB2cD3eF < -Nx1aB2cGh7i -> true
[ 'first', 'second' ]`,
        explain: "Each `push(ref)` generates a key like `-Nx1aB2cD3eF` CLIENT-SIDE: a timestamp prefix (so `r1.key < r2.key` because r1 was pushed first) plus random bits (so two independent clients never collide, with no server round trip). Reading `messages` and ordering the children by key gives insertion order — `['first', 'second']` — with no separate timestamp field.",
        explainHi: "Har `push(ref)` `-Nx1aB2cD3eF` jaisी ek key CLIENT-SIDE generate karता hai: ek timestamp prefix (to `r1.key < r2.key` kyunki r1 pehle push hua) plus random bits (to do independent clients kabhi collide nahi karते, bina server round trip ke). `messages` read karके aur children ko key se order karके insertion order milता hai — `['first', 'second']` — bina ek alag timestamp field ke.",
      },
      {
        title: 'onValue fires with the whole subtree now and on every change under it',
        titleHi: 'onValue poore subtree ke saath abhi aur iske neeche har change par fire karta hai',
        code: `import { getDatabase, ref, onValue, set } from "firebase/database";
const db = getDatabase();

// room/r1 currently: { name: "General", online: 2 }
const unsub = onValue(ref(db, "rooms/r1"), (snap) => {
  console.log("room:", JSON.stringify(snap.val()));
});
// -> room: {"name":"General","online":2}   (fires immediately)

// another client updates a nested value:
await set(ref(db, "rooms/r1/online"), 3);
// -> room: {"name":"General","online":3}   (SAME listener re-fires with the WHOLE node)

unsub();`,
        output: `room: {"name":"General","online":2}
room: {"name":"General","online":3}`,
        explain: '`onValue` fires immediately with the whole `rooms/r1` node as one snapshot. When another client sets the nested value `rooms/r1/online` to 3, the SAME listener fires again — and it delivers the ENTIRE node again (`{name, online: 3}`), not just the changed leaf. A value listener always carries the full subtree at its path, on every change anywhere under it.',
        explainHi: '`onValue` turant poore `rooms/r1` node ke saath ek snapshot ke roop mein fire karता hai. Jab ek doosरा client nested value `rooms/r1/online` ko 3 set karता hai, WAHI listener phir fire karता hai — aur ye POORA node phir deता hai (`{name, online: 3}`), sirf changed leaf nahi. Ek value listener hamesha apne path par poora subtree carry karता hai, iske neeche kahin bhi har change par.',
      },
    ],

    mistakes: [
      {
        wrong: `// storing a growing list as an array
await set(ref(db, "rooms/r1/messages"), [
  { text: "hi" },      // index 0
  { text: "hello" },   // index 1
]);
// later, two offline clients each append:
// client A: messages[2] = { text: "A" }
// client B: messages[2] = { text: "B" }   // SAME index -> one overwrites the other
// and deleting messages[0] shifts every other index`,
        right: `// use push() keys — each item gets a unique, ordered, client-generated key:
const msgRef = push(ref(db, "rooms/r1/messages"));
await set(msgRef, { text: "hi", at: serverTimestamp() });
// two offline clients pushing -> two distinct keys, no collision, both survive sync.
// deleting one item leaves the others' keys untouched.`,
        why: 'The Realtime Database has no array type; writing a JavaScript array stores it as an object whose keys are the stringified indices. Using such a structure for a list that grows means every insert must choose the next integer index, and two clients that are offline or racing will both compute the same next index and one write will overwrite the other on sync, while every deletion from the middle requires renumbering all subsequent items, which rewrites large parts of the list and invalidates any references held by index. The push operation solves all of this by generating a key that combines a timestamp prefix with random bits: the timestamp makes keys sort in insertion order, the random bits make collisions between independent clients effectively impossible without any server coordination, and because each item has a stable unique key, deleting one item does not disturb the others. A list in the Realtime Database is always an object of push keys, never an array.',
        whyHi: 'Realtime Database mein koi array type nahi hai; ek JavaScript array likhna ise ek object ke roop mein store karता hai jiski keys stringified indices hain. Ek list ke liye jo badhती hai aisी structure istemal karना matlab har insert ko agla integer index chunna hoga, aur do clients jo offline ya racing hain dono wahi agla index compute karेंge aur ek write doosरे ko overwrite karega. `push` operation ye sab solve karता hai ek key generate karके jo ek timestamp prefix ko random bits ke saath combine karती hai.',
      },
      {
        wrong: `// listening on a huge subtree because it's convenient
onValue(ref(db, "users"), (snap) => {
  // every user in the whole app, re-delivered whenever ANY user's ANY field changes
  renderCurrentUser(snap.val()[currentUid]);
});
// -- downloads the entire users tree on connect, and again (in full) on every
//    change to any user anywhere`,
        right: `// listen at the narrowest path you actually need:
onValue(ref(db, \`users/\${currentUid}\`), (snap) => {
  renderCurrentUser(snap.val());
});
// -- one small subtree, re-delivered only when THIS user changes`,
        why: 'A value listener in the Realtime Database delivers the entire subtree at its path on attach and the entire subtree again on every change anywhere beneath that path. Attaching such a listener high in the tree, at a node that contains many children, therefore transfers all of that data on connection and retransfers all of it whenever any descendant value changes, regardless of how small the actual change was or how little of the data the application uses. The fix is to attach each listener at the most specific path whose data the code actually needs, so that both the initial payload and every update are scoped to just that slice. This is the read-time consequence of the same principle that governs how the tree should be structured: shallow, and split into narrow top-level lists so that listeners and one-time reads can target exactly the data in use.',
        whyHi: 'Realtime Database mein ek value listener attach par apne path par poora subtree deता hai aur us path ke neeche kahin bhi har change par phir poora subtree. Aisा listener tree mein ऊpar attach karना, ek node par jismein bahut children hain, isliye connection par wo saara data transfer karता hai aur ise retransfer karता hai jab bhi koi descendant value badalती hai. Fix har listener ko sabse specific path par attach karना hai jiska data code ko actually chahiye.',
      },
      {
        wrong: `// expecting a deep nested write to merge like Firestore's set with merge
await update(ref(db, "users/u1"), {
  profile: { city: "Pune" },   // -- REPLACES the entire 'profile' object,
                                //    wiping profile.name, profile.bio, etc.
});`,
        right: `// use a deep path key to update one nested field without replacing its siblings:
await update(ref(db, "users/u1"), {
  "profile/city": "Pune",   // only profile.city is written; name/bio untouched
});
// update() merges at the TOP level of the keys you pass; a nested OBJECT value
// still replaces that whole child.`,
        why: 'The update operation merges at the level of the keys passed to it: each top-level key in the object is written to the corresponding child, and children not named are left alone. However, the value written for a named key replaces that key\'s existing value entirely, so passing an object as the value for a key like profile replaces the whole profile node with the new object, discarding any children of profile that were not included. To update a single nested field while preserving its siblings, the path to that field is expressed as a slash-separated key in the update object, such as the key profile/city, which tells update to write only at that deep location and leave the rest of profile intact. The mental model is that update takes a flat map of paths to values; a value that is itself an object is written as-is at its path, not deep-merged.',
        whyHi: '`update` operation ise pass ki gayी keys ke level par merge karता hai: object mein har top-level key corresponding child par likhी jाती hai, aur jo children named nahi hain unhe chhoड़ diya jाता hai. Halाnki, ek named key ke liye likhी gayी value us key ki existing value ko poori tarah replace karती hai, to `profile` jaisी ek key ke liye ek object as value pass karना poore `profile` node ko replace karта hai. Ek single nested field update karने ke liye, us field ka path ek slash-separated key ke roop mein express kiya jाता hai jaisे `profile/city`.',
      },
    ],

    realWorld: [
      {
        en: '**A live chat where `messages/{roomId}` is an object of push keys, each `{ text, from, at }`** — `onChildAdded` appends new messages one at a time, and push-key ordering is chronological with no sort field needed.',
        hi: '**Ek live chat jahaan `messages/{roomId}` push keys ka ek object hai, har ek `{ text, from, at }`** — `onChildAdded` naye messages ek-ek karके append karता hai.',
      },
      {
        en: '**A multiplayer game state at `games/{gameId}/state` with `onValue`** — every player\'s client gets the new board within tens of milliseconds of any move, which is the RTDB\'s core strength: very low-latency small-payload sync.',
        hi: '**`games/{gameId}/state` par ek multiplayer game state `onValue` ke saath** — har player ka client kisī bhi move ke tens of milliseconds ke andar naya board paता hai.',
      },
      {
        en: '**A collaborative cursor/presence layer** — each client writes `sessions/{docId}/{clientId}: { x, y, name }` and listens to the parent; a tiny, high-frequency write pattern the RTDB handles better than Firestore.',
        hi: '**Ek collaborative cursor/presence layer** — har client `sessions/{docId}/{clientId}: { x, y, name }` likhता hai aur parent ko listen karता hai.',
      },
    ],

    interviewQA: [
      {
        q: 'How is the Realtime Database\'s data model different from Firestore\'s, and what is a push key?',
        qHi: 'Realtime Database ka data model Firestore se kaise alag hai, aur ek push key kya hai?',
        a: 'The Realtime Database stores the entire database as a single JSON tree with no notion of collections or documents; every value lives at a path within one nested object, and a path points either at a leaf value or at an object with named children. Firestore, by contrast, organizes data into collections of documents with subcollections, and its queries return whole documents from one collection. A consequence of the Realtime Database model is that reading a path returns the entire subtree beneath it and a value listener re-delivers that whole subtree on every change under it, which makes the depth and breadth of the tree a performance decision and pushes designs toward shallow, wide trees split into narrow top-level lists. A push key is the auto-generated key that the push operation creates for a new child: it combines a timestamp prefix with random bits, so keys sort chronologically by insertion order, collisions between independent or offline clients are effectively impossible without any server round trip, and the key is URL-safe. Push keys are why lists in the Realtime Database are always stored as objects of keyed children rather than as arrays, which would require reindexing on insertion and would collide when two clients append at once.',
        aHi: 'Realtime Database poore database ko ek single JSON tree ke roop mein store karता hai bina collections ya documents ki dharaणा ke; har value ek nested object mein ek path par rehती hai. Firestore iske विपरीत data ko documents ke collections mein organize karता hai. RTDB model ka ek consequence ye hai ki ek path read karना iske neeche poora subtree lautaता hai aur ek value listener us poore subtree ko har change par re-deliver karता hai. Ek push key wo auto-generated key hai jo `push` operation ek naye child ke liye banata hai: ye ek timestamp prefix ko random bits ke saath combine karती hai, to keys chronologically sort hoती hain aur collisions effectively impossible hain.',
      },
      {
        q: 'What do onValue and onChildAdded do, and when would you use each?',
        qHi: '`onValue` aur `onChildAdded` kya karते hain, aur aap har ek kab istemal karोge?',
        a: 'Both attach a real-time listener to a reference. onValue calls its callback immediately with the current value at that location as a single snapshot of the whole subtree, and calls it again with the whole subtree on every change anywhere beneath that path. It is the right choice when the application wants the complete current state of a bounded location and will re-render from it, for example a room\'s metadata or a game\'s board state. onChildAdded calls its callback once for each child that already exists at the location, and then once for each new child added afterward, delivering one child snapshot per call rather than the whole collection. It is the right choice for a growing list where the application wants to append items incrementally, such as a chat log, because it avoids re-processing the entire list on every new message. The related granular events onChildChanged, onChildRemoved, and onChildMoved report the other kinds of change to children individually. A one-time read uses get instead of a listener. Every listener returns an unsubscribe function that must be called when the listener is no longer needed.',
        aHi: 'Dono ek reference par ek real-time listener attach karते hain. `onValue` apne callback ko turant us location par current value ke saath poore subtree ke ek single snapshot ke roop mein call karता hai, aur ise phir poore subtree ke saath har change par call karता hai. Ye sahi choice hai jab application ek bounded location ka complete current state chahती hai. `onChildAdded` apne callback ko har child ke liye ek baar call karता hai jo pehle se exist karता hai, aur phir har naye child ke liye ek baar, prati call ek child snapshot deते hue. Ye ek growing list ke liye sahi choice hai jaisे ek chat log.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, show the JSON tree state after: `set(ref(db, "users/u1"), { name: "A", plan: "free", city: "Pune" })` then `update(ref(db, "users/u1"), { plan: "pro" })` then `update(ref(db, "users/u1"), { "settings/theme": "dark" })`. Explain why the last one uses a slash-path key.',
        taskHi: 'Ek comment mein, JSON tree state dikhाओ in ke baad: `set(...)` phir `update({ plan: "pro" })` phir `update({ "settings/theme": "dark" })`.',
        hint: 'Final: `users/u1 = { name: "A", plan: "pro", settings: { theme: "dark" } }`. The slash-path `"settings/theme"` writes only that deep leaf; passing `{ settings: { theme: "dark" } }` as a value would replace the whole `settings` object.',
        hintHi: 'Final: `users/u1 = { name: "A", plan: "pro", settings: { theme: "dark" } }`. Slash-path sirf us deep leaf ko likhता hai.',
      },
      {
        task: 'In a comment, explain why a chat app stores messages as `messages/{roomId}/{pushKey}: {...}` rather than `messages/{roomId}: [ ... ]`. Cover ordering, offline appends by two clients, and deleting a message.',
        taskHi: 'Ek comment mein, samjhaओ ki ek chat app messages ko `messages/{roomId}/{pushKey}` ke roop mein kyun store karta hai ek array ke bजaay.',
        hint: 'Push keys sort chronologically (timestamp prefix) so no sort field is needed. Two offline clients get distinct random-suffixed keys → no collision on sync (an array would have both write index N). Deleting a push-key child leaves siblings\' keys intact; deleting array index 0 reindexes everything.',
        hintHi: 'Push keys chronologically sort hoती hain. Do offline clients ko distinct keys milती hain → koi collision nahi. Ek push-key child delete karна siblings ki keys intact chhoड़ता hai.',
      },
      {
        task: 'A dashboard needs only the current user\'s profile. One dev writes `onValue(ref(db, "users"), ...)` and reads `.val()[uid]`. In a comment, explain the cost of this versus `onValue(ref(db, \`users/${uid}\`), ...)` on a database with 200,000 users.',
        taskHi: 'Ek dashboard ko sirf current user ka profile chahiye. Ek dev `onValue(ref(db, "users"), ...)` likhता hai. Ek comment mein, cost samjhaओ.',
        hint: 'Broad: downloads all 200,000 user subtrees on connect, and re-delivers the ENTIRE users tree whenever ANY field of ANY user changes anywhere. Narrow: downloads one small subtree, re-delivers only when THIS user changes. A value listener always carries the whole subtree at its path.',
        hintHi: 'Broad: connect par saare 200,000 user subtrees download karता hai, aur poora users tree re-deliver karता hai jab bhi KISI user ka KOI field badalता hai. Narrow: ek chhoटा subtree.',
      },
    ],

    keyTakeaways: [
      'The WHOLE Realtime Database is ONE JSON tree — no collections, no documents. Every value lives at a PATH (`users/u1/name`) pointing at a leaf (string/number/bool/null) or an object of named children. Arrays are NOT native — a written array is stored as an object with keys `"0"`, `"1"`, ...',
      'WRITES: `set(ref, value)` REPLACES the location + its whole subtree. `update(ref, {k: v, ...})` is a multi-key patch — merges at the top level of the keys passed (use slash keys like `"profile/city"` to reach a deep leaf; a nested OBJECT value still replaces that whole child). `remove(ref)` = `set(ref, null)` (writing `null` deletes). `push(ref)` = new auto-key child.',
      'PUSH KEYS (`-Nx1aB2cD...`) are generated CLIENT-SIDE: timestamp prefix (⇒ sort chronologically = insertion order, no sort field needed) + random bits (⇒ no collision between independent/offline clients, no server round trip) + URL-safe. ALWAYS store a growing list as an object of push keys, NEVER an array (arrays reindex on delete and collide on concurrent append).',
      'LISTENERS: `onValue(ref, cb)` fires NOW with the whole subtree at the path, and AGAIN with the whole subtree on every change anywhere under it. `onChildAdded(ref, cb)` fires once per existing child then once per new child (one snapshot per call) — for incrementally-appended lists like a chat log. Also `onChildChanged`/`onChildRemoved`/`onChildMoved`. `get(ref)` = one-time read. Every listener returns an unsubscribe fn (or `off(ref)`).',
      'READING A PATH RETURNS THE ENTIRE SUBTREE, and a value listener re-delivers that whole subtree on every change under it. So DEPTH/BREADTH IS A PERFORMANCE DECISION: keep the tree SHALLOW and WIDE, split large/unbounded subtrees into separate top-level lists keyed by ID, and attach every listener at the NARROWEST path whose data you actually use.',
    ],
    keyTakeawaysHi: [
      'POORA Realtime Database EK JSON tree hai — koi collections nahi, koi documents nahi. Har value ek PATH par rehती hai jo ek leaf ya named children ke ek object par point karता hai. Arrays native NAHI hain.',
      'WRITES: `set(ref, value)` location + iska poora subtree REPLACE karта hai. `update(ref, {...})` ek multi-key patch hai (deep leaf ke liye `"profile/city"` jaisी slash keys istemal karो). `remove(ref)` = `set(ref, null)`. `push(ref)` = naya auto-key child.',
      'PUSH KEYS CLIENT-SIDE generate hoती hain: timestamp prefix (⇒ chronological sort) + random bits (⇒ koi collision nahi) + URL-safe. Ek growing list HAMESHA push keys ke ek object ke roop mein store karो, KABHI ek array nahi.',
      'LISTENERS: `onValue(ref, cb)` ABHI poore subtree ke saath fire karता hai, aur iske neeche har change par PHIR SE. `onChildAdded(ref, cb)` prati existing child phir prati naya child ek baar fire karता hai. `get(ref)` = one-time read. Har listener ek unsubscribe fn lautaта hai.',
      'EK PATH READ KARNA POORA SUBTREE LAUTATA HAI, aur ek value listener us poore subtree ko har change par re-deliver karता hai. DEPTH/BREADTH EK PERFORMANCE DECISION HAI: tree ko SHALLOW aur WIDE rakhо, aur har listener ko SABSE NARROW path par attach karो.',
    ],
  },

  {
    slug: 'rtdb-querying-and-indexing',
    title: 'Querying the RTDB',
    titleHi: 'RTDB Querying',
    description: 'RTDB queries are deliberately weak: you pick ONE ordering (by a child key, the key itself, or the value), then apply one range or a limit. No compound filters, no multiple sort fields. Queries on a child key need a .indexOn rule or they scan on the client.',
    descriptionHi: 'RTDB queries jानbूjhkar weak hain: aap EK ordering chunते ho (ek child key se, key khud, ya value se), phir ek range ya ek limit apply karते ho. Koi compound filters nahi, koi multiple sort fields nahi. Ek child key par queries ko ek `.indexOn` rule chahiye ya wo client par scan karती hain.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 2,

    analogy: {
      en: '**A filing clerk who will sort a drawer for you by exactly one property — name, or date, or size — and then hand you either the first N folders or the folders between two markers. Ask for "by date AND by department" and the clerk shakes their head: one sort, that is the deal.** And if you ask to sort by a property the drawer was not pre-labelled for, the clerk pulls every folder out and sorts them on the counter in front of you (a client-side scan) — fine for a small drawer, painful for a big one. Pre-labelling the drawer for that property (`.indexOn`) is what makes the clerk sort it in the back room instead.',
      hi: '**Ek filing clerk jo aapke liye ek drawer ko theek ek property se sort karega — naam, ya date, ya size — aur phir aapको ya to pehle N folders ya do markers ke beech ke folders dega. "Date AND department se" maangो aur clerk apna sir hilाता hai: ek sort, yahi deal hai.** Aur agar aap ek property se sort maangते ho jiske liye drawer pre-labelled nahi tha, clerk har folder nikालта hai aur unhe aapke saamne counter par sort karता hai (ek client-side scan). Drawer ko us property ke liye pre-label karना (`.indexOn`) wo hai jo clerk ko ise back room mein sort karवाता hai.',
    },

    simple: `**A QUERY = ONE order-by + optional range/limit, chained on a ref:**

\`\`\`js
import { query, orderByChild, limitToLast, startAt, endAt, equalTo } from "firebase/database";

// last 20 messages (push keys are chronological, so order by key):
query(ref(db, "messages/r1"), orderByKey(), limitToLast(20))

// users on the "pro" plan, ordered by that child:
query(ref(db, "users"), orderByChild("plan"), equalTo("pro"))

// scores between 100 and 500:
query(ref(db, "scores"), orderByChild("points"), startAt(100), endAt(500))
\`\`\`

**PICK EXACTLY ONE ORDERING:**
\`\`\`
orderByKey()          -- by each child's key
orderByChild("path")  -- by a nested value under each child
orderByValue()        -- by each child's own leaf value
\`\`\`
Then ONE filter: \`equalTo(x)\` | \`startAt(x)\` [+ \`endAt(y)\`] | \`limitToFirst(n)\` | \`limitToLast(n)\`.

**NO compound queries.** Can't do "plan == pro AND age > 30". Pick the most selective
one for the query; filter the rest on the client, or denormalize a combined key.

**\`.indexOn\` -- without it, an \`orderByChild("plan")\` query DOWNLOADS the whole location
and sorts on the client** (+ a console warning). Declare it in the security rules:

\`\`\`json
{ "rules": { "users": { ".indexOn": ["plan", "age"] } } }
\`\`\`

**SHALLOW REST:** \`GET /users.json?shallow=true\` returns just the keys (\`{ "u1": true, ... }\`),
not the whole tree -- the one way to list keys without downloading everything.`,

    simpleHi: `**EK QUERY = EK order-by + optional range/limit, ek ref par chained:**

\`\`\`js
// last 20 messages (push keys chronological hain, to key se order karो):
query(ref(db, "messages/r1"), orderByKey(), limitToLast(20))

// "pro" plan waale users, us child se ordered:
query(ref(db, "users"), orderByChild("plan"), equalTo("pro"))

// 100 aur 500 ke beech scores:
query(ref(db, "scores"), orderByChild("points"), startAt(100), endAt(500))
\`\`\`

**THEEK EK ORDERING CHUNO:**
\`\`\`
orderByKey()          -- har child ki key se
orderByChild("path")  -- har child ke under ek nested value se
orderByValue()        -- har child ki apni leaf value se
\`\`\`
Phir EK filter: \`equalTo(x)\` | \`startAt(x)\` [+ \`endAt(y)\`] | \`limitToFirst(n)\` | \`limitToLast(n)\`.

**KOI compound queries nahi.** "plan == pro AND age > 30" nahi kar sakते. Sabse selective ek chunो; baaki client par filter karो.

**\`.indexOn\` -- iske bina, ek \`orderByChild("plan")\` query poori location DOWNLOAD karती hai aur client par sort karती hai** (+ ek console warning). Ise security rules mein declare karो:

\`\`\`json
{ "rules": { "users": { ".indexOn": ["plan", "age"] } } }
\`\`\`

**SHALLOW REST:** \`GET /users.json?shallow=true\` sirf keys lautaता hai, poora tree nahi.`,

    content: `## The query shape

An RTDB query is a reference plus **exactly one order-by** and then **at most one** filtering constraint. You build it with \`query(ref, ...constraints)\`.

**The order-by (choose one):**

- **\`orderByKey()\`** — order children by their key. For a list of push keys, this is chronological order.
- **\`orderByChild("somePath")\`** — order children by the value found at \`somePath\` within each child (can be a nested path like \`"address/pincode"\`).
- **\`orderByValue()\`** — order children by their own value, for when each child is a leaf (e.g. \`scores/{uid}: 4200\`).

**Then one filter:**

- **\`equalTo(value)\`** — children whose ordered value equals \`value\`.
- **\`startAt(value)\`** / **\`endAt(value)\`** — a range on the ordered value; use one or both.
- **\`limitToFirst(n)\`** / **\`limitToLast(n)\`** — the first or last \`n\` children in the ordering.

Range and limit can combine (\`startAt(x)\` + \`limitToFirst(10)\`), but you cannot use two order-bys and you cannot apply filters to two different children.

## No compound queries

The RTDB has nothing like Firestore's composite indexes or MongoDB's multi-field indexes. "Users where \`plan == 'pro'\` **and** \`age > 30\`" cannot be expressed. The options:

- **Query on the most selective field, filter the rest on the client.** Query \`orderByChild("plan"), equalTo("pro")\`, then discard the ones with \`age <= 30\` in your code. Fine when the first filter cuts the set down enough.
- **Denormalize a composite key.** Write a field like \`plan_active: "pro_true"\` and query \`equalTo("pro_true")\`. You are manually building the compound index as a string.
- **Restructure the tree.** Keep \`proUsers/{uid}\` as a separate list so "pro users" is just a location, not a query.

## \`.indexOn\`

By default the RTDB can order by key efficiently, but **\`orderByChild\` and \`orderByValue\` on a location with no matching index are executed by downloading every child to the client and sorting there**, and the server logs a warning: \`"Using an unspecified index. Consider adding '.indexOn'..."\`.

You fix this by declaring the index **in the security rules**, which is also where RTDB indexes live:

\`\`\`json
{
  "rules": {
    "users": {
      ".indexOn": ["plan", "age", "address/pincode"]
    }
  }
}
\`\`\`

With the index, the server orders and filters before sending, so the client receives only the matching children. An unindexed query on a large location is one of the most common RTDB performance problems.

## Shallow reads

A normal read of a location returns the whole subtree. The REST API offers **\`?shallow=true\`**, which returns only the immediate child keys with the value \`true\`:

\`\`\`
GET https://<db>.firebaseio.com/users.json?shallow=true
-> { "u1": true, "u2": true, "u3": true }
\`\`\`

This is the only built-in way to enumerate the keys under a location without downloading everything beneath them. It is REST-only — the SDKs do not expose it — and is used by admin scripts and migration tools that need to iterate keys.

## Queries and security rules interact

A query only succeeds if the rule at the queried location grants \`.read\` for the **whole location** — RTDB rules, like Firestore's, are not per-child filters. If \`messages/r1\` is readable, \`query(ref(db, "messages/r1"), limitToLast(20))\` works; you cannot use a query to read a slice of a location you are not allowed to read entirely. (RTDB does have a \`query\`-aware rules feature, but the base model is location-level read permission.)`,

    contentHi: `## Query shape

Ek RTDB query ek reference plus **theek ek order-by** aur phir **zyada se zyada ek** filtering constraint hai.

**Order-by (ek chunो):**
- **\`orderByKey()\`** — children ko unki key se order karो. Push keys ke liye ye chronological order hai.
- **\`orderByChild("somePath")\`** — children ko har child ke andar \`somePath\` par mili value se order karो.
- **\`orderByValue()\`** — children ko unki apni value se order karो.

**Phir ek filter:**
- **\`equalTo(value)\`**
- **\`startAt(value)\`** / **\`endAt(value)\`** — ordered value par ek range.
- **\`limitToFirst(n)\`** / **\`limitToLast(n)\`**.

## Koi compound queries nahi

RTDB mein Firestore ke composite indexes jaisा кुछ nahi. "Users jahaan \`plan == 'pro'\` **aur** \`age > 30\`" express nahi kiya ja sakta. Options:
- **Sabse selective field par query karो, baaki client par filter karो.**
- **Ek composite key denormalize karो.** \`plan_active: "pro_true"\` jaisा field.
- **Tree restructure karो.** \`proUsers/{uid}\` ek alag list ke roop mein.

## \`.indexOn\`

Default se RTDB key se efficiently order kar sakta hai, par **\`orderByChild\` aur \`orderByValue\` ek matching index ke bina har child ko client par download karके aur wahaan sort karके execute hoती hain**, aur server ek warning log karता hai.

Aap ise **security rules mein** index declare karके fix karते ho:

\`\`\`json
{ "rules": { "users": { ".indexOn": ["plan", "age"] } } }
\`\`\`

## Shallow reads

REST API **\`?shallow=true\`** offer karता hai, jo sirf immediate child keys \`true\` value ke saath lautaता hai. Ek location ke under keys enumerate karने ka ye ekmatra built-in tarika hai bina sab кुछ download kiye.

## Queries aur security rules interact karते hain

Ek query sirf tab succeed hoती hai agar queried location par rule **poori location** ke liye \`.read\` grant karता hai — RTDB rules per-child filters nahi hain.`,

    examples: [
      {
        title: 'One order-by plus a range: scores between 100 and 500',
        titleHi: 'Ek order-by plus ek range: 100 aur 500 ke beech scores',
        code: `import { getDatabase, ref, query, orderByChild, startAt, endAt, get } from "firebase/database";
const db = getDatabase();

// scores: { s1:{points:80}, s2:{points:250}, s3:{points:420}, s4:{points:900} }
const q = query(ref(db, "scores"), orderByChild("points"), startAt(100), endAt(500));
const snap = await get(q);

const out = [];
snap.forEach((child) => out.push([child.key, child.val().points]));
console.log(out);`,
        output: `[ [ 's2', 250 ], [ 's3', 420 ] ]`,
        explain: 'The query is one order-by (`orderByChild("points")`) plus a range (`startAt(100)`, `endAt(500)`). The server returns only children whose `points` fall in [100, 500] — s2 (250) and s3 (420). s1 (80) is below the range and s4 (900) above, so both are excluded. `snap.forEach` iterates the matched children in `points` order.',
        explainHi: 'Query ek order-by (`orderByChild("points")`) plus ek range (`startAt(100)`, `endAt(500)`) hai. Server sirf wo children lautaता hai jinke `points` [100, 500] mein aate hain — s2 (250) aur s3 (420). s1 (80) range ke neeche aur s4 (900) ऊpar, to dono excluded. `snap.forEach` matched children ko `points` order mein iterate karता hai.',
      },
      {
        title: 'limitToLast on push keys gives the most recent N in chronological order',
        titleHi: 'push keys par limitToLast chronological order mein sabse recent N deta hai',
        code: `import { getDatabase, ref, query, orderByKey, limitToLast, onChildAdded } from "firebase/database";
const db = getDatabase();

// messages/r1 has 500 push-keyed messages
const recent = query(ref(db, "messages/r1"), orderByKey(), limitToLast(3));
onChildAdded(recent, (snap) => console.log(snap.val().text));`,
        output: `message 498
message 499
message 500`,
        explain: 'Push keys sort chronologically, so `orderByKey()` on the messages list IS time order, and `limitToLast(3)` takes the three highest keys — the three most recent messages (498, 499, 500). `orderByKey()` is always server-indexed, so no `.indexOn` rule is needed. `onChildAdded` on the limited query delivers those three one at a time, then each new message as it arrives.',
        explainHi: 'Push keys chronologically sort hoती hain, to messages list par `orderByKey()` time order HAI, aur `limitToLast(3)` teen highest keys leta hai — teen sabse recent messages (498, 499, 500). `orderByKey()` hamesha server-indexed hai, to koi `.indexOn` rule nahi chahiye. Limited query par `onChildAdded` un teenों ko ek-ek karके deता hai, phir har naya message jaise ye aata hai.',
      },
      {
        title: 'No compound queries: query the selective field, filter the rest client-side',
        titleHi: 'Koi compound queries nahi: selective field query karo, baaki client-side filter karo',
        code: `import { getDatabase, ref, query, orderByChild, equalTo, get } from "firebase/database";
const db = getDatabase();

// want: plan == "pro" AND age > 30  — RTDB can't do both.
// query the more selective one on the server:
const q = query(ref(db, "users"), orderByChild("plan"), equalTo("pro"));
const snap = await get(q);

const result = [];
snap.forEach((c) => { if (c.val().age > 30) result.push(c.val().name); });
console.log(result);`,
        output: `[ 'Ravi', 'Sunita' ]`,
        explain: 'RTDB allows one filter per query, so `plan == "pro" AND age > 30` cannot be expressed. The pattern: run the more selective filter on the server (`orderByChild("plan"), equalTo("pro")`) so only pro users are transferred, then apply `age > 30` in client code over that smaller set. Result: the pro users older than 30 — `[\'Ravi\', \'Sunita\']`.',
        explainHi: 'RTDB prati query ek filter allow karता hai, to `plan == "pro" AND age > 30` express nahi kiya ja sakta. Pattern: zyada selective filter server par chalाओ (`orderByChild("plan"), equalTo("pro")`) taaki sirf pro users transfer hon, phir us chhoटे set par client code mein `age > 30` apply karो. Result: 30 se zyada umar ke pro users — `[\'Ravi\', \'Sunita\']`.',
      },
    ],

    mistakes: [
      {
        wrong: `// an orderByChild query with no matching .indexOn
const q = query(ref(db, "users"), orderByChild("email"), equalTo("ravi@x.com"));
const snap = await get(q);
// works, but: the server sends EVERY user to the client, which then sorts and
// filters locally. Console: "FIREBASE WARNING: Using an unspecified index.
// Consider adding '.indexOn': 'email' at /users to your security rules"`,
        right: `// declare the index in the security rules:
// {
//   "rules": {
//     "users": { ".indexOn": ["email", "plan"] }
//   }
// }
// now the SAME query is executed server-side: only the matching child is sent.`,
        why: 'When a query orders by a child key or by value at a location that has no index declared for that key, the Realtime Database cannot filter or sort on the server, so it transfers every child at the location to the client and performs the ordering and filtering there. For a small location this is merely wasteful; for a large one it means downloading the entire collection on every such query, and the server emits a warning naming the exact index to add. Declaring the index is done in the security rules with an indexOn entry listing the child keys that queries will order by at that location. Once the index exists, the server maintains it and can evaluate the query before sending, returning only the matching children. Because the warning is only a console message and the query still returns correct results, an unindexed query often ships unnoticed and becomes a performance problem as the data grows.',
        whyHi: 'Jab ek query ek child key ya value se ek location par order karती hai jiske paas us key ke liye koi index declared nahi, Realtime Database server par filter ya sort nahi kar sakta, to ye us location par har child ko client tak transfer karता hai aur ordering aur filtering wahaan karता hai. Ek large location ke liye iska matlab har aisी query par poori collection download karна hai. Index declare karना security rules mein ek `indexOn` entry ke saath kiya jाता hai.',
      },
      {
        wrong: `// chaining two order-bys, expecting a compound sort
const q = query(
  ref(db, "posts"),
  orderByChild("category"),
  orderByChild("createdAt"),   // ERROR: "Cannot use multiple orderBy calls"
);`,
        right: `// one order-by only. To get "newest post per category", either:
// 1. keep posts nested by category:  postsByCategory/{category}/{pushKey}
//    then query one category's list orderByKey() limitToLast(1)
// 2. or denormalize a sortable composite child: "category_createdAt": "tech_1725700000000"
//    and orderByChild("category_createdAt") with a startAt/endAt range per category`,
        why: 'A Realtime Database query supports exactly one ordering. It cannot sort by one child and then break ties by another, and calling more than one orderBy on the same query is an error. This is a deliberate limit of a model that has no server-side index combining multiple fields. Achieving an effect that needs two sort dimensions requires encoding it into the tree structure or into a single sortable value. Nesting the data under the first dimension, so that each first-dimension value has its own list ordered by the second, turns the compound sort into a single-dimension query within a chosen branch. Alternatively, concatenating the two values into one string child, ordered so that lexical order matches the desired compound order, lets a single orderByChild with a range reproduce the query. Both approaches are the developer manually building what a compound index would provide.',
        whyHi: 'Ek Realtime Database query theek ek ordering support karता hai. Ye ek child se sort karके phir doosरे se ties break nahi kar sakta, aur ek hi query par ek se zyada `orderBy` call karना ek error hai. Ek effect jise do sort dimensions chahiye, ise tree structure mein ya ek single sortable value mein encode karना require karता hai. Data ko pehle dimension ke under nest karना compound sort ko ek chosen branch ke andar ek single-dimension query mein badal deता hai.',
      },
      {
        wrong: `// listing all user IDs by reading the whole /users node
const snap = await get(ref(db, "users"));
const ids = Object.keys(snap.val());   // -- downloaded every user's ENTIRE
                                        //    profile just to get the key list`,
        right: `// REST shallow read returns only the keys:
// GET https://<db>.firebaseio.com/users.json?shallow=true
// -> { "u1": true, "u2": true, ... }
// (SDKs don't expose this — it's for admin/migration scripts. In app code,
//  maintain a purpose-built index list like userIndex/{uid}: true instead.)`,
        why: 'A standard read of a location in the Realtime Database returns the entire subtree beneath it, so reading a parent node solely to obtain the list of child keys downloads all of every child\'s data as a side effect, which for a large collection is a large and entirely wasted transfer. The REST API\'s shallow parameter addresses exactly this by returning only the immediate child keys, each mapped to true, without descending into them, and it is the only built-in mechanism for enumerating keys without fetching their contents. It is available only over REST, not through the client SDKs, so it suits administrative and migration tooling. Within application code, the equivalent need is met by maintaining a dedicated index list, a node whose children are just the keys of interest mapped to a small value, updated alongside the main data, so the app can read that small node to know what exists.',
        whyHi: 'Realtime Database mein ek location ka ek standard read iske neeche poora subtree lautaता hai, to sirf child keys ki list paने ke liye ek parent node read karना side effect ke roop mein har child ka saara data download karता hai. REST API ka `shallow` parameter theek ise address karता hai sirf immediate child keys lautaकर, har ek `true` par mapped. Ye sirf REST par available hai. Application code mein, ek dedicated index list maintain karके ye zaroorat poori ki jाती hai.',
      },
    ],

    realWorld: [
      {
        en: '**A chat that queries `query(ref(db, \`messages/\${roomId}\`), orderByKey(), limitToLast(50))`** — the 50 most recent messages, in order, with no timestamp index because push keys already sort chronologically.',
        hi: '**Ek chat jo `query(ref(db, ..), orderByKey(), limitToLast(50))` query karता hai** — 50 sabse recent messages, order mein, bina timestamp index ke.',
      },
      {
        en: '**A leaderboard as `scores/{uid}: <points>` queried with `orderByValue(), limitToLast(10)`** — the top 10, with `.indexOn` not even needed because ordering is by the child\'s own value.',
        hi: '**Ek leaderboard `scores/{uid}: <points>` ke roop mein `orderByValue(), limitToLast(10)` se queried** — top 10.',
      },
      {
        en: '**A `.indexOn: ["status", "assignedTo"]` on a `tickets` node**, with each screen querying one of those keys and filtering the other in the client — the standard RTDB workaround for the absent compound query.',
        hi: '**Ek `tickets` node par `.indexOn: ["status", "assignedTo"]`**, har screen un keys mein se ek query karता hai aur doosरे ko client mein filter karता hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What are the limits of RTDB queries compared to Firestore or SQL, and how do you work around them?',
        qHi: 'Firestore ya SQL ke muqable RTDB queries ki limits kya hain, aur aap unke around kaise kaam karते ho?',
        a: 'A Realtime Database query consists of a reference, exactly one ordering, and at most one filtering constraint. The ordering is by child key, by a named child value, or by the child\'s own value, and the filter is an equality, a range using start and end bounds, or a first-n or last-n limit. There is no way to order by more than one field, and no way to filter on two different children in the same query, so anything resembling a compound query is impossible directly. The standard workarounds are to run the query on the single most selective field and apply the remaining conditions in client code after the result arrives, to denormalize a composite value into one child formatted so that ordering it reproduces the compound filter, or to restructure the tree so that the second dimension becomes a path rather than a query, for instance nesting records under a category so that each category is its own queryable list. Additionally, ordering by a child value requires an index declared with indexOn in the security rules at that location; without it the server sends every child to the client to be sorted locally, which is fine for small locations and a serious problem for large ones.',
        aHi: 'Ek Realtime Database query ek reference, theek ek ordering, aur zyada se zyada ek filtering constraint se banती hai. Ordering child key se, ek named child value se, ya child ki apni value se hai, aur filter ek equality, ek range, ya ek first-n/last-n limit hai. Ek se zyada field se order karने ka koi tarika nahi, aur ek hi query mein do different children par filter karने ka koi tarika nahi. Standard workarounds hain sabse selective field par query chalाना aur baaki conditions client code mein apply karना, ek composite value ko ek child mein denormalize karना, ya tree restructure karना. Iske alawa, ek child value se ordering ko security rules mein `indexOn` se declared ek index chahiye.',
      },
      {
        q: 'Why do push keys make orderByKey() a chronological sort, and why not store lists as arrays?',
        qHi: 'Push keys `orderByKey()` ko ek chronological sort kyun banाती hain, aur lists ko arrays ke roop mein kyun na store karें?',
        a: 'A push key begins with an encoding of the timestamp at which it was generated, followed by random bits. Because the timestamp is the high-order part of the key and the keys are compared lexically, a key created later always sorts after one created earlier, so ordering a list of push-keyed children by key produces insertion order without needing a separate timestamp field to sort on. Storing a list as an array is avoided because the Realtime Database has no array type and represents an array as an object keyed by stringified indices, which creates two problems: inserting an item means computing the next index, and two clients inserting concurrently, especially after being offline, both compute the same index so one write overwrites the other on synchronization; and removing an item from the middle requires renumbering every later item, rewriting much of the list and invalidating any stored index references. Push keys avoid both: the random component makes independent clients generate distinct keys with no coordination, and each item\'s key is stable so deleting one leaves the others untouched.',
        aHi: 'Ek push key us timestamp ki encoding se shuru hoती hai jispar ise generate kiya gaya, phir random bits. Kyunki timestamp key ka high-order hissa hai aur keys lexically compare hoती hain, baad mein banी ek key hamesha pehle banी ek ke baad sort hoती hai, to push-keyed children ki ek list ko key se order karना insertion order produce karता hai bina ek alag timestamp field ke. Ek list ko ek array ke roop mein store karना avoid kiya jाता hai kyunki RTDB mein koi array type nahi hai aur do clients concurrent insert karते hue wahi index compute karेंge. Push keys dono avoid karती hain.',
      },
    ],

    exercises: [
      {
        task: 'Write the RTDB query for "the 20 most recent messages in room r1", given messages are stored at `messages/r1/{pushKey}`. In a comment, explain why no `.indexOn` and no timestamp field are needed.',
        taskHi: '"Room r1 mein 20 sabse recent messages" ke liye RTDB query likho, given messages `messages/r1/{pushKey}` par store hain.',
        hint: '`query(ref(db, "messages/r1"), orderByKey(), limitToLast(20))`. Push keys embed a timestamp prefix and sort lexically, so `orderByKey()` IS chronological order; `orderByKey()` is always server-indexed, so no `.indexOn` needed.',
        hintHi: '`query(ref(db, "messages/r1"), orderByKey(), limitToLast(20))`. Push keys ek timestamp prefix embed karती hain.',
      },
      {
        task: 'You need `tickets` where `status == "open"` AND `priority >= 3`. In a comment, give three ways to handle this in the RTDB and the trade-off of each.',
        taskHi: 'Aapको `tickets` chahiye jahaan `status == "open"` AUR `priority >= 3`. Ek comment mein, RTDB mein ise handle karने ke teen tarike do.',
        hint: '(1) Query `orderByChild("status") equalTo("open")` + `.indexOn: ["status"]`, filter `priority` client-side — simple, but downloads all open tickets. (2) Denormalized child `"status_priority": "open_3"` + range query — one string index does it, but you maintain the combined field. (3) Nest as `ticketsByStatus/open/{id}` — "open tickets" is a path, but every status change is a move-write.',
        hintHi: '(1) `orderByChild("status") equalTo("open")` + client-side `priority` filter. (2) Denormalized `"status_priority"` child. (3) `ticketsByStatus/open/{id}` ke roop mein nest karो.',
      },
      {
        task: 'In a comment, explain what happens (result AND cost AND console output) when you run `query(ref(db, "users"), orderByChild("lastName"))` on a 100k-user database with no `.indexOn` for `lastName`, and how to fix it.',
        taskHi: 'Ek comment mein, samjhaओ ki kya hota hai jab aap `query(ref(db, "users"), orderByChild("lastName"))` chalाते ho ek 100k-user database par bina `lastName` ke liye `.indexOn`.',
        hint: 'Result is correct, but the server sends all 100k user subtrees to the client, which sorts locally — huge transfer. Console: `FIREBASE WARNING: Using an unspecified index. Consider adding ".indexOn": "lastName" at /users`. Fix: add `"users": { ".indexOn": ["lastName"] }` to the security rules → server sorts/filters before sending.',
        hintHi: 'Result sahi hai, par server saare 100k user subtrees client ko bhejता hai. Console warning. Fix: security rules mein `".indexOn": ["lastName"]` add karो.',
      },
    ],

    keyTakeaways: [
      'A query = a ref + EXACTLY ONE order-by + AT MOST ONE filter. Order-by: `orderByKey()` (child keys — chronological for push keys, always server-indexed), `orderByChild("path")` (a nested value, path may be deep), `orderByValue()` (the child\'s own leaf value). Filter: `equalTo(x)` | `startAt(x)`/`endAt(y)` range | `limitToFirst(n)`/`limitToLast(n)`. Range+limit can combine.',
      'NO COMPOUND QUERIES — can\'t order by two fields, can\'t filter two different children. Workarounds: (1) query the most selective field server-side, filter the rest in client code; (2) denormalize a composite string child (`"plan_active": "pro_true"`) and `equalTo`/range it — you\'re hand-building the compound index; (3) restructure the tree so the second dimension is a PATH (`proUsers/{uid}`) not a query.',
      '`orderByChild`/`orderByValue` on a location with NO matching `.indexOn` → the server sends EVERY child to the client, which sorts/filters locally (+ a `FIREBASE WARNING: Using an unspecified index` console message). Correct results, but a full download every time — a top RTDB perf bug. FIX: declare `".indexOn": ["field", ...]` in the SECURITY RULES at that location (that\'s where RTDB indexes live).',
      'PUSH KEYS sort chronologically (timestamp prefix, compared lexically), so `orderByKey()` on a push-keyed list IS insertion order — no timestamp field needed for "most recent N".',
      'SHALLOW READ (`GET /path.json?shallow=true`, REST-only) returns just immediate child keys mapped to `true` — the ONLY built-in way to enumerate keys without downloading their subtrees (for admin/migration scripts; in app code maintain a purpose-built index list). A query needs `.read` on the WHOLE queried location — RTDB rules are not per-child filters.',
    ],
    keyTakeawaysHi: [
      'Ek query = ek ref + THEEK EK order-by + ZYADA SE ZYADA EK filter. Order-by: `orderByKey()` (push keys ke liye chronological, hamesha server-indexed), `orderByChild("path")`, `orderByValue()`. Filter: `equalTo(x)` | `startAt`/`endAt` range | `limitToFirst`/`limitToLast`.',
      'KOI COMPOUND QUERIES NAHI. Workarounds: (1) sabse selective field server-side query karो, baaki client mein filter karो; (2) ek composite string child denormalize karो; (3) tree restructure karो taaki doosरा dimension ek PATH ho.',
      '`orderByChild`/`orderByValue` bina matching `.indexOn` ke → server HAR child client ko bhejता hai, jo locally sort/filter karता hai (+ ek console warning). Sahi results, par har baar ek full download. FIX: us location par SECURITY RULES mein `".indexOn": [...]` declare karो.',
      'PUSH KEYS chronologically sort hoती hain, to ek push-keyed list par `orderByKey()` insertion order HAI — "sabse recent N" ke liye koi timestamp field nahi chahiye.',
      'SHALLOW READ (`?shallow=true`, sirf REST) sirf immediate child keys lautaता hai `true` par mapped — keys enumerate karने ka EKMATRA built-in tarika bina unke subtrees download kiye. Ek query ko POORI queried location par `.read` chahiye.',
    ],
  },

  {
    slug: 'rtdb-vs-cloud-firestore',
    title: 'RTDB vs Cloud Firestore',
    titleHi: 'RTDB vs Cloud Firestore',
    description: 'Both are Firebase, both are real-time, both have offline support and security rules. But Firestore has richer queries, scales further, and bills per operation; the RTDB has lower latency for small frequent writes, simpler pricing at low volume, and true presence support. Most new projects should default to Firestore.',
    descriptionHi: 'Dono Firebase hain, dono real-time hain, dono ke paas offline support aur security rules hain. Par Firestore ke paas richer queries hain, aage tak scale karता hai, aur prati operation bill karता hai; RTDB ki small frequent writes ke liye lower latency hai, low volume par simpler pricing, aur true presence support. Zyaादातर naye projects ko Firestore default karना chahiye.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: '**The RTDB is a shared whiteboard in one room — instant to scribble on, everyone watching sees changes the moment the marker moves, but the whole thing has to fit on one wall and you can only sort the sticky notes one way.** Firestore is a filing system across a whole building — you can ask real questions ("all invoices over $500 from March, sorted by client"), it grows to fill as many floors as you need, and it tells you your usage per drawer opened. The whiteboard wins for a frantic game of pictionary (many tiny updates, lowest possible lag, who is in the room right now). The filing system wins for almost everything a real application accumulates over years.',
      hi: '**RTDB ek room mein ek shared whiteboard hai — scribble karने ke liye instant, sab dekhने waale changes dekhते hain jis moment marker move karता hai, par poori cheez ek wall par fit honी chahiye aur aap sticky notes ko sirf ek tarah sort kar sakते ho.** Firestore ek poore building ke across ek filing system hai — aap real sawаl poochे sakते ho, ye jitni floors chahiye utni tak badhता hai, aur ye aapको prati drawer khोla gaya aapка usage bataता hai. Whiteboard ek frantic pictionary game ke liye jeetता hai. Filing system lगभग har cheez ke liye jeetता hai jo ek real application saalon mein accumulate karता hai.',
    },

    simple: `**BOTH:** Firebase, real-time listeners, offline support, security rules, client + admin SDK,
tight Firebase Auth integration.

**RTDB                              | FIRESTORE**
\`\`\`
one JSON tree, one region           | collections/documents, multi-region, global
query: 1 sort key, 1 filter         | compound queries, composite indexes, IN/array-contains
sorts client-side w/o .indexOn      | every query index-backed or rejected
scales to ~200k concurrent / ~1k    | scales far higher, automatically sharded
  writes-per-sec per database        |
priced by GB stored + GB downloaded | priced per document read / write / delete
  (whole-subtree reads cost you)     |   (+ storage + egress)
lowest write latency (~10s of ms)   | low, slightly higher than RTDB
native onDisconnect() -> presence   | no true onDisconnect (needs RTDB or Cloud fn)
data export is one big JSON dump     | managed export, BigQuery streaming
\`\`\`

**PICK RTDB WHEN:** presence / "who's online", very high-frequency tiny writes (cursors,
game state, live telemetry), the data is naturally one small tree, latency is everything.

**PICK FIRESTORE WHEN:** you need real queries, the data will grow large, you want
multi-region, you're starting fresh and unsure -- it's the default.

**Using BOTH in one app is normal:** Firestore for the domain data, RTDB for a presence
system and ephemeral real-time signals.`,

    simpleHi: `**DONO:** Firebase, real-time listeners, offline support, security rules, client + admin SDK,
Firebase Auth integration.

**RTDB                              | FIRESTORE**
\`\`\`
ek JSON tree, ek region             | collections/documents, multi-region
query: 1 sort key, 1 filter         | compound queries, composite indexes
.indexOn ke bina client-side sort   | har query index-backed ya rejected
~200k concurrent / ~1k writes/sec   | bahut ऊpar tak scale, auto-sharded
GB stored + GB downloaded se priced | prati document read/write/delete se priced
sabse kam write latency             | kam, RTDB se thoड़ा zyada
native onDisconnect() -> presence   | koi true onDisconnect nahi
\`\`\`

**RTDB CHUNO JAB:** presence / "kaun online hai", bahut high-frequency chhote writes
(cursors, game state), data naturally ek chhoटा tree hai, latency sab кुछ hai.

**FIRESTORE CHUNO JAB:** aapको real queries chahiye, data large hoga, multi-region chahiye,
aap fresh shuru kar rahे ho -- ye default hai.

**Ek app mein DONO istemal karना normal hai:** Firestore domain data ke liye, RTDB ek presence system ke liye.`,

    content: `## What they share

Cloud Firestore and the Realtime Database are both Firebase databases and have a lot in common: real-time listeners that push changes to clients, offline persistence with local caching and write queuing, a security-rules layer that lets untrusted clients connect directly, both a client SDK and an admin SDK, and native integration with Firebase Authentication. If you know one, the shape of the other is familiar.

## Where they differ

**Data model.** The RTDB is one JSON tree. Firestore has collections, documents, and subcollections. Firestore's model maps more naturally onto typical application entities and keeps reads scoped to a document rather than a subtree.

**Queries.** This is the biggest practical difference. The RTDB allows one sort key and one filter per query, with no compound queries. Firestore supports filtering and ordering across multiple fields via composite indexes, plus \`in\`, \`array-contains\`, \`array-contains-any\`, and \`or()\`. Applications with real query needs hit the RTDB's ceiling quickly.

**Indexing.** RTDB queries on a child value silently fall back to a full client-side sort without an \`.indexOn\` rule. Firestore refuses a query that has no index and tells you exactly which composite index to create — you cannot accidentally ship an unindexed scan.

**Scale.** A single RTDB instance has practical ceilings around 200,000 simultaneous connections and roughly 1,000 writes per second; past that you shard across multiple database instances manually. Firestore scales far higher automatically with no manual sharding.

**Pricing.** The RTDB bills for data stored and data downloaded, measured in gigabytes — and because a read returns a whole subtree, a careless tree shape makes downloads expensive. Firestore bills per document read, write, and delete (plus storage and egress), so cost tracks operation counts. At very low volume the RTDB's model can be cheaper; as an app grows, Firestore's per-operation model is usually more predictable and its query efficiency keeps reads down.

**Latency.** The RTDB has the lower write-propagation latency — often tens of milliseconds — which is why it is preferred for the most latency-sensitive real-time features. Firestore is fast but slightly behind.

**Presence.** The RTDB has a native \`onDisconnect()\` primitive: you register a write (e.g. set \`status: "offline"\`) that the server executes when the client's connection drops, even ungracefully. Firestore has no equivalent, so Firestore apps that need presence typically use the RTDB just for that, or a Cloud Function on a scheduled/triggered basis.

**Regions and export.** Firestore offers multi-region replication and a managed export plus first-class BigQuery streaming. The RTDB is single-region per instance and exports as one large JSON file.

## Which to choose

For most new projects, **Firestore is the default**: better queries, better scaling, safer indexing, cleaner pricing as you grow, multi-region. Reach for the **RTDB** when a specific feature plays to its strengths:

- **Presence** — "who is online", "who is typing", live connection state. \`onDisconnect()\` has no Firestore equivalent.
- **Very high-frequency tiny writes** — collaborative cursors, live game state, sensor telemetry, where write latency and cost-per-write dominate.
- **Naturally small, tree-shaped data** with simple access — a config blob, a small shared state.

Using both in one app is a common and supported pattern: Firestore holds the durable domain data, the RTDB handles presence and ephemeral real-time signalling.

## The honest summary

The RTDB is the older product with a simpler model and a few things it still does best. Firestore is the one Firebase positions as the primary database and the one that will not run out of room as an application's query and scale needs grow. Start with Firestore; add the RTDB when you have a concrete reason.`,

    contentHi: `## Wo kya share karте hain

Cloud Firestore aur Realtime Database dono Firebase databases hain aur bahut кुछ common hai: real-time listeners, offline persistence, ek security-rules layer, ek client SDK aur ek admin SDK, aur Firebase Authentication ke saath native integration.

## Wo kahaan alag hain

**Data model.** RTDB ek JSON tree hai. Firestore ke paas collections, documents, aur subcollections hain.

**Queries.** Ye sabse baड़ा practical antar hai. RTDB prati query ek sort key aur ek filter allow karता hai, koi compound queries nahi. Firestore composite indexes ke through multiple fields ke across filtering aur ordering support karता hai.

**Indexing.** RTDB queries ek child value par ek \`.indexOn\` rule ke bina silently ek full client-side sort par fall back karती hain. Firestore ek query refuse karता hai jiske paas koi index nahi.

**Scale.** Ek single RTDB instance ki practical ceilings lगभग 200,000 simultaneous connections aur roughly 1,000 writes per second hain. Firestore bahut ऊpar tak automatically scale karता hai.

**Pricing.** RTDB stored data aur downloaded data ke liye bill karता hai, gigabytes mein. Firestore prati document read, write, aur delete bill karता hai.

**Latency.** RTDB ki lower write-propagation latency hai — aksar tens of milliseconds.

**Presence.** RTDB ke paas ek native \`onDisconnect()\` primitive hai. Firestore ke paas koi equivalent nahi.

**Regions aur export.** Firestore multi-region replication offer karता hai. RTDB per instance single-region hai.

## Kaunसा chunें

Zyaादातर naye projects ke liye, **Firestore default hai**. **RTDB** ke liye reach karें jab ek specific feature iski strengths ko play karता hai:
- **Presence** — "kaun online hai".
- **Bahut high-frequency chhote writes** — collaborative cursors, live game state.
- **Naturally chhoटा, tree-shaped data**.

Ek app mein dono istemal karना ek common pattern hai.

## Honest summary

RTDB ek simpler model ke saath purana product hai. Firestore wo hai jise Firebase primary database ke roop mein position karता hai. Firestore se shuru karो; ek concrete reason hone par RTDB add karो.`,

    examples: [
      {
        title: 'The same "recent items" feature: RTDB vs Firestore',
        titleHi: 'Wahi "recent items" feature: RTDB vs Firestore',
        code: `// RTDB — push keys sort chronologically, one order-by, no index needed:
query(ref(db, "posts"), orderByKey(), limitToLast(10));

// Firestore — explicit order field, and a single-field index (auto-created):
query(collection(fs, "posts"), orderBy("createdAt", "desc"), limit(10));

// Both stream updates live. The difference shows up on the NEXT requirement:
// "...also filtered to category == 'tech' and authorId in my follow list"
//   Firestore: add a composite index, one query.
//   RTDB: restructure the tree or filter client-side.`,
        output: `(no runtime output - this contrasts the two query models)`,
        explain: 'Both databases stream a "recent 10" list live. The RTDB uses push-key ordering (no index, no sort field); Firestore uses an explicit `orderBy("createdAt")` backed by an auto single-field index. The models only diverge on the NEXT requirement — adding `category == "tech"` and `authorId in <follow list>`: Firestore adds a composite index and keeps one query; the RTDB has no compound query, so you restructure the tree or filter on the client.',
        explainHi: 'Dono databases ek "recent 10" list live stream karते hain. RTDB push-key ordering istemal karता hai (koi index nahi, koi sort field nahi); Firestore ek explicit `orderBy("createdAt")` istemal karता hai jo ek auto single-field index se backed hai. Models sirf AGLI requirement par diverge karते hain — `category == "tech"` aur `authorId in <follow list>` add karna: Firestore ek composite index add karता hai aur ek query rakhता hai; RTDB mein koi compound query nahi.',
      },
      {
        title: 'Presence: onDisconnect() is an RTDB primitive with no Firestore equivalent',
        titleHi: 'Presence: onDisconnect() ek RTDB primitive hai jiska koi Firestore equivalent nahi',
        code: `import { getDatabase, ref, set, onDisconnect, onValue } from "firebase/database";
const db = getDatabase();
const myStatusRef = ref(db, \`status/\${uid}\`);

// when the connection drops (tab closed, network lost, crash), the SERVER runs this:
onDisconnect(myStatusRef).set({ state: "offline", at: Date.now() });
// and right now, mark online:
await set(myStatusRef, { state: "online", at: Date.now() });

// any client can watch presence:
onValue(ref(db, "status"), (snap) => console.log("online:", Object.keys(snap.val() || {}).length));`,
        output: `online: 3`,
        explain: "`onDisconnect(myStatusRef).set(...)` registers a write with the SERVER that it runs the instant the client's connection drops — tab close, network loss, crash, graceful or not. The client marks itself online now, and the server marks it offline later on its behalf. Firestore has no equivalent primitive, which is why presence (`who's online`, shown here as `online: 3`) is one of the strongest reasons to use the RTDB even in a Firestore app.",
        explainHi: '`onDisconnect(myStatusRef).set(...)` SERVER ke saath ek write register karता hai jise ye us instant chalाता hai jab client ka connection drop hota hai — tab close, network loss, crash. Client khud ko abhi online mark karता hai, aur server ise baad mein iski taraf se offline mark karता hai. Firestore ke paas koi equivalent primitive nahi, isिlye presence (`online: 3`) ek Firestore app mein bhi RTDB istemal karने ke sabse strong reasons mein se ek hai.',
      },
      {
        title: 'Both in one app: Firestore for domain data, RTDB for presence',
        titleHi: 'Ek app mein dono: Firestore domain data ke liye, RTDB presence ke liye',
        code: `// Firestore holds the durable stuff:
await setDoc(doc(fs, "documents", docId), { title, body, ownerId, updatedAt: serverTimestamp() });

// RTDB holds who's currently viewing/editing this doc (ephemeral, high-churn):
const presenceRef = ref(rtdb, \`presence/\${docId}/\${uid}\`);
onDisconnect(presenceRef).remove();
await set(presenceRef, { name, cursorPos: 0 });

// this split plays each database to its strength — and is an officially recommended pattern`,
        output: `(architecture example - no single output)`,
        explain: 'This is a recommended architecture: Firestore holds the durable domain data (the document, its owner, its updatedAt) where rich queries and multi-region matter, and the RTDB holds the ephemeral high-churn presence data (who is currently viewing/editing) where `onDisconnect` cleanup and low latency matter. Each database is used for exactly what it is best at, in one app.',
        explainHi: 'Ye ek recommended architecture hai: Firestore durable domain data rakhता hai (document, iska owner, iska updatedAt) jahaan rich queries aur multi-region matter karте hain, aur RTDB ephemeral high-churn presence data rakhता hai (kaun abhi view/edit kar raha hai) jahaan `onDisconnect` cleanup aur low latency matter karते hain. Har database theek uske liye istemal hota hai jismें ye best hai, ek app mein.',
      },
    ],

    mistakes: [
      {
        wrong: `// choosing the RTDB for a data-rich app because "it's simpler" / "it was first"
// 6 months in:
//  - every list screen filters client-side because there are no compound queries
//  - the tree is 4 levels deep and reads pull huge subtrees
//  - you're past 1,000 writes/sec and manually sharding across 3 DB instances
//  - bandwidth bill is climbing because whole-subtree reads`,
        right: `// default to Firestore for anything that looks like an application database:
//  - compound queries with composite indexes
//  - reads scoped to a document, not a subtree
//  - automatic scaling, no manual sharding
//  - per-operation pricing that query efficiency keeps down
// use the RTDB deliberately, for presence and high-frequency ephemeral writes`,
        why: 'The Realtime Database\'s simpler model is attractive early but its limits are structural rather than incidental: a single query can order by only one field and filter on only one, so an application with real reporting or list-filtering needs ends up performing those operations in client code over data it had to download in full; a read returns the entire subtree at a path, so a tree that grew deep to model relationships makes ordinary reads expensive; and a single instance has hard ceilings on concurrent connections and write throughput, past which the developer must split data across multiple database instances and route between them manually. Firestore was designed to address exactly these points, with multi-field queries backed by composite indexes, reads scoped to individual documents, automatic scaling with no sharding work, and pricing that tracks operation counts which efficient queries keep low. Choosing the Realtime Database for a general application database trades a small early simplicity for a set of ceilings that are reached precisely as the application becomes successful, and migrating between the two later is a substantial project.',
        whyHi: 'Realtime Database ka simpler model jaldi attractive hai par iski limits structural hain: ek single query sirf ek field se order kar sakती hai aur sirf ek par filter, to ek application jiski real reporting ya list-filtering needs hain wo operations client code mein perform karता hai; ek read ek path par poora subtree lautaता hai; aur ek single instance ki concurrent connections aur write throughput par hard ceilings hain. Firestore theek in points ko address karने ke liye design kiya gaya tha. Ek general application database ke liye RTDB chunना ek chhoटी jaldi simplicity ko ceilings ke ek set ke liye trade karता hai jo theek tab pahunचे jaते hain jab application successful ho jाती hai.',
      },
      {
        wrong: `// trying to build presence in Firestore with a heartbeat write every 10s
setInterval(() => {
  updateDoc(doc(fs, "presence", uid), { lastSeen: serverTimestamp() });
}, 10_000);
// -- a write every 10s per user per open tab = huge write volume, still can't
//    detect an abrupt disconnect for up to 10s, and you pay for every heartbeat`,
        right: `// use the RTDB's onDisconnect() — the server writes "offline" the instant the
// socket drops, gracefully OR not, with zero heartbeat writes:
onDisconnect(ref(rtdb, \`status/\${uid}\`)).set({ state: "offline" });
await set(ref(rtdb, \`status/\${uid}\`), { state: "online" });
// optionally mirror the resolved state into Firestore via a Cloud Function
// if other Firestore queries need to join against it`,
        why: 'Detecting that a client has disconnected requires the server to notice the connection has dropped and take an action on the client\'s behalf, including when the disconnect is abrupt and the client sends nothing. Firestore has no primitive for this, so presence on Firestore is approximated with periodic heartbeat writes and a staleness threshold, which generates a continuous stream of writes proportional to the number of connected clients, is billed for every one of those writes, and still cannot report a disconnect faster than the heartbeat interval. The Realtime Database provides onDisconnect, which registers an operation with the server that the server itself performs the moment the client\'s connection is lost for any reason, requiring no heartbeats and reflecting the disconnect immediately. This is why the standard pattern for a Firestore application that needs presence is to use the Realtime Database specifically for the presence data, optionally mirroring the resolved online or offline state back into Firestore with a Cloud Function when other Firestore queries need to reference it.',
        whyHi: 'Ye detect karना ki ek client disconnect ho gaya server ko ye notice karने ki zaroorat hai ki connection drop ho gaya aur client ki taraf se ek action lे, ismein jab disconnect abrupt hai. Firestore ke paas iske liye koi primitive nahi, to Firestore par presence periodic heartbeat writes se approximate kiya jाता hai, jo writes ki ek continuous stream generate karता hai aur har ek ke liye billed hai. Realtime Database `onDisconnect` deता hai, jo server ke saath ek operation register karता hai jo server khud us moment perform karता hai jab client ka connection kisī bhi kaaraन se lost hota hai.',
      },
    ],

    realWorld: [
      {
        en: '**A SaaS app on Firestore for all customer/project/billing data, with a small RTDB instance powering the "3 people viewing this board" avatars** — each database doing what it is best at.',
        hi: '**Ek SaaS app Firestore par saare customer/project/billing data ke liye, ek chhoटे RTDB instance ke saath jo "3 log is board ko dekh rahे hain" avatars ko power karता hai**.',
      },
      {
        en: '**A multiplayer party game entirely on the RTDB** — game state at `games/{id}`, `onDisconnect()` to drop players who rage-quit, sub-50ms sync; Firestore\'s query power is irrelevant here and its latency slightly worse.',
        hi: '**Ek multiplayer party game poori tarah RTDB par** — `games/{id}` par game state, rage-quit karने waale players ko drop karने ke liye `onDisconnect()`.',
      },
      {
        en: '**A team that started on the RTDB in 2017 and migrated the domain data to Firestore in 2021** once list screens needed real filtering and the write rate crossed the single-instance ceiling — keeping the RTDB only for presence.',
        hi: '**Ek team jo 2017 mein RTDB par shuru hui aur 2021 mein domain data Firestore mein migrate kiya** jab list screens ko real filtering chahiye thi.',
      },
    ],

    interviewQA: [
      {
        q: 'When would you choose the Realtime Database over Firestore for a new Firebase project?',
        qHi: 'Ek naye Firebase project ke liye aap Firestore ke bजaay Realtime Database kab chunोge?',
        a: 'The default for a new project is Firestore, because it has multi-field queries backed by composite indexes, refuses rather than silently scans an unindexed query, scales automatically without manual sharding, prices per operation in a way that efficient queries keep low, and offers multi-region replication and managed export. The Realtime Database is the right choice when a specific requirement plays to its particular strengths. The clearest case is presence, meaning live connection state such as who is online or who is currently editing, because the Realtime Database has an onDisconnect primitive that lets the server perform a write on the client\'s behalf the instant its connection drops, even on an abrupt disconnect, and Firestore has no equivalent. Another case is very high-frequency small writes such as collaborative cursors, live game state, or sensor telemetry, where the Realtime Database\'s lower write-propagation latency and its pricing model matter more than query power. A third is data that is naturally a single small tree with simple access patterns. It is common and supported to use both in one application, with Firestore holding the durable domain data and the Realtime Database handling presence and ephemeral signalling.',
        aHi: 'Ek naye project ke liye default Firestore hai, kyunki iske paas composite indexes se backed multi-field queries hain, ek unindexed query ko silently scan karने ke bजaay refuse karता hai, manual sharding ke bina automatically scale karता hai, aur multi-region replication offer karता hai. Realtime Database sahi choice hai jab ek specific requirement iski strengths ko play karता hai. Sabse clear case presence hai, kyunki RTDB ke paas ek `onDisconnect` primitive hai jo server ko client ki taraf se ek write perform karने deता hai jis moment iska connection drop hota hai. Ek doosरा case bahut high-frequency chhote writes hai. Ek app mein dono istemal karना common hai.',
      },
      {
        q: 'What do Firestore and the Realtime Database have in common, and what are the three biggest differences?',
        qHi: 'Firestore aur Realtime Database mein kya common hai, aur teen sabse baड़े antar kya hain?',
        a: 'Both are Firebase databases with real-time listeners that push changes to clients, offline persistence with local caching and queued writes, a security-rules layer that allows untrusted clients to connect directly, both a client and an admin SDK, and native Firebase Authentication integration. The three biggest differences are queries, scale, and pricing. On queries, the Realtime Database allows a single sort key and a single filter per query with no compound queries and a silent fall back to client-side sorting when a child index is missing, whereas Firestore supports multi-field filtering and ordering through composite indexes and rejects any query it cannot serve from an index. On scale, a single Realtime Database instance has practical ceilings around two hundred thousand concurrent connections and about a thousand writes per second, beyond which the developer shards across instances manually, while Firestore scales far higher on its own. On pricing, the Realtime Database bills by gigabytes stored and gigabytes downloaded, and because a read returns an entire subtree a poor tree shape inflates download costs, whereas Firestore bills per document read, write, and delete, so cost tracks operation counts and efficient queries keep it down. Secondary differences include the Realtime Database\'s lower write latency and its onDisconnect presence primitive, against Firestore\'s multi-region support and managed BigQuery export.',
        aHi: 'Dono Firebase databases hain real-time listeners, offline persistence, ek security-rules layer, ek client aur ek admin SDK, aur native Firebase Authentication integration ke saath. Teen sabse baड़े antar queries, scale, aur pricing hain. Queries par, RTDB prati query ek single sort key aur ek single filter allow karता hai koi compound queries ke bina, jabki Firestore composite indexes ke through multi-field filtering support karता hai. Scale par, ek single RTDB instance ki practical ceilings lगभग do lakh concurrent connections aur lगभग ek hazार writes per second hain. Pricing par, RTDB gigabytes stored aur downloaded se bill karता hai, jabki Firestore prati document read, write, aur delete bill karता hai.',
      },
    ],

    exercises: [
      {
        task: 'For each feature, name the better Firebase database and one-line why: (a) "who is online" dots, (b) an admin screen listing orders filtered by status + date range + region, (c) live opponent paddle position in a Pong game, (d) a customer records system that will hold millions of rows.',
        taskHi: 'Har feature ke liye, behtar Firebase database aur ek-line why batao: (a) "kaun online hai" dots, (b) ek admin screen jo status + date range + region se filtered orders list karta hai, (c) Pong game mein live opponent paddle position, (d) ek customer records system jismein millions of rows honge.',
        hint: '(a) RTDB — `onDisconnect()`, no Firestore equivalent. (b) Firestore — compound filter needs a composite index; RTDB has no compound queries. (c) RTDB — lowest write latency for high-frequency tiny writes. (d) Firestore — automatic scaling past the RTDB\'s ~1k writes/sec and connection ceilings, plus real queries.',
        hintHi: '(a) RTDB — `onDisconnect()`. (b) Firestore — composite index. (c) RTDB — lowest latency. (d) Firestore — automatic scaling + real queries.',
      },
      {
        task: 'In a comment, explain why building a presence system ("online/offline/last seen") purely in Firestore with a 10-second heartbeat write is a poor design, and what the standard fix is.',
        taskHi: 'Ek comment mein, samjhaओ ki ek presence system poori tarah Firestore mein ek 10-second heartbeat write ke saath banाना ek poor design kyun hai.',
        hint: 'A heartbeat write every 10s per user per tab = massive continuous write volume you pay for, and an abrupt disconnect still isn\'t detected for up to 10s. Fix: RTDB `onDisconnect()` — the server writes "offline" the instant the socket drops, zero heartbeats; optionally mirror to Firestore via a Cloud Function if other queries need it.',
        hintHi: 'Prati user prati tab har 10s ek heartbeat write = massive write volume jiske liye aap pay karते ho. Fix: RTDB `onDisconnect()`.',
      },
      {
        task: 'A team is starting a new Firebase project and asks "RTDB or Firestore?". In a comment, give your default answer and the specific conditions under which you\'d add the RTDB alongside it.',
        taskHi: 'Ek team ek naya Firebase project shuru kar rahी hai aur poochती hai "RTDB ya Firestore?". Ek comment mein, apna default answer do.',
        hint: 'Default: Firestore — better queries, scaling, indexing safety, pricing as you grow, multi-region. Add the RTDB specifically for: presence/`onDisconnect()`, very high-frequency ephemeral writes (cursors, game state, telemetry), or a naturally-small tree-shaped shared blob. Using both is a supported pattern.',
        hintHi: 'Default: Firestore. RTDB specifically add karो: presence/`onDisconnect()`, bahut high-frequency ephemeral writes, ya ek naturally-chhoटा tree-shaped blob ke liye.',
      },
    ],

    keyTakeaways: [
      'BOTH: Firebase, real-time listeners, offline persistence, security rules, client + admin SDK, Firebase Auth integration. Know one and the other is familiar.',
      'QUERIES (the biggest practical gap): RTDB = 1 sort key + 1 filter, NO compound queries, silent client-side sort without `.indexOn`. Firestore = multi-field via composite indexes, `in`/`array-contains`/`or()`, and REFUSES an unindexed query (tells you the index to make). Apps with real query needs hit the RTDB ceiling fast.',
      'SCALE: one RTDB instance ≈ 200k concurrent connections / ~1k writes/sec, then you shard across instances MANUALLY. Firestore scales far higher automatically. PRICING: RTDB by GB stored + GB downloaded (whole-subtree reads inflate this); Firestore per document read/write/delete (+ storage/egress) — operation-count based, kept low by query efficiency.',
      'RTDB-ONLY STRENGTHS: lowest write-propagation latency (tens of ms), and native `onDisconnect()` — the server performs a registered write the instant the client\'s socket drops (even abruptly), which is TRUE presence support. Firestore has NO `onDisconnect` equivalent; heartbeat-write presence in Firestore is costly and slow to detect drops.',
      'DEFAULT TO FIRESTORE for anything application-database-shaped (queries, growth, multi-region, safer indexing, cleaner pricing). Reach for the RTDB deliberately for: presence/"who\'s online", very high-frequency tiny ephemeral writes (cursors, game state, telemetry), or naturally-small tree data. Using BOTH in one app (Firestore = domain data, RTDB = presence + ephemeral signals) is an officially recommended pattern.',
    ],
    keyTakeawaysHi: [
      'DONO: Firebase, real-time listeners, offline persistence, security rules, client + admin SDK, Firebase Auth integration.',
      'QUERIES (sabse baड़ा practical gap): RTDB = 1 sort key + 1 filter, KOI compound queries nahi, `.indexOn` ke bina silent client-side sort. Firestore = composite indexes ke through multi-field, aur ek unindexed query ko REFUSE karता hai.',
      'SCALE: ek RTDB instance ≈ 200k concurrent connections / ~1k writes/sec, phir aap MANUALLY shard karते ho. Firestore bahut ऊpar tak automatically scale karता hai. PRICING: RTDB GB stored + GB downloaded se; Firestore prati document read/write/delete se.',
      'RTDB-ONLY STRENGTHS: sabse kam write-propagation latency, aur native `onDisconnect()` — server ek registered write us moment perform karता hai jab client ka socket drop hota hai, jo TRUE presence support hai. Firestore ke paas KOI `onDisconnect` equivalent nahi.',
      'KISI BHI application-database-shaped cheez ke liye FIRESTORE DEFAULT karो. RTDB ke liye deliberately reach karो: presence/"kaun online hai", bahut high-frequency chhote ephemeral writes, ya naturally-chhoटा tree data. Ek app mein DONO istemal karना ek officially recommended pattern hai.',
    ],
  },
];
