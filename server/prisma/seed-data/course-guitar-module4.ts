/**
 * Guitar Course — Module 4: The Easy Chord Family, Part 1, lessons 1-3.
 *
 * Lesson 1: Em — the two-finger chord, and why it's taught first.
 * Lesson 2: Em7 — one finger lighter than Em, and the "add/remove a
 *           finger" relationship between chords.
 * Lesson 3: G — the first chord needing all 4 fingers with real stretch.
 */

import type { CourseLesson } from './course-js-module1';
import { chordPreviewHtml, chordFamilyHtml } from './guitar-diagrams';
import { CHORDS } from './guitar-chords-data';

export const GUITAR_MODULE_4: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'chord-em',
    title: 'Your First Chord: E Minor (Em)',
    titleHi: 'Tumhara Pehla Chord: E Minor (Em)',
    description: 'Two fingers, four open strings, and a real chord you can play today.',
    descriptionHi: 'Do fingers, char open strings, aur ek real chord jo aaj bajaa sakte ho.',
    difficulty: 'EASY',
    duration: 15,
    order: 1,

    analogy: {
      en: '**Learning to swim by floating first.** You don\'t start swimming lessons with the hardest stroke — you start with something that works immediately and builds confidence. Em is the "floating" of guitar chords: minimal effort, immediate real music, and it directly sets up the finger-independence work from Module 3.',
      hi: '**Pehle float karna seekhkar swimming seekhna.** Swimming lessons sabse hard stroke se shuru nahi karte — kuch aisa se shuru karte ho jo turant kaam kare aur confidence banaye. Em guitar chords ka "floating" hai: minimal effort, turant real music, aur ye directly Module 3 ke finger-independence kaam ko set up karta hai.',
    },

    simple: `You already saw Em in Module 2's tuning lesson — now it's time to actually play it as a chord.

**Em, step by step:**
1. Finger 2 (middle) on string A (5th string), fret 2.
2. Finger 3 (ring) on string D (4th string), fret 2.
3. Everything else — low E, G, B, high e — rings open.
4. Strum all 6 strings.

**Check before you strum:** both fingers pressing just behind their fret (Module 3's rule), thumb resting behind the neck opposite roughly finger 2, and neither finger accidentally touching (and muting) the open strings next to it.`,
    simpleHi: `Tumne Em pehle hi Module 2 ke tuning lesson mein dekha tha — ab ise actually ek chord ki tarah bajaane ka time hai.

**Em, step by step:**
1. Finger 2 (middle) string A (5th string) par, fret 2.
2. Finger 3 (ring) string D (4th string) par, fret 2.
3. Baaki sab — low E, G, B, high e — open rehta hai.
4. Saari 6 strings strum karo.

**Strum karne se pehle check:** dono fingers apne fret ke bilkul peeche press kar rahe hain (Module 3 ka rule), thumb neck ke peeche roughly finger 2 ke opposite resting, aur koi bhi finger accidentally paas wali open strings ko touch (aur mute) nahi kar raha.`,

    content: `**Why Em uses zero fingers on the outer strings, and why that's a deliberate teaching choice.** With 4 of 6 strings ringing open, there's very little that can go wrong — no finger needs to avoid touching a neighboring open string, since most strings ARE open. This lets a total beginner focus 100% of their attention on just two things: correct finger placement, and correct pressure (Module 3's buzz-pressure test). Compare this to a chord using all 6 strings fretted — there, a mistake could come from any of 6 places, which is cognitively overwhelming on day one.

**Why minor chords "sound sad" and major chords "sound happy" (briefly — Module 19 explains the actual music theory):** for now, just notice the emotional character of Em when you strum it. You don't need the theory to use the chord, the same way you don't need to know why a stop sign is red to obey it — but filing away "this SOUNDS like something" now gives Module 19's explanation something concrete to attach to later.

**A practical first-week goal:** hold Em cleanly (no buzzing on any of the 6 strings) for a full, relaxed 10-second strum pattern, without your hand cramping. That's a realistic, checkable milestone — not "play it perfectly forever," just "hold it cleanly for ten seconds without discomfort."`,
    contentHi: `**Em outer strings par zero fingers kyun use karta hai, aur ye ek deliberate teaching choice kyun hai.** 6 mein se 4 strings open ringing ke saath, bahut kam kuch galat ho sakta hai — koi finger ko paas wali open string touch karne se bachna nahi padta, kyunki zyadatar strings already open HAIN. Ye ek total beginner ko apna 100% attention sirf do cheezon par focus karne deta hai: correct finger placement, aur correct pressure (Module 3 ka buzz-pressure test). Ise ek aise chord se compare karo jo saari 6 strings fret karta hai — wahan, mistake 6 mein se kisi bhi jagah se aa sakti hai, jo day one par cognitively overwhelming hai.

**Minor chords "sad sound" kyun karte hain aur major chords "happy sound" (briefly — Module 19 actual music theory explain karta hai):** abhi ke liye, bas Em ki emotional character notice karo jab use strum karo. Chord use karne ke liye theory ki zaroorat nahi, waise hi jaise stop sign lal kyun hai jaanne ki zaroorat nahi use obey karne ke liye — lekin abhi "ye kuch SOUND karta hai" file karke rakhna Module 19 ki explanation ko baad mein attach karne ke liye kuch concrete deta hai.

**Ek practical first-week goal:** Em ko cleanly hold karo (6 mein se kisi bhi string par buzzing nahi) ek poore, relaxed 10-second strum pattern ke liye, bina hand cramp kiye. Ye ek realistic, checkable milestone hai — "hamesha ke liye perfectly bajao" nahi, bas "das seconds cleanly hold karo bina discomfort ke."`,

    examples: [
      {
        title: 'Em, the full shape',
        titleHi: 'Em, poora shape',
        code: `Em
  E |---0---   open
  A |---2---   finger 2
  D |---2---   finger 3
  G |---0---   open
  B |---0---   open
  E |---0---   open`,
        previewHeight: 330,
        preview: chordPreviewHtml(CHORDS.Em, 'Only strings A and D are fretted — everything else rings open.'),
        explain:
          'This is the exact same diagram from Module 2 — repetition here is deliberate. You should now be able to read every part of it instantly (string order, finger numbers, O markers) without re-deriving any of it.',
        explainHi:
          'Ye Module 2 wala exact same diagram hai — yahan repetition deliberate hai. Ab tumhe iska har part instantly padhna aana chahiye (string order, finger numbers, O markers) kuch bhi dobara derive kiye bina.',
      },
    ],

    mistakes: [
      {
        wrong: 'Letting finger 2 or 3 lean over and accidentally touch the G string, muting it.',
        right: 'Curl fingers so contact is fingertip-only, keeping the G string clear (per Module 3\'s finger-curl check).',
        why: 'A muted G string in Em is one of the most common "why does my chord sound wrong" issues for total beginners, and it\'s almost always this exact contact problem.',
        whyHi: 'Em mein ek muted G string total beginners ke liye "mera chord galat kyun sound karta hai" ke sabse common issues mein se ek hai, aur ye almost hamesha exactly yahi contact problem hai.',
      },
    ],

    realWorld: [
      {
        en: 'Em is one of the most-used chords across popular music precisely because it\'s this easy to grab quickly mid-song — you\'ll see it constantly once you start recognizing chord shapes in songs you already know.',
        hi: 'Em popular music ke across sabse zyada use hone wale chords mein se ek hai precisely kyunki ye mid-song jaldi grab karna itna easy hai — tum ise constantly dekhoge ek baar jab tum un songs mein chord shapes recognize karna shuru karoge jo tumhe already pata hain.',
      },
    ],

    interviewQA: [
      {
        q: 'My Em sounds fine except the low E string is a bit dull — is that a problem?',
        qHi: 'Mera Em theek sound karta hai sivaye iske ki low E string thodi dull hai — kya ye problem hai?',
        a: 'Likely your strumming hand isn\'t striking it cleanly, or your fretting hand\'s finger 2/3 is lightly brushing it. Check contact first (Module 3), then check your pick\'s strike angle on that specific string.',
        aHi: 'Likely tumhari strumming hand use cleanly strike nahi kar rahi, ya tumhari fretting hand ki finger 2/3 use lightly brush kar rahi hai. Pehle contact check karo (Module 3), phir us specific string par apne pick ka strike angle check karo.',
      },
    ],

    exercises: [
      {
        task: 'Form Em, check each string rings clean one at a time (pluck individually, all 6), fix any buzzing or muted string, then strum all 6 together and hold for 10 seconds.',
        taskHi: 'Em banao, har string ko ek time par check karo ki clean ring karti hai (individually pluck karo, saari 6), koi bhi buzzing ya muted string fix karo, phir saari 6 ko saath strum karo aur 10 seconds hold karo.',
        hint: 'Checking strings one at a time before strumming all together isolates exactly which finger (if any) is causing a problem, instead of guessing from the combined sound.',
        hintHi: 'Saath strum karne se pehle strings ko ek-ek karke check karna exactly ye isolate karta hai ki kaunsi finger (agar koi hai) problem cause kar rahi hai, combined sound se guess karne ke bajaye.',
      },
    ],

    keyTakeaways: [
      'Em: finger 2 on A-string fret 2, finger 3 on D-string fret 2, everything else open.',
      'Only 2 fingers needed — this is why Em is traditionally the first chord taught.',
      'Goal for week 1: hold it cleanly, all 6 strings ringing true, for a relaxed 10 seconds.',
    ],
    keyTakeawaysHi: [
      'Em: finger 2 A-string fret 2 par, finger 3 D-string fret 2 par, baaki sab open.',
      'Sirf 2 fingers chahiye — yahi reason hai ki Em traditionally pehla sikhaya jaane wala chord hai.',
      'Week 1 ka goal: cleanly hold karo, saari 6 strings true ring karte hue, ek relaxed 10 seconds ke liye.',
    ],
    guitarPractice: { sequences: [{"title":"Em, one string at a time","titleHi":"Em, ek string ek baar mein","defaultBpm":80,"notes":[{"string":0,"fret":0,"beat":0},{"string":1,"fret":2,"beat":1,"finger":2},{"string":2,"fret":2,"beat":2,"finger":3},{"string":3,"fret":0,"beat":3},{"string":4,"fret":0,"beat":4},{"string":5,"fret":0,"beat":5}]}] },
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'chord-em7',
    title: 'Em7 — One Finger Lighter Than Em',
    titleHi: 'Em7 — Em Se Ek Finger Halka',
    description: 'A chord that teaches you chords relate to each other, not just exist as isolated shapes to memorize.',
    descriptionHi: 'Ek chord jo tumhe sikhata hai ki chords ek doosre se relate karte hain, sirf isolated shapes nahi jo memorize karne hain.',
    difficulty: 'EASY',
    duration: 10,
    order: 2,

    analogy: {
      en: '**Taking off a jacket, not changing your whole outfit.** Going from Em to Em7 isn\'t "learn an entirely new chord" — it\'s "lift one finger off Em." Recognizing this relationship is far more efficient than treating every chord as a brand-new, unrelated shape to memorize from scratch.',
      hi: '**Jacket utaarna, poora outfit badalna nahi.** Em se Em7 par jaana "ek bilkul nayi chord seekho" nahi hai — ye "Em se ek finger uthao" hai. Ye relationship recognize karna har chord ko ek bilkul naya, unrelated shape treat karne se kahin zyada efficient hai jo scratch se memorize karna hai.',
    },

    simple: `**Em7 is Em with finger 3 lifted off.**

1. Form Em (finger 2 on A-string fret 2, finger 3 on D-string fret 2).
2. Lift finger 3 only. String D now rings open too.
3. That's it — you now know Em7.

\`\`\`
Em7
  E |---0---   open
  A |---2---   finger 2
  D |---0---   open (finger 3 removed)
  G |---0---   open
  B |---0---   open
  E |---0---   open
\`\`\`

Practice switching Em -> Em7 -> Em by just adding/removing finger 3, keeping finger 2 planted the whole time.`,
    simpleHi: `**Em7 Em hai finger 3 uthaya hua.**

1. Em banao (finger 2 A-string fret 2 par, finger 3 D-string fret 2 par).
2. Sirf finger 3 uthao. String D ab open bhi ring karti hai.
3. Bas — ab tumhe Em7 pata hai.

\`\`\`
Em7
  E |---0---   open
  A |---2---   finger 2
  D |---0---   open (finger 3 removed)
  G |---0---   open
  B |---0---   open
  E |---0---   open
\`\`\`

Em -> Em7 -> Em switch karne ki practice karo bas finger 3 add/remove karke, finger 2 ko poori der planted rakhte hue.`,

    content: `**Why teach this relationship explicitly, this early?** Because it's the first concrete proof of a pattern that will recur constantly for the rest of the course: many chords differ from each other by just one finger, one fret, or one small movement — not a total hand reset. Beginners who don't notice this end up relearning every chord shape from zero, which is dramatically slower than beginners who actively look for "what changed from the last chord I know."

**Keeping finger 2 planted is itself a skill worth building now.** Deliberately practicing WHICH finger stays down while others move is a direct preview of Module 6's anchor-finger technique for fast chord changes — Em to Em7 is the simplest possible version of that idea, with only one finger moving at all.`,
    contentHi: `**Ye relationship abhi, itni jaldi explicitly kyun sikhaein?** Kyunki ye ek pattern ka pehla concrete proof hai jo poore course mein constantly recur karega: bahut saare chords ek doosre se sirf ek finger, ek fret, ya ek chhote movement se differ karte hain — poora hand reset nahi. Jo beginners ye notice nahi karte wo har chord shape ko zero se relearn karte hain, jo un beginners se dramatically slower hai jo actively dhoondhte hain "pichle chord se kya badla."

**Finger 2 ko planted rakhna khud ek skill hai jo abhi build karne layak hai.** Deliberately practice karna ki KAUNSI finger neeche rehti hai jabki doosri move karti hain Module 6 ki anchor-finger technique ka ek direct preview hai fast chord changes ke liye — Em se Em7 us idea ka sabse simple possible version hai, sirf ek finger move hone ke saath.`,

    examples: [
      {
        title: 'Em vs Em7, side by side',
        titleHi: 'Em vs Em7, saath saath',
        previewHeight: 330,
        code: `Em: finger 2 (A/2), finger 3 (D/2)
Em7: finger 2 (A/2) only — finger 3 lifted`,
        preview: chordFamilyHtml([CHORDS.Em, CHORDS.Em7], 'The only difference: finger 3 on the D string. Everything else is identical.'),
        explain:
          "Seeing both diagrams side by side makes the single-finger difference visually obvious in a way that reading two separate diagrams on different pages doesn't — use this side-by-side habit yourself whenever you're learning a new chord that resembles one you already know.",
        explainHi:
          "Dono diagrams ko saath saath dekhna single-finger difference ko visually obvious banata hai us tarike se jo alag pages par do separate diagrams padhna nahi karta — is side-by-side habit ko khud use karo jab bhi ek naya chord seekh rahe ho jo kisi already-known chord jaisa lagta hai.",
      },
    ],

    mistakes: [
      {
        wrong: 'Lifting finger 2 as well as finger 3 when switching from Em to Em7, then re-placing both from scratch.',
        right: 'Keep finger 2 completely still — only finger 3 moves.',
        why: 'Moving a finger that didn\'t need to move wastes motion and time for no benefit, and undermines the exact anchor-finger habit this lesson (and Module 6) is trying to build.',
        whyHi: 'Ek finger move karna jise move hone ki zaroorat nahi thi motion aur time waste karta hai bina kisi benefit ke, aur exactly us anchor-finger habit ko undermine karta hai jo ye lesson (aur Module 6) build karne ki koshish kar raha hai.',
      },
    ],

    realWorld: [
      {
        en: 'Em and Em7 are used almost interchangeably in a huge number of songs — some players will substitute one for the other on the fly for a slightly different color, which is only possible once you internalize how closely related they are.',
        hi: 'Em aur Em7 bahut saare songs mein almost interchangeably use hote hain — kuch players thoda different color ke liye ek ko doosre se on the fly substitute karte hain, jo tabhi possible hai jab tum internalize karo ki wo kitne closely related hain.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is it called "Em7" and not something simpler?',
        qHi: '"Em7" kyun kaha jaata hai kuch simpler nahi?',
        a: 'The "7" refers to a 7th interval added to the basic minor triad — the actual music theory behind that name is covered properly in Module 19. For now, just treat "Em7" as this specific chord\'s name.',
        aHi: '"7" ek 7th interval refer karta hai jo basic minor triad mein add hota hai — us naam ke peeche ki actual music theory Module 19 mein properly cover hoti hai. Abhi ke liye, bas "Em7" ko is specific chord ke naam ki tarah treat karo.',
      },
    ],

    exercises: [
      {
        task: 'Switch between Em and Em7 ten times in a row, strumming once after each switch, keeping finger 2 planted the entire time. Time yourself — note how fast you can do it while staying clean.',
        taskHi: 'Em aur Em7 ke beech das baar switch karo, har switch ke baad ek baar strum karte hue, poori der finger 2 ko planted rakhte hue. Khud ko time karo — notice karo ki clean rehte hue kitni fast kar sakte ho.',
        hint: 'If finger 2 keeps lifting accidentally, slow down deliberately — speed will come once the "stay planted" habit is solid, not before.',
        hintHi: 'Agar finger 2 accidentally baar-baar uthta hai, deliberately slow down karo — speed tab aayegi jab "stay planted" habit solid ho jaaye, uske pehle nahi.',
      },
    ],

    keyTakeaways: [
      'Em7 = Em with finger 3 lifted — string D rings open instead of fretted.',
      'Recognizing "one finger different from a chord I know" is far faster than memorizing every chord as an isolated shape.',
      'Practicing which finger stays planted while others move previews Module 6\'s anchor-finger technique.',
    ],
    keyTakeawaysHi: [
      'Em7 = Em finger 3 uthaya hua — string D fretted ke bajaye open ring karti hai.',
      '"Ek finger ek known chord se different hai" recognize karna har chord ko isolated shape ki tarah memorize karne se kahin zyada fast hai.',
      'Ye practice karna ki kaunsi finger planted rehti hai jabki doosri move karti hain Module 6 ki anchor-finger technique ka preview deta hai.',
    ],
    guitarPractice: { sequences: [{"title":"Em7, one string at a time","titleHi":"Em7, ek string ek baar mein","defaultBpm":80,"notes":[{"string":0,"fret":0,"beat":0},{"string":1,"fret":2,"beat":1,"finger":2},{"string":2,"fret":0,"beat":2},{"string":3,"fret":0,"beat":3},{"string":4,"fret":0,"beat":4},{"string":5,"fret":0,"beat":5}]}] },
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'chord-g-major',
    title: 'G Major — Your First 4-Finger Stretch',
    titleHi: 'G Major — Tumhara Pehla 4-Finger Stretch',
    description: 'The first chord that genuinely challenges beginner hand span, and how to approach that challenge correctly.',
    descriptionHi: 'Pehla chord jo genuinely beginner hand span ko challenge karta hai, aur us challenge ko correctly kaise approach karein.',
    difficulty: 'MEDIUM',
    duration: 15,
    order: 3,

    analogy: {
      en: '**A wider split in a stretching routine.** G asks your fingers to spread wider than Em or Em7 did — like the difference between a light warm-up stretch and a deeper one. It should feel like a genuine stretch, never sharp pain — the same distinction Module 3 drew between normal soreness and real pain.',
      hi: '**Ek stretching routine mein ek wider split.** G tumhari fingers ko Em ya Em7 se zyada wide spread karne ke liye kehta hai — ek light warm-up stretch aur ek deeper stretch ke beech ke difference jaisa. Ye ek genuine stretch jaisa feel hona chahiye, kabhi sharp pain jaisa nahi — wahi distinction jo Module 3 ne normal soreness aur real pain ke beech kheenchi thi.',
    },

    simple: `**G major, step by step (this specific "3-finger" version):**

1. Finger 3 (ring) on low E-string, fret 3.
2. Finger 2 (middle) on A-string, fret 2.
3. Strings D, G, B ring open.
4. Finger 4 (pinky) on high e-string, fret 3.
5. Strum all 6 strings.

This is genuinely the widest stretch you've attempted so far in this course — fingers 3 and 4 are reaching to opposite outer strings while finger 2 sits in the middle. Expect it to feel awkward for the first several tries; that's completely normal, not a sign of doing it wrong.`,
    simpleHi: `**G major, step by step (ye specific "3-finger" version):**

1. Finger 3 (ring) low E-string par, fret 3.
2. Finger 2 (middle) A-string par, fret 2.
3. Strings D, G, B open ring karti hain.
4. Finger 4 (pinky) high e-string par, fret 3.
5. Saari 6 strings strum karo.

Ye genuinely widest stretch hai jo tumne is course mein ab tak try kiya hai — fingers 3 aur 4 opposite outer strings tak pahunch rahe hain jabki finger 2 beech mein baitha hai. Expect karo ki ye pehle kai tries mein awkward feel karega; ye bilkul normal hai, galat karne ka sign nahi.`,

    content: `**Why does this specific chord shape (not another G voicing) get taught first?** This 3-finger version keeps three strings (D, G, B) completely open in the middle, which means your fretting fingers only need to worry about the two outer strings — a genuinely different challenge from squeezing many fingers into a tight cluster. It builds hand-span flexibility specifically, which chromatic exercises alone (Module 3) don't fully train, since those keep all 4 fingers close together on one string at a time.

**If the stretch feels impossible right now:** that's a real, common experience, not a sign of unusual difficulty with your specific hands. Hand span increases measurably with consistent practice over the first several weeks (the same adaptation principle behind Module 3's callus timeline, applied to connective tissue and muscle memory instead of skin). Practicing the stretch itself — even without a clean sound yet — is productive.

**A genuinely useful shortcut:** if the full stretch is too much right now, practice placing JUST finger 3 and finger 2 first (leaving finger 4 off, letting the high e string ring open instead — this technically makes a different, related chord, but it's a legitimate practice stepping stone), then add finger 4 back in once fingers 2 and 3 feel automatic.`,
    contentHi: `**Ye specific chord shape (koi doosri G voicing nahi) pehle kyun sikhayi jaati hai?** Ye 3-finger version beech mein teen strings (D, G, B) ko completely open rakhta hai, matlab tumhari fretting fingers ko sirf do outer strings ki chinta karni hai — ek genuinely alag challenge bahut saari fingers ko ek tight cluster mein squeeze karne se. Ye specifically hand-span flexibility build karta hai, jo akele chromatic exercises (Module 3) poori tarah train nahi karte, kyunki wo saari 4 fingers ko ek time par ek string par close together rakhte hain.

**Agar stretch abhi impossible feel ho:** ye ek real, common experience hai, tumhare specific hands ki unusual difficulty ka sign nahi. Hand span pehle kai hafton ke consistent practice ke saath measurably badhta hai (wahi adaptation principle jo Module 3 ke callus timeline ke peeche hai, connective tissue aur muscle memory par apply hote hue skin ke bajaye). Stretch ko khud practice karna — bina clean sound ke bhi — productive hai.

**Ek genuinely useful shortcut:** agar abhi poora stretch bahut zyada hai, pehle sirf finger 3 aur finger 2 place karne ki practice karo (finger 4 ko off chhodte hue, high e string ko iske bajaye open ring karne dete hue — ye technically ek alag, related chord banata hai, lekin ye ek legitimate practice stepping stone hai), phir finger 4 ko wapas add karo ek baar fingers 2 aur 3 automatic feel karein.`,

    examples: [
      {
        title: 'G major, full 3-finger shape',
        titleHi: 'G major, poora 3-finger shape',
        code: `G
  E |---3---   finger 3
  A |---2---   finger 2
  D |---0---   open
  G |---0---   open
  B |---0---   open
  E |---3---   finger 4`,
        previewHeight: 330,
        preview: chordPreviewHtml(CHORDS.G, 'Fingers 3 and 4 reach to opposite outer strings, finger 2 sits in the middle — the widest stretch so far.'),
        explain:
          'Note fingers 3 and 4 are both on fret 3, but on opposite ends of the fretboard — this specific span (not just "using 3 fingers") is what makes G a genuine stretch milestone, more than Em or Em7 were.',
        explainHi:
          'Notice karo fingers 3 aur 4 dono fret 3 par hain, lekin fretboard ke opposite ends par — ye specific span (sirf "3 fingers use karna" nahi) hai jo G ko ek genuine stretch milestone banata hai, Em ya Em7 se zyada.',
      },
    ],

    mistakes: [
      {
        wrong: 'Forcing the full stretch immediately with excessive tension, gripping hard "to make it reach."',
        right: 'Approach the stretch gradually — practice the reach itself without full pressure first, and use the finger-2-and-3-only stepping stone if needed.',
        why: 'Forcing a stretch beyond your current comfortable range with excess tension is exactly the kind of overreach Module 3 warned against — it risks real strain, unlike patient, gradual range-building.',
        whyHi: 'Excess tension ke saath poora stretch turant force karna exactly wahi overreach hai jiske against Module 3 ne warn kiya tha — ye real strain risk karta hai, patient, gradual range-building ke ulta.',
      },
    ],

    realWorld: [
      {
        en: 'G major is one of the single most common chords in Western popular music — the stretch discomfort you\'re working through right now is a one-time cost that pays off across an enormous number of songs.',
        hi: 'G major Western popular music mein sabse common chords mein se ek hai — ye stretch discomfort jispe tum abhi kaam kar rahe ho ek one-time cost hai jo bahut bade number of songs ke across pay off karti hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Is there an easier version of G I could learn instead, permanently?',
        qHi: 'Kya G ka ek easier version hai jo main permanently seekh sakta hoon?',
        a: "There are alternate G shapes, but this 3-finger version is worth persisting with — it's the most commonly expected shape, and the hand-span flexibility it builds transfers to many other chords later in the course.",
        aHi: 'Alternate G shapes hain, lekin ye 3-finger version persist karne layak hai — ye sabse commonly expected shape hai, aur jo hand-span flexibility ye build karta hai wo course mein baad mein bahut saare doosre chords tak transfer hoti hai.',
      },
    ],

    exercises: [
      {
        task: 'Place fingers 2 and 3 only, check they ring clean, then add finger 4. If finger 4 causes fingers 2/3 to shift out of place, reset and try again slowly — don\'t force through a collapsing shape.',
        taskHi: 'Sirf fingers 2 aur 3 place karo, check karo wo clean ring karte hain, phir finger 4 add karo. Agar finger 4 fingers 2/3 ko apni jagah se shift kara de, reset karo aur slowly dobara try karo — ek collapsing shape ke through force mat karo.',
        hint: 'A shape that collapses when you add the last finger usually means the first two fingers weren\'t anchored firmly enough to begin with — solidify those first before adding the third.',
        hintHi: 'Ek shape jo aakhri finger add karte waqt collapse ho jaata hai usually matlab hai pehli do fingers shuru mein itni firmly anchored nahi thi — teesri add karne se pehle unhe solidify karo.',
      },
    ],

    keyTakeaways: [
      'G major (3-finger version): finger 3 on low E fret 3, finger 2 on A fret 2, finger 4 on high e fret 3, D/G/B open.',
      'This is the widest hand-span stretch so far — expect initial awkwardness, it is normal and improves with consistent practice.',
      'A finger-2-and-3-only stepping stone is a legitimate way to build toward the full shape gradually.',
    ],
    keyTakeawaysHi: [
      'G major (3-finger version): finger 3 low E fret 3 par, finger 2 A fret 2 par, finger 4 high e fret 3 par, D/G/B open.',
      'Ye ab tak ka widest hand-span stretch hai — initial awkwardness expect karo, ye normal hai aur consistent practice se improve hota hai.',
      'Ek finger-2-aur-3-only stepping stone poore shape tak gradually build karne ka ek legitimate tareeka hai.',
    ],
    guitarPractice: { sequences: [{"title":"G, one string at a time","titleHi":"G, ek string ek baar mein","defaultBpm":80,"notes":[{"string":0,"fret":3,"beat":0,"finger":3},{"string":1,"fret":2,"beat":1,"finger":2},{"string":2,"fret":0,"beat":2},{"string":3,"fret":0,"beat":3},{"string":4,"fret":0,"beat":4},{"string":5,"fret":3,"beat":5,"finger":4}]}] },
  },
];
