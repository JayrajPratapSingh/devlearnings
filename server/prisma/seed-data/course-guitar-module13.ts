/**
 * Guitar Course — Module 13: Your First 3 Songs, lessons 1-3.
 *
 * Three original practice pieces (not real copyrighted songs — full chord
 * charts for real songs are easy to find online once you know how to read
 * one, which Module 2 already taught), each applying everything through
 * Module 12 to a real, complete, playable piece rather than an isolated
 * drill.
 *
 * Lesson 1: "Evening Walk" — 3 chords, the DDU UDU pattern, no surprises.
 * Lesson 2: "Quiet Morning" — 4 chords, a chord change on an off-beat.
 * Lesson 3: "Roadside" — adds a chuck hit and a capo-friendly structure,
 *           bridging into Module 14.
 */

import type { CourseLesson } from './course-js-module1';
import { chordFamilyHtml, diagramPreviewHtml, strumPatternSvg } from './guitar-diagrams';
import { CHORDS } from './guitar-chords-data';

export const GUITAR_MODULE_13: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'first-song-evening-walk',
    title: 'Your First Full Song: "Evening Walk"',
    titleHi: 'Tumhara Pehla Poora Song: "Evening Walk"',
    description: 'Three chords you already know, one pattern you already know, combined into a complete, real piece for the first time.',
    descriptionHi: 'Teen chords jo tumhe already pata hain, ek pattern jo tumhe already pata hai, pehli baar ek complete, real piece mein combine kiye gaye.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 1,

    analogy: {
      en: '**Assembling furniture you\'ve already built every individual piece of.** Every chord, every strum motion, every technique this song needs has already been built separately in Modules 1-12. This lesson is pure assembly — putting known pieces together in a specific order — not new construction.',
      hi: '**Aisa furniture assemble karna jiska har individual piece tum already bana chuke ho.** Har chord, har strum motion, har technique jo is song ko chahiye already Modules 1-12 mein separately ban chuka hai. Ye lesson pure assembly hai — known pieces ko ek specific order mein saath rakhna — nayi construction nahi.',
    },

    simple: `**"Evening Walk" — an original 3-chord practice piece.**

Chords used: **Em, C, G** (all from Modules 4-5). Pattern: the DDU UDU family from Module 8.

\`\`\`
Section A (4 bars):  Em . . .  |  C . . .  |  G . . .  |  Em . . .
Section B (4 bars):  C . . .   |  G . . .  |  Em . . .  |  C . . .
(Repeat Section A to end.)
\`\`\`

Each chord gets one full bar (8 strums of the DDU UDU pattern) before changing. This is deliberately generous timing — the goal for a first full song is smooth, unrushed chord changes using Module 6's anchor-finger technique, not speed.

**How to practice it:** loop just Section A first (Module 6's drill technique, extended from 2 chords to 4). Once solid, add Section B. Only combine the full thing once both sections are independently comfortable.`,
    simpleHi: `**"Evening Walk" — ek original 3-chord practice piece.**

Use hue chords: **Em, C, G** (sab Modules 4-5 se). Pattern: Module 8 ka DDU UDU family.

\`\`\`
Section A (4 bars):  Em . . .  |  C . . .  |  G . . .  |  Em . . .
Section B (4 bars):  C . . .   |  G . . .  |  Em . . .  |  C . . .
(Section A ko end tak repeat karo.)
\`\`\`

Har chord ko ek poora bar milta hai (DDU UDU pattern ke 8 strums) badalne se pehle. Ye deliberately generous timing hai — ek pehle poore song ka goal smooth, unrushed chord changes hai Module 6 ki anchor-finger technique use karte hue, speed nahi.

**Ise kaise practice karein:** pehle sirf Section A loop karo (Module 6 ki drill technique, 2 chords se 4 tak extended). Ek baar solid ho jaaye, Section B add karo. Poori cheez sirf tab combine karo jab dono sections independently comfortable hon.`,

    content: `**Why this song deliberately gives each chord a full bar, rather than changing faster for interest.** A first full-song attempt should stress-test SMOOTH TRANSITIONS, not speed or complexity — a full bar per chord gives ample time to execute Module 6's anchor-finger technique cleanly, without the added pressure of a tight deadline. Faster chord changes (Module 13's later lessons, and real songs generally) build on this same foundation once it\'s solid.

**Why "Section A" and "Section B" as a structure, instead of one continuous 8-bar block.** Real songs are almost universally built from repeated, recombined SECTIONS (verses, choruses) rather than one long unique sequence — practicing with this structure now, even in a simple original piece, builds the pattern-recognition habit of "this is Section A again" that makes learning real songs later dramatically faster than treating every bar as unique.

**What "8 strums of DDU UDU per bar" specifically means, connecting back to Module 8.** Each bar contains one full repetition of the 8-symbol D _ D U _ U D U pattern — Module 8\'s notation directly tells you the physical motion for all 32 total strums in Section A (4 bars × 8 strums), which is a lot more approachable framed as "the same 8-motion pattern, four times" than as "32 individual strums to remember."`,
    contentHi: `**Ye song deliberately har chord ko ek poora bar kyun deta hai, interest ke liye faster change karne ke bajaye?** Ek pehla poora-song attempt SMOOTH TRANSITIONS stress-test karna chahiye, speed ya complexity nahi — har chord ko ek poora bar milna Module 6 ki anchor-finger technique cleanly execute karne ke liye ample time deta hai, ek tight deadline ke added pressure ke bina. Faster chord changes (Module 13 ke baad wale lessons, aur real songs generally) isi solid foundation par bante hain.

**"Section A" aur "Section B" ek structure ki tarah kyun, ek continuous 8-bar block ke bajaye.** Real songs almost universally repeated, recombined SECTIONS se bante hain (verses, choruses) ek lambi unique sequence ke bajaye — ab is structure ke saath practice karna, ek simple original piece mein bhi, "ye phir se Section A hai" wali pattern-recognition habit banata hai jo baad mein real songs seekhna dramatically faster banata hai har bar ko unique treat karne se.

**"Per bar DDU UDU ke 8 strums" specifically kya matlab rakhta hai, Module 8 se wapas connect karte hue.** Har bar mein 8-symbol D _ D U _ U D U pattern ka ek poora repetition hota hai — Module 8 ka notation directly Section A ke saare 32 total strums (4 bars × 8 strums) ke liye physical motion batata hai, jo "8-motion pattern, char baar" ki tarah framed hone par "32 individual strums yaad rakhne" se kahin zyada approachable hai.`,

    examples: [
      {
        title: 'The three chords, side by side, and the pattern',
        titleHi: 'Teen chords, saath saath, aur pattern',
        previewHeight: 340,
        code: `Section A: Em -> C -> G -> Em (one bar each)
Section B: C -> G -> Em -> C (one bar each)
Strum pattern, every bar: D _ D U _ U D U`,
        preview: chordFamilyHtml([CHORDS.Em, CHORDS.C, CHORDS.G], 'All three chords for "Evening Walk" — nothing here you haven\'t already learned.'),
        explain:
          'Seeing all three chords together one more time reinforces that this "new song" genuinely introduces zero new chord shapes — the newness is entirely in the SEQUENCING and COMBINATION, which is exactly the skill Module 6\'s anchor-finger analysis prepared you for.',
        explainHi:
          'Teenon chords ko ek baar aur saath dekhna reinforce karta hai ki ye "naya song" genuinely zero naye chord shapes introduce karta hai — newness poori tarah SEQUENCING aur COMBINATION mein hai, jo exactly wo skill hai jiske liye Module 6 ke anchor-finger analysis ne tumhe prepare kiya.',
      },
    ],

    mistakes: [
      {
        wrong: 'Trying to play the full song (both sections) immediately, without first looping each section separately.',
        right: 'Loop Section A alone until solid, then Section B alone, then combine — the same chunking principle from Module 10.',
        why: 'Attempting the full combination before either section is individually solid means struggling with chord accuracy AND section structure simultaneously, the exact cognitive overload Module 10 warned about.',
        whyHi: 'Kisi bhi section ke individually solid hone se pehle poora combination attempt karna matlab hai chord accuracy AUR section structure ke saath simultaneously struggle karna, wahi cognitive overload jiske against Module 10 ne warn kiya tha.',
      },
    ],

    realWorld: [
      {
        en: 'Once this piece feels comfortable, the exact same Em-C-G chord vocabulary and section-repeating structure appears (with different specific progressions) in an enormous number of real, well-known songs — searching an online chord chart site for songs using "Em C G" is a natural next step once you\'re ready to move beyond original practice pieces.',
        hi: 'Ek baar ye piece comfortable feel kare, exactly wahi Em-C-G chord vocabulary aur section-repeating structure (alag specific progressions ke saath) bahut bade number of real, well-known songs mein dikhta hai — "Em C G" use karne wale songs ke liye ek online chord chart site search karna ek natural next step hai ek baar jab tum original practice pieces se aage badhne ke liye ready ho.',
      },
    ],

    interviewQA: [
      {
        q: 'Is it cheating to practice on an original piece instead of a real, famous song?',
        qHi: 'Kya ek real, famous song ke bajaye ek original piece par practice karna cheating hai?',
        a: "Not at all — the mechanical skills (chord changes, strumming, timing) transfer completely regardless of whether the progression is from a famous song or written specifically for practice. Once these skills are solid, applying them to real songs you love is a natural, easy next step.",
        aHi: 'Bilkul nahi — mechanical skills (chord changes, strumming, timing) poori tarah transfer hote hain chahe progression ek famous song se ho ya specifically practice ke liye likhi gayi ho. Ek baar ye skills solid ho jaayein, unhe real songs par apply karna jo tumhe pasand hain ek natural, easy next step hai.',
      },
    ],

    exercises: [
      {
        task: 'Loop Section A alone for 2 minutes with a metronome (Module 9) at a comfortable tempo. Then loop Section B alone for 2 minutes. Only then, play the full piece once through.',
        taskHi: 'Ek comfortable tempo par metronome (Module 9) ke saath 2 minutes ke liye akele Section A loop karo. Phir 2 minutes ke liye akele Section B loop karo. Sirf tab, poori piece ek baar through bajao.',
        hint: 'If the full combination falls apart even though both sections were individually solid, the issue is likely the SPECIFIC transition between the two sections (G to C at the section boundary) — loop just that transition.',
        hintHi: 'Agar poora combination gir jaata hai chahe dono sections individually solid the, issue likely dono sections ke beech ka SPECIFIC transition hai (section boundary par G se C) — sirf us transition ko loop karo.',
      },
    ],

    keyTakeaways: [
      '"Evening Walk" uses only Em, C, G with the DDU UDU pattern — every piece was already known, this is pure assembly.',
      'Real songs are built from repeated, recombined sections — practicing with this structure now builds a transferable pattern-recognition habit.',
      'Loop each section separately before combining, the same chunking principle used throughout this course.',
    ],
    keyTakeawaysHi: [
      '"Evening Walk" sirf Em, C, G use karta hai DDU UDU pattern ke saath — har piece already known thi, ye pure assembly hai.',
      'Real songs repeated, recombined sections se bante hain — ab is structure ke saath practice karna ek transferable pattern-recognition habit banata hai.',
      'Combine karne se pehle har section ko separately loop karo, wahi chunking principle jo poore is course mein use hui hai.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'second-song-quiet-morning',
    title: 'Second Song: "Quiet Morning" — a Chord Change Mid-Bar',
    titleHi: 'Doosra Song: "Quiet Morning" — Ek Chord Change Mid-Bar',
    description: 'Four chords, and for the first time, a chord that changes halfway through a bar instead of neatly on the barline.',
    descriptionHi: 'Char chords, aur pehli baar, ek chord jo bar ke beech mein badalta hai neatly barline par ke bajaye.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: '**A recipe step that says "at the halfway point," not just "after step 3."** Most instructions are cleanly sequential. Occasionally one requires acting at a precise MIDPOINT of another step, which demands sharper attention. A mid-bar chord change is exactly that — the "pay closer attention here" moment of this song.',
      hi: '**Ek recipe step jo "halfway point par" kehta hai, sirf "step 3 ke baad" nahi.** Zyadatar instructions cleanly sequential hoti hain. Kabhi kabhi ek ko doosre step ke ek precise MIDPOINT par act karna zaroori hota hai, jo sharper attention demand karta hai. Ek mid-bar chord change exactly wahi hai — is song ka "yahan zyada dhyan do" moment.',
    },

    simple: `**"Quiet Morning" — adds Am and D to Em/C/G, and one mid-bar change.**

\`\`\`
Bar 1: Em (full bar)
Bar 2: Am (full bar)
Bar 3: C (half bar) -> D (half bar)   <- the new challenge
Bar 4: G (full bar)
(Repeat.)
\`\`\`

The Bar 3 change happens on the "&" of beat 2 (Module 8\'s counting: "1 & 2 & [change here] 3 & 4 &"). This is your first taste of changing chords somewhere other than a clean barline — a small step up in precision from Lesson 1.

**How to isolate this specifically:** loop just Bar 3 alone (C to D, changing on beat 2\'s "&") using Module 6\'s two-chord loop drill, counting out loud, before attempting the full 4-bar sequence.`,
    simpleHi: `**"Quiet Morning" — Em/C/G mein Am aur D add karta hai, aur ek mid-bar change.**

\`\`\`
Bar 1: Em (poora bar)
Bar 2: Am (poora bar)
Bar 3: C (half bar) -> D (half bar)   <- naya challenge
Bar 4: G (poora bar)
(Repeat.)
\`\`\`

Bar 3 ka change beat 2 ke "&" par hota hai (Module 8 ki counting: "1 & 2 & [change here] 3 & 4 &"). Ye tumhara pehla taste hai kisi aur jagah chords badalne ka ek clean barline ke alawa — Lesson 1 se precision mein ek small step up.

**Ise specifically kaise isolate karein:** sirf Bar 3 ko akele loop karo (C se D, beat 2 ke "&" par change karte hue) Module 6 ki two-chord loop drill use karke, zor se count karte hue, poori 4-bar sequence attempt karne se pehle.`,

    content: `**Why mid-bar changes are genuinely harder, mechanically, not just "more notes to remember."** A barline change gives your hand the ENTIRE previous chord\'s duration to prepare the next shape (Module 6\'s look-ahead habit has maximum time available). A mid-bar change compresses that preparation window to half — your anchor-finger analysis and minimal-motion execution (both Module 6) need to happen faster, with less margin for a slow or hesitant transition.

**Why this specific difficulty is introduced now, deliberately, rather than in Lesson 1.** Lesson 1 built confidence with maximally generous timing; this lesson introduces exactly ONE new difficulty (timing precision of the change point) while keeping everything else familiar (chords you mostly already know, a pattern you already know). This is chunking (Module 10) applied at the level of song difficulty itself — one new variable at a time, not several at once.

**How C-to-D specifically benefits from Module 6\'s anchor analysis.** Checking finger-by-finger (as Module 6 taught): C has finger 1 on B/fret1, D has finger 2 on high-e/fret2 — genuinely different fingers on different strings, so this pair has little natural anchor overlap, making it a legitimately harder change to execute fast. Knowing this in advance (rather than being surprised by the difficulty) is itself useful — some chord pairs are just harder, and that\'s a fact about the pair, not a personal failing.`,
    contentHi: `**Mid-bar changes mechanically genuinely harder kyun hain, sirf "yaad rakhne ke liye zyada notes" nahi.** Ek barline change tumhari hand ko poore previous chord ki duration deta hai agle shape ko prepare karne ke liye (Module 6 ki look-ahead habit ke paas maximum time available hota hai). Ek mid-bar change us preparation window ko half tak compress kar deta hai — tumhara anchor-finger analysis aur minimal-motion execution (dono Module 6) ko faster hona chahiye, ek slow ya hesitant transition ke liye kam margin ke saath.

**Ye specific difficulty ab kyun introduce hui hai, deliberately, Lesson 1 mein nahi.** Lesson 1 ne maximally generous timing ke saath confidence build ki; ye lesson exactly EK nayi difficulty introduce karta hai (change point ki timing precision) jabki baaki sab familiar rakhte hue (chords jo tumhe mostly already pata hain, ek pattern jo tumhe already pata hai). Ye chunking (Module 10) hai jo song difficulty ke level par hi apply hoti hai — ek time par ek nayi variable, ek saath kai nahi.

**C-se-D specifically Module 6 ke anchor analysis se kaise benefit hota hai.** Finger-by-finger check karte hue (jaise Module 6 ne sikhaya): C ke paas finger 1 B/fret1 par hai, D ke paas finger 2 high-e/fret2 par hai — genuinely alag fingers alag strings par, isliye is pair mein natural anchor overlap kam hai, jo ise fast execute karne ke liye ek legitimately harder change banata hai. Ise pehle se jaanna (difficulty se surprise hone ke bajaye) khud useful hai — kuch chord pairs bas harder hote hain, aur ye pair ke baare mein ek fact hai, personal failing nahi.`,

    examples: [
      {
        title: 'The four chords and the mid-bar change, visualized',
        titleHi: 'Char chords aur mid-bar change, visualized',
        previewHeight: 200,
        code: `Bar 3 counting: 1 & 2 &(change to D) 3 & 4 &
Strum pattern:  D _ D U   D  U D U
Chord:          --- C ---|--- D ---`,
        preview: diagramPreviewHtml(
          strumPatternSvg([
            { symbol: 'D', label: '1' },
            { symbol: '-', label: '&' },
            { symbol: 'D', label: '2' },
            { symbol: 'U', label: '&' },
            { symbol: 'D', label: '3' },
            { symbol: 'U', label: '&' },
            { symbol: 'D', label: '4' },
            { symbol: 'U', label: '&' },
          ]),
          'The change from C to D happens right after the "&" of beat 2 — everything before it is C, everything from beat 3 onward is D.',
        ),
        explain:
          'Overlaying the chord boundary directly onto the strum-pattern timeline (Module 8\'s notation) makes the exact change point unambiguous — this is exactly how real chord charts communicate mid-bar changes, so this visual habit transfers directly to reading them.',
        explainHi:
          'Chord boundary ko directly strum-pattern timeline (Module 8 ka notation) par overlay karna exact change point ko unambiguous banata hai — ye exactly wo tareeka hai jisse real chord charts mid-bar changes communicate karte hain, isliye ye visual habit directly unhe padhne mein transfer hoti hai.',
      },
    ],

    mistakes: [
      {
        wrong: 'Rushing the C-to-D change to try to "catch up" to the beat, sacrificing clean fretting for timing.',
        right: 'Slow the whole piece down (Module 9\'s step-down method) until the mid-bar change can happen cleanly, then gradually increase tempo.',
        why: 'A rushed, sloppy change teaches your hands the wrong motion at speed — better to be reliably correct at a slower tempo and build up, per Module 9\'s core lesson.',
        whyHi: 'Ek rushed, sloppy change tumhare hands ko speed par galat motion sikhata hai — better hai ek slower tempo par reliably correct hona aur build up karna, Module 9 ke core lesson ke hisaab se.',
      },
    ],

    realWorld: [
      {
        en: 'Mid-bar and off-beat chord changes are extremely common in real music — this small, deliberate step up in precision here is exactly what prepares you for the timing demands of real songs rather than only ever-simple barline changes.',
        hi: 'Mid-bar aur off-beat chord changes real music mein extremely common hain — yahan ye chhota, deliberate step up in precision exactly wo hai jo tumhe real songs ki timing demands ke liye prepare karta hai, sirf hamesha-simple barline changes ke liye nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'How do I know exactly when "the & of beat 2" is without a metronome running?',
        qHi: 'Metronome chalaye bina mujhe exactly kaise pata chalega ki "beat 2 ka &" kab hai?',
        a: "Practice it WITH a metronome first (Module 9), counting out loud, until the timing is internalized as muscle memory. Once solid, you'll be able to feel that exact midpoint even without the click running, the same way you can clap a familiar rhythm from memory.",
        aHi: 'Ise pehle ek metronome KE SAATH practice karo (Module 9), zor se count karte hue, jab tak timing muscle memory ki tarah internalize na ho jaaye. Ek baar solid ho jaaye, tum wo exact midpoint bina click chalaye bhi feel kar paoge, waise hi jaise tum memory se ek familiar rhythm clap kar sakte ho.',
      },
    ],

    exercises: [
      {
        task: 'Loop just Bar 3 (C to D, changing on beat 2\'s "&") for 2 minutes with a metronome, counting out loud. Then play the full 4-bar piece once through.',
        taskHi: 'Sirf Bar 3 (C se D, beat 2 ke "&" par change) ko 2 minutes ke liye metronome ke saath loop karo, zor se count karte hue. Phir poora 4-bar piece ek baar through bajao.',
        hint: 'If the mid-bar change consistently happens a bit late, you\'re likely starting the anchor-finger preparation too late — begin looking ahead (Module 6) right as beat 2 itself starts, not at the "&".',
        hintHi: 'Agar mid-bar change consistently thoda late hota hai, tum likely anchor-finger preparation bahut late shuru kar rahe ho — beat 2 khud shuru hote hi look ahead karna shuru karo (Module 6), "&" par nahi.',
      },
    ],

    keyTakeaways: [
      'Mid-bar chord changes compress the preparation window to half a barline change\'s time — a genuine step up in precision demand.',
      'C to D has little natural anchor overlap (different fingers, different strings) — a legitimately harder pair, not a personal difficulty.',
      'Isolate the specific mid-bar transition with the loop drill before attempting the full piece, per Module 10\'s chunking principle.',
    ],
    keyTakeawaysHi: [
      'Mid-bar chord changes preparation window ko ek barline change ke time ke half tak compress kar dete hain — precision demand mein ek genuine step up.',
      'C se D mein natural anchor overlap kam hai (alag fingers, alag strings) — ek legitimately harder pair, personal difficulty nahi.',
      'Poora piece attempt karne se pehle loop drill ke saath specific mid-bar transition isolate karo, Module 10 ke chunking principle ke hisaab se.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'third-song-roadside',
    title: 'Third Song: "Roadside" — Adding a Chuck',
    titleHi: 'Teesra Song: "Roadside" — Ek Chuck Add Karna',
    description: 'The most complete piece yet — five chords, a mid-bar change, and one chuck hit, bringing together everything since Module 1.',
    descriptionHi: 'Ab tak ka sabse complete piece — paanch chords, ek mid-bar change, aur ek chuck hit, Module 1 se sab kuch saath laate hue.',
    difficulty: 'HARD',
    duration: 20,
    order: 3,

    analogy: {
      en: '**A final exam that only tests material you\'ve already individually passed.** Nothing in this song is conceptually new — every chord, the mid-bar change technique, and the chuck have each already been learned and practiced separately. This lesson is a genuine integration test, not new content.',
      hi: '**Ek final exam jo sirf wo material test karta hai jo tum already individually pass kar chuke ho.** Is song mein kuch bhi conceptually naya nahi hai — har chord, mid-bar change technique, aur chuck sab already alag alag seekhe aur practice kiye ja chuke hain. Ye lesson ek genuine integration test hai, naya content nahi.',
    },

    simple: `**"Roadside" — five chords (Em, C, G, D, Am), a mid-bar change, and a chuck.**

\`\`\`
Bar 1: Em (full bar)
Bar 2: C (full bar)
Bar 3: G (half bar) -> D (half bar)
Bar 4: Am, with a chuck (Module 8) replacing the last upstroke
(Repeat.)
\`\`\`

**Why this piece uses a capo-friendly structure (setting up Module 14):** every chord here is one of the six "campfire" open shapes — none require a barre. This is intentional: Module 14 will show you how the exact same 4-bar structure can be shifted to different actual pitches using a capo, without changing a single finger shape.`,
    simpleHi: `**"Roadside" — paanch chords (Em, C, G, D, Am), ek mid-bar change, aur ek chuck.**

\`\`\`
Bar 1: Em (poora bar)
Bar 2: C (poora bar)
Bar 3: G (half bar) -> D (half bar)
Bar 4: Am, ek chuck (Module 8) ke saath jo last upstroke replace karta hai
(Repeat.)
\`\`\`

**Ye piece capo-friendly structure kyun use karta hai (Module 14 set up karte hue):** yahan har chord six "campfire" open shapes mein se ek hai — koi bhi barre require nahi karta. Ye intentional hai: Module 14 dikhayega ki exactly wahi 4-bar structure ek capo use karke alag actual pitches mein shift ho sakta hai, bina ek bhi finger shape badle.`,

    content: `**Why combining a mid-bar change AND a chuck in the same piece is a meaningful step up, not just "two hard things stacked."** Each individually (Lesson 2\'s mid-bar precision, Module 8\'s chuck) demands focused attention; doing both within one short piece tests whether each has become truly automatic, or whether it still consumes conscious effort that competes with the other. This is the real test of Module 10\'s "chunk mastery" — a skill isn\'t fully chunked until it survives being combined with another demanding skill.

**Why ending Part V\'s "songs" arc here, with exactly this piece, is a deliberate bridge to Module 14.** Every chord chosen is capo-compatible (open-position, no barre) specifically so Module 14 can take this exact piece and demonstrate transposition on material you already know cold — rather than needing to learn a new piece simultaneously with a new concept.

**A closing reflection on Modules 1-13 as a whole**, worth genuinely sitting with: everything in "Roadside" — posture, chord shapes, anchor fingers, strumming mechanics, timing, a chuck — was built in small, separately-verified pieces starting from literally zero guitar experience in Module 1. This piece is concrete proof the chunking-and-combining approach (Module 10) actually works, not just a claim about it.`,
    contentHi: `**Ek mid-bar change AUR ek chuck ko same piece mein combine karna ek meaningful step up kyun hai, sirf "do hard cheezein stacked" nahi.** Har ek individually (Lesson 2 ki mid-bar precision, Module 8 ka chuck) focused attention demand karta hai; dono ko ek short piece ke andar karna test karta hai ki kya har ek truly automatic ban chuka hai, ya kya wo abhi bhi conscious effort consume karta hai jo doosre se compete karta hai. Ye Module 10 ke "chunk mastery" ka real test hai — ek skill poori tarah chunked tab tak nahi hoti jab tak wo ek doosri demanding skill ke saath combine hone se survive na kare.

**Part V ke "songs" arc ko yahan, exactly is piece ke saath, khatam karna Module 14 ka ek deliberate bridge kyun hai.** Chosen har chord capo-compatible hai (open-position, koi barre nahi) specifically taaki Module 14 exactly ye piece le sake aur us material par transposition demonstrate kare jo tumhe already pakka pata hai — simultaneously ek naya piece seekhne ki zaroorat ke bajaye ek naye concept ke saath.

**Modules 1-13 ke poore taur par ek closing reflection**, genuinely sitte with karne layak: "Roadside" mein sab kuch — posture, chord shapes, anchor fingers, strumming mechanics, timing, ek chuck — chhote, separately-verified pieces mein bana tha Module 1 mein literally zero guitar experience se shuru hote hue. Ye piece concrete proof hai ki chunking-and-combining approach (Module 10) actually kaam karta hai, sirf uske baare mein ek claim nahi.`,

    examples: [
      {
        title: 'The full "Roadside" structure',
        titleHi: 'Poora "Roadside" structure',
        previewHeight: 200,
        code: `Bar 1: Em          Bar 2: C
Bar 3: G -> D (mid-bar, on beat 2's "&")
Bar 4: Am, chuck replacing the final upstroke`,
        preview: diagramPreviewHtml(
          strumPatternSvg([
            { symbol: 'D', label: '1' },
            { symbol: '-', label: '&' },
            { symbol: 'D', label: '2' },
            { symbol: 'U', label: '&' },
            { symbol: '-', label: '3' },
            { symbol: 'U', label: '&' },
            { symbol: 'D', label: '4' },
            { symbol: 'X', label: '&' },
          ]),
          'Bar 4\'s pattern, with the chuck (X) replacing what would otherwise be the final upstroke — Module 8\'s technique, now inside a real piece.',
        ),
        explain:
          'This is deliberately the same chuck-insertion pattern shape from Module 8\'s own example — recognizing it here, inside a full piece, is the actual payoff of having learned it as an isolated technique first.',
        explainHi:
          'Ye deliberately Module 8 ke apne example ka wahi chuck-insertion pattern shape hai — ise yahan, ek poore piece ke andar, recognize karna hi asal payoff hai use pehle ek isolated technique ki tarah seekhne ka.',
      },
    ],

    mistakes: [
      {
        wrong: 'Attempting "Roadside" as your very first full-song attempt, before Lessons 1-2\'s simpler pieces feel solid.',
        right: 'Work through Lessons 1 and 2 first — this piece deliberately combines difficulties that were each introduced separately for a reason.',
        why: 'Skipping the graduated difficulty this module was structured around reintroduces the exact cognitive overload Module 10 warned about — the sequencing here is deliberate scaffolding, not arbitrary ordering.',
        whyHi: 'Is module ke around structured graduated difficulty ko skip karna exactly wahi cognitive overload reintroduce karta hai jiske against Module 10 ne warn kiya tha — yahan ki sequencing deliberate scaffolding hai, arbitrary ordering nahi.',
      },
    ],

    realWorld: [
      {
        en: 'This is genuinely how real musicians learn new songs efficiently — identify the individually-hard moments (a fast change, a rhythmic hit), isolate and drill each one, then reassemble. "Roadside" has just made that real-world process explicit and guided for the first time.',
        hi: 'Ye genuinely wo tareeka hai jisse real musicians efficiently naye songs seekhte hain — individually-hard moments identify karo (ek fast change, ek rhythmic hit), har ek ko isolate aur drill karo, phir reassemble karo. "Roadside" ne pehli baar us real-world process ko explicit aur guided bana diya hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Now that I\'ve finished all three songs, what should I do next?',
        qHi: 'Ab jab maine teenon songs khatam kar liye, mujhe aage kya karna chahiye?',
        a: "Module 14 (the capo) picks up directly from \"Roadside,\" and beyond this course's structure, this is also the right moment to try applying everything to one real song you personally love, using an online chord chart — you now have every mechanical skill needed to approach one.",
        aHi: 'Module 14 (capo) directly "Roadside" se aage badhta hai, aur is course ke structure se pare, ye bhi wo sahi moment hai sab kuch ek real song par apply karne ki koshish karne ka jo tumhe personally pasand hai, ek online chord chart use karke — ab tumhare paas ek approach karne ke liye zaroori har mechanical skill hai.',
      },
    ],

    exercises: [
      {
        task: 'Play "Roadside" start to finish, 4 times in a row, without stopping to fix mistakes mid-attempt (fix between attempts, not during). Note which specific bar breaks down most often.',
        taskHi: '"Roadside" ko start se finish tak bajao, 4 baar row mein, mistakes fix karne ke liye mid-attempt ruke bina (attempts ke beech fix karo, dauraan nahi). Note karo ki kaunsa specific bar sabse zyada baar toot jaata hai.',
        hint: 'Whichever bar breaks down most is your next specific loop-drill target (Module 6) — you now have a precise, evidence-based next practice step rather than a vague sense of "the whole song needs work."',
        hintHi: 'Jo bhi bar sabse zyada toota hai wo tumhara agla specific loop-drill target hai (Module 6) — ab tumhare paas ek precise, evidence-based next practice step hai, "poore song ko kaam chahiye" ke vague sense ke bajaye.',
      },
    ],

    keyTakeaways: [
      '"Roadside" combines a mid-bar change and a chuck in one piece — a real test of whether each skill has become fully automatic.',
      'Every chord is capo-compatible (open-position, no barre) — a deliberate bridge into Module 14.',
      'Everything in this piece was built in small, separately-verified steps since Module 1 — concrete proof the chunking approach works.',
    ],
    keyTakeawaysHi: [
      '"Roadside" ek piece mein ek mid-bar change aur ek chuck combine karta hai — ek real test ki kya har skill poori tarah automatic ban chuki hai.',
      'Har chord capo-compatible hai (open-position, koi barre nahi) — Module 14 mein ek deliberate bridge.',
      'Is piece mein sab kuch Module 1 se chhote, separately-verified steps mein bana tha — concrete proof ki chunking approach kaam karta hai.',
    ],
  },
];
