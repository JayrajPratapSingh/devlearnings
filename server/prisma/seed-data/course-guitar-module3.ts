/**
 * Guitar Course — Module 3: Your Fretting Hand, lessons 1-3.
 *
 * Lesson 1: Finger numbers, thumb position, and the pressing technique
 *           Module 1 introduced but didn't fully drill.
 * Lesson 2: Real finger-strengthening/dexterity exercises — a warm-up
 *           routine to run before every single practice session.
 * Lesson 3: Why fresh fingertips hurt, the callus timeline, and a concrete
 *           practice schedule (days/week, minutes/session, progression).
 *
 * Lessons 2-3 exist specifically because Jay asked mid-course for finger
 * exercises and explicit "how many days, how much" guidance — this module
 * is where that lives.
 */

import type { CourseLesson } from './course-js-module1';
import { diagramPreviewHtml, tabExplainerSvg } from './guitar-diagrams';

export const GUITAR_MODULE_3: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'fretting-technique-and-thumb-position',
    title: 'Fretting Technique & Thumb Position, Drilled',
    titleHi: 'Fretting Technique Aur Thumb Position, Drilled',
    description: 'Turning Module 1\'s "press just behind the fret" rule into an actual, repeatable habit — plus where the thumb belongs and why.',
    descriptionHi: 'Module 1 ke "fret ke bilkul peeche dabao" rule ko ek actual, repeatable habit mein badalna — plus thumb kahan belong karta hai aur kyun.',
    difficulty: 'EASY',
    duration: 15,
    order: 1,

    analogy: {
      en: '**A doorstop, not a fist.** Your thumb\'s job behind the neck is to act like a doorstop bracing a door — a fixed, light counter-pressure point — not to wrap over the top and squeeze like you\'re making a fist around the neck. A doorstop needs almost no force to do its job; neither does your thumb.',
      hi: '**Ek doorstop, fist nahi.** Neck ke peeche tumhare thumb ka kaam ek doorstop ki tarah hai jo door ko brace karta hai — ek fixed, light counter-pressure point — neck ke around fist banane ki tarah upar se wrap karke squeeze karna nahi. Ek doorstop ko apna kaam karne ke liye almost koi force nahi chahiye; na hi tumhare thumb ko.',
    },

    simple: `**Thumb position, the two rules that matter:**

1. The thumb rests on the BACK of the neck, roughly opposite your middle finger — never wraps over the top edge to help press strings (that's a specific technique reserved for a few advanced blues/rock moves, not default technique).
2. Light contact, not a death grip. Squeezing hard with the thumb doesn't help your fingers press harder — it just tires your whole hand out faster and restricts finger movement.

**Fretting pressure, precisely how much:** just enough that the string doesn't buzz — no more. New players consistently press way harder than necessary because it FEELS like more pressure should help; past the point of a clean note, extra pressure only adds fatigue and pain with zero tone benefit.

**The finger-curl check:** your fretting fingers should curl down onto the strings from above, fingertip pointing straight down at the fret, not lying flat/collapsed across multiple strings by accident (unless a barre specifically calls for that). A collapsed finger tends to brush and mute the string next to the one you meant to press.`,
    simpleHi: `**Thumb position, do rules jo matter karte hain:**

1. Thumb neck ke PEECHE rehta hai, roughly tumhari middle finger ke opposite — kabhi top edge ke upar wrap nahi hota strings press karne mein help karne ke liye (ye ek specific technique hai jo kuch advanced blues/rock moves ke liye reserved hai, default technique nahi).
2. Light contact, death grip nahi. Thumb se hard squeeze karna fingers ko harder press karne mein help nahi karta — ye bas poore hand ko faster tired kar deta hai aur finger movement restrict karta hai.

**Fretting pressure, precisely kitna:** bas itna ki string buzz na kare — usse zyada nahi. New players consistently zaroorat se zyada hard press karte hain kyunki FEEL hota hai ki zyada pressure help karega; ek clean note ke point ke aage, extra pressure sirf fatigue aur pain add karta hai zero tone benefit ke saath.

**Finger-curl check:** tumhari fretting fingers ko upar se strings par curl karke aana chahiye, fingertip fret ki taraf straight down point karte hue, accidentally multiple strings ke across flat/collapsed lete hue nahi (jab tak koi barre specifically wo na maange). Ek collapsed finger tend karta hai us string ke paas wali string ko brush aur mute karne ke liye jo tum press karna chahte the.`,

    content: `**Why does thumb position affect finger reach so much?** A thumb placed too high (creeping over the top edge) or too far from the fingers forces your hand into an awkward, cramped angle to reach the strings — the same mechanical problem as Module 2's flat-neck posture mistake, just one joint further down the chain. A thumb resting comfortably opposite the middle finger, on the back-center of the neck, gives your fingers the straightest, least-effort path down onto the strings, and directly enables stretches (like the finger-independence exercises in the next lesson) that a cramped thumb position makes needlessly hard.

**Why "just enough pressure" is a real, learnable feel, not vague advice:** press a string down slowly while plucking repeatedly — you'll notice the exact moment the buzz disappears and the tone goes clean. That's the pressure you need; everything past it is wasted effort. This threshold is different for every string and every guitar (string gauge and action affect it), which is exactly why it has to be felt rather than memorized as a fixed amount of force.

**A genuinely common beginner confusion, cleared up:** thumb-over-the-top IS a real, legitimate technique some experienced players use deliberately, particularly for muting the low E string with the thumb while playing certain chord shapes. It's not "wrong" as a technique — it's just not the DEFAULT starting habit, because learning it before basic thumb-behind-neck control is solid tends to produce cramped, inconsistent hand positioning across the board.`,
    contentHi: `**Thumb position finger reach ko itna kyun affect karti hai?** Bahut upar rakha gaya thumb (top edge ke upar creep karta hua) ya fingers se bahut door hand ko ek awkward, cramped angle mein force karta hai strings tak pahunchne ke liye — Module 2 ki flat-neck posture mistake jaisa hi mechanical problem, bas chain mein ek joint aur neeche. Middle finger ke opposite comfortably resting thumb, neck ke back-center par, fingers ko strings tak sabse straight, least-effort path deta hai, aur directly aage wale lesson ki finger-independence exercises jaisi stretches ko enable karta hai jinhe ek cramped thumb position needlessly hard bana deta hai.

**"Bas itna pressure" ek real, learnable feel kyun hai, vague advice nahi:** ek string ko slowly dabao repeatedly pluck karte hue — tumhe exactly wo moment notice hoga jab buzz gayab hota hai aur tone clean ho jaati hai. Wahi pressure hai jo chahiye; uske aage sab wasted effort hai. Ye threshold har string aur har guitar ke liye alag hai (string gauge aur action ise affect karte hain), yahi exactly reason hai ki ise feel karna zaroori hai, ek fixed amount of force ki tarah memorize karna nahi.

**Ek genuinely common beginner confusion, clear kiya gaya:** thumb-over-the-top ek real, legitimate technique hai jo kuch experienced players deliberately use karte hain, particularly low E string ko thumb se mute karne ke liye kuch chord shapes bajaate waqt. Ye technique ki tarah "galat" nahi hai — bas ye DEFAULT starting habit nahi hai, kyunki isse pehle seekhna jab basic thumb-behind-neck control solid nahi hai, usually across the board cramped, inconsistent hand positioning produce karta hai.`,

    examples: [
      {
        title: 'The buzz-pressure test',
        titleHi: 'Buzz-pressure test',
        code: `1. Fret string A at fret 2 with almost no pressure. Pluck. Expect a dull buzz/thud.
2. Slowly increase pressure, plucking after each small increase.
3. Note the exact pressure where the buzz disappears and a clean note rings.
4. That pressure — not more — is your target for every fretted note.`,
        explain:
          "Doing this test consciously once or twice builds a physical reference point your hand remembers, which is far more effective than being told a number (there is no universal number — string gauge, action, and your own guitar all change it).",
        explainHi:
          "Ise consciously ek-do baar karna ek physical reference point banata hai jo tumhara hand yaad rakhta hai, jo ek number bataye jaane se kahin zyada effective hai (koi universal number nahi hai — string gauge, action, aur tumhari apni guitar sab ise badalte hain).",
      },
    ],

    mistakes: [
      {
        wrong: 'Squeezing the thumb hard against the back of the neck "for extra grip" while fretting.',
        right: 'Keep thumb contact light — its job is light counter-pressure and positioning, not force.',
        why: 'Extra thumb squeeze doesn\'t transmit into more useful fretting-finger pressure; it just adds hand fatigue and often drags your whole hand into a stiffer, less mobile position.',
        whyHi: 'Extra thumb squeeze useful fretting-finger pressure mein transmit nahi hoti; ye bas hand fatigue add karti hai aur usually poore hand ko ek stiffer, less mobile position mein khींच leti hai.',
      },
      {
        wrong: 'Letting a fretting finger lie flat/collapsed across the string instead of curling down onto it, then wondering why neighboring strings buzz or go silent.',
        right: 'Curl fingers so the fingertip contacts the string, pointing roughly straight down at the fret — check the angle if a neighboring string suddenly sounds muted.',
        why: 'A collapsed finger physically touches and dampens whatever string is directly underneath it, silencing or buzzing a string you never intended to touch at all.',
        whyHi: 'Ek collapsed finger physically us string ko touch aur dampen kar deta hai jo uske bilkul neeche hai, ek aisi string ko silence ya buzz karta hai jise tumne kabhi touch karne ka socha hi nahi tha.',
      },
    ],

    realWorld: [
      {
        en: 'Watch any professional player\'s fretting hand in a close-up video with the sound off — the thumb barely moves and stays roughly centered behind the neck across totally different chord shapes, while the fingers do nearly all the visible movement. That stillness is exactly the "doorstop" habit this lesson is building.',
        hi: 'Kisi professional player ka fretting hand ek close-up video mein sound off karke dekho — thumb barely move karta hai aur bilkul different chord shapes ke across roughly neck ke peeche centered rehta hai, jabki fingers lagbhag saara visible movement karte hain. Wo stillness exactly wahi "doorstop" habit hai jo ye lesson bana raha hai.',
      },
    ],

    interviewQA: [
      {
        q: 'My thumb naturally wants to creep over the top of the neck — is that necessarily wrong?',
        qHi: 'Mera thumb naturally neck ke top ke upar creep karna chahta hai — kya ye necessarily galat hai?',
        a: "It's not a permanent injury risk on its own, but building it as your default habit now tends to limit your reach for wider chord shapes and stretches later. Gently retrain it toward behind-the-neck as your default, and treat over-the-top as a deliberate, occasional technique instead.",
        aHi: 'Ye apne aap mein koi permanent injury risk nahi hai, lekin ise abhi apni default habit banana baad mein wider chord shapes aur stretches ke liye tumhari reach limit karta hai. Ise gently behind-the-neck ki taraf apni default habit ki tarah retrain karo, aur over-the-top ko ek deliberate, occasional technique ki tarah treat karo.',
      },
    ],

    exercises: [
      {
        task: 'Fret any note with any finger. Check: is your thumb roughly opposite that finger, on the back of the neck, with light contact? Adjust until yes, then repeat with a different finger on a different string.',
        taskHi: 'Kisi bhi finger se koi bhi note fret karo. Check karo: kya tumhara thumb roughly us finger ke opposite hai, neck ke peeche, light contact ke saath? Jab tak haan na ho tab tak adjust karo, phir ek alag finger se ek alag string par repeat karo.',
        hint: 'If your wrist feels strained during this check, the thumb is very likely creeping too high or too far from the fretting finger — reset and try again.',
        hintHi: 'Agar is check ke dauraan wrist strained feel ho, thumb likely bahut upar ya fretting finger se bahut door creep kar raha hai — reset karo aur dobara try karo.',
      },
    ],

    keyTakeaways: [
      'Thumb rests behind the neck, roughly opposite the fretting finger, with light contact — not squeezed, not wrapped over the top by default.',
      'Fretting pressure is exactly "just enough to stop the buzz" — find that threshold by feel, not by a fixed rule of thumb.',
      'Fingers should curl down onto strings tip-first, not lie flat and accidentally mute a neighboring string.',
    ],
    keyTakeawaysHi: [
      'Thumb neck ke peeche rehta hai, roughly fretting finger ke opposite, light contact ke saath — squeezed nahi, default se top ke upar wrapped nahi.',
      'Fretting pressure exactly "buzz rokne ke liye bas itna" hai — ye threshold feel se dhoondo, ek fixed rule of thumb se nahi.',
      'Fingers ko tip-first strings par curl karna chahiye, flat lete hue accidentally paas wali string mute nahi karni chahiye.',
    ],
    guitarPractice: { sequences: [{"title":"A simple two-fret pressure check","titleHi":"Ek simple two-fret pressure check","defaultBpm":60,"notes":[{"string":1,"fret":2,"beat":0,"finger":2},{"string":2,"fret":2,"beat":1,"finger":3}]}] },
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'finger-strengthening-and-dexterity-exercises',
    title: 'Finger-Strengthening & Dexterity Exercises',
    titleHi: 'Finger-Strengthening Aur Dexterity Exercises',
    description: 'Real warm-up exercises — the chromatic run and the spider walk — that build independent finger control fast, run before every session.',
    descriptionHi: 'Real warm-up exercises — chromatic run aur spider walk — jo fast independent finger control banate hain, har session se pehle chalao.',
    difficulty: 'EASY',
    duration: 20,
    order: 2,

    analogy: {
      en: '**Typing with four fingers that have never worked alone before.** If you\'d only ever pressed a computer key with your whole hand at once, typing would be impossible until you trained each finger to move independently of the others. Fretting-hand fingers start in exactly that state — they want to move together — and these exercises are specifically what trains them apart.',
      hi: '**Char fingers se typing karna jinhone pehle kabhi akele kaam nahi kiya.** Agar tumne kabhi computer key ko sirf poore hand se ek saath press kiya hota, typing tab tak impossible hoti jab tak har finger ko doosron se independently move hona train na karte. Fretting-hand fingers exactly usi state mein shuru hote hain — wo saath mein move hona chahte hain — aur ye exercises specifically unhe alag train karte hain.',
    },

    simple: `**Exercise 1: The Chromatic Run (do this first, every session)**

Play fingers 1-2-3-4 in order, one fret at a time, on ONE string — then move to the next string and repeat.

\`\`\`
e|--1-2-3-4-------------------|
B|------------1-2-3-4---------|
G|--------------------1-2-3-4-|
...continue across all 6 strings, then reverse (4-3-2-1) back
\`\`\`

Each finger presses its own fret and lifts cleanly before the next finger presses — no two fingers down at once (yet). Go SLOW: this drill is about clean, independent motion, not speed. Speed comes later, automatically, once the motion is clean.

**Exercise 2: The Spider Walk**

Same 1-2-3-4 idea, but instead of moving to a new string after 4 notes, walk diagonally: finger 1 on string A fret 1, finger 2 on string D fret 2, finger 3 on string G fret 3, finger 4 on string B fret 4 — a diagonal "web" pattern that forces fingers to stretch and stay independent across strings, not just along one.

**Stretch before AND after**, gently: spread fingers wide for a few seconds, then relax. Never stretch to the point of pain — mild tension only.`,
    simpleHi: `**Exercise 1: Chromatic Run (ise pehle karo, har session)**

Fingers 1-2-3-4 order mein bajao, ek fret at a time, EK string par — phir agli string par jao aur repeat karo.

\`\`\`
e|--1-2-3-4-------------------|
B|------------1-2-3-4---------|
G|--------------------1-2-3-4-|
...saari 6 strings ke across continue karo, phir reverse (4-3-2-1) karke wapas
\`\`\`

Har finger apna fret press karta hai aur agle finger ke press karne se pehle cleanly lift hota hai — abhi do fingers ek saath neeche nahi (abhi ke liye). SLOW jao: ye drill clean, independent motion ke baare mein hai, speed ke baare mein nahi. Speed baad mein automatically aati hai, ek baar motion clean ho jaaye.

**Exercise 2: Spider Walk**

Same 1-2-3-4 idea, lekin 4 notes ke baad nayi string par jaane ke bajaye, diagonally walk karo: finger 1 string A fret 1 par, finger 2 string D fret 2 par, finger 3 string G fret 3 par, finger 4 string B fret 4 par — ek diagonal "web" pattern jo fingers ko stretch aur independent rehne ke liye force karta hai strings ke across, sirf ek ke saath nahi.

**Stretch before AND after**, gently: fingers ko kuch seconds ke liye wide spread karo, phir relax karo. Kabhi pain ke point tak stretch mat karo — sirf mild tension.`,

    content: `**Why does the chromatic run specifically help, rather than just "practicing more"?** It isolates finger independence from every other skill (no chord shape to remember, no strumming coordination, no song to keep pace with) — so all the mental and physical effort goes purely into one thing: can finger 3, say, press down cleanly without fingers 1, 2, and 4 twitching along with it. That cross-finger twitching (called "sympathetic movement") is the actual obstacle behind "clumsy fingers" beginners feel, and isolating it is exactly what a focused drill is for, the same chunking principle Module 10 covers for practice in general.

**Why the spider walk adds something the chromatic run doesn't:** the chromatic run keeps all 4 fingers on ONE string, which only trains up-down independence. The spider walk adds lateral stretch across multiple strings simultaneously, which is what real chord shapes actually demand (fingers spread across different strings AND frets, not lined up neatly on one string). Both exercises target genuinely different aspects of the same underlying skill.

**How long is "enough" for a warm-up?** 3-5 minutes of chromatic runs plus 2-3 minutes of spider walk, done SLOWLY with clean motion, is enough to meaningfully warm up and train independence — rushing through either exercise fast defeats the purpose, since sloppy fast reps train sloppy habits just as effectively as clean slow reps train clean ones. Slow and clean beats fast and messy, every time, for this specific kind of drill.`,
    contentHi: `**Chromatic run specifically kyun help karta hai, "bas zyada practice karna" ke bajaye?** Ye finger independence ko har doosri skill se isolate karta hai (koi chord shape yaad rakhne ki zaroorat nahi, koi strumming coordination nahi, kisi song ke saath pace rakhne ki zaroorat nahi) — isliye saara mental aur physical effort purely ek cheez mein jaata hai: kya finger 3, say, cleanly dab sakta hai bina fingers 1, 2, aur 4 ke saath twitch kiye. Wo cross-finger twitching (jise "sympathetic movement" kehte hain) hi wo actual obstacle hai jo beginners ko "clumsy fingers" feel karwaata hai, aur ise isolate karna exactly wahi hai jiske liye ek focused drill hoti hai, wahi chunking principle jo Module 10 practice ke liye generally cover karta hai.

**Spider walk aisa kya add karta hai jo chromatic run nahi karta:** chromatic run saare 4 fingers ko EK string par rakhta hai, jo sirf up-down independence train karta hai. Spider walk multiple strings ke across simultaneously lateral stretch add karta hai, jo real chord shapes actually maangte hain (fingers alag strings AUR frets ke across spread, ek string par neatly lined up nahi). Dono exercises same underlying skill ke genuinely alag aspects target karte hain.

**Warm-up ke liye kitna "kaafi" hai?** 3-5 minutes chromatic runs plus 2-3 minutes spider walk, SLOWLY clean motion ke saath, meaningfully warm up karne aur independence train karne ke liye kaafi hai — kisi bhi exercise ko fast rush karna purpose defeat karta hai, kyunki sloppy fast reps sloppy habits ko utni hi effectively train karte hain jitna clean slow reps clean habits ko. Slow aur clean fast aur messy se hamesha better hai, is specific tarah ki drill ke liye.`,

    examples: [
      {
        title: 'Chromatic run, one string, written out in full',
        titleHi: 'Chromatic run, ek string, poora likha hua',
        code: `On the A string only:
  finger 1 -> fret 1, pluck, lift
  finger 2 -> fret 2, pluck, lift
  finger 3 -> fret 3, pluck, lift
  finger 4 -> fret 4, pluck, lift
  finger 4 -> fret 4 again, then reverse:
  finger 3 -> fret 3, pluck, lift
  finger 2 -> fret 2, pluck, lift
  finger 1 -> fret 1, pluck, lift
Then move the whole pattern to the D string, and so on through all 6.`,
        previewHeight: 300,
        preview: diagramPreviewHtml(
          tabExplainerSvg(
            [
              { string: 5, step: 0, fret: 1 },
              { string: 5, step: 1, fret: 2 },
              { string: 5, step: 2, fret: 3 },
              { string: 5, step: 3, fret: 4 },
            ],
            4,
          ),
          'The chromatic run on the low E string — same 1-2-3-4 finger pattern repeats on every string in turn.',
        ),
        explain:
          'Writing this as tab is a deliberate callback to Module 2 — this exercise is itself a tiny piece of real tab, string 6 with 4 notes in a row, which is also good low-stakes practice reading tab you already know the answer to.',
        explainHi:
          'Ise tab ki tarah likhna Module 2 ka ek deliberate callback hai — ye exercise khud tab ka ek chhota real piece hai, string 6 par 4 notes ek row mein, jo tab padhne ka bhi ek achha low-stakes practice hai jiska answer tumhe already pata hai.',
      },
    ],

    mistakes: [
      {
        wrong: 'Rushing through the chromatic run at speed from day one, "because slow feels pointless."',
        right: 'Run it deliberately slowly, prioritizing clean, independent finger lifts over how fast you can go.',
        why: 'Speed built on sloppy, sympathetic-movement-riddled technique just produces fast sloppiness — it\'s far harder to fix an ingrained bad habit later than to build a clean one slowly now.',
        whyHi: 'Sloppy, sympathetic-movement-riddled technique par banayi gayi speed bas fast sloppiness produce karti hai — baad mein ek ingrained bad habit fix karna abhi slowly ek clean habit banane se kahin zyada hard hai.',
      },
      {
        wrong: 'Skipping the pre/post stretch, or stretching aggressively to the point of pain.',
        right: 'Stretch gently, to mild tension only, both before and after playing.',
        why: 'No stretch at all leaves muscles less prepared and slightly more strain-prone; overly aggressive stretching can itself cause injury — mild, consistent stretching is the actual sweet spot.',
        whyHi: 'Bilkul stretch na karna muscles ko kam prepared aur thoda zyada strain-prone chhod deta hai; overly aggressive stretching khud injury cause kar sakti hai — mild, consistent stretching hi actual sweet spot hai.',
      },
    ],

    realWorld: [
      {
        en: 'Professional guitarists, even decades in, still run chromatic and spider-walk-style warm-ups before practice or performance — this isn\'t a "beginner-only" exercise you graduate out of, it\'s a standing warm-up habit at every skill level.',
        hi: 'Professional guitarists, dashkon baad bhi, practice ya performance se pehle abhi bhi chromatic aur spider-walk-style warm-ups chalaate hain — ye "beginner-only" exercise nahi hai jisse tum graduate ho jaate ho, ye har skill level par ek standing warm-up habit hai.',
      },
    ],

    interviewQA: [
      {
        q: 'How soon will I notice these exercises actually helping?',
        qHi: 'Ye exercises actually help karte hue kitni jaldi notice honge?',
        a: 'Most beginners notice a real difference in finger independence and reduced "sympathetic twitching" within 1-2 weeks of daily short sessions — it\'s one of the faster-paying-off habits in this whole course, precisely because it isolates one narrow skill so cleanly.',
        aHi: 'Zyadatar beginners daily short sessions ke 1-2 hafton ke andar finger independence aur kam "sympathetic twitching" mein ek real difference notice karte hain — ye poore is course ki faster-paying-off habits mein se ek hai, precisely kyunki ye ek narrow skill ko itni cleanly isolate karti hai.',
      },
    ],

    exercises: [
      {
        task: 'Run the full chromatic exercise (1-2-3-4 then 4-3-2-1) on just the low E and A strings today, slowly, focused entirely on clean lifts with no sympathetic movement in the other fingers. Notice which finger is the "clumsiest."',
        taskHi: 'Aaj bas low E aur A strings par poora chromatic exercise chalao (1-2-3-4 phir 4-3-2-1), slowly, poori tarah clean lifts par focused, doosre fingers mein koi sympathetic movement ke bina. Notice karo kaunsi finger sabse "clumsy" hai.',
        hint: 'Almost everyone finds finger 4 (pinky) the weakest and most prone to sympathetic movement at first — that\'s completely normal, not a sign you\'re doing something wrong.',
        hintHi: 'Almost har koi finger 4 (pinky) ko shuru mein sabse weak aur sympathetic movement ke sabse prone paata hai — ye bilkul normal hai, iska matlab ye nahi ki tum kuch galat kar rahe ho.',
      },
    ],

    keyTakeaways: [
      'The chromatic run (1-2-3-4 per string) isolates and trains finger independence, free of any other skill demand.',
      'The spider walk adds lateral, cross-string stretch — a genuinely different skill from the chromatic run\'s up-down motion.',
      'Run both slowly, prioritizing clean motion over speed — speed comes automatically once the motion is clean.',
      'Stretch gently before and after, never to the point of pain.',
    ],
    keyTakeawaysHi: [
      'Chromatic run (1-2-3-4 per string) finger independence ko isolate aur train karta hai, kisi bhi doosri skill demand se free.',
      'Spider walk lateral, cross-string stretch add karta hai — chromatic run ki up-down motion se ek genuinely alag skill.',
      'Dono ko slowly chalao, speed se zyada clean motion ko priority dete hue — motion clean hote hi speed automatically aati hai.',
      'Pehle aur baad mein gently stretch karo, kabhi pain ke point tak nahi.',
    ],
    guitarPractice: { sequences: [{"title":"1-2-3-4 chromatic finger exercise","titleHi":"1-2-3-4 chromatic finger exercise","defaultBpm":70,"notes":[{"string":0,"fret":1,"beat":0,"finger":1},{"string":0,"fret":2,"beat":1,"finger":2},{"string":0,"fret":3,"beat":2,"finger":3},{"string":0,"fret":4,"beat":3,"finger":4}]}] },
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'calluses-and-your-practice-schedule',
    title: 'Calluses & Your Practice Schedule',
    titleHi: 'Calluses Aur Tumhara Practice Schedule',
    description: 'Why fresh fingertips hurt (and for how long), plus a concrete answer to "how many days a week, how long each time."',
    descriptionHi: 'Fresh fingertips kyun dukhte hain (aur kab tak), plus "hafte mein kitne din, har baar kitni der" ka ek concrete answer.',
    difficulty: 'EASY',
    duration: 15,
    order: 3,

    analogy: {
      en: '**Breaking in a new pair of shoes.** New shoes rub and blister for the first several wears, then your feet toughen up exactly where the friction happens, and the same shoes stop hurting entirely. Fingertips and strings work identically — the discomfort is temporary and location-specific, and it resolves through consistent (not extreme) exposure, never by pushing through pain in one marathon session.',
      hi: '**Naye shoes ki pair break in karna.** Naye shoes pehle kai baar pehnne par rub aur blister karte hain, phir tumhare feet exactly wahan tough ho jaate hain jahan friction hota hai, aur wahi shoes bilkul dukhna band kar dete hain. Fingertips aur strings bilkul identically kaam karte hain — discomfort temporary aur location-specific hai, aur ye consistent (extreme nahi) exposure se resolve hota hai, kabhi ek marathon session mein pain ke through push karke nahi.',
    },

    simple: `**The callus timeline (roughly, varies by person):**

- **Days 1-3**: fingertips genuinely hurt after even short sessions. This is real and expected, not a sign you're doing something wrong.
- **Week 1-2**: soreness reduces noticeably; the skin starts to toughen where it contacts strings.
- **Week 3-4**: calluses are forming solidly; noticeably less discomfort in normal sessions.
- **~4-6 weeks of consistent practice**: calluses are established; fretting no longer hurts under normal conditions.

**Your practice schedule, a real answer:**

- **Minimum**: 15-20 minutes, at least 5 days a week. This beats one long weekend session by a wide margin — see Module 10 for exactly why spaced-out short sessions build skill faster than infrequent long ones.
- **Ideal for faster progress**: 20-30 minutes, 6 days a week, with 1 rest day for your hands to actually recover.
- **Never**: multi-hour marathon sessions in the first few weeks "to catch up" — this is the single most common way beginners injure their hands or fingertips badly enough to force a multi-day forced break, which sets progress back further than it advances it.
- If fingertips are actively painful (not just "a bit sore"), stop for the day — pushing through real pain slows callus formation and risks real injury, it doesn't speed anything up.`,
    simpleHi: `**Callus timeline (roughly, person se person alag hoti hai):**

- **Din 1-3**: fingertips genuinely dukhte hain chhote sessions ke baad bhi. Ye real aur expected hai, iska matlab ye nahi ki tum kuch galat kar rahe ho.
- **Week 1-2**: soreness noticeably kam ho jaati hai; skin wahan tough hona shuru hoti hai jahan wo strings ko touch karti hai.
- **Week 3-4**: calluses solidly ban rahe hote hain; normal sessions mein noticeably kam discomfort.
- **~4-6 hafte consistent practice ke**: calluses established ho jaate hain; fretting normal conditions mein aur nahi dukhti.

**Tumhara practice schedule, ek real answer:**

- **Minimum**: 15-20 minutes, hafte mein kam se kam 5 din. Ye ek lambe weekend session se wide margin se better hai — exactly kyun ye Module 10 mein dekho, ki spaced-out short sessions infrequent long ones se faster skill kyun banate hain.
- **Faster progress ke liye ideal**: 20-30 minutes, hafte mein 6 din, 1 rest day ke saath taaki hands actually recover ho sakein.
- **Kabhi nahi**: pehle kuch hafton mein multi-hour marathon sessions "catch up karne ke liye" — ye sabse common tareeka hai jisse beginners apne hands ya fingertips ko itna badly injure kar lete hain ki ek multi-day forced break force ho jaata hai, jo progress ko aage badhaane se zyada peeche set karta hai.
- Agar fingertips actively painful hain (sirf "thodi si sore" nahi), us din ke liye ruk jao — real pain ke through push karna callus formation ko slow karta hai aur real injury risk karta hai, kuch bhi speed up nahi karta.`,

    content: `**Why does consistency beat total hours, specifically for calluses?** Callus formation is your body's adaptive response to repeated, moderate friction/pressure over time — it needs regular, spaced exposure to trigger and reinforce that adaptation, similar to how muscle actually strengthens during REST after exercise, not during the exercise itself. A single 3-hour session gives your skin one long irritation event with no recovery time between exposures; five 20-minute sessions across a week give your skin five separate adaptation triggers with rest in between each one — genuinely better biology, not just a scheduling preference.

**Why 15-20 minutes as a floor, not lower?** Below roughly that threshold, a session often doesn't contain enough repetitions of any one thing (a chord change, an exercise) to meaningfully reinforce the muscle memory being built — you spend most of the session just getting warmed up and never reach the part where real learning consolidation happens. This isn't an arbitrary number; it reflects how long focused warm-up plus a few real reps of new material tends to actually take.

**The pain-vs-soreness distinction, made precise:** normal new-callus soreness is a dull, generalized tenderness across the fingertip pads that fades within a day. Sharp, localized pain, or pain that doesn't improve day over day, is a different signal entirely and warrants stopping and, if it persists, getting it checked — pushing through THAT kind of pain is never correct technique, at any skill level.`,
    contentHi: `**Consistency, specifically calluses ke liye, total hours se better kyun hai?** Callus formation tumhare body ka repeated, moderate friction/pressure ke against time ke saath adaptive response hai — ise us adaptation ko trigger aur reinforce karne ke liye regular, spaced exposure chahiye, kuch kuch waise hi jaise muscle actually exercise ke baad REST ke dauraan strengthen hota hai, exercise ke dauraan nahi. Ek single 3-hour session tumhari skin ko ek lamba irritation event deta hai bina exposures ke beech recovery time ke; hafte mein five 20-minute sessions tumhari skin ko five alag adaptation triggers dete hain har ek ke beech rest ke saath — genuinely better biology, sirf ek scheduling preference nahi.

**15-20 minutes ek floor kyun hai, kam nahi?** Roughly us threshold se neeche, ek session usually kisi ek cheez (ek chord change, ek exercise) ki itni repetitions contain nahi karta ki ban rahi muscle memory ko meaningfully reinforce kare — tum zyadatar session bas warm up hone mein spend karte ho aur us part tak kabhi nahi pahunchte jahan real learning consolidation hota hai. Ye arbitrary number nahi hai; ye reflect karta hai ki focused warm-up plus naye material ke kuch real reps mein actually kitna time lagta hai.

**Pain-vs-soreness distinction, precise banaya gaya:** normal new-callus soreness fingertip pads ke across ek dull, generalized tenderness hai jo ek din ke andar fade ho jaati hai. Sharp, localized pain, ya pain jo din-pratidin improve nahi hoti, ek bilkul alag signal hai aur rukne ki zaroorat hai, aur agar persist kare, ise check karwane ki. USS tarah ke pain ke through push karna kabhi bhi correct technique nahi hai, kisi bhi skill level par.`,

    examples: [
      {
        title: 'A realistic first-month weekly schedule',
        titleHi: 'Ek realistic first-month weekly schedule',
        code: `Mon: 20 min — warm-up (chromatic + spider walk) + new material
Tue: 20 min — warm-up + review yesterday's material
Wed: 20 min — warm-up + new material
Thu: Rest (or a light 10-min warm-up only, if hands feel good)
Fri: 20 min — warm-up + review week's material
Sat: 25 min — warm-up + new material + apply to a real chord/song
Sun: Rest`,
        explain:
          'This is a template, not a mandate — the two non-negotiable principles underneath it are "at least 5 active days" and "at least 1 real rest day," which Module 10 will build on with more detail about what to actually DO inside each session.',
        explainHi:
          'Ye ek template hai, mandate nahi — iske neeche ke do non-negotiable principles hain "kam se kam 5 active din" aur "kam se kam 1 real rest day," jinpar Module 10 aur detail ke saath build karega ki har session ke andar actually kya karna hai.',
      },
    ],

    mistakes: [
      {
        wrong: 'Practicing for 3+ hours on a single weekend day and skipping the rest of the week.',
        right: 'Spread the same total time across 5-6 shorter daily sessions instead.',
        why: 'Calluses and muscle memory both build through repeated, spaced exposure with recovery time — one long session gives your skin and hands one irritation event and no adaptation window, and typically causes more pain for less actual skill gained.',
        whyHi: 'Calluses aur muscle memory dono repeated, spaced exposure se recovery time ke saath banti hain — ek lamba session tumhari skin aur hands ko ek irritation event deta hai aur koi adaptation window nahi, aur typically kam actual skill gain ke liye zyada pain cause karta hai.',
      },
      {
        wrong: 'Continuing to play through sharp, localized fingertip pain because "you need to build tolerance."',
        right: 'Stop for the day at sharp or non-improving pain — normal callus soreness is dull and fades daily; this is different and needs rest, not more exposure.',
        why: "Pushing through genuine pain (versus normal soreness) risks a real injury that forces a much longer break than simply resting for a day or two would have — it works against the exact goal it's trying to achieve.",
        whyHi: 'Genuine pain (normal soreness ke bajaye) ke through push karna ek real injury risk karta hai jo ek-do din simply rest karne se kahin zyada lamba break force karta hai — ye us exact goal ke against kaam karta hai jise achieve karne ki koshish kar raha hai.',
      },
    ],

    realWorld: [
      {
        en: 'Ask any long-time player and they\'ll tell you the same thing this lesson does: the first month is genuinely the hardest on your fingertips, and it gets dramatically easier afterward — that\'s not motivational fluff, it\'s literally how skin adapts, and knowing the timeline in advance makes the discomfort easier to push through because you know it\'s temporary and predictable.',
        hi: 'Kisi bhi long-time player se pucho aur wo tumhe wahi bataayega jo ye lesson batata hai: pehla mahina genuinely tumhari fingertips ke liye hardest hai, aur uske baad dramatically easier ho jaata hai — ye motivational fluff nahi hai, ye literally waise hi hai jaise skin adapt hoti hai, aur timeline pehle se pata hona discomfort ko push through karna easier banata hai kyunki tumhe pata hai ye temporary aur predictable hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Can I speed up callus formation somehow — special creams, alcohol, anything?',
        qHi: 'Kya main kisi tarah callus formation speed up kar sakta hoon — special creams, alcohol, kuch bhi?',
        a: "Consistent practice is genuinely the only reliable method. Some players report certain drying agents help slightly, but they're a minor tweak at best — no product replaces regular, moderate string contact over several weeks, and some home remedies (like rubbing alcohol used aggressively) can actually damage skin and slow things down instead.",
        aHi: 'Consistent practice genuinely sirf reliable method hai. Kuch players kehte hain ki kuch drying agents thoda help karte hain, lekin wo best case mein ek minor tweak hain — koi product several weeks tak regular, moderate string contact replace nahi karta, aur kuch home remedies (jaise aggressively use ki gayi rubbing alcohol) actually skin ko damage kar sakte hain aur cheezein slow kar sakte hain iske bajaye.',
      },
    ],

    exercises: [
      {
        task: 'Write down (physically or in a notes app) your own realistic weekly practice schedule for the next 2 weeks, naming specific days and times, using the template above as a starting point.',
        taskHi: 'Agle 2 hafton ke liye apna khud ka realistic weekly practice schedule likho (physically ya ek notes app mein), specific days aur times naam karte hue, upar wale template ko starting point ki tarah use karke.',
        hint: 'A schedule that exists only in your head is far easier to skip than one written down somewhere you\'ll actually see again — this tiny step measurably improves follow-through.',
        hintHi: 'Ek schedule jo sirf tumhare dimaag mein exist karta hai use skip karna kahin zyada easy hai us schedule se jo kahin likha hua hai jahan tum use actually dobara dekhoge — ye chhota sa step measurably follow-through improve karta hai.',
      },
    ],

    keyTakeaways: [
      'Callus soreness is real and expected for the first 1-3 days, noticeably better by week 2, mostly resolved by 4-6 weeks of consistent practice.',
      'Minimum practice: 15-20 minutes, at least 5 days a week. Ideal: 20-30 minutes, 6 days a week, with 1 real rest day.',
      'Never marathon-session to "catch up" — consistency across short sessions builds calluses and skill faster than long infrequent ones.',
      'Dull, fading soreness is normal. Sharp or non-improving pain means stop for the day.',
    ],
    keyTakeawaysHi: [
      'Callus soreness pehle 1-3 dino ke liye real aur expected hai, week 2 tak noticeably better, 4-6 hafte consistent practice tak mostly resolved.',
      'Minimum practice: 15-20 minutes, hafte mein kam se kam 5 din. Ideal: 20-30 minutes, hafte mein 6 din, 1 real rest day ke saath.',
      'Kabhi "catch up" karne ke liye marathon-session mat karo — short sessions ke across consistency calluses aur skill ko long infrequent ones se faster banati hai.',
      'Dull, fading soreness normal hai. Sharp ya non-improving pain matlab us din ke liye ruk jao.',
    ],
  },
];
