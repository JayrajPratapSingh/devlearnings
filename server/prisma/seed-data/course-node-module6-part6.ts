/**
 * Node.js Complete Course — Module 6: Pro, lesson 6 (final lesson of the
 * entire Node.js Complete Course).
 *
 * Docker basics: why "works on my machine" is a real, common, costly
 * problem — a teammate's machine or the production server having a
 * different Node version, a missing system dependency, or a subtly
 * different OS can make identical application code behave differently or
 * fail outright. Broken narrative: a deploy process of "SSH in, git pull,
 * npm install, restart" that works until the production server's Node
 * version quietly differs from every developer's local machine. Fixed with
 * a Dockerfile that packages the exact runtime (a specific Node version, OS,
 * and dependencies) into a portable image, so the same container runs
 * identically on any machine with Docker installed — a developer's laptop,
 * a teammate's laptop, or a production server. Also covers layer caching,
 * .dockerignore, and docker-compose for local multi-container development
 * (the app plus a real Postgres container).
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

export const NODE_MODULE_6_PART6: CourseLesson[] = [
  {
    slug: 'docker-basics',
    title: 'Docker Basics: Solving "It Works On My Machine"',
    titleHi: 'Docker Basics: "Mere Machine Par To Chalta Hai" Solve Karna',
    description: 'An app that runs perfectly on every developer\'s laptop crashes the instant it reaches the production server — because the production server happens to have a different Node version installed.',
    descriptionHi: 'Ek app jo har developer ke laptop par bilkul theek chalta hai production server tak pahunchte hi crash ho jaata hai — kyunki production server mein samyog se ek alag Node version install hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 6,

    analogy: {
      en: '**A recipe that says "bake at the temperature my specific oven happens to run at" instead of "bake at 180°C" — perfectly followable in the kitchen where it was written, and unreliable everywhere else.** Deploying an application by manually installing dependencies onto whatever server happens to be available is like a chef who writes down a recipe that implicitly depends on the exact, particular oven in their own kitchen — its exact quirks, its exact calibration, its exact age — without ever writing any of that down explicitly, simply because the chef never has to think about it while cooking in their own kitchen. The recipe works perfectly for that one chef, in that one kitchen, every single time, and there is no reason for them to ever suspect it depends on anything beyond the ingredients and steps actually written down. The moment a different chef, in a different kitchen, with an oven that runs a little hotter or a thermostat that is calibrated slightly differently, tries to follow the exact same written recipe, the result can come out wrong in ways neither chef can easily explain, because the actual cause — an unstated, invisible dependency on one specific oven\'s specific behavior — was never part of the recipe\'s visible instructions at all. A recipe (and a kitchen) that instead comes as a single, fully self-contained, portable unit — its own oven, its own exact ingredients, its own exact conditions, shipped together as one sealed package — produces the identical result no matter which counter it is placed on, because nothing about the outcome depends on anything outside that one self-contained package.',
      hi: '**Ek recipe jo kehti hai "bake karo us temperature par jis par mera khaas oven samyog se chalta hai" us kehne ke bajaye "180°C par bake karo" — us kitchen mein poori tarah follow-karne-laayak jahan ye likhi gayi thi, aur kahin aur na-bharosemand.** Ek application ko manually jo bhi server upalabdh hai us par dependencies install karke deploy karna ek aise chef jaisa hai jo ek recipe likhta hai jo apni khud ki kitchen ke bilkul, khaas oven par implicitly nirbhar karti hai — uski bilkul ajeebiyaten, uska bilkul calibration, uski bilkul umar — bina inmein se kuch bhi kabhi explicitly likhe, sirf isliye kyunki chef ko apni khud ki kitchen mein pakaate waqt kabhi ismein sochna nahi padta. Recipe us ek chef ke liye, us ek kitchen mein, har akeli baar poori tarah kaam karti hai, aur unke paas kabhi shak karne ki koi wajah nahi hai ki ye kisi bhi cheez par nirbhar karti hai un ingredients aur steps se aage jo asal mein likhe gaye hain. Jis pal ek alag chef, ek alag kitchen mein, ek oven ke saath jo thoda garam chalta hai ya ek thermostat jo thoda alag calibrate kiya gaya hai, bilkul wahi likhi recipe follow karne ki koshish karta hai, nateeja aise tarikon se galat aa sakta hai jinhe koi bhi chef aasaani se samjha nahi sakta, kyunki asli wajah — ek na-kahi gayi, adrishya nirbharta ek khaas oven ke khaas vyavhaar par — kabhi recipe ke dikhaayi dene laayak instructions ka hissa thi hi nahi. Ek recipe (aur ek kitchen) jo iske bajaye ek akeli, poori tarah self-contained, portable ikaai ki tarah aati hai — apna khud ka oven, apne bilkul ingredients, apni bilkul sthitiyaan, ek seal ki hui package ki tarah saath bheji hui — bilkul wahi nateeja deti hai chahe wo kisi bhi counter par rakhi jaaye, kyunki nateeje ke baare mein kuch bhi us ek self-contained package se bahar kisi bhi cheez par nirbhar nahi karta.',
    },

    simple: `**Start broken.** A deploy process that works, until it doesn\'t: SSH into the server, pull the latest code, install dependencies, restart:

\`\`\`bash
ssh production-server
cd /app
git pull
npm install
pm2 restart server
\`\`\`

This works correctly on every developer\'s laptop, throughout local development, and often works fine in production too, for a long time — right up until the production server happens to have a different Node.js version installed than every developer\'s own machine (perhaps it was provisioned months ago and never updated, while developers\' laptops have since upgraded). A feature relying on a JavaScript language feature or a Node.js API only available in newer versions works flawlessly for every developer locally and fails — sometimes with an outright crash, sometimes with a subtler, harder-to-diagnose behavioral difference — the instant it runs on that older production Node version. Nothing about the application\'s own code changed; the failure comes entirely from an unstated, invisible dependency on a specific runtime environment that was never written down anywhere as an explicit, checked requirement — it simply happened to be true, coincidentally, on every machine a developer used, until it collided with the one machine where it was not. The same underlying problem can just as easily come from a missing system-level library the production server never had installed, a different operating system entirely, or any other assumption about the environment that quietly held true during development and just as quietly stopped holding true in production.

**The fix: Docker packages the exact environment, not just the code**

\`\`\`dockerfile
# Dockerfile
FROM node:20-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 3000
CMD ["node", "server.js"]
\`\`\`

\`\`\`bash
docker build -t my-api .
docker run -p 3000:3000 my-api
\`\`\`

A \`Dockerfile\` is a set of instructions for building a self-contained IMAGE — not just the application\'s own code, but a specific, exact Node.js version (\`node:20-slim\`, pinning the exact major version rather than whatever happens to be installed on any given machine), the operating system it runs on top of, and every dependency the application needs, all bundled together into one portable unit. \`docker build\` follows these instructions once to produce that image, and \`docker run\` starts a CONTAINER from it — a running instance of that exact, self-contained environment. Critically, this exact same image, containing the exact same Node.js version and the exact same dependencies, can be run identically on a developer\'s own laptop, a teammate\'s laptop, and the production server, entirely independent of whatever Node.js version, operating system, or other software each of those specific machines happens to have installed outside of Docker itself — the application no longer depends on an unstated, coincidental match between environments, because the exact environment it needs travels along with it as part of the image.`,

    simpleHi: `**Toote hue se shuru.** Ek deploy process jo kaam karta hai, jab tak nahi karta: server mein SSH karo, latest code pull karo, dependencies install karo, restart karo:

\`\`\`bash
ssh production-server
cd /app
git pull
npm install
pm2 restart server
\`\`\`

Ye har developer ke laptop par sahi tarike se kaam karta hai, poore local development mein, aur aksar production mein bhi theek kaam karta hai, lambe waqt ke liye — theek us pal tak jab production server mein samyog se har developer ki apni machine se alag ek Node.js version installed hai (shaayad ise mahine pehle provision kiya gaya tha aur kabhi update nahi kiya gaya, jabki developers ke laptops tab se upgrade ho chuke hain). Ek feature jo ek JavaScript language feature ya ek Node.js API par nirbhar karta hai jo sirf naye versions mein upalabdh hai har developer ke liye locally bekaayada kaam karta hai aur fail hota hai — kabhi-kabhi bilkul crash ke saath, kabhi-kabhi ek zyaada subtle, samjhne-mein-mushkil vyavhaar farak ke saath — jis pal ye us purane production Node version par chalta hai. Application ke apne code mein kuch bhi nahi badla; asafalta poori tarah ek na-kahi gayi, adrishya nirbharta se aati hai ek khaas runtime environment par jise kahin bhi kabhi ek explicit, check-ki-gayi zarurat ki tarah likha hi nahi gaya — ye bas samyog se sach tha, har machine par jo ek developer istemal karta tha, jab tak ye us ek machine se na takraaya jahan ye sach nahi tha. Wahi underlying samasya utni hi aasaani se ek missing system-level library se bhi aa sakti hai jo production server ne kabhi install nahi ki thi, ek poori tarah alag operating system se, ya kisi bhi doosri environment ke baare mein maanyata se jo development ke dauraan chupke se sach thi aur production mein utni hi chupke se sach hona band ho gayi.

**Fix: Docker bilkul environment ko package karta hai, sirf code nahi**

\`\`\`dockerfile
# Dockerfile
FROM node:20-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 3000
CMD ["node", "server.js"]
\`\`\`

\`\`\`bash
docker build -t my-api .
docker run -p 3000:3000 my-api
\`\`\`

Ek \`Dockerfile\` ek self-contained IMAGE banaane ke liye instructions ka ek set hai — sirf application ka apna code nahi, balki ek khaas, bilkul Node.js version (\`node:20-slim\`, bilkul major version pin karte hue us se ulta jo bhi kisi bhi diye machine par samyog se installed hai), wo operating system jis par ye chalta hai, aur har dependency jo application ko chahiye, sab ek portable ikaai mein saath bundle hue. \`docker build\` in instructions ka palan ek baar karta hai wo image banaane ke liye, aur \`docker run\` us se ek CONTAINER shuru karta hai — us bilkul, self-contained environment ka ek chalta instance. Bahut zaruri, bilkul wahi image, jismein bilkul wahi Node.js version aur bilkul wahi dependencies hain, ek developer ke apne laptop par, ek teammate ke laptop par, aur production server par ek-jaisa chalaayi jaa sakti hai, poori tarah mustaqil us se jo bhi Node.js version, operating system, ya doosra software un mein se har khaas machine par samyog se Docker khud ke bahar installed hai — application ab environments ke beech ek na-kahi gayi, samyog wali milaan par nirbhar nahi karta, kyunki wo bilkul environment jo use chahiye image ke hisse ki tarah uske saath yatra karta hai.`,

    content: `## Layer caching: why COPY package.json happens before COPY .

\`\`\`dockerfile
# Dependencies are copied and installed FIRST, as their own layer
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# The rest of the application code is copied AFTER
COPY . .
\`\`\`

Docker builds an image as a sequence of "layers," and — critically for build speed — it reuses a previously built layer instead of rebuilding it, as long as the exact instruction and its inputs have not changed since the last build. Copying \`package.json\` and \`package-lock.json\` and running \`npm ci\` BEFORE copying the rest of the application\'s source code is a deliberate ordering: as long as the dependencies themselves have not changed, Docker can reuse the already-built "install dependencies" layer from a previous build, even if application source code changed, skipping the genuinely slow \`npm ci\` step entirely on most rebuilds. If the \`COPY . .\` (copying all source code) happened first, ANY source code change — even a single-character edit with no dependency changes at all — would invalidate every subsequent layer, including the dependency-install step, forcing a full, slow reinstall on every single rebuild.

## .dockerignore: what should never be copied into the image

\`\`\`
# .dockerignore
node_modules
.env
.git
*.log
\`\`\`

A \`.dockerignore\` file, following the exact same syntax and purpose as \`.gitignore\`, tells \`docker build\` which files and directories to exclude when copying the application\'s source into the image. \`node_modules\` should always be excluded, since the image installs its own dependencies fresh, inside the image\'s own environment, via \`npm ci\` — copying a developer\'s local \`node_modules\` (potentially built for a different operating system or architecture than the image\'s own) would be both wasteful and a genuine source of subtle bugs. Following this course\'s earlier environment-configuration lesson, \`.env\` must never be copied into an image either — secrets belong in the deployment environment\'s own configuration (an environment variable passed to \`docker run\`, or a secrets-management system), never baked directly into a portable image that might end up stored or shared more broadly than intended.

## docker-compose: running the app together with a real database locally

\`\`\`yaml
# docker-compose.yml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://postgres:password@db:5432/myapp
    depends_on:
      - db
  db:
    image: postgres:16
    environment:
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=myapp
    ports:
      - "5432:5432"
\`\`\`

\`\`\`bash
docker-compose up
\`\`\`

Real applications typically need more than just the application\'s own container — a real database (following this course\'s connection-pooling lessons), and possibly Redis (used elsewhere in this course for rate limiting, sessions, and background job queues) or other services alongside it. \`docker-compose\` describes multiple related containers — here, the application (\`app\`) and a genuine PostgreSQL database (\`db\`) — in a single file, and \`docker-compose up\` starts all of them together, correctly networked so the \`app\` container can reach the \`db\` container by its service name (\`db\`) as if it were a hostname. This lets a new developer joining a project run one single command to get a fully working local environment — the application AND a real database, both running in the exact same versions and configuration as everyone else on the team — rather than needing to separately install and configure PostgreSQL directly onto their own machine.

## Multi-stage builds: a brief look at keeping production images small

\`\`\`dockerfile
# Stage 1: install dependencies and compile TypeScript
FROM node:20-slim AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: copy only the compiled output into a fresh, minimal image
FROM node:20-slim
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
CMD ["node", "dist/server.js"]
\`\`\`

For a TypeScript project (following this course\'s TypeScript-paired examples throughout), a "multi-stage" Dockerfile is a common refinement worth knowing about: one stage installs all dependencies (including TypeScript itself and any dev-only build tools) and compiles the TypeScript source into plain JavaScript, and a second, separate stage starts from a fresh base image and copies over ONLY the compiled JavaScript output and the production dependencies, discarding the first stage\'s TypeScript compiler and other dev-only tooling entirely. This keeps the final, deployed image meaningfully smaller and closer to containing only what the running application actually needs at runtime, rather than also carrying every tool that was only ever needed to build it.`,

    contentHi: `## Layer caching: \`COPY package.json\` \`COPY .\` se pehle kyun hota hai

\`\`\`dockerfile
# Dependencies pehle copy aur install hoti hain, apni khud ki layer ki tarah
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Baaki application code BAAD mein copy hota hai
COPY . .
\`\`\`

Docker ek image ko "layers" ke ek sequence ki tarah banaata hai, aur — build speed ke liye bahut zaruri — ye ek pehle se bani layer ko dobara istemal karta hai use dobara banaane ke bajaye, jab tak bilkul instruction aur uske inputs pichhle build se badle na hon. \`package.json\` aur \`package-lock.json\` ko copy karna aur \`npm ci\` chalaana baaki application ke source code ko copy karne SE PEHLE ek jaan-boojhkar tarteeb hai: jab tak dependencies khud nahi badli, Docker pehle se bani "dependencies install karo" layer ko pichhle build se dobara istemal kar sakta hai, chahe application source code badla ho, sach mein dheeme \`npm ci\` step ko zyaadatar rebuilds par poori tarah skip karte hue. Agar \`COPY . .\` (sab source code copy karna) pehle hota, KOI BHI source code badlaav — ek akela character edit bhi bina koi dependency badlaav ke — har baad wali layer ko invalid kar deta, dependency-install step sameet, har akele rebuild par ek poori, dheemi dobara-install force karte hue.

## \`.dockerignore\`: kya kabhi image mein copy nahi hona chahiye

\`\`\`
# .dockerignore
node_modules
.env
.git
*.log
\`\`\`

Ek \`.dockerignore\` file, \`.gitignore\` ke bilkul usi syntax aur maqsad ka palan karte hue, \`docker build\` ko batati hai kaunse files aur directories ko exclude karna hai jab application ka source image mein copy hota hai. \`node_modules\` ko hamesha exclude karna chahiye, kyunki image apni khud ki dependencies taaza install karta hai, image ke apne environment ke andar, \`npm ci\` ke through — ek developer ki local \`node_modules\` copy karna (mumkin taur par ek alag operating system ya architecture ke liye bani hui image ke apne se) faaltu bhi hoga aur subtle bugs ka ek asli srot bhi. Is course ke pehle wale environment-configuration lesson ka palan karte hue, \`.env\` ko bhi kabhi image mein copy nahi karna chahiye — secrets deployment environment ki apni configuration mein rehne chahiye (ek environment variable jo \`docker run\` ko diya jaata hai, ya ek secrets-management system), kabhi seedha ek portable image mein baked nahi honi chahiye jo iraade se zyaada wyaapak taur par stored ya share ho sakti hai.

## \`docker-compose\`: app ko locally ek asli database ke saath saath chalaana

\`\`\`yaml
# docker-compose.yml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://postgres:password@db:5432/myapp
    depends_on:
      - db
  db:
    image: postgres:16
    environment:
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=myapp
    ports:
      - "5432:5432"
\`\`\`

\`\`\`bash
docker-compose up
\`\`\`

Asli applications ko aam taur par application ke apne container se zyaada chahiye — ek asli database (is course ke connection-pooling lessons ka palan karte hue), aur mumkin taur par Redis (is course mein kahin aur rate limiting, sessions, aur background job queues ke liye istemal hua) ya doosri services uske saath. \`docker-compose\` kai judi containers ko describe karta hai — yahan, application (\`app\`) aur ek asli PostgreSQL database (\`db\`) — ek akeli file mein, aur \`docker-compose up\` unhe sabko saath shuru karta hai, sahi tarike se networked taaki \`app\` container \`db\` container tak uski service naam (\`db\`) se pahunch sake jaise wo ek hostname ho. Ye ek project mein naya jode gaye developer ko ek akela command chalaane deta hai ek poori tarah kaam karta local environment paane ke liye — application AUR ek asli database, dono bilkul wahi versions aur configuration mein chalte hue jo team ke baaki sab ke paas hai — apne khud ki machine par seedha PostgreSQL alag se install aur configure karne ki zarurat ke bajaye.

## Multi-stage builds: production images ko chhota rakhne par ek chhoti jhalak

\`\`\`dockerfile
# Stage 1: dependencies install karo aur TypeScript compile karo
FROM node:20-slim AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: sirf compile hua output ek taaza, minimal image mein copy karo
FROM node:20-slim
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
CMD ["node", "dist/server.js"]
\`\`\`

Ek TypeScript project ke liye (is poore course ke TypeScript-paired examples ka palan karte hue), ek "multi-stage" Dockerfile ek aam sudhaar hai jaanna kaam ka: ek stage sab dependencies install karta hai (TypeScript khud aur koi bhi dev-only build tools sameet) aur TypeScript source ko saadhe JavaScript mein compile karta hai, aur ek doosra, alag stage ek taaza base image se shuru hota hai aur SIRF compile hua JavaScript output aur production dependencies copy karta hai, pehle stage ke TypeScript compiler aur doosre dev-only tooling ko poori tarah chhodte hue. Ye aakhri, deploy ki gayi image ko maayne-rakhta chhota aur us ke kareeb rakhta hai jo chal raha application asal mein runtime par chahta hai, har wo tool bhi na le kar chalte hue jo sirf use banaane ke liye chahiye tha.`,

    examples: [
      {
        title: 'Broken: the deploy process silently depends on the server\'s own installed Node version',
        titleHi: 'Toota: deploy process chupke se server ke apne installed Node version par nirbhar karta hai',
        code: `ssh production-server
cd /app
git pull
npm install
pm2 restart server
# works until the production server's Node version differs from every developer's`,
        codeJs: `// server.js
const express = require("express");
const app = express();

app.get("/data", (req, res) => {
  // a feature relying on a newer Node.js API or JS language feature
  res.json({ result: someNewerLanguageFeature() });
});

app.listen(3000);

// Deploy: SSH in, git pull, npm install, pm2 restart server
// Works on every developer's machine. Crashes or misbehaves the instant
// it reaches a production server with an older Node.js version installed.`,
        codeTs: `// server.ts
import express, { Request, Response } from "express";
const app = express();

app.get("/data", (req: Request, res: Response): void => {
  res.json({ result: someNewerLanguageFeature() });
});

app.listen(3000);
// Correctly typed, completely valid TypeScript — the problem is entirely
// about which Node.js runtime version actually executes the compiled
// output, not a type or logic error in the source itself.`,
        output: `Every developer's laptop runs the app correctly. The production
server, provisioned months earlier with an older Node.js version never
updated since, either crashes outright or behaves subtly differently —
with no application code having changed at all.`,
        explain: 'The failure comes from an unstated, coincidental dependency on a specific Node.js version that happened to match on every developer\'s machine but not on the production server.',
        explainHi: 'Asafalta ek na-kahi gayi, samyog wali nirbharta se aati hai ek khaas Node.js version par jo har developer ki machine par samyog se milta tha par production server par nahi.',
      },
      {
        title: 'Fixed: a Dockerfile pins the exact runtime, portable to any machine',
        titleHi: 'Theek: ek Dockerfile bilkul runtime ko pin karta hai, kisi bhi machine ke liye portable',
        code: `FROM node:20-slim
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]`,
        codeJs: `// Dockerfile
// FROM node:20-slim
// WORKDIR /app
// COPY package.json package-lock.json ./
// RUN npm ci --omit=dev
// COPY . .
// EXPOSE 3000
// CMD ["node", "server.js"]

// server.js — the application code itself is unchanged
const express = require("express");
const app = express();
app.get("/data", (req, res) => res.json({ result: someNewerLanguageFeature() }));
app.listen(3000);

// Build and run identically anywhere Docker is installed:
// docker build -t my-api .
// docker run -p 3000:3000 my-api`,
        codeTs: `// Dockerfile
// FROM node:20-slim
// WORKDIR /app
// COPY package.json package-lock.json ./
// RUN npm ci --omit=dev
// COPY . .
// EXPOSE 3000
// CMD ["node", "dist/server.js"]

// server.ts — the application code itself is unchanged
import express, { Request, Response } from "express";
const app = express();
app.get("/data", (req: Request, res: Response): void => {
  res.json({ result: someNewerLanguageFeature() });
});
app.listen(3000);

// docker build -t my-api .
// docker run -p 3000:3000 my-api`,
        outputJs: `The same image, containing the exact pinned Node.js version, runs
identically on every developer's laptop and on the production server —
the application no longer depends on whatever Node.js version each
specific machine happens to have installed outside of Docker.`,
        outputTs: `// Identical behaviour. The application source code required no
// changes at all — the fix is entirely in how the runtime environment
// is packaged and deployed, not in the application logic itself.`,
        explain: 'The exact Node.js version is now an explicit, checked-in part of the Dockerfile rather than an unstated assumption about whatever happens to be installed on a given machine.',
        explainHi: 'Bilkul Node.js version ab Dockerfile ka ek explicit, checked-in hissa hai us anaay-kahi gayi maanyata ke bajaye ki ek diye machine par kya samyog se installed hai.',
      },
      {
        title: 'docker-compose: the app and a real Postgres database together, one command',
        titleHi: 'docker-compose: app aur ek asli Postgres database saath, ek command',
        code: `services:
  app:
    build: .
    environment:
      - DATABASE_URL=postgres://postgres:password@db:5432/myapp
    depends_on: [db]
  db:
    image: postgres:16
    environment:
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=myapp`,
        codeJs: `// docker-compose.yml
// services:
//   app:
//     build: .
//     ports: ["3000:3000"]
//     environment:
//       - DATABASE_URL=postgres://postgres:password@db:5432/myapp
//     depends_on: [db]
//   db:
//     image: postgres:16
//     environment:
//       - POSTGRES_PASSWORD=password
//       - POSTGRES_DB=myapp
//     ports: ["5432:5432"]

// server.js connects using the same pattern from this course's
// connection-pooling lesson — "db" resolves to the database container
const pool = new Pool({ connectionString: process.env.DATABASE_URL });`,
        codeTs: `// docker-compose.yml
// services:
//   app:
//     build: .
//     ports: ["3000:3000"]
//     environment:
//       - DATABASE_URL=postgres://postgres:password@db:5432/myapp
//     depends_on: [db]
//   db:
//     image: postgres:16
//     environment:
//       - POSTGRES_PASSWORD=password
//       - POSTGRES_DB=myapp
//     ports: ["5432:5432"]

import { Pool } from "pg";
const pool = new Pool({ connectionString: process.env.DATABASE_URL as string });`,
        outputJs: `docker-compose up starts both containers together, correctly networked
— the app container reaches the database container by the service name
"db", exactly as if it were a real hostname, with no manual local
Postgres installation required on the developer's own machine.`,
        outputTs: `// Identical behaviour. This is the exact same Pool-based connection
// pattern from the connection-pooling lesson, pointed at a
// containerized database instead of a locally installed one.`,
        explain: 'A new developer joining the project runs one command and gets an identical, fully working environment — the application and a real database, both at the exact versions everyone else on the team is using.',
        explainHi: 'Project mein naya jode gaye developer ek command chalaate hain aur ek identical, poori tarah kaam karta environment paate hain — application aur ek asli database, dono bilkul un versions mein jo team ke baaki sab istemal kar rahe hain.',
      },
    ],

    mistakes: [
      {
        wrong: `ssh production-server && git pull && npm install && pm2 restart server
// silently depends on this specific server's own installed Node version`,
        right: `FROM node:20-slim
// the exact Node.js version travels with the image, not left to chance`,
        why: 'Deploying without pinning the runtime environment means the application silently depends on whatever happens to already be installed on the target machine, which can quietly drift from what developers actually tested against.',
        whyHi: 'Runtime environment ko pin kiye bina deploy karna matlab hai application chupke se us par nirbhar karta hai jo bhi target machine par pehle se installed hai, jo chupke se us se drift kar sakta hai jise developers ne asal mein test kiya tha.',
      },
      {
        wrong: `COPY . .
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
// any source change invalidates the dependency-install layer too`,
        right: `COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY . .
// dependency installation is cached separately from source code changes`,
        why: 'Copying all source code before installing dependencies means any single-line code change invalidates the dependency-install layer\'s cache, forcing a slow reinstall on every rebuild rather than only when dependencies actually change.',
        whyHi: 'Dependencies install karne se pehle sab source code copy karna matlab hai koi bhi ek-line ka code badlaav dependency-install layer ka cache invalid kar deta hai, ek dheemi dobara-install force karte hue har rebuild par us waqt ke bajaye sirf jab dependencies asal mein badalti hain.',
      },
      {
        wrong: `// no .dockerignore — node_modules and .env get copied directly into the image
COPY . .`,
        right: `// .dockerignore excludes node_modules, .env, .git
COPY . .
// only genuinely needed source files are copied in`,
        why: 'Copying a local node_modules (possibly built for a different OS/architecture) is wasteful and can cause subtle bugs, and copying .env bakes secrets directly into a portable image that might be stored or shared more broadly than intended.',
        whyHi: 'Ek local \`node_modules\` copy karna (mumkin taur par ek alag OS/architecture ke liye bani) faaltu hai aur subtle bugs paida kar sakta hai, aur \`.env\` copy karna secrets ko seedha ek portable image mein bake karta hai jo iraade se zyaada wyaapak taur par stored ya share ho sakti hai.',
      },
    ],

    realWorld: [
      {
        en: '**"Works on my machine" is one of the most widely cited real-world sources of production incidents and deployment friction across the entire software industry**, and Docker\'s creation and widespread adoption was specifically driven by this exact class of problem, not a hypothetical concern.',
        hi: '**"Mere machine par to chalta hai" poori software industry mein production incidents aur deployment friction ke sabse vyapak taur par cite kiye jaane waale asli-duniya sroton mein se ek hai**, aur Docker ka banna aur vyapak taur par apnaaya jaana khaas taur par bilkul isi kism ki samasya se prerit tha, koi kalpaniya chinta nahi.',
      },
      {
        en: '**Docker (and the broader concept of containerization) is one of the most widely adopted deployment technologies in the entire software industry**, used across companies of every size, and is a standard, expected skill on most backend and DevOps job descriptions today.',
        hi: '**Docker (aur containerization ka wyaapak concept) poori software industry mein sabse vyapak taur par apnaayi gayi deployment technologies mein se ek hai**, har size ki companies mein istemal hoti hai, aur aaj zyaadatar backend aur DevOps job descriptions mein ek standard, ummeed ki jaane wali skill hai.',
      },
      {
        en: '**Nearly every modern cloud hosting platform (AWS, Google Cloud, Azure, Render, Railway, Fly.io, and others) accepts a Docker image as a standard, first-class deployment artifact** — understanding Docker is directly transferable to deploying on essentially any of these platforms, not tied to one specific hosting provider.',
        hi: '**Lagbhag har modern cloud hosting platform (AWS, Google Cloud, Azure, Render, Railway, Fly.io, aur doosre) ek Docker image ko ek standard, first-class deployment artifact ki tarah accept karta hai** — Docker samajhna lagbhag inmein se kisi bhi platform par deploy karne mein seedha transfer hota hai, kisi ek khaas hosting provider tak bandha nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'Why can an application that works correctly on every developer\'s laptop still fail on the production server, even when the exact same source code is deployed?',
        qHi: 'Ek application jo har developer ke laptop par sahi tarike se kaam karta hai production server par abhi bhi kyun fail ho sakta hai, chahe bilkul wahi source code deploy kiya jaaye?',
        a: 'An application\'s behavior depends not only on its own source code but also on the runtime environment that code executes within — the specific Node.js version installed, the underlying operating system, system-level libraries, and any other software present on that specific machine. When an application is deployed by simply installing dependencies directly onto whatever server happens to be available (rather than packaging an explicit, self-contained environment), the application implicitly depends on that server happening to have a compatible environment — a specific Node.js version supporting whatever language features or APIs the code uses, for instance. If every developer\'s own machine happens to share a similar enough environment (often because they all installed Node.js around the same time, or use a similar operating system), the application can work flawlessly for all of them without anyone realizing it is quietly depending on that environment similarity, rather than on anything explicitly guaranteed. The moment the production server\'s actual environment diverges from what developers\' machines happen to have — an older Node.js version that was never updated, a missing system library, a different OS — the exact same source code can behave differently or fail outright, because the source code was never actually the complete picture; the unstated runtime environment it depends on was just as essential, and that dependency was never made explicit or verified anywhere.',
        aHi: 'Ek application ka vyavhaar sirf uske apne source code par nahi balki us runtime environment par bhi nirbhar karta hai jiske andar wo code chalta hai — khaas installed Node.js version, underlying operating system, system-level libraries, aur us khaas machine par maujood koi bhi doosra software. Jab ek application ko bas jo bhi server upalabdh hai us par seedha dependencies install karke deploy kiya jaata hai (ek explicit, self-contained environment package karne ke bajaye), application implicitly us server par nirbhar karta hai ki uske paas ek compatible environment ho — misal ke taur par, ek khaas Node.js version jo code jo bhi language features ya APIs istemal karta hai support kare. Agar har developer ki apni machine samyog se ek kaafi-milta-julta environment share karti hai (aksar isliye kyunki sab ne lagbhag ek hi waqt Node.js install kiya, ya ek jaisi operating system istemal karte hain), application unmein se sabke liye bekaayada kaam kar sakta hai bina kisi ke realize kiye ki ye chupke se us environment ki samaanta par nirbhar kar raha hai, kisi bhi explicitly guarantee ki gayi cheez par nahi. Jis pal production server ka asli environment us se alag ho jaata hai jo developers ki machines ke paas samyog se hai — ek purana Node.js version jo kabhi update nahi hua, ek missing system library, ek alag OS — bilkul wahi source code alag tarike se vyavhaar kar sakta hai ya poori tarah fail ho sakta hai, kyunki source code kabhi poori tasveer thi hi nahi; na-kaha gaya runtime environment jis par ye nirbhar karta hai utna hi zaruri tha, aur wo nirbharta kabhi kahin explicit ya verify nahi ki gayi.',
      },
      {
        q: 'Why does ordering COPY package.json and RUN npm ci before COPY . in a Dockerfile meaningfully speed up rebuilds?',
        qHi: 'Ek Dockerfile mein \`COPY package.json\` aur \`RUN npm ci\` ko \`COPY .\` se pehle tarteeb dena rebuilds ko maayne-rakhta tez kyun karta hai?',
        a: 'Docker builds an image as a sequence of layers, one per instruction in the Dockerfile, and it caches each layer\'s result — on a subsequent build, if a given instruction and everything it depends on (its inputs) are identical to a previous build, Docker reuses that previous layer\'s cached result instead of re-executing the instruction, which is significantly faster, especially for a genuinely slow step like installing dependencies. Docker\'s caching is order-sensitive and depends on each layer\'s specific inputs: the COPY package.json and package-lock.json instruction\'s cache is invalidated only when those two specific files change, and the subsequent RUN npm ci instruction\'s cache is invalidated only when the COPY step immediately before it produces different output (meaning only when the dependency files themselves changed). If the full application source code is copied into the image BEFORE dependencies are installed, then the COPY . instruction\'s output changes on every single build, since almost any change to the project touches some file (even a comment change, a README edit, or a single line of application logic with zero dependency changes) — and because the subsequent npm ci step\'s cache depends on the COPY step immediately preceding it, this means npm ci\'s cache is also invalidated on nearly every build, forcing a full, slow dependency reinstall regardless of whether the dependencies themselves actually changed. Copying only package.json and package-lock.json first, running npm ci immediately after, and copying the rest of the source code only afterward isolates the dependency-install layer\'s cache validity to changes in those two specific files alone — an ordinary source code change no longer touches anything the dependency-install layer\'s cache depends on, so that slow step is correctly skipped on the vast majority of rebuilds.',
        aHi: 'Docker ek image ko layers ke ek sequence ki tarah banaata hai, Dockerfile mein har instruction ke liye ek, aur ye har layer ka nateeja cache karta hai — ek baad wale build par, agar ek diya instruction aur wo sab kuch jis par ye nirbhar karta hai (uske inputs) ek pichhle build se identical hain, Docker us pichhle layer ka cached nateeja dobara istemal karta hai instruction ko dobara-chalaane ke bajaye, jo kaafi tez hai, khaaskar dependencies install karne jaise ek sach mein dheeme step ke liye. Docker ki caching kram-sanvedansheel hai aur har layer ke khaas inputs par nirbhar karti hai: \`COPY package.json\` aur \`package-lock.json\` instruction ka cache sirf tab invalid hota hai jab wo do khaas files badalti hain, aur baad wala \`RUN npm ci\` instruction ka cache sirf tab invalid hota hai jab us se theek pehle wala \`COPY\` step alag output paida karta hai (matlab sirf tab jab dependency files khud badali hon). Agar poora application source code image mein dependencies install hone SE PEHLE copy hota hai, to \`COPY .\` instruction ka output har akele build par badalta hai, kyunki lagbhag koi bhi project mein badlaav kisi file ko chhuta hai (ek comment badlaav bhi, ek README edit, ya application logic ki ek line zero dependency badlaav ke saath) — aur kyunki baad wale \`npm ci\` step ka cache us se theek pehle wale \`COPY\` step par nirbhar karta hai, iska matlab hai \`npm ci\` ka cache bhi lagbhag har build par invalid hota hai, ek poori, dheemi dependency dobara-install force karte hue chahe dependencies khud asal mein badli hon ya nahi. Sirf \`package.json\` aur \`package-lock.json\` pehle copy karna, \`npm ci\` turant baad chalaana, aur baaki source code sirf uske baad copy karna dependency-install layer ki cache validity ko sirf un do khaas files mein badlaavon tak seemit karta hai — ek aam source code badlaav ab kisi aisi cheez ko nahi chhuta jis par dependency-install layer ka cache nirbhar karta hai, isliye wo dheema step zyaadatar rebuilds par sahi tarike se skip ho jaata hai.',
      },
      {
        q: 'Why should node_modules and .env both be listed in .dockerignore, given that they are excluded for two genuinely different reasons?',
        qHi: '\`node_modules\` aur \`.env\` dono \`.dockerignore\` mein kyun list hone chahiye, jab ki wo do sach mein alag wajahon se exclude kiye jaate hain?',
        a: 'node_modules is excluded for a correctness and reliability reason: the image is specifically designed to install its own dependencies fresh, inside its own controlled environment, via a command like npm ci — a locally installed node_modules on a developer\'s own machine may have been built for a different operating system or CPU architecture than the one the image\'s base Node.js image actually runs on (particularly relevant for any dependency containing native, compiled code), and copying it directly into the image risks including binaries that are subtly or completely incompatible with the image\'s actual runtime environment, which is precisely the kind of "works on my machine" inconsistency this entire lesson is about eliminating. .env is excluded for a completely different reason: security. A .env file, following this course\'s earlier environment-configuration lesson, typically contains genuine secrets — database credentials, API keys, JWT secrets — and an image, once built, is often stored in a registry, potentially shared with teammates, or otherwise handled in ways not guaranteed to keep every secret confined to only the people who should see it. Baking real secrets directly into an image\'s layers as a plain file risks exposing them to anyone who later gains access to that image, entirely independent of any question about whether the application would technically still run correctly. Although the two exclusions protect against different specific failure modes — one a correctness and portability concern, the other a security concern — both share the same underlying principle: an image should contain only what its runtime genuinely needs to execute correctly, not incidental local artifacts that happen to exist in a developer\'s working directory for unrelated reasons.',
        aHi: '\`node_modules\` ek sahi-hone aur bharosemandta ki wajah se exclude hota hai: image khaas taur par apni khud ki dependencies taaza install karne ke liye design ki gayi hai, apne khud ke control kiye environment ke andar, \`npm ci\` jaise ek command se — ek developer ki apni machine par locally installed \`node_modules\` shaayad ek alag operating system ya CPU architecture ke liye bani ho us se jis par image ki base Node.js image asal mein chalti hai (khaaskar native, compiled code rakhte kisi bhi dependency ke liye maayne-rakhta), aur ise seedha image mein copy karna binaries shaamil karne ka khatra rakhta hai jo image ke asli runtime environment ke saath subtle taur par ya poori tarah asangat hain, jo bilkul us kism ki "mere machine par to chalta hai" asangati hai jise ye poora lesson khatam karne ke baare mein hai. \`.env\` ek poori tarah alag wajah se exclude hota hai: security. Ek \`.env\` file, is course ke pehle wale environment-configuration lesson ka palan karte hue, aam taur par asli secrets rakhti hai — database credentials, API keys, JWT secrets — aur ek image, ek baar bani, aksar ek registry mein stored hoti hai, mumkin taur par teammates ke saath share hoti hai, ya doosre tarikon se sambhaali jaati hai jo guarantee nahi karte ki har secret sirf un logon tak seemit rahega jinhe dekhna chahiye. Asli secrets ko seedha ek image ki layers mein ek saadhi file ki tarah bake karna unhe kisi ke bhi saamne expose karne ka khatra rakhta hai jo baad mein us image tak access paata hai, is sawaal se poori tarah mustaqil ki kya application technically abhi bhi sahi tarike se chalega. Chahe do exclusions do alag khaas fail-hone ke tarikon se bachaate hain — ek sahi-hone aur portability ki chinta, doosri security ki chinta — dono ek hi underlying principle share karte hain: ek image mein sirf wahi hona chahiye jo uske runtime ko asal mein sahi tarike se chalne ke liye chahiye, koi bhi incidental local artifacts nahi jo samyog se ek developer ki working directory mein na-judi wajahon se maujood hain.',
      },
    ],

    exercises: [
      {
        task: 'Build any small Express app and deploy it manually the "broken" way described in this lesson\'s narrative on two machines with deliberately different Node.js versions installed (or simulate this using nvm to switch versions locally). Confirm a feature relying on a version-specific behavior works on one and fails on the other.',
        taskHi: 'Koi chhota Express app banao aur ise is lesson ki kahaani mein bataaye "toote" tarike se do machines par manually deploy karo jinmein jaan-boojhkar alag Node.js versions installed hon (ya ise locally versions badalne ke liye \`nvm\` istemal karke simulate karo). Confirm karo ek feature jo ek version-khaas vyavhaar par nirbhar karta hai ek par kaam karta hai aur doosre par fail hota hai.',
        hint: 'A feature using a genuinely recent Node.js API or JavaScript syntax feature not available in an older LTS version is an easy way to reliably reproduce this difference.',
        hintHi: 'Ek feature jo ek sach mein haal ka Node.js API ya JavaScript syntax feature istemal karta hai jo ek purane LTS version mein upalabdh nahi hai is farak ko bharosemand taur par dobara paida karne ka ek aasaan tarika hai.',
      },
      {
        task: 'Write a Dockerfile for the same app pinning a specific Node.js version, build it with docker build, and run it with docker run on both machines from exercise 1. Confirm the feature now behaves identically on both.',
        taskHi: 'Wahi app ke liye ek Dockerfile likho jo ek khaas Node.js version pin kare, use \`docker build\` se banao, aur \`docker run\` se exercise 1 wali dono machines par chalaao. Confirm karo feature ab dono par ek-jaisa vyavhaar karta hai.',
        hint: 'Try deliberately editing a single comment in the application source and rebuilding — watch the terminal output to see which Docker layers get rebuilt versus reused from cache.',
        hintHi: 'Application source mein jaan-boojhkar ek akela comment edit karne aur rebuild karne ki koshish karo — terminal output dekho ye dekhne ke liye ki kaunsi Docker layers dobara banti hain versus cache se dobara istemal hoti hain.',
      },
      {
        task: 'Write a docker-compose.yml running the app alongside a real Postgres container, and confirm the app can connect to and query the database using the service name as the hostname, with no PostgreSQL installed directly on your own machine.',
        taskHi: 'Ek \`docker-compose.yml\` likho jo app ko ek asli Postgres container ke saath chalaaye, aur confirm karo app database se connect aur query kar sakta hai service naam ko hostname ki tarah istemal karke, apni khud ki machine par koi PostgreSQL direct installed hue bina.',
        hint: 'Run docker-compose down -v afterward to also remove the database container\'s data volume, giving yourself a clean slate to start fresh next time.',
        hintHi: 'Baad mein \`docker-compose down -v\` chalaao database container ka data volume bhi hataane ke liye, agli baar ek saaf shuruaat karne ke liye apne aap ko ek clean slate dete hue.',
      },
    ],

    keyTakeaways: [
      '"Works on my machine" happens because an application implicitly depends on its runtime environment (Node.js version, OS, system libraries), not just its own source code — and that environment can silently differ between a developer\'s machine and the production server.',
      'A Dockerfile packages an exact, pinned runtime environment (a specific Node.js version, OS, and dependencies) into a portable image, so the exact same container runs identically on any machine with Docker installed.',
      'Docker builds images as cached layers — copying package.json and running npm ci before copying the rest of the source code lets Docker reuse the dependency-install layer whenever only application code, not dependencies, has changed.',
      '.dockerignore excludes node_modules (a local install may be incompatible with the image\'s environment) and .env (secrets must never be baked into a portable, potentially widely-stored image).',
      'docker-compose runs multiple related containers (an app plus a real database) together from one file, giving every developer an identical local environment with one command.',
      'A multi-stage build compiles TypeScript in one stage and copies only the compiled output and production dependencies into a fresh final image, keeping the deployed image smaller and free of dev-only tooling.',
    ],
    keyTakeawaysHi: [
      '"Mere machine par to chalta hai" isliye hota hai kyunki ek application implicitly apne runtime environment par nirbhar karta hai (Node.js version, OS, system libraries), sirf apne source code par nahi — aur wo environment ek developer ki machine aur production server ke beech chupke se alag ho sakta hai.',
      'Ek Dockerfile ek bilkul, pin kiya runtime environment (ek khaas Node.js version, OS, aur dependencies) ek portable image mein package karta hai, taaki bilkul wahi container Docker installed kisi bhi machine par ek-jaisa chale.',
      'Docker images ko cached layers ki tarah banaata hai — \`package.json\` copy karna aur \`npm ci\` chalaana baaki source code copy karne se pehle Docker ko dependency-install layer dobara istemal karne deta hai jab bhi sirf application code badla ho, dependencies nahi.',
      '\`.dockerignore\` \`node_modules\` (ek local install image ke environment ke saath asangat ho sakti hai) aur \`.env\` (secrets ko kabhi ek portable, mumkin taur par wyaapak-stored image mein bake nahi karna chahiye) ko exclude karta hai.',
      '\`docker-compose\` ek file se kai judi containers (ek app plus ek asli database) ko saath chalaata hai, har developer ko ek identical local environment ek command se dete hue.',
      'Ek multi-stage build ek stage mein TypeScript compile karta hai aur sirf compile hua output aur production dependencies ek taaza aakhri image mein copy karta hai, deploy ki gayi image ko chhota aur dev-only tooling se mukt rakhte hue.',
    ],
  },
];
