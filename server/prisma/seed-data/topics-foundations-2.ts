import type { SeedTopic } from './topics-shared';

/**
 * Beginner entry points for authentication and system design.
 *
 * Both categories previously opened on a MEDIUM topic — JWT-vs-sessions and
 * caching strategies respectively — which assumes the reader already knows what
 * a session is and what a cache is for. These are the missing first steps.
 *
 * The system design set ends on a worked example rather than another list of
 * concepts, because system design interviews test whether you can *run the
 * conversation*, and that is a procedure rather than a body of facts.
 */

/* ══════════════════════════════ Auth basics ═══════════════════════════════ */

export const AUTH_BASICS: SeedTopic[] = [
  {
    slug: 'auth-what-is-authentication',
    title: 'Authentication vs authorisation',
    difficulty: 'EASY',
    summary: 'Authentication is proving who you are. Authorisation is what you are allowed to do. They are separate steps, and confusing them is a security bug.',
    summaryHi: 'Authentication yani sabit karna ki aap kaun ho. Authorisation yani aap kya kar sakte ho. Ye alag kadam hain, aur inhe ghula dena ek security bug hai.',
    content: `Two words that sound alike and mean different things:

- **Authentication (authN)** — *"who are you?"* You show your passport at the airport.
- **Authorisation (authZ)** — *"what may you do?"* Your boarding pass says seat 14C, not the cockpit.

Proving your identity does **not** grant you permission. Every request needs both checks, and skipping the second is one of the most common real vulnerabilities in production APIs.

**How login actually works, step by step**

1. User submits email and password
2. Server looks up the user by email
3. Server **hashes** the submitted password and compares it with the stored hash — it never stores or compares the plain password
4. If they match, the server issues **proof** (a session id or a token)
5. The client sends that proof with every later request
6. The server checks the proof and knows who is asking

Step 3 is the one beginners get wrong: **you never store the actual password.** Not encrypted, not encoded — hashed, with a slow algorithm designed for the job.

**Why every request must carry proof**

HTTP is **stateless**. The server does not remember your previous request. Each one arrives with no memory of what came before, so each one must prove itself independently.

**The error-message rule**

When login fails, always say *"invalid email or password"*. Never *"no user with that email"*.

The specific message tells an attacker which addresses are registered, which is called **account enumeration** — and it turns a list of leaked emails into a list of confirmed accounts to attack.

**The three factors**

- Something you **know** — password
- Something you **have** — phone, hardware key
- Something you **are** — fingerprint, face

Using two of them is two-factor authentication. Two passwords is not 2FA — it is the same factor twice, and one leak exposes both.`,
    contentHi: `Do shabd jo ek jaise sunai dete hain aur matlab alag hai:

- **Authentication (authN)** — *"aap kaun ho?"* Airport par passport dikhana.
- **Authorisation (authZ)** — *"aap kya kar sakte ho?"* Boarding pass par seat 14C likha hai, cockpit nahi.

Pehchan sabit karna ijazat **nahi** deta. Har request mein dono jaanch chahiye, aur doosri ko chhodna production APIs ki sabse aam asli kamzoriyon mein se ek hai.

**Login sach mein kaise chalta hai, kadam-dar-kadam**

1. User email aur password bhejta hai
2. Server email se user dhoondhta hai
3. Server bheje gaye password ko **hash** karke jama hash se milata hai — wo plain password na jama karta hai na compare
4. Mel khaye to server **saboot** deta hai (session id ya token)
5. Client har agli request ke saath wo saboot bhejta hai
6. Server saboot jaanchta hai aur jaan leta hai ki kaun poochh raha hai

Teesra kadam wahi hai jise shuruaat mein log galat karte hain: **aap asli password kabhi jama nahi karte.** Na encrypted, na encoded — hashed, us kaam ke liye bane dheeme algorithm se.

**Har request ko saboot kyun le kar chalna padta hai**

HTTP **stateless** hai. Server aapki pichhli request yaad nahi rakhta. Har ek bina kisi yaadasht ke aati hai, isliye har ek ko khud sabit karna padta hai.

**Error message ka niyam**

Login fail ho to hamesha kaho *"email ya password galat hai"*. Kabhi nahi *"is email ka koi user nahi"*.

Khaas message hamlawar ko bata deta hai ki kaunse pate registered hain, jise **account enumeration** kehte hain — aur isse leak hui emails ki list confirmed accounts ki list ban jati hai.

**Teen factor**

- Jo aap **jaante** ho — password
- Jo aapke **paas** hai — phone, hardware key
- Jo aap **ho** — fingerprint, chehra

Inme se do use karna two-factor authentication hai. Do password 2FA nahi hai — wahi factor do baar hai, aur ek leak dono khol deta hai.`,
    codeExample: `// Login: authentication only — this proves identity, nothing more
const user = await db.user.findUnique({ where: { email } });
const ok = user && await bcrypt.compare(password, user.passwordHash);

if (!ok) {
  // Same message either way — never reveal which half was wrong
  return res.status(401).json({ error: { message: 'Invalid email or password' } });
}
const token = signToken({ id: user.id, role: user.role });

// Later request: authenticated, but STILL not authorised for this order
app.delete('/orders/:id', requireAuth, async (req, res) => {
  const order = await db.order.findUnique({ where: { id: req.params.id } });
  if (!order) return res.status(404).json({ error: { message: 'Not found' } });

  if (order.userId !== req.user.id && req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: { message: 'Not allowed' } });
  }
  await db.order.delete({ where: { id: order.id } });
  res.status(204).send();
});`,
    commonMistakes: [
      'Treating a valid token as permission. Identity and authorisation are separate checks.',
      'Saying "user not found" on login, which confirms to an attacker which emails are registered.',
      'Storing passwords encrypted rather than hashed — encryption is reversible, which is exactly what you do not want.',
      'Calling two passwords two-factor authentication. It is the same factor twice.',
    ],
    interviewQuestions: [
      'Difference between authentication and authorisation?',
      'Why should a failed login not say which field was wrong?',
      'Walk me through what happens when a user logs in.',
      'Why does every request need to carry proof of identity?',
    ],
    practiceQuestions: [
      'Add an ownership check to an endpoint that currently only checks the token.',
      'List the authN and authZ steps for "delete a comment on someone else\'s post".',
    ],
    tags: ['auth', 'security', 'basics', 'must-know'],
  },

  {
    slug: 'auth-cookies-and-sessions',
    title: 'Cookies and sessions',
    difficulty: 'EASY',
    summary: 'A cookie is a small value the browser stores and sends back automatically. A session is the server-side record it points at.',
    summaryHi: 'Cookie ek chhoti value hai jise browser jama karta hai aur khud wapas bhejta hai. Session wo server par rakha record hai jis par wo ishara karti hai.',
    content: `**A cookie** is a small piece of data the server asks the browser to store. From then on, the browser attaches it to **every** request to that site — automatically, without any code.

That automatic attachment is a cookie's greatest strength and the source of its main weakness.

**A session** is the server-side half. The cookie holds a meaningless random id; the server keeps a record of what that id means:

\`\`\`
Browser cookie:  sid=8f3a2b91...
Server memory:   8f3a2b91 → { userId: 7, loggedInAt: ... }
\`\`\`

The cookie contains no personal data — just a pointer. Anyone stealing it gets access, but learns nothing by reading it.

**Why this matters:** because the record lives on the server, you can **delete it**. That is logout. It is instant and complete, which is exactly what a token cannot offer.

**The cookie flags that matter**

| Flag | Does |
|---|---|
| \`httpOnly\` | JavaScript cannot read it — this is what defeats XSS token theft |
| \`secure\` | HTTPS only, never sent over plain HTTP |
| \`sameSite=Lax\` | not sent on cross-site POSTs — this is the CSRF defence |
| \`maxAge\` | when it expires |

**Set all four.** A cookie without \`httpOnly\` can be read by any script that gets onto your page. A cookie without \`sameSite\` is a CSRF waiting to happen.

**The trade-off with tokens**

- **Session** — server remembers, so logout works instantly. Costs storage and a lookup per request.
- **Token (JWT)** — server remembers nothing, so verification is fast and scales trivially. But you cannot un-issue it.

Neither is "better". Sessions when control matters, tokens when scale does, and in practice most real apps use both: a short access token for speed, and a stored refresh token so revocation is still possible.

**Where sessions must live once you have more than one server**

Not in process memory. Two servers means two memories, and a user who logs in on server A is a stranger to server B. Put sessions in Redis or the database — this is the same "stateless servers" rule that horizontal scaling depends on everywhere else.`,
    contentHi: `**Cookie** wo chhota data hai jise server browser se jama karne ko kehta hai. Uske baad browser use us site ki **har** request ke saath khud laga deta hai — bina kisi code ke.

Wahi khud lag jana cookie ki sabse badi taakat hai aur uski mukhya kamzori ki jad bhi.

**Session** server wala aadha hissa hai. Cookie mein bemaani random id hoti hai; server rakhta hai ki us id ka matlab kya hai:

\`\`\`
Browser cookie:  sid=8f3a2b91...
Server memory:   8f3a2b91 → { userId: 7, loggedInAt: ... }
\`\`\`

Cookie mein koi nijee jaankari nahi — bas ek ishara. Chura lene wale ko access mil jata hai, par padh kar kuch pata nahi chalta.

**Ye kyun matter karta hai:** record server par hai, isliye aap use **mita sakte ho**. Wahi logout hai. Turant aur poora, aur token yahi nahi de sakta.

**Cookie ke wo flags jo matter karte hain**

| Flag | Kya karta hai |
|---|---|
| \`httpOnly\` | JavaScript ise padh nahi sakta — XSS se token churana isi se rukta hai |
| \`secure\` | sirf HTTPS, plain HTTP par kabhi nahi |
| \`sameSite=Lax\` | cross-site POST par nahi jati — yahi CSRF ka bachaav hai |
| \`maxAge\` | kab khatam hogi |

**Chaaron lagao.** Bina \`httpOnly\` wali cookie ko aapke page par pahunchi koi bhi script padh sakti hai. Bina \`sameSite\` wali cookie CSRF ka intezaar hai.

**Token ke saath sauda**

- **Session** — server yaad rakhta hai, isliye logout turant chalta hai. Keemat: storage aur har request par ek lookup.
- **Token (JWT)** — server kuch yaad nahi rakhta, isliye jaanch tez hai aur scale aasan. Par use wapas nahi liya ja sakta.

Koi "behtar" nahi hai. Kaabu chahiye to session, scale chahiye to token, aur asal mein zyadatar apps dono use karte hain: raftaar ke liye chhota access token, aur jama kiya refresh token taaki wapas lena mumkin rahe.

**Ek se zyada server hone par sessions kahan rehni chahiye**

Process memory mein nahi. Do server matlab do yaadasht, aur jo user server A par login hua wo server B ke liye ajnabi hai. Sessions Redis ya database mein rakho — yahi "stateless servers" wala niyam hai jis par horizontal scaling har jagah tiki hai.`,
    codeExample: `// Setting a session cookie — all four flags matter
res.cookie('sid', sessionId, {
  httpOnly: true,                        // JavaScript cannot read it → blocks XSS theft
  secure: process.env.NODE_ENV === 'production',   // HTTPS only
  sameSite: 'lax',                       // not sent on cross-site POSTs → blocks CSRF
  maxAge: 7 * 24 * 60 * 60 * 1000,       // 7 days
});

// Logout is a real deletion, which is the whole advantage over a token
await redis.del(\`session:\${sessionId}\`);
res.clearCookie('sid');

// Reading it back on the next request — the browser sent it automatically
const session = await redis.get(\`session:\${req.cookies.sid}\`);
if (!session) return res.status(401).json({ error: { message: 'Session expired' } });`,
    commonMistakes: [
      'Omitting httpOnly, so any script injected into the page can read the session cookie.',
      'Storing sessions in process memory, which breaks the moment you run a second server.',
      'Putting user data in the cookie itself instead of a pointer — cookies are sent on every request and are visible to the user.',
      'Forgetting sameSite, leaving the automatic-attachment behaviour exploitable as CSRF.',
    ],
    interviewQuestions: [
      'What does the httpOnly flag protect against?',
      'Why can you log out a session instantly but not a JWT?',
      'What breaks if sessions live in process memory and you add a second server?',
      'What does sameSite do?',
    ],
    practiceQuestions: [
      'Set a session cookie with all four flags and explain what each one prevents.',
      'Move an in-memory session store to Redis and explain why it was necessary.',
    ],
    tags: ['auth', 'cookies', 'sessions', 'basics', 'must-know'],
  },

  {
    slug: 'auth-oauth-and-social-login',
    title: 'OAuth and "Sign in with Google"',
    difficulty: 'MEDIUM',
    summary: 'A way to let a user grant your app limited access to their account elsewhere — without ever giving you their password.',
    summaryHi: 'User aapki app ko apne kisi aur account tak seemit pahunch de sake — bina aapko apna password diye — uska tareeka.',
    content: `**The problem OAuth solves:** you want to let people sign in with Google, or read their calendar. The naive approach is to ask for their Google password. That is catastrophic — you would hold a credential that unlocks their entire Google account, and they would have no way to revoke it except changing the password.

OAuth replaces that with a **delegated, limited, revocable** grant.

**The hotel key card analogy:** the front desk does not give you the master key. You get a card that opens your room, for the length of your stay, and can be cancelled at any moment without changing any locks.

**The flow, in the order it actually happens**

1. User clicks "Sign in with Google" on your site
2. You **redirect them to Google** — they leave your site entirely
3. They log in **to Google**, on Google's page. You never see the password.
4. Google asks: *"this app wants your name and email. Allow?"*
5. Google redirects back to you with a short-lived **code**
6. Your **server** exchanges that code for an access token, using your client secret
7. You use the token to fetch their profile, and create or find a local user

Step 6 happens **server-to-server**. The client secret never reaches the browser — that is the whole reason for the two-step code exchange rather than handing over a token directly.

**OAuth vs OpenID Connect**

- **OAuth 2.0** is about **authorisation** — permission to access a resource
- **OpenID Connect** is a thin layer on top for **authentication** — proving identity, via an \`id_token\`

"Sign in with Google" is really OIDC. People say OAuth, and everyone knows what is meant.

**What you must check**

- The **state** parameter — a random value you send and verify on return. Without it, an attacker can trick a user into completing *their* login flow, which is CSRF against the login itself.
- **Never trust an email as verified** unless the provider says it is. Some providers return unverified emails, and matching an existing account on an unverified email lets someone take it over.
- **Use PKCE** for mobile and single-page apps, which cannot keep a client secret secret.

**The practical advice:** use a well-maintained library. OAuth has many small correctness requirements, each individually easy to miss, and every one of them is a real vulnerability.`,
    contentHi: `**OAuth kis samasya ka hal hai:** aap chahte ho ki log Google se sign in karein, ya aap unka calendar padh sako. Seedha tareeka hai unka Google password maangna. Wo tabaahi hai — aapke paas aisi cheez aa jati jo unka poora Google account kholti, aur wo password badle bina use wapas hi nahi le sakte the.

OAuth uski jagah ek **soumpa hua, seemit, wapas liya ja sakne wala** hak deta hai.

**Hotel key card wali upma:** front desk aapko master key nahi deta. Aapko wo card milta hai jo aapka kamra kholta hai, aapke thehrne tak, aur jise kabhi bhi bina koi taala badle radd kiya ja sakta hai.

**Flow, usi kram mein jaise hota hai**

1. User aapki site par "Sign in with Google" dabata hai
2. Aap use **Google par bhej dete ho** — wo aapki site chhod deta hai
3. Wo **Google par**, Google ke page par login karta hai. Password aap kabhi nahi dekhte.
4. Google poochhta hai: *"ye app aapka naam aur email chahti hai. Ijazat?"*
5. Google aapke paas wapas bhejta hai ek chhoti umar ke **code** ke saath
6. Aapka **server** us code ko apne client secret se access token mein badalta hai
7. Aap token se unki profile laate ho, aur local user banate ya dhoondhte ho

Chhata kadam **server-se-server** hota hai. Client secret browser tak pahunchta hi nahi — seedha token dene ki jagah do kadam ka code exchange isi liye hai.

**OAuth aur OpenID Connect**

- **OAuth 2.0** **authorisation** ke baare mein hai — kisi cheez tak pahunch ki ijazat
- **OpenID Connect** uske upar ki patli parat hai **authentication** ke liye — \`id_token\` se pehchan sabit karna

"Sign in with Google" asal mein OIDC hai. Log OAuth kehte hain, aur sabko matlab pata hota hai.

**Kya jaanchna zaroori hai**

- **state** parameter — random value jo aap bhejte ho aur wapasi par jaanchte ho. Iske bina hamlawar user se *apna* login flow poora karwa sakta hai, jo login par hi CSRF hai.
- **Email ko verified maano hi nahi** jab tak provider na kahe. Kuch providers bina verify kiya email dete hain, aur unverified email par purana account mila dena kisi ko wo account de deta hai.
- Mobile aur single-page apps ke liye **PKCE** use karo, kyunki wo client secret chhupa hi nahi sakte.

**Practical salah:** achhi tarah sambhali gayi library use karo. OAuth mein chhoti-chhoti bahut si shartein hain, har ek aasani se chhoot sakti hai, aur har ek asli kamzori hai.`,
    codeExample: `// Step 2 — send the user to the provider, with a state you can verify later
const state = crypto.randomBytes(16).toString('hex');
req.session.oauthState = state;

res.redirect(
  'https://accounts.google.com/o/oauth2/v2/auth?' +
    new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: 'https://myapp.com/auth/google/callback',
      response_type: 'code',
      scope: 'openid email profile',
      state,                                    // CSRF protection for the login flow
    }),
);

// Step 5-7 — they come back with a code
app.get('/auth/google/callback', async (req, res) => {
  if (req.query.state !== req.session.oauthState) {
    return res.status(400).json({ error: { message: 'Invalid state' } });
  }

  // Server-to-server: the client secret never touches the browser
  const tokens = await exchangeCodeForTokens(req.query.code);
  const profile = await fetchGoogleProfile(tokens.access_token);

  if (!profile.email_verified) {                // do not trust an unverified email
    return res.status(400).json({ error: { message: 'Email not verified' } });
  }
  const user = await findOrCreateUser(profile);
  res.redirect('/');
});`,
    commonMistakes: [
      'Skipping the state parameter, leaving the login flow itself open to CSRF.',
      'Matching an existing account on an unverified email, which allows account takeover.',
      'Putting the client secret in frontend code, where it is public.',
      'Hand-rolling the flow instead of using a maintained library — the correctness requirements are many and each miss is a vulnerability.',
    ],
    interviewQuestions: [
      'Why does OAuth exchange a code for a token instead of returning the token directly?',
      'What does the state parameter protect against?',
      'Difference between OAuth 2.0 and OpenID Connect?',
      'Why is PKCE needed for mobile and SPA clients?',
    ],
    practiceQuestions: [
      'Draw the OAuth flow and mark which steps happen in the browser and which server-to-server.',
      'Add "Sign in with GitHub" to an app using a library, and verify the state check is present.',
    ],
    tags: ['auth', 'oauth', 'security'],
  },

  {
    slug: 'auth-authorisation-and-roles',
    title: 'Authorisation: roles, permissions and ownership',
    difficulty: 'MEDIUM',
    summary: 'Deciding what an authenticated user may do — and checking it on the server, on every request, for every resource.',
    summaryHi: 'Authenticated user kya kar sakta hai ye tay karna — aur use server par, har request par, har resource ke liye jaanchna.',
    content: `Authentication got you a verified identity. Authorisation decides what that identity may do.

**Three models, increasing in flexibility**

**1. Ownership** — the simplest and most common: *does this thing belong to you?*

\`\`\`ts
if (order.userId !== req.user.id) return res.status(403)...
\`\`\`

Most endpoints need only this. It is also the check most often forgotten.

**2. RBAC (role-based)** — the user has a role; the role has permissions.

\`USER\`, \`EDITOR\`, \`ADMIN\`. Simple to reason about and enough for most applications.

**3. ABAC (attribute-based)** — decisions from attributes of the user, the resource and the context. *"A manager may approve expenses under ₹50,000 in their own department during business hours."* Powerful, and considerably harder to test and debug.

Start at ownership, add roles when you need them, and reach for ABAC only when roles genuinely cannot express the rule.

**The vulnerability this topic exists to prevent**

**Insecure direct object reference (IDOR).** The user is authenticated. They change \`/orders/7\` to \`/orders/8\` in the URL. If you only checked the token, they now have someone else's order.

This is one of the most common serious vulnerabilities in real APIs, and it is invisible in testing because testers use their own data.

**The rule: never trust an id from the client.** A valid token proves *who*, never *which*.

**Where checks belong**

**On the server, always.** Hiding a button in the UI is a courtesy to the user, not a security control — the endpoint is still there and anyone can call it with curl.

**Fail closed.** Default to denying, and grant explicitly. A permission system that allows anything it does not recognise will eventually meet a case it does not recognise.

**Two practical points**

- **Check as close to the data as possible.** An ownership check in a service the route calls is harder to forget than one copy-pasted into every handler.
- **Return 404 rather than 403 for resources the user may not even know exist.** Telling them "forbidden" confirms the record exists, which is itself a small information leak. For a private document, "not found" is both safer and true from their perspective.`,
    contentHi: `Authentication ne verified pehchan de di. Authorisation tay karta hai ki wo pehchan kya kar sakti hai.

**Teen model, badhti lachak ke saath**

**1. Maalikana** — sabse simple aur sabse aam: *kya ye cheez aapki hai?*

\`\`\`ts
if (order.userId !== req.user.id) return res.status(403)...
\`\`\`

Zyadatar endpoints ko bas yahi chahiye. Aur yahi jaanch sabse zyada bhooli jati hai.

**2. RBAC (role-based)** — user ka ek role hai; role ke paas permissions hain.

\`USER\`, \`EDITOR\`, \`ADMIN\`. Samajhne mein aasan aur zyadatar applications ke liye kaafi.

**3. ABAC (attribute-based)** — faisla user, resource aur haalat ke attributes se. *"Manager apne hi department mein, kaam ke ghanton mein, ₹50,000 se kam ke kharche manzoor kar sakta hai."* Shaktishali, aur test aur debug karna kaafi mushkil.

Maalikana se shuru karo, zaroorat par roles jodo, aur ABAC tabhi uthao jab roles sach mein wo niyam keh hi na sakein.

**Ye topic jis kamzori ko rokne ke liye hai**

**Insecure direct object reference (IDOR).** User authenticated hai. Wo URL mein \`/orders/7\` ko \`/orders/8\` bana deta hai. Agar aapne sirf token jaancha tha, to ab uske paas kisi aur ka order hai.

Asli APIs ki sabse aam gambhir kamzoriyon mein se ek yahi hai, aur testing mein ye dikhti nahi kyunki tester apna hi data use karte hain.

**Niyam: client se aayi id par kabhi bharosa mat karo.** Sahi token *kaun* sabit karta hai, *kaunsa* kabhi nahi.

**Jaanch kahan honi chahiye**

**Server par, hamesha.** UI mein button chhupana user ke liye shishtachar hai, security nahi — endpoint wahin hai aur koi bhi curl se use bula sakta hai.

**Band rakh kar fail ho.** Default mana karo, aur ijazat saaf-saaf do. Jo permission system apni samajh se bahar ki har cheez allow kar deta hai, use kabhi na kabhi samajh se bahar ka case mil hi jayega.

**Do practical baatein**

- **Jaanch data ke jitna paas ho sake utne paas rakho.** Route jis service ko bulata hai usme rakhi maalikana jaanch, har handler mein copy-paste ki hui jaanch se kam bhooli jati hai.
- **Jinke hone ka bhi user ko pata nahi hona chahiye, unke liye 403 ki jagah 404 lautao.** "Forbidden" kehna pushti kar deta hai ki record hai, aur wo khud ek chhota leak hai. Nijee document ke liye "not found" zyada surakshit bhi hai aur uske nazariye se sach bhi.`,
    codeExample: `type Role = 'USER' | 'EDITOR' | 'ADMIN';

// RBAC — reusable, and fails closed
const requireRole = (...allowed: Role[]) => (req, res, next) => {
  if (!allowed.includes(req.user.role)) {
    return res.status(403).json({ error: { code: 'FORBIDDEN' } });
  }
  next();
};

app.delete('/users/:id', requireAuth, requireRole('ADMIN'), handler);

// Ownership — the check people forget. IDOR lives here.
app.get('/orders/:id', requireAuth, async (req, res) => {
  const order = await service.find(req.params.id);

  // 404 rather than 403: do not confirm the record exists to someone who
  // has no business knowing about it.
  if (!order || (order.userId !== req.user.id && req.user.role !== 'ADMIN')) {
    return res.status(404).json({ error: { code: 'NOT_FOUND' } });
  }
  res.json({ order });
});`,
    commonMistakes: [
      'Checking the token but not the ownership of the resource — this is IDOR, and it is common in production.',
      'Relying on the UI hiding a control. The endpoint is still callable directly.',
      'Defaulting to allow for unrecognised permissions instead of failing closed.',
      'Returning 403 for private resources, confirming they exist to someone who should not know.',
    ],
    interviewQuestions: [
      'What is an insecure direct object reference?',
      'RBAC vs ABAC — when would you need the second?',
      'Why is hiding a button not authorisation?',
      'When would you return 404 instead of 403?',
    ],
    practiceQuestions: [
      'Audit an API for endpoints that take a resource id but never check ownership.',
      'Implement a requireRole middleware that fails closed and returns the right status.',
    ],
    tags: ['auth', 'authorisation', 'security', 'must-know'],
  },
];

