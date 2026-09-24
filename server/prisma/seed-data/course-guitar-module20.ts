/**
 * Guitar Course — Module 20: The Circle of Fifths, lessons 1-3.
 * The single piece of theory most often gatekept behind "premium"
 * courses — Jay asked for it by name.
 */

import type { CourseLesson } from './course-js-module1';
import { circleOfFifthsSvg, diagramPreviewHtml } from './guitar-diagrams';

export const GUITAR_MODULE_20: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'what-the-circle-shows',
    title: 'What the Circle of Fifths Actually Shows',
    titleHi: 'Circle of Fifths Actually Kya Dikhaata Hai',
    description: 'One diagram, three layers of information, built directly from Module 19\'s perfect-5th interval — demystified, not memorized.',
    descriptionHi: 'Ek diagram, information ki teen layers, directly Module 19 ke perfect-5th interval se banaya gaya — demystified, memorized nahi.',
    difficulty: 'HARD',
    duration: 20,
    order: 1,

    analogy: {
      en: '**A clock face where each hour mark is a key, not a time.** A clock arranges 12 positions in a circle by a fixed, consistent step (5 minutes). The Circle of Fifths arranges 12 keys in a circle by an equally fixed, consistent step — a perfect 5th (Module 19\'s 7-semitone interval) — clockwise from any key to the next. It looks intimidating as a finished poster on a wall, but it\'s built from one interval you already know, repeated 12 times.',
      hi: '**Ek clock face jahan har hour mark ek key hai, time nahi.** Ek clock 12 positions ko circle mein ek fixed, consistent step (5 minutes) se arrange karta hai. Circle of Fifths 12 keys ko circle mein ek equally fixed, consistent step se arrange karta hai — ek perfect 5th (Module 19 ka 7-semitone interval) — kisi bhi key se agli tak clockwise. Ye ek finished poster ki tarah wall par intimidating lagta hai, lekin ye ek interval se bana hai jo tumhe already pata hai, 12 baar repeated.',
    },

    simple: `**The circle, built step by step, is nothing more than:** start at C. Go up a perfect 5th (7 semitones, Module 19) to get G. Go up another perfect 5th from G to get D. Repeat this 12 times and you land back on C — that\'s the entire outer ring of the circle, in order: C, G, D, A, E, B, F#, Db, Ab, Eb, Bb, F, back to C.

**Three layers of information on one diagram:**
- **Outer ring = major keys**, arranged by ascending perfect 5ths (just derived above).
- **Middle ring = each major key\'s relative minor** — the minor key that shares the exact same set of notes (Module 19\'s territory: a minor 3rd below the major root).
- **Inner ring = how many sharps or flats that key\'s scale uses** — 0 at C, gaining one sharp per clockwise step, one flat per counter-clockwise step.

**Why this matters immediately, not just as trivia:** neighboring keys on the circle are the MOST closely related keys musically — they share all but one note. This is the real, structural reason certain key changes sound smooth and natural while others sound jarring, a fact Lesson 3 turns into a practical songwriting/transposing shortcut.`,
    simpleHi: `**Circle, step by step banaya gaya, kuch aur nahi hai sirf:** C se shuru karo. Ek perfect 5th (7 semitones, Module 19) upar jaao G paane ke liye. G se ek aur perfect 5th upar jaao D paane ke liye. Ise 12 baar repeat karo aur tum wapas C par land karoge — ye poori outer ring hai circle ki, order mein: C, G, D, A, E, B, F#, Db, Ab, Eb, Bb, F, wapas C.

**Ek diagram par information ki teen layers:**
- **Outer ring = major keys**, ascending perfect 5ths se arranged (upar hi derive kiya).
- **Middle ring = har major key ka relative minor** — wo minor key jo exact same set of notes share karti hai (Module 19 ka territory: major root se ek minor 3rd neeche).
- **Inner ring = wo key kitne sharps ya flats use karti hai uske scale mein** — C par 0, har clockwise step par ek sharp gain hota hai, har counter-clockwise step par ek flat.

**Ye immediately kyun matter karta hai, sirf trivia nahi:** circle par neighboring keys musically MOST closely related keys hain — wo apne sab notes share karte hain sivaay ek ke. Ye asli, structural reason hai ki kuch key changes smooth aur natural sound karte hain jabki doosre jarring sound karte hain, ek fact jise Lesson 3 ek practical songwriting/transposing shortcut mein badalta hai.`,

    content: `**Why the circle "closes" back to C after exactly 12 steps, and why that\'s not a coincidence.** This is the same 12-note cycle from Module 18 Lesson 1, viewed from a different angle. Stacking perfect 5ths (7 semitones each) 12 times covers 84 semitones total, which is exactly 7 full octaves (84 ÷ 12 = 7) — the math guarantees the circle closes perfectly, landing back on C rather than drifting to some unrelated note. This is a genuine, checkable mathematical fact about the 12-note system, not an arbitrary convention someone chose.

**Why sharps accumulate clockwise and flats accumulate counter-clockwise — connecting the inner ring to real scale construction.** Each new key one step clockwise on the circle adds exactly one new sharp to its scale (a detail full scale-construction theory explains, beyond this course\'s scope) — which is exactly why key signatures with many sharps (E, B, F#) sit on one side of the circle, and key signatures with many flats (Ab, Db, Gb) sit on the other, with C\'s zero-accidental scale sitting at the top as the natural starting point.

**A genuinely honest note on how to actually use this, versus how it often gets presented.** The Circle of Fifths is frequently taught as something to memorize by rote, as a static poster. This module deliberately teaches it as something you DERIVE (from Module 19\'s perfect 5th, repeated) and then USE (Lesson 2\'s key relationships, Lesson 3\'s transposing shortcut) — the same "understand the mechanism, don\'t just memorize the output" principle this entire course has followed since Module 2.`,
    contentHi: `**Circle exactly 12 steps ke baad wapas C par kyun "close" hota hai, aur ye coincidence kyun nahi hai.** Ye wahi 12-note cycle hai Module 18 Lesson 1 se, ek alag angle se dekha gaya. Perfect 5ths (har ek 7 semitones) ko 12 baar stack karna total 84 semitones cover karta hai, jo exactly 7 poore octaves hain (84 ÷ 12 = 7) — math guarantee karta hai ki circle perfectly close hoga, wapas C par land karte hue, kisi unrelated note ki taraf drift karne ke bajaye. Ye 12-note system ke baare mein ek genuine, checkable mathematical fact hai, kisi ne choose kiya hua arbitrary convention nahi.

**Sharps clockwise kyun accumulate hote hain aur flats counter-clockwise — inner ring ko real scale construction se connect karna.** Circle par har naya key ek step clockwise apne scale mein exactly ek naya sharp add karta hai (ek detail jo full scale-construction theory explain karti hai, is course ke scope se pare) — isliye hi bahut saare sharps wale key signatures (E, B, F#) circle ke ek side par baithte hain, aur bahut saare flats wale (Ab, Db, Gb) doosre side par, C ka zero-accidental scale top par natural starting point ki tarah baithta hai.

**Ise actually kaise use karein iske baare mein ek genuinely honest note, is se alag jaisa ye often present hota hai.** Circle of Fifths often rote se memorize karne wali cheez ki tarah, ek static poster ki tarah sikhaya jaata hai. Ye module deliberately ise DERIVE karne wali cheez ki tarah sikhata hai (Module 19 ke perfect 5th se, repeated) aur phir USE (Lesson 2 ki key relationships, Lesson 3 ka transposing shortcut) — wahi "mechanism samjho, sirf output memorize mat karo" principle jo ye poora course Module 2 se follow kar raha hai.`,

    examples: [
      {
        title: 'Deriving the first four keys of the circle by stacking perfect 5ths',
        titleHi: 'Perfect 5ths stack karke circle ki pehli chaar keys derive karna',
        previewHeight: 420,
        code: `C -> (+7 semitones) -> G -> (+7 semitones) -> D -> (+7 semitones) -> A ...

Each step is exactly Module 19's perfect 5th interval, applied to the
previous key's root note. Twelve steps later, you land back on C.`,
        preview: diagramPreviewHtml(circleOfFifthsSvg([0, 1, 2, 3]), 'C, G, D, and A highlighted — the first four keys, each one a perfect 5th above the last, reading clockwise from the top.'),
        explain:
          'Highlighting just the first four keys in sequence makes the "each step is +7 semitones" derivation visible directly on the diagram, rather than asking you to trust that the circle was built this way.',
        explainHi:
          'Sirf pehli chaar keys ko sequence mein highlight karna "har step +7 semitones hai" derivation ko directly diagram par visible banata hai, tumse trust karne ke liye kehne ke bajaye ki circle is tarah bana tha.',
      },
    ],

    mistakes: [
      {
        wrong: 'Treating the Circle of Fifths as an arbitrary chart to memorize by rote, disconnected from anything learned earlier in the course.',
        right: 'Recognize it as Module 19\'s perfect-5th interval, applied 12 times in a row — a derivation, not an arbitrary fact.',
        why: 'Information that connects to something you can re-derive yourself survives far longer in memory than a disconnected chart — this is the exact reason this lesson builds the circle step-by-step instead of presenting it finished.',
        whyHi: 'Wo information jo kisi aisi cheez se connect hoti hai jo tum khud re-derive kar sakte ho, ek disconnected chart se kahin zyada der tak memory mein rehti hai — yahi exact reason hai ki ye lesson circle ko step-by-step banaata hai, use finished present karne ke bajaye.',
      },
    ],

    realWorld: [
      {
        en: 'Professional session musicians and songwriters use the Circle of Fifths constantly as a fast reference for key signatures and chord relationships — it\'s a working tool on studio walls, not a museum piece.',
        hi: 'Professional session musicians aur songwriters Circle of Fifths ko key signatures aur chord relationships ke liye ek fast reference ki tarah constantly use karte hain — ye studio walls par ek working tool hai, ek museum piece nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does F# major share a position with Gb major on the circle instead of getting its own spot?',
        qHi: 'F# major circle par Gb major ke saath ek position kyun share karta hai apna khud ka spot paane ke bajaye?',
        a: 'F# and Gb are "enharmonic" — the exact same pitch with two different names (Module 18 briefly touched this idea with sharps/flats). Which name gets used depends on musical context (key signature conventions), but the actual sound and fretboard position are identical.',
        aHi: 'F# aur Gb "enharmonic" hain — exact same pitch do alag names ke saath (Module 18 ne is idea ko briefly touch kiya tha sharps/flats ke saath). Kaunsa naam use hota hai ye musical context (key signature conventions) par depend karta hai, lekin actual sound aur fretboard position identical hain.',
      },
    ],

    exercises: [
      {
        task: 'Starting from C, manually derive the next three keys after A (i.e., continue the perfect-5th chain to find keys 5, 6, and 7) using Module 19\'s semitone-counting method, then check your answer against the circle diagram.',
        taskHi: 'C se shuru karke, A ke baad ki agli teen keys manually derive karo (matlab keys 5, 6, aur 7 dhoondhne ke liye perfect-5th chain continue karo) Module 19 ke semitone-counting method use karke, phir apna answer circle diagram ke against check karo.',
        hint: 'A + 7 semitones = E. Continue the same +7 step from there, twice more.',
        hintHi: 'A + 7 semitones = E. Wahin se same +7 step continue karo, do baar aur.',
      },
    ],

    keyTakeaways: [
      'The Circle of Fifths is built by stacking Module 19\'s perfect 5th interval 12 times in a row, starting from C — a derivation, not an arbitrary chart.',
      'It encodes three layers at once: major keys (outer), relative minors (middle), and sharp/flat counts (inner).',
      'Twelve stacked perfect 5ths equal exactly 7 octaves, which is why the circle mathematically closes back to C.',
    ],
    keyTakeawaysHi: [
      'Circle of Fifths Module 19 ke perfect 5th interval ko 12 baar ek row mein stack karke bana hai, C se shuru karte hue — ek derivation, ek arbitrary chart nahi.',
      'Ye ek saath teen layers encode karta hai: major keys (outer), relative minors (middle), aur sharp/flat counts (inner).',
      'Barah stacked perfect 5ths exactly 7 octaves ke barabar hain, isliye circle mathematically wapas C par close hota hai.',
    ],
    guitarPractice: { earTraining: [{"string":0,"fret":3},{"string":0,"fret":8},{"string":0,"fret":10},{"string":0,"fret":0},{"string":0,"fret":5}] },
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'key-relationships-and-relative-minor',
    title: 'Key Relationships: Neighbors, Relative Minors, and Why Some Chords Just Fit',
    titleHi: 'Key Relationships: Neighbors, Relative Minors, Aur Kuch Chords Bas Fit Kyun Hote Hain',
    description: 'Why the chords in a song mostly come from one small, predictable neighborhood on the circle.',
    descriptionHi: 'Ek song ke chords mostly circle par ek chhote, predictable neighborhood se kyun aate hain.',
    difficulty: 'HARD',
    duration: 20,
    order: 2,

    analogy: {
      en: '**A small town where most of daily life happens within walking distance, with occasional trips further out.** Most songs live in a small neighborhood of the circle — a key and its immediate neighbors — the same way most of someone\'s week happens near home, with the occasional longer trip (a key change) standing out precisely because it\'s a departure from the usual neighborhood.',
      hi: '**Ek chhota town jahan zyadatar daily life walking distance ke andar hoti hai, occasional trips further out ke saath.** Zyadatar songs circle ke ek chhote neighborhood mein rehte hain — ek key aur uske immediate neighbors — waisi hi jaise kisi ke week ka zyadatar hissa ghar ke paas hota hai, occasional longer trip (ek key change) precisely isliye stand out karta hai kyunki ye usual neighborhood se ek departure hai.',
    },

    simple: `**The core relationship: adjacent keys on the circle share all but one note.** C major and G major (immediate neighbors) share 6 of their 7 scale notes — only one note differs. This is WHY chords from neighboring keys sound natural together, and it\'s the real mechanism behind something you\'ve been doing by ear since Module 6: moving between G, C, D, Em, and Am (all within one small cluster on the circle) feels natural precisely because they\'re all close neighbors.

**The relative minor relationship, formalized (Module 19 preview, completed here):** every major key\'s relative minor sits directly inside it on the middle ring, and shares the EXACT same set of notes — C major and A minor use identical notes, just built starting from a different root. This is why a song can drift between feeling "major" and "minor" using the very same chords, without ever technically changing key.

**A practical, immediate payoff — picking a "safe" chord.** Given any chord, its most likely-to-sound-good neighbors are the two keys directly beside it on the circle, plus its own relative minor/major pair. This isn\'t a rule that\'s always true, but it\'s a genuinely reliable starting guess — a real shortcut, not guesswork.`,
    simpleHi: `**Core relationship: circle par adjacent keys apne sab notes share karti hain sivaay ek ke.** C major aur G major (immediate neighbors) apne 7 scale notes mein se 6 share karte hain — sirf ek note differ karta hai. Ye WHY hai ki neighboring keys ke chords saath mein natural sound karte hain, aur ye asli mechanism hai us cheez ke peeche jo tum Module 6 se kaan se karte aaye ho: G, C, D, Em, aur Am ke beech move karna (sab circle par ek chhote cluster ke andar) natural feel karta hai precisely kyunki wo sab close neighbors hain.

**Relative minor relationship, formalized (Module 19 preview, yahan complete hui):** har major key ka relative minor directly uske andar middle ring par baithta hai, aur EXACT same set of notes share karta hai — C major aur A minor identical notes use karte hain, bas ek alag root se shuru hote hue. Isliye ek song "major" aur "minor" feel ke beech drift kar sakta hai wahi chords use karte hue, kabhi bhi technically key change kiye bina.

**Ek practical, immediate payoff — ek "safe" chord pick karna.** Kisi bhi chord ke liye, uske sabse likely-achha-sound-karne-wale neighbors circle par uske directly saath ki do keys hain, plus uska khud ka relative minor/major pair. Ye ek rule nahi hai jo hamesha true ho, lekin ye ek genuinely reliable starting guess hai — ek real shortcut, guesswork nahi.`,

    content: `**Why "share all but one note" is the real, structural reason behind Module 5-6\'s chord progressions feeling natural.** Look back at the G-C-D-Em-Am cluster taught across Modules 5-6: on the circle, G, C, and D are three consecutive neighbors, and Em/Am are their relative minors. This isn\'t a coincidence in how the course was ordered — those chords were taught together specifically because they\'re circle-neighbors, and this lesson is the first time that underlying reason has been made explicit rather than left as "these just sound good together."

**Why the relative-minor relationship feels different from "just another chord that fits."** Sharing 100% of the same notes (not "all but one," but literally identical) means a relative-minor pair isn\'t just compatible — it\'s two different ways of hearing the SAME underlying note content, with the emotional character determined entirely by which note feels like "home" (the root). This is a genuinely deeper relationship than ordinary neighboring keys, worth distinguishing clearly.

**Connecting forward, honestly, to what this doesn\'t yet cover.** This lesson explains why neighboring/relative keys sound compatible, but doesn\'t yet give you a formal system for figuring out EVERY chord that belongs to a given key (that\'s a deeper topic — scale harmonization — beyond this course\'s scope). What it does give you, concretely, is Lesson 3\'s next step: using this same neighbor relationship as a fast, reliable transposing shortcut.`,
    contentHi: `**"Sab notes share karte hain sivaay ek ke" Module 5-6 ke chord progressions ke natural feel karne ke peeche ka real, structural reason kyun hai.** Modules 5-6 mein sikhaaye gaye G-C-D-Em-Am cluster ko wapas dekho: circle par, G, C, aur D teen consecutive neighbors hain, aur Em/Am unke relative minors hain. Ye course kaise order kiya gaya iska coincidence nahi hai — wo chords specifically isliye saath sikhaaye gaye kyunki wo circle-neighbors hain, aur ye lesson pehli baar hai jab wo underlying reason explicit banaya gaya hai, "ye bas saath achha sound karte hain" ki tarah chhoda nahi gaya.

**Relative-minor relationship "bas ek aur chord jo fit hota hai" se alag kyun feel karta hai.** 100% same notes share karna (matlab "sab sivaay ek ke" nahi, balki literally identical) ka matlab hai ek relative-minor pair sirf compatible nahi hai — ye SAME underlying note content ko sunne ke do alag tareeke hain, emotional character poori tarah is baat se determine hota hai ki kaunsa note "home" (root) jaisa feel karta hai. Ye ordinary neighboring keys se ek genuinely deeper relationship hai, clearly distinguish karne layak.

**Aage, honestly, ye abhi kya cover nahi karta us se connect karna.** Ye lesson explain karta hai ki neighboring/relative keys compatible kyun sound karte hain, lekin abhi tak tumhe ek formal system nahi deta HAR chord pata karne ke liye jo ek diye gaye key se belong karta hai (ye ek deeper topic hai — scale harmonization — is course ke scope se pare). Ye jo concretely deta hai, wo hai Lesson 3 ka next step: isi neighbor relationship ko ek fast, reliable transposing shortcut ki tarah use karna.`,

    examples: [
      {
        title: 'C major\'s immediate neighborhood on the circle',
        titleHi: 'Circle par C major ka immediate neighborhood',
        previewHeight: 420,
        code: `C's clockwise neighbor: G (shares 6 of 7 notes with C).
C's counter-clockwise neighbor: F (shares 6 of 7 notes with C).
C's relative minor: Am (shares ALL 7 notes with C, different root).

This is exactly the G-C-F-Am cluster that shows up constantly in
Modules 5-8's chord progressions.`,
        preview: diagramPreviewHtml(
          circleOfFifthsSvg([0, 1, 11]),
          'C highlighted with both its neighbors — G (clockwise) and F (counter-clockwise) — the three keys most likely to combine naturally with each other.',
        ),
        explain:
          'Seeing C flanked by exactly its two circle-neighbors makes "which chords are C\'s natural neighborhood" a visual, geometric fact rather than something to take on faith from a progression that "just sounds right."',
        explainHi:
          'C ko exactly uske do circle-neighbors se flanked dekhna "kaunse chords C ka natural neighborhood hain" ko ek visual, geometric fact banata hai, kisi progression se faith par lene wali cheez ke bajaye jo "bas sahi sound karta hai."',
      },
    ],

    mistakes: [
      {
        wrong: 'Assuming any two chords that "sound fine together" must be circle-neighbors, treating proximity on the circle as the only source of compatibility.',
        right: 'Recognize the circle explains ONE major source of chord compatibility (shared notes between neighboring keys), not the complete rulebook for every possible chord combination in music.',
        why: 'Overclaiming what a model explains is as much a misunderstanding as underclaiming it — the circle is a genuinely powerful tool for one specific kind of relationship, not a universal explanation for all of harmony.',
        whyHi: 'Ek model jo explain karta hai use overclaim karna utna hi bada misunderstanding hai jitna use underclaim karna — circle ek specific kism ki relationship ke liye ek genuinely powerful tool hai, music ki poori harmony ke liye ek universal explanation nahi.',
      },
    ],

    realWorld: [
      {
        en: 'When a singer says "this is too high, can we move it down," a musician who knows key-neighbor relationships can often shift to an adjacent key on the fly, keeping most chord shapes\' relative feel intact rather than rebuilding the whole song from scratch.',
        hi: 'Jab ek singer kehta hai "ye bahut high hai, kya hum ise neeche move kar sakte hain," ek musician jise key-neighbor relationships pata hain, often on the fly ek adjacent key mein shift kar sakta hai, zyadatar chord shapes ka relative feel intact rakhte hue, poore song ko scratch se rebuild karne ke bajaye.',
      },
    ],

    interviewQA: [
      {
        q: 'If C and Am share every note, why do they sound so emotionally different?',
        qHi: 'Agar C aur Am har note share karte hain, toh wo emotionally itne alag kyun sound karte hain?',
        a: 'Because "which note feels like home" (the root/tonic) changes the entire emotional center of gravity even with identical note content — this is the same principle as Module 19\'s major-vs-minor 3rd, but applied to a whole key rather than a single chord.',
        aHi: 'Kyunki "kaunsa note home jaisa feel karta hai" (root/tonic) poora emotional center of gravity badal deta hai identical note content ke saath bhi — ye wahi principle hai jo Module 19 ka major-vs-minor 3rd hai, bas ek single chord ke bajaye ek poori key par apply hota hua.',
      },
    ],

    exercises: [
      {
        task: 'Using the circle, identify D major\'s two neighboring keys and its relative minor. Then check: are any of those three familiar from chord progressions taught in Modules 5-8?',
        taskHi: 'Circle use karke, D major ki do neighboring keys aur uska relative minor identify karo. Phir check karo: kya un teen mein se koi Modules 5-8 mein sikhaaye gaye chord progressions se familiar hai?',
        hint: 'D\'s neighbors are G and A; D\'s relative minor is Bm. G and D have both appeared constantly since Module 5 — this isn\'t a coincidence.',
        hintHi: 'D ke neighbors G aur A hain; D ka relative minor Bm hai. G aur D dono Module 5 se constantly appear hue hain — ye coincidence nahi hai.',
      },
    ],

    keyTakeaways: [
      'Adjacent keys on the circle share all but one note — the real, structural reason certain chord combinations (like G-C-D-Em-Am) sound naturally compatible.',
      'A relative minor shares 100% of its notes with its major counterpart, differing only in which note feels like "home."',
      'The circle explains one major source of chord compatibility — a powerful, genuinely useful tool, not a complete theory of all harmony.',
    ],
    keyTakeawaysHi: [
      'Circle par adjacent keys apne sab notes share karti hain sivaay ek ke — real, structural reason ki kuch chord combinations (jaise G-C-D-Em-Am) naturally compatible sound karte hain.',
      'Ek relative minor apne major counterpart ke saath 100% notes share karta hai, sirf isme differ karta hai ki kaunsa note "home" jaisa feel karta hai.',
      'Circle chord compatibility ka ek major source explain karta hai — ek powerful, genuinely useful tool, poori harmony ki ek complete theory nahi.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'quick-transposing-and-songwriting',
    title: 'Quick Transposing and a Songwriting Shortcut',
    titleHi: 'Quick Transposing Aur Ek Songwriting Shortcut',
    description: 'Using the circle to change a song\'s key fast, and to write a chord progression that has a specific emotional shape on purpose.',
    descriptionHi: 'Circle use karke ek song ki key fast change karna, aur ek chord progression likhna jiska ek specific emotional shape purpose se ho.',
    difficulty: 'HARD',
    duration: 15,
    order: 3,

    analogy: {
      en: '**A transit map where "one stop over" always means roughly the same kind of trip, regardless of which line you\'re on.** Once you know the circle\'s layout, moving a song "one stop" clockwise or counter-clockwise is a predictable, repeatable operation — the same kind of move no matter which key you started in, exactly like knowing "one stop on any line" has a consistent meaning on a transit map once you understand its structure.',
      hi: '**Ek transit map jahan "ek stop aage" hamesha roughly wahi kism ki trip means karta hai, chahe tum kisi bhi line par ho.** Ek baar jab tumhe circle ka layout pata ho, ek song ko "ek stop" clockwise ya counter-clockwise move karna ek predictable, repeatable operation hai — wahi kism ka move chahe tum kisi bhi key mein shuru hue ho, exactly waise hi jaise "kisi bhi line par ek stop" ka ek consistent meaning hota hai ek transit map par ek baar jab tum uska structure samajh jaate ho.',
      },

    simple: `**Quick transposing, the actual procedure:** to move a whole progression up or down by a predictable, musically-safe amount, shift every chord the SAME number of steps around the circle. Moving a G-C-D progression one step counter-clockwise (G→C, C→F, D→G) gives you C-F-G — the identical progression shape, just relocated, because every chord kept the same relative position to the others.

**Why this works reliably:** the RELATIONSHIPS between the chords (how many circle-steps apart they are from each other) is what creates a progression\'s character — shifting every chord by the same amount preserves every one of those relationships exactly, just centered on a new key.

**A songwriting shortcut, using the same idea in reverse:** want a chord change that feels like a bigger emotional jump? Reach further around the circle (a chord several steps away) instead of a next-door neighbor. Want maximum smoothness? Stay adjacent. This gives you a genuine, deliberate dial for how dramatic a chord change feels — not random trial and error.`,
    simpleHi: `**Quick transposing, actual procedure:** ek poori progression ko ek predictable, musically-safe amount se upar ya neeche move karne ke liye, har chord ko circle ke around SAME number of steps shift karo. Ek G-C-D progression ko ek step counter-clockwise move karna (G→C, C→F, D→G) tumhe C-F-G deta hai — identical progression shape, bas relocated, kyunki har chord ne doosron ke saath same relative position rakhi.

**Ye reliably kyun kaam karta hai:** chords ke beech RELATIONSHIPS (wo ek doosre se kitne circle-steps apart hain) hi hai jo ek progression ka character banaata hai — har chord ko same amount se shift karna un relationships mein se har ek ko exactly preserve karta hai, bas ek nayi key par centered.

**Ek songwriting shortcut, isi idea ko reverse mein use karte hue:** ek chord change chahiye jo ek bigger emotional jump jaisa feel kare? Circle ke around further reach karo (ek chord jo kai steps door ho) next-door neighbor ke bajaye. Maximum smoothness chahiye? Adjacent raho. Ye tumhe ek genuine, deliberate dial deta hai ki ek chord change kitna dramatic feel karta hai — random trial and error nahi.`,

    content: `**Why "shift every chord the same number of steps" is mathematically guaranteed to preserve a progression\'s character, not just a helpful rule of thumb.** Because the circle is a fixed, evenly-spaced structure (Lesson 1\'s perfect-5th derivation), the DISTANCE between any two positions on it doesn\'t change when the whole set is rotated together — this is the same principle as sliding Module 16-17\'s movable shapes up the neck: the shape\'s internal geometry (and therefore its sound-relationship) is unchanged by where it starts.

**Why "how far apart on the circle" genuinely predicts emotional distance, not just coincidentally.** Lesson 2 established that circle-neighbors share almost all their notes (maximally smooth) while distant keys share very few (maximally different). This is a real, structural gradient, not a vague impression — which is exactly why deliberately picking a further-away chord for a chorus lift, or a bridge, is a common, teachable songwriting technique rather than a mysterious "ear" thing only some people have.

**A closing, honest note on Module 20 as a whole, connecting to what comes next.** The Circle of Fifths is genuinely one of the most gatekept pieces of "advanced" music knowledge — often taught as an intimidating poster rather than derived and used, the way this module did. Module 21 (CAGED System) builds on this same "understand the underlying structure, then use it" approach, applied to covering the entire neck with five connected chord shapes.`,
    contentHi: `**"Har chord ko same number of steps shift karo" mathematically kyun guarantee karta hai ki progression ka character preserve rahe, sirf ek helpful rule of thumb nahi.** Kyunki circle ek fixed, evenly-spaced structure hai (Lesson 1 ka perfect-5th derivation), us par kisi bhi do positions ke beech ki DISTANCE change nahi hoti jab poora set saath mein rotate hota hai — ye wahi principle hai jo Module 16-17 ke movable shapes ko neck upar slide karna hai: shape ki internal geometry (aur isliye uska sound-relationship) is baat se unchanged rehti hai ki wo kahan se shuru hoti hai.

**"Circle par kitna door hai" genuinely emotional distance kyun predict karta hai, sirf coincidentally nahi.** Lesson 2 ne establish kiya ki circle-neighbors apne almost sab notes share karte hain (maximally smooth) jabki distant keys bahut kam share karte hain (maximally different). Ye ek real, structural gradient hai, ek vague impression nahi — isliye hi ek chorus lift, ya ek bridge ke liye deliberately ek further-away chord pick karna ek common, teachable songwriting technique hai, ek mysterious "ear" cheez nahi jo sirf kuch logon ke paas hoti hai.

**Poore Module 20 par ek closing, honest note, aage kya aata hai us se connect karte hue.** Circle of Fifths genuinely "advanced" music knowledge ke sabse gatekept pieces mein se ek hai — often ek intimidating poster ki tarah sikhaaya jaata hai, derive aur use karne ke bajaye, jaisa is module ne kiya. Module 21 (CAGED System) isi "underlying structure samjho, phir use karo" approach par build karta hai, poori neck ko paanch connected chord shapes se cover karne mein apply hote hue.`,

    examples: [
      {
        title: 'Transposing G-C-D down one step to C-F-G',
        titleHi: 'G-C-D ko ek step neeche C-F-G mein transpose karna',
        previewHeight: 420,
        code: `Original: G - C - D
Each chord shifted 1 step counter-clockwise on the circle:
  G -> C
  C -> F
  D -> G
Result: C - F - G

Same relative shape (same distances between chords), new key.`,
        preview: diagramPreviewHtml(
          circleOfFifthsSvg([0, 1, 2, 11]),
          'G, C, D (the original progression) and F (where D shifts to) all highlighted — notice C-F-G occupies the exact same relative pattern as G-C-D, just rotated one position.',
        ),
        explain:
          'Seeing both the original and transposed chords on the same circle makes the "same shape, different location" nature of transposing visually obvious — it\'s a rotation, not a re-derivation from scratch.',
        explainHi:
          'Original aur transposed dono chords ko same circle par dekhna transposing ki "same shape, different location" nature ko visually obvious banata hai — ye ek rotation hai, scratch se ek re-derivation nahi.',
      },
    ],

    mistakes: [
      {
        wrong: 'Transposing a progression by shifting each chord a DIFFERENT number of circle-steps, assuming "moving everything roughly higher" is enough.',
        right: 'Shift every chord the exact same number of steps to genuinely preserve the progression\'s internal relationships and character.',
        why: 'Inconsistent shifting breaks the very relationships (shared notes between neighbors) that made the original progression sound the way it did — the transposed version can end up sounding wrong even though every individual chord is "correct" in isolation.',
        whyHi: 'Inconsistent shifting un relationships ko hi break kar deta hai (neighbors ke beech shared notes) jo original progression ko waise sound karwaate the — transposed version galat sound kar sakta hai chahe har individual chord isolation mein "correct" ho.',
      },
    ],

    realWorld: [
      {
        en: 'A guitarist asked to play a song in a capo-friendly key, or to match a singer\'s comfortable range, uses exactly this same-number-of-steps transposing method to move an entire setlist\'s chord charts quickly and reliably.',
        hi: 'Ek guitarist jise ek capo-friendly key mein ek song bajaane ko kaha jaaye, ya ek singer ki comfortable range match karne ko, exactly isi same-number-of-steps transposing method use karta hai ek poori setlist ke chord charts ko quickly aur reliably move karne ke liye.',
      },
    ],

    interviewQA: [
      {
        q: 'Does reaching "further around the circle" for a dramatic chord change always sound good?',
        qHi: 'Kya ek dramatic chord change ke liye circle ke around "further" reach karna hamesha achha sound karta hai?',
        a: 'No — it\'s a genuine tool for deliberate emotional contrast, but overusing distant, jarring chord changes can just sound like mistakes rather than intentional choices. Like any strong technique (Module 14\'s dynamics, Module 24\'s improvisation framework will echo this), it\'s most effective used sparingly and purposefully, not constantly.',
        aHi: 'Nahi — ye deliberate emotional contrast ke liye ek genuine tool hai, lekin distant, jarring chord changes ko overuse karna sirf mistakes jaisa sound kar sakta hai, intentional choices jaisa nahi. Kisi bhi strong technique ki tarah (Module 14 ke dynamics, Module 24 ka improvisation framework ise echo karega), ye sparingly aur purposefully use hone par sabse effective hai, constantly nahi.',
      },
    ],

    exercises: [
      {
        task: 'Transpose the Em-C-G-D progression (a very common progression from Module 8) down by one circle-step for every chord, and write out the resulting new progression.',
        taskHi: 'Em-C-G-D progression (Module 8 se ek bahut common progression) ko har chord ke liye ek circle-step neeche transpose karo, aur resulting naya progression likho.',
        hint: 'Em shifts to Am (its counter-clockwise neighbor on the minor ring), C shifts to F, G shifts to C, D shifts to G — giving Am-F-C-G.',
        hintHi: 'Em Am mein shift hota hai (minor ring par uska counter-clockwise neighbor), C F mein shift hota hai, G C mein shift hota hai, D G mein shift hota hai — Am-F-C-G deta hua.',
      },
    ],

    keyTakeaways: [
      'To transpose a progression, shift every chord the same number of steps around the circle — this preserves the exact relationships that give it its character.',
      'How far apart chords are on the circle genuinely predicts how smooth or dramatic a change between them will feel — a real, usable songwriting dial.',
      'This closes Module 20: the Circle of Fifths, derived from one interval and then used for key relationships and transposing — not memorized as an intimidating poster.',
    ],
    keyTakeawaysHi: [
      'Ek progression transpose karne ke liye, har chord ko circle ke around same number of steps shift karo — ye exactly un relationships ko preserve karta hai jo ispar iska character dete hain.',
      'Circle par chords kitne door hain ye genuinely predict karta hai ki unke beech ek change kitna smooth ya dramatic feel karega — ek real, usable songwriting dial.',
      'Ye Module 20 close karta hai: Circle of Fifths, ek interval se derived aur phir key relationships aur transposing ke liye used — ek intimidating poster ki tarah memorized nahi.',
    ],
  },
];
