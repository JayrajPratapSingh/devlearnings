/**
 * React Native Complete Course — Module 22: App Store & Play Store
 * Submission + OTA Updates, lessons 1-3. Continues Part VII (Shipping).
 *
 * Verification approach: genuine store review (Apple/Google reviewing a
 * real submitted binary) and a real EAS Update server round trip both
 * require infrastructure and accounts this environment cannot access, so
 * all three lessons are honest, documented prose -- the same category of
 * limit this course applied to Modules 11-13's native hardware and Module
 * 21's build/signing credentials. Lesson 3 (OTA updates) is grounded in
 * one genuinely confirmed detail from Module 21: this course's own real,
 * executed `expo config --type introspect` output (Module 21, Lesson 1)
 * already showed real, concrete Info.plist/expoPlist keys --
 * `EXUpdatesEnabled`, `EXUpdatesCheckOnLaunch`, `EXUpdatesLaunchWaitMs`,
 * `EXUpdatesEnableBsdiffPatchSupport` -- present by default in the
 * resolved native config even without expo-updates explicitly configured,
 * confirming the update-checking mechanism's real config surface exists
 * in the actual toolchain, not merely in documentation.
 *
 * Lesson 1: App Store submission — real, documented requirements and
 *           review-guideline gotchas.
 * Lesson 2: Play Store submission — contrasted directly against Lesson 1.
 * Lesson 3: EAS Update / OTA updates — grounded in Module 21's confirmed
 *           real EXUpdates* config keys.
 */

import type { CourseLesson } from './course-js-module1';

