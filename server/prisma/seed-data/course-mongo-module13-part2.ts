/**
 * Databases Complete Course — Module 13: MongoDB Fundamentals, lessons 4-6.
 *
 * Lesson 4: Update operators — updateOne/updateMany, $set/$unset/$inc/$rename,
 *           replaceOne, findOneAndUpdate, and upsert.
 * Lesson 5: Working with arrays — querying array fields, $elemMatch, $all, $size,
 *           $push/$pull/$addToSet/$pop, and the positional operators.
 * Lesson 6: Deleting documents & the CRUD recap — deleteOne/deleteMany,
 *           findOneAndDelete, bulkWrite, and a synthesis of the whole CRUD surface.
 *
 * Verified against a real in-memory MongoDB (mongodb-memory-server).
 * Run: node verify-mongo.mjs 13
 */

import type { CourseLesson } from './course-js-module1';

export const MONGO_MODULE_13_PART2: CourseLesson[] = [
  {
    slug: 'mongo-update-operators',
    title: 'Update Operators',
    titleHi: 'Update Operators',
    description: 'An update names which documents to change and what to change about them. `$set`, `$unset`, `$inc`, and `$rename` modify specific fields; `replaceOne` swaps a whole document; `findOneAndUpdate` returns the document; and `upsert` inserts when nothing matched.',
    descriptionHi: 'Ek update bataता hai kaunse documents badalne hain aur unke baare mein kya badalna hai. `$set`, `$unset`, `$inc`, aur `$rename` specific fields modify karte hain; `replaceOne` ek poora document swap karता hai; `findOneAndUpdate` document lautaता hai; aur `upsert` insert karता hai jab kuch match nahi hua.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 4,

    analogy: {
      en: '**A form-editing clerk you hand two things: which file to pull, and a list of specific corrections — not a whole rewritten file.** You do not photocopy a client\'s entire record just to fix their phone number; you tell the clerk "file #42, change the phone field to this, delete the old fax field, and add one to the visit counter." That instruction list is the update document: `$set` overwrites a field, `$unset` removes one, `$inc` bumps a number, `$rename` relabels a field — each targets exactly what changes and leaves everything else untouched. `replaceOne` is the rare case where you *do* hand over a completely rewritten file to swap in. `findOneAndUpdate` is asking the clerk to also photocopy the file for you — before or after the edit, your choice. And `upsert` is telling the clerk "if file #42 doesn\'t exist yet, create it from these corrections."',
      hi: '**Ek form-editing clerk jise aap do cheezen dete ho: kaunसी file pull karnी hai, aur specific corrections ki ek list — ek poori rewritten file nahi.** Aap ek client ka poora record photocopy nahi karते bas unka phone number theek karne ke liye; aap clerk se kehते ho "file #42, phone field ko ye badlो, purana fax field delete karो, aur visit counter mein ek jodो." Wo instruction list update document hai: `$set` ek field overwrite karता hai, `$unset` ek hataता hai, `$inc` ek number bump karता hai, `$rename` ek field relabel karता hai. `replaceOne` wo rare case hai jahaan aap *sach mein* ek poori rewritten file swap karne ke liye deте ho. `findOneAndUpdate` clerk se file ko photocopy bhi karne ko kehना hai. Aur `upsert` clerk se kehना hai "agar file #42 abhi exist nahi karti, in corrections se ise banaओ."',
    },

    simple: `**\`updateOne(filter, update)\` -- first arg = which document, second arg = an UPDATE document ($-operators)**

\`\`\`js
await db.users.updateOne(
  { _id: 1 },
  { $set: { age: 31, city: "Delhi" }, $inc: { visits: 1 }, $unset: { tempFlag: "" } }
);
// $set: overwrite/add these fields   $inc: add to a number   $unset: remove a field
\`\`\`

**\`updateMany\` -- same, but every matching document; returns \`{ matchedCount, modifiedCount }\`**

\`\`\`js
await db.users.updateMany({ status: "old" }, { $set: { status: "archived" } });
// -> { matchedCount: 2, modifiedCount: 2 }
\`\`\`

**\`$rename\` relabels a field; \`replaceOne\` swaps the ENTIRE document (no $-operators)**

\`\`\`js
await db.users.updateOne({ _id: 1 }, { $rename: { fname: "firstName" } });
await db.users.replaceOne({ _id: 1 }, { name: "Ravi", age: 31 });  // _id kept; everything else replaced
\`\`\`

**\`upsert: true\` -- if nothing matched, INSERT a new document built from filter + update**

\`\`\`js
const r = await db.users.updateOne({ _id: 5 }, { $set: { name: "new" } }, { upsert: true });
// r -> { matchedCount: 0, modifiedCount: 0, upsertedCount: 1, upsertedId: 5 }
// the new doc: { _id: 5, name: "new" }
\`\`\`

**\`findOneAndUpdate\` -- does the update AND returns the document (by default the OLD version;
pass \`{ returnDocument: "after" }\` for the new one)**`,

    simpleHi: `**\`updateOne(filter, update)\` -- pehla arg = kaunसा document, doosरा arg = ek UPDATE document ($-operators)**

\`\`\`js
await db.users.updateOne(
  { _id: 1 },
  { $set: { age: 31, city: "Delhi" }, $inc: { visits: 1 }, $unset: { tempFlag: "" } }
);
// $set: in fields ko overwrite/add   $inc: ek number mein add   $unset: ek field remove
\`\`\`

**\`updateMany\` -- same, par har matching document; \`{ matchedCount, modifiedCount }\` lautaता hai**

\`\`\`js
await db.users.updateMany({ status: "old" }, { $set: { status: "archived" } });
// -> { matchedCount: 2, modifiedCount: 2 }
\`\`\`

**\`$rename\` ek field relabel karता hai; \`replaceOne\` POORA document swap karता hai (koi $-operators nahi)**

\`\`\`js
await db.users.updateOne({ _id: 1 }, { $rename: { fname: "firstName" } });
await db.users.replaceOne({ _id: 1 }, { name: "Ravi", age: 31 });  // _id rakha; baaki sab replace
\`\`\`

**\`upsert: true\` -- agar kuch match nahi hua, filter + update se bana ek naya document INSERT karो**

\`\`\`js
const r = await db.users.updateOne({ _id: 5 }, { $set: { name: "new" } }, { upsert: true });
// r -> { matchedCount: 0, modifiedCount: 0, upsertedCount: 1, upsertedId: 5 }
\`\`\`

**\`findOneAndUpdate\` -- update karता hai AUR document lautaता hai (default se PURANA version;
naye ke liye \`{ returnDocument: "after" }\` pass karो)**`,

    content: `## The shape of an update

An update call takes a **filter** (which documents) and an **update document** (what to change). The update document is not a replacement — it is a set of \`$\`-prefixed operators, each describing one kind of modification:

\`\`\`js
await db.users.updateOne(
  { _id: 1 },
  { $set: { age: 31, city: "Delhi" }, $inc: { visits: 1 }, $unset: { tempFlag: "" } }
);
\`\`\`

- **\`$set\`** — set the listed fields to the given values, creating them if absent, overwriting if present. The most common operator by far.
- **\`$unset\`** — remove the listed fields entirely (the value you give, \`""\`, is ignored — only the key matters).
- **\`$inc\`** — add the given number to a numeric field (a negative number subtracts); creates the field at that value if absent.
- **\`$rename\`** — change a field's name, keeping its value.
- Others include \`$mul\` (multiply), \`$min\` / \`$max\` (set only if the new value is smaller / larger), and \`$currentDate\`.

An update document that mixes \`$\`-operators with plain fields, or uses no operator at all, is an error for \`updateOne\`/\`updateMany\` — those require operator syntax.

## \`updateOne\` vs \`updateMany\`

\`updateOne\` modifies the **first** matching document; \`updateMany\` modifies **every** match. Both return a result reporting \`matchedCount\` (how many the filter selected) and \`modifiedCount\` (how many actually changed — a document already holding the target values matches but is not modified).

\`\`\`js
await db.users.updateMany({ status: "old" }, { $set: { status: "archived" } });
// { matchedCount: 2, modifiedCount: 2 }
\`\`\`

## \`replaceOne\`: swapping the whole document

\`\`\`js
await db.users.replaceOne({ _id: 1 }, { name: "Ravi", age: 31 });
\`\`\`

\`replaceOne\` takes a plain document (no operators) and replaces the entire matched document with it, keeping only the \`_id\`. Every field not present in the replacement is gone. This is occasionally what you want — replacing a document wholesale from a fresh version the application holds — but it is easy to misuse: a \`replaceOne\` that forgets a field silently deletes that field, whereas \`$set\` only touches what it names.

## \`findOneAndUpdate\`: update and return

\`findOneAndUpdate(filter, update)\` performs the same update as \`updateOne\` but also **returns a document**. By default it returns the document as it was *before* the update; passing \`{ returnDocument: "after" }\` returns the post-update version. This is the tool for atomic read-modify-write patterns — for example, atomically claiming the next available job from a queue by finding one with \`status: "pending"\`, setting it to \`"claimed"\`, and getting that document back, all in one operation with no window for another worker to claim the same job.

## \`upsert\`: insert if nothing matched

\`\`\`js
const r = await db.users.updateOne({ _id: 5 }, { $set: { name: "new" } }, { upsert: true });
\`\`\`

With \`{ upsert: true }\`, if the filter matches an existing document the update proceeds normally; if it matches **nothing**, MongoDB inserts a new document built from the filter's equality conditions plus the update's \`$set\` (and other operator) values. The result reports \`upsertedCount: 1\` and \`upsertedId\` (the \`_id\` of the new document). This is MongoDB's equivalent of SQL's \`INSERT ... ON CONFLICT DO UPDATE\` (Module 11) — a single atomic "update it, or create it" with no check-then-write race.`,

    contentHi: `## Ek update ka shape

Ek update call ek **filter** (kaunse documents) aur ek **update document** (kya badalna hai) leti hai. Update document ek replacement nahi hai — ye \`$\`-prefixed operators ka ek set hai:

\`\`\`js
await db.users.updateOne(
  { _id: 1 },
  { $set: { age: 31, city: "Delhi" }, $inc: { visits: 1 }, $unset: { tempFlag: "" } }
);
\`\`\`

- **\`$set\`** — listed fields ko given values par set karो.
- **\`$unset\`** — listed fields ko poori tarah remove karो.
- **\`$inc\`** — ek numeric field mein given number add karो.
- **\`$rename\`** — ek field ka naam badlो.
- Doosre: \`$mul\`, \`$min\` / \`$max\`, \`$currentDate\`.

## \`updateOne\` vs \`updateMany\`

\`updateOne\` **pehla** matching document modify karता hai; \`updateMany\` **har** match. Dono \`matchedCount\` aur \`modifiedCount\` report karте hain.

\`\`\`js
await db.users.updateMany({ status: "old" }, { $set: { status: "archived" } });
// { matchedCount: 2, modifiedCount: 2 }
\`\`\`

## \`replaceOne\`: poora document swap karna

\`\`\`js
await db.users.replaceOne({ _id: 1 }, { name: "Ravi", age: 31 });
\`\`\`

\`replaceOne\` ek plain document leta hai aur poore matched document ko isse replace karता hai, sirf \`_id\` rakhте hue. Replacement mein maujood na hone waala har field chala jaता hai.

## \`findOneAndUpdate\`: update aur return

\`findOneAndUpdate(filter, update)\` wahi update karता hai jo \`updateOne\` par ek **document bhi lautaता hai**. Default se ye update se *pehle* waala document lautaता hai; \`{ returnDocument: "after" }\` post-update version lautaता hai. Ye atomic read-modify-write patterns ke liye tool hai — jaisе ek queue se agla available job atomically claim karना.

## \`upsert\`: insert agar kuch match nahi hua

\`\`\`js
const r = await db.users.updateOne({ _id: 5 }, { $set: { name: "new" } }, { upsert: true });
\`\`\`

\`{ upsert: true }\` ke saath, agar filter kुछ match nahi karता, MongoDB filter ke equality conditions plus update ke \`$set\` values se bana ek naya document insert karता hai. Ye SQL ke \`INSERT ... ON CONFLICT DO UPDATE\` (Module 11) ka equivalent hai.`,

    examples: [
      {
        title: '$set, $inc, and $unset in a single updateOne',
        titleHi: 'Ek single updateOne mein $set, $inc, aur $unset',
        code: `await db.users.insertOne({ _id: 1, name: "Ravi", age: 30, visits: 0, tempFlag: true });
await db.users.updateOne({ _id: 1 }, { $set: { age: 31 }, $inc: { visits: 1 }, $unset: { tempFlag: "" } });
print(await db.users.findOne({ _id: 1 }));`,
        output: `{"_id":1,"name":"Ravi","age":31,"visits":1}`,
        explain: 'One update document combines three operators: `$set` overwrites `age` to 31, `$inc` adds 1 to `visits` (0 → 1), and `$unset` removes `tempFlag` entirely (the value `""` is ignored — only the key matters). Every field not named — `name` — is left untouched.',
        explainHi: 'Ek update document teen operators combine karta hai: `$set` `age` ko 31 overwrite karta hai, `$inc` `visits` mein 1 add karta hai (0 → 1), aur `$unset` `tempFlag` ko poori tarah remove karta hai (value `""` ignore hoti hai). Har field jo name nahi kiya gaya — `name` — untouched chhoड़a jaता hai.',
      },
      {
        title: 'updateMany reports matchedCount and modifiedCount',
        titleHi: 'updateMany matchedCount aur modifiedCount report karta hai',
        code: `await db.items.insertMany([{ _id: 1, s: "old" }, { _id: 2, s: "old" }, { _id: 3, s: "new" }]);
const r = await db.items.updateMany({ s: "old" }, { $set: { s: "archived" } });
print({ matchedCount: r.matchedCount, modifiedCount: r.modifiedCount });`,
        output: `{"matchedCount":2,"modifiedCount":2}`,
        explain: '`updateMany({ s: "old" }, ...)` selects both documents with `s: "old"` (ids 1 and 2), so `matchedCount` is 2, and both actually change value, so `modifiedCount` is also 2. The `s: "new"` document (id 3) is not matched. (If a matched document already held the target value, it would count toward `matchedCount` but not `modifiedCount`.)',
        explainHi: '`updateMany({ s: "old" }, ...)` `s: "old"` waale dono documents ko select karta hai (ids 1 aur 2), to `matchedCount` 2 hai, aur dono actually value badalte hain, to `modifiedCount` bhi 2 hai. `s: "new"` document (id 3) match nahi hota.',
      },
      {
        title: 'upsert inserts a new document when the filter matches nothing',
        titleHi: 'upsert ek naya document insert karta hai jab filter kuch match nahi karta',
        code: `const r = await db.counters.updateOne({ _id: 5 }, { $set: { name: "new" }, $inc: { n: 1 } }, { upsert: true });
print({ matchedCount: r.matchedCount, upsertedCount: r.upsertedCount, upsertedId: r.upsertedId });
print(await db.counters.findOne({ _id: 5 }));`,
        output: `{"matchedCount":0,"upsertedCount":1,"upsertedId":5}
{"_id":5,"n":1,"name":"new"}`,
        explain: 'The filter `{ _id: 5 }` matches nothing in the empty collection, so with `{ upsert: true }` MongoDB builds a new document from the filter\'s equality (`_id: 5`) plus the update\'s operator values (`n: 1` from `$inc`, `name: "new"` from `$set`). The result reports `matchedCount: 0` and `upsertedCount: 1` with `upsertedId: 5`.',
        explainHi: 'Filter `{ _id: 5 }` empty collection mein kuch match nahi karta, to `{ upsert: true }` ke saath MongoDB filter ki equality (`_id: 5`) plus update ke operator values (`$inc` se `n: 1`, `$set` se `name: "new"`) se ek naya document banata hai. Result `matchedCount: 0` aur `upsertedCount: 1` report karta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// passing a plain document to updateOne, expecting it to merge like $set
await db.users.updateOne({ _id: 1 }, { age: 31 });
// ERROR: update document requires atomic operators
// (a plain document with no $-operators is not valid for updateOne/updateMany)`,
        right: `await db.users.updateOne({ _id: 1 }, { $set: { age: 31 } });
// $set is required -- it names the field(s) to change and leaves the rest alone`,
        why: 'updateOne and updateMany require the update argument to be expressed using update operators such as $set, because their entire purpose is targeted modification of specific fields within an existing document, and an operator is what tells MongoDB which fields to touch and how. A plain document with no operators is ambiguous in this context and is rejected with an error rather than being guessed at. If the genuine intent is to swap the whole document for a new version, replaceOne is the operation that accepts a plain document, and it replaces everything except the _id; but for the far more common case of changing one or a few fields while preserving the rest, $set is the required and correct form.',
        whyHi: '`updateOne` aur `updateMany` ko update argument ko update operators jaisе `$set` istemal karके express karna zaroori hai, kyunki unka poora purpose ek existing document ke andar specific fields ka targeted modification hai. Bina operators waala ek plain document is context mein ambiguous hai aur ek error ke saath reject hota hai. Agar genuine intent poore document ko swap karna hai, `replaceOne` wo operation hai jo ek plain document accept karता hai.',
      },
      {
        wrong: `// using replaceOne when you meant to change one field, silently dropping the rest
await db.users.replaceOne({ _id: 1 }, { age: 31 });
// the document is now JUST { _id: 1, age: 31 } -- name, email, everything else is GONE`,
        right: `await db.users.updateOne({ _id: 1 }, { $set: { age: 31 } });
// only "age" is touched -- name, email, and every other field are preserved`,
        why: 'replaceOne substitutes the entire matched document with the document provided, retaining only the _id, which means any field that existed on the original but is not present in the replacement is deleted. This is occasionally the intended behavior, when an application holds a complete fresh version of a document and wants to store it wholesale, but it is a dangerous default for the common task of updating a field or two, because forgetting to include an existing field in the replacement silently removes it with no error. $set is the safe operation for partial updates: it modifies exactly the fields it names and leaves every other field on the document untouched, so there is no risk of accidental data loss from an incomplete update document.',
        whyHi: '`replaceOne` poore matched document ko diye gaye document se substitute karता hai, sirf `_id` retain karте hue, jiska matlab hai original par maujood koi bhi field jo replacement mein nahi hai delete ho jaता hai. Ye ek dangerous default hai ek ya do fields update karne ke common task ke liye. `$set` partial updates ke liye safe operation hai.',
      },
      {
        wrong: `// two-step "check if exists, then insert or update" instead of an upsert
const existing = await db.stats.findOne({ userId: 42 });
if (existing) {
  await db.stats.updateOne({ userId: 42 }, { $inc: { views: 1 } });
} else {
  await db.stats.insertOne({ userId: 42, views: 1 });
}
// between the findOne and the write, another request could insert userId 42 --
// then this insertOne fails, or (without a unique index) creates a duplicate`,
        right: `await db.stats.updateOne(
  { userId: 42 },
  { $inc: { views: 1 } },
  { upsert: true }
);
// one atomic operation -- updates the existing doc, or creates { userId: 42, views: 1 }
// if none exists -- no gap for a concurrent request to interfere`,
        why: 'Splitting an "insert or update" into a separate existence check followed by a separate write opens a window between the two operations during which another concurrent request can act, most often by inserting the very document the check just reported as absent, which then causes the second operation to fail or, absent a unique constraint, to create a duplicate, exactly the race condition described for the relational equivalent in Module 11. An upsert closes this window by making the check-and-write a single atomic operation that MongoDB evaluates as one unit: it updates a matching document if one exists, and otherwise inserts a new document built from the filter and update, with no intermediate state visible to concurrent operations. It is MongoDB\'s direct counterpart to INSERT ... ON CONFLICT DO UPDATE, and it is the correct tool whenever the requirement is "make sure this document exists and has these changes applied."',
        whyHi: 'Ek "insert or update" ko ek alag existence check aur ek alag write mein split karna do operations ke beech ek window kholता hai jiske dauran ek doosरा concurrent request act kar sakta hai. Ek upsert is window ko band karता hai check-and-write ko ek single atomic operation banакर. Ye MongoDB ka `INSERT ... ON CONFLICT DO UPDATE` ka direct counterpart hai.',
      },
    ],

    realWorld: [
      {
        en: '**A view-counter increment done as `updateOne({ _id }, { $inc: { views: 1 } }, { upsert: true })`** — one atomic operation that both creates the counter document on first view and bumps it on every subsequent one.',
        hi: '**Ek view-counter increment `updateOne({ _id }, { $inc: { views: 1 } }, { upsert: true })` ke roop mein kiya gaya** — ek atomic operation.',
      },
      {
        en: '**A job queue where a worker claims the next task with `findOneAndUpdate({ status: "pending" }, { $set: { status: "claimed", claimedBy: workerId } }, { returnDocument: "after" })`** — atomic claim-and-fetch with no double-claim window.',
        hi: '**Ek job queue jahaan ek worker agla task `findOneAndUpdate(...)` se claim karta hai** — atomic claim-and-fetch bina double-claim window ke.',
      },
      {
        en: '**A code-review rule that `replaceOne` is only permitted when the replacement is built from a full document the caller just read** — otherwise `$set` is required, to prevent accidental field deletion.',
        hi: '**Ek code-review rule ki `replaceOne` sirf tab permitted hai jab replacement ek poore document se bana ho jise caller ne abhi padha** — warna `$set` zaroori hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between updateOne with $set and replaceOne, and when is each appropriate?',
        qHi: '`$set` ke saath `updateOne` aur `replaceOne` mein kya antar hai, aur har ek kab appropriate hai?',
        a: 'updateOne with $set performs a targeted modification: the $set operator names specific fields and the values they should take, MongoDB applies exactly those changes to the matched document, and every field not mentioned in the $set is left exactly as it was. replaceOne instead substitutes the entire matched document with the new document provided, keeping only the _id, so any field that existed on the original but is absent from the replacement is removed. $set is the appropriate and safe choice for the overwhelmingly common case of changing one or a few fields on a document, because it cannot accidentally drop data that the update did not intend to touch. replaceOne is appropriate only in the narrower situation where the application genuinely has a complete, authoritative version of the whole document, typically one it just read and modified in memory, and wants to store that entire version wholesale; using it as a shortcut for a partial update is a common mistake, because forgetting to include an existing field in the replacement silently deletes that field with no error.',
        aHi: '`$set` ke saath `updateOne` ek targeted modification perform karता hai: `$set` operator specific fields aur unki values name karता hai, aur `$set` mein na bताye gaye har field waise hi chhoड़ diya jaता hai jaise tha. `replaceOne` iske bजाy poore matched document ko diye gaye naye document se substitute karता hai, sirf `_id` rakhते hue. `$set` sahi aur safe choice hai ek ya do fields badalne ke common case ke liye. `replaceOne` sirf us narrower situation mein appropriate hai jahaan application ke paas poore document ka ek complete version ho.',
      },
      {
        q: 'What does upsert do, and how does it avoid a race condition compared to a check-then-write?',
        qHi: '`upsert` kya karता hai, aur ye ek check-then-write ke muकаble ek race condition kaise avoid karता hai?',
        a: 'An upsert is an update issued with the upsert option set to true, and it changes the update\'s behavior when the filter matches no existing document: instead of doing nothing, MongoDB inserts a new document constructed from the filter\'s equality conditions together with the values in the update\'s $set and other operators. If the filter does match an existing document, the update proceeds normally. This matters for concurrency because the alternative approach, first querying whether a document exists and then choosing to insert or update based on the answer, leaves a window of time between the query and the write during which another concurrent operation can act, commonly by inserting the very document the query just reported as missing, after which the check-then-write logic either fails on a duplicate key or, with no unique constraint, creates two documents that should have been one. The upsert performs the existence check and the resulting insert or update as a single atomic operation with no observable intermediate state, so there is no gap for a concurrent operation to exploit, making it the direct MongoDB equivalent of the relational INSERT ... ON CONFLICT DO UPDATE.',
        aHi: 'Ek upsert ek update hai jo `upsert` option `true` set karके issue kiya jaता hai, aur ye update ke behavior ko badalता hai jab filter kisī existing document ko match nahi karता: kuch na karne ke bजाy, MongoDB filter ke equality conditions plus update ke `$set` values se bana ek naya document insert karता hai. Ye concurrency ke liye matter karता hai kyunki alternative approach ek window chhoड़ता hai. Upsert existence check aur resulting insert ya update ko ek single atomic operation ke roop mein perform karता hai.',
      },
    ],

    exercises: [
      {
        task: 'Insert `{ _id: 1, name: "Ravi", age: 30, visits: 0, tempFlag: true }`. Write one `updateOne` that sets `age` to 31, increments `visits` by 1, and removes `tempFlag`. Confirm the resulting document is `{ _id: 1, name: "Ravi", age: 31, visits: 1 }`.',
        taskHi: '`{ _id: 1, name: "Ravi", age: 30, visits: 0, tempFlag: true }` insert karo. Ek `updateOne` likho jo `age` ko 31 set karta hai, `visits` ko 1 se increment karता hai, aur `tempFlag` hataता hai.',
        hint: 'One update document can combine `$set`, `$inc`, and `$unset`. For `$unset` the value (`""`) is ignored — only the key name matters.',
        hintHi: 'Ek update document `$set`, `$inc`, aur `$unset` combine kar sakta hai. `$unset` ke liye value ignore hoती hai — sirf key naam matter karता hai.',
      },
      {
        task: 'Insert three documents with an `s` field of `"old"`, `"old"`, `"new"`. Run `updateMany({ s: "old" }, { $set: { s: "archived" } })` and confirm the result reports `matchedCount: 2` and `modifiedCount: 2`.',
        taskHi: 'Ek `s` field `"old"`, `"old"`, `"new"` ke saath teen documents insert karo. `updateMany({ s: "old" }, { $set: { s: "archived" } })` chalao aur confirm karo result `matchedCount: 2` aur `modifiedCount: 2` report karता hai.',
        hint: '`updateMany` affects every matching document. `matchedCount` is how many the filter selected; `modifiedCount` is how many actually changed value.',
        hintHi: '`updateMany` har matching document ko affect karता hai. `matchedCount` = filter ne кितne select kiye; `modifiedCount` = кितne actually badle.',
      },
      {
        task: 'Against an empty `counters` collection, run `updateOne({ _id: 5 }, { $set: { name: "new" }, $inc: { n: 1 } }, { upsert: true })`. Confirm the result shows `upsertedCount: 1` and `upsertedId: 5`, and that the new document is `{ _id: 5, n: 1, name: "new" }`.',
        taskHi: 'Ek empty `counters` collection ke against, `updateOne({ _id: 5 }, { $set: { name: "new" }, $inc: { n: 1 } }, { upsert: true })` chalao. Confirm karo result `upsertedCount: 1` aur `upsertedId: 5` dikhaता hai.',
        hint: 'With nothing matching `{ _id: 5 }`, upsert builds a new document from the filter (`_id: 5`) plus the operator values (`n: 1`, `name: "new"`). This is MongoDB\'s `INSERT ... ON CONFLICT DO UPDATE`.',
        hintHi: '`{ _id: 5 }` se kुछ match na hone par, upsert filter (`_id: 5`) plus operator values se ek naya document banata hai.',
      },
    ],

    keyTakeaways: [
      '`updateOne(filter, update)` / `updateMany(filter, update)` — first arg picks documents, second arg is an UPDATE DOCUMENT built from `$`-operators (NOT a plain document — that\'s an error). `updateOne` = first match; `updateMany` = every match. Both return `{ matchedCount, modifiedCount }` (a doc already holding the target values is matched but not modified).',
      'FIELD OPERATORS: `$set` (overwrite/add — by far the most common), `$unset` (remove a field; the given value is ignored), `$inc` (add a number, negative subtracts, creates if absent), `$rename` (relabel a field), also `$mul`/`$min`/`$max`/`$currentDate`. One update document can combine several.',
      '`replaceOne(filter, doc)` takes a PLAIN document (no operators) and swaps the ENTIRE matched document, keeping only `_id` — every field NOT in the replacement is DELETED. Only safe when the replacement is a full document the caller just read; for partial updates `$set` is required (a forgotten field in `replaceOne` silently drops it).',
      '`findOneAndUpdate(filter, update)` does the update AND returns a document — by default the PRE-update version; `{ returnDocument: "after" }` returns the post-update one. The tool for atomic read-modify-write (e.g. claiming the next queue job in one operation with no double-claim window).',
      '`{ upsert: true }` — if the filter matches an existing doc, update normally; if it matches NOTHING, INSERT a new document built from the filter\'s equality conditions + the update\'s operator values. Result reports `upsertedCount: 1` and `upsertedId`. MongoDB\'s `INSERT ... ON CONFLICT DO UPDATE` (Module 11) — one atomic op, no check-then-write race.',
    ],
    keyTakeawaysHi: [
      '`updateOne(filter, update)` / `updateMany(filter, update)` — pehla arg documents chunता hai, doosरा arg ek UPDATE DOCUMENT hai jo `$`-operators se bana hai (plain document NAHI — wo error hai). Dono `{ matchedCount, modifiedCount }` lautaते hain.',
      'FIELD OPERATORS: `$set` (overwrite/add — sabse common), `$unset` (ek field remove), `$inc` (ek number add), `$rename` (relabel), `$mul`/`$min`/`$max`/`$currentDate` bhi. Ek update document кई combine kar sakta hai.',
      '`replaceOne(filter, doc)` ek PLAIN document leta hai aur POORE matched document ko swap karता hai, sirf `_id` rakhते hue — replacement mein NA maujood har field DELETE ho jaता hai. Partial updates ke liye `$set` zaroori hai.',
      '`findOneAndUpdate(filter, update)` update karता hai AUR ek document lautaता hai — default se PRE-update version; `{ returnDocument: "after" }` post-update. Atomic read-modify-write ke liye tool.',
      '`{ upsert: true }` — agar filter kuch match nahi karता, filter ke equality conditions + update ke operator values se ek naya document INSERT karो. MongoDB ka `INSERT ... ON CONFLICT DO UPDATE`.',
    ],
  },

  {
    slug: 'mongo-working-with-arrays',
    title: 'Working with Arrays',
    titleHi: 'Arrays Ke Saath Kaam Karna',
    description: 'Arrays are first-class in MongoDB. A plain equality on an array field matches if any element equals the value; `$elemMatch` matches when one element satisfies several conditions at once; `$push`/`$pull`/`$addToSet` modify arrays; and the positional operators update elements in place.',
    descriptionHi: 'Arrays MongoDB mein first-class hain. Ek array field par ek plain equality match karता hai agar koi element value ke barabar hai; `$elemMatch` match karता hai jab ek element ek saath кई conditions satisfy karता hai; `$push`/`$pull`/`$addToSet` arrays modify karते hain; aur positional operators elements ko jagah par update karते hain.',
    difficulty: 'HARD',
    duration: 24,
    order: 5,

    analogy: {
      en: '**A shopping cart you can query and edit item by item, without unpacking the whole bag.** Asking "does this cart contain milk" is a plain equality on the array — any item matching counts. Asking "does this cart contain an item that is BOTH dairy AND on sale" is different: you need one single item satisfying both conditions, not milk from one criterion and a sale sticker from another — that is `$elemMatch`. Editing the cart has its own verbs: add an item to the end (`$push`), add it only if it is not already there (`$addToSet`), take a specific item out (`$pull`), remove whichever is at the front or back (`$pop`). And when you want to change one item that is already in the cart — mark the milk you already have as "found on sale" — you use a positional operator to reach the matched item without knowing its exact position in the bag.',
      hi: '**Ek shopping cart jise aap item-by-item query aur edit kar sakte ho, poori bag unpack kiye bina.** "Kya is cart mein doodh hai" poochna array par ek plain equality hai — koi bhi matching item counts. "Kya is cart mein ek aisा item hai jo DONO dairy AUR sale par hai" poochna alag hai: aapको ek single item chahiye jo dono conditions satisfy karे — wo `$elemMatch` hai. Cart edit karne ke apne verbs hain: end mein ek item add karो (`$push`), ise sirf tab add karो agar pehle se nahi hai (`$addToSet`), ek specific item nikaलो (`$pull`), aage ya peeche jo hai use hataओ (`$pop`). Aur jab aap ek item badalna chाहते ho jo pehle se cart mein hai — aap positional operator istemal karते ho.',
    },

    simple: `**Plain equality on an array field: matches if ANY element equals the value**

\`\`\`js
{ tags: "vip" }   // matches { tags: ["vip", "new"] } -- "contains vip"
{ "tags.0": "vip" } // matches only if the FIRST element is "vip" (positional dot notation)
\`\`\`

**\`$all\` / \`$size\` / \`$elemMatch\`**

\`\`\`js
{ tags: { $all: ["a", "b"] } }   // array contains BOTH "a" and "b" (any order, plus extras ok)
{ tags: { $size: 3 } }           // array has EXACTLY 3 elements
{ items: { $elemMatch: { sku: "x", qty: { $gt: 2 } } } }
// ONE element has sku "x" AND qty > 2  -- NOT "some element has sku x" plus
// "some (other) element has qty > 2"
\`\`\`

**Modifying arrays: \`$push\`, \`$addToSet\`, \`$pull\`, \`$pop\`**

\`\`\`js
{ $push: { tags: "c" } }                    // append "c" (duplicates allowed)
{ $addToSet: { tags: "b" } }                // append "b" only if not already present
{ $pull: { tags: "a" } }                    // remove every element equal to "a"
{ $pop: { tags: 1 } }                       // remove the LAST element (-1 removes the first)
{ $push: { scores: { $each: [90, 85], $sort: -1, $slice: 3 } } }  // push many, sort, keep top 3
\`\`\`

**Positional operators: update elements IN PLACE**

\`\`\`js
// $  -- the FIRST array element matched by the query filter:
db.orders.updateOne({ _id: 1, "items.sku": "b" }, { $set: { "items.$.qty": 99 } })

// $[]  -- EVERY element:
db.t.updateOne({ _id: 1 }, { $inc: { "scores.$[]": 10 } })

// $[<id>] with arrayFilters  -- every element matching a named condition:
db.t.updateOne({ _id: 1 }, { $set: { "grades.$[low].g": 50 } }, { arrayFilters: [{ "low.g": { $lt: 50 } }] })
\`\`\``,

    simpleHi: `**Ek array field par plain equality: match karता hai agar KOI element value ke barabar hai**

\`\`\`js
{ tags: "vip" }   // { tags: ["vip", "new"] } ko match karता hai -- "vip contain karता hai"
{ "tags.0": "vip" } // sirf tab match karता hai agar PEHLA element "vip" hai
\`\`\`

**\`$all\` / \`$size\` / \`$elemMatch\`**

\`\`\`js
{ tags: { $all: ["a", "b"] } }   // array mein DONO "a" aur "b" hain
{ tags: { $size: 3 } }           // array mein THEEK 3 elements hain
{ items: { $elemMatch: { sku: "x", qty: { $gt: 2 } } } }
// EK element ka sku "x" hai AUR qty > 2  -- NAHI "koi element ka sku x hai" plus
// "koi (doosरा) element ka qty > 2 hai"
\`\`\`

**Arrays modify karna: \`$push\`, \`$addToSet\`, \`$pull\`, \`$pop\`**

\`\`\`js
{ $push: { tags: "c" } }                    // "c" append karो (duplicates allowed)
{ $addToSet: { tags: "b" } }                // "b" append karो sirf agar pehle se nahi hai
{ $pull: { tags: "a" } }                    // "a" ke barabar har element remove karो
{ $pop: { tags: 1 } }                       // AAKHRI element remove karो (-1 pehla remove karता hai)
\`\`\`

**Positional operators: elements ko JAGAH PAR update karो**

\`\`\`js
// $  -- query filter se matched PEHLA array element:
db.orders.updateOne({ _id: 1, "items.sku": "b" }, { $set: { "items.$.qty": 99 } })

// $[]  -- HAR element:
db.t.updateOne({ _id: 1 }, { $inc: { "scores.$[]": 10 } })

// $[<id>] arrayFilters ke saath:
db.t.updateOne({ _id: 1 }, { $set: { "grades.$[low].g": 50 } }, { arrayFilters: [{ "low.g": { $lt: 50 } }] })
\`\`\``,

    content: `## Querying array fields

MongoDB treats arrays as first-class. A **plain equality** on an array field matches if *any* element of the array equals the value:

\`\`\`js
db.posts.find({ tags: "vip" })   // matches any post whose tags array contains "vip"
\`\`\`

This "contains" behavior is automatic — you do not write a special operator for it. Positional access uses dot notation with a numeric index: \`{ "tags.0": "vip" }\` matches only when the *first* element is \`"vip"\`.

### \`$all\`, \`$size\`

- **\`$all\`** — \`{ tags: { $all: ["a", "b"] } }\` matches if the array contains *every* listed value (order does not matter, and extra elements are fine). It is the "contains all of these" query.
- **\`$size\`** — \`{ tags: { $size: 3 } }\` matches arrays of *exactly* that length. (\`$size\` does not accept a range; for "at least N" you need a different approach, often \`{ "tags.N-1": { $exists: true } }\`.)

### \`$elemMatch\`: multiple conditions on one element

This is the subtle one. For an array of sub-documents:

\`\`\`js
db.orders.find({ items: { $elemMatch: { sku: "x", qty: { $gt: 2 } } } })
\`\`\`

\`$elemMatch\` requires that a **single element** of the array satisfies *all* the listed conditions together. Without it, writing \`{ "items.sku": "x", "items.qty": { $gt: 2 } }\` means something weaker and usually wrong: it matches if *some* element has \`sku: "x"\` and *some* element (possibly a different one) has \`qty > 2\`. \`$elemMatch\` is how you say "one and the same element."

## Modifying arrays

- **\`$push\`** — append a value to the end. Duplicates are allowed. With modifiers: \`$each\` (push multiple values), \`$sort\` (sort the array after pushing), \`$slice\` (truncate to a length, e.g. keep only the top 3), \`$position\` (insert at an index).
- **\`$addToSet\`** — append a value *only if it is not already present*, treating the array as a set.
- **\`$pull\`** — remove *every* element that matches a value or a condition (\`{ $pull: { scores: { $lt: 50 } } }\` removes all scores below 50).
- **\`$pop\`** — remove one element from an end: \`{ $pop: { tags: 1 } }\` removes the last, \`{ $pop: { tags: -1 } }\` removes the first.

## Positional operators: updating elements in place

To change an element already in an array, without knowing its index, use a positional operator in the field path:

- **\`$\`** — refers to the **first** array element that the query filter matched. \`db.orders.updateOne({ _id: 1, "items.sku": "b" }, { $set: { "items.$.qty": 99 } })\` finds the element with \`sku: "b"\` and sets *that element's* \`qty\`.
- **\`$[]\`** — refers to **every** element. \`{ $inc: { "scores.$[]": 10 } }\` adds 10 to every score.
- **\`$[<identifier>]\`** — refers to every element matching a named filter supplied in \`arrayFilters\`. \`{ $set: { "grades.$[low].g": 50 } }\` with \`arrayFilters: [{ "low.g": { $lt: 50 } }]\` sets \`g\` to 50 for every grade sub-document whose \`g\` is currently below 50.

The plain \`$\` handles the common "update the one element I searched for"; \`$[]\` and \`$[<id>]\` handle "update all" and "update all matching a condition."`,

    contentHi: `## Array fields query karna

MongoDB arrays ko first-class treat karता hai. Ek array field par ek **plain equality** match karता hai agar array ka *koi* element value ke barabar hai:

\`\`\`js
db.posts.find({ tags: "vip" })
\`\`\`

Ye "contains" behavior automatic hai. Positional access ek numeric index ke saath dot notation istemal karता hai: \`{ "tags.0": "vip" }\`.

### \`$all\`, \`$size\`

- **\`$all\`** — \`{ tags: { $all: ["a", "b"] } }\` match karता hai agar array *har* listed value contain karता hai.
- **\`$size\`** — \`{ tags: { $size: 3 } }\` *theek* us length ke arrays match karता hai.

### \`$elemMatch\`: ek element par кई conditions

\`\`\`js
db.orders.find({ items: { $elemMatch: { sku: "x", qty: { $gt: 2 } } } })
\`\`\`

\`$elemMatch\` ki zaroorat hai ki array ka ek **single element** saari listed conditions saath satisfy karे. Iske bina, \`{ "items.sku": "x", "items.qty": { $gt: 2 } }\` likhna kuch kamzor matlab rakhता hai: ye match karता hai agar *koi* element ka \`sku: "x"\` hai aur *koi* element (shАyad ek doosrा) ka \`qty > 2\` hai.

## Arrays modify karna

- **\`$push\`** — end mein ek value append karो. Modifiers: \`$each\`, \`$sort\`, \`$slice\`, \`$position\`.
- **\`$addToSet\`** — ek value append karो *sirf agar pehle se maujood nahi hai*.
- **\`$pull\`** — *har* element remove karो jo ek value ya condition match karता hai.
- **\`$pop\`** — ek end se ek element remove karो: \`1\` aakhri, \`-1\` pehla.

## Positional operators: elements ko jagah par update karna

- **\`$\`** — query filter se matched **pehle** array element ko refer karता hai.
- **\`$[]\`** — **har** element ko refer karता hai.
- **\`$[<identifier>]\`** — \`arrayFilters\` mein diye ek named filter se matching har element ko refer karता hai.`,

    examples: [
      {
        title: '$push, $addToSet, and $pull applied in sequence',
        titleHi: 'Sequence mein $push, $addToSet, aur $pull apply kiye gaye',
        code: `await db.posts.insertOne({ _id: 1, title: "p", tags: ["a", "b"] });
await db.posts.updateOne({ _id: 1 }, { $push: { tags: "c" } });
await db.posts.updateOne({ _id: 1 }, { $addToSet: { tags: "b" } });
await db.posts.updateOne({ _id: 1 }, { $pull: { tags: "a" } });
print(await db.posts.findOne({ _id: 1 }, { projection: { _id: 0 } }));`,
        output: `{"title":"p","tags":["b","c"]}`,
        explain: 'Starting from `tags: ["a", "b"]`: `$push` of `"c"` appends it → `["a", "b", "c"]`; `$addToSet` of `"b"` is a no-op since `"b"` is already present; `$pull` of `"a"` removes every element equal to `"a"` → `["b", "c"]`.',
        explainHi: '`tags: ["a", "b"]` se shuru: `"c"` ka `$push` ise append karta hai → `["a", "b", "c"]`; `"b"` ka `$addToSet` ek no-op hai kyunki `"b"` pehle se maujood hai; `"a"` ka `$pull` `"a"` ke barabar har element hataता hai → `["b", "c"]`.',
      },
      {
        title: '$elemMatch requires one element to satisfy all conditions together',
        titleHi: '$elemMatch ki zaroorat hai ki ek element saari conditions saath satisfy kare',
        code: `await db.orders.insertMany([
  { _id: 1, items: [{ sku: "x", qty: 5 }, { sku: "y", qty: 1 }] },
  { _id: 2, items: [{ sku: "x", qty: 1 }] },
]);
print(await db.orders.find({ items: { $elemMatch: { sku: "x", qty: { $gt: 2 } } } }).project({ _id: 1 }).toArray());`,
        output: `[{"_id":1}]`,
        explain: '`$elemMatch` requires a SINGLE array element to satisfy all its conditions together. Order 1 has an item with `sku: "x"` AND `qty: 5` (which is `> 2`) — the same element — so it matches. Order 2\'s only `sku: "x"` item has `qty: 1`, so no single element satisfies both, and it does not match.',
        explainHi: '`$elemMatch` ki zaroorat hai ki ek SINGLE array element apni saari conditions saath satisfy kare. Order 1 mein ek item hai `sku: "x"` AUR `qty: 5` ke saath (jo `> 2` hai) — wahi element — to ye match karta hai. Order 2 ke ekmatra `sku: "x"` item ka `qty: 1` hai, to koi single element dono satisfy nahi karta.',
      },
      {
        title: 'The positional $ operator updates the array element the filter matched',
        titleHi: 'Positional $ operator us array element ko update karta hai jise filter ne match kiya',
        code: `await db.carts.insertOne({ _id: 1, items: [{ sku: "a", qty: 1 }, { sku: "b", qty: 1 }] });
await db.carts.updateOne({ _id: 1, "items.sku": "b" }, { $set: { "items.$.qty": 99 } });
print(await db.carts.findOne({ _id: 1 }, { projection: { _id: 0 } }));`,
        output: `{"items":[{"sku":"a","qty":1},{"sku":"b","qty":99}]}`,
        explain: 'The filter `{ _id: 1, "items.sku": "b" }` matches the document AND identifies the array element where `sku` is `"b"`. The positional `$` in `"items.$.qty"` then refers to that matched element, so `$set` changes only its `qty` to 99 — the `sku: "a"` element is left untouched.',
        explainHi: 'Filter `{ _id: 1, "items.sku": "b" }` document ko match karta hai AUR us array element ko identify karta hai jahaan `sku` `"b"` hai. `"items.$.qty"` mein positional `$` phir us matched element ko refer karta hai, to `$set` sirf iska `qty` 99 mein badalta hai — `sku: "a"` element untouched chhoड़a jaता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// two dot-notation conditions on an array of sub-docs, expecting "same element"
await db.orders.find({ "items.sku": "x", "items.qty": { $gt: 2 } }).toArray();
// this matches a doc where SOME item has sku "x" AND SOME (possibly different)
// item has qty > 2 -- an order with items [{sku:"x",qty:1},{sku:"y",qty:9}] MATCHES`,
        right: `await db.orders.find({ items: { $elemMatch: { sku: "x", qty: { $gt: 2 } } } }).toArray();
// requires ONE SINGLE element to have BOTH sku "x" AND qty > 2`,
        why: 'When a filter places two dot-notation conditions on fields inside the same array, MongoDB evaluates each condition against the array independently, so the document matches if the array has at least one element satisfying the first condition and at least one element satisfying the second, and those can be two entirely different elements. This is frequently not the intent: a query looking for orders containing a high-quantity line item for a specific product wants a single line item that is both that product and high quantity, not merely an order that happens to contain that product somewhere and a high quantity somewhere. The $elemMatch operator expresses the stricter and usually correct requirement that one and the same array element must satisfy all the listed sub-conditions together, which is why it is the right tool whenever more than one condition applies to elements of an array of sub-documents.',
        whyHi: 'Jab ek filter usī array ke andar fields par do dot-notation conditions rakhता hai, MongoDB har condition ko array ke against independently evaluate karता hai, to document match karता hai agar array mein kam se kam ek element pehli condition satisfy karता hai aur kam se kam ek element doosri satisfy karता hai, aur wo do poori tarah alag elements ho sakte hain. `$elemMatch` operator wo stricter requirement express karता hai ki ek hi array element saari listed sub-conditions saath satisfy karे.',
      },
      {
        wrong: `// using $push where you meant $addToSet, creating duplicate array entries
await db.users.updateOne({ _id: 1 }, { $push: { roles: "admin" } });
await db.users.updateOne({ _id: 1 }, { $push: { roles: "admin" } });   // called again
// roles is now ["admin", "admin"] -- $push always appends, even a duplicate`,
        right: `await db.users.updateOne({ _id: 1 }, { $addToSet: { roles: "admin" } });
await db.users.updateOne({ _id: 1 }, { $addToSet: { roles: "admin" } });   // called again
// roles stays ["admin"] -- $addToSet only appends if the value isn't already present`,
        why: '$push unconditionally appends its value to the array, every time it runs, so calling it more than once with the same value, which happens easily when an operation is retried or triggered by a repeated user action, leaves the array with duplicate entries. For an array that is meant to represent a set of distinct values, such as a user\'s roles or a post\'s tags, this is a bug: downstream code that assumes each value appears at most once will misbehave, and cleaning up the duplicates later requires an extra operation. $addToSet is the operator designed for this case: it appends the value only if an equal value is not already present in the array, making repeated calls idempotent and keeping the array free of duplicates, which is the desired behavior whenever the array models a set rather than an ordered list that permits repetition.',
        whyHi: '`$push` apni value ko array mein unconditionally append karता hai, har baar jab ye chalता hai, to ise ek hi value ke saath ek se zyada baar call karna array ko duplicate entries ke saath chhoड़ता hai. Ek array ke liye jo distinct values ke ek set ko represent karna chाहता hai, ye ek bug hai. `$addToSet` is case ke liye design kiya gaya operator hai: ye value ko sirf tab append karता hai agar ek equal value pehle se maujood nahi hai.',
      },
      {
        wrong: `// using $ (positional) without a matching array condition in the query filter
await db.carts.updateOne({ _id: 1 }, { $set: { "items.$.qty": 99 } });
// ERROR: The positional operator did not find the match needed from the query
// -- $ needs the FILTER to have matched a specific array element to point at`,
        right: `await db.carts.updateOne(
  { _id: 1, "items.sku": "b" },   // this array condition is what $ refers to
  { $set: { "items.$.qty": 99 } }
);
// $ = "the first items element matching items.sku === 'b'"`,
        why: 'The positional $ operator in an update\'s field path is a placeholder for the index of the array element that the query filter matched, so it can only work when the filter actually contains a condition on that array that identifies a specific element. Using $ with a filter that only matches on the document as a whole, such as filtering by _id alone, gives the operator nothing to resolve to, and MongoDB raises an error rather than guessing which element was meant. The correct usage always pairs the $ in the update with a condition in the filter that constrains the same array, such as matching on a field of the array\'s sub-documents, so that $ unambiguously refers to the first element that condition selected.',
        whyHi: 'Ek update ke field path mein positional `$` operator us array element ke index ke liye ek placeholder hai jise query filter ne match kiya, to ye sirf tab kaam kar sakta hai jab filter mein us array par ek condition ho jo ek specific element identify karता hai. `$` ko ek aisе filter ke saath istemal karna jo sirf poore document par match karता hai operator ko resolve karne ke liye kuch nahi deta, aur MongoDB ek error raise karता hai.',
      },
    ],

    realWorld: [
      {
        en: '**A `user.roles` array managed entirely with `$addToSet` (grant) and `$pull` (revoke)** — repeated grant calls stay idempotent, and a role appears at most once.',
        hi: '**Ek `user.roles` array poori tarah `$addToSet` (grant) aur `$pull` (revoke) se managed** — repeated grant calls idempotent rehते hain.',
      },
      {
        en: '**A "recent activity" array capped with `$push: { events: { $each: [newEvent], $sort: { at: -1 }, $slice: 20 } }`** — every push re-sorts and keeps only the 20 most recent, a bounded array by construction.',
        hi: '**Ek "recent activity" array `$push: { events: { $each: [...], $sort: ..., $slice: 20 } }` se capped** — har push sirf 20 sabse recent rakhता hai.',
      },
      {
        en: '**An order-line quantity update using `updateOne({ _id, "lines.productId": pid }, { $set: { "lines.$.qty": newQty } })`** — the positional `$` updates exactly the matched line without touching the others.',
        hi: '**Ek order-line quantity update `updateOne({ _id, "lines.productId": pid }, { $set: { "lines.$.qty": newQty } })` istemal karके** — positional `$` theek matched line update karता hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between { "items.a": x, "items.b": y } and { items: { $elemMatch: { a: x, b: y } } } for an array of sub-documents?',
        qHi: 'Sub-documents ke ek array ke liye `{ "items.a": x, "items.b": y }` aur `{ items: { $elemMatch: { a: x, b: y } } }` mein kya antar hai?',
        a: 'The first form, using two separate dot-notation conditions, evaluates each condition against the array independently, so the document matches if the array contains at least one element where field a equals x and at least one element where field b equals y, and crucially those two elements are allowed to be different elements. The second form, using $elemMatch, requires that a single element of the array satisfies both conditions at the same time, that is, one element where a equals x and b equals y together. These produce different results whenever an array can contain some elements matching one condition and other elements matching the other, and the $elemMatch form is almost always the intended meaning when a query has multiple conditions on the same array of sub-documents, because the usual goal is to find documents containing a specific kind of element, not documents that happen to contain the two conditions spread across separate elements. The independent-conditions form is only correct when you genuinely mean "somewhere in this array, separately."',
        aHi: 'Pehla form, do alag dot-notation conditions istemal karके, har condition ko array ke against independently evaluate karता hai, to document match karता hai agar array mein kam se kam ek element hai jahaan field a x ke barabar hai aur kam se kam ek element jahaan field b y ke barabar hai, aur wo do elements alag ho sakte hain. Doosra form, `$elemMatch` istemal karके, ki zaroorat hai ki array ka ek single element dono conditions ko ek saath satisfy karे. `$elemMatch` form lगभग hamesha intended meaning hai jab ek query mein usī array of sub-documents par кई conditions hon.',
      },
      {
        q: 'When would you use $push versus $addToSet, and what do the positional operators $, $[], and $[<id>] each do?',
        qHi: 'Aap `$push` versus `$addToSet` kab istemal karोge, aur positional operators `$`, `$[]`, aur `$[<id>]` har ek kya karте hain?',
        a: '$push unconditionally appends its value to the array on every invocation, allowing duplicates, which is correct when the array is an ordered log where repeated values are meaningful, and it supports modifiers like $each for multiple values, $sort, and $slice for keeping the array bounded. $addToSet appends the value only if an equal value is not already present, treating the array as a set, which is correct when the array represents a collection of distinct values such as roles or tags, and it makes repeated calls idempotent so a retried operation does not create a duplicate. The positional operators control which array elements an update modifies: a plain $ in the update path refers to the first array element that the query filter matched, so it requires the filter to contain a condition identifying an element of that array; $[] refers to every element of the array, applying the update to all of them; and $[<identifier>] refers to every element matching a named condition supplied in the arrayFilters option, so it applies the update only to the subset of elements that satisfy that condition.',
        aHi: '`$push` apni value ko array mein har invocation par unconditionally append karता hai, duplicates allow karते hue. `$addToSet` value ko sirf tab append karता hai agar ek equal value pehle se maujood nahi hai, array ko ek set ke roop mein treat karते hue. Positional operators control karते hain ki ek update kaunse array elements modify karता hai: ek plain `$` update path mein us pehle array element ko refer karता hai jise query filter ne match kiya; `$[]` array ke har element ko refer karता hai; aur `$[<identifier>]` `arrayFilters` mein diye ek named condition se matching har element ko refer karता hai.',
      },
    ],

    exercises: [
      {
        task: 'Insert `{ _id: 1, title: "p", tags: ["a", "b"] }`. Apply `$push` of `"c"`, then `$addToSet` of `"b"` (already present), then `$pull` of `"a"`. Confirm the final `tags` array is `["b", "c"]`.',
        taskHi: '`{ _id: 1, title: "p", tags: ["a", "b"] }` insert karo. `"c"` ka `$push`, phir `"b"` ka `$addToSet` (pehle se maujood), phir `"a"` ka `$pull` apply karo. Confirm karo final `tags` array `["b", "c"]` hai.',
        hint: '`$push` always appends; `$addToSet` of an already-present value is a no-op; `$pull` removes every matching element.',
        hintHi: '`$push` hamesha append karता hai; ek pehle-se-maujood value ka `$addToSet` ek no-op hai; `$pull` har matching element hataता hai.',
      },
      {
        task: 'Insert two orders: one with `items: [{ sku: "x", qty: 5 }, { sku: "y", qty: 1 }]`, one with `items: [{ sku: "x", qty: 1 }]`. Write an `$elemMatch` query for orders containing an item with `sku: "x"` AND `qty > 2`. Confirm only the first order matches.',
        taskHi: 'Do orders insert karo: ek `items: [{ sku: "x", qty: 5 }, { sku: "y", qty: 1 }]` ke saath, ek `items: [{ sku: "x", qty: 1 }]` ke saath. Un orders ke liye ek `$elemMatch` query likho jinme `sku: "x"` AUR `qty > 2` waala ek item hai.',
        hint: '`{ items: { $elemMatch: { sku: "x", qty: { $gt: 2 } } } }` — requires one single element to satisfy both. The second order\'s only "x" item has qty 1, so it does not match.',
        hintHi: '`{ items: { $elemMatch: { sku: "x", qty: { $gt: 2 } } } }` — ek single element ko dono satisfy karna zaroori hai.',
      },
      {
        task: 'Insert `{ _id: 1, items: [{ sku: "a", qty: 1 }, { sku: "b", qty: 1 }] }`. Use `updateOne` with a filter of `{ _id: 1, "items.sku": "b" }` and `$set` on `"items.$.qty"` to set it to 99. Confirm only the `"b"` element\'s qty changed.',
        taskHi: '`{ _id: 1, items: [{ sku: "a", qty: 1 }, { sku: "b", qty: 1 }] }` insert karo. `{ _id: 1, "items.sku": "b" }` filter aur `"items.$.qty"` par `$set` ke saath `updateOne` istemal karke ise 99 set karo.',
        hint: 'The positional `$` refers to the first `items` element the filter matched — here, the one with `sku: "b"`. The filter MUST contain the array condition for `$` to have something to point at.',
        hintHi: 'Positional `$` us pehle `items` element ko refer karता hai jise filter ne match kiya. Filter mein array condition HONA zaroori hai.',
      },
    ],

    keyTakeaways: [
      'PLAIN EQUALITY on an array field is automatically a "contains" match — `{ tags: "vip" }` matches any doc whose `tags` array contains `"vip"`. Positional: `{ "tags.0": "vip" }` matches only if the FIRST element is `"vip"`.',
      '`$all`: array contains ALL listed values (any order, extras fine). `$size`: array has EXACTLY N elements (no range — for "at least N" use `{ "tags.<N-1>": { $exists: true } }`).',
      '`$elemMatch`: ONE SINGLE array element must satisfy ALL the listed conditions together. Without it, `{ "items.sku": "x", "items.qty": { $gt: 2 } }` matches if SOME element has `sku: "x"` and SOME (possibly different) element has `qty > 2` — usually NOT what you want. Use `$elemMatch` for multiple conditions on one array-of-subdocs.',
      'MODIFY: `$push` (append, duplicates OK; modifiers `$each`/`$sort`/`$slice`/`$position`), `$addToSet` (append ONLY if not already present — makes retries idempotent, use for set-like arrays), `$pull` (remove EVERY element matching a value/condition), `$pop` (`1` = remove last, `-1` = remove first).',
      'POSITIONAL update operators: `$` = the FIRST array element the QUERY FILTER matched (the filter MUST contain a condition on that array, else error). `$[]` = EVERY element. `$[<id>]` = every element matching a named condition in `arrayFilters`.',
      'Common bug: `$push` where you meant `$addToSet` → duplicate entries on a retry. Common bug: `$` positional with a filter that only matches on `_id` → "positional operator did not find the match needed" error.',
    ],
    keyTakeawaysHi: [
      'Ek array field par PLAIN EQUALITY automatically ek "contains" match hai — `{ tags: "vip" }` kisī bhi doc ko match karता hai jiska `tags` array `"vip"` contain karता hai. Positional: `{ "tags.0": "vip" }` sirf tab match karता hai agar PEHLA element `"vip"` hai.',
      '`$all`: array SAARI listed values contain karता hai. `$size`: array mein THEEK N elements hain (koi range nahi).',
      '`$elemMatch`: EK SINGLE array element ko SAARI listed conditions saath satisfy karna zaroori hai. Iske bina, `{ "items.sku": "x", "items.qty": { $gt: 2 } }` match karता hai agar KOI element ka `sku: "x"` hai aur KOI (shАyad alag) element ka `qty > 2` hai — usually jo aap NAHI chाहते.',
      'MODIFY: `$push` (append, duplicates OK), `$addToSet` (append SIRF agar pehle se nahi hai — retries idempotent banata hai), `$pull` (ek value/condition match karता HAR element remove karो), `$pop` (`1` = aakhri, `-1` = pehla).',
      'POSITIONAL update operators: `$` = wo PEHLA array element jise QUERY FILTER ne match kiya (filter mein us array par ek condition HONA zaroori hai). `$[]` = HAR element. `$[<id>]` = `arrayFilters` mein ek named condition se matching har element.',
      'Common bug: `$push` jahaan aapका matlab `$addToSet` tha → ek retry par duplicate entries. Common bug: `$` positional ek aisе filter ke saath jo sirf `_id` par match karता hai → error.',
    ],
  },

  {
    slug: 'mongo-deleting-and-the-crud-recap',
    title: 'Deleting Documents & the CRUD Recap',
    titleHi: 'Documents Delete Karna Aur CRUD Recap',
    description: 'deleteOne removes the first match, deleteMany removes all matches, and findOneAndDelete removes a document and returns it. This lesson also steps back to see the whole CRUD surface — create, read, update, delete — as one consistent shape.',
    descriptionHi: '`deleteOne` pehla match hataता hai, `deleteMany` saare matches hataता hai, aur `findOneAndDelete` ek document hataता hai aur ise lautaता hai. Ye lesson poore CRUD surface ko bhi dekhने ke liye peeche hataता hai — create, read, update, delete — ek consistent shape ke roop mein.',
    difficulty: 'EASY',
    duration: 20,
    order: 6,

    analogy: {
      en: '**Shredding one file, shredding a whole drawer, or pulling a file to hand to someone before it goes in the shredder.** `deleteOne` is shredding the first file matching a description; `deleteMany` is emptying every file matching it out of the drawer at once; `findOneAndDelete` is pulling that file, handing it to you to look at, and only then shredding it — you get the contents one last time. Stepping back, all four CRUD verbs share the same grammar: every read, update, and delete starts with a **filter** describing which documents; create is the one that starts with the documents themselves. Learn that one filter language (Lesson 3) and it works identically everywhere.',
      hi: '**Ek file shred karna, ek poora drawer shred karna, ya ek file pull karके kisī ko dene se pehle wo shredder mein jaaye.** `deleteOne` ek description se matching pehli file shred karna hai; `deleteMany` drawer se ise match karti har file ek saath khaali karna hai; `findOneAndDelete` us file ko pull karके, aapको dekhने ke liye deना, aur tabhi ise shred karna hai. Peeche hatकар, chaаron CRUD verbs wahi grammar share karते hain: har read, update, aur delete ek **filter** se shuru hota hai. Wo ek filter language (Lesson 3) seekho aur ye har jagah identically kaam karता hai.',
    },

    simple: `**\`deleteOne(filter)\` -- removes the FIRST match; \`deleteMany(filter)\` -- removes ALL matches**

\`\`\`js
await db.users.deleteOne({ status: "spam" });    // -> { deletedCount: 1 }
await db.users.deleteMany({ status: "spam" });   // -> { deletedCount: <however many matched> }
await db.users.deleteMany({});                    // deletes EVERY document (be careful)
\`\`\`

**\`findOneAndDelete(filter)\` -- removes a document AND returns it**

\`\`\`js
const removed = await db.jobs.findOneAndDelete({ status: "done" });
// removed -> the full document that was deleted (or null if nothing matched)
\`\`\`

**\`bulkWrite\` -- many mixed operations (inserts, updates, deletes) in ONE round trip**

\`\`\`js
await db.users.bulkWrite([
  { insertOne: { document: { _id: 9, name: "New" } } },
  { updateOne: { filter: { _id: 1 }, update: { $set: { active: true } } } },
  { deleteOne: { filter: { _id: 2 } } },
]);
\`\`\`

**THE CRUD SHAPE -- every operation is (filter, and/or document):**
\`\`\`
CREATE  insertOne(doc)            insertMany([docs])
READ    findOne(filter)           find(filter) -> cursor
UPDATE  updateOne(filter, $ops)   updateMany(filter, $ops)   replaceOne(filter, doc)
DELETE  deleteOne(filter)         deleteMany(filter)
+ the findOneAnd* variants that also RETURN the affected document
+ { upsert: true } on updates; the SAME filter language (Lesson 3) everywhere
\`\`\``,

    simpleHi: `**\`deleteOne(filter)\` -- PEHLA match hataता hai; \`deleteMany(filter)\` -- SAARE matches hataता hai**

\`\`\`js
await db.users.deleteOne({ status: "spam" });    // -> { deletedCount: 1 }
await db.users.deleteMany({ status: "spam" });   // -> { deletedCount: <jitne match hue> }
await db.users.deleteMany({});                    // HAR document delete karता hai (saawdhan)
\`\`\`

**\`findOneAndDelete(filter)\` -- ek document hataता hai AUR ise lautaता hai**

\`\`\`js
const removed = await db.jobs.findOneAndDelete({ status: "done" });
// removed -> wo poora document jo delete hua (ya null agar kuch match nahi hua)
\`\`\`

**\`bulkWrite\` -- кई mixed operations EK round trip mein**

\`\`\`js
await db.users.bulkWrite([
  { insertOne: { document: { _id: 9, name: "New" } } },
  { updateOne: { filter: { _id: 1 }, update: { $set: { active: true } } } },
  { deleteOne: { filter: { _id: 2 } } },
]);
\`\`\`

**CRUD SHAPE -- har operation (filter, aur/ya document) hai:**
\`\`\`
CREATE  insertOne(doc)            insertMany([docs])
READ    findOne(filter)           find(filter) -> cursor
UPDATE  updateOne(filter, $ops)   updateMany(filter, $ops)   replaceOne(filter, doc)
DELETE  deleteOne(filter)         deleteMany(filter)
+ findOneAnd* variants jo affected document bhi RETURN karte hain
+ updates par { upsert: true }; har jagah WAHI filter language (Lesson 3)
\`\`\``,

    content: `## Deleting

\`\`\`js
await db.users.deleteOne({ status: "spam" });
await db.users.deleteMany({ status: "spam" });
\`\`\`

- **\`deleteOne(filter)\`** removes the first document matching the filter and returns \`{ deletedCount: 0 or 1 }\`.
- **\`deleteMany(filter)\`** removes every matching document and returns \`{ deletedCount: N }\`.
- **\`deleteMany({})\`** — an empty filter matches everything, so this empties the collection. There is no confirmation prompt; treat it with the same caution as a SQL \`DELETE\` with no \`WHERE\`.

MongoDB has no cascading delete and no foreign keys (Module 14 covers what replaces referential integrity in a document model), so deleting a document does not automatically touch documents in other collections that reference it — that cleanup, if needed, is the application's responsibility.

## \`findOneAndDelete\`

\`\`\`js
const removed = await db.jobs.findOneAndDelete({ status: "done" });
\`\`\`

Deletes the first matching document and **returns it** (or \`null\` if nothing matched). Like \`findOneAndUpdate\`, this is for atomic patterns — pull a document out of a collection and process its contents in one step, with a guarantee no other operation can grab or modify it in between.

## \`bulkWrite\`

\`\`\`js
await db.users.bulkWrite([
  { insertOne: { document: { _id: 9, name: "New" } } },
  { updateOne: { filter: { _id: 1 }, update: { $set: { active: true } } } },
  { deleteOne: { filter: { _id: 2 } } },
]);
\`\`\`

\`bulkWrite\` sends an array of mixed write operations — inserts, updates, replaces, deletes — to the server in a single round trip, which is dramatically faster than issuing them one at a time when you have many writes to apply. By default the operations execute in order and stop on the first error; passing \`{ ordered: false }\` lets independent operations continue past a failure.

## The CRUD surface as one shape

Every operation in this module fits one consistent grammar:

| | operation | takes |
|---|---|---|
| **Create** | \`insertOne\` / \`insertMany\` | document(s) |
| **Read** | \`findOne\` / \`find\` | filter (+ projection) |
| **Update** | \`updateOne\` / \`updateMany\` | filter + update document (\`$\`-operators) |
| | \`replaceOne\` | filter + a plain document |
| **Delete** | \`deleteOne\` / \`deleteMany\` | filter |

On top of that:

- The **\`findOneAndUpdate\` / \`findOneAndDelete\` / \`findOneAndReplace\`** variants do the write *and* return the affected document — the tools for atomic read-modify-write.
- **\`{ upsert: true }\`** on any update turns "update" into "update, or insert if absent."
- The **filter language** (Lesson 3 — comparison, \`$in\`, \`$exists\`, \`$or\`, \`$elemMatch\`, dot notation) is *identical* everywhere a filter appears: the same expression that selects documents to read also selects documents to update or delete.

That consistency is the payoff of learning the filter language once. The next three modules build on this foundation: Module 14 is data modeling (how to decide what goes in a document versus a separate collection), Module 15 is aggregation and indexes (transforming and analyzing data, and making all of this fast), and Module 16 is operations and distribution (replica sets, transactions, sharding).`,

    contentHi: `## Deleting

\`\`\`js
await db.users.deleteOne({ status: "spam" });
await db.users.deleteMany({ status: "spam" });
\`\`\`

- **\`deleteOne(filter)\`** filter se matching pehla document hataता hai aur \`{ deletedCount: 0 ya 1 }\` lautaता hai.
- **\`deleteMany(filter)\`** har matching document hataता hai.
- **\`deleteMany({})\`** — ek empty filter sab kuch match karता hai, to ye collection khaali kar deता hai. Koi confirmation prompt nahi hai.

MongoDB mein koi cascading delete aur koi foreign keys nahi hain (Module 14), to ek document delete karna doosri collections ke documents ko automatically touch nahi karता — wo cleanup application ki responsibility hai.

## \`findOneAndDelete\`

\`\`\`js
const removed = await db.jobs.findOneAndDelete({ status: "done" });
\`\`\`

Pehla matching document delete karता hai aur **ise lautaता hai** (ya \`null\`). Atomic patterns ke liye.

## \`bulkWrite\`

\`\`\`js
await db.users.bulkWrite([
  { insertOne: { document: { _id: 9, name: "New" } } },
  { updateOne: { filter: { _id: 1 }, update: { $set: { active: true } } } },
  { deleteOne: { filter: { _id: 2 } } },
]);
\`\`\`

\`bulkWrite\` mixed write operations ka ek array server ko ek single round trip mein bhejता hai. Default se operations order mein execute hote hain aur pehli error par ruk jaते hain; \`{ ordered: false }\` independent operations ko ek failure ke past continue karne deता hai.

## CRUD surface ek shape ke roop mein

| | operation | leta hai |
|---|---|---|
| **Create** | \`insertOne\` / \`insertMany\` | document(s) |
| **Read** | \`findOne\` / \`find\` | filter (+ projection) |
| **Update** | \`updateOne\` / \`updateMany\` | filter + update document |
| | \`replaceOne\` | filter + ek plain document |
| **Delete** | \`deleteOne\` / \`deleteMany\` | filter |

- **\`findOneAndUpdate\` / \`findOneAndDelete\` / \`findOneAndReplace\`** variants write karते hain *aur* affected document lautaते hain.
- **\`{ upsert: true }\`** kisī bhi update par "update" ko "update, ya insert agar absent" banata hai.
- **Filter language** har jagah *identical* hai jahaan ek filter aata hai.

Agle teen modules is foundation par bante hain: Module 14 data modeling, Module 15 aggregation aur indexes, Module 16 operations aur distribution.`,

    examples: [
      {
        title: 'deleteOne removes one match; deleteMany removes all matches',
        titleHi: 'deleteOne ek match hataता hai; deleteMany saare matches hataता hai',
        code: `await db.msgs.insertMany([{ _id: 1, k: "x" }, { _id: 2, k: "x" }, { _id: 3, k: "y" }]);
const r1 = await db.msgs.deleteOne({ k: "x" });
const r2 = await db.msgs.deleteMany({ k: "x" });
print({ deleteOne: r1.deletedCount, deleteMany: r2.deletedCount });
print(await db.msgs.find({}).toArray());`,
        output: `{"deleteOne":1,"deleteMany":1}
[{"_id":3,"k":"y"}]`,
        explain: '`deleteOne({ k: "x" })` removes the first `"x"` document (id 1) → `deletedCount: 1`. `deleteMany({ k: "x" })` then removes all remaining `"x"` documents — just id 2 at this point → `deletedCount: 1`. Only the `"y"` document (id 3) survives.',
        explainHi: '`deleteOne({ k: "x" })` pehla `"x"` document (id 1) hataता hai → `deletedCount: 1`. `deleteMany({ k: "x" })` phir baaki saare `"x"` documents hataता hai — is point par sirf id 2 → `deletedCount: 1`. Sirf `"y"` document (id 3) bachता hai.',
      },
      {
        title: 'findOneAndDelete removes a document and returns it',
        titleHi: 'findOneAndDelete ek document hataता hai aur ise lautaता hai',
        code: `await db.jobs.insertOne({ _id: 1, name: "Ravi", age: 30 });
const removed = await db.jobs.findOneAndDelete({ _id: 1 });
print(removed);
print(await db.jobs.find({}).toArray());`,
        output: `{"_id":1,"name":"Ravi","age":30}
[]`,
        explain: '`findOneAndDelete({ _id: 1 })` removes the matching document and RETURNS it in full — the atomic "pull it out and hand it to me" operation. The subsequent `find({})` confirms the collection is now empty.',
        explainHi: '`findOneAndDelete({ _id: 1 })` matching document ko hataता hai aur ise POORA RETURN karta hai — atomic "ise nikalो aur mujhe do" operation. Baad ka `find({})` confirm karta hai ki collection ab empty hai.',
      },
      {
        title: 'bulkWrite applies an insert, an update, and a delete in one call',
        titleHi: 'bulkWrite ek insert, ek update, aur ek delete ek call mein apply karta hai',
        code: `await db.users.insertMany([{ _id: 1, active: false }, { _id: 2, active: false }]);
await db.users.bulkWrite([
  { insertOne: { document: { _id: 9, name: "New" } } },
  { updateOne: { filter: { _id: 1 }, update: { $set: { active: true } } } },
  { deleteOne: { filter: { _id: 2 } } },
]);
print(await db.users.find({}).sort({ _id: 1 }).toArray());`,
        output: `[{"_id":1,"active":true},{"_id":9,"name":"New"}]`,
        explain: 'One `bulkWrite` call applies three different operations in a single server round trip: `insertOne` adds `{ _id: 9, name: "New" }`, `updateOne` sets id 1\'s `active` to `true`, and `deleteOne` removes id 2. The final collection is `[{ _id: 1, active: true }, { _id: 9, name: "New" }]`.',
        explainHi: 'Ek `bulkWrite` call ek single server round trip mein teen alag operations apply karta hai: `insertOne` `{ _id: 9, name: "New" }` add karta hai, `updateOne` id 1 ka `active` `true` set karta hai, aur `deleteOne` id 2 hataता hai. Final collection `[{ _id: 1, active: true }, { _id: 9, name: "New" }]` hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// deleteMany with a filter that's accidentally empty (a variable that came back undefined)
const filter = buildFilter(req.query);   // returns {} when req.query has no recognized keys
await db.records.deleteMany(filter);
// {} matches EVERY document -- the entire collection is deleted, no warning`,
        right: `const filter = buildFilter(req.query);
if (Object.keys(filter).length === 0) {
  throw new Error("refusing to deleteMany with an empty filter");
}
await db.records.deleteMany(filter);
// guard against the empty-filter case explicitly, since {} is a valid (catastrophic) filter`,
        why: 'An empty filter object is a completely valid MongoDB filter that matches every document in the collection, which is intentional and useful for operations like counting all documents or, deliberately, clearing a collection. The danger is that an empty filter can also arise by accident, most commonly when code that builds a filter from user input or configuration produces an empty object because none of the expected inputs were present, and that empty object then flows into deleteMany, which proceeds to delete the entire collection without any error or confirmation because from MongoDB\'s perspective the request is well-formed. Because there is no built-in safeguard against this, code that constructs delete filters dynamically should explicitly check for the empty-filter case and refuse to proceed, treating an unexpectedly empty filter as a bug rather than a valid instruction to wipe the collection.',
        whyHi: 'Ek empty filter object ek poori tarah valid MongoDB filter hai jo collection ke har document ko match karता hai. Danger ye hai ki ek empty filter accidentally bhi aa sakta hai, sabse common taur par jab user input se ek filter banane waala code ek empty object produce karता hai. Kyunki iske against koi built-in safeguard nahi hai, dynamically delete filters banane waala code ko explicitly empty-filter case check karna chahiye aur aage badने se refuse karna chahiye.',
      },
      {
        wrong: `// expecting deleting a document to also delete documents that reference it
await db.authors.deleteOne({ _id: authorId });
// db.books still has books with { authorId: authorId } -- MongoDB has no
// foreign keys and no cascading delete; those book documents are now orphaned`,
        right: `// clean up references explicitly (or model differently -- Module 14):
await db.books.deleteMany({ authorId: authorId });   // or set authorId: null, or reassign
await db.authors.deleteOne({ _id: authorId });`,
        why: 'MongoDB does not implement foreign keys or referential integrity between collections, so a document in one collection that stores the identifier of a document in another collection is holding nothing more than a plain value, with no database-enforced relationship, and deleting the referenced document has no automatic effect on the documents that referenced it. This is a deliberate consequence of the document model, which encourages keeping closely related data together in one document precisely so that cross-collection references and their cleanup are needed less often, but when references between collections do exist, maintaining consistency when one side is deleted is entirely the application\'s responsibility: it must decide whether to delete the referencing documents, null out the reference, or reassign it, and perform that operation itself. Module 14\'s data modeling lesson covers how to structure documents to minimize how often this manual cleanup is required.',
        whyHi: 'MongoDB collections ke beech foreign keys ya referential integrity implement nahi karta, to ek collection mein ek document jo doosri collection ke ek document ka identifier store karता hai ek plain value se zyada kuch nahi rakhता, koi database-enforced relationship ke bina. Jab collections ke beech references exist karते hain, ek side delete hone par consistency maintain karна poori tarah application ki responsibility hai.',
      },
      {
        wrong: `// issuing 10,000 individual deleteOne calls in a loop
for (const id of idsToDelete) {
  await db.records.deleteOne({ _id: id });   // 10,000 separate round trips to the server
}`,
        right: `// one deleteMany with an $in filter:
await db.records.deleteMany({ _id: { $in: idsToDelete } });
// or, if the operations are genuinely mixed (some inserts, some updates, some
// deletes), one bulkWrite instead of a loop of individual calls`,
        why: 'Each individual write operation issued to MongoDB involves a round trip to the server, and while a single round trip is fast, performing thousands of them sequentially in a loop makes the total time dominated by network latency multiplied by the number of operations rather than by the actual work of deleting documents. When the operations are all deletes selectable by a single filter, a single deleteMany with an $in condition on the ids accomplishes the same result in one round trip. When the operations are genuinely heterogeneous, a mix of inserts, updates, and deletes, bulkWrite sends the whole batch to the server in one round trip while still applying each operation individually, which is the right tool for applying many writes efficiently regardless of their types.',
        whyHi: 'MongoDB ko issue kiya gaya har individual write operation server tak ek round trip involve karता hai, aur ek loop mein hazaron sequentially perform karna total time ko network latency ki number of operations se multiply se dominated banata hai. Jab operations sab deletes hain jo ek single filter se selectable hain, ek `$in` condition ke saath ek single `deleteMany` wahi result ek round trip mein accomplish karता hai. Jab operations genuinely heterogeneous hain, `bulkWrite` poore batch ko ek round trip mein bhejता hai.',
      },
    ],

    realWorld: [
      {
        en: '**A retention job that runs `deleteMany({ createdAt: { $lt: cutoff } })` nightly** — one operation removes every expired document, far cheaper than a per-document loop.',
        hi: '**Ek retention job jo raat ko `deleteMany({ createdAt: { $lt: cutoff } })` chalata hai** — ek operation har expired document hataता hai.',
      },
      {
        en: '**A queue worker using `findOneAndDelete({ status: "ready" }, { sort: { priority: -1 } })`** — atomically claims and removes the highest-priority ready job, returning its full payload to process.',
        hi: '**Ek queue worker jo `findOneAndDelete({ status: "ready" }, { sort: { priority: -1 } })` istemal karta hai** — atomically highest-priority job claim aur remove karta hai.',
      },
      {
        en: '**A sync process that batches all its changes into one `bulkWrite` per collection** — a mix of upserts for changed records and deletes for removed ones, applied in a single server round trip.',
        hi: '**Ek sync process jo apne saare changes ko prati-collection ek `bulkWrite` mein batch karta hai** — ek single server round trip mein apply.',
      },
    ],

    interviewQA: [
      {
        q: 'What happens when you call deleteMany with an empty filter, and why is that dangerous?',
        qHi: 'Jab aap ek empty filter ke saath `deleteMany` call karते ho to kya hota hai, aur wo dangerous kyun hai?',
        a: 'An empty filter object matches every document in the collection, so deleteMany with an empty filter deletes the entire collection, immediately and with no confirmation prompt, because from MongoDB\'s point of view an empty filter is a perfectly valid and well-formed request. This is intentional and occasionally what you want, for example when deliberately clearing a collection, but it becomes dangerous when an empty filter arises unintentionally. The most common way that happens is code that builds a filter dynamically from user input, request parameters, or configuration, and produces an empty object because none of the expected inputs were present or recognized, after which that empty object flows unchanged into deleteMany and wipes the collection. Because MongoDB provides no built-in safeguard against this, any code path that constructs delete filters programmatically should explicitly check whether the resulting filter is empty and refuse to execute the delete if so, treating an unexpectedly empty filter as a bug rather than a valid instruction.',
        aHi: 'Ek empty filter object collection ke har document ko match karता hai, to ek empty filter ke saath `deleteMany` poori collection ko delete karता hai, turant aur koi confirmation prompt ke bina, kyunki MongoDB ke point of view se ek empty filter ek poori tarah valid request hai. Ye dangerous ban jaता hai jab ek empty filter unintentionally aata hai, sabse common taur par jab code user input se ek filter dynamically banata hai. Kyunki MongoDB iske against koi built-in safeguard nahi deta, delete filters programmatically banane waale kisī bhi code path ko explicitly check karna chahiye.',
      },
      {
        q: 'Describe the consistent shape shared by all of MongoDB\'s CRUD operations.',
        qHi: 'MongoDB ke saare CRUD operations dwara share kiya gaya consistent shape describe karo.',
        a: 'Every MongoDB CRUD operation is built from at most two ingredients: a filter document describing which documents the operation applies to, and, for operations that write, a document describing what to write. Create is the exception that takes only a document or array of documents and no filter, since there is nothing to select yet. Read, in the form of findOne or find, takes a filter and returns either a single document or a cursor over all matches, optionally shaped by a projection. Update, in the form of updateOne or updateMany, takes a filter plus an update document expressed with dollar-prefixed operators like $set, while replaceOne takes a filter plus a plain replacement document. Delete, in the form of deleteOne or deleteMany, takes only a filter. Layered on top are the findOneAnd variants, which perform an update, replace, or delete and additionally return the affected document for atomic read-modify-write patterns, and the upsert option on updates, which inserts a new document when the filter matches nothing. Crucially, the filter language itself, comparison operators, membership operators, existence checks, logical combinators, dot notation, and $elemMatch, is exactly the same everywhere a filter appears, so the same expression that selects documents to read also selects documents to update or delete, which is what makes learning the filter language once pay off across the entire API.',
        aHi: 'Har MongoDB CRUD operation zyada se zyada do ingredients se bana hai: ek filter document jo bataता hai operation kaunse documents par apply hota hai, aur, write karne waale operations ke liye, ek document jo bataता hai kya write karna hai. Create exception hai jo sirf ek document leta hai aur koi filter nahi. Read ek filter leta hai. Update ek filter plus ek update document leta hai; `replaceOne` ek filter plus ek plain replacement document leta hai. Delete sirf ek filter leta hai. Upar `findOneAnd` variants hain aur updates par `upsert` option. Filter language khud har jagah bilkul same hai jahaan ek filter aata hai.',
      },
    ],

    exercises: [
      {
        task: 'Insert three documents with a `k` field of `"x"`, `"x"`, `"y"`. Run `deleteOne({ k: "x" })` then `deleteMany({ k: "x" })`. Confirm the first reports `deletedCount: 1`, the second reports `deletedCount: 1`, and only the `"y"` document remains.',
        taskHi: 'Ek `k` field `"x"`, `"x"`, `"y"` ke saath teen documents insert karo. `deleteOne({ k: "x" })` phir `deleteMany({ k: "x" })` chalao. Confirm karo pehla `deletedCount: 1` report karता hai, doosरा `deletedCount: 1`, aur sirf `"y"` document rehта hai.',
        hint: '`deleteOne` removes the first match; `deleteMany` removes all remaining matches. After both, one `"x"` was removed by each, leaving only `"y"`.',
        hintHi: '`deleteOne` pehla match hataता hai; `deleteMany` baaki saare matches hataता hai.',
      },
      {
        task: 'Insert `{ _id: 1, name: "Ravi", age: 30 }`. Call `findOneAndDelete({ _id: 1 })` and confirm it returns the full deleted document, and that a subsequent `find({})` returns an empty array.',
        taskHi: '`{ _id: 1, name: "Ravi", age: 30 }` insert karo. `findOneAndDelete({ _id: 1 })` call karo aur confirm karo ye poora deleted document lautaता hai, aur baad ka `find({})` ek empty array lautaता hai.',
        hint: '`findOneAndDelete` removes the matching document and returns it (or `null` if nothing matched) — the atomic "pull it out and hand it to me" operation.',
        hintHi: '`findOneAndDelete` matching document ko hataता hai aur ise lautaता hai — atomic "ise nikalो aur mujhe do" operation.',
      },
      {
        task: 'Insert `{ _id: 1, active: false }` and `{ _id: 2, active: false }`. Run one `bulkWrite` that: inserts `{ _id: 9, name: "New" }`, sets `_id: 1`\'s `active` to `true`, and deletes `_id: 2`. Confirm the collection ends up as `[{ _id: 1, active: true }, { _id: 9, name: "New" }]`.',
        taskHi: '`{ _id: 1, active: false }` aur `{ _id: 2, active: false }` insert karo. Ek `bulkWrite` chalao jo: `{ _id: 9, name: "New" }` insert karता hai, `_id: 1` ka `active` `true` set karता hai, aur `_id: 2` delete karता hai.',
        hint: '`bulkWrite` takes an array of `{ insertOne | updateOne | deleteOne | ... }` operation objects and applies them all in one server round trip.',
        hintHi: '`bulkWrite` `{ insertOne | updateOne | deleteOne | ... }` operation objects ka ek array leta hai aur unhe ek server round trip mein apply karता hai.',
      },
    ],

    keyTakeaways: [
      '`deleteOne(filter)` removes the FIRST match → `{ deletedCount: 0|1 }`. `deleteMany(filter)` removes ALL matches → `{ deletedCount: N }`. `deleteMany({})` matches EVERYTHING and empties the collection — no confirmation prompt, same caution as SQL `DELETE` with no `WHERE`. Guard dynamically-built delete filters against being accidentally empty.',
      'MongoDB has NO foreign keys and NO cascading delete — deleting a document does NOT touch documents in other collections that reference it. Cross-collection cleanup is entirely the application\'s job (Module 14 covers modeling to minimize how often this is needed).',
      '`findOneAndDelete(filter)` removes a document AND returns it (or `null`) — the atomic "pull it out and process it" operation, like `findOneAndUpdate`.',
      '`bulkWrite([ops])` sends many MIXED write operations (inserts/updates/replaces/deletes) in ONE round trip — dramatically faster than a loop of individual calls. Default: ordered, stops on first error; `{ ordered: false }` continues past failures.',
      'THE CRUD SHAPE — every operation is (filter and/or document): CREATE = doc(s) only; READ = filter (+ projection); UPDATE = filter + `$`-operator update doc (or `replaceOne` = filter + plain doc); DELETE = filter. Plus: `findOneAnd*` variants also return the affected doc; `{ upsert: true }` on updates; and the SAME filter language (Module 13 Lesson 3) works IDENTICALLY everywhere a filter appears.',
    ],
    keyTakeawaysHi: [
      '`deleteOne(filter)` PEHLA match hataता hai → `{ deletedCount: 0|1 }`. `deleteMany(filter)` SAARE matches hataता hai. `deleteMany({})` SAB KUCH match karता hai aur collection khaali karता hai — koi confirmation prompt nahi. Dynamically-built delete filters ko accidentally empty hone se guard karो.',
      'MongoDB mein KOI foreign keys aur KOI cascading delete NAHI — ek document delete karna doosri collections ke documents ko touch NAHI karता. Cross-collection cleanup poori tarah application ka kaam hai (Module 14).',
      '`findOneAndDelete(filter)` ek document hataता hai AUR ise lautaता hai (ya `null`) — atomic "ise nikalो aur process karो" operation.',
      '`bulkWrite([ops])` кई MIXED write operations EK round trip mein bhejता hai — ek loop se dramatically faster. Default: ordered, pehli error par rukता hai; `{ ordered: false }` failures ke past continue karता hai.',
      'CRUD SHAPE — har operation (filter aur/ya document) hai: CREATE = sirf doc(s); READ = filter (+ projection); UPDATE = filter + `$`-operator update doc (ya `replaceOne` = filter + plain doc); DELETE = filter. Plus: `findOneAnd*` variants affected doc bhi lautaते hain; updates par `{ upsert: true }`; aur WAHI filter language (Module 13 Lesson 3) har jagah IDENTICALLY kaam karता hai.',
    ],
  },
];
