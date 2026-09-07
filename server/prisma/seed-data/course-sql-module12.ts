/**
 * Databases Complete Course — Module 12: PostgreSQL Operations & Scale, lessons 1-3.
 * Last module of Part II — the operational/scale side of PostgreSQL.
 *
 * Lesson 1: Roles & privileges — CREATE ROLE, GRANT/REVOKE, and the permission-denied
 *           errors that result from PostgreSQL's default-deny model.
 * Lesson 2: Row-level security — per-row access policies enforced by the database
 *           itself, and the table-owner-bypasses-RLS-by-default gotcha.
 * Lesson 3: Partitioning — range/list/hash partitioning and partition pruning.
 *
 * Verified against real PostgreSQL 18 (PGlite). Run: node verify-sql.mjs 12
 */

import type { CourseLesson } from './course-js-module1';

export const SQL_MODULE_12: CourseLesson[] = [
  {
    slug: 'sql-roles-and-privileges',
    title: 'Roles & Privileges',
    titleHi: 'Roles Aur Privileges',
    description: 'PostgreSQL denies everything by default: a newly created role can do nothing to a table until it is explicitly GRANTed a privilege. Understanding GRANT, REVOKE, and the permission-denied errors that result is the foundation every other access-control feature in this module builds on.',
    descriptionHi: 'PostgreSQL default se sab kuch deny karta hai: ek nayi banai gayi role ek table ke saath tab tak kuch nahi kar sakti jab tak use explicitly ek privilege GRANT na kiya jaaye. `GRANT`, `REVOKE`, aur unse aane waale permission-denied errors ko samajhna wo foundation hai jispar is module ka har doosra access-control feature banта hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 1,

    analogy: {
      en: '**A key-card office building where every door is locked by default, not a house where every room is open unless you lock it.** Walk into most office buildings and the default assumption is inverted from a typical home: nothing opens without a key card programmed specifically for that door, and a new employee\'s badge opens nothing at all until security explicitly authorizes it, room by room. PostgreSQL\'s privilege system works the same way: a freshly created role is not "trusted until proven otherwise," it is locked out of everything until someone with the authority to do so runs `GRANT`, the equivalent of programming that badge for one specific door. `REVOKE` is having that access removed again, just as cleanly, and a "permission denied" error is exactly what happens when someone tries a door their badge was never programmed for — not a bug, not a fluke, but the system doing precisely what a locked-by-default building is supposed to do.',
      hi: '**Ek key-card office building jahaan har darwaaza default se locked hai, ek ghar nahi jahaan har room khula hai jab tak aap use lock na karo.** Zyadатार office buildings mein chalte hue default assumption ek typical ghar se ulта hai: koi darwaaza bina us darwaaze ke liye specifically programmed ek key card ke nahi khulта, aur ek naye employee ka badge kuch bhi tab tak nahi kholta jab tak security explicitly ise authorize na kare, room by room. PostgreSQL ka privilege system waise hi kaam karta hai: ek freshly created role "trusted until proven otherwise" nahi hai, ye har cheez se locked out hai jab tak koi authority waala `GRANT` na chalाye, us badge ko ek specific darwaाze ke liye program karne ke equivalent. `REVOKE` us access ko dobara utna hi cleanly hata deta hai, aur ek "permission denied" error theek wo hai jo hota hai jab koi ek aisa darwaaza try karta hai jiske liye uska badge kabhi programmed hi nahi thа.',
    },

    simple: `**A new role starts with ZERO privileges -- everything is denied by default**

\`\`\`sql
CREATE ROLE app_readonly;
CREATE TABLE secrets (id int PRIMARY KEY, val text);
SET ROLE app_readonly;
INSERT INTO secrets VALUES (1, 'x');
\`\`\`
\`\`\`
[ERROR] permission denied for table secrets
\`\`\`

**\`GRANT\` explicitly authorizes one privilege, on one object, to one role**

\`\`\`sql
RESET ROLE;   -- back to the granting role
GRANT SELECT ON secrets TO app_readonly;
SELECT grantee, privilege_type FROM information_schema.role_table_grants WHERE table_name = 'secrets';
\`\`\`
\`\`\`
 grantee      | privilege_type
--------------+----------------
 app_readonly | SELECT
(1 row)
-- (the table owner's own implicit full privileges also appear in this view --
--  filtered out here for clarity)
\`\`\`

**\`REVOKE\` removes a privilege just as explicitly -- back to denied**

\`\`\`sql
REVOKE SELECT ON secrets FROM app_readonly;
SET ROLE app_readonly;
SELECT * FROM secrets;
\`\`\`
\`\`\`
[ERROR] permission denied for table secrets
\`\`\`

**\`SET ROLE\` / \`RESET ROLE\` switches the CURRENT session's effective identity -- useful for
testing what a role can and can't do, without a separate connection**`,

    simpleHi: `**Ek nayi role ZERO privileges se shuru hoती hai -- sab kuch default se deny hai**

\`\`\`sql
CREATE ROLE app_readonly;
CREATE TABLE secrets (id int PRIMARY KEY, val text);
SET ROLE app_readonly;
INSERT INTO secrets VALUES (1, 'x');
\`\`\`
\`\`\`
[ERROR] permission denied for table secrets
\`\`\`

**\`GRANT\` explicitly ek privilege ko, ek object par, ek role ko authorize karta hai**

\`\`\`sql
RESET ROLE;   -- granting role par wapas
GRANT SELECT ON secrets TO app_readonly;
SELECT grantee, privilege_type FROM information_schema.role_table_grants WHERE table_name = 'secrets';
\`\`\`
\`\`\`
 grantee      | privilege_type
--------------+----------------
 app_readonly | SELECT
(1 row)
\`\`\`

**\`REVOKE\` ek privilege ko theek utni hi explicitly hataता hai -- wapas denied**

\`\`\`sql
REVOKE SELECT ON secrets FROM app_readonly;
SET ROLE app_readonly;
SELECT * FROM secrets;
\`\`\`
\`\`\`
[ERROR] permission denied for table secrets
\`\`\`

**\`SET ROLE\` / \`RESET ROLE\` CURRENT session ki effective identity switch karta hai -- ek role kya kar sakti hai aur kya nahi test karne ke liye useful, ek alag connection ke bina**`,

    content: `## Default-deny: the foundation of PostgreSQL's access control

Unlike a system where a new user might reasonably read anything until told otherwise, PostgreSQL's privilege model is **default-deny**: a newly created role can do nothing to an existing table, view, or sequence until a privilege is explicitly granted.

\`\`\`sql
CREATE ROLE app_readonly;
CREATE TABLE secrets (id int PRIMARY KEY, val text);
SET ROLE app_readonly;
INSERT INTO secrets VALUES (1, 'x');
\`\`\`
\`\`\`
[ERROR] permission denied for table secrets
\`\`\`

\`SET ROLE\` switches the current session's effective identity for the rest of the session (or until \`RESET ROLE\`), which is a convenient way to test exactly what a role can and cannot do from a single connection, without needing a separate login as that role.

## \`GRANT\`: explicit, per-object, per-privilege authorization

\`\`\`sql
GRANT SELECT ON secrets TO app_readonly;
\`\`\`

A \`GRANT\` names a specific privilege (\`SELECT\`, \`INSERT\`, \`UPDATE\`, \`DELETE\`, and others), a specific object (a table, here), and a specific role, and authorizes exactly that combination — nothing more. Granting \`SELECT\` does not imply \`INSERT\`; granting privileges on one table says nothing about any other table. This granularity is deliberate: it lets an application's database role be scoped to exactly the operations it genuinely needs, following the principle of least privilege.

\`information_schema.role_table_grants\` (a standard, portable view, unlike PostgreSQL-specific catalog tables) is a reliable way to audit exactly what has been granted:

\`\`\`sql
SELECT grantee, privilege_type FROM information_schema.role_table_grants WHERE table_name = 'secrets';
\`\`\`

## \`REVOKE\`: removing a privilege

\`\`\`sql
REVOKE SELECT ON secrets FROM app_readonly;
\`\`\`

\`REVOKE\` is the direct inverse of \`GRANT\`: it removes a previously granted privilege, and any subsequent attempt by that role to use it fails with the same \`permission denied\` error a role that was never granted anything would get. Privileges in PostgreSQL are not "sticky" or cumulative in some hidden way — revoking a privilege genuinely removes it, immediately, for that role.

## Role membership: granting a role to a role

Beyond granting privileges directly, PostgreSQL also lets one role be granted **membership** in another: \`GRANT team_lead TO alice\` makes \`alice\` a member of \`team_lead\`, which by default lets \`alice\` use any privilege \`team_lead\` has (checkable with \`pg_has_role('alice', 'team_lead', 'member')\`). This is the foundation of managing privileges through group roles rather than granting the same set of individual privileges to every user role separately — grant privileges to a \`team_lead\` role once, then grant membership in \`team_lead\` to whichever individual roles need it, and revoking or extending the whole group's access becomes a single change rather than one per person.

## Why this matters beyond the database itself

Every other access-control feature in this module, and the whole discipline of running a production database safely, assumes this default-deny foundation: an application's database credentials should hold only the privileges that application genuinely needs (rarely \`SUPERUSER\`, rarely blanket access to every table), a read replica's reporting role should typically have no write privileges at all, and an audit of "what can this role actually do" should always be possible by inspecting grants directly rather than trusting institutional memory.`,

    contentHi: `## Default-deny: PostgreSQL ke access control ka foundation

Ek aise system ke uलт jahaan ek naya user reasonably kuch bhi padh sakta hai jab tak na kaha jaaye, PostgreSQL ka privilege model **default-deny** hai: ek nayi banai gayi role ek existing table, view, ya sequence ke saath tab tak kuch nahi kar sakti jab tak ek privilege explicitly grant na ho.

\`\`\`sql
CREATE ROLE app_readonly;
CREATE TABLE secrets (id int PRIMARY KEY, val text);
SET ROLE app_readonly;
INSERT INTO secrets VALUES (1, 'x');
\`\`\`
\`\`\`
[ERROR] permission denied for table secrets
\`\`\`

\`SET ROLE\` current session ki effective identity ko baaki session ke liye (ya \`RESET ROLE\` tak) switch karta hai.

## \`GRANT\`: explicit, per-object, per-privilege authorization

\`\`\`sql
GRANT SELECT ON secrets TO app_readonly;
\`\`\`

Ek \`GRANT\` ek specific privilege (\`SELECT\`, \`INSERT\`, \`UPDATE\`, \`DELETE\`, aur doosre), ek specific object (yahaan, ek table), aur ek specific role ka naam leта hai, aur theek wo combination authorize karta hai — aur kuch nahi.

\`information_schema.role_table_grants\` (ek standard, portable view) exactly kya grant hua hai audit karne ka ek reliable tarika hai:

\`\`\`sql
SELECT grantee, privilege_type FROM information_schema.role_table_grants WHERE table_name = 'secrets';
\`\`\`

## \`REVOKE\`: ek privilege hataना

\`\`\`sql
REVOKE SELECT ON secrets FROM app_readonly;
\`\`\`

\`REVOKE\` \`GRANT\` ka direct inverse hai: ye ek pehle granted privilege ko hataता hai, aur us role ka koi bhi baad ka attempt ise istemal karne ka usī \`permission denied\` error ke saath fail hota hai.

## Role membership: ek role ko ek role grant karna

Privileges seedhe grant karne ke pare, PostgreSQL ek role ko doosri role mein **membership** bhi grant karne deta hai: \`GRANT team_lead TO alice\` \`alice\` ko \`team_lead\` ka member banata hai.

## Ye database se pare kyun matter karta hai

Is module ka har doosra access-control feature, aur production database ko safely chalане ki poori discipline, is default-deny foundation ko maान leti hai.`,

    examples: [
      {
        title: 'A role with no grants is denied; GRANT explicitly authorizes SELECT',
        titleHi: 'Bina grants waali ek role denied hoti hai; GRANT explicitly SELECT authorize karta hai',
        code: `CREATE ROLE app_readonly;
CREATE TABLE secrets (id int PRIMARY KEY, val text);
GRANT SELECT ON secrets TO app_readonly;
SELECT grantee, privilege_type FROM information_schema.role_table_grants
  WHERE table_name = 'secrets' AND grantee = 'app_readonly';`,
        output: ` grantee      | privilege_type
--------------+----------------
 app_readonly | SELECT
(1 row)`,
        explain: '`information_schema.role_table_grants` confirms the `GRANT` took effect: `app_readonly` now holds exactly one privilege on `secrets`, `SELECT` — nothing more. The grant is per-privilege and per-object, so this row is the complete truth about what `app_readonly` can do to this table.',
        explainHi: '`information_schema.role_table_grants` confirm karta hai ki `GRANT` effect mein aaya: `app_readonly` ab `secrets` par theek ek privilege rakhta hai, `SELECT` — aur kuch nahi. Grant per-privilege aur per-object hai, to ye row is baare mein poori sach hai ki `app_readonly` is table ke saath kya kar sakti hai.',
      },
      {
        title: 'A role without INSERT privilege is denied when attempting to write',
        titleHi: 'INSERT privilege ke bina ek role likhne ki koshish par denied hoti hai',
        code: `CREATE ROLE app_readonly;
CREATE TABLE secrets (id int PRIMARY KEY, val text);
GRANT SELECT ON secrets TO app_readonly;
SET ROLE app_readonly;
INSERT INTO secrets VALUES (1, 'x');`,
        output: `[ERROR] permission denied for table secrets`,
        explain: "`app_readonly` was granted `SELECT` and nothing else, so after `SET ROLE app_readonly` the `INSERT` fails with `permission denied` — each privilege is independent, and holding `SELECT` grants no implicit ability to write. The error is PostgreSQL's default-deny model working exactly as designed.",
        explainHi: '`app_readonly` ko `SELECT` grant kiya gaya aur kuch nahi, to `SET ROLE app_readonly` ke baad `INSERT` `permission denied` ke saath fail hota hai — har privilege independent hai, aur `SELECT` rakhna likhne ki koi implicit ability nahi deta. Error PostgreSQL ka default-deny model theek design ke hisaab se kaam kar raha hai.',
      },
      {
        title: 'REVOKE removes a previously granted privilege, restoring the denial',
        titleHi: 'REVOKE ek pehle granted privilege ko hataता hai, denial ko restore karte hue',
        code: `CREATE ROLE app_readonly;
CREATE TABLE secrets (id int PRIMARY KEY, val text);
INSERT INTO secrets VALUES (1, 'x');
GRANT SELECT ON secrets TO app_readonly;
REVOKE SELECT ON secrets FROM app_readonly;
SET ROLE app_readonly;
SELECT * FROM secrets;`,
        output: `[ERROR] permission denied for table secrets`,
        explain: '`GRANT SELECT` then `REVOKE SELECT` leaves `app_readonly` back where it started: with no privileges on `secrets`. Privileges are not cumulative or sticky — revoking one removes it immediately, so `SET ROLE app_readonly` followed by `SELECT` fails with the same `permission denied` a never-granted role would get.',
        explainHi: '`GRANT SELECT` phir `REVOKE SELECT` `app_readonly` ko wahin wapas chhoड़ता hai jahaan ye shuru hui thi: `secrets` par koi privileges ke bina. Privileges cumulative ya sticky nahi hain — ek ko revoke karna ise turant hataता hai, to `SET ROLE app_readonly` ke baad `SELECT` usī `permission denied` ke saath fail hota hai jo ek kabhi-granted-nahi role ko milta.',
      },
    ],

    mistakes: [
      {
        wrong: `-- assuming a newly created role can at least read data until told otherwise
CREATE ROLE analyst;
-- (application logic assumes "analyst" can SELECT from any table by default)
SET ROLE analyst;
SELECT * FROM orders;
-- ERROR: permission denied for table orders -- NO privilege is implicit`,
        right: `CREATE ROLE analyst;
GRANT SELECT ON orders TO analyst;   -- must be explicit, even for read-only access
SET ROLE analyst;
SELECT * FROM orders;   -- now works`,
        why: 'PostgreSQL\'s privilege model is default-deny for every object and every operation, with no implicit "at least read access" granted to a newly created role, no matter how harmless reading might seem compared to writing. Every single privilege, including SELECT, must be explicitly granted before a role can use it, which means a role created but never granted anything can do absolutely nothing to existing objects, not even look at them. This is a deliberate security posture: assuming a role can do something until proven otherwise is exactly the kind of assumption that leads to accidental overexposure, so PostgreSQL requires the opposite assumption, forcing every capability a role has to be a conscious, auditable choice.',
        whyHi: 'PostgreSQL ka privilege model har object aur har operation ke liye default-deny hai, ek naye create ki gayi role ko koi implicit "kam se kam read access" diye bina, chahe reading writing ke muकаble кितna bhi harmless kyun na lage. Har ek privilege, `SELECT` samet, explicitly grant hona zaroori hai ek role ke ise istemal karne se pehle.',
      },
      {
        wrong: `-- forgetting that GRANT is per-object -- assuming granting on one table covers similar ones
GRANT SELECT ON orders TO analyst;
SET ROLE analyst;
SELECT * FROM order_items;
-- ERROR: permission denied for table order_items -- a SEPARATE, unrelated table,
-- even though it's conceptually "part of the same feature"`,
        right: `GRANT SELECT ON orders TO analyst;
GRANT SELECT ON order_items TO analyst;   -- each table needs its OWN grant
-- (or GRANT SELECT ON ALL TABLES IN SCHEMA public TO analyst; for a broader,
--  deliberate blanket grant when that is genuinely the intent)`,
        why: 'A GRANT authorizes a privilege on the exact object named in the statement and nothing else; PostgreSQL has no concept of tables being "related" or "part of the same feature" that would cause a grant on one to extend to another, regardless of how obviously connected two tables might seem from an application\'s point of view. Each table, view, or sequence needs its own explicit grant for a role to access it, which is precisely what keeps the access-control model auditable: reading the grants on a single object tells you the complete truth about who can access it, with no need to reason about implied access from grants elsewhere. When a role genuinely does need blanket access across many objects, PostgreSQL provides explicit syntax for that too, such as granting on all tables in a schema, but that breadth has to be a deliberate choice, not an assumption based on how related two tables happen to be.',
        whyHi: 'Ek `GRANT` statement mein naame gaye theek us object par ek privilege authorize karta hai aur kuch nahi; PostgreSQL ke paas tables ke "related" hone ka koi concept nahi hai jo ek grant ko ek se doosre tak extend karे. Har table, view, ya sequence ko role ke access ke liye apna explicit grant chahiye.',
      },
      {
        wrong: `-- testing role privileges by mentally reasoning about what "should" work,
-- rather than actually switching to that role and trying it
GRANT SELECT ON secrets TO app_readonly;
-- "that should be enough for a read-only service" -- ships it without verifying
-- (forgot the service ALSO calls an UPDATE somewhere for a "last accessed" timestamp)`,
        right: `GRANT SELECT ON secrets TO app_readonly;
SET ROLE app_readonly;
-- actually run EVERY operation the real application performs, as this role:
SELECT * FROM secrets;
UPDATE secrets SET val = val WHERE id = 1;   -- reveals the missing UPDATE grant BEFORE deploying
RESET ROLE;`,
        why: 'Reasoning abstractly about what privileges a role "should" need is error-prone precisely because it relies on remembering every operation an application actually performs against a table, and it is easy to overlook a secondary operation, such as an incidental UPDATE for a last-accessed timestamp, that is not the primary purpose of a role but still genuinely required. SET ROLE provides a direct, low-cost way to verify assumptions empirically from the same session: switch to the role in question and actually attempt every operation the real application performs, rather than trusting a mental model of what the role is "supposed to" be able to do. Any permission-denied error surfaces immediately, in a development or staging environment, rather than being discovered for the first time when the real application fails in production.',
        whyHi: 'Abstractly ye reasoning karна ki ek role ko kya privileges "chahiye" error-prone hai theek isliye kyunki isमें ek application ek table ke against asal mein jo har operation perform karta hai use yaad rakhна paता hai. `SET ROLE` assumptions ko empirically usī session se verify karne ka ek direct, low-cost tarika deta hai: us role mein switch karo aur asal mein har operation try karo jo real application perform karta hai.',
      },
    ],

    realWorld: [
      {
        en: '**A dedicated `app_service` role granted only `SELECT`/`INSERT`/`UPDATE` on the specific tables an application touches** — never granted `DELETE`, `DROP`, or superuser, so a compromised application credential cannot destroy data or alter schema.',
        hi: '**Ek dedicated `app_service` role jise sirf specific tables par `SELECT`/`INSERT`/`UPDATE` grant kiya gaya hai jinhe ek application touch karta hai** — kabhi `DELETE`, `DROP`, ya superuser grant nahi kiya gaya.',
      },
      {
        en: '**A quarterly access-review script querying `information_schema.role_table_grants`** to confirm no role holds a privilege nobody can explain or justify anymore.',
        hi: '**Ek quarterly access-review script jo `information_schema.role_table_grants` query karta hai** confirm karne ke liye ki koi role kaisī privilege nahi rakhती jise ab koi explain ya justify nahi kar sakta.',
      },
      {
        en: '**A `reporting` group role granted `SELECT` across every table once, with individual analysts granted membership in it** — onboarding a new analyst is one `GRANT reporting TO new_analyst`, not re-deriving every table grant from scratch.',
        hi: '**Ek `reporting` group role jise har table par ek baar `SELECT` grant kiya gaya, individual analysts ko ismein membership grant ki gayi** — ek naye analyst ko onboard karna ek `GRANT reporting TO new_analyst` hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does PostgreSQL use a default-deny privilege model, and what does that mean in practice for a newly created role?',
        qHi: 'PostgreSQL default-deny privilege model kyun istemal karta hai, aur ek nayi banai gayi role ke liye practice mein iska matlab kya hai?',
        a: 'A default-deny model means that no role can perform any operation on any existing object until that specific privilege has been explicitly granted, which is the safer starting assumption for an access-control system: it forces every capability a role ends up with to be the result of a deliberate, auditable decision rather than an implicit default that someone has to remember to restrict. In practice, this means a role created with CREATE ROLE and nothing else can do absolutely nothing to existing tables, not read them, not write to them, not even see their structure through certain catalog queries, until specific GRANT statements name that role and that privilege on that object. This has real consequences for how applications should be configured: an application\'s database credentials should be a role granted only the specific privileges its actual code paths require, never a broad or superuser-level role granted "just in case," because the default-deny posture only provides real security benefit if grants are kept as narrow as the application genuinely needs.',
        aHi: 'Ek default-deny model ka matlab hai ki koi bhi role kisī existing object par koi bhi operation tab tak perform nahi kar sakti jab tak wo specific privilege explicitly grant na ki gayi ho, jo ek access-control system ke liye safer starting assumption hai. Practice mein, iska matlab hai ki `CREATE ROLE` se banī aur kuch aur na ki gayi ek role existing tables ke saath bilkul kuch nahi kar sakti jab tak specific `GRANT` statements us role aur us object par wo privilege naam na len.',
      },
      {
        q: 'What is the difference between granting a privilege directly to a role and granting membership in another role, and why is the latter useful?',
        qHi: 'Ek role ko seedhe ek privilege grant karne aur ek doosri role mein membership grant karne mein kya antar hai, aur baad waala useful kyun hai?',
        a: 'Granting a privilege directly, such as GRANT SELECT ON orders TO alice, authorizes exactly that one operation on that one object for that one role, and nothing more; each individual role that needs the same access requires its own identical grant. Granting role membership, such as GRANT team_lead TO alice, instead makes alice a member of the team_lead role, which by default lets alice exercise any privilege team_lead itself holds, effectively inheriting whatever access has been granted to that group role. The practical usefulness of the membership approach is that it turns "manage access for a whole team" into a single point of maintenance: privileges are granted once to the group role, individual people are granted membership in that group as they join or leave, and revoking or extending access for the entire group is one change to the group role rather than a separate change repeated across every individual role that happens to need the same access, which is both less error-prone and easier to audit.',
        aHi: 'Ek privilege ko seedhe grant karna, jaisа `GRANT SELECT ON orders TO alice`, theek us ek operation ko us ek object par us ek role ke liye authorize karta hai, aur kuch nahi. Role membership grant karna, jaisа `GRANT team_lead TO alice`, iske bजाय `alice` ko `team_lead` role ka member banata hai, jo default se `alice` ko wo koi bhi privilege istemal karne deta hai jo `team_lead` khud rakhता hai. Membership approach ki practical usefulness ye hai ki ye "poori team ke liye access manage karo" ko maintenance ke ek single point mein badalता hai.',
      },
    ],

    exercises: [
      {
        task: 'Create a role `app_readonly` and a table `secrets(id int PRIMARY KEY, val text)`. Without granting anything, `SET ROLE app_readonly` and attempt a `SELECT` — confirm it is denied. Then `RESET ROLE`, `GRANT SELECT` on the table to `app_readonly`, and confirm the same `SELECT` now succeeds.',
        taskHi: 'Ek role `app_readonly` aur ek table `secrets(id, val)` banao. Kuch bhi grant kiye bina, `SET ROLE app_readonly` karo aur ek `SELECT` try karo — confirm karo ye denied hai. Phir `RESET ROLE`, table par `app_readonly` ko `GRANT SELECT` karo, aur confirm karo wahi `SELECT` ab succeed karti hai.',
        hint: 'A role with zero grants can do nothing to any existing table — this is PostgreSQL\'s default-deny model, not a bug. `GRANT SELECT ON secrets TO app_readonly` authorizes exactly that one operation.',
        hintHi: 'Zero grants waali ek role kisī bhi existing table ke saath kuch nahi kar sakti — ye PostgreSQL ka default-deny model hai, koi bug nahi.',
      },
      {
        task: 'With `app_readonly` granted `SELECT` on `secrets`, `SET ROLE app_readonly` and attempt an `INSERT` — confirm it is denied even though `SELECT` works.',
        taskHi: '`secrets` par `SELECT` granted `app_readonly` ke saath, `SET ROLE app_readonly` karo aur ek `INSERT` try karo — confirm karo ye denied hai chahe `SELECT` kaam karta ho.',
        hint: 'Each privilege is granted independently — `SELECT` being granted says nothing about `INSERT`, `UPDATE`, or `DELETE`, each of which needs its own explicit `GRANT`.',
        hintHi: 'Har privilege independently grant hota hai — `SELECT` grant hone ka `INSERT`, `UPDATE`, ya `DELETE` se koi lena-dena nahi, har ek ko apna explicit `GRANT` chahiye.',
      },
      {
        task: 'With `app_readonly` granted `SELECT` on `secrets`, `REVOKE` that same privilege, then `SET ROLE app_readonly` and confirm `SELECT` is now denied again.',
        taskHi: '`secrets` par `SELECT` granted `app_readonly` ke saath, wahi privilege `REVOKE` karo, phir `SET ROLE app_readonly` karo aur confirm karo `SELECT` ab dobara denied hai.',
        hint: '`REVOKE` is the direct inverse of `GRANT` — privileges are not cumulative or "sticky"; revoking one removes it immediately.',
        hintHi: '`REVOKE` `GRANT` ka direct inverse hai — privileges cumulative ya "sticky" nahi hain; ek ko revoke karna ise turant hataता hai.',
      },
    ],

    keyTakeaways: [
      'PostgreSQL is DEFAULT-DENY: a newly created role (`CREATE ROLE`) can do NOTHING to an existing table until a privilege is explicitly `GRANT`ed. No implicit "at least read access" exists, no matter how harmless reading might seem.',
      '`GRANT <privilege> ON <object> TO <role>` authorizes EXACTLY that one privilege, on that one object, for that one role — nothing more. Granting `SELECT` says nothing about `INSERT`/`UPDATE`/`DELETE`; granting on one table says nothing about any other table, however "related" it seems.',
      '`REVOKE <privilege> ON <object> FROM <role>` is the direct inverse — removes a privilege immediately, restoring the same `permission denied` error a never-granted role would get. Privileges are NOT cumulative or sticky.',
      '`information_schema.role_table_grants` is a standard, portable view for auditing exactly what has been granted — the reliable way to answer "what can this role actually do," rather than trusting institutional memory.',
      '`SET ROLE <role>` / `RESET ROLE` switches the CURRENT session\'s effective identity — the fast way to empirically verify what a role can/can\'t do (by actually trying every real operation) rather than reasoning abstractly about what it "should" be able to do.',
      'ROLE MEMBERSHIP (`GRANT <group_role> TO <individual_role>`) lets a role inherit everything a group role can do — grant privileges to the group ONCE, then manage access for a whole team by granting/revoking membership, rather than repeating identical grants per person.',
    ],
    keyTakeawaysHi: [
      'PostgreSQL DEFAULT-DENY hai: ek nayi banai gayi role (`CREATE ROLE`) ek existing table ke saath KUCH NAHI kar sakti jab tak ek privilege explicitly `GRANT` na ki jaaye. Koi implicit "kam se kam read access" exist nahi karta.',
      '`GRANT <privilege> ON <object> TO <role>` THEEK wo ek privilege, us ek object par, us ek role ke liye authorize karta hai — aur kuch nahi. `SELECT` grant karne ka `INSERT`/`UPDATE`/`DELETE` se koi lena-dena nahi.',
      '`REVOKE <privilege> ON <object> FROM <role>` direct inverse hai — ek privilege ko turant hataता hai. Privileges CUMULATIVE ya sticky NAHI hain.',
      '`information_schema.role_table_grants` exactly kya grant hua hai audit karne ke liye ek standard, portable view hai.',
      '`SET ROLE <role>` / `RESET ROLE` CURRENT session ki effective identity switch karta hai — ye empirically verify karne ka fast tarika hai ki ek role kya kar sakti hai/nahi.',
      'ROLE MEMBERSHIP (`GRANT <group_role> TO <individual_role>`) ek role ko wo sab kuch inherit karne deta hai jo ek group role kar sakti hai — privileges group ko EK BAAR grant karo, phir poori team ke liye access manage karo membership grant/revoke karके.',
    ],
  },

  {
    slug: 'sql-row-level-security',
    title: 'Row-Level Security',
    titleHi: 'Row-Level Security',
    description: 'A GRANT controls access to a whole table. Row-level security goes further, letting the database itself filter which individual rows a role can see or modify — enforced on every query, automatically, without every application query needing its own WHERE clause to stay safe.',
    descriptionHi: 'Ek `GRANT` poori table tak access control karta hai. Row-level security aage jaता hai, database khud ko ye filter karne deta hai ki ek role kaunsi individual rows dekh ya modify kar sakti hai — har query par automatically enforce hota hai, har application query ko safe rehने ke liye apna `WHERE` clause chahiye ke bina.',
    difficulty: 'HARD',
    duration: 22,
    order: 2,

    analogy: {
      en: '**A building where the guard checks your badge at every single door, not a shared master list everyone is trusted to read correctly.** Granting SELECT on a table is like getting a badge that opens the archive room — but once inside, a badge-only system trusts you to look only at the folders meant for you, which works fine until someone forgets to apply that filter, or a new intern writes a report that queries the folders directly without remembering the rule. Row-level security moves that filter to the door itself: no matter who walks in, or what they intend to look at, the guard at the archive room\'s entrance only ever hands over the folders belonging to that specific person — the visitor never even sees the ones that aren\'t theirs, and there is no code path anyone can write, hurried or careless, that bypasses the guard, because the guard is not part of any individual visitor\'s behavior, it is a property of the room itself.',
      hi: '**Ek building jahaan guard aapका badge har single darwaaze par check karta hai, ek shared master list nahi jise har koi correctly padhne ke liye trusted hai.** Ek table par `SELECT` grant hona ek aisa badge paane jaisā hai jo archive room kholta hai — par ek baar andar, ek badge-only system aapको trust karta hai ki aap sirf apne liye maане gaye folders dekhoge, jo theek tab tak theek hai jab tak koi wo filter apply karna bhool na jaaye. Row-level security us filter ko darwaaze par hi le jaata hai: kaun bhi andar aaye, ya wo kya dekhna chahता hai, archive room ke entrance par guard hamesha sirf wo folders deता hai jo us specific vyakti ke hain — visitor un folders ko dekhता hi nahi jo unke nahi hain, aur koi aisa code path nahi hai jo guard ko bypass kare, kyunki guard kisī individual visitor ke behavior ka hissa nahi hai, ye khud room ki property hai.',
    },

    simple: `**\`ENABLE ROW LEVEL SECURITY\` + \`CREATE POLICY\`: filter rows per-role, enforced at the database itself**

\`\`\`sql
CREATE TABLE docs (id int PRIMARY KEY, owner text, body text);
INSERT INTO docs VALUES (1, 'alice', 'alice doc'), (2, 'bob', 'bob doc');
ALTER TABLE docs ENABLE ROW LEVEL SECURITY;
CREATE POLICY owner_only ON docs USING (owner = current_user);

CREATE ROLE alice;
GRANT SELECT ON docs TO alice;
SET ROLE alice;
SELECT * FROM docs;
\`\`\`
\`\`\`
 id | owner | body
----+-------+-----------
  1 | alice | alice doc
(1 row)
-- alice's SELECT * only EVER sees her own row -- bob's row isn't filtered
-- out by the application, it's invisible at the database level entirely
\`\`\`

**A common real pattern: tenant isolation via a session variable, not \`current_user\`**

\`\`\`sql
CREATE POLICY tenant_isolation ON docs
  USING (tenant_id = current_setting('app.tenant_id')::int);

SET app.tenant_id = '100';   -- the application sets this once per connection/request
SELECT * FROM docs;          -- only rows for tenant_id = 100
\`\`\`

**GOTCHA: the TABLE OWNER (and superusers) BYPASS row-level security BY DEFAULT**

\`\`\`sql
-- as the table owner, RLS is enabled and a policy exists, but:
SELECT * FROM docs;
\`\`\`
\`\`\`
 id | owner | body
----+-------+-----------
  1 | alice | alice doc
  2 | bob   | bob doc
(2 rows)
-- BOTH rows -- the owner isn't restricted unless the table also has
-- FORCE ROW LEVEL SECURITY applied
\`\`\``,

    simpleHi: `**\`ENABLE ROW LEVEL SECURITY\` + \`CREATE POLICY\`: prati-role rows filter karo, database khud par enforced**

\`\`\`sql
CREATE TABLE docs (id int PRIMARY KEY, owner text, body text);
INSERT INTO docs VALUES (1, 'alice', 'alice doc'), (2, 'bob', 'bob doc');
ALTER TABLE docs ENABLE ROW LEVEL SECURITY;
CREATE POLICY owner_only ON docs USING (owner = current_user);

CREATE ROLE alice;
GRANT SELECT ON docs TO alice;
SET ROLE alice;
SELECT * FROM docs;
\`\`\`
\`\`\`
 id | owner | body
----+-------+-----------
  1 | alice | alice doc
(1 row)
-- alice ka SELECT * SIRF uski apni row dekhta hai -- bob ki row application
-- se filter nahi hoती, ye database level par bilkul invisible hai
\`\`\`

**Ek common real pattern: session variable se tenant isolation, \`current_user\` se nahi**

\`\`\`sql
CREATE POLICY tenant_isolation ON docs
  USING (tenant_id = current_setting('app.tenant_id')::int);

SET app.tenant_id = '100';   -- application ise prati-connection/request ek baar set karta hai
SELECT * FROM docs;          -- sirf tenant_id = 100 ke liye rows
\`\`\`

**GOTCHA: TABLE OWNER (aur superusers) row-level security ko DEFAULT SE BYPASS karте hain**

\`\`\`sql
-- table owner ke roop mein, RLS enabled hai aur ek policy exist karti hai, par:
SELECT * FROM docs;
\`\`\`
\`\`\`
 id | owner | body
----+-------+-----------
  1 | alice | alice doc
  2 | bob   | bob doc
(2 rows)
-- DONO rows -- owner restricted nahi hai jab tak table par
-- FORCE ROW LEVEL SECURITY bhi apply na ki jaaye
\`\`\``,

    content: `## What row-level security adds beyond \`GRANT\`

A \`GRANT\` (Lesson 1) controls access to a whole table: a role either can or cannot \`SELECT\` from it, with no finer distinction. **Row-level security (RLS)** adds a second, finer layer on top: even a role that can \`SELECT\` from a table can be restricted to seeing only a subset of its rows, filtered automatically by the database itself.

\`\`\`sql
CREATE TABLE docs (id int PRIMARY KEY, owner text, body text);
INSERT INTO docs VALUES (1, 'alice', 'alice doc'), (2, 'bob', 'bob doc');
ALTER TABLE docs ENABLE ROW LEVEL SECURITY;
CREATE POLICY owner_only ON docs USING (owner = current_user);
\`\`\`

\`ENABLE ROW LEVEL SECURITY\` turns on row filtering for the table (with no policies defined yet, this actually denies all rows to any non-owner role — a policy is what opens specific rows back up). \`CREATE POLICY\` then defines the actual filter: the \`USING\` clause is a boolean expression evaluated per row, and only rows where it evaluates true are visible to a query. Here, \`owner = current_user\` means each role only ever sees rows where the \`owner\` column matches its own role name.

## Why this matters: enforcement lives in the database, not the application

The critical property RLS provides is that this filtering is applied **automatically, to every query**, regardless of how that query is written — a plain \`SELECT *\`, a complex join, a query issued from a completely different application than the one the policy's author had in mind. There is no \`WHERE owner = ?\` clause an application developer could forget to add, because the restriction is not implemented in application code at all; it is a property of the table itself, enforced by PostgreSQL before a query's own \`WHERE\` clause is even considered.

## A common real pattern: tenant isolation via a session variable

Policies based on \`current_user\` work when database roles map one-to-one to real end users, but a typical web application connects as a single shared application role and needs to isolate rows by some other identifier, most commonly a tenant or customer ID carried in the application's own session state:

\`\`\`sql
CREATE POLICY tenant_isolation ON docs
  USING (tenant_id = current_setting('app.tenant_id')::int);

SET app.tenant_id = '100';
SELECT * FROM docs;
\`\`\`

\`current_setting('app.tenant_id')\` reads a custom session-level configuration parameter (any name under a dotted custom prefix like \`app.\` is allowed), which the application sets once per connection or per request, typically right after authenticating the request, so that every subsequent query on that connection is automatically scoped to that tenant — a single point of enforcement rather than a \`WHERE tenant_id = ?\` clause that has to be remembered on every query across the entire codebase.

## The gotcha: table owners bypass RLS by default

\`\`\`sql
-- run as the table's owner, with RLS enabled and a policy defined:
SELECT * FROM docs;
\`\`\`
\`\`\`
 id | owner | body
----+-------+-----------
  1 | alice | alice doc
  2 | bob   | bob doc
(2 rows)
\`\`\`

By default, a table's **owner** (and any superuser) bypasses row-level security entirely, seeing every row regardless of any policy defined — a policy only restricts other roles. This is often exactly what is wanted (an application's own admin or migration role, connecting as the owner, genuinely needs unrestricted access), but it is a frequent source of confusion during testing: a developer testing RLS while connected as the table's owner will see no restriction at all and may wrongly conclude the policy isn't working. \`ALTER TABLE ... FORCE ROW LEVEL SECURITY\` closes this gap, making the policy apply even to the table's owner, for the rare case where even the owning role must never see unfiltered data.

## Choosing between \`GRANT\` and RLS

\`GRANT\` answers "can this role touch this table at all"; RLS answers "which specific rows, within a table this role can already touch, is it allowed to see or modify." They compose: a role still needs a \`GRANT\` to select from a table in the first place, and RLS then further narrows what that \`SELECT\` actually returns. Reach for RLS specifically when different rows within the same table genuinely belong to different parties — multi-tenant SaaS data, per-user private documents — rather than trying to express that distinction only through separate tables or through application-level filtering that every query has to remember to apply correctly.`,

    contentHi: `## Row-level security \`GRANT\` se aage kya add karta hai

Ek \`GRANT\` (Lesson 1) poori table tak access control karta hai: ek role ya to ismein se \`SELECT\` kar sakti hai ya nahi, koi finer distinction nahi. **Row-level security (RLS)** iske upar ek doosri, finer layer add karta hai: ek role jo ek table se \`SELECT\` kar sakti hai use bhi sirf iski rows ke ek subset dekhne tak restrict kiya ja sakta hai, database khud dwara automatically filter kiya gaya.

\`\`\`sql
CREATE TABLE docs (id int PRIMARY KEY, owner text, body text);
INSERT INTO docs VALUES (1, 'alice', 'alice doc'), (2, 'bob', 'bob doc');
ALTER TABLE docs ENABLE ROW LEVEL SECURITY;
CREATE POLICY owner_only ON docs USING (owner = current_user);
\`\`\`

\`ENABLE ROW LEVEL SECURITY\` table ke liye row filtering chालू karta hai. \`CREATE POLICY\` phir asal filter define karta hai: \`USING\` clause ek boolean expression hai jo prati-row evaluate hoती hai, aur sirf wo rows jahaan ye true evaluate hoती hai ek query ko visible hoती hain.

## Ye kyun matter karta hai: enforcement database mein rehta hai, application mein nahi

RLS jo critical property deता hai wo ye hai ki ye filtering **automatically, har query par** apply hoती hai, chahe wo query kaise bhi likhi gayi ho.

## Ek common real pattern: session variable se tenant isolation

\`current_user\` par based policies tab kaam karti hain jab database roles real end users ke saath one-to-one map hoती hain, par ek typical web application ek shared application role se connect karta hai:

\`\`\`sql
CREATE POLICY tenant_isolation ON docs
  USING (tenant_id = current_setting('app.tenant_id')::int);

SET app.tenant_id = '100';
SELECT * FROM docs;
\`\`\`

## Gotcha: table owners default se RLS bypass karте hain

\`\`\`sql
SELECT * FROM docs;
\`\`\`
\`\`\`
 id | owner | body
----+-------+-----------
  1 | alice | alice doc
  2 | bob   | bob doc
(2 rows)
\`\`\`

Default se, ek table ka **owner** (aur koi bhi superuser) row-level security ko poori tarah bypass karta hai. \`ALTER TABLE ... FORCE ROW LEVEL SECURITY\` is gap ko band karta hai, policy ko table ke owner par bhi apply karте hue.

## \`GRANT\` aur RLS ke beech chunна

\`GRANT\` answer karta hai "kya ye role is table ko bilkul touch kar sakti hai"; RLS answer karta hai "kaunsi specific rows, ek table ke andar jise ye role pehle se touch kar sakti hai, ise dekhne ya modify karne ki ijaазат hai."`,

    examples: [
      {
        title: 'A basic owner-only RLS policy restricts a role to its own rows',
        titleHi: 'Ek basic owner-only RLS policy ek role ko iski apni rows tak restrict karta hai',
        code: `CREATE TABLE docs (id int PRIMARY KEY, owner text, body text);
INSERT INTO docs VALUES (1, 'alice', 'alice doc'), (2, 'bob', 'bob doc');
ALTER TABLE docs ENABLE ROW LEVEL SECURITY;
CREATE POLICY owner_only ON docs USING (owner = current_user);
CREATE ROLE alice;
GRANT SELECT ON docs TO alice;
SET ROLE alice;
SELECT * FROM docs;`,
        output: ` id | owner | body
----+-------+-----------
 1  | alice | alice doc
(1 row)`,
        explain: "The policy's `USING (owner = current_user)` clause is evaluated for each row: only row 1, whose `owner` is `'alice'`, matches the role name after `SET ROLE alice`, so `SELECT * FROM docs` returns just that one row. Bob's row is not filtered out by application code — it is invisible to alice at the database level entirely.",
        explainHi: "Policy ka `USING (owner = current_user)` clause har row ke liye evaluate hota hai: sirf row 1, jiska `owner` `'alice'` hai, `SET ROLE alice` ke baad role naam se match karti hai, to `SELECT * FROM docs` sirf wo ek row lautaता hai. Bob ki row application code se filter nahi hoती — ye alice ke liye database level par poori tarah invisible hai.",
      },
      {
        title: 'Multi-tenant isolation via a session variable, for a shared application role',
        titleHi: 'Ek shared application role ke liye ek session variable se multi-tenant isolation',
        code: `CREATE TABLE docs (id int PRIMARY KEY, tenant_id int, body text);
INSERT INTO docs VALUES (1, 100, 'tenant 100 doc'), (2, 200, 'tenant 200 doc');
ALTER TABLE docs ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON docs USING (tenant_id = current_setting('app.tenant_id')::int);
CREATE ROLE app_user;
GRANT SELECT ON docs TO app_user;
SET ROLE app_user;
SET app.tenant_id = '100';
SELECT * FROM docs;`,
        output: ` id | tenant_id | body
----+-----------+----------------
 1  | 100       | tenant 100 doc
(1 row)`,
        explain: "The application connects as the single shared `app_user` role, so `current_user` cannot distinguish tenants. Instead the policy reads `current_setting('app.tenant_id')`, a session variable the application sets per request — with it set to `'100'`, only the `tenant_id = 100` row is visible, and the `tenant_id = 200` row is filtered out automatically.",
        explainHi: "Application single shared `app_user` role ke roop mein connect karta hai, to `current_user` tenants ko distinguish nahi kar sakta. Iske bजाy policy `current_setting('app.tenant_id')` padhती hai, ek session variable jise application prati-request set karta hai — ise `'100'` set hone par, sirf `tenant_id = 100` row visible hai, aur `tenant_id = 200` row automatically filter ho jaती hai.",
      },
      {
        title: 'The table owner bypasses RLS by default, seeing every row',
        titleHi: 'Table owner default se RLS bypass karta hai, har row dekhte hue',
        code: `CREATE TABLE docs (id int PRIMARY KEY, owner text, body text);
INSERT INTO docs VALUES (1, 'alice', 'alice doc'), (2, 'bob', 'bob doc');
ALTER TABLE docs ENABLE ROW LEVEL SECURITY;
CREATE POLICY owner_only ON docs USING (owner = current_user);
SELECT * FROM docs;`,
        output: ` id | owner | body
----+-------+-----------
 1  | alice | alice doc
 2  | bob   | bob doc
(2 rows)`,
        explain: 'RLS is enabled and a restrictive policy exists, but this query runs as the table\'s OWNER — and by default the owner (and any superuser) bypasses row-level security entirely, seeing every row regardless of any policy. This is a frequent source of "the policy isn\'t working" confusion during testing; `ALTER TABLE ... FORCE ROW LEVEL SECURITY` would make the policy apply to the owner too.',
        explainHi: 'RLS enabled hai aur ek restrictive policy exist karti hai, par ye query table ke OWNER ke roop mein chalti hai — aur default se owner (aur koi bhi superuser) row-level security ko poori tarah bypass karta hai, har row dekhte hue chahe koi bhi policy ho. Ye testing ke dauран "policy kaam nahi kar rahi" confusion ka ek frequent source hai.',
      },
    ],

    mistakes: [
      {
        wrong: `-- testing an RLS policy while connected as the table's owner
CREATE TABLE docs (id int PRIMARY KEY, owner text, body text);
ALTER TABLE docs ENABLE ROW LEVEL SECURITY;
CREATE POLICY owner_only ON docs USING (owner = current_user);
SELECT * FROM docs;   -- (run as the owner, right after creating the policy)
-- returns EVERY row -- "the policy doesn't seem to be doing anything!"`,
        right: `-- ALWAYS test a policy as a role OTHER than the table's owner:
CREATE ROLE alice;
GRANT SELECT ON docs TO alice;
SET ROLE alice;
SELECT * FROM docs;   -- NOW the policy actually filters rows
RESET ROLE;
-- (or use FORCE ROW LEVEL SECURITY if the owner itself must also be restricted)`,
        why: 'Table owners, and superusers, bypass row-level security entirely by default, regardless of what policies are defined on a table, because the feature is designed to restrict other roles\' access to data the owner already fully controls, not to restrict the owner\'s own access to their own table. This means testing a newly created policy while still connected as the role that created the table will always show every row, with no filtering applied, which can easily be misread as the policy failing to work when in fact it is working exactly as designed, just not against the role being tested. The reliable way to verify a policy\'s actual behavior is to switch to a genuinely different, non-owner role, using SET ROLE for a quick check within the same session, and confirm the filtering happens there; if the intent is for even the owner to be restricted, ALTER TABLE ... FORCE ROW LEVEL SECURITY is the explicit opt-in for that less common requirement.',
        whyHi: 'Table owners, aur superusers, default se row-level security ko poori tarah bypass karte hain, chahe ek table par kaisī bhi policies defined hon, kyunki ye feature doosri roles ki access ko restrict karne ke liye design kiya gaya hai un data tak jise owner pehle se poori tarah control karta hai. Ek policy ko usko genuinely alag, non-owner role par switch karके verify karna reliable tarika hai.',
      },
      {
        wrong: `-- using current_user in a policy for a shared application connection role
CREATE POLICY tenant_isolation ON docs USING (owner = current_user);
-- but the application connects as ONE shared "app_service" role for every
-- tenant -- current_user is ALWAYS "app_service", never the actual tenant`,
        right: `-- use a session variable the application sets per-request instead:
CREATE POLICY tenant_isolation ON docs
  USING (tenant_id = current_setting('app.tenant_id')::int);
-- application code: SET app.tenant_id = '<the authenticated tenant's id>';
-- right after establishing/reusing the connection, before running tenant queries`,
        why: 'current_user reflects the database role the current session actually authenticated as, and for a typical application architecture, every request from every tenant shares the exact same underlying database connection role, meaning current_user would evaluate to that one shared role for literally every request, making a policy based on it either always true or always false rather than actually distinguishing between tenants. A session-scoped custom configuration parameter, set via SET immediately after the application establishes or picks up a connection for a specific request, carries the actual per-request identity, such as a tenant ID, that current_user cannot express, and reading it back with current_setting inside the policy is what lets a single shared connection role still be correctly restricted to only that request\'s own data. Confusing "which database role authenticated" with "which end user or tenant this specific request is acting on behalf of" is the core mistake here, and they are genuinely different pieces of information in any application that does not create one database role per end user.',
        whyHi: '`current_user` us database role ko reflect karta hai jise current session ne asal mein authenticate kiya, aur ek typical application architecture ke liye, har tenant ki har request theek wahi underlying database connection role share karti hai, jiska matlab `current_user` literally har request ke liye us ek shared role ke barаbar evaluate hoगi. Ek session-scoped custom configuration parameter, jise application ek specific request ke liye connection establish karne ke turant baad `SET` karta hai, actual per-request identity carry karta hai.',
      },
      {
        wrong: `-- assuming ENABLE ROW LEVEL SECURITY alone restricts anything
ALTER TABLE docs ENABLE ROW LEVEL SECURITY;
-- (no CREATE POLICY yet)
SET ROLE alice;
SELECT * FROM docs;
-- returns ZERO rows -- surprising if you expected "no policy = no restriction"`,
        right: `ALTER TABLE docs ENABLE ROW LEVEL SECURITY;
CREATE POLICY owner_only ON docs USING (owner = current_user);
-- a policy is what OPENS specific rows back up -- enabling RLS with NO
-- policies denies ALL rows to any non-owner role, by design`,
        why: 'Enabling row-level security on a table switches its default posture for non-owner roles from "fully visible" to "fully hidden," and it is a policy\'s job to selectively open specific rows back up from that fully-hidden baseline, not to add restriction on top of an otherwise-visible table. This means a table with ENABLE ROW LEVEL SECURITY but zero policies defined denies every row to every non-owner role, which surprises anyone expecting the absence of a policy to mean the absence of any restriction, when in fact the opposite is true: RLS itself is what introduces the restriction, and a policy is what carves out exceptions to it. This default-deny posture mirrors GRANT\'s own default-deny model from Lesson 1, and forgetting it can produce an application that suddenly sees no rows at all the moment RLS is enabled, if the corresponding policy is not created in the same change.',
        whyHi: 'Ek table par row-level security enable karna non-owner roles ke liye iske default posture ko "poori tarah visible" se "poori tarah hidden" mein badalता hai, aur ek policy ka kaam wahi hidden baseline se specific rows ko selectively wapas kholna hai. Iska matlab hai ki `ENABLE ROW LEVEL SECURITY` waali par zero policies waali ek table har non-owner role ko har row deny karti hai.',
      },
    ],

    realWorld: [
      {
        en: '**A multi-tenant SaaS product enforcing `tenant_id = current_setting(\'app.tenant_id\')` on every customer-data table**, so a single missed `WHERE tenant_id = ?` in a hastily written report query can never leak another tenant\'s data.',
        hi: '**Ek multi-tenant SaaS product jo har customer-data table par `tenant_id = current_setting(\'app.tenant_id\')` enforce karta hai**, taaki ek hastily likhi report query mein ek missed `WHERE tenant_id = ?` kabhi doosre tenant ka data leak na kare.',
      },
      {
        en: '**A `documents` table with an RLS policy checking `owner_id = current_setting(\'app.user_id\')::int`**, so a user-facing API can safely run `SELECT * FROM documents` without hand-writing per-user filtering in every single endpoint.',
        hi: '**Ek `documents` table jismein ek RLS policy `owner_id = current_setting(\'app.user_id\')::int` check karti hai**, taaki ek user-facing API safely `SELECT * FROM documents` chala sake bina har single endpoint mein prati-user filtering haath se likhे.',
      },
      {
        en: '**A compliance requirement satisfied by `FORCE ROW LEVEL SECURITY`** on a table holding regulated data, ensuring even a database administrator connecting directly cannot casually view rows outside their own authorized scope.',
        hi: '**Ek compliance requirement `FORCE ROW LEVEL SECURITY` se satisfy ki gayi** ek table par jo regulated data rakhती hai, ensure karte hue ki seedhe connect hone waala ek database administrator bhi apne authorized scope se bahar rows casually na dekh sake.',
      },
    ],

    interviewQA: [
      {
        q: 'What does row-level security add beyond a GRANT, and why is enforcing it in the database better than filtering in application code?',
        qHi: 'Row-level security ek `GRANT` se aage kya add karta hai, aur ise database mein enforce karna application code mein filter karne se behtar kyun hai?',
        a: 'A GRANT controls whether a role can access a table at all, at the granularity of the whole table, with no distinction between individual rows within it. Row-level security adds a finer-grained layer on top: even a role that is permitted to select from a table can be restricted, by a policy evaluated per row, to seeing only the subset of rows that policy allows, based on some condition like the row belonging to that user or tenant. The reason enforcing this in the database is meaningfully better than filtering in application code is that a database-level policy is applied automatically to every single query against that table, regardless of how that query was written, whether it came from the original application, a hastily written ad hoc report, a different microservice added later, or a developer connected directly for debugging, none of which can accidentally omit a WHERE clause the way application code can, because the restriction is not implemented as a WHERE clause anyone has to remember to add in the first place, it is an inherent property of the table itself.',
        aHi: 'Ek `GRANT` poori table ke granularity par control karta hai ki kya ek role table ko access kar sakti hai, iske andar individual rows ke beech koi distinction ke bina. Row-level security iske upar ek finer-grained layer add karta hai: ek role jise table se select karne ki ijaазат hai use bhi, ek prati-row evaluate hoती policy se, sirf rows ke ek subset tak restrict kiya ja sakta hai. Ise database mein enforce karna application code mein filter karne se meaningfully behtar hai kyunki ek database-level policy us table ke against har single query par automatically apply hoती hai.',
      },
      {
        q: 'Why does a table owner see all rows even after RLS is enabled and a restrictive policy is defined, and how would you change that?',
        qHi: 'Ek table owner RLS enable hone aur ek restrictive policy define hone ke baad bhi sabhi rows kyun dekhता hai, aur aap ise kaise badloge?',
        a: 'By default, PostgreSQL exempts a table\'s owner, along with any superuser, from row-level security entirely, regardless of what policies exist on that table, because the feature\'s intended purpose is to restrict other roles\' access to data the owner already fully controls, not to impose restrictions on the owner\'s own access to a table they own. This is a frequent source of confusion during development, since testing a newly written policy while still connected as the role that created the table will show every row with no filtering at all, which can be misread as the policy failing to work, when it is actually working correctly, just not against the role being tested, since the owner is exempt by design. Verifying a policy properly requires switching to some other, non-owner role, commonly via SET ROLE within the same session for a quick check, and confirming the filtering takes effect there. If the actual requirement is for even the table\'s owner to be subject to the policy, which is a less common but real need in some compliance-driven scenarios, ALTER TABLE ... FORCE ROW LEVEL SECURITY explicitly closes that exemption.',
        aHi: 'Default se, PostgreSQL ek table ke owner ko, superusers ke saath, row-level security se poori tarah exempt karta hai, chahe us table par kaisī bhi policies exist karти hon, kyunki feature ka intended purpose doosri roles ki access ko restrict karна hai un data tak jise owner pehle se poori tarah control karta hai. Ek policy ko properly verify karne ke liye kisī doosri, non-owner role mein switch karna paता hai. Agar actual zaroorat ye hai ki table ka owner bhi policy ke subject ho, `ALTER TABLE ... FORCE ROW LEVEL SECURITY` explicitly us exemption ko band karta hai.',
      },
    ],

    exercises: [
      {
        task: 'Table `docs(id int PRIMARY KEY, owner text, body text)` with rows owned by `\'alice\'` and `\'bob\'`. Enable RLS, create a policy `USING (owner = current_user)`, create a role `alice`, grant it `SELECT`, and confirm `SET ROLE alice` sees only alice\'s row.',
        taskHi: 'Table `docs(id, owner, body)` `\'alice\'` aur `\'bob\'` ke owned rows ke saath. RLS enable karo, ek policy `USING (owner = current_user)` banao, ek role `alice` banao, ise `SELECT` grant karo, aur confirm karo `SET ROLE alice` sirf alice ki row dekhती hai.',
        hint: 'The `USING` clause is evaluated per row — only rows where `owner = current_user` evaluates true are visible to that role\'s queries.',
        hintHi: '`USING` clause prati-row evaluate hoती hai — sirf wo rows jahaan `owner = current_user` true evaluate hoती hai us role ki queries ko visible hoती hain.',
      },
      {
        task: 'Table `docs(id int PRIMARY KEY, tenant_id int, body text)` with rows for `tenant_id` 100 and 200. Enable RLS with a policy using `current_setting(\'app.tenant_id\')::int`, create a shared role `app_user`, grant `SELECT`, `SET ROLE app_user`, `SET app.tenant_id = \'100\'`, and confirm only tenant 100\'s row is visible.',
        taskHi: 'Table `docs(id, tenant_id, body)` `tenant_id` 100 aur 200 ke rows ke saath. `current_setting(\'app.tenant_id\')::int` istemal karti ek policy ke saath RLS enable karo, ek shared role `app_user` banao, `SELECT` grant karo, `SET ROLE app_user`, `SET app.tenant_id = \'100\'`, aur confirm karo sirf tenant 100 ki row visible hai.',
        hint: 'A session variable set via `SET app.tenant_id = ...` (read back with `current_setting`) is the right tool for a shared application connection role, since `current_user` would be the same for every tenant.',
        hintHi: '`SET app.tenant_id = ...` se set ek session variable (jise `current_setting` se wapas padha jaata hai) ek shared application connection role ke liye sahi tool hai, kyunki `current_user` har tenant ke liye same hoгa.',
      },
      {
        task: 'Same `owner`-based policy as the first exercise. This time, WITHOUT `SET ROLE`, run `SELECT * FROM docs` as the table\'s owner and observe that both rows are returned. Explain in a comment why this happens.',
        taskHi: 'Pehle exercise jaisī hi `owner`-based policy. Is baar, `SET ROLE` ke bina, table ke owner ke roop mein `SELECT * FROM docs` chalao aur observe karo ki dono rows lautाti hain. Ek comment mein samjhaओ ki ye kyun hota hai.',
        hint: 'Table owners (and superusers) bypass RLS entirely by default, regardless of any policy — this is by design, not a bug. `FORCE ROW LEVEL SECURITY` is the explicit opt-in to also restrict the owner.',
        hintHi: 'Table owners (aur superusers) default se RLS ko poori tarah bypass karte hain, chahe koi bhi policy ho — ye design se hai, koi bug nahi. `FORCE ROW LEVEL SECURITY` owner ko bhi restrict karne ka explicit opt-in hai.',
      },
    ],

    keyTakeaways: [
      'Row-level security (RLS) adds a filtering layer BENEATH `GRANT` (Lesson 1): `GRANT` decides whether a role can touch a table at all; RLS decides which specific ROWS within that table it can see or modify.',
      '`ALTER TABLE ... ENABLE ROW LEVEL SECURITY` + `CREATE POLICY ... USING (<boolean expression, evaluated per row>)` — only rows where the expression is true are visible. ENABLING RLS WITH NO POLICY DENIES ALL ROWS to non-owner roles — a policy is what opens rows back up, not an added restriction on an otherwise-open table.',
      'RLS is enforced AUTOMATICALLY on EVERY query against the table, regardless of how it\'s written — no `WHERE` clause an application developer could forget, because the restriction isn\'t application code at all.',
      'For a role mapped 1:1 to a real user, `owner = current_user` works. For a SHARED application connection role (the common real-world case), use a session variable instead: `current_setting(\'app.tenant_id\')::int`, set once per request via `SET app.tenant_id = ...` — `current_user` would be the same shared role for every tenant and can\'t express per-request identity.',
      'GOTCHA: the TABLE OWNER (and superusers) BYPASS RLS entirely by default, regardless of any policy — a common source of "the policy isn\'t working!" confusion when testing while still connected as the owner. Always test as a genuinely different, non-owner role (`SET ROLE`). `ALTER TABLE ... FORCE ROW LEVEL SECURITY` closes this gap when even the owner must be restricted.',
    ],
    keyTakeawaysHi: [
      'Row-level security (RLS) `GRANT` (Lesson 1) ke NEECHE ek filtering layer add karta hai: `GRANT` decide karta hai kya ek role table ko bilkul touch kar sakti hai; RLS decide karta hai us table ke andar kaunsi specific ROWS ye dekh ya modify kar sakti hai.',
      '`ALTER TABLE ... ENABLE ROW LEVEL SECURITY` + `CREATE POLICY ... USING (<boolean expression, prati-row evaluate>)` — sirf wo rows visible hain jahaan expression true hai. KOI POLICY NA HOTE HUE RLS ENABLE KARNA SABHI ROWS DENY KARTA HAI non-owner roles ke liye.',
      'RLS us table ke against HAR query par AUTOMATICALLY enforce hota hai, chahe wo kaise bhi likhi gayi ho — koi `WHERE` clause jise ek application developer bhool sakta hai nahi, kyunki restriction application code bilkul nahi hai.',
      'Ek real user se 1:1 mapped role ke liye, `owner = current_user` kaam karta hai. Ek SHARED application connection role ke liye, iske bजаय ek session variable istemal karo: `current_setting(\'app.tenant_id\')::int`.',
      'GOTCHA: TABLE OWNER (aur superusers) default se RLS ko poori tarah BYPASS karte hain, chahe koi bhi policy ho — testing karte waqt owner se connected rehते hue "policy kaam nahi kar rahi!" confusion ka ek common source. Hamesha ek genuinely alag, non-owner role se test karo. `ALTER TABLE ... FORCE ROW LEVEL SECURITY` is gap ko band karta hai.',
    ],
  },

  {
    slug: 'sql-partitioning',
    title: 'Partitioning',
    titleHi: 'Partitioning',
    description: 'A table too large to comfortably scan, vacuum, or manage as one physical object can be split into partitions — physically separate tables that together behave as one logical table — and the planner can skip partitions a query cannot possibly match entirely.',
    descriptionHi: 'Ek table jo ek physical object ke roop mein comfortably scan, vacuum, ya manage karne ke liye bahut badी hai use partitions mein toड़ा ja sakta hai — physically alag tables jo saath ek logical table ki tarah behave karte hain — aur planner un partitions ko poori tarah skip kar sakta hai jinse ek query kisī bhi tarah match nahi kar sakti.',
    difficulty: 'HARD',
    duration: 24,
    order: 3,

    analogy: {
      en: '**A huge archive split into separate, labeled filing cabinets by year, instead of one cabinet holding every document ever filed.** Filing every document a company has ever produced into one continuously growing cabinet works at first, but eventually finding this year\'s invoices means wading past a decade of irrelevant paper, and any maintenance on the cabinet, reorganizing it, checking it for damage, touches the whole overwhelming mass at once. Splitting the archive into separate cabinets, one clearly labeled per year, changes both problems at once: someone looking for a 2026 invoice walks straight to the 2026 cabinet and never touches the others at all — this is partition pruning — and a maintenance crew reorganizing just this year\'s cabinet never has to touch last year\'s at all, since they are physically separate pieces of furniture that merely happen to be treated as one logical archive by anyone searching across all of them at once.',
      hi: '**Ek huge archive jo saal ke hisaab se alag, labeled filing cabinets mein todа gaya, ek cabinet ke bजаय jo kabhi file kiya gaya har document rakhta hai.** Ek company ne ab tak jo bhi document banaya use ek continuously growing cabinet mein file karna pehle theek kaam karta hai, par aakhirkar is saal ke invoices dhoondне ka matlab hai ek dashak ke irrelevant paper ko paार karna, aur cabinet par koi bhi maintenance poore overwhelming mass ko ek saath touch karti hai. Archive ko alag cabinets mein toड़na, ek saaf labeled prati-saal, dono problems ko ek saath badalta hai: 2026 ka invoice dhoondне waala koi 2026 cabinet tak seedhe chalta hai aur baaki ko bilkul touch nahi karta — ye partition pruning hai.',
    },

    simple: `**\`PARTITION BY RANGE\`: split a table into ranges of a value (typically a date)**

\`\`\`sql
CREATE TABLE events (id int, occurred_at date, payload text) PARTITION BY RANGE (occurred_at);
CREATE TABLE events_2025 PARTITION OF events FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
CREATE TABLE events_2026 PARTITION OF events FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');
INSERT INTO events VALUES (1, '2025-06-01', 'a'), (2, '2026-06-01', 'b');
\`\`\`

**A query on the partition key gets PRUNED to only the relevant partition(s)**

\`\`\`sql
EXPLAIN (COSTS OFF) SELECT * FROM events WHERE occurred_at = '2026-06-01';
\`\`\`
\`\`\`
Seq Scan on events_2026 events
  Filter: (occurred_at = '2026-06-01'::date)
-- ONLY events_2026 was scanned -- events_2025 was skipped ENTIRELY, its rows
-- couldn't possibly match this date
\`\`\`

**A query NOT on the partition key gets NO pruning -- every partition is scanned**

\`\`\`sql
EXPLAIN (COSTS OFF) SELECT * FROM events WHERE payload = 'a';
\`\`\`
\`\`\`
Append
  ->  Seq Scan on events_2025 events_1
        Filter: (payload = 'a'::text)
  ->  Seq Scan on events_2026 events_2
        Filter: (payload = 'a'::text)
-- BOTH partitions scanned -- the planner has no way to know which partition
-- a given "payload" value lives in
\`\`\`

**\`PARTITION BY LIST\`: split by explicit, named values (categories, regions)**

\`\`\`sql
CREATE TABLE orders (id int, region text, amt int) PARTITION BY LIST (region);
CREATE TABLE orders_us PARTITION OF orders FOR VALUES IN ('US');
CREATE TABLE orders_eu PARTITION OF orders FOR VALUES IN ('EU', 'UK');
EXPLAIN (COSTS OFF) SELECT * FROM orders WHERE region = 'EU';
\`\`\`
\`\`\`
Seq Scan on orders_eu orders
  Filter: (region = 'EU'::text)
\`\`\`

**\`PARTITION BY HASH\`: split evenly by a hash of the key -- for spreading load, not for pruning by value**

\`\`\`sql
CREATE TABLE t (id int, val text) PARTITION BY HASH (id);
CREATE TABLE t_p0 PARTITION OF t FOR VALUES WITH (MODULUS 2, REMAINDER 0);
CREATE TABLE t_p1 PARTITION OF t FOR VALUES WITH (MODULUS 2, REMAINDER 1);
-- rows are distributed by hash(id) % 2 -- NOT a simple id-is-even/odd split
\`\`\``,

    simpleHi: `**\`PARTITION BY RANGE\`: ek table ko ek value ke ranges mein toड़о (typically ek date)**

\`\`\`sql
CREATE TABLE events (id int, occurred_at date, payload text) PARTITION BY RANGE (occurred_at);
CREATE TABLE events_2025 PARTITION OF events FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
CREATE TABLE events_2026 PARTITION OF events FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');
INSERT INTO events VALUES (1, '2025-06-01', 'a'), (2, '2026-06-01', 'b');
\`\`\`

**Partition key par ek query sirf relevant partition(s) tak PRUNED hoती hai**

\`\`\`sql
EXPLAIN (COSTS OFF) SELECT * FROM events WHERE occurred_at = '2026-06-01';
\`\`\`
\`\`\`
Seq Scan on events_2026 events
  Filter: (occurred_at = '2026-06-01'::date)
-- SIRF events_2026 scan hui -- events_2025 POORI TARAH skip hui
\`\`\`

**Partition key PAR NAHI ek query ko koi pruning NAHI miलती -- har partition scan hoती hai**

\`\`\`sql
EXPLAIN (COSTS OFF) SELECT * FROM events WHERE payload = 'a';
\`\`\`
\`\`\`
Append
  ->  Seq Scan on events_2025 events_1
        Filter: (payload = 'a'::text)
  ->  Seq Scan on events_2026 events_2
        Filter: (payload = 'a'::text)
-- DONO partitions scan hui -- planner ko pata nahi ki ek diya gaya "payload"
-- value kaunse partition mein rehta hai
\`\`\`

**\`PARTITION BY LIST\`: explicit, named values se toड़о (categories, regions)**

\`\`\`sql
CREATE TABLE orders (id int, region text, amt int) PARTITION BY LIST (region);
CREATE TABLE orders_us PARTITION OF orders FOR VALUES IN ('US');
CREATE TABLE orders_eu PARTITION OF orders FOR VALUES IN ('EU', 'UK');
EXPLAIN (COSTS OFF) SELECT * FROM orders WHERE region = 'EU';
\`\`\`
\`\`\`
Seq Scan on orders_eu orders
  Filter: (region = 'EU'::text)
\`\`\`

**\`PARTITION BY HASH\`: key ke ek hash se evenly toड़о -- pruning ke liye nahi, load spread karne ke liye**

\`\`\`sql
CREATE TABLE t (id int, val text) PARTITION BY HASH (id);
CREATE TABLE t_p0 PARTITION OF t FOR VALUES WITH (MODULUS 2, REMAINDER 0);
CREATE TABLE t_p1 PARTITION OF t FOR VALUES WITH (MODULUS 2, REMAINDER 1);
-- rows hash(id) % 2 se distribute hoti hain -- ek simple id-even/odd split nahi
\`\`\``,

    content: `## Why partition a table at all

A single table growing into the hundreds of millions of rows becomes expensive to manage as one physical object: a sequential scan touches more pages, an index grows larger and slower to maintain, a \`VACUUM\` pass takes longer, and dropping old data means a slow, row-by-row \`DELETE\` rather than an instant operation. **Partitioning** splits one logical table into several physically separate tables, each holding a defined subset of the rows, while still letting ordinary queries address the whole thing through the parent table's name as if it were unpartitioned.

## \`PARTITION BY RANGE\`

\`\`\`sql
CREATE TABLE events (id int, occurred_at date, payload text) PARTITION BY RANGE (occurred_at);
CREATE TABLE events_2025 PARTITION OF events FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
CREATE TABLE events_2026 PARTITION OF events FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');
\`\`\`

Range partitioning splits rows by which range of a value (almost always a date or a monotonically increasing identifier) they fall into — the natural fit for time-series or log-style data, where old partitions can eventually be dropped or archived wholesale, and new ones added ahead of time for future data.

## Partition pruning: skipping partitions that cannot match

\`\`\`sql
EXPLAIN (COSTS OFF) SELECT * FROM events WHERE occurred_at = '2026-06-01';
\`\`\`
\`\`\`
Seq Scan on events_2026 events
  Filter: (occurred_at = '2026-06-01'::date)
\`\`\`

Because \`2026-06-01\` cannot possibly appear in \`events_2025\` (whose range is bounded to 2025), the planner **prunes** that partition from the plan entirely — it is never scanned, never even considered, exactly as if it did not exist for this particular query. This is the entire performance benefit of partitioning for read queries: instead of scanning one enormous table, a well-targeted query only ever touches the one (or few) partitions that could possibly hold a match.

## Pruning only helps when the query filters on the partition key

\`\`\`sql
EXPLAIN (COSTS OFF) SELECT * FROM events WHERE payload = 'a';
\`\`\`
\`\`\`
Append
  ->  Seq Scan on events_2025 events_1
        Filter: (payload = 'a'::text)
  ->  Seq Scan on events_2026 events_2
        Filter: (payload = 'a'::text)
\`\`\`

A condition on \`payload\`, a column with no relationship to \`occurred_at\`, gives the planner no basis to rule out any partition — a matching row could be in either one, so both are scanned and their results combined under an **\`Append\`** node. This is the direct partitioning analogue of Module 10's leading-prefix rule for composite indexes: pruning is only available when a query's filter actually constrains the column partitioning is organized around.

## \`PARTITION BY LIST\`

\`\`\`sql
CREATE TABLE orders (id int, region text, amt int) PARTITION BY LIST (region);
CREATE TABLE orders_us PARTITION OF orders FOR VALUES IN ('US');
CREATE TABLE orders_eu PARTITION OF orders FOR VALUES IN ('EU', 'UK');
EXPLAIN (COSTS OFF) SELECT * FROM orders WHERE region = 'EU';
\`\`\`
\`\`\`
Seq Scan on orders_eu orders
  Filter: (region = 'EU'::text)
\`\`\`

List partitioning assigns rows to a partition by explicit, named values rather than a range — a natural fit for a column with a small, known set of categories (region, status, tenant tier), where each partition's \`FOR VALUES IN (...)\` lists exactly which values belong to it. Pruning works identically to range partitioning: a query filtering on \`region = 'EU'\` only touches \`orders_eu\`.

## \`PARTITION BY HASH\`

\`\`\`sql
CREATE TABLE t (id int, val text) PARTITION BY HASH (id);
CREATE TABLE t_p0 PARTITION OF t FOR VALUES WITH (MODULUS 2, REMAINDER 0);
CREATE TABLE t_p1 PARTITION OF t FOR VALUES WITH (MODULUS 2, REMAINDER 1);
\`\`\`

Hash partitioning assigns each row to a partition based on a hash of the partitioning column, distributed across a fixed number of partitions (\`MODULUS\`) — the point is not pruning by value (a hash gives the planner no meaningful range or category to reason about) but **spreading rows and write load roughly evenly** across several physically separate tables, useful when no natural range or category exists to partition by, but a single table has genuinely grown too large to manage as one object.

## Partitioning is an operational tool, not a query-design one

Choosing a partitioning strategy is fundamentally a decision about how data is *organized on disk and maintained*, not about correctness: every query written against \`events\` or \`orders\` in the examples above works identically whether the table is partitioned or not, and pruning is an optimization the planner applies transparently when it can. The decision to partition, and by what key, should follow from genuinely operational concerns — data old enough to bulk-drop, a table too large for \`VACUUM\` to keep up with, a natural time or category boundary the application already filters by constantly — not from a belief that partitioning is inherently faster for every query, since a query that doesn't filter on the partition key gains nothing from partitioning and can occasionally do slightly more work than an equivalent unpartitioned table would.`,

    contentHi: `## Ek table ko partition bilkul kyun karo

Ek single table jo करोड़ों rows tak badhta hai ek physical object ke roop mein manage karne ke liye mehanga ban jaata hai. **Partitioning** ek logical table ko kई physically alag tables mein toड़ता hai, har ek rows ka ek defined subset rakhте hue, phir bhi ordinary queries ko poori cheez ko parent table ke naam se address karne deता hai jaisе ye unpartitioned ho.

## \`PARTITION BY RANGE\`

\`\`\`sql
CREATE TABLE events (id int, occurred_at date, payload text) PARTITION BY RANGE (occurred_at);
CREATE TABLE events_2025 PARTITION OF events FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
CREATE TABLE events_2026 PARTITION OF events FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');
\`\`\`

Range partitioning rows ko ise split karta hai ki ye ek value (lgбхаg hamesha ek date) ke kaunse range mein aati hain — time-series ya log-style data ke liye natural fit.

## Partition pruning: un partitions ko skip karna jo match nahi kar sakte

\`\`\`sql
EXPLAIN (COSTS OFF) SELECT * FROM events WHERE occurred_at = '2026-06-01';
\`\`\`
\`\`\`
Seq Scan on events_2026 events
  Filter: (occurred_at = '2026-06-01'::date)
\`\`\`

Kyunki \`2026-06-01\` \`events_2025\` mein bilkul nahi aa sakта, planner us partition ko plan se poori tarah **prune** karta hai.

## Pruning sirf tab madad karti hai jab query partition key par filter karti hai

\`\`\`sql
EXPLAIN (COSTS OFF) SELECT * FROM events WHERE payload = 'a';
\`\`\`
\`\`\`
Append
  ->  Seq Scan on events_2025 events_1
        Filter: (payload = 'a'::text)
  ->  Seq Scan on events_2026 events_2
        Filter: (payload = 'a'::text)
\`\`\`

\`payload\` par ek condition, ek column jiska \`occurred_at\` se koi relationship nahi, planner ko kisī bhi partition ko rule out karne ka koi aadhaar nahi deता.

## \`PARTITION BY LIST\`

\`\`\`sql
CREATE TABLE orders (id int, region text, amt int) PARTITION BY LIST (region);
CREATE TABLE orders_us PARTITION OF orders FOR VALUES IN ('US');
CREATE TABLE orders_eu PARTITION OF orders FOR VALUES IN ('EU', 'UK');
EXPLAIN (COSTS OFF) SELECT * FROM orders WHERE region = 'EU';
\`\`\`
\`\`\`
Seq Scan on orders_eu orders
  Filter: (region = 'EU'::text)
\`\`\`

List partitioning rows ko explicit, named values se ek partition assign karta hai ek range ke bजаय.

## \`PARTITION BY HASH\`

\`\`\`sql
CREATE TABLE t (id int, val text) PARTITION BY HASH (id);
CREATE TABLE t_p0 PARTITION OF t FOR VALUES WITH (MODULUS 2, REMAINDER 0);
CREATE TABLE t_p1 PARTITION OF t FOR VALUES WITH (MODULUS 2, REMAINDER 1);
\`\`\`

Hash partitioning har row ko partitioning column ke ek hash ke aadhaar par ek partition assign karta hai.

## Partitioning ek operational tool hai, ek query-design tool nahi

Ek partitioning strategy chunna fundamentally is baare mein ek decision hai ki data disk par kaise *organized aur maintain* hota hai, correctness ke baare mein nahi.`,

    examples: [
      {
        title: 'A query on the partition key gets pruned to only the matching partition',
        titleHi: 'Partition key par ek query sirf matching partition tak pruned hoती hai',
        code: `CREATE TABLE events (id int, occurred_at date, payload text) PARTITION BY RANGE (occurred_at);
CREATE TABLE events_2025 PARTITION OF events FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
CREATE TABLE events_2026 PARTITION OF events FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');
INSERT INTO events VALUES (1, '2025-06-01', 'a'), (2, '2026-06-01', 'b');
EXPLAIN (COSTS OFF) SELECT * FROM events WHERE occurred_at = '2026-06-01';`,
        output: ` QUERY PLAN
----------------------------------------------
 Seq Scan on events_2026 events
   Filter: (occurred_at = '2026-06-01'::date)
(2 rows)`,
        explain: "The filter `occurred_at = '2026-06-01'` constrains the exact column `events` is partitioned on, so the planner can prove `events_2025` (bounded to 2025) cannot contain a match and PRUNES it from the plan entirely — the plan scans only `events_2026`, exactly as if the 2025 partition did not exist for this query.",
        explainHi: "Filter `occurred_at = '2026-06-01'` theek us column ko constrain karta hai jispar `events` partition ki gayi hai, to planner prove kar sakta hai ki `events_2025` (2025 tak bounded) ek match contain nahi kar sakta aur ise plan se poori tarah PRUNE karta hai — plan sirf `events_2026` scan karta hai.",
      },
      {
        title: 'A filter on a non-partition-key column gets no pruning at all',
        titleHi: 'Non-partition-key column par ek filter ko koi pruning nahi milती',
        code: `CREATE TABLE events (id int, occurred_at date, payload text) PARTITION BY RANGE (occurred_at);
CREATE TABLE events_2025 PARTITION OF events FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
CREATE TABLE events_2026 PARTITION OF events FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');
INSERT INTO events VALUES (1, '2025-06-01', 'a'), (2, '2026-06-01', 'b');
EXPLAIN (COSTS OFF) SELECT * FROM events WHERE payload = 'a';`,
        output: ` QUERY PLAN
----------------------------------------
 Append
   ->  Seq Scan on events_2025 events_1
         Filter: (payload = 'a'::text)
   ->  Seq Scan on events_2026 events_2
         Filter: (payload = 'a'::text)
(5 rows)`,
        explain: '`payload` has no relationship to the `occurred_at`-based partitioning scheme, so the planner cannot rule out either partition — a matching row could be in either. Both are scanned and their results combined under an `Append` node. This is the direct cost of filtering on a column pruning does not apply to.',
        explainHi: '`payload` ka `occurred_at`-based partitioning scheme se koi relationship nahi hai, to planner kisī bhi partition ko rule out nahi kar sakta — ek matching row kisī bhi mein ho sakti hai. Dono scan hoती hain aur unke results ek `Append` node ke under combine hoते hain.',
      },
      {
        title: 'List partitioning prunes to the one partition holding the matching value',
        titleHi: 'List partitioning matching value rakhने waali ek partition tak prune hoती hai',
        code: `CREATE TABLE orders (id int, region text, amt int) PARTITION BY LIST (region);
CREATE TABLE orders_us PARTITION OF orders FOR VALUES IN ('US');
CREATE TABLE orders_eu PARTITION OF orders FOR VALUES IN ('EU', 'UK');
INSERT INTO orders VALUES (1, 'US', 100), (2, 'EU', 200), (3, 'UK', 300);
EXPLAIN (COSTS OFF) SELECT * FROM orders WHERE region = 'EU';`,
        output: ` QUERY PLAN
---------------------------------
 Seq Scan on orders_eu orders
   Filter: (region = 'EU'::text)
(2 rows)`,
        explain: "List partitioning prunes identically to range partitioning: the filter `region = 'EU'` constrains the exact partitioning column, so the planner identifies that only `orders_eu` (defined as `FOR VALUES IN ('EU', 'UK')`) could contain a match, and scans only that partition — `orders_us` is skipped entirely.",
        explainHi: "List partitioning range partitioning ki tarah hi prune hoती hai: filter `region = 'EU'` theek partitioning column ko constrain karta hai, to planner identify karta hai ki sirf `orders_eu` (`FOR VALUES IN ('EU', 'UK')` ke roop mein defined) ek match contain kar sakta hai, aur sirf wo partition scan karta hai — `orders_us` poori tarah skip ho jaता hai.",
      },
    ],

    mistakes: [
      {
        wrong: `-- expecting partitioning to speed up EVERY query on a table automatically
-- (table events, PARTITION BY RANGE (occurred_at))
EXPLAIN (COSTS OFF) SELECT * FROM events WHERE payload = 'a';
-- Append over ALL partitions -- "but I partitioned this table, shouldn't
-- everything be faster now?"`,
        right: `-- pruning only helps queries that filter on the PARTITION KEY itself:
EXPLAIN (COSTS OFF) SELECT * FROM events WHERE occurred_at = '2026-06-01';
-- if payload lookups are also common, that likely calls for a plain INDEX
-- on payload (Module 10) -- partitioning and indexing solve DIFFERENT problems`,
        why: 'Partitioning organizes a table\'s physical storage around one specific column, and the planner can only rule out a partition when a query\'s condition provides information about that exact column; a condition on any other column gives the planner nothing to reason about regarding which partition might hold a match, since the partitioning scheme has no relationship to that column\'s values at all. This means partitioning is not a general-purpose performance feature that speeds up every query against a table; it specifically speeds up queries that filter on the partitioning key, while queries filtering on other columns still have to scan every partition, combined under an Append node, which can occasionally be marginally slower than an equivalent unpartitioned table due to the overhead of combining multiple scans. A table with several genuinely common but different query patterns typically needs both partitioning, for the access pattern it is designed around, and ordinary indexes on the other frequently filtered columns within each partition, since the two techniques solve different problems and are not substitutes for one another.',
        whyHi: 'Partitioning ek table ke physical storage ko ek specific column ke around organize karta hai, aur planner ek partition ko sirf tab rule out kar sakta hai jab ek query ki condition theek us column ke baare mein information deती hai. Ek table jise kई genuinely common par alag query patterns chahiye typically dono ki zaroorat rakhता hai: partitioning, jis access pattern ke liye ye design ki gayi hai, aur har partition ke andar doosre frequently filtered columns par ordinary indexes.',
      },
      {
        wrong: `-- assuming hash partitioning distributes rows the same way a simple modulo would
CREATE TABLE t (id int, val text) PARTITION BY HASH (id);
CREATE TABLE t_p0 PARTITION OF t FOR VALUES WITH (MODULUS 2, REMAINDER 0);
CREATE TABLE t_p1 PARTITION OF t FOR VALUES WITH (MODULUS 2, REMAINDER 1);
INSERT INTO t SELECT g, 'v'||g FROM generate_series(1, 10) g;
-- "IDs 1-10, so p0 (even IDs) should have exactly 5 rows and p1 exactly 5" --
-- the actual split is uneven (e.g. 2 and 8), because it hashes the value FIRST`,
        right: `-- treat hash partitioning's distribution as approximately even OVER A LARGE
-- DATASET, not as a predictable per-row rule -- don't rely on which specific
-- partition any one row ends up in:
SELECT count(*) FROM t_p0;
SELECT count(*) FROM t_p1;
-- fine for spreading LOAD roughly evenly across many rows -- not a substitute
-- for range/list partitioning when you DO need to reason about specific values`,
        why: 'Hash partitioning determines a row\'s partition by computing a hash of the partitioning column\'s value and taking that hash modulo the number of partitions, not by applying a simple, predictable arithmetic rule like even-versus-odd directly to the column\'s raw value. Because a hash function\'s output looks essentially random relative to its input, the actual distribution of a small, specific set of values, such as the integers 1 through 10, can be noticeably uneven across partitions even though the hash function is designed to distribute a large, varied dataset roughly evenly over time. This means hash partitioning is the right tool when the goal is simply spreading rows and write load across multiple physical tables with no natural range or category to organize by, but it explicitly does not let you reason about or predict which partition an individual row will land in, which is precisely the capability range and list partitioning provide instead.',
        whyHi: 'Hash partitioning ek row ki partition ye compute karके decide karta hai ki partitioning column ki value ka ek hash lekार us hash ko partitions ki sankhya se modulo karta hai, column ki raw value par seedhe ek simple, predictable arithmetic rule lgакар nahi. Isliye hash partitioning ye reason karne ya predict karne nahi detа ki ek individual row kiske partition mein jaएगi, jo theek wo capability hai jo range aur list partitioning iske bजаय deте hain.',
      },
      {
        wrong: `-- inserting a row that doesn't fall into any defined partition's range/list
CREATE TABLE events (id int, occurred_at date) PARTITION BY RANGE (occurred_at);
CREATE TABLE events_2025 PARTITION OF events FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
INSERT INTO events VALUES (1, '2027-01-01');
-- ERROR: no partition of relation "events" found for row -- 2027 has no
-- matching partition defined yet`,
        right: `-- create partitions ahead of the data that will need them (or use a DEFAULT
-- partition to catch anything unexpected, if that's acceptable for the use case):
CREATE TABLE events_2027 PARTITION OF events FOR VALUES FROM ('2027-01-01') TO ('2028-01-01');
INSERT INTO events VALUES (1, '2027-01-01');   -- now succeeds`,
        why: 'A partitioned table only accepts a row if some existing partition\'s defined range or list of values actually covers that row\'s partitioning-column value; there is no implicit catch-all partition unless one has been explicitly created, so a row whose value falls outside every currently defined partition is rejected outright rather than silently going somewhere unexpected. This is a genuine operational responsibility of range and list partitioning by date or category: partitions covering future periods or not-yet-seen category values need to be created ahead of time, before data arrives that would need them, typically automated as a recurring maintenance task for time-based partitioning schemes. PostgreSQL also supports an explicit DEFAULT partition that catches any row not matching another partition\'s definition, which is a reasonable safety net for genuinely unpredictable values, but for a time-based scheme the more common and more intentional practice is proactively creating the next period\'s partition before it is needed.',
        whyHi: 'Ek partitioned table ek row ko sirf tab accept karta hai jab kisī existing partition ka defined range ya list us row ki partitioning-column value ko asal mein cover karta hai; koi implicit catch-all partition nahi hai jab tak ek explicitly create na ki gayi ho. PostgreSQL ek explicit `DEFAULT` partition bhi support karta hai jo кisī doosre partition ki definition se match na karti kisī bhi row ko pakड़ता hai.',
      },
    ],

    realWorld: [
      {
        en: '**A log-ingestion table range-partitioned by month**, with a scheduled job creating next month\'s partition ahead of time and dropping partitions older than the retention window with an instant `DROP TABLE` instead of a slow, row-by-row `DELETE`.',
        hi: '**Ek log-ingestion table mahine se range-partitioned**, ek scheduled job ke saath jo agale mahine ki partition pehle se banaता hai aur retention window se purani partitions ko instant `DROP TABLE` se drop karta hai.',
      },
      {
        en: '**A multi-region SaaS product list-partitioning its largest table by `region`**, so each region\'s data physically lives in its own partition, simplifying region-specific compliance and maintenance windows.',
        hi: '**Ek multi-region SaaS product apni sabse badी table ko `region` se list-partition karta hai**, taaki har region ka data physically apne partition mein rehe.',
      },
      {
        en: '**A high-write-throughput table hash-partitioned across several physical tables** specifically to spread the write and VACUUM burden, when no natural range or category exists for that table\'s access pattern.',
        hi: '**Ek high-write-throughput table kई physical tables ke across hash-partitioned** specifically write aur VACUUM burden spread karne ke liye.',
      },
    ],

    interviewQA: [
      {
        q: 'What is partition pruning, and under what condition does it actually help a query?',
        qHi: 'Partition pruning kya hai, aur kis condition mein ye asal mein ek query ki madad karti hai?',
        a: 'Partition pruning is the planner\'s ability to determine, before executing a query, that certain partitions of a partitioned table cannot possibly contain any row matching that query\'s condition, and to skip scanning those partitions entirely rather than including them in the plan at all. This is possible specifically when a query\'s filter condition constrains the exact column the table is partitioned on, since that is the only column for which the planner has explicit knowledge of which partition holds which range or set of values; a condition of that form lets the planner rule out every partition whose defined range or list cannot include the value being searched for, leaving only the one or few partitions that genuinely could contain a match. A condition on any other column provides no such information, since the partitioning scheme carries no relationship to that column\'s values at all, which means the planner has to scan every partition and combine their results, typically shown as an Append node in the plan, gaining none of pruning\'s benefit for that particular query even though the table is partitioned.',
        aHi: 'Partition pruning planner ki wo ability hai ki ek query chalane se pehle ye determine kare ki ek partitioned table ke kुछ partitions us query ki condition se match karti koi bhi row bilkul contain nahi kar sakte, aur un partitions ko scan karne se poori tarah skip kare. Ye specifically tab sambhav hai jab ek query ki filter condition theek us column ko constrain karti hai jispar table partition ki gayi hai.',
      },
      {
        q: 'What is the difference between range, list, and hash partitioning, and when would you choose each?',
        qHi: 'Range, list, aur hash partitioning mein kya antar hai, aur aap har ek kab chunoge?',
        a: 'Range partitioning assigns rows to a partition based on which continuous range of values they fall into, most commonly a date or a monotonically increasing identifier, which makes it the natural choice for time-series or log-style data, since it aligns cleanly with common operations like dropping old data wholesale or adding a new partition ahead of an upcoming period. List partitioning instead assigns rows based on membership in an explicit, named set of values per partition, which fits a column with a small, known number of categories, such as a region or a tenant tier, where each partition is defined by exactly which category values belong to it. Hash partitioning assigns each row to a partition based on a hash of the partitioning column\'s value, distributed across a fixed number of partitions; unlike the other two, it provides no meaningful basis for partition pruning on a specific value, since a hash gives the planner no range or category to reason about, but it is useful specifically for spreading rows and write load roughly evenly across multiple physical tables when no natural range or category exists to organize by, but a single table has still grown too large to manage as one object.',
        aHi: 'Range partitioning rows ko ek continuous range of values ke aadhaar par ek partition assign karta hai, sabse aksar ek date ya ek monotonically increasing identifier, jo ise time-series ya log-style data ke liye natural choice banata hai. List partitioning iske bजаय rows ko har partition ke explicit, named values ke ek set mein membership ke aadhaar par assign karta hai. Hash partitioning har row ko partitioning column ki value ke ek hash ke aadhaar par ek partition assign karta hai; doosre do ke uлт, ye ek specific value par partition pruning ke liye koi meaningful aadhaar nahi deta.',
      },
    ],

    exercises: [
      {
        task: 'Create a table `events(id int, occurred_at date, payload text) PARTITION BY RANGE (occurred_at)` with partitions for 2025 and 2026. Insert one row in each year, then run `EXPLAIN (COSTS OFF)` for a query filtering `occurred_at = \'2026-06-01\'` and confirm only the 2026 partition is scanned.',
        taskHi: 'Ek table `events(id, occurred_at, payload) PARTITION BY RANGE (occurred_at)` banao 2025 aur 2026 ke partitions ke saath. Har saal mein ek row insert karo, phir `occurred_at = \'2026-06-01\'` filter karti ek query ke liye `EXPLAIN (COSTS OFF)` chalao aur confirm karo sirf 2026 partition scan hoती hai.',
        hint: 'A condition on the exact partitioning column (`occurred_at`) lets the planner rule out any partition whose range cannot contain that value — the 2025 partition is pruned entirely.',
        hintHi: 'Theek partitioning column (`occurred_at`) par ek condition planner ko kisī bhi partition ko rule out karne deती hai jiska range wo value contain nahi kar sakta.',
      },
      {
        task: 'Same table as above. Run `EXPLAIN (COSTS OFF)` for a query filtering on `payload` instead (a non-partition-key column) and confirm BOTH partitions are scanned under an `Append` node.',
        taskHi: 'Upar jaisī hi table. `payload` par filter karti (ek non-partition-key column) ek query ke liye `EXPLAIN (COSTS OFF)` chalao aur confirm karo DONO partitions ek `Append` node ke under scan hoती hain.',
        hint: 'The planner has no relationship between `payload`\'s values and the `occurred_at`-based partitioning scheme, so it cannot rule out either partition — this is the direct cost of filtering on a column pruning doesn\'t apply to.',
        hintHi: 'Planner ke paas `payload` ki values aur `occurred_at`-based partitioning scheme ke beech koi relationship nahi hai, to ye kisī bhi partition ko rule out nahi kar sakta.',
      },
      {
        task: 'Create a table `orders(id int, region text, amt int) PARTITION BY LIST (region)` with a `US` partition and an `EU`/`UK` partition. Insert a few rows, then confirm `WHERE region = \'EU\'` prunes to only the `EU`/`UK` partition.',
        taskHi: 'Ek table `orders(id, region, amt) PARTITION BY LIST (region)` banao ek `US` partition aur ek `EU`/`UK` partition ke saath. Kuch rows insert karo, phir confirm karo `WHERE region = \'EU\'` sirf `EU`/`UK` partition tak prune hoती hai.',
        hint: 'List partitioning prunes identically to range partitioning — a condition on the exact partitioning column (`region`) lets the planner identify the one partition whose `FOR VALUES IN (...)` list could contain a match.',
        hintHi: 'List partitioning range partitioning ki tarah hi prune hoती hai — theek partitioning column (`region`) par ek condition planner ko us ek partition identify karne deती hai.',
      },
    ],

    keyTakeaways: [
      'Partitioning splits ONE logical table into several PHYSICALLY SEPARATE tables, still queryable through the parent table\'s name — an operational tool for a table too large to comfortably scan, vacuum, or drop old data from as one object.',
      'PARTITION PRUNING: when a query\'s filter condition constrains the EXACT column the table is partitioned on, the planner rules out entire partitions whose range/list cannot contain a match, skipping them ENTIRELY — never scanned, never even in the plan.',
      'Pruning ONLY helps when the filter is on the PARTITION KEY. A filter on any OTHER column gets NO pruning — every partition is scanned and combined under an `Append` node. Partitioning and ordinary indexing (Module 10) solve DIFFERENT problems and are often needed TOGETHER.',
      '`PARTITION BY RANGE`: splits by a continuous range of values (dates, IDs) — natural for time-series/log data (bulk-drop old partitions, add new ones ahead of time).',
      '`PARTITION BY LIST`: splits by explicit, named values per partition (`FOR VALUES IN (...)`) — natural for a column with a small, known set of categories (region, tenant tier).',
      '`PARTITION BY HASH`: splits by a hash of the key across a fixed `MODULUS` — NOT a predictable per-row rule (a small dataset can split unevenly, e.g. 2/8 not 5/5) and gives NO pruning-by-value benefit. Right tool specifically for spreading rows/write load evenly when no natural range/category exists.',
      'A row whose partitioning-column value falls outside EVERY defined partition\'s range/list is REJECTED outright (`no partition ... found for row`) — partitions covering future periods or new categories must be created AHEAD of the data that needs them (or use a `DEFAULT` partition as a catch-all).',
    ],
    keyTakeawaysHi: [
      'Partitioning EK logical table ko kई PHYSICALLY SEPARATE tables mein toड़ता hai, phir bhi parent table ke naam se queryable — ek table ke liye ek operational tool jo ek object ke roop mein manage karne ke liye bahut badі hai.',
      'PARTITION PRUNING: jab ek query ki filter condition theek us column ko constrain karti hai jispar table partition ki gayi hai, planner poore partitions ko rule out karta hai jinka range/list ek match contain nahi kar sakta.',
      'Pruning SIRF tab madad karti hai jab filter PARTITION KEY par ho. Kisī DOOSRE column par ek filter ko koi pruning NAHI milती — har partition scan hoती hai aur ek `Append` node ke under combine hoती hai.',
      '`PARTITION BY RANGE`: values ke ek continuous range se toड़ता hai — time-series/log data ke liye natural.',
      '`PARTITION BY LIST`: prati-partition explicit, named values se toड़ता hai — ek chhote, known categories set waale column ke liye natural.',
      '`PARTITION BY HASH`: ek fixed `MODULUS` ke across key ke ek hash se toड़ता hai — ek predictable prati-row rule NAHI hai aur koi pruning-by-value benefit NAHI deta.',
      'Ek row jiski partitioning-column value HAR defined partition ke range/list se bahar aati hai REJECT ho jaati hai — future periods ya nayi categories cover karti partitions ko us data se PEHLE banana zaroori hai jise unki zaroorat hai.',
    ],
  },
];
