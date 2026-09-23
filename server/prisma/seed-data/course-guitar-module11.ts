/**
 * Guitar Course — Module 11: Breaking Plateaus & Avoiding Bad Habits,
 * lessons 1-3.
 *
 * Lesson 1: Self-diagnosing a stuck spot instead of vaguely feeling stuck.
 * Lesson 2: Recording yourself as a diagnostic tool (extending Module 9\'s
 *           timing-specific use of it to a general practice).
 * Lesson 3: Injury prevention and hand-tension awareness — a genuine
 *           safety topic, not just a technique one.
 */

import type { CourseLesson } from './course-js-module1';

export const GUITAR_MODULE_11: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'self-diagnosing-a-plateau',
    title: 'Self-Diagnosing a Plateau',
    titleHi: 'Ek Plateau Ko Self-Diagnose Karna',
    description: '"I feel stuck" is not a diagnosis — it is a symptom. This lesson gives you the questions that turn it into one.',
    descriptionHi: '"Main stuck feel karta hoon" ek diagnosis nahi hai — ye ek symptom hai. Ye lesson tumhe wo sawaal deta hai jo ise ek diagnosis banate hain.',
    difficulty: 'MEDIUM',
    duration: 15,
    order: 1,

    analogy: {
      en: '**A mechanic asking specific questions instead of just "the car sounds weird."** "My car sounds weird" tells a mechanic almost nothing actionable. "It makes a grinding noise specifically when braking, not when accelerating" points straight at the brakes. A vague "I feel stuck on guitar" is exactly as unhelpful as the first description — this lesson is the mechanic\'s specific-questions checklist, applied to your playing.',
      hi: '**Ek mechanic jo specific sawaal poochta hai, sirf "car weird sound karti hai" ke bajaye.** "Meri car weird sound karti hai" ek mechanic ko almost kuch actionable nahi batata. "Ye specifically braking ke waqt ek grinding noise karti hai, accelerating ke waqt nahi" seedha brakes ki taraf point karta hai. Ek vague "main guitar par stuck feel karta hoon" bilkul pehli description jitna hi unhelpful hai — ye lesson wahi mechanic ka specific-questions checklist hai, tumhari playing par apply hua.',
    },

    simple: `**The diagnostic questions to ask yourself when you feel "stuck":**

1. **Is it a specific chord, a specific chord CHANGE, or something more general** (like overall timing, or a whole technique like strumming)? Narrowing this alone eliminates most of the vagueness.
2. **Does it happen every time, or only sometimes?** "Every time" usually points to a technique gap (wrong finger angle, wrong anchor). "Sometimes" often points to a timing/consistency issue rather than a fundamental technique problem.
3. **Has it gotten WORSE, stayed the same, or genuinely improved slowly** over the last couple of weeks? "Stayed exactly the same for weeks" is a real plateau worth troubleshooting directly; "improving slowly" might just need more time, not a different approach.
4. **Which specific module\'s technique does this connect to?** A stuck barre chord (later, Module 17) might actually be a Module 3 pressure problem, not a barre-specific one — tracing back to the actual underlying skill often reveals the plateau isn\'t where it appears to be.`,
    simpleHi: `**Diagnostic questions jo tum khud se poocho jab "stuck" feel karo:**

1. **Kya ye ek specific chord hai, ek specific chord CHANGE hai, ya kuch zyada general hai** (jaise overall timing, ya poori ek technique jaise strumming)? Ise akela narrow karna zyadatar vagueness eliminate kar deta hai.
2. **Kya ye har baar hota hai, ya sirf kabhi kabhi?** "Har baar" usually ek technique gap ki taraf point karta hai (galat finger angle, galat anchor). "Kabhi kabhi" often ek timing/consistency issue ki taraf point karta hai, ek fundamental technique problem ke bajaye.
3. **Kya ye pichle kuch hafton mein WORSE hua hai, same raha hai, ya genuinely slowly improve hua hai?** "Hafton tak exactly same raha" ek real plateau hai jo directly troubleshoot karne layak hai; "slowly improving" ko bas zyada time chahiye ho sakta hai, ek alag approach nahi.
4. **Ye kis specific module ki technique se connect hota hai?** Ek stuck barre chord (baad mein, Module 17) actually ek Module 3 pressure problem ho sakta hai, barre-specific nahi — actual underlying skill tak trace back karna often reveal karta hai ki plateau wahan nahi hai jahan wo appear hota hai.`,

    content: `**Why "every time vs. sometimes" is such a powerful diagnostic split.** A consistent, every-time failure means your CURRENT technique reliably produces that specific error — there\'s a real, fixable technique gap to find. An inconsistent, sometimes-works failure means the underlying technique is actually capable of succeeding, and something else (fatigue, timing pressure, a specific difficult transition) is intermittently disrupting it. These point to genuinely different fixes: rebuild the technique for the first case, reduce the disrupting factor for the second.

**Why tracing a plateau back to its actual root module matters so much.** This course has deliberately built each new skill on specific earlier ones (Module 6\'s anchor fingers assume Module 3\'s pressure control; Module 8\'s patterns assume Module 7\'s wrist motion). A plateau on a LATER skill is very often actually an under-solidified EARLIER skill quietly causing trouble — practicing the later skill harder, without checking the earlier foundation, can fail to help no matter how much time is spent on it.

**A genuinely important caution: not every slow patch is a "plateau" needing troubleshooting.** Some skills — barre chords and lead guitar especially — have a naturally longer runway before visible progress than open chords did. Confusing "this genuinely takes longer to build" with "I\'m stuck and something is wrong" can lead to needless troubleshooting of a process that\'s actually working correctly, just on a longer timescale. The questions above are for genuinely stalled progress, not for skills that are inherently slower to develop.`,
    contentHi: `**"Har baar vs kabhi kabhi" itna powerful diagnostic split kyun hai.** Ek consistent, every-time failure ka matlab hai tumhari CURRENT technique reliably wo specific error produce karti hai — ek real, fixable technique gap hai dhoondhne ke liye. Ek inconsistent, sometimes-works failure ka matlab hai underlying technique actually succeed karne mein capable hai, aur kuch aur (fatigue, timing pressure, ek specific difficult transition) intermittently use disrupt kar raha hai. Ye genuinely alag fixes ki taraf point karte hain: pehle case ke liye technique rebuild karo, doosre ke liye disrupting factor kam karo.

**Ek plateau ko uske actual root module tak trace back karna itna kyun matter karta hai.** Ye course ne deliberately har nayi skill ko specific earlier ones par banaya hai (Module 6 ke anchor fingers Module 3 ke pressure control ko assume karte hain; Module 8 ke patterns Module 7 ki wrist motion ko assume karte hain). Ek LATER skill par ek plateau bahut aksar actually ek under-solidified EARLIER skill hoti hai jo chupke se trouble cause kar rahi hai — later skill ko harder practice karna, earlier foundation check kiye bina, kitna bhi time spend karo help karne mein fail ho sakta hai.

**Ek genuinely important caution: har slow patch ek "plateau" nahi hai jise troubleshoot karna zaroori hai.** Kuch skills — barre chords aur lead guitar especially — ke paas open chords se naturally longer runway hota hai visible progress se pehle. "Ise genuinely zyada time lagta hai build hone mein" ko "main stuck hoon aur kuch galat hai" se confuse karna ek aise process ko needlessly troubleshoot karne ki taraf le ja sakta hai jo actually correctly kaam kar raha hai, bas ek longer timescale par. Upar wale questions genuinely stalled progress ke liye hain, un skills ke liye nahi jo inherently develop hone mein slower hain.`,

    examples: [
      {
        title: 'Two worked diagnostic examples',
        titleHi: 'Do worked diagnostic examples',
        code: `Example A: "My G chord still buzzes on the high e string, every single time."
  -> Specific chord, every time -> technique gap.
  -> Trace back: Module 3's finger-curl / pressure rules for finger 4 specifically.

Example B: "My chord changes are usually fine, but sometimes I completely blank."
  -> General, sometimes -> not a technique gap, more likely fatigue/timing pressure.
  -> Trace back: Module 9's timing work, or simply session length/fatigue.`,
        explain:
          'These two examples produce genuinely different next steps despite both starting from a vague "something\'s not working" feeling — this is the entire value of running the diagnostic questions before choosing what to practice next.',
        explainHi:
          'Ye do examples genuinely alag next steps produce karte hain, dono ek vague "kuch kaam nahi kar raha" feeling se shuru hone ke bawajood — yahi poora value hai diagnostic questions chalaane ka ye choose karne se pehle ki aage kya practice karna hai.',
      },
    ],

    mistakes: [
      {
        wrong: 'Responding to a vague "I feel stuck" by generically practicing more of everything, hoping something improves.',
        right: 'Run the diagnostic questions first to identify specifically what, when, and why — then target practice at that specific finding.',
        why: 'Generic "practice more" without diagnosis wastes time on things that may already be fine while leaving the actual root cause untouched — precise diagnosis is what makes troubleshooting time-efficient.',
        whyHi: 'Diagnosis ke bina generic "zyada practice karo" un cheezon par time waste karta hai jo already theek ho sakti hain jabki actual root cause ko untouched chhod deta hai — precise diagnosis wo hai jo troubleshooting ko time-efficient banata hai.',
      },
    ],

    realWorld: [
      {
        en: 'Good private guitar teachers spend much of a lesson asking exactly this kind of specific diagnostic question rather than just watching you play and guessing — you can run the same process on yourself without needing a teacher present for it.',
        hi: 'Achhe private guitar teachers ek lesson ka bahut sa time exactly is tarah ke specific diagnostic questions poochne mein spend karte hain, sirf tumhe bajaate hue dekhkar guess karne ke bajaye — tum khud par wahi process chala sakte ho bina uske liye teacher present hone ki zaroorat ke.',
      },
    ],

    interviewQA: [
      {
        q: 'What if I run through the diagnostic questions and still can\'t identify the specific problem?',
        qHi: 'Agar main diagnostic questions ke through jaoon aur phir bhi specific problem identify na kar paaoon?',
        a: 'Record yourself (Lesson 2 covers this properly) — many problems that resist being pinpointed by feel alone become obvious on video or audio playback, since you can observe technique from outside your own body\'s perspective.',
        aHi: 'Khud ko record karo (Lesson 2 ise properly cover karta hai) — bahut saari problems jo sirf feel se pinpoint hone ko resist karti hain video ya audio playback par obvious ban jaati hain, kyunki tum apni khud ki body ke perspective se bahar technique observe kar sakte ho.',
      },
    ],

    exercises: [
      {
        task: 'Pick anything about your playing that currently feels "stuck." Answer all four diagnostic questions from this lesson in writing, then identify which earlier module\'s technique it most likely traces back to.',
        taskHi: 'Apni playing ke baare mein kuch bhi pick karo jo currently "stuck" feel karta hai. Is lesson ke saare char diagnostic questions ka likh kar jawab do, phir identify karo ki ye most likely kis earlier module ki technique tak trace back hota hai.',
        hint: 'If nothing currently feels stuck, that\'s a genuinely good sign — save this diagnostic process for when (not if) something eventually does.',
        hintHi: 'Agar abhi kuch bhi stuck feel na ho, ye ek genuinely achha sign hai — is diagnostic process ko save karo jab (agar nahi) kabhi kuch eventually ho.',
      },
    ],

    keyTakeaways: [
      'Turn "I feel stuck" into a specific diagnosis: which skill, every time or sometimes, worse/same/slowly improving, and which earlier module it traces back to.',
      'Every-time failures usually mean a technique gap; sometimes failures usually mean an intermittent disruptor like fatigue or timing pressure.',
      'A later skill\'s plateau is often an earlier, under-solidified skill causing trouble — trace back before assuming the problem is where it appears.',
      'Not every slow patch is a plateau — some skills (barre chords, lead guitar) naturally take longer to show visible progress.',
    ],
    keyTakeawaysHi: [
      '"Main stuck feel karta hoon" ko ek specific diagnosis mein badlo: kaunsi skill, har baar ya kabhi kabhi, worse/same/slowly improving, aur ye kis earlier module tak trace back hota hai.',
      'Every-time failures usually ek technique gap ka matlab hain; sometimes failures usually ek intermittent disruptor jaise fatigue ya timing pressure ka matlab hain.',
      'Ek later skill ka plateau aksar ek earlier, under-solidified skill hoti hai jo trouble cause kar rahi hai — assume karne se pehle trace back karo ki problem wahin hai jahan wo appear hoti hai.',
      'Har slow patch ek plateau nahi hai — kuch skills (barre chords, lead guitar) ko naturally visible progress dikhane mein zyada time lagta hai.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'recording-yourself-as-a-tool',
    title: 'Recording Yourself as a Diagnostic Tool',
    titleHi: 'Khud Ko Record Karna Ek Diagnostic Tool Ki Tarah',
    description: 'Extending Module 9\'s timing-specific use of self-recording into a general, whole-practice habit.',
    descriptionHi: 'Module 9 ke timing-specific self-recording use ko ek general, whole-practice habit mein extend karna.',
    difficulty: 'EASY',
    duration: 10,
    order: 2,

    analogy: {
      en: '**A mirror that also has memory.** You already know to check technique visually in a mirror. A recording is a mirror that remembers — you can review it slowly, replay a specific moment repeatedly, and notice things a live glance during playing would miss entirely because your attention was on playing, not observing.',
      hi: '**Ek mirror jiski memory bhi hai.** Tumhe already pata hai ki technique ko ek mirror mein visually check karna hai. Ek recording ek aisa mirror hai jise yaad rehta hai — tum ise slowly review kar sakte ho, ek specific moment ko baar-baar replay kar sakte ho, aur wo cheezein notice kar sakte ho jo bajaate waqt ek live glance poori tarah miss kar deti kyunki tumhara attention bajaane par tha, observe karne par nahi.',
    },

    simple: `**Why this deserves its own lesson, beyond Module 9's timing-specific mention:** recording yourself is useful for far more than timing — hand position, finger angle, posture, facial tension (a surprisingly reliable sign of overall physical tension), and overall sound quality are all things a recording reveals that playing "from inside your own hands" often can't.

**A simple, low-effort routine:** once a week (not every session — that would be excessive), record 1-2 minutes of whatever you're currently working on. Phone video or audio, nothing fancy needed. Watch/listen back once, specifically looking for ONE thing at a time (don't try to evaluate everything at once) — maybe posture this week, pick angle next week.

**Why "one thing at a time" when reviewing:** trying to simultaneously judge posture, timing, tone, and chord accuracy from one playback is the same cognitive overload problem Module 10 covered for practicing new skills — reviewing is itself a skill that benefits from the same chunking principle.`,
    simpleHi: `**Ye Module 9 ke timing-specific mention se pare apna khud ka lesson kyun deserve karta hai:** khud ko record karna timing se kahin zyada ke liye useful hai — hand position, finger angle, posture, facial tension (overall physical tension ka ek surprisingly reliable sign), aur overall sound quality sab wo cheezein hain jo ek recording reveal karti hai jo "apne khud ke hands ke andar se" bajaana often nahi kar sakta.

**Ek simple, low-effort routine:** hafte mein ek baar (har session nahi — ye excessive hoga), jo bhi tum currently kaam kar rahe ho uske 1-2 minutes record karo. Phone video ya audio, kuch fancy chahiye nahi. Ek baar watch/listen back karo, specifically ek time par EK cheez dekhte hue (sab kuch ek saath evaluate karne ki koshish mat karo) — shayad is hafte posture, agle hafte pick angle.

**Review karte waqt "ek time par ek cheez" kyun:** ek playback se ek saath posture, timing, tone, aur chord accuracy judge karne ki koshish karna wahi cognitive overload problem hai jo Module 10 ne naye skills practice karne ke liye cover kiya — review karna khud ek skill hai jise same chunking principle se benefit milta hai.`,

    content: `**Why a recording reveals things live playing genuinely can't, mechanically speaking.** While actively playing, your attention is necessarily consumed by the playing itself — chord shapes, timing, what comes next. There simply isn't spare attention left over to also objectively observe your own posture or tone in real time. A recording removes the playing-attention demand entirely during review, freeing all your attention for pure observation.

**The one-thing-at-a-time review discipline, made concrete.** Pick a single, specific focus BEFORE pressing play, not while watching (deciding what to look for after the fact tends to drift into a vague overall impression rather than a specific finding). Write down what you're checking for, watch/listen once with that single lens, note what you found, then optionally watch again with a different single focus if you have time.

**A genuinely common hesitation worth addressing directly: most people dislike hearing/seeing themselves at first.** This is a near-universal reaction, not a sign anything is unusually wrong with your playing specifically — the discomfort fades with repeated exposure, and the diagnostic value is real enough to push through the initial awkwardness for.`,
    contentHi: `**Ek recording genuinely live playing se pare kya reveal karti hai, mechanically speaking.** Actively bajaate waqt, tumhara attention necessarily playing mein khud consume hota hai — chord shapes, timing, aage kya aata hai. Real time mein apni khud ki posture ya tone ko objectively observe karne ke liye simply koi spare attention bacha nahi hota. Ek recording review ke dauraan playing-attention demand ko poori tarah hata deti hai, pure observation ke liye saara attention free karte hue.

**One-thing-at-a-time review discipline, concrete banaya gaya.** Play press karne SE PEHLE ek single, specific focus pick karo, dekhte hue nahi (baad mein decide karna ki kya dekhna hai ek vague overall impression ki taraf drift karta hai, ek specific finding ke bajaye). Likho ki tum kya check kar rahe ho, us single lens ke saath ek baar watch/listen karo, jo mila wo note karo, phir optionally agar time ho to ek alag single focus ke saath dobara watch karo.

**Ek genuinely common hesitation jise directly address karna worth hai: zyadatar log shuru mein khud ko sunna/dekhna dislike karte hain.** Ye ek near-universal reaction hai, koi sign nahi ki tumhari playing mein specifically kuch unusually galat hai — discomfort repeated exposure ke saath fade hota hai, aur diagnostic value initial awkwardness ke through push karne layak genuinely real hai.`,

    examples: [
      {
        title: 'A single-focus review session',
        titleHi: 'Ek single-focus review session',
        code: `Before recording: "Today I'm checking specifically for elbow movement during strumming (Module 7)."
Record 1-2 minutes of normal practice.
Watch once, ONLY looking at the elbow.
Note: "Elbow moved more than expected on faster strums, stayed still on slow ones."
That single, specific finding is this week's actionable takeaway.`,
        explain:
          'Notice the finding is specific and actionable ("more on fast strums specifically"), not a vague overall impression — that specificity is the entire point of constraining review to one focus at a time.',
        explainHi:
          'Notice karo finding specific aur actionable hai ("fast strums par specifically zyada"), ek vague overall impression nahi — wahi specificity review ko ek time par ek focus tak constrain karne ka poora point hai.',
      },
    ],

    mistakes: [
      {
        wrong: 'Recording a session and trying to evaluate everything at once — posture, timing, tone, accuracy — in a single viewing.',
        right: 'Pick one specific thing to look/listen for before pressing record, and review with just that single lens.',
        why: 'Evaluating everything simultaneously overloads attention during review the same way playing multiple unautomated skills at once overloads it during practice — one clear finding beats five vague impressions.',
        whyHi: 'Sab kuch ek saath evaluate karna review ke dauraan attention ko overload karta hai bilkul waise jaise ek saath multiple unautomated skills bajaana practice ke dauraan use overload karta hai — ek clear finding paanch vague impressions se better hai.',
      },
    ],

    realWorld: [
      {
        en: 'Professional athletes and performers across disciplines review recorded footage of themselves routinely — this isn\'t a beginner crutch, it\'s a standard practice at every skill level because the underlying reason (attention during doing vs. during observing) never stops being true.',
        hi: 'Professional athletes aur performers disciplines ke across routinely apna recorded footage review karte hain — ye ek beginner crutch nahi hai, ye har skill level par ek standard practice hai kyunki underlying reason (doing ke dauraan vs observing ke dauraan attention) kabhi true hona band nahi karta.',
      },
    ],

    interviewQA: [
      {
        q: 'Should I record every practice session?',
        qHi: 'Kya mujhe har practice session record karna chahiye?',
        a: 'No — weekly is plenty for most learners. Recording every session adds overhead without proportionally more diagnostic value, and risks making practice feel more like a performance under observation than a low-pressure skill-building space.',
        aHi: 'Nahi — zyadatar learners ke liye weekly kaafi hai. Har session record karna proportionally zyada diagnostic value ke bina overhead add karta hai, aur practice ko ek observation ke neeche ek performance jaisa feel karwane ka risk rakhta hai, ek low-pressure skill-building space ke bajaye.',
      },
    ],

    exercises: [
      {
        task: 'Record 1-2 minutes of yourself playing anything you know. Pick one specific thing to review for (posture, pick angle, elbow movement, or anything else covered so far), watch/listen once, and write down one specific finding.',
        taskHi: '1-2 minutes ke liye khud ko kuch bhi bajaate hue record karo jo tumhe pata hai. Review karne ke liye ek specific cheez pick karo (posture, pick angle, elbow movement, ya ab tak covered kuch aur), ek baar watch/listen karo, aur ek specific finding likho.',
        hint: 'If the initial discomfort of watching/hearing yourself is strong, remind yourself this is a near-universal first reaction, not a signal about your actual playing quality.',
        hintHi: 'Agar khud ko dekhne/sunne ka initial discomfort strong hai, khud ko yaad dilao ki ye ek near-universal first reaction hai, tumhari actual playing quality ke baare mein ek signal nahi.',
      },
    ],

    keyTakeaways: [
      'Recording yourself reveals things live playing can\'t, since playing consumes the attention needed to self-observe in real time.',
      'Review with one specific focus at a time, decided before recording — evaluating everything at once overloads attention just like practicing multiple new skills at once does.',
      'Weekly recording is enough for most learners — it\'s a diagnostic tool, not a daily requirement.',
    ],
    keyTakeawaysHi: [
      'Khud ko record karna wo cheezein reveal karta hai jo live playing nahi kar sakti, kyunki playing wo attention consume kar leti hai jo real time mein self-observe karne ke liye chahiye.',
      'Ek time par ek specific focus ke saath review karo, recording se pehle decide kiya hua — sab kuch ek saath evaluate karna attention ko overload karta hai bilkul waise jaise ek saath multiple naye skills practice karna karta hai.',
      'Zyadatar learners ke liye weekly recording kaafi hai — ye ek diagnostic tool hai, daily requirement nahi.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'injury-prevention-and-hand-tension',
    title: 'Injury Prevention & Hand-Tension Awareness',
    titleHi: 'Injury Prevention Aur Hand-Tension Awareness',
    description: 'A genuine safety topic — the difference between productive discomfort and a real warning sign, made precise.',
    descriptionHi: 'Ek genuine safety topic — productive discomfort aur ek real warning sign ke beech ka difference, precise banaya gaya.',
    difficulty: 'MEDIUM',
    duration: 15,
    order: 3,

    analogy: {
      en: '**A car\'s warning lights: some mean "check when convenient," others mean "pull over now."** Not every dashboard light demands the same response — a low-fuel light is informational, an oil-pressure light means stop immediately. Hand sensations while playing guitar have the same range, and this lesson is about telling them apart correctly.',
      hi: '**Ek car ki warning lights: kuch ka matlab hai "convenient hone par check karo," doosri ka matlab hai "abhi pull over karo."** Har dashboard light same response demand nahi karti — ek low-fuel light informational hai, ek oil-pressure light matlab turant ruk jao. Guitar bajaate waqt hand sensations ki wahi range hoti hai, aur ye lesson unhe correctly alag batane ke baare mein hai.',
    },

    simple: `**Normal, expected sensations (Module 3 territory, revisited):** fingertip soreness while calluses form, mild general fatigue after an unusually long session, a stretch-feeling during a wide chord like G. These fade with rest and generally improve week over week.

**Real warning signs — stop and reassess, don't push through:**
- Sharp, localized pain (not general soreness) anywhere in the hand, wrist, or forearm.
- Numbness or tingling, especially in the fingers — this can indicate nerve compression, which needs genuine rest, not "playing through it."
- Pain that persists or worsens across multiple days rather than fading with a day\'s rest.
- Any pain that changes how you naturally want to hold your hand (favoring a position to avoid discomfort) — this is your body's own warning signal, worth listening to directly.

**The simple rule this lesson wants you to internalize:** soreness that fades is normal; pain that doesn't fade, or that\'s sharp/localized/nerve-like, is not something to play through. When genuinely unsure which category something falls into, treat it as the second category and rest — the cost of an unnecessary rest day is far lower than the cost of a real repetitive strain injury.`,
    simpleHi: `**Normal, expected sensations (Module 3 territory, revisited):** calluses banne ke dauraan fingertip soreness, ek unusually lambe session ke baad mild general fatigue, ek wide chord jaise G ke dauraan ek stretch-feeling. Ye rest ke saath fade hoti hain aur generally week over week improve hoti hain.

**Real warning signs — ruk jao aur reassess karo, through mat push karo:**
- Sharp, localized pain (general soreness nahi) hand, wrist, ya forearm mein kahin bhi.
- Numbness ya tingling, especially fingers mein — ye nerve compression indicate kar sakta hai, jise genuine rest chahiye, "use through play karna" nahi.
- Pain jo din ke rest se fade hone ke bajaye multiple days tak persist ya worsen kare.
- Koi bhi pain jo badalta hai ki tum naturally apni hand kaise hold karna chahte ho (discomfort avoid karne ke liye ek position favor karna) — ye tumhare body ka khud ka warning signal hai, directly sunne layak.

**Simple rule jo ye lesson chahta hai tum internalize karo:** soreness jo fade hoti hai normal hai; pain jo fade nahi hoti, ya jo sharp/localized/nerve-like hai, wo use play through karne wali cheez nahi hai. Jab genuinely unsure ho ki kuch kis category mein aata hai, ise doosri category ki tarah treat karo aur rest karo — ek unnecessary rest day ka cost ek real repetitive strain injury ke cost se kahin kam hai.`,

    content: `**Why guitar-related hand strain is a genuinely real risk worth taking seriously, not beginner paranoia.** Repetitive fine-motor activity, sustained awkward positions, and gradually increasing intensity are exactly the conditions associated with repetitive strain injuries in any activity, and guitar involves all three. This isn\'t meant to be alarming — the large majority of players never have a serious problem — but the risk is real enough that the warning-sign vocabulary in this lesson is worth having memorized before you might ever need it, not looked up after something already hurts.

**Why tension elsewhere in the body (shoulders, jaw, face) matters for hand health too.** Full-body tension while playing — clenched jaw, raised shoulders, furrowed brow — often correlates with excess tension in the hands as well, since tension rarely stays perfectly isolated to one body part. A quick full-body relaxation check (are your shoulders creeping up? Is your jaw clenched?) during practice is a genuinely useful proxy for hand tension specifically, and connects directly back to Module 2's posture fundamentals.

**What to actually do if you notice a real warning sign.** Stop playing for that session. Rest for at least a day, longer if discomfort persists. If pain or numbness continues beyond a few days of rest, or recurs as soon as you resume playing, that\'s worth a real medical opinion — this course can teach guitar technique, but it cannot diagnose or treat an actual injury, and a doctor or physical therapist genuinely can.`,
    contentHi: `**Guitar-related hand strain ek genuinely real risk kyun hai jise seriously lena chahiye, beginner paranoia nahi.** Repetitive fine-motor activity, sustained awkward positions, aur gradually increasing intensity exactly wo conditions hain jo kisi bhi activity mein repetitive strain injuries se associated hain, aur guitar teenon involve karta hai. Iska matlab alarming hona nahi hai — zyadatar players ko kabhi ek serious problem nahi hoti — lekin risk itna real hai ki is lesson ki warning-sign vocabulary memorize karne layak hai us se pehle ki tumhe kabhi zaroorat pade, kuch already dukhne ke baad look up karne ke bajaye.

**Body ke doosre hisson mein tension (shoulders, jaw, face) hand health ke liye bhi kyun matter karta hai.** Bajaate waqt full-body tension — clenched jaw, raised shoulders, furrowed brow — often hands mein excess tension ke saath bhi correlate karta hai, kyunki tension rarely ek body part tak perfectly isolated rehta hai. Practice ke dauraan ek quick full-body relaxation check (kya tumhare shoulders upar creep kar rahe hain? Kya tumhari jaw clenched hai?) hand tension ke liye specifically ek genuinely useful proxy hai, aur directly Module 2 ke posture fundamentals se wapas connect hota hai.

**Agar ek real warning sign notice karo to actually kya karein.** Us session ke liye bajaana band karo. Kam se kam ek din rest karo, agar discomfort persist kare to lamba. Agar pain ya numbness kuch dino ke rest ke baad bhi continue kare, ya bajaana resume karte hi wapas aaye, ye ek real medical opinion ke layak hai — ye course guitar technique sikha sakta hai, lekin ye ek actual injury diagnose ya treat nahi kar sakta, aur ek doctor ya physical therapist genuinely kar sakta hai.`,

    examples: [
      {
        title: 'The soreness-vs-warning-sign checklist',
        titleHi: 'Soreness-vs-warning-sign checklist',
        code: `Normal (keep going, adjust if needed):
  - Fingertip soreness, fading within a day
  - General fatigue after a long session
  - A stretch-feeling during a wide chord

Warning sign (stop, rest, reassess):
  - Sharp, localized pain
  - Numbness or tingling
  - Pain persisting/worsening across multiple days
  - Pain changing how you naturally want to hold your hand`,
        explain:
          'Keeping this exact list somewhere accessible (not just reading it once here) means you can check against it quickly in the moment, rather than trying to recall the distinction from memory while already uncertain and possibly in discomfort.',
        explainHi:
          'Ye exact list kahin accessible rakhna (sirf yahan ek baar padhna nahi) matlab hai tum us moment mein quickly uske against check kar sakte ho, memory se distinction recall karne ki koshish karne ke bajaye jab already uncertain ho aur possibly discomfort mein ho.',
      },
    ],

    mistakes: [
      {
        wrong: 'Treating any hand discomfort as "normal beginner soreness" and playing through it without checking against the specific warning signs.',
        right: 'Check discomfort against the specific checklist (sharp/localized, numbness, multi-day persistence, changed hand posture) before deciding to continue.',
        why: 'Not all discomfort is the same category, and treating a real warning sign as ordinary soreness risks turning a easily-avoided rest day into a genuine, longer-term injury.',
        whyHi: 'Saara discomfort same category ka nahi hota, aur ek real warning sign ko ordinary soreness ki tarah treat karna ek easily-avoided rest day ko ek genuine, longer-term injury mein badalne ka risk rakhta hai.',
      },
    ],

    realWorld: [
      {
        en: 'Professional musicians take hand health seriously enough that hand therapy specifically for musicians is a real, established medical specialty — this isn\'t an overcautious beginner concern, it\'s a legitimate lifelong consideration at every skill level.',
        hi: 'Professional musicians hand health ko itni seriously lete hain ki musicians ke liye specifically hand therapy ek real, established medical specialty hai — ye ek overcautious beginner concern nahi hai, ye har skill level par ek legitimate lifelong consideration hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Is it normal for my hand to feel tired after practice, or is that always a bad sign?',
        qHi: 'Kya practice ke baad meri hand ka tired feel karna normal hai, ya ye hamesha ek bad sign hai?',
        a: "General tiredness/fatigue that resolves with a normal rest period is expected and not concerning — it's the sharp, localized, or persistent/worsening symptoms from this lesson's checklist that warrant real attention, not ordinary tiredness.",
        aHi: 'General tiredness/fatigue jo ek normal rest period ke saath resolve ho jaati hai expected hai aur concerning nahi — is lesson ki checklist ke sharp, localized, ya persistent/worsening symptoms hain jo real attention warrant karte hain, ordinary tiredness nahi.',
      },
    ],

    exercises: [
      {
        task: 'During your next practice session, do a mid-session full-body tension check: shoulders, jaw, and hand grip pressure. Consciously relax anything you find tense.',
        taskHi: 'Apne agle practice session ke dauraan, ek mid-session full-body tension check karo: shoulders, jaw, aur hand grip pressure. Jo bhi tense mile use consciously relax karo.',
        hint: 'Setting a quiet phone reminder partway through a session is a reliable way to actually remember to do this check, rather than relying on remembering spontaneously while absorbed in practice.',
        hintHi: 'Session ke beech mein ek quiet phone reminder set karna is check ko actually yaad rakhkar karne ka ek reliable tareeka hai, practice mein absorbed hote hue spontaneously yaad rakhne par rely karne ke bajaye.',
      },
    ],

    keyTakeaways: [
      'Normal soreness fades with rest and improves week over week; real warning signs (sharp pain, numbness, multi-day persistence, posture changes) don\'t.',
      'When genuinely unsure which category a sensation falls into, treat it as a warning sign and rest — the cost of caution is far lower than the cost of a real injury.',
      'Full-body tension (shoulders, jaw) often correlates with hand tension — a quick full-body check is a useful proxy.',
      'Persistent symptoms beyond a few rest days warrant a real medical opinion, not more guitar-specific troubleshooting.',
    ],
    keyTakeawaysHi: [
      'Normal soreness rest ke saath fade hoti hai aur week over week improve hoti hai; real warning signs (sharp pain, numbness, multi-day persistence, posture changes) nahi hote.',
      'Jab genuinely unsure ho ki ek sensation kis category mein aata hai, use ek warning sign ki tarah treat karo aur rest karo — caution ka cost ek real injury ke cost se kahin kam hai.',
      'Full-body tension (shoulders, jaw) often hand tension ke saath correlate karta hai — ek quick full-body check ek useful proxy hai.',
      'Kuch rest days se aage persistent symptoms ek real medical opinion warrant karte hain, aur zyada guitar-specific troubleshooting nahi.',
    ],
  },
];
