/**
 * Guitar Course — Module 17: Barre Chords, lessons 1-3. Closes Part VI.
 *
 * Lesson 1: The F-chord hurdle and correct technique to avoid pain.
 * Lesson 2: Movable barre shapes (E-shape and A-shape) up the neck.
 * Lesson 3: A realistic practice progression for building barre strength
 *           without injury, tying back to Module 11's safety content.
 */

import type { CourseLesson } from './course-js-module1';
import { chordPreviewHtml, chordFamilyHtml } from './guitar-diagrams';
import { CHORDS } from './guitar-chords-data';

export const GUITAR_MODULE_17: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'the-f-chord-hurdle',
    title: 'The F-Chord Hurdle & Correct Barre Technique',
    titleHi: 'F-Chord Hurdle Aur Correct Barre Technique',
    description: 'The single most notorious beginner obstacle in guitar — and why most of the difficulty comes from technique, not finger strength.',
    descriptionHi: 'Guitar mein sabse notorious beginner obstacle — aur difficulty ka zyadatar hissa technique se kyun aata hai, finger strength se nahi.',
    difficulty: 'HARD',
    duration: 20,
    order: 1,

    analogy: {
      en: '**A rolling pin pressing evenly along its length, not a single finger poking one spot.** A weak, poorly-angled barre tries to press with the soft, uneven surface of a finger laid flat — like poking dough with one knuckle. A correct barre uses the harder, straighter EDGE of the index finger, closer to the bone — like a rolling pin, applying even pressure along the whole length with much less total force needed.',
      hi: '**Ek rolling pin jo apni length ke saath evenly press karta hai, ek single finger jo ek spot poke kare wo nahi.** Ek weak, poorly-angled barre ek finger ke soft, uneven surface se press karne ki koshish karta hai flat lete hue — ek knuckle se dough poke karne jaisa. Ek correct barre index finger ke harder, straighter EDGE ko use karta hai, bone ke zyada paas — ek rolling pin ki tarah, poori length ke saath even pressure apply karte hue kahin kam total force ke saath.',
    },

    simple: `**Why F specifically is the notorious first barre chord:** it's usually the first chord a beginner encounters that requires the index finger to press ALL 6 strings flat at once, while other fingers form the rest of the shape (Module 2 already showed you how to read this exact diagram, back when it was purely a reading exercise).

**The technique correction that fixes most barre struggles:**
1. Use the OUTER EDGE of the index finger (the side closer to the thumb), not the soft flat pad — the edge is harder and presses more evenly.
2. Position the barre finger just behind the fret (Module 3's rule, still true here), not in the middle of the gap.
3. Roll the finger very slightly so its natural curve doesn't create gaps under any one string — a perfectly flat finger often has an unnoticed low spot at a knuckle.
4. Keep the thumb behind the neck applying counter-pressure (Module 3), roughly opposite the barre finger — this genuinely reduces how hard the barre finger itself needs to press.

**Realistic expectation:** most beginners cannot produce a fully clean F chord on the first attempt, or even the first week. This is normal, expected, and does not mean you're doing something fundamentally wrong.`,
    simpleHi: `**F specifically notorious pehla barre chord kyun hai:** ye usually pehla chord hai jo ek beginner encounter karta hai jismein index finger ko ek saath saari 6 strings flat press karni padti hain, jabki baaki fingers shape ka baaki hissa banati hain (Module 2 ne already dikhaya tha ki ye exact diagram kaise padhein, jab ye purely ek reading exercise thi).

**Technique correction jo zyadatar barre struggles fix karta hai:**
1. Index finger ka OUTER EDGE use karo (thumb ke zyada paas wali side), soft flat pad nahi — edge harder hai aur zyada evenly press karta hai.
2. Barre finger ko fret ke bilkul peeche position karo (Module 3 ka rule, yahan abhi bhi true hai), gap ke beech mein nahi.
3. Finger ko bahut slightly roll karo taaki uska natural curve kisi ek string ke neeche gaps na banaye — ek perfectly flat finger mein often ek unnoticed low spot hota hai ek knuckle par.
4. Thumb ko neck ke peeche counter-pressure apply karte rakho (Module 3), roughly barre finger ke opposite — ye genuinely kam karta hai ki barre finger khud ko kitna hard press karna padta hai.

**Realistic expectation:** zyadatar beginners pehle attempt par, ya pehle hafte mein bhi, ek fully clean F chord produce nahi kar sakte. Ye normal hai, expected hai, aur iska matlab ye nahi ki tum kuch fundamentally galat kar rahe ho.`,

    content: `**Why the "soft pad vs. hard edge" distinction genuinely changes how much force is needed.** The flat pad of a finger is soft tissue that compresses and gives way, requiring more force to achieve the same string-to-fret contact; the outer edge, closer to bone, transmits force more directly with less absorption loss — the same physical principle as why a knife\'s edge cuts more easily than its flat side pressed against something. This is a real, mechanical explanation, not just folk wisdom passed down between players.

**Why the thumb\'s counter-pressure matters more here than for any chord so far.** Module 3 established light thumb contact as the default; a barre chord is the specific case where slightly firmer (still not excessive) thumb counter-pressure genuinely helps, because the barre finger is fighting the combined resistance of up to 6 strings at once rather than 1-2 — proportionally more counter-support is appropriate here, a real exception worth knowing rather than a contradiction of Module 3\'s general rule.

**Connecting back to Module 11's injury-awareness content, directly and importantly.** Barre chords are a genuinely common source of hand strain for beginners who push through pain rather than build up gradually — if index-finger or hand pain from barre practice ever crosses from Module 11\'s "normal soreness" into "sharp, localized, or persistent" territory, that lesson\'s guidance applies fully here: stop, rest, reassess. Barre-chord ambition is not worth risking real injury over.`,
    contentHi: `**"Soft pad vs hard edge" distinction genuinely kitna force chahiye use kyun badalta hai.** Finger ka flat pad soft tissue hai jo compress hoti hai aur give way karti hai, same string-to-fret contact achieve karne ke liye zyada force chahiye; outer edge, bone ke zyada paas, force ko zyada directly transmit karta hai kam absorption loss ke saath — wahi physical principle jo ye batata hai ki ek knife ka edge uske flat side ko kisi cheez ke against press karne se zyada easily cut kyun karta hai. Ye ek real, mechanical explanation hai, sirf players ke beech pass down hui folk wisdom nahi.

**Thumb ki counter-pressure yahan kisi bhi doosre chord se zyada kyun matter karti hai.** Module 3 ne light thumb contact ko default establish kiya tha; ek barre chord wo specific case hai jahan thodi si firmer (abhi bhi excessive nahi) thumb counter-pressure genuinely help karti hai, kyunki barre finger ek saath 6 tak strings ki combined resistance se fight kar raha hai 1-2 ke bajaye — yahan proportionally zyada counter-support appropriate hai, ek real exception jaanne layak, Module 3 ke general rule ka contradiction nahi.

**Module 11 ke injury-awareness content se directly aur importantly wapas connect karna.** Barre chords un beginners ke liye hand strain ka ek genuinely common source hain jo gradually build up karne ke bajaye pain ke through push karte hain — agar barre practice se index-finger ya hand pain kabhi Module 11 ki "normal soreness" se "sharp, localized, ya persistent" territory mein cross kare, us lesson ki guidance yahan poori tarah apply hoti hai: ruko, rest karo, reassess karo. Barre-chord ambition real injury risk karne layak nahi hai.`,

    examples: [
      {
        title: 'F major, the classic first barre chord',
        titleHi: 'F major, classic pehla barre chord',
        code: `F
  E |---1---   finger 1 (barre, edge of finger)
  A |---3---   finger 3
  D |---3---   finger 4
  G |---2---   finger 2
  B |---1---   finger 1 (barre)
  E |---1---   finger 1 (barre)`,
        previewHeight: 330,
        preview: chordPreviewHtml(CHORDS.F, 'F major: the index finger barres all 6 strings using the harder edge, not the soft flat pad, while fingers 2-4 add the rest of the shape.'),
        explain:
          'This is the same F diagram Module 2 Lesson 3 used purely as a reading exercise, before you could play it — that lesson deliberately separated "reading the diagram" from "executing the technique," and this is where the execution half finally arrives.',
        explainHi:
          'Ye wahi F diagram hai jo Module 2 Lesson 3 ne purely ek reading exercise ki tarah use kiya tha, use bajaane se pehle — us lesson ne deliberately "diagram padhna" ko "technique execute karna" se separate kiya tha, aur yahan execution wala half aakhir aata hai.',
      },
    ],

    mistakes: [
      {
        wrong: 'Pressing with the flat, soft pad of the index finger and compensating for buzzing strings by squeezing harder and harder.',
        right: 'Use the harder outer edge of the finger, positioned just behind the fret, with light-to-moderate thumb counter-pressure.',
        why: 'Squeezing harder with poor finger positioning fights the symptom (buzz) without fixing the actual cause (wrong contact surface), leading to unnecessary strain for a result that still often doesn\'t fully work.',
        whyHi: 'Poor finger positioning ke saath harder squeeze karna symptom (buzz) se fight karta hai actual cause (galat contact surface) fix kiye bina, jo ek aise result ke liye unnecessary strain le jaata hai jo phir bhi often poori tarah kaam nahi karta.',
      },
    ],

    realWorld: [
      {
        en: 'Every guitarist who has ever played a barre chord went through this exact same struggle — there is no shortcut that skips the adjustment period, but the correct technique in this lesson genuinely shortens it compared to brute-forcing through with poor form.',
        hi: 'Har guitarist jisne kabhi ek barre chord bajaya hai isi exact struggle se guzra hai — koi shortcut nahi hai jo adjustment period ko skip kare, lekin is lesson ki correct technique genuinely use shorten karti hai poor form ke saath brute-force karne ke comparison mein.',
      },
    ],

    interviewQA: [
      {
        q: 'How long does it typically take to get a clean F chord?',
        qHi: 'Typically ek clean F chord paane mein kitna time lagta hai?',
        a: "It varies significantly by person, but weeks rather than days is a realistic expectation for most beginners, even with correct technique from the start. Module 17 Lesson 3's gradual practice progression is specifically designed around this realistic timeline.",
        aHi: 'Ye significantly person se person vary karta hai, lekin zyadatar beginners ke liye din nahi, hafte ek realistic expectation hai, shuru se correct technique ke saath bhi. Module 17 Lesson 3 ki gradual practice progression specifically is realistic timeline ke around design ki gayi hai.',
      },
    ],

    exercises: [
      {
        task: 'Form the F barre, pluck each of the 6 strings individually, and note which specific string(s) buzz or go silent. Adjust barre finger angle/position and repeat.',
        taskHi: 'F barre banao, saari 6 strings ko individually pluck karo, aur note karo kaunsi specific string(s) buzz karti hain ya silent ho jaati hain. Barre finger angle/position adjust karo aur repeat karo.',
        hint: 'If the same string consistently fails no matter what you adjust, check specifically for a low spot at a knuckle joint directly above that string — this is an extremely common, specific cause.',
        hintHi: 'Agar tum kuch bhi adjust karo same string consistently fail karti hai, specifically us string ke bilkul upar ek knuckle joint par ek low spot check karo — ye ek extremely common, specific cause hai.',
      },
    ],

    keyTakeaways: [
      'Use the outer edge of the index finger, not the soft flat pad, for the barre — this alone fixes most of the difficulty.',
      'Position the barre just behind the fret, roll the finger slightly to avoid a knuckle gap, and use moderate thumb counter-pressure.',
      'Taking weeks to develop a clean F chord is completely normal, not a sign of doing something fundamentally wrong.',
      'Respect Module 11\'s injury-awareness guidance here specifically — barre chords are a common source of pushed-through pain.',
    ],
    keyTakeawaysHi: [
      'Barre ke liye index finger ka outer edge use karo, soft flat pad nahi — akele ye zyadatar difficulty fix kar deta hai.',
      'Barre ko fret ke bilkul peeche position karo, knuckle gap avoid karne ke liye finger ko slightly roll karo, aur moderate thumb counter-pressure use karo.',
      'Ek clean F chord develop karne mein hafte lagna bilkul normal hai, kuch fundamentally galat karne ka sign nahi.',
      'Yahan specifically Module 11 ki injury-awareness guidance respect karo — barre chords pushed-through pain ka ek common source hain.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'movable-barre-shapes',
    title: 'Movable Barre Shapes Up the Neck',
    titleHi: 'Neck Mein Upar Movable Barre Shapes',
    description: 'Once one barre shape works, it — like the power chords of Module 16 — becomes an entire family of chords, movable to any fret.',
    descriptionHi: 'Ek baar ek barre shape kaam kare, ye — Module 16 ke power chords ki tarah — chords ka ek poora family ban jaata hai, kisi bhi fret tak movable.',
    difficulty: 'HARD',
    duration: 20,
    order: 2,

    analogy: {
      en: '**The same rubber stamp from Module 16, now with more ink coverage.** Module 16\'s power chord was a small, 2-3 note rubber stamp. A barre chord is a bigger, full 6-string rubber stamp — same core idea (one shape, movable to any fret, producing a different correctly-formed chord each time), just a more complete "stamp" that includes the major/minor quality power chords deliberately left out.',
      hi: '**Module 16 wala wahi rubber stamp, ab zyada ink coverage ke saath.** Module 16 ka power chord ek chhota, 2-3 note rubber stamp tha. Ek barre chord ek bada, full 6-string rubber stamp hai — same core idea (ek shape, kisi bhi fret tak movable, har baar ek alag correctly-formed chord produce karte hue), bas ek zyada complete "stamp" jismein wo major/minor quality shaamil hai jo power chords deliberately chhod dete the.',
    },

    simple: `**Two movable barre shapes, both built from open chords you already know:**

**E-shape barre** (built from the open E chord, Module 4): barre at fret 1 = F. Slide the SAME shape to fret 3 = G. Fret 5 = A.

**A-shape barre** (built from the open A chord shape, Module 6): barre at fret 2 gives you a B chord, played entirely with a different finger arrangement than the E-shape family.

**Why learning both shapes matters, not just one:** different target chords sit more conveniently under one shape than the other depending on where on the neck you need to play — having both "highways" (echoing Module 16 Lesson 2\'s two power-chord root strings) gives you real flexibility once a song calls for a specific chord in a specific position.`,
    simpleHi: `**Do movable barre shapes, dono open chords se bane hain jo tumhe already pata hain:**

**E-shape barre** (open E chord se bana, Module 4): fret 1 par barre = F. SAME shape ko fret 3 tak slide karo = G. Fret 5 = A.

**A-shape barre** (open A chord shape se bana, Module 6): fret 2 par barre tumhe ek B chord deta hai, ek bilkul alag finger arrangement ke saath bajaya hua E-shape family se.

**Dono shapes seekhna kyun matter karta hai, sirf ek nahi:** alag target chords ek shape ke neeche doosre se zyada conveniently baithte hain is par depend karte hue ki neck par kahan tumhe bajaana hai — dono "highways" hona (Module 16 Lesson 2 ke do power-chord root strings ko echo karte hue) tumhe real flexibility deta hai ek baar jab ek song ek specific position mein ek specific chord maangta hai.`,

    content: `**Why these specific two shapes (E-shape and A-shape), out of all possible open chords, became the standard movable barre shapes.** Both the open E and open A chords happen to use ALL or nearly all 6 strings in a way that a single added barre finger can fully replicate at any fret — many other open chord shapes (like open C or D, which deliberately mute certain strings per Module 5) don\'t translate as cleanly into a full 6-string movable barre. This is a structural property of those two specific shapes, not an arbitrary convention.

**Why the A-shape barre is generally considered harder than the E-shape, worth knowing honestly.** The A-shape requires 3 fingers (2, 3, 4) to also press in a cramped formation on top of the barre (echoing Module 5\'s A-chord crowding challenge, now combined with a barre), while the E-shape\'s remaining fingers have more natural spacing. Expect the A-shape family to take longer to feel comfortable than the E-shape family — this is a genuine, typical difficulty difference, not a personal shortcoming if you notice it.

**How this connects forward to Module 21\'s CAGED system.** These two barre shapes are exactly 2 of the 5 shapes ("E-shape" and "A-shape") that the CAGED system organizes into one complete framework covering the entire neck — what you\'re learning here is 2/5 of that eventual complete picture, not an isolated, unrelated trick.`,
    contentHi: `**Ye specific do shapes (E-shape aur A-shape), saare possible open chords mein se, standard movable barre shapes kyun ban gayin.** Open E aur open A chords dono saari ya lagbhag saari 6 strings is tarah use karte hain ki ek single added barre finger kisi bhi fret par use fully replicate kar sake — bahut saare doosre open chord shapes (jaise open C ya D, jo Module 5 ke hisaab se deliberately kuch strings mute karte hain) ek full 6-string movable barre mein utni cleanly translate nahi hote. Ye un do specific shapes ki ek structural property hai, ek arbitrary convention nahi.

**A-shape barre E-shape se generally harder kyun consider kiya jaata hai, honestly jaanne layak.** A-shape ko barre ke upar bhi ek cramped formation mein 3 fingers (2, 3, 4) press karne ki zaroorat hai (Module 5 ke A-chord crowding challenge ko echo karte hue, ab ek barre ke saath combined), jabki E-shape ki baaki fingers ke paas zyada natural spacing hai. Expect karo ki A-shape family ko E-shape family se comfortable feel karne mein zyada time lagega — ye ek genuine, typical difficulty difference hai, agar tum ise notice karo to koi personal shortcoming nahi.

**Ye aage Module 21 ke CAGED system se kaise connect hota hai.** Ye do barre shapes exactly 2 hain 5 shapes mein se ("E-shape" aur "A-shape") jinhe CAGED system ek complete framework mein organize karta hai jo poori neck cover karta hai — jo tum yahan seekh rahe ho wo us eventual complete picture ka 2/5 hai, ek isolated, unrelated trick nahi.`,

    examples: [
      {
        title: 'E-shape and A-shape barre families, side by side',
        titleHi: 'E-shape aur A-shape barre families, saath saath',
        previewHeight: 340,
        code: `E-shape barre: F (fret 1), G (fret 3), A (fret 5) — all the same finger shape.
A-shape barre: B (fret 2) — a genuinely different finger arrangement.`,
        preview: chordFamilyHtml([CHORDS.F, CHORDS.B], 'F (E-shape barre) and B (A-shape barre) — two different families, each internally movable like Module 16\'s power chords.'),
        explain:
          'Notice these two shapes look genuinely different from each other, unlike the power-chord shapes from Module 16 which all looked similar — this is exactly why learning "one movable barre shape" isn\'t the same as learning ALL movable barre shapes; each family needs its own dedicated practice.',
        explainHi:
          'Notice karo ye do shapes ek doosre se genuinely alag dikhti hain, Module 16 ke power-chord shapes ke ulta jo sab similar dikhte the — yahi exactly wo reason hai ki "ek movable barre shape" seekhna SAARE movable barre shapes seekhne jaisa nahi hai; har family ko apni dedicated practice chahiye.',
      },
    ],

    mistakes: [
      {
        wrong: 'Assuming that once the E-shape barre (F, G, A...) feels comfortable, the A-shape barre (B...) will automatically feel just as easy.',
        right: 'Treat the A-shape barre as its own separate skill requiring its own dedicated practice, expecting it to be somewhat harder.',
        why: 'The two shapes have genuinely different finger arrangements and difficulty profiles — comfort with one doesn\'t automatically transfer to the other, the same way comfort with G (Module 4) didn\'t automatically make A (Module 5) easy.',
        whyHi: 'Do shapes ke genuinely alag finger arrangements aur difficulty profiles hain — ek ke saath comfort automatically doosre tak transfer nahi hoti, waise hi jaise G (Module 4) ke saath comfort automatically A (Module 5) ko easy nahi banati thi.',
      },
    ],

    realWorld: [
      {
        en: 'A guitarist fluent in both E-shape and A-shape movable barres can play a major or minor chord rooted at literally any note on the neck — this is one of the single biggest practical vocabulary expansions in learning the instrument.',
        hi: 'Ek guitarist jo E-shape aur A-shape dono movable barres mein fluent hai neck par literally kisi bhi note par rooted ek major ya minor chord baja sakta hai — ye instrument seekhne mein sabse badi practical vocabulary expansions mein se ek hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Do I need to memorize which fret produces which chord name for both shapes right now?',
        qHi: 'Kya mujhe abhi dono shapes ke liye yaad karna hai ki kaunsi fret kaunsa chord name produce karti hai?',
        a: "Not urgently — Module 18's fretboard map gives you the tool to calculate this on demand rather than needing rote memorization now. Focus this module on the physical technique; the note-name mapping becomes easy once Module 18 is complete.",
        aHi: 'Urgently nahi — Module 18 ka fretboard map tumhe ise on-demand calculate karne ka tool deta hai, abhi rote memorization ki zaroorat ke bajaye. Is module ko physical technique par focus karo; note-name mapping Module 18 complete hone ke baad easy ban jaata hai.',
      },
    ],

    exercises: [
      {
        task: 'Play the E-shape barre at frets 1, 3, and 5 in sequence, then the A-shape barre at fret 2, noting honestly which felt more difficult.',
        taskHi: 'E-shape barre ko frets 1, 3, aur 5 par sequence mein bajao, phir A-shape barre ko fret 2 par, honestly note karte hue ki kaunsa zyada difficult feel hua.',
        hint: 'If A-shape feels notably harder, that matches the typical experience described in this lesson\'s content — it\'s worth dedicating separate, extra practice time to it rather than expecting E-shape practice alone to transfer.',
        hintHi: 'Agar A-shape notably harder feel kare, ye is lesson ke content mein describe ki gayi typical experience se match karta hai — ise separate, extra practice time dedicate karna worth hai, sirf E-shape practice se transfer hone ki expectation rakhne ke bajaye.',
      },
    ],

    keyTakeaways: [
      'E-shape and A-shape open chords translate into two movable barre-chord families — the same "one shape, any root" idea as Module 16\'s power chords, now with full 6-string, major/minor-quality chords.',
      'The A-shape barre is generally harder than the E-shape barre and deserves its own dedicated practice, not an assumption of automatic transfer.',
      'These two shapes are 2 of the 5 shapes Module 21\'s CAGED system will organize into a complete neck-covering framework.',
    ],
    keyTakeawaysHi: [
      'E-shape aur A-shape open chords do movable barre-chord families mein translate hote hain — Module 16 ke power chords wala hi "ek shape, koi bhi root" idea, ab full 6-string, major/minor-quality chords ke saath.',
      'A-shape barre generally E-shape barre se harder hai aur apni khud ki dedicated practice deserve karta hai, automatic transfer ki assumption nahi.',
      'Ye do shapes 5 shapes mein se 2 hain jinhe Module 21 ka CAGED system ek complete neck-covering framework mein organize karega.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'barre-chord-practice-progression',
    title: 'A Realistic Practice Progression for Barre Chords',
    titleHi: 'Barre Chords Ke Liye Ek Realistic Practice Progression',
    description: 'A concrete, staged plan for building real barre-chord strength and cleanliness without forcing it or risking injury. Closes Part VI.',
    descriptionHi: 'Real barre-chord strength aur cleanliness build karne ke liye ek concrete, staged plan, use force kiye ya injury risk kiye bina. Part VI ko close karta hai.',
    difficulty: 'MEDIUM',
    duration: 15,
    order: 3,

    analogy: {
      en: '**Building up to a heavier gym lift with progressively loaded sets, not attempting the max weight on day one.** No sensible strength-training program has a beginner attempt their eventual maximum weight on the first session — it builds up through progressively harder, achievable steps. Barre chords deserve exactly this same staged approach, not a single, all-or-nothing attempt.',
      hi: '**Ek heavier gym lift tak progressively loaded sets ke saath build up karna, day one par max weight attempt karna nahi.** Koi bhi sensible strength-training program ek beginner se pehle session mein unka eventual maximum weight attempt nahi karwaata — ye progressively harder, achievable steps ke through build up hota hai. Barre chords bilkul yahi same staged approach deserve karte hain, ek single, all-or-nothing attempt nahi.',
    },

    simple: `**A concrete 4-stage progression, each stage practiced until comfortable before moving on:**

1. **Partial barre, no other fingers:** just the barre finger across all 6 strings, checking each string rings (or at least doesn't badly buzz) individually. No full chord shape yet.
2. **Full barre, held briefly:** the complete F (or another target) shape, held for just 2-3 seconds, released, rested, repeated. Building tolerance in short bursts.
3. **Full barre, held through a strum:** the complete shape, strummed once, released immediately — not yet sustained through a whole chord progression.
4. **Full barre in a real chord change:** finally, swap into and out of the barre shape as part of an actual progression (reusing Module 6\'s anchor-finger and loop-drill techniques).

**Rest matters as much as practice here, specifically because of Module 11.** Take real breaks between stages, especially in the early days — barre-chord muscles genuinely need recovery time, not just repetition.`,
    simpleHi: `**Ek concrete 4-stage progression, har stage comfortable hone tak practice ki gayi aage badhne se pehle:**

1. **Partial barre, koi doosri fingers nahi:** bas barre finger saari 6 strings ke across, check karte hue ki har string ring karti hai (ya kam se kam badly buzz nahi karti) individually. Abhi poora chord shape nahi.
2. **Full barre, briefly held:** complete F (ya doosra target) shape, sirf 2-3 seconds ke liye held, released, rested, repeated. Short bursts mein tolerance build karna.
3. **Full barre, ek strum ke through held:** complete shape, ek baar strummed, turant released — abhi ek poori chord progression ke through sustained nahi.
4. **Real chord change mein full barre:** finally, barre shape mein swap in aur out karo ek actual progression ke part ki tarah (Module 6 ki anchor-finger aur loop-drill techniques reuse karte hue).

**Yahan rest utni hi matter karta hai jitna practice, specifically Module 11 ki wajah se.** Stages ke beech real breaks lo, especially early days mein — barre-chord muscles ko genuinely recovery time chahiye, sirf repetition nahi.`,

    content: `**Why staging the difficulty this specifically (rather than "just practice F chord daily") produces faster, safer progress.** Attempting the full 4-stage combination (correct finger technique + full pressure + sustained hold + a chord change) all at once, every single practice attempt, means every failure could stem from any of 4 different factors — impossible to diagnose precisely (Module 11\'s diagnostic lesson). Isolating each stage means a failure at, say, stage 2 clearly identifies the problem as sustained pressure/tolerance specifically, not technique (already solid from stage 1) or timing (not yet attempted).

**Why "held briefly, then rested" (stage 2) is not wasted time compared to just holding it as long as possible.** Short, repeated bursts with real rest between them build both strength and clean technique more effectively than one long, strained hold — this is a direct application of Module 10\'s spaced-repetition principle to a specific physical skill, not a new idea introduced from nowhere.

**A closing note for Part VI as a whole.** Power chords (Module 16) and barre chords (this module) both extended the same core idea — a single movable shape covering an entire family of chords — at two different levels of complexity and physical demand. Having built both, you now have genuinely comprehensive coverage of the guitar neck\'s chord vocabulary, setting up Module 18 onward\'s theory content on a foundation of real, hard-won physical technique rather than abstract diagrams alone.`,
    contentHi: `**Difficulty ko is specifically (sirf "roz F chord practice karo" ke bajaye) staging karna faster, safer progress kyun produce karta hai.** Poori 4-stage combination (correct finger technique + full pressure + sustained hold + ek chord change) ek saath attempt karna, har single practice attempt mein, matlab hai har failure 4 alag factors mein se kisi se bhi stem ho sakti hai — precisely diagnose karna impossible (Module 11 ka diagnostic lesson). Har stage ko isolate karna matlab hai ek failure, say, stage 2 par clearly problem ko sustained pressure/tolerance specifically identify karti hai, technique nahi (stage 1 se already solid) ya timing nahi (abhi attempt nahi hua).

**"Briefly held, phir rested" (stage 2) us se compare mein wasted time kyun nahi hai jitna der ho sake hold karna.** Unke beech real rest ke saath short, repeated bursts strength aur clean technique dono ko ek lambe, strained hold se zyada effectively build karte hain — ye Module 10 ke spaced-repetition principle ka ek direct application hai ek specific physical skill par, kahin se bhi introduce hui ek nayi idea nahi.

**Part VI ke liye poori tarah ek closing note.** Power chords (Module 16) aur barre chords (ye module) dono ne wahi core idea extend ki — ek single movable shape jo chords ki ek poori family cover karti hai — do alag levels of complexity aur physical demand par. Dono build karne ke baad, ab tumhare paas guitar neck ki chord vocabulary ka genuinely comprehensive coverage hai, Module 18 se aage ke theory content ko ek real, hard-won physical technique ki foundation par set up karte hue, sirf abstract diagrams par nahi.`,

    examples: [
      {
        title: 'The 4-stage progression, timed',
        titleHi: '4-stage progression, timed',
        code: `Stage 1: Barre only, check each string. 5 min, several sessions.
Stage 2: Full shape, hold 2-3 sec, release, rest. 5 min, several sessions.
Stage 3: Full shape, one strum, release. 5 min, once Stage 2 is solid.
Stage 4: Full shape inside a real chord change (Module 6's loop drill).

Move to the next stage only when the current one feels reliably clean.`,
        explain:
          'The explicit "several sessions" language for early stages, rather than a single session\'s worth of reps, sets an honest expectation matching Module 3\'s callus timeline and Module 17 Lesson 1\'s "weeks, not days" guidance — this is a multi-week plan, not a single afternoon\'s checklist.',
        explainHi:
          'Early stages ke liye explicit "several sessions" language, ek single session ke reps ke bajaye, ek honest expectation set karta hai jo Module 3 ke callus timeline aur Module 17 Lesson 1 ki "hafte, din nahi" guidance se match karti hai — ye ek multi-week plan hai, ek single afternoon ki checklist nahi.',
      },
    ],

    mistakes: [
      {
        wrong: 'Attempting to jump straight to Stage 4 (a full chord change) before Stages 1-3 feel individually solid.',
        right: 'Progress through each stage in order, only advancing once the current stage is reliably clean, even if that takes several sessions per stage.',
        why: 'Skipping ahead stacks multiple unsolved difficulties on top of each other, making it impossible to tell which specific factor is causing a given failure — exactly the diagnostic confusion Module 11 warned about.',
        whyHi: 'Aage jump karna multiple unsolved difficulties ko ek doosre ke upar stack karta hai, ye batana impossible banate hue ki kaunsa specific factor ek given failure cause kar raha hai — exactly wahi diagnostic confusion jiske against Module 11 ne warn kiya tha.',
      },
    ],

    realWorld: [
      {
        en: 'This staged approach mirrors exactly how physical therapists and strength coaches rebuild any complex movement pattern — isolate the component parts, build each to reliability, then integrate; it works for barre chords for the same underlying reasons it works for physical rehabilitation generally.',
        hi: 'Ye staged approach exactly waise hi mirror karta hai jaise physical therapists aur strength coaches koi bhi complex movement pattern rebuild karte hain — component parts ko isolate karo, har ek ko reliability tak build karo, phir integrate karo; ye barre chords ke liye usi underlying reasons se kaam karta hai jis se ye generally physical rehabilitation ke liye karta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Is it okay to use Module 14\'s capo shortcut instead of pushing through this barre-chord progression?',
        qHi: 'Kya Module 14 ka capo shortcut use karna theek hai is barre-chord progression ke through push karne ke bajaye?',
        a: "Completely fine as a practical choice for specific songs, and Module 14 explicitly validated it as legitimate. But working through this progression eventually is still worth it for the instant movability and no-hardware-needed flexibility real barre technique provides — the two approaches complement rather than replace each other.",
        aHi: 'Specific songs ke liye ek practical choice ki tarah bilkul theek hai, aur Module 14 ne ise explicitly legitimate validate kiya tha. Lekin is progression ke through eventually kaam karna abhi bhi worth hai us instant movability aur no-hardware-needed flexibility ke liye jo real barre technique provide karti hai — dono approaches ek doosre ko replace karne ke bajaye complement karte hain.',
      },
    ],

    exercises: [
      {
        task: 'Identify honestly which of the 4 stages you\'re currently at with the F barre chord, and spend today\'s session entirely on that specific stage, not skipping ahead.',
        taskHi: 'Honestly identify karo ki F barre chord ke saath tum currently kaunse 4 stages mein se kis par ho, aur aaj ka session poori tarah us specific stage par spend karo, aage skip kiye bina.',
        hint: 'If you\'re unsure which stage you\'re at, start from Stage 1 and quickly confirm it\'s solid before moving on — a few minutes of "unnecessary" review is cheap insurance against building on a shaky foundation.',
        hintHi: 'Agar unsure ho ki kis stage par ho, Stage 1 se shuru karo aur quickly confirm karo ki ye solid hai aage badhne se pehle — kuch minutes ki "unnecessary" review ek shaky foundation par build karne ke against cheap insurance hai.',
      },
    ],

    keyTakeaways: [
      'A 4-stage progression (barre alone, held briefly, held through a strum, inside a chord change) isolates barre-chord difficulty into diagnosable, manageable pieces.',
      'Short, rested bursts build strength and clean technique better than one long, strained hold — Module 10\'s spaced repetition applied physically.',
      'Weeks-long timelines for real comfort are normal — this is a multi-week plan, not a single session\'s checklist.',
    ],
    keyTakeawaysHi: [
      'Ek 4-stage progression (akela barre, briefly held, ek strum ke through held, ek chord change ke andar) barre-chord difficulty ko diagnosable, manageable pieces mein isolate karta hai.',
      'Unke beech rested short bursts strength aur clean technique ko ek lambe, strained hold se better build karte hain — Module 10 ki spaced repetition physically apply hoti hai.',
      'Real comfort ke liye weeks-long timelines normal hain — ye ek multi-week plan hai, ek single session ki checklist nahi.',
    ],
  },
];
