import type { SeedCategory } from './topics-shared';

/**
 * Deployment and operations.
 *
 * The gap this fills: the app taught how to *build* a full-stack application
 * and stopped at the point where it has to survive contact with real users.
 * Hosting choice, config, CI/CD, zero-downtime releases, observability, cost
 * and incident response are all interview topics and all things that decide
 * whether a project succeeds after it ships.
 *
 * The running thread is **consequences**. Every hosting choice buys something
 * and charges for it, and the charge usually arrives months later — so each
 * topic states what you are signing up for, not just how to do it.
 */
export const deploymentCategory: SeedCategory = {
  slug: 'deployment',
  name: 'Deployment & Operations',
  description:
    'Getting it live and keeping it alive — where to host, what each choice costs you later, and what to do at 3am.',
  icon: 'rocket',
  group: 'backend',
  topics: [
    {
      slug: 'deploy-what-deployment-means',
      title: 'What deploying actually involves',
      difficulty: 'EASY',
      summary: 'Build, ship, run. Your laptop is not the environment — and every difference between the two is a bug waiting for the worst possible moment.',
      summaryHi: 'Build, ship, run. Aapka laptop wo environment nahi hai — aur dono ke beech ka har farak wo bug hai jo sabse bure waqt ka intezaar kar raha hai.',
      content: `Deploying is three steps, and it helps to name them separately because different things go wrong in each:

1. **Build** — turn source into something runnable. TypeScript compiles, the frontend bundles, assets get hashed.
2. **Ship** — get that artefact onto a server, or into a registry a server pulls from.
3. **Run** — start it, with the right configuration, and keep it started.

**The core problem: your machine is not the server**

"Works on my machine" is not a joke, it is a description of a real failure. Your laptop has a different Node version, different environment variables, different installed tools, a different filesystem, and your own \`.env\` full of values nobody else has.

Every one of those differences is a chance for something to behave differently in production — and production is exactly where you have the least ability to poke at it.

**Two things reduce the gap**

- **Containers** — ship the runtime *with* the code, so the Node version and system libraries are the same everywhere
- **Configuration from the environment** — no environment-specific values baked into the build

**The build artefact should be built once**

Build it once, then promote that **same** artefact through staging and into production. If you rebuild per environment, you are testing one thing and shipping another, and the difference will eventually be the thing that breaks.

**The environments most teams have**

- **Local** — your machine
- **Staging** — as close to production as you can afford, with fake data
- **Production** — real users, real money, real consequences

Staging that differs meaningfully from production gives false confidence, which is arguably worse than no staging at all — you tested, it passed, and it still broke.

**What "it is deployed" actually requires**

Running the process is the easy part. It also needs: a process manager that restarts it on crash, a reverse proxy handling TLS, logs going somewhere you can read them, a health endpoint, and a way to roll back. Miss any of those and you have something that runs, not something that is deployed.`,
      contentHi: `Deploy karna teen kadam hai, aur inhe alag naam dena kaam ka hai kyunki har ek mein alag cheezein bigadti hain:

1. **Build** — source ko chalne layak cheez mein badlo. TypeScript compile hota hai, frontend bundle hota hai, assets hash hote hain.
2. **Ship** — us cheez ko server tak, ya us registry tak pahunchao jahan se server uthata hai.
3. **Run** — use sahi configuration ke saath chalao, aur chalta rakho.

**Asli samasya: aapki machine server nahi hai**

"Mere computer par to chalta hai" mazaak nahi, ek asli nakaami ka hulia hai. Aapke laptop par alag Node version hai, alag environment variables, alag tools, alag filesystem, aur aapki apni \`.env\` jisme aisi values hain jo kisi aur ke paas nahi.

In sab mein se har farak wo mauka hai jahan production mein cheez alag bartaav kar sakti hai — aur production wahi jagah hai jahan aap sabse kam kured sakte ho.

**Do cheezein ye faasla kam karti hain**

- **Containers** — runtime ko code ke *saath* bhejo, taaki Node version aur system libraries har jagah ek hon
- **Configuration environment se** — build mein kisi environment ki khaas value pakki mat karo

**Build artefact ek baar banna chahiye**

Ek baar banao, phir **wahi** cheez staging se hote hue production tak badhao. Har environment ke liye dobara build karoge to aap test kuch kar rahe ho aur bhej kuch aur rahe ho, aur wahi farak kabhi na kabhi tootne ki wajah banega.

**Zyadatar teams ke environments**

- **Local** — aapki machine
- **Staging** — production ke jitna paas afford kar sako, nakli data ke saath
- **Production** — asli users, asli paisa, asli natije

Aisa staging jo production se sach mein alag ho, jhoota bharosa deta hai — jo shayad staging na hone se bhi bura hai: aapne test kiya, pass hua, aur phir bhi toot gaya.

**"Ye deploy ho gaya" ka asli matlab**

Process chalana aasan hissa hai. Iske alawa chahiye: crash par dobara chalane wala process manager, TLS sambhalne wala reverse proxy, logs jo kahin padhe ja sakein, ek health endpoint, aur wapas jaane ka rasta. Inme se koi bhi chhoot gaya to aapke paas wo cheez hai jo chal rahi hai, deploy hui nahi.`,
      commonMistakes: [
        'Rebuilding per environment, so what you tested is not what you shipped.',
        'Baking environment-specific values into the build, which forces a rebuild to change a URL.',
        'Staging that differs meaningfully from production — it gives confidence without giving safety.',
        'Calling it deployed when the process runs but nothing restarts it, nothing collects logs, and there is no way back.',
      ],
      interviewQuestions: [
        'What are the stages of a deployment?',
        'Why should you build once and promote the same artefact?',
        'What does "works on my machine" actually mean technically?',
        'What does an app need beyond "the process is running" to be properly deployed?',
      ],
      practiceQuestions: [
        'List every difference between your laptop and your production server.',
        'Take a project and move every hardcoded environment value into configuration.',
      ],
      tags: ['deployment', 'devops', 'basics', 'must-know'],
    },

    {
      slug: 'deploy-where-to-host',
      title: 'Where to host — and what each choice costs you',
      difficulty: 'EASY',
      summary: 'PaaS, VPS, serverless, containers, Kubernetes. Each buys you something and charges for it later. The right answer is almost always the boring one.',
      summaryHi: 'PaaS, VPS, serverless, containers, Kubernetes. Har ek kuch deta hai aur baad mein uski keemat leta hai. Sahi jawab lagbhag hamesha boring wala hota hai.',
      content: `Five real options, in increasing order of control and operational burden.

**1. PaaS — Render, Railway, Fly.io, Heroku**

Push code, it runs. TLS, restarts, logs and rollbacks are handled.

- **Buys you:** speed. You ship the same day.
- **Costs you:** money per unit of compute (noticeably more than raw servers), less control, and a platform that can change its pricing or shut down.
- **Right when:** you are a small team, and engineering time is worth more than server cost. **This is most projects.**

**2. Serverless — Vercel, Lambda, Cloudflare Workers**

Functions that run on demand. No servers to manage; you pay per request.

- **Buys you:** zero cost at zero traffic, automatic scaling, no capacity planning.
- **Costs you:** **cold starts**, execution time limits, and — the one that catches everyone — **database connections**. Every cold start opens new connections and exhausts a Postgres connection limit fast, so you need a pooler. Long-running work and WebSockets do not fit at all.
- **Right when:** spiky or unpredictable traffic, or genuinely event-driven work.

**3. VPS — a plain server on Hetzner, DigitalOcean, EC2**

You get a machine. Everything else is yours.

- **Buys you:** the lowest cost per unit of compute by a wide margin, and total control.
- **Costs you:** you now own OS patching, TLS renewal, monitoring, backups and being woken up. That is a real recurring time cost, not a one-off setup.
- **Right when:** you have someone who genuinely wants to do this, or cost has become the binding constraint.

**4. Containers as a service — ECS, Cloud Run, App Runner**

Your container image, their orchestration.

- **Buys you:** consistency of containers without running a cluster.
- **Costs you:** cloud-specific configuration, and image builds in the loop.
- **Right when:** you are already containerised and want to scale beyond one box.

**5. Kubernetes**

- **Buys you:** genuinely powerful orchestration, and portability between clouds.
- **Costs you:** an enormous amount. It is a full-time concern. Networking, ingress, secrets, upgrades, and a failure surface most teams cannot debug at speed.
- **Right when:** you have multiple teams, many services, and someone whose job this is. **Not before.**

**The honest summary**

Most projects should start on a PaaS or a single VPS with a managed database, and stay there far longer than the internet suggests. Choosing Kubernetes for a two-person team is a decision that will consume the time you were going to spend on the product.

**The consequence people underestimate:** every layer of infrastructure is something that can break at 3am, and something a new hire has to learn before they can help.`,
      contentHi: `Paanch asli vikalp, badhte kaabu aur badhti zimmedari ke kram mein.

**1. PaaS — Render, Railway, Fly.io, Heroku**

Code push karo, chal jata hai. TLS, restart, logs aur rollback wo sambhal lete hain.

- **Kya milta hai:** raftaar. Aap usi din ship kar dete ho.
- **Keemat:** compute ke hisaab se paisa (asli servers se kaafi zyada), kam kaabu, aur ek platform jo apne daam badal sakta hai ya band ho sakta hai.
- **Kab sahi:** chhoti team ho, aur engineering ka waqt server ke kharch se zyada keemti ho. **Ye zyadatar projects hain.**

**2. Serverless — Vercel, Lambda, Cloudflare Workers**

Aise functions jo zaroorat par chalte hain. Server sambhalne nahi; har request ka paisa.

- **Kya milta hai:** zero traffic par zero kharch, apne aap scaling, capacity ki planning nahi.
- **Keemat:** **cold starts**, chalne ke waqt ki seema, aur — jo sabko pakadta hai — **database connections**. Har cold start nayi connections kholta hai aur Postgres ki limit jaldi khatam kar deta hai, isliye pooler chahiye. Lambe chalne wala kaam aur WebSockets ismein baithte hi nahi.
- **Kab sahi:** utaar-chadhaav wala ya anuman se bahar traffic, ya sach mein event-driven kaam.

**3. VPS — Hetzner, DigitalOcean, EC2 par ek simple server**

Aapko ek machine milti hai. Baaki sab aapka.

- **Kya milta hai:** compute ke hisaab se sabse kam kharch, bade antar se, aur poora kaabu.
- **Keemat:** ab OS patching, TLS renewal, monitoring, backups aur raat ko uthna aapka hai. Ye asli, baar-baar lagne wala waqt hai, ek baar ka setup nahi.
- **Kab sahi:** koi ho jo sach mein ye karna chahta ho, ya kharch hi asli rukavat ban gaya ho.

**4. Containers as a service — ECS, Cloud Run, App Runner**

Aapki container image, unka orchestration.

- **Kya milta hai:** container ki ek jaisi baat, bina cluster chalaye.
- **Keemat:** cloud ki khaas configuration, aur build ke beech image banana.
- **Kab sahi:** aap pehle se containerised ho aur ek machine se aage badhna ho.

**5. Kubernetes**

- **Kya milta hai:** sach mein shaktishali orchestration, aur clouds ke beech portability.
- **Keemat:** bahut zyada. Ye poore samay ka kaam hai. Networking, ingress, secrets, upgrades, aur aisi nakaamiyan jo zyadatar teams tezi se debug nahi kar sakti.
- **Kab sahi:** kai teams hon, kai services hon, aur koi ho jiska yahi kaam ho. **Usse pehle nahi.**

**Imaandar saaransh**

Zyadatar projects ko PaaS ya ek VPS aur managed database se shuru karna chahiye, aur wahan internet ke sujhav se kahin lambe tikna chahiye. Do logon ki team ke liye Kubernetes chunna wo faisla hai jo wahi waqt kha jayega jo aap product par lagane wale the.

**Wo natija jise log kam aankte hain:** infrastructure ki har parat ek aisi cheez hai jo raat 3 baje toot sakti hai, aur ek aisi cheez jo naye aane wale ko madad karne se pehle seekhni padti hai.`,
      codeExample: `# Rough monthly cost and burden for the same small app
#
# PaaS         ~$20-50   · zero ops   · restarts, TLS, rollback included
# Serverless   ~$0-30    · zero ops   · but cold starts + connection limits
# VPS          ~$5-20    · YOU own it · patching, TLS, monitoring, backups
# ECS/Cloud Run ~$30-80   · low ops    · cloud-specific config
# Kubernetes   ~$150+    · high ops   · needs a person whose job this is
#
# The numbers are not the point. The third column is.
# Ask: "who gets woken up, and do we have that person?"`,
      commonMistakes: [
        'Choosing Kubernetes for a small team, then spending the product budget on infrastructure.',
        'Going serverless with a Postgres database and no connection pooler — cold starts exhaust the connection limit.',
        'Picking a VPS for the cost saving without counting the recurring hours of patching, monitoring and being on call.',
        'Comparing hosting options on price alone, when the real difference is who gets woken up.',
      ],
      interviewQuestions: [
        'How would you choose between a PaaS, a VPS and serverless?',
        'What breaks when you put a serverless function in front of Postgres?',
        'When is Kubernetes actually the right choice?',
        'What are the hidden costs of a cheap VPS?',
      ],
      practiceQuestions: [
        'Price the same app on three hosting options, including your own time.',
        'For a project you know, write down who would be woken up at 3am and what they would need.',
      ],
      tags: ['deployment', 'hosting', 'architecture', 'must-know'],
    },

    {
      slug: 'deploy-config-and-secrets',
      title: 'Configuration and secrets',
      difficulty: 'EASY',
      summary: 'Config comes from the environment, never from the build. Secrets never enter git — and if one does, rotating it is the only fix.',
      summaryHi: 'Config environment se aati hai, build se kabhi nahi. Secrets git mein kabhi nahi jaate — aur ek chala gaya to use badalna hi akela hal hai.',
      content: `**The rule: anything that differs between environments comes from the environment.**

Database URL, API keys, feature flags, the frontend's API base URL. Baked into the build, and you need a rebuild to change a URL — and you can no longer promote the same artefact through environments.

**Validate configuration at startup, not on first use**

\`process.env.PORT\` is \`string | undefined\`. Treating it as a number and discovering the problem on the first request means the process started, passed its health check, and then failed in front of a user.

Parse everything at boot and **crash immediately** if something is missing. A process that refuses to start is a good outcome; one that starts broken is not.

**Secrets are different from config**

Config is boring. Secrets grant access.

- **Never in git.** Not even in a private repo, not even briefly. Git history is forever, and repos get cloned, forked and leaked.
- **Never in the frontend bundle.** Anything the browser downloads is public. \`NEXT_PUBLIC_\` and \`VITE_\` prefixes exist to make that explicit — anything with them is published.
- **Never in a URL.** Query strings land in server logs, proxy logs and browser history.

**If a secret does leak, rotate it.** Deleting the commit does not help — it is in every clone, every fork, and quite possibly in a scraper's database within minutes. Assume it is compromised, because it is.

**Where secrets should live**

- A secrets manager: AWS Secrets Manager, Doppler, Vault, or your platform's built-in store
- Injected as environment variables at runtime
- **Different per environment**, so staging cannot touch production data

**The check that catches the common case:** a pre-commit hook or CI scan that looks for key-shaped strings. It is imperfect and it catches the accident that actually happens — someone pasting a key into a config file to debug something and forgetting.

**\`.env.example\`** belongs in git: the list of variable names with placeholder values. It documents what is required without leaking anything, and it is how the next person knows what to set.`,
      contentHi: `**Niyam: jo bhi environments ke beech alag hai, wo environment se aayega.**

Database URL, API keys, feature flags, frontend ka API base URL. Build mein pakka kar diya, to URL badalne ke liye dobara build karna padega — aur ab aap wahi artefact environments ke paar nahi badha sakte.

**Configuration shuruaat mein jaancho, pehle istemal par nahi**

\`process.env.PORT\` \`string | undefined\` hai. Ise number maan lena aur pehli request par pata chalna matlab process chala, health check pass hua, aur phir user ke saamne fail ho gaya.

Boot par sab parse karo aur kuch missing ho to **turant crash** karo. Jo process chalne se mana kar de wo achha natija hai; jo toota hua chal pade wo nahi.

**Secrets config se alag hain**

Config boring hai. Secrets pahunch dete hain.

- **Git mein kabhi nahi.** Private repo mein bhi nahi, thodi der ke liye bhi nahi. Git ka itihaas hamesha ka hai, aur repos clone, fork aur leak hote hain.
- **Frontend bundle mein kabhi nahi.** Jo browser download karta hai wo sarvajanik hai. \`NEXT_PUBLIC_\` aur \`VITE_\` prefix isiliye hain ki ye saaf ho — jis par ye laga hai wo prakashit hai.
- **URL mein kabhi nahi.** Query strings server logs, proxy logs aur browser history mein pahunchti hain.

**Secret leak ho jaye to use badlo.** Commit hataane se kuch nahi hota — wo har clone mein hai, har fork mein, aur bahut mumkin hai minaton mein kisi scraper ke database mein. Maan lo wo compromise ho chuka hai, kyunki ho chuka hai.

**Secrets kahan rehne chahiye**

- Secrets manager: AWS Secrets Manager, Doppler, Vault, ya aapke platform ka apna store
- Runtime par environment variables ki tarah inject hon
- **Har environment ke liye alag**, taaki staging production ke data ko chhu na sake

**Wo jaanch jo aam case pakadti hai:** pre-commit hook ya CI scan jo key jaisi strings dhoondhe. Ye adhoora hai aur wahi haadsa pakadta hai jo sach mein hota hai — kisi ne debug karte waqt key config file mein paste ki aur bhool gaya.

**\`.env.example\`** git mein hona chahiye: variable ke naamon ki list placeholder values ke saath. Ye batata hai kya chahiye bina kuch leak kiye, aur isi se agle insaan ko pata chalta hai kya set karna hai.`,
      codeExample: `// Parse and validate at boot. Crash loudly rather than start broken.
import { z } from 'zod';

const Env = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
});

const parsed = Env.safeParse(process.env);
if (!parsed.success) {
  console.error('Invalid configuration:', parsed.error.flatten().fieldErrors);
  process.exit(1);          // refuse to start — this is the correct outcome
}
export const env = parsed.data;

// .env.example — committed, documents what is needed, leaks nothing
// DATABASE_URL=postgresql://user:password@localhost:5432/app
// JWT_SECRET=generate-with-openssl-rand-base64-32`,
      commonMistakes: [
        'Committing a real .env. Deleting the commit does not undo it — the only fix is rotating the secret.',
        'Reading process.env deep inside the app, so a missing variable surfaces on a user request rather than at boot.',
        'Putting a secret behind a VITE_ or NEXT_PUBLIC_ prefix, which publishes it to every visitor.',
        'Sharing one set of credentials across staging and production, so a staging bug can destroy real data.',
      ],
      interviewQuestions: [
        'Why validate environment variables at startup?',
        'A secret was committed and then deleted. Is it safe?',
        'Why can a frontend never hold an API secret?',
        'What belongs in .env.example versus .env?',
      ],
      practiceQuestions: [
        'Add startup validation to a project and delete every fallback default for a required secret.',
        'Set up a pre-commit hook that blocks key-shaped strings.',
      ],
      tags: ['deployment', 'security', 'config', 'must-know'],
    },

    {
      slug: 'deploy-ci-cd',
      title: 'CI/CD pipelines',
      difficulty: 'MEDIUM',
      summary: 'CI proves the change is safe. CD gets it to users. The pipeline is what lets you deploy on a Friday without fear.',
      summaryHi: 'CI sabit karta hai ki badlav surakshit hai. CD use users tak pahunchata hai. Pipeline hi wo cheez hai jisse aap bina dar ke shukravaar ko deploy kar sakte ho.',
      content: `**Continuous Integration** — every push runs the checks. **Continuous Delivery** — every passing build is *deployable*. **Continuous Deployment** — every passing build actually *deploys*.

Most teams want CI plus continuous delivery, and press a button for production.

**A sensible pipeline, in order and for a reason**

\`\`\`
install → lint → typecheck → unit tests → build → integration tests → deploy
\`\`\`

**Cheapest checks first.** Lint and typecheck take seconds; integration tests take minutes. Fail fast, so the developer gets told about a typo in thirty seconds rather than eight minutes.

**What makes a pipeline actually useful**

- **Fast.** Over ten minutes and people stop waiting for it, start merging on hope, and the pipeline becomes decoration.
- **Reliable.** A test that fails randomly is worse than no test — teams learn to re-run rather than read, and then miss the real failure.
- **Same artefact everywhere.** Build once, deploy that exact build to staging and then production.
- **Cache dependencies.** Reinstalling node_modules every run is usually most of the runtime.

**Branch protection is the part that matters**

CI that can be bypassed is a suggestion. Require the checks to pass before merge, or you are relying on discipline at exactly the moment someone is in a hurry.

**Deployment strategies, and their trade-offs**

- **Rolling** — replace instances gradually. Simple, but two versions run at once, so your database schema must work with both.
- **Blue-green** — run the new version alongside, switch traffic, keep the old one warm. Instant rollback; costs double the infrastructure during the switch.
- **Canary** — send 5% of traffic to the new version, watch the error rate, proceed or roll back. Best safety, most machinery.

**The one everybody underestimates:** during any of these, **two versions of your code are live simultaneously**. That is fine for most changes and a genuine problem for schema changes, which is why migrations get their own topic.

**Secrets in CI** are as sensitive as production secrets. A pipeline with deploy credentials is a target, and anyone who can merge a workflow file can exfiltrate them.`,
      contentHi: `**Continuous Integration** — har push par jaanch chalti hai. **Continuous Delivery** — har pass hua build *deploy hone layak* hai. **Continuous Deployment** — har pass hua build sach mein *deploy ho jata hai*.

Zyadatar teams ko CI aur continuous delivery chahiye, aur production ke liye ek button dabana.

**Samajhdaar pipeline, kram mein aur wajah ke saath**

\`\`\`
install → lint → typecheck → unit tests → build → integration tests → deploy
\`\`\`

**Sabse saste check pehle.** Lint aur typecheck second lete hain; integration tests minute. Jaldi fail ho, taaki developer ko typo ka pata tees second mein chale, aath minute mein nahi.

**Pipeline ko sach mein kaam ka kya banata hai**

- **Tez.** Das minute se upar aur log uska intezaar karna chhod dete hain, ummeed par merge karne lagte hain, aur pipeline sajawat ban jati hai.
- **Bharosemand.** Kabhi bhi fail hone wala test na hone se bura hai — teams padhne ki jagah dobara chalana seekh jati hain, aur phir asli failure chhoot jata hai.
- **Har jagah wahi artefact.** Ek baar build, wahi build staging par phir production par.
- **Dependencies cache karo.** Har baar node_modules install karna aksar poore waqt ka zyadatar hissa hota hai.

**Branch protection wo hissa hai jo matter karta hai**

Jis CI ko bypass kiya ja sake wo sirf sujhav hai. Merge se pehle checks pass hona zaroori karo, warna aap theek us pal anushasan par nirbhar ho jab kisi ko jaldi hai.

**Deployment ke tareeke, aur unke saude**

- **Rolling** — instances dheere-dheere badlo. Simple, par do version ek saath chalte hain, isliye aapka database schema dono ke saath chalna chahiye.
- **Blue-green** — naya version saath mein chalao, traffic switch karo, purana garam rakho. Turant rollback; switch ke dauran dugni infrastructure ka kharch.
- **Canary** — 5% traffic naye version par bhejo, error rate dekho, aage badho ya wapas jao. Sabse achhi suraksha, sabse zyada saamaan.

**Jise sab kam aankte hain:** inme se kisi ke bhi dauran **aapke code ke do version ek saath live hote hain**. Zyadatar badlavon ke liye ye theek hai aur schema badlav ke liye asli samasya, isiliye migrations ka apna topic hai.

**CI ke secrets** production ke secrets jitne hi sanvedansheel hain. Jis pipeline ke paas deploy ke credentials hain wo nishana hai, aur jo koi workflow file merge kar sakta hai wo unhe nikaal sakta hai.`,
      codeExample: `# .github/workflows/ci.yml — cheapest checks first, fail fast
name: CI
on: [push, pull_request]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm            # usually the single biggest time saving

      - run: npm ci
      - run: npm run lint       # seconds
      - run: npm run typecheck  # seconds
      - run: npm test           # a minute
      - run: npm run build      # build ONCE

      - uses: actions/upload-artifact@v4
        with: { name: dist, path: dist }   # promote this exact build onward`,
      commonMistakes: [
        'A pipeline slower than ten minutes, which people stop waiting for and start merging around.',
        'Flaky tests. Teams learn to re-run rather than read, and then miss a real failure.',
        'Rebuilding for each environment instead of promoting one artefact.',
        'CI that is not required to pass before merge — that is a suggestion, not a gate.',
      ],
      interviewQuestions: [
        'Difference between continuous delivery and continuous deployment?',
        'Why order pipeline steps cheapest-first?',
        'Compare rolling, blue-green and canary deployments.',
        'Why is a flaky test worse than no test?',
      ],
      practiceQuestions: [
        'Add a CI pipeline with lint, typecheck, test and build, and require it before merge.',
        'Measure your pipeline duration and cut the slowest step in half.',
      ],
      tags: ['deployment', 'ci-cd', 'devops', 'must-know'],
    },

    {
      slug: 'deploy-zero-downtime',
      title: 'Zero-downtime releases',
      difficulty: 'MEDIUM',
      summary: 'Two versions of your code will run at the same time. Every backward-incompatible change has to be split into steps that tolerate that.',
      summaryHi: 'Aapke code ke do version ek saath chalenge. Har aisa badlav jo peeche se mel na khaye, use aise kadamon mein baantna padta hai jo ise jhel sakein.',
      content: `Deploying without dropping requests requires the new version to start, prove itself healthy, and only then receive traffic — while the old one drains its in-flight work before stopping.

**The four requirements**

1. **A health endpoint** that means "ready to serve", not just "process started". A server that is up but cannot reach the database should fail it.
2. **Graceful shutdown.** On \`SIGTERM\`: stop accepting new connections, finish in-flight requests, close database pools, then exit. Without this, a deploy kills requests mid-flight and users see errors.
3. **The load balancer must stop routing before the process stops.** Otherwise there is a window where traffic arrives at something that is shutting down.
4. **Idempotent startup.** Two instances starting at once must not fight — no "run migrations on boot" without a lock.

**The constraint that dominates everything: both versions run at once**

For a few seconds or minutes, requests are served by old and new code simultaneously. That is fine for most changes and fatal for the wrong ones.

**Renaming a database column, done safely — four deploys**

1. **Add** the new column. Old code ignores it; new code has not shipped.
2. **Write to both**, read from the old. Now data exists in both places.
3. **Read from the new**, still writing both. If this breaks, step back with no data loss.
4. **Drop the old column** once nothing references it.

Doing it in one step means the moment the migration runs, the still-running old version queries a column that no longer exists — and every request it serves fails until it is replaced.

**The same shape applies to API changes.** Add the new field before requiring it. Accept both shapes during the transition. Remove the old one only when nothing sends it — and "nothing" includes mobile apps you cannot force people to update.

**Feature flags decouple deploy from release.** Ship the code dark, turn it on for yourself, then a percentage, then everyone. If it misbehaves you flip a flag instead of doing an emergency deploy — a far faster and far calmer path.

The cost is real: flags accumulate, and a codebase with fifty stale flags is genuinely hard to reason about. Delete them once the decision is made.`,
      contentHi: `Bina request girae deploy karne ke liye naye version ko chalna hai, apne aap ko theek sabit karna hai, aur tabhi traffic lena hai — jabki purana apna baaki kaam poora karke rukta hai.

**Chaar shartein**

1. **Health endpoint** jiska matlab ho "serve karne ko taiyar", sirf "process chal gaya" nahi. Jo server chal raha ho par database tak na pahunch sake, use fail hona chahiye.
2. **Graceful shutdown.** \`SIGTERM\` par: nayi connections lena band karo, chal rahi requests poori karo, database pools band karo, phir exit. Iske bina deploy beech mein requests maar deta hai aur users ko error dikhta hai.
3. **Load balancer ko process rukne se pehle routing band karni chahiye.** Warna ek aisi khidki bachti hai jab traffic band ho rahi cheez par pahunchta hai.
4. **Idempotent startup.** Ek saath do instances chalein to ladna nahi chahiye — bina lock ke "boot par migrations chalao" nahi.

**Wo shart jo sab par bhaari hai: dono version ek saath chalte hain**

Kuch second ya minute ke liye requests purane aur naye code dono se serve hoti hain. Zyadatar badlavon ke liye theek, aur galat wale ke liye jaanleva.

**Database column surakshit tareeke se rename karna — chaar deploy**

1. Naya column **jodo**. Purana code use ginta nahi; naya abhi gaya nahi.
2. **Dono mein likho**, purane se padho. Ab data dono jagah hai.
3. **Naye se padho**, dono mein likhte hue. Ye toote to bina data khoye peeche haton.
4. Purana column **hatao** jab koi use reference na kare.

Ek hi kadam mein karo to jaise hi migration chalta hai, abhi chal raha purana version aise column ko poochhta hai jo hai hi nahi — aur badle jaane tak uski har request fail hoti hai.

**Yahi shakal API badlav par bhi lagti hai.** Naya field zaroori karne se pehle jodo. Badlav ke dauran dono shape sweekar karo. Purana tabhi hatao jab koi na bheje — aur "koi nahi" mein wo mobile apps bhi hain jinhe aap zabardasti update nahi karwa sakte.

**Feature flags deploy ko release se alag kar dete hain.** Code band karke bhejo, apne liye chalu karo, phir kuch pratishat ke liye, phir sabke liye. Gadbad ho to emergency deploy ki jagah ek flag palat do — kahin tez aur kahin shaant rasta.

Keemat asli hai: flags jamaa hote jate hain, aur pachas purane flags wale codebase ko samajhna sach mein mushkil hai. Faisla ho jane ke baad unhe hata do.`,
      codeExample: `// Graceful shutdown — without this, a deploy kills in-flight requests
const server = app.listen(env.PORT);

let shuttingDown = false;

// The health check must report "not ready" BEFORE the process stops,
// so the load balancer takes this instance out of rotation first.
app.get('/health', (_req, res) => {
  if (shuttingDown) return res.status(503).json({ ok: false });
  res.json({ ok: true });
});

async function shutdown(signal: string) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(\`\${signal} received — draining\`);

  // Give the load balancer time to notice the failing health check
  await new Promise((r) => setTimeout(r, 5_000));

  server.close(async () => {          // finish in-flight requests
    await prisma.$disconnect();
    process.exit(0);
  });

  // Do not hang forever if something refuses to close
  setTimeout(() => process.exit(1), 30_000).unref();
}

process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));`,
      commonMistakes: [
        'Renaming or dropping a column in one deploy, breaking every request the old version serves until it is replaced.',
        'No graceful shutdown, so each deploy drops in-flight requests and users see errors.',
        'A health check that only proves the process started, so broken instances keep receiving traffic.',
        'Feature flags that are never removed, leaving a codebase nobody can reason about.',
      ],
      interviewQuestions: [
        'How do you rename a database column with zero downtime?',
        'What does graceful shutdown need to do, and in what order?',
        'Why do two versions of your code run simultaneously during a deploy?',
        'How do feature flags change the risk profile of a release?',
      ],
      practiceQuestions: [
        'Add SIGTERM handling and a draining health check to an Express app.',
        'Write the four-step plan for renaming a column in a live system.',
      ],
      tags: ['deployment', 'operations', 'must-know'],
    },

    {
      slug: 'deploy-observability',
      title: 'Logging, metrics and alerting',
      difficulty: 'MEDIUM',
      summary: 'You cannot fix what you cannot see. Structured logs, a few real metrics, and alerts that only fire when a human must act.',
      summaryHi: 'Jo dikh nahi raha use theek nahi kar sakte. Structured logs, kuch asli metrics, aur wahi alerts jo tabhi bajein jab insaan ko kuch karna ho.',
      content: `**The three pillars**

- **Logs** — what happened, in detail
- **Metrics** — numbers over time: request rate, error rate, latency
- **Traces** — one request's journey across services

**Logs must be structured**

\`console.log('user logged in')\` is unsearchable at volume. JSON with fields is queryable:

\`\`\`json
{ "level": "info", "msg": "login", "userId": "u_1", "requestId": "r_9", "durationMs": 42 }
\`\`\`

**A request id threading through every line** is the single highest-value logging practice. When a user reports a problem at 14:32, one id takes you to exactly their requests instead of a timestamp search through everyone's.

**Never log secrets, passwords, tokens or full card numbers.** Logs are retained for months, shipped to third-party services, and read by people who do not need that data. Redact at the logger, not at each call site, because someone will forget.

**The four metrics worth having first**

1. **Request rate** — how much traffic
2. **Error rate** — what fraction is failing
3. **Latency, as p50/p95/p99** — never the average
4. **Saturation** — CPU, memory, connection pool usage

**Why percentiles, not averages:** an average of 200ms can hide that 5% of users wait eight seconds. The average is the number that looks fine while people are leaving.

**Alerting: alert on symptoms, not causes**

Alert on *"error rate above 5% for five minutes"* — something users feel. Not on *"CPU above 80%"*, which may be entirely fine.

**Every alert must be actionable.** If the answer is "yeah, that happens", it is not an alert, it is noise — and noise trains people to ignore the page that actually matters. Alert fatigue is not a minor annoyance; it is how outages get missed.

**Health checks, two kinds**

- **Liveness** — is the process alive? If not, restart it.
- **Readiness** — can it serve? If not, take it out of rotation but leave it running.

Conflating them causes restart loops: a service that cannot reach the database gets killed and restarted forever, when it should have been left alone to recover.

**The pragmatic minimum:** structured logs with request ids, error tracking (Sentry or similar), uptime monitoring, and one alert on error rate. That is a weekend of work and covers most of what actually goes wrong.`,
      contentHi: `**Teen stambh**

- **Logs** — kya hua, tafseel ke saath
- **Metrics** — samay ke saath numbers: request rate, error rate, latency
- **Traces** — ek request ka services ke paar safar

**Logs structured hone chahiye**

\`console.log('user logged in')\` bade paimane par dhoondha hi nahi ja sakta. Fields wala JSON query ho sakta hai:

\`\`\`json
{ "level": "info", "msg": "login", "userId": "u_1", "requestId": "r_9", "durationMs": 42 }
\`\`\`

**Har line mein guzarta request id** logging ki sabse keemti aadat hai. Jab user 14:32 par samasya bataye, to ek id seedha uski requests tak le jati hai, sabke beech timestamp dhoondhne ki jagah.

**Secrets, passwords, tokens ya poore card number kabhi log mat karo.** Logs mahinon rakhe jate hain, third-party services ko bheje jate hain, aur unhe wo log padhte hain jinhe wo data chahiye hi nahi. Redact logger par karo, har call site par nahi, kyunki koi na koi bhool jayega.

**Pehle rakhne layak chaar metrics**

1. **Request rate** — kitna traffic
2. **Error rate** — kitna hissa fail ho raha hai
3. **Latency, p50/p95/p99 mein** — average kabhi nahi
4. **Saturation** — CPU, memory, connection pool ka istemal

**Percentile kyun, average kyun nahi:** 200ms ka average ye chhupa sakta hai ki 5% users aath second ruk rahe hain. Average wahi number hai jo theek dikhta hai jab log chhod kar ja rahe hote hain.

**Alerting: lakshan par alert karo, kaaran par nahi**

Alert karo *"error rate paanch minute tak 5% se upar"* par — jise users mehsoos karte hain. *"CPU 80% se upar"* par nahi, jo bilkul theek ho sakta hai.

**Har alert par kuch karna banta ho.** Agar jawab "haan, aisa hota rehta hai" hai, to wo alert nahi shor hai — aur shor logon ko us page ko nazarandaz karna sikha deta hai jo sach mein matter karta hai. Alert fatigue chhoti chidh nahi hai; isi tarah outages chhoot jate hain.

**Health checks, do kism**

- **Liveness** — process zinda hai? Nahi to restart karo.
- **Readiness** — serve kar sakta hai? Nahi to rotation se hatao par chalta rehne do.

Inhe ghula dena restart loop banata hai: jo service database tak nahi pahunch pa rahi use maara aur chalaya jata rahega, jabki use chhod dena chahiye tha taaki wo sambhal jaye.

**Practical kam se kam:** request id wale structured logs, error tracking (Sentry ya waisa), uptime monitoring, aur error rate par ek alert. Ye ek weekend ka kaam hai aur jo sach mein bigadta hai uska zyadatar hissa dhak leta hai.`,
      codeExample: `import pino from 'pino';

const logger = pino({
  // Redact at the logger — someone will forget to do it at a call site
  redact: ['req.headers.authorization', 'req.headers.cookie', '*.password', '*.token'],
});

// One id per request, threaded through every log line it produces
app.use((req, _res, next) => {
  req.id = req.headers['x-request-id'] ?? crypto.randomUUID();
  req.log = logger.child({ requestId: req.id });
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    req.log.info({
      method: req.method,
      path: req.route?.path ?? req.path,   // the ROUTE, not the URL — /users/:id
      status: res.statusCode,              // else every id becomes its own metric
      durationMs: Date.now() - start,
    });
  });
  next();
});`,
      commonMistakes: [
        'Unstructured logs, which are unsearchable once there is real volume.',
        'Logging tokens or passwords, which then sit in a third-party service for months.',
        'Watching averages instead of p95/p99, so a badly-affected minority is invisible.',
        'Alerting on causes like CPU rather than symptoms like error rate, producing noise that trains people to ignore alerts.',
      ],
      interviewQuestions: [
        'Why are structured logs better than plain strings?',
        'Why look at p99 latency rather than the average?',
        'Difference between liveness and readiness probes?',
        'What makes a good alert?',
      ],
      practiceQuestions: [
        'Add request-id logging to an API and trace one request end to end.',
        'Write one alert rule that would have caught your last outage, and no others.',
      ],
      tags: ['deployment', 'observability', 'operations', 'must-know'],
    },

    {
      slug: 'deploy-migrations-in-production',
      title: 'Database migrations in production',
      difficulty: 'HARD',
      summary: 'The riskiest routine thing you will do. Locks, long-running changes and irreversible steps — plus how to make each one safe.',
      summaryHi: 'Wo sabse khatarnaak rozmarra kaam jo aap karoge. Locks, lambe chalne wale badlav aur na palat ne wale kadam — aur har ek ko surakshit kaise banayein.',
      content: `A migration that is instant on your laptop with 50 rows can lock a 50-million-row table for minutes in production. That difference is where outages come from.

**Which operations are safe, and which are not**

| Operation | In Postgres |
|---|---|
| \`ADD COLUMN\` (nullable, no default) | **safe** — metadata only |
| \`ADD COLUMN ... DEFAULT\` | safe on modern Postgres; a full table rewrite on older versions |
| \`ADD COLUMN NOT NULL\` without default | **rewrites the table** and takes an exclusive lock |
| \`CREATE INDEX\` | **locks writes** — use \`CONCURRENTLY\` |
| \`ALTER COLUMN TYPE\` | usually a rewrite |
| \`DROP COLUMN\` | fast, and **breaks the running old version** |

**The lock queue is the part that surprises people.** A migration waiting for a lock blocks every query that arrives behind it. So a slow migration does not just take a long time — it takes your application down while it waits, even though it has not done anything yet.

Set \`lock_timeout\` so a migration that cannot get its lock quickly **fails instead of queuing**. Failing a deploy is a much better outcome than a silent outage.

**Adding a NOT NULL column safely — four steps**

1. Add the column **nullable**
2. **Backfill in batches**, with a pause between them, so you never hold one enormous transaction
3. Add a \`NOT VALID\` check constraint, then \`VALIDATE\` it (this takes a weaker lock)
4. Only then set \`NOT NULL\`

Doing it in one statement rewrites the whole table under an exclusive lock.

**Always separate schema changes from code deploys**

Schema first, in a backward-compatible way. Code second. That ordering is what lets the old version keep working while the new one rolls out.

**Never edit an applied migration.** Write a new one that corrects it. Editing means your machine and production silently disagree about what the schema is, and nothing will tell you until something breaks.

**Backfills belong outside migrations.** A migration should be fast and structural. Moving millions of rows belongs in a script you can monitor, pause and resume — not in something that holds a transaction open and blocks deploys.

**Before anything destructive: take a backup and know how long a restore takes.** An untested backup is a belief, not a plan. The number you need is the restore time, because that is your actual worst case.`,
      contentHi: `Jo migration aapke laptop par 50 rows ke saath turant chalti hai, wo production mein 5 crore rows wali table ko kai minute lock kar sakti hai. Outage isi farak se aate hain.

**Kaunse operation surakshit hain, kaunse nahi**

| Operation | Postgres mein |
|---|---|
| \`ADD COLUMN\` (nullable, bina default) | **surakshit** — sirf metadata |
| \`ADD COLUMN ... DEFAULT\` | aaj ke Postgres mein surakshit; purane versions mein poori table dobara likhi jati hai |
| Bina default \`ADD COLUMN NOT NULL\` | **table dobara likhta hai** aur exclusive lock leta hai |
| \`CREATE INDEX\` | **writes lock karta hai** — \`CONCURRENTLY\` use karo |
| \`ALTER COLUMN TYPE\` | aksar dobara likhna |
| \`DROP COLUMN\` | tez, aur **chal rahe purane version ko tod deta hai** |

**Lock ki line wo hissa hai jo chaunkata hai.** Lock ka intezaar karti migration apne peeche aane wali har query rok deti hai. Isliye dheemi migration sirf lamba waqt nahi leti — wo intezaar ke dauran hi aapki application band kar deti hai, halanki usne abhi kuch kiya bhi nahi.

\`lock_timeout\` set karo taaki jo migration jaldi lock na le sake wo **line mein lagne ki jagah fail ho jaye**. Deploy ka fail hona chupchaap outage se kahin behtar natija hai.

**NOT NULL column surakshit tareeke se jodna — chaar kadam**

1. Column **nullable** jodo
2. **Batches mein backfill** karo, beech mein ruk kar, taaki ek vishaal transaction kabhi na pakdo
3. \`NOT VALID\` check constraint jodo, phir use \`VALIDATE\` karo (ismein halka lock lagta hai)
4. Tabhi \`NOT NULL\` set karo

Ek hi statement mein karne par poori table exclusive lock ke neeche dobara likhi jati hai.

**Schema badlav ko code deploy se hamesha alag rakho**

Pehle schema, aise tareeke se jo peeche se mel khaye. Phir code. Isi kram se purana version chalta rehta hai jab naya nikal raha hota hai.

**Lagi hui migration kabhi mat badlo.** Use theek karne ke liye nayi likho. Badalne ka matlab hai ki aapki machine aur production chupchaap alag schema maan rahe hain, aur kuch tootne tak koi nahi batayega.

**Backfill migrations ke bahar hone chahiye.** Migration tez aur dhanche wali honi chahiye. Karodon rows hilana us script ka kaam hai jise aap dekh sako, rok sako aur dobara chala sako — us cheez ka nahi jo transaction khuli rakhe aur deploys rok de.

**Kisi bhi na palat ne wale kadam se pehle: backup lo aur jaano ki restore mein kitna waqt lagta hai.** Bina test kiya backup ek vishwas hai, yojna nahi. Jo number chahiye wo restore ka waqt hai, kyunki aapka asli sabse bura haal wahi hai.`,
      codeExample: `-- Fail fast rather than queueing behind a lock and taking the app down
SET lock_timeout = '3s';
SET statement_timeout = '30s';

-- Index without blocking writes (cannot run inside a transaction)
CREATE INDEX CONCURRENTLY idx_orders_user ON orders (user_id);

-- Adding NOT NULL safely, in four steps rather than one rewrite
-- 1. nullable, instant
ALTER TABLE orders ADD COLUMN currency TEXT;

-- 2. backfill in batches, outside the migration, with pauses
UPDATE orders SET currency = 'INR'
WHERE currency IS NULL AND id IN (
  SELECT id FROM orders WHERE currency IS NULL LIMIT 10000
);

-- 3. validate without a long exclusive lock
ALTER TABLE orders ADD CONSTRAINT currency_present
  CHECK (currency IS NOT NULL) NOT VALID;
ALTER TABLE orders VALIDATE CONSTRAINT currency_present;

-- 4. now cheap, because the constraint already proved it
ALTER TABLE orders ALTER COLUMN currency SET NOT NULL;`,
      commonMistakes: [
        'CREATE INDEX without CONCURRENTLY on a large table, blocking writes for the duration.',
        'No lock_timeout, so a migration queues behind a long transaction and takes the application down while waiting.',
        'Backfilling millions of rows inside a migration, holding a transaction open and blocking deploys.',
        'Testing migrations only against a small development database, where every operation looks instant.',
      ],
      interviewQuestions: [
        'Which schema changes take locks in Postgres?',
        'How do you add a NOT NULL column to a large table safely?',
        'Why set lock_timeout on migrations?',
        'Why should schema changes deploy separately from code?',
      ],
      practiceQuestions: [
        'Write the four-step safe version of adding a required column.',
        'Load a table with a million rows and time a plain CREATE INDEX against CONCURRENTLY.',
      ],
      tags: ['deployment', 'database', 'postgresql', 'operations'],
    },

    {
      slug: 'deploy-scaling-and-cost',
      title: 'Scaling and what it costs',
      difficulty: 'MEDIUM',
      summary: 'Scale in order of cost-effectiveness, and know the bill before you commit. Most scaling problems are one index or one cache away.',
      summaryHi: 'Kharch ke hisaab se kram mein scale karo, aur pakka karne se pehle bill jaano. Zyadatar scaling ki samasyaayein ek index ya ek cache door hoti hain.',
      content: `**The order that actually works**

1. **Measure.** Find the real bottleneck. Guessing is usually wrong and always expensive.
2. **Fix the query.** A missing index is behind an astonishing share of "we need to scale".
3. **Cache** what is read often and changes rarely.
4. **Scale vertically.** A bigger machine is one click and no architectural change. Modern hardware goes a long way.
5. **Scale horizontally.** More machines, which requires statelessness.
6. **Read replicas** for read-heavy workloads.
7. **Queues** to move slow work off the request path.
8. **Shard** — last, and rarely.

Most teams jump to step 5 or 8 and skip 1 to 3, which is how you end up with a distributed system that is still slow.

**The costs people do not budget for**

- **Egress.** Data *leaving* a cloud is charged, often heavily, and it is the line item that surprises people on their first big month. Serving images directly from a server instead of a CDN is a classic way to discover this.
- **Managed database.** Usually the largest single line, and worth it — you are buying backups, failover and patching.
- **Idle capacity.** Servers provisioned for peak sit idle most of the day.
- **Observability.** Log volume pricing scales with traffic and can rival compute if you log every request body.
- **Your own time.** Cheaper infrastructure that costs a day a week is not cheaper.

**A rough sense of proportion**

An application serving a few hundred requests per second, on one decent server with a managed database and a CDN, typically costs tens of dollars a month — not thousands. If your bill is much larger than that at that scale, something is misconfigured rather than genuinely expensive.

**Practical cost control**

- Put a **CDN** in front of everything static. It reduces egress and latency at once.
- **Compress** responses.
- **Set log retention.** Nobody reads 90-day-old debug logs, and you are paying to keep them.
- **Right-size** after measuring rather than provisioning for an imagined peak.
- **Set a billing alert.** Not a limit — an alert. The failure mode is a runaway loop or an unindexed query costing money for a week before anyone notices.

**The judgement to carry:** premature scaling has the same shape as premature optimisation. It costs money now, adds failure modes now, and defends against a load you may never see.`,
      contentHi: `**Wo kram jo sach mein chalta hai**

1. **Naapo.** Asli rukavat dhoondho. Andaza aksar galat hota hai aur hamesha mehnga.
2. **Query theek karo.** "Hume scale karna hai" ka hairaan karne wala hissa ek chhoote hue index ke peeche hota hai.
3. Jo baar-baar padha jaye aur kam badle use **cache** karo.
4. **Vertically scale karo.** Badi machine ek click hai aur koi architecture badlav nahi. Aaj ka hardware bahut door tak le jata hai.
5. **Horizontally scale karo.** Zyada machines, jiske liye statelessness chahiye.
6. Read-heavy kaam ke liye **read replicas**.
7. Dheema kaam request ke raste se hataane ke liye **queues**.
8. **Shard** — aakhir mein, aur kam hi.

Zyadatar teams kadam 5 ya 8 par kood jati hain aur 1 se 3 chhod deti hain, aur isi tarah aisa distributed system banta hai jo ab bhi dheema hai.

**Wo kharch jinka budget log nahi banate**

- **Egress.** Cloud se data *bahar* jane ka paisa lagta hai, aksar bhaari, aur pehle bade mahine mein yahi line log ko chaunkati hai. CDN ki jagah server se seedha images dena isi ko dhoondhne ka classic tareeka hai.
- **Managed database.** Aksar sabse badi ek line, aur iske laayak — aap backups, failover aur patching khareed rahe ho.
- **Khaali padi kshamta.** Peak ke liye rakhe servers din ka zyadatar hissa khaali baithe rehte hain.
- **Observability.** Log ki maatra ka daam traffic ke saath badhta hai aur har request body log karo to compute ki barabari kar sakta hai.
- **Aapka apna waqt.** Sasta infrastructure jo hafte mein ek din leta hai, sasta nahi hai.

**Anupaat ka mota andaza**

Kuch sau request per second wali application, ek theek server, ek managed database aur ek CDN par, aam taur par mahine ke das-bees dollar leti hai — hazaaron nahi. Us paimane par aapka bill isse kaafi bada hai, to kuch galat set hai, cheez sach mein mehngi nahi.

**Practical kharch kaabu**

- Har static cheez ke aage **CDN** lagao. Isse egress aur latency dono kam hote hain.
- Responses **compress** karo.
- **Log retention set karo.** 90 din purane debug logs koi nahi padhta, aur unhe rakhne ka paisa lag raha hai.
- Naapne ke baad **sahi size** chuno, kalpit peak ke liye pehle se mat rakho.
- **Billing alert lagao.** Limit nahi — alert. Nakaami ka tareeka ye hai ki koi bhaagta loop ya bina index wali query hafte bhar paisa khaati rahe aur kisi ko pata na chale.

**Rakhne layak samajh:** samay se pehle scaling ki shakal samay se pehle optimisation jaisi hi hai. Ye abhi paisa leti hai, abhi tootne ki jagah badhati hai, aur us load se bachati hai jo shayad kabhi aayega hi nahi.`,
      commonMistakes: [
        'Adding servers when a missing index was the problem — now you pay more for the same slow query.',
        'Serving images and video from the application server, discovering egress pricing the hard way.',
        'Provisioning for an imagined peak and paying for idle capacity every hour of every day.',
        'Retaining every log forever, so observability quietly becomes one of the largest bills.',
      ],
      interviewQuestions: [
        'In what order would you scale an application?',
        'What are the cloud costs people typically forget?',
        'When is vertical scaling the better answer?',
        'Why is premature scaling a problem?',
      ],
      practiceQuestions: [
        'Estimate the monthly cost of your app at 10x current traffic, line by line.',
        'Find your largest cloud line item and work out what would reduce it.',
      ],
      tags: ['deployment', 'scaling', 'cost', 'operations'],
    },

    {
      slug: 'deploy-incidents-and-rollback',
      title: 'When it breaks: rollback and incident response',
      difficulty: 'HARD',
      summary: 'Stop the bleeding first, understand it second. Rollback should be one command, and the post-mortem should blame the system, not the person.',
      summaryHi: 'Pehle khoon rokо, samajhna baad mein. Rollback ek command hona chahiye, aur post-mortem mein insaan nahi system ko zimmedar thehrao.',
      content: `**The order under pressure**

1. **Mitigate.** Restore service. Roll back, disable the feature flag, scale up, whatever stops the harm.
2. **Communicate.** Post a status update early. "We are investigating" costs nothing and prevents a support flood.
3. **Diagnose.** *After* users are served again.
4. **Write it up.** Within a couple of days, while it is fresh.

The most common failure is doing 3 before 1 — debugging an interesting problem while users cannot log in. **Fix first, understand later** is not intellectually satisfying and it is correct.

**Rollback must be trivial**

If rolling back is hard, people will avoid it and try to fix forward under pressure, which is how a five-minute incident becomes a two-hour one.

- Keep the previous build ready to deploy
- **Blue-green** makes rollback a traffic switch
- **Feature flags** make it a toggle, with no deploy at all

**The thing that cannot be rolled back is the database.** Code rolls back in seconds; a dropped column does not. That asymmetry is exactly why migrations are done in backward-compatible steps — so you can always roll the code back without the schema disagreeing.

**Blameless post-mortems**

Write what happened, when, what the impact was, and what will change. **Do not name whoever pressed the button.**

Not out of politeness — for accuracy. If people expect blame, they hide information, and you lose the details that would have prevented the next one. The useful question is never "who did this" but "**how did the system let this happen**". A human typing the wrong command is a starting point: why was that possible, why did nothing catch it, why did it take twenty minutes to notice?

**Two numbers worth tracking**

- **MTTD** — mean time to *detect*. Usually the bigger and more improvable half.
- **MTTR** — mean time to *recover*.

If you found out because a customer emailed, the problem is monitoring, not the bug.

**Practical preparation**

- A **runbook** for common failures, written before you need it
- One person as **incident commander** so decisions are actually made
- Know how long a **restore** takes — and have tried it at least once. An untested backup is a belief, not a plan.
- **Practise a rollback** on a quiet afternoon so nobody is learning the procedure at 3am.`,
      contentHi: `**Dabav mein kram**

1. **Rok o.** Seva bahal karo. Rollback karo, feature flag band karo, scale up karo — jo bhi nuksaan roke.
2. **Batao.** Status update jaldi daalo. "Hum dekh rahe hain" kuch nahi leta aur support ki baadh rok deta hai.
3. **Wajah dhoondho.** Users ko seva milne ke *baad*.
4. **Likho.** Do-teen din mein, jab tak taaza hai.

Sabse aam nakaami 1 se pehle 3 karna hai — ek dilchasp samasya debug karte rehna jab users login hi nahi kar pa rahe. **Pehle theek karo, samjho baad mein** bauddhik roop se santosh nahi deta aur sahi hai.

**Rollback bilkul aasan hona chahiye**

Rollback mushkil hoga to log usse bachenge aur dabav mein aage badh kar theek karne ki koshish karenge, aur isi tarah paanch minute ka incident do ghante ka ban jata hai.

- Pichhla build deploy ke liye tayaar rakho
- **Blue-green** rollback ko traffic switch bana deta hai
- **Feature flags** ise ek toggle bana dete hain, deploy ki zaroorat hi nahi

**Jo rollback nahi ho sakta wo database hai.** Code second mein wapas chala jata hai; hata diya gaya column nahi. Yahi asamaanta wo wajah hai ki migrations peeche se mel khane wale kadamon mein hoti hain — taaki aap code hamesha wapas le ja sako aur schema asahmat na ho.

**Bina dosh ke post-mortem**

Likho kya hua, kab hua, asar kya tha, aur kya badlega. **Button dabane wale ka naam mat likho.**

Shishtachar ke liye nahi — sachai ke liye. Log dosh ki ummeed karenge to jaankari chhupayenge, aur aap wahi tafseel kho denge jo agli baar bachati. Kaam ka sawaal kabhi "ye kisne kiya" nahi hota, balki "**system ne ye hone kaise diya**" hota hai. Kisi insaan ka galat command likhna shuruaat hai: ye mumkin kyun tha, kisi ne pakda kyun nahi, pata chalne mein bees minute kyun lage?

**Do number rakhne layak**

- **MTTD** — pata chalne mein औsat samay. Aksar bada aur zyada sudhaarne layak aadha hissa.
- **MTTR** — theek hone mein औsat samay.

Aapko pata customer ke email se chala, to samasya monitoring hai, bug nahi.

**Practical tayyari**

- Aam nakaamiyon ke liye **runbook**, zaroorat padne se pehle likha hua
- Ek insaan **incident commander**, taaki faisle sach mein hon
- **Restore** mein kitna waqt lagta hai ye jaano — aur kam se kam ek baar kar ke dekha ho. Bina test kiya backup vishwas hai, yojna nahi.
- Kisi shaant dopahar mein **rollback ka abhyas** karo taaki raat 3 baje koi tareeka seekh na raha ho.`,
      commonMistakes: [
        'Debugging before mitigating, leaving users broken while you investigate an interesting problem.',
        'A rollback procedure nobody has ever run, discovered to be broken at the worst moment.',
        'Post-mortems that name a person, which teaches everyone to withhold information next time.',
        'Backups that have never been restored — you have a belief, not a recovery plan.',
      ],
      interviewQuestions: [
        'Walk me through what you do in the first ten minutes of an outage.',
        'Why can code be rolled back but a migration usually cannot?',
        'What makes a post-mortem blameless, and why does that matter practically?',
        'What is MTTD and why is it often the more improvable number?',
      ],
      practiceQuestions: [
        'Write a runbook for your most likely failure.',
        'Time a full database restore from your latest backup.',
      ],
      tags: ['deployment', 'operations', 'incidents', 'must-know'],
    },
  ],
};
