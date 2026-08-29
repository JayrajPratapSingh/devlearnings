/**
 * Node.js Complete Course — Module 3: Data & Persistence, lesson 3.
 *
 * Database transactions: BEGIN / COMMIT / ROLLBACK, and why multiple related
 * writes that must all succeed or all fail together cannot safely be run as
 * separate, independent pool.query() calls. Broken example: a money-transfer
 * route that debits one account and credits another as two separate queries
 * — if the process crashes (or the second query fails) between them, money
 * vanishes from the system, an inconsistent state a single database could
 * never produce on its own. Fixed with a client checked out from the pool,
 * wrapped in BEGIN/COMMIT, with ROLLBACK on any failure.
 *
 * NOTE for future editors: escape every inline-code backtick inside these
 * template literals, INCLUDING inside plain markdown paragraphs (the
 * `content`/`contentHi`/`simple`/`simpleHi` fields). Single-quoted string
 * fields (explain, why, q, a, task, keyTakeaways, etc.) do NOT need backticks
 * escaped — only escape apostrophes there as a SINGLE backslash (\'), never
 * doubled (\\'), which breaks the string. Run `npx tsc --noEmit -p .` after
 * writing this file, before wiring it into seed.ts — it is the only fully
 * reliable check for both mistakes. Also scan with a Python regex for stray
 * Devanagari characters before seeding.
 */

import type { CourseLesson } from './course-js-module1';

