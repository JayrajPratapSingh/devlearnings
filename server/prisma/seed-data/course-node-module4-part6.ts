/**
 * Node.js Complete Course — Module 4: Authentication & Security, lesson 6.
 *
 * Authorization and RBAC: why "is this user logged in" (authentication,
 * covered in this module's JWT lesson) is a completely different question
 * from "is this specific logged-in user ALLOWED to do this specific
 * thing" (authorization) — and why confusing the two lets any regular,
 * authenticated user call an admin-only route. Broken example: an
 * "/admin/users/:id" delete route protected only by requireAuth — it
 * correctly rejects anyone not logged in, but happily lets ANY logged-in
 * user, including an ordinary customer, delete another user's account,
 * since nothing ever checks whether the caller is actually an admin.
 * Fixed with a role column on the user, a role embedded in the JWT payload
 * at login, and a requireRole() middleware that runs after requireAuth and
 * rejects with 403 (not 401) when an authenticated user lacks the required
 * role. Also covers the same stale-role-in-token problem this course's
 * sessions-vs-tokens lesson already established for bans, and a brief look
 * at permission-based systems beyond simple roles.
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

export const NODE_MODULE_4_PART6: CourseLesson[] = [
  {
    slug: 'authorization-and-rbac',
    title: 'Authorization and RBAC: Logged In Is Not the Same as Allowed',
    titleHi: 'Authorization Aur RBAC: Login Hona Aur Ijaazat Hona Ek Jaisa Nahi Hai',
    description: 'A regular customer, with a completely valid, genuine login, deletes another customer\'s entire account through an "admin-only" route — because the route only ever checked whether someone was logged in, never whether they were actually an admin.',
    descriptionHi: 'Ek aam customer, ek poori tarah valid, asli login ke saath, ek "admin-only" route se ek doosre customer ka poora account delete kar deta hai — kyunki route ne sirf ye check kiya ki koi login hai ya nahi, kabhi ye check nahi kiya ki wo asal mein admin hai ya nahi.',
    difficulty: 'HARD',
    duration: 24,
    order: 6,

    analogy: {
      en: '**A hotel that checks every guest\'s room key at the front door — confirming they are genuinely a paying guest of THIS hotel — but never checks which specific floor or room that particular key actually opens, letting any confirmed guest walk into any room, including the manager\'s own office.** A route protected only by "is this person logged in" is like a hotel security guard whose entire job is checking that whoever is walking through the lobby is a real, currently-checked-in guest of the hotel — a completely legitimate, necessary check, correctly turning away anyone off the street who has no booking at all. But once that guard confirms "yes, this is a genuine guest," they wave the person past toward EVERY door in the building — the guest floors, the staff-only areas, the manager\'s private office, the cash room — because the guard\'s job was only ever defined as confirming the person belongs in the hotel AT ALL, never as checking which SPECIFIC doors that particular guest\'s key is actually meant to open. A guest who is completely honest, correctly checked in, and has done nothing wrong at all can, under this system, walk straight into the manager\'s office and take whatever they like, not because they broke in, but because nobody ever set up a second check for "does this specific, genuine guest\'s key actually work on THIS specific door." A properly run hotel checks two separate things at two separate points: first, at the lobby, that someone is a real guest at all; second, at every individual door, whether THIS guest\'s specific key is actually cut to open THIS specific door — a guest can pass the first check perfectly and still be correctly stopped at the second.',
      hi: '**Ek hotel jo har guest ki room key front door par check karta hai — confirm karte hue ki wo sach mein IS hotel ka ek paying guest hai — par kabhi check nahi karta ki wo khaas key asal mein kaunsa floor ya room kholti hai, kisi bhi confirm ho chuke guest ko kisi bhi room mein jaane dete hue, manager ke apne office sameet.** Sirf "kya ye insaan login hai" se surakshit ek route ek aise hotel security guard jaisa hai jiska poora kaam ye check karna hai ki lobby se guzar raha koi bhi insaan hotel ka ek asli, abhi-checked-in guest hai — ek poori tarah legitimate, zaruri check, sahi tarike se raaste se kisi ko bhi mana karte hue jiski koi booking hi nahi hai. Par ek baar wo guard confirm kar le "haan, ye ek asli guest hai," wo insaan ko building mein HAR akele darwaaze ki taraf jaane deta hai — guest floors, staff-only areas, manager ka private office, cash room — kyunki guard ka kaam sirf isi tarah define kiya gaya tha ki insaan hotel mein BILKUL belong karta hai, ye check karne ke liye kabhi nahi ki us khaas guest ki key asal mein kaunse KHAAS darwaaze kholne ke liye maani gayi hai. Ek guest jo poori tarah imandaar hai, sahi tarike se checked in hai, aur kuch bhi galat nahi kiya, is system ke neeche, seedha manager ke office mein chala ja sakta hai aur jo bhi chahe le sakta hai, isliye nahi ki unhone break-in kiya, balki isliye kyunki kisi ne kabhi "does this specific, genuine guest ki key asal mein IS khaas darwaaze par kaam karti hai" ke liye ek doosri check set up nahi ki. Ek theek tarike se chalaaya hotel do alag cheezein do alag points par check karta hai: pehla, lobby mein, ki koi bhi asal mein ek asli guest hai; doosra, har akele darwaaze par, kya IS guest ki khaas key asal mein IS khaas darwaaze ko kholne ke liye kaati gayi hai — ek guest pehli check poori tarah paas kar sakta hai aur phir bhi doosri par sahi tarike se roka jaa sakta hai.',
    },

    simple: `**Start broken.** An admin-only route protected only by this module\'s earlier \`requireAuth\` middleware — confirming someone is logged in, but never checking what they are logged in AS:

\`\`\`js
app.delete("/admin/users/:id", requireAuth, async (req, res, next) => {
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [req.params.id]);
    res.json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
});
\`\`\`

\`requireAuth\` (built in this module\'s JWT lesson) does its actual job perfectly: it correctly rejects any request with no token, an invalid token, or an expired one — this route genuinely cannot be reached by someone who is not logged in at all, which is a real, necessary check. The catastrophic gap is what happens for someone who genuinely IS logged in, with a perfectly valid, unexpired token, but who is simply an ordinary customer, not an administrator: \`requireAuth\` verifies the token, confirms this is a real, authenticated user, attaches their \`userId\` to \`req\`, and calls \`next()\` — and the route handler then deletes whatever user ID was requested, with absolutely nothing in this code ever asking "wait, is THIS specific authenticated user actually allowed to delete other people\'s accounts?" Authentication (proving who someone is) and authorization (checking what that specific person is allowed to do) are two genuinely different questions, and this route only ever asks the first one — any regular, honestly-logged-in customer can send a request to this exact URL and delete any other user\'s account, entirely because nobody ever checked their ROLE, only their IDENTITY.

**The fix: a requireRole() middleware, checked after requireAuth, rejecting with 403**

\`\`\`js
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({ error: "Forbidden: insufficient permissions" });
    }
    next();
  };
}

app.delete("/admin/users/:id", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [req.params.id]);
    res.json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
});
\`\`\`

\`\`\`ts
function requireRole(...allowedRoles: string[]) {
  return (req: Request & { userRole?: string }, res: Response, next: NextFunction): void => {
    if (!req.userRole || !allowedRoles.includes(req.userRole)) {
      res.status(403).json({ error: "Forbidden: insufficient permissions" });
      return;
    }
    next();
  };
}

app.delete(
  "/admin/users/:id",
  requireAuth,
  requireRole("admin"),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await pool.query("DELETE FROM users WHERE id = $1", [req.params.id]);
      res.json({ message: "User deleted" });
    } catch (err) {
      next(err);
    }
  }
);
\`\`\`

Following this course\'s Express middleware and routing lessons, \`requireAuth\` and \`requireRole("admin")\` are chained as two separate, deliberately ordered checks: \`requireAuth\` runs first and answers "is this a genuine, currently-valid authenticated user at all," attaching that user\'s role (\`req.userRole\`) alongside their identity; \`requireRole("admin")\` runs second and answers a completely different question — "given that this IS a genuine authenticated user, is their specific role one that is allowed to reach this route at all." A regular customer now passes the first check (they are genuinely logged in) but is correctly stopped at the second, receiving \`403 Forbidden\` — a status code that specifically means "I know exactly who you are, and the answer is still no," distinct from \`401 Unauthorized\`, which means "I don\'t know who you are at all." The route\'s actual deletion logic is now only ever reached by a request that has passed BOTH checks.`,

    simpleHi: `**Toote hue se shuru.** Ek admin-only route jo sirf is module ke pehle wale \`requireAuth\` middleware se surakshit hai — confirm karte hue ki koi login hai, par kabhi check na karte hue ki wo KIS roop mein login hai:

\`\`\`js
app.delete("/admin/users/:id", requireAuth, async (req, res, next) => {
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [req.params.id]);
    res.json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
});
\`\`\`

\`requireAuth\` (is module ke JWT lesson mein banaaya gaya) apna asli kaam poori tarah karta hai: ye sahi tarike se kisi bhi request ko reject karta hai jismein koi token nahi, ek invalid token, ya ek expired token hai — ye route sach mein us insaan tak nahi pahuncha ja sakta jo bilkul login nahi hai, jo ek asli, zaruri check hai. Vinaashak kami ye hai ki kya hota hai us insaan ke liye jo sach mein LOGIN HAI, ek poori tarah valid, na-expire-hue token ke saath, par jo bas ek aam customer hai, koi administrator nahi: \`requireAuth\` token verify karta hai, confirm karta hai ki ye ek asli, authenticated user hai, unki \`userId\` ko \`req\` se attach karta hai, aur \`next()\` bulaata hai — aur route handler phir jo bhi user ID maangi gayi thi use delete kar deta hai, is code mein bilkul kuch bhi kabhi ye na poochte hue "ruko, kya YE khaas authenticated user asal mein doosre logon ke accounts delete karne ki ijaazat rakhta hai?" Authentication (kaun hai ye saabit karna) aur authorization (check karna ki wo khaas insaan kya karne ki ijaazat rakhta hai) do sach mein alag sawaal hain, aur ye route kabhi sirf pehla wala poochta hai — koi bhi aam, imandaari-se-login-hua customer bilkul is URL par ek request bhej sakta hai aur kisi bhi doosre user ka account delete kar sakta hai, poori tarah isliye kyunki kisi ne kabhi unka ROLE check nahi kiya, sirf unki PEHCHAAN.

**Fix: ek \`requireRole()\` middleware, \`requireAuth\` ke baad check hua, \`403\` se reject karta hua**

\`\`\`js
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({ error: "Forbidden: insufficient permissions" });
    }
    next();
  };
}

app.delete("/admin/users/:id", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [req.params.id]);
    res.json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
});
\`\`\`

\`\`\`ts
function requireRole(...allowedRoles: string[]) {
  return (req: Request & { userRole?: string }, res: Response, next: NextFunction): void => {
    if (!req.userRole || !allowedRoles.includes(req.userRole)) {
      res.status(403).json({ error: "Forbidden: insufficient permissions" });
      return;
    }
    next();
  };
}

app.delete(
  "/admin/users/:id",
  requireAuth,
  requireRole("admin"),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await pool.query("DELETE FROM users WHERE id = $1", [req.params.id]);
      res.json({ message: "User deleted" });
    } catch (err) {
      next(err);
    }
  }
);
\`\`\`

Is course ke Express middleware aur routing lessons ka palan karte hue, \`requireAuth\` aur \`requireRole("admin")\` do alag, jaan-boojhkar tarteeb ki gayi checks ki tarah jode jaate hain: \`requireAuth\` pehle chalta hai aur poochta hai "kya ye bilkul ek asli, abhi-valid authenticated user hai," us user ke role (\`req.userRole\`) ko unki pehchaan ke saath attach karte hue; \`requireRole("admin")\` doosra chalta hai aur ek poori tarah alag sawaal poochta hai — "ye maante hue ki ye asal mein ek asli authenticated user HAI, kya unka khaas role aisa hai jise is route tak bilkul pahunchne ki ijaazat hai." Ek aam customer ab pehli check paas karta hai (wo sach mein login hain) par doosri par sahi tarike se roke jaate hain, \`403 Forbidden\` paate hue — ek status code jiska khaas matlab hai "main bilkul jaanta hoon tum kaun ho, aur jawaab abhi bhi nahi hai," \`401 Unauthorized\` se alag, jiska matlab hai "main bilkul nahi jaanta tum kaun ho." Route ki asli deletion logic ab sirf ek aisi request se pahunchi jaati hai jo DONO checks paas kar chuki ho.`,

    content: `## Where a user's role actually lives, and the same staleness trade-off this course already covered

\`\`\`js
// Option A: embed the role directly in the JWT payload at login (fast, no DB lookup per request)
const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

// requireAuth then reads the role straight off the verified token
req.userRole = decoded.role;
\`\`\`

\`\`\`js
// Option B: look the role up fresh from the database on every request (always current, costs a query)
const result = await pool.query("SELECT role FROM users WHERE id = $1", [decoded.userId]);
req.userRole = result.rows[0].role;
\`\`\`

Embedding \`role\` directly in the JWT payload at login (Option A) avoids a database lookup on every single request, following the same performance reasoning this course\'s JWT lesson gave for embedding \`userId\` — but it reintroduces EXACTLY the staleness problem this course\'s sessions-vs-tokens lesson already covered for a user being banned: if an administrator demotes someone from \`admin\` to \`user\` right now, that person\'s EXISTING, still-unexpired token keeps saying \`role: "admin"\` until it naturally expires, meaning they can keep accessing admin routes for up to the remainder of that token\'s lifetime despite no longer genuinely holding that role. Looking the role up fresh from the database on every request (Option B) closes this gap immediately, at the cost of one additional query per request — the exact same trade-off, for the exact same underlying reason, that this course\'s sessions-vs-tokens lesson already worked through for bans; role changes that need to take effect instantly (revoking admin access from someone being investigated, for instance) call for the database-lookup approach, while less urgent role changes can reasonably tolerate a short delay bounded by the token\'s expiration.

## RBAC (Role-Based Access Control): the general pattern this lesson\'s example is one instance of

\`\`\`js
const ROLE_PERMISSIONS = {
  admin: ["delete_user", "view_all_orders", "edit_pricing"],
  support: ["view_all_orders"],
  customer: [],
};

function requirePermission(permission) {
  return (req, res, next) => {
    const allowed = ROLE_PERMISSIONS[req.userRole] || [];
    if (!allowed.includes(permission)) {
      return res.status(403).json({ error: "Forbidden: insufficient permissions" });
    }
    next();
  };
}

app.delete("/admin/users/:id", requireAuth, requirePermission("delete_user"), deleteUserHandler);
\`\`\`

This lesson\'s \`requireRole("admin")\` is the simplest possible version of a broader, well-established pattern called Role-Based Access Control (RBAC): each user is assigned one or more ROLES, and each role is associated with a specific set of PERMISSIONS (actions that role is allowed to perform) — checking authorization then means checking whether the current user\'s role includes the specific permission the current route requires, rather than hardcoding a specific role name directly into each route\'s middleware. This indirection matters as an application grows: adding a new \`support\` role that can view orders but not delete users, for instance, means updating one central permission map rather than hunting down and individually rewriting every route\'s hardcoded role check — the underlying principle (authenticate first, then separately check what the authenticated identity is specifically allowed to do) is identical to this lesson\'s simpler role-check version; RBAC is this same idea generalized to handle more roles and more fine-grained permissions cleanly.

## Authorization is not just "admin vs. everyone else": checking ownership too

\`\`\`js
// Not just "is this user an admin" — "does this specific order belong to this specific user"
app.get("/orders/:id", requireAuth, async (req, res, next) => {
  const result = await pool.query("SELECT * FROM orders WHERE id = $1", [req.params.id]);
  const order = result.rows[0];

  if (!order || order.user_id !== req.userId) {
    return res.status(403).json({ error: "Forbidden" });
  }

  res.json(order);
});
\`\`\`

Authorization is not only about role-based checks like "admin vs. regular user" — a genuinely common and easy-to-miss authorization bug involves an ordinary, correctly-authenticated user accessing another ordinary user\'s data simply by changing an ID in a URL (fetching \`/orders/42\` when order 42 actually belongs to someone else entirely). \`requireAuth\` alone confirms the request comes from a genuine, logged-in user; it says nothing about whether THIS specific resource being requested actually belongs to THAT specific user — this route\'s explicit \`order.user_id !== req.userId\` check is itself a form of authorization, verifying ownership rather than a role, and is just as essential as a role check whenever a route returns or modifies a specific piece of a specific user\'s own data.`,

    contentHi: `## Ek user ka role asal mein kahan rehta hai, aur wahi staleness trade-off jo ye course pehle cover kar chuka hai

\`\`\`js
// Option A: login par role ko seedha JWT payload mein embed karo (tez, prati-request koi DB lookup nahi)
const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

// requireAuth phir role ko verify hue token se seedha padhta hai
req.userRole = decoded.role;
\`\`\`

\`\`\`js
// Option B: har request par database se role taaza dhoondho (hamesha abhi ka, ek query ki keemat)
const result = await pool.query("SELECT role FROM users WHERE id = $1", [decoded.userId]);
req.userRole = result.rows[0].role;
\`\`\`

\`role\` ko seedha login par JWT payload mein embed karna (Option A) har akeli request par ek database lookup se bachaata hai, is course ke JWT lesson ne \`userId\` embed karne ke liye di gayi wahi performance reasoning ka palan karte hue — par ye BILKUL wahi staleness samasya dobara laata hai jise is course ka sessions-vs-tokens lesson pehle ek user ke ban hone ke liye cover kar chuka hai: agar ek administrator abhi kisi ko \`admin\` se \`user\` mein demote karta hai, us insaan ka MAUJOODA, abhi-tak-na-expire-hua token \`role: "admin"\` kehta rehta hai jab tak wo naisargik taur par expire na ho, matlab wo admin routes tak access karte reh sakte hain us token ki baaki bachi umar tak, ab sach mein wo role rakhte na hue bhi. Har request par database se role taaza dhoondhna (Option B) is kami ko turant band karta hai, ek additional query prati request ki keemat par — bilkul wahi trade-off, bilkul usi underlying wajah se, jise is course ka sessions-vs-tokens lesson pehle bans ke liye sulzha chuka hai; role changes jinhe turant lagu hona chahiye (jaise ek jaanch ke daayre mein aaye kisi se admin access revoke karna) database-lookup tarike ki maang karte hain, jabki kam turant role changes ek chhoti deri sehan kar sakte hain jo token ki expiration se bandhi hai.

## RBAC (Role-Based Access Control): aam pattern jiska is lesson ka example ek udaharan hai

\`\`\`js
const ROLE_PERMISSIONS = {
  admin: ["delete_user", "view_all_orders", "edit_pricing"],
  support: ["view_all_orders"],
  customer: [],
};

function requirePermission(permission) {
  return (req, res, next) => {
    const allowed = ROLE_PERMISSIONS[req.userRole] || [];
    if (!allowed.includes(permission)) {
      return res.status(403).json({ error: "Forbidden: insufficient permissions" });
    }
    next();
  };
}

app.delete("/admin/users/:id", requireAuth, requirePermission("delete_user"), deleteUserHandler);
\`\`\`

Is lesson ka \`requireRole("admin")\` ek badi, achhi tarah sthaapit pattern ka sabse saadha mumkin version hai jise Role-Based Access Control (RBAC) kehte hain: har user ko ek ya zyaada ROLES diye jaate hain, aur har role ek khaas PERMISSIONS ke set se juda hota hai (actions jo wo role karne ki ijaazat rakhta hai) — authorization check karna phir matlab hai check karna ki abhi ke user ke role mein wo khaas permission shaamil hai jise abhi ka route maangta hai, ek khaas role naam ko seedha har route ke middleware mein hardcode karne ke bajaye. Ye indirection maayne rakhta hai jaise application badhta hai: ek naya \`support\` role jodna jo orders dekh sake par users delete na kar sake, misal ke taur par, matlab hai ek kendriya permission map update karna har route ke hardcoded role check ko dhoondhne aur individually dobara likhne ke bajaye — underlying principle (pehle authenticate karo, phir alag se check karo ki authenticated pehchaan ko kya khaas taur par karne ki ijaazat hai) bilkul isi lesson ke saadhe role-check version jaisa hai; RBAC yehi socch hai zyaada roles aur zyaada baarik permissions ko saaf tarike se sambhaalne ke liye general ki hui.

## Authorization sirf "admin vs. baaki sab" nahi hai: ownership bhi check karna

\`\`\`js
// Sirf "kya ye user ek admin hai" nahi — "kya ye khaas order is khaas user ka hai"
app.get("/orders/:id", requireAuth, async (req, res, next) => {
  const result = await pool.query("SELECT * FROM orders WHERE id = $1", [req.params.id]);
  const order = result.rows[0];

  if (!order || order.user_id !== req.userId) {
    return res.status(403).json({ error: "Forbidden" });
  }

  res.json(order);
});
\`\`\`

Authorization sirf role-based checks jaise "admin vs. aam user" ke baare mein nahi hai — ek sach mein aam aur chhoot-jaane-mein-aasaan authorization bug ek aam, sahi-tarike-se-authenticated user ko shaamil karta hai jo bas ek URL mein ek ID badalkar ek doosre aam user ka data access karta hai (\`/orders/42\` fetch karna jab order 42 asal mein kisi aur ka hai poori tarah). \`requireAuth\` akela confirm karta hai ki request ek asli, logged-in user se aati hai; ye is baare mein kuch nahi kehta ki kya maangi jaa rahi ye khaas resource asal mein US khaas user ki hai — is route ka explicit \`order.user_id !== req.userId\` check khud authorization ka ek roop hai, ek role ke bajaye ownership verify karte hue, aur utna hi zaruri hai jitna ek role check jab bhi ek route ek khaas user ke apne khaas data ka hissa lautaata ya badalta hai.`,

    examples: [
      {
        title: 'Broken: any logged-in user can delete any other user',
        titleHi: 'Toota: koi bhi login-hua user kisi bhi doosre user ko delete kar sakta hai',
        code: `app.delete("/admin/users/:id", requireAuth, async (req, res, next) => {
  await pool.query("DELETE FROM users WHERE id = $1", [req.params.id]);
  res.json({ message: "User deleted" });
});
// requireAuth confirms someone is logged in — never checks WHAT they are`,
        codeJs: `app.delete("/admin/users/:id", requireAuth, async (req, res, next) => {
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [req.params.id]);
    res.json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
});`,
        codeTs: `app.delete("/admin/users/:id", requireAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [req.params.id]);
    res.json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
});
// Correctly typed, completely valid TypeScript — the vulnerability is
// entirely about a missing role check, not a type or logic error.`,
        output: `A regular, genuinely authenticated customer sends DELETE
/admin/users/999 with their own valid token and successfully deletes
another user's account — nothing in this route ever checked whether
the caller was actually an administrator.`,
        explain: 'requireAuth answers "is this a real, logged-in user" — it was never designed to answer "is this specific user an administrator," and this route never asks that second question at all.',
        explainHi: '\`requireAuth\` jawaab deta hai "kya ye ek asli, login-hua user hai" — ye kabhi "kya ye khaas user ek administrator hai" ka jawaab dene ke liye design nahi hua tha, aur ye route kabhi wo doosra sawaal poochta hi nahi.',
      },
      {
        title: 'Fixed: requireRole rejects an authenticated but unauthorized user with 403',
        titleHi: 'Theek: \`requireRole\` ek authenticated par unauthorized user ko \`403\` se reject karta hai',
        code: `function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.userRole)) return res.status(403).json({ error: "Forbidden" });
    next();
  };
}
app.delete("/admin/users/:id", requireAuth, requireRole("admin"), deleteUserHandler);`,
        codeJs: `function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({ error: "Forbidden: insufficient permissions" });
    }
    next();
  };
}

app.delete("/admin/users/:id", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [req.params.id]);
    res.json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
});`,
        codeTs: `interface AuthedRequest extends Request {
  userId?: number;
  userRole?: string;
}

function requireRole(...allowedRoles: string[]) {
  return (req: AuthedRequest, res: Response, next: NextFunction): void => {
    if (!req.userRole || !allowedRoles.includes(req.userRole)) {
      res.status(403).json({ error: "Forbidden: insufficient permissions" });
      return;
    }
    next();
  };
}

app.delete(
  "/admin/users/:id",
  requireAuth,
  requireRole("admin"),
  async (req: AuthedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      await pool.query("DELETE FROM users WHERE id = $1", [req.params.id]);
      res.json({ message: "User deleted" });
    } catch (err) {
      next(err);
    }
  }
);`,
        outputJs: `The same regular customer's valid token now correctly receives 403
Forbidden — requireAuth confirms they are genuinely logged in, but
requireRole("admin") correctly stops them because their role is
"customer," not "admin."`,
        outputTs: `// Identical behaviour. AuthedRequest documents both fields requireAuth
// attaches — userId (identity) and userRole (what they're allowed to do) —
// consistent with this module's earlier JWT lesson's typing pattern.`,
        explain: 'Two separate middleware functions answer two separate questions in sequence — authentication first, then authorization — and only a request passing both ever reaches the actual deletion logic.',
        explainHi: 'Do alag middleware functions kram mein do alag sawaalon ka jawaab dete hain — pehle authentication, phir authorization — aur sirf ek request jo dono paas karti hai asli deletion logic tak pahunchti hai.',
      },
      {
        title: 'Authorization beyond roles: checking resource ownership',
        titleHi: 'Roles se aage authorization: resource ownership check karna',
        code: `const order = (await pool.query("SELECT * FROM orders WHERE id = $1", [req.params.id])).rows[0];
if (!order || order.user_id !== req.userId) return res.status(403).json({ error: "Forbidden" });`,
        codeJs: `app.get("/orders/:id", requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM orders WHERE id = $1", [req.params.id]);
    const order = result.rows[0];

    if (!order || order.user_id !== req.userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
});`,
        codeTs: `app.get("/orders/:id", requireAuth, async (req: AuthedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await pool.query<{ id: number; user_id: number }>(
      "SELECT * FROM orders WHERE id = $1",
      [req.params.id]
    );
    const order = result.rows[0];

    if (!order || order.user_id !== req.userId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
});`,
        outputJs: `A regular customer requesting their own order succeeds; the same
customer requesting a URL with a different user's order ID correctly
receives 403 — no role check is involved at all, only a direct
ownership comparison.`,
        outputTs: `// Identical behaviour. This is authorization too, just checked by
// ownership rather than by role — both are instances of "is this
// authenticated identity allowed to do this specific thing."`,
        explain: 'A role check alone would not have caught this — the customer genuinely has the "customer" role and is allowed to view orders in general; the missing check is specifically about whose order this one is.',
        explainHi: 'Akela role check ise nahi pakadta — customer sach mein "customer" role rakhta hai aur aam taur par orders dekhne ki ijaazat rakhta hai; missing check khaas taur par iske baare mein hai ki ye order kiska hai.',
      },
    ],

    mistakes: [
      {
        wrong: `app.delete("/admin/users/:id", requireAuth, deleteUserHandler);
// any authenticated user, regardless of role, can reach this route`,
        right: `app.delete("/admin/users/:id", requireAuth, requireRole("admin"), deleteUserHandler);
// only an authenticated user whose role is "admin" can reach it`,
        why: 'requireAuth only confirms someone is genuinely logged in — it says nothing about which role that specific person holds, so a sensitive route needs a separate, explicit role check on top of it.',
        whyHi: '\`requireAuth\` sirf confirm karta hai ki koi sach mein login hai — ye is baare mein kuch nahi kehta ki wo khaas insaan kaunsa role rakhta hai, isliye ek sensitive route ko uske oopar ek alag, explicit role check chahiye.',
      },
      {
        wrong: `if (!allowedRoles.includes(req.userRole)) return res.status(401).json({ error: "..." });
// using 401 for an authenticated-but-not-permitted user`,
        right: `if (!allowedRoles.includes(req.userRole)) return res.status(403).json({ error: "..." });
// 403 correctly signals "I know who you are, and the answer is still no"`,
        why: '401 means the server does not know who the caller is at all; 403 means the caller\'s identity is fully known and confirmed, but that identity is still not permitted — using the wrong code misleads the client about which problem actually occurred.',
        whyHi: '\`401\` ka matlab hai server ko bilkul nahi pata caller kaun hai; \`403\` ka matlab hai caller ki pehchaan poori tarah jaani-pehchaani aur confirm hai, par wo pehchaan abhi bhi ijaazat nahi rakhti — galat code istemal karna client ko galat samajh deta hai ki asal mein kaunsi samasya hui.',
      },
      {
        wrong: `app.get("/orders/:id", requireAuth, async (req, res) => {
  const order = (await pool.query("SELECT * FROM orders WHERE id = $1", [req.params.id])).rows[0];
  res.json(order); // never checks whether this order belongs to req.userId`,
        right: `if (!order || order.user_id !== req.userId) return res.status(403).json({ error: "Forbidden" });
res.json(order);`,
        why: 'requireAuth confirms the caller is a genuine, logged-in user, but says nothing about whether the SPECIFIC resource being requested actually belongs to them — this needs its own explicit ownership check.',
        whyHi: '\`requireAuth\` confirm karta hai caller ek asli, login-hua user hai, par ye kuch nahi kehta ki kya maangi jaa rahi KHAAS resource asal mein unki hai — ise apna alag explicit ownership check chahiye.',
      },
    ],

    realWorld: [
      {
        en: '**"Broken Access Control" (the general category covering missing or incorrect authorization checks, including exactly this lesson\'s admin-route scenario) has topped OWASP\'s Top 10 web application security risks list in recent years**, reflecting how commonly this specific mistake actually occurs in real production applications.',
        hi: '**"Broken Access Control" (missing ya galat authorization checks ko cover karti aam category, bilkul is lesson ke admin-route scenario sameet) haal ke saalon mein OWASP ki Top 10 web application security risks list mein sabse oopar rahi hai**, zaahir karte hue ki ye khaas galti asli production applications mein asal mein kitni aam hai.',
      },
      {
        en: '**Role-Based Access Control (RBAC) is a standard, widely implemented authorization model used across essentially every major cloud platform, enterprise application, and content management system** — AWS IAM roles, database permission systems, and countless SaaS admin panels all use some form of this exact pattern.',
        hi: '**Role-Based Access Control (RBAC) ek standard, vyapak taur par lagu kiya gaya authorization model hai jo lagbhag har mukhya cloud platform, enterprise application, aur content management system mein istemal hota hai** — AWS IAM roles, database permission systems, aur be-shumaar SaaS admin panels sab bilkul isi pattern ka kuch roop istemal karte hain.',
      },
      {
        en: '**Real, publicly documented data breaches have resulted from exactly this class of bug** — a regular authenticated user reaching an administrative function or another user\'s private data purely because a role or ownership check was missing, not because any password or token was ever actually compromised.',
        hi: '**Asli, saarvajanik roop se documented data breaches bilkul is kism ke bug se hue hain** — ek aam authenticated user ek administrative function ya doosre user ke private data tak poori tarah isliye pahunchta hai kyunki ek role ya ownership check maujood nahi thi, isliye nahi ki koi password ya token asal mein kabhi compromise hua.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between authentication and authorization, and why does a route protected only by requireAuth remain vulnerable even when the authentication itself works perfectly correctly?',
        qHi: 'Authentication aur authorization mein kya farak hai, aur ek route jo sirf \`requireAuth\` se surakshit hai vulnerable kyun rehta hai chahe authentication khud poori tarah sahi kaam kare?',
        a: 'Authentication answers the question "who is making this request" — verifying that a claimed identity is genuine, typically by checking a password (at login) or a signed token (on subsequent requests), following this module\'s bcrypt and JWT lessons. Authorization answers a completely separate question, asked only AFTER authentication has already succeeded: "given that we now know exactly who this is, is this specific, genuinely-identified person allowed to do the specific thing they are asking to do." A route protected only by requireAuth performs authentication correctly and completely — it genuinely, accurately confirms whether the caller is a real, currently-valid, logged-in user — but it never performs the second, distinct check at all. This means the route\'s vulnerability has nothing to do with any flaw in the authentication mechanism itself; a regular, honestly-authenticated customer is not exploiting any weakness in requireAuth, bypassing any token verification, or forging any credential — they are using their own completely genuine, correctly-issued login exactly as intended, and reaching a route that was simply never taught to ask whether their specific role or identity was actually permitted to perform this specific action. The vulnerability is a missing check, not a broken one — authentication succeeding correctly is precisely what exposes the gap, since it means every genuinely logged-in user, regardless of role, reaches the same unprotected logic.',
        aHi: 'Authentication is sawaal ka jawaab deta hai "ye request kaun bana raha hai" — verify karte hue ki ek daava ki gayi pehchaan asli hai, aam taur par ek password check karke (login par) ya ek signed token (baad ki requests par), is module ke bcrypt aur JWT lessons ka palan karte hue. Authorization ek poori tarah alag sawaal ka jawaab deta hai, sirf authentication ke pehle se safal hone ke BAAD poocha gaya: "ye maante hue ki ab humein bilkul pata hai ye kaun hai, kya ye khaas, sach mein-pehchaana-gaya insaan wo khaas kaam karne ki ijaazat rakhta hai jo wo maang raha hai." Ek route jo sirf \`requireAuth\` se surakshit hai authentication sahi aur poori tarah karta hai — ye sach mein, sateek taur par confirm karta hai ki caller ek asli, abhi-valid, login-hua user hai — par ye kabhi doosri, alag check bilkul karta hi nahi. Iska matlab hai route ki vulnerability ka authentication mechanism khud mein kisi bhi kami se koi lena-dena nahi hai; ek aam, imandaari-se-authenticated customer \`requireAuth\` mein koi kamzori exploit nahi kar raha, koi token verification bypass nahi kar raha, ya koi credential forge nahi kar raha — wo apna poori tarah asli, sahi-taur-par-issue-hua login bilkul iraade ke hisaab se istemal kar rahe hain, aur ek aise route tak pahunch rahe hain jise bas kabhi ye poochne ki taalim nahi di gayi ki kya unka khaas role ya pehchaan asal mein ye khaas action karne ki ijaazat rakhti hai. Vulnerability ek missing check hai, koi toota hua nahi — authentication sahi tarike se safal hona bilkul wo hai jo kami zaahir karta hai, kyunki iska matlab hai har sach mein login-hua user, role se bekhabar, usi na-surakshit logic tak pahunchta hai.',
      },
      {
        q: 'Why should a route reject an unauthorized-but-authenticated user with a 403 status rather than a 401?',
        qHi: 'Ek route ko ek unauthorized-par-authenticated user ko \`403\` status se reject karna chahiye \`401\` se nahi kyun?',
        a: '401 Unauthorized specifically means the server cannot determine, or has not been given, any valid proof of who the caller is at all — this is the correct response when a request arrives with no token, an invalid token, or an expired one, precisely the cases this module\'s requireAuth middleware is designed to catch. 403 Forbidden means something meaningfully different: the server has successfully and completely identified exactly who the caller is, with full confidence, but has determined that this specific, confirmed identity is still not permitted to perform the requested action. These are genuinely different situations from the client\'s perspective, and correctly distinguishing them provides useful, actionable information: a client receiving 401 knows the appropriate response is to re-authenticate (log in again, refresh an expired token), since the problem is that their identity was not successfully established at all. A client receiving 403 knows that re-authenticating will not help at all, since their identity was already confirmed correctly — the actual problem is that this specific, correctly-identified account simply does not have permission for this specific action, and no amount of re-logging-in will change that without an actual change in their role or permissions. Using 401 for an authorization failure would incorrectly suggest to the client that trying to log in again might resolve the problem, when the real issue is an entirely different one that a login attempt cannot fix.',
        aHi: '\`401 Unauthorized\` khaas taur par matlab hai server ye tay nahi kar sakta, ya use bilkul nahi diya gaya, koi valid saboot ki caller kaun hai — ye sahi response hai jab ek request koi token, ek invalid token, ya ek expired token ke saath aati hai, bilkul wo cases jinhe pakadne ke liye is module ka \`requireAuth\` middleware design hua hai. \`403 Forbidden\` ka matlab kuch maayne-rakhta alag hai: server ne safaltapoorvak aur poori tarah pehchaan liya hai ki caller bilkul kaun hai, poori confidence ke saath, par tay kiya hai ki ye khaas, confirm ki gayi pehchaan abhi bhi maangi gayi action karne ki ijaazat nahi rakhti. Ye client ke nazariye se sach mein alag sthitiyaan hain, aur unhe sahi tarike se alag karna kaam ki, action-lene-laayak jaankaari deta hai: \`401\` paata ek client jaanta hai uchit jawaab dobara-authenticate karna hai (dobara login karo, ek expired token refresh karo), kyunki samasya ye hai ki unki pehchaan bilkul sthaapit hui hi nahi. \`403\` paata ek client jaanta hai dobara-authenticate karna bilkul madad nahi karega, kyunki unki pehchaan pehle se sahi tarike se confirm hui thi — asli samasya ye hai ki ye khaas, sahi-pehchaana account bas is khaas action ke liye ijaazat nahi rakhta, aur kitni bhi dobara-login koshish us cheez ko nahi badlegi bina unke role ya permissions mein ek asli badlaav ke. Ek authorization failure ke liye \`401\` istemal karna client ko galat tarike se sujhaayega ki dobara login karne ki koshish samasya solve kar sakti hai, jab asli samasya kuch poori tarah alag hai jise ek login koshish theek nahi kar sakti.',
      },
      {
        q: 'Why does embedding a user\'s role directly in the JWT payload create the same staleness problem this course\'s sessions-vs-tokens lesson already covered for account bans?',
        qHi: 'Ek user ka role seedha JWT payload mein embed karna wahi staleness samasya kyun paida karta hai jise is course ka sessions-vs-tokens lesson pehle account bans ke liye cover kar chuka hai?',
        a: 'When a role is embedded directly in a JWT\'s payload at the moment the token is issued (at login), that value is fixed and unchangeable for the entire remaining lifetime of that specific token — a JWT, once signed, cannot have its payload silently updated afterward without invalidating the signature, following this module\'s JWT lesson. If an administrator changes a specific user\'s role after that user has already logged in and obtained a token — demoting them from admin to a regular role, for instance — the existing token they are still holding continues to say whatever role was true at the moment it was issued, completely unaware that the role has since changed, for as long as that token remains unexpired. This is structurally identical to the ban scenario this course\'s sessions-vs-tokens lesson covered: a JWT is a self-contained snapshot of facts that were true at issuance time, and checking only the token\'s own payload can never reflect any change to those facts that happens afterward, no matter how significant that change is. The identical fix applies here: either accept the resulting delay (bounded by the token\'s expiration) as a reasonable trade-off for a specific application\'s needs, or add an explicit database lookup for the user\'s current role as part of authorization, closing the gap at the cost of one additional query per request — exactly the same choice this course\'s earlier lesson framed as a genuine trade-off between performance and immediacy, not a mistake unique to roles specifically.',
        aHi: 'Jab ek role seedha ek JWT ke payload mein embed hota hai us pal jab token issue hota hai (login par), wo value us khaas token ki poori baaki umar ke liye fixed aur na-badle-jaane-laayak hai — ek JWT, ek baar sign hone ke baad, uska payload chupke se baad mein bina signature invalid kiye update nahi ho sakta, is module ke JWT lesson ka palan karte hue. Agar ek administrator ek khaas user ka role badalta hai us user ke pehle se login karne aur ek token paane ke baad — unhe admin se ek aam role mein demote karte hue, misal ke taur par — maujooda token jo wo abhi bhi pakde hain kehta rehta hai jo bhi role sach tha jab wo issue hua tha, poori tarah bekhabar ki role tab se badla hai, jab tak wo token na-expire-hua rehta hai. Ye sanrachnaatmak taur par us ban scenario jaisa hai jise is course ka sessions-vs-tokens lesson cover kar chuka hai: ek JWT unhi facts ka ek self-contained snapshot hai jo issuance time par sach the, aur sirf token ke apne payload ko check karna kabhi un facts mein koi badlaav zaahir nahi kar sakta jo baad mein hota hai, chahe wo badlaav kitna bhi mahatvapoorna ho. Bilkul wahi fix yahan lagu hota hai: ya to nateeja hui deri ko (token ki expiration se bandhi hui) ek khaas application ki zarurat ke liye ek uchit trade-off ki tarah accept karo, ya user ke abhi ke role ke liye ek explicit database lookup authorization ke hisse ki tarah jodo, ek additional query prati request ki keemat par kami band karte hue — bilkul wahi choice jise is course ke pehle wale lesson ne performance aur turantpan ke beech ek asli trade-off ki tarah framed kiya, koi galti nahi jo khaas taur par roles ke liye alag hai.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken /admin/users/:id route protected only by requireAuth. Log in as a regular (non-admin) test user and confirm you can successfully delete another user\'s account through this route.',
        taskHi: 'Sirf \`requireAuth\` se surakshit toota \`/admin/users/:id\` route banao. Ek aam (non-admin) test user ki tarah login karo aur confirm karo tum is route se ek doosre user ka account safaltapoorvak delete kar sakte ho.',
        hint: 'Create two test users during signup — one with role "customer" and one with role "admin" — so you have a concrete, non-admin account to log in as for this exercise.',
        hintHi: 'Signup ke dauraan do test users banao — ek \`"customer"\` role wala aur ek \`"admin"\` role wala — taaki tumhaare paas is exercise ke liye login karne ke liye ek thos, non-admin account ho.',
      },
      {
        task: 'Add a role column to your users table, embed it in the JWT at login, and build requireRole(). Repeat the same test as a regular user and confirm you now correctly receive 403, then confirm the admin test user can still successfully delete the account.',
        taskHi: 'Apni \`users\` table mein ek \`role\` column jodo, ise login par JWT mein embed karo, aur \`requireRole()\` banao. Ek aam user ki tarah wahi test dohraao aur confirm karo tumhe ab sahi tarike se \`403\` milta hai, phir confirm karo admin test user abhi bhi safaltapoorvak account delete kar sakta hai.',
        hint: 'Decode the JWT payload manually (following this module\'s JWT lesson) to directly confirm the role field is actually present and correct inside the token.',
        hintHi: 'JWT payload ko haath se decode karo (is module ke JWT lesson ka palan karte hue) seedha confirm karne ke liye ki \`role\` field token ke andar asal mein maujood aur sahi hai.',
      },
      {
        task: 'Build the /orders/:id ownership-check example. Create two orders belonging to two different test users, and confirm each user can view their own order but correctly receives 403 when requesting the other user\'s order ID directly.',
        taskHi: '\`/orders/:id\` ownership-check example banao. Do orders banao jo do alag test users ke hon, aur confirm karo har user apna order dekh sakta hai par doosre user ki order ID seedha maangne par sahi tarike se \`403\` paata hai.',
        hint: 'Try this specifically with sequential, easily-guessable order IDs (1, 2, 3) to directly demonstrate why ownership checks matter even when a URL\'s ID is trivial to guess or enumerate.',
        hintHi: 'Ise khaas taur par sequential, aasaani se guess-hone-laayak order IDs (1, 2, 3) ke saath try karo seedha dikhaane ke liye ki ownership checks kyun maayne rakhte hain chahe ek URL ki ID guess ya enumerate karna mamuli ho.',
      },
    ],

    keyTakeaways: [
      'Authentication (proving who someone is) and authorization (checking what that specific person is allowed to do) are two genuinely different questions — requireAuth alone only ever answers the first.',
      'A requireRole() middleware, chained after requireAuth, checks the authenticated user\'s role against the roles a specific route allows, rejecting an authenticated-but-unpermitted user with 403, not 401.',
      '401 means the caller\'s identity could not be established at all; 403 means the identity is fully known and confirmed, but that identity still lacks permission — using the correct code gives the client accurate, actionable information.',
      'Embedding a role directly in a JWT payload creates the same staleness problem this course\'s sessions-vs-tokens lesson covered for bans — a role change does not take effect until the existing token expires unless a database check is added.',
      'RBAC (Role-Based Access Control) generalizes a simple role check into roles mapped to specific permissions, making it easier to add new roles without hardcoding role names into every individual route.',
      'Authorization also includes checking resource ownership (does this specific order belong to this specific user), not just role — a role check alone would not catch a user accessing another user\'s own data by ID.',
    ],
    keyTakeawaysHi: [
      'Authentication (kaun hai ye saabit karna) aur authorization (check karna ki wo khaas insaan kya karne ki ijaazat rakhta hai) do sach mein alag sawaal hain — akela \`requireAuth\` sirf hamesha pehle ka jawaab deta hai.',
      'Ek \`requireRole()\` middleware, \`requireAuth\` ke baad chained, authenticated user ke role ko un roles se check karta hai jise ek khaas route allow karta hai, ek authenticated-par-unpermitted user ko \`403\` se reject karte hue, \`401\` nahi.',
      '\`401\` matlab hai caller ki pehchaan bilkul sthaapit nahi ho saki; \`403\` matlab hai pehchaan poori tarah jaani-pehchaani aur confirm hai, par wo pehchaan abhi bhi permission nahi rakhti — sahi code istemal karna client ko sahi, action-lene-laayak jaankaari deta hai.',
      'Ek role ko seedha ek JWT payload mein embed karna wahi staleness samasya paida karta hai jise is course ka sessions-vs-tokens lesson bans ke liye cover kar chuka hai — ek role badlaav tab tak lagu nahi hota jab tak maujooda token expire na ho jab tak ek database check na jodi jaaye.',
      'RBAC (Role-Based Access Control) ek saadhe role check ko roles mein general karta hai jo khaas permissions se mapped hain, naye roles jodna aasaan banaate hue har akele route mein role naam hardcode kiye bina.',
      'Authorization mein resource ownership check karna bhi shaamil hai (kya ye khaas order is khaas user ka hai), sirf role nahi — akela ek role check ek user ko ID se doosre user ka apna data access karte hue nahi pakadega.',
    ],
  },
];
