/**
 * Guitar Course — Module 5: The Easy Chord Family, Part 2, lessons 1-3.
 *
 * Lesson 1: C major — the classic "campfire" chord, muting a string on
 *           purpose for the first time.
 * Lesson 2: A minor (Am) — three fingers, staggered across two frets, a
 *           crowding challenge distinct from C's spread-out shape.
 * Lesson 3: D major — a triangular shape and the module's close: all six
 *           "campfire" chords now known.
 */

import type { CourseLesson } from './course-js-module1';
import { chordPreviewHtml, chordFamilyHtml } from './guitar-diagrams';
import { CHORDS } from './guitar-chords-data';

export const GUITAR_MODULE_5: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'chord-c-major',
    title: 'C Major — Muting a String on Purpose',
    titleHi: 'C Major — Ek String Ko Jaan Bujhkar Mute Karna',
    description: 'The first chord in this course where you deliberately don\'t play a string, and why that matters.',
    descriptionHi: 'Is course ka pehla chord jahan tum deliberately ek string nahi bajaate, aur ye kyun matter karta hai.',
    difficulty: 'MEDIUM',
    duration: 15,
    order: 1,

    analogy: {
      en: '**Leaving one ingredient out of a recipe on purpose.** Every chord so far used all 6 strings. C major deliberately skips the low E string entirely — not a mistake to fix, but a required part of the recipe. Skip the skip, and the chord sounds genuinely wrong, not just "slightly different."',
      hi: '**Ek recipe se ek ingredient jaan bujhkar chhodna.** Ab tak ke har chord ne saari 6 strings use ki. C major deliberately low E string ko poori tarah skip karta hai — koi fix karne wali mistake nahi, balki recipe ka ek required part. Us skip ko skip karo, aur chord genuinely galat sound karta hai, sirf "thoda different" nahi.',
    },

    simple: `**C major, step by step:**

1. Finger 3 (ring) on A-string, fret 3.
2. Finger 2 (middle) on D-string, fret 2.
3. Finger 1 (index) on B-string, fret 1.
4. G-string and high e-string ring open.
5. **Low E-string is muted (X) — do NOT strum it.**

Strumming technique for the muted string: either start your strum FROM the A-string (skip low E entirely with your pick), or lightly rest a spare part of a fretting finger against it to deaden the sound if you do accidentally strike it.

\`\`\`
C
  E |---x---   don't play
  A |---3---   finger 3
  D |---2---   finger 2
  G |---0---   open
  B |---1---   finger 1
  E |---0---   open
\`\`\``,
    simpleHi: `**C major, step by step:**

1. Finger 3 (ring) A-string par, fret 3.
2. Finger 2 (middle) D-string par, fret 2.
3. Finger 1 (index) B-string par, fret 1.
4. G-string aur high e-string open ring karti hain.
5. **Low E-string muted hai (X) — ise strum MAT karo.**

Muted string ke liye strumming technique: ya to apna strum A-string SE start karo (low E ko apne pick se poori tarah skip karo), ya agar accidentally strike ho jaaye to sound deaden karne ke liye ek fretting finger ka spare part halka sa uske against rest karo.

\`\`\`
C
  E |---x---   mat bajao
  A |---3---   finger 3
  D |---2---   finger 2
  G |---0---   open
  B |---1---   finger 1
  E |---0---   open
\`\`\``,

    content: `**Why is the low E string muted here, specifically?** The notes each open string produces, combined with which notes actually belong to a C major chord, means an open low E clashes with the chord rather than reinforcing it (Module 19 explains exactly which notes belong to which chords). This is the first time this course asks you to actively AVOID a string rather than just choosing where to press — a genuinely new mechanical skill, not a variation on an old one.

**Three fingers, three different frets, for the first time.** Em, Em7, and G all used fingers on a single fret level pattern relatively close together; C spreads fingers 1, 2, and 3 across three DIFFERENT frets (1, 2, and 3) simultaneously — a new kind of coordination challenge distinct from G's wide stretch. Expect this to feel like a genuinely different difficulty than G, not an easier or harder version of the same problem.

**The two muting techniques, compared:** picking starting from the A-string is cleaner and is what most experienced players do automatically, but it takes practice to consistently start your strum motion at the right string. Resting a finger against the low E as a backup mute is a reasonable beginner safety net while that picking precision develops — use both together at first, then rely increasingly on picking precision alone.`,
    contentHi: `**Low E string specifically yahan kyun muted hai?** Har open string jo notes produce karti hai, un notes ke saath combine hoke jo actually C major chord ke belong karte hain, matlab ek open low E chord ko reinforce karne ke bajaye usse clash karti hai (Module 19 exactly explain karta hai ki kaunse notes kaunse chords ke belong karte hain). Ye pehli baar hai jab ye course tumse actively ek string ko AVOID karne ko kehta hai, sirf ye choose karne ke bajaye ki kahan press karna hai — ek genuinely nayi mechanical skill, purani ka variation nahi.

**Pehli baar teen fingers, teen alag frets.** Em, Em7, aur G sab ne relatively close together ek single fret level pattern par fingers use kiye; C fingers 1, 2, aur 3 ko teen ALAG frets (1, 2, aur 3) ke across simultaneously spread karta hai — G ke wide stretch se distinct ek naya coordination challenge. Expect karo ki ye G se genuinely alag difficulty jaisa feel kare, same problem ka easier ya harder version nahi.

**Do muting techniques, compared:** A-string se picking start karna cleaner hai aur zyadatar experienced players automatically yahi karte hain, lekin apne strum motion ko sahi string par consistently start karne ki practice lagti hai. Backup mute ki tarah low E ke against ek finger rest karna ek reasonable beginner safety net hai jab tak wo picking precision develop hoti hai — pehle dono saath use karo, phir increasingly akele picking precision par rely karo.`,

    examples: [
      {
        title: 'C major, full shape',
        titleHi: 'C major, poora shape',
        code: `C
  E |---x---
  A |---3---   finger 3
  D |---2---   finger 2
  G |---0---   open
  B |---1---   finger 1
  E |---0---   open`,
        previewHeight: 330,
        preview: chordPreviewHtml(CHORDS.C, 'The red X on the low E string means: do not play this string at all, deliberately.'),
        explain:
          'Notice the X marker specifically — this is the first chord in the course where reading the diagram correctly requires paying attention to what NOT to play, not just where to press.',
        explainHi:
          'X marker ko specifically notice karo — ye course ka pehla chord hai jahan diagram ko correctly padhne ke liye ye dhyan dena zaroori hai ki KYA NAHI bajaana hai, sirf kahan press karna hai nahi.',
      },
    ],

    mistakes: [
      {
        wrong: 'Strumming all 6 strings out of habit, including the low E, since every previous chord in this course used all 6.',
        right: 'Deliberately start the strumming motion from the A-string, or mute the low E with a spare finger part.',
        why: 'An open low E genuinely clashes with C major\'s notes — this isn\'t a stylistic preference, it makes the chord sound audibly wrong to most ears once you know to listen for it.',
        whyHi: 'Ek open low E genuinely C major ke notes se clash karta hai — ye ek stylistic preference nahi hai, ye chord ko zyadatar kaano ko audibly galat sound karwata hai ek baar jab tumhe pata ho ki sunna kya hai.',
      },
    ],

    realWorld: [
      {
        en: 'Selective muting — playing only some strings of a chord, deliberately — is a technique you\'ll use constantly from here forward, not just for C. Getting comfortable with it now on one clear example pays off across dozens of future chords.',
        hi: 'Selective muting — ek chord ki sirf kuch strings deliberately bajaana — ek technique hai jo tum yahan se aage constantly use karoge, sirf C ke liye nahi. Ise abhi ek clear example par comfortable hona baad ke dazzon chords ke across pay off karta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What happens if I accidentally strum the low E string on C major?',
        qHi: 'Agar main accidentally C major par low E string strum kar doon to kya hota hai?',
        a: "It won't damage anything — it just sounds noticeably dissonant/wrong to the ear. It's a sound-quality issue to fix through practice, not a mistake with any lasting consequence.",
        aHi: 'Ye kuch bhi damage nahi karega — ye bas kaan ko noticeably dissonant/galat sound karta hai. Ye practice se fix karne wala ek sound-quality issue hai, koi lasting consequence wali mistake nahi.',
      },
    ],

    exercises: [
      {
        task: 'Form C, then strum slowly starting deliberately from the A-string 10 times in a row, checking after each strum that the low E stayed silent.',
        taskHi: 'C banao, phir slowly strum karo deliberately A-string se shuru karte hue das baar row mein, har strum ke baad check karte hue ki low E silent rahi.',
        hint: 'If you keep catching the low E by accident, slightly exaggerate starting lower (from the A-string) than feels necessary at first — precision develops from an initially over-careful motion, not the reverse.',
        hintHi: 'Agar tum baar-baar accidentally low E hit kar rahe ho, thoda exaggerate karo aur pehle jitna necessary lage usse neeche (A-string se) start karo — precision ek initially over-careful motion se develop hoti hai, ulta nahi.',
      },
    ],

    keyTakeaways: [
      'C major: finger 1 on B/fret1, finger 2 on D/fret2, finger 3 on A/fret3, G and high e open, low E MUTED.',
      'This is the first chord requiring you to deliberately avoid a string, not just choose where to press.',
      'Three fingers spread across three different frets simultaneously — a new coordination challenge distinct from G\'s stretch.',
    ],
    keyTakeawaysHi: [
      'C major: finger 1 B/fret1 par, finger 2 D/fret2 par, finger 3 A/fret3 par, G aur high e open, low E MUTED.',
      'Ye pehla chord hai jo tumse deliberately ek string avoid karne ko kehta hai, sirf kahan press karna hai choose karne ke bajaye.',
      'Teen fingers teen alag frets ke across simultaneously spread — G ke stretch se distinct ek naya coordination challenge.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'chord-a-minor',
    title: 'A Minor (Am) — Three Fingers, Staggered',
    titleHi: 'A Minor (Am) — Teen Fingers, Staggered',
    description: 'A crowding challenge, but staggered across two frets — genuinely different from G\'s wide stretch or C\'s spread-out shape.',
    descriptionHi: 'Ek crowding challenge, lekin do frets ke across staggered — G ke wide stretch ya C ke spread-out shape se genuinely alag.',
    difficulty: 'MEDIUM',
    duration: 15,
    order: 2,

    analogy: {
      en: '**Three people getting into a car — two sitting in the back seat, one leaning slightly forward.** Am\'s three fingers aren\'t in one uniform row like a tight elevator; two of them share a fret while the third sits one fret back, on the string just beyond. That small stagger is what makes Am\'s crowding noticeably more comfortable than a perfectly uniform row would be.',
      hi: '**Teen log ek car mein baithte hue — do log peeche baithe, ek thoda aage lean kiye.** Am ki teen fingers ek uniform row mein ek tight elevator ki tarah nahi hain; unmein se do ek fret share karti hain jabki teesri ek fret peeche baithi hai, uske aage wali string par. Wahi chhota sa stagger hai jo Am ke crowding ko ek perfectly uniform row se noticeably zyada comfortable banata hai.',
    },

    simple: `**Am, step by step:**

1. Finger 1 (index) on B-string, fret 1.
2. Finger 2 (middle) on D-string, fret 2.
3. Finger 3 (ring) on G-string, fret 2.
4. Low E is muted (X). A-string and high e-string ring open.

\`\`\`
Am
  E |---x---
  A |---0---   open
  D |---2---   finger 2
  G |---2---   finger 3
  B |---1---   finger 1
  E |---0---   open
\`\`\`

Notice finger 1 sits one fret BEHIND fingers 2 and 3 — this staggered shape, not a flat uniform row, is what makes Am\'s three-finger crowding easier for most hands than it might look at first glance.`,
    simpleHi: `**Am, step by step:**

1. Finger 1 (index) B-string par, fret 1.
2. Finger 2 (middle) D-string par, fret 2.
3. Finger 3 (ring) G-string par, fret 2.
4. Low E muted hai (X). A-string aur high e-string open ring karti hain.

\`\`\`
Am
  E |---x---
  A |---0---   open
  D |---2---   finger 2
  G |---2---   finger 3
  B |---1---   finger 1
  E |---0---   open
\`\`\`

Notice karo finger 1 fingers 2 aur 3 se ek fret PEECHE baithi hai — ye staggered shape, ek flat uniform row nahi, wo hai jo Am ki three-finger crowding ko zyadatar hands ke liye pehli nazar mein lagne se zyada easy banata hai.`,

    content: `**Why the stagger genuinely helps, mechanically.** Fingers 2 and 3, sharing one fret on adjacent strings, still need the steep-arch/fingertip-contact technique from earlier crowded chords. But finger 1, sitting a full fret back, has its own dedicated space — it isn't competing with fingers 2 and 3 for the same narrow strip of fretboard. This is a genuinely different geometry from a hypothetical "all three fingers on one fret" shape, and most players find it noticeably more comfortable as a result.

**Am's relationship to Em, revisited.** Both are minor chords, and both have a similarly "open, spacious" emotional character (Module 19 will make this precise) — if Em sounded a certain way to you back in Module 4, Am should sound like a close cousin, not a totally different mood. Noticing this kind of family resemblance by ear is a real skill this course keeps nudging you toward, alongside the purely mechanical finger-shape skills.

**A note on realistic difficulty ranking so far:** most learners find the chord difficulty roughly Em < Em7 < D < Am < C < G, though this varies by individual hand shape. If Am feels harder than C did for you specifically, that's a normal variation, not a sign you're doing something wrong — work at whichever pace each specific chord actually needs.`,
    contentHi: `**Stagger mechanically genuinely kyun help karta hai.** Fingers 2 aur 3, adjacent strings par ek fret share karte hue, phir bhi pehle wale crowded chords wali steep-arch/fingertip-contact technique chahiye. Lekin finger 1, ek poora fret peeche baithi hui, apni khud ki dedicated space rakhti hai — ye fingers 2 aur 3 se same narrow strip of fretboard ke liye compete nahi karti. Ye ek hypothetical "saari teen fingers ek fret par" shape se genuinely alag geometry hai, aur zyadatar players ise result mein noticeably zyada comfortable paate hain.

**Am ka Em se relationship, revisited.** Dono minor chords hain, aur dono ka similarly "open, spacious" emotional character hai (Module 19 ise precise banayega) — agar Em Module 4 mein tumhe ek certain tareeke se sound kiya tha, Am ek close cousin jaisa sound karna chahiye, ek totally alag mood nahi. Kaan se is tarah ki family resemblance notice karna ek real skill hai jiski taraf ye course purely mechanical finger-shape skills ke saath saath nudge karta rehta hai.

**Realistic difficulty ranking par ek note ab tak:** zyadatar learners chord difficulty roughly Em < Em7 < D < Am < C < G paate hain, chahe ye individual hand shape se vary karta hai. Agar Am tumhe specifically C se harder lage, ye ek normal variation hai, iska sign nahi ki tum kuch galat kar rahe ho — jo bhi pace har specific chord ko actually chahiye us par kaam karo.`,

    examples: [
      {
        title: 'Am, full shape',
        titleHi: 'Am, poora shape',
        code: `Am
  E |---x---
  A |---0---   open
  D |---2---   finger 2
  G |---2---   finger 3
  B |---1---   finger 1
  E |---0---   open`,
        previewHeight: 330,
        preview: chordPreviewHtml(CHORDS.Am, 'Fingers 2 and 3 share fret 2 on adjacent strings; finger 1 sits a fret back on its own — a staggered, not uniform, crowd.'),
        explain:
          'Compare this diagram\'s dot positions to a hypothetical uniform row: finger 1\'s dot sits visibly higher up the grid (closer to the nut) than fingers 2 and 3\'s — that offset is the entire mechanical difference this lesson is about.',
        explainHi:
          'Is diagram ke dot positions ko ek hypothetical uniform row se compare karo: finger 1 ka dot grid mein visibly upar (nut ke zyada paas) baitha hai fingers 2 aur 3 se — wo offset hi wo poora mechanical difference hai jiske baare mein ye lesson hai.',
      },
    ],

    mistakes: [
      {
        wrong: 'Trying to line up all three fingers as if they were on the same fret, fighting the natural stagger instead of using it.',
        right: 'Let finger 1 sit naturally one fret back — don\'t force it forward to "match" fingers 2 and 3.',
        why: "The stagger is the shape, not an imperfection in your technique — forcing artificial alignment usually makes the whole chord harder to hold, not easier.",
        whyHi: 'Stagger hi shape hai, tumhari technique mein koi imperfection nahi — artificial alignment force karna usually poore chord ko hold karna easier nahi, harder bana deta hai.',
      },
    ],

    realWorld: [
      {
        en: 'Am, C, and G together (all three now known) form another extremely common chord trio in popular music, distinct from the G-C-D trio Module 5\'s D lesson mentions — between the two trios, you can already play an enormous number of real songs.',
        hi: 'Am, C, aur G saath mein (teenon ab pata) popular music mein ek aur extremely common chord trio banate hain, us G-C-D trio se distinct jiska mention Module 5 ka D lesson karta hai — dono trios ke beech, tum already bahut bade number of real songs bajaa sakte ho.',
      },
    ],

    interviewQA: [
      {
        q: 'Is Am really easier than A major, or does that just depend on the person?',
        qHi: 'Kya Am really A major se easier hai, ya ye bas person par depend karta hai?',
        a: "It genuinely does vary by hand shape, but most players do find Am's staggered fingering slightly more comfortable than a hypothetical uniform-row equivalent, for the mechanical reason this lesson covers — dedicated space for finger 1 instead of three-way competition for one fret.",
        aHi: 'Ye genuinely hand shape se vary karta hai, lekin zyadatar players Am ki staggered fingering ko ek hypothetical uniform-row equivalent se thoda zyada comfortable paate hain, us mechanical reason ki wajah se jo ye lesson cover karta hai — finger 1 ke liye dedicated space, ek fret ke liye three-way competition ke bajaye.',
      },
    ],

    exercises: [
      {
        task: 'Form Am, then check finger 1 specifically: is it genuinely relaxed in its own space one fret back, or is it being crowded/forced by fingers 2 and 3? Adjust until finger 1 feels distinctly separate.',
        taskHi: 'Am banao, phir specifically finger 1 check karo: kya ye genuinely apni khud ki space mein ek fret peeche relaxed hai, ya fingers 2 aur 3 se crowded/forced ho rahi hai? Adjust karo jab tak finger 1 distinctly separate feel na kare.',
        hint: 'If finger 1 feels cramped against finger 2, you may be pressing finger 1 too close to the fret 2 line instead of comfortably within fret 1\'s own space — give it more room toward the nut.',
        hintHi: 'Agar finger 1 finger 2 ke against cramped feel kare, ho sakta hai tum finger 1 ko fret 2 line ke bahut paas press kar rahe ho fret 1 ki apni space ke andar comfortably rehne ke bajaye — use nut ki taraf zyada room do.',
      },
    ],

    keyTakeaways: [
      'Am: finger 1 on B/fret1, finger 2 on D/fret2, finger 3 on G/fret2. Low E muted, A and high e open.',
      'The stagger (finger 1 one fret back) is the shape, not an imperfection — it genuinely makes the crowding easier than a uniform row would be.',
      'Am and Em share a similar minor "character" — a resemblance worth noticing by ear, not just by shape.',
    ],
    keyTakeawaysHi: [
      'Am: finger 1 B/fret1 par, finger 2 D/fret2 par, finger 3 G/fret2 par. Low E muted, A aur high e open.',
      'Stagger (finger 1 ek fret peeche) hi shape hai, koi imperfection nahi — ye genuinely crowding ko ek uniform row se easier banata hai.',
      'Am aur Em ek similar minor "character" share karte hain — ek resemblance jo kaan se notice karne layak hai, sirf shape se nahi.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'chord-d-major',
    title: 'D Major — Closing the Six-Chord Set',
    titleHi: 'D Major — Six-Chord Set Ko Close Karna',
    description: 'A triangular shape, two strings muted, and the sixth and final chord of this module\'s core set.',
    descriptionHi: 'Ek triangular shape, do strings muted, aur is module ke core set ka chhata aur aakhri chord.',
    difficulty: 'MEDIUM',
    duration: 15,
    order: 3,

    analogy: {
      en: '**A small, sturdy tripod.** D\'s three fingers form a compact triangle on the fretboard, each on a different string and a different fret, all balanced around a small central area — physically sturdier and more compact than G\'s wide stretch or A\'s crowded row, a third distinct hand shape.',
      hi: '**Ek chhota, sturdy tripod.** D ki teen fingers fretboard par ek compact triangle banate hain, har ek alag string aur alag fret par, sab ek chhote central area ke around balanced — G ke wide stretch ya A ki crowded row se physically sturdier aur zyada compact, ek teesra distinct hand shape.',
    },

    simple: `**D major, step by step:**

1. Finger 1 (index) on G-string, fret 2.
2. Finger 3 (ring) on B-string, fret 3.
3. Finger 2 (middle) on high e-string, fret 2.
4. **Both low E and A strings are muted (X, X)** — strumming starts from the D-string.

\`\`\`
D
  E |---x---
  A |---x---
  D |---0---   open
  G |---2---   finger 1
  B |---3---   finger 3
  E |---2---   finger 2
\`\`\`

Two muted strings is new — you're now starting your strum even further in than C's single mute.`,
    simpleHi: `**D major, step by step:**

1. Finger 1 (index) G-string par, fret 2.
2. Finger 3 (ring) B-string par, fret 3.
3. Finger 2 (middle) high e-string par, fret 2.
4. **Dono low E aur A strings muted hain (X, X)** — strumming D-string se start hoti hai.

\`\`\`
D
  E |---x---
  A |---x---
  D |---0---   open
  G |---2---   finger 1
  B |---3---   finger 3
  E |---2---   finger 2
\`\`\`

Do muted strings naya hai — ab tum apna strum C ke single mute se bhi aur andar start kar rahe ho.`,

    content: `**Why two muted strings instead of one?** Same underlying reason as C's single mute — the notes of the low E and A strings, played open, don't belong to D major's chord tones. D happens to need more of the low end excluded than C does. This isn't an escalating difficulty for its own sake; it's simply what this particular chord's actual notes require, and by now (three "avoid this string" chords in) picking your strum's starting string should be starting to feel automatic rather than effortful.

**D's triangular shape, and why it's often called easier than A despite similar finger count:** with three fingers on three different frets AND three different strings, there's naturally more separation between them than A's tight same-fret row — less risk of one finger's placement crowding another. Many players find D noticeably easier than A precisely because of this geometry, even though both use three fingers.

**You now know all 6 "campfire chords":** Em, Em7, G, C, Am (next lesson recaps it), D. This specific set unlocks an enormous number of real songs — Module 13 will have you actually playing several, and Module 6 (next) makes switching between all of them fast.`,
    contentHi: `**Ek ke bajaye do muted strings kyun?** C ke single mute jaisa hi underlying reason — low E aur A strings ke notes, open bajaye gaye, D major ke chord tones ke belong nahi karte. D ko C se zyada low end exclude karna padta hai. Ye apne liye ek escalating difficulty nahi hai; ye simply wahi hai jo is particular chord ke actual notes require karte hain, aur ab tak (teen "avoid this string" chords ho chuke) apni strum ki starting string pick karna automatic feel karna shuru hona chahiye, effortful nahi.

**D ka triangular shape, aur ye A se aksar easier kyun kaha jaata hai similar finger count ke bawajood:** teen fingers teen alag frets AUR teen alag strings par hone ke saath, naturally unke beech A ki tight same-fret row se zyada separation hai — ek finger ki placement doosri ko crowd karne ka kam risk. Bahut saare players D ko A se noticeably easier paate hain precisely is geometry ki wajah se, chahe dono teen fingers use karte hain.

**Ab tumhe saare 6 "campfire chords" pata hain:** Em, Em7, G, C, Am (agla lesson recap karta hai), D. Ye specific set bahut bade number of real songs unlock karta hai — Module 13 tumse actually kai bajwayega, aur Module 6 (agla) inn sab ke beech switching fast banata hai.`,

    examples: [
      {
        title: 'D major, full shape',
        titleHi: 'D major, poora shape',
        code: `D
  E |---x---
  A |---x---
  D |---0---   open
  G |---2---   finger 1
  B |---3---   finger 3
  E |---2---   finger 2`,
        previewHeight: 330,
        preview: chordPreviewHtml(CHORDS.D, 'A compact triangle: three fingers, three different strings and frets, both bass strings muted.'),
        explain:
          'Notice the shape genuinely LOOKS like a small triangle on the diagram — this visual compactness is exactly why many players find D physically easier to hold than A, despite both needing three fingers.',
        explainHi:
          'Notice karo shape diagram par genuinely ek chhote triangle jaisa LAGTA hai — ye visual compactness exactly wo reason hai ki bahut saare players D ko A se physically hold karna easier paate hain, dono ko teen fingers chahiye hone ke bawajood.',
      },
      {
        title: 'All six campfire chords together',
        titleHi: 'Saare six campfire chords saath',
        code: `Em, Em7, G, C, Am, D — the six chords that unlock hundreds of real songs.`,
        previewHeight: 340,
        preview: chordFamilyHtml(
          [CHORDS.Em, CHORDS.Em7, CHORDS.G, CHORDS.C, CHORDS.Am, CHORDS.D],
          'Every chord you now know, side by side. Module 6 makes switching between all six fast.',
        ),
        explain:
          'Seeing all six together is a genuine milestone worth pausing on — this is real, functional chord vocabulary, not a partial or "training wheels" version of it.',
        explainHi:
          'Saare six ko saath dekhna ek genuine milestone hai jispe rukna worth hai — ye real, functional chord vocabulary hai, iska partial ya "training wheels" version nahi.',
      },
    ],

    mistakes: [
      {
        wrong: 'Strumming from the low E string out of habit on D, catching two extra muted strings instead of just one like on C.',
        right: 'Start the strum from the D-string specifically — check the diagram\'s two X marks before playing, every time, until it\'s automatic.',
        why: 'Two clashing open strings instead of one is roughly twice as audible a problem — this is worth extra deliberate attention until the habit sets in.',
        whyHi: 'Ek ke bajaye do clashing open strings roughly ek doguna audible problem hai — ye extra deliberate attention ke layak hai jab tak habit set na ho jaaye.',
      },
    ],

    realWorld: [
      {
        en: 'G, C, and D together form one of the most common chord progressions in popular music — you now have all three, and Module 13 will have you playing real songs built entirely on this trio.',
        hi: 'G, C, aur D saath mein popular music ki sabse common chord progressions mein se ek banate hain — ab tumhare paas teenon hain, aur Module 13 tumse real songs bajwayega jo poori tarah is trio par bane hain.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does D use fingers 1 and 3 but skip finger... wait, where\'s finger 4?',
        qHi: 'D fingers 1 aur 3 use karta hai lekin skip karta hai... wait, finger 4 kahan hai?',
        a: "This particular D voicing simply doesn't need it — three notes, three fingers is enough. Later in the course you'll see D voicings that do use finger 4 for added color (like Dsus4), but the core open D triad doesn't require it.",
        aHi: 'Ye particular D voicing simply use zaroorat nahi hai — teen notes, teen fingers kaafi hain. Course mein baad mein tum D voicings dekhoge jo added color ke liye finger 4 use karte hain (jaise Dsus4), lekin core open D triad ise require nahi karta.',
      },
    ],

    exercises: [
      {
        task: 'Form D, strum carefully starting from the D-string, and confirm by ear that no low rumble from the E or A strings is present. Then play through all six campfire chords in a row (Em, Em7, G, C, Am, D), pausing to check each one is clean before moving on.',
        taskHi: 'D banao, D-string se carefully strum start karo, aur kaan se confirm karo ki E ya A strings se koi low rumble present nahi hai. Phir saare six campfire chords ko ek row mein bajao (Em, Em7, G, C, Am, D), agle par jaane se pehle check karne ke liye ruk kar ki har ek clean hai.',
        hint: 'This full run-through is a genuinely good end-of-module checkpoint — if any one chord is still inconsistent, that\'s the one to revisit before Module 6\'s fast-switching drills.',
        hintHi: 'Ye poora run-through ek genuinely achha end-of-module checkpoint hai — agar koi ek chord abhi bhi inconsistent hai, wahi hai jise Module 6 ki fast-switching drills se pehle revisit karna hai.',
      },
    ],

    keyTakeaways: [
      'D major: finger 1 on G/fret2, finger 3 on B/fret3, finger 2 on high-e/fret2, low E and A both muted.',
      'D\'s three-different-strings-and-frets triangle shape is often physically easier than A\'s crowded same-fret row.',
      'You now know all 6 campfire chords: Em, Em7, G, C, Am, D — real functional vocabulary, not a partial set.',
    ],
    keyTakeawaysHi: [
      'D major: finger 1 G/fret2 par, finger 3 B/fret3 par, finger 2 high-e/fret2 par, low E aur A dono muted.',
      'D ka three-different-strings-and-frets triangle shape aksar A ki crowded same-fret row se physically easier hai.',
      'Ab tumhe saare 6 campfire chords pata hain: Em, Em7, G, C, Am, D — real functional vocabulary, partial set nahi.',
    ],
  },
];