export const NODE_MODULE_3_PART3: CourseLesson[] = [
  {
    slug: 'database-transactions',
    title: 'Transactions: Making Multiple Writes Succeed or Fail Together',
    titleHi: 'Transactions: Kai Writes Ko Saath Mein Safal Ya Asafal Banaana',
    description: 'A money transfer that debits one bank account, then the server crashes before it can credit the other — the money simply vanishes, existing nowhere.',
    descriptionHi: 'Ek money transfer jo ek bank account debit karta hai, phir server crash ho jaata hai us se pehle ki wo doosre ko credit kar sake — paisa bas gaayab ho jaata hai, kahin bhi maujood nahi.',
    difficulty: 'HARD',
    duration: 24,
    order: 3,

    analogy: {
      en: '**A bank teller moving cash between two drawers, versus one who removes cash from drawer A and, for one crucial moment, sets it down on the counter belonging to neither drawer before placing it in drawer B.** Two related database writes run as two separate, independent \`pool.query()\` calls are like a teller who, upon receiving a transfer request, first opens drawer A, removes the cash, and closes it — the money is now fully out of drawer A, correctly reflected, but not yet anywhere else. Only after that step fully completes does the teller then open drawer B and place the cash inside. For nearly all transfers, this two-step process finishes so quickly that the middle moment — cash on the counter, belonging to no drawer — is never noticed by anyone. But if something interrupts the teller between the two steps (a phone rings, a fire alarm goes off, they simply forget), the cash sits on the counter, correctly removed from drawer A\'s count but never added to drawer B\'s — the bank\'s books, if audited at that exact moment, would show total cash across both drawers as less than what actually exists, because it is sitting in neither official location. A teller trained to use a proper transfer procedure instead treats the entire operation — remove from A, add to B — as one indivisible unit: either both steps are logged as complete together, or, if anything goes wrong partway through, the ENTIRE operation is undone as if it never started at all, cash returned to drawer A, nothing ever recorded as removed. There is never a valid moment where the money is "in transit," unaccounted for by either drawer\'s official count.',
      hi: '**Ek bank teller jo do drawers ke beech cash move karta hai, versus ek jo drawer A se cash nikaalta hai aur, ek zaruri pal ke liye, use counter par rakh deta hai jo kisi bhi drawer ka nahi, us se pehle ki wo use drawer B mein rakhe.** Do judi database writes jo do alag, mustaqil \`pool.query()\` calls ki tarah chalti hain aise hain jaise ek teller jo, ek transfer request paane par, pehle drawer A kholta hai, cash nikaalta hai, aur use band kar deta hai — paisa ab poori tarah drawer A se bahar hai, sahi tarike se dikha hua, par abhi tak kahin aur nahi. Sirf us step ke poori tarah poora hone ke baad hi teller drawer B kholta hai aur cash andar rakhta hai. Lagbhag har transfer ke liye, ye do-step process itni jaldi khatam hoti hai ki beech ka pal — counter par cash, kisi drawer ka nahi — kabhi kisi ko dikhta hi nahi. Par agar kuch teller ko dono steps ke beech mein rok deta hai (ek phone bajta hai, fire alarm baj jaata hai, wo bas bhool jaate hain), cash counter par pada rehta hai, drawer A ke count se sahi tarike se hataaya hua par drawer B ke count mein kabhi jodta hi nahi — bank ki books, agar theek us pal audit ki jaayein, dono drawers mein total cash ko us se kam dikhaayengi jo asal mein maujood hai, kyunki wo kisi bhi official jagah mein nahi baitha. Ek teller jo ek theek transfer procedure use karne ki training paaya hai iske bajaye poore operation ko — A se hataao, B mein jodo — ek na-todi jaa sakne wali ikaai ki tarah treat karta hai: ya to dono steps saath mein poore ki tarah log hote hain, ya, agar beech mein kuch galat hota hai, to POORA operation aise undo ho jaata hai jaise ye kabhi shuru hua hi nahi tha, cash drawer A mein wapas, kuch bhi kabhi hataaya hua record nahi hua. Kabhi bhi ek valid pal nahi hota jahan paisa "safar mein" ho, kisi bhi drawer ke official count se behisaab.',
    },

    simple: `**Start broken.** A money-transfer route that debits one account and credits another as two separate, independent queries:

\`\`\`js
app.post("/transfer", async (req, res, next) => {
  const { fromAccountId, toAccountId, amount } = req.body;

  try {
    await pool.query(
      "UPDATE accounts SET balance = balance - $1 WHERE id = $2",
      [amount, fromAccountId]
    );

    // If the process crashes, or this second query fails, RIGHT HERE —
    // the money has already left the first account but never arrives.

    await pool.query(
      "UPDATE accounts SET balance = balance + $1 WHERE id = $2",
      [amount, toAccountId]
    );

    res.json({ message: "Transfer complete" });
  } catch (err) {
    next(err);
  }
});
\`\`\`

For ordinary, uninterrupted requests, this works exactly as expected — both queries run, in order, and the transfer completes correctly. The danger is entirely in what happens if anything goes wrong strictly BETWEEN the two \`pool.query()\` calls: the Node.js process crashes, the server restarts for a deploy, the database briefly loses its connection, or the second query itself fails (a constraint violation, the destination account no longer existing, a network blip). Each \`pool.query()\` call is its own independent unit as far as the database is concerned — the first \`UPDATE\`, once it completes, is permanently applied and cannot be walked back automatically just because a LATER, unrelated query happens to fail. The result: the first account\'s balance has genuinely, permanently decreased, but the second account\'s balance was never increased — money has been deducted from the system without being credited anywhere, an inconsistency no individual query did anything wrong to cause, and one the database itself has no way to know is a problem, since as far as it knows, two separate, valid \`UPDATE\` statements were each executed correctly, one after the other.

**The fix: wrap both writes in a transaction, using a single client checked out from the pool**

\`\`\`js
app.post("/transfer", async (req, res, next) => {
  const { fromAccountId, toAccountId, amount } = req.body;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      "UPDATE accounts SET balance = balance - $1 WHERE id = $2",
      [amount, fromAccountId]
    );
    await client.query(
      "UPDATE accounts SET balance = balance + $1 WHERE id = $2",
      [amount, toAccountId]
    );

    await client.query("COMMIT");
    res.json({ message: "Transfer complete" });
  } catch (err) {
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
});
\`\`\`

\`\`\`ts
app.post("/transfer", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { fromAccountId, toAccountId, amount } = req.body as {
    fromAccountId: number;
    toAccountId: number;
    amount: number;
  };
  const client: PoolClient = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      "UPDATE accounts SET balance = balance - $1 WHERE id = $2",
      [amount, fromAccountId]
    );
    await client.query(
      "UPDATE accounts SET balance = balance + $1 WHERE id = $2",
      [amount, toAccountId]
    );

    await client.query("COMMIT");
    res.json({ message: "Transfer complete" });
  } catch (err) {
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
});
\`\`\`

\`BEGIN\` tells the database "everything that follows, up until I say otherwise, is part of one indivisible group of changes — do not consider any of it permanently applied yet." \`COMMIT\` tells it "the entire group succeeded — make all of it permanent, together, as a single atomic unit." \`ROLLBACK\`, run inside the \`catch\` block, tells it "something in this group failed — undo everything since \`BEGIN\`, as if none of it had ever run at all," including the first \`UPDATE\`, even though that individual query itself completed successfully. This is the core guarantee a transaction provides: from any other part of the application\'s (or database\'s) perspective, there is no possible moment where the first account\'s balance has decreased but the second\'s has not yet increased — either both changes are visible together, after \`COMMIT\`, or neither is visible at all, after a \`ROLLBACK\` or a crash before \`COMMIT\` is reached. Note the use of \`pool.connect()\` here rather than plain \`pool.query()\` (covered in the previous lesson): a transaction\'s \`BEGIN\`, its writes, and its \`COMMIT\`/\`ROLLBACK\` must all run on the exact same underlying database connection, since a transaction\'s in-progress, not-yet-committed state is tracked per-connection — \`pool.query()\` may transparently use a DIFFERENT connection for each call it makes, which would silently break a transaction\'s all-or-nothing guarantee entirely.`,

    simpleHi: `**Toote hue se shuru.** Ek money-transfer route jo ek account debit karta hai aur doosre ko credit karta hai do alag, mustaqil queries ki tarah:

\`\`\`js
app.post("/transfer", async (req, res, next) => {
  const { fromAccountId, toAccountId, amount } = req.body;

  try {
    await pool.query(
      "UPDATE accounts SET balance = balance - $1 WHERE id = $2",
      [amount, fromAccountId]
    );

    // Agar process crash ho jaaye, ya ye doosri query fail ho jaaye, THEEK YAHAN —
    // paisa pehle account se ja chuka hai par kabhi pahunchta nahi.

    await pool.query(
      "UPDATE accounts SET balance = balance + $1 WHERE id = $2",
      [amount, toAccountId]
    );

    res.json({ message: "Transfer complete" });
  } catch (err) {
    next(err);
  }
});
\`\`\`

Aam, bina rukaawat wale requests ke liye, ye bilkul ummeed ke hisaab se kaam karta hai — dono queries chalti hain, kram se, aur transfer sahi tarike se poora hota hai. Khatra poori tarah isme hai ki kya hota hai agar kuch dono \`pool.query()\` calls ke SEEDHA BEECH mein galat ho jaaye: Node.js process crash ho jaata hai, deploy ke liye server restart hota hai, database ka connection thodi der ke liye toot jaata hai, ya doosri query khud fail ho jaati hai (ek constraint violation, destination account ab maujood nahi, ek network blip). Database ke nazariye se har \`pool.query()\` call apni khud ki mustaqil ikaai hai — pehla \`UPDATE\`, ek baar poora hone ke baad, permanently lagu hai aur bas isliye apne aap wapas nahi ho sakta kyunki koi BAAD ki, na-judi query fail ho jaati hai. Nateeja: pehle account ka balance sach mein, permanently kam ho chuka hai, par doosre account ka balance kabhi badha hi nahi — system se paisa hataaya gaya hai bina kahin credit hue, ek asangati jise banaane mein kisi bhi akeli query ne kuch bhi galat nahi kiya, aur ek jise database khud jaanne ka koi tarika nahi rakhta ki ye ek samasya hai, kyunki jitna wo jaanta hai, do alag, valid \`UPDATE\` statements ek-ek karke sahi tarike se chalaaye gaye the.

**Fix: dono writes ko ek transaction mein lapeto, pool se check-out kiye ek akele client ka istemal karte hue**

\`\`\`js
app.post("/transfer", async (req, res, next) => {
  const { fromAccountId, toAccountId, amount } = req.body;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      "UPDATE accounts SET balance = balance - $1 WHERE id = $2",
      [amount, fromAccountId]
    );
    await client.query(
      "UPDATE accounts SET balance = balance + $1 WHERE id = $2",
      [amount, toAccountId]
    );

    await client.query("COMMIT");
    res.json({ message: "Transfer complete" });
  } catch (err) {
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
});
\`\`\`

\`\`\`ts
app.post("/transfer", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { fromAccountId, toAccountId, amount } = req.body as {
    fromAccountId: number;
    toAccountId: number;
    amount: number;
  };
  const client: PoolClient = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      "UPDATE accounts SET balance = balance - $1 WHERE id = $2",
      [amount, fromAccountId]
    );
    await client.query(
      "UPDATE accounts SET balance = balance + $1 WHERE id = $2",
      [amount, toAccountId]
    );

    await client.query("COMMIT");
    res.json({ message: "Transfer complete" });
  } catch (err) {
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
});
\`\`\`

\`BEGIN\` database ko batata hai "iske baad jo bhi aata hai, jab tak main kuch aur na kahoon, badlaavon ke ek na-todi jaa sakne wale group ka hissa hai — abhi tak ismein se kuch bhi permanently lagu maano mat." \`COMMIT\` use batata hai "poora group safal raha — sab kuch permanent karo, saath mein, ek akele atomic ikaai ki tarah." \`ROLLBACK\`, \`catch\` block ke andar chala hua, use batata hai "is group mein kuch fail hua — \`BEGIN\` ke baad se sab kuch undo karo, jaise ismein se kuch kabhi chala hi nahi tha," pehla \`UPDATE\` sameet, chahe wo akeli query khud safaltapoorvak poori hui thi. Ye woh mool guarantee hai jo ek transaction deta hai: application ke (ya database ke) kisi bhi doosre hisse ke nazariye se, koi mumkin pal nahi hai jahan pehle account ka balance kam ho chuka ho par doosre ka abhi tak na badha ho — ya to dono badlaav saath mein dikhte hain, \`COMMIT\` ke baad, ya koi bhi nahi dikhta, ek \`ROLLBACK\` ya \`COMMIT\` tak pahunchne se pehle ek crash ke baad. Yahan \`pool.connect()\` ka istemal note karo saadhe \`pool.query()\` (pichhle lesson mein cover hua) ke bajaye: ek transaction ka \`BEGIN\`, uski writes, aur uska \`COMMIT\`/\`ROLLBACK\` sabko bilkul usi underlying database connection par chalna zaruri hai, kyunki ek transaction ki chal rahi, abhi-tak-commit-na-hui sthiti connection-ke-hisaab-se track hoti hai — \`pool.query()\` shaayad har call ke liye ALAG connection ka istemal chupke se kare, jo ek transaction ki sab-ya-kuch-nahi guarantee ko poori tarah chupke se tod degi.`,

    content: `## What "atomicity" actually means, and why it is the point of a transaction

A transaction\'s core guarantee is often summarized as "atomicity" — from the same root as the word "atom," historically meaning "unable to be divided further." Applied to a database transaction, atomicity means the entire group of writes between \`BEGIN\` and \`COMMIT\` is treated as one single, indivisible unit of change from the perspective of anything observing the database: there is no possible way for an external observer (another route handler, another server, a monitoring query, a human running a manual \`SELECT\`) to see a state where SOME of the transaction\'s writes have taken effect but not others. Either the entire group of changes becomes visible at once, the instant \`COMMIT\` succeeds, or none of them ever become visible at all, if a \`ROLLBACK\` runs or the connection is lost before \`COMMIT\` is reached — there is no in-between state that can leak out to the rest of the system, which is exactly the property the broken two-separate-\`pool.query()\`-calls example lacked.

## ROLLBACK undoes writes that already individually succeeded

\`\`\`js
try {
  await client.query("BEGIN");
  await client.query("UPDATE accounts SET balance = balance - $1 WHERE id = $2", [amount, fromAccountId]);
  // Suppose the SECOND query below fails — perhaps toAccountId does not exist
  await client.query("UPDATE accounts SET balance = balance + $1 WHERE id = $2", [amount, toAccountId]);
  await client.query("COMMIT");
} catch (err) {
  await client.query("ROLLBACK");
  // The FIRST update — which itself completed with no error — is undone here too
}
\`\`\`

A detail that is easy to misunderstand at first: \`ROLLBACK\` does not merely "cancel a query that was about to run" — it genuinely reverses writes that already executed successfully, as long as they happened after the matching \`BEGIN\` and before a \`COMMIT\`. In the example above, the first \`UPDATE\` runs with no error of its own; the database applies it, at least within the scope of this not-yet-committed transaction. It is only when the SECOND query subsequently throws that the \`catch\` block\'s \`ROLLBACK\` reaches backward and undoes that first, individually-successful write as well — this is precisely the "all or nothing" behavior a transaction exists to provide, and precisely what plain sequential \`pool.query()\` calls, each independently committed the moment it completes, cannot do.

## Multiple concurrent transfers: why a single client, not the shared pool, matters mid-transaction

\`\`\`js
// WRONG — silently breaks the transaction guarantee
await pool.query("BEGIN");
await pool.query("UPDATE accounts SET balance = balance - $1 WHERE id = $2", [amount, fromAccountId]);
await pool.query("UPDATE accounts SET balance = balance + $1 WHERE id = $2", [amount, toAccountId]);
await pool.query("COMMIT");
\`\`\`

Calling \`pool.query()\` (rather than \`client.query()\` on a client explicitly checked out via \`pool.connect()\`) for each individual statement of a transaction is a subtle, easy-to-write mistake: the pool is free to hand out any available connection for each separate \`pool.query()\` call, including a DIFFERENT one for the \`BEGIN\`, the first \`UPDATE\`, the second \`UPDATE\`, and the \`COMMIT\` — since a transaction\'s in-progress state exists only within the specific database connection that started it, running \`BEGIN\` on one connection and the subsequent \`UPDATE\` on a different one means the \`UPDATE\` is not actually part of any transaction at all; it runs and commits immediately, on its own, exactly like the original broken example — the \`BEGIN\`/\`COMMIT\` calls become meaningless, running against connections that have nothing to do with the writes in between. This is why the correct pattern explicitly checks out one client with \`pool.connect()\`, uses that same \`client\` variable for every statement in the transaction, and — critically — always calls \`client.release()\` in a \`finally\` block, returning that connection to the pool for reuse regardless of whether the transaction committed or rolled back.

## Interview framing: transactions solve a coordination problem, not a query-correctness problem

Each individual query inside a broken transaction can be, and typically is, perfectly correct SQL, executed against perfectly valid data — the account IDs exist, the balances are numeric, nothing about any single \`UPDATE\` statement is wrong in isolation. The problem a transaction solves is entirely one of coordination ACROSS multiple statements: guaranteeing that a group of writes, which are only meaningful together (a transfer is not "done" if money left one account but never reached another), either all happen or none happen, regardless of what interrupts the process between them. This distinguishes transactions from most of what earlier lessons in this course covered (validation, error handling, connection pooling) — those address whether an individual operation succeeds correctly; transactions address what happens when MULTIPLE operations need to succeed or fail as a single unit.`,

    contentHi: `## "Atomicity" ka asal matlab kya hai, aur ye ek transaction ka point kyun hai

Ek transaction ki mool guarantee ko aksar "atomicity" ki tarah summarize kiya jaata hai — "atom" shabd ki hi jad se, historically matlab "aage vibhaajit na kiya ja sakne wala." Ek database transaction par lagu, atomicity ka matlab hai \`BEGIN\` aur \`COMMIT\` ke beech writes ka poora group database ko dekhne wali kisi bhi cheez ke nazariye se ek akela, na-todi jaa sakne wali badlaav ki ikaai ki tarah treat hota hai: kisi bhi bahari observer (ek doosra route handler, ek doosra server, ek monitoring query, ek insaan haath se \`SELECT\` chalaate hue) ke liye ye dekhne ka koi mumkin tarika nahi hai ki transaction ki KUCH writes lagu ho gayi hain par doosri nahi. Ya to badlaavon ka poora group ek saath dikhta hai, \`COMMIT\` safal hote hi, ya ismein se koi bhi kabhi bilkul nahi dikhta, agar ek \`ROLLBACK\` chalta hai ya \`COMMIT\` tak pahunchne se pehle connection kho jaata hai — koi beech ki sthiti nahi hai jo baaki system mein leak ho sake, jo bilkul wahi property hai jo toota do-alag-\`pool.query()\`-calls wala example nahi rakhta tha.

## ROLLBACK un writes ko undo karta hai jo pehle se akele safal ho chuki thi

\`\`\`js
try {
  await client.query("BEGIN");
  await client.query("UPDATE accounts SET balance = balance - $1 WHERE id = $2", [amount, fromAccountId]);
  // Maano neeche wali DOOSRI query fail hoti hai — shaayad toAccountId maujood hi nahi
  await client.query("UPDATE accounts SET balance = balance + $1 WHERE id = $2", [amount, toAccountId]);
  await client.query("COMMIT");
} catch (err) {
  await client.query("ROLLBACK");
  // PEHLA update — jo khud koi error ke bina poora hua tha — yahan bhi undo hota hai
}
\`\`\`

Ek detail jise shuru mein galat samajhna aasaan hai: \`ROLLBACK\` bas "ek query cancel karna jo chalne wali thi" nahi karta — ye sach mein un writes ko ulta karta hai jo pehle se safaltapoorvak chal chuki thi, jab tak wo milte \`BEGIN\` ke baad aur ek \`COMMIT\` se pehle hui hon. Upar wale example mein, pehla \`UPDATE\` apni koi error ke bina chalta hai; database use lagu karta hai, kam se kam is abhi-tak-commit-na-hui transaction ke daayre mein. Sirf jab DOOSRI query baad mein throw karti hai tab \`catch\` block ka \`ROLLBACK\` peeche pahunchta hai aur us pehli, akele-safal write ko bhi undo karta hai — ye bilkul wahi "sab ya kuch nahi" vyavhaar hai jise dene ke liye ek transaction maujood hai, aur bilkul wo jo saadhi kramik \`pool.query()\` calls, har ek poora hote hi alag se commit hoti hui, nahi kar sakti.

## Kai saath-saath transfers: ek akela client kyun zaruri hai, shared pool nahi, transaction ke beech mein

\`\`\`js
// GALAT — transaction ki guarantee ko chupke se todta hai
await pool.query("BEGIN");
await pool.query("UPDATE accounts SET balance = balance - $1 WHERE id = $2", [amount, fromAccountId]);
await pool.query("UPDATE accounts SET balance = balance + $1 WHERE id = $2", [amount, toAccountId]);
await pool.query("COMMIT");
\`\`\`

Ek transaction ke har akele statement ke liye \`pool.query()\` (uske bajaye \`pool.connect()\` se explicitly check-out kiye gaye ek client par \`client.query()\`) bulaana ek subtle, aasaani se likhi jaa sakne wali galti hai: pool har alag \`pool.query()\` call ke liye koi bhi upalabdh connection dene ke liye azaad hai, \`BEGIN\`, pehle \`UPDATE\`, doosre \`UPDATE\`, aur \`COMMIT\` ke liye ALAG connection sameet — kyunki ek transaction ki chal rahi sthiti sirf us khaas database connection ke andar maujood hai jisne use shuru kiya, ek connection par \`BEGIN\` chalaana aur baad wala \`UPDATE\` ek alag par chalaana matlab \`UPDATE\` asal mein kisi bhi transaction ka hissa hai hi nahi; ye khud hi chalta aur turant commit hota hai, bilkul asli toote example ki tarah — \`BEGIN\`/\`COMMIT\` calls bemaani ho jaate hain, un connections ke khilaaf chalte hue jinka beech ki writes se koi lena-dena nahi. Bilkul isi wajah se sahi pattern explicitly \`pool.connect()\` se ek client check out karta hai, transaction ke har statement ke liye wahi \`client\` variable use karta hai, aur — bahut zaruri — hamesha \`client.release()\` ek \`finally\` block mein bulaata hai, us connection ko pool mein dobara-istemal ke liye lautaate hue chahe transaction commit hua ho ya rollback.

## Interview framing: transactions ek coordination samasya solve karte hain, query-sahi-hone ki samasya nahi

Ek toote transaction ke andar har akeli query poori tarah sahi SQL ho sakti hai, aur aam taur par hoti hai, poori tarah valid data ke khilaaf chalti hui — account IDs maujood hain, balances numeric hain, kisi bhi akele \`UPDATE\` statement mein akele mein kuch galat nahi hai. Jo samasya ek transaction solve karta hai wo poori tarah kai statements ke AAR-PAAR coordination ki hai: ye guarantee karna ki writes ka ek group, jo sirf saath mein maayne rakhta hai (ek transfer "poora" nahi hai agar paisa ek account se gaya par doosre tak kabhi pahuncha hi nahi), ya to sab hote hain ya koi nahi hota, chahe process ko unke beech mein kuch bhi roke. Ye transactions ko is course ke pehle wale zyaadatar lessons se alag karta hai (validation, error handling, connection pooling) — wo iske baare mein hain ki kya ek akela operation sahi tarike se safal hota hai; transactions iske baare mein hain ki kya hota hai jab MULTIPLE operations ek akeli ikaai ki tarah safal ya asafal hone chahiye.`,

    examples: [
      {
        title: 'Broken: two independent queries — money vanishes if interrupted between them',
        titleHi: 'Toota: do mustaqil queries — beech mein rukaawat aane par paisa gaayab',
        code: `await pool.query("UPDATE accounts SET balance = balance - $1 WHERE id = $2", [amount, fromAccountId]);
// crash or failure HERE means money left one account and reached nowhere
await pool.query("UPDATE accounts SET balance = balance + $1 WHERE id = $2", [amount, toAccountId]);`,
        codeJs: `app.post("/transfer", async (req, res, next) => {
  const { fromAccountId, toAccountId, amount } = req.body;
  try {
    await pool.query(
      "UPDATE accounts SET balance = balance - $1 WHERE id = $2",
      [amount, fromAccountId]
    );
    await pool.query(
      "UPDATE accounts SET balance = balance + $1 WHERE id = $2",
      [amount, toAccountId]
    );
    res.json({ message: "Transfer complete" });
  } catch (err) {
    next(err);
  }
});`,
        codeTs: `app.post("/transfer", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { fromAccountId, toAccountId, amount } = req.body as {
    fromAccountId: number;
    toAccountId: number;
    amount: number;
  };
  try {
    await pool.query(
      "UPDATE accounts SET balance = balance - $1 WHERE id = $2",
      [amount, fromAccountId]
    );
    await pool.query(
      "UPDATE accounts SET balance = balance + $1 WHERE id = $2",
      [amount, toAccountId]
    );
    res.json({ message: "Transfer complete" });
  } catch (err) {
    next(err);
  }
});`,
        output: `Ordinary requests: works fine, both balances update correctly.
If the process crashes or the second query fails between the two
calls: fromAccountId's balance is permanently decreased, toAccountId's
balance never increases — money is missing from the system.`,
        explain: 'Each pool.query() call is independently and immediately committed the instant it completes — the database has no way to know these two calls were meant to be treated as one operation.',
        explainHi: 'Har \`pool.query()\` call poora hote hi mustaqil aur turant commit ho jaati hai — database ke paas jaanne ka koi tarika nahi ki ye do calls ek operation ki tarah treat hone ke liye thi.',
      },
      {
        title: 'Fixed: BEGIN / COMMIT / ROLLBACK on a single checked-out client',
        titleHi: 'Theek: ek akele check-out kiye client par BEGIN / COMMIT / ROLLBACK',
        code: `const client = await pool.connect();
try {
  await client.query("BEGIN");
  await client.query("UPDATE accounts SET balance = balance - $1 WHERE id = $2", [amount, fromAccountId]);
  await client.query("UPDATE accounts SET balance = balance + $1 WHERE id = $2", [amount, toAccountId]);
  await client.query("COMMIT");
} catch (err) {
  await client.query("ROLLBACK");
  throw err;
} finally {
  client.release();
}`,
        codeJs: `app.post("/transfer", async (req, res, next) => {
  const { fromAccountId, toAccountId, amount } = req.body;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      "UPDATE accounts SET balance = balance - $1 WHERE id = $2",
      [amount, fromAccountId]
    );
    await client.query(
      "UPDATE accounts SET balance = balance + $1 WHERE id = $2",
      [amount, toAccountId]
    );
    await client.query("COMMIT");
    res.json({ message: "Transfer complete" });
  } catch (err) {
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
});`,
        codeTs: `app.post("/transfer", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { fromAccountId, toAccountId, amount } = req.body as {
    fromAccountId: number;
    toAccountId: number;
    amount: number;
  };
  const client: PoolClient = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      "UPDATE accounts SET balance = balance - $1 WHERE id = $2",
      [amount, fromAccountId]
    );
    await client.query(
      "UPDATE accounts SET balance = balance + $1 WHERE id = $2",
      [amount, toAccountId]
    );
    await client.query("COMMIT");
    res.json({ message: "Transfer complete" });
  } catch (err) {
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
});`,
        outputJs: `Ordinary requests: identical behaviour to the broken version. If the
second UPDATE now fails, the catch block's ROLLBACK undoes the first
UPDATE too — the fromAccountId balance is restored exactly as if the
transfer had never been attempted at all.`,
        outputTs: `// Identical behaviour. PoolClient is pg's type for a checked-out
// connection, distinct from the Pool itself — client.query and
// pool.query have compatible signatures, but only client.query
// participates in this transaction.`,
        explain: 'client.release() runs in a finally block specifically so the connection returns to the pool whether the transaction committed or rolled back — forgetting this leaks connections and can eventually exhaust the pool entirely.',
        explainHi: '\`client.release()\` ek \`finally\` block mein chalta hai khaas taur par isliye taaki connection pool mein wapas jaaye chahe transaction commit hui ho ya rollback — ise bhoolna connections leak karta hai aur aakhirkaar pool ko poori tarah khatam kar sakta hai.',
      },
      {
        title: 'Wrong: using pool.query() for each statement silently breaks the transaction',
        titleHi: 'Galat: har statement ke liye \`pool.query()\` istemal karna transaction ko chupke se todta hai',
        code: `// Each call may use a DIFFERENT connection from the pool —
// BEGIN and the UPDATE that follows may not even be on the same connection
await pool.query("BEGIN");
await pool.query("UPDATE accounts SET balance = balance - $1 WHERE id = $2", [amount, fromAccountId]);`,
        codeJs: `// WRONG — do not do this
app.post("/transfer", async (req, res, next) => {
  const { fromAccountId, toAccountId, amount } = req.body;
  try {
    await pool.query("BEGIN");
    await pool.query(
      "UPDATE accounts SET balance = balance - $1 WHERE id = $2",
      [amount, fromAccountId]
    );
    await pool.query(
      "UPDATE accounts SET balance = balance + $1 WHERE id = $2",
      [amount, toAccountId]
    );
    await pool.query("COMMIT");
    res.json({ message: "Transfer complete" });
  } catch (err) {
    await pool.query("ROLLBACK");
    next(err);
  }
});`,
        codeTs: `// WRONG — do not do this
app.post("/transfer", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { fromAccountId, toAccountId, amount } = req.body as {
    fromAccountId: number;
    toAccountId: number;
    amount: number;
  };
  try {
    await pool.query("BEGIN");
    await pool.query(
      "UPDATE accounts SET balance = balance - $1 WHERE id = $2",
      [amount, fromAccountId]
    );
    await pool.query(
      "UPDATE accounts SET balance = balance + $1 WHERE id = $2",
      [amount, toAccountId]
    );
    await pool.query("COMMIT");
    res.json({ message: "Transfer complete" });
  } catch (err) {
    await pool.query("ROLLBACK");
    next(err);
  }
});`,
        outputJs: `No visible error, no crash — but under real concurrent traffic, each
pool.query() call may run on a different underlying connection, so
BEGIN, the UPDATEs, and COMMIT may not share a connection at all. Each
UPDATE can commit immediately on its own, exactly as in the original
broken example — the "transaction" provides no actual guarantee.`,
        outputTs: `// TypeScript does not catch this — pool.query() and client.query()
// have compatible signatures. The bug is entirely about WHICH
// connection each call happens to use, invisible at the type level.`,
        explain: 'This mistake is dangerous specifically because it often appears to work in casual, low-concurrency manual testing — the pool may happen to reuse the same connection when there is little else competing for it, only revealing the bug under real concurrent load.',
        explainHi: 'Ye galti khaas taur par khatarnaak hai kyunki ye aksar aam, kam-concurrency wali manual testing mein kaam karti dikhti hai — pool shaayad wahi connection dobara istemal kare jab uske liye kam competition ho, bug sirf asli concurrent load ke neeche zaahir hota hai.',
      },
    ],

    mistakes: [
      {
        wrong: `await pool.query("UPDATE accounts SET balance = balance - $1 WHERE id = $2", [amount, fromAccountId]);
await pool.query("UPDATE accounts SET balance = balance + $1 WHERE id = $2", [amount, toAccountId]);
// two independent, separately-committed queries`,
        right: `await client.query("BEGIN");
await client.query("UPDATE accounts SET balance = balance - $1 WHERE id = $2", [amount, fromAccountId]);
await client.query("UPDATE accounts SET balance = balance + $1 WHERE id = $2", [amount, toAccountId]);
await client.query("COMMIT");
// one atomic group of changes on a single checked-out client`,
        why: 'Writes that must succeed or fail together, run as separate independent queries, can leave the system in an inconsistent state if anything interrupts the process between them — a transaction guarantees the entire group is applied as one atomic unit or not at all.',
        whyHi: 'Writes jo saath mein safal ya asafal hone chahiye, agar alag mustaqil queries ki tarah chalti hain, to system ko ek asangat sthiti mein chhod sakti hain agar unke beech kuch process ko rok de — ek transaction guarantee karta hai ki poora group ek atomic ikaai ki tarah lagu hota hai ya bilkul nahi.',
      },
      {
        wrong: `await pool.query("BEGIN");
await pool.query("UPDATE accounts SET balance = balance - $1 WHERE id = $2", [amount, fromAccountId]);
await pool.query("COMMIT");
// pool.query() may use a different connection for each call`,
        right: `const client = await pool.connect();
await client.query("BEGIN");
await client.query("UPDATE accounts SET balance = balance - $1 WHERE id = $2", [amount, fromAccountId]);
await client.query("COMMIT");
client.release();
// all statements explicitly share the same connection`,
        why: 'A transaction\'s in-progress state exists only within the specific connection that started it — using pool.query() for each statement risks the pool silently handing out a different connection for each call, making BEGIN and the writes that follow unrelated to each other.',
        whyHi: 'Ek transaction ki chal rahi sthiti sirf us khaas connection ke andar maujood hai jisne use shuru kiya — har statement ke liye \`pool.query()\` istemal karna khatra rakhta hai ki pool chupke se har call ke liye alag connection de de, \`BEGIN\` aur uske baad wali writes ko ek-doosre se na-juda bana de.',
      },
      {
        wrong: `try {
  await client.query("BEGIN");
  await client.query(/* ... */);
  await client.query("COMMIT");
} catch (err) {
  next(err);
}
// no client.release() at all — connection is leaked on every request`,
        right: `try {
  await client.query("BEGIN");
  await client.query(/* ... */);
  await client.query("COMMIT");
} catch (err) {
  await client.query("ROLLBACK");
  next(err);
} finally {
  client.release();
}
// finally guarantees release() runs whether the transaction succeeded or failed`,
        why: 'A client checked out with pool.connect() must always be explicitly released back to the pool — skipping this, especially on the error path, permanently removes that connection from the pool\'s available supply, eventually exhausting it under repeated failures.',
        whyHi: '\`pool.connect()\` se check-out kiya gaya client hamesha explicitly pool mein wapas release hona chahiye — ise chhodna, khaaskar error path par, us connection ko pool ki upalabdh supply se permanently hata deta hai, baar-baar fail hone par aakhirkaar use khatam kar deta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Every mainstream relational database (PostgreSQL, MySQL, SQLite, SQL Server, Oracle) supports transactions with the same core BEGIN/COMMIT/ROLLBACK model** — the specific syntax and advanced options vary, but the fundamental guarantee (a group of writes succeeds or fails as one unit) is a foundational, universal relational-database concept, not specific to PostgreSQL or to \`pg\`.',
        hi: '**Har mukhyadhaara relational database (PostgreSQL, MySQL, SQLite, SQL Server, Oracle) transactions ko usi mool BEGIN/COMMIT/ROLLBACK model ke saath support karta hai** — khaas syntax aur advanced options badalti hain, par mool guarantee (writes ka ek group ek ikaai ki tarah safal ya asafal hota hai) ek buniyaadi, sarvavyaapi relational-database concept hai, PostgreSQL ya \`pg\` tak khaas nahi.',
      },
      {
        en: '**Financial systems (payments, banking, e-commerce checkout) are the textbook use case for transactions specifically because partial failure is unacceptable there** — a payment provider charging a customer\'s card while the corresponding order record fails to save is a real-world instance of exactly the coordination problem this lesson demonstrates, and production payment code is built around transactional guarantees precisely to prevent it.',
        hi: '**Financial systems (payments, banking, e-commerce checkout) transactions ka classic use case hain khaas taur par isliye kyunki wahan aadha-fail hona swikaarya nahi hai** — ek payment provider ek customer ka card charge karta hai jabki us se judaa order record save hone mein fail ho jaata hai, ye bilkul is lesson mein dikhaayi coordination samasya ka ek asli-duniya udaharan hai, aur production payment code transactional guarantees ke aas-paas theek isi ko rokne ke liye banaaya jaata hai.',
      },
      {
        en: '**ORMs like Prisma provide their own transaction APIs (\`prisma.$transaction([...])\` or an interactive callback form) that wrap this exact same underlying BEGIN/COMMIT/ROLLBACK mechanism** in a higher-level, often more ergonomic interface — understanding the raw mechanism first, as covered in this lesson, makes those higher-level APIs\' behavior (and their own failure modes) far easier to reason about correctly.',
        hi: '**Prisma jaise ORMs apne khud ke transaction APIs dete hain (\`prisma.$transaction([...])\` ya ek interactive callback form) jo bilkul isi underlying BEGIN/COMMIT/ROLLBACK mechanism ko lapette hain** ek zyaada oonchi star ki, aksar zyaada suvidhajanak interface mein — pehle raw mechanism samajhna, jaisa is lesson mein cover hua, un oonchi-star APIs ke vyavhaar (aur unki apni fail hone ki tariqon) ko sahi tarike se samajhna kaafi aasaan banaata hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why can two related database writes, each individually correct, still leave the system in a broken state if run as two separate pool.query() calls instead of a transaction?',
        qHi: 'Do judi database writes, har ek akele mein sahi, ek transaction ke bajaye do alag \`pool.query()\` calls ki tarah chalne par system ko toote sthiti mein kyun chhod sakti hain?',
        a: 'Each individual pool.query() call is treated by the database as its own complete, independent unit of work — the moment a single query finishes executing without error, its effect is immediately and permanently applied, with no ongoing relationship to whatever query happens to run next in the same route handler. When two such calls are meant to represent one logical operation (like a transfer, which is only meaningful if money both leaves one account AND arrives at another), the database has no built-in awareness that they are related at all — it simply sees two unrelated, sequentially executed, independently committed statements. If anything interrupts the process between the two calls (a crash, a restart, the second query itself failing), the first write remains permanently applied — since it was never conditional on the second one succeeding — producing a state (money debited but never credited) that neither query, viewed individually, did anything incorrect to cause; the flaw is entirely in treating two writes that must be coordinated as if they were unrelated.',
        aHi: 'Har akela \`pool.query()\` call database dwara apne poore, mustaqil kaam ki ikaai ki tarah treat hota hai — jis pal ek akeli query bina error chalna khatam karti hai, uska asar turant aur permanently lagu ho jaata hai, us se koi chalti judaai bina jo bhi query us se agli hi baar usi route handler mein chalti hai. Jab do aisi calls ek logical operation darzha karne ke liye maani jaati hain (jaise ek transfer, jo sirf tab maayne rakhta hai jab paisa dono ek account se jaaye AUR doosre mein pahunche), database ke paas built-in jaankaari nahi hai ki wo bilkul judi hain — ye bas do na-judi, kram se chali, mustaqil-commit hui statements dekhta hai. Agar kuch process ko dono calls ke beech mein rok de (ek crash, ek restart, doosri query khud fail ho jaana), pehli write permanently lagu rehti hai — kyunki wo kabhi doosri ke safal hone par nirbhar thi hi nahi — ek sthiti paida karte hue (paisa debit hua par kabhi credit nahi hua) jise banaane mein na to koi query, akele dekhi jaaye, ne kuch bhi galat kiya; kami poori tarah do writes ko coordinate hona chahiye tha unhe na-jude jaisa treat karne mein hai.',
      },
      {
        q: 'What does ROLLBACK actually do, and why does it matter that it can undo a write that already completed with no error?',
        qHi: '\`ROLLBACK\` asal mein kya karta hai, aur ye kyun maayne rakhta hai ki ye ek aisi write undo kar sakta hai jo pehle se bina error poori ho chuki thi?',
        a: 'ROLLBACK instructs the database to discard every change made since the matching BEGIN, restoring the affected data to exactly the state it was in before the transaction started — as if none of the statements between BEGIN and ROLLBACK had ever run. This matters specifically because it can undo writes that, taken individually, executed with no error of their own — a transaction\'s writes are only provisionally applied within the scope of that not-yet-committed transaction, not truly permanent until COMMIT succeeds; ROLLBACK exploits exactly this by reversing all of them together, regardless of whether each one, viewed in isolation, appeared to succeed. This is the mechanism that makes the "all or nothing" guarantee genuinely enforceable: if a later statement in the transaction fails, every earlier statement in that same transaction — even ones that had already individually succeeded — is automatically undone, ensuring the database is never left in a state reflecting only part of the intended group of changes.',
        aHi: '\`ROLLBACK\` database ko har badlaav chhodne ki hidaayat deta hai jo milte \`BEGIN\` ke baad se hua hai, prabhaavit data ko bilkul us sthiti mein bahaal karte hue jismein wo transaction shuru hone se pehle tha — jaise \`BEGIN\` aur \`ROLLBACK\` ke beech koi bhi statement kabhi chala hi nahi tha. Ye khaas taur par isliye maayne rakhta hai kyunki ye un writes ko undo kar sakta hai jo, akele li jaayein, apni koi error ke bina chali thi — ek transaction ki writes sirf us abhi-tak-commit-na-hui transaction ke daayre mein provisionally lagu hoti hain, \`COMMIT\` safal hone tak sach mein permanent nahi; \`ROLLBACK\` bilkul isi ka faayda uthaate hue unhe sabko saath mein ulta karta hai, chahe har ek, akele dekhi jaaye, safal dikhi ho. Ye wahi mechanism hai jo "sab ya kuch nahi" guarantee ko sach mein lagu-karne-laayak banaata hai: agar transaction mein ek baad wala statement fail hota hai, to usi transaction mein har pehle wala statement — chahe wo pehle se akele safal ho chuka ho — apne aap undo ho jaata hai, ye sunishchit karte hue ki database kabhi ek aisi sthiti mein nahi chhoda jaata jo sirf badlaavon ke iraade kiye gaye group ka ek hissa dikhaaye.',
      },
      {
        q: 'Why must every statement in a transaction run through the same client obtained from pool.connect(), rather than through plain pool.query() calls?',
        qHi: 'Transaction mein har statement \`pool.connect()\` se paaye ek hi client ke through kyun chalna chahiye, saadhe \`pool.query()\` calls ke through nahi?',
        a: 'A transaction\'s in-progress, not-yet-committed state is tracked by the database entirely within the scope of a single underlying connection — BEGIN marks the start of a transaction on whichever specific connection it is executed on, and only statements that subsequently run on that exact same connection are considered part of that transaction. pool.query() is a convenience method that internally checks out any available connection from the pool, runs the query, and returns the connection to the pool, all in one step — critically, there is no guarantee that two separate pool.query() calls use the same underlying connection, since the pool is free to hand out whichever connection happens to be available at that moment. If BEGIN runs on one connection and a subsequent UPDATE runs on a different one (which pool.query() makes entirely possible), that UPDATE is not actually part of any transaction from the database\'s perspective — it runs and is committed immediately and independently, exactly as if no transaction had been started at all, silently defeating the entire purpose of wrapping the writes in BEGIN/COMMIT in the first place. Explicitly calling pool.connect() to check out one specific client, and reusing that same client variable for BEGIN, every write, and COMMIT/ROLLBACK, guarantees all of it runs on one connection, which is the only way the database can correctly associate the statements with a single transaction.',
        aHi: 'Ek transaction ki chal rahi, abhi-tak-commit-na-hui sthiti database dwara poori tarah ek akele underlying connection ke daayre mein track hoti hai — \`BEGIN\` jis bhi khaas connection par chalaaya jaata hai us par ek transaction ki shuruaat ko chihnit karta hai, aur sirf wo statements jo baad mein bilkul usi connection par chalte hain us transaction ka hissa maane jaate hain. \`pool.query()\` ek suvidhaajanak method hai jo andar hi andar pool se koi bhi upalabdh connection check out karta hai, query chalaata hai, aur connection ko pool mein wapas karta hai, sab ek step mein — bahut zaruri, iski koi guarantee nahi ki do alag \`pool.query()\` calls wahi underlying connection istemal karein, kyunki pool jis bhi connection us pal upalabdh hai use dene ke liye azaad hai. Agar \`BEGIN\` ek connection par chalta hai aur baad wala \`UPDATE\` ek alag par chalta hai (jo \`pool.query()\` poori tarah mumkin banaata hai), wo \`UPDATE\` database ke nazariye se asal mein kisi bhi transaction ka hissa hai hi nahi — ye turant aur mustaqil taur par chalta aur commit hota hai, bilkul jaise koi transaction shuru hi nahi hua tha, chupke se poori tarah us maqsad ko haraate hue jiske liye writes ko \`BEGIN\`/\`COMMIT\` mein lapeta gaya tha. Explicitly \`pool.connect()\` bulaakar ek khaas client check out karna, aur \`BEGIN\`, har write, aur \`COMMIT\`/\`ROLLBACK\` ke liye wahi client variable dobara istemal karna, guarantee karta hai ki sab kuch ek hi connection par chalta hai, jo aikela tarika hai jisse database statements ko ek akeli transaction se sahi tarike se juda maan sake.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken /transfer route with two separate pool.query() calls. Manually simulate a mid-transfer failure (throw an error right after the first query, before the second) and confirm the first account\'s balance stays permanently decreased.',
        taskHi: 'Do alag \`pool.query()\` calls wala toota \`/transfer\` route banao. Haath se ek beech-transfer failure simulate karo (pehli query ke theek baad, doosri se pehle, ek error throw karo) aur confirm karo pehle account ka balance permanently kam raha.',
        hint: 'A simple way to force this: temporarily add "throw new Error(\'simulated crash\')" between the two await pool.query() calls, then check both account balances directly in the database afterward.',
        hintHi: 'Ise force karne ka ek saadha tarika: do await \`pool.query()\` calls ke beech mein thodi der ke liye "throw new Error(\'simulated crash\')" jodo, phir baad mein seedha database mein dono account balances check karo.',
      },
      {
        task: 'Fix it using client = await pool.connect() with BEGIN/COMMIT/ROLLBACK. Repeat the same simulated mid-transfer failure and confirm the first account\'s balance is correctly restored.',
        taskHi: '\`client = await pool.connect()\` ke saath BEGIN/COMMIT/ROLLBACK istemal karke theek karo. Wahi simulated beech-transfer failure dohraao aur confirm karo pehle account ka balance sahi tarike se bahaal hua.',
        hint: 'Confirm client.release() runs even in the failure path by adding a temporary console.log inside the finally block and checking it always fires.',
        hintHi: 'Ek asthaayi console.log \`finally\` block ke andar jodkar confirm karo \`client.release()\` failure path mein bhi chalta hai, aur check karo ki ye hamesha chalta hai.',
      },
      {
        task: 'Deliberately rewrite the fixed version to use pool.query() instead of client.query() for each statement, and try to observe or reason through why the transaction guarantee no longer reliably holds, even though no error is thrown.',
        taskHi: 'Theek version ko jaan-boojhkar dobara likho har statement ke liye \`client.query()\` ke bajaye \`pool.query()\` istemal karke, aur dekho ya soch-samajh kar samjho ki transaction guarantee ab kyun bharosemand taur par nahi rukta, chahe koi error throw na ho.',
        hint: 'This bug will not reliably reproduce with only one request at a time and a small connection pool — think about why it specifically requires enough concurrent load for the pool to hand out more than one connection.',
        hintHi: 'Ye bug ek waqt mein sirf ek request aur ek chhote connection pool ke saath bharosemand taur par dobara nahi hoga — socho ki isko khaas taur par pool ke ek se zyaada connection dene ke liye itni concurrent load kyun chahiye.',
      },
    ],

    keyTakeaways: [
      'Two related writes run as separate, independent pool.query() calls each commit immediately on their own — if anything interrupts the process between them, the system can be left in an inconsistent state that no individual query did anything wrong to cause.',
      'BEGIN starts a transaction; COMMIT makes every change since BEGIN permanent, together, as one atomic unit; ROLLBACK undoes every change since BEGIN, including writes that had already individually completed with no error.',
      'A transaction guarantees atomicity: there is no observable moment where only some of its writes have taken effect — either all of them become visible at once, after COMMIT, or none of them ever do.',
      'Every statement in a transaction must run on the exact same client, obtained via pool.connect() — plain pool.query() calls may silently use different connections for each call, breaking the transaction guarantee without any visible error.',
      'A client checked out with pool.connect() must always be released back to the pool in a finally block, regardless of whether the transaction committed or rolled back, or the pool\'s available connections will eventually be exhausted.',
      'Transactions solve a coordination problem across multiple related writes, not a correctness problem within any single query — each individual statement inside a broken transaction can be perfectly valid SQL on its own.',
    ],
    keyTakeawaysHi: [
      'Do judi writes jo alag, mustaqil \`pool.query()\` calls ki tarah chalti hain har ek apne aap turant commit hoti hai — agar kuch unke beech process ko rok de, to system ek asangat sthiti mein reh sakta hai jise banaane mein kisi bhi akeli query ne kuch bhi galat nahi kiya.',
      '\`BEGIN\` ek transaction shuru karta hai; \`COMMIT\` \`BEGIN\` ke baad se har badlaav ko permanent banaata hai, saath mein, ek atomic ikaai ki tarah; \`ROLLBACK\` \`BEGIN\` ke baad se har badlaav ko undo karta hai, un writes sameet jo pehle se akele bina error poori ho chuki thi.',
      'Ek transaction atomicity guarantee karta hai: koi dikhaayi dene laayak pal nahi hota jahan sirf uski kuch writes lagu hui hon — ya to sab ek saath dikhti hain, \`COMMIT\` ke baad, ya koi bhi kabhi nahi dikhti.',
      'Transaction mein har statement bilkul usi client par chalna chahiye, \`pool.connect()\` se paaya hua — saadhe \`pool.query()\` calls chupke se har call ke liye alag connections istemal kar sakte hain, koi dikhaayi dene laayak error bina transaction guarantee tod te hue.',
      '\`pool.connect()\` se check-out kiya gaya client hamesha ek \`finally\` block mein pool mein wapas release hona chahiye, chahe transaction commit hui ho ya rollback, warna pool ke upalabdh connections aakhirkaar khatam ho jaayenge.',
      'Transactions kai judi writes ke aar-paar ek coordination samasya solve karte hain, kisi akeli query ke andar ek sahi-hone ki samasya nahi — ek toote transaction ke andar har akela statement apne aap mein poori tarah valid SQL ho sakta hai.',
    ],
  },
];
