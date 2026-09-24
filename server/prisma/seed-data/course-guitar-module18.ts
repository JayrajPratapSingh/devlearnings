/**
 * Guitar Course — Module 18: The Fretboard Map, lessons 1-3. Opens
 * Part VII (Music Theory For Guitar, Properly).
 *
 * Lesson 1: Notes on each string, and the memorization tricks that
 *           actually work.
 * Lesson 2: Octave shapes — finding the same note in multiple places.
 * Lesson 3: Using the map — finally giving Module 16-17's movable shapes
 *           real, calculable target chords.
 */

import type { CourseLesson } from './course-js-module1';
import { diagramPreviewHtml, fretboardMapSvg } from './guitar-diagrams';

export const GUITAR_MODULE_18: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'notes-on-each-string',
    title: 'Notes on Each String, and How to Actually Memorize Them',
    titleHi: 'Har String Par Notes, Aur Unhe Actually Kaise Memorize Karein',
    description: 'The single piece of knowledge every movable shape since Module 16 has been silently waiting for.',
    descriptionHi: 'Wo ek piece of knowledge jiska Module 16 se har movable shape silently wait kar raha tha.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 1,

    analogy: {
      en: '**Knowing house numbers on a street, not just that houses exist.** You\'ve known since Module 2 that frets exist and raise pitch uniformly. This lesson is the equivalent of finally learning the actual house numbers on a street you\'ve been walking down this whole time — the street layout (frets) was already familiar, only the specific addresses (note names) were missing.',
      hi: '**Ek street par house numbers jaanna, sirf ye nahi ki houses exist karte hain.** Tumhe Module 2 se pata hai ki frets exist karte hain aur pitch ko uniformly raise karte hain. Ye lesson us actual house numbers ko finally seekhne ke barabar hai ek street par jispar tum is poori der chal rahe ho — street layout (frets) already familiar tha, sirf specific addresses (note names) missing the.',
    },

    simple: `**The 12-note cycle, stated precisely:** there are only 12 distinct note names before they repeat: E, F, F#, G, G#, A, A#, B, C, C#, D, D#, then back to E. Each fret moves one step through this cycle (Module 2's semitone rule). Notice: E-to-F and B-to-C have NO sharp/flat between them — these are the two exceptions in an otherwise fully-sharped cycle, worth knowing explicitly rather than discovering by confusion later.

**Memorization trick 1 — anchor points, not the whole string at once:** don't try to memorize all 12 positions on a string simultaneously. Learn fret 0 (open), fret 5, fret 7, and fret 12 first (these often have fretboard marker dots for exactly this reason) — then fill in the gaps between known anchors as needed.

**Memorization trick 2 — the octave-12 rule:** fret 12 is always the SAME note name as the open string, one octave higher (Module 2 mentioned this briefly). This means you only ever need to truly memorize frets 0-11 — fret 13 is just fret 1 repeated, fret 14 is fret 2 repeated, and so on.`,
    simpleHi: `**12-note cycle, precisely stated:** unke repeat hone se pehle sirf 12 distinct note names hain: E, F, F#, G, G#, A, A#, B, C, C#, D, D#, phir wapas E. Har fret is cycle mein ek step move karta hai (Module 2 ka semitone rule). Notice karo: E-to-F aur B-to-C ke beech koi sharp/flat NAHI hai — ye do exceptions hain ek otherwise fully-sharped cycle mein, explicitly jaanne layak, baad mein confusion se discover karne ke bajaye.

**Memorization trick 1 — anchor points, poori string ek saath nahi:** ek string par saari 12 positions ko simultaneously memorize karne ki koshish mat karo. Pehle fret 0 (open), fret 5, fret 7, aur fret 12 seekho (inmein often exactly isi reason se fretboard marker dots hote hain) — phir zaroorat ke hisaab se known anchors ke beech ke gaps bharo.

**Memorization trick 2 — octave-12 rule:** fret 12 hamesha open string ke SAME note name hai, ek octave higher (Module 2 ne ise briefly mention kiya tha). Matlab tumhe kabhi bhi sirf frets 0-11 hi truly memorize karne ki zaroorat hai — fret 13 bas fret 1 repeated hai, fret 14 fret 2 repeated hai, aur waise hi aage.`,

    content: `**Why the E-to-F and B-to-C "no sharp between them" exception matters practically, not just as trivia.** These two spots are where the 12-note cycle compresses, and forgetting them is the single most common source of off-by-one errors when calculating a fretboard position manually — knowing exactly where the cycle has these two "narrow" spots prevents a specific, predictable category of mistake.

**Why anchor points work better than linear memorization, cognitively.** This is Module 10's chunking principle applied to pure memorization: 12 arbitrary-feeling facts (frets 0-11 on one string) are hard to hold reliably, but 4 anchors (0, 5, 7, 12) plus a small amount of "count up/down from the nearest anchor" arithmetic is a dramatically smaller cognitive load, while covering the identical information.

**A genuinely honest note on pace: full fretboard fluency is a long-term skill, not a one-lesson outcome.** This lesson gives you the METHOD (the cycle, the anchors, the octave rule) — actually becoming fast and fluent at recalling any note on any string happens through repeated, casual use over weeks and months, the same slow-then-fast arc (Module 9) as every physical technique in this course, just applied to a piece of knowledge instead of a movement.`,
    contentHi: `**E-to-F aur B-to-C "unke beech koi sharp nahi" exception practically kyun matter karta hai, sirf trivia nahi.** Ye do spots wahan hain jahan 12-note cycle compress hota hai, aur unhe bhoolna manually ek fretboard position calculate karte waqt off-by-one errors ka sabse common source hai — exactly jaanna ki cycle mein ye do "narrow" spots kahan hain ek specific, predictable category of mistake ko prevent karta hai.

**Anchor points linear memorization se cognitively better kyun kaam karte hain.** Ye Module 10 ke chunking principle ka pure memorization par apply hona hai: 12 arbitrary-feeling facts (ek string par frets 0-11) reliably hold karna hard hai, lekin 4 anchors (0, 5, 7, 12) plus thodi si "nearest anchor se count up/down" arithmetic ek dramatically chhota cognitive load hai, identical information cover karte hue.

**Pace par ek genuinely honest note: full fretboard fluency ek long-term skill hai, ek-lesson outcome nahi.** Ye lesson tumhe METHOD deta hai (cycle, anchors, octave rule) — actually kisi bhi string par kisi bhi note ko recall karne mein fast aur fluent banna hafton aur mahino ke repeated, casual use se hota hai, wahi slow-then-fast arc (Module 9) is course ki har physical technique jaisa, bas ek movement ke bajaye ek piece of knowledge par apply hota hua.`,

    examples: [
      {
        title: 'The full low E string, frets 0-12, with anchor points visible',
        titleHi: 'Poora low E string, frets 0-12, anchor points visible ke saath',
        previewHeight: 340,
        code: `Fret:  0  1  2  3  4  5  6  7  8  9  10 11 12
Note:  E  F  F# G  G# A  A# B  C  C# D  D# E

Anchors to memorize first: fret 0 (E), fret 5 (A), fret 7 (B), fret 12 (E).
Everything else: count up/down from the nearest anchor.`,
        preview: diagramPreviewHtml(fretboardMapSvg(12), 'Every note on every string, frets 0-12 — the complete map this lesson is teaching you to navigate, not memorize all at once.'),
        explain:
          'This full map looks overwhelming shown all at once — that\'s deliberate, to make the point that no one memorizes it as one giant table. The anchor-point method is how every fluent player actually holds this information, a handful of reference points plus fast counting, not 72 rote-memorized cells.',
        explainHi:
          'Ye poora map ek saath dikhaaya jaana overwhelming lagta hai — ye deliberate hai, ye point banane ke liye ki koi bhi ise ek giant table ki tarah memorize nahi karta. Anchor-point method wo hai jis se har fluent player actually ye information hold karta hai, mutthi bhar reference points plus fast counting, 72 rote-memorized cells nahi.',
      },
    ],

    mistakes: [
      {
        wrong: 'Trying to memorize all 12 fret positions on a string as one long, undifferentiated list.',
        right: 'Learn the 4 anchor points (0, 5, 7, 12) first, then calculate other positions by counting from the nearest anchor.',
        why: 'A flat, undifferentiated list is genuinely harder to recall reliably under pressure than a small set of anchors plus simple counting — this is the same chunking-beats-cramming principle from Module 10, applied here to pure memorization.',
        whyHi: 'Ek flat, undifferentiated list pressure ke neeche reliably recall karna ek chhote set of anchors plus simple counting se genuinely hard hai — ye wahi chunking-beats-cramming principle hai Module 10 se, yahan pure memorization par apply hote hue.',
      },
    ],

    realWorld: [
      {
        en: 'Every time a bandmate says "play a C there" or a chord chart says "capo 2," fluent fretboard knowledge is what turns that instruction into an instant, confident action rather than a pause to calculate.',
        hi: 'Jab bhi ek bandmate kehta hai "wahan ek C bajao" ya ek chord chart "capo 2" kehta hai, fluent fretboard knowledge hi wo hai jo us instruction ko ek instant, confident action mein badalta hai, calculate karne ke liye ek pause ke bajaye.',
      },
    ],

    interviewQA: [
      {
        q: 'Do I need to memorize the notes on ALL 6 strings, or just some of them?',
        qHi: 'Kya mujhe SAARI 6 strings ke notes memorize karne hain, ya sirf kuch?',
        a: "Eventually all 6, but the low E and A strings are the highest priority — they're the root strings for Module 16-17's movable power-chord and barre shapes, so fluency there has the most immediate practical payoff.",
        aHi: 'Eventually saari 6, lekin low E aur A strings sabse highest priority hain — wo Module 16-17 ke movable power-chord aur barre shapes ke root strings hain, isliye wahan fluency ka sabse immediate practical payoff hai.',
      },
    ],

    exercises: [
      {
        task: 'Without looking at a reference, write out the note at every fret from 0 to 12 on the low E string, using only the anchor-and-count method (not guessing or looking up).',
        taskHi: 'Bina reference dekhe, low E string par fret 0 se 12 tak har fret ka note likho, sirf anchor-and-count method use karke (guess karke ya lookup karke nahi).',
        hint: 'If you get stuck partway, that specific stuck point is exactly where you need more anchor-point practice — note it and revisit before moving to Lesson 2.',
        hintHi: 'Agar beech mein stuck ho jaao, wahi specific stuck point exactly wo hai jahan tumhe zyada anchor-point practice chahiye — use note karo aur Lesson 2 par jaane se pehle revisit karo.',
      },
    ],

    keyTakeaways: [
      'The 12-note cycle (E F F# G G# A A# B C C# D D#) repeats every 12 frets — with no sharp between E-F and B-C, the two "narrow" spots worth knowing explicitly.',
      'Memorize anchor points (frets 0, 5, 7, 12) first, then calculate other positions by counting — not a flat 12-item list.',
      'Fret 12 always repeats the open string\'s note name, one octave higher — you only truly need to memorize frets 0-11.',
    ],
    keyTakeawaysHi: [
      '12-note cycle (E F F# G G# A A# B C C# D D#) har 12 frets mein repeat hota hai — E-F aur B-C ke beech koi sharp nahi, do "narrow" spots explicitly jaanne layak.',
      'Pehle anchor points memorize karo (frets 0, 5, 7, 12), phir count karke doosri positions calculate karo — ek flat 12-item list nahi.',
      'Fret 12 hamesha open string ka note name repeat karta hai, ek octave higher — tumhe sach mein sirf frets 0-11 memorize karne ki zaroorat hai.',
    ],
    guitarPractice: { sequences: [{"title":"Anchor points on the low E string","titleHi":"Low E string par anchor points","defaultBpm":70,"notes":[{"string":0,"fret":0,"beat":0},{"string":0,"fret":5,"beat":1},{"string":0,"fret":7,"beat":2},{"string":0,"fret":12,"beat":3}]}], earTraining: [{"string":0,"fret":0},{"string":0,"fret":3},{"string":0,"fret":5},{"string":0,"fret":7},{"string":0,"fret":8},{"string":0,"fret":10}] },
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'octave-shapes',
    title: 'Octave Shapes — Finding the Same Note in Multiple Places',
    titleHi: 'Octave Shapes — Same Note Ko Multiple Jagah Dhoondhna',
    description: 'The guitar\'s built-in redundancy: most notes exist in several different places at once, connected by a fixed, learnable shape.',
    descriptionHi: 'Guitar ki built-in redundancy: zyadatar notes ek saath kai alag jagah exist karte hain, ek fixed, learnable shape se connected.',
    difficulty: 'MEDIUM',
    duration: 15,
    order: 2,

    analogy: {
      en: '**Multiple staircases leading to the same floor of a building.** A tall building might have several different staircases that all eventually reach the 5th floor — different paths, identical destination. The guitar has genuine physical redundancy built in: the same pitch is reachable via several different string/fret combinations, connected by a consistent, learnable geometric pattern.',
      hi: '**Ek building ke same floor tak le jaane wali multiple staircases.** Ek tall building mein kai alag staircases ho sakti hain jo sab eventually 5th floor tak pahunchti hain — alag paths, identical destination. Guitar mein genuine physical redundancy built in hai: wahi pitch kai alag string/fret combinations ke through reachable hai, ek consistent, learnable geometric pattern se connected.',
    },

    simple: `**The most useful octave shape, precisely:** from any note on the low E or A string, the SAME note name (one octave higher) is found 2 strings up and 2 frets over.

\`\`\`
Low E string, fret 3 = G.
Move 2 strings up (to the D string) and 2 frets over (to fret 5) = G, one octave higher.
\`\`\`

**Why this specific shape is worth memorizing as a fixed pattern**, rather than recalculating from scratch each time: it's the SAME "2 strings up, 2 frets over" relationship everywhere on the neck, for any starting note on the low E or A string — one small geometric rule replaces needing to independently know dozens of individual octave pairs.`,
    simpleHi: `**Sabse useful octave shape, precisely:** low E ya A string par kisi bhi note se, wahi note name (ek octave higher) 2 strings upar aur 2 frets aage milta hai.

\`\`\`
Low E string, fret 3 = G.
2 strings upar move karo (D string tak) aur 2 frets aage (fret 5 tak) = G, ek octave higher.
\`\`\`

**Ye specific shape ek fixed pattern ki tarah memorize karne layak kyun hai**, har baar scratch se recalculate karne ke bajaye: ye SAME "2 strings up, 2 frets over" relationship har jagah neck par hai, low E ya A string par kisi bhi starting note ke liye — ek chhota geometric rule dazzon individual octave pairs ko independently jaanne ki zaroorat replace kar deta hai.`,

    content: `**Why this specific "2 strings up, 2 frets over" shape works consistently, connecting to Module 2\'s tuning intervals.** Standard tuning\'s string-to-string intervals are mostly a fixed musical distance apart (a "4th," in music-theory terms Module 19 will formalize) — this consistent tuning interval is exactly why the SAME geometric octave shape works starting from any fret on the low E or A string. If the tuning intervals were irregular, no single fixed shape would work everywhere; the fact that one does is a direct consequence of how the guitar happens to be tuned.

**A genuinely practical use for octave shapes: quickly verifying you\'ve found the right note.** If you calculate a note using Lesson 1\'s anchor method, you can cross-check it by finding the SAME note name via its octave shape elsewhere on the neck — if both methods agree, your calculation is very likely correct, giving you a built-in error-checking technique.

**Connecting forward to Module 22\'s pentatonic scale work.** Octave shapes are exactly how many scale patterns (Module 22) extend across the full neck rather than staying confined to one small area — recognizing "this is the same note, one octave up, same relative shape" is a skill that recurs directly when scale boxes connect to each other later in the course.`,
    contentHi: `**Ye specific "2 strings up, 2 frets over" shape consistently kyun kaam karti hai, Module 2 ke tuning intervals se connect karte hue.** Standard tuning ke string-to-string intervals mostly ek fixed musical distance apart hote hain (ek "4th," music-theory terms mein jo Module 19 formalize karega) — ye consistent tuning interval exactly wo reason hai ki SAME geometric octave shape low E ya A string par kisi bhi fret se shuru hote hue kaam karti hai. Agar tuning intervals irregular hote, koi single fixed shape har jagah kaam nahi karta; ye fact ki ek karta hai directly is baat ka consequence hai ki guitar kaise tuned hai.

**Octave shapes ka ek genuinely practical use: quickly verify karna ki tumne sahi note dhoondha hai.** Agar tum Lesson 1 ke anchor method se ek note calculate karo, tum ise cross-check kar sakte ho uske octave shape se neck mein kahin aur wahi note name dhoondh kar — agar dono methods agree karein, tumhari calculation likely correct hai, tumhe ek built-in error-checking technique deta hai.

**Ye aage Module 22 ke pentatonic scale kaam se kaise connect hota hai.** Octave shapes exactly wahi hain jis se bahut saare scale patterns (Module 22) poori neck ke across extend hote hain, ek chhote area mein confined rehne ke bajaye — "ye same note hai, ek octave upar, same relative shape" recognize karna ek skill hai jo baad mein course mein directly recur hoti hai jab scale boxes ek doosre se connect hote hain.`,

    examples: [
      {
        title: 'The octave shape from three different starting points',
        titleHi: 'Teen alag starting points se octave shape',
        previewHeight: 340,
        code: `Low E fret 3 (G) -> D string fret 5 (G, one octave up)
Low E fret 7 (B) -> D string fret 9 (B, one octave up)
A string fret 2 (B) -> G string fret 4 (B, one octave up)`,
        preview: diagramPreviewHtml(
          fretboardMapSvg(9, [
            [0, 3],
            [2, 5],
            [0, 7],
            [2, 9],
            [1, 2],
            [3, 4],
          ]),
          'Three octave pairs highlighted — notice every pair is exactly "2 strings up, 2 frets over" from its partner, the same fixed shape each time.',
        ),
        explain:
          'Seeing three genuinely different starting positions all follow the identical "2 up, 2 over" geometric relationship is the clearest possible proof that this is one learnable shape, not three separate facts to memorize.',
        explainHi:
          'Teen genuinely alag starting positions ko sabko identical "2 up, 2 over" geometric relationship follow karte dekhna clearest possible proof hai ki ye ek learnable shape hai, memorize karne ke liye teen separate facts nahi.',
      },
    ],

    mistakes: [
      {
        wrong: 'Treating each octave pair as an independent fact to separately memorize, rather than one repeating geometric shape.',
        right: 'Learn the single "2 strings up, 2 frets over" rule once, and apply it as a calculation from any starting point.',
        why: 'One geometric rule applied everywhere is dramatically less to remember than dozens of independent note-pair facts — the same anchor-and-calculate efficiency from Lesson 1, applied to a different kind of fretboard knowledge.',
        whyHi: 'Har jagah apply hua ek geometric rule dazzon independent note-pair facts se dramatically kam yaad rakhna hai — wahi anchor-and-calculate efficiency Lesson 1 se, ek alag tarah ki fretboard knowledge par apply hoti hui.',
      },
    ],

    realWorld: [
      {
        en: 'Octave shapes are exactly how players quickly play the same melodic line in two different registers for a fuller sound, or how a bassist and guitarist can lock onto the "same" note despite playing in different physical positions on their respective instruments.',
        hi: 'Octave shapes exactly wo hain jis se players ek fuller sound ke liye same melodic line ko do alag registers mein quickly bajaate hain, ya ek bassist aur guitarist "same" note par lock ho sakte hain chahe apne respective instruments par alag physical positions mein bajaa rahe hon.',
      },
    ],

    interviewQA: [
      {
        q: 'Does this "2 strings up, 2 frets over" shape work between EVERY pair of adjacent strings, or only some?',
        qHi: 'Kya ye "2 strings up, 2 frets over" shape HAR pair of adjacent strings ke beech kaam karta hai, ya sirf kuch?',
        a: "It works consistently from the low E and A strings specifically (crossing the G-B string boundary breaks the pattern slightly, because that one pair of strings is tuned to a different interval than the others — a detail Module 19's interval theory will explain fully).",
        aHi: 'Ye specifically low E aur A strings se consistently kaam karta hai (G-B string boundary cross karna pattern ko slightly break karta hai, kyunki strings ka wo ek pair doosron se ek alag interval mein tuned hai — ek detail jo Module 19 ki interval theory poori tarah explain karegi).',
      },
    ],

    exercises: [
      {
        task: 'Pick any note you know on the low E or A string. Use the "2 strings up, 2 frets over" rule to find its octave, then verify by counting from anchors (Lesson 1) that both notes genuinely share the same name.',
        taskHi: 'Low E ya A string par koi bhi note pick karo jo tumhe pata hai. Uska octave dhoondhne ke liye "2 strings up, 2 frets over" rule use karo, phir anchors se count karke (Lesson 1) verify karo ki dono notes genuinely same name share karte hain.',
        hint: 'This cross-checking exercise is itself the error-checking habit this lesson recommends — doing it deliberately now builds the habit for when you\'ll need it in less controlled situations later.',
        hintHi: 'Ye cross-checking exercise khud wo error-checking habit hai jo ye lesson recommend karta hai — ise abhi deliberately karna wo habit build karta hai jab tumhe baad mein kam controlled situations mein iski zaroorat hogi.',
      },
    ],

    keyTakeaways: [
      'The same note (one octave up) is found 2 strings up and 2 frets over from any note on the low E or A string.',
      'This works consistently because of standard tuning\'s fixed string-to-string interval — one geometric shape, not independent facts.',
      'Octave shapes double as a built-in cross-check for Lesson 1\'s anchor-and-count note calculations.',
    ],
    keyTakeawaysHi: [
      'Wahi note (ek octave upar) low E ya A string par kisi bhi note se 2 strings upar aur 2 frets aage milta hai.',
      'Ye consistently kaam karta hai standard tuning ke fixed string-to-string interval ki wajah se — ek geometric shape, independent facts nahi.',
      'Octave shapes Lesson 1 ke anchor-and-count note calculations ke liye ek built-in cross-check ki tarah bhi kaam karte hain.',
    ],
    guitarPractice: { sequences: [{"title":"G, low E to D string (2 up, 2 over)","titleHi":"G, low E se D string (2 up, 2 over)","defaultBpm":70,"notes":[{"string":0,"fret":3,"beat":0},{"string":2,"fret":5,"beat":1}]}] },
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'using-the-map-for-movable-shapes',
    title: 'Using the Map: Giving Movable Shapes Real Targets',
    titleHi: 'Map Use Karna: Movable Shapes Ko Real Targets Dena',
    description: 'Closing the loop from Module 16-17 — now you can calculate exactly which fret to land on for any target power chord or barre chord.',
    descriptionHi: 'Module 16-17 se loop close karna — ab tum exactly calculate kar sakte ho ki kisi bhi target power chord ya barre chord ke liye kaunsi fret par land karna hai.',
    difficulty: 'MEDIUM',
    duration: 15,
    order: 3,

    analogy: {
      en: '**A GPS coordinate, not just a compass direction.** Module 16-17 gave you the compass — "this shape is movable, slide it anywhere." This lesson gives you the actual coordinates — "slide it specifically HERE for the chord you actually want." A movable shape without fretboard knowledge is direction without a destination.',
      hi: '**Ek GPS coordinate, sirf ek compass direction nahi.** Module 16-17 ne tumhe compass diya — "ye shape movable hai, ise kahin bhi slide karo." Ye lesson tumhe actual coordinates deta hai — "specifically YAHAN slide karo us chord ke liye jo tum actually chahte ho." Fretboard knowledge ke bina ek movable shape ek destination ke bina direction hai.',
    },

    simple: `**Putting it together, concretely:** to play a D5 power chord (Module 16\'s movable E-shape, rooted on the low E string), find where D is on the low E string using Lesson 1\'s anchor method — fret 10 — and slide the E5 shape there.

**Same process for barre chords (Module 17):** want a Bb (B-flat) major barre chord using the E-shape family? Find Bb on the low E string (fret 6, one below B at fret 7) and barre there.

**The general recipe, usable for any target chord from here forward:**
1. Identify which root string your movable shape uses (low E for E-shape family, A for A-shape family).
2. Find your target note on that string (Lesson 1\'s anchor method, or Lesson 2\'s octave cross-check).
3. Slide the shape to that fret.`,
    simpleHi: `**Ise saath mein rakhna, concretely:** ek D5 power chord bajaane ke liye (Module 16 ka movable E-shape, low E string par rooted), Lesson 1 ke anchor method use karke dhoondo ki low E string par D kahan hai — fret 10 — aur E5 shape ko wahan slide karo.

**Barre chords ke liye same process (Module 17):** E-shape family use karke ek Bb (B-flat) major barre chord chahiye? Low E string par Bb dhoondo (fret 6, B se ek neeche fret 7 par) aur wahan barre karo.

**General recipe, yahan se aage kisi bhi target chord ke liye usable:**
1. Identify karo ki tumhara movable shape kaunsi root string use karta hai (E-shape family ke liye low E, A-shape family ke liye A).
2. Us string par apna target note dhoondo (Lesson 1 ka anchor method, ya Lesson 2 ka octave cross-check).
3. Shape ko us fret tak slide karo.`,

    content: `**Why this lesson is genuinely the payoff of the entire module, not just another example.** Modules 16-17 taught real, physical, movable shapes — genuinely useful skills on their own. But without this lesson\'s content, using them for a SPECIFIC target chord required either trial-and-error or an external reference (a chord chart telling you which fret). This lesson removes that dependency entirely — you can now calculate the correct fret yourself, from first principles, for any chord name you\'re given.

**Why this specifically completes the "read a chord chart independently" skill this course has been building since Module 2.** A real chord chart might say "Bb" with no diagram at all, assuming you know how to find it — Module 2 taught you to read a diagram when given one; this lesson teaches you to construct the equivalent knowledge yourself when you\'re NOT given one, which is a genuinely more advanced and more independent skill.

**A closing thought for Module 18 as a whole, and Part VII\'s opening.** Everything in this module has been in service of one goal: making the abstract "the fretboard has 12 repeating notes" fact from Module 2 into a genuinely usable, calculable tool. Module 19 builds directly on this same fretboard fluency to explain WHY specific notes combine into chords in the first place — the map you\'ve just learned to read is the foundation the rest of Part VII assumes you have.`,
    contentHi: `**Ye lesson genuinely poore module ka payoff kyun hai, sirf ek aur example nahi.** Modules 16-17 ne real, physical, movable shapes sikhaye — apne aap mein genuinely useful skills. Lekin is lesson ke content ke bina, unhe ek SPECIFIC target chord ke liye use karna ya to trial-and-error maangta tha ya ek external reference (ek chord chart jo tumhe bataye kaunsi fret). Ye lesson us dependency ko poori tarah hata deta hai — ab tum khud correct fret calculate kar sakte ho, first principles se, kisi bhi diye gaye chord name ke liye.

**Ye specifically "ek chord chart independently padhna" skill ko kaise complete karta hai jo ye course Module 2 se build kar raha hai.** Ek real chord chart bina kisi diagram ke "Bb" keh sakta hai, ye assume karte hue ki tumhe use dhoondhna aata hai — Module 2 ne tumhe sikhaya ki ek diagram diye jaane par use kaise padhein; ye lesson tumhe sikhata hai ki jab tumhe NAHI diya jaaye tab equivalent knowledge khud kaise construct karein, jo ek genuinely zyada advanced aur zyada independent skill hai.

**Module 18 ke poore taur par, aur Part VII ki opening ke liye ek closing thought.** Is module mein sab kuch ek goal ki service mein raha hai: Module 2 ke abstract "fretboard mein 12 repeating notes hain" fact ko ek genuinely usable, calculable tool mein badalna. Module 19 isi fretboard fluency par directly build karta hai ye explain karne ke liye ki WHY specific notes pehli jagah chords mein combine hote hain — jo map tumne abhi padhna seekha hai wahi foundation hai jise Part VII ka baaki hissa assume karta hai tumhare paas hai.`,

    examples: [
      {
        title: 'Finding D on the low E string for a D5 power chord',
        titleHi: 'D5 power chord ke liye low E string par D dhoondhna',
        previewHeight: 340,
        code: `Anchor: fret 0 = E, fret 5 = A.
D is one semitone below E's octave (fret 12), or 2 up from A's fret-5 position.
Count: fret 5 (A) + 5 semitones = fret 10 = D.
Slide the E5 shape (Module 16) to fret 10 -> D5.`,
        preview: diagramPreviewHtml(
          fretboardMapSvg(12, [[0, 10]]),
          'D highlighted at fret 10 on the low E string — this is exactly where Module 16\'s movable E5 shape needs to land for a D5 power chord.',
        ),
        explain:
          'This single highlighted cell is the concrete endpoint of everything Modules 16-18 have built toward — a specific, calculable, correct answer to "where do I put my movable shape for THIS chord," arrived at through reasoning rather than lookup.',
        explainHi:
          'Ye single highlighted cell Modules 16-18 ne jiske taraf sab kuch banaya hai uska concrete endpoint hai — "is CHORD ke liye main apna movable shape kahan rakhoon" ka ek specific, calculable, correct answer, lookup ke bajaye reasoning se pahuncha hua.',
      },
    ],

    mistakes: [
      {
        wrong: 'Relying on an external chord chart or reference every time a movable shape needs to target a specific chord, without attempting the calculation yourself.',
        right: 'Use the 3-step recipe (identify root string, find the note, slide the shape) to calculate the target fret independently.',
        why: 'External references are a fine convenience, but never practicing the calculation means the underlying fretboard fluency this module built never gets reinforced or genuinely internalized.',
        whyHi: 'External references ek theek convenience hain, lekin calculation ki kabhi practice na karna matlab hai is module ne jo underlying fretboard fluency build ki wo kabhi reinforced ya genuinely internalized nahi hoti.',
      },
    ],

    realWorld: [
      {
        en: 'A working musician handed a chord chart in an unfamiliar key, with no diagrams, relies on exactly this calculation skill to play correctly on the spot — this is a genuine, practical professional competency, not an academic exercise.',
        hi: 'Ek working musician jise ek unfamiliar key mein ek chord chart diya jaaye, bina diagrams ke, exactly is calculation skill par rely karta hai spot par correctly bajaane ke liye — ye ek genuine, practical professional competency hai, ek academic exercise nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'Once I know this calculation method, do I still need to memorize common chord positions?',
        qHi: 'Ek baar jab mujhe ye calculation method pata ho, kya mujhe abhi bhi common chord positions memorize karni hain?',
        a: "Over time, frequently-used positions (like F at fret 1, or common power chords) become memorized naturally through repetition, the same way frequently-typed words don't require conscious spelling-out anymore. The calculation method is the reliable fallback for anything not yet automatic, not a replacement for that natural memorization.",
        aHi: 'Time ke saath, frequently-used positions (jaise fret 1 par F, ya common power chords) repetition ke through naturally memorized ho jaate hain, waise hi jaise frequently-typed words ko ab conscious spelling-out ki zaroorat nahi hoti. Calculation method us cheez ke liye reliable fallback hai jo abhi automatic nahi hai, us natural memorization ka replacement nahi.',
      },
    ],

    exercises: [
      {
        task: 'Using the 3-step recipe, calculate the correct fret for a C5 power chord (E-shape family, root on low E string) and a G major barre chord (A-shape family, root on A string), without looking up either.',
        taskHi: '3-step recipe use karke, C5 power chord (E-shape family, root low E string par) aur G major barre chord (A-shape family, root A string par) ke liye correct fret calculate karo, dono ko lookup kiye bina.',
        hint: 'Cross-check each answer using Lesson 2\'s octave shape from a different starting point — if both methods agree, you can be confident the calculation is correct.',
        hintHi: 'Har answer ko Lesson 2 ke octave shape se ek alag starting point se cross-check karo — agar dono methods agree karein, tum confident ho sakte ho ki calculation correct hai.',
      },
    ],

    keyTakeaways: [
      'The 3-step recipe: identify the root string for your movable shape, find the target note (Lesson 1), slide the shape there.',
      'This turns Module 16-17\'s movable shapes from mechanical tricks into genuinely usable tools for any target chord.',
      'It also completes independent chord-chart reading — no longer needing a diagram to know where to place a movable shape.',
    ],
    keyTakeawaysHi: [
      '3-step recipe: apne movable shape ke liye root string identify karo, target note dhoondo (Lesson 1), shape ko wahan slide karo.',
      'Ye Module 16-17 ke movable shapes ko mechanical tricks se genuinely usable tools mein badalta hai kisi bhi target chord ke liye.',
      'Ye independent chord-chart reading bhi complete karta hai — ab ek movable shape kahan rakhna hai jaanne ke liye ek diagram ki zaroorat nahi.',
    ],
    guitarPractice: { sequences: [{"title":"D5 power chord, calculated from the map","titleHi":"D5 power chord, map se calculated","defaultBpm":80,"notes":[{"string":0,"fret":10,"beat":0,"finger":1},{"string":1,"fret":12,"beat":1,"finger":3},{"string":2,"fret":12,"beat":2,"finger":4}]}] },
  },
];
