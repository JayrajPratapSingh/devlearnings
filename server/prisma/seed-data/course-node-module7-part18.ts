/**
 * Node.js Complete Course — Module 7: Scaling & Production Operations,
 * lesson 18.
 *
 * Deployment strategies: blue-green and canary releases. This course's
 * earlier lesson on load balancing, health checks, and graceful shutdown
 * covered HOW an individual instance exits cleanly during a routine
 * rolling deploy; this lesson covers a genuinely different question — the
 * overall STRATEGY for shifting traffic from an old version of the entire
 * application to a new one, and how much real production traffic a new
 * version is exposed to before it is fully trusted. Broken example: every
 * instance is simply replaced with the new version, one after another,
 * with no dedicated way to verify the new version under real traffic
 * before it serves everyone, and no fast, reliable way back to the old
 * version if it turns out to be broken. Fixed by two standard, named
 * strategies: blue-green (two complete environments, an instant,
 * reversible traffic switch between them) and canary (gradually shifting
 * a small, increasing percentage of real traffic to the new version,
 * distinct from — and often used alongside — the previous lesson's
 * feature flags).
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

export const NODE_MODULE_7_PART18: CourseLesson[] = [
  {
    slug: 'deployment-strategies-blue-green-canary',
    title: 'Deployment Strategies: Blue-Green and Canary Releases',
    titleHi: 'Deployment Strategies: Blue-Green Aur Canary Releases',
    description: 'A new version of the app replaces every single instance overnight, and by morning every customer is hitting code that was never actually validated under real production traffic — with no fast way back except a fresh deployment of the old version.',
    descriptionHi: 'App ka ek naya version raatorat har akele instance ki jagah le leta hai, aur subah tak har customer aise code ko chhoo raha hai jo asal mein kabhi asli production traffic ke neeche validate nahi hua — koi tezi se wapas jaane ka tarika bina purane version ki ek taazi deployment ke alaawa.',
    difficulty: 'HARD',
    duration: 20,
    order: 18,

    analogy: {
      en: '**A city bringing a brand-new water treatment plant online by first running it fully in parallel with the existing plant, only fully switching the whole city over once it\'s proven itself, and even then, testing it on one neighborhood before the rest — versus a city that shuts down the old plant entirely the moment the new one is built and routes the whole city\'s water through it immediately.** The cautious city keeps its proven, working treatment plant fully operational while the new one is built and independently tested with clean water samples, never letting a single household actually drink from it until it has demonstrated it works correctly on its own — this is the blue-green approach: two complete, independent systems, with the actual switch happening only once, deliberately, and reversible in an instant by simply routing back to the old plant if anything about the new one\'s output looks wrong days later. A more cautious city goes further: rather than switching the entire city over to the new plant all at once even after testing, it first connects only a single neighborhood\'s pipes to the new plant, watches closely for any complaints about water quality from just that one neighborhood, and only once real, sustained confidence builds does it connect more neighborhoods, gradually, until the whole city is on the new plant — this is the canary approach, exposing a genuinely small, real slice of the city to the new plant before the rest. A reckless city that simply shuts the old plant down and switches everyone to the new one immediately has no working fallback at all if something is subtly wrong with the water — every single household is drinking untested water from day one, and going back requires rebuilding what was just torn down. Blue-green and canary deployments apply exactly this same caution to software: keep a fully working old version available, and either switch all at once with an instant way back, or expose real traffic gradually while watching closely, rather than betting the entire user base on a version that has never actually served real traffic before.',
      hi: '**Ek shehar jo ek bilkul-naya water treatment plant online laata hai pehle ise maujooda plant ke saath poori tarah parallel chalaate hue, poore shehar ko sirf tab poori tarah switch karte hue jab ye khud ko saabit kar chuka ho, aur tab bhi, baaki se pehle ek mohalle par test karte hue — versus ek shehar jo naya plant banate hi purane plant ko poori tarah band kar deta hai aur poore shehar ka paani turant uske through route kar deta hai.** Savdhaan shehar apna saabit, kaam karta treatment plant poori tarah chalta rakhta hai jabki naya wala banaya aur akele saaf paani ke samples se test kiya jaata hai, kisi ek ghar ko bhi asal mein isse peene nahi deta jab tak ye saabit na kar de ki ye akele sahi tarike se kaam karta hai — ye blue-green tarika hai: do poore, swatantra systems, asli switch sirf ek baar, jaan-boojhkar, hone ke saath, aur turant reversible agar naye wale ke output ke baare mein kuch din baad galat lage to bas purane plant ki taraf wapas route karke. Ek aur zyaada savdhaan shehar aage jaata hai: poore shehar ko naye plant par ek saath switch karne ke bajaye testing ke baad bhi, ye pehle sirf ek akele mohalle ki pipes ko naye plant se jodta hai, sirf us ek mohalle se paani ki quality ke baare mein kisi bhi shikaayat ke liye dhyaan se dekhta hai, aur sirf ek baar asli, tikaau bharosa banta hai to zyaada mohalle jodta hai, dheere-dheere, jab tak poora shehar naye plant par na aa jaaye — ye canary tarika hai, ek sach mein chhota, asli hissa shehar ka naye plant ko baaki se pehle expose karte hue. Ek laapervaah shehar jo bas purana plant band kar deta hai aur sabko turant naye par switch kar deta hai bilkul koi kaam karta fallback nahi rakhta agar paani ke saath kuch sookshm roop se galat hai — har akela ghar din ek se na-test kiya gaya paani pee raha hai, aur wapas jaane ke liye jo abhi todaa gaya use dobara banaana padta hai. Blue-green aur canary deployments bilkul yahi savdhaani software par lagu karte hain: ek poori tarah kaam karta purana version upalabdh rakho, aur ya to ek saath switch karo ek turant wapas jaane ke tarike ke saath, ya asli traffic ko dheere-dheere expose karo dhyaan se dekhte hue, poore user base ko ek aise version par daanv lagaane ke bajaye jisne asal mein pehle kabhi asli traffic serve nahi ki.',
    },

    simple: `**Start broken.** Every instance replaced with the new version, all at once, with no dedicated verification step:

\`\`\`bash
# Naive "deploy" script
pm2 stop all
git pull
npm install
pm2 start all   # every instance now runs the new, never-battle-tested version
\`\`\`

This course\'s earlier lesson on load balancing, health checks, and graceful shutdown covers HOW an individual instance should exit cleanly and be replaced one at a time during a routine deploy — but it doesn\'t address a separate question: how much real, actual production traffic does a brand-new version of the application get exposed to before every single instance, and therefore every single customer, is running it? In this broken script, the answer is "all of it, immediately" — the very first request any real customer sends to the new version happens at the exact same moment every OTHER customer\'s request does too, with the new code having never actually processed a single real, live request before that instant. If the new version has any bug that only shows up under genuine production conditions — a specific customer data shape, a real payment provider response, actual concurrent load — every single customer is affected at once, and there is no smaller, already-proven-safe fallback to route back to except starting an entirely new deployment of the old code from scratch.

**The fix: blue-green — two complete environments, an instant, reversible switch**

\`\`\`js
// Load balancer config: currently routing 100% to "blue" (the current, proven version)
{ blue: { weight: 100, servers: [...] }, green: { weight: 0, servers: [...] } }

// Deploy the new version entirely to "green" — blue keeps serving 100% of real traffic,
// completely undisturbed, while green is deployed and independently smoke-tested
deployToGreen(newVersion);
runSmokeTests("green"); // hit green directly, verify it works, before any real customer does

// Only once green is verified: flip the switch
updateLoadBalancerWeights({ blue: 0, green: 100 });
// if anything looks wrong afterward: flip back to { blue: 100, green: 0 } instantly
\`\`\`

Blue-green deployment keeps two complete, independent environments: "blue," the current version actively serving all real traffic, and "green," where the brand-new version is deployed and can be directly tested — smoke tests, manual verification, anything needed — without a single real customer ever touching it, since the load balancer is still routing 100% of traffic to blue throughout this entire process. Only once green has been verified to actually work does a human deliberately flip the load balancer\'s configuration to route traffic to green instead — and critically, blue is not torn down the instant this happens; it stays available, fully intact and already proven, so if something wrong is discovered in green even minutes or hours later, traffic can be flipped straight back to blue instantly, with no new deployment, no code revert, and no waiting required at all.`,

    simpleHi: `**Toote hue se shuru.** Har instance ko naye version se replace kiya jaata hai, ek saath, koi dedicated verification step bina:

\`\`\`bash
# Ek saadha "deploy" script
pm2 stop all
git pull
npm install
pm2 start all   # har instance ab naya, kabhi-battle-test-na-hua version chalaata hai
\`\`\`

Is course ka pehle wala load balancing, health checks, aur graceful shutdown lesson ye cover karta hai ki ek akele instance ko ek routine deploy ke dauraan kaise saaf taur par exit hona chahiye aur ek-ek karke replace hona chahiye — par ye ek alag sawaal ko sambodhit nahi karta: application ka ek bilkul-naya version kitna asli, asli production traffic paata hai isse pehle ki har akela instance, aur isliye har akela customer, use chala rahe hon? Is toote script mein, jawaab hai "sab kuch, turant" — kisi bhi asli customer dwara naye version ko bheji gayi bilkul pehli request bilkul usi pal hoti hai jab har DOOSRE customer ki request bhi hoti hai, naye code ne us pal se pehle asal mein ek bhi asli, live request kabhi process nahi ki. Agar naye version mein koi bhi bug hai jo sirf asli production sthitiyon ke neeche dikhta hai — ek khaas customer data shape, ek asli payment provider response, asli concurrent load — har akela customer ek saath asar mein aata hai, aur koi chhota, pehle-se-saabit-surakshit fallback nahi hai jispar wapas route kiya jaaye ek poori tarah nayi deployment shuru se shuru karne ke alaawa purane code ki.

**Fix: blue-green — do poore environments, ek turant, reversible switch**

\`\`\`js
// Load balancer config: abhi 100% "blue" (maujooda, saabit version) ko route ho raha hai
{ blue: { weight: 100, servers: [...] }, green: { weight: 0, servers: [...] } }

// Naye version ko poori tarah "green" par deploy karo — blue asli traffic ka 100%
// serve karta rehta hai, poori tarah na-chheda, jabki green deploy aur akele smoke-test kiya jaata hai
deployToGreen(newVersion);
runSmokeTests("green"); // green ko seedhe hit karo, verify karo ki kaam karta hai, kisi asli customer se pehle

// Sirf ek baar green verify ho jaaye: switch flip karo
updateLoadBalancerWeights({ blue: 0, green: 100 });
// agar baad mein kuch galat lage: turant { blue: 100, green: 0 } par wapas flip karo
\`\`\`

Blue-green deployment do poore, swatantra environments rakhta hai: "blue," jo maujooda version hai jo saqriya taur par sabhi asli traffic serve kar raha hai, aur "green," jahan bilkul-naya version deploy hota hai aur seedhe test kiya jaa sakta hai — smoke tests, manual verification, jo bhi zaroori ho — kisi bhi asli customer ke ise chhue bina, kyunki load balancer poori is process ke dauraan abhi bhi 100% traffic blue ko route kar raha hai. Sirf ek baar green ye verify ho jaaye ki asal mein kaam karta hai koi insaan jaan-boojhkar load balancer ka configuration flip karta hai traffic ko iske bajaye green ko route karne ke liye — aur bahut zaruri, blue ko ye hote hi nahi todaa jaata; ye upalabdh rehta hai, poori tarah bacha aur pehle se saabit, taaki agar green mein kuch galat pata chalta hai kuch minute ya ghante baad bhi, traffic ko turant blue par wapas flip kiya jaa sakta hai, koi nayi deployment nahi, koi code revert nahi, aur koi intezaar bilkul zaroorat bina.`,

    content: `## Blue-green vs. this course's earlier rolling-deploy lesson: a different question entirely

\`\`\`
Earlier lesson (health checks + graceful shutdown): HOW does one
instance, among many identical ones, exit cleanly and get replaced
during a routine deploy, without dropping in-flight requests?

This lesson: HOW MUCH real traffic does a NEW VERSION of the whole
application get exposed to, and how quickly and safely can traffic
be moved back if that new version turns out to be broken?
\`\`\`

This course\'s earlier lesson on load balancing established that during a deploy, instances are replaced one at a time behind a health check, so the overall service stays available throughout — but it treated "the new version" as a known-good thing simply being rolled out mechanically. This lesson asks a genuinely prior question: before trusting a new version enough to roll it out everywhere at all, how is it first exposed to real conditions safely, and if it turns out not to be trustworthy, how quickly can that decision be undone? Blue-green and canary are two different, standard answers to that question, and either can be combined with the previous lesson\'s graceful, health-checked instance replacement once the decision to fully adopt the new version has actually been made.

## Blue-green: two full environments, an instant, reversible all-at-once switch

\`\`\`
"Blue"  = the current, proven version, serving 100% of real traffic.
"Green" = the new version, fully deployed but serving 0% of real
          traffic — reachable directly for testing, invisible to
          real customers, until a deliberate switch is made.
\`\`\`

Blue-green deployment\'s defining property is having two COMPLETE, independent copies of the entire running application at once, with only one of them (blue) actually receiving real traffic at any given time. The new version is deployed entirely to the other environment (green) and can be exercised directly — smoke tests, a manual walkthrough, synthetic monitoring — with zero real customers ever touching it, since the load balancer or router in front of both environments is still sending 100% of real traffic to blue throughout this entire verification period. Once green is trusted, the switch itself is a single, deliberate, typically near-instantaneous configuration change at the load balancer or DNS level — and blue is deliberately kept running, fully intact, for some period afterward specifically so that if a problem surfaces in green that testing didn\'t catch, traffic can be switched straight back to blue immediately, with no new deployment needed at all.

## Canary: gradually shifting a small, real slice of production traffic

\`\`\`
Canary rollout of a new version:
Stage 1: 1% of real traffic → new version, 99% → old version
Stage 2: 10% → new version (after stage 1 shows no problems)
Stage 3: 50% → new version
Stage 4: 100% → new version (old version can now be retired)
\`\`\`

Canary deployment takes a different approach to the same underlying goal: rather than an all-at-once switch between two environments, a small percentage of real production traffic is routed to the new version while the vast majority continues to hit the old, proven one — closely watching error rates, latency, and other metrics (this course\'s earlier observability lesson) at each small stage before increasing the new version\'s share further. This is conceptually similar to the previous lesson\'s feature-flag progressive rollout, but operates at a different layer: a feature flag controls exposure to one specific FEATURE within a single running version of the application, decided in application code, while a canary deployment controls exposure to an entire NEW VERSION of the whole application, decided at the infrastructure or load-balancer level — useful specifically for changes too broad, too foundational, or too impractical to wrap in an individual feature flag (a major dependency upgrade, a runtime version change, a wholesale rewrite of a service).

## Choosing between them, and why either beats no strategy at all

\`\`\`
Blue-green: best when the switch needs to be simple and immediately
reversible, and running two full environments briefly is acceptable
(e.g. a self-contained service without complex, hard-to-duplicate
external state).

Canary: best when a change is risky enough to want real, gradual
validation under genuine traffic before fully committing, and
partial exposure (a small fraction of users on one version, the
rest on another) is an acceptable, temporary state.
\`\`\`

Neither approach is universally superior — blue-green offers a simpler mental model and an instant, complete switch back, but requires running two full copies of the environment simultaneously, which can be costly or impractical for services with significant, hard-to-duplicate state. Canary offers a more gradual, real-world-validated rollout and reduces the blast radius of a problem to a small fraction of traffic, but requires the application to tolerate two different versions running simultaneously for some period, and requires genuinely monitoring the right metrics to know when it\'s safe to proceed to the next stage. What both strategies share, and what genuinely matters most, is that neither one exposes the ENTIRE user base to a brand-new, unproven version all at once with no fast way back — which is precisely the risk this lesson\'s broken example demonstrates, and precisely what a team with no deliberate deployment strategy at all is silently accepting on every single release.`,

    contentHi: `## Blue-green vs. is course ka pehle wala rolling-deploy lesson: ek poori tarah alag sawaal

\`\`\`
Pehle wala lesson (health checks + graceful shutdown): kai ek-jaisi
mein se EK instance kaise saaf taur par exit hota hai aur ek routine
deploy ke dauraan replace hota hai, in-flight requests giraaye bina?

Ye lesson: poori application ka ek NAYA VERSION kitni asli traffic
paata hai, aur agar wo naya version toota hua nikle to traffic
kitni jaldi aur surakshit taur par wapas le jaayi jaa sakti hai?
\`\`\`

Is course ka pehle wala load balancing lesson sthaapit karta hai ki ek deploy ke dauraan, instances ek-ek karke ek health check ke peeche replace hote hain, taaki poori service is dauraan upalabdh rehe — par usne "naye version" ko ek jaana-pehchaana-achha cheez maana jo bas mechanically rolled out ho rahi hai. Ye lesson ek sach mein pehle wala sawaal poochta hai: ek naye version par bharosa karne se pehle itna ki use har jagah rollout kiya jaaye, ise pehle asli sthitiyon mein surakshit taur par kaise expose kiya jaata hai, aur agar ye bharosemand na nikle, ye faisla kitni jaldi wapas liya jaa sakta hai? Blue-green aur canary is sawaal ke do alag, standard jawaab hain, aur inmein se koi bhi pehle wale lesson ke saaf, health-check-kiye-gaye instance replacement ke saath jodaa jaa sakta hai ek baar naye version ko poori tarah apnaane ka faisla asal mein ho chuka ho.

## Blue-green: do poore environments, ek turant, reversible ek-saath switch

\`\`\`
"Blue"  = maujooda, saabit version, asli traffic ka 100% serve karta hai.
"Green" = naya version, poori tarah deployed par asli traffic ka 0%
          serve karta hai — testing ke liye seedhe pahunch-laayak,
          asli customers ke liye na-dikhta, jab tak ek jaan-boojhkar
          switch na kiya jaaye.
\`\`\`

Blue-green deployment ki paribhaashit property ek saath poori running application ki do POORI, swatantra copies rakhna hai, jismein sirf inmein se ek (blue) asal mein kisi bhi diye waqt asli traffic paati hai. Naya version poori tarah doosre environment (green) mein deploy hota hai aur seedhe exercise kiya jaa sakta hai — smoke tests, ek manual walkthrough, synthetic monitoring — bilkul koi asli customer ise kabhi chhue bina, kyunki dono environments ke saamne wala load balancer ya router is poori verification avdhi ke dauraan abhi bhi 100% asli traffic blue ko bhej raha hai. Ek baar green par bharosa ho jaaye, switch khud ek akela, jaan-boojhkar, aam taur par lagbhag-turant configuration badlaav hai load balancer ya DNS star par — aur blue jaan-boojhkar chalta rakha jaata hai, poori tarah bacha, kuch samay baad tak khaas taur par taaki agar green mein ek samasya zaahir hoti hai jise testing ne pakda nahi, traffic ko turant blue par wapas switch kiya jaa sake, koi nayi deployment bilkul zaroorat bina.

## Canary: asli production traffic ka ek chhota, asli hissa dheere-dheere shift karna

\`\`\`
Ek naye version ka canary rollout:
Stage 1: asli traffic ka 1% → naya version, 99% → purana version
Stage 2: 10% → naya version (stage 1 ke koi samasya na dikhaane baad)
Stage 3: 50% → naya version
Stage 4: 100% → naya version (purana version ab retire ho sakta hai)
\`\`\`

Canary deployment usi buniyaadi lakshya ke liye ek alag tarika istemal karta hai: do environments ke beech ek-saath switch ke bajaye, asli production traffic ka ek chhota pratishat naye version ko route kiya jaata hai jabki bahut bada hissa purane, saabit wale ko chhoota rehta hai — har chhote stage par error rates, latency, aur doosri metrics (is course ke pehle wale observability lesson) ko dhyaan se dekhte hue naye version ka hissa aur badhaane se pehle. Ye conceptually pichhle lesson ke feature-flag progressive rollout se milta-julta hai, par ek alag layer par kaam karta hai: ek feature flag ek khaas FEATURE ke exposure ko niyantrit karta hai application ke ek akele chalte version ke andar, application code mein tay kiya gaya, jabki ek canary deployment poori application ke ek bilkul NAYE VERSION ke exposure ko niyantrit karta hai, infrastructure ya load-balancer star par tay kiya gaya — khaas taur par un badlaavon ke liye upyogi jo ek akele feature flag mein wrap karne ke liye bahut vyaapak, bahut buniyaadi, ya bahut vyavhaarik-nahi hain (ek badi dependency upgrade, ek runtime version badlaav, ek service ka poora rewrite).

## Inke beech chunna, aur koi bhi ek strategy kyun bilkul koi strategy na hone se behtar hai

\`\`\`
Blue-green: sabse achha jab switch saadha aur turant reversible
hona chahiye, aur do poore environments thodi der ke liye chalaana
sweekaarya ho (jaise ek swatantra service jismein complex,
duplicate-karna-mushkil bahari state na ho).

Canary: sabse achha jab ek badlaav itna khatarnaak ho ki poori
tarah commit karne se pehle asli, dheere-dheere validation asli
traffic ke neeche chaahiye, aur partial exposure (users ka ek
chhota hissa ek version par, baaki doosre par) ek sweekaarya,
asthaayi sthiti ho.
\`\`\`

Koi bhi tarika sarvavyaapi roop se behtar nahi hai — blue-green ek saadha mental model aur ek turant, poora wapas jaane ka switch deta hai, par ek saath do poori environments chalaana maang leta hai, jo maayne-rakhta state wali services ke liye mehanga ya avyavhaarik ho sakta hai. Canary ek zyaada dheeme, asli-duniya-validated rollout deta hai aur ek samasya ke blast radius ko traffic ke ek chhote hisse tak kam karta hai, par application ko kuch samay ke liye ek saath do alag versions chalne ko jhelne ki maang karta hai, aur agli stage tak badhna surakshit hai ye jaanne ke liye sahi metrics ko sach mein monitor karna maangta hai. Dono strategies jo saath-saath rakhti hain, aur jo asal mein sabse zyaada maayne rakhta hai, ye hai ki inmein se koi bhi POORE user base ko ek bilkul-naye, na-saabit version ko ek saath koi tezi se wapas jaane ka tarika bina expose nahi karta — bilkul yahi khatra jo is lesson ka toota example dikhaata hai, aur bilkul yahi jo koi jaan-boojhkar deployment strategy na rakhti team har akeli release par chupke se sweekar kar rahi hai.`,

    examples: [
      {
        title: 'Broken: every instance replaced with the new version, all at once',
        titleHi: 'Toota: har instance naye version se replace hota hai, ek saath',
        code: `pm2 stop all
git pull
npm install
pm2 start all
// every customer now hits the brand-new, never-battle-tested version`,
        codeJs: `// deploy.sh
pm2 stop all
git pull origin main
npm install
pm2 start all
// no smoke test, no staged rollout, no fallback except a fresh redeploy`,
        codeTs: `// deploy.sh — identical shell script, language of the app is irrelevant here;
// the risk is entirely about deployment strategy, not the codebase itself`,
        output: `Works if the new version happens to have no bugs. If it does, every
single customer is affected simultaneously, and the only way back
is deploying the old code from scratch.`,
        explain: 'Nothing here verifies the new version under real traffic at a small scale first, and nothing keeps a proven, working fallback immediately available if something goes wrong.',
        explainHi: 'Yahan kuch bhi naye version ko pehle ek chhoti scale par asli traffic ke neeche verify nahi karta, aur kuch bhi ek saabit, kaam karta fallback turant upalabdh nahi rakhta agar kuch galat ho jaaye.',
      },
      {
        title: 'Fixed: blue-green — deploy to green, verify, then switch',
        titleHi: 'Theek: blue-green — green par deploy karo, verify karo, phir switch karo',
        code: `deployToGreen(newVersion);
runSmokeTests("green");
if (smokeTestsPassed) updateLoadBalancerWeights({ blue: 0, green: 100 });
else rollbackGreen();`,
        codeJs: `async function blueGreenDeploy(newVersion) {
  await deployToEnvironment("green", newVersion);
  const smokeTestsPassed = await runSmokeTests("green"); // hits green directly, no real traffic yet
  if (!smokeTestsPassed) {
    await teardownEnvironment("green");
    throw new Error("Smoke tests failed on green, deployment aborted");
  }
  await updateLoadBalancerWeights({ blue: 0, green: 100 });
  console.log("Traffic switched to green. Blue remains available for instant rollback.");
}`,
        codeTs: `interface LoadBalancerWeights {
  blue: number;
  green: number;
}

async function blueGreenDeploy(newVersion: string): Promise<void> {
  await deployToEnvironment("green", newVersion);
  const smokeTestsPassed: boolean = await runSmokeTests("green");
  if (!smokeTestsPassed) {
    await teardownEnvironment("green");
    throw new Error("Smoke tests failed on green, deployment aborted");
  }
  const weights: LoadBalancerWeights = { blue: 0, green: 100 };
  await updateLoadBalancerWeights(weights);
}`,
        outputJs: `Real customers never touch the new version until it's already
verified working on green. If a problem surfaces after the switch,
flipping back to { blue: 100, green: 0 } is instant.`,
        outputTs: `// Identical behaviour. The LoadBalancerWeights interface documents
// exactly what a valid traffic-split configuration looks like.`,
        explain: 'Blue is never torn down the instant green takes over — it stays fully intact specifically so a rollback is a configuration change, not a new deployment.',
        explainHi: 'Blue ko green ke sambhalte hi kabhi nahi todaa jaata — ye poori tarah bacha rehta hai khaas taur par taaki ek rollback ek configuration badlaav ho, ek nayi deployment nahi.',
      },
      {
        title: 'Canary: gradually shifting real traffic to the new version',
        titleHi: 'Canary: asli traffic ko naye version ki taraf dheere-dheere shift karna',
        code: `const stages = [1, 10, 50, 100];
for (const percent of stages) {
  await setCanaryTrafficPercent(percent);
  await waitAndCheckMetrics();
}`,
        codeJs: `async function canaryRollout(newVersion) {
  await deployCanaryInstances(newVersion);
  const stages = [1, 10, 50, 100];
  for (const percent of stages) {
    await setCanaryTrafficPercent(percent);
    console.log(\`Canary now receiving \${percent}% of real traffic\`);
    const healthy = await watchMetricsFor(300); // 5 minutes at each stage
    if (!healthy) {
      await setCanaryTrafficPercent(0);
      throw new Error(\`Canary unhealthy at \${percent}%, rolled back to 0%\`);
    }
  }
}`,
        codeTs: `async function canaryRollout(newVersion: string): Promise<void> {
  await deployCanaryInstances(newVersion);
  const stages: number[] = [1, 10, 50, 100];
  for (const percent of stages) {
    await setCanaryTrafficPercent(percent);
    const healthy: boolean = await watchMetricsFor(300);
    if (!healthy) {
      await setCanaryTrafficPercent(0);
      throw new Error(\`Canary unhealthy at \${percent}%, rolled back to 0%\`);
    }
  }
}`,
        outputJs: `A bug that only shows up under real production conditions affects
at most 1% of traffic before it's caught and the canary is rolled
back to 0%, rather than 100% of customers.`,
        outputTs: `// Identical behaviour. Each stage genuinely waits and checks
// real metrics (this course's earlier observability lesson) before
// advancing, rather than blindly increasing the percentage on a timer.`,
        explain: 'Real production traffic validates the new version gradually, at increasing but always bounded scale, so any problem\'s blast radius stays small until real confidence is earned.',
        explainHi: 'Asli production traffic naye version ko dheere-dheere validate karti hai, badhti par hamesha seemit scale par, taaki kisi bhi samasya ka blast radius chhota rehe jab tak asli bharosa na kamaaya jaaye.',
      },
    ],

    mistakes: [
      {
        wrong: `// Tearing down "blue" the instant "green" starts receiving traffic
updateLoadBalancerWeights({ blue: 0, green: 100 });
teardownEnvironment("blue"); // no fallback left if green has a problem`,
        right: `updateLoadBalancerWeights({ blue: 0, green: 100 });
// blue stays running, fully intact, for a deliberate observation
// period before being torn down`,
        why: 'Tearing down the old environment immediately after switching removes the entire safety benefit of blue-green — an instant rollback requires the old, proven version to still exist.',
        whyHi: 'Switch hone ke turant baad purane environment ko todna blue-green ka poora safety fayda hata deta hai — ek turant rollback ke liye purane, saabit version ka abhi bhi maujood hona zaruri hai.',
      },
      {
        wrong: `// Canary rollout that advances stages on a fixed timer, never actually checking metrics
await setCanaryTrafficPercent(10);
await sleep(60000);
await setCanaryTrafficPercent(100); // advanced regardless of whether 10% was actually healthy`,
        right: `await setCanaryTrafficPercent(10);
const healthy = await watchMetricsFor(300);
if (healthy) await setCanaryTrafficPercent(100);
else await setCanaryTrafficPercent(0);`,
        why: 'Advancing a canary rollout on a timer rather than genuinely checking real metrics defeats the entire purpose — the point is to validate under real traffic, not just to wait an arbitrary amount of time.',
        whyHi: 'Ek canary rollout ko ek timer par badhaana asli metrics ko sach mein check karne ke bajaye poora maqsad haar deta hai — point asli traffic ke neeche validate karna hai, sirf ek manmaani waqt intezaar karna nahi.',
      },
      {
        wrong: `// No deployment strategy at all — every instance replaced simultaneously
pm2 stop all && git pull && npm install && pm2 start all`,
        right: `// Either blue-green (instant, reversible switch) or canary (gradual,
// metric-validated rollout) — either beats exposing 100% of users
// to an unproven version simultaneously with no fallback`,
        why: 'Replacing every instance at once with no verification step and no fallback exposes the entire user base to a brand-new, unproven version simultaneously, with recovery requiring a full new deployment if it\'s broken.',
        whyHi: 'Koi verification step aur koi fallback bina ek saath har instance replace karna poore user base ko ek bilkul-naye, na-saabit version ko ek saath expose karta hai, agar ye toota hua ho to recovery ek poori nayi deployment maangta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Blue-green and canary deployments are both standard, widely documented deployment strategies supported natively by most major cloud platforms and container orchestrators**, reflecting how broadly they are relied upon in real production practice.',
        hi: '**Blue-green aur canary deployments dono standard, vyaapak roop se documented deployment strategies hain jo zyaadatar mukhya cloud platforms aur container orchestrators dwara natively support ki jaati hain**, ye darsata hai ki asli production practice mein inpar kitni vyaapak roop se bharosa kiya jaata hai.',
      },
      {
        en: '**Canary deployments are commonly cited as the deployment strategy of choice specifically for high-risk changes at large-scale technology companies**, precisely because they bound a potential problem\'s blast radius to a small, controlled fraction of real traffic.',
        hi: '**Canary deployments ko aam taur par bade-scale ki technology companies mein khaas taur par uchch-khatre wale badlaavon ke liye pasandeeda deployment strategy ki tarah cite kiya jaata hai**, bilkul isliye kyunki wo ek sambhaavit samasya ke blast radius ko asli traffic ke ek chhote, niyantrit hisse tak seemit karte hain.',
      },
      {
        en: '**Blue-green deployments are frequently paired with automated smoke tests and synthetic monitoring run against the idle environment before any traffic switch**, a widely recommended practice for catching obvious problems before real customers ever could.',
        hi: '**Blue-green deployments aksar automated smoke tests aur synthetic monitoring ke saath joda jaata hai jo kisi bhi traffic switch se pehle idle environment ke khilaaf chalti hai**, ek vyaapak roop se recommend ki jaane waali practice jo asli customers se pehle hi dikhti samasyaayein pakadti hai.',
      },
    ],

    interviewQA: [
      {
        q: 'How does canary deployment differ from the feature-flag progressive rollout covered in the previous lesson, and when would you reach for one over the other?',
        qHi: 'Canary deployment pichhle lesson mein cover ki gayi feature-flag progressive rollout se kaise alag hai, aur tum ek ke liye doosre ke bajaye kab pahunchoge?',
        a: 'Both mechanisms share the same underlying philosophy — gradually increasing the fraction of real traffic exposed to something new while watching closely, rather than exposing everyone at once — but they operate at genuinely different layers of the system and are suited to different kinds of changes. A feature flag is an application-level mechanism: a runtime check inside the running application\'s own code decides, per request, whether to execute a new code path or the old one, and the entire application is otherwise running as a single deployed version throughout. This makes feature flags well-suited to isolating exposure to one specific, well-defined piece of new behavior within an application that is otherwise unchanged — a new checkout flow, a new algorithm for a specific calculation — where the change can be cleanly wrapped in a conditional. Canary deployment, by contrast, is an infrastructure-level mechanism: it runs two genuinely different, complete deployed versions of the entire application simultaneously, with the load balancer or router — not application code — deciding what fraction of incoming requests reach each version. This makes canary deployment better suited to changes that are too broad, too foundational, or too impractical to isolate behind a single conditional flag within one running version — a major runtime or dependency upgrade affecting the entire application, a substantial rewrite of a service\'s internals, or a change to infrastructure-level configuration that genuinely requires a distinct running version to take effect at all. In practice, the two are often used together: a canary deployment might validate a large underlying change at the infrastructure level, while feature flags within that same new version separately control the gradual exposure of specific new features built on top of it.',
        aHi: 'Dono mechanisms wahi buniyaadi philosophy saath-saath rakhte hain — asli traffic ka hissa jo kisi naye ko expose hota hai dheere-dheere badhaana dhyaan se dekhte hue, sabko ek saath expose karne ke bajaye — par wo system ki sach mein alag layers par kaam karte hain aur alag tarah ke badlaavon ke liye upyukt hain. Ek feature flag ek application-star ka mechanism hai: chalti application ke apne code ke andar ek runtime check faisla karta hai, prati-request, ki ek naya code path chalaaya jaaye ya purana, aur baaki application ek akele deployed version ki tarah is dauraan chalti rehti hai. Ye feature flags ko ek naye, achhi tarah define ki gayi vyavhaar ke ek khaas tukde ke exposure ko akele karne ke liye upyukt banaata hai ek aisi application ke andar jo iske alaawa na-badli hai — ek naya checkout flow, ek khaas calculation ke liye ek naya algorithm — jahan badlaav ek conditional mein saaf taur par wrap kiya jaa sakta hai. Canary deployment, iske ulta, ek infrastructure-star ka mechanism hai: ye poori application ke do sach mein alag, poore deployed versions ek saath chalaata hai, load balancer ya router — application code nahi — faisla karte hue ki aati requests ka kaunsa hissa har version tak pahunchta hai. Ye canary deployment ko un badlaavon ke liye behtar upyukt banaata hai jo bahut vyaapak, bahut buniyaadi, ya ek akele chalte version ke andar ek akele conditional flag ke peeche alag karne ke liye bahut avyavhaarik hain — poori application ko asar karti ek badi runtime ya dependency upgrade, ek service ke internals ka ek bhaari rewrite, ya infrastructure-star ki configuration mein ek badlaav jise asal mein asar karne ke liye ek alag chalta version chahiye. Practice mein, dono aksar saath istemal kiye jaate hain: ek canary deployment shaayad infrastructure star par ek bade underlying badlaav ko validate kare, jabki usi naye version ke andar feature flags alag se uske oopar bane khaas naye features ke dheere-dheere exposure ko niyantrit karte hain.',
      },
      {
        q: 'Why is keeping the old environment ("blue") fully running for some time after switching traffic to the new one ("green") so important, rather than tearing it down immediately?',
        qHi: 'Traffic ko naye ("green") par switch karne ke baad kuch samay tak purane environment ("blue") ko poori tarah chalaate rakhna itna zaruri kyun hai, ise turant todne ke bajaye?',
        a: 'The entire strategic value of blue-green deployment centers on the ability to reverse a bad decision essentially instantly, without needing any new deployment cycle at all, purely by changing where the load balancer or router sends traffic. This capability depends entirely on the old environment still existing, in a fully running, immediately usable state, at the moment a problem is discovered — if blue is torn down the instant traffic is switched to green, this rollback capability is destroyed along with it, and any problem discovered in green afterward, however minor or however quickly noticed, would require standing up a fresh environment running the old code from scratch, which is exactly the slow, risky process blue-green deployment exists specifically to avoid. This matters because verification performed on green before the switch, however thorough — smoke tests, manual review, synthetic monitoring — can never perfectly replicate every condition genuine, live production traffic will eventually exercise; some problems only reveal themselves once real customers, with their full diversity of real data and real usage patterns, actually start using the new version, which by definition can only happen after the switch has already occurred. Keeping blue fully intact and immediately available for some deliberate observation period after the switch — long enough to have real confidence the new version is behaving correctly under genuine traffic — is what makes the strategy\'s core promise (an instant, safe way back) actually true in practice, rather than only true in the narrow window before the switch happens, when it matters least.',
        aHi: 'Blue-green deployment ki poori strategic keemat is kshamta par kendrit hai ki ek bure faisle ko lagbhag turant palta jaa sake, koi bhi nayi deployment cycle ki zaroorat bilkul bina, sirf load balancer ya router traffic kahaan bhejta hai use badalkar. Ye kshamta poori tarah is baat par nirbhar hai ki purana environment abhi bhi maujood hai, ek poori tarah chalti, turant istemal-laayak sthiti mein, jis pal ek samasya discover hoti hai — agar blue ko traffic green par switch hote hi todaa jaata hai, ye rollback kshamta uske saath khatam ho jaati hai, aur baad mein green mein mili koi bhi samasya, chahe kitni bhi chhoti ho ya kitni bhi jaldi notice ho, purane code ko chalaate shuru se ek taazaa environment khada karne ki maang karti, jo bilkul wahi dheema, khatarnaak process hai jise avoid karne ke liye khaas taur par blue-green deployment maujood hai. Ye maayne rakhta hai kyunki green par switch se pehle ki gayi verification, chahe kitni bhi vistrit ho — smoke tests, manual review, synthetic monitoring — kabhi asli, live production traffic jo aakhirkaar exercise karega har sthiti ko perfectly replicate nahi kar sakti; kuch samasyaayein sirf tab zaahir hoti hain jab asli customers, apne asli data aur asli istemal patterns ki poori vividhata ke saath, asal mein naye version ka istemal shuru karte hain, jo definition se sirf switch pehle se ho chuke hone ke baad ho sakta hai. Switch ke baad kuch jaan-boojhkar observation avdhi ke liye blue ko poori tarah bacha aur turant upalabdh rakhna — itna lamba ki asli bharosa ho ki naya version asli traffic ke neeche sahi tarike se vyavhaar kar raha hai — wo hai jo strategy ka mool vaada (ek turant, surakshit wapas jaane ka tarika) practice mein asal mein sach banaata hai, sirf switch hone se pehle wali sankuchit window mein sach hone ke bajaye, jab ye sabse kam maayne rakhta hai.',
      },
      {
        q: 'Why should a canary rollout advance based on genuinely observed metrics rather than simply waiting a fixed amount of time at each stage?',
        qHi: 'Ek canary rollout ko sach mein dekhi gayi metrics ke aadhaar par kyun badhna chahiye, har stage par bas ek tay waqt intezaar karne ke bajaye?',
        a: 'The entire purpose of a canary rollout is to genuinely validate that a new version behaves correctly under real production conditions before trusting it with the full user base — and that validation can only be meaningful if it is actually based on observing whether the new version IS, in fact, behaving correctly at each stage, using real signals like error rates, latency percentiles, and other relevant metrics gathered while real traffic is flowing through it (following this course\'s earlier observability lesson). If a rollout instead simply advances from one stage to the next after a fixed amount of time has elapsed, regardless of what the metrics during that time actually showed, the mechanism becomes nothing more than a slow, staggered deployment with no actual safety benefit over an immediate, all-at-once release — the new version reaches 100% of traffic on a predetermined schedule either way, and any problem present in the new version would eventually reach every single user regardless of whether it caused elevated error rates at the 1% or 10% stage, since nothing in the process actually checks for that and reacts to it. A canary rollout that genuinely delivers on its safety promise must treat each stage\'s duration as conditional on what the metrics show, not fixed: advancing only once the current stage has demonstrably shown healthy behavior for a meaningful period, and automatically reducing traffic back down, or halting the rollout entirely, the moment metrics indicate a real problem — this is what actually bounds the blast radius of a bad release to the small percentage of traffic exposed at the stage where the problem was caught, rather than eventually reaching everyone regardless.',
        aHi: 'Ek canary rollout ka poora maqsad ye sach mein validate karna hai ki poore user base par bharosa karne se pehle ek naya version asli production sthitiyon ke neeche sahi tarike se vyavhaar karta hai — aur wo validation sirf tab maayne-rakhta ho sakta hai jab ye asal mein is baat ka observation par aadhaarit ho ki naya version har stage par asal mein sahi tarike se vyavhaar KAR RAHA HAI, real signals jaise error rates, latency percentiles, aur doosri mutaalliq metrics istemal karte hue jo asli traffic uske through behte waqt jama ki jaati hain (is course ke pehle wale observability lesson ka palan karte hue). Agar ek rollout iske bajaye bas ek tay waqt guzarne ke baad ek stage se agli mein badhta hai, us waqt ke dauraan metrics ne asal mein kya dikhaaya us se bekhabar, mechanism ek dheeme, staggered deployment se zyaada kuch nahi ban jaata jismein ek turant, ek-saath release ke muqable koi asli safety fayda nahi — naya version 100% traffic tak dono tarah se ek pehle-se-tay schedule par pahunchta hai, aur naye version mein maujood koi bhi samasya aakhirkaar har akele user tak pahunchegi chahe usne 1% ya 10% stage par badhi hui error rates cause ki hon ya na, kyunki process mein kuch bhi asal mein iske liye check nahi karta aur iske prati react nahi karta. Ek canary rollout jo asal mein apna safety vaada poora karta hai use har stage ki avdhi ko fixed ke bajaye metrics kya dikhaate hain uspar conditional maanna chahiye: sirf ek baar current stage ne ek maayne-rakhta avdhi ke liye pramaanit roop se sehatmand vyavhaar dikhaaya ho tab badhna, aur automatically traffic ko wapas kam karna, ya rollout ko poori tarah rokna, jis pal metrics ek asli samasya darsaate hain — ye hi hai jo asal mein ek bure release ke blast radius ko us chhote pratishat traffic tak seemit karta hai jo us stage par expose hua jahan samasya pakdi gayi, har kisi tak chahe kuch bhi ho aakhirkaar pahunchne ke bajaye.',
      },
    ],

    exercises: [
      {
        task: 'Simulate a blue-green deployment locally: run two copies of a simple server (blue and green) on different ports, with a small proxy in front routing 100% of traffic to blue. Deploy a change to green and verify it directly before switching the proxy.',
        taskHi: 'Ek blue-green deployment ko locally simulate karo: ek saadhe server ki do copies (blue aur green) alag ports par chalaao, saamne ek chhota proxy 100% traffic blue ko route karta hue. Green mein ek badlaav deploy karo aur proxy switch karne se pehle ise seedhe verify karo.',
        hint: 'A simple Node.js http-proxy or even a basic if/else in a router script routing to one of two upstream ports is enough to demonstrate the concept.',
        hintHi: 'Ek saadha Node.js \`http-proxy\` ya ek router script mein ek buniyaadi \`if/else\` jo do upstream ports mein se ek ko route karta hai concept dikhaane ke liye kaafi hai.',
      },
      {
        task: 'Add a rollback step to your blue-green simulation: after switching to green, deliberately introduce a bug, detect it via a simple health check, and switch the proxy back to blue without touching green\'s code.',
        taskHi: 'Apne blue-green simulation mein ek rollback step jodo: green par switch karne ke baad, jaan-boojhkar ek bug introduce karo, ise ek saadhe health check ke zariye detect karo, aur green ke code ko chhue bina proxy ko wapas blue par switch karo.',
        hint: 'The rollback step should be nothing more than changing which port the proxy forwards to — no redeployment, no code change to blue.',
        hintHi: 'Rollback step proxy kis port ko forward karta hai use badalne se zyaada kuch nahi hona chahiye — koi redeployment nahi, blue mein koi code badlaav nahi.',
      },
      {
        task: 'Build a simple canary simulator: a router that sends a configurable percentage of requests to a "new" version and the rest to an "old" one, with a function that checks a simulated error rate at each stage before advancing.',
        taskHi: 'Ek saadha canary simulator banaao: ek router jo requests ka ek configurable pratishat ek "naye" version ko aur baaki ek "purane" ko bhejta hai, ek function ke saath jo har stage par aage badhne se pehle ek simulated error rate check karta hai.',
        hint: 'Simulate the "new version" occasionally throwing an error at a fixed rate, and have your canary logic halt or roll back if the observed error rate during a stage exceeds a threshold.',
        hintHi: '"Naye version" ko kabhi-kabhi ek tay dar par ek error throw karte hue simulate karo, aur apni canary logic ko rukne ya rollback karne do agar ek stage ke dauraan dekhi gayi error rate ek threshold se zyaada ho.',
      },
    ],

    keyTakeaways: [
      'This lesson answers a different question from the earlier health-checks/graceful-shutdown lesson: not how one instance exits cleanly, but how much real traffic a NEW VERSION gets exposed to, and how quickly a bad decision can be reversed.',
      'Blue-green deployment keeps two complete environments — the new version is deployed and verified on "green" while "blue" continues serving 100% of real traffic, until a deliberate, instant, reversible switch is made.',
      'The old environment must stay fully intact for a deliberate period after the switch — tearing it down immediately destroys the instant-rollback capability that is the entire point of blue-green.',
      'Canary deployment gradually shifts a small, increasing percentage of real production traffic to the new version, bounding any problem\'s blast radius to that percentage until real confidence is earned.',
      'Canary and feature-flag rollouts share the same "gradually increase exposure" philosophy but operate at different layers: feature flags control a specific behavior within one running version; canary deployments control exposure to an entirely different deployed version.',
      'A canary rollout must advance stages based on genuinely observed metrics, not a fixed timer — otherwise it becomes a slow, staggered deployment with no actual safety benefit over an immediate, all-at-once release.',
    ],
    keyTakeawaysHi: [
      'Ye lesson pehle wale health-checks/graceful-shutdown lesson se ek alag sawaal ka jawaab deta hai: ek instance kaise saaf exit hota hai nahi, balki ek NAYA VERSION kitni asli traffic paata hai, aur ek bura faisla kitni jaldi palta jaa sakta hai.',
      'Blue-green deployment do poore environments rakhta hai — naya version "green" par deploy aur verify hota hai jabki "blue" asli traffic ka 100% serve karta rehta hai, jab tak ek jaan-boojhkar, turant, reversible switch na kiya jaaye.',
      'Purana environment ko switch ke baad ek jaan-boojhkar avdhi tak poori tarah bacha rehna chahiye — ise turant todna turant-rollback kshamta ko khatam kar deta hai jo blue-green ka poora maqsad hai.',
      'Canary deployment asli production traffic ka ek chhota, badhta pratishat dheere-dheere naye version ki taraf shift karta hai, kisi bhi samasya ke blast radius ko us pratishat tak seemit karte hue jab tak asli bharosa na kamaaya jaaye.',
      'Canary aur feature-flag rollouts wahi "exposure dheere-dheere badhaao" philosophy saath rakhte hain par alag layers par kaam karte hain: feature flags ek chalte version ke andar ek khaas vyavhaar niyantrit karte hain; canary deployments ek poori tarah alag deployed version ke exposure ko niyantrit karte hain.',
      'Ek canary rollout ko stages sach mein dekhi gayi metrics ke aadhaar par badhaane chahiye, ek fixed timer par nahi — warna ye ek dheema, staggered deployment ban jaata hai jismein ek turant, ek-saath release ke muqable koi asli safety fayda nahi.',
    ],
  },
];
