/**
 * Node.js Complete Course — Module 1: Node.js Fundamentals, lesson 6.
 *
 * npm audit and dependency vulnerability scanning: this course's earlier
 * npm/package.json lesson covered semver ranges and package-lock.json
 * pinning exact versions — this lesson covers a genuinely different
 * question: are any of the dependencies actually installed, at whatever
 * version is pinned, KNOWN to contain a real, publicly disclosed
 * security vulnerability? Broken example: a project that runs npm
 * install regularly and never once checks whether any dependency, direct
 * or deeply transitive, has a known vulnerability — a real, exploitable
 * flaw can sit in production for months, entirely unnoticed, since
 * nothing about a normal install process checks for this at all. Fixed
 * with npm audit, which checks every installed package against a public
 * vulnerability database, reports severity, and is run routinely (ideally
 * as part of this course's earlier CI-hygiene lesson) rather than never
 * or only when someone happens to remember. Also covers recognizing
 * typosquatted package names before installing something unfamiliar.
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

export const NODE_MODULE_1_PART6: CourseLesson[] = [
  {
    slug: 'npm-audit-dependency-security',
    title: 'npm audit and Dependency Vulnerability Scanning',
    titleHi: 'npm audit Aur Dependency Vulnerability Scanning',
    description: 'A project has been running npm install for two years straight without a single check for known vulnerabilities — and buried four levels deep in a transitive dependency nobody has ever looked at is a publicly disclosed, actively exploited security flaw that has been sitting in production the entire time.',
    descriptionHi: 'Ek project do saal se lagaataar \`npm install\` chala raha hai bina ek bhi baar maloom vulnerabilities ke liye check kiye — aur ek transitive dependency ke chaar level neeche dabi hui jise kisi ne kabhi nahi dekha ek saarvajanik roop se disclosed, saqriya taur par exploit ki jaati security khaami hai jo poore samay production mein baithi rahi hai.',
    difficulty: 'EASY',
    duration: 16,
    order: 6,

    analogy: {
      en: '**A restaurant that buys every ingredient purely on price and availability, from whichever supplier happens to be cheapest that week, never once checking any supplier against a public food-safety recall list — versus a restaurant that checks every single ingredient, including ones bought from smaller suppliers several steps removed from the big-name distributor, against that same recall list before it ever reaches a customer\'s plate.** The careless restaurant is not doing anything obviously wrong on any single day — the food generally tastes fine, customers generally do not get sick, and nothing about day-to-day operations makes a contaminated ingredient obviously visible before it is served. The danger is entirely latent: a specific batch of a specific ingredient, from a supplier several steps removed from the well-known brand printed on the box, could have been recalled for contamination weeks ago, and the restaurant would have absolutely no way of knowing, since it never checks. The careful restaurant runs every ingredient it uses, no matter how minor or how many steps removed from a well-known brand, against the same public recall list, specifically because a genuine, serious problem could exist in any single one of them, and the only way to know is to actually check rather than assuming a familiar-sounding supplier name means everything is fine. A Node.js project that installs and updates dependencies regularly but never runs a vulnerability check is the careless restaurant: the application generally works, and nothing about ordinary operation reveals whether one of potentially hundreds of installed packages, many pulled in indirectly as dependencies of dependencies, has a real, publicly disclosed security vulnerability sitting inside it. Running npm audit regularly is the careful restaurant\'s recall check applied to code: checking every single installed package, at whatever depth it was pulled in from, against a real, public, actively maintained database of known vulnerabilities, rather than assuming that because the application runs correctly, everything inside it must be safe.',
      hi: '**Ek restaurant jo har ingredient sirf keemat aur upalabdhta ke aadhaar par khareedta hai, jo bhi supplier us hafte sabse sasta ho usse, kabhi kisi supplier ko ek public food-safety recall list ke khilaaf check kiye bina — versus ek restaurant jo har akele ingredient ko, chhote suppliers se khareede gaye jo bade-naam distributor se kai kadam door hain unhe sameet, us wahi recall list ke khilaaf check karta hai isse pehle ki ye kabhi ek customer ki plate tak pahunche.** Laapervaah restaurant kisi bhi ek din saaf taur par kuch bhi galat nahi kar raha hai — khaana aam taur par sahi lagta hai, customers aam taur par bimaar nahi hote, aur roz-marra ke operations ke baare mein kuch bhi ek contaminated ingredient ko serve hone se pehle saaf taur par dikhta nahi banaata. Khatra poori tarah latent hai: ek khaas ingredient ke ek khaas batch ko, ek supplier se jo box par chhape jaane-pehchaane brand se kai kadam door hai, kuch hafte pehle contamination ke liye recall kiya gaya ho sakta hai, aur restaurant ko iske baare mein bilkul koi jaankaari nahi hogi, kyunki ye kabhi check hi nahi karta. Savdhaan restaurant har us ingredient ko chalaata hai jo ye istemal karta hai, chahe ye kitna bhi mamuli ho ya ek jaane-pehchaane brand se kitne bhi kadam door ho, usi public recall list ke khilaaf, khaas taur par isliye kyunki ek asli, gambhir samasya inmein se kisi ek mein maujood ho sakti hai, aur jaanne ka ekmatra tarika asal mein check karna hai ek jaana-pehchaana-dikhta supplier naam sab kuch theek hai maan lene ke bajaye. Ek Node.js project jo niyamit roop se dependencies install aur update karta hai par kabhi ek vulnerability check nahi chalaata laapervaah restaurant hai: application aam taur par kaam karta hai, aur aam operation ke baare mein kuch bhi zaahir nahi karta ki sambhaavit roop se sainkadon installed packages mein se ek, kai indirectly dependencies ki dependencies ki tarah khinche gaye, ek asli, saarvajanik roop se disclosed security vulnerability apne andar rakhte hue baitha hai. Niyamit roop se \`npm audit\` chalaana savdhaan restaurant ke recall check ko code par lagu karna hai: har akele installed package ko, jitni bhi gehraai se ye khincha gaya ho, ek asli, public, saqriya-roop-se-maintain-ki-jaati maloom vulnerabilities ki database ke khilaaf check karna, ye maan lene ke bajaye ki kyunki application sahi tarike se chalta hai, iske andar sab kuch surakshit hona chahiye.',
    },

    simple: `**Start broken.** Dependencies installed and updated for years, never once checked for known vulnerabilities:

\`\`\`bash
npm install express
npm install some-image-processing-library
# ...two years pass, dozens of dependencies added over time...
npm install another-utility-package
\`\`\`

Every one of these installs works exactly as intended — the packages install correctly, the application runs, features get built and shipped. Nothing about a normal \`npm install\` checks whether any of these packages, or any of the dozens of OTHER packages pulled in indirectly as their own dependencies, has ever had a security vulnerability publicly disclosed against it. A real, serious vulnerability — one that could allow an attacker to execute arbitrary code, read files it should never have access to, or bypass authentication entirely — can exist in a small, deeply nested transitive dependency that nobody on the team has ever directly interacted with or even knows exists, and it can sit there, unnoticed, for months or years, since nothing in the ordinary development workflow ever surfaces it.

**The fix: npm audit checks every installed package against a public vulnerability database**

\`\`\`bash
npm audit
\`\`\`

\`\`\`
# 3 vulnerabilities (1 moderate, 2 high)

high            Prototype Pollution
Package         lodash
Dependency of   some-image-processing-library
Path            some-image-processing-library > lodash
More info       https://github.com/advisories/GHSA-xxxx-xxxx-xxxx

Run \`npm audit fix\` to fix 2 of 3 vulnerabilities
\`\`\`

\`npm audit\` reads the exact, resolved dependency tree recorded in \`package-lock.json\` (this course's earlier lesson) and checks every single package in it — direct dependencies and every transitive one, no matter how deeply nested — against a public, actively maintained database of known security vulnerabilities. The output above shows a real, high-severity vulnerability in \`lodash\`, a package the project never installed directly at all; it was pulled in as a dependency of \`some-image-processing-library\`, entirely invisible to anyone who only ever looks at their own \`package.json\`. Running \`npm audit\` regularly — and ideally as an automated step in CI, following this course\'s earlier lesson on CI hygiene, rather than something a person has to remember to run manually — turns "there might be a known vulnerability somewhere in this dependency tree" from an invisible, unmonitored risk into a specific, actionable report naming the exact package, the exact severity, and the exact chain of dependencies that pulled it in.`,

    simpleHi: `**Toote hue se shuru.** Dependencies saalon se install aur update ki jaati hain, kabhi ek baar bhi maloom vulnerabilities ke liye check nahi ki gayin:

\`\`\`bash
npm install express
npm install some-image-processing-library
# ...do saal guzarte hain, waqt ke saath dazanon dependencies jodi jaati hain...
npm install another-utility-package
\`\`\`

In installs mein se har ek bilkul iraade ke hisaab se kaam karta hai — packages sahi tarike se install hote hain, application chalta hai, features banaaye aur ship kiye jaate hain. Ek normal \`npm install\` ke baare mein kuch bhi check nahi karta ki inmein se koi bhi package, ya doosre dazanon packages mein se koi jo unki apni dependencies ki tarah indirectly khinche gaye hain, kabhi unke khilaaf koi security vulnerability saarvajanik roop se disclosed hui hai. Ek asli, gambhir vulnerability — ek jo ek attacker ko manmaana code chalaane, aisi files padhne jinhe iski kabhi access nahi honi chahiye, ya authentication ko poori tarah bypass karne de sakti hai — ek chhoti, gehraai se nested transitive dependency mein maujood ho sakti hai jise team mein kisi ne kabhi seedhe istemal nahi kiya ya jiske maujood hone ka bhi pata nahi hai, aur ye wahin baithi rah sakti hai, na-dhyaan-mein-aayi, mahinon ya saalon tak, kyunki aam development workflow mein kuch bhi ise kabhi zaahir nahi karta.

**Fix: \`npm audit\` har installed package ko ek public vulnerability database ke khilaaf check karta hai**

\`\`\`bash
npm audit
\`\`\`

\`\`\`
# 3 vulnerabilities (1 moderate, 2 high)

high            Prototype Pollution
Package         lodash
Dependency of   some-image-processing-library
Path            some-image-processing-library > lodash
More info       https://github.com/advisories/GHSA-xxxx-xxxx-xxxx

Run \`npm audit fix\` to fix 2 of 3 vulnerabilities
\`\`\`

\`npm audit\` \`package-lock.json\` (is course ka pehle wala lesson) mein record ki gayi bilkul, resolve ki gayi dependency tree padhta hai aur usmein har akele package ko — direct dependencies aur har transitive wali, chahe kitni bhi gehraai se nested ho — ek public, saqriya-roop-se-maintain-ki-jaati maloom security vulnerabilities ki database ke khilaaf check karta hai. Oopar wala output \`lodash\` mein ek asli, high-severity vulnerability dikhaata hai, ek package jise project ne kabhi seedhe install hi nahi kiya; ye \`some-image-processing-library\` ki ek dependency ki tarah khincha gaya, us kisi ke liye bhi poori tarah na-dikhta jo sirf apni khud ki \`package.json\` dekhta hai. Niyamit roop se \`npm audit\` chalaana — aur aadarsh roop se CI mein ek automated step ki tarah, is course ke pehle wale CI hygiene lesson ka palan karte hue, kisi ke ise manually chalaana yaad rakhne ke bajaye — "is dependency tree mein kahin ek maloom vulnerability ho sakti hai" ko ek na-dikhte, na-monitor-hue khatre se ek khaas, kaarvaai-laayak report mein badal deta hai jo bilkul package, bilkul severity, aur dependencies ki bilkul chain naam leti hai jo ise andar khinchi.`,

    content: `## Severity levels: not every reported vulnerability demands the same urgency

\`\`\`
critical  — remote code execution, full system compromise
high      — significant data exposure or privilege escalation
moderate  — a real issue, but with limited or conditional impact
low       — minor, often requiring an unusual configuration to matter
\`\`\`

\`npm audit\` reports each vulnerability with a severity level, and treating every single one identically — either ignoring all of them or panicking about all of them — misses the actual point of having severity levels in the first place. A \`critical\` finding in a package actually reachable from real, untrusted user input deserves immediate attention; a \`low\`-severity finding in a package only ever used in an internal build script that never runs in production, or that requires a configuration the project does not actually use, genuinely warrants a different, more measured response. Reading the specific advisory linked in the audit output — what the vulnerability actually allows, and under what conditions — is necessary to judge genuine urgency, rather than reacting to the word "vulnerability" alone without understanding what it actually means for this specific project.

## npm audit fix: automated remediation, and its real limits

\`\`\`bash
npm audit fix          # updates dependencies to non-breaking patched versions where possible
npm audit fix --force  # will also apply major version updates that MAY break the application
\`\`\`

\`npm audit fix\` attempts to automatically update vulnerable packages to a patched version, but only within the bounds of what \`package.json\`\'s existing semver ranges (this course\'s earlier lesson) already allow without a breaking change. Some vulnerabilities can only be fixed by a major version update of the vulnerable package — one that could genuinely introduce breaking API changes — and \`npm audit fix\` will not apply this automatically unless explicitly told to with \`--force\`. Running \`--force\` without understanding what it actually does can silently upgrade a dependency to a version with real breaking changes, potentially breaking the application in ways that are not immediately obvious; it should be used deliberately, followed by actually testing the application, rather than as an automatic, unquestioned response to any audit finding.

## Recognizing a typosquatted package before it is ever installed

\`\`\`bash
npm install expres        # a typo — NOT the real "express" package
npm install reqiure       # a typo — NOT a real package at all, potentially malicious
\`\`\`

A "typosquatted" package is one deliberately published under a name intentionally similar to a popular, legitimate package, specifically hoping a developer will mistype the real name and install the malicious impostor instead. Since npm allows anyone to publish a package under any available name, nothing structurally prevents someone from publishing a package called \`expres\` or \`reqiure\` that looks superficially plausible but is not the real, trusted package a developer intended to install, and such a package could contain genuinely malicious code that runs the instant it is installed. Double-checking a package\'s name carefully before installing something unfamiliar — and being specifically cautious with a package that has very few downloads, an unfamiliar publisher, or was only very recently published, despite claiming to be something well-established — is a simple, low-cost habit that catches this category of attack before it ever has a chance to run.

## A brief note on Software Bills of Materials (SBOMs)

\`\`\`bash
npm sbom --sbom-format=cyclonedx > sbom.json
\`\`\`

For a small project, running \`npm audit\` periodically is generally sufficient. At larger organizational scale, or in regulated industries, teams are often required to produce a formal Software Bill of Materials — a complete, structured inventory of every single dependency (and its exact version) that makes up a piece of software, used for compliance reporting and for rapidly checking exposure the moment a new vulnerability is publicly disclosed somewhere in the ecosystem. An SBOM is, in essence, a more formalized, exhaustively documented version of the same underlying question \`npm audit\` already answers on a smaller scale: knowing precisely what is actually inside the software being shipped.`,

    contentHi: `## Severity levels: har report hui vulnerability ko wahi zaruriyat nahi maangti

\`\`\`
critical  — remote code execution, poora system compromise
high      — maayne-rakhta data exposure ya privilege escalation
moderate  — ek asli issue, par seemit ya shart-adheen asar ke saath
low       — mamuli, aksar maayne rakhne ke liye ek ajeeb configuration maangta hai
\`\`\`

\`npm audit\` har vulnerability ko ek severity level ke saath report karta hai, aur har akeli ko identical taur par treat karna — ya to sab ko nazarandaaz karna ya sab ke baare mein ghabraana — severity levels rakhne ka asli point hi miss karta hai. Ek \`critical\` khoj ek aise package mein jo asal mein asli, na-bharosemand user input se pahunch-laayak hai turant dhyaan ki haqdaar hai; ek \`low\`-severity khoj ek aise package mein jo sirf ek internal build script mein istemal hota hai jo kabhi production mein nahi chalta, ya jise ek configuration chahiye jo project asal mein istemal nahi karta, sach mein ek alag, zyaada samajhdaar jawaab ki maang karta hai. Audit output mein linked khaas advisory padhna — vulnerability asal mein kya karne deti hai, aur kaunsi sthitiyon mein — asli zaruriyat judge karne ke liye zaruri hai, sirf "vulnerability" shabd par react karne ke bajaye bina ye samjhe ki iska is khaas project ke liye asal mein kya matlab hai.

## \`npm audit fix\`: automated remediation, aur iski asli seemayein

\`\`\`bash
npm audit fix          # jahan mumkin ho non-breaking patched versions mein dependencies update karta hai
npm audit fix --force  # major version updates bhi lagu karega jo application ko TOD sakte hain
\`\`\`

\`npm audit fix\` vulnerable packages ko automatically ek patched version mein update karne ki koshish karta hai, par sirf un seemaon ke andar jo \`package.json\` ki maujooda semver ranges (is course ka pehle wala lesson) pehle se bina breaking change ke ijaazat deti hain. Kuch vulnerabilities sirf vulnerable package ke ek major version update se hi theek ki jaa sakti hain — ek jo sach mein breaking API changes introduce kar sakta hai — aur \`npm audit fix\` ise automatically lagu nahi karega jab tak \`--force\` ke saath explicitly na kaha jaaye. \`--force\` chalaana ye samjhe bina ki ye asal mein kya karta hai chupke se ek dependency ko asli breaking changes wale version mein upgrade kar sakta hai, sambhaavit roop se application ko un tareekon se tod sakta hai jo turant saaf nahi hote; ise jaan-boojhkar istemal karna chahiye, uske baad asal mein application ko test karte hue, kisi bhi audit khoj ke liye ek automatic, bina-sawaal jawaab ke bajaye.

## Ek typosquatted package ko install hone se pehle pehchaanna

\`\`\`bash
npm install expres        # ek typo — asli "express" package NAHI hai
npm install reqiure       # ek typo — asal mein koi asli package hi nahi, sambhaavit roop se malicious
\`\`\`

Ek "typosquatted" package ek aisa hai jo jaan-boojhkar ek popular, vaidh package se jaan-boojhkar milta-julta naam ke saath publish kiya jaata hai, khaas taur par umeed karte hue ki ek developer asli naam mein typo kare aur iske bajaye malicious impostor install kar le. Kyunki npm kisi ko bhi kisi bhi upalabdh naam ke neeche ek package publish karne deta hai, kuch bhi structurally kisi ko \`expres\` ya \`reqiure\` naam ka ek package publish karne se nahi rokta jo saatahi taur par vishwasaniya dikhta hai par asli, bharosemand package nahi hai jise ek developer install karne ka iraada rakhta tha, aur aisa package sach mein malicious code rakh sakta hai jo install hote hi chalta hai. Kisi na-jaani-pehchaani cheez ko install karne se pehle package ke naam ko dhyaan se dobara check karna — aur khaas taur par ek aise package se savdhaan rehna jiske paas bahut kam downloads hain, ek na-jaana-pehchaana publisher hai, ya sirf bahut haal hi mein publish hua hai, chahe ye kuch achhi-tarah-sthaapit hone ka daava kare — ek saadha, kam-keemat wala habit hai jo is category ke attack ko iske kabhi chalne ka mauka milne se pehle pakad leta hai.

## Software Bills of Materials (SBOMs) par ek chhota note

\`\`\`bash
npm sbom --sbom-format=cyclonedx > sbom.json
\`\`\`

Ek chhote project ke liye, samay-samay par \`npm audit\` chalaana aam taur par kaafi hai. Bade organizational scale par, ya regulated industries mein, teams ko aksar ek formal Software Bill of Materials banaane ki zaroorat hoti hai — har akeli dependency (aur uske bilkul version) ki ek poori, structured inventory jo software ke ek tukde ko banaati hai, compliance reporting ke liye aur jis pal ecosystem mein kahin ek nayi vulnerability saarvajanik roop se disclose hoti hai use jaldi check karne ke liye istemal hoti hai. Ek SBOM, mool roop mein, bilkul usi underlying sawaal ka ek zyaada formalized, vistrit roop se documented version hai jise \`npm audit\` pehle se ek chhote scale par jawaab deta hai: bilkul jaanna ki ship ki jaa rahi software ke andar asal mein kya hai.`,

    examples: [
      {
        title: 'Broken: dependencies installed for years, never once scanned',
        titleHi: 'Toota: dependencies saalon se installed, kabhi ek baar bhi scan nahi hui',
        code: `npm install express
npm install some-image-processing-library
// two years of installs, never once checked for known vulnerabilities`,
        codeJs: `// package.json grows over time, purely through npm install
{
  "dependencies": {
    "express": "^4.18.0",
    "some-image-processing-library": "^2.1.0"
  }
}
// nobody has ever run a vulnerability check against this tree`,
        codeTs: `// Identical package.json — vulnerability exposure has nothing to do
// with whether the project itself is written in JavaScript or TypeScript,
// since it concerns the dependency tree, not the application's own code.`,
        output: `The application runs correctly. A real, high-severity vulnerability
in a deeply transitive dependency has been present in production for
months, entirely unnoticed by anyone on the team.`,
        explain: 'Nothing about a normal install-and-run workflow ever checks whether an installed package has a publicly known security vulnerability.',
        explainHi: 'Ek aam install-aur-chalao workflow ke baare mein kuch bhi kabhi check nahi karta ki ek installed package mein koi saarvajanik roop se maloom security vulnerability hai.',
      },
      {
        title: 'Fixed: npm audit surfaces the exact vulnerability and its source',
        titleHi: 'Theek: \`npm audit\` bilkul vulnerability aur uska source zaahir karta hai',
        code: `npm audit
// high  Prototype Pollution  lodash  (via some-image-processing-library)`,
        codeJs: `// Run regularly, ideally in CI (this course's earlier CI-hygiene lesson)
npm audit

// Output identifies the exact package, severity, and dependency chain:
// high            Prototype Pollution
// Package         lodash
// Dependency of   some-image-processing-library
// Path            some-image-processing-library > lodash`,
        codeTs: `// Identical command and output — npm audit operates on package-lock.json's
// resolved dependency tree, independent of the project's own language.`,
        outputJs: `The vulnerability, previously invisible, is now a specific, actionable
finding: which package, how severe, and exactly which direct dependency
pulled it in — enough information to actually investigate and fix it.`,
        outputTs: `// Identical behaviour. Running this in CI on every pull request
// catches a newly disclosed vulnerability automatically, without
// anyone needing to remember to run it manually.`,
        explain: 'npm audit checks the exact resolved dependency tree against a public vulnerability database, naming the specific package and chain of dependencies rather than leaving the risk invisible.',
        explainHi: '\`npm audit\` bilkul resolve hui dependency tree ko ek public vulnerability database ke khilaaf check karta hai, khaas package aur dependencies ki chain naam leta hai khatre ko na-dikhta chhodne ke bajaye.',
      },
      {
        title: 'Reviewing a fix before blindly forcing a major version update',
        titleHi: 'Ek fix ko jaanchna andhaadhund ek major version update force karne se pehle',
        code: `npm audit fix           # applies safe, non-breaking patches
npm audit fix --force   # may apply breaking major version updates — review first`,
        codeJs: `npm audit
// suppose the only fix requires some-image-processing-library@5.0.0,
// a major version bump from the currently installed 2.1.0

npm audit fix --force
// applies it — now test the application before trusting it blindly
npm test`,
        codeTs: `// Identical workflow. After a forced major-version update, re-running
// the TypeScript compiler and the test suite is what actually confirms
// nothing broke — the audit tool itself cannot know that.
npx tsc --noEmit
npm test`,
        outputJs: `The vulnerability is patched, but the major version bump could have
changed the library's API — running the test suite afterward is what
actually confirms the application still behaves correctly.`,
        outputTs: `// Identical behaviour. --force is a deliberate trade-off (accepting
// a real risk of a breaking change) made specifically to close a
// known vulnerability, not a default response to every audit finding.`,
        explain: 'A forced major-version update can fix the vulnerability while silently introducing a breaking API change — testing afterward, not blind trust, is what confirms the fix was actually safe.',
        explainHi: 'Ek forced major-version update vulnerability theek kar sakta hai jabki chupke se ek breaking API change introduce karte hue — baad mein testing, andha bharosa nahi, wo hai jo confirm karta hai ki fix asal mein surakshit tha.',
      },
    ],

    mistakes: [
      {
        wrong: `// Installing and updating dependencies for years, never once running a vulnerability check
npm install some-new-package`,
        right: `npm install some-new-package
npm audit  // run regularly, ideally as part of CI`,
        why: 'A normal install-and-run workflow never checks for known vulnerabilities on its own — a real, serious flaw can sit unnoticed in a deeply transitive dependency indefinitely.',
        whyHi: 'Ek aam install-aur-chalao workflow apne aap kabhi maloom vulnerabilities ke liye check nahi karta — ek asli, gambhir khaami ek gehraai se transitive dependency mein hamesha ke liye na-dhyaan-mein-aayi baithi rah sakti hai.',
      },
      {
        wrong: `npm audit fix --force  // applied immediately, without reading what actually changed
// the application breaks in production because a major version bump changed the API`,
        right: `npm audit fix --force
npm test  // confirm nothing broke before trusting the fix`,
        why: 'Running --force without reviewing what it actually changed can silently introduce breaking API changes that only surface later, in production, rather than being caught immediately.',
        whyHi: '\`--force\` chalaana ye jaanche bina ki ye asal mein kya badalta hai chupke se breaking API changes introduce kar sakta hai jo sirf baad mein, production mein, zaahir hote hain, turant pakde jaane ke bajaye.',
      },
      {
        wrong: `npm install expres  // a typo, installing an unfamiliar, unverified package without a second look`,
        right: `npm install express  // double-check the exact name before installing anything unfamiliar`,
        why: 'A typosquatted package deliberately relies on exactly this kind of unchecked, hurried install to get malicious code executed on a developer\'s machine or in production.',
        whyHi: 'Ek typosquatted package jaan-boojhkar bilkul isi tarah ki na-check-ki-gayi, jaldbaazi mein install par nirbhar rehta hai ek developer ki machine par ya production mein malicious code chalwaane ke liye.',
      },
    ],

    realWorld: [
      {
        en: '**npm audit is a built-in, standard feature of npm itself, checking against the npm public advisory database maintained specifically for this purpose** — no separate tool or paid service is required to get started.',
        hi: '**\`npm audit\` npm ki apni khud ki ek built-in, standard feature hai, npm ki public advisory database ke khilaaf check karte hue jo khaas taur par isi maqsad ke liye maintain ki jaati hai** — shuru karne ke liye koi alag tool ya paid service ki zaroorat nahi.',
      },
      {
        en: '**Running a dependency vulnerability scan automatically in CI, on every pull request, is a widely recommended standard practice**, catching newly disclosed vulnerabilities in already-installed dependencies without anyone needing to remember to check manually.',
        hi: '**CI mein automatically ek dependency vulnerability scan chalaana, har pull request par, ek vyaapak roop se recommend ki jaane waali standard practice hai**, pehle-se-installed dependencies mein naye disclose hue vulnerabilities ko pakadte hue kisi ke manually check karna yaad rakhne ki zaroorat bina.',
      },
      {
        en: '**Typosquatting attacks against popular npm package names are a commonly documented, real attack vector**, with security researchers and npm itself periodically identifying and removing malicious packages published under deliberately similar-looking names.',
        hi: '**Popular npm package names ke khilaaf typosquatting attacks ek aam taur par documented, asli attack vector hain**, security researchers aur khud npm samay-samay par jaan-boojhkar milte-julte naamon ke neeche publish kiye gaye malicious packages ko pehchaante aur hataate hain.',
      },
    ],

    interviewQA: [
      {
        q: 'Why can a real, serious security vulnerability sit unnoticed in a production application for months, even at a team that regularly installs and updates its dependencies?',
        qHi: 'Ek asli, gambhir security vulnerability ek production application mein mahinon tak na-dhyaan-mein-aayi kyun baith sakti hai, chahe ek team niyamit roop se apni dependencies install aur update karti ho?',
        a: 'Regularly installing and updating dependencies is a genuinely different activity from checking whether any of those dependencies has a known security vulnerability, and a team can be diligent about the first without ever performing the second at all. Running npm install or npm update focuses entirely on resolving version ranges and fetching packages according to what package.json and semver rules allow — it does not, on its own, cross-reference any installed package against a database of known vulnerabilities, since that is simply not what those commands are designed to do. This means a team can be genuinely conscientious about keeping dependencies reasonably current, and the application can run correctly, pass every test, and satisfy every user-facing requirement, while a specific installed package (very often a small, transitive dependency several layers removed from anything the team directly chose to install) has a real, publicly disclosed vulnerability that nobody has ever specifically checked for, since normal development and testing activity has no natural reason to surface it. A vulnerability like this does not typically announce itself through any visible symptom — the application does not crash, tests do not fail, and nothing about ordinary usage reveals that a specific function deep in the dependency tree could be exploited under conditions an attacker specifically knows how to trigger. The vulnerability remains invisible for exactly as long as nobody runs a tool specifically designed to check for it, which is precisely the gap a dedicated vulnerability scan like npm audit closes — it performs the one specific check that ordinary development activity never performs on its own.',
        aHi: 'Niyamit roop se dependencies install aur update karna ye check karne se ek sach mein alag activity hai ki kya inmein se koi dependency mein koi maloom security vulnerability hai, aur ek team pehli ke prati mehanti ho sakti hai bina kabhi doosri ko bilkul poora kiye. \`npm install\` ya \`npm update\` chalaana poori tarah version ranges resolve karne aur \`package.json\` aur semver rules jo ijaazat dete hain unke hisaab se packages fetch karne par kendrit hota hai — ye, khud se, kisi bhi installed package ko maloom vulnerabilities ki ek database ke khilaaf cross-reference nahi karta, kyunki wo commands bas isi ke liye design nahi kiye gaye. Iska matlab hai ek team sach mein dependencies ko samajhdaari se current rakhne ke prati savdhaan ho sakti hai, aur application sahi tarike se chal sakta hai, har test pass kar sakta hai, aur har user-facing zaroorat poori kar sakta hai, jabki ek khaas installed package (aksar ek chhoti, transitive dependency jo team ne seedhe install karne ka chunaav kiya us se kai layers door) ek asli, saarvajanik roop se disclosed vulnerability rakhti hai jise kisi ne kabhi khaas taur par check nahi kiya, kyunki normal development aur testing activity ke paas ise zaahir karne ka koi prakritik kaaran nahi hai. Aisi ek vulnerability aam taur par kisi bhi dikhte lakshan se apne aap ko ghoshit nahi karti — application crash nahi hota, tests fail nahi hote, aur aam istemal ke baare mein kuch bhi ye zaahir nahi karta ki dependency tree mein gehraai mein ek khaas function ek attacker jo khaas taur par jaanta hai kaise trigger karna hai un sthitiyon mein exploit kiya jaa sakta hai. Vulnerability tab tak na-dikhti rehti hai jab tak koi bhi khaas taur par ise check karne ke liye design kiya gaya tool nahi chalaata, jo bilkul wahi gap hai jise \`npm audit\` jaisa ek dedicated vulnerability scan band karta hai — ye wo ek khaas check karta hai jo aam development activity kabhi khud se nahi karti.',
      },
      {
        q: 'Why does npm audit report vulnerabilities with different severity levels, and why is treating every finding with identical urgency a mistake?',
        qHi: '\`npm audit\` vulnerabilities ko alag severity levels ke saath kyun report karta hai, aur har khoj ko identical zaruriyat ke saath treat karna ek galti kyun hai?',
        a: 'Vulnerabilities genuinely differ enormously in how much actual harm they could cause and how easily an attacker could actually exploit them in a real application\'s specific context, and severity levels exist specifically to communicate that genuine difference rather than treating every disclosed issue as equally urgent. A critical-severity finding typically indicates something like remote code execution — an attacker being able to run arbitrary code on the server, a catastrophic outcome by any measure — while a low-severity finding often describes a real but narrow issue that only matters under a specific, sometimes unusual configuration the project may not even actually use, or that requires conditions difficult for a realistic attacker to actually create. Treating every single finding as equally urgent, regardless of this genuine difference, leads to one of two equally poor outcomes: either a team becomes overwhelmed trying to immediately address every low-priority finding with the same urgency as a genuine critical one, burning significant engineering time on issues posing little real risk, or, more dangerously, a team becomes desensitized to audit output entirely after repeatedly seeing many low-severity, low-relevance findings, and starts ignoring the report altogether, including the rare but genuinely critical finding that actually does demand immediate attention. The correct response is to actually read the specific advisory linked for each finding, understand what the vulnerability genuinely allows an attacker to do and under what conditions, and judge urgency based on that actual understanding combined with how the vulnerable package is actually used in this specific project — a critical vulnerability in a package handling real user input demands immediate attention, while a low-severity finding in a package only used in an internal, never-deployed build script may reasonably be deprioritized, and severity levels exist precisely to help make that judgment efficiently rather than requiring equally deep investigation into every single reported issue.',
        aHi: 'Vulnerabilities sach mein bahut zyaada alag hoti hain ismein ki wo kitna asli nuksaan cause kar sakti hain aur ek attacker unhe ek asli application ke khaas context mein kitni aasaani se asal mein exploit kar sakta hai, aur severity levels khaas taur par us asli antar ko sanchaarit karne ke liye maujood hain har disclosed issue ko samaan roop se zaruri maanne ke bajaye. Ek critical-severity khoj aam taur par kuch aisa darsati hai jaise remote code execution — ek attacker server par manmaana code chalaane mein saksham hona, kisi bhi maapak se ek vinaashkaari natija — jabki ek low-severity khoj aksar ek asli par sankuchit issue varnan karti hai jo sirf ek khaas, kabhi-kabhi ajeeb configuration ke neeche maayne rakhti hai jo project asal mein istemal bhi nahi karta, ya jise sthitiyaan chahiye jo ek wastavik attacker ke liye asal mein banaana mushkil hai. Har akeli khoj ko is asli antar se bekhabar samaan roop se zaruri maanna do samaan roop se kamzor natijon mein se ek ki taraf le jaata hai: ya to ek team har low-priority khoj ko ek asli critical wali ke bilkul samaan zaruriyat se turant sambodhit karne ki koshish karte hue overwhelmed ho jaati hai, thoda asli khatra paida karti samasyaon par maayne-rakhta engineering waqt jalate hue, ya, zyaada khatarnaak, ek team baar-baar kai low-severity, low-relevance khojein dekhne ke baad audit output ke prati poori tarah desensitized ho jaati hai, aur report ko poori tarah nazarandaaz karna shuru kar deti hai, us durlabh par sach mein critical khoj sameet jo asal mein turant dhyaan maangti hai. Sahi jawaab asal mein har khoj ke liye linked khaas advisory padhna hai, samajhna ki vulnerability sach mein ek attacker ko kya karne deti hai aur kaunsi sthitiyon mein, aur us asli samajh ke aadhaar par zaruriyat judge karna hai is baat ke saath milaakar ki vulnerable package is khaas project mein asal mein kaise istemal hota hai — asli user input sambhaalti ek package mein ek critical vulnerability turant dhyaan maangti hai, jabki ek internal, kabhi-deploy-na-hui build script mein istemal hoti package mein ek low-severity khoj samajhdaari se deprioritize ki jaa sakti hai, aur severity levels bilkul isliye maujood hain taaki ye faisla kushaltapoorvak karne mein madad milе har akeli report ki gayi issue mein samaan roop se gehri jaanch ki maang karne ke bajaye.',
      },
      {
        q: 'What genuinely distinguishes a typosquatted package from a real one, and why does this attack rely specifically on a developer not carefully checking a package name before installing it?',
        qHi: 'Ek typosquatted package ko ek asli se asal mein kya alag karta hai, aur ye attack khaas taur par ek developer ke ek package naam ko install karne se pehle savdhaani se check na karne par kyun nirbhar karta hai?',
        a: 'A typosquatted package is, in a technical sense, a completely ordinary, valid npm package — it can be published, installed, and run exactly like any other package, since npm\'s registry places no restriction preventing someone from choosing a package name that closely resembles an existing, popular one. The entire attack depends on a form of social engineering directed at the moment of installation itself, rather than on any technical flaw in npm\'s systems: an attacker deliberately chooses a name differing from a genuinely popular package by a small, easy-to-overlook typo (a single missing or transposed letter, a common misspelling), specifically betting that some meaningful fraction of developers, typing quickly or working from memory rather than carefully verifying the exact name, will type the malicious name by mistake while intending to install the real one. Because the malicious package is a real, functioning npm package rather than a broken or obviously suspicious one, it can install successfully and its code can execute immediately, potentially including genuinely malicious behavior (exfiltrating environment variables or credentials, installing a backdoor) with nothing about the installation process itself raising any red flag distinguishing it from an ordinary, legitimate install. This is precisely why the attack relies specifically on a developer not carefully checking the exact package name before installing something unfamiliar: the defense is not a technical control npm enforces automatically, but a simple habit of deliberately verifying an unfamiliar package\'s exact name, download count, and publisher before installing it, treating any package that looks almost, but not quite, like a well-known name with the same caution a careful person would apply to an unfamiliar link claiming to be from a bank\'s real website.',
        aHi: 'Ek typosquatted package, ek technical maayne mein, ek poori tarah saadhaaran, vaidh npm package hai — ise publish, install, aur bilkul kisi bhi doosre package ki tarah chalaaya jaa sakta hai, kyunki npm ki registry koi seemaa nahi rakhti jo kisi ko ek aisa package naam chunne se roke jo ek maujooda, popular naam se kaafi milta-julta ho. Poora attack khud installation ke pal par nirdesit ek tarah ke social engineering par nirbhar hai, npm ke systems mein kisi technical khaami par nahi: ek attacker jaan-boojhkar ek naam chunta hai jo ek sach mein popular package se ek chhote, aasaani-se-nazarandaaz-ho-jaane-laayak typo se alag hai (ek akela gayab ya badla hua letter, ek aam galat spelling), khaas taur par daanv lagaate hue ki developers ka koi maayne-rakhta hissa, jaldi type karte hue ya yaad se kaam karte hue bilkul naam savdhaani se verify karne ke bajaye, galti se malicious naam type karega asli install karne ka iraada rakhte hue. Kyunki malicious package ek asli, kaam karta npm package hai ek toota ya saaf taur par sandigdh nahi, ye safaltapoorvak install ho sakta hai aur iska code turant chal sakta hai, sambhaavit roop se sach mein malicious vyavhaar sameet (environment variables ya credentials exfiltrate karna, ek backdoor install karna) installation process ke baare mein kuch bhi koi red flag uthaaye bina jo ise ek aam, vaidh install se alag karti ho. Bilkul isi wajah se attack khaas taur par ek developer ke kisi na-jaani-pehchaani cheez ko install karne se pehle bilkul package naam savdhaani se check na karne par nirbhar karta hai: defense koi technical control nahi hai jise npm automatically lagu karta hai, balki ek na-jaani-pehchaani package ke bilkul naam, download count, aur publisher ko install karne se pehle jaan-boojhkar verify karne ki ek saadhi aadat hai, kisi bhi package ko jo lagbhag, par bilkul nahi, ek jaane-pehchaane naam jaisa dikhta hai us savdhaani ke saath treat karte hue jo ek savdhaan vyakti ek bank ki asli website se hone ka daava karti na-jaani-pehchaani link ke saath lagaayega.',
      },
    ],

    exercises: [
      {
        task: 'Install a slightly older version of a well-known package with a documented historical vulnerability (check the npm advisory database for a real example) in a scratch project, and run npm audit to confirm it correctly identifies the issue.',
        taskHi: 'Ek scratch project mein ek achhi tarah-jaani-pehchaani package ka thoda purana version install karo jiski ek documented historical vulnerability hai (ek asli misal ke liye npm advisory database check karo), aur \`npm audit\` chalaao ye confirm karne ke liye ki ye sahi tarike se issue pehchaanta hai.',
        hint: 'The npm advisory database (or the GitHub Advisory Database) lists real, historical CVEs with the exact affected version ranges you can intentionally install for this exercise.',
        hintHi: 'npm advisory database (ya GitHub Advisory Database) asli, historical CVEs list karti hai bilkul asar hui version ranges ke saath jinhe tum is exercise ke liye jaan-boojhkar install kar sakte ho.',
      },
      {
        task: 'Run npm audit fix on the same project, and confirm whether it resolves the vulnerability using a non-breaking patch or requires --force for a major version update. If --force is needed, run the project\'s test suite afterward to confirm nothing broke.',
        taskHi: 'Usi project par \`npm audit fix\` chalaao, aur confirm karo ki kya ye vulnerability ek non-breaking patch se resolve karta hai ya ek major version update ke liye \`--force\` maangta hai. Agar \`--force\` chahiye, baad mein project ka test suite chalaao ye confirm karne ke liye ki kuch nahi toota.',
        hint: 'Compare the package version before and after running npm audit fix to see exactly what changed.',
        hintHi: '\`npm audit fix\` chalaane se pehle aur baad mein package version compare karo ye dekhne ke liye ki bilkul kya badla.',
      },
      {
        task: 'Add npm audit as a step in a CI pipeline (following this course\'s earlier CI-hygiene lesson), configured to fail the build on any high or critical severity finding. Confirm it correctly fails when a vulnerable dependency is deliberately introduced.',
        taskHi: 'Ek CI pipeline mein \`npm audit\` ko ek step ki tarah jodo (is course ke pehle wale CI hygiene lesson ka palan karte hue), kisi bhi high ya critical severity khoj par build fail karne ke liye configure kiya hua. Confirm karo ki ye sahi tarike se fail hota hai jab ek vulnerable dependency jaan-boojhkar introduce ki jaati hai.',
        hint: 'npm audit exits with a non-zero status code when vulnerabilities matching the configured severity threshold are found — that exit code is what a CI step checks to decide pass or fail.',
        hintHi: '\`npm audit\` ek non-zero status code ke saath exit hota hai jab configure ki gayi severity threshold se milti vulnerabilities milti hain — wo exit code hai jise ek CI step check karta hai pass ya fail faisla karne ke liye.',
      },
    ],

    keyTakeaways: [
      'A normal npm install/update workflow never checks whether an installed package has a known security vulnerability — that is a genuinely separate question requiring a dedicated check.',
      'npm audit checks the exact resolved dependency tree in package-lock.json against a public vulnerability database, including deeply transitive dependencies nobody directly chose to install.',
      'Severity levels (critical, high, moderate, low) exist to distinguish genuine, urgent risk from a narrow, low-relevance finding — treating every finding identically wastes attention or breeds dismissal of the report.',
      'npm audit fix applies only non-breaking patches by default; --force may apply breaking major version updates and should be followed by actually testing the application, not blind trust.',
      'A typosquatted package is a real, functioning npm package published under a name deliberately similar to a popular one, relying specifically on a hurried, unchecked install to run malicious code.',
      'Running a vulnerability scan automatically in CI, rather than relying on someone remembering to run it manually, is what actually catches a newly disclosed vulnerability in an already-installed dependency.',
    ],
    keyTakeawaysHi: [
      'Ek aam \`npm install\`/update workflow kabhi check nahi karta ki ek installed package mein koi maloom security vulnerability hai — ye ek sach mein alag sawaal hai jise ek dedicated check chahiye.',
      '\`npm audit\` \`package-lock.json\` mein bilkul resolve hui dependency tree ko ek public vulnerability database ke khilaaf check karta hai, gehraai se transitive dependencies sameet jinhe kisi ne seedhe install karne ka chunaav nahi kiya.',
      'Severity levels (critical, high, moderate, low) asli, zaruri khatre ko ek sankuchit, low-relevance khoj se alag karne ke liye maujood hain — har khoj ko identical treat karna dhyaan barbaad karta hai ya report ko khaarij karna paida karta hai.',
      '\`npm audit fix\` by default sirf non-breaking patches lagu karta hai; \`--force\` breaking major version updates lagu kar sakta hai aur iske baad asal mein application ko test karna chahiye, andha bharosa nahi.',
      'Ek typosquatted package ek asli, kaam karta npm package hai jo ek popular package se jaan-boojhkar milte-julte naam ke neeche publish kiya jaata hai, khaas taur par ek jaldbaazi, na-check-ki-gayi install par nirbhar karte hue malicious code chalaane ke liye.',
      'CI mein automatically ek vulnerability scan chalaana, kisi ke manually chalaana yaad rakhne par bharosa karne ke bajaye, wo hai jo asal mein ek pehle-se-installed dependency mein ek naye disclose hue vulnerability ko pakadta hai.',
    ],
  },
];
