/**
 * Node.js Complete Course — Module 7: Scaling & Production Operations,
 * lesson 12.
 *
 * Request timeouts: why a route with no timeout on a slow or hung
 * dependency (a third-party API, a slow query, a downstream service that
 * never responds) can hold a connection, memory, and — combined with this
 * course's concurrency-limiting lesson — one precious slot out of a
 * bounded concurrency budget FOREVER, even though nothing ever technically
 * "fails". Broken example: a route calling a third-party API with no
 * timeout at all — if that API hangs, the request hangs too, indefinitely,
 * silently accumulating stuck requests until the server has no capacity
 * left for anyone else. Fixed by giving every external call, and the
 * request itself, an explicit maximum time to complete, after which it is
 * deliberately aborted and a clear error is returned — trading a small,
 * controlled failure now for avoiding an unbounded, silent resource leak
 * later.
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

export const NODE_MODULE_7_PART12: CourseLesson[] = [
  {
    slug: 'request-timeouts',
    title: 'Request Timeouts: Stopping One Slow Call From Freezing Everyone Else',
    titleHi: 'Request Timeouts: Ek Dheemi Call Ko Baaki Sabko Jaam Karne Se Rokna',
    description: 'A third-party payment API hangs for one customer and never responds — and twenty minutes later, half the server\'s capacity is silently stuck waiting on that one call, with no error, no crash, and no obvious sign anything is even wrong.',
    descriptionHi: 'Ek third-party payment API ek customer ke liye latak jaata hai aur kabhi jawaab nahi deta — aur bees minute baad, server ki aadhi kshamta chupke se us ek call ka intezaar karte hue atki hoti hai, koi error nahi, koi crash nahi, aur koi saaf sanket nahi ki kuch galat bhi hai.',
    difficulty: 'MEDIUM',
    duration: 18,
    order: 12,

    analogy: {
      en: '**A customer service call center with no maximum call duration policy, versus one where every agent is trained to say "I need more time to resolve this — let me call you back" after a set number of minutes, freeing the phone line for the next waiting caller.** An agent taking a call with no time limit at all, for a caller whose issue turns out to be unusually complicated or who is stuck waiting on something themselves (an on-hold transfer that never connects, a system on the agent\'s end that never loads), simply stays on that one call indefinitely — the agent is not doing anything wrong, technically, they are still "working" on it, but from the call center\'s perspective that entire phone line is now gone, unavailable to every other caller, for however long the stuck call happens to last, which might be minutes or might be forever if the underlying issue never resolves. Multiply this by every agent eventually getting stuck on their own unusually long or hung call, and the entire call center\'s capacity to serve anyone quietly drains away, one indefinitely-occupied line at a time, with no alarm going off anywhere — nothing "crashed," there is simply no one left available to answer the phone. A call center with a maximum-duration policy instead trains every agent that once a call passes a set number of minutes without resolution, they explicitly end it with "let me look into this and call you back," freeing their line immediately for the next caller — the original customer\'s issue is not abandoned forever, it gets picked up again deliberately, but the phone line itself is never held hostage indefinitely by any single call, no matter how unusually long that call turns out to need.',
      hi: '**Ek customer service call center jisme koi maximum call duration policy nahi hai, versus ek jahan har agent ko sikhaaya gaya hai ki ek tay tadaad ke minuton ke baad "mujhe ye resolve karne mein aur waqt chahiye — main aapko wapas call karta hoon" kahe, phone line ko agli intezaar kar rahi caller ke liye khaali karte hue.** Ek agent jo bina kisi time limit ke ek call leta hai, ek caller ke liye jiska issue ajeeb taur par pechida nikalta hai ya jo khud kisi cheez ka intezaar mein atka hai (ek on-hold transfer jo kabhi connect nahi hota, agent ke taraf ka ek system jo kabhi load nahi hota), bas us ek call par apni marzi se atka rehta hai — agent technically kuch galat nahi kar raha, wo abhi bhi us par "kaam kar raha" hai, par call center ke nazariye se wo poori phone line ab gayab hai, har doosri caller ke liye na-upalabdh, chahe atki hui call jitni bhi der chale, jo shaayad minute ho ya shaayad hamesha ke liye agar asli issue kabhi resolve na ho. Ise har agent tak badhaao jo aakhirkaar apni khud ki ajeeb taur par lambi ya atki hui call mein phas jaata hai, aur poore call center ki kisi ko bhi serve karne ki kshamta chupke se khatam ho jaati hai, ek waqt mein ek anant-tarike-se-occupied line, kahin bhi koi alarm baje bina — kuch bhi "crash" nahi hua, bas phone uthaane ke liye koi bhi bacha nahi hai. Ek maximum-duration policy wala call center iske bajaye har agent ko sikhaata hai ki ek call jab bina resolution ke ek tay minuton se aage jaati hai, wo explicitly ise "mujhe ye dekhna hai aur main aapko wapas call karunga" ke saath khatam kar dete hain, apni line turant agli caller ke liye khaali karte hue — asli customer ka issue hamesha ke liye chhoda nahi jaata, wo jaan-boojhkar dobara uthaaya jaata hai, par phone line khud kabhi kisi ek call dwara anant tak bandhak nahi banaayi jaati, chahe wo call jitni bhi ajeeb taur par lambi zaroorat mein nikle.',
    },

    simple: `**Start broken.** A route that calls a third-party payment API, with no timeout at all:

\`\`\`js
app.post("/checkout", async (req, res, next) => {
  try {
    const result = await paymentClient.charge(req.body.amount, req.body.token);
    res.json({ status: "success", chargeId: result.id });
  } catch (err) {
    next(err);
  }
});
\`\`\`

Under ordinary conditions the payment provider responds within a few hundred milliseconds, and this route works fine. The problem is what happens the day the payment provider has its own internal incident — a slow database, an overloaded upstream service, a network partition — and instead of returning an error quickly, some fraction of its calls simply never respond at all. \`await paymentClient.charge(...)\` has no time limit of its own; it waits for however long the underlying HTTP call takes to either resolve or reject, which, with no timeout configured anywhere in the chain, can genuinely be forever. Each one of these hung requests holds open an HTTP connection, occupies memory for its request context, and — combined with this course's concurrency-limiting lesson — permanently occupies one slot out of the server's bounded concurrency budget, since that slot is never released until the request itself finishes, which it never does. A trickle of customers hitting this during the provider's incident is not itself catastrophic, but as more hang, the server's available concurrency slowly and silently drains away, with no crash, no error log, and no obvious signal — until the server is effectively unable to serve anyone at all, having quietly run out of capacity one indefinitely-stuck request at a time.

**The fix: give the outbound call, and the request itself, an explicit maximum duration**

\`\`\`js
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);

try {
  const result = await paymentClient.charge(req.body.amount, req.body.token, {
    signal: controller.signal,
  });
  clearTimeout(timeoutId);
  res.json({ status: "success", chargeId: result.id });
} catch (err) {
  clearTimeout(timeoutId);
  if (err.name === "AbortError") {
    return res.status(504).json({ error: "Payment provider timed out, please try again" });
  }
  next(err);
}
\`\`\`

\`\`\`ts
const controller = new AbortController();
const timeoutId: NodeJS.Timeout = setTimeout(() => controller.abort(), 5000);

try {
  const result = await paymentClient.charge(req.body.amount, req.body.token, {
    signal: controller.signal,
  });
  clearTimeout(timeoutId);
  res.json({ status: "success", chargeId: result.id });
} catch (err: any) {
  clearTimeout(timeoutId);
  if (err.name === "AbortError") {
    res.status(504).json({ error: "Payment provider timed out, please try again" });
    return;
  }
  next(err);
}
\`\`\`

\`AbortController\` gives this call an explicit, hard deadline: if the payment provider has not responded within 5 seconds, \`controller.abort()\` forcibly cancels the in-flight call, the \`await\` rejects with an \`AbortError\` instead of hanging forever, and the route immediately frees its concurrency slot and returns a clear \`504 Gateway Timeout\` to the client rather than silently waiting on a call that may never complete. This is a deliberate trade: a request that would have eventually succeeded after eight seconds now fails after five and must be retried — a small, controlled cost — in exchange for the far larger benefit of guaranteeing no single hung dependency can ever occupy server resources indefinitely, no matter how badly that dependency misbehaves.`,

    simpleHi: `**Toote hue se shuru.** Ek route jo ek third-party payment API ko call karta hai, bina kisi timeout ke:

\`\`\`js
app.post("/checkout", async (req, res, next) => {
  try {
    const result = await paymentClient.charge(req.body.amount, req.body.token);
    res.json({ status: "success", chargeId: result.id });
  } catch (err) {
    next(err);
  }
});
\`\`\`

Aam sthiti mein payment provider kuch sau milliseconds ke andar jawaab deta hai, aur ye route theek kaam karta hai. Samasya ye hai ki kya hota hai jis din payment provider ko apna khud ka internal incident hota hai — ek dheemi database, ek overloaded upstream service, ek network partition — aur turant ek error laut aane ke bajaye, iski kuch calls bilkul kabhi jawaab hi nahi deti. \`await paymentClient.charge(...)\` ki apni koi time limit nahi hai; ye intezaar karta hai chahe underlying HTTP call ko resolve ya reject hone mein jitna bhi waqt lage, jo, chain mein kahin bhi koi timeout configure na hone par, sach mein hamesha ke liye ho sakta hai. In atki hui requests mein se har ek ek HTTP connection khula rakhti hai, apne request context ke liye memory occupy karti hai, aur — is course ke concurrency-limiting lesson ke saath milkar — server ke seemit concurrency budget mein se ek slot hamesha ke liye occupy karti hai, kyunki wo slot kabhi release nahi hota jab tak request khud khatam na ho, jo wo kabhi hoti hi nahi. Provider ke incident ke dauraan isse takraati kuch customers ki ek chhoti dhaara khud vinaashkaari nahi hai, par jaise-jaise zyaada atakti hain, server ki upalabdh concurrency dheere-dheere aur chupke se khatam hoti jaati hai, koi crash nahi, koi error log nahi, aur koi saaf signal nahi — jab tak server asal mein kisi ko bhi serve karne mein asamarth ho jaata, chupke se ek waqt mein ek anant-taur-se-atki hui request se kshamta khatam kar chuka hokar.

**Fix: bahari call ko, aur khud request ko, ek explicit adhiktam avdhi do**

\`\`\`js
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);

try {
  const result = await paymentClient.charge(req.body.amount, req.body.token, {
    signal: controller.signal,
  });
  clearTimeout(timeoutId);
  res.json({ status: "success", chargeId: result.id });
} catch (err) {
  clearTimeout(timeoutId);
  if (err.name === "AbortError") {
    return res.status(504).json({ error: "Payment provider timed out, please try again" });
  }
  next(err);
}
\`\`\`

\`\`\`ts
const controller = new AbortController();
const timeoutId: NodeJS.Timeout = setTimeout(() => controller.abort(), 5000);

try {
  const result = await paymentClient.charge(req.body.amount, req.body.token, {
    signal: controller.signal,
  });
  clearTimeout(timeoutId);
  res.json({ status: "success", chargeId: result.id });
} catch (err: any) {
  clearTimeout(timeoutId);
  if (err.name === "AbortError") {
    res.status(504).json({ error: "Payment provider timed out, please try again" });
    return;
  }
  next(err);
}
\`\`\`

\`AbortController\` is call ko ek explicit, pakki deadline deta hai: agar payment provider ne 5 seconds ke andar jawaab nahi diya, \`controller.abort()\` jabardasti in-flight call cancel kar deta hai, \`await\` ek \`AbortError\` ke saath reject hota hai hamesha ke liye latakne ke bajaye, aur route turant apna concurrency slot khaali karta hai aur client ko ek saaf \`504 Gateway Timeout\` lautaata hai ek aisi call par chupke se intezaar karne ke bajaye jo shaayad kabhi poori na ho. Ye ek jaan-boojhkar trade hai: ek request jo aath seconds baad aakhirkaar safal ho jaati wo ab paanch seconds baad fail hoti hai aur retry karni padti hai — ek chhoti, niyantrit keemat — us kaafi badi fayde ke badle mein ki koi bhi ek atki hui dependency kabhi bhi server resources ko hamesha ke liye occupy nahi kar sakti, chahe wo dependency kitni bhi bura vyavhaar kare.`,

    content: `## Every outbound call needs its own explicit deadline — Node.js gives none by default

\`\`\`
No timeout configured anywhere:
"await" waits as long as the underlying operation takes to settle —
which, for a hung TCP connection or a provider that never responds,
can genuinely be forever. Nothing in Node.js or the HTTP client
imposes any limit unless one is explicitly set.
\`\`\`

By default, neither Node.js's built-in \`http\`/\`https\` modules nor most third-party HTTP client libraries impose any timeout on an outbound request unless the calling code explicitly configures one. This means every single external call a route makes — to a payment provider, a third-party API, another internal microservice, even a slow database query — is, by default, capable of hanging indefinitely if the thing on the other end simply never responds. This is easy to overlook precisely because it almost never matters during normal development and testing, when dependencies reliably respond quickly — the risk only materializes during a real production incident on the OTHER system, which is exactly the moment a server needs to be resilient rather than quietly accumulating stuck requests.

## Combining with concurrency limiting: a hung request never releases its slot

\`\`\`
Without a timeout: a hung request holds its concurrency slot (this
course's earlier lesson) FOREVER, since the slot is only released
when the request finishes — which it never does.

With a timeout: the request is forcibly ended after a bounded
maximum duration, always releasing its slot, succeeding or failing
within a predictable, known window.
\`\`\`

This lesson's concern connects directly to the previous concurrency-limiting lesson: a concurrency cap protects against too many requests being processed AT ONCE, but it implicitly assumes every request eventually finishes, one way or another, within some reasonable time. A request timeout is what actually guarantees that assumption holds — without it, a single misbehaving dependency can cause requests to never finish at all, and a concurrency limit alone does nothing to reclaim a slot that is being held by a request that simply never completes. The two techniques are complementary: concurrency limiting bounds how much can be in flight at once, and request timeouts bound how long any single one of those things is allowed to remain in flight.

## Setting timeout durations deliberately, not as an afterthought

\`\`\`js
// A payment provider might reasonably be given longer than an
// internal, same-datacenter microservice call
const PAYMENT_TIMEOUT_MS = 5000;
const INTERNAL_SERVICE_TIMEOUT_MS = 1000;
\`\`\`

Different outbound calls warrant different timeout durations based on their genuine expected latency and how critical a fast response is: an internal microservice call within the same datacenter might reasonably be expected to respond in well under a second, while a third-party payment gateway processing a real financial transaction might legitimately need several seconds. Setting a timeout too aggressively short causes normal, healthy requests to be needlessly aborted and retried, adding load and latency for no benefit; setting it too generously long delays how quickly a genuinely stuck request frees its resources, undermining the entire purpose of having a timeout in the first place. The right value comes from observing genuine latency under normal conditions (following this course's earlier metrics and observability lesson's percentile data) and setting the timeout comfortably above that, not from an arbitrary guess.

## The server's own overall request timeout, as a final backstop

\`\`\`js
const server = app.listen(PORT);
server.setTimeout(30000); // no single request may run longer than 30 seconds, period
\`\`\`

Beyond timing individual outbound calls, Node.js's own HTTP server can be given a blanket maximum duration for how long it will keep any single request's connection open at all, via \`server.setTimeout()\`. This acts as a final, blunt backstop rather than a primary defense — well-designed routes should already be timing out their own slow dependencies individually, with specific, appropriate durations and clear error messages, but a server-level timeout ensures that even a route someone forgot to add explicit timeout handling to cannot hang a connection past a fixed outer limit, closing it and freeing the connection regardless.`,

    contentHi: `## Har bahari call ko apni khud ki explicit deadline chahiye — Node.js by default koi nahi deta

\`\`\`
Kahin bhi koi timeout configure nahi:
"await" utni der intezaar karta hai jitni underlying operation ko
settle hone mein lagti hai — jo, ek atke hue TCP connection ya ek
aise provider ke liye jo kabhi jawaab nahi deta, sach mein hamesha
ke liye ho sakta hai. Node.js ya HTTP client mein kuch bhi koi
seemaa lagaata nahi jab tak ek explicitly set na ho.
\`\`\`

By default, na Node.js ke built-in \`http\`/\`https\` modules aur na hi zyaadatar third-party HTTP client libraries ek bahari request par koi timeout lagaate hain jab tak calling code explicitly ek configure na kare. Iska matlab hai har akeli bahari call jo ek route karta hai — ek payment provider ko, ek third-party API ko, ek doosri internal microservice ko, ek dheemi database query tak — by default, hamesha ke liye latakne ki kshamta rakhti hai agar doosre sire par wali cheez bilkul kabhi jawaab hi nahi deti. Ise nazarandaaz karna aasaan hai bilkul isliye kyunki normal development aur testing ke dauraan ye lagbhag kabhi maayne nahi rakhta, jab dependencies bharosemand taur par jaldi jawaab deti hain — khatra tabhi asli roop leta hai jab DOOSRE system par ek asli production incident hota hai, jo bilkul wahi pal hai jab ek server ko resilient hona chahiye chupke se atki hui requests jama karne ke bajaye.

## Concurrency limiting ke saath jodna: ek atki hui request kabhi apni slot khaali nahi karti

\`\`\`
Timeout bina: ek atki hui request apni concurrency slot (is course ke
pehle wale lesson se) HAMESHA KE LIYE pakde rehti hai, kyunki slot
sirf tab release hoti hai jab request khatam hoti hai — jo wo kabhi
hoti hi nahi.

Timeout ke saath: request ek seemit adhiktam avdhi ke baad jabardasti
khatam kar di jaati hai, hamesha apni slot release karte hue, ek
anumaanit, jaani-pehchaani window ke andar safal ya fail hote hue.
\`\`\`

Is lesson ki chinta seedhe pehle wale concurrency-limiting lesson se judti hai: ek concurrency cap bahut zyaada requests EK SAATH process hone se surakshit karta hai, par ye implicitly maanta hai ki har request aakhirkaar, kisi na kisi tarah, kisi samajhdaari-bhare waqt ke andar khatam hoti hai. Ek request timeout wo cheez hai jo asal mein us dhaarna ko sach karta hai — iske bina, ek galat vyavhaar karti dependency requests ko kabhi bhi bilkul khatam na hone de sakti hai, aur akela concurrency limit us slot ko wapas paane ke liye kuch nahi karta jise ek aisi request pakde hai jo kabhi poori hoti hi nahi. Ye dono techniques ek doosre ki poorak hain: concurrency limiting seemit karta hai ki ek saath kitna in flight ho sakta hai, aur request timeouts seemit karte hain ki un mein se koi bhi ek cheez kitni der tak in flight rehne ki ijaazat hai.

## Timeout avdhi jaan-boojhkar set karna, ek afterthought ki tarah nahi

\`\`\`js
// Ek payment provider ko samajhdaari se ek internal, usi-datacenter
// microservice call se zyaada waqt diya jaa sakta hai
const PAYMENT_TIMEOUT_MS = 5000;
const INTERNAL_SERVICE_TIMEOUT_MS = 1000;
\`\`\`

Alag bahari calls apni asli anumaanit latency aur ek tez jawaab kitna zaruri hai ke aadhaar par alag timeout avdhi maang sakte hain: usi datacenter ke andar ek internal microservice call samajhdaari se ek second se kaafi kam mein jawaab dene ki umeed rakh sakta hai, jabki ek asli financial transaction process karta third-party payment gateway samajhdaari se kai seconds chaah sakta hai. Ek timeout ko bahut zyaada aggressively chhota set karna normal, sehatmand requests ko bekaar mein abort aur retry karwaata hai, koi fayda bina load aur latency badhaate hue; ise bahut zyaada udaarta se lamba set karna dheema karta hai ki ek sach mein atki hui request kitni jaldi apne resources khaali karti hai, timeout hone ka poora maqsad hi kamzor karte hue. Sahi value normal sthiti mein asli latency dekhne se aati hai (is course ke pehle wale metrics aur observability lesson ke percentile data ka palan karte hue) aur timeout ko us se aaraam se oopar set karne se, ek manmaani guess se nahi.

## Server ka apna kul request timeout, ek aakhri backstop ki tarah

\`\`\`js
const server = app.listen(PORT);
server.setTimeout(30000); // koi akeli request 30 seconds se zyaada nahi chal sakti, bas
\`\`\`

Alag-alag bahari calls ke waqt ke aage, Node.js ka apna HTTP server ko ek poori tarah adhiktam avdhi di jaa sakti hai ki ye kisi bhi akeli request ka connection kitni der khula rakhega, \`server.setTimeout()\` ke zariye. Ye ek aakhri, mota backstop ki tarah kaam karta hai ek mukhya defense ki tarah nahi — achhi tarah design kiye gaye routes ko pehle se hi apni dheemi dependencies ko individually, khaas, upyukt avdhi aur saaf error messages ke saath timeout karna chahiye, par ek server-level timeout sunishchit karta hai ki jis route mein koi explicit timeout handling jodna bhool gaya ho wo bhi ek connection ko ek tay bahari seemaa se aage nahi latka sakta, use band karte hue aur connection khaali karte hue chahe kuch bhi ho.`,

    examples: [
      {
        title: 'Broken: a payment call with no timeout at all',
        titleHi: 'Toota: koi timeout bina ek payment call',
        code: `app.post("/checkout", async (req, res, next) => {
  const result = await paymentClient.charge(req.body.amount, req.body.token);
  res.json({ status: "success", chargeId: result.id });
});
// if the payment provider hangs, this request hangs forever`,
        codeJs: `app.post("/checkout", async (req, res, next) => {
  try {
    const result = await paymentClient.charge(req.body.amount, req.body.token);
    res.json({ status: "success", chargeId: result.id });
  } catch (err) {
    next(err);
  }
});
// nothing here bounds how long "await" can wait`,
        codeTs: `app.post("/checkout", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await paymentClient.charge(req.body.amount, req.body.token);
    res.json({ status: "success", chargeId: result.id });
  } catch (err) {
    next(err);
  }
});
// Correctly typed, completely valid TypeScript — the risk is entirely
// about an unbounded wait, not a type or logic error.`,
        output: `Ordinary conditions: fast, correct responses. During the payment
provider's own incident: some requests never resolve at all, each
one permanently holding a connection, memory, and a concurrency slot
until the server process itself is restarted.`,
        explain: 'Nothing in this code imposes any maximum duration on the outbound call — if the dependency hangs, the request, and every resource it holds, hangs along with it, indefinitely.',
        explainHi: 'Is code mein kuch bhi bahari call par koi adhiktam avdhi nahi lagaata — agar dependency latakti hai, request, aur us se judi har resource, uske saath latakti hai, hamesha ke liye.',
      },
      {
        title: 'Fixed: AbortController gives the call a hard deadline',
        titleHi: 'Theek: AbortController call ko ek pakki deadline deta hai',
        code: `const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);
try {
  const result = await paymentClient.charge(amount, token, { signal: controller.signal });
  clearTimeout(timeoutId);
} catch (err) {
  clearTimeout(timeoutId);
  if (err.name === "AbortError") { /* handle timeout */ }
}`,
        codeJs: `app.post("/checkout", async (req, res, next) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const result = await paymentClient.charge(req.body.amount, req.body.token, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    res.json({ status: "success", chargeId: result.id });
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      return res.status(504).json({ error: "Payment provider timed out, please try again" });
    }
    next(err);
  }
});`,
        codeTs: `app.post("/checkout", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const controller = new AbortController();
  const timeoutId: NodeJS.Timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const result = await paymentClient.charge(req.body.amount, req.body.token, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    res.json({ status: "success", chargeId: result.id });
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      res.status(504).json({ error: "Payment provider timed out, please try again" });
      return;
    }
    next(err);
  }
});`,
        outputJs: `If the payment provider hangs past 5 seconds, the call is forcibly
