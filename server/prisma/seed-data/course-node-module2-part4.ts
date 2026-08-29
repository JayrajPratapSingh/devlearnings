/**
 * Node.js Complete Course — Module 2: Building APIs with Express, lesson 4.
 *
 * Request validation. The broken example trusts req.body directly with no
 * validation — a client omitting a required field does not fail cleanly; it
 * either produces a confusing, internals-leaking database error, or worse,
 * silently creates a broken record that only causes problems much later,
 * far from the request that actually caused it. Fixed with a schema
 * validation library (zod) validating the request BEFORE it ever reaches
 * the database, as its own reusable middleware, with TypeScript types
 * inferred directly from the same runtime schema.
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

export const NODE_MODULE_2_PART4: CourseLesson[] = [
  {
    slug: 'request-validation',
    title: 'Request Validation: Trusting Nothing the Client Sends',
    titleHi: 'Request Validation: Client Jo Bhejta Hai Uspar Bilkul Bharosa Na Karna',
    description: 'A user signs up with no email address at all — and the app finds out three days later, when the "send a welcome email" job crashes on a completely unrelated server.',
    descriptionHi: 'Ek user bina kisi email address ke sign up karta hai — aur app ko teen din baad pata chalta hai, jab "welcome email bhejo" job ek poori tarah na-jude server par crash hota hai.',
    difficulty: 'HARD',
    duration: 24,
    order: 4,

    analogy: {
      en: '**A factory that accepts any box handed to it at the loading dock, versus one with an inspector who checks every box\'s contents before it enters the production line.** A route handler that reads req.body and immediately uses it — inserting it into a database, passing it to other functions — without checking it first is like a factory\'s loading dock accepting literally any box handed over, sight unseen, and sending it straight onto the production line: if a box is missing a required part, or contains a part of the wrong size, the factory does not find out at the dock, where the problem is obvious and immediate — it finds out much later, deep inside the assembly process, when a machine jams or a step fails for reasons that, from that machine\'s perspective, look like its own malfunction rather than what they actually are: bad input that should have been caught and rejected long before it ever got this far. An inspector stationed at the loading dock, checking every box\'s actual contents against a known specification before waving anything through, catches the exact same problem at the earliest, cheapest, clearest possible point — rejecting a bad box immediately, with a specific explanation of what was wrong with it, rather than letting it cause a confusing failure somewhere deep inside the factory floor, far from the dock where the actual mistake was made.',
      hi: '**Ek factory jo loading dock par use di gayi kisi bhi box accept karti hai, versus ek jismein ek inspector har box ka content production line mein daakhil hone se pehle check karta hai.** Ek route handler jo \`req.body\` padhta hai aur turant use karta hai — use ek database mein daalna, use doosre functions ko dena — bina use pehle check kiye aisa hai jaise ek factory ka loading dock literally kisi bhi di gayi box accept kar le, bina dekhe, aur use seedha production line par bhej de: agar ek box mein ek zaruri part missing hai, ya galat size ka part hai, factory dock par pata nahi lagaati, jahan samasya zaahir aur turant hai — ye bahut baad mein, assembly process ke gehre andar pata chalti hai, jab ek machine jaam ho jaati hai ya ek step fail hota hai un wajahon se jo, us machine ke nazariye se, uski apni kharaabi jaisi dikhti hain us cheez ke bajaye jo wo asal mein hain: kharaab input jo bahut pehle hi pakda aur reject kar diya jaana chahiye tha wo yahan tak pahunchne se pehle. Loading dock par tainaat ek inspector, har box ke asli contents ko ek jaani-pehchaani specification se check karte hue kuch bhi paar bhejne se pehle, bilkul wahi samasya sabse pehli, sabse sasti, sabse saaf mumkin jagah par pakadta hai — ek kharaab box ko turant reject karte hue, uske saath kya galat tha uska ek khaas spashtikaran dete hue, use factory floor ke gehre andar kahin ek confuse karti asafalta paida karne dene ke bajaye, us dock se door jahan asli galti hui thi.',
    },

    simple: `**Start broken.** A signup route that trusts \`req.body\` completely, with no checking at all:

\`\`\`js
app.post("/users", async (req, res, next) => {
  try {
    const user = await db.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [req.body.name, req.body.email]
    );
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});
\`\`\`

A client sends \`POST /users\` with a body of \`{ "name": "Priya" }\` — genuinely forgetting to include \`email\` at all, whether by an honest client-side bug or simple carelessness. Nothing in this route checks for that before the database call runs. Depending on how the \`users\` table is set up, one of two things happens, and neither is good: if the database has a \`NOT NULL\` constraint on \`email\`, the \`INSERT\` fails, and the raw database error — something like \`null value in column "email" violates not-null constraint\` — either crashes the request with an ugly 500 response leaking internal database schema details to whatever client sent the request, or is caught by the centralized error handler and turned into a generic, unhelpful "Something went wrong." If the database has NO such constraint, the \`INSERT\` actually succeeds — a genuinely broken user record, with \`email\` set to \`null\`, is now permanently sitting in the database, and nothing at all indicates anything is wrong AT THE MOMENT of this request. The real damage surfaces days later, in a completely different, unrelated place: a background job that sends welcome emails to every new user queries this same \`users\` table, reaches this specific broken record, tries to send an email to \`null\`, and crashes — far away in time and space from the actual request that caused the problem, with almost no trace connecting the two.

**The fix: validate the request\'s shape BEFORE it ever reaches the database**

\`\`\`js
const { z } = require("zod");

const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("A valid email is required"),
});

app.post("/users", async (req, res, next) => {
  const result = createUserSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.issues });
  }

  try {
    const user = await db.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [result.data.name, result.data.email]
    );
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});
\`\`\`

\`\`\`ts
import { z } from "zod";

const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("A valid email is required"),
});

app.post("/users", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const result = createUserSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.issues });
    return;
  }

  try {
    const user = await db.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [result.data.name, result.data.email]
    );
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});
\`\`\`

\`createUserSchema\` describes exactly what a valid request body looks like — \`name\` must be a non-empty string, \`email\` must be a string that is genuinely a valid email format — and \`.safeParse(req.body)\` checks the actual incoming data against that description, returning an object describing whether it passed and, if not, precisely what was wrong. Sending \`{ "name": "Priya" }\` (missing \`email\`) now never reaches the database at all — \`result.success\` is \`false\`, and the route responds immediately with a \`400 Bad Request\` and a specific, actionable message (\`"A valid email is required"\`) naming exactly what the client needs to fix, before a single line of database code runs. The bad data never enters the database in the first place, which means the confusing, far-away crash inside the welcome-email job three days later simply cannot happen — the problem was caught, with a clear explanation, at the earliest possible moment.`,

    simpleHi: `**Toote hue se shuru.** Ek signup route jo \`req.body\` par poora bharosa karta hai, bilkul koi checking bina:

\`\`\`js
app.post("/users", async (req, res, next) => {
  try {
    const user = await db.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [req.body.name, req.body.email]
    );
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});
\`\`\`

Ek client \`POST /users\` bhejta hai \`{ "name": "Priya" }\` wali body ke saath — sach mein \`email\` bilkul shaamil karna bhool gaya, chahe ek imaandaar client-side bug se ho ya saadhi laaparwaahi se. Is route mein kuch bhi database call chalne se pehle iske liye check nahi karta. \`users\` table kaise set up hai uske hisaab se, do cheezon mein se ek hoti hai, aur koi bhi achhi nahi: agar database mein \`email\` par ek \`NOT NULL\` constraint hai, \`INSERT\` fail hota hai, aur raw database error — kuch aisa jaisa \`null value in column "email" violates not-null constraint\` — ya to ek badsurat 500 response se request crash karta hai jo internal database schema details us bhi client ko ujaagar karta hai jisne request bheji, ya centralized error handler se pakda jaata hai aur ek aam, bekaar "Something went wrong" mein badal jaata hai. Agar database mein aisa koi constraint NAHI hai, \`INSERT\` asal mein safal hota hai — ek sach mein toota user record, \`email\` \`null\` par set hote hue, ab hamesha ke liye database mein baitha hua hai, aur is request ke PAL kuch bhi galat hone ka koi ishara nahi deta. Asli nuksaan din baad saamne aata hai, ek poori tarah alag, na-judi jagah mein: ek background job jo har naye user ko welcome emails bhejta hai isi \`users\` table ko query karta hai, us khaas toote record tak pahunchta hai, \`null\` ko email bhejne ki koshish karta hai, aur crash ho jaata hai — waqt aur jagah dono mein us asli request se door jisne samasya paida ki, dono ko jodta lagbhag koi trace bina.

**Fix: request ki shape ko validate karo us se PEHLE ki ye database tak pahunche**

\`\`\`js
const { z } = require("zod");

const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("A valid email is required"),
});

app.post("/users", async (req, res, next) => {
  const result = createUserSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.issues });
  }

  try {
    const user = await db.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [result.data.name, result.data.email]
    );
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});
\`\`\`

\`\`\`ts
import { z } from "zod";

const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("A valid email is required"),
});

app.post("/users", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const result = createUserSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.issues });
    return;
  }

  try {
    const user = await db.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [result.data.name, result.data.email]
    );
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});
\`\`\`

\`createUserSchema\` bilkul batata hai ek valid request body kaisi dikhti hai — \`name\` ek na-khaali string honi chahiye, \`email\` ek string honi chahiye jo sach mein ek valid email format ho — aur \`.safeParse(req.body)\` asli aati data ko us bayaan ke khilaaf check karta hai, ek object lautaate hue jo batata hai ye pass hui ya nahi aur, agar nahi, to bilkul kya galat tha. \`{ "name": "Priya" }\` (\`email\` missing) bhejna ab kabhi database tak pahunchta hi nahi — \`result.success\` \`false\` hai, aur route turant ek \`400 Bad Request\` aur ek khaas, kaam-ka message (\`"A valid email is required"\`) ke saath jawaab deta hai bilkul batate hue client ko kya theek karna chahiye, database code ki ek line chalne se pehle. Kharaab data pehli jagah database mein kabhi daakhil hota hi nahi, matlab teen din baad welcome-email job ke andar wala confuse karta, door wala crash bilkul ho hi nahi sakta — samasya, ek saaf spashtikaran ke saath, sabse pehle mumkin pal pakdi gayi.`,

    content: `## Why "the request reached the route" and "the request contains what we need" are different questions

\`\`\`js
app.post("/users", (req, res) => {
  console.log(req.body);   // req.body genuinely exists — but does it have the RIGHT SHAPE?
});
\`\`\`

Module 2\'s first lesson covered \`express.json()\` populating \`req.body\` — but a successfully parsed body only means the client sent SOME valid JSON; it says nothing about whether that JSON actually contains the fields the route needs, in the shape the route expects. A client could send \`{}\`, \`{ "email": 12345 }\` (a number instead of a string), \`{ "name": "", "email": "not-an-email" }\`, or anything else that is syntactically valid JSON but semantically wrong for what the route is about to do with it — Express itself has no opinion about any of this, and a route that reads \`req.body.email\` directly and uses it, with no check, is trusting the client to have sent exactly the right thing, an assumption that fails regularly in real applications, whether from genuine client bugs, a user typing something unexpected into a form, or someone deliberately sending malformed data.

## Schema validation: describing the shape once, checking against it directly

\`\`\`js
const { z } = require("zod");

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().int().positive().optional(),   // optional field, if present must be a positive integer
});

const result = createUserSchema.safeParse(req.body);
// result.success: boolean
// result.data: the validated, correctly-shaped data (only present if success is true)
// result.error: details about what was wrong (only present if success is false)
\`\`\`

A validation library like \`zod\` lets a schema — a description of exactly what shape a piece of data should have — be written once, as a value, and then checked against any actual data using that same schema, rather than hand-writing a series of individual \`if\` checks (\`if (!req.body.name) ...\`, \`if (typeof req.body.email !== "string") ...\`) for every field of every route. \`.safeParse(data)\` returns a result object describing success or failure without throwing (a \`.parse(data)\` alternative exists that throws on failure instead, useful in different contexts) — on success, \`result.data\` holds the validated data, guaranteed to match the schema\'s shape; on failure, \`result.error.issues\` holds a structured, detailed list of exactly what was wrong with the input, suitable for turning directly into a helpful error response.

## Validation as its own reusable middleware

\`\`\`js
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.issues });
    }
    req.body = result.data;   // replace req.body with the validated, correctly-typed data
    next();
  };
}

app.post("/users", validate(createUserSchema), async (req, res, next) => {
  // req.body is now guaranteed to match createUserSchema's shape
  try {
    const user = await db.query(/* ... */, [req.body.name, req.body.email]);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});
