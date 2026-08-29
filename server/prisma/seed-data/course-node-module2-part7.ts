/**
 * Node.js Complete Course — Module 2: Building APIs with Express, lesson 7.
 *
 * HTTP status codes, part 1 of 2: the five status-code categories
 * (1xx-5xx) as a concept, then a close look at 2xx (success) and 3xx
 * (redirection). Broken example: an Express API that returns HTTP 200
 * for literally every response, encoding actual success/failure inside
 * the JSON body as { success: false, error: "..." } — this defeats every
 * piece of HTTP-aware tooling (browser fetch().ok, curl -f, load
 * balancer health checks, monitoring/alerting dashboards) that exists
 * specifically to make decisions from the status code alone, without
 * needing to parse a response body it may not even understand the shape
 * of. Fixed by returning the status code that actually matches what
 * happened — 200 vs 201 vs 204 for different flavors of success, and
 * 301 vs 302 vs 304 for the three genuinely different reasons an API
 * might redirect or tell a client its cached copy is still valid.
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

export const NODE_MODULE_2_PART7: CourseLesson[] = [
  {
    slug: 'http-status-codes-2xx-3xx',
    title: 'HTTP Status Codes: Categories, Success, and Redirection',
    titleHi: 'HTTP Status Codes: Categories, Success, Aur Redirection',
    description: 'An API returns HTTP 200 for every single response, including the ones that actually failed — a monitoring dashboard watching status codes reports 100% uptime and zero errors, while real users are seeing "success: false" error messages on nearly a third of their requests.',
    descriptionHi: 'Ek API har akele response ke liye HTTP 200 return karta hai, un ke liye bhi jo asal mein fail hue — status codes dekhne wala ek monitoring dashboard 100% uptime aur zero errors report karta hai, jabki asli users ko unke lagbhag ek-tihai requests par "success: false" error messages dikh rahe hain.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 7,

    analogy: {
      en: '**A package tracking system where every single scan event, whether the package was actually delivered, is still in transit, or was permanently lost in a warehouse fire, prints the exact same "Package Scanned" label — versus a tracking system where the label itself tells you, at a glance, which of those genuinely different things actually happened.** In the useless-label system, a customer service rep glancing at a stack of scan printouts cannot tell delivered packages apart from lost ones without opening every single package\'s full file and reading the detailed notes inside — the label itself carries no real information, so anyone trying to act on it quickly (an automated system flagging lost packages for a refund, for instance) genuinely cannot, since "Package Scanned" tells them nothing about which outcome occurred. In the informative-label system, a "Delivered" stamp, a "Forwarded to New Address" stamp, and a "Lost — Refund Required" stamp are all visually and categorically distinct at a glance, so an automated system, or a rep skimming a stack of hundreds, can act correctly without opening a single file. An API that returns HTTP 200 for every response, embedding the actual outcome inside the response body instead, is the useless-label system: a load balancer\'s health check, a monitoring dashboard, or a simple curl script checking for success all see the exact same "200 Scanned" label regardless of whether the request actually succeeded, and none of them can act correctly without additionally parsing a body whose exact shape they may not even know in advance. Choosing the HTTP status code that genuinely matches what happened — 200 for an ordinary success, 201 specifically for "a new package was created," 301 specifically for "this address has permanently moved" — is the informative-label system: the outcome is visible in the status code itself, which is exactly the part of the response every piece of HTTP-aware tooling was built to read first.',
      hi: '**Ek package tracking system jahan har akela scan event, chahe package asal mein deliver hua ho, abhi bhi raaste mein ho, ya ek warehouse fire mein hamesha ke liye kho gaya ho, bilkul wahi "Package Scanned" label print karta hai — versus ek tracking system jahan label khud tumhe, ek nazar mein, bataata hai ki un sach mein alag cheezon mein se asal mein kya hua.** Bekaar-label system mein, ek customer service rep scan printouts ke dher ko dekhkar deliver hui packages ko khoyi hui se alag nahi bata sakta bina har akele package ki poori file khole aur andar ke detailed notes padhe — label khud koi asli jaankaari nahi rakhta, isliye koi bhi jo ispar jaldi act karne ki koshish karta hai (ek automated system jo refund ke liye khoyi hui packages flag karta hai, misal ke taur par) sach mein nahi kar sakta, kyunki "Package Scanned" unhe ye kuch nahi bataata ki kaunsa nateeja hua. Jaankaari-bhare-label system mein, ek "Delivered" stamp, ek "Forwarded to New Address" stamp, aur ek "Lost — Refund Required" stamp sab ek nazar mein visually aur categorically alag hain, isliye ek automated system, ya ek rep jo sainkdon ke dher ko sarsari nazar se dekhta hai, bina ek bhi file khole sahi tarike se act kar sakta hai. Ek API jo har response ke liye HTTP 200 return karta hai, asli nateeje ko iske bajaye response body ke andar rakhte hue, bekaar-label system hai: ek load balancer ki health check, ek monitoring dashboard, ya ek saadha curl script jo success check karta hai sab bilkul wahi "200 Scanned" label dekhte hain chahe request asal mein safal hui ho ya nahi, aur unmein se koi bhi bina ek atirikt body parse kiye sahi tarike se act nahi kar sakta jiska bilkul shape unhe pehle se maloom bhi na ho. HTTP status code chunna jo sach mein us se mel khaata hai jo hua — ordinary success ke liye 200, "ek nayi package banaayi gayi" ke liye khaas taur par 201, "ye address hamesha ke liye move ho gaya" ke liye khaas taur par 301 — jaankaari-bhare-label system hai: nateeja status code mein khud drishyaman hai, jo bilkul wo hissa hai jise HTTP-aware tooling ka har tukda sabse pehle padhne ke liye banaaya gaya tha.',
    },

    simple: `**Start broken.** Every response returns 200, with success or failure buried inside the body:

\`\`\`js
app.post("/users", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(200).json({ success: false, error: "Could not create user" }); // still 200!
  }
});
\`\`\`

Whether creating the user succeeds or fails, the HTTP status code is identical: \`200\`. A load balancer\'s health check, a monitoring dashboard tracking error rates, or a client library like \`fetch\` checking \`response.ok\` (which is simply \`true\` for any 2xx status) all see an ordinary success, regardless of what actually happened — none of them are designed to parse an arbitrary JSON body to figure out whether the request genuinely succeeded, because the entire point of the HTTP status code is to make that information available without needing to. A monitoring system watching only status codes will report this endpoint as perfectly healthy even while every single request to it is failing, and a caching layer or CDN sitting in front of the API may even cache the failed response, since nothing about a \`200\` tells it otherwise.

**The fix: return the status code that actually matches what happened**

\`\`\`js
app.post("/users", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ user }); // 201: a new resource was genuinely created
  } catch (err) {
    res.status(500).json({ error: "Could not create user" }); // a real server-side failure
  }
});
\`\`\`

\`\`\`ts
app.post("/users", async (req: Request, res: Response) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ user });
  } catch (err) {
    res.status(500).json({ error: "Could not create user" });
  }
});
\`\`\`

Now the status code itself, not just the response body, tells the truth: \`201\` means a new resource was genuinely created, and \`500\` means something genuinely went wrong on the server\'s side. A monitoring dashboard watching status codes now correctly reports errors as errors, a caching layer correctly refuses to cache a \`500\`, and \`fetch\`\'s own \`response.ok\` correctly evaluates to \`false\` for the failure case — all without needing to know anything about this specific API\'s own JSON body shape at all.`,

    simpleHi: `**Toote hue se shuru.** Har response 200 return karta hai, success ya failure body ke andar dabi hui:

\`\`\`js
app.post("/users", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(200).json({ success: false, error: "Could not create user" }); // phir bhi 200!
  }
});
\`\`\`

Chahe user banaana safal ho ya fail ho, HTTP status code identical hai: \`200\`. Ek load balancer ki health check, error rates track karne wala ek monitoring dashboard, ya \`fetch\` jaisi ek client library jo \`response.ok\` check karti hai (jo kisi bhi 2xx status ke liye bas \`true\` hai) sab ek saadhaaran success dekhte hain, chahe asal mein kya hua ho — unmein se koi bhi ek manmaana JSON body parse karne ke liye design nahi kiya gaya ye pata karne ke liye ki request sach mein safal hui ya nahi, kyunki HTTP status code ka poora point hi ye jaankaari uplabdh karana hai bina uski zaroorat ke. Sirf status codes dekhne wala ek monitoring system is endpoint ko poori tarah healthy report karega chahe ise har akeli request fail ho rahi ho, aur API ke saamne baithi ek caching layer ya CDN fail hui response ko cache bhi kar sakti hai, kyunki ek \`200\` ke baare mein kuch bhi ise doosri baat nahi bataata.

**Fix: wo status code return karo jo sach mein us se mel khaata hai jo hua**

\`\`\`js
app.post("/users", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ user }); // 201: ek nayi resource sach mein banaayi gayi
  } catch (err) {
    res.status(500).json({ error: "Could not create user" }); // ek asli server-side failure
  }
});
\`\`\`

\`\`\`ts
app.post("/users", async (req: Request, res: Response) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ user });
  } catch (err) {
    res.status(500).json({ error: "Could not create user" });
  }
});
\`\`\`

Ab status code khud, sirf response body nahi, sach batata hai: \`201\` ka matlab hai ek nayi resource sach mein banaayi gayi, aur \`500\` ka matlab hai server ke apne taraf kuch sach mein galat hua. Status codes dekhne wala ek monitoring dashboard ab errors ko sahi tarike se errors report karta hai, ek caching layer sahi tarike se ek \`500\` ko cache karne se mana karti hai, aur \`fetch\` ka apna \`response.ok\` failure case ke liye sahi tarike se \`false\` ganta hai — in sab ke bina is khaas API ke apne JSON body shape ke baare mein kuch bhi jaane.`,

    content: `## The five categories: what the first digit means before you even look at the rest

\`\`\`
1xx — Informational: the request was received, processing continues (rarely used directly in typical REST APIs)
2xx — Success: the request was received, understood, and accepted
3xx — Redirection: further action is needed to complete the request
4xx — Client Error: the request contains bad syntax or genuinely cannot be fulfilled as sent
5xx — Server Error: the server failed to fulfill a request that was genuinely valid
\`\`\`

Before learning any individual status code, it is worth internalizing what the first digit alone already communicates, since this is precisely the information tooling that never inspects an individual code number can still act on. A monitoring system, a retry policy, or a caching layer can make a broadly correct decision from the first digit alone — for instance, "never automatically retry a 4xx, since the client\'s own request was the problem and retrying it unchanged will fail identically every time, but a 5xx may be worth retrying, since the server\'s failure might be transient." The most important high-level distinction a professional needs fluent in is that 4xx means the CLIENT did something the API cannot or will not act on, while 5xx means the SERVER itself failed despite receiving a perfectly valid request — this single distinction is what an API\'s own error-handling code, and this course\'s earlier centralized-error-handling lesson, is fundamentally built around.

## 2xx: three genuinely different flavors of success

\`\`\`js
res.status(200).json({ user });        // 200 OK — an ordinary success, returning a body
res.status(201).json({ user });        // 201 Created — a NEW resource now exists, e.g. after POST
res.status(204).end();                 // 204 No Content — success, but there is no body to return
\`\`\`

\`200 OK\` is the general-purpose success code, appropriate for a successful \`GET\` returning data, or a successful \`PUT\`/\`PATCH\` returning the updated resource. \`201 Created\` is specifically for the moment a request causes a brand-new resource to come into existence — most commonly a successful \`POST\` — and by convention should be paired with a \`Location\` header pointing at the newly created resource\'s own URL, so a client can immediately know where to find what it just created without needing to guess. \`204 No Content\` communicates success while explicitly having nothing to send back — a successful \`DELETE\` is the textbook case, since there is no meaningful resource left to describe, and a \`204\` response, unlike a \`200\`, is not expected to carry a response body at all. Using \`200\` for every one of these three genuinely different situations is not technically broken — a client that only checks "is this a success" will still work — but it discards real, free information a well-behaved client could otherwise use, such as immediately knowing a resource is brand new (\`201\`) versus simply being returned as-is (\`200\`).

## 3xx: redirection, and one code that is not really a "redirect" at all

\`\`\`js
res.redirect(301, "https://api.example.com/v2/users"); // permanent — update your bookmark
res.redirect(302, "/login");                            // temporary — keep using the original URL next time
res.status(304).end();                                  // "your cached copy is still valid" — not a redirect at all
\`\`\`

\`301 Moved Permanently\` tells a client, and critically, tells any cache or search engine crawler in between, that this resource\'s location has changed for good — a well-behaved client, and virtually every browser, will remember this and go directly to the new address on future requests, without asking the old one again. \`302 Found\` communicates the opposite intent: the redirect is temporary, so a client should keep using the ORIGINAL URL for its next request rather than permanently updating anything, which is exactly the behavior wanted for something like "you are not logged in, so temporarily go to \`/login\`" — the original protected URL is still the right one to request once the user actually is logged in. \`304 Not Modified\` is conceptually a different kind of response entirely, despite living in the same 3xx family: it is sent in response to a CONDITIONAL request (a client sending an \`If-None-Match\` header with an \`ETag\` it already has cached), and it tells the client "the resource has not changed since you last fetched it — keep using your existing cached copy," explicitly carrying no response body at all, since resending data the client already has would defeat the entire purpose of checking first.

## Why mixing these up has real, production consequences

Choosing \`301\` for a redirect that was only ever meant to be temporary causes browsers, CDNs, and search engines to permanently memorize the new address — if that redirect target later needs to change again, clients that cached the \`301\` may keep going to the now-stale address, ignoring a corrected redirect entirely, since a \`301\` is a promise that the new location is permanent. Choosing \`302\` for a genuinely permanent move avoids that specific problem but gives up the caching and SEO benefits a real \`301\` would have provided, since clients correctly treat a \`302\` as something that might change again and continue re-checking the original URL every time. \`304\`\'s correct use depends on an API actually implementing conditional requests (\`ETag\`/\`If-None-Match\` or \`Last-Modified\`/\`If-Modified-Since\`) in the first place — without that mechanism, there is no \`304\` to send at all, and every request re-transfers the full response body even when nothing has changed, a real, avoidable bandwidth and latency cost at scale.`,

    contentHi: `## Paanch categories: pehla digit kya darsata hai isse pehle ki tum baaki dekho

\`\`\`
1xx — Informational: request mil gayi hai, processing jaari hai (typical REST APIs mein seedhe kam istemal hota hai)
2xx — Success: request mil gayi, samajh li gayi, aur sweekaar ki gayi
3xx — Redirection: request poori karne ke liye aur kaarwaai zaruri hai
4xx — Client Error: request mein kharaab syntax hai ya sach mein jaise bheji gayi waise poori nahi ki jaa sakti
5xx — Server Error: server ek aisi request poori karne mein fail hua jo sach mein valid thi
\`\`\`

Kisi bhi akele status code ko seekhne se pehle, ye internalize karna vazan rakhta hai ki akela pehla digit hi pehle se kya sanchaar karta hai, kyunki ye bilkul wo jaankaari hai jispar tooling jo kabhi ek akela code number inspect nahi karti phir bhi act kar sakti hai. Ek monitoring system, ek retry policy, ya ek caching layer akele pehle digit se ek vyaapak roop se sahi faisla le sakti hai — misal ke taur par, "ek 4xx ko kabhi automatically retry mat karo, kyunki client ki apni request hi samasya thi aur ise na-badla retry karna har baar identical roop se fail hoga, par ek 5xx retry karne laayak ho sakta hai, kyunki server ki failure asthaayi ho sakti hai." Sabse mahatvapoorn high-level farak jismein ek professional ko fluent hona chahiye wo ye hai ki 4xx ka matlab hai CLIENT ne kuch aisa kiya jise API act nahi kar sakta ya nahi karega, jabki 5xx ka matlab hai SERVER khud fail hua ek poori tarah valid request paane ke bawajood — ye akela farak hi hai jispar ek API ka apna error-handling code, aur is course ka pehle wala centralized-error-handling lesson, buniyaadi roop se banaaya gaya hai.

## 2xx: success ke teen sach mein alag flavors

\`\`\`js
res.status(200).json({ user });        // 200 OK — ek saadhaaran success, ek body return karte hue
res.status(201).json({ user });        // 201 Created — ek NAYI resource ab maujood hai, jaise POST ke baad
res.status(204).end();                 // 204 No Content — success, par return karne ke liye koi body nahi
\`\`\`

\`200 OK\` general-purpose success code hai, ek safal \`GET\` ke liye upyukt jo data return karta hai, ya ek safal \`PUT\`/\`PATCH\` jo updated resource return karta hai. \`201 Created\` khaas taur par us pal ke liye hai jab ek request ek bilkul-nayi resource ko astitva mein laata hai — sabse aam ek safal \`POST\` — aur parampara se isse ek \`Location\` header ke saath jodna chahiye jo naye banaayi gayi resource ke apne URL ki taraf point kare, taaki ek client turant jaan sake ki jo unhone abhi banaaya use kahaan dhoondhna hai bina guess kiye. \`204 No Content\` explicitly kuch bhi wapas bhejne ke liye na hote hue success sanchaar karta hai — ek safal \`DELETE\` textbook case hai, kyunki describe karne ke liye koi maayne-yogya resource bachi nahi hai, aur ek \`204\` response, ek \`200\` ke ulta, kisi bhi response body ko bilkul kaayi nahi rakhne ki ummeed rakhi jaati hai. In teeno sach mein alag sthitiyon ke har ek ke liye \`200\` istemal karna technically toota nahi hai — ek client jo sirf "kya ye ek success hai" check karta hai phir bhi kaam karega — par ye asli, muft jaankaari hataa deta hai jo ek achhi-tarah-vyavahaar-karne-waala client istemal kar sakta tha, jaisa turant jaanna ki ek resource bilkul nayi hai (\`201\`) versus sirf jaisa hai waisa return ki gayi (\`200\`).

## 3xx: redirection, aur ek code jo asal mein bilkul "redirect" nahi hai

\`\`\`js
res.redirect(301, "https://api.example.com/v2/users"); // permanent — apna bookmark update karo
res.redirect(302, "/login");                            // temporary — agli baar asli URL istemal karte raho
res.status(304).end();                                  // "tumhaari cached copy abhi bhi valid hai" — bilkul redirect nahi
\`\`\`

\`301 Moved Permanently\` ek client ko batata hai, aur mahatvapoorn baat, beech mein kisi bhi cache ya search engine crawler ko bhi batata hai, ki is resource ki location hamesha ke liye badal gayi hai — ek achhi-tarah-vyavahaar-karne-waala client, aur lagbhag har browser, ise yaad rakhega aur bhavishya ki requests par seedhe naye address par jaayega, purane se dobara na poochte hue. \`302 Found\` ulta irada sanchaar karta hai: redirect asthaayi hai, isliye ek client ko apni agli request ke liye ASLI URL istemal karte rehna chahiye kisi cheez ko hamesha ke liye update karne ke bajaye, jo bilkul wahi vyavahaar hai jo kisi cheez ke liye chahiye jaisa "tum login nahi ho, isliye asthaayi roop se \`/login\` par jaao" — asli protected URL abhi bhi ek baar jab user asal mein login ho jaaye request karne ke liye sahi hai. \`304 Not Modified\` conceptually ek poori tarah alag tarah ka response hai, isi 3xx family mein rehte hue bhi: ye ek CONDITIONAL request ke jawaab mein bheja jaata hai (ek client jo ek \`If-None-Match\` header bhejta hai ek \`ETag\` ke saath jo iske paas pehle se cached hai), aur ye client ko batata hai "resource pichli baar tumne fetch kiya tab se badla nahi hai — apni maujood cached copy istemal karte raho," explicitly bilkul koi response body na le jaate hue, kyunki data jo client ke paas pehle se hai dobara bhejna pehle check karne ke poore point ko hara dega.

## In cheezon ko milaana kyun asli, production consequences rakhta hai

Ek redirect ke liye \`301\` chunna jo kabhi sirf asthaayi hone ke liye tha browsers, CDNs, aur search engines ko naye address ko hamesha ke liye yaad rakhne ka kaaran banta hai — agar wo redirect target baad mein dobara badalne ki zaroorat pade, wo clients jinhone \`301\` cache ki hai ab-purane address par jaate rehna chunte hain, ek sudhaari hui redirect ko poori tarah ignore karte hue, kyunki ek \`301\` ek waada hai ki naya location permanent hai. Ek sach mein permanent move ke liye \`302\` chunna us khaas samasya se bachta hai par caching aur SEO faayde chhod deta hai jo ek asli \`301\` pradaan karta, kyunki clients sahi tarike se ek \`302\` ko us cheez ki tarah treat karte hain jo dobara badal sakti hai aur har baar asli URL ko dobara check karte rehte hain. \`304\` ka sahi istemal is baat par nirbhar karta hai ki ek API asal mein conditional requests (\`ETag\`/\`If-None-Match\` ya \`Last-Modified\`/\`If-Modified-Since\`) shuru mein hi lagu karta hai — us mechanism ke bina, bhejne ke liye koi \`304\` bilkul nahi hai, aur har request poori response body dobara transfer karti hai chahe kuch bhi na badla ho, ek asli, bachne-laayak bandwidth aur latency keemat scale par.`,

    examples: [
      {
        title: 'Broken: every response is 200, even genuine failures',
        titleHi: 'Toota: har response 200 hai, asli failures bhi',
        code: `res.status(200).json({ success: false, error: "Could not create user" });
// a monitoring system watching status codes sees this as a success`,
        codeJs: `app.post("/users", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(200).json({ success: false, error: "Could not create user" });
  }
});`,
        codeTs: `app.post("/users", async (req: Request, res: Response) => {
  try {
    const user = await User.create(req.body);
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(200).json({ success: false, error: "Could not create user" });
  }
});
// fully valid TypeScript — the problem is a status-code choice,
// not a type error`,
        output: `A load balancer health check, a monitoring dashboard, and
fetch()'s own response.ok all report success, regardless of whether
user creation actually succeeded.`,
        explain: 'The actual outcome is hidden inside the JSON body, invisible to any tooling that only inspects the status code, which is precisely the information HTTP status codes exist to expose.',
        explainHi: 'Asli nateeja JSON body ke andar chhupa hai, kisi bhi tooling ke liye adrishya jo sirf status code inspect karti hai, jo bilkul wo jaankaari hai jise expose karne ke liye HTTP status codes maujood hain.',
      },
      {
        title: 'Fixed: 200, 201, and 204 for three genuinely different successes',
        titleHi: 'Theek: teen sach mein alag successes ke liye 200, 201, aur 204',
        code: `res.status(201).json({ user }); // POST — a new resource now exists
res.status(200).json({ user }); // GET/PUT — an ordinary success with a body
res.status(204).end();          // DELETE — success, nothing to return`,
        codeJs: `app.post("/users", async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json({ user }); // a NEW resource was created
});

app.get("/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({ user }); // an ordinary success
});

app.delete("/users/:id", async (req, res) => {
  await User.deleteOne({ _id: req.params.id });
  res.status(204).end(); // success, nothing to return
});`,
        codeTs: `app.post("/users", async (req: Request, res: Response) => {
  const user = await User.create(req.body);
  res.status(201).json({ user });
});

app.get("/users/:id", async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({ user });
});

app.delete("/users/:id", async (req: Request, res: Response) => {
  await User.deleteOne({ _id: req.params.id });
  res.status(204).end();
});`,
        outputJs: `A client can now tell, from the status code alone, whether it just
created something (201), read something (200), or deleted something
with nothing left to return (204).`,
        outputTs: `// Identical behaviour. Express's own Response type provides
// .status().json() and .end() with correct signatures.`,
        explain: 'Each status code communicates a genuinely different flavor of success, information a well-behaved client can use without needing to parse this specific API\'s own body shape.',
        explainHi: 'Har status code success ka ek sach mein alag flavor sanchaar karta hai, jaankaari jise ek achhi-tarah-vyavahaar-karne-waala client istemal kar sakta hai is khaas API ke apne body shape ko parse kiye bina.',
      },
      {
        title: '301 vs 302 vs 304: three different reasons to redirect or not re-send',
        titleHi: '301 vs 302 vs 304: redirect karne ya dobara-na-bhejne ke teen alag kaaran',
        code: `res.redirect(301, "/v2/users"); // permanent
res.redirect(302, "/login");     // temporary
res.status(304).end();           // cached copy is still valid`,
        codeJs: `app.get("/v1/users", (req, res) => {
  res.redirect(301, "/v2/users"); // this endpoint moved for good
});

app.get("/dashboard", (req, res) => {
  if (!req.session.userId) {
    return res.redirect(302, "/login"); // temporary — keep using /dashboard next time
  }
  res.status(200).json({ dashboard: true });
});

app.get("/articles/:id", (req, res) => {
  const article = getArticle(req.params.id);
  if (req.headers["if-none-match"] === article.etag) {
    return res.status(304).end(); // client's cached copy is still current
  }
  res.set("ETag", article.etag).status(200).json(article);
});`,
        codeTs: `app.get("/v1/users", (req: Request, res: Response) => {
  res.redirect(301, "/v2/users");
});

app.get("/dashboard", (req: Request, res: Response) => {
  if (!req.session.userId) {
    return res.redirect(302, "/login");
  }
  res.status(200).json({ dashboard: true });
});

app.get("/articles/:id", (req: Request, res: Response) => {
  const article = getArticle(req.params.id);
  if (req.headers["if-none-match"] === article.etag) {
    return res.status(304).end();
  }
  res.set("ETag", article.etag).status(200).json(article);
});`,
        outputJs: `Browsers and CDNs permanently remember the 301 and stop requesting
/v1/users again. The 302 to /login is never memorized, so /dashboard
is requested directly again once logged in. The 304 sends no body
at all when the client's cached copy is confirmed still valid.`,
        outputTs: `// Identical behaviour. req.headers is correctly typed as
// IncomingHttpHeaders by Express's own Request type.`,
        explain: 'Each of the three communicates a genuinely different fact — permanent change, temporary redirect, or "nothing has changed, keep your cache" — that clients and caches behave differently in response to.',
        explainHi: 'Teeno mein se har ek ek sach mein alag baat sanchaar karta hai — permanent badlaav, asthaayi redirect, ya "kuch nahi badla, apna cache rakho" — jinke jawaab mein clients aur caches alag tarike se vyavahaar karte hain.',
      },
    ],

    mistakes: [
      {
        wrong: `res.status(200).json({ success: false, error: "..." });
// failure encoded only in the body, status code always 200`,
        right: `res.status(500).json({ error: "..." });
// the status code itself reflects the actual outcome`,
        why: 'Tooling that decides based on status codes alone (health checks, monitoring, fetch\'s response.ok, caches) cannot see a failure hidden only inside the response body.',
        whyHi: 'Tooling jo sirf status codes ke aadhaar par faisla karti hai (health checks, monitoring, \`fetch\` ka \`response.ok\`, caches) ek failure ko nahi dekh sakti jo sirf response body ke andar chhupi hai.',
      },
      {
        wrong: `app.post("/users", async (req, res) => {
  const user = await User.create(req.body);
  res.status(200).json({ user }); // created, but reported as an ordinary success
});`,
        right: `app.post("/users", async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json({ user }); // 201 communicates "a new resource now exists"
});`,
        why: 'Using 200 for a resource-creating request discards real information — a client cannot distinguish "this already existed" from "this was just created" without inspecting the body.',
        whyHi: 'Ek resource-banaane-waali request ke liye 200 istemal karna asli jaankaari hataata hai — ek client body inspect kiye bina "ye pehle se maujood tha" ko "ye abhi banaaya gaya" se alag nahi bata sakta.',
      },
      {
        wrong: `res.redirect(301, "/maintenance"); // a TEMPORARY maintenance redirect marked permanent`,
        right: `res.redirect(302, "/maintenance"); // temporary, so clients keep requesting the original URL`,
        why: 'Marking a temporary redirect as 301 causes browsers and CDNs to permanently memorize it, so they may keep going to the temporary target even after the redirect is removed.',
        whyHi: 'Ek asthaayi redirect ko \`301\` maarka karna browsers aur CDNs ko ise hamesha ke liye yaad rakhne ka kaaran banta hai, isliye wo asthaayi target par jaate reh sakte hain redirect hataaye jaane ke baad bhi.',
      },
    ],

    realWorld: [
      {
        en: '**Load balancer health checks, uptime monitors, and CDN caching layers are all real, widely deployed pieces of infrastructure built specifically to act on the status code alone, without parsing a response body** — this is not a hypothetical concern this lesson invented.',
        hi: '**Load balancer health checks, uptime monitors, aur CDN caching layers sab asli, widely deployed infrastructure ke tukde hain jo khaas taur par sirf status code par act karne ke liye banaaye gaye hain, bina response body parse kiye** — ye ek kaalpanik chinta nahi hai jo is lesson ne ijaad ki.',
      },
      {
        en: '**Major API providers, including large cloud platforms and payment processors, document a "200 with success: false" pattern as an explicit anti-pattern to avoid**, precisely because of the tooling breakage this lesson describes.',
        hi: '**Badi API providers, badi cloud platforms aur payment processors sameet, "\`200\` with \`success: false\`" pattern ko ek explicit anti-pattern ki tarah document karte hain bachne ke liye**, bilkul us tooling breakage ki wajah se jo ye lesson describe karta hai.',
      },
      {
        en: '**ETag/If-None-Match-based 304 responses are a genuinely standard, widely used caching mechanism across the real web**, not a niche or rarely-implemented feature.',
        hi: '**ETag/If-None-Match-based \`304\` responses asli web mein ek sach mein standard, widely used caching mechanism hain**, ek niche ya kam-hi-lagu-ki-jaane-waali feature nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does returning HTTP 200 for every response, with success or failure encoded only in the response body, genuinely break real infrastructure — not just make the API "less clean"?',
        qHi: 'Har response ke liye HTTP 200 return karna, success ya failure sirf response body mein encode kiye hue, sach mein asli infrastructure kyun todta hai — sirf API ko "kam saaf" banaane se zyaada?',
        a: 'A significant amount of real infrastructure sitting around an API — load balancers performing health checks, uptime monitors, alerting systems, CDNs and caching proxies, and even simple client-side conveniences like fetch\'s own response.ok property — is specifically built to make a decision based on the HTTP status code alone, without parsing or even necessarily understanding the shape of a response body, since the entire value of the status code as a mechanism is that it communicates the outcome in a way every piece of HTTP-aware software can understand identically, regardless of what API it happens to be talking to. A load balancer\'s health check, for instance, typically considers any 2xx response a sign that a backend instance is healthy and should keep receiving traffic; if an API always returns 200 even when a request has genuinely failed on the server\'s own side, the health check has no way to detect that failure, since from its perspective a "200 with an embedded error" looks identical to an actual success. A monitoring or alerting system tracking error rates by counting non-2xx responses will report a completely healthy service, and therefore never page anyone, even while every single request to a specific endpoint is genuinely failing, since none of those failures are visible as anything other than 200s from the monitoring system\'s point of view. A caching layer or CDN deciding whether a response is safe to cache and serve to future requesters typically treats a 200 as cacheable by default; a failed request that happens to return 200 risks being cached and then served, as if it were a valid success, to other users making the same request later. None of these systems are behaving incorrectly — they are behaving exactly as designed, correctly trusting that a 200 genuinely means success, which is the entire contract the status code exists to provide. The bug is entirely on the API\'s side, for returning a status code that does not accurately reflect what actually happened.',
        aHi: 'Ek API ke aas-paas baithi kaafi vyaapak asli infrastructure — health checks perform karne wale load balancers, uptime monitors, alerting systems, CDNs aur caching proxies, aur seedhe \`fetch\` ki apni \`response.ok\` property jaisi saadhi client-side suvidhaayein — khaas taur par sirf HTTP status code ke aadhaar par ek faisla lene ke liye banaayi gayi hain, ek response body ko parse ya kabhi zaruri roop se samjhe bina bhi, kyunki ek mechanism ki tarah status code ki poori keemat ye hai ki ye nateeja aise sanchaar karta hai jise HTTP-aware software ka har tukda samaan roop se samajh sake, chahe ye kisi bhi API se baat kar raha ho. Ek load balancer ki health check, misal ke taur par, aksar kisi bhi 2xx response ko ek sanket maanti hai ki ek backend instance healthy hai aur ise traffic milna jaari rehna chahiye; agar ek API hamesha 200 return karta hai chahe ek request server ke apne taraf sach mein fail hui ho, health check ke paas us failure ko detect karne ka koi tarika nahi hai, kyunki iske nazariye se ek "ek dabi hui error ke saath 200" bilkul ek asli success jaisa dikhta hai. Non-2xx responses ganke error rates track karne wala ek monitoring ya alerting system ek poori tarah healthy service report karega, aur isliye kabhi kisi ko page nahi karega, chahe ek khaas endpoint ki har akeli request sach mein fail ho rahi ho, kyunki un failures mein se koi bhi monitoring system ke nazariye se 200s ke alaawa kuch aur nahi dikhti. Ek response ko future requesters ko cache aur serve karne ke liye surakshit hai ya nahi ye tay karne wali ek caching layer ya CDN aksar ek 200 ko default roop se cache-yogya treat karti hai; ek fail hui request jo samyog se 200 return karti hai cache hone aur phir baad mein doosre users ko wahi request karne par serve hone ka khatra rakhti hai, jaise ye ek valid success ho. In systems mein se koi bhi galat vyavahaar nahi kar raha — wo bilkul waise vyavahaar kar rahe hain jaisa design kiya gaya, sahi tarike se ye vishwaas karte hue ki ek 200 sach mein success ka matlab hai, jo poora contract hai jise pradaan karne ke liye status code maujood hai. Bug poori tarah API ke taraf hai, ek status code return karne ke liye jo sahi tarike se ye nahi darsata ki asal mein kya hua.',
      },
      {
        q: 'What is the practical difference between 301, 302, and 304, and why does treating them as interchangeable "redirect-ish" codes cause real problems?',
        qHi: '\`301\`, \`302\`, aur \`304\` ke beech vyaavahaarik farak kya hai, aur inhe ek doosre se badle-jaane-laayak "redirect-jaise" codes ki tarah treat karna asli samasyaein kyun paida karta hai?',
        a: '301 and 302 both instruct a client to go fetch a different URL than the one it originally requested, but they communicate genuinely different expectations about whether that new URL should be trusted as the resource\'s new, permanent home. A 301 explicitly tells the client, and any cache or search engine crawler observing the response, that the original URL has moved for good, and well-behaved clients are expected to update their own records accordingly — a browser may update a bookmark, a search engine may update its index to point directly at the new URL, and a cache may remember to send future requests straight to the new location without re-checking the old one. A 302 explicitly communicates the opposite: the redirect is temporary, and the client should continue treating the ORIGINAL URL as the correct one to request again in the future, only following this particular redirect this one time — this is exactly the correct behavior for something like an authentication gate temporarily sending an unauthenticated user to a login page, since the original protected URL remains the right one to request again once the user has actually authenticated. Treating these as interchangeable causes a real, concrete problem: if a redirect that was only ever meant to be temporary is marked 301, browsers, CDNs, and other caching infrastructure will treat the new target as a long-term replacement and may continue sending requests there even after the temporary condition has ended and the redirect itself has been removed from the API, since they were explicitly told the change was permanent and have no reason to check again. 304, despite sharing the 3xx category, is a conceptually different kind of response altogether — rather than instructing the client to go somewhere else, it is a reply to a conditional request the client itself initiated (typically by sending an If-None-Match header containing an ETag value it has cached from a previous response), and it communicates "the resource you are asking about has not changed since you last fetched it, so continue using what you already have," explicitly without sending the resource\'s data again, since doing so would defeat the entire purpose of the client asking first. Using 200 instead of 304 for an unchanged resource works, but forces the full response body to be re-transferred on every single request even when nothing has changed, a real, measurable bandwidth and latency cost that 304, when properly implemented, exists specifically to eliminate.',
        aHi: '\`301\` aur \`302\` dono ek client ko batate hain ki wo ek alag URL fetch karne jaaye us se jo unhone asal mein maanga tha, par wo is baare mein sach mein alag ummeedein sanchaar karte hain ki kya us naye URL ko resource ke naye, permanent ghar ki tarah bharosa karna chahiye. Ek \`301\` explicitly client ko batata hai, aur response dekh rahe kisi bhi cache ya search engine crawler ko bhi, ki asli URL hamesha ke liye move ho gaya hai, aur achhi-tarah-vyavahaar-karne-waale clients se ummeed ki jaati hai ki wo apne records ko us anusaar update karein — ek browser ek bookmark update kar sakta hai, ek search engine apna index update kar sakta hai seedhe naye URL ki taraf point karne ke liye, aur ek cache future requests ko seedhe naye location par bhejna yaad rakh sakta hai bina purane ko dobara check kiye. Ek \`302\` ulta explicitly sanchaar karta hai: redirect asthaayi hai, aur client ko bhavishya mein dobara request karne ke liye ASLI URL ko hi sahi treat karte rehna chahiye, is khaas redirect ko sirf is ek baar follow karte hue — ye bilkul us cheez ke liye sahi vyavahaar hai jaisa ek authentication gate asthaayi roop se ek na-authenticated user ko ek login page bhejna, kyunki asli protected URL ek baar jab user asal mein authenticate ho jaaye dobara request karne ke liye sahi rehta hai. Inhe badle-jaane-laayak treat karna ek asli, thos samasya paida karta hai: agar ek redirect jo kabhi sirf asthaayi hone ke liye tha \`301\` maarka jaata hai, browsers, CDNs, aur doosri caching infrastructure naye target ko ek lambe-arse ke replacement ki tarah treat karengi aur asthaayi sthiti khatam hone aur redirect khud API se hataaye jaane ke baad bhi wahaan requests bhejna jaari rakh sakte hain, kyunki unhe explicitly bataaya gaya tha ki badlaav permanent hai aur unke paas dobara check karne ka koi kaaran nahi hai. \`304\`, isi 3xx category ko share karte hue bhi, ek conceptually poori tarah alag tarah ka response hai — client ko kahin aur jaane ka nirdesh dene ke bajaye, ye ek CONDITIONAL request ka jawaab hai jo client ne khud shuru ki (aksar ek \`If-None-Match\` header bhejkar jismein ek \`ETag\` value hai jo iske paas ek pichli response se cached hai), aur ye sanchaar karta hai "jis resource ke baare mein tum poochh rahe ho wo pichli baar tumne fetch kiya tab se badla nahi hai, isliye jo tumhare paas pehle se hai use istemal karte raho," explicitly resource ka data dobara bheje bina, kyunki aisa karna client ke pehle poochhne ke poore point ko hara dega. Ek na-badli resource ke liye \`304\` ke bajaye \`200\` istemal karna kaam karta hai, par poori response body ko har akeli request par dobara transfer karne par majboor karta hai chahe kuch bhi na badla ho, ek asli, naapa-jaane-laayak bandwidth aur latency keemat jise \`304\`, jab sahi tarike se lagu kiya jaaye, khaas taur par khatam karne ke liye maujood hai.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken example: an Express endpoint that always returns 200, with success or failure encoded only in the JSON body. Write a simple health-check script using status codes only and confirm it reports "healthy" even when every request is failing.',
        taskHi: 'Toota example banao: ek Express endpoint jo hamesha 200 return karta hai, success ya failure sirf JSON body mein encode kiye hue. Sirf status codes istemal karte hue ek saadha health-check script likho aur confirm karo ki ye "healthy" report karta hai chahe har request fail ho rahi ho.',
        hint: 'A simple health check can just be a script that treats any response.ok as healthy — compare its verdict against what the response body actually says happened.',
        hintHi: 'Ek saadha health check bas ek script ho sakta hai jo kisi bhi \`response.ok\` ko healthy treat karta hai — iske faisle ko us se compare karo jo response body asal mein bataata hai ki kya hua.',
      },
      {
        task: 'Fix three endpoints (create, read, delete) to use 201, 200, and 204 respectively, following this lesson\'s example. Confirm via curl -i that each returns the correct status code and that the 204 response genuinely has no body.',
        taskHi: 'Is lesson ke example ka palan karte hue teen endpoints (create, read, delete) ko theek karo \`201\`, \`200\`, aur \`204\` istemal karne ke liye. \`curl -i\` ke zariye confirm karo ki har ek sahi status code return karta hai aur ki \`204\` response mein sach mein koi body nahi hai.',
        hint: 'curl -i shows response headers and status line, letting you directly see both the status code and whether a body was actually sent.',
        hintHi: '\`curl -i\` response headers aur status line dikhaata hai, tumhe seedhe status code aur ye dekhne dete hue ki kya ek body asal mein bheji gayi thi.',
      },
      {
        task: 'Build a simple endpoint that supports conditional GET requests using ETag and If-None-Match, returning 304 when the client\'s cached copy is still valid, following this lesson\'s example. Confirm via curl with a matching If-None-Match header that no response body is sent.',
        taskHi: 'Ek saadha endpoint banao jo \`ETag\` aur \`If-None-Match\` istemal karke conditional GET requests support karta hai, \`304\` return karte hue jab client ki cached copy abhi bhi valid hai, is lesson ke example ka palan karte hue. Ek mel khaate \`If-None-Match\` header ke saath curl ke zariye confirm karo ki koi response body nahi bheji jaati.',
        hint: 'Send the request twice — first without an If-None-Match header to capture the ETag, then again with that ETag value in an If-None-Match header to trigger the 304.',
        hintHi: 'Request do baar bhejo — pehle bina \`If-None-Match\` header ke ETag capture karne ke liye, phir dobara us ETag value ke saath ek \`If-None-Match\` header mein \`304\` trigger karne ke liye.',
      },
    ],

    keyTakeaways: [
      'The first digit of a status code (1xx-5xx) alone communicates a broad category tooling can act on without inspecting anything else — 4xx means the client\'s request was the problem, 5xx means the server failed despite a valid request.',
      'Returning 200 for every response, with actual success or failure encoded only in the body, breaks load balancer health checks, monitoring/alerting, caching layers, and fetch\'s own response.ok — all of which are built to trust the status code.',
      '200, 201, and 204 are three genuinely different flavors of success: an ordinary success with a body, a newly created resource, and a success with nothing to return, respectively.',
      '301 tells clients and caches a resource has moved permanently, and they should update their records accordingly; 302 tells them the redirect is temporary, and the original URL should still be used next time.',
      '304 is conceptually different from a redirect — it is the response to a conditional request, telling the client its cached copy is still valid, explicitly sent with no response body at all.',
      'Marking a temporary redirect as 301 causes clients to permanently memorize a target that was only ever meant to be short-lived, a real production consequence, not just a technicality.',
    ],
    keyTakeawaysHi: [
      'Status code ka akela pehla digit (1xx-5xx) ek vyaapak category sanchaar karta hai jispar tooling kuch aur inspect kiye bina act kar sakti hai — 4xx ka matlab hai client ki request samasya thi, 5xx ka matlab hai server ek valid request ke bawajood fail hua.',
      'Har response ke liye 200 return karna, asli success ya failure sirf body mein encode kiye hue, load balancer health checks, monitoring/alerting, caching layers, aur \`fetch\` ke apne \`response.ok\` ko todta hai — in sab ko status code par bharosa karne ke liye banaaya gaya hai.',
      '200, 201, aur 204 success ke teen sach mein alag flavors hain: ek saadhaaran success ek body ke saath, ek nayi banaayi gayi resource, aur ek success jismein kuch bhi return karne ke liye nahi hai, kramashah.',
      '301 clients aur caches ko batata hai ki ek resource hamesha ke liye move ho gaya hai, aur unhe apne records ko us anusaar update karna chahiye; 302 unhe batata hai ki redirect asthaayi hai, aur asli URL agli baar bhi istemal hona chahiye.',
      '304 conceptually ek redirect se alag hai — ye ek conditional request ka response hai, client ko batate hue ki uski cached copy abhi bhi valid hai, explicitly bilkul kisi response body ke bina bheja jaata hai.',
      'Ek asthaayi redirect ko 301 maarka karna clients ko ek target hamesha ke liye yaad rakhne ka kaaran banta hai jo kabhi sirf thodi der ke liye tha, ek asli production nateeja, sirf ek takniki baat nahi.',
    ],
  },
];
