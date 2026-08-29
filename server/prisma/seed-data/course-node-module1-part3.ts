/**
 * Node.js Complete Course — Module 1: Fundamentals, lesson 3.
 *
 * npm, package.json, and dependency management. The broken example installs
 * a genuinely required runtime package (express) as a devDependency —
 * everything works perfectly on the developer's own machine (npm install
 * installs both dependencies and devDependencies), and the app crashes only
 * in production, where deployment commonly runs a production-only install
 * that skips devDependencies entirely. This is a real, common "works on my
 * machine" class of bug specific to misunderstanding package.json's two
 * dependency lists.
 *
 * NOTE for future editors: escape every inline-code backtick inside these
 * template literals, INCLUDING inside plain markdown paragraphs (the
 * `content`/`contentHi`/`simple`/`simpleHi` fields). Single-quoted string
 * fields (explain, why, q, a, task, keyTakeaways, etc.) do NOT need backticks
 * escaped — only escape apostrophes there as a SINGLE backslash (\'), never
 * doubled (\\'), which breaks the string. Run `npx tsc --noEmit -p .` after
 * writing this file, before wiring it into seed.ts — it is the only fully
 * reliable check for both mistakes.
 */

import type { CourseLesson } from './course-js-module1';

export const NODE_MODULE_1_PART3: CourseLesson[] = [
  {
    slug: 'npm-package-json-dependencies',
    title: 'npm, package.json, and Dependency Management',
    titleHi: 'npm, package.json, Aur Dependency Management',
    description: 'A server that runs perfectly on a laptop for three weeks — and crashes the instant it is deployed, with an error naming a package that was "definitely installed".',
    descriptionHi: 'Ek server jo teen hafton tak ek laptop par bilkul theek chalta hai — aur deploy hote hi crash ho jaata hai, ek aisi error ke saath jo ek "pakka installed" package ka naam leti hai.',
    difficulty: 'MEDIUM',
    duration: 23,
    order: 3,

    analogy: {
      en: '**A home kitchen stocked with both cooking ingredients and baking hobby supplies, versus a restaurant kitchen that only ships what is needed to actually cook the menu.** A developer\'s own laptop is like a home kitchen where you keep both the ingredients you actually cook with every day (flour, oil, salt) and hobby supplies you only use occasionally while developing recipes (a cake-decorating kit, specialty tools for testing new techniques) — everything is present, all mixed together in the same kitchen, so a recipe genuinely works no matter which category an ingredient happens to fall into. A production server is like a restaurant\'s actual kitchen on opening night, deliberately stocked with ONLY what the published menu needs to be cooked and served — none of the hobby/testing supplies make the trip, on purpose, to keep the kitchen lean. If a dish\'s recipe was accidentally written assuming a hobby-supply ingredient would always be present, it works perfectly every time it is tested at home and fails specifically, and only, on opening night at the restaurant — precisely because "works when everything is present" and "correctly categorized as actually needed for the finished dish" are two different questions, and only the second one matters once you are not carrying every ingredient everywhere.',
      hi: '**Ek ghar ka kitchen jismein cooking ingredients aur baking hobby supplies dono bhare hain, versus ek restaurant kitchen jo sirf wahi bhejta hai jo menu asal mein pakane ke liye chahiye.** Ek developer ka apna laptop aise ghar ke kitchen jaisa hai jahan aap wo ingredients bhi rakhte ho jinse aap asal mein har din pakaate ho (aata, tel, namak) aur hobby supplies bhi jo aap sirf kabhi-kabhi recipes develop karte waqt use karte ho (ek cake-decorating kit, naye tarike test karne ke khaas tools) — sab kuch maujood hai, sab ek hi kitchen mein milaake, isliye ek recipe sach mein kaam karti hai chahe koi ingredient kis category mein aata ho. Ek production server restaurant ke asli kitchen jaisa hai opening night par, jaan-boojhkar SIRF wo bhara hua jo published menu ko pakaane aur parosne ke liye chahiye — koi bhi hobby/testing supplies safar nahi karti, jaan-boojhkar, kitchen ko lean rakhne ke liye. Agar ek dish ki recipe galti se ye maankar likhi gayi thi ki ek hobby-supply ingredient hamesha maujood rahega, ye har baar ghar par test hote hue bilkul theek kaam karta hai aur khaas taur par, aur sirf, restaurant mein opening night par fail hota hai — bilkul isliye kyunki "jab sab kuch maujood hai to kaam karta hai" aur "poori taiyaar dish ke liye sahi tarike se asal mein zaruri maana gaya" do alag sawaal hain, aur sirf doosra hi matter karta hai jab aap har ingredient har jagah nahi le jaate.',
    },

    simple: `**Start broken.** A tiny Express server, installed the "easy" way — one \`npm install\` line for everything:

\`\`\`bash
npm install express
npm install --save-dev nodemon   # a tool that restarts the server on file changes
npm install --save-dev express   # accidentally re-installed express as a DEV dependency too, overwriting its category
\`\`\`

\`\`\`json
{
  "name": "my-server",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {},
  "devDependencies": {
    "express": "^4.18.2",
    "nodemon": "^3.0.1"
  }
}
\`\`\`

On the developer\'s own laptop, everything works: \`npm install\` (with no flags) installs BOTH \`dependencies\` and \`devDependencies\` together, so \`node index.js\` finds \`express\` without any problem, no matter which of the two lists it is actually recorded under — from Node\'s perspective at runtime, a package installed in \`node_modules\` is just... installed, regardless of which \`package.json\` category put it there. The app is deployed to a production server. The deployment script runs \`npm install --omit=dev\` (a common, deliberate production practice, since dev-only tools like \`nodemon\` genuinely have no reason to exist on a production server) — and the app crashes immediately with:

\`\`\`
Error: Cannot find module 'express'
Require stack:
- /app/index.js
\`\`\`

\`--omit=dev\` (or the older, equivalent \`NODE_ENV=production npm install\`) specifically skips everything listed under \`devDependencies\` — and since \`express\`, a package the running application genuinely, absolutely needs to function, was recorded there instead of under \`dependencies\`, it is never installed at all on the production machine. The exact same source code, the exact same \`node index.js\` command, produces a working server on a laptop and an immediate crash in production, purely because of which one of \`package.json\`\'s two dependency lists a single package name was written under.

**The fix: runtime dependencies go under \`dependencies\`; dev-only tools go under \`devDependencies\`**

\`\`\`json
{
  "name": "my-server",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
\`\`\`

\`\`\`json
{
  "name": "my-server",
  "version": "1.0.0",
  "scripts": {
    "start": "node dist/index.js",
    "dev": "tsx watch src/index.ts",
    "build": "tsc"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "tsx": "^4.7.0",
    "@types/express": "^4.17.21",
    "@types/node": "^20.11.0"
  }
}
\`\`\`

The rule is simple once named directly: \`dependencies\` lists every package the application genuinely needs to actually RUN, in production, once it is built and deployed — \`express\` belongs here because the server cannot serve a single request without it. \`devDependencies\` lists every package needed only while DEVELOPING or BUILDING the application, never at runtime itself — \`nodemon\` (auto-restarts the server while coding, never used in the final running app) belongs here, and in the TypeScript version, so does \`typescript\` itself, \`tsx\` (runs TypeScript directly during development), and the \`@types/*\` packages (type information used only by the TypeScript compiler, stripped away entirely from compiled output, meaningless at runtime). Running \`npm install --omit=dev\` against the fixed \`package.json\` now installs exactly \`express\` — everything the running application actually needs — and correctly skips everything the running application does not, which is precisely the lean, production-appropriate install this command is meant to produce.`,

    simpleHi: `**Toote hue se shuru.** Ek chhota Express server, "aasan" tarike se install hua — sab kuch ke liye ek \`npm install\` line:

\`\`\`bash
npm install express
npm install --save-dev nodemon   # ek tool jo file changes par server restart karta hai
npm install --save-dev express   # galti se express ko DEV dependency ki tarah bhi dobara install kar diya, uski category overwrite karte hue
\`\`\`

\`\`\`json
{
  "name": "my-server",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {},
  "devDependencies": {
    "express": "^4.18.2",
    "nodemon": "^3.0.1"
  }
}
\`\`\`

Developer ke apne laptop par, sab kuch kaam karta hai: \`npm install\` (bina kisi flag ke) DONO \`dependencies\` aur \`devDependencies\` saath install karta hai, isliye \`node index.js\` \`express\` ko bina kisi samasya ke paata hai, chahe wo asal mein do listons mein se kis mein record ho — Node ke runtime nazariye se, \`node_modules\` mein install hua package bas... installed hai, chahe use kaunsi \`package.json\` category ne wahan daala ho. App ko ek production server par deploy kiya jaata hai. Deployment script \`npm install --omit=dev\` chalaata hai (ek aam, jaan-boojhkar production practice, kyunki \`nodemon\` jaise dev-only tools ka production server par maujood hone ka sach mein koi kaaran nahi) — aur app turant crash ho jaata hai:

\`\`\`
Error: Cannot find module 'express'
Require stack:
- /app/index.js
\`\`\`

\`--omit=dev\` (ya purana, barabar \`NODE_ENV=production npm install\`) khaas taur par \`devDependencies\` ke tahat list hui har cheez skip karta hai — aur chunki \`express\`, ek package jise chalti application ko sach mein, poori tarah kaam karne ke liye chahiye, iske bajaye wahan record hua tha \`dependencies\` ke tahat nahi, ye production machine par kabhi install hi nahi hota. Bilkul wahi source code, bilkul wahi \`node index.js\` command, laptop par ek chalta server aur production mein turant crash paida karti hai, poori tarah isliye kyunki ek akele package naam ko \`package.json\` ki do dependency lists mein se kis ke tahat likha gaya.

**Fix: runtime dependencies \`dependencies\` ke tahat jaate hain; dev-only tools \`devDependencies\` ke tahat**

\`\`\`json
{
  "name": "my-server",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
\`\`\`

\`\`\`json
{
  "name": "my-server",
  "version": "1.0.0",
  "scripts": {
    "start": "node dist/index.js",
    "dev": "tsx watch src/index.ts",
    "build": "tsc"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "tsx": "^4.7.0",
    "@types/express": "^4.17.21",
    "@types/node": "^20.11.0"
  }
}
\`\`\`

Niyam saadha hai ek baar seedha naam mil jaaye: \`dependencies\` har us package ko list karta hai jise application ko production mein, ek baar bane aur deploy hone ke baad, asal mein CHALNE ke liye chahiye — \`express\` yahan hai kyunki server iske bina ek bhi request serve nahi kar sakta. \`devDependencies\` har us package ko list karta hai jise sirf DEVELOP ya BUILD karte waqt chahiye, kabhi runtime par khud nahi — \`nodemon\` (code likhte waqt server ko apne aap restart karta hai, kabhi aakhri chalti app mein use nahi hota) yahan hai, aur TypeScript version mein, \`typescript\` khud bhi, \`tsx\` (development ke dauran TypeScript seedha chalaata hai), aur \`@types/*\` packages (sirf TypeScript compiler ke istemal mein aati type jaankaari, compiled output se poori tarah nikaal di jaati hai, runtime par bemaani). Theek kiye \`package.json\` ke khilaaf \`npm install --omit=dev\` chalaana ab bilkul \`express\` install karta hai — chalti application ko asal mein jo chahiye wo sab — aur sahi tarike se wo sab skip karta hai jo chalti application ko nahi chahiye, jo bilkul wo lean, production-upyukt install hai jo ye command banaane ke liye hai.`,

    content: `## What package.json actually is

\`\`\`json
{
  "name": "my-server",
  "version": "1.2.0",
  "description": "A tiny API server",
  "main": "index.js",
  "scripts": { "start": "node index.js" },
  "dependencies": { "express": "^4.18.2" },
  "devDependencies": { "nodemon": "^3.0.1" }
}
\`\`\`

\`package.json\` is a project\'s manifest — a single JSON file recording its name, version, entry point, the commands available through \`npm run\`, and, critically, the exact list of every external package the project depends on. It is not itself the place the actual package code lives (that is \`node_modules\`, generated by running \`npm install\` against this manifest); \`package.json\` is closer to a shopping list plus a project ID card, checked into version control (committed to Git) so that anyone — a teammate, a CI server, a production deployment — can run \`npm install\` against it and get a working copy of every dependency the project actually needs.

## Semantic versioning: what a version number like "^4.18.2" actually promises

\`\`\`
4.18.2
│  │  └── PATCH: bug fixes only, no new features, nothing that should break existing code
│  └───── MINOR: new features added, but existing code should keep working unchanged
└──────── MAJOR: breaking changes — existing code may need to change to keep working
\`\`\`

\`\`\`json
"express": "^4.18.2"     // allows 4.18.2 up to (but not including) 5.0.0 — any MINOR or PATCH update
"express": "~4.18.2"     // allows 4.18.2 up to (but not including) 4.19.0 — PATCH updates only
"express": "4.18.2"      // exactly this version, nothing else, ever
\`\`\`

Semantic versioning (semver) is a convention — not a rule the JavaScript language enforces — where a package\'s version number\'s three parts are meant to signal the SIZE of change from the previous version: a MAJOR bump (\`4.x\` to \`5.x\`) signals the package\'s maintainers believe existing code using it might need to change; a MINOR bump signals new capability was added without breaking anything that already worked; a PATCH bump signals only bug fixes. The \`^\` prefix (the default \`npm install <package>\` writes) tells npm "automatically use any newer MINOR or PATCH version, but never automatically cross a MAJOR version boundary" — a deliberate, common tradeoff that lets a project pick up bug fixes and new features without manual intervention, while trusting semver\'s promise that MINOR/PATCH updates will not break existing code. This trust is a convention maintained by package authors, not something npm can technically enforce — a package publishing a MINOR version that accidentally breaks something despite semver\'s promise is a real, if relatively uncommon, occurrence.

## package-lock.json: pinning the EXACT versions that were actually tested

\`\`\`json
// package.json says: "express": "^4.18.2" — a RANGE of acceptable versions
// package-lock.json says: express is EXACTLY 4.18.3, resolved on this specific date,
// with this specific dependency tree, down to every nested package
\`\`\`

\`package.json\`\'s \`^4.18.2\` is a range, not a single version — running \`npm install\` on two different days could genuinely resolve to two different actual versions (say, \`4.18.2\` versus a newly-released \`4.18.5\`), both technically satisfying the same \`^4.18.2\` range in \`package.json\`. \`package-lock.json\`, automatically generated and updated by npm, records the EXACT version actually installed, for every single package in the entire dependency tree (including packages your own dependencies depend on, several layers deep) — this file is what makes an install reproducible: committing it to version control means every teammate, and the production deployment itself, installs the identical exact versions that were actually tested, rather than whatever happens to satisfy the range on a given day. This is precisely why \`package-lock.json\` must be committed to Git, not ignored — treating it as a disposable, auto-generated file (the way \`node_modules\` correctly is ignored) throws away the exact reproducibility it exists to provide.

## \`npm install\` versus \`npm ci\`: which one production deployments should use

\`\`\`bash
npm install   # reads package.json, MAY update package-lock.json if versions have drifted, slower
npm ci        # reads package-lock.json ONLY, installs exactly what it says, fails if package.json and the lock file disagree, faster
\`\`\`

\`npm install\`, run without arguments, is flexible by design — it will resolve and potentially update \`package-lock.json\` if the ranges in \`package.json\` and what is currently locked have drifted apart, which is exactly the right behavior on a developer\'s own machine while actively adding or updating dependencies. \`npm ci\` (\"clean install\") is the command specifically intended for CI pipelines and production deployments: it reads \`package-lock.json\` alone, installs precisely the versions recorded there with no resolution or updating, and deliberately fails loudly if \`package.json\` and \`package-lock.json\` do not agree, rather than silently reconciling them — this stricter, faster, more reproducible behavior is exactly what an automated deployment should want, and is the standard, widely-recommended choice over plain \`npm install\` for that specific context.

## TypeScript: what changes in package.json for a TypeScript project

\`\`\`json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": { "express": "^4.18.2" },
  "devDependencies": {
    "typescript": "^5.4.0",
    "tsx": "^4.7.0",
    "@types/express": "^4.17.21",
    "@types/node": "^20.11.0"
  }
}
\`\`\`

A TypeScript Node.js project\'s \`dependencies\` list looks identical to a plain JavaScript project\'s — \`express\` is still needed at runtime either way, since TypeScript is compiled away entirely before the application actually runs. What changes lives entirely in \`devDependencies\`: \`typescript\` itself (the compiler, never needed once compiled \`.js\` output exists), \`tsx\` or \`ts-node\` (tools that run \`.ts\` files directly during development without a separate build step), and \`@types/*\` packages (type definitions consumed only by the TypeScript compiler while checking code, entirely absent from the compiled JavaScript output). The \`"build": "tsc"\` script compiles TypeScript source into plain JavaScript in a \`dist\` (or similar) folder, and \`"start": "node dist/index.js"\` runs that compiled output directly with plain Node — production only ever runs the compiled \`.js\` files, never needing TypeScript itself installed at all, which is exactly why \`typescript\` correctly belongs under \`devDependencies\`, following the identical rule this lesson\'s broken example demonstrated for \`express\`.`,

    contentHi: `## package.json asal mein kya hai

\`\`\`json
{
  "name": "my-server",
  "version": "1.2.0",
  "description": "A tiny API server",
  "main": "index.js",
  "scripts": { "start": "node index.js" },
  "dependencies": { "express": "^4.18.2" },
  "devDependencies": { "nodemon": "^3.0.1" }
}
\`\`\`

\`package.json\` ek project ka manifest hai — ek akeli JSON file jo uska naam, version, entry point, \`npm run\` ke through maujood commands, aur, sabse zaruri, har external package ki bilkul list record karti hai jispar project nirbhar hai. Ye khud wo jagah nahi hai jahan asli package code rehta hai (wo \`node_modules\` hai, is manifest ke khilaaf \`npm install\` chalaakar banti hai); \`package.json\` ek shopping list plus project ID card ke zyada kareeb hai, version control mein check ki hui (Git mein commit ki hui) taaki koi bhi — ek teammate, ek CI server, ek production deployment — iske khilaaf \`npm install\` chala sake aur project ko asal mein jo chahiye har dependency ki ek chalti copy paa sake.

## Semantic versioning: "^4.18.2" jaisa version number asal mein kya promise karta hai

\`\`\`
4.18.2
│  │  └── PATCH: sirf bug fixes, koi naya feature nahi, kuch bhi jo maujood code todein nahi
│  └───── MINOR: naye features jode gaye, par maujood code bina badle chalta rehna chahiye
└──────── MAJOR: breaking changes — maujood code ko chalte rehne ke liye badalna pad sakta hai
\`\`\`

\`\`\`json
"express": "^4.18.2"     // 4.18.2 se lekar (par shaamil nahi) 5.0.0 tak allow karta hai — koi bhi MINOR ya PATCH update
"express": "~4.18.2"     // 4.18.2 se lekar (par shaamil nahi) 4.19.0 tak allow karta hai — sirf PATCH updates
"express": "4.18.2"      // bilkul yahi version, kuch aur nahi, kabhi nahi
\`\`\`

Semantic versioning (semver) ek convention hai — koi niyam jo JavaScript bhaasha lagu karti ho aisa nahi — jahan ek package ke version number ke teen hisson ka matlab pichle version se BADLAAV KA SIZE batana hai: ek MAJOR badhaav (\`4.x\` se \`5.x\`) batata hai package ke maintainers maante hain ise use karta maujood code shaayad badalna pade; ek MINOR badhaav batata hai naya capability joda gaya bina wo kuch tode jo pehle se kaam karta tha; ek PATCH badhaav sirf bug fixes batata hai. \`^\` prefix (default jo \`npm install <package>\` likhta hai) npm ko batata hai "apne aap koi bhi naya MINOR ya PATCH version use karo, par kabhi apne aap ek MAJOR version boundary paar mat karo" — ek jaan-boojhkar, aam tradeoff jo ek project ko bug fixes aur naye features bina manual dakhal ke uthaane deta hai, semver ke is vaade par bharosa karte hue ki MINOR/PATCH updates maujood code nahi todenge. Ye bharosa package authors dwara maintain kiya gaya ek convention hai, koi aisi cheez nahi jise npm taknik roop se lagu kar sake — ek package jo ek MINOR version publish karti hai jo galti se semver ke vaade ke bawajood kuch tod deti hai ek asli, chahe apekshakrit durlabh, ghatna hai.

## package-lock.json: bilkul wahi versions pin karna jo asal mein test hue the

\`\`\`json
// package.json kehta hai: "express": "^4.18.2" — sweekar-hone-laayak versions ki ek RANGE
// package-lock.json kehta hai: express BILKUL 4.18.3 hai, is khaas tareekh par resolve hua,
// is khaas dependency tree ke saath, har nested package tak
\`\`\`

\`package.json\` ka \`^4.18.2\` ek range hai, akela version nahi — do alag dinon par \`npm install\` chalaana sach mein do alag asli versions par resolve ho sakta hai (maano, \`4.18.2\` versus ek taaza-release hua \`4.18.5\`), dono taknik roop se \`package.json\` mein wahi \`^4.18.2\` range santusht karte hue. \`package-lock.json\`, npm dwara apne aap banaayi aur update ki hui, poori dependency tree mein har akele package ke liye asal mein install hua BILKUL version record karti hai (aapki apni dependencies jinpar nirbhar hain unke packages sameet, kai layers gehre) — ye file wo hai jo ek install ko reproducible banaati hai: ise version control mein commit karna matlab har teammate, aur khud production deployment, bilkul wahi asli versions install karta hai jo sach mein test hue the, us din ki range ko jo bhi santusht kare uske bajaye. Bilkul isi wajah se \`package-lock.json\` ko Git mein commit karna chahiye, ignore nahi karna chahiye — ise ek phenkne-laayak, apne-aap-bane file ki tarah treat karna (jaise \`node_modules\` ko sahi tarike se ignore kiya jaata hai) bilkul wahi exact reproducibility fenk deta hai jo ye dene ke liye maujood hai.

## \`npm install\` versus \`npm ci\`: production deployments ko kaunsa use karna chahiye

\`\`\`bash
npm install   # package.json padhta hai, agar versions drift hue hon to package-lock.json update KAR SAKTA HAI, dheema
npm ci        # SIRF package-lock.json padhta hai, bilkul wahi install karta hai jo wo kehta hai, agar package.json aur lock file bemel hon to fail hota hai, tez
\`\`\`

\`npm install\`, bina arguments ke chalaya gaya, design se flexible hai — ye \`package-lock.json\` ko resolve aur shaayad update karega agar \`package.json\` ki ranges aur abhi lock hui cheezein alag ho gayi hon, jo ek developer ke apne machine par dependencies actively jodte ya update karte waqt bilkul sahi behaviour hai. \`npm ci\` ("clean install") wo command hai jo khaas taur par CI pipelines aur production deployments ke liye maani gayi hai: ye akele \`package-lock.json\` padhta hai, wahi bilkul versions install karta hai jo wahan record hain koi resolution ya updating ke bina, aur jaan-boojhkar zor se fail hota hai agar \`package.json\` aur \`package-lock.json\` sehmat na hon, chupchap unhe reconcile karne ke bajaye — ye zyada sakht, tez, zyada reproducible behaviour bilkul wahi hai jo ek automated deployment chahegi, aur wo standard, badi taur par sujhaaya chunaav hai saadhe \`npm install\` par us khaas context ke liye.

## TypeScript: TypeScript project ke liye package.json mein kya badalta hai

\`\`\`json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": { "express": "^4.18.2" },
  "devDependencies": {
    "typescript": "^5.4.0",
    "tsx": "^4.7.0",
    "@types/express": "^4.17.21",
    "@types/node": "^20.11.0"
  }
}
\`\`\`

TypeScript Node.js project ki \`dependencies\` list saadhe JavaScript project jaisi hi dikhti hai — \`express\` abhi bhi runtime par chahiye dono taraf se, kyunki TypeScript application asal mein chalne se poori tarah pehle poori tarah compile hokar hat jaata hai. Jo badalta hai wo poori tarah \`devDependencies\` mein rehta hai: \`typescript\` khud (compiler, ek baar compiled \`.js\` output maujood hone par kabhi zaruri nahi), \`tsx\` ya \`ts-node\` (tools jo \`.ts\` files ko development ke dauran seedha chalaate hain ek alag build step ke bina), aur \`@types/*\` packages (type definitions jo sirf TypeScript compiler code check karte waqt istemal karta hai, compiled JavaScript output se poori tarah gair-maujood). \`"build": "tsc"\` script TypeScript source ko \`dist\` (ya waise hi) folder mein saadhi JavaScript mein compile karta hai, aur \`"start": "node dist/index.js"\` us compiled output ko saadhe Node se seedha chalaata hai — production hamesha sirf compiled \`.js\` files chalata hai, kabhi TypeScript khud install hone ki zarurat nahi, bilkul isi wajah se \`typescript\` sahi tarike se \`devDependencies\` ke tahat aata hai, is lesson ke toote example ne \`express\` ke liye dikhaaya wahi niyam follow karte hue.`,

    examples: [
      {
        title: 'Broken: express recorded under devDependencies',
        titleHi: 'Toota: devDependencies ke tahat record hua express',
        code: `{
  "dependencies": {},
  "devDependencies": { "express": "^4.18.2", "nodemon": "^3.0.1" }
}
// npm install --omit=dev -> express never installed`,
        codeJs: `// package.json
{
  "name": "my-server",
  "scripts": { "start": "node index.js", "dev": "nodemon index.js" },
  "dependencies": {},
  "devDependencies": {
    "express": "^4.18.2",
    "nodemon": "^3.0.1"
  }
}

// On the laptop: npm install (no flags) installs both lists — works fine.
// In production: npm install --omit=dev skips devDependencies entirely.
// $ node index.js
// Error: Cannot find module 'express'`,
        codeTs: `// package.json
{
  "name": "my-server",
  "scripts": { "start": "node dist/index.js", "dev": "tsx watch src/index.ts", "build": "tsc" },
  "dependencies": {},
  "devDependencies": {
    "express": "^4.18.2",
    "typescript": "^5.4.0",
    "tsx": "^4.7.0"
  }
}
// Same mistake, same consequence — TypeScript compiling successfully
// (tsc has no way to know a package will be missing from a DIFFERENT,
// production-only install) does not catch this either.`,
        output: `Local development: everything works, since "npm install" (no flags)
installs devDependencies too. Production deployment running "npm
install --omit=dev": crashes immediately with "Error: Cannot find
module 'express'" — the exact same source code, different only in
which environment's install command was used.`,
        explain: 'This bug is specifically invisible during normal development, because the developer\'s own workflow (plain "npm install") never exercises the production-only "--omit=dev" path that actually reveals the miscategorization.',
        explainHi: 'Ye bug khaas taur par aam development ke dauran adrishya hai, kyunki developer ka apna workflow (saadha "npm install") kabhi production-only "--omit=dev" rah ko chalaata hi nahi jo asal mein galat category ko saamne laata hai.',
      },
      {
        title: 'Fixed: correct categorization matches what each install command actually needs',
        titleHi: 'Theek: sahi categorization us se milta hai jo har install command ko asal mein chahiye',
        code: `{
  "dependencies": { "express": "^4.18.2" },
  "devDependencies": { "nodemon": "^3.0.1" }
}`,
        codeJs: `// package.json
{
  "name": "my-server",
  "scripts": { "start": "node index.js", "dev": "nodemon index.js" },
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
// $ npm install --omit=dev
// $ node index.js
// (starts correctly — express was installed)`,
        codeTs: `// package.json
{
  "name": "my-server",
  "scripts": { "start": "node dist/index.js", "dev": "tsx watch src/index.ts", "build": "tsc" },
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "tsx": "^4.7.0",
    "@types/express": "^4.17.21",
    "@types/node": "^20.11.0"
  }
}
// $ npm run build && npm install --omit=dev && npm start
// (compiled dist/index.js starts correctly — express was installed;
// typescript itself was correctly skipped, since compiled output
// needs only plain Node to run)`,
        outputJs: `"npm install --omit=dev" now installs exactly express (the only thing
listed under dependencies) and correctly skips nodemon — "node
index.js" starts successfully in this production-like environment,
identically to how it started in development.`,
        outputTs: `// Identical outcome. The compiled dist/index.js file needs only
// express to run — typescript, tsx, and the @types packages were all
// correctly excluded from the production install, since none of them
// are referenced by the compiled JavaScript output at all.`,
        explain: 'The fix required zero changes to any application code — only moving two lines between the two lists in package.json, based on a single question: "does the RUNNING application need this, or only the process of building/developing it?"',
        explainHi: 'Fix ke liye kisi bhi application code mein zero badlaav chahiye the — sirf package.json ki do lists ke beech do lines move karna, ek akele sawaal ke hisaab se: "kya CHALTI application ko ye chahiye, ya sirf ise banaane/develop karne ke process ko?"',
      },
      {
        title: 'Semantic versioning ranges versus package-lock.json\'s exact pin',
        titleHi: 'Semantic versioning ranges versus package-lock.json ka exact pin',
        code: `// package.json: "express": "^4.18.2"  — a RANGE
// package-lock.json: express resolved to exactly 4.18.3 — an EXACT version`,
        codeJs: `// package.json (a range — the same file could resolve to different
// actual versions on different days)
{
  "dependencies": { "express": "^4.18.2" }
}

// package-lock.json (auto-generated, pins the EXACT version actually
// installed and tested, for every package in the whole tree)
{
  "packages": {
    "node_modules/express": {
      "version": "4.18.3",
      "resolved": "https://registry.npmjs.org/express/-/express-4.18.3.tgz"
    }
  }
}
// Committing package-lock.json means every teammate and the production
// deployment install this exact 4.18.3, not "whatever ^4.18.2
// currently resolves to today".`,
        codeTs: `// Identical concept — semver ranges and package-lock.json's exact
// pinning work the same way regardless of whether the project is
// JavaScript or TypeScript; TypeScript's own devDependencies (like
// "typescript": "^5.4.0") follow the exact same ^/~ range rules.
{
  "dependencies": { "express": "^4.18.2" },
  "devDependencies": { "typescript": "^5.4.0" }
}`,
        output: `Two developers running "npm install" on the same package.json, weeks
apart, without package-lock.json committed, could genuinely end up
with two different actual express versions installed — WITH
package-lock.json committed, both get identically 4.18.3, regardless
of when they ran the install.`,
        explain: 'This is why package-lock.json belongs in version control alongside package.json, never in .gitignore — package.json alone describes acceptable ranges, and only the lock file pins down the exact reality that was actually tested.',
        explainHi: 'Bilkul isi wajah se \`package-lock.json\` \`package.json\` ke saath version control mein hona chahiye, kabhi \`.gitignore\` mein nahi — akela \`package.json\` sweekar-hone-laayak ranges batata hai, aur sirf lock file us asli haqeeqat ko pin karti hai jo asal mein test hui thi.',
      },
      {
        title: 'npm scripts: how "start", "dev", and "build" map to real commands',
        titleHi: 'npm scripts: "start", "dev", aur "build" asli commands se kaise milte hain',
        code: `{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest"
  }
}
// npm start / npm run dev / npm test`,
        codeJs: `// package.json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest"
  }
}

// "start" and "test" are special-cased by npm: "npm start" and "npm
// test" work without the word "run". Every other script needs "run":
// $ npm start        (same as "npm run start")
// $ npm run dev
// $ npm test          (same as "npm run test")`,
        codeTs: `// package.json
{
  "scripts": {
    "start": "node dist/index.js",
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "test": "jest"
  }
}

// A TypeScript project typically adds a "build" script (compiling
// .ts -> .js) that a plain JS project has no need for — "start" runs
// the COMPILED output, never the .ts source directly, matching how
// production actually executes the app.
// $ npm run build && npm start`,
        outputJs: `"npm run dev" starts the server with nodemon (auto-restarting on file
changes, a development convenience); "npm start" runs the same
application with plain "node", no auto-restart — the command a
production deployment actually uses.`,
        outputTs: `// "npm run dev" runs TypeScript source directly via tsx, for fast
// development iteration. "npm run build" compiles it to dist/, and
// "npm start" runs ONLY that compiled output — production never runs
// tsx or the TypeScript compiler itself, only the plain-JS result.`,
        explain: 'The "scripts" field is how a project documents its own standard commands in one discoverable place — a new teammate (or a CI pipeline) runs "npm run build" or "npm start" without needing to know or guess the exact underlying tool or file path each one invokes.',
        explainHi: '"scripts" field wo tarika hai jisse ek project apne standard commands ko ek dhoondhne-laayak jagah mein batata hai — ek naya teammate (ya ek CI pipeline) "npm run build" ya "npm start" chalaata hai bina asli underlying tool ya file path jaanne ya andaaza lagaane ki zarurat ke jo har ek bulaata hai.',
      },
    ],

    mistakes: [
      {
        wrong: `npm install --save-dev express
// a runtime-required package installed as a DEV dependency`,
        right: `npm install express
// runtime-required packages go under "dependencies" (npm's default, no flag needed)`,
        why: 'A package the running application genuinely needs to function must be listed under "dependencies" — a production-only install (npm install --omit=dev) skips everything under "devDependencies" entirely, crashing the app if a required package was mistakenly placed there.',
        whyHi: 'Ek package jise chalti application ko sach mein kaam karne ke liye chahiye \`"dependencies"\` ke tahat list hona chahiye — ek production-only install (\`npm install --omit=dev\`) \`"devDependencies"\` ke tahat har cheez poori tarah skip karta hai, agar ek zaruri package galti se wahan rakha gaya to app ko crash karte hue.',
      },
      {
        wrong: `# .gitignore
node_modules/
package-lock.json
# treating the lock file as disposable, like node_modules`,
        right: `# .gitignore
node_modules/
# package-lock.json is committed, NOT ignored`,
        why: 'package-lock.json pins the exact version of every package actually tested, across the entire dependency tree — ignoring it means every fresh install can silently resolve to different actual versions than what was tested, defeating the reproducibility it exists to provide.',
        whyHi: '\`package-lock.json\` poori dependency tree mein sach mein test hue har package ka bilkul version pin karta hai — ise ignore karna matlab har taaza install chupchap test hue se alag asli versions par resolve ho sakta hai, wo reproducibility haraate hue jo ye dene ke liye maujood hai.',
      },
      {
        wrong: `# In a CI/deployment pipeline:
npm install
# flexible, can update package-lock.json, slower — not ideal for automated deploys`,
        right: `# In a CI/deployment pipeline:
npm ci
# installs exactly what package-lock.json specifies, fails loudly if out of sync, faster`,
        why: 'npm install is designed to be flexible and may update package-lock.json if package.json\'s ranges have drifted — an automated deployment should instead use npm ci, which installs precisely the locked versions and fails immediately if package.json and the lock file disagree, rather than silently reconciling them.',
        whyHi: '\`npm install\` flexible hone ke liye design hua hai aur \`package-lock.json\` update kar sakta hai agar \`package.json\` ki ranges drift hui hon — ek automated deployment ko iske bajaye \`npm ci\` use karna chahiye, jo bilkul locked versions install karta hai aur turant fail hota hai agar \`package.json\` aur lock file sehmat na hon, unhe chupchap reconcile karne ke bajaye.',
      },
    ],

    realWorld: [
      {
        en: '**"Cannot find module" errors that appear ONLY in production, never locally, are among the most commonly reported real deployment incidents in Node.js projects** — the dependencies/devDependencies miscategorization this lesson demonstrated is consistently one of the top root causes, precisely because it is invisible during normal local development.',
        hi: '**"Cannot find module" errors jo SIRF production mein dikhti hain, kabhi locally nahi, Node.js projects mein sabse aksar report hone wale asli deployment incidents mein se hain** — is lesson ne dikhaayi dependencies/devDependencies galat-categorization lagataar sabse upar wale root causes mein se ek hai, bilkul isliye kyunki ye aam local development ke dauran adrishya hai.',
      },
      {
        en: '**Every major hosting platform and CI system (Vercel, Railway, Render, GitHub Actions, Docker-based deployments) either runs `npm ci` by default or explicitly documents it as the recommended production install command**, specifically for the reproducibility and speed benefits this lesson covered.',
        hi: '**Har badi hosting platform aur CI system (Vercel, Railway, Render, GitHub Actions, Docker-based deployments) ya to default roop se \`npm ci\` chalaate hain ya use production install command ki tarah explicitly sujhaayi hui documentation dete hain**, khaas taur par is lesson mein cover hue reproducibility aur speed faayde ke liye.',
      },
      {
        en: '**Dependabot and similar automated dependency-update tools work directly against semantic versioning and package-lock.json** — proposing pull requests that bump a version within (or across) semver ranges specifically because the lock file makes it possible to know and test the exact, precise change being proposed.',
        hi: '**Dependabot aur waise hi automated dependency-update tools seedha semantic versioning aur package-lock.json ke khilaaf kaam karte hain** — pull requests sujhaate hue jo semver ranges ke andar (ya paar) version badhaate hain khaas taur par isliye kyunki lock file ye jaanna aur test karna mumkin banaati hai ki sujhaaya gaya badlaav bilkul, sateek kya hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does a package installed under "devDependencies" work perfectly when a developer runs plain "npm install" locally, but cause the application to crash when deployed to a production environment running "npm install --omit=dev"?',
        qHi: '\`"devDependencies"\` ke tahat install hua package developer ke saadha "npm install" chalaane par bilkul theek kaam kyun karta hai, par "npm install --omit=dev" chalaate production environment mein deploy hone par application ko crash kyun karta hai?',
        a: 'Plain "npm install", run with no additional flags, installs every package listed under BOTH "dependencies" and "devDependencies" into node_modules without distinction — from the perspective of the running Node.js process, once a package exists in node_modules, it is simply available to be required or imported, regardless of which of package.json\'s two lists originally caused it to be installed. "npm install --omit=dev" is a deliberately more selective command that specifically skips installing anything listed under "devDependencies", installing only what is under "dependencies" — a common, intentional practice for production deployments, since dev-only tools genuinely have no purpose running in production and needlessly increase install size and time. If a package the running application actually requires at runtime was mistakenly placed under "devDependencies" rather than "dependencies", it is present during local development (where plain "npm install" installs everything) but entirely absent after a production-style "--omit=dev" install, causing any code that tries to require or import it to fail with a "Cannot find module" error the moment that code runs.',
        aHi: 'Saadha "npm install", bina extra flags ke chalaya gaya, \`"dependencies"\` AUR \`"devDependencies"\` dono ke tahat list har package ko \`node_modules\` mein bina fark ke install karta hai — chalti Node.js process ke nazariye se, ek baar \`node_modules\` mein package maujood ho jaaye, ye bas \`require\` ya \`import\` hone ke liye maujood hai, chahe \`package.json\` ki do lists mein se kis ne asal mein use install karaaya. "npm install --omit=dev" ek jaan-boojhkar zyada chunavi command hai jo khaas taur par \`"devDependencies"\` ke tahat list hui kisi bhi cheez ko install karna skip karti hai, sirf wahi install karte hue jo \`"dependencies"\` ke tahat hai — production deployments ke liye ek aam, jaan-boojhkar practice, kyunki dev-only tools ka production mein chalne ka sach mein koi maqsad nahi aur wo bina zarurat install size aur waqt badhaate hain. Agar chalti application ko asal mein runtime par chahiye package galti se \`"devDependencies"\` ke tahat rakha gaya \`"dependencies"\` ke bajaye, ye local development ke dauran maujood hai (jahan saadha "npm install" sab kuch install karta hai) par production-style "--omit=dev" install ke baad poori tarah gair-maujood hai, koi bhi code jo use \`require\` ya \`import\` karne ki koshish karta hai use us pal "Cannot find module" error se fail karaate hue jab wo code chalta hai.',
      },
      {
        q: 'What is the practical difference between "^4.18.2" and "~4.18.2" as a version range, and why does npm default to "^" when installing a package?',
        qHi: 'Version range ki tarah "^4.18.2" aur "~4.18.2" mein practical fark kya hai, aur npm ek package install karte waqt "^" par default kyun karta hai?',
        a: '"^4.18.2" allows any version from 4.18.2 up to, but not including, the next MAJOR version (5.0.0) — meaning it permits automatic upgrades to new MINOR versions (new features, like 4.19.0) as well as new PATCH versions (bug fixes, like 4.18.3), trusting semantic versioning\'s convention that MINOR and PATCH updates should never break existing code. "~4.18.2" is more conservative, allowing only new PATCH versions within the same MINOR release (up to but not including 4.19.0) — bug fixes only, no new features automatically adopted. npm defaults newly-installed packages to "^" specifically because it represents a reasonable, widely-adopted middle ground: automatically receiving bug fixes and new backward-compatible features without manual version-bumping busywork, while still refusing to automatically cross a MAJOR version boundary, where semantic versioning\'s convention explicitly signals that breaking changes might exist.',
        aHi: '"^4.18.2" 4.18.2 se lekar, par shaamil nahi, agli MAJOR version (5.0.0) tak koi bhi version allow karta hai — matlab ye naye MINOR versions (naye features, jaise 4.19.0) ke saath-saath naye PATCH versions (bug fixes, jaise 4.18.3) tak apne aap upgrades allow karta hai, semantic versioning ke us convention par bharosa karte hue ki MINOR aur PATCH updates kabhi maujood code nahi todne chahiye. "~4.18.2" zyada conservative hai, sirf usi MINOR release ke andar naye PATCH versions allow karta hai (4.19.0 tak par shaamil nahi) — sirf bug fixes, apne aap koi naye features nahi apnaaye jaate. npm naye install hue packages ko default roop se "^" par isliye karta hai khaas taur par kyunki ye ek samajhdaari wala, badi taur par apnaaya beech ka raasta darzha karta hai: bug fixes aur naye backward-compatible features apne aap paana bina manual version-badhaane wali bekaar mehnat ke, jabki phir bhi apne aap ek MAJOR version boundary paar karne se mana karte hue, jahan semantic versioning ka convention explicitly ishara karta hai breaking changes maujood ho sakte hain.',
      },
      {
        q: 'Why must package-lock.json be committed to version control, rather than treated as a disposable, regeneratable file like node_modules?',
        qHi: 'package-lock.json ko version control mein commit kyun karna chahiye, use ek phenkne-laayak, dobara-banaaye-ja-sakne-laayak file ki tarah treat karne ke bajaye jaise node_modules?',
        a: 'package.json\'s dependency entries specify RANGES of acceptable versions (like "^4.18.2"), not single exact versions — running a fresh "npm install" against package.json alone, on two different days, could genuinely resolve to two different actual versions if a new version satisfying the same range was published in between, since npm always tries to satisfy a range with the newest version currently available that fits it. package-lock.json exists specifically to eliminate that variability: it records the exact, specific version of every single package actually resolved and installed, across the entire dependency tree including nested dependencies several layers deep, at the moment it was generated. Committing this file to version control means every subsequent install performed against it — by a different teammate, a CI pipeline, or a production deployment, potentially weeks or months later — installs those exact same recorded versions, guaranteeing everyone is running the identical dependency tree that was actually tested, rather than whatever the broader version range happens to currently resolve to. Treating it as disposable and regenerating it on each install (or ignoring it entirely) discards this reproducibility guarantee, reintroducing the possibility of subtly different dependency versions between environments — precisely the kind of inconsistency that produces hard-to-reproduce "works on my machine" bugs.',
        aHi: '\`package.json\` ki dependency entries sweekar-hone-laayak versions ki RANGES batati hain (jaise "^4.18.2"), akele exact versions nahi — akele \`package.json\` ke khilaaf ek taaza "npm install" chalaana, do alag dinon par, sach mein do alag asli versions par resolve ho sakta hai agar beech mein wahi range santusht karta ek naya version publish hua ho, kyunki npm hamesha ek range ko us se milte abhi maujood sabse naye version se santusht karne ki koshish karta hai. \`package-lock.json\` khaas taur par us badlaav ko khatam karne ke liye maujood hai: ye poori dependency tree mein har akele package ka asal mein resolve aur install hua bilkul, khaas version record karta hai, kai layers gehri nested dependencies sameet, us pal jab ye banaayi gayi thi. Is file ko version control mein commit karna matlab uske khilaaf har baad wala install — ek alag teammate se, ek CI pipeline se, ya ek production deployment se, shaayad hafton ya mahinon baad — wahi bilkul record hui versions install karta hai, sabko guarantee dete hue ki wo wahi dependency tree chala rahe hain jo asal mein test hui thi, chauhi range abhi jo bhi resolve karti ho uske bajaye. Ise phenkne-laayak treat karna aur har install par dobara banaana (ya poori tarah ignore karna) ye reproducibility guarantee fenk deta hai, environments ke beech thodi alag dependency versions ki sambhaavna wapas laate hue — bilkul wo kism ki asangati jo mushkil-se-dobara-paida-hone-laayak "works on my machine" bugs paida karti hai.',
      },
      {
        q: 'Why is "npm ci" recommended over plain "npm install" for CI pipelines and production deployments specifically?',
        qHi: '"npm ci" khaas taur par CI pipelines aur production deployments ke liye saadhe "npm install" par kyun sujhaaya jaata hai?',
        a: '"npm install" is designed for flexibility, suited to the iterative, exploratory nature of local development — if package.json\'s version ranges have drifted from what package-lock.json currently records (for instance, a teammate manually edited package.json), plain "npm install" will resolve new versions satisfying the updated ranges and update package-lock.json accordingly, silently reconciling the discrepancy. "npm ci" instead reads package-lock.json exclusively and installs precisely the versions it specifies, performing no independent resolution against package.json\'s ranges at all — critically, if package.json and package-lock.json are found to be out of sync, "npm ci" fails immediately with an explicit error rather than silently reconciling them. This stricter behavior is exactly what an automated deployment or CI pipeline should want: a genuine mismatch between the two files usually indicates a real mistake (an edited package.json whose corresponding lock-file update was never committed) that deserves an explicit, visible failure rather than being silently papered over in an unattended, automated context — "npm ci" is also measurably faster than "npm install" specifically because it skips the resolution step entirely, simply installing exactly what is already fully specified.',
        aHi: '"npm install" flexibility ke liye design hua hai, local development ki iterative, khoji fitrat ke liye upyukt — agar \`package.json\` ki version ranges us se drift hui hon jo \`package-lock.json\` abhi record karta hai (misal ke taur par, ek teammate ne haath se \`package.json\` edit kiya), saadha "npm install" updated ranges ko santusht karte naye versions resolve karega aur \`package-lock.json\` ko us hisaab se update karega, bemel ko chupchap reconcile karte hue. "npm ci" iske bajaye akele \`package-lock.json\` padhta hai aur bilkul wahi versions install karta hai jo ye batata hai, \`package.json\` ki ranges ke khilaaf koi alag resolution bilkul nahi karta — sabse zaruri, agar \`package.json\` aur \`package-lock.json\` bemel paaye jaate hain, "npm ci" turant ek explicit error ke saath fail hota hai chupchap unhe reconcile karne ke bajaye. Ye zyada sakht behaviour bilkul wahi hai jo ek automated deployment ya CI pipeline chahegi: do files ke beech ek asli bemel aam taur par ek asli galti darzha karta hai (ek edit hua \`package.json\` jiska barabar lock-file update kabhi commit hi nahi hua) jo ek explicit, dikhti asafalta laayak hai chupchap ek bina-dekhe, automated context mein dabaaye jaane ke bajaye — "npm ci" naapi jaane laayak "npm install" se tez bhi hai khaas taur par isliye kyunki ye resolution step ko poori tarah skip karta hai, bas bilkul wahi install karta hai jo pehle se poori tarah tay hai.',
      },
    ],

    exercises: [
      {
        task: 'Create a tiny Express server and deliberately install express with "npm install --save-dev express". Confirm "node index.js" works locally, then run "npm install --omit=dev" in a fresh clone/copy of the project and confirm the exact error message that appears.',
        taskHi: 'Ek chhota Express server banao aur jaan-boojhkar "npm install --save-dev express" se express install karo. Confirm karo "node index.js" locally kaam karta hai, phir project ke ek taaze clone/copy mein "npm install --omit=dev" chalaao aur confirm karo bilkul kaunsi error message dikhti hai.',
        hint: 'Delete node_modules entirely before running the --omit=dev install, to accurately simulate a genuinely fresh production environment rather than one still holding leftover packages from a previous full install.',
        hintHi: '--omit=dev install chalaane se pehle node_modules poori tarah delete karo, ek sach mein taaze production environment ko sahi tarike se simulate karne ke liye ek aise environment ke bajaye jismein abhi bhi pichli poori install ke bache hue packages hon.',
      },
      {
        task: 'Move express to "dependencies" and confirm the same "npm install --omit=dev" now succeeds and the server starts correctly.',
        taskHi: 'Express ko "dependencies" mein le jaao aur confirm karo wahi "npm install --omit=dev" ab safal hota hai aur server sahi tarike se shuru hota hai.',
        hint: 'Add a genuinely dev-only tool (like nodemon) under devDependencies as well, and confirm it is correctly absent from node_modules after the --omit=dev install, while express is present.',
        hintHi: 'Devdependencies ke tahat ek sach mein dev-only tool bhi jodo (jaise nodemon), aur confirm karo --omit=dev install ke baad ye node_modules se sahi tarike se gair-maujood hai, jabki express maujood hai.',
      },
      {
        task: 'Delete package-lock.json, run npm install, note the exact express version installed. Delete node_modules and package-lock.json again, wait (or simulate by manually editing a version number), run npm install again, and compare whether the resolved version could differ.',
        taskHi: 'package-lock.json delete karo, npm install chalaao, install hua bilkul express version note karo. node_modules aur package-lock.json dobara delete karo, intezaar karo (ya haath se ek version number edit karke simulate karo), npm install dobara chalaao, aur compare karo kya resolve hua version alag ho sakta hai.',
        hint: 'Try running "npm ci" instead on a project with no package-lock.json present at all, and observe that it fails immediately rather than falling back to behaving like npm install.',
        hintHi: 'Ek aise project par "npm ci" chalaane ki koshish karo jahan bilkul koi package-lock.json maujood nahi hai, aur dekho ye turant fail hota hai npm install jaisa behave karne par wapas girne ke bajaye.',
      },
    ],

    keyTakeaways: [
      '"dependencies" lists packages the running application genuinely needs at runtime; "devDependencies" lists packages needed only for development or building — a package the app needs to run must go under "dependencies", or a production "--omit=dev" install will not include it.',
      'Plain "npm install" installs both lists together, which is exactly why a devDependencies miscategorization is invisible during normal local development and only surfaces under a production-style install.',
      'Semantic versioning\'s three parts (MAJOR.MINOR.PATCH) signal the size of change from the previous version; "^" (npm\'s default) allows automatic MINOR/PATCH updates but never crosses a MAJOR boundary, trusting semver\'s promise that MINOR/PATCH updates do not break existing code.',
      'package.json\'s version entries are ranges, not exact versions; package-lock.json records the exact version of every package actually resolved across the whole dependency tree, and must be committed to version control for reproducible installs.',
      '"npm ci" is the recommended command for CI pipelines and production deployments — it installs exactly what package-lock.json specifies, fails loudly if package.json and the lock file disagree, and is faster than plain "npm install" since it skips version resolution entirely.',
      'A TypeScript Node.js project\'s "dependencies" list looks identical to a plain JavaScript project\'s; only "devDependencies" changes, gaining typescript, tsx/ts-node, and @types/* packages, none of which are needed once the app is compiled and running.',
    ],
    keyTakeawaysHi: [
      '"dependencies" un packages ko list karta hai jinhe chalti application ko runtime par sach mein chahiye; "devDependencies" un packages ko list karta hai jinhe sirf development ya building ke liye chahiye — jis package ko app ko chalne ke liye chahiye use "dependencies" ke tahat jaana chahiye, nahi to production "--omit=dev" install use shaamil nahi karega.',
      'Saadha "npm install" dono lists ko saath install karta hai, aur bilkul isi wajah se ek devDependencies galat-categorization aam local development ke dauran adrishya hai aur sirf ek production-style install ke tahat saamne aati hai.',
      'Semantic versioning ke teen hisse (MAJOR.MINOR.PATCH) pichle version se badlaav ka size batate hain; "^" (npm ka default) apne aap MINOR/PATCH updates allow karta hai par kabhi ek MAJOR boundary paar nahi karta, semver ke us vaade par bharosa karte hue ki MINOR/PATCH updates maujood code nahi todte.',
      'package.json ki version entries ranges hain, exact versions nahi; package-lock.json poori dependency tree mein har package ka asal mein resolve hua bilkul version record karta hai, aur reproducible installs ke liye version control mein commit hona chahiye.',
      '"npm ci" CI pipelines aur production deployments ke liye sujhaayi hui command hai — ye bilkul wahi install karta hai jo package-lock.json batata hai, agar package.json aur lock file sehmat na hon to zor se fail hota hai, aur saadhe "npm install" se tez hai kyunki ye version resolution poori tarah skip karta hai.',
      'TypeScript Node.js project ki "dependencies" list saadhe JavaScript project jaisi hi dikhti hai; sirf "devDependencies" badalta hai, typescript, tsx/ts-node, aur @types/* packages paate hue, in mein se kisi ko bhi ek baar app compile hokar chalne ke baad zarurat nahi.',
    ],
  },
];
