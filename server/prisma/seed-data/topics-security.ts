import type { SeedCategory } from './topics-shared';

/**
 * Web security beyond authentication.
 *
 * The auth category covers who you are and what you may do. This covers
 * everything else: transport, headers, injection, abuse, dependencies, uploads
 * and personal data.
 *
 * Two threads run through the whole set:
 *   · **Defence in depth** — every control will eventually fail, so nothing may
 *     be the only thing standing between an attacker and the damage.
 *   · **The attacker does not use your UI.** Almost every real vulnerability in
 *     this file comes from assuming they do.
 */
export const securityCategory: SeedCategory = {
  slug: 'security',
  name: 'Web Security',
  description:
    'Thinking like an attacker — transport, headers, injection, abuse, dependencies, uploads and personal data.',
  icon: 'shield',
  group: 'backend',
  topics: [
    {
      slug: 'sec-thinking-about-security',
      title: 'How to think about security',
      difficulty: 'EASY',
      summary: 'Ask what is worth stealing, who would want it, and what happens if one control fails. Security is a habit of asking, not a library you install.',
      summaryHi: 'Poochho ki churane layak kya hai, kise chahiye, aur ek bachaav fail ho to kya hoga. Security aadat hai poochhne ki, koi library nahi jo install ho jaye.',
      content: `Security is not a feature you add at the end. It is a set of questions you ask while building.

**Threat modelling, in four questions**

1. **What are we protecting?** User data, money, availability, reputation.
2. **Who wants it?** A bored script scanning the whole internet, a competitor, a fired employee, an organised group. Most attacks are the first one, and automated scanners find things within hours of exposure.
3. **How would they get in?** Login, API, uploads, dependencies, an admin panel someone forgot.
4. **What happens if one control fails?** If your auth check is bypassed, is there anything else in the way?

That fourth question is **defence in depth**, and it is the single most useful habit here. Any one control will eventually fail. The question is whether that failure is an incident or a catastrophe.

**The rule that catches most beginner mistakes**

**The attacker does not use your UI.**

They use curl. They do not see your disabled button, your form validation, your hidden field, or the page that only renders for admins. They call the endpoint directly with whatever body they like.

So: **every rule must be enforced on the server.** Client-side validation is for user experience. Server-side validation is for security. They look similar and do completely different jobs.

**Least privilege**

Give every component the minimum access it needs. The service that sends emails does not need database write access. The read-only dashboard connects with a read-only user. When something is compromised — and eventually something is — least privilege decides how far it spreads.

**Fail closed**

If your permission check throws an error, deny. A system that allows anything it does not recognise will eventually meet something it does not recognise.

**Do not invent cryptography.** Use bcrypt or argon2 for passwords, a maintained library for JWTs, the platform's TLS. Hand-rolled crypto is almost always broken in ways that are not visible from the outside, which is precisely what makes it dangerous.

**Assume breach.** Design so that a leaked database is bad rather than fatal: passwords hashed, tokens short-lived, secrets rotatable, personal data minimised.`,
      contentHi: `Security wo feature nahi hai jo aakhir mein jodte hain. Ye un sawaalon ka set hai jo aap banate waqt poochhte ho.

**Threat modelling, chaar sawaalon mein**

1. **Hum kya bacha rahe hain?** User data, paisa, uplabdhta, saakh.
2. **Kise chahiye?** Poore internet ko scan karta koi bekaar script, koi pratispardhi, nikala gaya karmchari, koi sangathit group. Zyadatar hamle pehla wala hote hain, aur apne aap chalne wale scanners kisi cheez ke khulne ke ghanton mein use dhoondh lete hain.
3. **Wo andar kaise aayenge?** Login, API, uploads, dependencies, koi admin panel jo kisi ne bhula diya.
4. **Ek bachaav fail ho jaye to kya hoga?** Aapki auth jaanch bypass ho jaye, to raste mein aur kuch hai?

Chautha sawaal **defence in depth** hai, aur yahan ki sabse kaam ki aadat yahi hai. Koi bhi ek bachaav kabhi na kabhi fail hoga. Sawaal ye hai ki wo fail hona ek incident hai ya tabaahi.

**Wo niyam jo zyadatar shuruaati galtiyan pakadta hai**

**Hamlawar aapka UI use nahi karta.**

Wo curl use karta hai. Use aapka disabled button, form validation, chhupa hua field, ya wo page nahi dikhta jo sirf admins ko banta hai. Wo endpoint seedha bulata hai, jo body chahe uske saath.

Isliye: **har niyam server par lagu hona chahiye.** Client-side validation user experience ke liye hai. Server-side validation suraksha ke liye. Ye dikhte ek jaise hain aur kaam bilkul alag karte hain.

**Least privilege**

Har hisse ko utni hi pahunch do jitni chahiye. Email bhejne wali service ko database mein likhne ka hak nahi chahiye. Sirf padhne wala dashboard read-only user se jude. Jab kuch compromise hoga — aur kabhi na kabhi hoga — to least privilege tay karta hai ki wo kitna door tak phailta hai.

**Band rakh kar fail ho**

Aapki permission jaanch error de to mana kar do. Jo system apni samajh se bahar ki har cheez allow karta hai, use kabhi na kabhi samajh se bahar ka kuch mil hi jayega.

**Apni cryptography mat banao.** Passwords ke liye bcrypt ya argon2, JWT ke liye sambhali gayi library, platform ka TLS. Khud banayi crypto lagbhag hamesha aise tareeke se tooti hoti hai jo bahar se dikhta nahi, aur theek isi wajah se khatarnaak hai.

**Maan lo sendh lagegi.** Aisa banao ki leak hua database bura ho, jaanleva nahi: passwords hashed, tokens chhoti umar ke, secrets badle ja sakein, nijee data kam se kam.`,
      commonMistakes: [
        'Relying on client-side validation or hidden UI for security. The attacker calls the endpoint directly.',
        'Treating security as a task for later, when the cheapest time to fix a design flaw is before it is built.',
        'Giving every service full database credentials, so one compromise becomes total compromise.',
        'Writing your own hashing or token scheme rather than using a maintained library.',
      ],
      interviewQuestions: [
        'What is threat modelling?',
        'What does defence in depth mean in practice?',
        'Why is client-side validation not a security control?',
        'What does "assume breach" change about your design?',
      ],
      practiceQuestions: [
        'Threat-model a login flow: what is protected, who wants it, how would they get in?',
        'List every place your app trusts data from the client, and check each one is validated server-side.',
      ],
      tags: ['security', 'basics', 'must-know'],
    },

    {
      slug: 'sec-https-and-headers',
      title: 'HTTPS and security headers',
      difficulty: 'EASY',
      summary: 'TLS everywhere, and a handful of headers that turn off entire categories of attack for the cost of a few lines of config.',
      summaryHi: 'Har jagah TLS, aur kuch headers jo poori-poori kism ke hamle band kar dete hain, wo bhi kuch line ki config mein.',
      content: `**HTTPS is not optional, and not just about passwords**

Without TLS, anyone on the network path can read *and modify* traffic. On plain HTTP an attacker on the same wifi can inject a script into any page you load — so it is not only that your data is visible, it is that the page you receive may not be the page that was sent.

TLS gives you three things: **privacy** (nobody can read it), **integrity** (nobody can change it), and **authenticity** (the certificate proves the server is who it claims).

Certificates are free and automatic now. There is no remaining excuse.

**The headers worth setting, and what each turns off**

| Header | Turns off |
|---|---|
| \`Strict-Transport-Security\` | downgrade to HTTP — the browser refuses plain HTTP for your domain |
| \`Content-Security-Policy\` | most XSS — scripts only run from sources you list |
| \`X-Content-Type-Options: nosniff\` | the browser guessing a file is JavaScript when you said it was text |
| \`X-Frame-Options: DENY\` | clickjacking — your page inside someone else's invisible iframe |
| \`Referrer-Policy\` | leaking your URLs (and anything in them) to third parties |

**HSTS matters more than it looks.** Without it, a user typing \`example.com\` makes one plain HTTP request before being redirected — and that one request can be intercepted. HSTS tells the browser to never try HTTP for your domain again.

**CSP is the strongest and the fussiest.** A strict policy genuinely stops most XSS from executing even if injection succeeds — it is defence in depth working exactly as intended. But it breaks inline scripts and third-party widgets, so it needs real work to deploy. Use report-only mode first to see what would break.

**Cookies need their own flags**, and they are part of this picture: \`httpOnly\` so scripts cannot read them, \`secure\` so they never travel over HTTP, \`sameSite\` so they are not attached to cross-site requests.

**One line of nuance on CORS**, because it is constantly misunderstood: CORS is not a security control for your API. It stops a *browser on another origin* reading your response. The request often still arrives and still executes, and anything that is not a browser ignores CORS entirely.

**The practical version:** \`helmet\` sets sensible defaults in one line, TLS is handled by your platform or a reverse proxy, and then you spend your real effort on CSP.`,
      contentHi: `**HTTPS optional nahi hai, aur sirf passwords ki baat nahi hai**

TLS ke bina network ke raste par baitha koi bhi traffic padh *aur badal* sakta hai. Plain HTTP par usi wifi par baitha hamlawar aapke khole gaye kisi bhi page mein script daal sakta hai — to baat sirf ye nahi ki aapka data dikh raha hai, balki ye ki jo page aapko mila wo shayad wo hai hi nahi jo bheja gaya tha.

TLS teen cheezein deta hai: **niji ta** (koi padh nahi sakta), **akhandta** (koi badal nahi sakta), aur **pramanikta** (certificate sabit karta hai ki server wahi hai jo keh raha hai).

Certificates ab muft aur apne aap milte hain. Ab koi bahana nahi bacha.

**Lagane layak headers, aur har ek kya band karta hai**

| Header | Kya band karta hai |
|---|---|
| \`Strict-Transport-Security\` | HTTP par girna — browser aapke domain ke liye plain HTTP mana kar deta hai |
| \`Content-Security-Policy\` | zyadatar XSS — scripts sirf unhi sources se chalti hain jo aapne ginaye |
| \`X-Content-Type-Options: nosniff\` | browser ka andaza lagana ki file JavaScript hai jab aapne text kaha tha |
| \`X-Frame-Options: DENY\` | clickjacking — aapka page kisi aur ke adrishya iframe mein |
| \`Referrer-Policy\` | aapke URL (aur unme jo hai) third parties tak pahunchna |

**HSTS dikhne se zyada matter karta hai.** Iske bina \`example.com\` type karne wala user redirect hone se pehle ek plain HTTP request bhejta hai — aur wo ek request pakdi ja sakti hai. HSTS browser se kehta hai ki aapke domain ke liye HTTP dobara kabhi try na kare.

**CSP sabse mazboot aur sabse nakhrelu hai.** Sakht policy sach mein zyadatar XSS ko chalne se rok deti hai chahe injection safal ho jaye — defence in depth theek waise hi kaam karta hua. Par ye inline scripts aur third-party widgets todti hai, isliye lagane mein asli mehnat lagti hai. Pehle report-only mode use karo taaki dikhe kya toot ega.

**Cookies ko apne flags chahiye**, aur wo isi tasveer ka hissa hain: \`httpOnly\` taaki scripts padh na sakein, \`secure\` taaki wo HTTP par kabhi na jayein, \`sameSite\` taaki wo cross-site requests ke saath na lagein.

**CORS par ek line**, kyunki ise lagatar galat samjha jata hai: CORS aapki API ka suraksha niyantran nahi hai. Wo *doosre origin ke browser* ko aapka jawab padhne se rokta hai. Request aksar phir bhi pahunchti hai aur chal jati hai, aur jo browser nahi hai wo CORS ko ginta hi nahi.

**Practical roop:** \`helmet\` ek line mein samajhdaar defaults laga deta hai, TLS aapka platform ya reverse proxy sambhalta hai, aur phir asli mehnat aap CSP par lagate ho.`,
      codeExample: `import helmet from 'helmet';

app.use(helmet());   // sensible defaults for most of the headers above

// CSP is the one worth configuring deliberately
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],                    // no inline scripts — this is the point
    styleSrc: ["'self'", "'unsafe-inline'"],  // often needed for CSS-in-JS
    imgSrc: ["'self'", 'data:', 'https:'],
    connectSrc: ["'self'", 'https://api.example.com'],
    frameAncestors: ["'none'"],               // clickjacking
    upgradeInsecureRequests: [],
  },
  reportOnly: true,   // start here: log violations without breaking the site
}));

app.use(helmet.hsts({ maxAge: 31_536_000, includeSubDomains: true, preload: true }));`,
      commonMistakes: [
        'Serving anything over plain HTTP, where traffic can be read and modified in transit.',
        'Assuming CORS protects the API. It restricts a browser reading a response; the request still executes.',
        'Deploying a strict CSP without report-only mode first, breaking the site and then disabling it entirely.',
        'Setting security headers on the HTML but not on API responses.',
      ],
      interviewQuestions: [
        'What does TLS actually guarantee?',
        'What attack does HSTS prevent that a redirect does not?',
        'What does Content-Security-Policy stop, and what makes it hard to deploy?',
        'Does CORS protect your API?',
      ],
      practiceQuestions: [
        'Add helmet to an app, then run it through an online header scanner.',
        'Deploy a CSP in report-only mode and read what it would have blocked.',
      ],
      tags: ['security', 'https', 'headers', 'must-know'],
    },

    {
      slug: 'sec-owasp-top-ten',
      title: 'The OWASP Top 10, practically',
      difficulty: 'MEDIUM',
      summary: 'The ten categories that cause most real breaches — what each looks like in a Node app, and the one change that fixes it.',
      summaryHi: 'Wo das kism jinse zyadatar asli breaches hote hain — Node app mein har ek kaisa dikhta hai, aur wo ek badlav jo use theek karta hai.',
      content: `A list worth knowing by name — interviewers ask for it, and it maps well onto real bugs.

**1. Broken access control** — *the biggest one, by a wide margin.*
Changing \`/orders/41\` to \`/orders/42\` and seeing someone else's data. **Fix:** check ownership on every request; never trust an id from the client.

**2. Cryptographic failures**
Plain HTTP, weak hashing, secrets in the repo, sensitive data stored unencrypted. **Fix:** TLS everywhere, bcrypt/argon2, secrets in a manager.

**3. Injection**
SQL, NoSQL, command, or template injection — user input treated as code. **Fix:** parameterised queries and validated input, never string concatenation.

**4. Insecure design**
The flaw is in the plan, not the code — for example a password reset that emails a guessable token. **Fix:** threat model before building.

**5. Security misconfiguration**
Default credentials, debug mode in production, verbose errors, an open S3 bucket, an admin panel with no auth. **Fix:** harden by default and review what production actually exposes.

**6. Vulnerable components**
An outdated dependency with a known CVE. Your code is fine; a library three levels down is not. **Fix:** \`npm audit\` in CI, automated update PRs.

**7. Authentication failures**
No rate limiting on login, weak passwords accepted, sessions that never expire, predictable reset tokens. **Fix:** rate limit, use a real library, expire things.

**8. Software and data integrity failures**
Trusting an update or a package you did not verify; deserialising untrusted data. **Fix:** lockfiles, signature verification, never deserialise user input into live objects.

**9. Logging and monitoring failures**
The breach lasted three months because nobody was looking. **Fix:** log authentication events and alert on anomalies.

**10. Server-Side Request Forgery (SSRF)**
Your server fetches a URL the user supplied, and the user supplies an internal address — reaching a database or a cloud metadata endpoint that is only accessible from inside. **Fix:** allow-list destinations; never fetch arbitrary user URLs.

**The pattern underneath**

Most of these are the same mistake wearing different clothes: **trusting input, or trusting that a control cannot be bypassed.** Number one is by far the most common in real applications, and it is also the least glamorous — which is probably why it stays common.`,
      contentHi: `Ek list jo naam se jaanne layak hai — interview mein poochhi jati hai, aur asli bugs par achhi tarah baithti hai.

**1. Broken access control** — *sabse badi, bade antar se.*
\`/orders/41\` ko \`/orders/42\` karke kisi aur ka data dekhna. **Hal:** har request par maalikana jaancho; client se aayi id par kabhi bharosa nahi.

**2. Cryptographic failures**
Plain HTTP, kamzor hashing, repo mein secrets, bina encryption ke rakha sanvedansheel data. **Hal:** har jagah TLS, bcrypt/argon2, secrets manager mein.

**3. Injection**
SQL, NoSQL, command ya template injection — user input ko code ki tarah chalana. **Hal:** parameterised queries aur jaancha hua input, string jodna kabhi nahi.

**4. Insecure design**
Khaami yojna mein hai, code mein nahi — jaise aisa password reset jo anuman layak token email kare. **Hal:** banane se pehle threat model.

**5. Security misconfiguration**
Default credentials, production mein debug mode, tafseeli errors, khula S3 bucket, bina auth wala admin panel. **Hal:** default se sakht rakho aur dekho ki production sach mein kya khol raha hai.

**6. Vulnerable components**
Purani dependency jismein maalum CVE hai. Aapka code theek hai; teen parat neeche ki library nahi. **Hal:** CI mein \`npm audit\`, apne aap banne wale update PR.

**7. Authentication failures**
Login par rate limiting nahi, kamzor passwords sweekar, sessions jo kabhi khatam nahi hote, anuman layak reset tokens. **Hal:** rate limit, asli library, cheezein expire karo.

**8. Software and data integrity failures**
Bina verify kiye update ya package par bharosa; anjaane data ko deserialise karna. **Hal:** lockfiles, signature verification, user input ko kabhi zinda objects mein deserialise mat karo.

**9. Logging and monitoring failures**
Sendh teen mahine chali kyunki koi dekh hi nahi raha tha. **Hal:** authentication events log karo aur anomaly par alert.

**10. Server-Side Request Forgery (SSRF)**
Aapka server wo URL laata hai jo user ne diya, aur user andar ka pata deta hai — jisse aisa database ya cloud metadata endpoint mil jata hai jo sirf andar se pahunche. **Hal:** destinations ki allow-list; user ka koi bhi URL kabhi mat laao.

**Neeche ka pattern**

Inme se zyadatar wahi ek galti hai alag kapdon mein: **input par bharosa, ya is baat par bharosa ki bachaav bypass nahi ho sakta.** Number ek asli applications mein bade antar se sabse aam hai, aur sabse kam chamakdaar bhi — shayad isiliye wo aam bani rehti hai.`,
      commonMistakes: [
        'Focusing on exotic attacks while broken access control — the most common category by far — goes unchecked.',
        'Running `npm audit` once, fixing it, and never automating it.',
        'Leaving verbose error pages or debug mode enabled in production.',
        'Fetching user-supplied URLs server-side without an allow-list, exposing internal services via SSRF.',
      ],
      interviewQuestions: [
        'What is the most common category in the OWASP Top 10 and why?',
        'What is SSRF and how would you prevent it?',
        'How do you keep dependencies from becoming a vulnerability?',
        'What is the difference between insecure design and a security bug?',
      ],
      practiceQuestions: [
        'Go through the ten categories and find one instance of each risk in an app you know.',
        'Add `npm audit --audit-level=high` to CI and fix what it reports.',
      ],
      tags: ['security', 'owasp', 'must-know'],
    },

    {
      slug: 'sec-injection-and-validation',
      title: 'Injection and input validation',
      difficulty: 'MEDIUM',
      summary: 'Every injection is the same bug: data was treated as code. Separate the two, and validate at the boundary with an allow-list.',
      summaryHi: 'Har injection wahi ek bug hai: data ko code ki tarah chala diya gaya. Dono ko alag rakho, aur boundary par allow-list se validate karo.',
      content: `**SQL injection**

\`\`\`js
db.query("SELECT * FROM users WHERE email = '" + email + "'");   // catastrophic
db.query('SELECT * FROM users WHERE email = $1', [email]);       // safe
\`\`\`

**Why parameters actually work:** it is not escaping. The query and the data travel on **separate channels** — the database receives the query shape first, then the values, so a value can never become part of the command. That distinction matters, because people who think it is about escaping write their own escaping and get it wrong.

**NoSQL injection is real too**

\`\`\`js
db.users.findOne({ email: req.body.email, password: req.body.password });
\`\`\`

If the client sends \`{"email": {"$ne": null}}\` instead of a string, that becomes an operator and matches the first user. **Fix:** validate that the input is a string before using it. This is one reason Mongo needs schema validation at the boundary just as much as SQL does.

**Command injection**

Passing user input to a shell. **Fix:** avoid the shell entirely — pass arguments as an array so nothing is parsed as shell syntax.

**XSS is injection into HTML**

- **Stored** — saved and served to other users, the most damaging kind
- **Reflected** — echoed back from the URL
- **DOM-based** — the client writes user data into the page

**Fix:** escape on output, use \`textContent\` rather than \`innerHTML\`, and add a Content-Security-Policy so injected script does not execute even if it lands.

React escapes by default — which is why \`dangerouslySetInnerHTML\` has that name. If you must render user HTML, sanitise it with DOMPurify.

**Validate at the boundary, with an allow-list**

Allow what is known good; do not try to block what is known bad. Blocklists are always incomplete because attackers invent new inputs and you are guessing at their imagination.

Validate **type, format, length and range** — and note that length limits are a security control, not just tidiness: a 10 MB string in a field expecting 50 characters is a denial-of-service.

**Where it must happen:** the server, always. Client-side validation is for user experience.

**The parts that cannot be parameterised** — table names, column names, sort direction, LIMIT — must come from an **allow-list**, never from string building. \`ORDER BY \${req.query.sort}\` is injection with extra steps.`,
      contentHi: `**SQL injection**

\`\`\`js
db.query("SELECT * FROM users WHERE email = '" + email + "'");   // tabaahi
db.query('SELECT * FROM users WHERE email = $1', [email]);       // surakshit
\`\`\`

**Parameters sach mein kaam kaise karte hain:** ye escaping nahi hai. Query aur data **alag raston** se jate hain — database ko pehle query ka dhaancha milta hai, phir values, isliye koi value hukum ka hissa ban hi nahi sakti. Ye farak matter karta hai, kyunki jo ise escaping samajhte hain wo apni escaping likh kar galat karte hain.

**NoSQL injection bhi asli hai**

\`\`\`js
db.users.findOne({ email: req.body.email, password: req.body.password });
\`\`\`

Client string ki jagah \`{"email": {"$ne": null}}\` bheje to wo operator ban jata hai aur pehle user se match kar jata hai. **Hal:** use karne se pehle jaancho ki input string hai. Isi wajah se Mongo ko boundary par schema validation utni hi chahiye jitni SQL ko.

**Command injection**

User input shell ko dena. **Hal:** shell ka istemal hi mat karo — arguments array ki tarah bhejo taaki kuch bhi shell syntax ki tarah na padha jaye.

**XSS HTML mein injection hai**

- **Stored** — jama hokar doosre users ko parosa jata hai, sabse nuksaandeh
- **Reflected** — URL se wapas laut aya
- **DOM-based** — client user data ko page mein likhta hai

**Hal:** output par escape karo, \`innerHTML\` ki jagah \`textContent\`, aur Content-Security-Policy lagao taaki daali gayi script pahunch kar bhi chale nahi.

React default se escape karta hai — isiliye \`dangerouslySetInnerHTML\` ka naam waisa hai. User ka HTML dikhana hi ho to DOMPurify se sanitise karo.

**Boundary par validate karo, allow-list se**

Jo pakka theek hai use allow karo; jo pakka bura hai use rokne ki koshish mat karo. Blocklist hamesha adhoori hoti hai kyunki hamlawar naye input banate hain aur aap unki kalpna ka andaza laga rahe ho.

**Type, format, lambai aur range** jaancho — aur dhyan do ki lambai ki seema suraksha ka niyantran hai, sirf safai nahi: 50 akshar wale field mein 10 MB ki string denial-of-service hai.

**Ye kahan hona chahiye:** server par, hamesha. Client-side validation user experience ke liye hai.

**Jo hisse parameterise nahi ho sakte** — table ke naam, column ke naam, sort ki disha, LIMIT — unhe **allow-list** se aana chahiye, string jodne se kabhi nahi. \`ORDER BY \${req.query.sort}\` kuch extra kadamon ke saath injection hi hai.`,
      codeExample: `import { z } from 'zod';

// Allow-list the shape, the type, the length and the range
const Query = z.object({
  search: z.string().max(100).optional(),        // length is a security control
  page: z.coerce.number().int().min(1).max(1000).default(1),
  sort: z.enum(['created_at', 'total', 'status']).default('created_at'),
  //     ^ ORDER BY cannot be parameterised, so it MUST be an allow-list
});

app.get('/orders', async (req, res) => {
  const parsed = Query.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues });
  const { search, page, sort } = parsed.data;

  // Values are parameters; the sort column came from a closed set
  const rows = await db.query(
    \`SELECT * FROM orders WHERE title ILIKE $1 ORDER BY \${sort} LIMIT 20 OFFSET $2\`,
    [\`%\${search ?? ''}%\`, (page - 1) * 20],
  );
  res.json({ orders: rows });
});

// NoSQL: prove it is a string before it can become an operator
const Login = z.object({ email: z.string().email(), password: z.string().min(1) });`,
      commonMistakes: [
        'Building queries by concatenating strings, including the "just this once, it is only an internal tool" case.',
        'Passing an unvalidated object straight into a Mongo query, letting the client inject operators.',
        'Interpolating a sort column or table name — those cannot be parameterised and need an allow-list.',
        'Using a blocklist of dangerous strings, which is always incomplete.',
      ],
      interviewQuestions: [
        'Why do parameterised queries prevent SQL injection? What is actually happening?',
        'What is NoSQL injection and how does it work?',
        'Difference between stored, reflected and DOM-based XSS?',
        'Why is an allow-list better than a blocklist?',
      ],
      practiceQuestions: [
        'Find every place your app interpolates into a query and fix them.',
        'Add length limits to every string field and explain why that is a security control.',
      ],
      tags: ['security', 'injection', 'validation', 'must-know'],
    },

    {
      slug: 'sec-rate-limiting-and-abuse',
      title: 'Rate limiting and abuse prevention',
      difficulty: 'MEDIUM',
      summary: 'Without limits, one script can guess every password, exhaust your quota or run up your bill. Limit by cost, not just by count.',
      summaryHi: 'Bina seema ke ek script har password aazma sakti hai, aapka quota khatam kar sakti hai ya bill chadha sakti hai. Ginti se nahi, keemat se seema lagao.',
      content: `**What rate limiting actually protects against**

- **Credential stuffing** — leaked passwords tried against your login, thousands per minute
- **Scraping** — someone downloading your entire dataset one page at a time
- **Resource exhaustion** — expensive endpoints called in a loop
- **Cost attacks** — every request that hits a paid third-party API is money someone else is spending for you

**Limit by cost, not just by count**

A login attempt, a search and a report generation are not equal. Give expensive endpoints their own, tighter budget. A single limit across everything is either too loose for the expensive routes or too tight for the cheap ones.

**Key by the right thing**

- **Per IP** — the default, but shared IPs mean an office or a mobile carrier gets limited together
- **Per user** — better once authenticated
- **Per IP + identifier** on login — this is important: keying login attempts *only* by IP lets a distributed attack through, and keying *only* by account lets anyone lock out a victim by failing their login repeatedly

**Login needs more than a rate limit**

- Progressive delays after failures
- Account lockout with care — an aggressive lockout is itself a denial-of-service against real users
- CAPTCHA after several failures rather than always
- Notify the user on login from a new device

**The three-line rule for password reset and OTP codes**

Short expiry, single use, and an attempt limit. Without the attempt limit, a six-digit code is a million guesses — which a script does in minutes. With a limit of five, it is unusable.

**Other abuse surfaces people forget**

- **Signup** — otherwise you get thousands of fake accounts
- **Email sending** — an unlimited "resend verification" is a way to make your domain a spam source
- **File upload** — size and count limits, or storage is a denial-of-service
- **WebSocket events** — HTTP rate limiters never see them, so a client can emit in a loop unless you limit separately
- **Expensive queries** — pagination limits with a hard maximum, or someone requests a million rows

**Where to enforce it**

At the edge (CDN, load balancer) for volumetric attacks, and in the application for business logic. In-process counters break the moment you run a second server — use Redis so the limit is shared.

**Return \`429\` with a \`Retry-After\` header.** A well-behaved client will back off; a badly-behaved one will not, but now your logs distinguish the two.`,
      contentHi: `**Rate limiting sach mein kisse bachata hai**

- **Credential stuffing** — leak hue passwords aapke login par aazmaye jate hain, hazaaron per minute
- **Scraping** — koi aapka poora data ek-ek page karke utar leta hai
- **Resource exhaustion** — mehnge endpoints loop mein bulaye jate hain
- **Cost attacks** — har wo request jo paid third-party API par jati hai, wo paisa hai jo koi aur aapse kharch karwa raha hai

**Ginti se nahi, keemat se seema lagao**

Ek login koshish, ek search aur ek report banana barabar nahi hain. Mehnge endpoints ko unka apna, sakht budget do. Sab par ek hi seema ya to mehnge routes ke liye dheeli hogi ya saste ke liye sakht.

**Sahi cheez se key banao**

- **Per IP** — default, par saanjhe IP ka matlab hai ki poora office ya mobile carrier ek saath seemit ho jata hai
- **Per user** — login ke baad behtar
- Login par **per IP + identifier** — ye zaroori hai: login koshishon ko *sirf* IP se key karo to bikhra hua hamla nikal jata hai, aur *sirf* account se key karo to koi bhi kisi ka login baar-baar fail karke use lock kar sakta hai

**Login ko rate limit se zyada chahiye**

- Fail hone par badhti hui deri
- Account lockout sambhal kar — sakht lockout khud asli users ke liye denial-of-service hai
- Kuch failures ke baad CAPTCHA, hamesha nahi
- Naye device se login par user ko batao

**Password reset aur OTP codes ke liye teen-line ka niyam**

Jaldi expire, ek baar istemal, aur koshishon ki seema. Koshish ki seema ke bina chhah ank ka code das lakh andaze hai — jo script minaton mein kar leti hai. Paanch ki seema ke saath wo bekaar hai.

**Aur bhi jagah jahan durupyog hota hai aur log bhool jate hain**

- **Signup** — warna hazaaron nakli accounts
- **Email bhejna** — bina seema ka "verification dobara bhejo" aapke domain ko spam ka source bana deta hai
- **File upload** — size aur ginti ki seema, warna storage hi denial-of-service hai
- **WebSocket events** — HTTP rate limiters unhe dekhte hi nahi, isliye client loop mein emit kar sakta hai jab tak alag se seema na ho
- **Mehngi queries** — pagination ki seema sakht maximum ke saath, warna koi das lakh rows maang lega

**Lagu kahan karein**

Bade paimane ke hamlon ke liye kinare par (CDN, load balancer), aur business logic ke liye application mein. Process ke andar ki ginti doosra server chalate hi toot jati hai — Redis use karo taaki seema saanjhi ho.

**\`429\` aur \`Retry-After\` header lautao.** Sharif client ruk jayega; badtameez nahi rukega, par ab aapke logs dono mein farak kar sakte hain.`,
      codeExample: `import rateLimit from 'express-rate-limit';

// Cheap endpoints: a generous shared budget
const general = rateLimit({ windowMs: 60_000, limit: 100 });

// Login: tight, and keyed by IP *and* account.
// IP alone lets a distributed attack through.
// Account alone lets anyone lock out a victim.
const login = rateLimit({
  windowMs: 15 * 60_000,
  limit: 5,
  keyGenerator: (req) => \`\${req.ip}:\${String(req.body?.email ?? '').toLowerCase()}\`,
  skipSuccessfulRequests: true,          // only failures count
  message: { error: { code: 'RATE_LIMITED', message: 'Too many attempts' } },
});

app.use('/api', general);
app.post('/api/auth/login', login, loginHandler);

// A six-digit code is a million guesses without an attempt limit.
// With one, it is unusable.
const MAX_ATTEMPTS = 5;
const OTP_TTL_MINUTES = 10;`,
      commonMistakes: [
        'One global limit for every endpoint, which is too loose for expensive routes and too tight for cheap ones.',
        'Keying login limits only by account, which lets anyone lock a victim out at will.',
        'OTP codes with expiry but no attempt limit — six digits is a million guesses a script makes in minutes.',
        'In-process counters, which stop working correctly the moment there are two servers.',
      ],
      interviewQuestions: [
        'How would you rate limit a login endpoint, and what do you key it by?',
        'Why is aggressive account lockout itself a denial-of-service?',
        'What three properties must a one-time code have?',
        'Why does an in-memory rate limiter break when you scale horizontally?',
      ],
      practiceQuestions: [
        'Add tiered rate limits to an API and verify the 429 and Retry-After response.',
        'List every endpoint that costs you money per call and give each its own budget.',
      ],
      tags: ['security', 'rate-limiting', 'abuse', 'must-know'],
    },

    {
      slug: 'sec-dependencies-and-supply-chain',
      title: 'Dependencies and supply chain',
      difficulty: 'MEDIUM',
      summary: 'Most of your code is other people\'s code. One compromised package runs with the same privileges as your application.',
      summaryHi: 'Aapka zyadatar code doosron ka likha hai. Ek compromise hua package aapki application jitne hi adhikaron ke saath chalta hai.',
      content: `A typical Node application has a handful of direct dependencies and hundreds of transitive ones. All of them run with your application's full privileges — your environment variables, your database connection, your filesystem.

**How supply chain attacks actually happen**

- **Compromised maintainer account** — a real, popular package gets a malicious version published
- **Typosquatting** — a package named one character away from a popular one
- **Malicious update** — a package that was fine for years is sold or handed over and turns
- **Install scripts** — \`postinstall\` runs arbitrary code at install time, on your machine and in CI

That last one is worth sitting with: \`npm install\` executes code. Your CI machine, with its deploy credentials, runs it too.

**The practical defences, in order of value**

**1. Commit your lockfile and use \`npm ci\`.** \`npm install\` can drift to newer versions; \`npm ci\` installs exactly what the lockfile says. This is the single highest-value habit here — it makes builds reproducible and stops a surprise version appearing between test and deploy.

**2. Audit in CI.** \`npm audit --audit-level=high\`, failing the build. Running it manually once means it happens once.

**3. Automate updates.** Dependabot or Renovate opening PRs, so updates arrive as small reviewable changes rather than a terrifying annual catch-up.

**4. Reduce the count.** Every dependency is trust extended to a stranger. A four-line utility is not worth a package and its transitive tree.

**5. Pin what matters, review what changes.** Especially anything touching auth, crypto or payments.

**Reading an audit report honestly**

Not every advisory matters. A prototype-pollution issue in a dev-only build tool is very different from an RCE in your HTTP framework. Ask: is it in production code? Is the vulnerable path reachable? What does exploitation require?

Blindly fixing everything leads to alert fatigue and a team that ignores the report entirely — which is worse than triaging honestly.

**Two more surfaces**

- **Frontend CDN scripts** — a script tag pointing at a third party means they can change what runs on your site at any time. Use Subresource Integrity, or self-host.
- **CI has your secrets.** Anyone who can merge a workflow file can exfiltrate them. Restrict what runs on pull requests from forks.

**The uncomfortable truth:** you cannot fully audit hundreds of transitive dependencies. The realistic goal is reducing the count, keeping them current, and limiting what a compromise reaches — which is least privilege again.`,
      contentHi: `Aam Node application mein kuch seedhi dependencies hoti hain aur sau se zyada unke andar wali. Ye sab aapki application ke poore adhikaron ke saath chalti hain — aapke environment variables, database connection, filesystem.

**Supply chain hamle sach mein kaise hote hain**

- **Maintainer ka account compromise** — asli, lokpriya package ka nuksaandeh version publish ho jata hai
- **Typosquatting** — lokpriya naam se ek akshar door ka package
- **Nuksaandeh update** — saalon se theek package bech diya ya kisi aur ko de diya jata hai aur badal jata hai
- **Install scripts** — \`postinstall\` install ke waqt koi bhi code chalata hai, aapki machine par aur CI mein bhi

Aakhri baat par ruk kar sochna chahiye: \`npm install\` code chalata hai. Aapki CI machine, apne deploy credentials ke saath, use bhi chalati hai.

**Practical bachaav, keemat ke kram mein**

**1. Lockfile commit karo aur \`npm ci\` use karo.** \`npm install\` naye versions par khisak sakta hai; \`npm ci\` bilkul wahi lagata hai jo lockfile kehti hai. Yahan ki sabse keemti aadat yahi hai — isse builds dohraye ja sakte hain aur test aur deploy ke beech koi anjaana version nahi aata.

**2. CI mein audit.** \`npm audit --audit-level=high\`, build fail karte hue. Ek baar haath se chalane ka matlab hai ye ek baar hi hua.

**3. Updates apne aap.** Dependabot ya Renovate PR kholte rahein, taaki updates chhote review layak badlav ban kar aayein, saal mein ek baar ka daravna kaam nahi.

**4. Ginti kam karo.** Har dependency kisi ajnabi par kiya gaya bharosa hai. Chaar line ki utility ke liye package aur uska poora ped laayak nahi.

**5. Jo matter kare use pin karo, jo badle use padho.** Khaaskar auth, crypto ya payments se judi har cheez.

**Audit report imaandari se padhna**

Har advisory matter nahi karti. Sirf dev mein use hote build tool ka prototype-pollution us RCE se bahut alag hai jo aapke HTTP framework mein ho. Poochho: kya ye production code mein hai? Kya wo raasta pahunch mein hai? Ise exploit karne ke liye kya chahiye?

Aankh band karke sab theek karna alert fatigue laata hai aur team report ko poori tarah nazarandaz karne lagti hai — jo imaandari se chhantne se bura hai.

**Do aur jagah**

- **Frontend CDN scripts** — third party ki taraf ishara karta script tag matlab wo kabhi bhi badal sakte hain ki aapki site par kya chalta hai. Subresource Integrity use karo, ya khud host karo.
- **CI ke paas aapke secrets hain.** Jo koi workflow file merge kar sakta hai wo unhe nikaal sakta hai. Fork se aayi pull requests par kya chalta hai use seemit karo.

**Asahaj sach:** aap sau se zyada andar wali dependencies ka poora audit nahi kar sakte. Vaastavik lakshya hai ginti kam karna, unhe naya rakhna, aur compromise ki pahunch seemit karna — yani phir se least privilege.`,
      codeExample: `# In CI: install exactly what the lockfile says, and fail on real issues
npm ci                                  # not "npm install"
npm audit --audit-level=high

# Install scripts run arbitrary code. For untrusted or one-off packages:
npm install --ignore-scripts

# Frontend: a third-party script can change at any time.
# Subresource Integrity pins exactly what may run.
# <script src="https://cdn.example.com/lib.js"
#         integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+..."
#         crossorigin="anonymous"></script>

# .github/dependabot.yml — small reviewable PRs instead of an annual scramble
# version: 2
# updates:
#   - package-ecosystem: npm
#     directory: "/"
#     schedule: { interval: weekly }`,
      commonMistakes: [
        'Using `npm install` in CI instead of `npm ci`, so the build can quietly drift to a different version than you tested.',
        'Running `npm audit` manually once rather than failing the build on high-severity findings.',
        'Adding a dependency for a few lines of code, extending trust to a stranger and their whole dependency tree.',
        'Loading third-party scripts from a CDN with no Subresource Integrity, letting them change what runs on your site.',
      ],
      interviewQuestions: [
        'What is a supply chain attack and how would one reach your app?',
        'Difference between `npm install` and `npm ci`, and why does it matter in CI?',
        'How do you triage an audit report rather than fixing everything blindly?',
        'What risk does a `postinstall` script carry?',
      ],
      practiceQuestions: [
        'Run `npm audit` and triage each finding: production or dev, reachable or not.',
        'Find a dependency you could replace with a few lines of your own code.',
      ],
      tags: ['security', 'dependencies', 'supply-chain'],
    },

    {
      slug: 'sec-file-uploads',
      title: 'File uploads done safely',
      difficulty: 'MEDIUM',
      summary: 'A user handing your server a file is one of the most dangerous things you can allow. Never trust the name, the extension or the declared type.',
      summaryHi: 'User ka aapke server ko file dena sabse khatarnaak cheezon mein se ek hai jo aap allow kar sakte ho. Naam, extension ya bataye gaye type par kabhi bharosa nahi.',
      content: `Uploads combine several risks at once: untrusted content, untrusted filenames, storage cost and content served back to other users.

**Never trust three things**

1. **The filename.** \`../../etc/passwd\` is a path traversal attempt. \`invoice.pdf.exe\` is not a PDF. **Generate your own filename** — a UUID — and store the original only as a display label.
2. **The extension.** It describes nothing; it is part of the name the user chose.
3. **The declared \`Content-Type\`.** The client sets it, so the client can lie.

**Check the actual bytes.** Real file types have magic numbers at the start — PNG begins with a known signature, PDF with \`%PDF\`. Verify against an allow-list of types you accept, and reject anything else.

**Limits are a security control**

- **Maximum size**, enforced by the parser — not after the whole file is in memory
- **Maximum count** per request and per user per hour
- Otherwise upload is a denial-of-service: storage fills, or memory does

**The serving side is where the real damage happens**

An uploaded HTML or SVG file served from your own domain executes **as your site**. It can read cookies for that domain and act as the user. An SVG is XML and can contain a script tag — which is why "it is just an image" is wrong.

Two defences, and use both:

- **Serve user content from a different domain**, so even if something executes it is not on your origin
- **Set \`Content-Disposition: attachment\`** and \`X-Content-Type-Options: nosniff\` so the browser downloads rather than renders

**Do not put uploads on the application server's disk.** They vanish on redeploy, they are not shared between instances, and they turn a stateless server into a stateful one. Use object storage.

**Pre-signed URLs** are the pattern worth knowing: the client asks your API for permission, your API returns a short-lived URL that allows exactly one upload, and the file goes **directly** to storage. The bytes never touch your server, so bandwidth and memory are not your problem — but you still control who may upload and what constraints apply.

**Two more**

- **Scan for malware** if files are shared between users. You are otherwise a distribution mechanism.
- **Strip EXIF metadata** from images. Photos routinely contain GPS coordinates, and publishing a user's home location because they uploaded a profile picture is a serious privacy failure.`,
      contentHi: `Uploads ek saath kai khatre jodte hain: anjaana content, anjaane filenames, storage ka kharch, aur wo content jo doosre users ko parosa jata hai.

**Teen cheezon par kabhi bharosa nahi**

1. **Filename.** \`../../etc/passwd\` path traversal ki koshish hai. \`invoice.pdf.exe\` PDF nahi hai. **Apna filename banao** — ek UUID — aur asli naam sirf dikhane ke label ki tarah rakho.
2. **Extension.** Wo kuch batata nahi; wo us naam ka hissa hai jo user ne chuna.
3. **Bataya gaya \`Content-Type\`.** Ise client set karta hai, isliye client jhoot bol sakta hai.

**Asli bytes jaancho.** Asli file types ki shuruaat mein magic numbers hote hain — PNG ek jaani-pehchani signature se shuru hota hai, PDF \`%PDF\` se. Jin types ko aap sweekar karte ho unki allow-list se milao, aur baaki sab mana karo.

**Seemayein suraksha ka niyantran hain**

- **Adhiktam size**, parser mein lagu — poori file memory mein aane ke baad nahi
- Har request aur har user per ghanta **adhiktam ginti**
- Warna upload hi denial-of-service hai: ya storage bhar jata hai, ya memory

**Asli nuksaan parosne wali taraf hota hai**

Aapke apne domain se parosi gayi upload ki hui HTML ya SVG file **aapki site ki tarah** chalti hai. Wo us domain ki cookies padh sakti hai aur user ban kar kaam kar sakti hai. SVG XML hai aur usme script tag ho sakta hai — isiliye "ye to bas image hai" galat hai.

Do bachaav, aur dono use karo:

- **User content alag domain se paroso**, taaki kuch chal bhi jaye to wo aapke origin par na ho
- **\`Content-Disposition: attachment\`** aur \`X-Content-Type-Options: nosniff\` set karo taaki browser render ki jagah download kare

**Uploads application server ki disk par mat rakho.** Wo redeploy par gayab ho jati hain, instances ke beech saanjhi nahi hoti, aur stateless server ko stateful bana deti hain. Object storage use karo.

**Pre-signed URLs** jaanne layak pattern hai: client aapki API se ijazat maangta hai, aapki API ek chhoti umar ka URL deti hai jo theek ek upload allow karta hai, aur file **seedha** storage mein jati hai. Bytes aapke server ko chhute hi nahi, isliye bandwidth aur memory aapki samasya nahi — par kaun upload kar sakta hai aur kya shartein hain, wo ab bhi aapke haath mein hai.

**Do aur**

- Files users ke beech saanjhi hoti hain to **malware scan** karo. Warna aap khud baantne ka zariya ho.
- Images se **EXIF metadata hatao**. Photos mein aksar GPS coordinates hote hain, aur profile picture upload karne par kisi ke ghar ka pata prakashit kar dena gambhir privacy nakaami hai.`,
      codeExample: `import multer from 'multer';
import { fileTypeFromBuffer } from 'file-type';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },   // enforced by the parser
});

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp']);

app.post('/upload', requireAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: { message: 'No file' } });

  // The declared mimetype is client-controlled. Check the actual bytes.
  const detected = await fileTypeFromBuffer(req.file.buffer);
  if (!detected || !ALLOWED.has(detected.mime)) {
    return res.status(400).json({ error: { message: 'Unsupported file type' } });
  }

  // Never reuse the user's filename — it may be a path traversal attempt
  const key = \`uploads/\${req.user.id}/\${crypto.randomUUID()}.\${detected.ext}\`;
  await storage.put(key, await stripExif(req.file.buffer), {
    contentType: detected.mime,
    contentDisposition: 'attachment',      // download, do not render
  });

  res.status(201).json({ key, originalName: req.file.originalname });  // label only
});`,
      commonMistakes: [
        'Trusting the declared Content-Type or the file extension, both of which the client controls.',
        'Using the user-supplied filename on disk, enabling path traversal.',
        'Serving user uploads from your own domain, so an uploaded SVG or HTML file executes as your site.',
        'Storing uploads on the application server, which loses them on redeploy and breaks with a second instance.',
      ],
      interviewQuestions: [
        'Why can you not trust the Content-Type header on an upload?',
        'Why is serving user uploads from your own domain dangerous?',
        'What are pre-signed URLs and what problem do they solve?',
        'Why strip EXIF data from uploaded images?',
      ],
      practiceQuestions: [
        'Add magic-number validation to an upload endpoint and try to defeat it with a renamed file.',
        'Switch an upload flow to pre-signed URLs so bytes never touch your API.',
      ],
      tags: ['security', 'uploads', 'files'],
    },

    {
      slug: 'sec-privacy-and-pii',
      title: 'Personal data, privacy and compliance',
      difficulty: 'HARD',
      summary: 'The data you never collected cannot leak. Know what you hold, why, for how long, and what you must do when someone asks for it back.',
      summaryHi: 'Jo data aapne jama hi nahi kiya wo leak nahi ho sakta. Jaano ki aap kya rakhte ho, kyun, kab tak, aur koi wapas maange to kya karna hoga.',
      content: `**PII** — personally identifiable information — is anything that identifies a person: name, email, phone, address, IP address, device id, and combinations that identify someone even when each part does not.

**The most effective control is not collecting it**

Every field you do not store is a field that cannot leak, cannot be subpoenaed, and does not need to be deleted on request. Before adding a field, ask what it is *for*. "It might be useful later" is how companies end up holding data they cannot justify.

Do you need date of birth, or just "over 18"? Full address, or country? Store the answer, not the raw data.

**Data minimisation, in three habits**

- Collect only what a feature needs today
- **Set retention.** Data with no deletion date is kept forever by default, and forever is a long time to be liable for it.
- Anonymise or aggregate analytics rather than keeping raw events with user ids

**Encryption, in both states**

- **In transit** — TLS everywhere, including between your own services
- **At rest** — database and backup encryption. Note this protects against a stolen disk or an exposed backup, not against a compromised application, because your app decrypts as it reads.

For genuinely sensitive fields, encrypt at the **application** level so the value is unreadable even to someone with database access.

**Never log PII.** Logs are retained for months, shipped to third parties, and read by people who do not need them. Redact at the logger, because someone will forget at a call site.

**What regulations actually require, in plain terms**

Whatever the jurisdiction, the practical obligations are similar:

- **Consent** — for non-essential cookies and marketing, before you set them, not after
- **Access** — a person can ask what you hold about them
- **Deletion** — they can ask you to remove it
- **Portability** — they can ask for it in a usable format
- **Breach notification** — often within 72 hours

**Deletion is harder than it looks.** Data is in your primary database, your read replicas, your backups, your logs, your analytics platform, your email provider and your support tool. A delete endpoint that only clears one table is not deletion.

Design for it early: know where personal data lives, and prefer referencing a single user record over copying name and email into every table.

**The tension with immutable records:** an invoice must record the name and address at the time of sale, and financial records often must be retained by law. That is a legitimate reason to keep data after a deletion request — but the reason must be a real legal obligation, not convenience.

**Children's data and payment data have stricter rules.** For payments, the strong default is never to store card details at all — use a payment provider's tokens, so the sensitive data is never yours to protect.`,
      contentHi: `**PII** — personally identifiable information — wo har cheez hai jo kisi insaan ki pehchan karti hai: naam, email, phone, pata, IP address, device id, aur wo mel jo alag-alag pehchan na karte hue bhi saath mein kar dete hain.

**Sabse asardaar bachaav use jama hi na karna hai**

Har wo field jo aap nahi rakhte, leak nahi ho sakti, adaalat maang nahi sakti, aur maange jaane par mitani nahi padti. Field jodne se pehle poochho ki wo *kis liye* hai. "Aage kaam aa sakti hai" wahi tareeka hai jisse companies ke paas wo data reh jata hai jiska wo jawab nahi de sakti.

Aapko janm tareekh chahiye, ya bas "18 se upar"? Poora pata, ya desh? Jawab rakho, kaccha data nahi.

**Data minimisation, teen aadaton mein**

- Sirf wahi jama karo jo aaj kisi feature ko chahiye
- **Retention set karo.** Jis data ki mitane ki tareekh nahi, wo default se hamesha rehta hai, aur hamesha uski zimmedari uthana lamba samay hai.
- Analytics ko anonymise ya jodkar rakho, user id ke saath kacche events nahi

**Encryption, dono haalaton mein**

- **Chalte hue** — har jagah TLS, apni hi services ke beech bhi
- **Rakhe hue** — database aur backup encryption. Dhyan do ye chori hui disk ya khule backup se bachata hai, compromise hui application se nahi, kyunki aapki app padhte waqt khud decrypt karti hai.

Sach mein sanvedansheel fields ke liye **application** level par encrypt karo, taaki database tak pahunch wale ko bhi value na dikhe.

**PII kabhi log mat karo.** Logs mahinon rakhe jate hain, third parties ko jate hain, aur unhe wo log padhte hain jinhe zaroorat nahi. Redact logger par karo, kyunki koi na koi call site par bhool jayega.

**Kanoon sach mein kya maangte hain, saade shabdon mein**

Kshetra chahe koi ho, practical zimmedariyan milti-julti hain:

- **Sehmati** — gair-zaroori cookies aur marketing ke liye, lagane se pehle, baad mein nahi
- **Pahunch** — insaan poochh sakta hai ki aap uske baare mein kya rakhte ho
- **Mitana** — wo hataane ko keh sakta hai
- **Portability** — wo use kaam ke format mein maang sakta hai
- **Breach ki soochna** — aksar 72 ghante ke andar

**Mitana dikhne se mushkil hai.** Data aapke primary database, read replicas, backups, logs, analytics platform, email provider aur support tool mein hai. Aisa delete endpoint jo sirf ek table saaf kare, mitana nahi hai.

Iske liye jaldi design karo: jaano nijee data kahan-kahan hai, aur har table mein naam-email copy karne ki jagah ek user record ko reference karna behtar hai.

**Na badalne wale records ke saath khinchtaan:** invoice mein bikri ke waqt ka naam aur pata hona chahiye, aur financial records aksar kanoonan rakhne padte hain. Mitane ki maang ke baad bhi data rakhne ki ye jayaz wajah hai — par wajah asli kanooni zimmedari honi chahiye, suvidha nahi.

**Bachchon ka data aur payment data ke niyam zyada sakht hain.** Payments ke liye mazboot default yahi hai ki card ki tafseel rakhi hi na jaye — payment provider ke tokens use karo, taaki sanvedansheel data kabhi aapka bachane ka kaam bane hi nahi.`,
      codeExample: `// The most effective control: store the answer, not the raw data
// ❌ dateOfBirth: Date       — now you hold sensitive data forever
// ✅ isOver18: boolean       — answers the question, leaks nothing

// Redact at the logger, because someone will forget at a call site
const logger = pino({
  redact: {
    paths: ['*.email', '*.phone', '*.password', '*.address', 'req.headers.authorization'],
    censor: '[redacted]',
  },
});

// Deletion is not one DELETE. Enumerate every place the data lives.
async function deleteUserData(userId: string) {
  await prisma.$transaction([
    prisma.session.deleteMany({ where: { userId } }),
    prisma.note.deleteMany({ where: { userId } }),
    // Invoices are retained by legal obligation — anonymise instead of deleting
    prisma.invoice.updateMany({
      where: { userId },
      data: { customerName: '[deleted]', customerEmail: null },
    }),
    prisma.user.delete({ where: { id: userId } }),
  ]);

  await analytics.deleteUser(userId);      // third parties hold it too
  await emailProvider.deleteContact(userId);
  // and: backups expire on their own retention schedule — know what that is
}`,
      commonMistakes: [
        'Collecting data because it might be useful later, which creates a liability with no corresponding benefit.',
        'A delete endpoint that clears one table while the data remains in logs, analytics and the email provider.',
        'Logging emails, phone numbers or tokens, which then sit in a third-party service for months.',
        'Storing card details rather than using a payment provider\'s tokens.',
      ],
      interviewQuestions: [
        'What is data minimisation and why is it the strongest privacy control?',
        'Why is "delete my account" harder than a DELETE statement?',
        'What does encryption at rest protect against, and what does it not?',
        'When is it legitimate to keep data after a deletion request?',
      ],
      practiceQuestions: [
        'Map every place personal data lives in your app, including third parties.',
        'Find a field you could replace with a derived answer rather than raw data.',
      ],
      tags: ['security', 'privacy', 'compliance', 'must-know'],
    },
  ],
};
