/**
 * Guitar Course — Module 16: Power Chords, lessons 1-3.
 *
 * Lesson 1: What a power chord actually is (and isn't) — a 2-3 note
 *           movable shape, not a full chord in the theory sense.
 * Lesson 2: Making the shape genuinely movable — one shape, any root.
 * Lesson 3: Palm muting power chords for tight, percussive riffs —
 *           extending Module 7's palm-muting technique.
 */

import type { CourseLesson } from './course-js-module1';
import { chordFamilyHtml } from './guitar-diagrams';
import { POWER_CHORDS } from './guitar-chords-data';

export const GUITAR_MODULE_16: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'what-is-a-power-chord',
    title: 'What a Power Chord Actually Is (and Isn\'t)',
    titleHi: 'Ek Power Chord Actually Kya Hai (Aur Kya Nahi)',
    description: 'Two or three notes, two fingers, and a name that oversells its own complexity — the easiest "new chord category" in the whole course.',
    descriptionHi: 'Do ya teen notes, do fingers, aur ek naam jo apni khud ki complexity oversell karta hai — poore course mein sabse easy "new chord category."',
    difficulty: 'EASY',
    duration: 15,
    order: 1,

    analogy: {
      en: '**A silhouette instead of a full-color portrait.** A full chord (major or minor, Modules 4-5) is a detailed portrait — several specific notes creating a specific emotional character (happy/sad, Module 4 touched on this). A power chord is a silhouette: just the outline, the root and one supporting note, with the "happy or sad" detail deliberately left out. It\'s simpler by design, not a lesser version of a real chord.',
      hi: '**Ek full-color portrait ke bajaye ek silhouette.** Ek full chord (major ya minor, Modules 4-5) ek detailed portrait hai — kai specific notes jo ek specific emotional character banate hain (happy/sad, Module 4 ne ise touch kiya tha). Ek power chord ek silhouette hai: bas outline, root aur ek supporting note, "happy or sad" detail deliberately chhoda hua. Ye design se simpler hai, ek real chord ka lesser version nahi.',
    },

    simple: `**A power chord, mechanically:** just two notes — the root and its "5th" (a specific supporting interval, covered properly in Module 19\'s theory) — sometimes with the root repeated an octave higher as a third note for fullness. No major/minor quality at all; a power chord is neither happy nor sad, it\'s neutral and punchy.

**Why "power chord," not "power triad" or similar:** the name refers to its raw, forceful sound in a full band mix (especially with distortion on electric guitar) rather than to any music-theory property — it\'s a colloquial, not a technical, name.

**The basic shape, root on the low E string:**

\`\`\`
E5 (root = open low E)
  E |---0---   open (root)
  A |---2---   finger 1
  D |---2---   finger 3
  (G, B, high e strings: not played)
\`\`\``,
    simpleHi: `**Ek power chord, mechanically:** bas do notes — root aur uska "5th" (ek specific supporting interval, properly Module 19 ki theory mein covered) — kabhi kabhi root ke saath ek octave higher repeated as a third note fullness ke liye. Bilkul koi major/minor quality nahi; ek power chord na happy hai na sad, ye neutral aur punchy hai.

**"Power chord" kyun, "power triad" ya similar nahi:** naam uske raw, forceful sound ko refer karta hai ek full band mix mein (especially electric guitar par distortion ke saath), kisi music-theory property ko nahi — ye ek colloquial naam hai, technical nahi.

**Basic shape, root low E string par:**

\`\`\`
E5 (root = open low E)
  E |---0---   open (root)
  A |---2---   finger 1
  D |---2---   finger 3
  (G, B, high e strings: nahi bajaayi jaati)
\`\`\``,

    content: `**Why power chords are genuinely easier than full open chords, mechanically, not just conceptually.** Only 2-3 strings are involved at all, and the finger shape is compact and consistent — none of Module 5\'s wide stretches (G) or crowded formations (A/Am), and critically, fewer strings means fewer ways to accidentally introduce a buzz or mute. This is a real, mechanical simplicity, not just a simpler theoretical concept.

**Why leaving out the major/minor-defining note is a deliberate feature, not a limitation.** In a loud, distorted, or busy musical context (the contexts power chords are most associated with), the specific major/minor note can clash or muddy the sound; omitting it produces a cleaner, more forceful tone that works regardless of whether the surrounding music implies major or minor — genuine musical utility, not merely "the easy version."

**How this connects to Module 5\'s "muted string" skill.** Playing only 2-3 of 6 strings means deliberately NOT strumming the others — the exact same selective-muting skill from Module 5\'s C and D chords, just extended further (now 3-4 strings avoided instead of 1-2). If that skill felt solid back then, this should feel like a natural continuation, not a new challenge.`,
    contentHi: `**Power chords genuinely full open chords se easier kyun hain, mechanically, sirf conceptually nahi.** Sirf 2-3 strings hi involve hoti hain, aur finger shape compact aur consistent hai — Module 5 ke wide stretches (G) ya crowded formations (A/Am) mein se koi nahi, aur critically, kam strings ka matlab hai accidentally buzz ya mute introduce karne ke kam tareeke. Ye ek real, mechanical simplicity hai, sirf ek simpler theoretical concept nahi.

**Major/minor-defining note ko chhod dena deliberately ek feature kyun hai, limitation nahi.** Ek loud, distorted, ya busy musical context mein (jo contexts power chords sabse zyada associated hain), specific major/minor note clash kar sakta ya sound muddy kar sakta hai; use omit karna ek cleaner, zyada forceful tone produce karta hai jo kaam karta hai chahe surrounding music major ho ya minor imply kare — genuine musical utility, sirf "easy version" nahi.

**Ye Module 5 ki "muted string" skill se kaise connect hota hai.** 6 mein se sirf 2-3 strings bajaana matlab hai deliberately baaki NAHI strum karna — bilkul wahi selective-muting skill jo Module 5 ke C aur D chords se hai, bas aur extended (ab 3-4 strings avoid hoti hain 1-2 ke bajaye). Agar wo skill tab solid feel hui thi, ye ek natural continuation feel karna chahiye, ek naya challenge nahi.`,

    examples: [
      {
        title: 'E5 and A5, the two most common power-chord shapes',
        titleHi: 'E5 aur A5, do sabse common power-chord shapes',
        previewHeight: 340,
        code: `E5: root on low E string (open), fingers on A and D strings.
A5: root on A string, fingers on D and G strings.
Same finger shape, just started from a different root string.`,
        preview: chordFamilyHtml([POWER_CHORDS.E5, POWER_CHORDS.A5], 'Both power chords use the exact same relative finger pattern — the shape barely changes between them.'),
        explain:
          'Notice how visually similar E5 and A5 are — this is your first hint of Lesson 2\'s "movable shape" idea, where recognizing a shared pattern across different starting points becomes the whole point.',
        explainHi:
          'Notice karo E5 aur A5 visually kitne similar hain — ye Lesson 2 ke "movable shape" idea ka tumhara pehla hint hai, jahan alag starting points ke across ek shared pattern recognize karna poora point ban jaata hai.',
      },
    ],

    mistakes: [
      {
        wrong: 'Accidentally strumming the G, B, and high e strings along with a power chord, muddying the intended sound.',
        right: 'Strum only the specific 2-3 strings the shape uses — the same deliberate string-avoidance skill from Module 5.',
        why: 'The clean, punchy character that defines a power chord depends entirely on ONLY those specific notes sounding — extra strings reintroduce exactly the tonal complexity the shape was designed to strip out.',
        whyHi: 'Wo clean, punchy character jo ek power chord ko define karta hai poori tarah is par depend karta hai ki SIRF wahi specific notes sound karein — extra strings exactly wahi tonal complexity reintroduce kar deti hain jise shape strip out karne ke liye design kiya gaya tha.',
      },
    ],

    realWorld: [
      {
        en: 'Power chords are the backbone of rock, punk, and metal rhythm guitar specifically because their neutral major/minor-free character sits cleanly under distortion and heavy bass, where a full chord would often sound muddy or clash with the bass line.',
        hi: 'Power chords rock, punk, aur metal rhythm guitar ki backbone hain specifically kyunki unka neutral major/minor-free character distortion aur heavy bass ke neeche cleanly baithta hai, jahan ek full chord often muddy sound karta ya bass line se clash karta.',
      },
    ],

    interviewQA: [
      {
        q: 'If a power chord has no major/minor quality, how do I know if a song is happy or sad when it uses power chords?',
        qHi: 'Agar ek power chord mein koi major/minor quality nahi hai, mujhe kaise pata chalega ki ek song happy ya sad hai jab wo power chords use karta hai?',
        a: "The overall melody, vocal line, and song context typically carry that emotional information instead — power chords provide rhythmic and harmonic punch while other elements of the arrangement carry the major/minor character. It's a division of labor, not a total absence of emotional information in the song.",
        aHi: 'Overall melody, vocal line, aur song context typically wo emotional information carry karte hain iske bajaye — power chords rhythmic aur harmonic punch provide karte hain jabki arrangement ke doosre elements major/minor character carry karte hain. Ye labor ka ek division hai, song mein emotional information ki total absence nahi.',
      },
    ],

    exercises: [
      {
        task: 'Play E5 and A5 alternately 10 times, checking each time that only the intended 2-3 strings ring and nothing else.',
        taskHi: 'E5 aur A5 ko alternately 10 baar bajao, har baar check karte hue ki sirf intended 2-3 strings ring karti hain aur kuch aur nahi.',
        hint: 'If unwanted strings keep ringing, check your strumming-hand motion (Module 7) is targeted specifically at the intended strings, not a full wide strum out of habit.',
        hintHi: 'Agar unwanted strings baar-baar ring karti hain, check karo ki tumhari strumming-hand motion (Module 7) specifically intended strings par targeted hai, habit se ek full wide strum nahi.',
      },
    ],

    keyTakeaways: [
      'A power chord is just 2-3 notes (root + 5th, sometimes + octave) — no major/minor quality, deliberately neutral and punchy.',
      'It\'s mechanically easier than a full chord: fewer strings, a compact shape, no wide stretches or crowded formations.',
      'Playing only the intended strings reuses Module 5\'s selective-muting skill, just extended to more strings.',
    ],
    keyTakeawaysHi: [
      'Ek power chord bas 2-3 notes hai (root + 5th, kabhi + octave) — koi major/minor quality nahi, deliberately neutral aur punchy.',
      'Ye ek full chord se mechanically easier hai: kam strings, ek compact shape, koi wide stretches ya crowded formations nahi.',
      'Sirf intended strings bajaana Module 5 ki selective-muting skill reuse karta hai, bas zyada strings tak extended.',
    ],
    guitarPractice: { sequences: [{"title":"E5, root then 5th","titleHi":"E5, root phir 5th","defaultBpm":80,"notes":[{"string":0,"fret":0,"beat":0},{"string":1,"fret":2,"beat":1,"finger":1},{"string":2,"fret":2,"beat":2,"finger":3}]}] },
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'movable-power-chord-shape',
    title: 'One Shape, Any Root — Making It Genuinely Movable',
    titleHi: 'Ek Shape, Koi Bhi Root — Ise Genuinely Movable Banana',
    description: 'The real payoff of power chords: the exact same two-finger shape produces a different chord at every fret, with nothing new to learn.',
    descriptionHi: 'Power chords ka real payoff: bilkul wahi two-finger shape har fret par ek alag chord produce karta hai, seekhne ke liye kuch naya nahi.',
    difficulty: 'MEDIUM',
    duration: 15,
    order: 2,

    analogy: {
      en: '**A rubber stamp, not a hand-drawn picture.** Every open chord so far (Modules 4-5) is like a hand-drawn picture specific to its own position on the neck. A power chord is a rubber stamp — press the same exact shape down anywhere on the neck, and you get a correctly-formed new chord every time, just at a different pitch, with zero new drawing required.',
      hi: '**Ek rubber stamp, hand-drawn picture nahi.** Ab tak ka har open chord (Modules 4-5) apni khud ki neck par position ke liye specific ek hand-drawn picture jaisa hai. Ek power chord ek rubber stamp hai — wahi exact shape neck mein kahin bhi press karo, aur tumhe har baar ek correctly-formed nayi chord milti hai, bas ek alag pitch par, zero new drawing required ke saath.',
    },

    simple: `**The movable principle:** the E5 shape (root on low E, Lesson 1) can slide to ANY fret on the low E string, and the exact same two-finger shape produces a correctly-formed power chord rooted at that new fret — you never need to learn a "new" shape, only where to place the same one.

\`\`\`
E5 shape at fret 0 (open) = E5
Same shape, slid to fret 3 = G5
Same shape, slid to fret 5 = A5
\`\`\`

**Why this is such a big deal, compared to everything before Module 16:** every open chord (Modules 4-5) had its own unique finger arrangement — 6 chords meant 6 shapes to memorize. One movable power-chord shape effectively gives you access to EVERY root note on that string, using a single piece of muscle memory.`,
    simpleHi: `**Movable principle:** E5 shape (root low E par, Lesson 1) neck par KISI BHI fret par slide ho sakta hai, aur wahi exact two-finger shape us nayi fret par rooted ek correctly-formed power chord produce karta hai — tumhe kabhi ek "nayi" shape seekhne ki zaroorat nahi, sirf ye ki wahi ek kahan place karni hai.

\`\`\`
E5 shape fret 0 par (open) = E5
Same shape, fret 3 tak slid = G5
Same shape, fret 5 tak slid = A5
\`\`\`

**Ye itna bada deal kyun hai, Module 16 se pehle ki har cheez ke comparison mein:** har open chord (Modules 4-5) ka apna unique finger arrangement tha — 6 chords ka matlab tha 6 shapes memorize karna. Ek movable power-chord shape effectively tumhe us string ke HAR root note tak access deta hai, ek single piece of muscle memory use karke.`,

    content: `**Why a shape can be "movable" at all — the mechanism, connecting back to Module 2.** Module 2 established that each fret raises pitch by a fixed musical step (a semitone), uniformly, regardless of position on the neck. A power chord\'s two notes maintain the same FIXED relationship (root and 5th) to each other no matter which fret they start from, because both notes shift up by the identical amount when the whole shape slides — the relationship between the two notes, not their absolute position, is what defines "power chord." This is exactly why the shape transfers cleanly to any fret.

**Why knowing the note names on the low E string (previewing Module 18) makes this shape genuinely useful, not just a neat trick.** Without knowing which note each fret produces, you can slide the shape around but wouldn\'t know WHICH power chord you\'re playing at any given fret — Module 18\'s fretboard map turns this movable shape from "a cool mechanical trick" into "an actual usable tool," by telling you exactly which fret to land on for a specific target chord.

**A second root-string option, worth knowing now even before full fretboard mastery.** A power chord can also be rooted on the A string (like A5 in Lesson 1\'s example) using the identical relative finger shape, just started one string up — giving you two movable "highways" across the neck instead of one, useful once specific songs call for roots that sit more conveniently on one string versus the other.`,
    contentHi: `**Ek shape bilkul "movable" kyun ho sakti hai — mechanism, Module 2 se wapas connect karte hue.** Module 2 ne establish kiya tha ki har fret pitch ko ek fixed musical step (semitone) se raise karta hai, uniformly, neck par position ki parwah kiye bina. Ek power chord ke do notes ek doosre ke saath same FIXED relationship (root aur 5th) maintain karte hain chahe wo kisi bhi fret se shuru hon, kyunki jab poora shape slide hota hai to dono notes identical amount se upar shift hote hain — do notes ke beech ka relationship, unki absolute position nahi, wo hai jo "power chord" define karta hai. Yahi exactly reason hai ki shape kisi bhi fret tak cleanly transfer hoti hai.

**Low E string par note names jaanna (Module 18 ka preview) is shape ko genuinely useful kyun banata hai, sirf ek neat trick nahi.** Ye jaane bina ki har fret kaunsa note produce karta hai, tum shape ko around slide kar sakte ho lekin ye nahi jaanoge ki kisi given fret par tum KAUNSA power chord baja rahe ho — Module 18 ka fretboard map is movable shape ko "ek cool mechanical trick" se "ek actual usable tool" mein badal deta hai, tumhe exactly batakar ki ek specific target chord ke liye kaunsi fret par land karna hai.

**Ek doosra root-string option, abhi jaanne layak poori fretboard mastery se pehle bhi.** Ek power chord A string par bhi rooted ho sakta hai (jaise Lesson 1 ke example mein A5) identical relative finger shape use karke, bas ek string upar se shuru hote hue — tumhe neck ke across do movable "highways" dete hue ek ke bajaye, useful ek baar jab specific songs roots maangte hain jo ek string par doosri se zyada conveniently baithte hain.`,

    examples: [
      {
        title: 'The E5 shape slid to three different frets',
        titleHi: 'E5 shape teen alag frets tak slid',
        previewHeight: 340,
        code: `Fret 0 (open): E5
Fret 3: G5
Fret 5: A5
Identical finger shape every time — only the starting fret changes.`,
        preview: chordFamilyHtml([POWER_CHORDS.E5, POWER_CHORDS.G5], 'E5 and G5: same exact shape, different starting fret. G5 is simply E5 slid up 3 frets.'),
        explain:
          'Comparing these two diagrams side by side, the finger pattern is visually identical — only the starting position differs, which is the clearest possible demonstration that this is ONE shape, not two separate ones to memorize.',
        explainHi:
          'In do diagrams ko saath saath compare karna, finger pattern visually identical hai — sirf starting position differ karti hai, jo isse clearest possible demonstration banata hai ki ye EK shape hai, memorize karne ke liye do separate nahi.',
      },
    ],

    mistakes: [
      {
        wrong: 'Treating each power chord at a different fret as a brand-new shape to independently memorize.',
        right: 'Recognize it as the SAME shape, just relocated — one piece of muscle memory covering every possible root.',
        why: 'Memorizing "12 different shapes" for 12 different power chords is enormously wasteful compared to memorizing one shape and one mental rule (slide it to the target fret) — this is precisely the efficiency power chords are known for.',
        whyHi: '12 alag power chords ke liye "12 alag shapes" memorize karna ek shape aur ek mental rule (target fret tak slide karo) memorize karne ke comparison mein enormously wasteful hai — ye exactly wahi efficiency hai jiske liye power chords jaane jaate hain.',
      },
    ],

    realWorld: [
      {
        en: 'Rhythm guitarists in bands with fast-moving chord progressions rely heavily on this movability — sliding one shape up and down the neck is dramatically faster than repositioning multiple fingers into entirely different open-chord shapes for each change.',
        hi: 'Fast-moving chord progressions wale bands ke rhythm guitarists is movability par heavily rely karte hain — ek shape ko neck mein upar neeche slide karna har change ke liye multiple fingers ko bilkul alag open-chord shapes mein reposition karne se dramatically faster hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Can I make a power chord movable starting from any string, or only the low E and A strings?',
        qHi: 'Kya main kisi bhi string se shuru hote hue ek power chord movable bana sakta hoon, ya sirf low E aur A strings se?',
        a: "Low E and A strings are by far the most common and practical roots for standard power chord shapes, due to how the strings are tuned relative to each other. Power chords rooted elsewhere exist but are less common and follow a slightly different shape — worth exploring later, but not essential now.",
        aHi: 'Low E aur A strings by far standard power chord shapes ke liye sabse common aur practical roots hain, is wajah se ki strings ek doosre ke relative kaise tuned hain. Kahin aur rooted power chords exist karte hain lekin kam common hain aur ek thodi alag shape follow karte hain — baad mein explore karne layak, lekin abhi essential nahi.',
      },
    ],

    exercises: [
      {
        task: 'Play the E5 shape at frets 0, 2, 3, 5, and 7 in sequence, pausing briefly at each to confirm the shape and finger pressure feel identical regardless of fret.',
        taskHi: 'E5 shape ko frets 0, 2, 3, 5, aur 7 par sequence mein bajao, har ek par briefly pause karte hue confirm karne ke liye ki shape aur finger pressure fret ki parwah kiye bina identical feel karte hain.',
        hint: 'If the shape feels harder to hold at higher frets, that\'s often because the frets themselves are physically closer together up there (Module 2) — the finger shape doesn\'t change, but the smaller physical spacing can take a session or two to adjust to.',
        hintHi: 'Agar shape higher frets par hold karna harder feel kare, ye often isliye hai kyunki wahan frets khud physically ek doosre ke zyada paas hoti hain (Module 2) — finger shape nahi badalti, lekin smaller physical spacing ko adjust hone mein ek-do session lag sakte hain.',
      },
    ],

    keyTakeaways: [
      'A power chord shape is fully movable — the same finger pattern produces a correctly-formed chord at any fret, rooted at that fret\'s note.',
      'This works because the two notes maintain a fixed relationship regardless of starting fret (Module 2\'s uniform-semitone-per-fret principle).',
      'Knowing the actual note at each fret (Module 18) is what turns this from a mechanical trick into a genuinely usable tool.',
    ],
    keyTakeawaysHi: [
      'Ek power chord shape fully movable hai — wahi finger pattern kisi bhi fret par ek correctly-formed chord produce karta hai, us fret ke note par rooted.',
      'Ye isliye kaam karta hai kyunki do notes starting fret ki parwah kiye bina ek fixed relationship maintain karte hain (Module 2 ka uniform-semitone-per-fret principle).',
      'Har fret par actual note jaanna (Module 18) hi wo hai jo ise ek mechanical trick se ek genuinely usable tool mein badalta hai.',
    ],
    guitarPractice: { sequences: [{"title":"E5 sliding up to G5","titleHi":"E5 se G5 tak slide","defaultBpm":80,"notes":[{"string":0,"fret":0,"beat":0},{"string":1,"fret":2,"beat":1,"finger":1},{"string":2,"fret":2,"beat":2,"finger":3},{"string":0,"fret":3,"beat":4,"finger":1},{"string":1,"fret":5,"beat":5,"finger":3},{"string":2,"fret":5,"beat":6,"finger":4}]}] },
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'palm-muted-power-chord-riffs',
    title: 'Palm-Muted Power Chords for Tight, Percussive Riffs',
    titleHi: 'Tight, Percussive Riffs Ke Liye Palm-Muted Power Chords',
    description: 'Combining Module 7\'s palm muting directly with power chords — the signature "chugging" rhythm guitar sound.',
    descriptionHi: 'Module 7 ki palm muting ko directly power chords ke saath combine karna — signature "chugging" rhythm guitar sound.',
    difficulty: 'MEDIUM',
    duration: 15,
    order: 3,

    analogy: {
      en: '**A tightly muted drum vs. a fully resonant one.** A drum with a cloth resting on its head produces a tight, controlled "thud" instead of a long ring — useful for fast, precise rhythmic patterns where a long ring would blur together. Palm-muted power chords do the same job for guitar: tight, controlled, precise, rather than washy and long-ringing.',
      hi: '**Ek tightly muted drum vs ek fully resonant drum.** Ek drum jiske head par ek cloth rest kar raha ho ek tight, controlled "thud" produce karta hai ek lambi ring ke bajaye — fast, precise rhythmic patterns ke liye useful jahan ek lambi ring blur ho jaati. Palm-muted power chords guitar ke liye wahi kaam karte hain: tight, controlled, precise, washy aur long-ringing ke bajaye.',
    },

    simple: `**The combination, directly:** rest the strumming hand's palm lightly at the bridge (Module 7's exact technique) while playing power chords (this module\'s shapes) — producing the tight, percussive "chug" sound heard constantly in rock rhythm guitar.

**Why power chords specifically suit palm muting so well, more than full chords do:** with only 2-3 strings involved, achieving even, consistent muting pressure across all of them is mechanically simpler than muting 6 strings evenly — fewer strings to keep uniformly damped means a more consistent, controllable "chug" texture.

**A basic muted power-chord riff, using Module 16\'s movable shape:**

\`\`\`
E5 (muted) - E5 (muted) - G5 (muted) - E5 (muted)
\`\`\`
Same shape sliding between two frets, all played with a consistent palm-muted texture — a genuinely riff-like, rhythmic pattern rather than a chord progression in the Module 13 sense.`,
    simpleHi: `**Combination, directly:** strumming hand ki palm ko bridge par lightly rest karo (Module 7 ki exact technique) jabki power chords bajao (is module ke shapes) — tight, percussive "chug" sound produce karte hue jo rock rhythm guitar mein constantly sunai deta hai.

**Power chords specifically palm muting ke liye itna suited kyun hain, full chords se zyada:** sirf 2-3 strings involve hone ke saath, unn saari ke across even, consistent muting pressure achieve karna 6 strings ko evenly mute karne se mechanically simpler hai — kam strings ko uniformly damped rakhna ek zyada consistent, controllable "chug" texture deta hai.

**Ek basic muted power-chord riff, Module 16 ke movable shape use karte hue:**

\`\`\`
E5 (muted) - E5 (muted) - G5 (muted) - E5 (muted)
\`\`\`
Wahi shape do frets ke beech slide karte hue, sab ek consistent palm-muted texture ke saath bajaaye gaye — ek genuinely riff-like, rhythmic pattern, Module 13 wale sense mein ek chord progression nahi.`,

    content: `**Why this combination is specifically associated with "riffs" rather than "chord progressions."** A riff is typically a short, repeated, rhythmically-driven musical idea — palm-muted power chords, with their tight, percussive, easily-repeatable character, are mechanically and sonically well-suited to exactly this kind of short repeated figure, distinct from the longer, ringing chord progressions Module 13\'s songs used. Same underlying skills (chords, muting), different musical application.

**Why moving the SAME power-chord shape between frets (rather than between different open chords) while palm-muted is easier than it might first seem.** Module 16 Lesson 2 already established this shape as fully movable and requires no new finger arrangement to learn per position — combined with palm muting (which stays in a fixed position near the bridge regardless of which fret the fretting hand is on), this riff genuinely only asks you to slide one hand while keeping the other essentially still, a simpler coordination demand than it sounds.

**Connecting this all the way back to Module 1's anatomy lesson.** The "chugging" sound this lesson produces is a direct, audible consequence of the body's acoustic amplification (Module 1) interacting with a deliberately shortened string ring (the palm mute) — every module\'s foundational content genuinely contributes to understanding a sound this specific, even ones as far back as Module 1.`,
    contentHi: `**Ye combination specifically "chord progressions" ke bajaye "riffs" se kyun associated hai.** Ek riff typically ek short, repeated, rhythmically-driven musical idea hota hai — palm-muted power chords, apne tight, percussive, easily-repeatable character ke saath, mechanically aur sonically exactly is tarah ke short repeated figure ke liye well-suited hain, Module 13 ke songs ke lambe, ringing chord progressions se distinct. Same underlying skills (chords, muting), alag musical application.

**Palm-muted rehte hue frets ke beech SAME power-chord shape move karna (alag open chords ke beech ke bajaye) pehli nazar mein lagne se easier kyun hai.** Module 16 Lesson 2 ne already establish kiya tha ki ye shape fully movable hai aur per position koi nayi finger arrangement seekhne ki zaroorat nahi — palm muting ke saath combined (jo bridge ke paas ek fixed position mein rehti hai chahe fretting hand kisi bhi fret par ho), ye riff genuinely tumse sirf ek hand slide karne ko kehta hai doosri ko essentially still rakhte hue, jitna sound karta hai us se ek simpler coordination demand.

**Ise poori tarah Module 1 ke anatomy lesson tak wapas connect karna.** "Chugging" sound jo ye lesson produce karta hai body ki acoustic amplification (Module 1) ka ek direct, audible consequence hai jo ek deliberately shortened string ring (palm mute) ke saath interact karta hai — har module ka foundational content genuinely is tarah ke specific sound ko samajhne mein contribute karta hai, Module 1 jitna pichhe wale bhi.`,

    examples: [
      {
        title: 'A simple muted riff, E5 to G5 and back',
        titleHi: 'Ek simple muted riff, E5 se G5 aur wapas',
        previewHeight: 340,
        code: `E5 (palm muted) - E5 (palm muted) - G5 (palm muted) - E5 (palm muted)
Fretting hand: slides the same shape between frets 0 and 3.
Strumming hand: stays anchored at the bridge, palm muting throughout.`,
        preview: chordFamilyHtml([POWER_CHORDS.E5, POWER_CHORDS.G5], 'The exact same shape from Lesson 2\'s example — now played with a consistent palm-muted texture throughout.'),
        explain:
          'This riff deliberately reuses the identical E5/G5 shapes from Lesson 2\'s example — the only genuinely new element in this whole lesson is adding the palm-muting texture on top, not new finger shapes.',
        explainHi:
          'Ye riff deliberately Lesson 2 ke example ke identical E5/G5 shapes reuse karta hai — is poore lesson mein sirf ek genuinely naya element palm-muting texture upar add karna hai, naye finger shapes nahi.',
      },
    ],

    mistakes: [
      {
        wrong: 'Repositioning the strumming hand\'s palm-mute contact point every time the fretting hand slides to a new fret.',
        right: 'Keep the palm anchored at the bridge throughout — it never needs to move just because the fretting hand does.',
        why: 'The palm-mute position is defined relative to the bridge (Module 7), not relative to whichever fret is currently being played — the two hands\' positioning is genuinely independent, and treating them as linked adds unnecessary motion.',
        whyHi: 'Palm-mute position bridge ke relative define hota hai (Module 7), currently kaunsi fret baj rahi hai uske relative nahi — dono hands ki positioning genuinely independent hai, aur unhe linked treat karna unnecessary motion add karta hai.',
      },
    ],

    realWorld: [
      {
        en: 'This exact technique — a movable power-chord shape, palm-muted, played as a repeated riff — is the foundation of an enormous amount of rock and metal rhythm guitar writing; recognizing it is recognizing one of the most common building blocks in the genre.',
        hi: 'Ye exact technique — ek movable power-chord shape, palm-muted, ek repeated riff ki tarah bajayi hui — rock aur metal rhythm guitar writing ki ek enormous amount ki foundation hai; ise recognize karna genre ke sabse common building blocks mein se ek ko recognize karna hai.',
      },
    ],

    interviewQA: [
      {
        q: 'How do I know how much palm-mute pressure to use for this specific riff style?',
        qHi: 'Mujhe kaise pata chalega ki is specific riff style ke liye kitna palm-mute pressure use karna hai?',
        a: "Module 7's pressure spectrum still applies fully here — start with moderate-to-firm pressure for a tight \"chug\" and adjust by ear. There's no single correct amount; different riffs and songs call for different points on that same spectrum.",
        aHi: 'Module 7 ka pressure spectrum abhi bhi yahan poori tarah apply hota hai — ek tight "chug" ke liye moderate-to-firm pressure se shuru karo aur kaan se adjust karo. Koi single correct amount nahi hai; alag riffs aur songs usi spectrum par alag points maangte hain.',
      },
    ],

    exercises: [
      {
        task: 'Play the E5-E5-G5-E5 muted riff from the example 10 times in a row with a metronome (Module 9), keeping the palm anchored at the bridge throughout.',
        taskHi: 'Example ka E5-E5-G5-E5 muted riff 10 baar row mein metronome (Module 9) ke saath bajao, poori der palm ko bridge par anchored rakhte hue.',
        hint: 'If the muted tone becomes inconsistent when the shape slides to fret 3, check that only the fretting hand moved — an unconsciously shifting palm position is the most common cause of inconsistent muting across a moving riff.',
        hintHi: 'Agar shape fret 3 tak slide hone par muted tone inconsistent ban jaaye, check karo ki sirf fretting hand move hui — ek unconsciously shifting palm position ek moving riff ke across inconsistent muting ka sabse common cause hai.',
      },
    ],

    keyTakeaways: [
      'Palm-muted power chords produce the tight, percussive "chug" sound central to rock/metal rhythm guitar.',
      'Power chords suit palm muting especially well — fewer strings means more consistent, controllable muting than a full chord.',
      'The palm stays anchored at the bridge regardless of which fret the movable power-chord shape is sliding to — the two hands move independently.',
    ],
    keyTakeawaysHi: [
      'Palm-muted power chords tight, percussive "chug" sound produce karte hain jo rock/metal rhythm guitar ka central hai.',
      'Power chords palm muting ke liye especially well suit karte hain — kam strings ka matlab hai ek full chord se zyada consistent, controllable muting.',
      'Palm bridge par anchored rehta hai chahe movable power-chord shape kisi bhi fret tak slide ho raha ho — dono hands independently move karte hain.',
    ],
    guitarPractice: { sequences: [{"title":"E5 to A5, palm-muted riff shape","titleHi":"E5 se A5, palm-muted riff shape","defaultBpm":90,"notes":[{"string":0,"fret":0,"beat":0},{"string":1,"fret":2,"beat":0},{"string":2,"fret":2,"beat":0},{"string":1,"fret":0,"beat":2},{"string":2,"fret":2,"beat":2},{"string":3,"fret":2,"beat":2}]}] },
  },
];
