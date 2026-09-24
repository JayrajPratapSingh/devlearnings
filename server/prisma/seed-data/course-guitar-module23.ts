/**
 * Guitar Course — Module 23: Modes Explained Simply, lessons 1-3.
 * Part VIII continues. Extends Module 19's interval formulas to the
 * full 7-note major scale, then reframes Module 20's relative-minor
 * relationship as one specific case of a more general idea.
 */

import type { CourseLesson } from './course-js-module1';
import { diagramPreviewHtml, fretboardMapSvg } from './guitar-diagrams';

export const GUITAR_MODULE_23: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'what-a-mode-actually-is',
    title: 'What a Mode Actually Is (Not What It Sounds Like)',
    titleHi: 'Ek Mode Actually Kya Hai (Jo Ye Sound Karta Hai Wo Nahi)',
    description: 'The same 7 notes, started from a different note — the entire idea, with none of the intimidating reputation.',
    descriptionHi: 'Wahi 7 notes, ek alag note se shuru ki gayi — poora idea, intimidating reputation ke bina.',
    difficulty: 'HARD',
    duration: 20,
    order: 1,

    analogy: {
      en: '**The same seven-day week, described starting from a different day.** "Monday through Sunday" and "Wednesday through Tuesday" contain the exact same seven days, in the exact same relative order — only which day counts as the "start" changes, and that alone changes how the week feels described (a workweek-first framing feels different from a weekend-first one). A mode is exactly this for a scale\'s 7 notes: same notes, same order, different starting point, different feel.',
      hi: '**Wahi seven-day week, ek alag din se shuru hoke describe ki gayi.** "Monday through Sunday" aur "Wednesday through Tuesday" mein exact same seven days hain, exact same relative order mein — sirf ye badalta hai ki kaunsa din "start" count hota hai, aur akela ye is baat ko badal deta hai ki week describe kiya jaana kaisa feel karta hai (ek workweek-first framing ek weekend-first se alag feel karta hai). Ek mode ek scale ke 7 notes ke liye exactly yahi hai: same notes, same order, different starting point, different feel.',
    },

    simple: `**First, the major scale itself, in Module 19\'s interval language (extending what you already know):** root, +2 (2nd), +4 (3rd, already familiar), +5 (4th, already familiar), +7 (5th, already familiar), +9 (6th), +11 (7th). Seven notes total. For C: C-D-E-F-G-A-B.

**What a mode is, precisely:** take those same 7 notes, but start counting from a DIFFERENT one of them, treating it as the new "home" note. Starting the C major scale\'s notes from D instead of C (D-E-F-G-A-B-C) is called D Dorian — same 7 notes, same order, different starting point.

**The huge simplifying realization — you already know one mode by a different name:** Module 20\'s relative minor is literally one specific mode. A minor uses the exact same 7 notes as C major (A-B-C-D-E-F-G), just starting from A instead of C. That mode has its own name too: Aeolian. Relative minor and Aeolian are the same idea, taught with different vocabulary.`,
    simpleHi: `**Pehle, major scale khud, Module 19 ki interval language mein (jo tumhe already pata hai use extend karte hue):** root, +2 (2nd), +4 (3rd, already familiar), +5 (4th, already familiar), +7 (5th, already familiar), +9 (6th), +11 (7th). Total saat notes. C ke liye: C-D-E-F-G-A-B.

**Ek mode precisely kya hai:** wahi 7 notes lo, lekin unmein se ek DIFFERENT note se counting shuru karo, use naya "home" note treat karte hue. C major scale ke notes ko C ke bajaye D se shuru karna (D-E-F-G-A-B-C) D Dorian kehlaata hai — wahi 7 notes, wahi order, alag starting point.

**Bada simplifying realization — tumhe already ek mode ek alag naam se pata hai:** Module 20 ka relative minor literally ek specific mode hai. A minor exact same 7 notes use karta hai jo C major karta hai (A-B-C-D-E-F-G), bas A se shuru hote hue C ke bajaye. Us mode ka apna naam bhi hai: Aeolian. Relative minor aur Aeolian same idea hain, alag vocabulary ke saath sikhaaye gaye.`,

    content: `**Why introducing the full 7-note major scale here, this late in the course, is the right sequencing rather than a gap.** Modules 19 and 22 deliberately used only PARTS of this scale — triads (root-3rd-5th) and the pentatonic scale (5 of the 7 notes) — because those were the minimum needed for their respective topics. Modes are the first topic that genuinely needs all 7 notes at once, which is exactly why the full scale formula appears here rather than earlier: this course consistently introduces exactly as much theory as each topic needs, not more.

**Why realizing "relative minor = Aeolian mode" is the single most valuable reframe in this lesson.** It proves, concretely, that "modes" aren\'t an intimidating brand-new category of knowledge — you\'ve been using one for three modules already (Module 20\'s relative minor) without the word "mode" ever being attached to it. This is deliberately designed to defuse the reputation modes have for being advanced or confusing before Lesson 2 introduces the other five.

**A genuinely honest note on why modes have an intimidating reputation despite being this simple at their core.** The complexity most people associate with modes comes from HOW to use them musically (which chords imply which mode, how to make a mode\'s character actually audible) — a genuinely deep topic. What a mode fundamentally IS, however, which is this lesson\'s entire scope, is straightforward: the same notes, a different starting point.`,
    contentHi: `**Poore 7-note major scale ko yahan, course mein itni late, introduce karna gap ke bajaye sahi sequencing kyun hai.** Modules 19 aur 22 ne deliberately is scale ke sirf PARTS use kiye — triads (root-3rd-5th) aur pentatonic scale (7 mein se 5 notes) — kyunki wo apne respective topics ke liye minimum zaroori the. Modes pehla topic hai jise genuinely ek saath saari 7 notes chahiye, isliye hi full scale formula yahan appear hota hai pehle ke bajaye: ye course consistently har topic ko utni hi theory introduce karta hai jitni use chahiye, zyada nahi.

**"Relative minor = Aeolian mode" realize karna is lesson ka sabse valuable reframe kyun hai.** Ye concretely prove karta hai ki "modes" ek intimidating brand-new category of knowledge nahi hain — tum teen modules se already ek use kar rahe ho (Module 20 ka relative minor) bina "mode" word kabhi attach hue. Ye deliberately design kiya gaya hai us reputation ko defuse karne ke liye jo modes ki advanced ya confusing hone ke liye hai, Lesson 2 baaki paanch introduce karne se pehle.

**Modes ki intimidating reputation kyun hai iske core mein itna simple hone ke bawajood, iske baare mein ek genuinely honest note.** Zyadatar log modes se jo complexity associate karte hain wo aati hai HOW se — unhe musically kaise use karein (kaunse chords kaunsa mode imply karte hain, ek mode ka character actually audible kaise banaayein) — ek genuinely deep topic. Ek mode fundamentally KYA HAI, halaanki, jo is lesson ka poora scope hai, straightforward hai: wahi notes, ek different starting point.`,

    examples: [
      {
        title: 'The C major scale\'s 7 notes, and the exact same 7 notes started from A',
        titleHi: 'C major scale ke 7 notes, aur wahi exact 7 notes A se shuru kiye gaye',
        previewHeight: 340,
        code: `C major scale: C - D - E - F - G - A - B (then back to C)
Same 7 notes, started from A: A - B - C - D - E - F - G

This second version is A Aeolian — which you already know as
"A minor," the relative minor of C major (Module 20).`,
        preview: diagramPreviewHtml(
          fretboardMapSvg(8, [
            [0, 3], [0, 5], [0, 7], [0, 8], [0, 10],
          ]),
          'The notes of the C major scale visible on the low-E string within this range (frets 3, 5, 7, 8, 10 = G, A, B, C, D) — the same physical notes, regardless of which one you choose to call "home."',
        ),
        explain:
          'Seeing that the underlying notes on the string don\'t change at all — only which one this lesson calls the "starting" note changes — makes the core mode concept as concrete as possible before any mode names are introduced.',
        explainHi:
          'Ye dekhna ki string par underlying notes bilkul nahi badalte — sirf ye badalta hai ki ye lesson kaunse ko "starting" note kehta hai — core mode concept ko jitna possible ho utna concrete banata hai, kisi bhi mode names introduce hone se pehle.',
      },
    ],

    mistakes: [
      {
        wrong: 'Assuming a mode must involve different or unusual notes compared to a familiar scale.',
        right: 'Recognize that (in the simplest case) a mode uses IDENTICAL notes to its parent major scale — only the starting/home note differs.',
        why: 'This is the single most common misconception that makes modes seem more exotic and difficult than they actually are at their foundation.',
        whyHi: 'Ye sabse common misconception hai jo modes ko unke foundation par jitne actually hain us se zyada exotic aur difficult lagata hai.',
      },
    ],

    realWorld: [
      {
        en: 'A songwriter who notices a melody "wants" to resolve to the 6th degree of a major scale rather than the 1st, and leans into that, is intuitively writing in a mode (Aeolian) without necessarily using the terminology at all.',
        hi: 'Ek songwriter jo notice karta hai ki ek melody ek major scale ke 1st degree ke bajaye 6th degree par "resolve hona chahta hai," aur us mein lean karta hai, intuitively ek mode mein (Aeolian) likh raha hai bina terminology use kiye bhi.',
      },
    ],

    interviewQA: [
      {
        q: 'If a mode uses the exact same notes as its parent major scale, how can it possibly sound different?',
        qHi: 'Agar ek mode apne parent major scale ke exact same notes use karta hai, ye possibly alag kaise sound kar sakta hai?',
        a: 'Because which note feels like "home" changes the entire emotional center of gravity — the exact same principle Module 19 established for major-vs-minor 3rds and Module 20 established for relative major/minor, now generalized to all 7 possible starting points instead of just 2.',
        aHi: 'Kyunki kaunsa note "home" jaisa feel karta hai poora emotional center of gravity badal deta hai — exactly wahi principle jo Module 19 ne major-vs-minor 3rds ke liye establish kiya tha aur Module 20 ne relative major/minor ke liye, ab saari 7 possible starting points tak generalized hua, sirf 2 ke bajaye.',
      },
    ],

    exercises: [
      {
        task: 'Using the C major scale (C-D-E-F-G-A-B), write out the 7 notes starting from G instead of C, keeping the same relative order (wrapping around back to F). This is G Mixolydian — you\'ll meet it by name in Lesson 2.',
        taskHi: 'C major scale (C-D-E-F-G-A-B) use karke, C ke bajaye G se shuru hote hue 7 notes likho, same relative order rakhte hue (wapas F tak wrap around karte hue). Ye G Mixolydian hai — tum ise Lesson 2 mein naam se milोge.',
        hint: 'G-A-B-C-D-E-F — same 7 letters as C major, just re-started from G.',
        hintHi: 'G-A-B-C-D-E-F — C major ke wahi 7 letters, bas G se re-started.',
      },
    ],

    keyTakeaways: [
      'The major scale, in interval terms: root, +2, +4, +5, +7, +9, +11 — seven notes, extending Module 19\'s triad intervals to the full scale.',
      'A mode uses the exact same notes as its parent major scale, just starting from a different note as "home."',
      'Module 20\'s relative minor is literally one mode (Aeolian) that you already knew before this lesson attached a name to the underlying idea.',
    ],
    keyTakeawaysHi: [
      'Major scale, interval terms mein: root, +2, +4, +5, +7, +9, +11 — saat notes, Module 19 ke triad intervals ko full scale tak extend karte hue.',
      'Ek mode apne parent major scale ke exact same notes use karta hai, bas ek different note se "home" ki tarah shuru hote hue.',
      'Module 20 ka relative minor literally ek mode hai (Aeolian) jo tumhe is lesson ke underlying idea ko naam dene se pehle hi pata tha.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'the-seven-modes-named',
    title: 'The Seven Modes, Named — Each One Note Away From Familiar',
    titleHi: 'Saat Modes, Named — Har Ek Familiar Se Ek Note Door',
    description: 'Every mode besides the major scale and relative minor differs from one of those two by exactly one or two altered notes.',
    descriptionHi: 'Major scale aur relative minor ke alawa har mode un dono mein se ek se exactly ek ya do altered notes se differ karta hai.',
    difficulty: 'HARD',
    duration: 25,
    order: 2,

    analogy: {
      en: '**A family of near-identical recipes, each with exactly one ingredient swapped.** Once you have the base major-scale recipe and the base minor-scale recipe (Module 20\'s two reference points), every other mode is one of those two recipes with exactly one or two ingredients deliberately changed — not seven totally separate recipes to learn from scratch.',
      hi: '**Near-identical recipes ka ek family, har ek mein exactly ek ingredient swapped.** Ek baar jab tumhare paas base major-scale recipe aur base minor-scale recipe ho (Module 20 ke do reference points), har doosra mode un dono recipes mein se ek hai exactly ek ya do ingredients deliberately changed ke saath — scratch se seekhne wale saat totally separate recipes nahi.',
    },

    simple: `**The seven modes, organized around the two you already know (verified by direct calculation, not just listed):**

**Close to major (Ionian):**
- **Ionian** = the major scale itself. Bright, resolved, "home" sounding.
- **Lydian** = major scale with ONE change: the 4th degree raised by a semitone. Dreamy, floating, slightly unresolved — a favorite for film-score "wonder" moments.
- **Mixolydian** = major scale with ONE change: the 7th degree lowered by a semitone. Bright but slightly bluesy/unresolved — extremely common in rock and blues.

**Close to minor (Aeolian):**
- **Aeolian** = the natural minor scale itself (Module 20\'s relative minor). Sad, serious, "home" sounding for minor.
- **Dorian** = natural minor with ONE change: the 6th degree raised by a semitone. Minor-feeling but slightly brighter/less heavy — very common in funk and jazz.
- **Phrygian** = natural minor with ONE change: the 2nd degree lowered by a semitone. Dark, tense, exotic-sounding — common in flamenco and metal.
- **Locrian** = natural minor with TWO changes: both the 2nd and 5th degrees lowered. Unstable, rarely used to fully "resolve" — the most unusual and least commonly used of the seven.`,
    simpleHi: `**Saat modes, un do ke around organized jo tumhe already pata hain (direct calculation se verified, sirf listed nahi):**

**Major (Ionian) ke close:**
- **Ionian** = major scale khud. Bright, resolved, "home" sounding.
- **Lydian** = major scale mein EK change: 4th degree ek semitone se raised. Dreamy, floating, slightly unresolved — film-score "wonder" moments ke liye ek favorite.
- **Mixolydian** = major scale mein EK change: 7th degree ek semitone se lowered. Bright lekin slightly bluesy/unresolved — rock aur blues mein extremely common.

**Minor (Aeolian) ke close:**
- **Aeolian** = natural minor scale khud (Module 20 ka relative minor). Sad, serious, minor ke liye "home" sounding.
- **Dorian** = natural minor mein EK change: 6th degree ek semitone se raised. Minor-feeling lekin slightly brighter/less heavy — funk aur jazz mein bahut common.
- **Phrygian** = natural minor mein EK change: 2nd degree ek semitone se lowered. Dark, tense, exotic-sounding — flamenco aur metal mein common.
- **Locrian** = natural minor mein DO changes: 2nd aur 5th dono degrees lowered. Unstable, rarely fully "resolve" karne ke liye use hota hai — saato mein sabse unusual aur sabse kam commonly used.`,

    content: `**Why organizing all seven around just two reference points (rather than as seven independent facts) is both accurate and dramatically easier to hold in memory.** This isn\'t a simplification that loses accuracy — each mode\'s formula was directly calculated (by rotating the major scale\'s own interval pattern) and independently confirmed to differ from major or minor by exactly the number of notes stated. Organizing around two known anchors, the same anchor-point memorization principle from Module 18, turns "seven new scales" into "two known scales plus a small number of single-note tweaks."

**Why Locrian is the odd one out, and why that\'s a genuinely accurate observation, not just a difficulty ranking.** Locrian is the only mode where even the 5th degree is altered — and Module 19 established the perfect 5th as one of the two "perfect," maximally stable intervals. A scale lacking a stable perfect 5th above its own root has a genuine structural instability the other six modes don\'t share, which is exactly why Locrian has a reputation as unusual even among people who work with modes regularly.

**A genuinely honest note on how deep this lesson goes, versus how deep the topic goes.** Knowing each mode\'s formula and general character is a real, useful foundation — but truly fluent modal playing (recognizing a mode by ear, using it expressively and idiomatically in a solo) is a separate, substantial skill built through extensive listening and practice, not something a single lesson\'s formulas can shortcut. Lesson 3 gives an honest, practical starting point for building that skill, not a claim that formulas alone create fluency.`,
    contentHi: `**Saato ko sirf do reference points ke around organize karna (saat independent facts ki tarah nahi) accurate aur dramatically memory mein hold karne mein easier dono kyun hai.** Ye ek simplification nahi hai jo accuracy khota hai — har mode ka formula directly calculate kiya gaya (major scale ke apne interval pattern ko rotate karke) aur independently confirm kiya gaya ki ye major ya minor se exactly utne notes se differ karta hai jitna stated hai. Do known anchors ke around organize karna, wahi anchor-point memorization principle Module 18 se, "saat naye scales" ko "do known scales plus thode se single-note tweaks" mein badal deta hai.

**Locrian odd one out kyun hai, aur ye ek genuinely accurate observation kyun hai, sirf ek difficulty ranking nahi.** Locrian wo akela mode hai jahan 5th degree bhi altered hai — aur Module 19 ne perfect 5th ko do "perfect," maximally stable intervals mein se ek establish kiya tha. Ek scale jismein apne root ke upar ek stable perfect 5th missing ho uski ek genuine structural instability hai jo baaki chhah modes share nahi karte, isliye hi Locrian ki reputation unusual hai un logon mein bhi jo regularly modes ke saath kaam karte hain.

**Ye lesson kitna deep jaata hai versus topic kitna deep jaata hai iske baare mein ek genuinely honest note.** Har mode ka formula aur general character jaanna ek real, useful foundation hai — lekin truly fluent modal playing (kaan se ek mode recognize karna, ek solo mein use expressively aur idiomatically use karna) ek separate, substantial skill hai jo extensive listening aur practice se build hoti hai, kuch aisa nahi jo ek single lesson ke formulas shortcut kar sakein. Lesson 3 us skill ko build karne ke liye ek genuinely honest, practical starting point deta hai, ye claim nahi ki akele formulas fluency create karte hain.`,

    examples: [
      {
        title: 'Mixolydian vs. major — the one-note difference, verified on G',
        titleHi: 'Mixolydian vs. major — ek-note ka difference, G par verified',
        previewHeight: 340,
        code: `G major scale:      G - A - B - C - D - E - F#
G Mixolydian:        G - A - B - C - D - E - F  (7th lowered by a semitone)

Every other note is identical. This single changed note is the
entire difference between "bright major" and "bluesy Mixolydian."`,
        preview: diagramPreviewHtml(
          fretboardMapSvg(3, [[0, 1], [0, 2]]),
          'F (flat 7th, fret 1) and F# (major 7th, fret 2) sitting one fret apart on the low-E string — the single note that separates G Mixolydian from G major.',
        ),
        explain:
          'Seeing the one differing note as a single fret away from its major-scale counterpart makes "modes differ by one note" a literal, checkable, physical fact rather than an abstraction.',
        explainHi:
          'Ek differing note ko apne major-scale counterpart se ek fret door dekhna "modes ek note se differ karte hain" ko ek literal, checkable, physical fact banata hai, ek abstraction nahi.',
      },
    ],

    mistakes: [
      {
        wrong: 'Trying to memorize all seven modes as independent, unrelated lists of intervals.',
        right: 'Memorize just two reference scales (major and natural minor) plus a small, specific list of which single note each other mode changes.',
        why: 'This is a direct application of Module 18\'s anchor-point principle to a new kind of information — two anchors plus small deltas is dramatically lighter than seven independent facts, while representing identical information.',
        whyHi: 'Ye Module 18 ke anchor-point principle ka ek naye kism ki information par direct application hai — do anchors plus chhote deltas saat independent facts se dramatically halka hai, identical information represent karte hue.',
      },
    ],

    realWorld: [
      {
        en: 'A jazz or funk guitarist choosing Dorian over a minor chord specifically to sound "less heavy" than plain natural minor is making a deliberate, informed choice based on exactly the one-note difference this lesson describes.',
        hi: 'Ek jazz ya funk guitarist jo ek minor chord ke upar specifically Dorian choose karta hai plain natural minor se "less heavy" sound karne ke liye, exactly us ek-note difference ke basis par ek deliberate, informed choice bana raha hai jo ye lesson describe karta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does Lydian get described as "dreamy" and Mixolydian as "bluesy" if they\'re both just the major scale with one note changed?',
        qHi: 'Lydian ko "dreamy" aur Mixolydian ko "bluesy" kyun describe kiya jaata hai agar dono bas major scale hain ek note change ke saath?',
        a: 'Because WHICH note changes matters enormously — a raised 4th (Lydian) creates tension against the 5th in a floaty, unresolved way, while a lowered 7th (Mixolydian) removes the strong pull back to the root that the major scale\'s 7th normally provides, creating a more relaxed, bluesy resolution. Different altered notes create genuinely different characters, even though both are "one note away" from major.',
        aHi: 'Kyunki KAUNSA note change hota hai enormously matter karta hai — ek raised 4th (Lydian) 5th ke against tension create karta hai ek floaty, unresolved tareeke se, jabki ek lowered 7th (Mixolydian) us strong pull ko hata deta hai root ki taraf jo major scale ka 7th normally provide karta hai, ek zyada relaxed, bluesy resolution create karte hue. Alag altered notes genuinely alag characters create karte hain, chahe dono major se "ek note door" hon.',
      },
    ],

    exercises: [
      {
        task: 'Using the natural minor formula (0, 2, 3, 5, 7, 8, 10 semitones) and Phrygian\'s "one change" rule from this lesson, calculate the semitone formula for Phrygian, then verify it matches E Phrygian\'s real notes (E-F-G-A-B-C-D) using Module 18\'s note-counting method.',
        taskHi: 'Natural minor formula (0, 2, 3, 5, 7, 8, 10 semitones) aur is lesson ke Phrygian "ek change" rule use karke, Phrygian ke liye semitone formula calculate karo, phir Module 18 ke note-counting method use karke verify karo ki ye E Phrygian ke real notes (E-F-G-A-B-C-D) se match karta hai.',
        hint: 'Lower the 2nd degree (offset 2) by a semitone to get offset 1: the formula becomes 0, 1, 3, 5, 7, 8, 10.',
        hintHi: '2nd degree (offset2) ko ek semitone se lower karo offset1 paane ke liye: formula ban jaata hai 0, 1, 3, 5, 7, 8, 10.',
      },
    ],

    keyTakeaways: [
      'Ionian (major) and Aeolian (natural minor) are the two reference points; the other five modes each differ from one of these two by exactly one or two altered notes.',
      'Lydian (raised 4th) and Mixolydian (lowered 7th) are close to major; Dorian (raised 6th) and Phrygian (lowered 2nd) are close to minor; Locrian (lowered 2nd and 5th) is the unusual outlier, lacking even a stable perfect 5th.',
      'Knowing each formula is a real foundation, but genuinely fluent modal playing is a separate, substantial skill built through practice, not a shortcut this lesson claims to provide.',
    ],
    keyTakeawaysHi: [
      'Ionian (major) aur Aeolian (natural minor) do reference points hain; baaki paanch modes mein se har ek in dono mein se ek se exactly ek ya do altered notes se differ karta hai.',
      'Lydian (raised 4th) aur Mixolydian (lowered 7th) major ke close hain; Dorian (raised 6th) aur Phrygian (lowered 2nd) minor ke close hain; Locrian (lowered 2nd aur 5th) unusual outlier hai, ek stable perfect 5th ki bhi kami ke saath.',
      'Har formula jaanna ek real foundation hai, lekin genuinely fluent modal playing ek separate, substantial skill hai jo practice se build hoti hai, ye lesson provide karne ka claim karta ek shortcut nahi.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'using-modes-practically',
    title: 'Using Modes Practically: A Starting Point, Honestly Scoped',
    titleHi: 'Modes Ko Practically Use Karna: Ek Starting Point, Honestly Scoped',
    description: 'A genuine, usable first step for hearing and applying modal color, without pretending this one lesson creates full fluency.',
    descriptionHi: 'Modal color sunne aur apply karne ke liye ek genuine, usable pehla step, ye dikhawa kiye bina ki ye ek lesson full fluency create karta hai.',
    difficulty: 'HARD',
    duration: 15,
    order: 3,

    analogy: {
      en: '**Learning to notice a specific spice in a dish before learning to cook confidently with it yourself.** The first real skill isn\'t using modes fluently in your own playing — it\'s learning to NOTICE a mode\'s characteristic flavor in music you already listen to. Recognition comes before fluent, confident use, the same order any new skill in this course has followed.',
      hi: '**Khud confidently uske saath cook karna seekhne se pehle ek dish mein ek specific spice ko notice karna seekhna.** Pehla real skill apne khud ke playing mein modes ko fluently use karna nahi hai — ye seekhna hai ki ek mode ka characteristic flavor us music mein NOTICE karo jo tum already sunte ho. Recognition fluent, confident use se pehle aata hai, wahi order jo is course mein koi bhi naya skill follow kar chuka hai.',
    },

    simple: `**A genuinely usable starting exercise: play a familiar scale shape, but deliberately resolve to a different note.** Take a scale shape you already know (even Module 22\'s pentatonic Box 1) and, instead of ending phrases on the note you\'d normally treat as "home," deliberately end on a different note in the same shape. This alone lets you START hearing how a different "home" note changes the character, without needing new finger shapes.

**A practical listening exercise, just as valuable as a playing one:** many songs you already know lean on a specific mode\'s character even if they\'re never labeled that way — a bright verse that never quite resolves the way a normal major-key song would is a common Mixolydian signal; a minor-key song that feels less heavy than expected is a common Dorian signal. Listening for this is a genuinely useful, low-effort first step.

**An honest, direct statement of scope for this module as a whole:** this module\'s job was making sure "what is a mode" is no longer confusing or intimidating — a real and valuable outcome on its own. Genuinely fluent modal soloing (instantly recognizing and idiomatically using all seven in real time) is a long-term skill built over months or years of focused listening and practice, not something any single module, including this one, can hand you complete.`,
    simpleHi: `**Ek genuinely usable starting exercise: ek familiar scale shape bajaao, lekin deliberately ek alag note par resolve karo.** Ek scale shape lo jo tumhe already pata hai (Module 22 ka pentatonic Box1 bhi), aur, phrases ko us note par khatam karne ke bajaye jise tum normally "home" treat karte, deliberately usi shape mein ek different note par khatam karo. Akela ye tumhe SUNNA shuru karne deta hai ki ek different "home" note character ko kaise badalta hai, naye finger shapes ki zaroorat ke bina.

**Ek practical listening exercise, ek playing wale jitni hi valuable:** bahut saare songs jo tumhe already pata hain ek specific mode ke character par lean karte hain chahe wo kabhi us tareeke se label na kiye gaye hon — ek bright verse jo kabhi bhi normal major-key song jitna properly resolve nahi hota ek common Mixolydian signal hai; ek minor-key song jo expected se less heavy feel karta hai ek common Dorian signal hai. Ise sunna ek genuinely useful, low-effort pehla step hai.

**Poore module ke scope ka ek honest, direct statement:** is module ka kaam ye confirm karna tha ki "ek mode kya hai" ab confusing ya intimidating nahi raha — apne aap mein ek real aur valuable outcome. Genuinely fluent modal soloing (real time mein saato ko instantly recognize aur idiomatically use karna) ek long-term skill hai jo mahino ya saalon ki focused listening aur practice se build hoti hai, kuch aisa nahi jo koi bhi single module, isko including, tumhe complete de sake.`,

    content: `**Why "resolve to a different note within a familiar shape" is a genuinely good first exercise, not a toy simplification.** This directly applies Lesson 1\'s core insight (same notes, different home) using muscle memory you already have (Module 22\'s pentatonic shapes), removing the need to learn new finger positions before you can start training your EAR to notice modal color — the hardest and most valuable part of this skill, isolated from the easier part (finger positions) you\'ve already solved.

**Why ear-training through recognition is a more honest starting point than "here are exercises to sound modal."** Genuinely idiomatic modal playing requires first being able to HEAR the difference reliably — practicing "modal licks" without that underlying recognition tends to produce technically-correct-but-hollow-sounding results. This lesson\'s sequencing (learn to notice, then eventually learn to create) mirrors how this skill actually develops for working musicians.

**A closing, honest note on Module 23 and Part VIII as a whole.** Modules 22-23 gave you two genuinely different, non-overlapping tools for improvisation: a safe, foolproof scale (pentatonic/blues) for confident soloing right now, and a conceptual framework (modes) for understanding color and character that will keep deepening for as long as you keep playing. Module 24 (Improvisation Framework, closing Part VIII) ties both of these together into a practical approach for actually soloing over real chord progressions.`,
    contentHi: `**"Ek familiar shape ke andar ek different note par resolve karo" ek genuinely achha pehla exercise kyun hai, ek toy simplification nahi.** Ye directly Lesson 1 ke core insight (wahi notes, different home) ko apply karta hai us muscle memory use karte hue jo tumhe already hai (Module 22 ke pentatonic shapes), naye finger positions seekhne ki zaroorat hataate hue is se pehle ki tum apne EAR ko modal color notice karne ke liye train karna shuru karo — is skill ka sabse hard aur sabse valuable hissa, easier hisse (finger positions) se isolated jo tum already solve kar chuke ho.

**Recognition ke through ear-training "yahan hain modal sound karne ke liye exercises" se ek zyada honest starting point kyun hai.** Genuinely idiomatic modal playing ke liye pehle reliably DIFFERENCE SUNNA aana zaroori hai — us underlying recognition ke bina "modal licks" practice karna often technically-correct-but-hollow-sounding results produce karta hai. Is lesson ki sequencing (notice karna seekho, phir eventually create karna seekho) mirror karti hai ki ye skill working musicians ke liye actually kaise develop hota hai.

**Module 23 aur poore Part VIII par ek closing, honest note.** Modules 22-23 ne tumhe improvisation ke liye do genuinely alag, non-overlapping tools diye: ek safe, foolproof scale (pentatonic/blues) abhi confident soloing ke liye, aur ek conceptual framework (modes) color aur character samajhne ke liye jo jab tak tum bajaate rahoge tab tak deepen hota rahega. Module 24 (Improvisation Framework, Part VIII close karte hue) in dono ko ek practical approach mein tie karta hai real chord progressions ke upar actually soloing karne ke liye.`,

    examples: [
      {
        title: 'The same pentatonic Box 1 shape, resolved to two different "home" notes',
        titleHi: 'Wahi pentatonic Box1 shape, do alag "home" notes par resolved',
        previewHeight: 300,
        code: `A minor pentatonic Box 1 notes: A - C - D - E - G (Module 22).

Resolve phrases to A: sounds like straightforward A minor (Aeolian feel).
Resolve phrases to D instead: same 5 notes, but now leaning toward
a D-centered (Dorian-adjacent) feel, since D-E-G-A-C is D's own
pentatonic shape using identical physical notes.`,
        preview: diagramPreviewHtml(
          fretboardMapSvg(8, [
            [0, 5], [0, 8],
            [1, 5], [1, 7],
            [2, 5], [2, 7],
            [3, 5], [3, 7],
            [4, 5], [4, 8],
            [5, 5], [5, 8],
          ]),
          'The exact same Box 1 shape from Module 22 — no new finger positions needed to start experimenting with a different "home" note.',
        ),
        explain:
          'Reusing Module 22\'s exact shape (rather than introducing a new one) makes the point as directly as possible: the ear-training exercise this lesson recommends costs you nothing in new finger-memory, only a shift in which note you choose to resolve to.',
        explainHi:
          'Module 22 ki exact shape reuse karna (ek nayi introduce karne ke bajaye) point ko jitna directly possible ho utna banata hai: is lesson ka recommend kiya hua ear-training exercise tumhe naye finger-memory mein kuch cost nahi karta, sirf ismein shift ki tumhe kaunsa note resolve karne ke liye choose karna hai.',
      },
    ],

    mistakes: [
      {
        wrong: 'Expecting to sound convincingly "modal" immediately after learning the formulas, without first building the ear-recognition step.',
        right: 'Treat recognition (hearing modal color in music you already know) as the genuine first milestone, before expecting fluent creative use.',
        why: 'Skipping straight to production without first building recognition is a common source of frustration — this lesson\'s sequencing exists specifically to set an honest, achievable first goal.',
        whyHi: 'Pehle recognition build kiye bina directly production par jump karna frustration ka ek common source hai — is lesson ki sequencing specifically ek honest, achievable pehla goal set karne ke liye exist karti hai.',
      },
    ],

    realWorld: [
      {
        en: 'Professional improvisers describe modal fluency as an ongoing, decades-long listening practice, not a checkbox skill — the honest scope this lesson gives you matches how working musicians actually talk about this exact topic.',
        hi: 'Professional improvisers modal fluency ko ek ongoing, decades-long listening practice ki tarah describe karte hain, ek checkbox skill nahi — is lesson ka honest scope match karta hai ki working musicians actually is exact topic ke baare mein kaise baat karte hain.',
      },
    ],

    interviewQA: [
      {
        q: 'Is it worth trying to consciously "think in modes" while improvising, or should that stay purely intuitive?',
        qHi: 'Kya improvising karte waqt consciously "modes mein sochne" ki koshish karna worth hai, ya ye purely intuitive rehna chahiye?',
        a: 'Early on, conscious awareness (deliberately choosing a resolution note, as this lesson\'s exercise does) is genuinely useful for building the underlying recognition skill. Over time, as with every technique in this course, the goal is for that conscious process to become intuitive through repetition — not to remain a effortful calculation forever.',
        aHi: 'Shuru mein, conscious awareness (deliberately ek resolution note choose karna, jaisa is lesson ka exercise karta hai) underlying recognition skill build karne ke liye genuinely useful hai. Time ke saath, is course ki har technique ki tarah, goal ye hai ki wo conscious process repetition ke through intuitive ban jaaye — hamesha ek effortful calculation na rahe.',
      },
    ],

    exercises: [
      {
        task: 'Pick 2-3 songs you already know well. Listen specifically for whether any of them feel "major but not quite fully resolved" (a possible Mixolydian signal) or "minor but lighter than expected" (a possible Dorian signal), using this lesson\'s listening guide.',
        taskHi: '2-3 songs pick karo jo tumhe already achhe se pata hain. Specifically suno ki kya unmein se koi "major lekin poori tarah resolve nahi" feel karta hai (ek possible Mixolydian signal) ya "minor lekin expected se lighter" (ek possible Dorian signal), is lesson ke listening guide use karke.',
        hint: 'Don\'t worry about being definitively right — the goal at this stage is practicing the act of noticing, not perfect identification.',
        hintHi: 'Definitively sahi hone ki chinta mat karo — is stage par goal notice karne ka act practice karna hai, perfect identification nahi.',
      },
    ],

    keyTakeaways: [
      'A practical first exercise: reuse an already-known scale shape (like Module 22\'s pentatonic Box 1) but deliberately resolve to a different note to start hearing modal color.',
      'Listening for modal character in music you already know is a genuinely valuable, low-effort first skill — recognition before fluent creative use.',
      'This closes Part VIII\'s scale/theory foundation honestly: Module 24 ties the pentatonic scale (Module 22) and modal understanding (Module 23) together into a practical improvisation approach.',
    ],
    keyTakeawaysHi: [
      'Ek practical pehla exercise: ek already-known scale shape reuse karo (jaise Module 22 ka pentatonic Box1) lekin deliberately ek different note par resolve karo modal color sunna shuru karne ke liye.',
      'Us music mein modal character sunna jo tumhe already pata hai ek genuinely valuable, low-effort pehla skill hai — fluent creative use se pehle recognition.',
      'Ye Part VIII ki scale/theory foundation ko honestly close karta hai: Module 24 pentatonic scale (Module 22) aur modal understanding (Module 23) ko ek practical improvisation approach mein saath tie karta hai.',
    ],
  },
];