\`\`\`

Repeating the same \`.safeParse\` + \`if (!result.success)\` block inside every single route that needs validation is exactly the kind of repetition Module 2\'s lesson on middleware fundamentals prepared the ground for solving: \`validate(schema)\` is a function that RETURNS a middleware function, pre-configured for a specific schema — registering \`validate(createUserSchema)\` as the second argument to \`app.post\` runs it before the actual route handler, calling \`next()\` to continue only if validation passed, and short-circuiting with a \`400\` response otherwise. This is the identical middleware pattern covered throughout Module 2, applied specifically to validation, and it means the route handler itself can simply trust \`req.body\` is already correctly shaped, with no repeated validation logic cluttering the actual business logic.

## TypeScript: inferring static types directly from the same runtime schema

\`\`\`ts
import { z } from "zod";

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

type CreateUserInput = z.infer<typeof createUserSchema>;
// equivalent to: interface CreateUserInput { name: string; email: string; }

app.post("/users", validate(createUserSchema), async (req: Request<{}, {}, CreateUserInput>, res: Response, next: NextFunction) => {
  // req.body.name and req.body.email are correctly typed as "string", with autocomplete
  const user = await db.query(/* ... */, [req.body.name, req.body.email]);
  res.status(201).json(user);
});
\`\`\`

\`z.infer<typeof createUserSchema>\` is genuinely powerful specifically because it derives a TypeScript TYPE directly from the same schema VALUE already being used for runtime validation, rather than maintaining a hand-written \`interface\` separately alongside the schema — the two would otherwise need to be kept in sync manually every time a field is added, removed, or changed, an easy place for them to silently drift apart. With \`z.infer\`, there is only ever one source of truth: the schema itself simultaneously defines the runtime validation logic AND the compile-time type, guaranteeing the two can never disagree, since the type is mechanically derived from the schema rather than independently authored.`,

    contentHi: `## "Request route tak pahunchi" aur "request mein wo hai jo chahiye" alag sawaal kyun hain

\`\`\`js
app.post("/users", (req, res) => {
  console.log(req.body);   // req.body sach mein maujood hai — par kya iski SAHI SHAPE hai?
});
\`\`\`

Module 2 ke pehle lesson ne \`express.json()\` ka \`req.body\` bharna cover kiya — par ek safalta se parse hui body ka matlab sirf ye hai ki client ne KUCH valid JSON bheja; ye kuch nahi batata ki wo JSON asal mein wo fields rakhta hai ya nahi jo route ko chahiye, us shape mein jo route ummeed karta hai. Ek client \`{}\`, \`{ "email": 12345 }\` (string ke bajaye ek number), \`{ "name": "", "email": "not-an-email" }\`, ya kuch aur bhej sakta hai jo syntactically valid JSON hai par semantically galat hai us cheez ke liye jo route uske saath karne wala hai — Express khud iske baare mein kuch bhi raay nahi rakhta, aur ek route jo \`req.body.email\` seedha padhta hai aur use karta hai, bina check, client par bharosa kar raha hai ki usne bilkul sahi cheez bheji hai, ek maanyata jo asli applications mein niyamit taur par fail hoti hai, chahe asli client bugs se ho, ek user ke form mein kuch anpekshit type karne se, ya koi jaan-boojhkar bigdi hui data bhejne se.

## Schema validation: shape ek baar batana, seedha uske khilaaf check karna

\`\`\`js
const { z } = require("zod");

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().int().positive().optional(),   // optional field, agar maujood hai to ek positive integer hona chahiye
});

const result = createUserSchema.safeParse(req.body);
// result.success: boolean
// result.data: validated, sahi-shape wali data (sirf tab maujood jab success true ho)
// result.error: kya galat tha uska vivaran (sirf tab maujood jab success false ho)
\`\`\`

\`zod\` jaisi ek validation library ek schema — ek data ka bilkul kaisi shape honi chahiye uska vivaran — ko ek baar, ek value ki tarah likhne deti hai, aur phir kisi bhi asli data ko usi schema se check karti hai, har route ke har field ke liye alag-alag \`if\` checks (\`if (!req.body.name) ...\`, \`if (typeof req.body.email !== "string") ...\`) haath se likhne ke bajaye. \`.safeParse(data)\` ek result object lautaata hai jo safalta ya asafalta batata hai bina throw kiye (ek \`.parse(data)\` vikalp maujood hai jo iske bajaye asafalta par throw karta hai, alag contexts mein kaam ka) — safalta par, \`result.data\` validated data rakhta hai, guarantee ke saath ki schema ki shape se milta hai; asafalta par, \`result.error.issues\` ek structured, tafseeli list rakhta hai bilkul kya input mein galat tha, ek madadgaar error response mein seedha badalne laayak.

## Validation apne khud ke reusable middleware ki tarah

\`\`\`js
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.issues });
    }
    req.body = result.data;   // req.body ko validated, sahi-typed data se badlo
    next();
  };
}

app.post("/users", validate(createUserSchema), async (req, res, next) => {
  // req.body ab guarantee ke saath createUserSchema ki shape se milta hai
  try {
    const user = await db.query(/* ... */, [req.body.name, req.body.email]);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});
\`\`\`

Har akele route ke andar jise validation chahiye wahi \`.safeParse\` + \`if (!result.success)\` block dohraana bilkul us kism ka dohraav hai jise Module 2 ke middleware fundamentals wale lesson ne hal karne ki neev banaayi: \`validate(schema)\` ek function hai jo ek middleware function LAUTAATA hai, ek khaas schema ke liye pehle-se-configured — \`validate(createUserSchema)\` ko \`app.post\` ke doosre argument ki tarah register karna use asli route handler se pehle chalaata hai, sirf tabhi jaari rakhne ke liye \`next()\` bulaate hue jab validation pass ho, aur baaki \`400\` response se short-circuit karte hue. Ye Module 2 mein poore mein cover hua wahi middleware pattern hai, khaas taur par validation par lagu, aur iska matlab hai route handler khud bas \`req.body\` par bharosa kar sakta hai ki ye pehle se sahi tarike se shaped hai, koi dohraati validation logic asli business logic mein ghol bina.

## TypeScript: usi runtime schema se seedha static types infer karna

\`\`\`ts
import { z } from "zod";

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

type CreateUserInput = z.infer<typeof createUserSchema>;
// barabar: interface CreateUserInput { name: string; email: string; }

app.post("/users", validate(createUserSchema), async (req: Request<{}, {}, CreateUserInput>, res: Response, next: NextFunction) => {
  // req.body.name aur req.body.email sahi tarike se "string" typed hain, autocomplete ke saath
  const user = await db.query(/* ... */, [req.body.name, req.body.email]);
  res.status(201).json(user);
});
\`\`\`

\`z.infer<typeof createUserSchema>\` khaas taur par isliye sach mein taaqatwar hai kyunki ye ek TypeScript TYPE seedha wahi schema VALUE se nikaalta hai jo pehle se runtime validation ke liye use ho rahi hai, schema ke saath alag se ek haath se likhi \`interface\` maintain karne ke bajaye — dono ko warna har baar jab field jodi, hataayi, ya badli jaaye haath se sync mein rakhna padta, ek aasan jagah jahan wo chupchap alag ho sakein. \`z.infer\` ke saath, hamesha sirf ek hi source of truth hai: schema khud ek saath runtime validation logic AUR compile-time type define karta hai, guarantee dete hue ki dono kabhi asehmat nahi ho sakte, kyunki type mechanically schema se nikala jaata hai alag se likha jaane ke bajaye.`,

    examples: [
      {
        title: 'Broken: an unvalidated route lets bad data silently reach the database',
        titleHi: 'Toota: ek na-validated route kharaab data ko chupchap database tak pahunchne deta hai',
        code: `app.post("/users", async (req, res, next) => {
  const user = await db.query(
    "INSERT INTO users (name, email) VALUES ($1, $2)",
    [req.body.name, req.body.email]
  );
  res.status(201).json(user);
});`,
        codeJs: `const express = require("express");
const app = express();
app.use(express.json());

app.post("/users", async (req, res, next) => {
  try {
    const user = await db.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [req.body.name, req.body.email]
    );
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});
// POST /users with body { "name": "Priya" } — no email field at all
// -> if the DB has a NOT NULL constraint: a raw database error leaks
//    through as a 500 response
// -> if it does NOT: a broken user row with email = null is silently
//    created`,
        codeTs: `import express, { Request, Response, NextFunction } from "express";
const app = express();
app.use(express.json());

app.post("/users", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await db.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [req.body.name, req.body.email]
    );
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});
// TypeScript does not catch this — req.body is typed as "any" by
// default (Express has no way to know its actual runtime shape). This
// is a data-integrity issue, not a type error.`,
        output: `POST /users with { "name": "Priya" }: either a leaked database error
("null value in column \\"email\\" violates not-null constraint") in the
500 response, or a silently created broken user record — neither
response tells the client clearly and immediately what was actually
wrong with their request.`,
        explain: 'req.body being typed as "any" by default in TypeScript is not a coincidence — Express genuinely cannot know at compile time what shape a client will actually send, which is precisely the gap runtime validation exists to close.',
        explainHi: 'TypeScript mein default roop se \`req.body\` ka \`any\` typed hona koi samyog nahi hai — Express compile time par sach mein jaan nahi sakta ki client asal mein kaunsi shape bhejega, aur bilkul yahi kami hai jise runtime validation band karne ke liye maujood hai.',
      },
      {
        title: 'Fixed: zod schema validation rejects bad input before the database',
        titleHi: 'Theek: zod schema validation kharaab input ko database se pehle reject karta hai',
        code: `const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});
const result = createUserSchema.safeParse(req.body);
if (!result.success) return res.status(400).json({ errors: result.error.issues });`,
        codeJs: `const { z } = require("zod");

const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("A valid email is required"),
});

app.post("/users", async (req, res, next) => {
  const result = createUserSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.issues });
  }
  try {
    const user = await db.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [result.data.name, result.data.email]
    );
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});`,
        codeTs: `import { z } from "zod";

const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("A valid email is required"),
});

app.post("/users", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const result = createUserSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.issues });
    return;
  }
  try {
    const user = await db.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [result.data.name, result.data.email]
    );
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});`,
        outputJs: `POST /users with { "name": "Priya" }: immediately returns 400 with
{ "errors": [{ "message": "A valid email is required", "path":
["email"], ... }] } — the database is never touched, and the client
receives a specific, actionable explanation.`,
        outputTs: `// Identical behaviour. "result.data" is correctly typed by zod based
// on the schema, giving result.data.name and result.data.email
// autocomplete and type-checking, unlike the untyped req.body.`,
        explain: 'The client now receives immediate, specific feedback ("email is required") at the exact moment of the mistake, rather than a generic 500 error or, worse, no error at all until a much later, unrelated failure.',
        explainHi: 'Client ab galti ke bilkul us pal turant, khaas feedback paata hai ("email zaruri hai"), ek aam 500 error ke bajaye, ya aur bura, kisi bhi error ke bina jab tak ek bahut baad ki, na-judi asafalta na aaye.',
      },
      {
        title: 'A reusable validate() middleware avoiding repeated safeParse calls',
        titleHi: 'Ek reusable validate() middleware dohraayi jaati safeParse calls se bachta hai',
        code: `function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ errors: result.error.issues });
    req.body = result.data;
    next();
  };
}`,
        codeJs: `function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.issues });
    }
    req.body = result.data;
    next();
  };
}

app.post("/users", validate(createUserSchema), async (req, res, next) => {
  // req.body is guaranteed valid here — no repeated validation logic
  try {
    const user = await db.query(/* ... */, [req.body.name, req.body.email]);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});`,
        codeTs: `import { Request, Response, NextFunction } from "express";
import { z, ZodSchema } from "zod";

function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ errors: result.error.issues });
      return;
    }
    req.body = result.data;
    next();
  };
}

app.post("/users", validate(createUserSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await db.query(/* ... */, [req.body.name, req.body.email]);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});`,
        outputJs: `Both /users and any other route needing schema validation can reuse
the same validate() function with their own specific schema —
validate(createUserSchema), validate(updateUserSchema), and so on —
with zero repeated safeParse boilerplate in the route handlers
themselves.`,
        outputTs: `// "ZodSchema" types validate()'s parameter generically enough to
// accept any zod schema, making the wrapper itself reusable across
// completely different data shapes, not just createUserSchema.`,
        explain: 'This mirrors the identical middleware pattern from Module 2\'s first lesson (a function doing work, then calling next() or ending the response) — validation is not a new mechanism, it is this same pattern applied to a new job.',
        explainHi: 'Ye Module 2 ke pehle lesson wale wahi middleware pattern darzha karta hai (ek function jo kaam karta hai, phir \`next()\` bulaata hai ya response khatam karta hai) — validation koi naya mechanism nahi hai, ye wahi pattern hai jo ek naye kaam par lagu hua.',
      },
    ],

    mistakes: [
      {
        wrong: `app.post("/users", async (req, res) => {
  const user = await db.query(/* ... */, [req.body.name, req.body.email]);
  // no validation — bad data silently reaches the database
});`,
        right: `app.post("/users", validate(createUserSchema), async (req, res, next) => {
  // req.body is guaranteed to match the schema before this line ever runs
});`,
        why: 'req.body existing (populated by express.json()) only means the client sent valid JSON — it says nothing about whether that JSON has the fields the route actually needs, in the shape it expects; validation must check the actual shape before the data is trusted.',
        whyHi: '\`req.body\` ka maujood hona (\`express.json()\` se bhara hua) sirf ye batata hai ki client ne valid JSON bheja — ye kuch nahi batata ki us JSON mein wo fields hain jo route ko asal mein chahiye, us shape mein jo wo ummeed karta hai; validation ko data ko bharosa karne se pehle asli shape check karni chahiye.',
      },
      {
        wrong: `const result = createUserSchema.parse(req.body);   // .parse() THROWS on failure
// no try/catch around it — an invalid request crashes with an unhandled exception`,
        right: `const result = createUserSchema.safeParse(req.body);   // .safeParse() returns a result object instead
if (!result.success) return res.status(400).json({ errors: result.error.issues });`,
        why: 'zod\'s .parse() throws an exception on invalid input, requiring its own try/catch (or being wrapped in an asyncHandler, from the previous lesson) to avoid crashing the request; .safeParse() returns a result object instead, letting failure be checked with a plain if statement.',
        whyHi: 'zod ka \`.parse()\` invalid input par ek exception throw karta hai, request crash hone se bachne ke liye apne khud ka \`try\`/\`catch\` maangte hue (ya pichle lesson wale \`asyncHandler\` mein lapeta hua); \`.safeParse()\` iske bajaye ek result object lautaata hai, asafalta ko ek saadhe \`if\` statement se check hone dete hue.',
      },
      {
        wrong: `interface CreateUserInput {
  name: string;
  email: string;
}
const createUserSchema = z.object({ name: z.string(), email: z.string() });
// two separate sources of truth — easy for them to silently drift apart`,
        right: `const createUserSchema = z.object({ name: z.string(), email: z.string() });
type CreateUserInput = z.infer<typeof createUserSchema>;
// one source of truth — the type is mechanically derived from the schema`,
        why: 'Maintaining a hand-written TypeScript interface separately alongside a runtime validation schema requires manually keeping the two in sync every time a field changes — z.infer derives the type directly from the schema, guaranteeing they can never disagree.',
        whyHi: 'Ek haath se likhi TypeScript interface ko ek runtime validation schema ke saath alag se maintain karna har baar jab field badle dono ko haath se sync mein rakhna maangta hai — \`z.infer\` type ko seedha schema se nikaalta hai, guarantee dete hue ki wo kabhi asehmat nahi ho sakte.',
      },
    ],

    realWorld: [
      {
        en: '**Zod, and similar schema validation libraries (Joi, Yup), are close to universal in real production Express and Node.js APIs**, precisely because trusting unvalidated client input is a well-documented, common source of both data-integrity bugs and genuine security vulnerabilities.',
        hi: '**Zod, aur waisi hi schema validation libraries (Joi, Yup), asli production Express aur Node.js APIs mein lagbhag sarvbhaumik hain**, bilkul isliye kyunki na-validated client input par bharosa karna data-integrity bugs aur asli security vulnerabilities dono ka ek achhi tarah documented, aam srot hai.',
      },
      {
        en: '**"Never trust client input" is one of the most fundamental, widely repeated principles in backend and API security guidance** — validating a request\'s shape is the first, most basic layer of this principle, well before more advanced security concerns like SQL injection or authentication, both covered later in this course.',
        hi: '**"Client input par kabhi bharosa mat karo" backend aur API security guidance mein sabse buniyaadi, badi taur par dohraaye jaane wale principles mein se ek hai** — ek request ki shape ko validate karna is principle ki pehli, sabse buniyaadi layer hai, SQL injection ya authentication jaise zyada advanced security chintaon se kaafi pehle, dono is course mein aage cover honge.',
      },
      {
        en: '**Zod\'s z.infer pattern — deriving TypeScript types directly from a runtime validation schema — is widely regarded as one of the most valuable TypeScript patterns in modern full-stack development**, specifically because it eliminates the common bug category of a hand-maintained type silently drifting out of sync with the validation actually being performed.',
        hi: '**Zod ka \`z.infer\` pattern — TypeScript types ko seedha ek runtime validation schema se nikaalna — modern full-stack development mein sabse keemti TypeScript patterns mein se ek maana jaata hai**, khaas taur par isliye kyunki ye us aam bug category ko khatam karta hai jahan ek haath se maintain kiya gaya type chupchap us validation se bemel ho jaata hai jo asal mein ki jaa rahi hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is "req.body exists" not the same guarantee as "req.body has what this route needs", even after express.json() has run?',
        qHi: '"req.body maujood hai" "req.body mein wo hai jo is route ko chahiye" jaisi guarantee kyun nahi hai, express.json() chalne ke baad bhi?',
        a: 'express.json() is responsible only for parsing the raw incoming request body as JSON and attaching the result to req.body — its entire job is syntactic: taking a string of text and, if it is valid JSON, converting it into a JavaScript value. It has no knowledge whatsoever of what a specific route actually expects that value to contain — no route-specific field names, no expected types, no required-versus-optional distinctions. A client can send perfectly valid JSON that express.json() parses without any issue at all, while that JSON is completely wrong for a specific route\'s needs: missing required fields entirely, containing fields of the wrong type (a number where a string was expected), or containing extra, unexpected fields. "req.body exists and was successfully parsed as JSON" and "req.body contains the specific shape this particular route requires" are answers to two entirely different questions, and only explicit schema validation, checking the actual data against a route-specific description of what it should contain, answers the second one.',
        aHi: '\`express.json()\` sirf aati raw request body ko JSON ki tarah parse karne aur nateeja \`req.body\` par jodne ke liye zimmedaar hai — uska poora kaam syntactic hai: text ki ek string leke, agar wo valid JSON hai, use ek JavaScript value mein badalna. Use bilkul koi jaankaari nahi ki ek khaas route asal mein us value mein kya chahta hai — koi route-khaas field naam nahi, koi ummeed kiya type nahi, koi zaruri-versus-optional fark nahi. Ek client bilkul valid JSON bhej sakta hai jise \`express.json()\` bilkul bina samasya ke parse kar leta hai, jabki wo JSON ek khaas route ki zarurton ke liye poori tarah galat ho: zaruri fields poori tarah missing, galat type ke fields (jahan string ummeed thi wahan ek number), ya extra, anpekshit fields. "\`req.body\` maujood hai aur JSON ki tarah safalta se parse hua" aur "\`req.body\` bilkul wahi shape rakhta hai jo ye khaas route maangta hai" do poori tarah alag sawaalon ke jawaab hain, aur sirf explicit schema validation, asli data ko route-khaas vivaran ke khilaaf check karte hue jo use kya rakhna chahiye, doosre ka jawaab deta hai.',
      },
      {
        q: 'Why is validating a request\'s data before it reaches the database better than relying on a database-level constraint (like NOT NULL) to catch the same problem?',
        qHi: 'Request ki data ko database tak pahunchne se pehle validate karna wahi samasya pakadne ke liye database-level constraint (jaise NOT NULL) par bharosa karne se behtar kyun hai?',
        a: 'A database constraint genuinely can catch some invalid data, but it does so at the wrong layer and with the wrong kind of failure for a client-facing API: a database rejecting an INSERT produces a low-level database error, typically containing internal implementation details (specific column names, constraint names, database-engine-specific error phrasing) that are not meaningful or actionable to an API client, and exposing them directly in an HTTP response can leak internal system details that should not be part of a public API\'s contract. A database constraint also cannot express many kinds of validation that genuinely matter — an email column with no NOT NULL constraint would happily accept an empty string, or a syntactically malformed non-email string, since a database column\'s type system generally has no built-in concept of "valid email format." Application-level schema validation, checked before the database is ever touched, can express precisely the specific rules a given API endpoint actually needs (a valid email format, a minimum string length, a number within a specific range), and produces a clear, structured, client-appropriate error response immediately, rather than surfacing as an obscure database failure — or, in the case where no matching constraint exists at all, not surfacing as any failure whatsoever until much later.',
        aHi: 'Ek database constraint sach mein kuch invalid data pakad sakta hai, par ye galat layer par aur client-facing API ke liye galat kism ki asafalta ke saath aisa karta hai: ek database jo \`INSERT\` reject karta hai ek neeche-star ka database error paida karta hai, aam taur par internal implementation details rakhte hue (khaas column naam, constraint naam, database-engine-khaas error bhaasha) jo ek API client ke liye matlabi ya kaam ke nahi, aur unhe seedha ek HTTP response mein ujaagar karna internal system details fenk sakta hai jo ek public API ke contract ka hissa nahi hone chahiye. Ek database constraint bhi kai kism ki validation nahi darzha kar sakta jo sach mein matter karti hai — koi \`NOT NULL\` constraint na wala ek email column khushi-khushi ek khaali string, ya ek syntactically bigdi hui non-email string, accept karega, kyunki ek database column ke type system mein aam taur par "valid email format" ka koi built-in concept hi nahi hota. Application-level schema validation, database chhue jaane se pehle check hui, bilkul un khaas niyamon ko darzha kar sakti hai jo ek diya gaya API endpoint asal mein chahta hai (ek valid email format, ek minimum string length, ek khaas range ke andar ek number), aur turant ek saaf, structured, client-upyukt error response paida karti hai, ek dhundhla database failure ki tarah saamne aane ke bajaye — ya, us case mein jahan koi milta constraint hai hi nahi, tab tak koi bhi asafalta bilkul na dikhte hue jab tak bahut baad tak.',
      },
      {
        q: 'What does z.infer<typeof schema> actually do, and why is it considered a better pattern than maintaining a separate, hand-written TypeScript interface alongside the schema?',
        qHi: '\`z.infer<typeof schema>\` asal mein kya karta hai, aur ise schema ke saath ek alag, haath se likhi TypeScript interface maintain karne se behtar pattern kyun maana jaata hai?',
        a: 'z.infer<typeof schema> is a TypeScript utility that reads a zod schema value (a runtime object describing validation rules) and mechanically derives a corresponding TypeScript type describing the shape of data that would successfully pass that schema\'s validation — the resulting type is not written by hand at all; it is computed directly from the schema\'s own definition by TypeScript\'s type system. This is considered better than maintaining a separate, independently hand-written interface expressing the same shape because two independently maintained descriptions of the same thing — one used for runtime validation (the zod schema), one used for compile-time type checking (the interface) — inevitably require a developer to remember to update both, in sync, every single time a field is added, removed, renamed, or has its validation rules changed; forgetting to update one after changing the other is a genuinely easy mistake, and produces a type that no longer accurately describes what the runtime validation actually accepts, without any error or warning indicating the two have drifted apart. Deriving the type directly from the schema with z.infer eliminates this risk entirely, since there is only one thing being maintained — the schema itself — and the type is always mechanically, automatically kept in agreement with it.',
        aHi: '\`z.infer<typeof schema>\` ek TypeScript utility hai jo ek zod schema value (runtime object jo validation rules darzha karta hai) padhta hai aur mechanically ek barabar TypeScript type nikaalta hai jo us data ki shape darzha karta hai jo us schema ki validation ko safalta se paar kar jaaye — nateeja hua type bilkul haath se likha nahi jaata; ye TypeScript ke type system dwara seedha schema ki apni definition se ganit hota hai. Ise ek alag, alag se haath se likhi wahi shape darzhaati interface maintain karne se behtar maana jaata hai kyunki ek hi cheez ke do alag maintain kiye vivaran — ek runtime validation ke liye use hota (zod schema), ek compile-time type checking ke liye use hota (interface) — hamesha developer ko har baar jab field jodi, hataayi, naam badli, ya uske validation rules badle dono ko sync mein update karna yaad rakhna maangte hain; doosre badalne ke baad ek update karna bhoolna ek sach mein aasan galti hai, aur ek aisa type paida karta hai jo ab sahi tarike se darzha nahi karta ki runtime validation asal mein kya accept karti hai, bina kisi error ya warning ke jo batataye ki dono alag ho gaye hain. \`z.infer\` se seedha schema se type nikaalna is khatre ko poori tarah khatam karta hai, kyunki maintain karne ke liye sirf ek hi cheez hai — khud schema — aur type hamesha mechanically, apne aap uske saath sehmat rakha jaata hai.',
      },
      {
        q: 'How does wrapping schema validation in a reusable validate(schema) middleware function relate to the middleware fundamentals covered earlier in this module?',
        qHi: 'Schema validation ko ek reusable validate(schema) middleware function mein lapetna is module mein pehle cover hue middleware fundamentals se kaise judta hai?',
        a: 'Module 2\'s first lesson established that a middleware function is, structurally, nothing more than a function accepting (req, res, next) that does some work and then either calls next() to continue the chain or sends a response to end it — validate(schema) fits this exact same shape: it checks req.body against the given schema, and either calls next() to let the request proceed to the actual route handler (when validation passes) or sends a 400 response ending the chain right there (when it fails). The specific detail that validate is actually a function that RETURNS a middleware function, rather than being a middleware function itself, is what allows it to be pre-configured for a specific schema at the point it is registered (validate(createUserSchema) as opposed to a hardcoded, schema-specific function) — but the returned function itself is an entirely ordinary middleware function, following the identical rules covered for any other middleware: it must be registered before the route it is meant to protect (the same ordering rule covered for express.json()), and it must eventually either call next() or send a response, exactly like every other middleware function in Express.',
        aHi: 'Module 2 ke pehle lesson ne ye tay kiya ki ek middleware function, structurally, kuch aur nahi hai sirf ek function jo \`(req, res, next)\` accept karta hai jo kuch kaam karta hai aur phir ya to chain jaari rakhne ke liye \`next()\` bulaata hai ya use khatam karne ke liye response bhejta hai — \`validate(schema)\` bilkul wahi shape se milta hai: ye \`req.body\` ko diye gaye schema ke khilaaf check karta hai, aur ya to \`next()\` bulaata hai request ko asli route handler tak pahunchne dene ke liye (jab validation pass ho) ya ek \`400\` response bhejta hai chain ko wahin khatam karte hue (jab ye fail ho). Ye khaas detail ki \`validate\` asal mein ek function hai jo ek middleware function LAUTAATA hai, khud ek middleware function hone ke bajaye, wo hai jo ise us pal ek khaas schema ke liye pehle-se-configured karne deta hai jab ye register hota hai (\`validate(createUserSchema)\` ek hardcoded, schema-khaas function ke muqable) — par lautaaya hua function khud poori tarah ek aam middleware function hai, kisi bhi doosre middleware ke liye cover hue wahi niyam follow karte hue: ise us route se pehle register hona chahiye jiski use raksha karni thi (\`express.json()\` ke liye cover hua wahi ordering niyam), aur ise aakhirkaar ya to \`next()\` bulaana chahiye ya response bhejna chahiye, bilkul Express ke har doosre middleware function jaisa.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken POST /users route with no validation. Send a request missing the email field and confirm either a leaked database error or a silently created broken record, depending on your database\'s constraints.',
        taskHi: 'Bina validation wala toota POST /users route banao. Ek aisi request bhejo jismein email field missing ho aur confirm karo ya to ek ujaagar hua database error, ya ek chupchap banaya toota record, aapke database ke constraints par nirbhar karte hue.',
        hint: 'If you don\'t have a real database handy, mock db.query with a function that throws when passed an undefined value, to simulate the leaked-error scenario reliably.',
        hintHi: 'Agar aapke paas asli database handy nahi hai, db.query ko ek function se mock karo jo undefined value pass hone par throw kare, ujaagar-hui-error scenario ko bharosemand tarike se simulate karne ke liye.',
      },
      {
        task: 'Fix it with a zod schema and safeParse, checked directly inside the route. Send the same invalid request and confirm it now returns a clean 400 with a specific error message before any database code runs.',
        taskHi: 'Ek zod schema aur safeParse se theek karo, route ke andar seedha check hote hue. Wahi invalid request bhejo aur confirm karo ye ab koi database code chalne se pehle ek khaas error message ke saath saaf 400 lautaata hai.',
        hint: 'Add a console.log at the very top of the database-calling code and confirm it never runs at all for the invalid request, proving validation genuinely happens before the database is ever touched.',
        hintHi: 'Database-bulaate code ke bilkul upar ek console.log jodo aur confirm karo ye invalid request ke liye bilkul kabhi nahi chalta, saabit karte hue validation sach mein database chhue jaane se pehle hoti hai.',
      },
      {
        task: 'Extract the validation into a reusable validate(schema) middleware and use it for two different routes with two different schemas. Then, in TypeScript, add z.infer to derive the request body\'s type directly from the schema.',
        taskHi: 'Validation ko ek reusable validate(schema) middleware mein nikaalo aur ise do alag routes ke liye do alag schemas ke saath use karo. Phir, TypeScript mein, z.infer jodo request body ka type seedha schema se nikaalne ke liye.',
        hint: 'Deliberately add a field to the schema without updating any separately hand-written interface (if you had one), and confirm z.infer\'s derived type updates automatically, while a hand-written interface would not.',
        hintHi: 'Jaan-boojhkar schema mein ek field jodo bina kisi alag se haath se likhi interface update kiye (agar aapke paas ek thi), aur confirm karo z.infer ka nikaala hua type apne aap update hota hai, jabki haath se likhi interface na hoti.',
      },
    ],

    keyTakeaways: [
      'req.body existing (populated by express.json()) only means the client sent syntactically valid JSON — it says nothing about whether that JSON has the specific fields, types, and shape a given route actually requires.',
      'Unvalidated bad data reaching the database can produce a confusing, internals-leaking error, or worse, silently create a broken record that causes an unrelated, hard-to-trace failure much later, far from the request that caused it.',
      'A schema validation library (like zod) lets a data shape be described once, then checked against actual input with .safeParse(), returning a structured success/failure result with specific, actionable error details rather than a generic crash.',
      'Validation should happen as early as possible — before the database or any other downstream code is touched — so invalid requests are rejected immediately with a clear, specific 400 response rather than causing problems later.',
      'A reusable validate(schema) middleware function, following the exact same (req, res, next) shape covered for all middleware, avoids repeating the same safeParse-and-check logic inside every individual route.',
      'z.infer<typeof schema> derives a TypeScript type directly from a runtime validation schema, eliminating the risk of a hand-maintained interface silently drifting out of sync with the actual validation being performed.',
    ],
    keyTakeawaysHi: [
      '\`req.body\` ka maujood hona (\`express.json()\` se bhara hua) sirf ye batata hai ki client ne syntactically valid JSON bheja — ye kuch nahi batata ki us JSON mein wo khaas fields, types, aur shape hai jo ek diya gaya route asal mein maangta hai.',
      'Database tak pahunchti na-validated kharaab data ek confuse karta, internals-ujaagar-karta error paida kar sakti hai, ya aur bura, chupchap ek toota record bana sakti hai jo bahut baad mein ek na-judi, mushkil-se-trace-hone-laayak asafalta cause karta hai, us request se door jisne use cause kiya.',
      'Ek schema validation library (jaise zod) data ki shape ko ek baar bataane deti hai, phir asli input ko \`.safeParse()\` se check karte hue, ek structured safalta/asafalta nateeja lautaate hue khaas, kaam ke error details ke saath ek aam crash ke bajaye.',
      'Validation jitni jaldi ho sake honi chahiye — database ya kisi doosre baad ke code ke chhue jaane se pehle — taaki invalid requests turant ek saaf, khaas 400 response se reject ho jaayein baad mein samasyaayen paida karne ke bajaye.',
      'Ek reusable validate(schema) middleware function, sab middleware ke liye cover hui bilkul wahi \`(req, res, next)\` shape follow karte hue, har akele route ke andar wahi safeParse-aur-check logic dohraane se bachta hai.',
      '\`z.infer<typeof schema>\` ek TypeScript type seedha ek runtime validation schema se nikaalta hai, ek haath se maintain ki hui interface ke chupchap asli validation se bemel ho jaane ke khatre ko khatam karte hue.',
    ],
  },
];
