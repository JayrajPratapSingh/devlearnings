/**
 * Guitar Course — Module 19: Intervals & How Chords Are Built, lessons 1-3.
 * Part VII continues — this is the theory that explains WHY the shapes
 * from Modules 4-17 sound the way they do, not just how to finger them.
 */

import type { CourseLesson } from './course-js-module1';
import { diagramPreviewHtml, fretboardMapSvg } from './guitar-diagrams';

export const GUITAR_MODULE_19: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'what-is-an-interval',
    title: 'What Is an Interval? The Unit Chords Are Measured In',
    titleHi: 'Interval Kya Hai? Wo Unit Jismein Chords Measure Hote Hain',
    description: 'Semitones, named and counted — the single building block every chord in this course turns out to be made of.',
    descriptionHi: 'Semitones, named aur counted — wo single building block jisse is course ka har chord actually bana hota hai.',
    difficulty: 'MEDIUM',
    duration: 15,
    order: 1,

    analogy: {
      en: '**A recipe measured in a fixed unit, like "cups" or "grams," instead of vague words like "some" or "a bit."** Up to now, chord shapes have been given to you pre-measured, like a finished dish. An interval is the measuring unit underneath every recipe — once you know "major chord = root + 4 units + 7 units," you can build ANY major chord\'s note content yourself, the same way knowing "1 cup" lets you scale any recipe instead of memorizing each dish as a separate unrelated fact.',
      hi: '**Ek fixed unit mein measured recipe, jaise "cups" ya "grams," vague words jaise "kuch" ya "thoda" ke bajaye.** Ab tak, chord shapes tumhe pre-measured di gayi hain, ek finished dish ki tarah. Ek interval har recipe ke neeche ka measuring unit hai — ek baar jab tumhe pata ho "major chord = root + 4 units + 7 units," tum khud KISI BHI major chord ka note content bana sakte ho, waisi hi jaise "1 cup" jaanna tumhe kisi bhi recipe ko scale karne deta hai, har dish ko ek separate unrelated fact ki tarah memorize karne ke bajaye.',
    },

    simple: `**An interval is simply the distance between two notes, measured in semitones (frets — Module 2\'s "each fret = +1 semitone" rule is the exact tool for counting this).**

**The three intervals that build almost everything in this course:**
- **Minor 3rd = 3 semitones** (3 frets up)
- **Major 3rd = 4 semitones** (4 frets up)
- **Perfect 5th = 7 semitones** (7 frets up)

**Why "major" and "minor" as words connect directly to what you already know:** every major-sounding chord you\'ve played (G, C, D, A, E) contains a major 3rd above its root; every minor-sounding chord (Em, Am, Dm) contains a minor 3rd instead. The emotional character you\'ve been hearing since Module 5 has a precise, countable, 1-semitone-different cause.`,
    simpleHi: `**Ek interval simply do notes ke beech ki distance hai, semitones mein measured (frets — Module 2 ka "har fret = +1 semitone" rule count karne ke liye exact tool hai).**

**Teen intervals jo is course mein almost sab kuch banate hain:**
- **Minor 3rd = 3 semitones** (3 frets upar)
- **Major 3rd = 4 semitones** (4 frets upar)
- **Perfect 5th = 7 semitones** (7 frets upar)

**Words ke taur par "major" aur "minor" directly us se kyun connect hote hain jo tumhe already pata hai:** har major-sounding chord jo tumne bajaaya hai (G, C, D, A, E) apne root ke upar ek major 3rd contain karta hai; har minor-sounding chord (Em, Am, Dm) iske bajaye ek minor 3rd contain karta hai. Emotional character jo tum Module 5 se sun rahe ho uska ek precise, countable, 1-semitone-different cause hai.`,

    content: `**Why this lesson exists precisely here, after 17 modules of shapes and before any theory-heavy content.** Everything from Module 4 onward taught chord shapes as fixed, memorized hand positions — correct, and necessary to start playing quickly (Module 1\'s whole premise). But a shape alone can\'t answer "why does THIS chord sound sad" or "how would I build a chord no one\'s shown me yet." Intervals are the missing layer underneath every shape you already know, made explicit now that your hands have enough shape-vocabulary for the theory to attach to something real instead of floating abstractly.

**Why semitones specifically, rather than some other unit.** Module 2 already established that a fret is a fixed, physical, countable unit of pitch change — semitones aren\'t a new abstract concept, they\'re just naming the thing your fretting hand has been physically doing since Lesson 1 of this entire course. This is deliberately NOT new information, only a new, more powerful way of describing information you already have in your hands.

**A genuinely honest note on how deep to take this right now.** There are many more named intervals in full music theory (minor 2nds, augmented 4ths, major 6ths, and more) — this lesson deliberately covers only the three that immediately explain triads (Lesson 2), because loading in the full interval vocabulary before it has an immediate use would be exactly the kind of premature, disconnected theory Module 1 promised this course would avoid.`,
    contentHi: `**Ye lesson precisely yahan, 17 modules ke shapes ke baad aur kisi bhi theory-heavy content se pehle kyun exist karta hai.** Module 4 se aage sab kuch chord shapes ko fixed, memorized hand positions ki tarah sikhaya — correct, aur quickly bajaana shuru karne ke liye zaroori (Module 1 ka poora premise). Lekin akeli ek shape "ye chord sad kyun sound karta hai" ya "main ek aisa chord kaise banaaun jo kisi ne nahi dikhaya" answer nahi kar sakti. Intervals wo missing layer hain jo har shape ke neeche hai jo tumhe already pata hai, ab explicit banaya gaya hai jab tumhare hands ke paas theory ke attach hone ke liye kaafi shape-vocabulary hai, floating abstractly rehne ke bajaye.

**Semitones specifically kyun, kisi aur unit ke bajaye.** Module 2 ne already establish kiya tha ki ek fret pitch change ki ek fixed, physical, countable unit hai — semitones koi naya abstract concept nahi hai, ye bas us cheez ko naam de rahe hain jo tumhara fretting hand is poore course ke Lesson 1 se physically karta aaya hai. Ye deliberately NAYI information NAHI hai, sirf ek naya, zyada powerful tareeka hai us information ko describe karne ka jo tumhare hands mein already hai.

**Ise abhi kitna deep le jaana hai iske baare mein ek genuinely honest note.** Full music theory mein aur bhi kai named intervals hain (minor 2nds, augmented 4ths, major 6ths, aur bhi) — ye lesson deliberately sirf teen cover karta hai jo triads ko immediately explain karte hain (Lesson 2), kyunki koi immediate use hone se pehle poori interval vocabulary load karna exactly wo kism ki premature, disconnected theory hoti jise Module 1 ne promise kiya tha ki ye course avoid karega.`,

    examples: [
      {
        title: 'Counting a major 3rd and a perfect 5th from a root note, on one string',
        titleHi: 'Ek root note se ek string par major 3rd aur perfect 5th count karna',
        previewHeight: 340,
        code: `Root: low E string, fret 0 (E).
Major 3rd = root + 4 semitones = fret 4 = G#.
Perfect 5th = root + 7 semitones = fret 7 = B.

E - G# - B = the three notes of an E major chord.`,
        preview: diagramPreviewHtml(
          fretboardMapSvg(7, [
            [0, 0],
            [0, 4],
            [0, 7],
          ]),
          'Root, major 3rd, and perfect 5th counted directly on the low E string — this exact E-G#-B combination is what an E major chord is built from.',
        ),
        explain:
          'Seeing these three highlighted frets on a single string makes the counting concrete and checkable — you can verify it yourself by counting semitones one fret at a time, using nothing but Module 2\'s "each fret = +1 semitone" rule.',
        explainHi:
          'In teen highlighted frets ko ek single string par dekhna counting ko concrete aur checkable banata hai — tum ise khud verify kar sakte ho ek baar mein ek fret semitones count karke, Module 2 ke "har fret = +1 semitone" rule ke alawa kuch bhi use kiye bina.',
      },
    ],

    mistakes: [
      {
        wrong: 'Counting the starting fret itself as "step 1" when measuring an interval (e.g. counting fret 0 as 1, fret 1 as 2...).',
        right: 'The starting note is "0 semitones away from itself" — start counting AFTER the root, so a major 3rd from fret 0 lands on fret 4, not fret 3 or 5.',
        why: 'This off-by-one error is the single most common mistake when people first start counting intervals, and it silently produces the wrong chord every time — a habit worth catching explicitly, right at the start.',
        whyHi: 'Ye off-by-one error sabse common mistake hai jab log pehli baar intervals count karna shuru karte hain, aur ye silently har baar galat chord produce karta hai — ek habit jo explicitly, bilkul shuru mein hi pakadne layak hai.',
      },
    ],

    realWorld: [
      {
        en: 'When a songwriter says "make that chord minor instead of major," a fluent player mentally shifts one note down by a single semitone (the major 3rd becomes a minor 3rd) rather than needing to look up an entirely different chord shape from scratch.',
        hi: 'Jab ek songwriter kehta hai "us chord ko major ke bajaye minor bana do," ek fluent player mentally ek note ko ek single semitone neeche shift karta hai (major 3rd minor 3rd ban jaata hai), scratch se ek poora alag chord shape lookup karne ki zaroorat ke bajaye.',
      },
    ],

    interviewQA: [
      {
        q: 'Is a "perfect 5th" called "perfect" because it sounds better than other intervals?',
        qHi: 'Kya ek "perfect 5th" "perfect" isliye kehlata hai kyunki ye doosre intervals se better sound karta hai?',
        a: '"Perfect" is historical music-theory terminology (these intervals were considered maximally consonant/stable in early Western theory), not a claim that it\'s the "best" interval — minor and major 3rds are just as essential, they simply belong to a different naming category.',
        aHi: '"Perfect" historical music-theory terminology hai (ye intervals early Western theory mein maximally consonant/stable consider kiye jaate the), ye claim nahi ki ye "best" interval hai — minor aur major 3rds bhi utne hi essential hain, wo bas ek alag naming category ke hain.',
      },
    ],

    exercises: [
      {
        task: 'Starting from the A string open note (A), count and name the fret for a major 3rd above it, and separately the fret for a perfect 5th above it, using only semitone counting (no reference chart).',
        taskHi: 'A string ke open note (A) se shuru karke, uske upar ek major 3rd ke liye fret count aur naam karo, aur separately uske upar ek perfect 5th ke liye fret, sirf semitone counting use karke (koi reference chart nahi).',
        hint: 'A + 4 semitones and A + 7 semitones — count one fret at a time using the chromatic sequence from Module 18 Lesson 1 (A A# B C C# D D# E...) to check your answer.',
        hintHi: 'A + 4 semitones aur A + 7 semitones — Module 18 Lesson 1 ke chromatic sequence (A A# B C C# D D# E...) use karke apna answer check karne ke liye ek baar mein ek fret count karo.',
      },
    ],

    keyTakeaways: [
      'An interval is the distance between two notes, measured in semitones — the same unit as frets.',
      'Minor 3rd = 3 semitones, major 3rd = 4 semitones, perfect 5th = 7 semitones — the three intervals behind almost every chord so far.',
      'Major vs. minor chords differ by exactly one semitone (a major 3rd vs. a minor 3rd) — a precise, countable cause for what you\'ve only heard emotionally until now.',
    ],
    keyTakeawaysHi: [
      'Ek interval do notes ke beech ki distance hai, semitones mein measured — frets jaisi hi unit.',
      'Minor 3rd = 3 semitones, major 3rd = 4 semitones, perfect 5th = 7 semitones — teen intervals jo ab tak almost har chord ke peeche hain.',
      'Major vs. minor chords exactly ek semitone se alag hote hain (ek major 3rd vs. ek minor 3rd) — jo tumne ab tak sirf emotionally suna hai uska ek precise, countable cause.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'building-major-and-minor-triads',
    title: 'Building Major and Minor Triads — Verified Against Chords You Already Know',
    titleHi: 'Major Aur Minor Triads Banana — Un Chords Se Verified Jo Tum Already Jaante Ho',
    description: 'The root-3rd-5th recipe, proven note-by-note against the real C, G, Em, and Am shapes from Module 5.',
    descriptionHi: 'Root-3rd-5th recipe, real C, G, Em, aur Am shapes (Module 5 se) ke against note-by-note proven.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: '**A 3-legged stool: root, 3rd, 5th, and it stands on exactly those three.** Every triad — the most basic possible chord — is built from precisely three notes at precise interval distances. Add or remove a leg and it\'s not the same stool; change the middle leg\'s length slightly (major 3rd vs. minor 3rd) and the stool tilts a completely different emotional direction while still technically standing.',
      hi: '**Ek 3-legged stool: root, 3rd, 5th, aur ye exactly un teen par khada hai.** Har triad — sabse basic possible chord — precisely teen notes se precise interval distances par bana hota hai. Ek leg add ya remove karo aur ye same stool nahi raha; middle leg ki length thodi change karo (major 3rd vs. minor 3rd) aur stool ek poori tarah alag emotional direction mein tilt hota hai, technically khada rehte hue bhi.',
    },

    simple: `**The recipe, precisely:**
- **Major triad = root + major 3rd (4 semitones) + perfect 5th (7 semitones)**
- **Minor triad = root + minor 3rd (3 semitones) + perfect 5th (7 semitones)**

Only the middle note changes between major and minor — the root and the 5th stay in the exact same place.

**Proven against real chords you already play (not asserted — actually counted from the CHORDS data underlying every diagram in this course):**
- **C major** = C, E, G → C to E is 4 semitones (major 3rd), C to G is 7 semitones (perfect 5th). Check the open C chord: it plays exactly C, E, G (with some notes doubled).
- **G major** = G, B, D → same major-triad recipe, rooted on G.
- **E minor** = E, G, B → E to G is 3 semitones (minor 3rd), E to B is 7 semitones (perfect 5th).
- **A minor** = A, C, E → same minor-triad recipe, rooted on A.`,
    simpleHi: `**Recipe, precisely:**
- **Major triad = root + major 3rd (4 semitones) + perfect 5th (7 semitones)**
- **Minor triad = root + minor 3rd (3 semitones) + perfect 5th (7 semitones)**

Sirf middle note major aur minor ke beech change hota hai — root aur 5th exact same jagah rehte hain.

**Un real chords ke against proven jo tum already bajaate ho (asserted nahi — actually is course mein har diagram ke underlying CHORDS data se counted):**
- **C major** = C, E, G → C se E 4 semitones hai (major 3rd), C se G 7 semitones hai (perfect 5th). Open C chord check karo: ye exactly C, E, G bajaata hai (kuch notes doubled ke saath).
- **G major** = G, B, D → same major-triad recipe, G par rooted.
- **E minor** = E, G, B → E se G 3 semitones hai (minor 3rd), E se B 7 semitones hai (perfect 5th).
- **A minor** = A, C, E → same minor-triad recipe, A par rooted.`,

    content: `**Why proving this against ALREADY-KNOWN chords matters more than introducing new ones.** It would be easy to introduce a brand-new, never-played chord as the "proof" of the triad recipe — but that asks you to trust the theory on faith. Tracing the actual open C, G, Em, and Am shapes finger-by-finger (which real fret plays which real note, computed the same way Lesson 1 taught) shows the recipe is TRUE of chords your hands have already played hundreds of times, not just true in the abstract.

**Why chord shapes double and reorder these three notes, rather than playing them in a clean root-3rd-5th line.** Look closely at the open C chord: C, E, G, C, E — the root and 3rd repeat at a higher pitch. This is completely normal and universal across nearly all open chords — six strings gives more physical notes to play than the three the triad strictly requires, so shapes are designed to double certain notes for a fuller sound rather than waste a string playing nothing. The chord is still fundamentally a 3-note idea (C-E-G) even though 5 or 6 strings ring out.

**A genuinely useful forward-looking payoff: you can now predict a chord\'s notes before ever seeing its diagram.** Told "play an F# minor," you no longer need to wait for a chart — F# + minor 3rd (3 semitones) = A, F# + perfect 5th (7 semitones) = C#, so F#m = F#-A-C#, calculable from the recipe alone, the same independence Module 18 Lesson 3 built for fret positions, now extended to note content itself.`,
    contentHi: `**Ise ALREADY-KNOWN chords ke against prove karna naye chords introduce karne se zyada kyun matter karta hai.** Ek bilkul naya, kabhi na bajaaya chord "proof" ki tarah introduce karna easy hota — lekin ye tumse theory ko faith par trust karne ko kehta hai. Actual open C, G, Em, aur Am shapes ko finger-by-finger trace karna (kaunsi real fret kaunsa real note bajaati hai, wahi tareeke se computed jo Lesson 1 ne sikhaya) dikhaata hai ki recipe un chords ke liye TRUE hai jo tumhare hands already saikdon baar bajaa chuke hain, sirf abstract mein true nahi.

**Chord shapes in teen notes ko double aur reorder kyun karte hain, ek clean root-3rd-5th line mein bajaane ke bajaye.** Open C chord ko closely dekho: C, E, G, C, E — root aur 3rd ek higher pitch par repeat hote hain. Ye almost saare open chords mein completely normal aur universal hai — six strings triad ko strictly jitni chahiye us se zyada physical notes bajaane ka mauka deti hain, isliye shapes kuch notes ko double karne ke liye design kiye jaate hain ek fuller sound ke liye, ek string ko kuch na bajaane mein waste karne ke bajaye. Chord fundamentally ab bhi ek 3-note idea hai (C-E-G) chahe 5 ya 6 strings bajein.

**Ek genuinely useful forward-looking payoff: ab tum ek chord ke notes predict kar sakte ho uska diagram dekhe bina.** "Ek F# minor bajao" kaha jaane par, tumhe ab ek chart ka wait karne ki zaroorat nahi — F# + minor 3rd (3 semitones) = A, F# + perfect 5th (7 semitones) = C#, toh F#m = F#-A-C#, recipe se hi calculable, wahi independence jo Module 18 Lesson 3 ne fret positions ke liye build ki thi, ab note content mein hi extended.`,

    examples: [
      {
        title: 'The open C major shape, traced note-by-note against the triad recipe',
        titleHi: 'Open C major shape, triad recipe ke against note-by-note traced',
        previewHeight: 340,
        code: `Open C chord frets: A-string fret 3, D-string fret 2, G-string open, B-string fret 1, high-e open.

A-string fret 3  = C  (root)
D-string fret 2  = E  (major 3rd, root + 4 semitones)
G-string open    = G  (perfect 5th, root + 7 semitones)
B-string fret 1  = C  (root, doubled an octave up)
high-e open      = E  (major 3rd, doubled an octave up)

Every single note in the shape is C, E, or G. No exceptions.`,
        preview: diagramPreviewHtml(
          fretboardMapSvg(3, [
            [1, 3],
            [2, 2],
            [3, 0],
            [4, 1],
            [5, 0],
          ]),
          'Every fretted or open note the real C chord shape uses, highlighted — check for yourself that each one is C, E, or G, exactly as the major-triad recipe predicts.',
        ),
        explain:
          'This is a direct, checkable proof rather than an assertion — every highlighted cell traces back to an actual finger position from Module 5\'s C chord, and every single one lands on C, E, or G with zero exceptions.',
        explainHi:
          'Ye ek direct, checkable proof hai, ek assertion nahi — har highlighted cell Module 5 ke C chord ki ek actual finger position tak trace hoti hai, aur har ek C, E, ya G par lands karta hai bina kisi exception ke.',
      },
    ],

    mistakes: [
      {
        wrong: 'Assuming the triad recipe only applies to chord shapes you haven\'t learned yet, treating it as separate from the "real" chords in Modules 4-17.',
        right: 'Recognize that EVERY open chord you already play is already built from exactly this recipe — the theory describes what your hands have been doing all along.',
        why: 'Theory that feels disconnected from what you already play is far more likely to be forgotten — anchoring it to already-familiar shapes (as this lesson does) makes it stick because it explains something you can already feel and hear.',
        whyHi: 'Theory jo us se disconnected feel hoti hai jo tum already bajaate ho, bhoolne ke liye zyada likely hai — ise already-familiar shapes se anchor karna (jaisa ye lesson karta hai) ise stick karta hai kyunki ye kuch aisa explain karta hai jo tum already feel aur sun sakte ho.',
      },
    ],

    realWorld: [
      {
        en: 'A keyboard player and a guitarist in the same band both play "C major" using completely different physical shapes on completely different instruments — the triad recipe (C-E-G) is the shared abstraction that lets them agree they\'re playing the same chord at all.',
        hi: 'Ek keyboard player aur ek guitarist same band mein dono "C major" bajaate hain poori tarah alag instruments par poori tarah alag physical shapes use karke — triad recipe (C-E-G) wo shared abstraction hai jo unhe agree karne deta hai ki wo bilkul same chord bajaa rahe hain.',
      },
    ],

    interviewQA: [
      {
        q: 'Do all six strings in an open chord always play only root, 3rd, and 5th notes, with nothing else ever allowed?',
        qHi: 'Kya ek open chord ki saari chhah strings hamesha sirf root, 3rd, aur 5th notes hi bajaati hain, kabhi kuch aur allowed nahi?',
        a: 'For a plain triad (like the open chords in Modules 4-6), yes — every note is root, 3rd, or 5th. Lesson 3 of this module covers chords that deliberately add a fourth note beyond the triad (7ths, sus, add chords), which is a genuinely different, expanded category.',
        aHi: 'Ek plain triad ke liye (jaise Modules 4-6 ke open chords), haan — har note root, 3rd, ya 5th hai. Is module ka Lesson 3 un chords ko cover karta hai jo deliberately triad ke aage ek chautha note add karte hain (7ths, sus, add chords), jo ek genuinely alag, expanded category hai.',
      },
    ],

    exercises: [
      {
        task: 'Using the recipe, calculate the three notes of a D major triad and a D minor triad, then check your D major answer against the open D chord shape (D-string open, G-string fret 2, B-string fret 3, high-e fret 2) from Module 5.',
        taskHi: 'Recipe use karke, D major triad aur D minor triad ke teen notes calculate karo, phir apna D major answer open D chord shape (D-string open, G-string fret 2, B-string fret 3, high-e fret 2) ke against check karo, jo Module 5 se hai.',
        hint: 'D major 3rd = D + 4 semitones = F#. D perfect 5th = D + 7 semitones = A. See if those two notes plus the D root account for every fretted note in the real shape.',
        hintHi: 'D major 3rd = D + 4 semitones = F#. D perfect 5th = D + 7 semitones = A. Dekho ki ye do notes plus D root real shape ke har fretted note ko account karte hain ki nahi.',
      },
    ],

    keyTakeaways: [
      'Major triad = root + major 3rd + perfect 5th; minor triad = root + minor 3rd + perfect 5th — only the middle note changes.',
      'This recipe is provably true of chords you already play — traced note-by-note, the open C, G, Em, and Am shapes are exactly these three-note recipes, sometimes with notes doubled.',
      'Knowing the recipe lets you calculate any triad\'s notes before ever seeing a diagram for it.',
    ],
    keyTakeawaysHi: [
      'Major triad = root + major 3rd + perfect 5th; minor triad = root + minor 3rd + perfect 5th — sirf middle note change hota hai.',
      'Ye recipe un chords ke liye provably true hai jo tum already bajaate ho — note-by-note traced, open C, G, Em, aur Am shapes exactly ye teen-note recipes hain, kabhi kabhi notes doubled ke saath.',
      'Recipe jaanna tumhe kisi bhi triad ke notes calculate karne deta hai kisi bhi diagram dekhe bina.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'beyond-triads-sevenths-sus-add',
    title: 'Beyond Triads: 7ths, Sus, and Add Chords Explained',
    titleHi: 'Triads Se Aage: 7ths, Sus, Aur Add Chords Explained',
    description: 'Every "weird-named" chord from Modules 5-6 was already a modified triad — this lesson names exactly what changed.',
    descriptionHi: 'Modules 5-6 se har "weird-named" chord already ek modified triad tha — ye lesson exactly bataata hai ki kya change hua.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: '**A base recipe with one deliberate substitution or addition, like a "spicy" or "extra cheese" variant on a menu.** The base dish (the triad) is still fully recognizable — one ingredient is swapped out (sus chords) or one is added on top (7th and add chords) — same core identity, one clearly-named modification.',
      hi: '**Ek base recipe jismein ek deliberate substitution ya addition ho, jaise ek menu par "spicy" ya "extra cheese" variant.** Base dish (triad) abhi bhi fully recognizable hai — ek ingredient swap out hota hai (sus chords) ya ek upar add hota hai (7th aur add chords) — same core identity, ek clearly-named modification.',
    },

    simple: `**Three modifications to the basic triad, each with a precise rule:**

**7th chords — add a fourth note, a 7th above the root.** G7 (Module 6) = G major triad (G-B-D) + F, a note 10 semitones above G. That extra note is what gives G7 its restless, "wants to resolve" quality that plain G major doesn\'t have.

**Sus chords — replace the 3rd entirely.** Dsus2 replaces D major\'s F# (the 3rd) with E (a 2nd above the root) — "sus" literally means "suspended," because removing the 3rd removes the major/minor quality itself, leaving a note that sounds like it\'s waiting to resolve somewhere. Dsus4 does the same with a 4th above the root instead.

**Add chords — add a note WITHOUT removing the 3rd.** Cadd9 = the full C major triad (C-E-G) plus a D (a 9th, i.e. a 2nd an octave up) — unlike sus chords, nothing is removed, so the major quality stays fully intact alongside the extra color note.`,
    simpleHi: `**Basic triad ke teen modifications, har ek ek precise rule ke saath:**

**7th chords — ek chautha note add karo, root ke upar ek 7th.** G7 (Module 6) = G major triad (G-B-D) + F, ek note jo G se 10 semitones upar hai. Wo extra note hi hai jo G7 ko wo restless, "resolve hona chahta hai" quality deta hai jo plain G major mein nahi hai.

**Sus chords — 3rd ko poori tarah replace karo.** Dsus2 D major ke F# (3rd) ko E se replace karta hai (root se upar ek 2nd) — "sus" literally "suspended" ka matlab hai, kyunki 3rd ko hataana major/minor quality ko hi hata deta hai, ek aisa note chhod kar jo lagta hai kahin resolve hone ka wait kar raha hai. Dsus4 root ke upar ek 4th ke saath wahi karta hai.

**Add chords — bina 3rd hataaye ek note add karo.** Cadd9 = poora C major triad (C-E-G) plus ek D (ek 9th, matlab ek 2nd ek octave upar) — sus chords ke unlike, kuch bhi remove nahi hota, isliye major quality extra color note ke saath fully intact rehti hai.`,

    content: `**Why these three categories are worth distinguishing clearly, rather than treating every "weird chord name" as an unrelated special case.** Modules 5-6 taught G7, D7, A7, E7, Cadd9, Dsus2, and Dsus4 as individual shapes to memorize — perfectly reasonable at that stage. Now that the triad recipe (Lesson 2) is established, all seven of those chords collapse into exactly three understandable modification RULES rather than seven unrelated facts, which is a genuinely large reduction in what needs to be separately remembered.

**Why sus chords specifically sound "unresolved" — connecting the theory to what your ear has already noticed.** If you\'ve ever felt a sus chord "wants" to move somewhere, that\'s not imagination: removing the 3rd removes the ONE note that determines major-vs-minor character, leaving genuine harmonic ambiguity that your ear correctly perceives as unresolved tension, resolved when the sus chord moves back to its plain major or minor form.

**Connecting forward, honestly, to how far this goes.** This lesson deliberately stops at 7ths, sus, and add chords — the categories already present in Modules 5-6\'s shapes. Full chord-extension theory (9ths, 11ths, 13ths, altered chords, jazz voicings) goes considerably further than this course covers, and is exactly the kind of "hidden, premium-course" depth that exists beyond noob-to-pro fundamentals — worth knowing exists, not worth detouring into here.`,
    contentHi: `**Ye teen categories clearly distinguish karne layak kyun hain, har "weird chord name" ko ek unrelated special case ki tarah treat karne ke bajaye.** Modules 5-6 ne G7, D7, A7, E7, Cadd9, Dsus2, aur Dsus4 ko individual shapes ki tarah sikhaya jo memorize karni thi — us stage par perfectly reasonable. Ab jab triad recipe (Lesson 2) established hai, un saato chords mein se sab exactly teen understandable modification RULES mein collapse ho jaate hain, saat unrelated facts ke bajaye, jo separately yaad rakhne ki zaroorat mein ek genuinely badi reduction hai.

**Sus chords specifically "unresolved" kyun sound karte hain — theory ko us se connect karna jo tumhare kaan ne already notice kiya hai.** Agar tumne kabhi feel kiya hai ki ek sus chord kahin "move hona chahta hai," ye imagination nahi hai: 3rd hataana us EK note ko hata deta hai jo major-vs-minor character determine karta hai, ek genuine harmonic ambiguity chhod kar jise tumhara kaan correctly unresolved tension ki tarah perceive karta hai, resolved hota hai jab sus chord wapas apne plain major ya minor form mein move karta hai.

**Aage, honestly, ye kahan tak jaata hai us se connect karna.** Ye lesson deliberately 7ths, sus, aur add chords par rukta hai — wo categories jo already Modules 5-6 ke shapes mein present hain. Full chord-extension theory (9ths, 11ths, 13ths, altered chords, jazz voicings) is course jo cover karta hai us se considerably aage jaata hai, aur exactly wo kism ki "hidden, premium-course" depth hai jo noob-to-pro fundamentals se pare exist karti hai — jaanne layak ki exist karti hai, yahan detour karne layak nahi.`,

    examples: [
      {
        title: 'G major vs. G7 — exactly one note different, traced on the fretboard',
        titleHi: 'G major vs. G7 — exactly ek note different, fretboard par traced',
        previewHeight: 340,
        code: `G major: low-E fret 3, A fret 2, D open, G open, B open, high-e fret 3.
G7:      low-E fret 3, A fret 2, D open, G open, B open, high-e fret 1.

Only the high-e string changes: fret 3 (G, doubling the root) becomes fret 1 (F).
That single new note, F, is G's 7th — 10 semitones above the root.`,
        preview: diagramPreviewHtml(
          fretboardMapSvg(3, [
            [0, 3],
            [1, 2],
            [2, 0],
            [3, 0],
            [4, 0],
            [5, 1],
          ]),
          'The real G7 shape highlighted, including the high-e fret 1 (F) — the single note that turns a plain G major triad into a 7th chord.',
        ),
        explain:
          'Seeing that G7 differs from G major by exactly one changed note makes "7th chord" concrete rather than mysterious — it is the plain triad you already know, plus one precisely-placed extra note.',
        explainHi:
          'G7 ko G major se exactly ek changed note alag dekhna "7th chord" ko concrete banata hai, mysterious nahi — ye wahi plain triad hai jo tum already jaante ho, plus ek precisely-placed extra note.',
      },
    ],

    mistakes: [
      {
        wrong: 'Treating "sus," "7," and "add" as interchangeable ways to make a chord "sound more interesting," without distinguishing what each one actually does to the triad.',
        right: 'Know precisely which modification each label means: 7th = add a note above the triad; sus = replace the 3rd; add = add a note while keeping the 3rd.',
        why: 'These three modifications produce genuinely different sounds and serve different musical purposes — treating them as interchangeable "spice" prevents you from choosing the right one deliberately when writing or arranging your own music.',
        whyHi: 'Ye teen modifications genuinely alag sounds produce karte hain aur alag musical purposes serve karte hain — inhe interchangeable "spice" ki tarah treat karna tumhe apna khud ka music likhte ya arrange karte waqt deliberately sahi wala choose karne se rokta hai.',
      },
    ],

    realWorld: [
      {
        en: 'A songwriter reaching for a sus chord right before a chorus, to create anticipation that resolves exactly when the chorus\'s plain major chord lands, is using this lesson\'s "unresolved tension" mechanism as a deliberate, precise songwriting tool.',
        hi: 'Ek songwriter jo chorus se bilkul pehle ek sus chord ke liye reach karta hai, anticipation create karne ke liye jo exactly tab resolve hota hai jab chorus ka plain major chord lands karta hai, is lesson ke "unresolved tension" mechanism ko ek deliberate, precise songwriting tool ki tarah use kar raha hai.',
      },
    ],

    interviewQA: [
      {
        q: 'If a "7th" adds a note above the triad, why does the actual open-chord shape for G7 change a note instead of literally adding a 7th finger somewhere?',
        qHi: 'Agar ek "7th" triad ke upar ek note add karta hai, toh G7 ka actual open-chord shape kahin literally ek 7th finger add karne ke bajaye ek note kyun change karta hai?',
        a: 'Open-chord shapes are limited to 6 strings and usually 3-4 fingers, so guitarists typically achieve the "add a note" theory by re-purposing a string that was doubling the root or 5th to instead play the new note — the theory concept (add a 7th) and its physical execution (change one existing finger) are related but not identical, which is exactly why Lesson 2\'s point about doubled notes in triads matters here.',
        aHi: 'Open-chord shapes 6 strings aur usually 3-4 fingers tak limited hote hain, isliye guitarists typically "note add karo" theory achieve karte hain ek string ko re-purpose karke jo root ya 5th ko double kar rahi thi, naya note bajaane ke liye — theory concept (ek 7th add karo) aur uska physical execution (ek existing finger change karo) related hain lekin identical nahi, isliye Lesson 2 ka triads mein doubled notes wala point yahan matter karta hai.',
      },
    ],

    exercises: [
      {
        task: 'Compare the open A chord (A-string open, D fret 2, G fret 2, B fret 2, high-e open) against A7 (A-string open, D fret 2, G open, B fret 2, high-e open) from Module 6. Identify exactly which single note changed, and confirm it fits the "add a 7th" rule.',
        taskHi: 'Open A chord (A-string open, D fret 2, G fret 2, B fret 2, high-e open) ko A7 (A-string open, D fret 2, G open, B fret 2, high-e open) ke against compare karo, jo Module 6 se hai. Exactly identify karo ki kaunsa single note change hua, aur confirm karo ki ye "7th add karo" rule fit karta hai.',
        hint: 'Only the G string changes, from fret 2 to open. Work out what note each of those is, and check whether the open-string note is 10 semitones above A (the dominant-7th interval, same as this lesson\'s G7 example).',
        hintHi: 'Sirf G string change hoti hai, fret 2 se open tak. Pata karo har ek kaunsa note hai, aur check karo ki kya open-string note A se 10 semitones upar hai (dominant-7th interval, is lesson ke G7 example jaisa hi).',
      },
    ],

    keyTakeaways: [
      '7th chords add a fourth note above the triad; sus chords replace the 3rd entirely; add chords add a note while keeping the 3rd intact.',
      'Every "weird-named" open chord from Modules 5-6 is one of these three precise modifications to a plain triad, not a separate unrelated shape.',
      'This module\'s theory — intervals, triads, and their modifications — completes the "why" behind every chord shape taught since Module 4, and sets up Module 20\'s Circle of Fifths.',
    ],
    keyTakeawaysHi: [
      '7th chords triad ke upar ek chautha note add karte hain; sus chords 3rd ko poori tarah replace karte hain; add chords 3rd ko intact rakhte hue ek note add karte hain.',
      'Modules 5-6 ka har "weird-named" open chord in teen precise modifications mein se ek hai ek plain triad ka, ek separate unrelated shape nahi.',
      'Is module ki theory — intervals, triads, aur unke modifications — Module 4 se sikhaaye gaye har chord shape ke peeche ka "why" complete karti hai, aur Module 20 ke Circle of Fifths ke liye set up karti hai.',
    ],
  },
];
