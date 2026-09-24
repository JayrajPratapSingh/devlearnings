/**
 * Guitar Course — Module 21: The CAGED System, Completely, lessons 1-3.
 * Closes Part VII (Music Theory). Module 17 already previewed 2 of the
 * 5 shapes (E-shape, A-shape) as movable barre chords — this module
 * completes the set and shows how all 5 connect across the whole neck.
 */

import type { CourseLesson } from './course-js-module1';
import { chordFamilyHtml, chordPreviewHtml, diagramPreviewHtml, fretboardMapSvg } from './guitar-diagrams';
import { CAGED_C_SHAPES } from './guitar-chords-data';

export const GUITAR_MODULE_21: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'what-caged-means',
    title: 'What CAGED Means — Five Shapes, One System',
    titleHi: 'CAGED Ka Matlab — Paanch Shapes, Ek System',
    description: 'The five open chords from Modules 4-5 turn out to be the only five chord shapes that exist, repeating up the whole neck.',
    descriptionHi: 'Modules 4-5 ke paanch open chords actually wo sirf paanch chord shapes hain jo exist karte hain, poori neck upar repeat hote hue.',
    difficulty: 'HARD',
    duration: 20,
    order: 1,

    analogy: {
      en: '**Five letter stencils that can trace any word, just moved to different spots on the page.** You don\'t need infinite different stencils to write every possible word — five well-chosen shapes, repositioned, cover everything. CAGED is exactly this for chords: the five open shapes you already know (C, A, G, E, D) are literally the only five "stencils" a chord ever takes on the guitar — every other chord you\'ll ever play is one of these five, moved somewhere else on the neck.',
      hi: '**Paanch letter stencils jo kisi bhi word ko trace kar sakte hain, bas page par alag jagah move hote hue.** Har possible word likhne ke liye tumhe infinite alag stencils ki zaroorat nahi — paanch well-chosen shapes, repositioned, sab kuch cover karti hain. CAGED chords ke liye exactly yahi hai: paanch open shapes jo tumhe already pata hain (C, A, G, E, D) literally wo sirf paanch "stencils" hain jo ek chord guitar par kabhi leta hai — har doosra chord jo tum kabhi bajaoge in paanch mein se ek hi hai, neck par kahin aur move hui hui.',
    },

    simple: `**The claim, stated precisely:** every chord shape on the guitar is a movable version of one of the five open shapes — C, A, G, E, D — the exact chords taught in Modules 4-5. "CAGED" is simply these five letters in the order their shapes appear as you move up the neck from any starting root.

**What you\'ve already done, without the name:** Module 16 made the E-shape movable (power chords). Module 17 made the E-shape and A-shape fully movable (barre chords). This module simply completes the set — G-shape, C-shape (already movable, since open position IS "fret 0" of the C-shape), and D-shape — and, more importantly, shows how all five connect together to cover the ENTIRE neck for one chord.

**Why this reduces a seemingly infinite amount of guitar knowledge to five things:** without CAGED, "learning all the chords" can feel like memorizing an endless list of unrelated shapes. With CAGED, there are exactly five shapes, full stop — every major (and, with small modifications, minor) chord anywhere on the neck is one of these five, and you already know all five from Modules 4-5.`,
    simpleHi: `**Claim, precisely stated:** guitar par har chord shape paanch open shapes mein se ek ka movable version hai — C, A, G, E, D — exact chords jo Modules 4-5 mein sikhaaye gaye. "CAGED" simply in paanch letters ka order hai jaise tum kisi bhi starting root se neck upar move karte ho unki shapes appear hoti hain.

**Jo tum already kar chuke ho, naam ke bina:** Module 16 ne E-shape ko movable banaya (power chords). Module 17 ne E-shape aur A-shape ko fully movable banaya (barre chords). Ye module simply set complete karta hai — G-shape, C-shape (already movable, kyunki open position hi "fret 0" hai C-shape ka), aur D-shape — aur, zyada important, dikhaata hai ki sab paanch kaise saath connect hote hain poori NECK ko ek chord ke liye cover karne ke liye.

**Ye seemingly infinite guitar knowledge ko paanch cheezon mein kyun reduce karta hai:** CAGED ke bina, "sab chords seekhna" ek endless list of unrelated shapes memorize karne jaisa feel kar sakta hai. CAGED ke saath, exactly paanch shapes hain, full stop — kahin bhi neck par har major (aur, chhote modifications ke saath, minor) chord in paanch mein se ek hai, aur tumhe already Modules 4-5 se paanch ke paanch pata hain.`,

    content: `**Why CAGED\'s five shapes specifically, and not some other set.** The five open chords Module 4-5 chose to teach first (C, A, G, E, D) weren\'t arbitrary — they\'re the five open-position major shapes that use the guitar\'s six open strings efficiently. It\'s not a coincidence that these five, once made movable, happen to cover every possible root position without gaps; it\'s the reason they were the natural five to teach as fundamentals in the first place.

**Why "which shape at which fret" is fully determined by Module 18\'s fretboard map, not arbitrary.** Once you know where a target root note falls on the relevant string (Module 18), each CAGED shape's position is exactly determined — there\'s no guessing involved. Lesson 2 works through this explicitly using C major as the running example: five DIFFERENT shapes, five DIFFERENT neck positions, the exact same C major triad (Module 19) every time.

**A genuinely honest note on why this is often marketed as "premium" content.** The individual open shapes are taught everywhere for free. What tends to get gatekept is exactly what this module provides: the connective structure — WHY these five specific shapes, HOW they relate to each other positionally, and how they tile the entire neck without gaps or overlaps. That structural understanding, not the shapes themselves, is the actual "hidden" value — and it\'s built directly from tools (fretboard map, intervals, triads) this course already gave you for free in Modules 18-19.`,
    contentHi: `**CAGED ke paanch shapes specifically kyun, kisi aur set ke bajaye.** Wo paanch open chords jo Module 4-5 ne pehle sikhaane ke liye choose kiye (C, A, G, E, D) arbitrary nahi the — wo paanch open-position major shapes hain jo guitar ki six open strings ko efficiently use karte hain. Ye coincidence nahi hai ki ye paanch, ek baar movable banaaye jaane par, har possible root position ko bina gaps ke cover karte hain; yahi reason hai ki wo pehli jagah fundamentals ki tarah sikhaane ke liye natural paanch the.

**"Kaunsi fret par kaunsi shape" poori tarah Module 18 ke fretboard map se determined kyun hai, arbitrary nahi.** Ek baar jab tumhe pata ho ki relevant string par target root note kahan padta hai (Module 18), har CAGED shape ki position exactly determined hai — koi guessing involved nahi hai. Lesson 2 ise explicitly C major ko running example use karke work through karta hai: paanch ALAG shapes, paanch ALAG neck positions, exact same C major triad (Module 19) har baar.

**Ye often "premium" content ki tarah kyun marketed hota hai iske baare mein ek genuinely honest note.** Individual open shapes har jagah free mein sikhaaye jaate hain. Jo often gatekept hoti hai wo exactly wahi hai jo ye module deta hai: connective structure — WHY ye paanch specific shapes, HOW wo ek doosre se positionally related hain, aur kaise wo poori neck ko bina gaps ya overlaps ke tile karte hain. Wo structural understanding, shapes khud nahi, actual "hidden" value hai — aur ye directly un tools se bana hai (fretboard map, intervals, triads) jo ye course tumhe already Modules 18-19 mein free mein de chuka hai.`,

    examples: [
      {
        title: 'The five open shapes you already know — the raw material CAGED is built from',
        titleHi: 'Paanch open shapes jo tumhe already pata hain — raw material jisse CAGED bana hai',
        previewHeight: 320,
        code: `C (Module 5), A (Module 6), G (Module 5), E (Module 6), D (Module 5).
Five shapes, five letters, one system.`,
        preview: chordFamilyHtml(
          [CAGED_C_SHAPES.cShape],
          'The open C shape — the "C" in CAGED. Modules 21\'s job is showing this same chord in four MORE places using the other four shapes.',
        ),
        explain:
          'Starting from the single most familiar shape in this entire system grounds the abstract "five shapes cover everything" claim in something you\'ve been playing since Module 5.',
        explainHi:
          'Is poore system ki sabse familiar shape se shuru karna abstract "paanch shapes sab kuch cover karti hain" claim ko us cheez mein ground karta hai jo tum Module 5 se bajaate aaye ho.',
      },
    ],

    mistakes: [
      {
        wrong: 'Treating CAGED as five new chord shapes to learn, separate from the open chords already known.',
        right: 'Recognize CAGED as a new way of USING the five shapes already learned in Modules 4-6 — no new hand shapes, just new positions for familiar ones.',
        why: 'Believing there\'s new material to memorize here creates unnecessary intimidation around a system that\'s actually built entirely from things already practiced for over a dozen modules.',
        whyHi: 'Ye believe karna ki yahan naya material memorize karna hai ek unnecessary intimidation create karta hai ek aise system ke around jo actually poori tarah un cheezon se bana hai jo dozen se zyada modules se already practice kiya ja chuka hai.',
      },
    ],

    realWorld: [
      {
        en: 'A guitar teacher explaining "the whole neck" to a student in one coherent framework, rather than an endless catalog of chord shapes, is almost always reaching for CAGED — it\'s the standard organizing principle professional instructors use.',
        hi: 'Ek guitar teacher jo ek student ko "poori neck" ek coherent framework mein explain kar raha hai, endless catalog of chord shapes ke bajaye, almost hamesha CAGED ke liye reach kar raha hota hai — ye standard organizing principle hai jo professional instructors use karte hain.',
      },
    ],

    interviewQA: [
      {
        q: 'Does CAGED work for minor chords and 7th chords too, or only plain major chords?',
        qHi: 'Kya CAGED minor chords aur 7th chords ke liye bhi kaam karta hai, ya sirf plain major chords ke liye?',
        a: 'The same 5-shape logic extends to minor and 7th versions of each shape (Module 6 already gave you movable minor barre shapes for two of the five) — this module focuses on major triads to keep the core positional logic clear, but the same connecting structure applies once you adapt each shape\'s fingering the way Module 19 describes.',
        aHi: 'Wahi 5-shape logic har shape ke minor aur 7th versions tak extend hoti hai (Module 6 ne already do mein se do shapes ke liye movable minor barre shapes de diye the) — ye module major triads par focus karta hai core positional logic clear rakhne ke liye, lekin wahi connecting structure apply hoti hai ek baar jab tum har shape ki fingering ko us tareeke se adapt karte ho jo Module 19 describe karta hai.',
      },
    ],

    exercises: [
      {
        task: 'Without looking ahead to Lesson 2, write out the order C-A-G-E-D and, using Module 18\'s fretboard map, predict roughly which frets each shape might fall on for a C major chord, reasoning only from what you know about each shape\'s open-position root string.',
        taskHi: 'Lesson 2 ko aage dekhe bina, C-A-G-E-D order likho aur, Module 18 ke fretboard map use karke, roughly predict karo ki C major chord ke liye har shape kaunsi frets par gir sakti hai, sirf us se reasoning karte hue jo tumhe har shape ki open-position root string ke baare mein pata hai.',
        hint: 'The C-shape starts at fret 0 by definition (it\'s already open). Each subsequent shape\'s starting fret is where THAT shape\'s own root string would need to be to produce a C — a direct application of Module 18\'s note-finding method.',
        hintHi: 'C-shape definition se fret 0 par shuru hota hai (ye already open hai). Har agli shape ka starting fret wo hai jahan US shape ki apni root string ko ek C produce karne ke liye hona chahiye — Module 18 ke note-finding method ka ek direct application.',
      },
    ],

    keyTakeaways: [
      'CAGED stands for the five open shapes from Modules 4-6 (C, A, G, E, D), made movable — no new hand shapes, only new positions for familiar ones.',
      'These five shapes, once movable, cover every chord position on the neck with no gaps — the reason they were taught as the fundamental five in the first place.',
      'The genuinely valuable, often-gatekept part is the connective structure between the five shapes, not the shapes themselves — which Lesson 2 makes concrete.',
    ],
    keyTakeawaysHi: [
      'CAGED Modules 4-6 ki paanch open shapes (C, A, G, E, D) ke liye hai, movable banayi hui — koi nayi hand shapes nahi, sirf familiar shapes ke liye nayi positions.',
      'Ye paanch shapes, ek baar movable ho jaane par, neck par har chord position ko bina gaps ke cover karti hain — yahi reason hai ki wo pehli jagah fundamental paanch ki tarah sikhaayi gayi thin.',
      'Genuinely valuable, often-gatekept hissa paanch shapes ke beech connective structure hai, shapes khud nahi — jise Lesson 2 concrete banaata hai.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'one-chord-five-positions',
    title: 'One Chord, Five Positions: Walking C Major Up the Whole Neck',
    titleHi: 'Ek Chord, Paanch Positions: C Major Ko Poori Neck Upar Chalna',
    description: 'The same C major triad, played five genuinely different ways — each one calculated, not guessed, from Module 18\'s fretboard map.',
    descriptionHi: 'Wahi C major triad, paanch genuinely alag tareeko se bajaaya gaya — har ek calculated, guess nahi kiya gaya, Module 18 ke fretboard map se.',
    difficulty: 'HARD',
    duration: 25,
    order: 2,

    analogy: {
      en: '**Climbing a spiral staircase that visits the same side of the building five times, at five different heights.** Each turn of the staircase (each CAGED shape) faces the exact same direction (the exact same chord, C major) but at a different floor (a different fret range) — by the fifth turn, you\'ve climbed the entire building (the whole neck) while playing the same chord the entire way.',
      hi: '**Ek spiral staircase chadhna jo building ke same side ko paanch baar visit karta hai, paanch alag heights par.** Staircase ka har turn (har CAGED shape) exact same direction face karta hai (exact same chord, C major) lekin ek alag floor par (ek alag fret range) — paanchwe turn tak, tumne poori building chadh li hai (poori neck) wahi chord poore raaste bajaate hue.',
    },

    simple: `**The five C major positions, in the order they climb the neck (this IS the "CAGED" order):**
1. **C-shape, open** (fret 0) — Module 5\'s familiar open C.
2. **A-shape, barred at fret 3** — the open A chord\'s shape, slid up so its root lands on C.
3. **G-shape, at fret 5** — the open G chord\'s shape, slid up similarly.
4. **E-shape, barred at fret 8** — Module 17\'s movable E-shape barre chord, positioned for C.
5. **D-shape, at fret 10** — the open D chord\'s shape, slid up, closest to the C-shape's octave repeat at fret 12.

**Verified, not just asserted:** every single one of these five shapes contains only the notes C, E, and G — Module 19\'s major triad recipe — confirmed by checking each shape\'s fret positions against Module 18\'s note map. Five completely different hand shapes, five different neck locations, and the exact same three notes every time.

**Why the shapes connect end to end, with no gaps:** shape 1\'s highest reach (around fret 3) is exactly where shape 2 begins; shape 2\'s highest reach is close to shape 3\'s start; and so on. This is what "the CAGED system covers the whole neck" concretely means — not five isolated islands, but one continuous, overlapping chain.`,
    simpleHi: `**Paanch C major positions, us order mein jisme wo neck chadhte hain (ye HI "CAGED" order hai):**
1. **C-shape, open** (fret 0) — Module 5 ka familiar open C.
2. **A-shape, fret 3 par barred** — open A chord ki shape, slide ki hui taaki uska root C par lande.
3. **G-shape, fret 5 par** — open G chord ki shape, similarly slide ki hui.
4. **E-shape, fret 8 par barred** — Module 17 ka movable E-shape barre chord, C ke liye positioned.
5. **D-shape, fret 10 par** — open D chord ki shape, slide ki hui, C-shape ke fret 12 ke octave repeat ke sabse close.

**Verified, sirf asserted nahi:** in paanch shapes mein se har ek mein sirf notes C, E, aur G hain — Module 19 ka major triad recipe — har shape ki fret positions ko Module 18 ke note map ke against check karke confirmed. Paanch poori tarah alag hand shapes, paanch alag neck locations, aur exact same teen notes har baar.

**Shapes end to end kyun connect hoti hain, bina gaps ke:** shape 1 ka highest reach (fret 3 ke around) exactly wahin hai jahan shape 2 shuru hoti hai; shape 2 ka highest reach shape 3 ke start ke close hai; aur waise hi aage. Ye hi hai jo "CAGED system poori neck cover karta hai" concretely means karta hai — paanch isolated islands nahi, balki ek continuous, overlapping chain.`,

    content: `**Why verifying against Module 18\'s fretboard map matters more here than anywhere else in the course so far.** It would be easy to simply present five diagrams and assert they\'re all C major — but the entire point of this module is that these shapes are CALCULATED, not arbitrary. Tracing each shape\'s actual fret positions against the real note names (the same method from Module 18 Lesson 1) and confirming every single note lands on C, E, or G is what makes this a demonstrated fact rather than a claim to take on faith.

**Why the G-shape and D-shape feel noticeably harder than the other three.** The G-shape requires a 4-fret stretch plus a mini-barre across three strings; the D-shape requires an unusual partial-barre-plus-separate-finger arrangement. This isn\'t a flaw in the system — some CAGED shapes are simply more physically awkward than others, and experienced players often favor the C, A, and E shapes for everyday playing while still understanding G and D exist and complete the map. Knowing all five conceptually doesn\'t obligate using all five equally in practice.

**Connecting forward, honestly, to what comes next.** Module 22 (Minor Pentatonic & Blues Scale, opening Part VIII) uses this exact same "one pattern, five connected positions across the neck" logic — but for SCALES instead of chords. Understanding CAGED\'s connective structure now is the single best preparation for why pentatonic scale patterns are organized the way they are.`,
    contentHi: `**Module 18 ke fretboard map ke against verify karna is poore course mein ab tak kahin aur se zyada yahan kyun matter karta hai.** Ye easy hota bas paanch diagrams present karna aur assert karna ki wo sab C major hain — lekin is poore module ka point yahi hai ki ye shapes CALCULATED hain, arbitrary nahi. Har shape ki actual fret positions ko real note names ke against trace karna (Module 18 Lesson 1 ka wahi method) aur confirm karna ki har single note C, E, ya G par lands karta hai, ise ek demonstrated fact banaata hai, faith par lene wala claim nahi.

**G-shape aur D-shape doosri teen se noticeably harder kyun feel karti hain.** G-shape ek 4-fret stretch plus teen strings ke across ek mini-barre maangti hai; D-shape ek unusual partial-barre-plus-separate-finger arrangement maangti hai. Ye system mein ek flaw nahi hai — kuch CAGED shapes simply doosron se zyada physically awkward hain, aur experienced players often everyday playing ke liye C, A, aur E shapes favor karte hain, phir bhi ye samajhte hue ki G aur D exist karti hain aur map complete karti hain. Sab paanch conceptually jaanna sab paanch ko equally practice mein use karne ke liye obligate nahi karta.

**Aage, honestly, kya aata hai us se connect karna.** Module 22 (Minor Pentatonic & Blues Scale, Part VIII kholte hue) exactly yahi "ek pattern, neck ke across paanch connected positions" logic use karta hai — lekin CHORDS ke bajaye SCALES ke liye. CAGED ki connective structure ko abhi samajhna is baat ki sabse achhi preparation hai ki pentatonic scale patterns is tareeke se organize kyun hote hain.`,

    examples: [
      {
        title: 'All five CAGED positions for C major, side by side',
        titleHi: 'C major ke liye saari paanch CAGED positions, saath saath',
        previewHeight: 460,
        code: `C-shape (open):     x-3-2-0-1-0
A-shape (fret 3):    x-3-5-5-5-3
G-shape (fret 5):    8-7-5-5-5-8
E-shape (fret 8):    8-10-10-9-8-8
D-shape (fret 10):   x-x-10-12-13-12

Every fretted note across all five shapes is C, E, or G — verified
against Module 18's fretboard map, zero exceptions.`,
        preview: chordFamilyHtml(
          [CAGED_C_SHAPES.cShape, CAGED_C_SHAPES.aShape, CAGED_C_SHAPES.gShape, CAGED_C_SHAPES.eShape, CAGED_C_SHAPES.dShape],
          'The same C major chord, five genuinely different shapes, climbing from the open position (left) up to fret 10 (right) — this is the entire CAGED system for one chord.',
        ),
        explain:
          'Seeing all five side by side, in climbing order, is the single clearest way to internalize what "CAGED covers the whole neck" actually looks like in practice — five real, distinct hand shapes, one unchanging chord identity.',
        explainHi:
          'Sab paanch ko saath mein dekhna, climbing order mein, ye internalize karne ka sabse clear tareeka hai ki "CAGED poori neck cover karta hai" practically kaisa dikhta hai — paanch real, distinct hand shapes, ek unchanging chord identity.',
      },
      {
        title: 'Confirming the G-shape C uses only C, E, G — traced against Module 18\'s note map',
        titleHi: 'Confirm karna ki G-shape C sirf C, E, G use karta hai — Module 18 ke note map ke against traced',
        previewHeight: 340,
        code: `G-shape C frets: low-E fret 8, A-string fret 7, D/G/B strings fret 5 (barred), high-e fret 8.

low-E fret 8  = C   (root)
A-string fret 7 = E  (major 3rd)
D-string fret 5 = G  (perfect 5th)
G-string fret 5 = C  (root, octave)
B-string fret 5 = E  (major 3rd, octave)
high-e fret 8 = C   (root, octave)`,
        preview: diagramPreviewHtml(
          fretboardMapSvg(10, [
            [0, 8],
            [1, 7],
            [2, 5],
            [3, 5],
            [4, 5],
            [5, 8],
          ]),
          'Every note the G-shape C chord actually plays, highlighted on the fretboard map — check for yourself that every single one is C, E, or G.',
        ),
        explain:
          'This is the same direct, checkable proof technique Module 19 Lesson 2 used for the open C chord — applied here to the least obvious, most awkward-looking of the five CAGED shapes, to show the verification holds even where it\'s least visually obvious.',
        explainHi:
          'Ye wahi direct, checkable proof technique hai jo Module 19 Lesson 2 ne open C chord ke liye use ki thi — yahan paanch CAGED shapes mein se sabse kam obvious, sabse awkward-looking wali par apply hoti hui, ye dikhaane ke liye ki verification wahan bhi hold karta hai jahan ye sabse kam visually obvious hai.',
      },
    ],

    mistakes: [
      {
        wrong: 'Assuming the G-shape and D-shape positions are approximate or "close enough" to C major, since they look and feel so different from the familiar open C.',
        right: 'Trust the calculation: every note in every one of the five shapes is exactly C, E, or G, verified against real fret-to-note math, not approximated.',
        why: 'The whole value of CAGED collapses if the five shapes are only approximately the same chord — the system only works as a genuine mental map because every shape is EXACTLY equivalent, note for note.',
        whyHi: 'CAGED ki poori value collapse ho jaati hai agar paanch shapes sirf approximately wahi chord hain — system ek genuine mental map ki tarah sirf isliye kaam karta hai kyunki har shape EXACTLY equivalent hai, note for note.',
      },
    ],

    realWorld: [
      {
        en: 'A guitarist accompanying a singer who needs a chord played higher up the neck (to avoid clashing with a vocal melody, or for a specific tonal color) reaches for a different CAGED position of the same chord rather than a completely different chord.',
        hi: 'Ek guitarist jo ek singer ko accompany kar raha hai jise neck par upar ek chord bajaana chahiye (vocal melody se clash avoid karne ke liye, ya ek specific tonal color ke liye), same chord ki ek alag CAGED position ke liye reach karta hai, ek poori tarah alag chord ke bajaye.',
      },
    ],

    interviewQA: [
      {
        q: 'Do the five CAGED shapes for a DIFFERENT chord (say, G major instead of C major) appear in the same C-A-G-E-D order, at different frets?',
        qHi: 'Kya ek DIFFERENT chord ke liye paanch CAGED shapes (jaise, C major ke bajaye G major) same C-A-G-E-D order mein appear hoti hain, alag frets par?',
        a: 'Yes — the order the shapes appear in as you move up the neck is always C-A-G-E-D-C-A-G-E-D... regardless of which chord you start from, because that order is fixed by the shapes\' own internal structure (Lesson 1), not by which specific chord you\'re playing. Only the starting fret changes based on the target root.',
        aHi: 'Haan — jaise jaise tum neck upar move karte ho shapes jis order mein appear hoti hain wo hamesha C-A-G-E-D-C-A-G-E-D... hai, chahe tum kisi bhi chord se shuru karo, kyunki wo order shapes ki apni internal structure se fixed hai (Lesson 1), tum kaunsa specific chord bajaa rahe ho us se nahi. Sirf starting fret target root ke hisaab se change hota hai.',
      },
    ],

    exercises: [
      {
        task: 'Pick the A-shape C chord (fret 3, frets x-3-5-5-5-3) and verify every one of its notes against Module 18\'s fretboard map, the same way this lesson verified the G-shape.',
        taskHi: 'A-shape C chord pick karo (fret 3, frets x-3-5-5-5-3) aur uske har ek note ko Module 18 ke fretboard map ke against verify karo, wahi tareeke se jaise is lesson ne G-shape verify ki thi.',
        hint: 'A-string fret 3 = C (root). D, G, B strings fret 5 = ? (calculate using Module 18\'s anchor method for each string). high-e fret 3 = ? (hint: it is not the root — check whether it matches the same string\'s role in the open A chord from Module 6).',
        hintHi: 'A-string fret 3 = C (root). D, G, B strings fret 5 = ? (Module 18 ke anchor method use karke har string ke liye calculate karo). high-e fret 3 = ? (hint: ye root nahi hai — check karo ki kya ye Module 6 ke open A chord mein isi string ke role se match karta hai).',
      },
    ],

    keyTakeaways: [
      'The five CAGED shapes for one chord climb the neck in a fixed order — C(open), A-shape, G-shape, E-shape, D-shape — verified here for C major at frets 0, 3, 5, 8, and 10.',
      'Every single note across all five shapes is confirmed to be the chord\'s root, 3rd, or 5th — a demonstrated fact, not an assumption.',
      'The shapes connect end-to-end with no gaps, which is what "CAGED covers the whole neck" concretely means.',
    ],
    keyTakeawaysHi: [
      'Ek chord ke liye paanch CAGED shapes neck ko ek fixed order mein chadhti hain — C(open), A-shape, G-shape, E-shape, D-shape — yahan C major ke liye frets 0, 3, 5, 8, aur 10 par verified.',
      'Saari paanch shapes mein har single note confirmed hai ki chord ka root, 3rd, ya 5th hai — ek demonstrated fact, ek assumption nahi.',
      'Shapes end-to-end connect hoti hain bina gaps ke, ye hi hai jo "CAGED poori neck cover karta hai" concretely means karta hai.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'using-caged-in-practice',
    title: 'Using CAGED in Practice: Picking Shapes and Looking Ahead to Scales',
    titleHi: 'Practice Mein CAGED Use Karna: Shapes Pick Karna Aur Scales Ki Taraf Dekhna',
    description: 'A practical decision guide for which shape to reach for, and an honest preview of where this same structure reappears for soloing.',
    descriptionHi: 'Kaunsi shape ke liye reach karna hai iske liye ek practical decision guide, aur ek honest preview ki ye same structure soloing ke liye kahan reappear hoti hai.',
    difficulty: 'HARD',
    duration: 15,
    order: 3,

    analogy: {
      en: '**Knowing five routes between two points in a city, and picking whichever fits current traffic.** Once you know all five CAGED positions exist, playing becomes a practical choice — which one is closest to where your hand already is, which one fits the notes you need to reach next, exactly like a driver with five known routes picking whichever suits the moment rather than always defaulting to the same one out of habit.',
      hi: '**Ek city mein do points ke beech paanch routes jaanna, aur jo bhi current traffic ke fit ho use pick karna.** Ek baar jab tumhe pata ho ki saari paanch CAGED positions exist karti hain, bajaana ek practical choice ban jaata hai — kaunsi wahan sabse close hai jahan tumhaara hand already hai, kaunsi un notes ko fit karti hai jo tumhe next reach karne hain, exactly ek driver ki tarah jise paanch known routes pata hain aur jo bhi moment ke suit kare wo pick karta hai, hamesha habit se same wala default karne ke bajaye.',
    },

    simple: `**A practical rule for picking a shape, right now:** use whichever CAGED position is closest to wherever your hand already is — if you just played something around fret 5, reach for the G-shape C rather than jumping all the way down to open position. This alone is the single most useful everyday application of everything in this module.

**A second practical rule: match the shape to what you need afterward.** If the very next chord in a progression is easiest to reach from a higher position, pick the CAGED shape for the CURRENT chord that\'s physically closest to that next chord — minimizing hand movement across an entire progression, not just for one chord in isolation.

**An honest, direct preview of Module 22:** the exact same idea — one pattern repeated in five connected positions climbing the neck — is how minor pentatonic scale shapes (the most common scale for soloing and improvisation) are organized. If CAGED\'s five-shapes-one-neck logic makes sense now, Module 22\'s scale patterns will feel like an application of something you already understand, not a brand-new system to learn from zero.`,
    simpleHi: `**Ek shape pick karne ke liye ek practical rule, abhi:** jo bhi CAGED position tumhaare hand ke already jahan hai uske sabse close ho use use karo — agar tumne abhi kuch fret5 ke around bajaaya hai, open position tak poora neeche jump karne ke bajaye G-shape C ke liye reach karo. Ye akele is poore module ka sabse useful everyday application hai.

**Doosra practical rule: shape ko us se match karo jo tumhe baad mein chahiye.** Agar ek progression mein bilkul agla chord ek higher position se reach karna easiest hai, CURRENT chord ke liye wo CAGED shape pick karo jo us next chord ke physically sabse close ho — poori progression ke across hand movement minimize karna, sirf isolation mein ek chord ke liye nahi.

**Module 22 ka ek honest, direct preview:** exact same idea — ek pattern jo paanch connected positions mein repeat hota hai neck chadhte hue — hai jaise minor pentatonic scale shapes (soloing aur improvisation ke liye sabse common scale) organize hoti hain. Agar CAGED ki five-shapes-one-neck logic abhi sense banaati hai, Module 22 ke scale patterns kisi cheez ka application jaisa feel karenge jo tum already samajhte ho, zero se seekhne wala ek brand-new system nahi.`,

    content: `**Why "minimize hand movement" is a genuinely important practical skill, not just a convenience.** Jumping the entire hand up and down the neck between every chord change costs time and precision — exactly the kind of unnecessary movement Module 9\'s efficient-motion principles warned against for individual fretting-hand technique, now applied at the scale of an entire chord progression. CAGED gives you the option to choose the LOCALLY efficient position rather than always defaulting to the one shape you learned first.

**Why this module deliberately ends by pointing at scales rather than staying only in chord territory.** CAGED is frequently taught as purely a chord-shape system, which undersells its actual value. The five-positions-one-structure idea is the SAME underlying insight that makes the CAGED-aligned pentatonic scale shapes (Module 22) make sense as a connected system rather than five unrelated boxes to separately memorize — seeing the chord version first, as this module did, gives Module 22\'s scale version a running start.

**A closing, honest note on Module 21 and Part VII as a whole.** Modules 18-21 took four modules to build one coherent capability: genuinely understanding the fretboard, rather than only memorizing shapes on it. Part VIII (Modules 22-24) shifts from chords to scales and improvisation — different musical territory, but built on the exact same structural foundation this module just completed.`,
    contentHi: `**"Hand movement minimize karo" ek genuinely important practical skill kyun hai, sirf ek convenience nahi.** Har chord change ke beech poore hand ko neck upar-neeche jump karna time aur precision cost karta hai — exactly wo kism ka unnecessary movement jiske against Module 9 ke efficient-motion principles ne individual fretting-hand technique ke liye warn kiya tha, ab ek poori chord progression ke scale par apply hote hue. CAGED tumhe LOCALLY efficient position choose karne ka option deta hai, hamesha us ek shape ko default karne ke bajaye jo tumne pehle seekhi thi.

**Ye module deliberately scales ki taraf point karke kyun khatam hota hai, sirf chord territory mein rehne ke bajaye.** CAGED often purely ek chord-shape system ki tarah sikhaaya jaata hai, jo iski actual value ko undersell karta hai. Five-positions-one-structure idea WAHI underlying insight hai jo CAGED-aligned pentatonic scale shapes (Module 22) ko ek connected system ki tarah sense banaata hai, paanch unrelated boxes ki tarah separately memorize karne ke bajaye — chord version pehle dekhna, jaisa is module ne kiya, Module 22 ke scale version ko ek running start deta hai.

**Module 21 aur poore Part VII par ek closing, honest note.** Modules 18-21 ne ek coherent capability build karne mein chaar modules liye: fretboard ko genuinely samajhna, sirf ispar shapes memorize karne ke bajaye. Part VIII (Modules 22-24) chords se scales aur improvisation ki taraf shift karta hai — alag musical territory, lekin exact same structural foundation par bana hua jo ye module abhi complete hua.`,

    examples: [
      {
        title: 'Choosing the closest CAGED position instead of always defaulting to open position',
        titleHi: 'Hamesha open position default karne ke bajaye closest CAGED position choose karna',
        previewHeight: 320,
        code: `Scenario: you're playing around fret 7-8 (e.g. an E-shape barre chord)
and the next chord is C major.

Inefficient: jump all the way down to open C (fret 0).
Efficient: use the E-shape C (fret 8) — right where your hand already is.`,
        preview: chordPreviewHtml(
          CAGED_C_SHAPES.eShape,
          'The E-shape C at fret 8 — the efficient choice when your hand is already up the neck, instead of jumping back down to open position.',
        ),
        explain:
          'This is the single most immediately actionable idea in the whole module: CAGED isn\'t just theory, it\'s a genuine practical tool for choosing WHERE on the neck to play a chord you already know several ways to finger.',
        explainHi:
          'Ye poore module mein sabse immediately actionable idea hai: CAGED sirf theory nahi hai, ye ek genuine practical tool hai ye choose karne ke liye ki WAHAN neck par kahan ek chord bajaana hai jise finger karne ke tumhe already kai tareeke pata hain.',
      },
    ],

    mistakes: [
      {
        wrong: 'Learning all five CAGED positions and then continuing to default to open-position chords out of habit, never actually using the higher positions.',
        right: 'Deliberately practice choosing a CAGED position based on hand efficiency, not habit — the whole point of learning all five is using whichever one is genuinely most efficient in context.',
        why: 'Knowledge that never changes behavior provides none of its practical benefit — this module\'s value is entirely in actually using positional choice, not just being able to recite that it exists.',
        whyHi: 'Wo knowledge jo kabhi behavior nahi badalti apna koi practical benefit nahi deti — is module ki value poori tarah actually positional choice use karne mein hai, sirf recite kar paana ki ye exist karti hai kaafi nahi.',
      },
    ],

    realWorld: [
      {
        en: 'Studio and live guitarists constantly make split-second decisions about which position to play a chord in, based on what came before and what\'s coming next — this is CAGED being used as a real-time practical tool, not an academic exercise.',
        hi: 'Studio aur live guitarists constantly split-second decisions lete hain ki ek chord kis position mein bajaana hai, us par based jo pehle aaya tha aur jo aage aa raha hai — ye CAGED hai jo ek real-time practical tool ki tarah use ho raha hai, ek academic exercise nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'Is it worth practicing switching between ALL five CAGED positions for one chord as a dedicated exercise, or is that overkill?',
        qHi: 'Kya ek dedicated exercise ki tarah ek chord ke liye saari paanch CAGED positions ke beech switch karna practice karna worth hai, ya ye overkill hai?',
        a: 'It\'s a genuinely useful drill precisely BECAUSE it builds the muscle memory and mental map for choosing positions fluidly later — similar to how Module 6\'s chord-to-chord anchor-finger drills built transition speed by deliberately practicing something more granular than "just play the song."',
        aHi: 'Ye ek genuinely useful drill hai precisely ISLIYE kyunki ye baad mein positions ko fluidly choose karne ke liye muscle memory aur mental map build karta hai — similar to jaise Module 6 ke chord-to-chord anchor-finger drills ne transition speed build ki thi kuch zyada granular deliberately practice karke "bas song bajao" se.',
      },
    ],

    exercises: [
      {
        task: 'Practice playing all five CAGED positions of C major in order (open, fret 3, fret 5, fret 8, fret 10), then play them in REVERSE order, focusing on smooth, deliberate hand movement between each.',
        taskHi: 'C major ki saari paanch CAGED positions order mein bajaana practice karo (open, fret 3, fret 5, fret 8, fret 10), phir unhe REVERSE order mein bajaao, har ek ke beech smooth, deliberate hand movement par focus karte hue.',
        hint: 'Don\'t rush — the goal here is building the mental map of where each position is, matching Module 9\'s "accuracy before speed" principle, not racing through them.',
        hintHi: 'Jaldi mat karo — yahan goal ye hai ki har position kahan hai uska mental map build karo, Module 9 ke "speed se pehle accuracy" principle ko match karte hue, unse race karke nahi.',
      },
    ],

    keyTakeaways: [
      'Pick a CAGED position based on hand efficiency — closest to where you already are, or closest to where you need to go next — not habit.',
      'This same "one pattern, five connected neck positions" structure is exactly how Module 22\'s pentatonic scale shapes are organized.',
      'This closes Part VII (Music Theory): Modules 18-21 built genuine fretboard understanding — Part VIII now applies that same foundation to scales and improvisation.',
    ],
    keyTakeawaysHi: [
      'Hand efficiency ke basis par ek CAGED position pick karo — jahan tum already ho uske sabse close, ya jahan tumhe aage jaana hai uske sabse close — habit nahi.',
      'Yahi "ek pattern, neck ki paanch connected positions" structure exactly wo hai jaise Module 22 ke pentatonic scale shapes organize hote hain.',
      'Ye Part VII (Music Theory) close karta hai: Modules 18-21 ne genuine fretboard understanding build ki — Part VIII ab us same foundation ko scales aur improvisation par apply karta hai.',
    ],
  },
];