aborted, the concurrency slot is freed immediately, and the client
receives a clear 504 rather than waiting indefinitely.`,
        outputTs: `// Identical behaviour. clearTimeout(timeoutId) on the success path
// prevents the scheduled abort from firing after the call has
// already completed successfully.`,
        explain: 'The AbortController gives the outbound call an explicit maximum lifetime — past that point it is forcibly cancelled, guaranteeing the request always finishes, one way or another, within a bounded time.',
        explainHi: 'AbortController bahari call ko ek explicit adhiktam jeevan deta hai — us point ke aage ise jabardasti cancel kar diya jaata hai, sunishchit karte hue ki request hamesha, kisi na kisi tarah, ek seemit waqt ke andar khatam hoti hai.',
      },
      {
        title: 'A generic timeout wrapper for any promise-based call',
        titleHi: 'Kisi bhi promise-based call ke liye ek generic timeout wrapper',
        code: `function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("Timed out")), ms)),
  ]);
}`,
        codeJs: `function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("Timed out")), ms)),
  ]);
}

app.get("/inventory/:sku", async (req, res, next) => {
  try {
    const result = await withTimeout(
      inventoryService.getStock(req.params.sku),
      1000
    );
    res.json(result);
  } catch (err) {
    if (err.message === "Timed out") {
      return res.status(504).json({ error: "Inventory service timed out" });
    }
    next(err);
  }
});`,
        codeTs: `function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("Timed out")), ms)),
  ]);
}

app.get("/inventory/:sku", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await withTimeout(
      inventoryService.getStock(req.params.sku),
      1000
    );
    res.json(result);
  } catch (err: any) {
    if (err.message === "Timed out") {
      res.status(504).json({ error: "Inventory service timed out" });
      return;
    }
    next(err);
  }
});`,
        outputJs: `withTimeout races the real call against a timer; whichever settles
first wins — a genuinely slow internal service call is bounded to
1 second even without that service's own client library supporting
AbortController directly.`,
        outputTs: `// Identical behaviour, fully generic over the resolved type T —
// reusable for any promise-based call across the codebase, not
// just HTTP requests specifically.`,
        explain: 'Not every dependency\'s client library supports AbortController directly — Promise.race provides a simple, universal fallback that imposes a timeout on any promise regardless of what it wraps.',
        explainHi: 'Har dependency ki client library seedhe AbortController support nahi karti — Promise.race ek saadha, sarvavyaapi fallback deta hai jo kisi bhi promise par timeout lagaata hai wo chahe kuch bhi wrap kare.',
      },
    ],

    mistakes: [
      {
        wrong: `const result = await paymentClient.charge(amount, token);
// no timeout anywhere — a hung provider hangs this request forever`,
        right: `const controller = new AbortController();
setTimeout(() => controller.abort(), 5000);
const result = await paymentClient.charge(amount, token, { signal: controller.signal });`,
        why: 'An outbound call with no explicit timeout can hang for as long as the dependency itself hangs, with no upper bound — every such call needs its own deliberate maximum duration.',
        whyHi: 'Ek bahari call jisme koi explicit timeout nahi hai utni der latak sakti hai jitni dependency khud latakti hai, koi upar ki seemaa bina — aisi har call ko apni khud ki jaan-boojhkar adhiktam avdhi chahiye.',
      },
      {
        wrong: `const TIMEOUT_MS = 100; // far shorter than the dependency's genuine normal latency
// healthy, slightly-slower-than-usual requests get needlessly aborted and retried`,
        right: `// Set based on observed normal latency (this course's metrics lesson),
// comfortably above it — e.g. 5000ms for a payment gateway that
// normally responds in 200-800ms`,
        why: 'A timeout set too aggressively short causes normal, healthy requests to be aborted and retried unnecessarily, adding load and latency without protecting against anything real.',
        whyHi: 'Bahut zyaada aggressively chhota set kiya gaya timeout normal, sehatmand requests ko bekaar mein abort aur retry karwaata hai, kisi asli cheez se surakshit kiye bina load aur latency badhaate hue.',
      },
      {
        wrong: `try {
  await withTimeout(riskyCall(), 3000);
} catch (err) {
  next(err); // treats a timeout identically to every other kind of error
}`,
        right: `try {
  await withTimeout(riskyCall(), 3000);
} catch (err) {
  if (err.message === "Timed out") {
    return res.status(504).json({ error: "Upstream service timed out, please retry" });
  }
  next(err);
}`,
        why: 'A timeout is a specific, expected failure mode with a clear, actionable client response (504, "please retry") — collapsing it into generic error handling loses that clarity for both the client and anyone debugging logs later.',
        whyHi: 'Ek timeout ek khaas, anumaanit fail-hone ka tarika hai ek saaf, actionable client response ke saath (504, "please retry") — ise generic error handling mein girana ye saaf-safaai client aur baad mein logs debug karne wale kisi ke liye bhi kho deta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Configuring an explicit request timeout is one of the most universally recommended production practices for any outbound HTTP call**, cited across virtually every major HTTP client library\'s documentation and production readiness checklist, precisely because the default behavior of waiting indefinitely is almost never what a production system actually wants.',
        hi: '**Ek explicit request timeout configure karna kisi bhi bahari HTTP call ke liye sabse zyaada sarvavyaapi taur par recommend ki jaane waali production practices mein se ek hai**, lagbhag har mukhya HTTP client library ki documentation aur production readiness checklist mein cite ki jaati hai, bilkul isliye kyunki hamesha ke liye intezaar karne ka default vyavhaar lagbhag kabhi wo nahi hai jo ek production system asal mein chaahta hai.',
      },
      {
        en: '**Timeouts combined with retries and circuit breakers (this course\'s earlier resilience lessons) form a standard, well-established trio of techniques production teams rely on together** to survive a downstream dependency behaving badly, rather than any single technique being sufficient in isolation.',
        hi: '**Timeouts, retries aur circuit breakers (is course ke pehle wale resilience lessons) ke saath milkar techniques ka ek standard, achhi tarah sthaapit trio banaate hain jin par production teams ek saath bharosa karti hain** ek downstream dependency ke bura vyavhaar karne se bachne ke liye, akele koi ek technique kaafi hone ke bajaye.',
      },
      {
        en: '**"Cascading failures" caused by one slow, un-timed-out dependency slowly exhausting an entire service\'s resources are among the most commonly cited real-world causes of major outages** in postmortems published by companies operating distributed systems at scale.',
        hi: '**"Cascading failures" jo ek dheemi, bina-timeout wali dependency ke dwara ek poori service ke resources ko dheere-dheere khatam karne se hoti hain, scale par distributed systems chalaane waali companies dwara publish ki gayi postmortems mein bade outages ke sabse aam taur par cite kiye jaane waale asli-duniya kaaranon mein se hain.**',
      },
    ],

    interviewQA: [
      {
        q: 'Why can a route with no timeout on an outbound dependency eventually take down an entire server, even though no individual request ever technically "fails"?',
        qHi: 'Ek route jismein ek bahari dependency par koi timeout nahi hai aakhirkaar poore server ko kyun neeche laa sakta hai, chahe koi akeli request technically kabhi "fail" na ho?',
        a: 'A request that is neither succeeding nor failing, but simply waiting indefinitely on a hung outbound call, is not free from a resource-consumption perspective — it continues to hold open whatever HTTP connection or socket it used to make that outbound call, continues to occupy the memory associated with its request context and any local variables in scope, and, combined with this course\'s concurrency-limiting lesson, continues to occupy one slot out of a bounded concurrency budget that is never released until the request itself finishes, which by definition never happens for a permanently hung call. None of this shows up as an error, a crash, or even an elevated error rate in monitoring — from every conventional signal\'s perspective, these requests are simply "still processing," indistinguishable from genuinely slow but eventually-successful ones, until someone specifically investigates why available concurrency or connection pool capacity keeps silently shrinking over time. As more requests hit the same hung dependency during its own incident, more and more of the server\'s finite resources — connections, memory, concurrency slots — become permanently tied up in this way, and given enough accumulated stuck requests, the server eventually has no capacity left to accept or meaningfully process any NEW request at all, even ones entirely unrelated to the original hung dependency, effectively taking the whole server down without a single explicit error or crash ever having occurred.',
        aHi: 'Ek request jo na safal ho rahi hai na fail, bas ek atki hui bahari call ka hamesha ke liye intezaar kar rahi hai, resource-consumption ke nazariye se muft nahi hai — ye jo bhi HTTP connection ya socket use kiya us bahari call ke liye use khula rakhti hai, apne request context aur scope mein kisi bhi local variables se judi memory occupy karti rehti hai, aur, is course ke concurrency-limiting lesson ke saath milkar, ek seemit concurrency budget mein se ek slot occupy karti rehti hai jo kabhi release nahi hoti jab tak request khud khatam na ho, jo definition se ek hamesha-ke-liye-atki hui call ke liye kabhi hoti hi nahi. Inmein se kuch bhi ek error, ek crash, ya monitoring mein ek badhi hui error rate ki tarah bhi nahi dikhta — har conventional signal ke nazariye se, ye requests bas "abhi bhi process ho rahi hain," un se alag-nahi-pehchaani-jaane-laayak jo sach mein dheemi par aakhirkaar-safal hain, jab tak koi khaas taur par jaanch na kare ki upalabdh concurrency ya connection pool kshamta waqt ke saath chupke se kyun ghat rahi hai. Jaise-jaise zyaada requests usi atki hui dependency se uske apne incident ke dauraan takraati hain, server ke zyaada-se-zyaada seemit resources — connections, memory, concurrency slots — is tarah hamesha ke liye bandh jaate hain, aur kaafi jama hui atki hui requests ke saath, server aakhirkaar kisi bhi NAYI request ko accept ya maayne-rakhta process karne ki kshamta bilkul nahi rakhta, un ke sameet jinka asli atki hui dependency se koi lena-dena nahi, asar mein poore server ko neeche laate hue bina ek bhi explicit error ya crash kabhi hue.',
      },
      {
        q: 'How do request timeouts and concurrency limiting complement each other, and why is neither one sufficient on its own?',
        qHi: 'Request timeouts aur concurrency limiting ek doosre ki poorak kaise hain, aur akela koi ek kaafi kyun nahi hai?',
        a: 'Concurrency limiting (this course\'s earlier lesson) bounds how many requests the server will process at the exact same moment, protecting downstream resources like a database connection pool from being overwhelmed by too much simultaneous work — but it implicitly relies on an assumption it cannot itself enforce: that every request currently occupying one of those limited concurrency slots will eventually finish, freeing that slot for the next waiting request. Without a request timeout, that assumption can be silently violated by a single hung dependency: a request stuck waiting on a call that never responds occupies its concurrency slot forever, and no amount of concurrency limiting reclaims a slot that is never voluntarily released — the cap simply ensures that AT MOST that many slots can be permanently lost this way rather than an unbounded number, which is protection against one specific bad scenario but does nothing to prevent the underlying resource leak itself. Conversely, a request timeout alone, without any concurrency limit, ensures individual requests cannot hang forever, but does nothing to prevent an overwhelming burst of simultaneous, individually well-behaved requests from exhausting downstream resources all at once, the exact scenario the concurrency-limiting lesson addresses. The two techniques protect against genuinely different failure modes — one bounds how much work is in flight simultaneously, the other bounds how long any single piece of that work is allowed to remain in flight — and a production system needs both to be resilient against the range of ways a dependency or a traffic pattern can misbehave.',
        aHi: 'Concurrency limiting (is course ka pehle wala lesson) seemit karta hai ki server bilkul usi pal kitni requests process karega, downstream resources jaise ek database connection pool ko bahut zyaada ek-saath kaam se overwhelmed hone se bachaate hue — par ye implicitly ek dhaarna par nirbhar hai jise ye khud lagu nahi kar sakta: ki abhi un seemit concurrency slots mein se ek occupy kar rahi har request aakhirkaar khatam hogi, agli intezaar kar rahi request ke liye wo slot khaali karte hue. Request timeout ke bina, wo dhaarna ek akeli atki hui dependency dwara chupke se toot sakti hai: ek aisi call ka intezaar mein atki request jo kabhi jawaab nahi deti apni concurrency slot hamesha ke liye occupy karti hai, aur concurrency limiting ki kitni bhi tadaad us slot ko wapas nahi paati jo kabhi apni marzi se release nahi hoti — cap bas sunishchit karta hai ki ADHIKTAM utni hi slots is tarah hamesha ke liye kho sakti hain ek na-simit tadaad ke bajaye, jo ek khaas bure scenario ke khilaaf protection hai par asli resource leak ko khud rokne ke liye kuch nahi karta. Iske ulta, akela request timeout, bina kisi concurrency limit ke, sunishchit karta hai ki akeli requests hamesha ke liye nahi latak sakti, par ek saath aayi bahut zyaada, individually achhe-vyavhaar wali requests ki ek burst ko downstream resources ek saath khatam karne se rokne ke liye kuch nahi karta, bilkul wahi scenario jise concurrency-limiting lesson sambodhit karta hai. Ye do techniques sach mein alag fail-hone ke tarikon se surakshit karte hain — ek seemit karta hai ki ek saath kitna kaam in flight hai, doosra seemit karta hai ki us kaam ka koi ek hissa kitni der tak in flight rehne ki ijaazat hai — aur ek production system ko dono ki zaroorat hai ek dependency ya traffic pattern ke bura vyavhaar karne ke tarah-tarah ke tareekon ke khilaaf resilient hone ke liye.',
      },
      {
        q: 'How should the specific duration of a timeout be chosen, and what goes wrong if it is set poorly in either direction?',
        qHi: 'Ek timeout ki khaas avdhi kaise chuni jaani chahiye, aur agar ye kisi bhi disha mein galat set ki jaaye to kya galat hota hai?',
        a: 'A timeout\'s duration should be grounded in a genuine understanding of the dependency\'s actual expected latency under normal, healthy conditions — ideally derived from real observed data, such as the percentile latency figures this course\'s metrics and observability lesson describes gathering, rather than an arbitrary guess. The timeout should be set comfortably above the dependency\'s typical p99 latency (the latency below which 99% of genuinely healthy requests complete), leaving enough margin that normal, occasionally-slightly-slower-than-average requests are not mistaken for hung ones. If a timeout is set too aggressively short, relative to the dependency\'s genuine normal latency, requests that are actually healthy but happen to fall on the slower end of normal variation get needlessly aborted and must be retried, which not only fails requests that would have eventually succeeded on their own, but adds extra load to the dependency in the form of unnecessary retries, potentially making a real problem worse rather than better. If a timeout is instead set too generously long, it fails to achieve its actual purpose in a timely way: a genuinely hung request still eventually gets cut off, but only after needlessly holding its resources — a connection, memory, a concurrency slot — for far longer than necessary, delaying how quickly the server can recover its own capacity during an actual incident on the dependency\'s side. The right value is a deliberate balance grounded in real latency data, re-evaluated periodically as a dependency\'s own typical performance characteristics change over time, rather than a number chosen once and never revisited.',
        aHi: 'Ek timeout ki avdhi dependency ki asli anumaanit latency ki ek sach mein samajh mein tiki honi chahiye normal, sehatmand sthiti mein — aadarsh roop se asli dekhe gaye data se nikaali gayi, jaise ki is course ka metrics aur observability lesson jama karna describe karta percentile latency figures, ek manmaani guess ke bajaye. Timeout ko dependency ki aam p99 latency (wo latency jiske neeche 99% sach mein sehatmand requests poori hoti hain) se aaraam se oopar set kiya jaana chahiye, itna margin chhodte hue ki normal, kabhi-kabhi thodi dheemi-se-average requests atki hui na samjhi jaayein. Agar ek timeout dependency ki asli aam latency ke muqable bahut zyaada aggressively chhota set kiya jaata hai, wo requests jo asal mein sehatmand hain par normal variation ke dheeme sire par aa jaati hain bekaar mein abort ho jaati hain aur retry karni padti hain, jo na sirf un requests ko fail karta hai jo apni marzi se aakhirkaar safal ho jaatin, balki dependency par extra load jodta hai bekaar retries ki soorat mein, ek asli samasya ko behtar ke bajaye bad-tar bana sakta hai. Agar iske bajaye ek timeout bahut zyaada udaarta se lamba set kiya jaata hai, ye apna asli maqsad samay par poora karne mein fail hota hai: ek sach mein atki hui request phir bhi aakhirkaar kaati jaati hai, par bekaar mein apne resources — ek connection, memory, ek concurrency slot — ko zaroorat se kaafi zyaada der pakde rehne ke baad, ye dheema karte hue ki server dependency ke taraf ke ek asli incident ke dauraan kitni jaldi apni kshamta wapas paa sakta hai. Sahi value asli latency data mein tiki ek jaan-boojhkar santulan hai, samay-samay par dobara jaanchi jaati hai jaise ek dependency ki apni aam performance characteristics waqt ke saath badalti hain, ek baar chuni gayi aur kabhi dobara na dekhi gayi sankhya ke bajaye.',
      },
    ],

    exercises: [
      {
        task: 'Build a route that calls a mock "slow dependency" function that never resolves (a Promise that is simply never settled). Confirm the request hangs indefinitely with no timeout in place.',
        taskHi: 'Ek route banao jo ek mock "slow dependency" function ko call kare jo kabhi resolve nahi hota (ek Promise jo bas kabhi settle nahi hota). Confirm karo ki request bina kisi timeout ke hamesha ke liye latakti hai.',
        hint: 'A Promise that never calls resolve or reject and is never wrapped in any timeout mechanism will cause an await on it to hang forever — this is intentional for this exercise.',
        hintHi: 'Ek Promise jo kabhi resolve ya reject call nahi karta aur kabhi kisi timeout mechanism mein wrap nahi hota, uspar ek \`await\` ko hamesha ke liye latkaayega — ye is exercise ke liye jaan-boojhkar hai.',
      },
      {
        task: 'Add an AbortController-based timeout of 2 seconds around the same call. Confirm the request now fails cleanly with a 504 after 2 seconds instead of hanging indefinitely.',
        taskHi: 'Usi call ke aas-paas 2 second ka ek AbortController-based timeout jodo. Confirm karo ki request ab 2 second baad ek saaf \`504\` ke saath fail hoti hai hamesha ke liye latakne ke bajaye.',
        hint: 'If the dependency function does not support an AbortSignal directly, use the generic withTimeout(promise, ms) wrapper based on Promise.race shown in this lesson instead.',
        hintHi: 'Agar dependency function seedhe ek AbortSignal support nahi karta, is lesson mein dikhaaya \`Promise.race\`-aadhaarit generic \`withTimeout(promise, ms)\` wrapper iske bajaye istemal karo.',
      },
      {
        task: 'Combine this timeout with the earlier concurrency-limiting middleware. Send a burst of requests that would all hang without a timeout, and confirm the concurrency slot count returns to normal shortly after the timeout duration, rather than staying permanently occupied.',
        taskHi: 'Is timeout ko pehle wale concurrency-limiting middleware ke saath jodo. Requests ka ek burst bhejo jo bina timeout ke sab latak jaatin, aur confirm karo ki concurrency slot count timeout avdhi ke thodi der baad normal par wapas aati hai, hamesha ke liye occupied rehne ke bajaye.',
        hint: 'Log activeRequests before the burst, immediately after sending it, and again a few seconds after the timeout duration has passed, to observe the count returning to its baseline.',
        hintHi: '\`activeRequests\` ko burst se pehle, use bhejne ke turant baad, aur timeout avdhi guzarne ke kuch second baad log karo, count ko apni baseline par wapas aate hue dekhne ke liye.',
      },
    ],

    keyTakeaways: [
      'Neither Node.js nor most HTTP client libraries impose any default timeout on an outbound call — without one explicitly configured, a hung dependency can cause a request to wait indefinitely.',
      'A hung, un-timed-out request permanently holds its connection, memory, and — combined with concurrency limiting — a concurrency slot, silently draining server capacity with no crash or error visible.',
      'AbortController provides a clean, standard way to give any fetch-like call a hard deadline, forcibly cancelling it and rejecting with an AbortError once that deadline passes.',
      'A generic Promise.race-based timeout wrapper works for any promise-based call, including ones whose underlying library does not support AbortController directly.',
      'Timeout durations should be grounded in a dependency\'s genuine observed latency (ideally from real percentile metrics), set comfortably above it — too short wastes retries on healthy requests, too long delays recovering resources from a genuinely hung one.',
      'Request timeouts and concurrency limiting are complementary, not redundant: one bounds how long any single request may remain in flight, the other bounds how many may be in flight at once — a resilient system needs both.',
    ],
    keyTakeawaysHi: [
      'Na Node.js na zyaadatar HTTP client libraries ek bahari call par koi default timeout lagaate hain — ek explicitly configure kiye bina, ek atki hui dependency ek request ko hamesha ke liye intezaar karwaa sakti hai.',
      'Ek atki hui, bina-timeout wali request apna connection, memory, aur — concurrency limiting ke saath milkar — ek concurrency slot hamesha ke liye pakde rehti hai, koi crash ya error dikhe bina server kshamta ko chupke se khatam karte hue.',
      'AbortController kisi bhi fetch-jaisi call ko ek pakki deadline dene ka ek saaf, standard tarika deta hai, deadline guzarte hi use jabardasti cancel karte hue aur ek AbortError ke saath reject karte hue.',
      'Ek generic \`Promise.race\`-aadhaarit timeout wrapper kisi bhi promise-based call ke liye kaam karta hai, un ke sameet jinki underlying library seedhe AbortController support nahi karti.',
      'Timeout avdhi ek dependency ki asli dekhi gayi latency mein tiki honi chahiye (aadarsh roop se asli percentile metrics se), us se aaraam se oopar set ki gayi — bahut chhoti sehatmand requests par retries barbaad karti hai, bahut lambi ek sach mein atki hui se resources wapas paana dheema karti hai.',
      'Request timeouts aur concurrency limiting ek doosre ki poorak hain, dohraav nahi: ek seemit karta hai ki koi ek request kitni der in flight reh sakti hai, doosra seemit karta hai ki ek saath kitni in flight ho sakti hain — ek resilient system ko dono chahiye.',
    ],
  },
];
