/**
 * Guitar Course — Module 24: Improvisation Framework, lessons 1-3.
 * Closes Part VIII. Ties Module 22's pentatonic/blues scale and
 * Module 23's modal understanding into one practical approach for
 * soloing over a real chord progression.
 */

import type { CourseLesson } from './course-js-module1';
import { diagramPreviewHtml, fretboardMapSvg } from './guitar-diagrams';

export const GUITAR_MODULE_24: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'matching-scale-to-progression',
    title: 'Matching a Scale to a Chord Progression',
    titleHi: 'Ek Chord Progression Ke Saath Ek Scale Match Karna',
    description: 'One decision, made once per song section, that Module 20\'s relative minor makes almost automatic.',
    descriptionHi: 'Ek decision, ek song section ke liye ek baar liya gaya, jise Module 20 ka relative minor almost automatic banaata hai.',
    difficulty: 'HARD',
    duration: 20,
    order: 1,

    analogy: {
      en: '**Picking the right map for a trip before worrying about the specific turns.** Before planning individual moves in a solo, there\'s one bigger decision that makes everything after it easier: which scale, in which position, covers this whole section of the song. Get that one decision right and the smaller, moment-to-moment choices (Lesson 2) become dramatically simpler.',
      hi: '**Trip ke specific turns ki chinta karne se pehle sahi map pick karna.** Ek solo mein individual moves plan karne se pehle, ek bada decision hai jo uske baad sab kuch easier banaata hai: kaunsa scale, kaunsi position mein, is poore song section ko cover karta hai. Wo ek decision sahi karo aur chhote, moment-to-moment choices (Lesson 2) dramatically simpler ban jaate hain.',
    },

    simple: `**The practical rule: find the progression\'s key, then reach for that key\'s minor pentatonic (Module 22).** A progression built from Am, F, C, and G is centered on A minor — Module 22\'s A minor pentatonic Box 1 covers the whole thing, no scale changes needed as the chords change underneath.

**The relative-pentatonic shortcut, connecting directly to Module 20\'s relative minor:** A minor pentatonic (A-C-D-E-G) and C major pentatonic (C-D-E-G-A) use the EXACT same 5 notes — the same relative major/minor relationship Module 20 taught for full scales applies identically to their pentatonic subsets. This means learning ONE shape (Module 22\'s Box 1) genuinely gives you two usable scales, not one — which one you\'re "in" depends only on which note you choose to resolve to (Module 23\'s core insight, applied here directly).

**Why this single decision is worth making deliberately, before playing a single note:** picking the wrong key\'s pentatonic scale means almost every note will clash against the underlying chords — getting this one decision right is what makes everything else in this module actually work.`,
    simpleHi: `**Practical rule: progression ki key dhoondo, phir us key ke minor pentatonic (Module 22) ke liye reach karo.** Am, F, C, aur G se bani ek progression A minor ke around centered hai — Module 22 ka A minor pentatonic Box1 poori cheez cover karta hai, neeche chords change hote hue bhi koi scale changes ki zaroorat nahi.

**Relative-pentatonic shortcut, directly Module 20 ke relative minor se connect karte hue:** A minor pentatonic (A-C-D-E-G) aur C major pentatonic (C-D-E-G-A) EXACT same 5 notes use karte hain — wahi relative major/minor relationship jo Module 20 ne full scales ke liye sikhaayi thi identically unke pentatonic subsets par apply hoti hai. Matlab EK shape seekhna (Module 22 ka Box1) genuinely tumhe do usable scales deta hai, ek nahi — tum kaunse mein "ho" ye sirf is baat par depend karta hai ki tum resolve karne ke liye kaunsa note choose karte ho (Module 23 ka core insight, yahan directly apply hota hua).

**Ye single decision deliberately kyun lena worth hai, ek bhi note bajaane se pehle:** galat key ka pentatonic scale pick karna matlab hai almost har note underlying chords ke against clash karega — ye ek decision sahi lena hi hai jo is module mein baaki sab kuch actually kaam karwaata hai.`,

    content: `**Why "find the key first" is a genuine practical necessity, not an oversimplification.** Module 22 already established that the pentatonic scale is forgiving WITHIN its own key — but that forgiveness doesn\'t extend across a key mismatch. A C major pentatonic scale played over an E minor progression will clash constantly, because the underlying chords no longer share the note-compatibility relationship Module 20 and Module 22 both depend on.

**Why the relative-pentatonic shortcut is such high-leverage knowledge, connecting three separate modules at once.** This single fact — Module 20\'s relative major/minor relationship, Module 22\'s pentatonic scale, and Module 23\'s "same notes, different home" insight — combine to mean a guitarist who has only ever practiced ONE pentatonic shape (A minor Box 1) is already equipped to solo confidently in TWO different keys (A minor and C major) without learning anything new. This is exactly the kind of structural leverage this course has prioritized building throughout Part VII and VIII, rather than teaching isolated, unconnected facts.

**A genuinely honest note on finding the key of a real, unfamiliar song.** This lesson assumes you already know a progression\'s chords (as you would from a chord chart). Reliably identifying a key purely BY EAR, from an unfamiliar recording, is a separate, valuable skill built through ear-training practice over time — a real, useful next step beyond this course\'s scope, not something this lesson claims to fully solve.`,
    contentHi: `**"Pehle key dhoondo" ek genuine practical necessity kyun hai, ek oversimplification nahi.** Module 22 ne already establish kiya tha ki pentatonic scale apni khud ki key KE ANDAR forgiving hai — lekin wo forgiveness ek key mismatch ke across extend nahi hoti. Ek C major pentatonic scale ek E minor progression ke upar bajaaya jaana constantly clash karega, kyunki underlying chords ab wo note-compatibility relationship share nahi karte jis par Module 20 aur Module 22 dono depend karte hain.

**Relative-pentatonic shortcut itna high-leverage knowledge kyun hai, teen separate modules ko ek saath connect karte hue.** Ye single fact — Module 20 ka relative major/minor relationship, Module 22 ka pentatonic scale, aur Module 23 ka "wahi notes, different home" insight — combine hote hain ye means karne ke liye ki ek guitarist jisne sirf EK pentatonic shape practice ki hai (A minor Box1) already do alag keys mein (A minor aur C major) confidently solo karne ke liye equipped hai, kuch naya seekhe bina. Ye exactly wo kism ka structural leverage hai jo ye course Part VII aur VIII mein build karne ko prioritize kar raha hai, isolated, unconnected facts sikhaane ke bajaye.

**Ek real, unfamiliar song ki key dhoondhne ke baare mein ek genuinely honest note.** Ye lesson assume karta hai ki tumhe already ek progression ke chords pata hain (jaise ek chord chart se hoga). Purely KAAN SE, ek unfamiliar recording se, reliably ek key identify karna ek separate, valuable skill hai jo time ke saath ear-training practice se build hoti hai — is course ke scope se pare ek real, useful next step, kuch aisa nahi jo ye lesson fully solve karne ka claim kare.`,

    examples: [
      {
        title: 'One shape, two keys — A minor pentatonic and C major pentatonic share every note',
        titleHi: 'Ek shape, do keys — A minor pentatonic aur C major pentatonic har note share karte hain',
        previewHeight: 340,
        code: `A minor pentatonic: A - C - D - E - G
C major pentatonic:  C - D - E - G - A

Identical 5 notes, identical physical shape (Module 22's Box 1).
Resolving to A = "in A minor." Resolving to C = "in C major."`,
        preview: diagramPreviewHtml(
          fretboardMapSvg(8, [
            [0, 5], [0, 8],
            [1, 5], [1, 7],
            [2, 5], [2, 7],
            [3, 5], [3, 7],
            [4, 5], [4, 8],
            [5, 5], [5, 8],
          ]),
          'Module 22\'s exact Box 1 shape — genuinely two usable scales (A minor pentatonic and C major pentatonic) in one already-learned hand position.',
        ),
        explain:
          'Reusing the identical diagram from Module 22 rather than drawing a "new" one reinforces the lesson\'s central point as directly as possible: nothing physically changes between these two scales except which note you choose to treat as home.',
        explainHi:
          'Module 22 se identical diagram reuse karna ek "naya" banane ke bajaye lesson ke central point ko jitna directly possible ho utna reinforce karta hai: in do scales ke beech physically kuch nahi badalta sivaay is baat ke ki tum kaunse note ko home treat karne ke liye choose karte ho.',
      },
    ],

    mistakes: [
      {
        wrong: 'Assuming a pentatonic scale learned in one key can be used unchanged over a progression in an unrelated key.',
        right: 'Identify the progression\'s actual key first, and use that key\'s pentatonic scale (or its relative-major/minor equivalent) specifically.',
        why: 'Pentatonic scales are forgiving only within their own compatible key — playing the wrong key\'s scale reintroduces exactly the clashing, dissonant notes Module 22 explained the scale was designed to avoid.',
        whyHi: 'Pentatonic scales sirf apni khud ki compatible key ke andar forgiving hote hain — galat key ka scale bajaana exactly un clashing, dissonant notes ko wapas laata hai jinhe avoid karne ke liye Module 22 ne explain kiya tha ki scale design kiya gaya tha.',
      },
    ],

    realWorld: [
      {
        en: 'A guitarist handed a chord chart mid-rehearsal, with no time to work anything out on paper, relies on exactly this key-identification-then-pentatonic-selection process to start soloing confidently within seconds.',
        hi: 'Ek guitarist jise rehearsal ke beech ek chord chart diya jaaye, paper par kuch bhi work out karne ke liye time ke bina, exactly is key-identification-then-pentatonic-selection process par rely karta hai seconds mein confidently soloing shuru karne ke liye.',
      },
    ],

    interviewQA: [
      {
        q: 'If a progression uses chords from BOTH a key and its relative minor/major mixed together, does the relative-pentatonic shortcut still apply?',
        qHi: 'Agar ek progression ek key AUR uske relative minor/major dono se chords mix karke use karta hai, kya relative-pentatonic shortcut abhi bhi apply hota hai?',
        a: 'Yes — that\'s actually the most common real-world case. A progression mixing C, Am, F, and G chords is exactly this situation, and the single Module 22 pentatonic shape (used as either A minor or C major pentatonic depending on the moment) covers the entire progression without needing to switch shapes.',
        aHi: 'Haan — ye actually sabse common real-world case hai. C, Am, F, aur G chords mix karne wali ek progression exactly yahi situation hai, aur single Module 22 pentatonic shape (moment ke hisaab se ya to A minor ya C major pentatonic ki tarah used) poori progression ko cover karta hai shapes switch karne ki zaroorat ke bina.',
      },
    ],

    exercises: [
      {
        task: 'Given a progression of Em, C, G, D (a very common progression), identify its key using Module 20\'s relative-minor knowledge, and name which pentatonic scale (and shape) you\'d reach for.',
        taskHi: 'Em, C, G, D (ek bahut common progression) ki ek progression di gayi, Module 20 ke relative-minor knowledge use karke uski key identify karo, aur naam do ki tum kaunsa pentatonic scale (aur shape) ke liye reach karoge.',
        hint: 'These four chords are the G major / E minor cluster from Module 20\'s own worked example — the progression is centered on G major (or its relative, E minor).',
        hintHi: 'Ye chaar chords Module 20 ke apne worked example ka G major / E minor cluster hain — progression G major (ya uske relative, E minor) ke around centered hai.',
      },
    ],

    keyTakeaways: [
      'Find the progression\'s key first, then reach for that key\'s minor pentatonic scale (Module 22) — the single most important decision in improvising over a progression.',
      'Relative major and minor keys (Module 20) share identical pentatonic note-sets — one learned shape covers two usable scales.',
      'This module\'s framework only works once the underlying key is correctly identified — everything else builds on getting this first decision right.',
    ],
    keyTakeawaysHi: [
      'Pehle progression ki key dhoondo, phir us key ke minor pentatonic scale (Module 22) ke liye reach karo — ek progression ke upar improvise karne mein sabse important decision.',
      'Relative major aur minor keys (Module 20) identical pentatonic note-sets share karti hain — ek seekhi hui shape do usable scales cover karti hai.',
      'Is module ka framework sirf tabhi kaam karta hai jab underlying key correctly identify ki gayi ho — baaki sab kuch is pehle decision ko sahi karne par build karta hai.',
    ],
    guitarPractice: { earTraining: [{"string":0,"fret":5},{"string":0,"fret":8},{"string":1,"fret":5},{"string":1,"fret":7},{"string":2,"fret":5}] },
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'a-practical-soloing-checklist',
    title: 'A Practical Soloing Checklist: Targeting Chord Tones',
    titleHi: 'Ek Practical Soloing Checklist: Chord Tones Target Karna',
    description: 'Beyond "stay in the scale" — a concrete, checkable way to make phrases sound intentional rather than random.',
    descriptionHi: '"Scale mein raho" se aage — phrases ko intentional sound karwaane ka ek concrete, checkable tareeka, random ke bajaye.',
    difficulty: 'HARD',
    duration: 20,
    order: 2,

    analogy: {
      en: '**Landing on solid ground with every step, even while walking a winding path.** Any note in the correct scale (Lesson 1) will avoid clashing, but not every note sounds equally "resolved" at any given moment. Landing specifically on the underlying chord\'s own notes (Module 19\'s triad tones) on the strong beats is like choosing solid stepping stones along a winding path — the path between them can wander freely, but each landing feels sure-footed.',
      hi: '**Har step ke saath solid ground par land karna, ek winding path chalte hue bhi.** Sahi scale mein koi bhi note (Lesson 1) clashing avoid karega, lekin har note kisi bhi diye gaye moment mein equally "resolved" sound nahi karta. Underlying chord ke apne notes (Module 19 ke triad tones) par specifically strong beats par land karna ek winding path ke saath solid stepping stones choose karne jaisa hai — unke beech ka path freely wander kar sakta hai, lekin har landing sure-footed feel karti hai.',
    },

    simple: `**The practical technique: land on a chord tone (root, 3rd, or 5th — Module 19) exactly when that chord is playing, especially on strong beats.** If the underlying chord is C major (C-E-G) and you land your phrase on a C, E, or G right as that chord sounds, it reads as clearly intentional — even if the notes surrounding it are more freely chosen from the scale.

**Why this single technique does more than "just staying in the scale":** every note in Module 22\'s pentatonic scale avoids clashing, but only SOME of them are the current chord\'s own notes at any given moment. Deliberately targeting those specific notes on strong beats is the difference between a solo that sounds like it\'s reacting to the chords versus one that sounds like it\'s ignoring them while technically staying "safe."

**A simple, checkable practice approach:** play a chord progression slowly (or use a backing track), and on each chord change, deliberately land your very first note of that new chord\'s section on one of its chord tones. This one habit, practiced deliberately, does more for making a solo sound musical than simply knowing more scale shapes.`,
    simpleHi: `**Practical technique: exactly tab ek chord tone (root, 3rd, ya 5th — Module 19) par land karo jab wo chord baj raha ho, especially strong beats par.** Agar underlying chord C major hai (C-E-G) aur tum apni phrase ko ek C, E, ya G par land karte ho bilkul jab wo chord sound karta hai, ye clearly intentional padhta hai — chahe uske around ke notes scale se zyada freely choose kiye gaye hon.

**Ye single technique "bas scale mein rehne" se zyada kyun karti hai:** Module 22 ke pentatonic scale mein har note clashing avoid karta hai, lekin unmein se sirf KUCH kisi bhi diye gaye moment mein current chord ke apne notes hain. Un specific notes ko strong beats par deliberately target karna wo difference hai ek solo ke beech jo chords ko react karte hue sound karta hai versus ek jo unhe ignore karte hue sound karta hai technically "safe" rehte hue.

**Ek simple, checkable practice approach:** ek chord progression slowly bajaao (ya ek backing track use karo), aur har chord change par, deliberately us naye chord ke section ke apne bilkul pehle note ko uske chord tones mein se ek par land karo. Ye ek habit, deliberately practice ki gayi, ek solo ko musical sound karwaane ke liye zyada scale shapes jaanne se zyada karti hai.`,

    content: `**Why targeting chord tones specifically on STRONG beats, rather than anywhere in a phrase, is the precise version of this technique.** A chord tone played on a weak, unaccented beat is far less audible as "intentional" than the same note landed exactly as the chord changes, or on the beat itself. This is a rhythm-and-emphasis point as much as a note-choice one — Module 8\'s strumming-pattern emphasis and this soloing technique are applying the same underlying "strong beats carry more weight" principle to two different playing contexts.

**Why this technique works WITH the pentatonic scale rather than replacing it.** This isn\'t a different scale or a competing system — it\'s a targeting rule layered on top of Module 22\'s scale choice. Most of a phrase can still freely use any pentatonic note; this technique specifically shapes WHERE the chord-tone notes land relative to the chord changes, adding intentionality without discarding the safety net the pentatonic scale already provides.

**An honest connection back to Module 19\'s original framing of chord tones.** Module 19 introduced root-3rd-5th purely as a way to understand how chords are BUILT. This lesson is the first time those same three notes reappear as a practical PLAYING target, rather than a structural fact about chords — a good example of how theory introduced for one purpose often resurfaces as a practical tool for another, later purpose.`,
    contentHi: `**Chord tones ko specifically STRONG beats par target karna, phrase mein kahin bhi ke bajaye, is technique ka precise version kyun hai.** Ek chord tone jo ek weak, unaccented beat par bajaaya jaaye "intentional" ki tarah utna audible nahi hai jitna wahi note exactly tab landed jab chord change hota hai, ya beat par hi. Ye ek rhythm-and-emphasis point hai utna hi jitna ek note-choice wala — Module 8 ka strumming-pattern emphasis aur ye soloing technique wahi underlying "strong beats zyada weight carry karte hain" principle ko do alag playing contexts par apply kar rahe hain.

**Ye technique pentatonic scale ke SAATH kyun kaam karti hai, use replace karne ke bajaye.** Ye ek alag scale ya ek competing system nahi hai — ye Module 22 ke scale choice ke upar layered ek targeting rule hai. Ek phrase ka zyadatar hissa abhi bhi kisi bhi pentatonic note ko freely use kar sakta hai; ye technique specifically shape karti hai ki chord-tone notes chord changes ke relative KAHAN land karte hain, us safety net ko discard kiye bina intentionality add karte hue jo pentatonic scale already provide karta hai.

**Module 19 ki chord tones ki original framing se ek honest connection wapas.** Module 19 ne root-3rd-5th ko purely ye samajhne ke tareeke ki tarah introduce kiya tha ki chords kaise BUILT hote hain. Ye lesson pehli baar hai jab wahi teen notes ek practical PLAYING target ki tarah reappear karte hain, chords ke baare mein ek structural fact ke bajaye — ek achha example ki kaise ek purpose ke liye introduce ki gayi theory often ek baad ke, doosre purpose ke liye ek practical tool ki tarah resurface hoti hai.`,

    examples: [
      {
        title: 'Landing on chord tones as the underlying chord changes, in an Am-F-C-G progression',
        titleHi: 'Underlying chord change hote hue chord tones par landing, ek Am-F-C-G progression mein',
        previewHeight: 320,
        code: `Chord:        Am        F         C         G
Chord tones:  A,C,E     F,A,C     C,E,G     G,B,D

A phrase that lands on an A or C when Am plays, an F or A when F
plays, a C or E when C plays, and a G or B when G plays will sound
clearly connected to the progression — even if everything else in
the phrase is freely chosen from the A minor pentatonic scale.`,
        preview: diagramPreviewHtml(
          fretboardMapSvg(8, [
            [0, 5], [0, 8],
            [1, 5], [1, 7],
            [2, 5], [2, 7],
            [3, 5], [3, 7],
            [4, 5], [4, 8],
            [5, 5], [5, 8],
          ]),
          'The same A minor pentatonic Box 1 from Modules 22-24 — the chord-tone targeting technique changes WHEN you play certain notes, not WHICH shape you use.',
        ),
        explain:
          'Showing the exact same shape one more time reinforces that this lesson adds a timing/targeting habit on top of scale knowledge you already have — no new physical vocabulary, only a new way to use it deliberately.',
        explainHi:
          'Exact same shape ek baar aur dikhaana reinforce karta hai ki ye lesson scale knowledge ke upar ek timing/targeting habit add karta hai jo tumhe already hai — koi naya physical vocabulary nahi, sirf use deliberately use karne ka ek naya tareeka.',
      },
    ],

    mistakes: [
      {
        wrong: 'Playing scale notes at a constant, undifferentiated density without regard for which chord is currently sounding underneath.',
        right: 'Deliberately target the current chord\'s own notes on strong beats and chord changes, letting other moments be freer.',
        why: 'A solo that ignores the underlying chord changes reads as disconnected from the song even when every individual note is technically "in the scale" and avoiding clashes.',
        whyHi: 'Ek solo jo underlying chord changes ko ignore karta hai song se disconnected padhta hai chahe har individual note technically "scale mein" ho aur clashes avoid kar raha ho.',
      },
    ],

    realWorld: [
      {
        en: 'Experienced improvisers across genres consistently describe "playing the changes" (targeting each chord\'s own notes as it passes) as the specific skill that separates a solo that merely avoids wrong notes from one that actively sounds musical.',
        hi: 'Genres ke across experienced improvisers consistently "playing the changes" (har chord ke apne notes ko target karna jaise wo pass hota hai) ko us specific skill ki tarah describe karte hain jo ek solo ko alag karta hai jo sirf galat notes avoid karta hai us se jo actively musical sound karta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Does chord-tone targeting mean every single note in a solo should be a root, 3rd, or 5th?',
        qHi: 'Kya chord-tone targeting ka matlab hai ki ek solo mein har single note ek root, 3rd, ya 5th hona chahiye?',
        a: 'No — that would remove all the melodic movement that makes a solo interesting. The technique specifically targets STRONG beats and chord-change moments with chord tones, while the notes between them can (and should) freely use the rest of the pentatonic scale for melodic motion.',
        aHi: 'Nahi — ye us saare melodic movement ko hata dega jo ek solo ko interesting banaata hai. Ye technique specifically STRONG beats aur chord-change moments ko chord tones se target karti hai, jabki unke beech ke notes melodic motion ke liye baaki pentatonic scale ko freely (aur chahiye ki) use kar sakte hain.',
      },
    ],

    exercises: [
      {
        task: 'Over a slow C-G-Am-F progression (a very common one), identify the chord tones for each chord, then practice landing on one of that chord\'s tones the moment each new chord begins.',
        taskHi: 'Ek slow C-G-Am-F progression (ek bahut common wala) ke upar, har chord ke liye chord tones identify karo, phir practice karo ki har naya chord shuru hote hi uske tones mein se ek par land karo.',
        hint: 'C\'s tones are C-E-G, G\'s are G-B-D, Am\'s are A-C-E, F\'s are F-A-C — use Module 19\'s triad recipe to double-check each if unsure.',
        hintHi: 'C ke tones C-E-G hain, G ke G-B-D hain, Am ke A-C-E hain, F ke F-A-C hain — unsure hone par har ek ko double-check karne ke liye Module 19 ke triad recipe use karo.',
      },
    ],

    keyTakeaways: [
      'Landing on the current chord\'s own notes (root, 3rd, or 5th) on strong beats and chord changes makes a solo sound intentional and connected to the progression.',
      'This technique layers on top of the pentatonic scale (Lesson 1) rather than replacing it — most of a phrase can still move freely through the scale.',
      'Module 19\'s chord-tone theory, originally taught to explain how chords are built, resurfaces here as a direct, practical playing target.',
    ],
    keyTakeawaysHi: [
      'Strong beats aur chord changes par current chord ke apne notes (root, 3rd, ya 5th) par land karna ek solo ko intentional aur progression se connected sound karwaata hai.',
      'Ye technique pentatonic scale (Lesson 1) ke upar layer hoti hai, use replace karne ke bajaye — phrase ka zyadatar hissa abhi bhi scale ke through freely move kar sakta hai.',
      'Module 19 ki chord-tone theory, originally chords kaise build hote hain explain karne ke liye sikhaayi gayi, yahan ek direct, practical playing target ki tarah resurface hoti hai.',
    ],
    guitarPractice: { sequences: [{"title":"Am-F-C-G, root notes only","titleHi":"Am-F-C-G, sirf root notes","defaultBpm":70,"notes":[{"string":0,"fret":5,"beat":0},{"string":0,"fret":1,"beat":2},{"string":0,"fret":8,"beat":4},{"string":0,"fret":3,"beat":6}]}] },
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'practicing-improvisation',
    title: 'Practicing Improvisation: A Realistic Approach',
    titleHi: 'Improvisation Practice Karna: Ek Realistic Approach',
    description: 'Closing Part VIII: how to actually build this skill over time, and what has been deliberately left for later.',
    descriptionHi: 'Part VIII close karte hue: is skill ko time ke saath actually kaise build karein, aur kya deliberately baad ke liye chhoda gaya hai.',
    difficulty: 'HARD',
    duration: 15,
    order: 3,

    analogy: {
      en: '**Learning a new language through conversation practice, not just vocabulary drills.** Knowing vocabulary (scales) and grammar rules (chord-tone targeting) doesn\'t create fluency by itself — fluency comes from actually using the language in real, structured practice conversations. A backing track is exactly this for improvisation: a structured, repeatable "conversation" to practice actually using everything Module 22-24 covered.',
      hi: '**Ek nayi language conversation practice se seekhna, sirf vocabulary drills se nahi.** Vocabulary (scales) aur grammar rules (chord-tone targeting) jaanna apne aap fluency create nahi karta — fluency actually language ko real, structured practice conversations mein use karne se aati hai. Ek backing track improvisation ke liye exactly yahi hai: ek structured, repeatable "conversation" jo Module 22-24 ne cover ki hai wo sab kuch actually use karne ki practice karne ke liye.',
    },

    simple: `**A concrete practice routine, combining everything from this module:** loop a simple 2-4 chord progression (a backing track, or a looper pedal, or even just repeating it yourself slowly). Identify its key (Lesson 1). Play only the matching pentatonic scale, very slowly, focusing purely on landing chord tones on the strong beats (Lesson 2) — speed and complexity come later, accuracy and intention come first, the same "slow first" principle from Module 9.

**Recording yourself is a genuinely disproportionately useful habit here.** What feels musical while playing often sounds different played back — recording even short practice loops and listening back critically is one of the highest-value, lowest-effort habits for improving improvisation specifically, because it\'s the only reliable way to hear your own playing the way a listener actually does.

**An honest, direct closing statement for Part VIII as a whole.** Modules 22-24 gave you a genuinely complete BEGINNER\'S FRAMEWORK for improvisation: a safe scale, a way to expand its color, and a practical targeting technique. Real improvisational fluency is built over months and years of exactly this kind of deliberate practice — this course has given you a correct, honest starting point, not a shortcut around the practice itself.`,
    simpleHi: `**Ek concrete practice routine, is module se sab kuch combine karte hue:** ek simple 2-4 chord progression loop karo (ek backing track, ya ek looper pedal, ya khud slowly repeat karte hue). Uski key identify karo (Lesson1). Sirf matching pentatonic scale bajaao, bahut slowly, purely strong beats par chord tones landing par focus karte hue (Lesson2) — speed aur complexity baad mein aate hain, accuracy aur intention pehle aate hain, wahi "slow first" principle Module 9 se.

**Khud ko record karna yahan ek genuinely disproportionately useful habit hai.** Jo bajaate waqt musical feel karta hai often played back hone par alag sound karta hai — chhote practice loops ko bhi record karna aur critically wapas sunna improvisation improve karne ke liye specifically sabse highest-value, lowest-effort habits mein se ek hai, kyunki ye ek reliable tareeka hai apna khud ka playing us tareeke se sunne ka jaise ek listener actually sunta hai.

**Poore Part VIII ke liye ek honest, direct closing statement.** Modules 22-24 ne tumhe improvisation ke liye ek genuinely complete BEGINNER'S FRAMEWORK diya: ek safe scale, uska color expand karne ka ek tareeka, aur ek practical targeting technique. Real improvisational fluency exactly is kism ki deliberate practice se mahino aur saalon mein build hoti hai — is course ne tumhe ek correct, honest starting point diya hai, practice ke around ka ek shortcut nahi.`,

    content: `**Why recording yourself specifically addresses a blind spot that simply practicing more doesn\'t fix.** While playing, attention is split between technique, listening, and reacting in real time — genuinely difficult to also critically evaluate the result at the same moment. Recording removes that split: on playback, all your attention goes to evaluation, catching things (timing looseness, unclear phrasing, muddled chord-tone targeting) that were invisible in the moment of playing.

**Why slow, deliberate practice over a simple loop is more valuable early on than jumping straight into playing along with full songs.** A looped 2-4 chord progression removes the cognitive load of tracking a constantly-changing song structure, letting full attention go to the actual skills this module taught (key identification, chord-tone targeting) — the same principle behind Module 6\'s isolated chord-transition drills and Module 9\'s "accuracy before speed," applied here to a new skill.

**A closing, honest synthesis of Part VIII, and what comes next.** Module 22 gave you a safe scale. Module 23 gave you a way to understand and eventually add color and character beyond "safe." Module 24 gave you a practical framework for actually using both against real chord progressions. Part IX (Modules 25-26, the course\'s final section) shifts to advanced techniques — hammer-ons, pull-offs, slides, bends (the exact physical tools Module 22 Lesson 3 already flagged as commonly paired with the blue note) — and closes with a realistic long-term roadmap for continuing to grow past this course\'s final lesson.`,
    contentHi: `**Khud ko record karna specifically ek blind spot ko kyun address karta hai jise simply zyada practice karna fix nahi karta.** Bajaate waqt, attention technique, listening, aur real time mein react karne ke beech split hota hai — genuinely difficult hai usi moment mein result ko critically evaluate bhi karna. Recording us split ko hata deta hai: playback par, tumhaari poori attention evaluation mein jaati hai, un cheezon ko pakadte hue (timing looseness, unclear phrasing, muddled chord-tone targeting) jo bajaane ke moment mein invisible thi.

**Ek simple loop par slow, deliberate practice shuru mein poore songs ke saath directly bajaane se zyada valuable kyun hai.** Ek looped 2-4 chord progression ek constantly-changing song structure track karne ka cognitive load hata deta hai, poori attention ko is module ne jo actual skills sikhaayi (key identification, chord-tone targeting) unhe jaane deta hai — wahi principle Module 6 ke isolated chord-transition drills aur Module 9 ke "speed se pehle accuracy" ke peeche, yahan ek naye skill par apply hota hua.

**Part VIII ka ek closing, honest synthesis, aur aage kya aata hai.** Module 22 ne tumhe ek safe scale diya. Module 23 ne tumhe "safe" se aage color aur character samajhne aur eventually add karne ka ek tareeka diya. Module 24 ne tumhe dono ko real chord progressions ke against actually use karne ke liye ek practical framework diya. Part IX (Modules 25-26, course ka final section) advanced techniques ki taraf shift karta hai — hammer-ons, pull-offs, slides, bends (exact physical tools jo Module 22 Lesson 3 ne already blue note ke saath commonly paired hone ki tarah flag kiye the) — aur is course ke final lesson se aage grow karte rehne ke liye ek realistic long-term roadmap ke saath close hota hai.`,

    examples: [
      {
        title: 'A minimal practice loop, combining Lessons 1 and 2 of this module',
        titleHi: 'Ek minimal practice loop, is module ke Lessons 1 aur 2 ko combine karte hue',
        previewHeight: 280,
        code: `1. Loop: Am - F - C - G (repeating)
2. Key: A minor (Lesson 1)
3. Scale: A minor pentatonic, Box 1 (Module 22)
4. Focus: land on each chord's own tones (Lesson 2) as it changes
5. Speed: slow enough to hit every target deliberately
6. Record it, listen back, repeat`,
        preview: diagramPreviewHtml(
          fretboardMapSvg(8, [
            [0, 5], [0, 8],
            [1, 5], [1, 7],
            [2, 5], [2, 7],
            [3, 5], [3, 7],
            [4, 5], [4, 8],
            [5, 5], [5, 8],
          ]),
          'The same Box 1 shape, one final time — this module\'s entire framework runs on a single, already-familiar physical position.',
        ),
        explain:
          'A concrete, minimal, repeatable routine written out as an actual checklist is more immediately actionable than a general description of "practice improvising" — this is the kind of specific starting point Module 3\'s original practice-schedule guidance promised for every skill in this course.',
        explainHi:
          'Ek concrete, minimal, repeatable routine ek actual checklist ki tarah likha hua "improvise practice karo" ke general description se zyada immediately actionable hai — ye wo kism ka specific starting point hai jo Module 3 ki original practice-schedule guidance ne is course ki har skill ke liye promise kiya tha.',
      },
    ],

    mistakes: [
      {
        wrong: 'Practicing improvisation only by playing along with full songs at full speed and complexity from the start.',
        right: 'Start with a slow, simple, looped progression, isolating key-finding and chord-tone targeting before adding speed or song complexity.',
        why: 'Full-speed, full-complexity practice from the start overloads attention across too many things at once, the same isolation-before-integration principle this course has applied to every other physical and musical skill.',
        whyHi: 'Shuru se full-speed, full-complexity practice attention ko ek saath bahut saari cheezon ke across overload karta hai, wahi isolation-before-integration principle jo ye course har doosri physical aur musical skill par apply kar chuka hai.',
      },
    ],

    realWorld: [
      {
        en: 'Professional musicians preparing for a recording session routinely record and critically review their own practice takes beforehand — this isn\'t a beginner-only habit, it\'s standard professional practice at every skill level.',
        hi: 'Ek recording session ke liye prepare karte professional musicians routinely apne practice takes ko pehle se record aur critically review karte hain — ye ek beginner-only habit nahi hai, ye har skill level par standard professional practice hai.',
      },
    ],

    interviewQA: [
      {
        q: 'How long should a beginner expect to spend on this slow, deliberate practice approach before it starts to feel natural?',
        qHi: 'Ek beginner ko expect karna chahiye ki is slow, deliberate practice approach par kitna time bitaana hai is se pehle ki ye natural feel karna shuru kare?',
        a: 'This varies significantly by individual, but weeks to a few months of consistent, deliberate practice (following Module 3\'s frequency guidance) before basic fluency starts to feel natural is a realistic, honest expectation — genuinely fluent, expressive improvisation continues developing for years beyond that.',
        aHi: 'Ye individual ke hisaab se significantly vary karta hai, lekin consistent, deliberate practice ke weeks se kuch months (Module 3 ki frequency guidance follow karte hue) is se pehle ki basic fluency natural feel karna shuru kare ek realistic, honest expectation hai — genuinely fluent, expressive improvisation uske aage saalon tak develop hoti rehti hai.',
      },
    ],

    exercises: [
      {
        task: 'Set up the exact minimal practice loop from this lesson\'s example (Am-F-C-G, A minor pentatonic Box 1, chord-tone targeting) and record a 1-minute take. Listen back once, and note one specific thing you\'d improve.',
        taskHi: 'Is lesson ke example se exact minimal practice loop set up karo (Am-F-C-G, A minor pentatonic Box1, chord-tone targeting) aur ek 1-minute take record karo. Ek baar wapas suno, aur ek specific cheez note karo jise tum improve karoge.',
        hint: 'Common first findings: rushing through chord changes, or landing near a chord tone but not quite on it — both are completely normal early observations, not failures.',
        hintHi: 'Common pehli findings: chord changes ke through rush karna, ya ek chord tone ke paas land karna lekin bilkul usपार nahi — dono completely normal early observations hain, failures nahi.',
      },
    ],

    keyTakeaways: [
      'Practice with a slow, simple, looped progression first — isolating key-finding and chord-tone targeting before adding speed or complexity.',
      'Recording and critically listening back is a disproportionately high-value habit, since it\'s the only reliable way to evaluate your own playing the way a listener hears it.',
      'This closes Part VIII: a safe scale (Module 22), a way to understand color (Module 23), and a practical framework for using both (Module 24) — a genuine beginner\'s foundation, with real fluency built over ongoing practice beyond this course.',
    ],
    keyTakeawaysHi: [
      'Pehle ek slow, simple, looped progression ke saath practice karo — speed ya complexity add karne se pehle key-finding aur chord-tone targeting ko isolate karte hue.',
      'Record karna aur critically wapas sunna ek disproportionately high-value habit hai, kyunki ye apna khud ka playing us tareeke se evaluate karne ka ek reliable tareeka hai jaise ek listener sunta hai.',
      'Ye Part VIII close karta hai: ek safe scale (Module 22), color samajhne ka ek tareeka (Module 23), aur dono use karne ke liye ek practical framework (Module 24) — ek genuine beginner ki foundation, is course se aage ongoing practice se real fluency build hoti hui.',
    ],
    guitarPractice: { sequences: [{"title":"Am-F-C-G practice loop, root notes","titleHi":"Am-F-C-G practice loop, root notes","defaultBpm":70,"notes":[{"string":0,"fret":5,"beat":0},{"string":0,"fret":1,"beat":2},{"string":0,"fret":8,"beat":4},{"string":0,"fret":3,"beat":6}]}] },
  },
];