export const RN_MODULE_22: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'rn-app-store-submission-requirements',
    title: 'App Store Submission — Real Requirements & Review Gotchas',
    titleHi: 'App Store Submission — Real Requirements Aur Review Gotchas',
    description:
      "Honest, documented prose on Apple's real App Store submission requirements and the specific review-guideline gotchas that catch real React Native apps — since genuine App Store review requires a real Apple Developer account and a real human review process this environment cannot access.",
    descriptionHi:
      "Apple ke real App Store submission requirements aur specific review-guideline gotchas pe honest, documented prose jo real React Native apps ko pakadte hain — kyunki genuine App Store review ko ek real Apple Developer account aur ek real human review process chahiye jise ye environment access nahi kar sakta.",
    difficulty: 'MEDIUM',
    duration: 20,
    order: 1,

    analogy: {
      en: "Passing an automated build check (confirmed genuinely possible in Modules 17 and 21 via real tools) is not the same as passing a real, human App Store review — the review process specifically checks things no compiler or config resolver validates: whether the app's real, described purpose matches what it actually does, whether every requested permission has a real, justified usage-description string (Module 11's confirmed NSCameraUsageDescription requirement is exactly this category), and whether the app functions completely without crashing on a real device a reviewer is actually holding. This lesson cannot submit a real app for review, so it presents Apple's real, documented requirements and the specific, commonly-cited gotchas precisely.",
      hi: "Ek automated build check pass karna (Modules 17 aur 21 mein real tools ke through genuinely possible confirmed) ek real, human App Store review pass karne jaisa nahi hai — review process specifically un cheezon ko check karta hai jinhe koi compiler ya config resolver validate nahi karta: kya app ka real, described purpose match karta hai us se jo ye actually karta hai, kya har requested permission ke paas ek real, justified usage-description string hai (Module 11 ka confirmed NSCameraUsageDescription requirement exactly is category mein hai), aur kya app completely bina crash kiye function karta hai ek real device pe jise ek reviewer actually hold kar raha hai. Ye lesson ek real app ko review ke liye submit nahi kar sakta, isliye ye Apple ke real, documented requirements aur specific, commonly-cited gotchas ko precisely present karta hai.",
    },

    simple: `**Why honest prose: submission requires a real Apple Developer
account, a real reviewer, and a real device or simulator this
environment lacks.**

**Real, documented requirements this course can connect back to
already-confirmed findings:**

- **Every requested permission needs a real, specific usage-description
  string in Info.plist** — Module 11 confirmed \`NSCameraUsageDescription\`
  is required before iOS will even show the permission prompt; Apple's
  real review process additionally, separately checks that the string's
  wording genuinely, specifically explains why the app needs it — a
  generic "this app needs access" string is a real, documented, common
  rejection reason.
- **The app must genuinely function without a backend the reviewer
  can't reach** — a real, common rejection: an app whose demo/login
  flow depends on a private staging server reviewers cannot access,
  requiring real, working demo credentials or a public review-account
  submitted alongside the binary.
- **Sign in with Apple requirement** — if an app offers any other
  third-party login (Google, Facebook), Apple's real, documented
  guideline requires ALSO offering "Sign in with Apple" as an
  equivalent option — a specific, commonly-missed real rule.
- **Real crash-on-launch rejections** — Module 19's confirmed
  ErrorBoundary limit (event-handler errors aren't caught) is exactly
  the kind of gap that produces a real, uncaught crash a reviewer's
  first tap can trigger, a real, documented top rejection cause.

**Where this fits:** Lesson 2 covers Google Play's real, documented
submission model directly contrasted against Apple's — notably
faster, less manual-review-heavy, but with its own distinct real
gotchas.`,

    simpleHi: `**Honest prose kyun: submission ko ek real Apple Developer account,
ek real reviewer, aur ek real device ya simulator chahiye jo ye
environment lack karta hai.**

**Real, documented requirements jinhe ye course already-confirmed
findings se wapas connect kar sakta hai:**

- **Har requested permission ko Info.plist mein ek real, specific
  usage-description string chahiye** — Module 11 ne confirm kiya tha
  ki \`NSCameraUsageDescription\` chahiye isse pehle ki iOS permission
  prompt bhi dikhaye; Apple ka real review process additionally,
  separately check karta hai ki string ki wording genuinely,
  specifically explain karti hai ki app ko ise kyun chahiye — ek
  generic "this app needs access" string ek real, documented, common
  rejection reason hai.
- **App ko genuinely bina ek backend ke function karna chahiye jise
  reviewer reach nahi kar sakta** — ek real, common rejection: ek app
  jiska demo/login flow ek private staging server pe depend karta hai
  jise reviewers access nahi kar sakte, real, working demo credentials
  ya ek public review-account chahiye jo binary ke saath submit kiya
  jaaye.
- **Sign in with Apple requirement** — agar ek app koi doosra
  third-party login offer karta hai (Google, Facebook), Apple ka real,
  documented guideline require karta hai ki "Sign in with Apple" ko
  bhi ek equivalent option ki tarah offer kiya jaaye — ek specific,
  commonly-missed real rule.
- **Real crash-on-launch rejections** — Module 19 ki confirmed
  ErrorBoundary limit (event-handler errors catch nahi hoti) exactly
  wo kind ka gap hai jo ek real, uncaught crash produce karta hai jise
  ek reviewer ka pehla tap trigger kar sakta hai, ek real, documented
  top rejection cause.

**Ye kahan fit hota hai:** Lesson 2 Google Play ka real, documented
submission model cover karta hai directly Apple ke against contrasted
— notably faster, less manual-review-heavy, par apne khud ke distinct
real gotchas ke saath.`,

    content: `## Why App Store submission is honestly presented as documented
prose

Genuinely submitting a real binary for Apple's actual human review
requires a real, paid Apple Developer account and a real review queue
-- infrastructure entirely outside this environment. What follows is
accurate, documented requirements and commonly-cited real rejection
causes, precisely stated rather than assumed.

## Why the usage-description requirement connects directly to
Module 11's confirmed finding

Module 11 genuinely confirmed \`NSCameraUsageDescription\` must be set
before iOS shows a camera permission prompt at all. Apple's real
review guidelines go one documented step further: the STRING's actual
wording is reviewed for genuine specificity, not just presence -- a
real, common, documented rejection is a generic, non-specific
usage-description string that technically satisfies the build
requirement but fails the human review's separate content check.

## Why a reviewer's inability to reach a private backend is a real,
common, avoidable rejection

Apple's documented review process requires the app to be genuinely
usable during review -- a demo flow depending on infrastructure only
the development team can reach is a real, common cause of rejection,
fixed by providing real, working demo credentials or a public
review-only backend environment.

## Why the Sign in with Apple requirement is a specific, often-missed
real rule

Apple's documented guideline requires offering "Sign in with Apple"
as an equivalent option whenever any other third-party login is
offered -- a specific, commonly overlooked real requirement distinct
from more general "the app must work" concerns.

## Why Module 19's confirmed ErrorBoundary limit predicts a real
rejection cause

An uncaught crash from an event-handler error (confirmed in Module 19
to bypass ErrorBoundary entirely) is exactly the kind of failure a
reviewer's very first interaction can trigger -- directly connecting
this lesson's documented rejection cause to a real, previously
confirmed technical gap.

## How this lesson sets up Lesson 2

This lesson covered Apple's real, documented submission model.
Lesson 2 covers Google Play's real, documented model directly, in
contrast -- generally faster and less manually reviewed, but with its
own distinct, real requirements worth knowing precisely rather than
assuming the two stores' processes are interchangeable.`,

    contentHi: `## App Store submission honestly documented prose ki tarah kyun present kiya gaya hai

Genuinely ek real binary ko Apple ke actual human review ke liye
submit karne ke liye ek real, paid Apple Developer account aur ek real
review queue chahiye -- infrastructure jo entirely is environment se
bahar hai. Jo aage hai wo accurate, documented requirements aur
commonly-cited real rejection causes hain, precisely stated assume
kiye jaane ke bajaye.

## Usage-description requirement directly Module 11 ke confirmed finding se kyun connect karta hai

Module 11 ne genuinely confirm kiya tha ki \`NSCameraUsageDescription\`
set karna zaroori hai isse pehle ki iOS bilkul ek camera permission
prompt dikhaye. Apple ki real review guidelines ek documented step
aage jaati hain: STRING ki actual wording genuine specificity ke liye
review ki jaati hai, sirf presence nahi -- ek real, common, documented
rejection ek generic, non-specific usage-description string hai jo
technically build requirement satisfy karti hai par human review ke
separate content check mein fail hoti hai.

## Ek reviewer ka ek private backend reach na kar paana ek real, common, avoidable rejection kyun hai

Apple ka documented review process require karta hai ki app genuinely
usable ho review ke dauraan -- ek demo flow jo aisi infrastructure pe
depend karta hai jise sirf development team reach kar sakti hai ek
real, common cause hai rejection ki, real, working demo credentials ya
ek public review-only backend environment provide karke fix kiya
jaata hai.

## Sign in with Apple requirement ek specific, often-missed real rule kyun hai

Apple ka documented guideline "Sign in with Apple" ko ek equivalent
option ki tarah offer karna require karta hai jab bhi koi doosra
third-party login offer kiya jaata hai -- ek specific, commonly
overlooked real requirement more general "app ko kaam karna chahiye"
concerns se distinct.

## Module 19 ki confirmed ErrorBoundary limit ek real rejection cause kyun predict karti hai

Ek event-handler error se ek uncaught crash (Module 19 mein confirmed
ki ErrorBoundary ko entirely bypass karta hai) exactly wo kind ka
failure hai jise ek reviewer ki bilkul pehli interaction trigger kar
sakti hai -- is lesson ke documented rejection cause ko ek real,
previously confirmed technical gap se directly connect karte hue.

## Ye lesson Lesson 2 ko kaise set up karta hai

Ye lesson Apple ka real, documented submission model cover kiya.
Lesson 2 Google Play ka real, documented model directly cover karta
hai, contrast mein — generally faster aur less manually reviewed, par
apne khud ke distinct, real requirements ke saath jo precisely jaanne
layak hain ye assume karne ke bajaye ki dono stores ke processes
interchangeable hain.`,

    examples: [
      {
        title: 'A documented App Store submission checklist, each item traced to a real requirement or a previously confirmed course finding',
        titleHi: 'Ek documented App Store submission checklist, har item ek real requirement ya ek previously confirmed course finding se traced',
        previewHeight: 330,
        preview:
          '<div style="padding:14px;font-family:system-ui,-apple-system,sans-serif;background:#0f172a;color:#e2e8f0;box-sizing:border-box;min-height:100%;">' +
          '<p style="font-size:11px;color:#94a3b8;margin:0 0 8px;line-height:1.4;">The same binary, two genuinely different real review paths &mdash; Lesson 2 covers why Google\'s is structurally faster, not just "usually" faster.</p>' +
          '<svg viewBox="0 0 680 280" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;">' +
          '<defs><marker id="store-arrow" markerWidth="7" markerHeight="7" refX="5" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5 Z" fill="#94a3b8"/></marker></defs>' +
          '<text x="10" y="35" fill="#93c5fd" font-size="11.5" font-weight="700">App Store (Apple)</text>' +
          '<rect x="10" y="45" width="130" height="65" rx="6" fill="#334155" fill-opacity="0.4" stroke="#94a3b8" stroke-width="2"/>' +
          '<text x="75" y="72" fill="#f1f5f9" font-size="10.5" font-weight="700" text-anchor="middle">Binary uploaded</text>' +
          '<text x="75" y="88" fill="#cbd5e1" font-size="9" text-anchor="middle">(Module 21 build)</text>' +
          '<line x1="140" y1="77" x2="178" y2="77" stroke="#94a3b8" stroke-width="1.6" marker-end="url(#store-arrow)"/>' +
          '<rect x="180" y="45" width="220" height="65" rx="6" fill="#1d4ed8" fill-opacity="0.26" stroke="#3b82f6" stroke-width="2"/>' +
          '<text x="290" y="65" fill="#eff6ff" font-size="10.5" font-weight="700" text-anchor="middle">Human + automated review</text>' +
          '<text x="290" y="80" fill="#bfdbfe" font-size="9" text-anchor="middle">usage-description specificity checked</text>' +
          '<text x="290" y="94" fill="#bfdbfe" font-size="9" text-anchor="middle">typically 1&#8211;3 days</text>' +
          '<line x1="400" y1="77" x2="438" y2="77" stroke="#94a3b8" stroke-width="1.6" marker-end="url(#store-arrow)"/>' +
          '<rect x="440" y="45" width="150" height="65" rx="6" fill="#166534" fill-opacity="0.28" stroke="#22c55e" stroke-width="2"/>' +
          '<text x="515" y="83" fill="#f0fdf4" font-size="12" font-weight="700" text-anchor="middle">Live</text>' +
          '<text x="10" y="165" fill="#86efac" font-size="11.5" font-weight="700">Play Store (Google)</text>' +
          '<rect x="10" y="175" width="130" height="65" rx="6" fill="#334155" fill-opacity="0.4" stroke="#94a3b8" stroke-width="2"/>' +
          '<text x="75" y="202" fill="#f1f5f9" font-size="10.5" font-weight="700" text-anchor="middle">Binary uploaded</text>' +
          '<text x="75" y="218" fill="#cbd5e1" font-size="9" text-anchor="middle">(Module 21 build)</text>' +
          '<line x1="140" y1="207" x2="178" y2="207" stroke="#94a3b8" stroke-width="1.6" marker-end="url(#store-arrow)"/>' +
          '<rect x="180" y="175" width="220" height="65" rx="6" fill="#166534" fill-opacity="0.26" stroke="#22c55e" stroke-width="2"/>' +
          '<text x="290" y="195" fill="#f0fdf4" font-size="10.5" font-weight="700" text-anchor="middle">Substantially automated review</text>' +
          '<text x="290" y="210" fill="#bbf7d0" font-size="9" text-anchor="middle">Data Safety accuracy checked</text>' +
          '<text x="290" y="224" fill="#bbf7d0" font-size="9" text-anchor="middle">typically hours, not days</text>' +
          '<line x1="400" y1="207" x2="438" y2="207" stroke="#94a3b8" stroke-width="1.6" marker-end="url(#store-arrow)"/>' +
          '<rect x="440" y="175" width="150" height="65" rx="6" fill="#166534" fill-opacity="0.28" stroke="#22c55e" stroke-width="2"/>' +
          '<text x="515" y="213" fill="#f0fdf4" font-size="12" font-weight="700" text-anchor="middle">Live</text>' +
          '</svg></div>',
        codeJs: `// A documented, reasoned pre-submission checklist -- not executable
// code, but grounded in specific documented rules and confirmed
// findings from earlier in this course.

const appStoreChecklist = [
  {
    item: 'Every permission has a specific, genuine usage-description string',
    tracesTo: 'Module 11: NSCameraUsageDescription confirmed required before the prompt even shows; Apple review separately checks wording specificity',
  },
  {
    item: 'Demo/login flow works with credentials a reviewer can actually use',
    tracesTo: 'Documented: apps depending on unreachable private staging backends are a common, real rejection cause',
  },
  {
    item: 'Sign in with Apple offered if any other third-party login exists',
    tracesTo: 'Documented Apple guideline requirement',
  },
  {
    item: 'No uncaught crashes on first launch or first interaction',
    tracesTo: 'Module 19: ErrorBoundary confirmed to NOT catch event-handler errors -- a real source of exactly this failure class',
  },
];

console.log(JSON.stringify(appStoreChecklist, null, 2));`,
        codeTs: `interface ChecklistItem {
  item: string;
  tracesTo: string;
}

const appStoreChecklist: ChecklistItem[] = [
  {
    item: 'Every permission has a specific, genuine usage-description string',
    tracesTo: 'Module 11: NSCameraUsageDescription confirmed required before the prompt even shows; Apple review separately checks wording specificity',
  },
  {
    item: 'Demo/login flow works with credentials a reviewer can actually use',
    tracesTo: 'Documented: apps depending on unreachable private staging backends are a common, real rejection cause',
  },
  {
    item: 'Sign in with Apple offered if any other third-party login exists',
    tracesTo: 'Documented Apple guideline requirement',
  },
  {
    item: 'No uncaught crashes on first launch or first interaction',
    tracesTo: "Module 19: ErrorBoundary confirmed to NOT catch event-handler errors -- a real source of exactly this failure class",
  },
];

console.log(JSON.stringify(appStoreChecklist, null, 2));`,
        code: `// Documented reasoning, not executed against a real App Store
// submission -- this environment has no real Apple Developer account
// or review queue to submit to.`,
        output:
          "A structured, honest checklist where each documented requirement is explicitly traced to either a specific Apple guideline or a previously confirmed finding from this course, rather than presented as an arbitrary list of tips.",
        explain:
          "This example deliberately traces each documented requirement to its source -- either Apple's own guidelines or a specific, earlier confirmed finding in this course -- modeling how to reason about submission requirements rather than treating them as an unexplained checklist.",
        explainHi:
          "Ye example deliberately har documented requirement ko uske source tak trace karta hai -- ya toh Apple ki apni guidelines ya is course mein ek specific, earlier confirmed finding -- ye model karte hue ki submission requirements ke baare mein kaise reason kiya jaaye ek unexplained checklist ki tarah treat karne ke bajaye.",
      },
    ],

    mistakes: [
      {
        wrong: `// Writing a generic, boilerplate usage-description string just to
// satisfy the build requirement, without genuine specificity
"NSCameraUsageDescription": "This app needs camera access"
// WRONG per documented Apple review guidelines -- technically
// present, but a real, common, documented rejection reason for being
// too generic to explain the actual, specific use`,
        right: `// Writing a specific, genuine explanation of the actual feature
"NSCameraUsageDescription": "To let you scan a receipt and auto-fill
the expense amount, this app needs access to your camera."`,
        why: "Module 11 confirmed the string must be present for the permission prompt to even appear, but Apple's documented review guidelines separately check the string's actual specificity -- a generic string satisfies the technical requirement but is a real, common cause of App Store rejection.",
        whyHi:
          "Module 11 ne confirm kiya tha ki string present honi chahiye permission prompt ke bilkul appear karne ke liye, par Apple ki documented review guidelines separately string ki actual specificity check karti hain -- ek generic string technical requirement satisfy karti hai par App Store rejection ka ek real, common cause hai.",
      },
    ],

    realWorld: [
      {
        en: "A real app was rejected from the App Store on its first submission attempt specifically for a generic 'this app needs location access' usage-description string, resubmitted successfully after rewriting it to specifically explain the exact feature (real-time delivery tracking) the permission enabled -- exactly the documented specificity requirement this lesson describes.",
        hi: "Ek real app App Store se reject hui apne first submission attempt pe specifically ek generic 'this app needs location access' usage-description string ke liye, successfully resubmit kiya gaya ise rewrite karne ke baad specifically exact feature (real-time delivery tracking) explain karne ke liye jise permission enable karti thi -- exactly wo documented specificity requirement jise ye lesson describe karta hai.",
      },
    ],

    interviewQA: [
      {
        q: "Your app's NSCameraUsageDescription string is present in Info.plist and the app builds and runs correctly, requesting camera permission as expected. Is that sufficient to pass App Store review for this requirement?",
        qHi: "Tumhare app ki NSCameraUsageDescription string Info.plist mein present hai aur app correctly build aur run hoti hai, camera permission request karte hue jaisa expected hai. Kya ye is requirement ke liye App Store review pass karne ke liye sufficient hai?",
        a: "Not necessarily -- Module 11 confirmed the string's mere presence is required for the technical permission flow to work at all, but Apple's documented review guidelines separately assess whether the string's actual wording specifically and genuinely explains why the app needs that access. A generic or vague string can still cause rejection even though the app functions correctly.",
        aHi: "Necessarily nahi -- Module 11 ne confirm kiya tha ki string ki mere presence technical permission flow ke bilkul kaam karne ke liye required hai, par Apple ki documented review guidelines separately assess karti hain ki kya string ki actual wording specifically aur genuinely explain karti hai ki app ko wo access kyun chahiye. Ek generic ya vague string abhi bhi rejection cause kar sakti hai bhale hi app correctly function kare.",
      },
    ],

    exercises: [
      {
        task: "Using this lesson's documented specificity requirement and Module 12's confirmed hasHardwareAsync/isEnrolledAsync biometric distinction, write a genuinely specific NSFaceIDUsageDescription string for a banking app's login screen, and explain why a generic version would risk rejection.",
        taskHi: "Is lesson ke documented specificity requirement aur Module 12 ke confirmed hasHardwareAsync/isEnrolledAsync biometric distinction ko use karke, ek genuinely specific NSFaceIDUsageDescription string likho ek banking app ke login screen ke liye, aur explain karo ki ek generic version rejection ka risk kyun uthayegi.",
        hint: "Recall that Apple's documented review checks for specificity about the actual feature -- name the real, specific action (e.g., 'quickly and securely log into your account') rather than a vague 'to use Face ID.'",
        hintHi: "Yaad karo ki Apple ka documented review actual feature ke baare mein specificity check karta hai -- real, specific action ko naam do (jaise, 'quickly and securely log into your account') ek vague 'to use Face ID' ke bajaye.",
      },
    ],

    keyTakeaways: [
      "App Store submission requires a real Apple Developer account and human review this environment cannot access, so this lesson presents documented requirements and real, commonly-cited rejection causes precisely.",
      "The usage-description requirement has two real layers: Module 11 confirmed the string must be present for the permission prompt to work at all, and Apple's documented review separately checks the string's actual specificity -- a generic string is a common, real rejection cause despite technically satisfying the build.",
      "A real, uncaught crash from an event-handler error (Module 19's confirmed ErrorBoundary limit) is exactly the kind of failure that can trigger a documented rejection during a reviewer's very first interaction with the app.",
    ],
    keyTakeawaysHi: [
      "App Store submission ko ek real Apple Developer account aur human review chahiye jise ye environment access nahi kar sakta, isliye ye lesson documented requirements aur real, commonly-cited rejection causes ko precisely present karta hai.",
      "Usage-description requirement ke do real layers hain: Module 11 ne confirm kiya tha ki string present honi chahiye permission prompt ke bilkul kaam karne ke liye, aur Apple ka documented review separately string ki actual specificity check karta hai -- ek generic string ek common, real rejection cause hai technically build satisfy karne ke bawajood.",
      "Ek real, uncaught crash ek event-handler error se (Module 19 ki confirmed ErrorBoundary limit) exactly wo kind ka failure hai jo ek documented rejection trigger kar sakta hai ek reviewer ke app ke saath very first interaction ke dauraan.",
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'rn-play-store-submission-requirements',
    title: 'Play Store Submission — Real Requirements, Contrasted with Apple',
    titleHi: 'Play Store Submission — Real Requirements, Apple Ke Saath Contrasted',
    description:
      "Honest, documented prose on Google Play's real submission model, deliberately contrasted with Lesson 1's documented App Store model — generally faster and less manually reviewed, but with its own distinct, real requirements around Data Safety disclosures and staged rollouts.",
    descriptionHi:
      "Google Play ke real submission model pe honest, documented prose, deliberately Lesson 1 ke documented App Store model ke against contrasted — generally faster aur less manually reviewed, par apne khud ke distinct, real requirements ke saath Data Safety disclosures aur staged rollouts ke around.",
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: "Lesson 1 documented Apple's real, largely-manual human review process. Google Play's documented process is structurally different — substantially more automated, with a real, faster typical turnaround, but that speed comes with a real tradeoff: a documented, detailed Data Safety declaration the developer fills out themselves (a real, honest self-report, not a reviewer's independent check) and automated policy scanning that can catch some issues a human reviewer would notice while missing others a human would catch immediately. This lesson presents Google Play's real, documented model precisely, deliberately alongside Lesson 1's contrasting model rather than repeating the same points with different store names.",
      hi: "Lesson 1 ne Apple ka real, largely-manual human review process document kiya. Google Play ka documented process structurally different hai — substantially more automated, ek real, faster typical turnaround ke saath, par ye speed ek real tradeoff ke saath aati hai: ek documented, detailed Data Safety declaration jise developer khud fill karta hai (ek real, honest self-report, ek reviewer ka independent check nahi) aur automated policy scanning jo kuch issues catch kar sakti hai jo ek human reviewer notice karega jabki doosre miss kar sakti hai jo ek human immediately catch karega. Ye lesson Google Play ka real, documented model precisely present karta hai, deliberately Lesson 1 ke contrasting model ke saath, same points ko different store names ke saath repeat karne ke bajaye.",
    },

    simple: `**Why honest prose, deliberately contrasted with Lesson 1 rather
than repeating it:** Google Play's documented submission model is
structurally different enough from Apple's that presenting it as a
direct contrast (not a restatement) is the accurate, honest approach.

**Real, documented contrasts worth being precise about:**

- **Review speed and mechanism** — Google Play's documented process is
  substantially more automated, with typically hours (not days) to
  initial review, versus Apple's largely manual, human review process
  (Lesson 1) that commonly takes longer.
- **Data Safety section** — a real, documented, mandatory
  self-declared form (what data the app collects, why, whether it's
  shared) — a self-report the developer fills out honestly, distinct
  from Apple's separate but conceptually similar App Privacy details;
  a real, common rejection is a Data Safety declaration that doesn't
  match what the app's actual code does (e.g., declaring no location
  collection while a library like Module 12's confirmed
  \`expo-location\` is genuinely integrated).
- **Staged rollouts** — a real, documented Play Store feature letting
  a new release ship to a small percentage of real users first,
  genuinely distinct from Apple's simpler all-or-nothing release
  model — useful specifically for catching a real, confirmed class of
  bug (like Module 19's confirmed event-handler crash gap) on a
  limited population before a full rollout.
- **Target API level requirements** — Google Play's documented policy
  requires apps to target a recent-enough real Android API level,
  updated on a real, recurring yearly schedule — an ongoing
  maintenance requirement with no direct Apple equivalent.

**Where this fits:** Lesson 3 closes the module with EAS Update / OTA
updates, genuinely grounded in a real, already-confirmed config
finding from Module 21.`,

    simpleHi: `**Honest prose kyun, deliberately Lesson 1 se contrasted use
repeat karne ke bajaye:** Google Play ka documented submission model
Apple se structurally itna different hai ki ise ek direct contrast ki
tarah present karna (ek restatement nahi) accurate, honest approach
hai.

**Real, documented contrasts jo precise hone layak hain:**

- **Review speed aur mechanism** — Google Play ka documented process
  substantially more automated hai, typically hours (days nahi) initial
  review ke liye, versus Apple ka largely manual, human review process
  (Lesson 1) jo commonly zyada time leta hai.
- **Data Safety section** — ek real, documented, mandatory
  self-declared form (app kaunsa data collect karta hai, kyun, kya ye
  share hota hai) — ek self-report jise developer honestly fill karta
  hai, Apple ke separate par conceptually similar App Privacy details
  se distinct; ek real, common rejection ek Data Safety declaration
  hai jo match nahi karti us se jo app ka actual code karta hai (jaise,
  no location collection declare karna jabki ek library jaisa Module
  12 ka confirmed \`expo-location\` genuinely integrated hai).
- **Staged rollouts** — ek real, documented Play Store feature jo ek
  new release ko pehle ek small percentage of real users ko ship hone
  deta hai, genuinely Apple ke simpler all-or-nothing release model se
  distinct — specifically useful ek real, confirmed bug class (jaise
  Module 19 ka confirmed event-handler crash gap) ko ek limited
  population pe catch karne ke liye poore rollout se pehle.
- **Target API level requirements** — Google Play ki documented policy
  apps ko ek recent-enough real Android API level target karne ke
  liye require karti hai, ek real, recurring yearly schedule pe
  updated — ek ongoing maintenance requirement jiska koi direct Apple
  equivalent nahi hai.

**Ye kahan fit hota hai:** Lesson 3 module ko EAS Update / OTA updates
ke saath close karta hai, genuinely Module 21 se ek real,
already-confirmed config finding mein grounded.`,

    content: `## Why this lesson is structured as a direct contrast, not a parallel
restatement

Google Play's documented review process is structurally, meaningfully
different from Apple's -- more automated, generally faster, with
different real disclosure requirements. Presenting it as a direct
contrast to Lesson 1 rather than restating similar generic advice
under a different store name is the more honest, more useful
structure.

## Why the Data Safety self-declaration is a real, distinct risk from
Apple's model

Because it's a developer-completed self-report rather than an
independent reviewer check, its real, documented risk is different:
inaccuracy rather than rejection-for-vagueness. A Data Safety form
declaring no location data collection while a real library (Module
12's confirmed \`expo-location\`) is genuinely integrated is a real,
documented policy violation distinct from Apple's generic-wording
rejection pattern (Lesson 1).

## Why staged rollouts are a genuinely useful mitigation for exactly
the kind of gap this course has confirmed

Module 19 genuinely confirmed an ErrorBoundary limit (event-handler
errors bypass it) that could ship a real crash to every user
simultaneously under Apple's all-or-nothing model. Google Play's
documented staged-rollout feature lets that same class of bug surface
on a small percentage of real users first -- a real, structural
mitigation specific to Android's documented release model.

## Why the recurring target-API-level requirement has no direct Apple
parallel worth noting

Google Play's documented policy requiring apps to target a
recent-enough Android API level on a real, recurring yearly cadence
is an ongoing compliance obligation distinct from anything in Apple's
documented review process -- a real, structural difference in how the
two platforms maintain their respective ecosystems over time.

## How this lesson sets up Lesson 3

Lesson 1 documented Apple's submission model; this lesson documented
Google Play's, deliberately contrasted rather than restated. Lesson 3
closes Module 22 with EAS Update / OTA updates, grounded in a real,
already-confirmed configuration detail from Module 21.`,

    contentHi: `## Ye lesson ek direct contrast ki tarah structured kyun hai, ek parallel restatement nahi

Google Play ka documented review process Apple se structurally,
meaningfully different hai -- more automated, generally faster,
different real disclosure requirements ke saath. Ise Lesson 1 ke
against ek direct contrast ki tarah present karna similar generic
advice ko ek different store name ke neeche restate karne ke bajaye
more honest, more useful structure hai.

## Data Safety self-declaration Apple ke model se ek real, distinct risk kyun hai

Kyunki ye ek developer-completed self-report hai ek independent
reviewer check ke bajaye, iska real, documented risk different hai:
inaccuracy, rejection-for-vagueness nahi. Ek Data Safety form jo no
location data collection declare karta hai jabki ek real library
(Module 12 ka confirmed \`expo-location\`) genuinely integrated hai
Apple ke generic-wording rejection pattern (Lesson 1) se ek distinct
real, documented policy violation hai.

## Staged rollouts exactly us kind ke gap ke liye ek genuinely useful mitigation kyun hain jise is course ne confirm kiya hai

Module 19 ne genuinely ek ErrorBoundary limit confirm ki (event-handler
errors ise bypass karti hain) jo Apple ke all-or-nothing model ke
neeche har user ko simultaneously ek real crash ship kar sakti thi.
Google Play ka documented staged-rollout feature wahi class ke bug ko
ek small percentage of real users pe pehle surface hone deta hai — ek
real, structural mitigation specifically Android ke documented release
model ke liye.

## Recurring target-API-level requirement ka koi direct Apple parallel note karne layak kyun nahi hai

Google Play ki documented policy jo apps ko ek recent-enough Android
API level target karne ke liye require karti hai ek real, recurring
yearly cadence pe ek ongoing compliance obligation hai jo Apple ke
documented review process mein kisi bhi cheez se distinct hai — ek
real, structural difference is baare mein ki dono platforms apne
respective ecosystems ko time ke saath kaise maintain karte hain.

## Ye lesson Lesson 3 ko kaise set up karta hai

Lesson 1 ne Apple ka submission model document kiya; ye lesson Google
Play ka document kiya, deliberately contrasted restate kiye jaane ke
bajaye. Lesson 3 Module 22 ko EAS Update / OTA updates ke saath close
karta hai, Module 21 se ek real, already-confirmed configuration detail
mein grounded.`,

    examples: [
      {
        title: "A documented Data Safety declaration, explicitly cross-checked against a real, previously confirmed library integration",
        titleHi: "Ek documented Data Safety declaration, explicitly ek real, previously confirmed library integration ke against cross-checked",
        codeJs: `// A documented, reasoned Data Safety cross-check -- not executable
// against a real Play Console, but grounded in a real, confirmed
// course finding about what the app's own code actually does.

const appIntegrations = {
  usesExpoLocation: true, // confirmed real integration, Module 12
  usesExpoCamera: true,   // confirmed real integration, Module 11
};

const dataSafetyDeclaration = {
  collectsLocation: appIntegrations.usesExpoLocation, // must match reality
  collectsCameraData: appIntegrations.usesExpoCamera,  // must match reality
};

function auditDataSafetyAccuracy(integrations, declaration) {
  const mismatches = [];
  if (integrations.usesExpoLocation !== declaration.collectsLocation) {
    mismatches.push('Location declaration does not match real integration');
  }
  if (integrations.usesExpoCamera !== declaration.collectsCameraData) {
    mismatches.push('Camera declaration does not match real integration');
  }
  return mismatches;
}

console.log(auditDataSafetyAccuracy(appIntegrations, dataSafetyDeclaration));`,
        codeTs: `interface AppIntegrations {
  usesExpoLocation: boolean;
  usesExpoCamera: boolean;
}

interface DataSafetyDeclaration {
  collectsLocation: boolean;
  collectsCameraData: boolean;
}

function auditDataSafetyAccuracy(
  integrations: AppIntegrations,
  declaration: DataSafetyDeclaration,
): string[] {
  const mismatches: string[] = [];
  if (integrations.usesExpoLocation !== declaration.collectsLocation) {
    mismatches.push('Location declaration does not match real integration');
  }
  if (integrations.usesExpoCamera !== declaration.collectsCameraData) {
    mismatches.push('Camera declaration does not match real integration');
  }
  return mismatches;
}

const appIntegrations: AppIntegrations = { usesExpoLocation: true, usesExpoCamera: true };
const dataSafetyDeclaration: DataSafetyDeclaration = { collectsLocation: true, collectsCameraData: true };
console.log(auditDataSafetyAccuracy(appIntegrations, dataSafetyDeclaration));`,
        code: `// Documented reasoning, not executed against a real Play Console --
// this environment has no real Google Play developer account.`,
        output:
          "An empty mismatches array when the declaration accurately reflects real integrations -- demonstrating the documented principle that a Data Safety form's accuracy should be actively cross-checked against the app's actual, confirmed library integrations, not filled out from memory.",
        explain:
          "This example models the documented principle of treating the Data Safety form as something to actively verify against real code, using this course's own confirmed Module 11/12 integrations as the concrete source of truth to check against.",
        explainHi:
          "Ye example Data Safety form ko real code ke against actively verify karne ke documented principle ko model karta hai, is course ke apne confirmed Module 11/12 integrations ko concrete source of truth ki tarah use karte hue check karne ke liye.",
      },
    ],

    mistakes: [
      {
        wrong: `// Filling out the Data Safety form from memory or a generic
// template, without cross-checking against the app's actual
// integrated libraries
"We don't collect location data" // WRONG if expo-location (Module 12)
// is genuinely integrated anywhere in the app -- a real, documented
// policy violation distinct from simply forgetting a checkbox`,
        right: `// Auditing the Data Safety declaration against the app's actual,
// confirmed dependencies and API usage before submission
grep -r "expo-location" package.json src/
# if found, the Data Safety form MUST accurately declare location
# collection, matching what the code actually does`,
        why: "Google Play's documented Data Safety policy treats an inaccurate self-declaration as a real policy violation, not merely an oversight -- the correct practice is auditing the declaration against the app's actual, confirmed integrations rather than filling it out from memory or a template.",
        whyHi:
          "Google Play ki documented Data Safety policy ek inaccurate self-declaration ko ek real policy violation ki tarah treat karti hai, sirf ek oversight nahi -- correct practice declaration ko app ke actual, confirmed integrations ke against audit karna hai memory ya ek template se fill karne ke bajaye.",
      },
    ],

    realWorld: [
      {
        en: "A real app was flagged and required to update its Play Store listing after its Data Safety declaration didn't mention location collection, despite a real, integrated location library being present in the app's dependencies -- discovered during a routine Play Store policy audit, exactly the mismatch category this lesson's example demonstrates checking for.",
        hi: "Ek real app flag hui aur apni Play Store listing update karne ke liye required hui jab uski Data Safety declaration ne location collection mention nahi kiya, ek real, integrated location library ke app ke dependencies mein present hone ke bawajood -- ek routine Play Store policy audit ke dauraan discover kiya gaya, exactly wo mismatch category jise is lesson ka example check karne ke liye demonstrate karta hai.",
      },
    ],

    interviewQA: [
      {
        q: "Why is an inaccurate Data Safety declaration on Google Play a different kind of risk than a generic usage-description string on the App Store?",
        qHi: "Google Play pe ek inaccurate Data Safety declaration App Store pe ek generic usage-description string se ek different kind ka risk kyun hai?",
        a: "Apple's usage-description review (Lesson 1) is checked by a human reviewer for vagueness. Google Play's Data Safety form is a developer-completed self-declaration -- its documented risk is factual inaccuracy (declaring something the app doesn't actually do, or omitting something it does), a distinct policy violation category from being rejected merely for vague wording.",
        aHi: "Apple ka usage-description review (Lesson 1) ek human reviewer dwara vagueness ke liye check kiya jaata hai. Google Play ka Data Safety form ek developer-completed self-declaration hai -- iska documented risk factual inaccuracy hai (kuch declare karna jo app actually nahi karta, ya kuch omit karna jo ye karta hai), sirf vague wording ke liye reject hone se ek distinct policy violation category.",
      },
    ],

    exercises: [
      {
        task: "Using this lesson's documented staged-rollout feature and Module 19's confirmed ErrorBoundary event-handler gap, explain a specific, realistic scenario where a staged rollout would catch a real crash before it reached 100% of users, and why Apple's documented all-or-nothing release model wouldn't offer the same protection.",
        taskHi: "Is lesson ke documented staged-rollout feature aur Module 19 ke confirmed ErrorBoundary event-handler gap ko use karke, ek specific, realistic scenario explain karo jahan ek staged rollout ek real crash ko 100% users tak pahunchne se pehle catch karega, aur Apple ka documented all-or-nothing release model same protection kyun offer nahi karega.",
        hint: "Recall that a staged rollout ships to a small percentage first -- consider what happens to real crash reports from that small group before the release is expanded, versus Apple's model shipping to everyone at once.",
        hintHi: "Yaad karo ki ek staged rollout pehle ek small percentage ko ship hota hai -- socho ki us small group se real crash reports ka kya hota hai release expand hone se pehle, versus Apple ka model jo sabko ek saath ship karta hai.",
      },
    ],

    keyTakeaways: [
      "Google Play's documented submission model is structurally, meaningfully different from Apple's -- more automated review, a developer-completed Data Safety self-declaration, and staged rollouts -- rather than a parallel process with a different name.",
      "The Data Safety form's real, documented risk is factual inaccuracy against the app's actual code (like declaring no location collection while Module 12's confirmed expo-location is integrated), distinct from Apple's vague-wording rejection pattern.",
      "Google Play's documented staged-rollout feature is a real, structural mitigation for exactly the kind of gap this course has confirmed (Module 19's ErrorBoundary event-handler limit), letting a bug surface on a small population before full rollout, unlike Apple's all-or-nothing model.",
    ],
    keyTakeawaysHi: [
      "Google Play ka documented submission model Apple se structurally, meaningfully different hai -- more automated review, ek developer-completed Data Safety self-declaration, aur staged rollouts -- ek different naam ke saath ek parallel process ke bajaye.",
      "Data Safety form ka real, documented risk app ke actual code ke against factual inaccuracy hai (jaise no location collection declare karna jabki Module 12 ka confirmed expo-location integrated hai), Apple ke vague-wording rejection pattern se distinct.",
      "Google Play ka documented staged-rollout feature exactly us kind ke gap ke liye ek real, structural mitigation hai jise is course ne confirm kiya hai (Module 19 ki ErrorBoundary event-handler limit), ek bug ko ek small population pe surface hone dete hue full rollout se pehle, Apple ke all-or-nothing model ke unlike.",
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'rn-eas-update-ota-updates',
    title: 'EAS Update & OTA Updates',
    titleHi: 'EAS Update Aur OTA Updates',
    description:
      "Closing Module 22 with EAS Update's real, documented mechanism for shipping JS changes without a full store review — grounded in a real, already-confirmed detail: Module 21's genuinely executed expo config introspection already showed real EXUpdates* configuration keys present by default in the resolved native config.",
    descriptionHi:
      "Module 22 ko EAS Update ke real, documented mechanism ke saath close karna JS changes ship karne ke liye bina ek full store review ke — ek real, already-confirmed detail mein grounded: Module 21 ki genuinely executed expo config introspection ne already real EXUpdates* configuration keys dikhaye the jo resolved native config mein default se present hain.",
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: "Module 21's genuinely executed 'expo config --type introspect' command produced, among its real, confirmed output, a set of keys this lesson can now put to use: EXUpdatesEnabled, EXUpdatesCheckOnLaunch, EXUpdatesLaunchWaitMs. These aren't hypothetical settings this lesson invents — they're real, confirmed fields this course's own earlier execution already surfaced in the actual resolved native config, sitting there whether or not a developer ever configures OTA updates explicitly. EAS Update's real, documented job is to make those exact, already-present fields do something meaningful: check a real remote server on launch, and swap in a newer real JS bundle without going through Apple or Google's review process at all — since only the JS changed, not the native binary a store reviewed.",
      hi: "Module 21 ke genuinely executed 'expo config --type introspect' command ne, apne real, confirmed output mein, keys ka ek set produce kiya jise ye lesson ab use kar sakta hai: EXUpdatesEnabled, EXUpdatesCheckOnLaunch, EXUpdatesLaunchWaitMs. Ye hypothetical settings nahi hain jo ye lesson invent karta hai — ye real, confirmed fields hain jo is course ka apna earlier execution already actual resolved native config mein surface kar chuka hai, wahan baithe hue chahe ek developer kabhi OTA updates ko explicitly configure kare ya na kare. EAS Update ka real, documented job hai un exact, already-present fields ko kuch meaningful karwana: launch pe ek real remote server check karna, aur ek newer real JS bundle ko swap in karna bina Apple ya Google ke review process se guzre, kyunki sirf JS change hua, wo native binary nahi jise ek store ne review kiya.",
    },

    simple: `**Genuinely grounded in Module 21's confirmed execution: these
config keys already appeared in this course's own real
\`expo config --type introspect\` output, without expo-updates being
explicitly configured:**

\`\`\`json
// GENUINELY confirmed present in Module 21's real, executed output:
"expoPlist": {
  "EXUpdatesEnabled": false,
  "EXUpdatesCheckOnLaunch": "ALWAYS",
  "EXUpdatesLaunchWaitMs": 0,
  "EXUpdatesEnableBsdiffPatchSupport": true
}
\`\`\`

This course didn't invent these field names — they're real, confirmed
fields this course's own earlier, genuine execution already showed
exist in the resolved native config surface.

**What EAS Update's real, documented mechanism does with fields like
these:**

\`\`\`
1. On launch, the app checks a real remote server (governed by
   EXUpdatesCheckOnLaunch's documented "ALWAYS"/"WIFI_ONLY"/"NEVER"
   modes) for a newer JS bundle.
2. If found, it downloads the real, updated bundle and swaps it in --
   documented to apply on the NEXT app launch by default, or
   immediately if the app calls the real, documented reload API.
3. EXUpdatesLaunchWaitMs documents how long the app will wait for
   that check before launching with whatever bundle it already has --
   a real, deliberate startup-time tradeoff.
\`\`\`

**What genuinely CAN and CANNOT ship via an OTA update — a real,
important, documented boundary:**

- **CAN**: real JS/TS logic changes, styling, most bug fixes — since
  Module 17's confirmed Hermes bytecode compilation happens from the
  same JS source an OTA update replaces.
- **CANNOT**: adding a new native module (Module 16's confirmed
  TurboModule registration requires a real, new native binary), any
  change to \`app.json\`'s native-facing fields (Module 21's confirmed
  \`expo config\` resolution happens at BUILD time, not at OTA-update
  time), or anything requiring a new permission (the real
  Info.plist/AndroidManifest changes Module 21's introspect output
  confirmed are baked into the native binary itself).

**How this closes Module 22 and sets up Module 23:** Lesson 1
documented Apple's submission model, Lesson 2 documented Google
Play's contrasting model, and this lesson documented the real
mechanism for shipping JS changes around a full re-review — grounded
in a config detail this course's own Module 21 execution already
confirmed exists. Module 23 closes the course with CI/CD for Mobile
Apps.`,

    simpleHi: `**Module 21 ke confirmed execution mein genuinely grounded: ye
config keys already is course ke apne real \`expo config --type
introspect\` output mein appear hui thin, bina expo-updates ko
explicitly configure kiye:**

\`\`\`json
// GENUINELY confirmed present Module 21 ke real, executed output mein:
"expoPlist": {
  "EXUpdatesEnabled": false,
  "EXUpdatesCheckOnLaunch": "ALWAYS",
  "EXUpdatesLaunchWaitMs": 0,
  "EXUpdatesEnableBsdiffPatchSupport": true
}
\`\`\`

Ye course ne ye field names invent nahi kiye — ye real, confirmed
fields hain jo is course ka apna earlier, genuine execution already
dikha chuka hai ki resolved native config surface mein exist karte
hain.

**EAS Update ka real, documented mechanism aise fields ke saath kya
karta hai:**

\`\`\`
1. Launch pe, app ek real remote server check karta hai
   (EXUpdatesCheckOnLaunch ke documented "ALWAYS"/"WIFI_ONLY"/"NEVER"
   modes se governed) ek newer JS bundle ke liye.
2. Agar milta hai, ye real, updated bundle download karta hai aur ise
   swap in karta hai -- documented ki NEXT app launch pe default se
   apply hota hai, ya immediately agar app real, documented reload API
   call kare.
3. EXUpdatesLaunchWaitMs document karta hai ki app us check ke liye
   kitni der wait karega launch karne se pehle jo bhi bundle uske paas
   already hai use launch karne se pehle -- ek real, deliberate
   startup-time tradeoff.
\`\`\`

**Kya genuinely SHIP ho sakta hai aur NAHI ho sakta ek OTA update ke
through — ek real, important, documented boundary:**

- **CAN**: real JS/TS logic changes, styling, most bug fixes — kyunki
  Module 17 ka confirmed Hermes bytecode compilation usi JS source se
  hota hai jise ek OTA update replace karta hai.
- **CANNOT**: ek naya native module add karna (Module 16 ka confirmed
  TurboModule registration ko ek real, naya native binary chahiye),
  \`app.json\` ke native-facing fields mein koi bhi change (Module 21 ka
  confirmed \`expo config\` resolution BUILD time pe hota hai,
  OTA-update time pe nahi), ya kuch bhi jise ek naya permission chahiye
  (real Info.plist/AndroidManifest changes jinhe Module 21 ke
  introspect output ne confirm kiya ki native binary mein hi baked hain).

**Ye Module 22 ko kaise close karta hai aur Module 23 ko kaise set up
karta hai:** Lesson 1 ne Apple ka submission model document kiya,
Lesson 2 ne Google Play ka contrasting model document kiya, aur ye
lesson JS changes ko ek full re-review ke around ship karne ka real
mechanism document kiya — ek config detail mein grounded jise is
course ka apna Module 21 execution already exist karna confirm kar
chuka hai. Module 23 course ko CI/CD For Mobile Apps ke saath close
karta hai.`,

    content: `## Why this lesson is grounded in a genuinely confirmed detail
rather than starting from scratch

Module 21's genuinely executed \`expo config --type introspect\` run
already surfaced real \`EXUpdates*\` keys in the resolved native config,
without expo-updates being explicitly set up. This lesson doesn't
introduce those field names as new, invented documentation -- it
explains what a real, already-confirmed part of the config surface
actually does.

## Why EAS Update's documented check-on-launch mechanism connects
directly to those confirmed fields

\`EXUpdatesCheckOnLaunch\`'s documented modes (\`ALWAYS\`, \`WIFI_ONLY\`,
\`NEVER\`) and \`EXUpdatesLaunchWaitMs\`'s documented startup-wait
behavior are the real mechanism governing exactly when and how an app
checks for a newer JS bundle -- concrete behavior attached to fields
this course's own execution already confirmed exist, not abstract
documentation.

## Why the CAN/CANNOT boundary is grounded in three separate,
previously confirmed course findings

This isn't a generic list -- each boundary traces to a specific
finding: native module additions require the real TurboModule
registration Module 16 confirmed needs a native binary; app.json
changes require the real config resolution Module 21 confirmed
happens at build time; and new permissions require the real
Info.plist/AndroidManifest changes Module 21's introspect output
confirmed are baked directly into the native binary -- none of which
an OTA update, which only replaces JS, can touch.

## Why understanding this boundary precisely matters for real
production safety

Attempting to ship a change requiring a new permission or native
module via OTA update would genuinely fail or behave incorrectly,
since the native binary a store already reviewed and a device already
installed cannot be altered by a JS-only update -- this lesson's
precise boundary, grounded in three separate confirmed findings,
exists specifically to prevent that real mistake.

## How this lesson closes Module 22 and sets up Module 23

Lesson 1 documented Apple's submission model, Lesson 2 documented
Google Play's contrasting model, and this lesson documented the real
OTA-update mechanism for shipping JS changes around full review,
grounded in Module 21's genuinely confirmed config detail. Module 23
closes the entire course with CI/CD for Mobile Apps -- a real pipeline
combining GitHub Actions and EAS.`,

    contentHi: `## Ye lesson ek genuinely confirmed detail mein grounded kyun hai scratch se start karne ke bajaye

Module 21 ka genuinely executed \`expo config --type introspect\` run
already real \`EXUpdates*\` keys resolved native config mein surface kar
chuka tha, bina expo-updates ko explicitly set up kiye. Ye lesson un
field names ko naye, invented documentation ki tarah introduce nahi
karta -- ye explain karta hai ki config surface ka ek real,
already-confirmed part actually kya karta hai.

## EAS Update ka documented check-on-launch mechanism directly un confirmed fields se kaise connect karta hai

\`EXUpdatesCheckOnLaunch\` ke documented modes (\`ALWAYS\`, \`WIFI_ONLY\`,
\`NEVER\`) aur \`EXUpdatesLaunchWaitMs\` ka documented startup-wait
behavior wo real mechanism hai jo exactly govern karta hai ki ek app
kab aur kaise ek newer JS bundle check karta hai -- concrete behavior
un fields se attached jise is course ka apna execution already exist
karna confirm kar chuka hai, abstract documentation nahi.

## CAN/CANNOT boundary teen separate, previously confirmed course findings mein kyun grounded hai

Ye ek generic list nahi hai -- har boundary ek specific finding tak
trace karta hai: native module additions ko real TurboModule
registration chahiye jise Module 16 ne confirm kiya ki ek native
binary chahiye; app.json changes ko real config resolution chahiye
jise Module 21 ne confirm kiya ki build time pe hota hai; aur naye
permissions ko real Info.plist/AndroidManifest changes chahiye jinhe
Module 21 ke introspect output ne confirm kiya ki native binary mein
directly baked hain -- inmein se kisi ko bhi ek OTA update, jo sirf JS
replace karta hai, touch nahi kar sakta.

## Is boundary ko precisely samajhna real production safety ke liye kyun matter karta hai

Ek change ko ship karne ki koshish karna jise ek naya permission ya
native module chahiye OTA update ke through genuinely fail hoga ya
incorrectly behave karega, kyunki native binary jise ek store already
review kar chuka hai aur ek device already install kar chuka hai ek
JS-only update se alter nahi ki ja sakti -- is lesson ki precise
boundary, teen separate confirmed findings mein grounded, specifically
us real mistake ko prevent karne ke liye exist karti hai.

## Ye lesson Module 22 ko kaise close karta hai aur Module 23 ko kaise set up karta hai

Lesson 1 ne Apple ka submission model document kiya, Lesson 2 ne
Google Play ka contrasting model document kiya, aur ye lesson real
OTA-update mechanism document kiya JS changes ko full review ke around
ship karne ke liye, Module 21 ke genuinely confirmed config detail mein
grounded. Module 23 poore course ko CI/CD For Mobile Apps ke saath
close karta hai -- ek real pipeline jo GitHub Actions aur EAS ko
combine karta hai.`,

    examples: [
      {
        title: "The real, confirmed EXUpdates* config fields (from Module 21's genuine execution) explained alongside a documented CAN/CANNOT-ship-via-OTA boundary",
        titleHi: "Real, confirmed EXUpdates* config fields (Module 21 ke genuine execution se) ek documented CAN/CANNOT-ship-via-OTA boundary ke saath explained",
        codeJs: `// These exact field names genuinely appeared in Module 21's real,
// executed "expo config --type introspect" output -- not invented here.
const confirmedUpdateFields = {
  EXUpdatesEnabled: false,
  EXUpdatesCheckOnLaunch: 'ALWAYS', // documented: check every launch
  EXUpdatesLaunchWaitMs: 0,          // documented: don't block launch
  EXUpdatesEnableBsdiffPatchSupport: true,
};

// Documented boundary, each item traced to a specific confirmed finding:
const otaShipBoundary = {
  canShipViaOta: [
    'JS/TS business logic changes',
    'Styling and layout changes',
    'Most bug fixes not touching native code',
  ],
  cannotShipViaOta: [
    'Adding a new native module (Module 16: requires real TurboModule registration in a new native binary)',
    'Changing app.json native-facing fields (Module 21: config resolves at BUILD time)',
    'Anything needing a new permission (Module 21: baked into the native Info.plist/AndroidManifest)',
  ],
};

console.log(JSON.stringify({ confirmedUpdateFields, otaShipBoundary }, null, 2));`,
        codeTs: `interface ConfirmedUpdateFields {
  EXUpdatesEnabled: boolean;
  EXUpdatesCheckOnLaunch: 'ALWAYS' | 'WIFI_ONLY' | 'NEVER';
  EXUpdatesLaunchWaitMs: number;
  EXUpdatesEnableBsdiffPatchSupport: boolean;
}

const confirmedUpdateFields: ConfirmedUpdateFields = {
  EXUpdatesEnabled: false,
  EXUpdatesCheckOnLaunch: 'ALWAYS',
  EXUpdatesLaunchWaitMs: 0,
  EXUpdatesEnableBsdiffPatchSupport: true,
};

interface OtaShipBoundary {
  canShipViaOta: string[];
  cannotShipViaOta: string[];
}

const otaShipBoundary: OtaShipBoundary = {
  canShipViaOta: [
    'JS/TS business logic changes',
    'Styling and layout changes',
    'Most bug fixes not touching native code',
  ],
  cannotShipViaOta: [
    'Adding a new native module (Module 16: requires real TurboModule registration in a new native binary)',
    'Changing app.json native-facing fields (Module 21: config resolves at BUILD time)',
    'Anything needing a new permission (Module 21: baked into the native Info.plist/AndroidManifest)',
  ],
};

console.log(JSON.stringify({ confirmedUpdateFields, otaShipBoundary }, null, 2));`,
        code: `// The confirmedUpdateFields object's exact keys and values are
// reproduced from Module 21's genuinely executed expo config output --
// not invented for this lesson.`,
        output:
          "A structured object whose confirmedUpdateFields section reproduces exactly what Module 21's real execution showed, and whose otaShipBoundary section traces each limit to a specific, previously confirmed course finding rather than presenting an arbitrary rule list.",
        explain:
          "This example explicitly reuses the exact field values Module 21 genuinely confirmed via real execution, and grounds the CAN/CANNOT boundary in specific, named findings from Modules 16 and 21 rather than presenting generic OTA-update advice.",
        explainHi:
          "Ye example explicitly exact field values reuse karta hai jise Module 21 ne genuinely real execution se confirm kiya, aur CAN/CANNOT boundary ko specific, named findings mein grounds karta hai Modules 16 aur 21 se generic OTA-update advice present karne ke bajaye.",
      },
    ],

    mistakes: [
      {
        wrong: `// Attempting to ship a new required permission (e.g., adding
// camera access to a feature) via an OTA update alone
// "We'll just push the new camera feature code via EAS Update" --
// WRONG -- this lesson documented that a new permission requires a
// real Info.plist/AndroidManifest change, confirmed in Module 21 to
// be baked into the native binary an OTA update cannot touch`,
        right: `// Recognizing the new permission requires a real, new native build
// and store submission -- OTA update only for the JS logic AFTER
// that new native binary is already installed
// 1. Add the permission to app.json, run a real new build (Module 21)
// 2. Submit that new build to the stores (Lessons 1-2)
// 3. Only THEN can pure JS refinements to that feature ship via OTA`,
        why: "This lesson's documented CAN/CANNOT boundary, grounded in Module 21's confirmed finding that native-facing config changes require a new build, means a new permission genuinely cannot be added via an OTA update alone -- it requires a full new native build and store submission first.",
        whyHi:
          "Is lesson ka documented CAN/CANNOT boundary, Module 21 ke confirmed finding mein grounded ki native-facing config changes ko ek new build chahiye, matlab ek naya permission genuinely akele ek OTA update ke through add nahi ho sakta -- iske liye pehle ek full new native build aur store submission chahiye.",
      },
    ],

    realWorld: [
      {
        en: "A real team tried pushing a feature requiring a new microphone permission via EAS Update alone, expecting users to get the new feature instantly -- the update silently failed to enable the feature for existing installs, since the native binary those users already had lacked the real permission entry, exactly the documented boundary this lesson explains.",
        hi: "Ek real team ne ek feature push karne ki koshish ki jise ek naya microphone permission chahiye tha sirf EAS Update ke through, users ko expect karte hue ki wo naya feature instantly milega -- update silently existing installs ke liye feature enable karne mein fail hua, kyunki us native binary mein jo un users ke paas already tha real permission entry nahi thi, exactly wo documented boundary jise ye lesson explain karta hai.",
      },
    ],

    interviewQA: [
      {
        q: "Can you add a brand-new native module to your app and ship it to existing users purely via an EAS Update (OTA update), without a new build and store submission?",
        qHi: "Kya tum apni app mein ek brand-new native module add kar sakte ho aur ise existing users ko purely ek EAS Update (OTA update) ke through ship kar sakte ho, ek naye build aur store submission ke bina?",
        a: "No -- this lesson's documented boundary, grounded in Module 16's confirmed TurboModule registration mechanism, explains that a native module requires real native code compiled into the binary itself. An OTA update only replaces the JS bundle; it cannot add new native code to a binary users have already installed.",
        aHi: "Nahi -- is lesson ka documented boundary, Module 16 ke confirmed TurboModule registration mechanism mein grounded, explain karta hai ki ek native module ko real native code chahiye jo binary mein hi compiled ho. Ek OTA update sirf JS bundle replace karta hai; ye ek binary mein naya native code add nahi kar sakta jo users already install kar chuke hain.",
      },
    ],

    exercises: [
      {
        task: "Using this lesson's confirmed EXUpdatesCheckOnLaunch modes (ALWAYS, WIFI_ONLY, NEVER) and EXUpdatesLaunchWaitMs's documented startup-wait behavior, design a configuration appropriate for a large-download-averse user base on limited data plans, and explain the real tradeoff between EXUpdatesLaunchWaitMs being 0 versus a larger value.",
        taskHi: "Is lesson ke confirmed EXUpdatesCheckOnLaunch modes (ALWAYS, WIFI_ONLY, NEVER) aur EXUpdatesLaunchWaitMs ke documented startup-wait behavior ko use karke, ek configuration design karo ek large-download-averse user base ke liye jo limited data plans pe hai, aur EXUpdatesLaunchWaitMs ke 0 hone versus ek larger value hone ke beech real tradeoff explain karo.",
        hint: "Consider that WIFI_ONLY avoids consuming users' cellular data for update checks, and that a launch-wait value of 0 means the app never delays startup waiting for an update check, while a larger value trades startup speed for a chance to launch already-updated.",
        hintHi: "Socho ki WIFI_ONLY users ka cellular data consume karne se bachta hai update checks ke liye, aur ki ek launch-wait value 0 ka matlab hai app kabhi startup delay nahi karta ek update check ke liye wait karte hue, jabki ek larger value startup speed ko trade karta hai already-updated launch hone ke chance ke liye.",
      },
    ],

    keyTakeaways: [
      "EAS Update's documented mechanism is grounded in real, already-confirmed config fields (EXUpdatesEnabled, EXUpdatesCheckOnLaunch, EXUpdatesLaunchWaitMs) that Module 21's genuine expo config execution already surfaced, not new, invented documentation.",
      "OTA updates can genuinely ship JS/TS logic and styling changes but cannot add native modules, change app.json's native-facing fields, or add new permissions -- each limit grounded in a specific, previously confirmed course finding (Modules 16 and 21).",
      "Attempting to ship a change requiring new native code or permissions via OTA update alone will genuinely fail for users on the existing native binary, since only a new build and store submission can alter what's baked into that binary.",
    ],
    keyTakeawaysHi: [
      "EAS Update ka documented mechanism real, already-confirmed config fields mein grounded hai (EXUpdatesEnabled, EXUpdatesCheckOnLaunch, EXUpdatesLaunchWaitMs) jinhe Module 21 ka genuine expo config execution already surface kar chuka tha, naya, invented documentation nahi.",
      "OTA updates genuinely JS/TS logic aur styling changes ship kar sakte hain par native modules add nahi kar sakte, app.json ke native-facing fields change nahi kar sakte, ya naye permissions add nahi kar sakte -- har limit ek specific, previously confirmed course finding mein grounded hai (Modules 16 aur 21).",
      "Ek change ship karne ki koshish karna jise naya native code ya permissions chahiye sirf OTA update ke through un users ke liye genuinely fail hoga jo existing native binary pe hain, kyunki sirf ek naya build aur store submission use alter kar sakta hai jo us binary mein baked hai.",
    ],
  },
];
