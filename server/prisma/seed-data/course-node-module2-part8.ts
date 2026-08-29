/**
 * Node.js Complete Course — Module 2: Building APIs with Express, lesson 8
 * (final lesson of Module 2).
 *
 * HTTP status codes, part 2 of 2: the 4xx client-error family (400, 401,
 * 403, 404, 405, 409, 422, 429) and the 5xx server-error family (500,
 * 502, 503). Broken example: an API that uses 400 for every single
 * client-facing failure — a malformed JSON body, a missing auth token,
 * someone else's resource, a resource that does not exist, a duplicate
 * email, and a rate limit all return the exact same 400, forcing every
 * client to parse an error message string to figure out what actually
 * went wrong, and breaking anything (a retry policy, an auth redirect,
 * a "resource not found" 404 page) that could otherwise have acted
 * correctly from the status code alone. Fixed by using the status code
 * that actually distinguishes each of these genuinely different failure
 * reasons, and by distinguishing the 5xx family (server's own fault)
 * from all of them.
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

export const NODE_MODULE_2_PART8: CourseLesson[] = [
  {
    slug: 'http-status-codes-4xx-5xx',
    title: 'HTTP Status Codes: Client Errors and Server Errors',
    titleHi: 'HTTP Status Codes: Client Errors Aur Server Errors',
    description: 'Six completely different failures — a malformed request body, a missing login, someone else\'s private resource, a resource that was deleted, a duplicate signup, and too many requests — all return the exact same HTTP 400, leaving the client with nothing but an error-message string to figure out which one actually happened.',
    descriptionHi: 'Chhe bilkul alag failures — ek kharaab request body, ek gaayab login, kisi aur ki private resource, ek resource jo delete ho chuki, ek duplicate signup, aur bahut zyaada requests — sab bilkul wahi HTTP 400 return karti hain, client ko sirf ek error-message string chhodte hue ye pata lagaane ke liye ki asal mein kaunsi hui.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 8,

    analogy: {
      en: '**A single security guard at a building\'s front desk who responds to every single reason someone might be turned away — an unreadable ID, an expired badge, wrong-building credentials that belong to a neighboring office, a floor that got demolished last year, one person trying to sign in for the fifth time today under five different names, and a fire alarm currently going off inside — with the exact same shrug and the exact same words, "Can\'t let you in" — versus a front desk that gives a specific, distinct reason for each one.** With the single shrug, a visitor turned away for having an unreadable ID walks away no better informed than a visitor turned away because the entire floor was demolished last year — both were told the literal same thing, "Can\'t let you in," despite these being genuinely different situations requiring genuinely different next steps: one visitor should go get a new ID, the other should stop trying that floor entirely, but nothing about the guard\'s identical response tells either of them which situation is theirs. With the specific-reason desk, "your ID is unreadable, please get a new one," "this floor was demolished, it no longer exists," and "there\'s a fire alarm right now, wait outside" are all visibly, immediately distinguishable, letting each visitor act correctly without needing to ask a follow-up question. An API that returns the exact same 400 Bad Request for a malformed request body, a missing login, someone else\'s private resource, a deleted resource, a duplicate signup, and a rate limit is the single-shrug guard: a client is told, in effect, "something is wrong," but not which of these genuinely different things it actually was, forcing it to fall back on parsing an arbitrary human-readable error message just to figure out what to do next. Choosing the status code that actually distinguishes a malformed request (400) from a missing login (401) from someone else\'s resource (403) from one that no longer exists (404) from a duplicate (409) from too many attempts (429) is the specific-reason desk: the correct next step is visible from the status code itself, without needing to read a single word of the message.',
      hi: '**Ek building ke front desk par ek akela security guard jo har akele kaaran ka jawaab deta hai jispar kisi ko andar aane se rok diya jaa sakta hai — ek na-padhi-jaane-laayak ID, ek expire ho chuka badge, galat-building credentials jo pados ke office se belong karte hain, ek floor jo pichle saal demolish ho gayi, ek vyakti jo aaj paanchvi baar paanch alag naamon se sign in karne ki koshish kar raha hai, aur ek fire alarm jo abhi andar baj raha hai — bilkul usi shrug aur bilkul usi shabdon ke saath, "Can\'t let you in" — versus ek front desk jo har ek ke liye ek khaas, alag kaaran deta hai.** Akele shrug ke saath, ek visitor jise na-padhi-jaane-laayak ID rakhne ke liye vaapas bheja gaya utni hi kam jaankaari ke saath chalta hai jitna ek visitor jise poora floor pichle saal demolish hone ki wajah se vaapas bheja gaya — dono ko bilkul wahi shabd bataaye gaye, "Can\'t let you in," is baat ke bawajood ki ye sach mein alag sthitiyaan hain jinhe sach mein alag agle kadam chahiye: ek visitor ko naya ID lena chahiye, doosre ko us floor ki koshish poori tarah band kar deni chahiye, par guard ke samaan response ke baare mein kuch bhi unmein se kisi ko ye nahi bataata ki kaunsi sthiti unki hai. Khaas-kaaran waale desk ke saath, "tumhaari ID na-padhi-jaane-laayak hai, kripaya naya lo," "ye floor demolish ho chuka, ye ab maujood nahi hai," aur "abhi ek fire alarm baj raha hai, bahar wait karo" sab visually, turant alag-pehchaanne-yogya hain, har visitor ko sahi tarike se act karne dete hue bina ek follow-up sawaal poochhne ki zaroorat ke. Ek API jo ek kharaab request body, ek gaayab login, kisi aur ki private resource, ek delete hui resource, ek duplicate signup, aur ek rate limit ke liye bilkul wahi \`400 Bad Request\` return karta hai akela-shrug-waala guard hai: ek client ko, asar mein, bataaya jaata hai "kuch galat hai," par ye nahi ki in sach mein alag cheezon mein se asal mein kaunsi thi, ise ek manmaana human-readable error message parse karne par wapas girne ke liye majboor karte hue sirf ye pata lagaane ke liye ki aage kya karna hai. Wo status code chunna jo ek kharaab request (400) ko ek gaayab login (401) se, kisi aur ki resource (403) se, ek aisi jo ab maujood nahi hai (404) se, ek duplicate (409) se, aur bahut zyaada koshishon (429) se sach mein alag karta hai khaas-kaaran waala desk hai: sahi agla kadam status code khud se drishyaman hai, message ka ek bhi shabd padhe bina.',
    },

    simple: `**Start broken.** Every client-facing failure returns the exact same 400:

\`\`\`js
app.get("/orders/:id", async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!req.user) {
    return res.status(400).json({ error: "You must be logged in" }); // should be 401
  }
  if (!order) {
    return res.status(400).json({ error: "Order not found" }); // should be 404
  }
  if (order.userId !== req.user.id) {
    return res.status(400).json({ error: "This is not your order" }); // should be 403
  }

  res.status(200).json({ order });
});
\`\`\`

Three genuinely different failure reasons — not being logged in at all, the order genuinely not existing, and the order existing but belonging to someone else — all return the identical \`400\`. A client cannot distinguish "please log in" from "this simply does not exist" from "you are logged in, but this is not yours" without parsing the literal English text of the error message, which is fragile (a later wording change silently breaks any code depending on the exact string) and does not scale to a client supporting multiple languages, where the message text itself might not even be in English at all.

**The fix: a status code for each genuinely different reason**

\`\`\`js
app.get("/orders/:id", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "You must be logged in" }); // 401: who ARE you?
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: "Order not found" }); // 404: this doesn't exist
  }
  if (order.userId !== req.user.id) {
    return res.status(403).json({ error: "This is not your order" }); // 403: I know who you are, and no
  }

  res.status(200).json({ order });
});
\`\`\`

\`\`\`ts
app.get("/orders/:id", async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: "You must be logged in" });
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  if (order.userId !== req.user.id) {
    return res.status(403).json({ error: "This is not your order" });
  }

  res.status(200).json({ order });
});
\`\`\`

Now a client can act correctly on the status code alone: a \`401\` is a clear, universal signal to redirect to a login screen, regardless of which language the accompanying message happens to be written in; a \`404\` tells a client this specific resource genuinely does not exist, distinct from any authentication or permission problem; and a \`403\` tells a client the opposite of \`401\` — it knows exactly who the user is, and the answer is still no. Each of these is a genuinely different situation calling for a genuinely different client-side response, and the status code is what makes that distinction available without needing to inspect message text at all.`,

    simpleHi: `**Toote hue se shuru.** Har client-facing failure bilkul wahi 400 return karti hai:

\`\`\`js
app.get("/orders/:id", async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!req.user) {
    return res.status(400).json({ error: "You must be logged in" }); // 401 hona chahiye
  }
  if (!order) {
    return res.status(400).json({ error: "Order not found" }); // 404 hona chahiye
  }
  if (order.userId !== req.user.id) {
    return res.status(400).json({ error: "This is not your order" }); // 403 hona chahiye
  }

  res.status(200).json({ order });
});
\`\`\`

Teen sach mein alag failure kaaran — bilkul login na hona, order sach mein maujood na hona, aur order maujood hona par kisi aur ka hona — sab identical \`400\` return karte hain. Ek client "kripaya login karo" ko "ye bas maujood nahi hai" se "tum login ho, par ye tumhaara nahi hai" se alag nahi bata sakta bina error message ke shabdik English text ko parse kiye, jo fragile hai (ek baad ki wording badlaav chupchaap us kisi bhi code ko todta hai jo asli string par nirbhar hai) aur ek client tak scale nahi hoti jo kayi bhaashaayen support karta hai, jahan message text khud bhi English mein na ho.

**Fix: har sach mein alag kaaran ke liye ek status code**

\`\`\`js
app.get("/orders/:id", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "You must be logged in" }); // 401: tum KAUN ho?
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: "Order not found" }); // 404: ye maujood nahi hai
  }
  if (order.userId !== req.user.id) {
    return res.status(403).json({ error: "This is not your order" }); // 403: mujhe pata hai tum kaun ho, aur nahi
  }

  res.status(200).json({ order });
});
\`\`\`

\`\`\`ts
app.get("/orders/:id", async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: "You must be logged in" });
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  if (order.userId !== req.user.id) {
    return res.status(403).json({ error: "This is not your order" });
  }

  res.status(200).json({ order });
});
\`\`\`

Ab ek client sirf status code par sahi tarike se act kar sakta hai: ek \`401\` login screen par redirect karne ka ek saaf, universal sanket hai, chahe saath waala message kisi bhi bhaasha mein likha ho; ek \`404\` client ko batata hai ki ye khaas resource sach mein maujood nahi hai, kisi bhi authentication ya permission samasya se alag; aur ek \`403\` client ko \`401\` ke ulta batata hai — ise bilkul pata hai user kaun hai, aur jawaab abhi bhi nahi hai. In mein se har ek ek sach mein alag sthiti hai jise ek sach mein alag client-side response chahiye, aur status code hi wo hai jo message text bilkul inspect kiye bina us farak ko upalabdh banaata hai.`,

    content: `## The full 4xx family: seven codes, seven genuinely different reasons

\`\`\`
400 Bad Request           — the request itself is malformed (broken JSON, wrong data type)
401 Unauthorized          — "I don't know who you are" — missing or invalid credentials
403 Forbidden             — "I know exactly who you are, and the answer is still no"
404 Not Found             — this specific resource genuinely does not exist
405 Method Not Allowed    — this resource exists, but not for THIS HTTP method
409 Conflict              — the request is valid, but conflicts with the resource's current state
422 Unprocessable Entity  — well-formed syntax, but semantically invalid data
429 Too Many Requests     — rate limit exceeded, slow down
\`\`\`

\`400 Bad Request\` is specifically for a request whose actual SYNTAX is broken — malformed JSON that fails to parse at all, or a field of a fundamentally wrong data type (a string where a number was required) — problems detectable before the request\'s content is even meaningfully interpreted. \`401 Unauthorized\`, despite its name, is really about AUTHENTICATION: it means the server does not know who is making this request at all, either because no credentials were provided or because the ones provided are invalid — the correct client response is almost always "go authenticate, then try again." \`403 Forbidden\` is the code this course\'s earlier authorization-and-rbac lesson already established as the precise counterpart to 401: the server knows exactly who the user is, and that identity simply does not have permission for this specific action — no amount of re-authenticating changes the answer.

\`404 Not Found\` is specifically for a resource, identified by URL, that genuinely does not exist — a request for \`/orders/999\` when no order with that ID has ever existed, or has been deleted. \`405 Method Not Allowed\` is a narrower, often-overlooked cousin of 404: the resource at this URL genuinely does exist, but the specific HTTP method used is not supported on it — a \`DELETE\` request to an endpoint that only ever supports \`GET\` and \`POST\` should return 405, not 404, since the resource itself is real; only this particular verb is unsupported there.

\`409 Conflict\` and \`422 Unprocessable Entity\` are the pair professionals most often confuse with 400 and with each other. \`409\` is for a request that is well-formed and would normally be valid, but conflicts with the CURRENT STATE of the resource it targets — attempting to register an email address that is already taken is the textbook case, since the request itself is perfectly well-formed; it simply conflicts with data that already exists. \`422\` is for a request with correct SYNTAX (valid JSON, correct data types) that is nonetheless semantically invalid according to business rules — a \`startDate\` that is genuinely later than its own \`endDate\`, for instance, parses as perfectly valid JSON with correctly-typed fields, but fails a business rule 400 was never meant to cover. Many real APIs use 400 for both malformed syntax and semantic validation failures rather than reserving 422 specifically for the latter, which is a defensible, widely-used simplification — but a professional should be able to explain the actual distinction 422 exists to draw, even when choosing not to use it.

\`429 Too Many Requests\`, covered in depth in this course\'s earlier rate-limiting lesson, is the code specifically for "you are not doing anything wrong in principle, but you are doing it too fast" — distinct from every other 4xx on this list, which describe something wrong with the request\'s content or the requester\'s identity rather than its timing.

## The 5xx family: the server's own fault, not the client's

\`\`\`js
res.status(500).json({ error: "Internal server error" }); // an unexpected failure on OUR side
res.status(502).json({ error: "Bad gateway" });             // an upstream service we depend on failed
res.status(503).json({ error: "Service unavailable" });     // we're temporarily overloaded or down for maintenance
\`\`\`

\`500 Internal Server Error\` is the general-purpose fallback for a genuinely unanticipated failure inside the server\'s own code — this course\'s earlier centralized-error-handling lesson already covers this as the safe default for any error that is not a specifically recognized, well-understood failure type. \`502 Bad Gateway\` is more specific: it means this server, acting as a proxy or gateway, received an invalid or failed response from an UPSTREAM service it depends on — a backend API server returning 502 because the database it talks to, or a third-party service it calls, itself failed to respond correctly. \`503 Service Unavailable\`, covered in this course\'s earlier load-balancing/health-checks lesson, communicates that the server is temporarily unable to handle the request at all — commonly due to being overloaded, or deliberately down for maintenance — and, unlike 500, often pairs with a \`Retry-After\` header suggesting when the client might reasonably try again.

## Why the 4xx vs 5xx boundary is the single most important distinction to get right

Every 4xx code communicates that the CLIENT\'s own request was the actual problem — malformed, unauthenticated, forbidden, referring to something that does not exist, conflicting with existing data, or simply too frequent — meaning an automatic retry of the identical request will fail identically every time, since nothing about the server changed. Every 5xx code communicates the opposite: the client\'s request was perfectly reasonable, but the server itself failed to handle it correctly, meaning a retry, especially after a brief delay, might genuinely succeed once the transient server-side problem resolves. A retry policy, a circuit breaker, or simply a developer deciding whether to change their own request or simply try again unchanged depends entirely on getting this boundary right — an API that returns 400 for what is actually a database connection failure (a genuine 5xx situation) will cause a well-designed client to give up and report a bug in ITS OWN request, when the request was correct all along and the server was the one that failed.`,

    contentHi: `## Poora 4xx family: saat codes, saat sach mein alag kaaran

\`\`\`
400 Bad Request           — asli request khud kharaab hai (toota JSON, galat data type)
401 Unauthorized          — "mujhe nahi pata tum kaun ho" — gaayab ya invalid credentials
403 Forbidden             — "mujhe bilkul pata hai tum kaun ho, aur jawaab abhi bhi nahi hai"
404 Not Found             — ye khaas resource sach mein maujood nahi hai
405 Method Not Allowed    — ye resource maujood hai, par IS HTTP method ke liye nahi
409 Conflict              — request valid hai, par resource ki current state se takraata hai
422 Unprocessable Entity  — sahi-banaayi-gayi syntax, par semantically invalid data
429 Too Many Requests     — rate limit paar, dheere karo
\`\`\`

\`400 Bad Request\` khaas taur par ek aisi request ke liye hai jiski asli SYNTAX kharaab hai — toota JSON jo parse hi nahi hota, ya ek field ek buniyaadi roop se galat data type ka (ek string jahan ek number chahiye tha) — samasyaein jo pata lagaayi jaa sakti hain isse pehle ki request ki content bhi maayne-yogya roop se interpret ki jaaye. \`401 Unauthorized\`, apne naam ke bawajood, asal mein AUTHENTICATION ke baare mein hai: iska matlab hai server ko bilkul nahi pata ki ye request kaun kar raha hai, ya toh isliye kyunki koi credentials nahi diye gaye ya isliye kyunki jo diye gaye wo invalid hain — sahi client response lagbhag hamesha "authenticate karo, phir dobara koshish karo" hai. \`403 Forbidden\` wo code hai jise is course ke pehle wale authorization-and-rbac lesson ne pehle hi \`401\` ke bilkul sahi counterpart ki tarah sthaapit kiya: server ko bilkul pata hai user kaun hai, aur us pehchaan ke paas bas is khaas action ki permission nahi hai — kitna bhi dobara-authenticate karna jawaab nahi badalta.

\`404 Not Found\` khaas taur par ek resource ke liye hai, URL dwara pehchaani gayi, jo sach mein maujood nahi hai — \`/orders/999\` ke liye ek request jab us ID ka koi order kabhi maujood nahi raha, ya delete kiya jaa chuka hai. \`405 Method Not Allowed\` \`404\` ka ek sankeern, aksar-nazarandaz-kiya-jaane-waala cousin hai: is URL par resource sach mein maujood hai, par istemal ki gayi khaas HTTP method ispar support nahi ki jaati — ek \`DELETE\` request ek endpoint ko jo sirf \`GET\` aur \`POST\` support karta hai \`405\` return karni chahiye, \`404\` nahi, kyunki resource khud asli hai; sirf ye khaas verb wahaan unsupported hai.

\`409 Conflict\` aur \`422 Unprocessable Entity\` wo jodi hai jise professionals sabse aksar \`400\` se aur ek doosre se confuse karte hain. \`409\` ek aisi request ke liye hai jo sahi-banaayi-gayi hai aur normally valid hoti, par uski TARGET resource ki CURRENT STATE se takraati hai — ek email address register karne ki koshish jo pehle se li ja chuki hai textbook case hai, kyunki request khud bilkul sahi-banaayi-gayi hai; ye bas pehle se maujood data se takraati hai. \`422\` ek aisi request ke liye hai jismein sahi SYNTAX hai (valid JSON, sahi data types) jo phir bhi business rules ke anusaar semantically invalid hai — ek \`startDate\` jo sach mein apni khud ki \`endDate\` se baad ki hai, misal ke taur par, sahi-type-ki-gayi fields ke saath bilkul valid JSON ki tarah parse hoti hai, par ek business rule fail karti hai jise \`400\` kabhi cover karne ke liye nahi tha. Kayi asli APIs \`400\` istemal karti hain dono kharaab syntax aur semantic validation failures ke liye \`422\` ko khaas taur par baad wale ke liye rakhne ke bajaye, jo ek bachaao-yogya, widely-used simplification hai — par ek professional ko us asli farak ko samjhaane laayak hona chahiye jise \`422\` darsaane ke liye maujood hai, chahe ise na istemal karna chunta ho.

\`429 Too Many Requests\`, is course ke pehle wale rate-limiting lesson mein gehraayi se cover kiya gaya, wo code hai khaas taur par "tum principle mein kuch galat nahi kar rahe, par tum ise bahut tez kar rahe ho" ke liye — is list ke har doosre 4xx se alag, jo request ki content ya requester ki pehchaan ke baare mein galat kuch darsate hain, uski timing ke bajaye.

## 5xx family: server ki apni galti, client ki nahi

\`\`\`js
res.status(500).json({ error: "Internal server error" }); // HAMAARI taraf ek anpekshit failure
res.status(502).json({ error: "Bad gateway" });             // ek upstream service jispar hum nirbhar hain fail hui
res.status(503).json({ error: "Service unavailable" });     // hum asthaayi roop se overloaded ya maintenance ke liye down hain
\`\`\`

\`500 Internal Server Error\` server ke apne code ke andar ek sach mein anpekshit failure ke liye general-purpose fallback hai — is course ka pehle wala centralized-error-handling lesson ise pehle hi kisi bhi error ke liye safe default ki tarah cover karta hai jo ek khaas taur par pehchaani gayi, achhi tarah samjhi gayi failure type nahi hai. \`502 Bad Gateway\` zyaada khaas hai: iska matlab hai ki ye server, ek proxy ya gateway ki tarah kaam karte hue, ek UPSTREAM service se ek invalid ya fail hui response mili jispar ye nirbhar karta hai — ek backend API server \`502\` return karta hai kyunki database jise ye baat karta hai, ya ek third-party service jise ye call karta hai, khud sahi tarike se jawaab dene mein fail hui. \`503 Service Unavailable\`, is course ke pehle wale load-balancing/health-checks lesson mein cover kiya gaya, sanchaar karta hai ki server asthaayi roop se request ko bilkul handle karne mein asaksham hai — aksar overloaded hone ki wajah se, ya jaan-boojhkar maintenance ke liye down — aur, \`500\` ke ulta, aksar ek \`Retry-After\` header ke saath jodta hai ye sujhaate hue ki client vaajbi roop se kab dobara koshish kar sakta hai.

## 4xx vs 5xx boundary sabse mahatvapoorn farak sahi karne ke liye kyun hai

Har 4xx code sanchaar karta hai ki CLIENT ki apni request asli samasya thi — kharaab, na-authenticated, forbidden, ek aisi cheez ki taraf ishaara karti hui jo maujood nahi hai, maujood data se takraati hui, ya simply bahut baar-baar — matlab identical request ka ek automatic retry har baar identical roop se fail hoga, kyunki server ke baare mein kuch bhi badla nahi. Har 5xx code ulta sanchaar karta hai: client ki request poori tarah vaajbi thi, par server khud ise sahi tarike se handle karne mein fail hua, matlab ek retry, khaas taur par thodi der ki der ke baad, sach mein safal ho sakta hai ek baar asthaayi server-side samasya suljh jaaye. Ek retry policy, ek circuit breaker, ya simply ek developer ye faisla karte hue ki apni request badle ya bas na-badla dobara koshish kare poori tarah is boundary ko sahi paane par nirbhar karta hai — ek API jo asal mein ek database connection failure (ek asli 5xx sthiti) ke liye \`400\` return karta hai ek achhi-tarah-design-ki-gayi client ko haar maanne aur APNI khud ki request mein ek bug report karne ka kaaran banaayega, jab request shuru se sahi thi aur server hi wo tha jo fail hua.`,

    examples: [
      {
        title: 'Broken: three different problems, all reported as 400',
        titleHi: 'Toota: teen alag samasyaein, sab 400 ki tarah report ki gayi',
        code: `if (!req.user) return res.status(400).json({ error: "Must be logged in" });
if (!order) return res.status(400).json({ error: "Order not found" });
if (order.userId !== req.user.id) return res.status(400).json({ error: "Not yours" });`,
        codeJs: `app.get("/orders/:id", async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!req.user) {
    return res.status(400).json({ error: "You must be logged in" });
  }
  if (!order) {
    return res.status(400).json({ error: "Order not found" });
  }
  if (order.userId !== req.user.id) {
    return res.status(400).json({ error: "This is not your order" });
  }

  res.status(200).json({ order });
});`,
        codeTs: `app.get("/orders/:id", async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id);

  if (!req.user) {
    return res.status(400).json({ error: "You must be logged in" });
  }
  if (!order) {
    return res.status(400).json({ error: "Order not found" });
  }
  if (order.userId !== req.user.id) {
    return res.status(400).json({ error: "This is not your order" });
  }

  res.status(200).json({ order });
});
// fully valid TypeScript — the problem is a status-code choice`,
        output: `A client cannot distinguish "please log in" from "this doesn't
exist" from "this isn't yours" without parsing the literal error
message text, which is fragile and does not scale across languages.`,
        explain: 'Three genuinely different failure reasons — missing authentication, a nonexistent resource, and a permission problem — all collapse into the same 400, hiding the distinction a client actually needs.',
        explainHi: 'Teen sach mein alag failure kaaran — gaayab authentication, ek na-maujood resource, aur ek permission samasya — sab usi \`400\` mein simat jaate hain, us farak ko chhupaate hue jo ek client ko asal mein chahiye.',
      },
      {
        title: 'Fixed: 401, 404, and 403 for three genuinely different reasons',
        titleHi: 'Theek: teen sach mein alag kaaranon ke liye 401, 404, aur 403',
        code: `if (!req.user) return res.status(401).json(...); // who ARE you?
if (!order) return res.status(404).json(...);       // doesn't exist
if (order.userId !== req.user.id) return res.status(403).json(...); // I know, and no`,
        codeJs: `app.get("/orders/:id", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "You must be logged in" });
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  if (order.userId !== req.user.id) {
    return res.status(403).json({ error: "This is not your order" });
  }

  res.status(200).json({ order });
});`,
        codeTs: `app.get("/orders/:id", async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: "You must be logged in" });
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  if (order.userId !== req.user.id) {
    return res.status(403).json({ error: "This is not your order" });
  }

  res.status(200).json({ order });
});`,
        outputJs: `A client can now redirect to login on 401, show a "not found" page
on 404, and show a "permission denied" message on 403 — three
distinct, correct behaviors, chosen from the status code alone.`,
        outputTs: `// Identical behaviour, fully typed via Express's Request/Response.`,
        explain: '401, 404, and 403 each communicate a genuinely distinct situation calling for a genuinely distinct client-side response, recoverable from the status code without parsing any message text.',
        explainHi: '\`401\`, \`404\`, aur \`403\` har ek ek sach mein alag sthiti sanchaar karta hai jise ek sach mein alag client-side response chahiye, status code se hi paaya jaa sakta hai bina kisi message text ko parse kiye.',
      },
      {
        title: '409 vs 422: a conflict with existing data vs a semantically invalid request',
        titleHi: '409 vs 422: maujood data ke saath ek conflict vs ek semantically invalid request',
        code: `if (await User.findOne({ email })) return res.status(409).json(...); // already exists
if (new Date(startDate) > new Date(endDate)) return res.status(422).json(...); // invalid range`,
        codeJs: `app.post("/signup", async (req, res) => {
  const existing = await User.findOne({ email: req.body.email });
  if (existing) {
    return res.status(409).json({ error: "Email already registered" });
  }
  const user = await User.create(req.body);
  res.status(201).json({ user });
});

app.post("/bookings", async (req, res) => {
  const { startDate, endDate } = req.body;
  if (new Date(startDate) > new Date(endDate)) {
    return res.status(422).json({ error: "startDate must be before endDate" });
  }
  const booking = await Booking.create(req.body);
  res.status(201).json({ booking });
});`,
        codeTs: `app.post("/signup", async (req: Request, res: Response) => {
  const existing = await User.findOne({ email: req.body.email });
  if (existing) {
    return res.status(409).json({ error: "Email already registered" });
  }
  const user = await User.create(req.body);
  res.status(201).json({ user });
});

app.post("/bookings", async (req: Request, res: Response) => {
  const { startDate, endDate } = req.body;
  if (new Date(startDate) > new Date(endDate)) {
    return res.status(422).json({ error: "startDate must be before endDate" });
  }
  const booking = await Booking.create(req.body);
  res.status(201).json({ booking });
});`,
        outputJs: `409 for the signup correctly signals "this conflicts with data
that already exists" rather than "your request was malformed." 422
for the booking correctly signals "syntactically valid, but violates
a business rule," distinct from a genuinely broken request body.`,
        outputTs: `// Identical behaviour. Both request bodies parse as valid JSON —
// the failures are semantic, not syntactic, which is exactly what
// 409 and 422 exist to distinguish from 400.`,
        explain: 'Both requests are well-formed JSON — the failures are about the data\'s relationship to existing state (409) or its own internal validity (422), genuinely different from a malformed request (400).',
        explainHi: 'Dono requests sahi-banaayi-gayi JSON hain — failures data ke maujood state se rishte (409) ya iski apni internal validity (422) ke baare mein hain, ek kharaab request (400) se sach mein alag.',
      },
    ],

    mistakes: [
      {
        wrong: `if (!req.user) return res.status(400).json({ error: "Must be logged in" });
// missing authentication reported as a generic bad request`,
        right: `if (!req.user) return res.status(401).json({ error: "Must be logged in" });
// 401 specifically means "I don't know who you are"`,
        why: 'Using 400 for missing authentication makes it indistinguishable from a genuinely malformed request, breaking any client logic that redirects to login specifically on 401.',
        whyHi: 'Gaayab authentication ke liye \`400\` istemal karna ise ek sach mein kharaab request se alag-na-pehchaanne-yogya banaata hai, kisi bhi client logic ko todte hue jo khaas taur par \`401\` par login par redirect karta hai.',
      },
      {
        wrong: `if (order.userId !== req.user.id) return res.status(404).json(...);
// hiding a permission problem as if the resource doesn't exist`,
        right: `if (order.userId !== req.user.id) return res.status(403).json(...);
// 403 correctly signals "it exists, but you may not access it"`,
        why: 'Returning 404 for a permission problem, even when done deliberately to avoid confirming a resource\'s existence, is a genuine security-vs-clarity trade-off worth making consciously, not defaulting into.',
        whyHi: 'Ek permission samasya ke liye \`404\` return karna, chahe jaan-boojhkar ek resource ke astitva ko confirm karne se bachne ke liye kiya gaya ho, ek asli security-vs-clarity trade-off hai jaan-boojhkar lene laayak, default roop se nahi.',
      },
      {
        wrong: `try {
  await db.query(...);
} catch (err) {
  res.status(400).json({ error: "Something went wrong" });
  // a database failure is the SERVER's fault, not the client's`,
        right: `try {
  await db.query(...);
} catch (err) {
  res.status(500).json({ error: "Something went wrong" });
  // 500 correctly signals this was not the client's mistake
}`,
        why: 'Reporting a genuine server-side failure (a database error, an unhandled exception) as a 4xx incorrectly blames the client\'s request for something that was actually the server\'s own problem, and discourages a retry that might well succeed.',
        whyHi: 'Ek asli server-side failure (ek database error, ek unhandled exception) ko ek 4xx ki tarah report karna galti se client ki request ko us cheez ke liye dosh deta hai jo asal mein server ki apni samasya thi, aur ek retry ko roakta hai jo shaayad safal ho sakta tha.',
      },
    ],

    realWorld: [
      {
        en: '**The 401-vs-403 distinction ("I don\'t know who you are" vs. "I know exactly who you are, and no") is one of the single most commonly asked HTTP interview questions across backend roles.**',
        hi: '**401-vs-403 ka farak ("mujhe nahi pata tum kaun ho" vs. "mujhe bilkul pata hai tum kaun ho, aur nahi") backend roles ke aar-paar sabse aam poochhe jaane waale HTTP interview sawaalon mein se ek hai.**',
      },
      {
        en: '**Large, real payment and e-commerce APIs genuinely distinguish 409 (duplicate/conflicting resource) from 422 (semantically invalid data) in their public documentation**, confirming this is a real production distinction, not an academic one.',
        hi: '**Badi, asli payment aur e-commerce APIs sach mein 409 (duplicate/conflicting resource) ko 422 (semantically invalid data) se apni public documentation mein alag karti hain**, confirm karte hue ki ye ek asli production farak hai, ek academic nahi.',
      },
      {
        en: '**502 and 503 are the two status codes engineers on call are most likely to see paged for**, since both typically indicate a real infrastructure problem (an upstream failure or an overload) rather than a code bug in a single request handler.',
        hi: '**502 aur 503 wo do status codes hain jinke liye on-call engineers ko sabse zyaada page kiye jaane ki sambhaavna hai**, kyunki dono aksar ek asli infrastructure samasya darsate hain (ek upstream failure ya ek overload) ek akele request handler mein ek code bug ke bajaye.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the precise difference between 401 and 403, and why does conflating them cause real problems for a client?',
        qHi: '401 aur 403 ke beech sateek farak kya hai, aur inhe milaana ek client ke liye asli samasyaein kyun paida karta hai?',
        a: '401 Unauthorized, despite its somewhat misleading name, is fundamentally about AUTHENTICATION — it communicates that the server does not know who is making the request at all, either because no credentials were supplied, or because whatever credentials were supplied are invalid or have expired. The correct and typically only useful response to a 401 is to go authenticate, or re-authenticate, since the server is explicitly saying it cannot proceed without first establishing who the requester actually is. 403 Forbidden communicates something conceptually different: the server has already successfully identified who is making the request, and that identity, specifically, does not have permission to perform the action being requested. Critically, no amount of re-authenticating as the SAME user changes a 403 into a success, since the problem is not that the server does not recognize the user, but that it recognizes them precisely and has determined they lack the necessary permission regardless. A client, or a developer building one, that treats 401 and 403 as interchangeable "you can\'t do this" signals will typically build logic that redirects to a login screen on either code — which is the correct behavior for 401, but is actively unhelpful and confusing for 403, since a user who is fully, correctly logged in but genuinely lacks permission for a specific action will be sent to re-enter credentials they have already correctly entered, only to be told the exact same thing again once they finish logging back in, since re-authenticating as the same account does nothing to grant a permission that account was never given.',
        aHi: '401 Unauthorized, apne kuch had tak gumraah karne waale naam ke bawajood, buniyaadi roop se AUTHENTICATION ke baare mein hai — ye sanchaar karta hai ki server ko bilkul nahi pata ki request kaun kar raha hai, ya toh isliye kyunki koi credentials di hi nahi gayi, ya isliye kyunki jo bhi credentials di gayi wo invalid hain ya expire ho chuki hain. Ek 401 ka sahi aur aksar sirf upyogi jawaab authenticate karna, ya dobara-authenticate karna hai, kyunki server explicitly keh raha hai ki ye pehle ye sthaapit kiye bina aage nahi badh sakta ki requester asal mein kaun hai. 403 Forbidden conceptually kuch alag sanchaar karta hai: server ne pehle hi safaltapoorvak pehchaan liya hai ki request kaun kar raha hai, aur wo pehchaan, khaas taur par, is action ko perform karne ki permission nahi rakhti jo maanga jaa raha hai. Mahatvapoorn baat, SAME user ki tarah kitna bhi dobara-authenticate karna ek 403 ko success mein nahi badalta, kyunki samasya ye nahi hai ki server user ko nahi pehchaanta, balki ye hai ki ye unhe bilkul pehchaanta hai aur tay kar chuka hai ki unke paas zaruri permission nahi hai chahe kuch bhi ho. Ek client, ya ek developer jo ek banaata hai, jo 401 aur 403 ko badle-jaane-laayak "tum ye nahi kar sakte" sanket ki tarah treat karta hai aksar ek logic banaayega jo dono codes par ek login screen par redirect karta hai — jo 401 ke liye sahi vyavahaar hai, par 403 ke liye saqriya roop se bekaar aur confusing hai, kyunki ek user jo poori tarah, sahi tarike se login hai par sach mein ek khaas action ke liye permission nahi rakhta ek baar phir credentials daalne ke liye bheja jaayega jo unhone pehle hi sahi tarike se daale the, sirf ek baar dobara login karna khatam karne par bilkul wahi baat dobara bataaye jaane ke liye, kyunki usi account ki tarah dobara-authenticate karna kuch nahi karta ek permission dene ke liye jo us account ko kabhi di hi nahi gayi thi.',
      },
      {
        q: 'Why does the boundary between 4xx and 5xx matter so much for automated systems like retry policies, and what goes wrong when a genuine server failure is reported as a 4xx (or vice versa)?',
        qHi: '4xx aur 5xx ke beech boundary retry policies jaise automated systems ke liye itni zyaada maayne kyun rakhti hai, aur kya galat hota hai jab ek asli server failure ko ek 4xx ki tarah report kiya jaata hai (ya ulta)?',
        a: 'The 4xx versus 5xx distinction encodes a genuinely fundamental fact about WHOSE fault a given failure is, and that fact directly determines whether retrying the identical request is a sensible thing to do at all. A 4xx code communicates that the client\'s own request itself was the source of the problem — it was malformed, unauthenticated, referred to something that does not exist, or was otherwise unacceptable as submitted — meaning that resending the exact same request, unchanged, will fail in the exact same way every single time, since nothing about the underlying problem has changed and nothing about the server has changed either. Given this, retrying a 4xx automatically is not just unhelpful, it is actively wasteful, consuming server resources and potentially even triggering rate limiting for a request that will never succeed until the client itself changes something. A 5xx code communicates the opposite: the client\'s request was entirely reasonable and correctly formed, but the server itself failed to process it successfully, often due to something transient — a momentary database connection issue, a brief overload, a downstream service that failed temporarily. Because the client did nothing wrong, retrying the identical request after a brief delay is a genuinely sensible strategy, and this is precisely the behavior well-designed retry policies, circuit breakers, and resilience libraries are built around: automatically retrying 5xx responses, often with an increasing delay between attempts, while explicitly NOT retrying 4xx responses, since doing so would be pointless. If a server reports what is actually a genuine internal failure, such as a database connection timeout, using a 4xx code instead of the correct 5xx, automated retry logic built around this standard convention will incorrectly treat the failure as permanent and give up immediately, even in situations where retrying moments later would have succeeded once the transient server-side problem resolved itself — a real, avoidable degradation in the system\'s own resilience caused purely by choosing the wrong status code family.',
        aHi: '4xx bnaam 5xx ka farak is baare mein ek sach mein buniyaadi tathya encode karta hai ki ek diye gaye failure ki galti KISKI hai, aur wo tathya seedhe tay karta hai ki identical request ko dobara koshish karna bilkul ek samajhdaar kaam hai ya nahi. Ek 4xx code sanchaar karta hai ki client ki apni request khud samasya ka srot thi — ye kharaab thi, na-authenticated thi, ek aisi cheez ki taraf ishaara karti thi jo maujood nahi hai, ya jaisi submit ki gayi waisi anya-taur-par-asweekaarya thi — matlab bilkul wahi request, na-badli, dobara bhejna har akeli baar bilkul usi tarike se fail hogi, kyunki underlying samasya ke baare mein kuch bhi nahi badla aur server ke baare mein bhi kuch nahi badla. Ise dekhte hue, ek 4xx ko automatically dobara koshish karna sirf bekaar nahi hai, ye saqriya roop se bhi barbaad-karne-waala hai, server resources kharch karte hue aur sambhaavit roop se ek request ke liye rate limiting bhi trigger karte hue jo kabhi safal nahi hogi jab tak client khud kuch na badle. Ek 5xx code ulta sanchaar karta hai: client ki request poori tarah vaajbi aur sahi tarike se banaayi gayi thi, par server khud ise safaltapoorvak process karne mein fail hua, aksar kisi asthaayi cheez ki wajah se — ek pal-bhar ki database connection samasya, ek chhoti overload, ek downstream service jo asthaayi roop se fail hui. Kyunki client ne kuch bhi galat nahi kiya, thodi der ki der ke baad identical request ko dobara koshish karna ek sach mein samajhdaar strategy hai, aur ye bilkul wo vyavahaar hai jispar achhi-tarah-design-ki-gayi retry policies, circuit breakers, aur resilience libraries banaayi gayi hain: 5xx responses ko automatically dobara koshish karna, aksar koshishon ke beech badhti hui der ke saath, jabki explicitly 4xx responses ko dobara koshish NA karte hue, kyunki aisa karna bekaar hoga. Agar ek server ek asli internal failure ko report karta hai, jaisa ek database connection timeout, ek 4xx code istemal karke sahi 5xx ke bajaye, is standard convention ke aas-paas banaayi gayi automated retry logic galti se failure ko permanent maanegi aur turant haar maan legi, un sthitiyon mein bhi jahan thodi der baad dobara koshish karna safal hota agar asthaayi server-side samasya khud suljh gayi hoti — system ki apni resilience mein ek asli, bachne-laayak girawat sirf galat status code family chunne se ki gayi.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken example: a route reporting missing authentication, a nonexistent resource, and a permission problem all as 400. Write a client-side function that tries to redirect to login only on 401 and confirm it fails to work correctly against the broken version.',
        taskHi: 'Toota example banao: ek route jo gaayab authentication, ek na-maujood resource, aur ek permission samasya sab ko \`400\` ki tarah report karta hai. Ek client-side function likho jo sirf \`401\` par login par redirect karne ki koshish karta hai aur confirm karo ki ye toote version ke khilaaf sahi tarike se kaam karne mein fail hota hai.',
        hint: 'Trigger all three failure conditions against the broken version and observe that your login-redirect function fires (or fails to fire) identically for all three, since they are indistinguishable by status code.',
        hintHi: 'Toote version ke khilaaf teeno failure conditions trigger karo aur dekho ki tumhaara login-redirect function teeno ke liye identical roop se fire karta hai (ya fire hone mein fail hota hai), kyunki wo status code se alag-na-pehchaanne-yogya hain.',
      },
      {
        task: 'Fix the route to use 401, 404, and 403 respectively, following this lesson\'s example. Confirm your client-side redirect function now behaves correctly for each of the three cases.',
        taskHi: 'Is lesson ke example ka palan karte hue route ko \`401\`, \`404\`, aur \`403\` istemal karne ke liye theek karo. Confirm karo ki tumhaara client-side redirect function ab teeno cases ke liye sahi tarike se vyavahaar karta hai.',
        hint: 'Test each of the three conditions individually with curl -i and confirm the status code line matches what you expect before testing the client-side redirect logic.',
        hintHi: 'Teeno conditions ko \`curl -i\` se alag-alag test karo aur confirm karo ki status code line us se mel khaati hai jo tumhe ummeed hai client-side redirect logic test karne se pehle.',
      },
      {
        task: 'Add a signup endpoint returning 409 for a duplicate email and a bookings endpoint returning 422 for a semantically invalid date range, following this lesson\'s example. Write a one-sentence explanation of why neither should use 400.',
        taskHi: 'Is lesson ke example ka palan karte hue ek duplicate email ke liye \`409\` return karne wala ek signup endpoint aur ek semantically invalid date range ke liye \`422\` return karne wala ek bookings endpoint jodo. Ek vaakya mein samjhaao ki inmein se kisi ko bhi \`400\` kyun istemal nahi karna chahiye.',
        hint: 'Confirm both request bodies parse as perfectly valid JSON before reaching your validation logic — the failure in both cases happens after successful parsing, not during it.',
        hintHi: 'Confirm karo ki dono request bodies bilkul valid JSON ki tarah parse hoti hain tumhaari validation logic tak pahunchne se pehle — dono cases mein failure safal parsing ke baad hoti hai, iske dauraan nahi.',
      },
    ],

    keyTakeaways: [
      '400 is for malformed request syntax, 401 means the server does not know who you are, and 403 means it knows exactly who you are and the answer is still no.',
      '404 means this specific resource genuinely does not exist, while 405 means the resource exists but does not support the specific HTTP method used.',
      '409 is for a well-formed request that conflicts with the resource\'s current state (like a duplicate email); 422 is for well-formed syntax that fails a semantic business rule (like an invalid date range).',
      '429 is distinct from every other 4xx on this list — it is not about what the request contains, but about doing something valid too frequently.',
      '500 is the safe fallback for a genuinely unanticipated server failure; 502 means an upstream dependency failed; 503 means the server is temporarily overloaded or down for maintenance.',
      'The 4xx vs 5xx boundary determines whether an automatic retry makes sense — 4xx means retrying the identical request will fail identically every time, while 5xx means a retry might genuinely succeed.',
    ],
    keyTakeawaysHi: [
      '400 kharaab request syntax ke liye hai, 401 ka matlab hai server ko nahi pata tum kaun ho, aur 403 ka matlab hai ise bilkul pata hai tum kaun ho aur jawaab abhi bhi nahi hai.',
      '404 ka matlab hai ye khaas resource sach mein maujood nahi hai, jabki 405 ka matlab hai resource maujood hai par istemal ki gayi khaas HTTP method support nahi karta.',
      '409 ek sahi-banaayi-gayi request ke liye hai jo resource ki current state se takraati hai (jaisa ek duplicate email); 422 sahi-banaayi-gayi syntax ke liye hai jo ek semantic business rule fail karti hai (jaisa ek invalid date range).',
      '429 is list ke har doosre 4xx se alag hai — ye is baare mein nahi hai ki request mein kya hai, balki ye kuch valid ko bahut baar-baar karne ke baare mein hai.',
      '500 ek sach mein anpekshit server failure ke liye safe fallback hai; 502 ka matlab hai ek upstream dependency fail hui; 503 ka matlab hai server asthaayi roop se overloaded hai ya maintenance ke liye down hai.',
      '4xx vs 5xx boundary tay karta hai ki ek automatic retry maayne rakhta hai ya nahi — 4xx ka matlab hai identical request ko dobara koshish karna har baar identical roop se fail hogi, jabki 5xx ka matlab hai ek retry sach mein safal ho sakta hai.',
    ],
  },
];
