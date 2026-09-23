/**
 * Guitar Course — Module 12: Modern Tools & Apps, lessons 1-3. Closes
 * Part IV (Modern Fast-Learning Practice Science).
 *
 * Lesson 1: Tuner and metronome apps — the two non-negotiable basics,
 *           and what to actually look for in one.
 * Lesson 2: Slow-downer/looper apps for learning real songs by ear.
 * Lesson 3: Why the app+video+course combination beats a traditional
 *           method book for speed, and how to use it without drowning
 *           in options.
 */

import type { CourseLesson } from './course-js-module1';

export const GUITAR_MODULE_12: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'tuner-and-metronome-apps',
    title: 'Tuner and Metronome Apps — The Non-Negotiables',
    titleHi: 'Tuner Aur Metronome Apps — Non-Negotiables',
    description: 'The two tools this entire course has already assumed you have access to, made explicit, with what actually matters when choosing one.',
    descriptionHi: 'Do tools jo ye poora course already assume kar chuka hai tumhare paas access hai, explicitly banaya gaya, us cheez ke saath jo ek choose karte waqt actually matter karti hai.',
    difficulty: 'EASY',
    duration: 10,
    order: 1,

    analogy: {
      en: '**A carpenter\'s tape measure and level.** No carpenter debates whether to own a tape measure — it\'s simply assumed equipment, the question is only which specific one. A tuner and a metronome are exactly that baseline for guitar: not optional extras, foundational equipment this whole course has quietly assumed since Module 2.',
      hi: '**Ek carpenter ki tape measure aur level.** Koi carpenter debate nahi karta ki tape measure rakhni hai ya nahi — ye simply assumed equipment hai, sawaal sirf ye hai ki kaunsi specific wali. Ek tuner aur ek metronome guitar ke liye exactly wahi baseline hain: optional extras nahi, foundational equipment jise ye poora course Module 2 se chupke se assume kar raha hai.',
    },

    simple: `**What actually matters in a tuner app (most free ones are fine):**
- Clear visual feedback on sharp/flat and how far off you are, not just a vague "in tune / out of tune."
- Chromatic mode (detects any note, not just the 6 standard ones) — useful even now, essential once alternate tunings come up much later.
- Microphone-based detection that works reliably in a normal room, without needing dead silence.

**What actually matters in a metronome app:**
- Adjustable tempo in small increments (1 bpm steps ideally), matching Module 9's small-increment progression method.
- A clear, distinct sound — some apps let you choose the click sound, which matters if the default is hard to hear against your guitar\'s volume.
- Visual beat indication (a flashing light or similar) as a backup to the audio click, useful when practicing quietly.

**The honest recommendation:** any well-reviewed free tuner and metronome app is genuinely sufficient — this course is not endorsing a specific paid product, since the free tier of many options fully covers everything described here.`,
    simpleHi: `**Ek tuner app mein actually kya matter karta hai (zyadatar free wale theek hain):**
- Sharp/flat par clear visual feedback aur tum kitne off ho, sirf ek vague "in tune / out of tune" nahi.
- Chromatic mode (koi bhi note detect karta hai, sirf 6 standard nahi) — abhi bhi useful, bahut baad mein alternate tunings aane par essential.
- Microphone-based detection jo ek normal room mein reliably kaam kare, dead silence ki zaroorat ke bina.

**Ek metronome app mein actually kya matter karta hai:**
- Small increments mein adjustable tempo (ideally 1 bpm steps), Module 9 ke small-increment progression method se match karte hue.
- Ek clear, distinct sound — kuch apps tumhe click sound choose karne dete hain, jo matter karta hai agar default tumhari guitar ki volume ke against sunna hard ho.
- Visual beat indication (ek flashing light ya similar) audio click ke backup ki tarah, quietly practice karte waqt useful.

**Honest recommendation:** koi bhi well-reviewed free tuner aur metronome app genuinely sufficient hai — ye course kisi specific paid product ko endorse nahi kar raha, kyunki bahut saare options ka free tier yahan describe ki gayi har cheez ko fully cover karta hai.`,

    content: `**Why this course has deliberately treated these two tools as assumed infrastructure rather than teaching them earlier as their own topic.** Introducing "here\'s a tuner app" as a standalone lesson back in Module 2 would have interrupted the actual learning flow at that point; by Module 12, you\'ve now used both tools enough in practice (tuning every session since Module 2, metronome work since Module 9) that this lesson can meaningfully explain WHAT to look for, informed by real hands-on context rather than abstract feature descriptions.

**Why chromatic mode matters even though this course has only used standard tuning so far.** Standard EADGBE is a starting point, not the only tuning that exists — Module 25 touches on alternate tunings briefly, and even before that, a chromatic tuner is simply more broadly useful and costs nothing extra over a 6-note-only tuner. There\'s no real downside to choosing a chromatic-capable app from the start.

**A genuinely important point about paid vs. free**: this course deliberately avoids recommending specific paid products, partly because app landscapes change constantly (a specific named app might not exist or might change pricing by the time you read this), and partly because the free tier of virtually every reputable tuner/metronome app fully covers a beginner\'s and intermediate\'s actual needs. Paid upgrades in this category are almost always about convenience polish, not core functionality you\'re missing.`,
    contentHi: `**Ye course ne deliberately in do tools ko assumed infrastructure ki tarah kyun treat kiya hai, unhe pehle apna khud ka topic ki tarah sikhane ke bajaye.** "Ye raha ek tuner app" ko Module 2 mein wapas ek standalone lesson ki tarah introduce karna us point par actual learning flow ko interrupt karta. Module 12 tak, tum ab dono tools ko practice mein kaafi use kar chuke ho (Module 2 se har session tune kiya, Module 9 se metronome kaam kiya) ki ye lesson meaningfully explain kar sake WHAT dekhna hai, abstract feature descriptions ke bajaye real hands-on context se informed.

**Chromatic mode kyun matter karta hai chahe is course ne ab tak sirf standard tuning use ki hai.** Standard EADGBE ek starting point hai, wo aakhri tuning nahi jo exist karti — Module 25 briefly alternate tunings touch karta hai, aur uske pehle bhi, ek chromatic tuner simply ek 6-note-only tuner se zyada broadly useful hai aur kuch extra cost nahi karta. Shuru se ek chromatic-capable app choose karne mein koi real downside nahi hai.

**Paid vs free ke baare mein ek genuinely important point:** ye course deliberately specific paid products recommend karne se bachta hai, partly kyunki app landscapes constantly badalte hain (ek specific named app tumhare ise padhne tak exist nahi kar sakta ya pricing badal sakta hai), aur partly kyunki virtually har reputable tuner/metronome app ka free tier ek beginner aur intermediate ki actual needs ko fully cover karta hai. Is category mein paid upgrades almost hamesha convenience polish ke baare mein hain, core functionality nahi jo tumse miss ho rahi hai.`,

    examples: [
      {
        title: 'A quick checklist for evaluating any tuner/metronome app',
        titleHi: 'Kisi bhi tuner/metronome app evaluate karne ke liye ek quick checklist',
        code: `Tuner app:
[ ] Clear sharp/flat visual feedback
[ ] Chromatic mode available
[ ] Works reliably via microphone in a normal room

Metronome app:
[ ] Small tempo increments (1 bpm ideally)
[ ] Clear, adjustable click sound
[ ] Visual beat indicator available`,
        explain:
          'This checklist is deliberately feature-based rather than naming specific apps — it stays useful regardless of which particular apps exist or are popular by the time you\'re reading this.',
        explainHi:
          'Ye checklist deliberately feature-based hai specific apps naam lene ke bajaye — ye useful rehta hai chahe tum ise padhte waqt kaunse particular apps exist karte hon ya popular hon.',
      },
    ],

    mistakes: [
      {
        wrong: 'Spending significant time researching and comparing "the best" tuner/metronome app before starting to practice with any of them.',
        right: 'Pick any well-reviewed free option meeting the checklist above and start using it immediately — the differences between reasonable options are marginal.',
        why: 'The tool itself matters far less than consistently using SOME tool — excessive comparison-shopping for a marginal improvement delays the actual practice that any reasonable choice would already support.',
        whyHi: 'Tool khud us se kahin kam matter karta hai jitna consistently KOI tool use karna — ek marginal improvement ke liye excessive comparison-shopping us actual practice ko delay karta hai jise koi bhi reasonable choice already support karta.',
      },
    ],

    realWorld: [
      {
        en: 'Professional musicians overwhelmingly use the same category of simple, free/cheap tuner and metronome apps as beginners do — this isn\'t a category where professionals need expensive specialized tools, the basic feature set genuinely covers the need at every level.',
        hi: 'Professional musicians overwhelmingly wahi category ke simple, free/cheap tuner aur metronome apps use karte hain jo beginners karte hain — ye ek aisi category nahi hai jahan professionals ko expensive specialized tools chahiye, basic feature set genuinely har level par need cover karta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Do I need separate tuner and metronome apps, or is a combined app fine?',
        qHi: 'Kya mujhe alag tuner aur metronome apps chahiye, ya ek combined app theek hai?',
        a: 'A combined app is completely fine and often more convenient — there\'s no functional downside to one app handling both, as long as it meets the checklist criteria for each function.',
        aHi: 'Ek combined app completely theek hai aur often zyada convenient hai — ek app ka dono handle karna koi functional downside nahi rakhta, jab tak ye har function ke liye checklist criteria meet kare.',
      },
    ],

    exercises: [
      {
        task: 'If you don\'t already have both a tuner and metronome app installed, install one of each today (or confirm your current ones meet the checklist above).',
        taskHi: 'Agar tumhare paas already tuner aur metronome dono apps installed nahi hain, aaj ek-ek install karo (ya confirm karo ki tumhare current wale upar wale checklist ko meet karte hain).',
        hint: 'Don\'t spend more than a few minutes choosing — per this lesson, the marginal differences between reasonable options aren\'t worth extended research time.',
        hintHi: 'Choose karne mein kuch minutes se zyada mat lagao — is lesson ke hisaab se, reasonable options ke beech marginal differences extended research time ke layak nahi hain.',
      },
    ],

    keyTakeaways: [
      'A tuner app needs clear sharp/flat feedback, chromatic mode, and reliable mic-based detection.',
      'A metronome app needs small tempo increments, a clear click, and ideally a visual beat indicator.',
      'Free tiers of reputable apps fully cover a beginner\'s and intermediate\'s needs — don\'t over-invest time comparing options.',
    ],
    keyTakeawaysHi: [
      'Ek tuner app ko clear sharp/flat feedback, chromatic mode, aur reliable mic-based detection chahiye.',
      'Ek metronome app ko small tempo increments, ek clear click, aur ideally ek visual beat indicator chahiye.',
      'Reputable apps ke free tiers ek beginner aur intermediate ki needs ko fully cover karte hain — options compare karne mein zyada time over-invest mat karo.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'slow-downer-and-looper-apps',
    title: 'Slow-Downer & Looper Apps — Learning Real Songs by Ear',
    titleHi: 'Slow-Downer Aur Looper Apps — Kaan Se Real Songs Seekhna',
    description: 'A genuinely modern capability that didn\'t meaningfully exist for home learners a generation ago — slowing down a real recording without changing its pitch.',
    descriptionHi: 'Ek genuinely modern capability jo ek generation pehle home learners ke liye meaningfully exist nahi karti thi — ek real recording ko uski pitch badle bina slow karna.',
    difficulty: 'EASY',
    duration: 15,
    order: 2,

    analogy: {
      en: '**Slow-motion instant replay for music.** A sports broadcast slow-motion replay lets you see exactly what happened in a fast play, frame by frame, without the players actually moving slower in real life. A slow-downer app does the same thing for a song\'s audio — you hear exactly what a fast riff or strum pattern contains, without the recording artist actually re-recording it slower for you.',
      hi: '**Music ke liye slow-motion instant replay.** Ek sports broadcast slow-motion replay tumhe exactly dikhata hai ki ek fast play mein kya hua, frame by frame, bina players ke real life mein actually slower move kiye. Ek slow-downer app song ke audio ke liye wahi kaam karta hai — tum exactly sunte ho ki ek fast riff ya strum pattern mein kya hai, bina recording artist ke tumhare liye actually use slower re-record kiye.',
    },

    simple: `**What these apps actually do:** slow down a recording's playback speed (sometimes down to 25-50% of normal) WITHOUT lowering its pitch — a genuine, non-trivial audio processing feat that makes fast passages actually hearable in detail, note by note or strum by strum.

**Why this matters for learning real songs specifically:** a strumming pattern or chord change that sounds like an unintelligible blur at normal speed often becomes completely clear and learnable at 50% speed, played back note-by-note. This turns "I can't figure out what they're even doing here" into a solvable, mechanical listening task.

**A basic workflow:**
1. Find a song you want to learn (Module 13 covers picking beginner-appropriate songs).
2. Load it into a slow-downer app (many are free, including some general-purpose music player apps with a speed control built in).
3. Slow the tricky section down until you can clearly identify what's happening.
4. Loop just that section repeatedly while you work out chords/pattern by ear, gradually speeding back up to normal as you get it.`,
    simpleHi: `**Ye apps actually kya karte hain:** ek recording ki playback speed slow karte hain (kabhi kabhi normal ka 25-50% tak) uski pitch lower kiye BINA — ek genuine, non-trivial audio processing feat jo fast passages ko actually detail mein hearable banata hai, note by note ya strum by strum.

**Ye specifically real songs seekhne ke liye kyun matter karta hai:** ek strumming pattern ya chord change jo normal speed par ek unintelligible blur jaisa sound karta hai often 50% speed par completely clear aur learnable ban jaata hai, note-by-note played back. Ye "mujhe samajh nahi aa raha yahan wo kya kar rahe hain" ko ek solvable, mechanical listening task mein badal deta hai.

**Ek basic workflow:**
1. Ek song dhoondo jo tum seekhna chahte ho (Module 13 beginner-appropriate songs pick karna cover karta hai).
2. Use ek slow-downer app mein load karo (bahut saare free hain, kuch general-purpose music player apps sameet jinmein ek built-in speed control hai).
3. Tricky section ko tab tak slow karo jab tak clearly identify na kar sako ki kya ho raha hai.
4. Sirf us section ko repeatedly loop karo jabki tum kaan se chords/pattern figure out karte ho, gradually normal tak wapas speed up karte hue jaise jaise tumhe wo aata hai.`,

    content: `**Why pitch-preserving speed change is a genuinely non-trivial, historically recent capability worth appreciating.** Simply slowing down analog audio (like an old tape or vinyl) drops its pitch proportionally — a song slowed to 50% sounds an octave lower, distorted and often useless for learning specific notes. Modern time-stretching algorithms separate speed from pitch entirely, a real digital signal processing achievement that's now freely available in consumer apps — this genuinely wasn't practically accessible to home learners a generation ago, unlike most of this module's other "modern" tools, which are really just digitized versions of things that existed before (a metronome, a tuner).

**How this connects to and accelerates Module 8's "adapt the pattern by ear" skill.** That lesson described listening for strong beats to identify strum patterns; a slow-downer app makes that listening task dramatically easier while the ear-training skill itself is still developing, functioning as training wheels for exactly the skill Module 8 introduced — useful now, and something you'll rely on less as your ear naturally improves with experience.

**A genuine caution: slow-downer tools accelerate learning a specific song, but don't replace ear training itself.** Relying on them forever for every new song without ever practicing identifying patterns at full speed by ear means the underlying ear-training skill never fully develops. Use them as a real accelerant while learning something new and difficult, but periodically challenge yourself to identify a pattern at full speed first, before reaching for the slow-down tool.`,
    contentHi: `**Pitch-preserving speed change ek genuinely non-trivial, historically recent capability kyun hai jise appreciate karna chahiye.** Simply analog audio (jaise ek purani tape ya vinyl) ko slow karna uski pitch proportionally drop kar deta hai — ek song 50% tak slow kiya gaya ek octave lower sound karta hai, distorted aur often specific notes seekhne ke liye useless. Modern time-stretching algorithms speed ko pitch se poori tarah separate karte hain, ek real digital signal processing achievement jo ab consumer apps mein freely available hai — ye genuinely ek generation pehle home learners ke liye practically accessible nahi thi, is module ke doosre "modern" tools ke ulta, jo really un cheezon ke digitized versions hain jo pehle exist karti thin (ek metronome, ek tuner).

**Ye Module 8 ki "kaan se pattern adapt karo" skill se kaise connect hota hai aur use accelerate karta hai.** Us lesson ne strum patterns identify karne ke liye strong beats sunne ke baare mein describe kiya tha; ek slow-downer app us listening task ko dramatically easier banata hai jabki ear-training skill khud abhi bhi develop ho rahi hai, exactly Module 8 mein introduce hui skill ke liye training wheels ki tarah function karte hue — abhi useful, aur kuch jispar tum kam rely karoge jaise jaise tumhara ear experience ke saath naturally improve hota hai.

**Ek genuine caution: slow-downer tools ek specific song seekhna accelerate karte hain, lekin ear training ko khud replace nahi karte.** Har naye song ke liye hamesha unhe forever rely karna bina kabhi full speed par kaan se patterns identify karne ki practice kiye matlab hai underlying ear-training skill kabhi poori tarah develop nahi hoti. Unhe ek real accelerant ki tarah use karo kuch naya aur difficult seekhte waqt, lekin periodically khud ko challenge karo ek pattern ko pehle full speed par identify karne ke liye, slow-down tool tak pahunchne se pehle.`,

    examples: [
      {
        title: 'A concrete slow-downer workflow',
        titleHi: 'Ek concrete slow-downer workflow',
        code: `1. Song has a strum pattern that sounds unclear at full speed.
2. Slow to 50% in the app. Listen again — pattern becomes distinguishable.
3. Loop just that 4-bar section, counting along (Module 8's "1 & 2 & ...").
4. Once identified, try playing along at 50% speed.
5. Increase app speed in steps (60%, 75%, 90%, 100%) as your own playing keeps up.`,
        explain:
          "Step 5's gradual speed increase mirrors Module 9's metronome step-down method exactly, just applied to matching a recording instead of a click — the same slow-then-fast principle from Module 10 shows up here too.",
        explainHi:
          "Step 5 ka gradual speed increase exactly Module 9 ke metronome step-down method ko mirror karta hai, bas ek click ke bajaye ek recording match karne par apply hote hue — Module 10 ka wahi slow-then-fast principle yahan bhi dikhta hai.",
      },
    ],

    mistakes: [
      {
        wrong: 'Always reaching immediately for a slow-downer app for every new song, never attempting full-speed listening first.',
        right: 'Try identifying a pattern by ear at full speed first; use the slow-downer as a tool for genuinely difficult passages, not a default first step every time.',
        why: 'Skipping the full-speed attempt every single time means the underlying ear-training skill (Module 8) never gets exercised on its own, staying permanently dependent on the tool rather than gradually needing it less.',
        whyHi: 'Har single baar full-speed attempt skip karna matlab hai underlying ear-training skill (Module 8) kabhi apne aap exercise nahi hoti, tool par permanently dependent rehti hai, gradually kam zaroorat padne ke bajaye.',
      },
    ],

    realWorld: [
      {
        en: 'Before this technology was widely accessible, learners would manually slow down cassette tapes or records (dropping pitch along with speed) and mentally compensate, or simply couldn\'t learn certain fast passages accurately at all — this is a genuine, meaningful quality-of-life upgrade for self-taught musicians.',
        hi: 'Ye technology widely accessible hone se pehle, learners manually cassette tapes ya records ko slow karte the (speed ke saath pitch bhi drop hoti) aur mentally compensate karte the, ya simply kuch fast passages ko accurately seekh hi nahi paate the — ye self-taught musicians ke liye ek genuine, meaningful quality-of-life upgrade hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Can I use these apps on any song, or only specific formats?',
        qHi: 'Kya main ye apps kisi bhi song par use kar sakta hoon, ya sirf specific formats par?',
        a: 'Most modern slow-downer apps work on any audio you can load into them — streamed audio, downloaded files, or even audio captured from video. Specific compatibility varies by app, but the core capability is broadly available.',
        aHi: 'Zyadatar modern slow-downer apps kisi bhi audio par kaam karte hain jo tum unmein load kar sako — streamed audio, downloaded files, ya video se captured audio bhi. Specific compatibility app se app alag hoti hai, lekin core capability broadly available hai.',
      },
    ],

    exercises: [
      {
        task: 'Pick a song you like with a strum pattern that sounds tricky to you. Try identifying the pattern by ear at full speed for 2 minutes first, then use a slow-downer app to check your guess and refine it.',
        taskHi: 'Ek song pick karo jo tumhe pasand hai jiska strum pattern tumhe tricky lagta hai. Pehle 2 minutes ke liye full speed par kaan se pattern identify karne ki koshish karo, phir apni guess check aur refine karne ke liye ek slow-downer app use karo.',
        hint: 'Whatever you get right at full speed, before slowing down, is a genuine measure of your current ear-training progress — worth noting even if the initial guess was mostly wrong.',
        hintHi: 'Slow karne se pehle full speed par tumhe jo bhi sahi mila, wo tumhare current ear-training progress ka ek genuine measure hai — note karne layak hai chahe initial guess zyadatar galat thi.',
      },
    ],

    keyTakeaways: [
      'Slow-downer apps change playback speed without changing pitch — a genuine, relatively modern capability, unlike simply slowing analog audio.',
      'This makes learning fast riffs/patterns by ear dramatically more accessible, especially while your ear-training skill is still developing.',
      'Use it as an accelerant, not a permanent crutch — periodically attempt full-speed listening first to keep exercising the underlying ear-training skill.',
    ],
    keyTakeawaysHi: [
      'Slow-downer apps pitch badle bina playback speed change karte hain — ek genuine, relatively modern capability, simply analog audio slow karne ke ulta.',
      'Ye kaan se fast riffs/patterns seekhna dramatically zyada accessible banata hai, especially jab tumhari ear-training skill abhi bhi develop ho rahi ho.',
      'Ise ek accelerant ki tarah use karo, permanent crutch nahi — underlying ear-training skill ko exercise karte rehne ke liye periodically pehle full-speed listening attempt karo.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'why-modern-tools-beat-method-books',
    title: 'Why Apps + Video + This Course Beat a Traditional Method Book',
    titleHi: 'Apps + Video + Ye Course Ek Traditional Method Book Se Better Kyun Hain',
    description: 'Closing Part IV by naming explicitly why this era of learning guitar is genuinely faster than a generation ago — and how to use that abundance without drowning in it.',
    descriptionHi: 'Part IV ko explicitly naam dete hue close karna ki ye guitar seekhne ka era ek generation pehle se genuinely fast kyun hai — aur us abundance ko bina usme doobe use kaise karein.',
    difficulty: 'EASY',
    duration: 10,
    order: 3,

    analogy: {
      en: '**A modern kitchen with a thermometer and timer vs. cooking entirely by guesswork.** A traditional method book is like a recipe with no thermometer, no timer, no way to check your progress against a real reference until the dish is finished (or ruined). Modern tools — tuner feedback, metronome precision, slow-downer verification against a real recording — are the thermometer and timer: constant, objective feedback loops a book alone can\'t provide.',
      hi: '**Ek modern kitchen jismein thermometer aur timer ho vs poori tarah guesswork se cooking karna.** Ek traditional method book ek aisi recipe jaisi hai jismein koi thermometer nahi, koi timer nahi, apni progress ko ek real reference ke against check karne ka koi tareeka nahi jab tak dish finish (ya ruined) na ho jaaye. Modern tools — tuner feedback, metronome precision, ek real recording ke against slow-downer verification — thermometer aur timer hain: constant, objective feedback loops jo akela ek book nahi de sakti.',
    },

    simple: `**Three specific advantages modern tools give you that a book alone genuinely cannot:**

1. **Objective feedback, instantly.** A tuner tells you exactly how far off-pitch a string is. A book can only describe what "in tune" sounds like in words — a poor substitute for direct measurement.
2. **Real reference audio, always available.** Wanting to hear exactly how a chord or pattern should sound is one search away, at any speed (Lesson 2), from real recordings — a book\'s written description of a sound is necessarily approximate.
3. **Infinitely patient, precisely calibrated repetition.** A metronome holds a tempo with total consistency for as many reps as needed — no book can "count out loud" for you at exactly 62 bpm for twenty straight minutes.

**How to use this abundance without drowning in it:** this course is deliberately structured as your spine — the order, the reasoning, the progression — with specific tools (tuner, metronome, slow-downer) plugged in at the exact points they're actually useful, rather than needing to independently discover and sequence dozens of scattered resources yourself.`,
    simpleHi: `**Teen specific advantages jo modern tools tumhe dete hain jo akela ek book genuinely nahi de sakti:**

1. **Objective feedback, instantly.** Ek tuner tumhe exactly batata hai ki ek string kitni off-pitch hai. Ek book sirf words mein describe kar sakti hai ki "in tune" kaisa sound karta hai — direct measurement ke liye ek poor substitute.
2. **Real reference audio, hamesha available.** Exactly sunna chahna ki ek chord ya pattern kaisa sound karna chahiye ek search door hai, kisi bhi speed par (Lesson 2), real recordings se — ek book ki sound ki written description necessarily approximate hai.
3. **Infinitely patient, precisely calibrated repetition.** Ek metronome ek tempo ko total consistency ke saath jitni zaroorat ho utne reps ke liye hold karta hai — koi book tumhare liye exactly 62 bpm par twenty seedhe minutes tak "zor se count" nahi kar sakti.

**Is abundance ko bina usme doobe kaise use karein:** ye course deliberately tumhari spine ki tarah structured hai — order, reasoning, progression — specific tools (tuner, metronome, slow-downer) ke saath exactly un points par plugged in jahan wo actually useful hain, dazzon scattered resources ko independently khud discover aur sequence karne ki zaroorat ke bajaye.`,

    content: `**Why this course explicitly names and sequences tool usage instead of leaving "go find some apps" as a vague suggestion.** Tool abundance without guidance creates a genuinely real modern problem: decision paralysis, and the temptation to endlessly research "the best" option instead of practicing (Lesson 1's mistake, generalized). This course tells you specifically WHEN to reach for a tuner (every session), WHEN a metronome (Module 9 onward), and WHEN a slow-downer (learning a specific hard song section) — removing the discovery and sequencing burden so the tools accelerate rather than distract.

**Why a traditional method book isn't "wrong," just missing feedback loops modern tools provide for free.** Method books contain genuinely good pedagogical sequencing and explanation — many of this course's own explanations draw on well-established teaching wisdom. The gap isn't content quality, it's the total absence of real-time, objective, personalized feedback a static page can never provide, which is exactly what a tuner, metronome, and slow-downer supply.

**A closing thought for Part IV as a whole.** Modules 10-12 have been about the PROCESS of learning efficiently — spaced repetition, chunking, slow-then-fast, structured sessions, honest self-diagnosis, injury awareness, and now, tool literacy. Every module from here forward (starting with real songs in Module 13) is content to apply this process TO — the process itself, not any single piece of content, is what makes learning fast from here on.`,
    contentHi: `**Ye course explicitly tool usage kyun naam aur sequence karta hai, "kuch apps dhoondh lo" ko ek vague suggestion ki tarah chhodne ke bajaye.** Bina guidance ke tool abundance ek genuinely real modern problem create karta hai: decision paralysis, aur practice karne ke bajaye endlessly "best" option research karne ki temptation (Lesson 1 ki mistake, generalized). Ye course tumhe specifically batata hai KAB tuner ke liye pahunchna hai (har session), KAB ek metronome (Module 9 se aage), aur KAB ek slow-downer (ek specific hard song section seekhna) — discovery aur sequencing burden hata dete hue taaki tools distract karne ke bajaye accelerate karein.

**Ek traditional method book "galat" kyun nahi hai, bas wo feedback loops missing hain jo modern tools free mein provide karte hain.** Method books mein genuinely achhi pedagogical sequencing aur explanation hoti hai — is course ke apne bahut saare explanations well-established teaching wisdom par draw karte hain. Gap content quality nahi hai, ye real-time, objective, personalized feedback ki poori absence hai jo ek static page kabhi provide nahi kar sakta, jo exactly wahi hai jo ek tuner, metronome, aur slow-downer supply karte hain.

**Part IV ke liye ek closing thought, poore taur par.** Modules 10-12 efficiently seekhne ke PROCESS ke baare mein rahe hain — spaced repetition, chunking, slow-then-fast, structured sessions, honest self-diagnosis, injury awareness, aur ab, tool literacy. Yahan se aage har module (Module 13 mein real songs se shuru hote hue) is process ko APPLY karne ke liye content hai — process khud, koi single piece of content nahi, wo hai jo yahan se seekhna fast banata hai.`,

    examples: [
      {
        title: 'The tool-usage map, Modules 2-12 summarized',
        titleHi: 'Tool-usage map, Modules 2-12 summarized',
        code: `Tuner:        every practice session, from Module 2 onward.
Metronome:    from Module 9 onward, especially for new patterns/tempo work.
Slow-downer:  when learning a specific real song with a hard-to-parse section (Module 13+).
Recording:    weekly, for self-diagnosis (Module 11).`,
        explain:
          'Seeing all four tools\' usage timing laid out together makes clear this was never "figure out the tools yourself" — the course has been the sequencing logic the whole time, with each tool introduced exactly when it became useful, not before.',
        explainHi:
          'Chaaron tools ki usage timing ko saath mein laid out dekhna clear karta hai ki ye kabhi "tools khud figure out karo" nahi tha — course poori der sequencing logic raha hai, har tool exactly tab introduce hua jab wo useful bana, uske pehle nahi.',
      },
    ],

    mistakes: [
      {
        wrong: 'Feeling obligated to research and adopt every trending guitar-learning app or tool mentioned online, on top of what this course already specifies.',
        right: 'Use the specific tools this course has named (tuner, metronome, slow-downer, self-recording) well, rather than chasing every new option that appears.',
        why: 'Tool-collecting without deep, consistent usage of any single one provides less real benefit than mastering the small, sufficient toolkit this course has already sequenced for you.',
        whyHi: 'Kisi ek ke deep, consistent usage ke bina tool-collecting us chhote, sufficient toolkit ko master karne se kam real benefit deta hai jo ye course tumhare liye already sequence kar chuka hai.',
      },
    ],

    realWorld: [
      {
        en: 'This same "abundance without guidance causes paralysis" phenomenon shows up across every self-taught skill in the internet era, not just guitar — the actual bottleneck for most self-learners today is rarely access to information, it\'s a lack of trustworthy sequencing through that information.',
        hi: 'Ye same "guidance ke bina abundance paralysis cause karta hai" phenomenon internet era mein har self-taught skill ke across dikhta hai, sirf guitar nahi — zyadatar self-learners ke liye aaj ka actual bottleneck rarely information tak access hai, ye us information ke through ek trustworthy sequencing ki kami hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Should I still buy a traditional method book alongside this course?',
        qHi: 'Kya mujhe is course ke saath abhi bhi ek traditional method book kharidni chahiye?',
        a: "Not necessary — this course covers the same pedagogical ground a good method book would, while also integrating the real-time feedback tools a static book can't provide. A book isn't harmful to also have, but it's genuinely not required.",
        aHi: 'Zaroori nahi — ye course wahi pedagogical ground cover karta hai jo ek achhi method book karti, saath mein wo real-time feedback tools bhi integrate karte hue jo ek static book provide nahi kar sakti. Ek book rakhna harmful nahi hai, lekin ye genuinely required nahi hai.',
      },
    ],

    exercises: [
      {
        task: 'Write down (or mentally confirm) the four-tool map from the example above, and check that you currently have working access to all four (tuner app, metronome app, a slow-downer app or player with speed control, and a way to record yourself).',
        taskHi: 'Upar wale example ka four-tool map likho (ya mentally confirm karo), aur check karo ki tumhare paas currently saare char tak working access hai (tuner app, metronome app, ek slow-downer app ya speed control wala player, aur khud ko record karne ka ek tareeka).',
        hint: 'If any of the four is missing, that\'s a concrete, small action item — closing that gap now means Module 13 onward can be used at full effectiveness from the start.',
        hintHi: 'Agar char mein se koi missing hai, ye ek concrete, small action item hai — ab wo gap close karna matlab hai Module 13 se aage shuru se full effectiveness par use ho sakta hai.',
      },
    ],

    keyTakeaways: [
      'Modern tools provide objective, instant, infinitely patient feedback loops a static method book genuinely cannot.',
      'This course sequences WHEN to use each tool, removing the decision-paralysis risk of an unguided abundance of options.',
      'The toolkit is small and sufficient (tuner, metronome, slow-downer, self-recording) — depth of use beats collecting more tools.',
    ],
    keyTakeawaysHi: [
      'Modern tools objective, instant, infinitely patient feedback loops dete hain jo ek static method book genuinely nahi de sakti.',
      'Ye course sequence karta hai ki KAB har tool use karna hai, options ke unguided abundance ke decision-paralysis risk ko hata dete hue.',
      'Toolkit chhota aur sufficient hai (tuner, metronome, slow-downer, self-recording) — use ki depth zyada tools collect karne se better hai.',
    ],
  },
];