/* ═════════════════════════ System design basics ═══════════════════════════ */

export const SD_BASICS: SeedTopic[] = [
  {
    slug: 'sd-what-is-system-design',
    title: 'What a system design interview is actually testing',
    difficulty: 'EASY',
    summary: 'Not whether you know the buzzwords. Whether you can ask the right questions, make a decision, and say honestly what it costs.',
    summaryHi: 'Ye nahi ki aapko buzzwords aate hain ya nahi. Ye ki aap sahi sawaal poochh sakte ho, faisla le sakte ho, aur imaandari se keh sakte ho ki uski keemat kya hai.',
    content: `A system design interview is a **conversation**, not a quiz. The interviewer wants to see how you think when the problem is deliberately underspecified.

**What they are actually assessing**

1. Do you **ask questions** before designing, or build for imagined requirements?
2. Can you start **simple** and add complexity only when something forces it?
3. Do you know the **trade-offs** — every choice costs something, and can you say what?
4. Can you **communicate** a design to another engineer?

Notice that "did you name the right technology" is not on the list.

**The structure that keeps you on track**

**1. Clarify (5 minutes).** Never start drawing.
- Who uses this and how many of them?
- What are the actual features? Which are out of scope?
- Reads or writes heavy?
- How fresh must the data be?

**2. Estimate.** Rough numbers, out loud. 1M users, 10 actions a day each = ~10M writes a day ≈ 120/second average, call it 500/second at peak. That is a *small* number, and knowing it stops you designing for a scale you do not have.

**3. Draw the simple version.** Client → API → database. Genuinely start here. A design that begins with Kafka has skipped the thinking.

**4. Find the bottleneck.** *Now* ask what breaks first as it grows — and fix only that.

**5. Say the trade-off.** "I would cache this. It means data can be up to 60 seconds stale, which is fine for a product listing and not for a stock count."

**The single strongest signal you can give**

*"That depends on..."* followed by the thing it depends on.

Candidates who answer instantly with "use microservices and Kafka" sound confident and score badly, because the honest answer to most design questions is that it depends on read/write ratio, consistency requirements and team size.

**The most common mistake:** designing for a million users when the question said a thousand. Over-engineering is a real failure mode, not caution — it costs money, adds failure points, and slows every future change. Say what you would do *now* and what would make you change it.`,
    contentHi: `System design interview ek **baat-cheet** hai, quiz nahi. Interviewer ye dekhna chahta hai ki jab samasya jaan-boojh kar adhoori batayi gayi ho, tab aap kaise sochte ho.

**Wo sach mein kya dekh rahe hain**

1. Design se pehle aap **sawaal poochhte ho**, ya kalpit zarooraton ke liye bana dete ho?
2. Aap **simple** shuru kar sakte ho aur complexity tabhi jodte ho jab koi cheez majboor kare?
3. Aapko **trade-offs** pata hain — har chunaav ki keemat hoti hai, aur aap bata sakte ho kya?
4. Aap design doosre engineer ko **samjha** sakte ho?

Dhyan do "aapne sahi technology ka naam liya ya nahi" is list mein hai hi nahi.

**Wo dhaancha jo aapko patri par rakhta hai**

**1. Saaf karo (5 minute).** Kabhi seedha drawing mat shuru karo.
- Ise kaun use karta hai aur kitne log?
- Asli features kya hain? Kya scope se bahar hai?
- Padhna zyada ya likhna?
- Data kitna taaza hona chahiye?

**2. Andaza lagao.** Mote-mote numbers, bol kar. 10 lakh users, har ek din mein 10 kaam = ~1 crore writes roz ≈ 120/second average, peak par maan lo 500/second. Ye *chhota* number hai, aur ise jaan lena aapko us scale ke liye design karne se rok deta hai jo hai hi nahi.

**3. Simple roop banao.** Client → API → database. Sach mein yahin se shuru karo. Jo design Kafka se shuru hota hai wo sochna chhod chuka hai.

**4. Rukavat dhoondho.** *Ab* poochho ki badhne par sabse pehle kya toot ega — aur sirf wahi theek karo.

**5. Sauda batao.** "Main ise cache karunga. Matlab data 60 second tak purana ho sakta hai, jo product listing ke liye theek hai aur stock count ke liye nahi."

**Sabse mazboot ishara jo aap de sakte ho**

*"Ye nirbhar karta hai..."* aur uske baad wo cheez jis par nirbhar hai.

Jo log turant "microservices aur Kafka use karo" keh dete hain wo aatmavishwasi lagte hain aur number kam paate hain, kyunki zyadatar design sawaalon ka imaandar jawab yahi hai ki ye read/write anupaat, consistency ki zaroorat aur team ke size par nirbhar karta hai.

**Sabse aam galti:** das lakh users ke liye design karna jab sawaal mein ek hazaar kaha tha. Over-engineering asli nakaami hai, savdhani nahi — ismein paisa lagta hai, tootne ki jagah badhti hai, aur aage ka har badlav dheema ho jata hai. Batao ki *abhi* kya karoge aur kya hone par badloge.`,
    commonMistakes: [
      'Drawing before asking a single clarifying question.',
      'Designing for a million users when the requirement was a thousand — over-engineering is a failure, not caution.',
      'Naming technologies instead of describing trade-offs.',
      'Refusing to say "it depends", when for most design questions that is the correct and most senior answer.',
    ],
    interviewQuestions: [
      'How do you approach a system design question?',
      'What questions would you ask before designing a URL shortener?',
      'Why is over-engineering a problem rather than a safety margin?',
      'How do you decide when to add caching?',
    ],
    practiceQuestions: [
      'Take any app you use and estimate its daily writes out loud in under two minutes.',
      'Design "a link shortener for 1,000 users" and then say what changes at 10 million.',
    ],
    tags: ['system-design', 'interview', 'basics', 'must-know'],
  },

  {
    slug: 'sd-client-server-and-dns',
    title: 'What happens when you type a URL',
    difficulty: 'EASY',
    summary: 'DNS, TCP, TLS, HTTP, response — the classic interview question, and the map every other system design topic hangs off.',
    summaryHi: 'DNS, TCP, TLS, HTTP, response — classic interview sawaal, aur wo naksha jis par baaki har system design topic tanga hai.',
    content: `This gets asked constantly, and it is a fair question: it checks whether you understand the layers you build on.

**The steps**

1. **DNS lookup** — \`example.com\` is a name; the network needs an IP address. The browser checks its cache, then the OS, then a resolver, which walks the DNS hierarchy. Results are cached according to their TTL.

2. **TCP connection** — a three-way handshake (SYN, SYN-ACK, ACK) opens a reliable ordered channel between your machine and the server.

3. **TLS handshake** — for HTTPS. Certificates are exchanged and verified, and both sides agree on an encryption key. This is what makes the connection private and what proves the server is who it claims.

4. **HTTP request** — now, finally, \`GET / HTTP/1.1\` with its headers.

5. **Server processes it** — probably through a load balancer, to one of several application servers, which may query a database or a cache.

6. **Response** — status code, headers, body. The browser parses the HTML, discovers CSS/JS/images and fetches those too.

7. **Render** — the browser builds the DOM and CSSOM, computes layout, and paints.

**Why this matters for design, not just trivia**

- Steps 1–3 are **latency before a single byte of your content moves**. That is why a CDN helps so much: it puts a server geographically closer, shortening every round trip.
- Connections are **expensive to establish**, which is why keep-alive and connection pooling exist.
- **DNS caching** is why a deployment change can take minutes to reach everyone, and why lowering TTL before a migration is a real technique.

**Three terms worth having straight**

- **Latency** — how long one request takes. Distance and round trips dominate.
- **Bandwidth** — how much data per second.
- **Throughput** — how many requests per second you can handle.

They are independent. A fat pipe with high latency is great for large downloads and terrible for a chatty API.

**Client-server, in one line:** the client asks, the server answers, and the server does not initiate. That single constraint is why WebSockets, SSE and polling all exist — and it is the foundation the rest of system design is built on.`,
    contentHi: `Ye baar-baar poochha jata hai, aur sawaal jayaz hai: isse pata chalta hai ki aap jin parton par banate ho unhe samajhte ho ya nahi.

**Kadam**

1. **DNS lookup** — \`example.com\` ek naam hai; network ko IP address chahiye. Browser apna cache dekhta hai, phir OS, phir resolver, jo DNS ki sirhi chalta hai. Natije unki TTL ke hisaab se cache hote hain.

2. **TCP connection** — teen-tarfa handshake (SYN, SYN-ACK, ACK) aapki machine aur server ke beech bharosemand, kramik channel kholta hai.

3. **TLS handshake** — HTTPS ke liye. Certificates aadan-pradan aur verify hote hain, aur dono taraf ek encryption key par razi hoti hain. Isi se connection nijee banta hai aur yahi sabit karta hai ki server wahi hai jo keh raha hai.

4. **HTTP request** — ab, aakhirkar, \`GET / HTTP/1.1\` apne headers ke saath.

5. **Server ise sambhalta hai** — shayad load balancer se hote hue, kai application servers mein se ek tak, jo database ya cache se poochh sakta hai.

6. **Response** — status code, headers, body. Browser HTML padhta hai, CSS/JS/images dhoondhta hai aur unhe bhi laata hai.

7. **Render** — browser DOM aur CSSOM banata hai, layout nikaalta hai, aur paint karta hai.

**Ye design ke liye kyun matter karta hai, sirf trivia nahi**

- Kadam 1–3 wo **latency hain jo aapke content ka ek byte hilne se pehle** lagti hai. Isiliye CDN itni madad karta hai: wo server ko bhaugolik roop se paas laata hai, aur har chakkar chhota ho jata hai.
- Connection **banane mein mehnga** hai, isiliye keep-alive aur connection pooling hain.
- **DNS caching** ki wajah se deployment ka badlav sab tak pahunchne mein minute le sakta hai, aur isiliye migration se pehle TTL kam karna asli tareeka hai.

**Teen shabd jinhe saaf rakhna chahiye**

- **Latency** — ek request mein kitna waqt. Doori aur chakkar sabse zyada matter karte hain.
- **Bandwidth** — ek second mein kitna data.
- **Throughput** — ek second mein kitni requests sambhal sakte ho.

Ye aapas mein alag hain. Moti pipe jiski latency zyada ho, bade downloads ke liye shandar hai aur baaton wali API ke liye bekaar.

**Client-server, ek line mein:** client poochhta hai, server jawab deta hai, aur server pehle shuru nahi karta. Yahi ek shart hai jiski wajah se WebSockets, SSE aur polling sab hain — aur baaki system design isi neev par khada hai.`,
    commonMistakes: [
      'Jumping straight to "the server returns HTML" and skipping DNS, TCP and TLS entirely.',
      'Confusing latency with bandwidth — a fast connection can still feel slow if it is far away.',
      'Forgetting DNS results are cached, then being surprised a DNS change did not take effect immediately.',
      'Not knowing why HTTPS needs a handshake at all, which makes the CDN and keep-alive conversations harder later.',
    ],
    interviewQuestions: [
      'What happens when you type a URL and press enter?',
      'What is the difference between latency, bandwidth and throughput?',
      'Why does a CDN make a site faster?',
      'Why is establishing a connection expensive?',
    ],
    practiceQuestions: [
      'Open the Network tab and identify DNS, connection and TLS time for one request.',
      'Explain to someone non-technical why a server in another country feels slower.',
    ],
    tags: ['system-design', 'networking', 'basics', 'must-know'],
  },

  {
    slug: 'sd-load-balancing',
    title: 'Load balancers and stateless servers',
    difficulty: 'MEDIUM',
    summary: 'One machine has a ceiling. A load balancer spreads traffic across many — which only works if your servers remember nothing.',
    summaryHi: 'Ek machine ki chhat hoti hai. Load balancer traffic kai machines par baant deta hai — jo tabhi chalta hai jab aapke servers kuch yaad na rakhein.',
    content: `A **load balancer** sits in front of several identical application servers and decides which one handles each request. It also stops sending traffic to any server that fails a health check, which is where most of its real value comes from.

**How it chooses**

- **Round robin** — one each, in turn. Fine when requests are similar.
- **Least connections** — whoever is least busy. Better when request cost varies.
- **IP hash** — the same client always reaches the same server. Use only when you genuinely need stickiness.

**The requirement that makes it work: stateless servers**

If server A remembers something in its own memory, a user whose second request lands on server B becomes a stranger. So anything that must persist goes to **shared** storage:

- Sessions → Redis or the database
- Uploaded files → object storage (S3), never the local disk
- Caches → a shared cache, or accept that each server has its own

**Say it plainly:** any two servers must be interchangeable. If they are not, you do not have horizontal scaling, you have several single points of failure.

**Sticky sessions** pin a user to one server so in-memory state works. It is a workaround, not a solution: you lose even load distribution, and when that server restarts those users lose their state anyway. Real exception: Socket.IO's HTTP long-polling fallback sends several handshake requests that must reach the same server — there, stickiness is genuinely required.

**Health checks** are what turn a load balancer from a splitter into a safety mechanism. A shallow check (\`/health\` returns 200) proves the process is alive. A deeper check that verifies the database connection catches a server that is running but useless. Too deep, though, and a brief database hiccup takes every server out of rotation at once.

**Where else the same idea appears**

- **DNS round robin** — cheapest, no health checking
- **Layer 4** (TCP) — fast, knows nothing about HTTP
- **Layer 7** (HTTP) — can route by path or header, terminate TLS, and is what you usually want

**The honest sequencing:** you rarely need a load balancer on day one. You need it when one machine is genuinely saturated, or when you want zero-downtime deploys — which is often the better reason to add it early.`,
    contentHi: `**Load balancer** kai ek jaise application servers ke aage baithta hai aur tay karta hai ki har request kaun sambhalega. Wo un servers ko traffic bhejna bhi band kar deta hai jo health check mein fail hon, aur uski asli keemat zyadatar wahin se aati hai.

**Wo chunta kaise hai**

- **Round robin** — bari-bari se ek-ek. Jab requests ek jaisi hon tab theek.
- **Least connections** — jo sabse kam vyast ho. Jab request ki keemat alag-alag ho tab behtar.
- **IP hash** — wahi client hamesha wahi server. Sirf tab jab sach mein stickiness chahiye.

**Wo shart jisse ye chalta hai: stateless servers**

Agar server A kuch apni memory mein yaad rakhta hai, to jis user ki doosri request server B par pahunche wo ajnabi ban jata hai. Isliye jo bacha rehna chahiye wo **saanjhe** storage mein jaye:

- Sessions → Redis ya database
- Upload ki hui files → object storage (S3), local disk kabhi nahi
- Caches → saanjha cache, ya maan lo ki har server ka apna hai

**Saaf shabdon mein:** koi bhi do server aapas mein badle ja sakne chahiye. Nahi ho sakte, to aapke paas horizontal scaling nahi, kai single points of failure hain.

**Sticky sessions** user ko ek server se baandh deti hain taaki memory wali state chale. Ye jugaad hai, hal nahi: load ka barabar batwara chala jata hai, aur wo server restart hone par un users ki state waise bhi chali jati hai. Asli apwaad: Socket.IO ka HTTP long-polling fallback kai handshake requests bhejta hai jinhe usi server par pahunchna hota hai — wahan stickiness sach mein zaroori hai.

**Health checks** hi load balancer ko baantne wale se suraksha ka saadhan banate hain. Halki jaanch (\`/health\` 200 laut aye) sabit karti hai ki process zinda hai. Gehri jaanch jo database connection dekhe, wo aisa server pakadti hai jo chal raha hai par bekaar hai. Par bahut gehri ho to database ki ek chhoti hichki saare servers ko ek saath bahar kar deti hai.

**Yahi vichaar aur kahan dikhta hai**

- **DNS round robin** — sabse sasta, health checking nahi
- **Layer 4** (TCP) — tez, HTTP ke baare mein kuch nahi jaanta
- **Layer 7** (HTTP) — path ya header se route kar sakta hai, TLS khatam kar sakta hai, aur aksar aapko yahi chahiye

**Imaandar kram:** pehle din load balancer shayad hi chahiye. Wo tab chahiye jab ek machine sach mein bhar chuki ho, ya jab zero-downtime deploy chahiye — aur ise jaldi jodne ki behtar wajah aksar doosri wali hoti hai.`,
    codeExample: `# nginx as a layer 7 load balancer
upstream app_servers {
  least_conn;                        # send to whoever is least busy
  server app1.internal:4000 max_fails=3 fail_timeout=30s;
  server app2.internal:4000 max_fails=3 fail_timeout=30s;
  server app3.internal:4000 max_fails=3 fail_timeout=30s;
}

server {
  listen 443 ssl;
  location / {
    proxy_pass http://app_servers;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $host;
  }
}

# The app must be stateless for any of this to work:
#   sessions  -> Redis
#   uploads   -> S3
#   /health   -> checks the database, so a broken-but-running server is removed`,
    commonMistakes: [
      'Keeping sessions or uploads in process memory or on local disk, so the second server breaks everything.',
      'Reaching for sticky sessions to avoid making the app stateless — it trades one problem for two.',
      'A health check that only proves the process is alive, so a server with a dead database connection keeps receiving traffic.',
      'A health check so deep that one slow database query pulls every server out of rotation simultaneously.',
    ],
    interviewQuestions: [
      'What does "stateless" mean and why does horizontal scaling require it?',
      'When are sticky sessions genuinely necessary?',
      'What should a health check actually check?',
      'Difference between layer 4 and layer 7 load balancing?',
    ],
    practiceQuestions: [
      'Take an app with in-memory sessions and move it to Redis.',
      'Write a health check that distinguishes "running" from "actually able to serve".',
    ],
    tags: ['system-design', 'scaling', 'must-know'],
  },

  {
    slug: 'sd-choosing-a-database',
    title: 'Choosing a database',
    difficulty: 'MEDIUM',
    summary: 'Relational unless you have a reason. Then read replicas, then caching — and sharding much later than most people think.',
    summaryHi: 'Wajah na ho to relational. Phir read replicas, phir caching — aur sharding logon ke andaze se kaafi baad mein.',
    content: `**Start relational.** Most applications have relationships — users have orders, orders have products — and relational databases were built for exactly that. Postgres is a sound default and stays sound for a very long time.

**When something else is genuinely right**

| Need | Reach for |
|---|---|
| Documents whose shape genuinely varies | MongoDB |
| Cache, sessions, rate limits, queues | Redis |
| Full-text search across large corpora | Elasticsearch / Postgres FTS |
| Time-series metrics | TimescaleDB, InfluxDB |
| Graph traversal many levels deep | Neo4j |

Note Redis appears there as a **complement**, not a replacement. Using two stores for two jobs is normal; using two relational databases for one job is not.

**Scaling reads, in the order you should actually do it**

1. **Add an index.** A genuinely large share of "we need to scale the database" turns out to be one missing index. Check the query plan before anything else.
2. **Cache the expensive reads.** Only what is read often and changes rarely.
3. **Read replicas.** Copies that serve reads while the primary takes writes. Reads scale almost linearly this way, and most apps are read-heavy.
4. **Then** consider sharding.

**Replication lag** is the cost of step 3: a replica is slightly behind. A user who writes and immediately reads may not see their own change — which looks exactly like a bug. Route read-after-write to the primary, or accept it where it does not matter.

**Sharding is last for a reason.** Splitting data across machines by some key means cross-shard queries become slow or impossible, transactions across shards are hard, and choosing a bad shard key produces a hot shard that you cannot easily fix. It solves a real problem, but it introduces several — take it only when a single primary genuinely cannot hold the write load.

**CAP, briefly and honestly:** under a network partition you must choose consistency or availability. In practice partitions are rare and the interesting choice is the everyday one — how stale may a read be? "Eventually consistent" means *correct soon*, not *wrong*. It is fine for a follower count and unacceptable for an account balance.

**The real advice:** choose the boring option. Postgres, one primary, an index, a cache. Most companies never outgrow it, and the ones that do had years of revenue to fund the migration.`,
    contentHi: `**Relational se shuru karo.** Zyadatar applications mein rishte hote hain — users ke orders, orders mein products — aur relational databases theek isi ke liye bane the. Postgres achha default hai aur bahut lambe samay tak achha rehta hai.

**Kab sach mein kuch aur sahi hai**

| Zaroorat | Kya uthao |
|---|---|
| Aise documents jinki shakal sach mein badalti hai | MongoDB |
| Cache, sessions, rate limits, queues | Redis |
| Bade text par full-text search | Elasticsearch / Postgres FTS |
| Time-series metrics | TimescaleDB, InfluxDB |
| Kai parton gehra graph chalna | Neo4j |

Dhyan do Redis wahan **saath dene wale** ki tarah hai, jagah lene wale ki tarah nahi. Do kaam ke liye do store use karna normal hai; ek kaam ke liye do relational database nahi.

**Reads scale karne ka kram, jaise sach mein karna chahiye**

1. **Index lagao.** "Database scale karna padega" wale bahut se case ek chhoote hue index nikalte hain. Kuch bhi karne se pehle query plan dekho.
2. **Mehngi reads cache karo.** Sirf wo jo baar-baar padhi jayein aur kam badlein.
3. **Read replicas.** Aisi copies jo reads sambhalein jabki primary writes leta rahe. Isse reads lagbhag seedhe anupaat mein scale hoti hain, aur zyadatar apps read-heavy hain.
4. **Phir** sharding socho.

**Replication lag** teesre kadam ki keemat hai: replica thoda peeche hota hai. Jo user likh kar turant padhe use apna hi badlav na dikhe — aur ye bilkul bug jaisa lagta hai. Likhne ke baad ki read primary par bhejo, ya jahan farak na pade wahan maan lo.

**Sharding aakhir mein hai, wajah ke saath.** Data ko kisi key se machines mein baantna matlab cross-shard queries dheemi ya namumkin, shards ke paar transactions mushkil, aur galat shard key chunne par ek garam shard jise theek karna aasan nahi. Ye asli samasya hal karta hai, par kai nayi laata hai — tabhi lo jab ek primary sach mein write load na jhel sake.

**CAP, chhote mein aur imaandari se:** network partition ke waqt consistency ya availability mein se ek chunni padti hai. Asal mein partition kam hote hain aur dilchasp chunaav rozmarra wala hai — read kitni purani ho sakti hai? "Eventually consistent" matlab *jaldi sahi*, *galat* nahi. Follower count ke liye theek, account balance ke liye bilkul nahi.

**Asli salah:** boring wala chuno. Postgres, ek primary, ek index, ek cache. Zyadatar companies ise kabhi paar nahi karti, aur jo karti hain unke paas migration ke liye saalon ki kamai hoti hai.`,
    commonMistakes: [
      'Choosing NoSQL for a relational problem because it sounds more scalable, then rebuilding joins by hand in application code.',
      'Sharding before adding an index. Most scaling problems are a missing index.',
      'Adding read replicas without handling replication lag, so users do not see their own writes.',
      'Treating "eventually consistent" as acceptable everywhere. It is fine for a like count, not for money.',
    ],
    interviewQuestions: [
      'How do you decide between SQL and NoSQL?',
      'What is replication lag and what bug does it cause?',
      'In what order would you scale a read-heavy database?',
      'Why is sharding a last resort?',
    ],
    practiceQuestions: [
      'For a read-heavy app, write the scaling steps in order with the trigger for each.',
      'Describe a read-after-write case in your own app and how you would handle replica lag.',
    ],
    tags: ['system-design', 'database', 'scaling'],
  },

  {
    slug: 'sd-worked-example',
    title: 'Worked example: designing a URL shortener',
    difficulty: 'HARD',
    summary: 'The whole method applied end to end — clarify, estimate, simple design, find the bottleneck, state the trade-offs.',
    summaryHi: 'Poora tareeka shuru se ant tak — saaf karo, andaza lagao, simple design, rukavat dhoondho, sauda batao.',
    content: `The classic question. Here it is answered the way it should be answered — as a conversation with visible reasoning.

**1. Clarify**

- How many links created per day? *Say 1 million.*
- Read/write ratio? *Typical is roughly 100:1 — links are read far more than created.*
- Custom aliases? *Nice to have.*
- Analytics? *Click counts, not real-time.*
- How long do links live? *Assume forever.*

**2. Estimate — out loud**

- Writes: 1M/day ≈ **12 per second**. That is nothing.
- Reads: 100M/day ≈ **1,200 per second**. Real, but not exotic.
- Storage: 1M/day × 500 bytes × 365 × 5 years ≈ **~1 TB**. One machine holds this.

**This is the most important step**, because the numbers say a single Postgres instance with a cache handles it. Anyone reaching for a distributed system here has not done the arithmetic.

**3. The simple design**

\`\`\`
POST /shorten  →  generate code → store (code, url) → return short link
GET  /:code    →  look up code  → 301/302 redirect
\`\`\`

One table: \`id, code (unique), long_url, created_at, clicks\`.

**4. How to generate the code**

- **Random 7 characters** from [a-zA-Z0-9] = 62⁷ ≈ 3.5 trillion. Collisions are rare; handle them by retrying on a unique-constraint violation. **Simple and correct.**
- **Base62 of an auto-increment id** — no collisions ever, but codes are sequential and therefore guessable, which leaks how many links exist and lets people enumerate them.

Choose random, and say why: *guessability matters more here than elegance.*

**5. Find the bottleneck**

Reads. 1,200/second of "look up this code" is the whole workload, and the data is immutable once written — which is a cache's ideal case.

- Cache code → URL in Redis. Hit rate will be very high because link popularity is heavily skewed.
- The database index on \`code\` handles misses.

**6. State the trade-offs**

- **301 vs 302.** 301 is cached by the browser, so repeat visits never reach you — cheaper, but you lose click analytics. 302 keeps analytics and costs a request every time. *I would use 302, because analytics was a requirement.* That reasoning is the point.
- **Click counting** synchronously on the redirect path adds a write to every read. Push it to a queue and aggregate — the count can be seconds stale.
- **Custom aliases** share the same uniqueness check, and need a reserved-word list so nobody claims \`/login\`.

**7. What would change at 100× scale**

Read replicas, a CDN in front of redirects, and *then* sharding by code prefix. Not before.

**The lesson:** the estimate in step 2 determined everything. Most of this design is "one server and a cache", and saying that confidently is a stronger answer than an unnecessary distributed architecture.`,
    contentHi: `Classic sawaal. Yahan wo waise jawab diya gaya hai jaise dena chahiye — dikhti hui soch ke saath baat-cheet ki tarah.

**1. Saaf karo**

- Roz kitne link bante hain? *Maan lo 10 lakh.*
- Read/write anupaat? *Aam taur par lagbhag 100:1 — link banne se kahin zyada padhe jate hain.*
- Custom alias? *Ho to achha.*
- Analytics? *Click ki ginti, real-time nahi.*
- Link kitne din rehte hain? *Maan lo hamesha.*

**2. Andaza — bol kar**

- Writes: 10 lakh/din ≈ **12 per second**. Ye kuch bhi nahi.
- Reads: 10 crore/din ≈ **1,200 per second**. Asli, par ajooba nahi.
- Storage: 10 lakh/din × 500 bytes × 365 × 5 saal ≈ **~1 TB**. Ek machine ise rakh legi.

**Yahi sabse zaroori kadam hai**, kyunki numbers keh rahe hain ki ek Postgres instance aur ek cache ise sambhal lenge. Jo yahan distributed system uthaye usne hisaab kiya hi nahi.

**3. Simple design**

\`\`\`
POST /shorten  →  code banao → (code, url) rakho → chhota link do
GET  /:code    →  code dhoondho → 301/302 redirect
\`\`\`

Ek table: \`id, code (unique), long_url, created_at, clicks\`.

**4. Code kaise banayein**

- **Random 7 akshar** [a-zA-Z0-9] se = 62⁷ ≈ 3.5 kharab. Takraar kam hoti hai; unique-constraint fail hone par dobara koshish karo. **Simple aur sahi.**
- **Auto-increment id ka Base62** — takraar kabhi nahi, par codes kramik aur isliye anuman layak, jisse pata chal jata hai kitne link hain aur log unhe ek-ek karke khol sakte hain.

Random chuno, aur wajah bolo: *yahan khoobsurti se zyada anuman-layak na hona matter karta hai.*

**5. Rukavat dhoondho**

Reads. "Ye code dhoondho" ka 1,200/second poora kaam hai, aur likhne ke baad data badalta hi nahi — cache ke liye yahi sabse achha haal hai.

- Redis mein code → URL cache karo. Hit rate bahut ooncha hoga kyunki links ki lokpriyata bahut asamaan hoti hai.
- \`code\` par bana index miss sambhal lega.

**6. Sauda batao**

- **301 aur 302.** 301 browser cache kar leta hai, isliye dobara aane wale aap tak pahunchte hi nahi — sasta, par click analytics chali jati hai. 302 analytics rakhta hai aur har baar ek request kharch karta hai. *Main 302 lunga, kyunki analytics zaroorat thi.* Wahi soch asli baat hai.
- **Click ginna** redirect ke raste par turant karna har read par ek write jod deta hai. Use queue par bhejo aur jodo — ginti kuch second purani ho sakti hai.
- **Custom alias** wahi uniqueness jaanch use karte hain, aur unhe reserved shabdon ki list chahiye taaki koi \`/login\` na le le.

**7. 100 guna scale par kya badlega**

Read replicas, redirects ke aage CDN, aur *phir* code ke prefix se sharding. Usse pehle nahi.

**Seekh:** doosre kadam ke andaze ne sab kuch tay kiya. Ye design zyadatar "ek server aur ek cache" hai, aur ise aatmavishwas se keh dena ek bemaani distributed architecture se mazboot jawab hai.`,
    codeExample: `-- One table handles the whole thing
CREATE TABLE links (
  id         BIGSERIAL PRIMARY KEY,
  code       TEXT NOT NULL UNIQUE,          -- the index that serves every read
  long_url   TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Random code, retry on the rare collision. Simple beats clever here.
async function shorten(longUrl: string): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = randomBase62(7);                    // 62^7 ≈ 3.5 trillion
    try {
      await db.link.create({ data: { code, longUrl } });
      return code;
    } catch (e) {
      if (!isUniqueViolation(e)) throw e;            // collision → try again
    }
  }
  throw new Error('Could not allocate a code');
}

// Reads are the whole workload, and the data never changes once written
async function resolve(code: string): Promise<string | null> {
  const cached = await redis.get(\`link:\${code}\`);
  if (cached) return cached;

  const link = await db.link.findUnique({ where: { code } });
  if (!link) return null;

  await redis.set(\`link:\${code}\`, link.longUrl, 'EX', 86_400);
  return link.longUrl;
}`,
    commonMistakes: [
      'Designing a distributed system before doing the arithmetic — 12 writes a second does not need one.',
      'Using sequential ids as codes, making every link guessable and enumerable.',
      'Counting clicks synchronously on the redirect, turning every read into a write.',
      'Choosing 301 without noticing it caches away the analytics the requirements asked for.',
    ],
    interviewQuestions: [
      'Design a URL shortener.',
      'Why choose random codes over sequential ids?',
      'What is the trade-off between a 301 and a 302 redirect here?',
      'Where is the bottleneck, and what would you do first?',
    ],
    practiceQuestions: [
      'Do the same exercise for a pastebin, out loud, in ten minutes.',
      'Estimate the daily writes and storage for a chat app with 100k users.',
    ],
    tags: ['system-design', 'interview', 'worked-example', 'must-know'],
  },
];
