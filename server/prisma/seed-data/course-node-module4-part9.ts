/**
 * Node.js Complete Course — Module 4: Authentication & Security, lesson 9.
 *
 * Mass assignment: a specific, named vulnerability distinct from general
 * input validation (this course's earlier request-validation lesson).
 * Validating that a request body has the right SHAPE (the right field
 * types, required fields present) does not automatically prevent an
 * attacker from including EXTRA fields the request was never supposed to
 * let them set — fields like "role" or "isAdmin" that happen to exist on
 * the same underlying database record being updated. Broken example: a
 * profile-update route that blindly copies every field from req.body onto
 * the user record (Object.assign(user, req.body) or an unrestricted
 * User.update(req.body)) — an attacker simply adds a "role": "admin"
 * field to an otherwise ordinary profile-update request and silently
 * grants themselves administrator privileges, with no error, no
 * validation failure, and no trace beyond the request body itself. Fixed
 * by explicitly allowlisting exactly which fields a given route is
 * permitted to update, rejecting or silently stripping anything else,
 * rather than trusting the absence of extra fields.
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

export const NODE_MODULE_4_PART9: CourseLesson[] = [
  {
    slug: 'mass-assignment-vulnerabilities',
    title: 'Mass Assignment: When Extra Fields Grant Extra Privileges',
    titleHi: 'Mass Assignment: Jab Extra Fields Extra Privileges De Dete Hain',
    description: 'A perfectly ordinary "update my profile" request quietly includes one extra field — "role": "admin" — that was never shown on the form, never meant to be user-editable, and never checked for... and the server happily grants it anyway.',
    descriptionHi: 'Ek bilkul saadhaaran "mera profile update karo" request chupke se ek extra field shaamil karti hai — "role": "admin" — jo kabhi form par dikhaayi nahi gayi, kabhi user-editable hone ke liye nahi thi, aur kabhi check nahi ki gayi... aur server phir bhi khushi-khushi ise de deta hai.',
    difficulty: 'MEDIUM',
    duration: 16,
    order: 9,

    analogy: {
      en: '**A hotel check-in form that has a guest-facing section (name, arrival date, room preference) printed on the same physical sheet as a staff-only section (a "loyalty tier override," a "complimentary upgrade" checkbox) — and a front-desk clerk who, without looking carefully at which section is which, simply copies every single field written anywhere on the form directly into the hotel\'s booking system.** A guest filling out this form is only ever shown, and only ever expected to fill in, the guest-facing fields — but nothing about the physical form itself stops a guest who happens to know the staff-only fields exist from writing "complimentary upgrade: yes" in that section too, since it\'s right there on the same sheet of paper. A careful clerk knows exactly which fields on the form guests are allowed to fill in, and enters only those specific values into the system, discarding or ignoring anything written in the staff-only section regardless of what a guest wrote there. A careless clerk, trained only to "enter whatever is written on the form" without distinguishing which section is which, faithfully copies the guest\'s claimed complimentary upgrade into the system exactly as if a staff member had genuinely authorized it — the guest received a real, unearned privilege simply by writing it down, because nothing separated "fields a guest is allowed to set" from "fields that exist on the same form." A server that copies every field from a request body directly onto a database record, with no regard for which specific fields that particular request is actually supposed to be allowed to set, is the careless clerk: an attacker who simply knows (or guesses, or discovers by reading the API\'s own documentation or source code) that a "role" field exists on the user record can include it in an ordinary profile-update request, and the server, trusting the form\'s contents wholesale, grants it.',
      hi: '**Ek hotel check-in form jismein ek guest-facing section (naam, aane ki taareekh, room preference) usi physical sheet par chhapa hai jispar ek staff-only section (ek "loyalty tier override," ek "complimentary upgrade" checkbox) bhi hai — aur ek front-desk clerk jo, dhyaan se ye dekhe bina ki kaunsa section kya hai, bas form par kahin bhi likhi har akeli field seedhe hotel ke booking system mein copy kar deta hai.** Ye form bharta ek guest sirf guest-facing fields dikhaaya jaata hai, aur sirf unhe bharne ki umeed ki jaati hai — par physical form ke baare mein kuch bhi ek aise guest ko nahi rokta jise pata hai staff-only fields maujood hain use "complimentary upgrade: yes" us section mein bhi likhne se, kyunki ye bilkul usi kaagaz ke sheet par hai. Ek savdhaan clerk bilkul jaanta hai form par kaunsi fields guests ko bharne ki ijaazat hai, aur system mein sirf wahi khaas values daalta hai, staff-only section mein jo bhi likha ho use hataate ya nazarandaaz karte hue chahe guest ne wahaan kuch bhi likha ho. Ek laapervaah clerk, sirf "form par jo bhi likha hai wo daalo" sikhaaya gaya, kaunsa section kya hai alag kiye bina, guest ke daave kiye complimentary upgrade ko bilkul waise system mein wafadaari se copy kar deta hai jaise ek staff member ne asal mein use authorize kiya ho — guest ko ek asli, na-kamaaya privilege mila sirf ise likh kar, kyunki kuch bhi "wo fields jo ek guest ko set karne ki ijaazat hai" ko "wo fields jo usi form par maujood hain" se alag nahi karta. Ek server jo ek request body se har field ko seedhe ek database record par copy karta hai, is baat ki koi parvaah bina ki wo khaas request asal mein kaunsi khaas fields set karne ki ijaazat rakhti hai, laapervaah clerk hai: ek attacker jo bas jaanta hai (ya anumaan lagaata hai, ya API ki apni documentation ya source code padhkar discover karta hai) ki user record par ek "role" field maujood hai use ek saadhaaran profile-update request mein shaamil kar sakta hai, aur server, form ki poori saamagri par bharosa karte hue, ise de deta hai.',
    },

    simple: `**Start broken.** A profile-update route that copies every field from the request body directly onto the user record:

\`\`\`js
app.patch("/profile", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    Object.assign(user, req.body); // copies EVERY field, whatever the client sent
    await user.save();
    res.json(user);
  } catch (err) {
    next(err);
  }
});
\`\`\`

This route\'s intent is clearly to let a logged-in user update their own profile — name, email, bio, that sort of thing — and for an ordinary request like \`{ "name": "Priya Sharma" }\`, it does exactly that, correctly and harmlessly. The vulnerability is that \`Object.assign(user, req.body)\` copies EVERY field present in \`req.body\` onto the user record, with absolutely no regard for whether that specific field was ever meant to be something the client is allowed to set. The \`user\` object in the database also happens to have a \`role\` field, used elsewhere in the application to distinguish an ordinary customer from an administrator — and nothing in this route\'s code, and critically, nothing in typical request validation either (which usually checks that provided fields have the correct TYPE, not that only an expected, limited SET of fields is present), stops an attacker from sending \`{ "name": "Priya Sharma", "role": "admin" }\` instead. The route copies both fields onto the record exactly as instructed, silently promoting the attacker to administrator, with no error, no validation failure, and nothing distinguishing this request from a completely ordinary, legitimate one in any log or response.

**The fix: explicitly allowlist exactly which fields this route may update**

\`\`\`js
const ALLOWED_FIELDS = ["name", "email", "bio"];

app.patch("/profile", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    for (const field of ALLOWED_FIELDS) {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    }
    await user.save();
    res.json(user);
  } catch (err) {
    next(err);
  }
});
\`\`\`

\`\`\`ts
const ALLOWED_FIELDS: (keyof UserProfileUpdate)[] = ["name", "email", "bio"];

app.patch("/profile", requireAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.userId);
    for (const field of ALLOWED_FIELDS) {
      if (req.body[field] !== undefined) {
        (user as any)[field] = req.body[field];
      }
    }
    await user.save();
    res.json(user);
  } catch (err) {
    next(err);
  }
});
\`\`\`

Rather than blindly trusting whatever fields happen to be present in \`req.body\`, this version explicitly names the exact, small set of fields this specific route is permitted to update — \`name\`, \`email\`, and \`bio\` — and copies only those, regardless of what else the request body might contain. An attacker including \`"role": "admin"\` in the request body now has that field silently ignored entirely; it was never in the allowlist, so it is never even considered, let alone copied onto the record. The set of fields a client can influence through this route is no longer implicitly "whatever fields exist on the underlying database model" — it is explicitly, deliberately, exactly the set the route\'s author intended, and nothing more.`,

    simpleHi: `**Toote hue se shuru.** Ek profile-update route jo request body se har field ko seedhe user record par copy karta hai:

\`\`\`js
app.patch("/profile", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    Object.assign(user, req.body); // HAR field copy karta hai, client ne jo bhi bheja ho
    await user.save();
    res.json(user);
  } catch (err) {
    next(err);
  }
});
\`\`\`

Is route ka iraada saaf taur par ek logged-in user ko apna profile update karne dena hai — naam, email, bio, aisi cheezein — aur ek saadhaaran request jaise \`{ "name": "Priya Sharma" }\` ke liye, ye bilkul yahi karta hai, sahi tarike se aur bina nuksaan ke. Khaami ye hai ki \`Object.assign(user, req.body)\` \`req.body\` mein maujood HAR field ko user record par copy karta hai, is baat ki bilkul koi parvaah bina ki wo khaas field kabhi client ke set karne ke liye thi ya nahi. Database mein \`user\` object ke paas ek \`role\` field bhi hoti hai, jo application mein kahin aur ek aam customer ko ek administrator se alag karne ke liye istemal hoti hai — aur is route ke code mein kuch bhi, aur bahut zaruri, aam request validation mein bhi kuch nahi (jo aam taur par check karta hai ki di gayi fields ka sahi TYPE hai, ye nahi ki sirf ek anumaanit, seemit SET fields maujood hain) ek attacker ko iske bajaye \`{ "name": "Priya Sharma", "role": "admin" }\` bhejne se nahi rokta. Route dono fields ko record par bilkul jaisa nirdesh diya gaya waise copy karta hai, chupke se attacker ko administrator banaate hue, koi error nahi, koi validation failure nahi, aur kisi bhi log ya response mein is request ko ek poori tarah saadhaaran, vaidh se alag karta kuch nahi.

**Fix: explicitly allowlist karo ki ye route bilkul kaunsi fields update kar sakta hai**

\`\`\`js
const ALLOWED_FIELDS = ["name", "email", "bio"];

app.patch("/profile", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    for (const field of ALLOWED_FIELDS) {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    }
    await user.save();
    res.json(user);
  } catch (err) {
    next(err);
  }
});
\`\`\`

\`\`\`ts
const ALLOWED_FIELDS: (keyof UserProfileUpdate)[] = ["name", "email", "bio"];

app.patch("/profile", requireAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.userId);
    for (const field of ALLOWED_FIELDS) {
      if (req.body[field] !== undefined) {
        (user as any)[field] = req.body[field];
      }
    }
    await user.save();
    res.json(user);
  } catch (err) {
    next(err);
  }
});
\`\`\`

\`req.body\` mein jo bhi fields maujood hon un par andhaadhund bharosa karne ke bajaye, ye version explicitly naam leta hai us bilkul, chhote fields ke set ka jo ye khaas route update karne ki ijaazat rakhta hai — \`name\`, \`email\`, aur \`bio\` — aur sirf inhe hi copy karta hai, request body mein aur kuch bhi ho us se bekhabar. Ek attacker jo request body mein \`"role": "admin"\` shaamil karta hai ab us field ko poori tarah chupke se nazarandaaz kiya jaata hai; ye kabhi allowlist mein thi hi nahi, isliye ise vichaar mein liya hi nahi jaata, record par copy hona to door ki baat. Wo set of fields jinhe ek client is route ke through prabhaavit kar sakta hai ab implicitly "underlying database model par jo bhi fields maujood hain" nahi hai — ye explicitly, jaan-boojhkar, bilkul wo set hai jo route ke author ka iraada tha, aur bas.`,

    content: `## Mass assignment vs. this course's earlier request-validation lesson: two different questions

\`\`\`
Request validation (this course's earlier lesson): "does each PROVIDED
field have the right shape?" — is "email" actually a string, is "age"
actually a number, is a required field present at all?

Mass assignment (this lesson): "is the client even ALLOWED to set this
field in the first place?" — a completely different question that
shape-validation alone does not answer.
\`\`\`

This course\'s earlier request-validation lesson covers a genuinely important, but distinct, question: given the fields a client provided, does each one have the correct type and shape — is a provided \`email\` actually a valid-looking email string, is a provided \`age\` actually a number, are required fields present at all? A validation library like Zod answers this question well, but by default, a schema that simply describes the shape of expected fields does not automatically forbid additional, UNEXPECTED fields from being present in the request body at all — and even a schema that does correctly validate a \`role\` field\'s shape (confirming it\'s a valid string, say) says nothing about whether the client making THIS SPECIFIC request should be allowed to set it. Mass assignment is a vulnerability in the gap between these two questions: an attacker\'s extra field can pass shape validation perfectly (a string named "role" containing "admin" is a perfectly valid string) while still representing something the client was never supposed to be able to specify at all.

## Why this happens most often with ORMs and generic update patterns

\`\`\`js
// A generic "update with whatever was sent" pattern, common with many ORMs
await User.update(req.body, { where: { id: req.userId } });
// Object.assign(model, req.body) has the identical underlying problem
\`\`\`

Mass assignment tends to appear specifically where a codebase reaches for a convenient, generic pattern — passing an entire request body directly into an ORM\'s \`.update()\` method, or spreading it directly onto a model instance with \`Object.assign\` — rather than deliberately naming which specific fields a given operation is meant to touch. This pattern is genuinely convenient to write, since it avoids listing out every field by name, and it works correctly for every legitimate request that only ever includes the fields a developer intended — the vulnerability only becomes visible the day an attacker deliberately includes a field the developer never anticipated a client would think to send.

## The fix: an explicit allowlist, not an implicit "whatever was sent"

\`\`\`js
// Allowlist approach: name exactly what's permitted
const ALLOWED_FIELDS = ["name", "email", "bio"];
const updates = {};
for (const field of ALLOWED_FIELDS) {
  if (req.body[field] !== undefined) updates[field] = req.body[field];
}
await User.update(updates, { where: { id: req.userId } });
\`\`\`

\`\`\`js
// A validation-schema-based allowlist (using this course's earlier Zod pattern)
// achieves the same result, since .parse() strips unrecognized keys by default
const schema = z.object({ name: z.string().optional(), email: z.string().email().optional(), bio: z.string().optional() });
const updates = schema.parse(req.body); // "role" here, if sent, is simply not in the output
\`\`\`

The reliable fix is to explicitly name the specific fields a given route or operation is permitted to set, rather than implicitly trusting "whatever fields happen to be present." This can be done directly with a small, explicit list checked field-by-field, as this lesson\'s fixed example shows, or, conveniently, by reusing this course\'s earlier Zod validation pattern: a Zod schema that only declares the fields that ARE allowed, when used with \`.parse()\`, produces an output object containing only those declared fields — any extra field the client included, like \`role\`, is simply absent from the parsed result, never making it anywhere near the database update at all. This means a single, well-designed validation schema can serve double duty: validating shape (this course\'s earlier lesson) AND enforcing the allowlist that prevents mass assignment, as long as the schema is written to describe exactly the fields that should be settable, not simply "whatever type each field should be if present."

## Recognizing which fields are dangerous if left un-allowlisted

\`\`\`
Fields that are dangerous to leave open to mass assignment:
- role, isAdmin, permissions — privilege escalation
- accountBalance, creditLimit — direct financial manipulation
- verified, emailConfirmed — bypassing a verification step entirely
- userId, ownerId (on a DIFFERENT record) — reassigning ownership of data
\`\`\`

Not every field on a model is equally dangerous if accidentally left assignable — a typo in a user\'s own \`bio\` field is harmless. The fields genuinely worth deliberate attention are ones that control privilege (a role or permission flag), ones that control money or a limit of some kind, ones that represent a security-relevant state (whether an account or email has been verified), and ones that determine who owns or is associated with a piece of data. Recognizing that these specific categories of fields exist on a model is what should prompt a developer to reach for an explicit allowlist on any route that touches that model, rather than a generic, permissive "copy whatever was sent" pattern.`,

    contentHi: `## Mass assignment vs. is course ka pehle wala request-validation lesson: do alag sawaal

\`\`\`
Request validation (is course ka pehle wala lesson): "kya har DI GAYI
field ki sahi shape hai?" — kya "email" asal mein ek string hai, kya
"age" asal mein ek number hai, kya ek zaroori field bilkul maujood hai?

Mass assignment (ye lesson): "kya client ko is field ko set karne ki
bilkul ijaazat bhi hai?" — ek poori tarah alag sawaal jise akeli
shape-validation jawaab nahi deti.
\`\`\`

Is course ka pehle wala request-validation lesson ek sach mein zaruri, par alag, sawaal cover karta hai: client ne di gayi fields ke aadhaar par, kya har ek ki sahi type aur shape hai — kya di gayi \`email\` asal mein ek vaidh-dikhti email string hai, kya di gayi \`age\` asal mein ek number hai, kya zaroori fields bilkul maujood hain? Zod jaisi ek validation library is sawaal ka achha jawaab deti hai, par by default, ek schema jo bas anumaanit fields ki shape darsata hai automatically additional, ANUMAANIT-NAHI fields ko request body mein maujood hone se bilkul nahi rokta — aur ek schema jo ek \`role\` field ki shape ko sahi tarike se validate karti hai (confirm karte hue ki ye ek vaidh string hai, maano), kuch nahi kehti ki kya YE KHAAS request karta client use set karne ki ijaazat rakhta hai. Mass assignment in do sawaalon ke beech ke gap mein ek khaami hai: ek attacker ki extra field shape validation ko poori tarah pass kar sakti hai ("role" naam ki ek string jismein "admin" hai ek poori tarah vaidh string hai) jabki phir bhi kuch aisa darsati hai jise client kabhi specify karne ki ijaazat rakhta hi nahi tha.

## Ye aksar ORMs aur generic update patterns ke saath kyun hota hai

\`\`\`js
// Ek generic "jo bhi bheja gaya us se update karo" pattern, kai ORMs ke saath aam
await User.update(req.body, { where: { id: req.userId } });
// Object.assign(model, req.body) mein wahi underlying samasya hai
\`\`\`

Mass assignment khaas taur par tab dikhta hai jahan ek codebase ek suvidhajanak, generic pattern ki taraf jaata hai — poore request body ko seedhe ek ORM ke \`.update()\` method mein pass karna, ya ise seedhe \`Object.assign\` se ek model instance par phailaana — jaan-boojhkar naam lene ke bajaye ki ek diya operation kaunsi khaas fields chhoone ke liye hai. Ye pattern likhne mein sach mein suvidhajanak hai, kyunki ye har field ko naam se list karne se bachaata hai, aur ye har vaidh request ke liye sahi tarike se kaam karta hai jo sirf wo fields shaamil karti hai jinke liye ek developer ka iraada tha — khaami sirf tab dikhti hai jis din ek attacker jaan-boojhkar ek aisi field shaamil karta hai jiski developer ne kabhi umeed nahi ki thi ki koi client bhejne ki soche.

## Fix: ek explicit allowlist, "jo bhi bheja gaya" ek implicit tarika nahi

\`\`\`js
// Allowlist tarika: bilkul naam lo jo ijaazat hai
const ALLOWED_FIELDS = ["name", "email", "bio"];
const updates = {};
for (const field of ALLOWED_FIELDS) {
  if (req.body[field] !== undefined) updates[field] = req.body[field];
}
await User.update(updates, { where: { id: req.userId } });
\`\`\`

\`\`\`js
// Ek validation-schema-aadhaarit allowlist (is course ke pehle wale Zod pattern ka
// istemal karte hue) wahi natija haasil karta hai, kyunki .parse() default se
// na-pehchaani gayi keys hataata hai
const schema = z.object({ name: z.string().optional(), email: z.string().email().optional(), bio: z.string().optional() });
const updates = schema.parse(req.body); // "role" yahaan, agar bheja gaya, bas output mein nahi hai
\`\`\`

Bharosemand fix ye hai ki explicitly wo khaas fields naam lo jo ek diya route ya operation set karne ki ijaazat rakhta hai, implicitly "jo bhi fields maujood hain" par bharosa karne ke bajaye. Ye seedhe ek chhoti, explicit list ke saath kiya jaa sakta hai jo field-by-field check ki jaati hai, jaisa is lesson ka theek example dikhaata hai, ya, suvidhajanak taur par, is course ke pehle wale Zod validation pattern ko dobara istemal karke: ek Zod schema jo sirf un fields ko declare karti hai jo ANUMAANIT HAIN, \`.parse()\` ke saath istemal hone par, sirf un declared fields waala ek output object banaati hai; koi bhi extra field jo client ne shaamil ki, jaise \`role\`, bas parsed result se gayab hai, database update ke kahin bhi kareeb kabhi na jaate hue. Iska matlab hai ek akela, achhi tarah design ki gayi validation schema doharrā kaam nibhaa sakti hai: shape validate karna (is course ka pehle wala lesson) AUR allowlist lagu karna jo mass assignment rokta hai, jab tak schema bilkul un fields ko darsaane ke liye likhi gayi ho jo set-hone-laayak honi chahiye, sirf "har field, agar maujood ho to uska kya type hona chahiye" nahi.

## Pehchaanna ki kaunsi fields khatarnaak hain agar bina-allowlist chhod di jaayein

\`\`\`
Fields jo mass assignment ke liye khuli chhodne par khatarnaak hain:
- role, isAdmin, permissions — privilege escalation
- accountBalance, creditLimit — seedhe financial manipulation
- verified, emailConfirmed — ek verification step ko poori tarah bypass karna
- userId, ownerId (ek ALAG record par) — data ki ownership dobara sonpna
\`\`\`

Ek model par har field galti se assignable chhod diye jaane par samaan roop se khatarnaak nahi hai — ek user ki apni \`bio\` field mein ek typo hanikaarak-na-lagu hai. Wo fields jo sach mein jaan-boojhkar dhyaan ke laayak hain wo hain jo privilege niyantrit karti hain (ek role ya permission flag), wo jo paisa ya kisi tarah ki seemaa niyantrit karti hain, wo jo ek security-mutaalliq sthiti darsati hain (kya ek account ya email verify hui hai), aur wo jo tay karti hain ki data ka maalik kaun hai ya us se juda hai. Ye pehchaanna ki in khaas categories ki fields ek model par maujood hain wo hai jo ek developer ko kisi bhi route par jo us model ko chhoota hai ek explicit allowlist ki taraf le jaana chahiye, ek generic, permissive "jo bhi bheja gaya use copy karo" pattern ke bajaye.`,

    examples: [
      {
        title: 'Broken: Object.assign copies every field, including "role"',
        titleHi: 'Toota: \`Object.assign\` har field copy karta hai, "role" sameet',
        code: `app.patch("/profile", requireAuth, async (req, res) => {
  const user = await User.findById(req.userId);
  Object.assign(user, req.body); // an attacker sends { name: "...", role: "admin" }
  await user.save();
  res.json(user);
});`,
        codeJs: `app.patch("/profile", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    Object.assign(user, req.body);
    await user.save();
    res.json(user);
  } catch (err) {
    next(err);
  }
});
// { "name": "Priya Sharma", "role": "admin" } silently grants admin`,
        codeTs: `app.patch("/profile", requireAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.userId);
    Object.assign(user, req.body);
    await user.save();
    res.json(user);
  } catch (err) {
    next(err);
  }
});
// Correctly typed, completely valid TypeScript — the vulnerability is
// entirely about which fields are trusted, not a type error.`,
        output: `An ordinary { "name": "..." } request works correctly. A request
including { "role": "admin" } also "works correctly" — silently
promoting the attacker, with no error and no validation failure.`,
        explain: 'Object.assign copies every enumerable property from req.body onto the user record with no regard for whether that specific field was ever meant to be client-settable.',
        explainHi: '\`Object.assign\` \`req.body\` se har enumerable property ko user record par copy karta hai is baat ki koi parvaah bina ki wo khaas field kabhi client-settable hone ke liye thi ya nahi.',
      },
      {
        title: 'Fixed: an explicit allowlist of settable fields',
        titleHi: 'Theek: settable fields ka ek explicit allowlist',
        code: `const ALLOWED_FIELDS = ["name", "email", "bio"];
for (const field of ALLOWED_FIELDS) {
  if (req.body[field] !== undefined) user[field] = req.body[field];
}`,
        codeJs: `const ALLOWED_FIELDS = ["name", "email", "bio"];

app.patch("/profile", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    for (const field of ALLOWED_FIELDS) {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    }
    await user.save();
    res.json(user);
  } catch (err) {
    next(err);
  }
});`,
        codeTs: `const ALLOWED_FIELDS = ["name", "email", "bio"] as const;

app.patch("/profile", requireAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.userId);
    for (const field of ALLOWED_FIELDS) {
      if (req.body[field] !== undefined) {
        (user as any)[field] = req.body[field];
      }
    }
    await user.save();
    res.json(user);
  } catch (err) {
    next(err);
  }
});`,
        outputJs: `A "role": "admin" field included in the request body is now simply
never considered — it's not in ALLOWED_FIELDS, so it is never copied
onto the user record at all.`,
        outputTs: `// Identical behaviour. The "as const" gives ALLOWED_FIELDS a precise
// tuple type, documenting exactly which fields this route can touch.`,
        explain: 'Only the explicitly named fields are ever copied — the set of what a client can influence through this route is deliberate and exact, not implicitly "whatever the model happens to have."',
        explainHi: 'Sirf explicitly naam li gayi fields hi kabhi copy hoti hain — is route ke through client jo prabhaavit kar sakta hai uska set jaan-boojhkar aur sateek hai, implicitly "model ke paas jo bhi hai" nahi.',
      },
      {
        title: 'Using a Zod schema as both shape-validation and an allowlist',
        titleHi: 'Ek Zod schema ko shape-validation aur allowlist dono ki tarah istemal karna',
        code: `const schema = z.object({ name: z.string().optional(), bio: z.string().optional() });
const updates = schema.parse(req.body); // "role", if sent, is absent from the output`,
        codeJs: `const { z } = require("zod");

const profileUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  bio: z.string().max(280).optional(),
});

app.patch("/profile", requireAuth, async (req, res, next) => {
  try {
    const updates = profileUpdateSchema.parse(req.body); // strips unrecognized keys
    const user = await User.findByIdAndUpdate(req.userId, updates, { new: true });
    res.json(user);
  } catch (err) {
    next(err);
  }
});`,
        codeTs: `import { z } from "zod";

const profileUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  bio: z.string().max(280).optional(),
});

app.patch("/profile", requireAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const updates = profileUpdateSchema.parse(req.body);
    const user = await User.findByIdAndUpdate(req.userId, updates, { new: true });
    res.json(user);
  } catch (err) {
    next(err);
  }
});`,
        outputJs: `A request including "role": "admin" alongside valid fields parses
successfully, but the parsed "updates" object never contains "role"
at all — it was never declared in the schema.`,
        outputTs: `// Identical behaviour. z.infer<typeof profileUpdateSchema> gives
// "updates" a precise TypeScript type matching exactly the allowed,
// declared fields — "role" isn't even a valid property to access.`,
        explain: 'A Zod schema that only declares the fields meant to be settable serves double duty: it validates their shape AND acts as the allowlist, since anything not declared is absent from the parsed output.',
        explainHi: 'Ek Zod schema jo sirf un fields ko declare karti hai jo set-hone-laayak honi chahiye dohara kaam karti hai: ye unki shape validate karti hai AUR allowlist ki tarah kaam karti hai, kyunki jo bhi declare nahi hua wo parsed output se gayab hai.',
      },
    ],

    mistakes: [
      {
        wrong: `Object.assign(user, req.body); // copies every field the client sent, unconditionally`,
        right: `for (const field of ALLOWED_FIELDS) {
  if (req.body[field] !== undefined) user[field] = req.body[field];
}`,
        why: 'Copying every field from a request body onto a database record trusts the client to only ever send fields it should be allowed to set — an attacker has no reason to honor that assumption.',
        whyHi: 'Ek request body se har field ko ek database record par copy karna client par bharosa karta hai ki wo hamesha sirf wahi fields bhejega jinhe set karne ki use ijaazat honi chahiye — ek attacker ke paas us dhaarna ka maan rakhne ka koi kaaran nahi hai.',
      },
      {
        wrong: `// A Zod schema that validates shape but doesn't limit which fields are declared
const schema = z.record(z.string(), z.any()); // accepts and passes through any field at all`,
        right: `const schema = z.object({ name: z.string().optional(), bio: z.string().optional() });
// only explicitly declared fields ever appear in the parsed output`,
        why: 'A permissive schema that accepts arbitrary fields validates shape in name only — it provides no protection against mass assignment since it never actually limits which fields are allowed.',
        whyHi: 'Ek permissive schema jo manmaani fields accept karti hai naam mein hi shape validate karti hai — ye mass assignment ke khilaaf koi protection nahi deti kyunki ye asal mein kabhi seemit nahi karti ki kaunsi fields ijaazat-praapt hain.',
      },
      {
        wrong: `// Allowlisting fields for a "create" route but forgetting the "update" route
// uses the same underlying model with the same sensitive fields`,
        right: `// Apply the same allowlist discipline consistently across every
// route that can write to a model containing sensitive fields`,
        why: 'A sensitive field left unprotected on even one route that writes to the same model defeats the protection carefully applied everywhere else — the vulnerability only needs one unguarded path.',
        whyHi: 'Ek sanvedansheel field jo bhi ek route par bina surakshit chhodi jaati hai jo usi model ko likhta hai kahin aur savdhaani se lagu ki gayi protection ko haraati hai — khaami ko sirf ek bina-suraksha wala raasta chahiye.',
      },
    ],

    realWorld: [
      {
        en: '**Mass assignment is a well-documented, named vulnerability category with a long history of real, publicized incidents**, including cases where attackers granted themselves administrator access or manipulated account balances purely by adding an unexpected field to an otherwise ordinary request.',
        hi: '**Mass assignment ek achhi tarah documented, naam-diya-gaya vulnerability category hai jiska asli, saarvajanik roop se prachaarit incidents ka ek lamba itihaas hai**, un maamlon sameet jahan attackers ne khud ko administrator access diya ya account balances manipulate kiye poori tarah ek anapekshit field ek warna saadhaaran request mein jodkar.',
      },
      {
        en: '**Several popular ORMs and web frameworks have historically shipped with permissive default behavior around bulk-assignment of model attributes**, prompting official security guidance specifically recommending explicit allowlists (or "strong parameters"-style patterns) as the standard mitigation.',
        hi: '**Kai popular ORMs aur web frameworks ne historically model attributes ke bulk-assignment ke aas-paas permissive default vyavhaar ke saath ship kiya hai**, official security guidance ko khaas taur par explicit allowlists (ya "strong parameters"-style patterns) ko standard mitigation ki tarah recommend karne ko prerit karte hue.',
      },
      {
        en: '**Mass assignment is explicitly distinguished from general input validation in most security guidance and OWASP-style vulnerability references**, precisely because shape-valid input can still constitute a genuine privilege-escalation attack.',
        hi: '**Mass assignment ko zyaadatar security guidance aur OWASP-style vulnerability references mein aam input validation se explicitly alag kiya jaata hai**, bilkul isliye kyunki shape-valid input phir bhi ek asli privilege-escalation attack ban sakta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why can a request pass shape validation completely correctly and still constitute a mass-assignment attack?',
        qHi: 'Ek request shape validation ko poori tarah sahi tarike se pass kar sakti hai aur phir bhi ek mass-assignment attack kaise ban sakti hai?',
        a: 'Shape validation, as covered in this course\'s earlier request-validation lesson, answers a narrow, specific question about each individual field present in a request: given that a field is present, does it have the correct data type, does it match an expected format (a valid email string, a number within a reasonable range), and are required fields present at all. A well-designed validation schema answers this question thoroughly and correctly, and a field like "role" containing the string "admin" passes this kind of check with complete legitimacy — "admin" genuinely is a valid string, satisfying any type or format constraint placed on a "role" field just as correctly as "customer" or "moderator" would. The question shape validation does not answer at all is a categorically different one: regardless of whether a given field\'s VALUE is well-formed, should THIS PARTICULAR CLIENT, making THIS PARTICULAR REQUEST, be allowed to set this field\'s value at all? A "role" field being a syntactically valid string says nothing about whether an ordinary, non-administrator user updating their own profile should be permitted to change their own role — that is an authorization question about which specific fields a specific operation is permitted to touch, entirely separate from whether the field\'s contents are well-formed. A route that validates shape correctly but does not separately restrict WHICH fields it accepts and applies is answering the first question well while never asking the second one at all, which is precisely the gap mass assignment exploits: an attacker\'s malicious field can be, and often is, perfectly well-formed by every measure shape validation checks, while still representing an operation the client was never supposed to be authorized to perform.',
        aHi: 'Shape validation, jaisa is course ke pehle wale request-validation lesson mein cover kiya gaya, ek request mein maujood har akeli field ke baare mein ek sankuchit, khaas sawaal ka jawaab deti hai: ye dekhte hue ki ek field maujood hai, kya iska sahi data type hai, kya ye ek anumaanit format se match karti hai (ek vaidh email string, ek reasonable range ke andar ek number), aur kya zaroori fields bilkul maujood hain. Ek achhi tarah design ki gayi validation schema is sawaal ka poori tarah aur sahi tarike se jawaab deti hai, aur "admin" string wali "role" jaisi ek field is tarah ke check ko poori vaidhta ke saath pass karti hai — "admin" sach mein ek vaidh string hai, "role" field par rakhe gaye kisi bhi type ya format constraint ko utni hi sahi tarike se santusht karte hue jitna "customer" ya "moderator" karti. Wo sawaal jiska shape validation bilkul jawaab nahi deti ek categorically alag hai: chahe ek diyi gayi field ki VALUE achhi tarah bani hai ya nahi, kya YE KHAAS CLIENT, YE KHAAS REQUEST karte hue, is field ki value set karne ki bilkul ijaazat rakhta hai? Ek "role" field ka syntactically vaidh string hona kuch nahi kehta ki kya ek aam, non-administrator user apna profile update karte hue apna khud ka role badalne ki ijaazat rakhna chahiye — ye ek authorization sawaal hai ki koi khaas operation kaunsi khaas fields chhoone ki ijaazat rakhta hai, field ki contents achhi tarah bani hain ya nahi us se poori tarah alag. Ek route jo shape ko sahi tarike se validate karta hai par alag se seemit nahi karta ki ye KAUNSI fields accept aur lagu karta hai pehle sawaal ka achha jawaab de raha hai doosra bilkul poocha hi nahi, jo bilkul wahi gap hai jise mass assignment exploit karta hai: ek attacker ki dushta field ho sakti hai, aur aksar hoti hai, har us maapak se poori tarah achhi tarah bani jise shape validation check karti hai, jabki phir bhi ek aisa operation darsati hai jise karne ke liye client kabhi authorized hone ke liye tha hi nahi.',
      },
      {
        q: 'Why is an explicit allowlist a more reliable defense against mass assignment than relying on developers to simply remember not to include sensitive fields in a generic update pattern?',
        qHi: 'Mass assignment ke khilaaf ek explicit allowlist developers par sirf ye yaad rakhne ka bharosa karne se zyaada bharosemand defense kyun hai ki wo ek generic update pattern mein sanvedansheel fields shaamil na karein?',
        a: 'A generic update pattern like Object.assign(model, req.body) or an ORM\'s unrestricted .update(req.body) call is dangerous specifically because its safety depends entirely on an implicit, unenforced assumption: that the request body will only ever happen to contain fields the developer intended to be settable, and will never contain anything else. This assumption holds naturally for every legitimate, well-behaved client, since a legitimate client has no reason to send fields outside what the API documentation or a corresponding form actually asks for — but it provides no protection whatsoever against a deliberately malicious client, which has every incentive to send exactly the fields a legitimate client wouldn\'t, specifically because doing so might grant an unintended privilege. Relying on "developers will remember not to expose sensitive fields this way" as the actual safeguard is fragile for the same reason many purely convention-based safeguards are fragile throughout this course: it depends on every single developer, on every single route that ever touches a model containing a sensitive field, correctly remembering this specific risk, every time, indefinitely, including new developers joining a team long after the original concern was understood, and including routes added under time pressure where a quick, generic update call is tempting specifically because it\'s less code to write. An explicit allowlist converts this from an unenforced mental discipline into a structural property of the code itself: the specific, limited set of fields a given route can possibly write is spelled out directly in that route\'s own code, visible to anyone reading it, and mechanically enforced by the code\'s own logic regardless of whether the developer maintaining it that day happens to be thinking about mass assignment as a risk at all. This is the same underlying principle this course has applied elsewhere — code shaped so the safe behavior is the only behavior available, rather than trusting every developer to consistently choose it by hand.',
        aHi: '\`Object.assign(model, req.body)\` ya ek ORM ki bina-seemaa \`.update(req.body)\` call jaisa ek generic update pattern khaas taur par khatarnaak hai kyunki iski suraksha poori tarah ek implicit, na-lagu-ki-gayi dhaarna par nirbhar hai: ki request body kabhi bhi sirf wo fields hi rakhegi jinhe developer ne set-hone-laayak banaane ka iraada kiya tha, aur kabhi kuch aur nahi rakhegi. Ye dhaarna har vaidh, achhe-vyavhaar wale client ke liye prakritik roop se tikti hai, kyunki ek vaidh client ke paas API documentation ya ek mutaalliq form asal mein jo maangta hai us se baahar fields bhejne ka koi kaaran nahi hai — par ye ek jaan-boojhkar dushta client ke khilaaf bilkul koi protection nahi deti, jiske paas bilkul wahi fields bhejne ki har protsaahan hai jo ek vaidh client nahi bhejega, khaas taur par isliye kyunki aisa karna ek anapekshit privilege de sakta hai. "Developers ise is tarah expose na karna yaad rakhenge" par asli safeguard ki tarah bharosa karna usi wajah se kamzor hai jis wajah se poore is course mein kai shuddh convention-aadhaarit safeguards kamzor hain: ye is baat par nirbhar hai ki har akela developer, har akele route par jo kabhi bhi ek sanvedansheel field rakhti model ko chhuta hai, is khaas khatre ko sahi tarike se yaad rakhe, har baar, hamesha ke liye, un naye developers sameet jo asli chinta samjhi jaane ke kaafi baad team join karte hain, aur un routes sameet jo samay ke dabaav mein jode jaate hain jahan ek tez, generic update call lubhaavana hota hai khaas taur par isliye kyunki likhne ke liye kam code hai. Ek explicit allowlist ise ek na-lagu-ki-gayi mental anushaasan se code ki khud ki ek structural property mein badal deta hai: fields ka wo khaas, seemit set jo ek diya route sambhaavit roop se likh sakta hai us route ke apne code mein seedhe likha jaata hai, ise padhne waale kisi ke liye bhi dikhta hai, aur code ke apne logic dwara mechanically lagu kiya jaata hai chahe us din use maintain kar raha developer mass assignment ko ek khatre ki tarah bilkul soch bhi raha ho ya nahi. Ye wahi buniyaadi siddhaant hai jo is course ne kahin aur lagu kiya hai — code aise shape kiya gaya ki surakshit vyavhaar ekmatra upalabdh vyavhaar ho, har developer par bharosa karne ke bajaye ki wo ise consistently haath se chunega.',
      },
      {
        q: 'Why does using a Zod schema for request validation, as covered in this course\'s earlier lesson, also happen to solve mass assignment, and what would have to be true of that schema for this to hold?',
        qHi: 'Request validation ke liye Zod schema istemal karna, jaisa is course ke pehle wale lesson mein cover kiya gaya, mass assignment bhi kyun sulajhaata hai, aur ye sach hone ke liye us schema ke baare mein kya sach hona chahiye?',
        a: 'A Zod schema, when used with its .parse() method, does two things simultaneously by default: it validates that every field it explicitly declares matches the expected type and constraints (rejecting the request if not), and it produces a resulting parsed object that contains ONLY the fields explicitly declared in that schema — any additional field present in the raw input that was never declared in the schema simply does not appear anywhere in the parsed output, regardless of what value it held or how well-formed it was. This second behavior is what causes shape validation and allowlisting to become the same mechanism when a schema is constructed correctly: if a schema declares only name, email, and bio as its fields, and an attacker\'s request body additionally includes a role field, .parse() produces an output object containing only name, email, and bio (whichever of those were actually present and valid) — the role field, however well-formed its value, is simply absent from what the rest of the route\'s code ever sees or acts upon, achieving exactly the same protective effect as an explicit allowlist, without needing a separate, second mechanism. For this to actually hold, though, the schema itself must be written narrowly and deliberately, declaring only the specific fields that genuinely are meant to be settable through that particular route — a schema written permissively, such as one using a catch-all pattern that accepts and passes through arbitrary additional properties, or one that was copy-pasted from a different context and happens to include a sensitive field like role among its declared properties, would validate shape without providing any allowlisting protection at all, since the dangerous field would then be an intentionally declared, and therefore fully accepted, part of the schema rather than an unrecognized one that gets silently dropped.',
        aHi: 'Ek Zod schema, jab apni \`.parse()\` method ke saath istemal ki jaati hai, by default do cheezein ek saath karti hai: ye validate karti hai ki jo bhi field ye explicitly declare karti hai anumaanit type aur constraints se match karti hai (na karne par request reject karte hue), aur ye ek natije mein parsed object paida karti hai jismein SIRF wo fields hain jo us schema mein explicitly declare ki gayi hain — raw input mein maujood koi bhi additional field jo schema mein kabhi declare nahi ki gayi bas parsed output mein kahin bhi nahi dikhti, chahe iski value kuch bhi thi ya ye kitni achhi tarah bani thi. Ye doosra vyavhaar wo hai jo shape validation aur allowlisting ko wahi mechanism bana deta hai jab ek schema sahi tarike se banaayi jaati hai: agar ek schema sirf \`name\`, \`email\`, aur \`bio\` ko apni fields ki tarah declare karti hai, aur ek attacker ke request body mein additionally ek \`role\` field shaamil hai, \`.parse()\` ek output object paida karta hai jismein sirf \`name\`, \`email\`, aur \`bio\` hain (inmein se jo bhi asal mein maujood aur vaidh thin) — \`role\` field, iski value chahe kitni bhi achhi tarah bani ho, bas gayab hai jo route ke baaki code ne kabhi dekha ya jispar kaarvaai ki — bilkul wahi surakshaatmak asar haasil karte hue jo ek explicit allowlist karta hai, ek alag, doosri mechanism ki zaroorat bina. Par iske liye ye asal mein sach hone ke liye, schema khud ko sankuchit aur jaan-boojhkar likha jaana chahiye, sirf wo khaas fields declare karte hue jo sach mein us khaas route ke through set-hone-laayak hone ke liye hain — ek permissively likhi gayi schema, jaise ek jo ek catch-all pattern istemal karti hai jo manmaani additional properties accept aur guzarne deti hai, ya ek jo ek alag context se copy-paste ki gayi thi aur uski declared properties mein \`role\` jaisi ek sanvedansheel field shaamil hai, shape ko validate karegi bina koi bhi allowlisting protection diye bilkul, kyunki khatarnaak field tab ek jaan-boojhkar declare ki gayi, aur isliye poori tarah accepted, schema ka hissa hogi ek na-pehchaani gayi ke bajaye jo chupke se hataa di jaati hai.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken /profile route using Object.assign(user, req.body) with a User model that includes a role field. Send a request with an added "role": "admin" field and confirm it silently succeeds.',
        taskHi: 'Ek \`role\` field shaamil karti \`User\` model ke saath \`Object.assign(user, req.body)\` istemal karke toota \`/profile\` route banao. Ek joda \`"role": "admin"\` field wali request bhejo aur confirm karo ki ye chupke se safal hoti hai.',
        hint: 'Log the user\'s role both before and after the request to clearly observe the unintended privilege change.',
        hintHi: 'Request se pehle aur baad mein user ka role log karo anapekshit privilege badlaav ko saaf taur par dekhne ke liye.',
      },
      {
        task: 'Fix the route using the explicit ALLOWED_FIELDS allowlist pattern from this lesson. Resend the same malicious request and confirm the role field is now silently ignored rather than applied.',
        taskHi: 'Is lesson ke explicit \`ALLOWED_FIELDS\` allowlist pattern istemal karke route theek karo. Wahi dushta request dobara bhejo aur confirm karo ki \`role\` field ab lagu hone ke bajaye chupke se nazarandaaz hoti hai.',
        hint: 'Also confirm a legitimate request updating only name/email/bio still works exactly as before — the fix should change nothing for well-behaved clients.',
        hintHi: 'Bhi confirm karo ki sirf name/email/bio update karti ek vaidh request bilkul pehle jaisi kaam karti rehti hai — fix ko achhe-vyavhaar wale clients ke liye kuch nahi badalna chahiye.',
      },
      {
        task: 'Rewrite the same route using a Zod schema declaring only the allowed fields, following this lesson\'s third example. Confirm it produces identical protection to the manual allowlist.',
        taskHi: 'Is lesson ke teesre example ka palan karte hue sirf ijaazat-praapt fields declare karti ek Zod schema istemal karke wahi route dobara likho. Confirm karo ki ye manual allowlist jaisi hi protection paida karta hai.',
        hint: 'Log the parsed output of schema.parse(req.body) directly when a "role" field is included, and confirm it\'s simply absent from the logged object.',
        hintHi: 'Jab ek \`role\` field shaamil ho \`schema.parse(req.body)\` ka parsed output seedhe log karo, aur confirm karo ki ye logged object se bas gayab hai.',
      },
    ],

    keyTakeaways: [
      'Mass assignment is distinct from general request validation: shape validation checks whether provided fields have the correct type, but says nothing about whether the client should be allowed to set that field at all.',
      'A route that copies every field from a request body directly onto a database record (Object.assign, or an unrestricted ORM .update()) trusts the client to never send a field it shouldn\'t — an attacker has no reason to honor that.',
      'The reliable fix is an explicit allowlist of exactly which fields a given route may write, rather than implicitly trusting "whatever fields happen to be present" in the request.',
      'A Zod (or similar) schema that only declares the fields meant to be settable serves double duty: validating their shape AND acting as the allowlist, since anything undeclared is absent from the parsed output.',
      'Fields controlling privilege (role, isAdmin), money (balance, creditLimit), verification state, or data ownership are the highest-risk fields to leave un-allowlisted on any model.',
      'The same allowlist discipline must be applied consistently across every route touching a sensitive model — one unguarded route is enough to defeat protection applied carefully everywhere else.',
    ],
    keyTakeawaysHi: [
      'Mass assignment aam request validation se alag hai: shape validation check karta hai ki di gayi fields ka sahi type hai, par kuch nahi kehta ki kya client ko us field ko bilkul set karne ki ijaazat honi chahiye.',
      'Ek route jo request body se har field ko seedhe ek database record par copy karta hai (\`Object.assign\`, ya ek bina-seemaa ORM \`.update()\`) client par bharosa karta hai ki wo kabhi ek aisi field nahi bhejega jo use nahi bhejni chahiye — ek attacker ke paas us maan rakhne ka koi kaaran nahi hai.',
      'Bharosemand fix bilkul un fields ka ek explicit allowlist hai jo ek diya route likh sakta hai, request mein "jo bhi fields maujood hon" par implicitly bharosa karne ke bajaye.',
      'Ek Zod (ya isi tarah ki) schema jo sirf un fields ko declare karti hai jo set-hone-laayak honi chahiye dohara kaam karti hai: unki shape validate karna AUR allowlist ki tarah kaam karna, kyunki jo bhi na-declare kiya gaya wo parsed output se gayab hai.',
      'Privilege niyantrit karti fields (\`role\`, \`isAdmin\`), paisa (\`balance\`, \`creditLimit\`), verification sthiti, ya data ownership kisi bhi model par bina-allowlist chhodne ke liye sabse zyaada khatre wali fields hain.',
      'Wahi allowlist anushaasan har us route mein consistently lagu kiya jaana chahiye jo ek sanvedansheel model ko chhoota hai — ek bina-suraksha wala route kahin aur savdhaani se lagu ki gayi protection ko haraane ke liye kaafi hai.',
    ],
  },
];
