/**
 * Node.js Complete Course — Module 7: Scaling & Production Operations,
 * lesson 16.
 *
 * Monorepo and large-team CI hygiene: the practical, day-one-on-a-real-team
 * tooling that keeps a large, multi-contributor Node.js codebase healthy —
 * pre-commit hooks (husky + lint-staged) catching problems on a
 * developer's own machine before they are ever committed, CODEOWNERS
 * routing review to the people who actually understand a given part of
 * the codebase, branch protection rules preventing an unreviewed or
 * failing change from reaching the main branch, and running CI checks
 * only against what actually changed rather than the entire repository
 * every single time. Broken example: a team with no pre-commit hooks, no
 * CODEOWNERS, and no branch protection — broken code reaches the main
 * branch regularly, reviews go to whoever happens to click first
 * regardless of expertise, and every CI run re-lints and re-tests the
 * entire monorepo even for a one-line change. Fixed by layering these
 * four specific, standard mechanisms together.
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

export const NODE_MODULE_7_PART16: CourseLesson[] = [
  {
    slug: 'monorepo-and-large-team-ci-hygiene',
    title: 'Monorepo and Large-Team CI Hygiene',
    titleHi: 'Monorepo Aur Large-Team CI Hygiene',
    description: 'A new hire\'s very first pull request sits unreviewed for three days because nobody knew it touched the payments code, gets approved by someone unfamiliar with it, and breaks production — a day-one surprise that has nothing to do with their coding ability.',
    descriptionHi: 'Ek naye hire ki bilkul pehli pull request teen din tak unreviewed baithi rehti hai kyunki kisi ko pata hi nahi tha ki ye payments code ko chhoo rahi hai, kisi aise dwara approve ho jaati hai jo usse anjaan hai, aur production tod deti hai — ek pehle-din ka surprise jiska unki coding ability se koi lena-dena nahi.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 16,

    analogy: {
      en: '**A car factory assembly line where every workstation has its own inspector checking only that station\'s specific part before it moves on, and a car is never allowed to roll off the line until every relevant department has signed off — versus a factory where anyone can walk up and bolt any part onto any car, with no inspection until a customer discovers a problem after driving it home.** At the well-run factory, the moment a worker attaches a component, a station-specific check immediately verifies it meets spec — a loose bolt or a wrong part is caught and fixed right there, before the car ever moves to the next station, let alone leaves the building. Certain critical systems — the brakes, the electrical wiring — are additionally never signed off by just any available inspector; a specific, designated specialist for that exact system reviews it, because a general inspector glancing at brake components without the relevant expertise might easily miss a defect that specialist would catch immediately. And no car reaches the loading dock at all until every required department has actually signed off — this is not a suggestion any single line worker can bypass by feeling confident about their own work; the line itself is physically gated on those signatures existing. A factory with none of this — no station checks, no specialist sign-off, no gate before shipping — might still produce SOME cars that happen to work, but defects reach customers regularly, and there is no consistent, structural reason to expect otherwise. A codebase with pre-commit hooks (station-specific checks), CODEOWNERS (specialist sign-off for sensitive areas), and branch protection (the gate before shipping) is the well-run factory; a codebase with none of these is gambling that everyone happens to be careful enough, every single time, which large teams over long periods of time simply cannot rely on.',
      hi: '**Ek car factory ki assembly line jahan har workstation ka apna inspector hai jo sirf us station ke khaas hisse ko check karta hai aage badhne se pehle, aur ek car kabhi line se utarne ki ijaazat nahi paati jab tak har mutaalliq department ne sign off na kiya ho — versus ek factory jahan koi bhi chalkar aa sakta hai aur kisi bhi car mein koi bhi part bolt kar sakta hai, koi inspection bina jab tak ek customer ise ghar chalaane ke baad ek samasya na khoje.** Achhi tarah chalti factory mein, jis pal ek worker ek component attach karta hai, ek station-khaas check turant verify karta hai ki ye spec poora karta hai — ek dheela bolt ya ek galat part wahin pakda aur theek kiya jaata hai, car agle station tak jaane se pehle, building chhodna to door ki baat hai. Kuch critical systems — brakes, electrical wiring — ko bhi kabhi kisi bhi upalabdh inspector dwara sign off nahi kiya jaata; us bilkul system ke liye ek khaas, designated specialist ise review karta hai, kyunki ek general inspector jo brake components ko mutaalliq expertise bina dekhta hai shaayad ek khaami miss kar sakta hai jise wo specialist turant pakad lega. Aur koi bhi car loading dock tak bilkul nahi pahunchti jab tak har zaruri department ne asal mein sign off na kiya ho — ye koi sujhaav nahi hai jise koi bhi akela line worker apne kaam par bharosa mehsoos karke bypass kar sake; line khud un signatures ke maujood hone par physically gated hai. Ek factory jismein inmein se kuch bhi nahi hai — koi station checks nahi, koi specialist sign-off nahi, shipping se pehle koi gate nahi — shaayad phir bhi KUCH cars banaaye jo kaam karti hain, par khaamiyaan niyamit roop se customers tak pahunchti hain, aur iske alawa umeed karne ka koi consistent, structural kaaran nahi hai. Pre-commit hooks (station-khaas checks), CODEOWNERS (sanvedansheel ilaakon ke liye specialist sign-off), aur branch protection (shipping se pehle ka gate) wali ek codebase achhi tarah chalti factory hai; inmein se kuch bhi na hone wali ek codebase jua khel rahi hai ki har koi har baar kaafi savdhaan hoga, jispar badi teams lambe samay tak bharosa nahi kar sakti.',
    },

    simple: `**Start broken.** No pre-commit checks, no ownership routing, no gate before merging:

\`\`\`bash
git add .
git commit -m "quick fix"
git push origin main   # nobody reviewed it, nothing was linted, tests never ran
\`\`\`

With nothing in place, a developer can commit code with linting errors, failing tests, or an accidentally-included \`console.log\` and \`console.log("DEBUG")\`, and push it straight to the shared branch with no automated check catching any of it beforehand. Even where pull requests are used, without any concept of ownership, a pull request touching the payments module might get reviewed — and approved — by someone who has never worked on payments and has no way to catch a subtle correctness issue only someone familiar with that code would recognize. And even with reviews happening, if nothing technically prevents a change from being merged before CI finishes running or before review is complete, a well-intentioned developer under deadline pressure can simply merge anyway, and often does, given the chance.

**The fix: pre-commit hooks, CODEOWNERS, and branch protection, layered together**

\`\`\`json
// package.json
{
  "scripts": { "prepare": "husky install" },
  "lint-staged": {
    "*.{js,ts}": ["eslint --fix", "prettier --write"]
  }
}
\`\`\`

\`\`\`bash
# .husky/pre-commit
npx lint-staged
\`\`\`

\`\`\`
# .github/CODEOWNERS
/src/payments/  @payments-team
/src/auth/      @security-team
*               @backend-leads
\`\`\`

\`husky\` runs \`lint-staged\` automatically on every \`git commit\`, checking only the files actually being committed — a linting error or formatting issue is caught and often auto-fixed on the developer\'s own machine, before it is ever committed, let alone pushed. \`CODEOWNERS\` tells the platform (GitHub, GitLab) which team or individual is automatically requested as a reviewer for a given path — a pull request touching \`src/payments/\` automatically routes to \`@payments-team\`, rather than depending on whoever happens to notice the pull request first. Branch protection rules, configured directly on the repository, then make both of these matter structurally rather than by convention: they can require CI to pass and require an approval from a CODEOWNER before the "merge" button is even enabled, so a change genuinely cannot reach the main branch without both conditions being satisfied — not because anyone remembered to check, but because the platform itself will not allow it otherwise.`,

    simpleHi: `**Toote hue se shuru.** Koi pre-commit checks nahi, koi ownership routing nahi, merge hone se pehle koi gate nahi:

\`\`\`bash
git add .
git commit -m "quick fix"
git push origin main   # kisi ne review nahi kiya, kuch lint nahi hua, tests kabhi chale hi nahi
\`\`\`

Kuch bhi jagah na hone par, ek developer linting errors, fail hoti tests, ya galti se shaamil ek \`console.log("DEBUG")\` ke saath code commit kar sakta hai, aur ise seedhe shared branch par push kar sakta hai koi automated check pehle se kuch bhi pakde bina. Pull requests istemal hone par bhi, ownership ki koi dhaarna bina, payments module ko chhooti ek pull request kisi aise dwara review — aur approve — ho sakti hai jisne kabhi payments par kaam nahi kiya aur ek sookshm correctness issue pakadne ka koi tarika nahi rakhta jise sirf us code se parichit koi hi pehchaanega. Aur reviews ho rahe hone par bhi, agar kuch bhi technically ek badlaav ko CI poora chalne se pehle ya review poora hone se pehle merge hone se nahi rokta, ek nek-niyat developer deadline ke dabaav mein bas phir bhi merge kar sakta hai, aur aksar karta hai, mauka milne par.

**Fix: pre-commit hooks, CODEOWNERS, aur branch protection, ek saath layered**

\`\`\`json
// package.json
{
  "scripts": { "prepare": "husky install" },
  "lint-staged": {
    "*.{js,ts}": ["eslint --fix", "prettier --write"]
  }
}
\`\`\`

\`\`\`bash
# .husky/pre-commit
npx lint-staged
\`\`\`

\`\`\`
# .github/CODEOWNERS
/src/payments/  @payments-team
/src/auth/      @security-team
*               @backend-leads
\`\`\`

\`husky\` har \`git commit\` par automatically \`lint-staged\` chalaata hai, sirf un files ko check karte hue jo asal mein commit ho rahi hain — ek linting error ya formatting issue pakda jaata hai aur aksar auto-fix ho jaata hai developer ki apni machine par, ise kabhi commit hone se pehle, push hona to door ki baat hai. \`CODEOWNERS\` platform (GitHub, GitLab) ko batata hai ki kaunsi team ya vyakti ek diye path ke liye automatically reviewer ki tarah request kiya jaata hai — \`src/payments/\` ko chhooti ek pull request automatically \`@payments-team\` ko route hoti hai, jo bhi pehle pull request notice kare uspar nirbhar hone ke bajaye. Branch protection rules, jo seedhe repository par configure ki jaati hain, phir in dono ko convention ke bajaye structurally maayne-rakhta banaati hain: wo maang sakti hain ki CI poora ho aur ek CODEOWNER se ek approval mile "merge" button enable hone se pehle bhi, taaki ek badlaav sach mein main branch tak bina dono sthitiyon ke poora hue nahi pahunch sakta — is liye nahi ki kisi ne check karna yaad rakha, balki isliye kyunki platform khud iske alaawa ijaazat nahi deta.`,

    content: `## Pre-commit hooks: catching problems on the developer's own machine, before a commit even exists

\`\`\`bash
# .husky/pre-commit
npx lint-staged
\`\`\`

\`\`\`json
// package.json
"lint-staged": {
  "*.{js,ts}": ["eslint --fix", "prettier --write"],
  "*.{json,md}": ["prettier --write"]
}
\`\`\`

\`husky\` installs a Git hook that runs automatically at specific points in a developer\'s local workflow — most commonly \`pre-commit\`, right before a commit is finalized. Paired with \`lint-staged\`, which runs a given command only against the files actually staged for that commit (not the entire repository), this means every commit is automatically linted and formatted on the developer\'s own machine, with many issues auto-fixed silently before the commit is even created. This is deliberately the earliest possible point to catch a problem — before it is committed, before it is pushed, before a reviewer or CI ever needs to spend time on it — turning "please remember to lint your code" from a matter of individual discipline into something that happens automatically for every single commit, from every single developer, with no exceptions.

## CODEOWNERS: routing review to the people who actually understand a given area

\`\`\`
# .github/CODEOWNERS
/src/payments/     @payments-team
/src/auth/         @security-team
/src/orders/       @commerce-team
*                  @backend-leads
\`\`\`

A \`CODEOWNERS\` file, read directly by GitHub, GitLab, and similar platforms, maps specific paths in the repository to the team or individuals who are automatically requested as reviewers whenever a pull request touches that path — a change inside \`src/payments/\` automatically notifies \`@payments-team\`, without anyone needing to remember to manually add the right reviewer. This solves a genuine large-team problem: in a monorepo touched by many engineers across many domains, no single reviewer can realistically be expected to have deep, current knowledge of every part of the codebase, and leaving reviewer selection to chance means sensitive or subtle areas (payments, authentication) are sometimes reviewed by someone without the context to catch a real problem. \`CODEOWNERS\` can also be combined with a branch protection rule specifically requiring at least one approval from a listed code owner — not just any reviewer — for paths that genuinely warrant it.

## Branch protection: making both of the above matter structurally, not just by convention

\`\`\`
GitHub branch protection settings for "main":
☑ Require a pull request before merging
☑ Require approvals from CODEOWNERS
☑ Require status checks to pass before merging (lint, test, build)
☑ Do not allow bypassing the above settings
\`\`\`

Pre-commit hooks and \`CODEOWNERS\` both describe what SHOULD happen — but without branch protection rules configured directly on the repository, nothing actually stops a determined or rushed developer from bypassing either one: pre-commit hooks can be skipped with \`git commit --no-verify\`, and a reviewer other than the code owner can simply approve anyway if nothing prevents it. Branch protection closes this gap by making these requirements a platform-enforced gate rather than a convention: requiring CI\'s automated checks to pass, requiring an actual approval from a listed code owner, and disabling any option to bypass these requirements even for repository administrators, means a change genuinely cannot reach the main branch without satisfying every configured condition — not because everyone involved happened to follow the rules that day, but because the platform itself will not permit otherwise.

## Running CI against only what changed, not the entire monorepo every time

\`\`\`bash
# Instead of running every test in the repository on every single change:
npm test

# Run tests only for packages actually affected by this change
# (using a tool like Nx or Turborepo's dependency graph):
npx nx affected --target=test
npx turbo run test --filter="...[origin/main]"
\`\`\`

In a monorepo containing many independent packages or services, running the ENTIRE test suite and lint pass on every single pull request, regardless of how small or isolated the actual change is, becomes slower and more expensive as the monorepo grows — a one-line fix to a single small package waits on tests for dozens of entirely unrelated packages that could not possibly have been affected. Monorepo tools like Nx and Turborepo build a dependency graph of which packages depend on which others, and can run lint/test/build commands only against the packages actually affected by a given change (and anything that depends on them) — dramatically reducing CI time for the common case of a small, localized change, while still running the full suite for a change that genuinely affects a foundational, widely-depended-upon package.`,

    contentHi: `## Pre-commit hooks: samasyaon ko developer ki apni machine par pakadna, commit banne se pehle hi

\`\`\`bash
# .husky/pre-commit
npx lint-staged
\`\`\`

\`\`\`json
// package.json
"lint-staged": {
  "*.{js,ts}": ["eslint --fix", "prettier --write"],
  "*.{json,md}": ["prettier --write"]
}
\`\`\`

\`husky\` ek Git hook install karta hai jo developer ke local workflow mein khaas points par automatically chalta hai — sabse aam \`pre-commit\`, ek commit finalize hone se bilkul pehle. \`lint-staged\` ke saath jodkar, jo ek diya command sirf un files ke khilaaf chalaata hai jo us commit ke liye asal mein staged hain (poori repository nahi), iska matlab hai har commit developer ki apni machine par automatically lint aur format hota hai, kai issues commit banne se pehle hi chupke se auto-fix ho jaate hain. Ye jaan-boojhkar ek samasya pakadne ka sabse jaldi mumkin point hai — commit hone se pehle, push hone se pehle, ek reviewer ya CI ko kabhi uspar samay kharch karne se pehle, "kripya apna code lint karna yaad rakho" ko akele anushaasan ki baat se aisi cheez mein badalte hue jo har akele commit ke liye, har akele developer se, koi apvaad bina automatically hota hai.

## CODEOWNERS: review ko un logon ke paas route karna jo asal mein ek diye ilaake ko samajhte hain

\`\`\`
# .github/CODEOWNERS
/src/payments/     @payments-team
/src/auth/         @security-team
/src/orders/       @commerce-team
*                  @backend-leads
\`\`\`

Ek \`CODEOWNERS\` file, jise GitHub, GitLab, aur isi tarah ke platforms seedhe padhte hain, repository mein khaas paths ko un team ya vyaktiyon se maps karta hai jinhe automatically reviewer ki tarah request kiya jaata hai jab bhi ek pull request us path ko chhooti hai — \`src/payments/\` ke andar ek badlaav automatically \`@payments-team\` ko notify karta hai, kisi ke sahi reviewer haath se jodna yaad rakhne ki zaroorat bina. Ye ek asli badi-team samasya sulajhaata hai: ek monorepo mein jise kai engineers kai domains ke aar-paar chhoote hain, koi akela reviewer waastavik roop se poori codebase ke har hisse ki gehri, haal ki jaankaari rakhta hone ki umeed nahi ki jaa sakti, aur reviewer chunaav ko mauke par chhodna matlab hai sanvedansheel ya sookshm ilaake (payments, authentication) kabhi-kabhi kisi aise dwara review hote hain jiske paas ek asli samasya pakadne ka context nahi hota. \`CODEOWNERS\` ko ek branch protection rule ke saath bhi jodaa jaa sakta hai jo khaas taur par un paths ke liye listed code owner se kam-se-kam ek approval maangta hai — sirf kisi bhi reviewer se nahi — jo sach mein iski maang karte hain.

## Branch protection: dono ke oopar ko structurally maayne-rakhta banaana, sirf convention se nahi

\`\`\`
"main" ke liye GitHub branch protection settings:
☑ Merge hone se pehle ek pull request maango
☑ CODEOWNERS se approvals maango
☑ Merge hone se pehle status checks pass hone maango (lint, test, build)
☑ Oopar ki settings bypass karne ki ijaazat mat do
\`\`\`

Pre-commit hooks aur \`CODEOWNERS\` dono darsate hain ki kya hona CHAHIYE — par repository par seedhe configure ki gayi branch protection rules bina, kuch bhi asal mein ek tay-shuda ya jaldi mein developer ko dono mein se kisi ko bhi bypass karne se nahi rokta: pre-commit hooks ko \`git commit --no-verify\` se skip kiya jaa sakta hai, aur code owner ke alaawa ek reviewer bas phir bhi approve kar sakta hai agar kuch bhi na roke. Branch protection is gap ko band karta hai in maangon ko ek convention ke bajaye ek platform-lagu-kiya-gaya gate banaate hue: CI ke automated checks ke pass hone ki maang karna, ek listed code owner se ek asli approval ki maang karna, aur repository administrators ke liye bhi in maangon ko bypass karne ke kisi vikalp ko band karna, matlab hai ek badlaav sach mein main branch tak har configure ki gayi sthiti poori kiye bina nahi pahunch sakta — is liye nahi ki us din shaamil har koi rules palan karna hua, balki isliye kyunki platform khud iske alaawa ijaazat nahi deta.

## CI ko sirf jo badla hai uske khilaaf chalaana, har baar poore monorepo ke khilaaf nahi

\`\`\`bash
# Har akeli pull request par poore repository ka poora test suite
# aur lint pass chalaane ke bajaye, asli badlaav chahe kitna bhi
# chhota ya alag-thalag ho:
npm test

# Sirf un packages ke liye tests chalaao jo is badlaav se asal mein
# affected hain (Nx ya Turborepo ke dependency graph jaisi tool
# istemal karte hue):
npx nx affected --target=test
npx turbo run test --filter="...[origin/main]"
\`\`\`

Ek monorepo mein jismein kai swatantra packages ya services hain, har akeli pull request par POORA test suite aur lint pass chalaana, asli badlaav chahe kitna bhi chhota ya alag-thalag ho, monorepo badhne ke saath dheema aur zyaada mehanga ho jaata hai — ek akele chhote package mein ek ek-line ka fix dazanon poori tarah na-jude packages ke liye tests ka intezaar karta hai jo asar mein hue hi nahi ho sakte the. Nx aur Turborepo jaise monorepo tools kaunse packages kaunse doosron par nirbhar hain iska ek dependency graph banaate hain, aur lint/test/build commands sirf un packages ke khilaaf chala sakte hain jo ek diye badlaav se asal mein affected hain (aur jo bhi unpar nirbhar hai) — chhote, sthaaniya badlaav ke aam case ke liye CI time ko naatakiya taur par kam karte hue, jabki ek aise badlaav ke liye poora suite phir bhi chalaate hue jo asal mein ek buniyaadi, vyaapak-roop-se-nirbhar-kiya-gaya package ko asar karta hai.`,

    examples: [
      {
        title: 'Broken: no pre-commit hook — a lint error and a stray console.log reach main',
        titleHi: 'Toota: koi pre-commit hook nahi — ek lint error aur ek bhatka \`console.log\` main tak pahunchte hain',
        code: `git add .
git commit -m "fix bug"
git push origin main
// nothing ran eslint, nothing ran prettier, nothing ran the test suite`,
        codeJs: `// src/orders/service.js
function calculateTotal(items) {
  console.log("DEBUG", items); // accidentally left in, nobody caught it
  var total = 0                 // var instead of const/let, inconsistent style
  for (let i=0;i<items.length;i++) { total += items[i].price }
  return total
}`,
        codeTs: `// src/orders/service.ts
function calculateTotal(items: Item[]): number {
  console.log("DEBUG", items); // same issue, TypeScript doesn't catch stray console.log either
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}
// Correctly typed, completely valid TypeScript — the gap is process,
// not the type system.`,
        output: `Merges straight to main with a debug log statement and inconsistent
formatting shipped to production, since nothing automated ever ran
before the push.`,
        explain: 'With no pre-commit hook, nothing on the developer\'s own machine catches an accidental console.log or a formatting inconsistency before it is committed and pushed.',
        explainHi: 'Koi pre-commit hook na hone par, developer ki apni machine par kuch bhi ek galti se reh gaye \`console.log\` ya ek formatting asangati ko commit aur push hone se pehle nahi pakadta.',
      },
      {
        title: 'Fixed: husky + lint-staged catch it before the commit is even created',
        titleHi: 'Theek: \`husky\` + \`lint-staged\` ise commit banne se pehle hi pakadte hain',
        code: `// .husky/pre-commit
npx lint-staged

// package.json
"lint-staged": { "*.{js,ts}": ["eslint --fix", "prettier --write"] }`,
        codeJs: `// package.json
{
  "scripts": { "prepare": "husky install" },
  "lint-staged": {
    "*.{js,ts}": ["eslint --fix", "prettier --write"]
  },
  "devDependencies": {
    "husky": "^9.0.0",
    "lint-staged": "^15.0.0"
  }
}

// .husky/pre-commit
#!/usr/bin/env sh
npx lint-staged`,
        codeTs: `// Identical setup — husky and lint-staged operate on file paths and
// staged git content, not on JS vs TS syntax, so the configuration
// is the same regardless of the project's language.
// .eslintrc additionally enables TS-aware rules for .ts files:
{
  "overrides": [
    { "files": ["*.ts"], "parser": "@typescript-eslint/parser" }
  ]
}`,
        outputJs: `git commit now automatically runs eslint --fix and prettier --write
on only the staged files. The stray console.log triggers an ESLint
warning/error and the commit is blocked until it's addressed.`,
        outputTs: `// Identical behaviour for a TypeScript project — the console.log
// and formatting issues are caught the same way, before the commit
// exists, regardless of file extension.`,
        explain: 'lint-staged runs only against the specific files staged for this commit, catching and often auto-fixing issues in seconds, on the developer\'s own machine, before anything is even committed.',
        explainHi: 'lint-staged sirf un khaas files ke khilaaf chalta hai jo is commit ke liye staged hain, seconds mein issues pakadte aur aksar auto-fix karte hue, developer ki apni machine par, kuch bhi commit hone se pehle hi.',
      },
      {
        title: 'CODEOWNERS routes review automatically, branch protection enforces it',
        titleHi: 'CODEOWNERS review ko automatically route karta hai, branch protection ise lagu karta hai',
        code: `# .github/CODEOWNERS
/src/payments/  @payments-team
*               @backend-leads

# Branch protection: require CODEOWNERS approval + passing CI`,
        codeJs: `# .github/CODEOWNERS
/src/payments/     @payments-team
/src/auth/         @security-team
/src/orders/       @commerce-team
*                  @backend-leads

# A pull request touching src/payments/checkout.js automatically
# requests review from @payments-team — no manual reviewer selection needed`,
        codeTs: `# .github/CODEOWNERS — identical file, path-based, not language-specific
/src/payments/     @payments-team
/src/auth/         @security-team
/src/orders/       @commerce-team
*                  @backend-leads

# Works identically whether src/payments/ contains .js or .ts files,
# since CODEOWNERS matches on file paths, not language`,
        outputJs: `A pull request touching src/payments/checkout.js is automatically
assigned to @payments-team as required reviewers. Branch protection
blocks merging until they approve AND CI passes.`,
        outputTs: `// Identical behaviour. CODEOWNERS and branch protection operate
// entirely at the repository/platform level, independent of
// whether the code inside is JavaScript or TypeScript.`,
        explain: 'CODEOWNERS ensures the right expertise reviews sensitive code automatically; branch protection ensures that requirement (and a passing CI run) cannot be skipped under deadline pressure.',
        explainHi: 'CODEOWNERS sunishchit karta hai ki sahi expertise sanvedansheel code ko automatically review karti hai; branch protection sunishchit karta hai ki us maang (aur ek pass hoti CI run) ko deadline ke dabaav mein skip nahi kiya jaa sakta.',
      },
    ],

    mistakes: [
      {
        wrong: `// .husky/pre-commit exists, but a developer runs:
git commit --no-verify -m "skip the hooks, I'm in a hurry"`,
        right: `// Branch protection requiring CI to pass on the platform side means
// even a --no-verify local commit still can't be merged without
// passing the same checks in CI`,
        why: 'A pre-commit hook alone can always be bypassed locally — it needs a corresponding, platform-enforced check (CI + branch protection) that cannot be skipped by any individual developer\'s choice.',
        whyHi: 'Akela pre-commit hook hamesha locally bypass kiya jaa sakta hai — ise ek mutaalliq, platform-lagu-kiya-gaya check chahiye (CI + branch protection) jise kisi bhi akele developer ki marzi se skip nahi kiya jaa sakta.',
      },
      {
        wrong: `# .github/CODEOWNERS
*  @everyone-on-the-team
// every path routes to the same huge group, defeating the purpose of ownership`,
        right: `# .github/CODEOWNERS
/src/payments/  @payments-team
/src/auth/      @security-team
*               @backend-leads
// specific, sensitive areas route to the people who actually know them`,
        why: 'A CODEOWNERS file that routes everything to one large, undifferentiated group provides no real improvement over having no ownership at all — the whole point is directing review to genuinely relevant expertise.',
        whyHi: 'Ek CODEOWNERS file jo sab kuch ek bade, na-alag-kiye-gaye group ko route karti hai koi bhi asli sudhaar nahi deti bilkul koi ownership na hone se — poora maqsad hi hai review ko asal mein mutaalliq expertise ki taraf le jaana.',
      },
      {
        wrong: `// Monorepo CI running the entire test suite on every PR
npm test  // 45 minutes, even for a one-line change to one small package`,
        right: `// Run only tests for packages actually affected by this change
npx nx affected --target=test
// A one-line change to an isolated package now takes seconds, not 45 minutes`,
        why: 'Running the full test suite regardless of what actually changed wastes enormous CI time in a large monorepo and discourages small, frequent, easy-to-review pull requests in favor of large, infrequent ones.',
        whyHi: 'Asal mein kya badla us se bekhabar poora test suite chalaana ek badi monorepo mein bahut zyaada CI time barbaad karta hai aur chhoti, baar-baar, aasaan-review-laayak pull requests ko hatotsahit karta hai badi, kam-baar wali ke favour mein.',
      },
    ],

    realWorld: [
      {
        en: '**husky and lint-staged are among the most widely adopted Node.js tooling packages specifically for enforcing pre-commit checks**, used across a huge share of real production JavaScript and TypeScript repositories regardless of company size.',
        hi: '**husky aur lint-staged pre-commit checks lagu karne ke liye khaas taur par sabse zyaada vyaapak roop se apnaaye jaane waale Node.js tooling packages mein se hain**, company size se bekhabar asli production JavaScript aur TypeScript repositories ke ek bade hisse mein istemal hote hain.',
      },
      {
        en: '**GitHub\'s and GitLab\'s native CODEOWNERS support and branch protection rules are standard, first-class platform features specifically designed for exactly this large-team review-routing and merge-gating problem**, not a third-party add-on.',
        hi: '**GitHub aur GitLab ka native CODEOWNERS support aur branch protection rules standard, first-class platform features hain jo khaas taur par bilkul isi badi-team review-routing aur merge-gating samasya ke liye design ki gayi hain**, koi third-party add-on nahi.',
      },
      {
        en: '**Nx and Turborepo\'s "affected" commands, which run checks only against changed packages and their dependents, are a widely cited standard technique for keeping monorepo CI fast** as the number of packages in a repository grows into the dozens or hundreds.',
        hi: '**Nx aur Turborepo ke "affected" commands, jo sirf badle hue packages aur unke dependents ke khilaaf checks chalaate hain, monorepo CI ko tez rakhne ke liye ek vyaapak roop se cite ki jaane waali standard technique hain** jaise-jaise repository mein packages ki tadaad dazanon ya sainkadon tak badhti hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is a pre-commit hook alone, without a corresponding CI check, not a complete solution for enforcing code quality?',
        qHi: 'Ek mutaalliq CI check ke bina, akela pre-commit hook code quality lagu karne ka poora hal kyun nahi hai?',
        a: 'A pre-commit hook runs entirely on an individual developer\'s own local machine, as part of their local Git workflow, at the moment they create a commit — and critically, anything that runs purely on a local machine, under the developer\'s own control, can always be bypassed by that same developer if they choose to. Git provides an explicit, built-in flag (--no-verify) specifically to skip pre-commit and other local hooks, and even without that flag, a developer could simply uninstall or disable husky locally, or work around it in other ways, since nothing about a local hook is enforced by any authority outside that developer\'s own machine. This means relying solely on a pre-commit hook, with nothing else in place, ultimately still depends on every developer choosing, every single time, not to bypass it — the exact same reliability problem as trusting an unenforced convention, just moved one layer deeper into tooling rather than eliminated. What actually closes this gap is a corresponding check that runs somewhere OUTSIDE any individual developer\'s control — a CI pipeline running on shared infrastructure, combined with a branch protection rule that structurally prevents merging until that CI run passes. Even if a developer bypasses their local pre-commit hook entirely, the same lint and test commands still run in CI once the change is pushed, and branch protection ensures a failing CI run genuinely blocks the merge regardless of what happened locally. The pre-commit hook and the CI check are not redundant; the pre-commit hook exists to give fast, convenient, local feedback so most issues are never even pushed in the first place, while the CI check exists as the actual, unbypassable enforcement mechanism that makes the requirement real rather than aspirational.',
        aHi: 'Ek pre-commit hook poori tarah ek akele developer ki apni local machine par chalta hai, unke local Git workflow ke hisse ki tarah, jis pal wo ek commit banaate hain — aur bahut zaruri, kuch bhi jo shuddh roop se ek local machine par chalta hai, developer ke apne niyantran mein, hamesha us wahi developer dwara bypass kiya jaa sakta hai agar wo chunein. Git ek explicit, built-in flag deta hai (\`--no-verify\`) khaas taur par pre-commit aur doosre local hooks skip karne ke liye, aur us flag ke bina bhi, ek developer bas husky ko locally uninstall ya disable kar sakta hai, ya doosre tareekon se iske aas-paas kaam kar sakta hai, kyunki ek local hook ke baare mein kuch bhi us developer ki apni machine ke baahar kisi authority dwara lagu nahi hai. Iska matlab hai sirf ek pre-commit hook par nirbhar hona, kuch aur jagah bina, aakhirkaar phir bhi is baat par nirbhar hai ki har developer, har baar, ise bypass na karna chune — bilkul wahi bharosemandi samasya ek na-lagu convention par bharosa karne jaisi, bas ek layer gehraai mein tooling mein khisak gayi khatam hone ke bajaye. Jo asal mein is gap ko band karta hai ek mutaalliq check hai jo kisi bhi akele developer ke niyantran ke BAAHAR kahin chalta hai — shared infrastructure par chal rahi ek CI pipeline, ek branch protection rule ke saath milkar jo structurally merge hone se rokti hai jab tak wo CI run pass na ho. Chahe ek developer apna local pre-commit hook poori tarah bypass kar de, wahi lint aur test commands phir bhi CI mein chalte hain ek baar badlaav push hone ke baad, aur branch protection sunishchit karta hai ki ek fail hoti CI run sach mein merge ko rokti hai chahe locally kuch bhi hua ho. Pre-commit hook aur CI check dohraav nahi hain; pre-commit hook tez, suvidhajanak, local feedback dene ke liye maujood hai taaki zyaadatar issues shuru se hi kabhi push hi na hon, jabki CI check asli, bypass-na-kiya-jaa-sakne-waala enforcement mechanism hai jo maang ko asli banaata hai aakaanksha ke bajaye.',
      },
      {
        q: 'Why does a CODEOWNERS file that routes every path to the same large group of reviewers fail to solve the problem it is meant to address?',
        qHi: 'Ek CODEOWNERS file jo har path ko reviewers ke usi bade group mein route karti hai us samasya ko sulajhaane mein kyun fail hoti hai jise sambodhit karne ke liye ye maujood hai?',
        a: 'The genuine problem CODEOWNERS is designed to solve is that, in a large codebase touched by many engineers across many distinct domains, a randomly or arbitrarily selected reviewer often lacks the specific, current context needed to catch a subtle correctness issue in an area they don\'t regularly work in — a change to payment processing logic reviewed by someone who has never worked on payments may look reasonable on the surface while missing a real problem that anyone with payments-specific experience would immediately recognize. The value of CODEOWNERS comes specifically from mapping each meaningfully distinct area of the codebase to the people who actually possess that relevant expertise, so review is directed toward genuine understanding rather than mere availability. A CODEOWNERS configuration that maps every single path in the entire repository to one large, undifferentiated group — the whole engineering team, for instance — does not achieve this at all: it still leaves the actual reviewer for any given pull request effectively arbitrary within that large group, since nothing distinguishes which specific members of that group have relevant expertise in the particular path being changed. A pull request touching payments code still might be reviewed by someone with no payments experience, exactly as it would be with no CODEOWNERS file at all, because the configuration never actually narrowed the reviewing pool down to people with genuinely relevant knowledge for that specific area. The entire benefit of CODEOWNERS depends on drawing distinctions between different paths and mapping each to an appropriately narrow, relevant group — a single blanket rule covering everything provides essentially no improvement over having no ownership mapping in the first place.',
        aHi: 'CODEOWNERS jise sulajhaane ke liye design kiya gaya hai wo asli samasya ye hai ki, ek badi codebase mein jise kai engineers kai alag domains ke aar-paar chhoote hain, ek manmaani taur par chuna gaya reviewer aksar khaas, haal ke context ki kami rakhta hai jo ek aise ilaake mein ek sookshm correctness issue pakadne ke liye chahiye jismein wo niyamit roop se kaam nahi karte — payment processing logic mein ek badlaav jise kisi aise ne review kiya jisne kabhi payments par kaam nahi kiya oopar se samajhdaari-bhara lag sakta hai ek asli samasya miss karte hue jise payments-khaas anubhav wala koi bhi turant pehchaan lega. CODEOWNERS ki keemat khaas taur par codebase ke har maayne-rakhta alag ilaake ko un logon se maps karne se aati hai jinke paas asal mein wo mutaalliq expertise hai, taaki review sirf upalabdhta ke bajaye asli samajh ki taraf nirdesit ho. Ek CODEOWNERS configuration jo poori repository ke har akele path ko ek bade, na-alag-kiye-gaye group mein maps karti hai — misal ke taur par poori engineering team — ise bilkul haasil nahi karti: ye phir bhi kisi bhi diye pull request ke liye asli reviewer ko us bade group ke andar asar mein manmaani chhodti hai, kyunki kuch bhi ye alag nahi karta ki us group ke kaunse khaas members ke paas us khaas path mein mutaalliq expertise hai jo badla jaa raha hai. Payments code ko chhooti ek pull request phir bhi kisi bhi payments anubhav bina kisi dwara review ho sakti hai, bilkul jaise ye bilkul koi CODEOWNERS file na hone par hoti, kyunki configuration ne kabhi asal mein reviewing pool ko us khaas ilaake ke liye sach mein mutaalliq jaankaari wale logon tak sankuchit nahi kiya. CODEOWNERS ka poora fayda alag-alag paths ke beech antar kheenchne aur har ek ko ek upyukt sankuchit, mutaalliq group se map karne par nirbhar hai — sab kuch cover karta ek akela blanket rule shuru mein koi ownership mapping na hone se asar mein koi sudhaar nahi deta.',
      },
      {
        q: 'How do monorepo tools like Nx or Turborepo determine which packages are "affected" by a given change, and why does this matter for CI speed as a monorepo grows?',
        qHi: 'Nx ya Turborepo jaise monorepo tools ek diye badlaav se kaunse packages "affected" hain ye kaise tay karte hain, aur monorepo badhne par ye CI speed ke liye kyun maayne rakhta hai?',
        a: 'Monorepo tools like Nx and Turborepo build an explicit dependency graph of the entire repository by analyzing which packages import from, or otherwise depend on, which other packages — this graph is typically constructed automatically by examining actual import statements and each package\'s declared dependencies, rather than requiring anyone to maintain it by hand. When a given pull request or commit changes files within specific packages, the tool can compare the current state against a base reference (commonly the main branch) to determine exactly which packages had their own files directly modified, and then walk the dependency graph forward from those directly-changed packages to also identify every OTHER package that depends on them, directly or transitively, since a change to a foundational package could in principle affect the behavior of anything built on top of it, even if that dependent package\'s own files were not touched. The full "affected" set is therefore the directly changed packages plus everything that depends on them, and the tool runs lint, test, or build commands only against that specific set, rather than against every single package in the repository regardless of relevance. This matters enormously for CI speed as a monorepo grows because the cost of naively running the entire test suite on every single change scales with the TOTAL size of the monorepo, while the cost of running only the affected subset scales with the size of the actual change and its blast radius — a one-line fix to a small, leaf-level package with no dependents might affect only that one package and take seconds to verify, while the exact same infrastructure correctly still runs the full, extensive test suite when a change genuinely touches a foundational, widely-depended-upon package, since in that case the "affected" set legitimately includes most or all of the repository.',
        aHi: 'Nx aur Turborepo jaise monorepo tools poori repository ka ek explicit dependency graph banaate hain ye vishleshan karke ki kaunse packages kaunse doosre packages se import karte hain, ya unpar aur tarah se nirbhar hain — ye graph aam taur par asli import statements aur har package ki declared dependencies ki jaanch karke automatically banaaya jaata hai, kisi ke ise haath se maintain karne ki zaroorat ke bajaye. Jab ek diya pull request ya commit khaas packages ke andar files badalta hai, tool current sthiti ko ek base reference (aam taur par main branch) se compare kar sakta hai ye tay karne ke liye ki bilkul kaunse packages ki apni files seedhe modify hui theen, aur phir dependency graph ko un seedhe-badle-hue packages se aage chalkar har DOOSRE package ko bhi pehchaanta hai jo unpar nirbhar hai, seedhe ya transitively, kyunki ek buniyaadi package mein ek badlaav siddhaant roop se uske oopar bane kisi bhi cheez ke vyavhaar ko asar kar sakta hai, chahe us nirbhar package ki apni files na chhui gayi hon. Poora "affected" set isliye seedhe badle hue packages plus har wo cheez hai jo unpar nirbhar hai, aur tool lint, test, ya build commands sirf us khaas set ke khilaaf chalaata hai, mutaalliqta se bekhabar poori repository ke har akele package ke khilaaf nahi. Ye monorepo badhne par CI speed ke liye bahut zyaada maayne rakhta hai kyunki har akele badlaav par saadhe taur par poora test suite chalaane ki keemat monorepo ke KUL size ke saath scale karti hai, jabki sirf affected subset chalaane ki keemat asli badlaav aur uske blast radius ke size ke saath scale karti hai — ek chhote, leaf-level package mein koi dependents na rakhne wale mein ek-line ka fix shaayad sirf us ek package ko asar kare aur verify karne mein seconds lein, jabki bilkul wahi infrastructure sahi tarike se poora, vistrit test suite phir bhi chalaata hai jab ek badlaav asal mein ek buniyaadi, vyaapak-roop-se-nirbhar-kiya-gaya package ko chhoota hai, kyunki us case mein "affected" set vaidh roop se zyaadatar ya poori repository shaamil karta hai.',
      },
    ],

    exercises: [
      {
        task: 'Add husky and lint-staged to a small existing project, configuring it to run ESLint and Prettier on staged .js/.ts files. Commit a file with a deliberate lint error and confirm the commit is blocked or auto-fixed.',
        taskHi: 'Ek chhote maujooda project mein \`husky\` aur \`lint-staged\` jodo, ise staged \`.js\`/\`.ts\` files par ESLint aur Prettier chalaane ke liye configure karte hue. Ek jaan-boojhkar lint error wali file commit karo aur confirm karo ki commit block ya auto-fix hoti hai.',
        hint: 'Run npx husky install once to set up the hook, then create .husky/pre-commit with npx lint-staged inside it.',
        hintHi: 'Hook set up karne ke liye ek baar \`npx husky install\` chalaao, phir \`.husky/pre-commit\` banaao uske andar \`npx lint-staged\` ke saath.',
      },
      {
        task: 'Create a CODEOWNERS file for a project with at least two distinct areas (e.g. /src/auth/ and everything else), and verify on a test pull request that the correct reviewers are automatically requested.',
        taskHi: 'Kam-se-kam do alag ilaakon wale (jaise \`/src/auth/\` aur baaki sab kuch) ek project ke liye ek \`CODEOWNERS\` file banaao, aur ek test pull request par verify karo ki sahi reviewers automatically request kiye jaate hain.',
        hint: 'CODEOWNERS must live at .github/CODEOWNERS (or the repo root, or docs/) and reviewers listed must have write access to the repository to actually be requestable.',
        hintHi: '\`CODEOWNERS\` ko \`.github/CODEOWNERS\` (ya repo root, ya \`docs/\`) mein rehna chahiye aur listed reviewers ke paas asal mein request-laayak hone ke liye repository ka write access hona chahiye.',
      },
      {
        task: 'Configure branch protection on main requiring both a passing CI status check and a CODEOWNERS approval before merging. Confirm a pull request cannot be merged until both conditions are satisfied.',
        taskHi: 'Main par branch protection configure karo jo merge hone se pehle ek pass hoti CI status check aur ek CODEOWNERS approval dono maange. Confirm karo ki ek pull request tab tak merge nahi ho sakti jab tak dono sthitiyaan poori na hon.',
        hint: 'Test this by first checking that a failing CI status alone blocks the merge button, then separately confirming a passing CI with no CODEOWNERS approval still blocks it.',
        hintHi: 'Ise pehle check karke test karo ki akeli ek fail hoti CI status merge button ko rokti hai, phir alag se confirm karo ki ek pass hoti CI koi CODEOWNERS approval bina phir bhi ise rokti hai.',
      },
    ],

    keyTakeaways: [
      'husky and lint-staged catch linting and formatting issues on a developer\'s own machine, on only the staged files, before a commit even exists — the fastest, cheapest point to catch a problem.',
      'A pre-commit hook can always be bypassed locally (git commit --no-verify) — it needs a corresponding CI check that runs outside any individual developer\'s control to actually be unbypassable.',
      'CODEOWNERS routes pull request review automatically to the team or individuals who genuinely understand a given path, rather than leaving reviewer selection to whoever happens to notice first.',
      'A CODEOWNERS file that maps everything to one large, undifferentiated group provides no real improvement over having no ownership mapping at all — the value comes from meaningful distinctions between paths.',
      'Branch protection rules make CI checks and CODEOWNERS approval a platform-enforced gate rather than a convention, preventing a merge until both conditions are genuinely satisfied, with no bypass even for administrators.',
      'Tools like Nx and Turborepo run lint/test/build only against packages actually affected by a change (via a dependency graph), keeping CI fast as a monorepo grows into dozens or hundreds of packages.',
    ],
    keyTakeawaysHi: [
      '\`husky\` aur \`lint-staged\` linting aur formatting issues developer ki apni machine par pakadte hain, sirf staged files par, ek commit banne se pehle hi — samasya pakadne ka sabse tez, sabse sasta point.',
      'Ek pre-commit hook hamesha locally bypass kiya jaa sakta hai (\`git commit --no-verify\`) — ise asal mein bypass-na-hone-laayak hone ke liye ek mutaalliq CI check chahiye jo kisi bhi akele developer ke niyantran ke baahar chalta hai.',
      'CODEOWNERS pull request review ko automatically un team ya vyaktiyon ki taraf route karta hai jo asal mein ek diye path ko samajhte hain, reviewer chunaav ko jo bhi pehle notice kare uspar chhodne ke bajaye.',
      'Ek CODEOWNERS file jo sab kuch ek bade, na-alag-kiye-gaye group ko maps karti hai koi bhi asli sudhaar nahi deti bilkul koi ownership mapping na hone se — keemat paths ke beech maayne-rakhta antar se aati hai.',
      'Branch protection rules CI checks aur CODEOWNERS approval ko ek convention ke bajaye ek platform-lagu-kiya-gaya gate banaati hain, ek merge ko rokte hue jab tak dono sthitiyaan sach mein poori na hon, administrators ke liye bhi koi bypass bina.',
      'Nx aur Turborepo jaise tools lint/test/build sirf un packages ke khilaaf chalaate hain jo ek badlaav se asal mein affected hain (ek dependency graph ke zariye), monorepo dazanon ya sainkadon packages tak badhne par CI ko tez rakhte hue.',
    ],
  },
];
