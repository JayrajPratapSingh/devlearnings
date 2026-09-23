/**
 * Guitar Course — Module 8: Strum Patterns That Work On Hundreds Of Songs,
 * lessons 1-3.
 *
 * Lesson 1: Reading and counting strum-pattern notation (D/U/X timelines).
 * Lesson 2: The DDU UDU family — one pattern shape that covers an enormous
 *           number of real songs, plus how to adapt it.
 * Lesson 3: The chuck/chunk percussive strum, built on Module 7's palm
 *           muting — added per Jay's request for "chuck slap" technique.
 */

import type { CourseLesson } from './course-js-module1';
import { diagramPreviewHtml, strumPatternSvg } from './guitar-diagrams';

export const GUITAR_MODULE_8: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'reading-strum-pattern-notation',
    title: 'Reading Strum-Pattern Notation',
    titleHi: 'Strum-Pattern Notation Padhna',
    description: 'A third notation system for this course — not chord diagrams, not tab, but a timeline of strum directions.',
    descriptionHi: 'Is course ke liye ek teesra notation system — chord diagrams nahi, tab nahi, balki strum directions ki ek timeline.',
    difficulty: 'EASY',
    duration: 15,
    order: 1,

    analogy: {
      en: '**Dance steps written as a sequence, not a single pose.** A chord diagram is one frozen pose. Tab is a sequence of individual foot placements. Strum notation is closer to a dance instructor calling out "step, step, turn, step" — a rhythm of MOTIONS in time, not positions on a fretboard at all.',
      hi: '**Dance steps ek sequence ki tarah likhe hue, ek single pose nahi.** Chord diagram ek frozen pose hai. Tab individual foot placements ki ek sequence hai. Strum notation ek dance instructor ke "step, step, turn, step" call out karne ke zyada paas hai — time mein MOTIONS ka ek rhythm, bilkul bhi fretboard par positions nahi.',
    },

    simple: `**Reading a strum-pattern timeline:**

- Beats are numbered 1, 2, 3, 4 (one per main beat), with "&" (pronounced "and") for the off-beat exactly halfway between each pair of numbers.
- A downward arrow means strum down (toward the floor). An upward arrow means strum up (toward the ceiling).
- Read left to right, one motion per beat/off-beat marker, at a steady tempo.

**Why the down/up pattern usually alternates predictably:** your strumming hand's wrist is already moving down-up-down-up as a natural pendulum motion (Module 7) — strum notation mostly tells you WHICH of those already-happening motions actually hits the strings versus passes over them without striking (a "ghost strum"), rather than asking you to invent a new motion from scratch for each beat.`,
    simpleHi: `**Ek strum-pattern timeline padhna:**

- Beats 1, 2, 3, 4 number hote hain (ek per main beat), "&" ("and" pronounce hota hai) off-beat ke liye jo har pair of numbers ke beech exactly halfway hai.
- Ek downward arrow matlab down strum karo (floor ki taraf). Ek upward arrow matlab up strum karo (ceiling ki taraf).
- Left se right padho, ek motion per beat/off-beat marker, ek steady tempo par.

**Down/up pattern usually predictably alternate kyun karta hai:** tumhari strumming hand ki wrist already down-up-down-up ek natural pendulum motion ki tarah move kar rahi hai (Module 7) — strum notation zyadatar batata hai ki un already-ho-rahi motions mein se KAUNSI actually strings hit karti hai versus bina strike kiye pass ho jaati hai (ek "ghost strum"), har beat ke liye scratch se ek nayi motion invent karne ko kehne ke bajaye.`,

    content: `**Why counting out loud ("1 and 2 and 3 and 4 and") matters more than it might seem.** Saying the beat count out loud while strumming links the abstract timeline on the page to an actual felt sense of tempo — silently reading the pattern and silently strumming tends to drift out of time much faster than counting aloud does. This is a genuinely effective, low-tech habit worth keeping even after a pattern feels memorized.

**A ghost strum, precisely defined.** Sometimes a pattern's timeline shows an arrow at a beat where you move your hand in that direction but DON'T actually make contact with the strings — this keeps your wrist's pendulum motion continuous and steady (never stopping and restarting), while selectively choosing which passes actually sound. This is an intermediate concept this course will introduce properly once Lesson 2's patterns need it; for now, just know the term exists.

**How this notation relates to Module 2's tab:** both are time-ordered, read left to right — but tab specifies WHICH individual notes/frets play, while strum notation specifies WHICH DIRECTION a full-chord strum moves, with no fret information at all (it assumes you already know which chord shape you're holding). They answer different questions and are used together in real song charts, not as substitutes for each other.`,
    contentHi: `**Beat count ko zor se bolna ("1 and 2 and 3 and 4 and") jitna lagta hai usse zyada kyun matter karta hai.** Strum karte waqt beat count ko zor se bolna page par abstract timeline ko tempo ke ek actual felt sense se link karta hai — silently pattern padhna aur silently strum karna, zor se count karne se kahin zyada fast time se drift karta hai. Ye ek genuinely effective, low-tech habit hai jo pattern memorized feel karne ke baad bhi rakhne layak hai.

**Ek ghost strum, precisely defined.** Kabhi kabhi ek pattern ki timeline ek beat par ek arrow dikhati hai jahan tum apna hand us direction mein move karte ho lekin actually strings ko touch NAHI karte — ye tumhari wrist ki pendulum motion ko continuous aur steady rakhta hai (kabhi rukta ya restart nahi hota), selectively choose karte hue ki kaunsi passes actually sound karti hain. Ye ek intermediate concept hai jise ye course properly introduce karega ek baar jab Lesson 2 ke patterns ko iski zaroorat pade; abhi ke liye, bas jaano ki term exist karta hai.

**Ye notation Module 2 ke tab se kaise related hai:** dono time-ordered hain, left se right padhe jaate hain — lekin tab specify karta hai ki KAUNSE individual notes/frets bajte hain, jabki strum notation specify karta hai ki ek full-chord strum kis DIRECTION mein move karta hai, bilkul koi fret information ke bina (ye assume karta hai ki tumhe already pata hai kaunsa chord shape hold kar rahe ho). Wo alag sawaalon ka jawab dete hain aur real song charts mein saath use hote hain, ek doosre ke substitutes ki tarah nahi.`,

    examples: [
      {
        title: 'A basic all-downstrokes pattern, then adding upstrokes',
        titleHi: 'Ek basic all-downstrokes pattern, phir upstrokes add karte hue',
        code: `Beat:   1  2  3  4
Strum:  D  D  D  D   (all downstrokes — the simplest possible pattern)

Beat:   1  &  2  &  3  &  4  &
Strum:  D  U  D  U  D  U  D  U   (steady alternating down-up)`,
        previewHeight: 200,
        preview: diagramPreviewHtml(
          strumPatternSvg([
            { symbol: 'D', label: '1' },
            { symbol: 'U', label: '&' },
            { symbol: 'D', label: '2' },
            { symbol: 'U', label: '&' },
          ]),
          'The simplest alternating pattern: down on every beat, up on every off-beat.',
        ),
        explain:
          'This alternating pattern is the foundation every more complex pattern in Lesson 2 builds from — the wrist NEVER stops its down-up-down-up pendulum, patterns just selectively skip some of those motions from actually hitting the strings.',
        explainHi:
          'Ye alternating pattern wo foundation hai jispar Lesson 2 ka har zyada complex pattern banta hai — wrist KABHI apna down-up-down-up pendulum nahi rokta, patterns bas selectively kuch motions ko actually strings hit karne se skip karte hain.',
      },
    ],

    mistakes: [
      {
        wrong: 'Reading a strum pattern silently and trying to internalize the timing purely visually.',
        right: 'Count out loud ("1 and 2 and 3 and 4 and") while strumming, at least until a pattern is fully internalized.',
        why: 'Silent reading disconnects the visual timeline from a felt sense of tempo, which is why silently-learned patterns tend to drift out of time much faster than ones learned while counting aloud.',
        whyHi: 'Silent reading visual timeline ko tempo ke felt sense se disconnect kar deta hai, yahi reason hai ki silently-seekhe patterns zor se count karte hue seekhe gaye patterns se kahin zyada fast time se drift karte hain.',
      },
    ],

    realWorld: [
      {
        en: 'Almost every online chord chart for a song includes a strum pattern suggestion in exactly this D/U notation — being fluent in reading it means you can immediately try any song\'s suggested pattern rather than guessing at the rhythm by ear alone.',
        hi: 'Kisi song ke liye almost har online chord chart exactly isi D/U notation mein ek strum pattern suggestion include karta hai — ise fluently padhna aana matlab hai tum turant kisi bhi song ka suggested pattern try kar sakte ho, akele kaan se rhythm guess karne ke bajaye.',
      },
    ],

    interviewQA: [
      {
        q: 'Do I have to strum in the exact direction (down on downbeats, up on upbeats) shown, or can I improvise?',
        qHi: 'Kya mujhe exact wahi direction mein strum karna hai (downbeats par down, upbeats par up) jo dikhaya gaya hai, ya main improvise kar sakta hoon?',
        a: "The down-on-downbeat, up-on-upbeat convention exists because it matches the wrist's natural pendulum motion (Module 7) — fighting it (strumming up on a downbeat, for instance) is physically awkward and rarely sounds better, so it's worth following as written while learning, even though experienced players do sometimes deviate deliberately.",
        aHi: 'Down-on-downbeat, up-on-upbeat convention isliye exist karta hai kyunki ye wrist ki natural pendulum motion (Module 7) se match karta hai — ise fight karna (downbeat par up strum karna, for instance) physically awkward hai aur rarely better sound karta hai, isliye seekhte waqt likha hua follow karna worth hai, chahe experienced players kabhi kabhi deliberately deviate karte hain.',
      },
    ],

    exercises: [
      {
        task: 'Play the alternating D-U-D-U pattern on Em for 4 full rounds (1&2&3&4& four times), counting out loud the entire time.',
        taskHi: 'Em par alternating D-U-D-U pattern 4 poore rounds ke liye bajao (1&2&3&4& char baar), poori der zor se count karte hue.',
        hint: 'If you lose count partway through, stop and restart from beat 1 rather than trying to guess where you are — rebuilding the habit of counting correctly matters more than pushing through one confused round.',
        hintHi: 'Agar beech mein count kho do, ruk jao aur beat 1 se restart karo, guess karne ki koshish karne ke bajaye ki kahan ho — sahi se count karne ki habit rebuild karna ek confused round ke through push karne se zyada matter karta hai.',
      },
    ],

    keyTakeaways: [
      'Strum notation is a third notation system: a timeline of down/up strum directions, read left to right in time, counted "1 & 2 & 3 & 4 &."',
      'Count out loud while strumming — it keeps the abstract pattern connected to a real felt tempo.',
      'Down on downbeats, up on upbeats follows the wrist\'s natural pendulum motion from Module 7.',
    ],
    keyTakeawaysHi: [
      'Strum notation ek teesra notation system hai: down/up strum directions ki ek timeline, time mein left se right padhi jaati hai, "1 & 2 & 3 & 4 &" counted.',
      'Strum karte waqt zor se count karo — ye abstract pattern ko ek real felt tempo se connected rakhta hai.',
      'Downbeats par down, upbeats par up, Module 7 ki wrist ki natural pendulum motion follow karta hai.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'ddu-udu-pattern-family',
    title: 'The DDU UDU Pattern Family',
    titleHi: 'DDU UDU Pattern Family',
    description: 'One pattern shape, with minor variations, that covers an enormous number of real songs across genres.',
    descriptionHi: 'Ek pattern shape, minor variations ke saath, jo genres ke across bahut bade number of real songs cover karta hai.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: '**One recipe base, many dishes.** A good base sauce recipe can become a dozen different dishes with small tweaks. The DDU UDU pattern is guitar\'s equivalent — one core rhythmic shape, and countless real songs are just small variations (a skipped strum here, an added one there) built on the exact same base.',
      hi: '**Ek recipe base, bahut saare dishes.** Ek achhi base sauce recipe chhote tweaks se ek dozen alag dishes ban sakti hai. DDU UDU pattern guitar ka equivalent hai — ek core rhythmic shape, aur countless real songs bas is exact same base par bane chhote variations hain (yahan ek skipped strum, wahan ek added).',
    },

    simple: `**The core pattern:**

\`\`\`
Beat:   1  &  2  &  3  &  4  &
Strum:  D  -  D  U  -  U  D  U
\`\`\`

Read as: Down, (skip), Down, Up, (skip), Up, Down, Up. The two skipped motions ("-") are ghost strums from Lesson 1 — your wrist keeps moving through them, it just doesn't strike the strings.

**Why this exact shape, and not some other one?** It naturally emphasizes beats 1 and 3 (both downstrokes, landing on strong beats) while filling the space between with a smooth up-down-up flow — this specific rhythmic feel is extremely common across pop, rock, folk, and country, which is exactly why one pattern gets you so far.

**A simplified starting version**, if the full pattern feels like too much at once: try D-D-U-D-U (5 strums, dropping the first ghost strum's placement) or just D-D-U-U-D-U — there's some real flexibility here, and the "correct" version is really whichever variant sounds right for the specific song.`,
    simpleHi: `**Core pattern:**

\`\`\`
Beat:   1  &  2  &  3  &  4  &
Strum:  D  -  D  U  -  U  D  U
\`\`\`

Read karo: Down, (skip), Down, Up, (skip), Up, Down, Up. Do skipped motions ("-") Lesson 1 ke ghost strums hain — tumhari wrist unke through move karti rehti hai, bas strings strike nahi karti.

**Ye exact shape kyun, koi doosri kyun nahi?** Ye naturally beats 1 aur 3 ko emphasize karta hai (dono downstrokes, strong beats par landing) jabki beech ki space ko ek smooth up-down-up flow se bharta hai — ye specific rhythmic feel pop, rock, folk, aur country ke across extremely common hai, exactly yahi reason hai ki ek pattern tumhe itna aage le jaata hai.

**Ek simplified starting version**, agar poora pattern ek saath bahut zyada feel kare: D-D-U-D-U try karo (5 strums, pehle ghost strum ki placement drop karte hue) ya bas D-D-U-U-D-U — yahan real flexibility hai, aur "correct" version really wahi variant hai jo specific song ke liye sahi sound kare.`,

    content: `**Why does dropping/adding a strum here and there still "count" as the same pattern family?** The underlying skeleton — downstrokes anchoring the main beats, upstrokes filling the off-beats — is what defines the family, not an exact fixed sequence of 8 symbols. Real songs constantly nudge this skeleton: sometimes adding a strum on the "&" before beat 1 for a pickup feel, sometimes dropping the final upstroke for a more clipped ending. Recognizing the underlying skeleton is what lets you adapt on the fly instead of needing a memorized, rigid sequence for every single song.

**How to actually adapt the pattern to a new song by ear.** Listen for which beats feel "strong" (usually where a singer's syllables land firmly) — those are your downstroke anchors. Everything else is flexible connective motion, usually upstrokes and ghost strums filling the gaps. This is a real, learnable listening skill, not guesswork, and it's exactly what Module 12's ear-training tools will help develop further.

**Why practicing this pattern on EVERY chord you know matters**, not just once in isolation: the pattern itself, and each individual chord's muscle memory, are two separate skills that need to combine — practicing the pattern only on Em, say, doesn't guarantee it transfers instantly to G. Module 13's actual songs will demand switching chords mid-pattern, which is exactly the next-level combination skill this groundwork sets up.`,
    contentHi: `**Yahan wahan ek strum drop/add karna abhi bhi same pattern family "count" kyun karta hai?** Underlying skeleton — downstrokes jo main beats ko anchor karte hain, upstrokes jo off-beats ko bharte hain — wo hai jo family ko define karta hai, 8 symbols ki ek exact fixed sequence nahi. Real songs constantly is skeleton ko nudge karte hain: kabhi beat 1 se pehle "&" par ek strum add karte hue ek pickup feel ke liye, kabhi ek zyada clipped ending ke liye final upstroke drop karte hue. Underlying skeleton recognize karna hi wo hai jo tumhe on the fly adapt karne deta hai, har single song ke liye ek memorized, rigid sequence ki zaroorat ke bajaye.

**Kaan se pattern ko ek naye song mein actually kaise adapt karein.** Sunno ki kaunse beats "strong" feel karte hain (usually jahan singer ke syllables firmly land karte hain) — wo tumhare downstroke anchors hain. Baaki sab flexible connective motion hai, usually upstrokes aur ghost strums jo gaps bharte hain. Ye ek real, learnable listening skill hai, guesswork nahi, aur ye exactly wahi hai jise Module 12 ke ear-training tools aage develop karne mein help karenge.

**Is pattern ko apne jaante hue HAR chord par practice karna kyun matter karta hai**, sirf isolation mein ek baar nahi: pattern khud, aur har individual chord ki muscle memory, do separate skills hain jinhe combine hona hai — pattern ko sirf Em par practice karna, say, guarantee nahi karta ki wo turant G tak transfer ho. Module 13 ke real songs pattern ke beech mein chords switch karna demand karenge, jo exactly wo next-level combination skill hai jiske liye ye groundwork set up kar raha hai.`,

    examples: [
      {
        title: 'The full DDU UDU pattern',
        titleHi: 'Poora DDU UDU pattern',
        code: `Beat:   1  &  2  &  3  &  4  &
Strum:  D  -  D  U  -  U  D  U`,
        previewHeight: 200,
        preview: diagramPreviewHtml(
          strumPatternSvg([
            { symbol: 'D', label: '1' },
            { symbol: '-', label: '&' },
            { symbol: 'D', label: '2' },
            { symbol: 'U', label: '&' },
            { symbol: '-', label: '3' },
            { symbol: 'U', label: '&' },
            { symbol: 'D', label: '4' },
            { symbol: 'U', label: '&' },
          ]),
          'D _ D U _ U D U — downstrokes anchor beats 1 and 3, the ghost-strum gaps keep the wrist\'s motion continuous.',
        ),
        explain:
          'Notice both skipped ("-") motions come right after a downbeat, not randomly placed — that placement is what makes the wrist motion feel natural rather than arbitrary once you\'re actually playing it.',
        explainHi:
          'Notice karo dono skipped ("-") motions ek downbeat ke turant baad aate hain, randomly placed nahi — wahi placement hai jo wrist motion ko actually bajaate waqt natural feel karata hai, arbitrary nahi.',
      },
    ],

    mistakes: [
      {
        wrong: 'Treating the DDU UDU pattern as one rigid, unchangeable sequence that must be reproduced exactly for every song.',
        right: 'Learn the underlying skeleton (downstrokes on strong beats, upstrokes filling gaps) and expect to nudge it per song.',
        why: 'Real songs constantly vary this base pattern slightly — memorizing only the exact 8-symbol sequence without understanding WHY it\'s shaped that way makes adapting to new songs much harder than it needs to be.',
        whyHi: 'Real songs is base pattern ko constantly thoda vary karte hain — sirf exact 8-symbol sequence memorize karna bina ye samjhe ki WHY ye us shape mein hai, naye songs mein adapt karna zaroorat se zyada hard bana deta hai.',
      },
    ],

    realWorld: [
      {
        en: 'If you learn only one strum pattern in your entire guitar journey, this is the one most teachers would recommend — its sheer coverage across genres and decades of popular music is genuinely unusual for a single rhythmic shape.',
        hi: 'Agar tum apni poori guitar journey mein sirf ek strum pattern seekho, ye wahi hai jo zyadatar teachers recommend karenge — genres aur decades of popular music ke across iska sheer coverage ek single rhythmic shape ke liye genuinely unusual hai.',
      },
    ],

    interviewQA: [
      {
        q: 'How do I know which variation of the pattern a specific song uses?',
        qHi: 'Mujhe kaise pata chalega ki ek specific song pattern ka kaunsa variation use karta hai?',
        a: "Listen closely to the strong beats (usually where vocals land) and count along — with practice, you'll start hearing where the downstrokes land and can reverse-engineer the pattern by ear. Many songs also have online chord charts with a suggested pattern, which is a good way to check your ear-based guess.",
        aHi: 'Strong beats ko closely suno (usually jahan vocals land karte hain) aur saath mein count karo — practice ke saath, tum sunna shuru karoge ki downstrokes kahan land karte hain aur ear se pattern reverse-engineer kar sakte ho. Bahut saare songs ke online chord charts bhi ek suggested pattern ke saath hote hain, jo apne ear-based guess ko check karne ka ek achha tareeka hai.',
      },
    ],

    exercises: [
      {
        task: 'Play the full DDU UDU pattern on each of the six campfire chords in turn, counting out loud, before moving to the next chord. Notice if the pattern feels harder on any specific chord.',
        taskHi: 'Poora DDU UDU pattern six campfire chords mein se har ek par baari baari bajao, zor se count karte hue, agle chord par jaane se pehle. Notice karo ki kya pattern kisi specific chord par harder feel karta hai.',
        hint: 'If the pattern falls apart on a chord requiring more finger effort (like G), that\'s a sign to isolate that chord\'s pattern practice specifically, rather than assuming the pattern itself is the problem.',
        hintHi: 'Agar pattern ek aise chord par gir jaata hai jise zyada finger effort chahiye (jaise G), ye us chord ke pattern practice ko specifically isolate karne ka sign hai, ye assume karne ke bajaye ki pattern khud problem hai.',
      },
    ],

    keyTakeaways: [
      'The DDU UDU pattern (D _ D U _ U D U) is a single rhythmic shape covering an enormous range of real songs.',
      'The underlying skeleton — downstrokes on strong beats, upstrokes filling gaps — matters more than the exact 8-symbol sequence.',
      'Real songs nudge this base pattern constantly; learning to adapt by ear is the actual transferable skill.',
    ],
    keyTakeawaysHi: [
      'DDU UDU pattern (D _ D U _ U D U) ek single rhythmic shape hai jo real songs ki ek bahut badi range cover karta hai.',
      'Underlying skeleton — strong beats par downstrokes, gaps bharte upstrokes — exact 8-symbol sequence se zyada matter karta hai.',
      'Real songs is base pattern ko constantly nudge karte hain; kaan se adapt karna seekhna hi actual transferable skill hai.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'the-chuck-percussive-strum',
    title: 'The "Chuck" — A Percussive Strum Technique',
    titleHi: '"Chuck" — Ek Percussive Strum Technique',
    description: 'A modern rhythmic technique built directly on Module 7\'s palm muting — a deliberate percussive hit mixed into a strum pattern.',
    descriptionHi: 'Ek modern rhythmic technique jo directly Module 7 ki palm muting par bani hai — ek strum pattern mein mix kiya gaya ek deliberate percussive hit.',
    difficulty: 'MEDIUM',
    duration: 15,
    order: 3,

    analogy: {
      en: '**A drummer\'s hi-hat "chick" mixed into a groove.** A drummer sometimes closes the hi-hat sharply for a short, percussive "chick" sound between other hits, adding rhythmic texture without a pitched note. The guitar "chuck" does the same job: a fully muted, percussive hit mixed into a strum pattern, adding rhythm without ringing pitch.',
      hi: '**Ek drummer ka hi-hat "chick" jo groove mein mix hua hai.** Ek drummer kabhi kabhi hi-hat ko sharply close karta hai ek short, percussive "chick" sound ke liye doosre hits ke beech, ek pitched note ke bina rhythmic texture add karte hue. Guitar "chuck" wahi kaam karta hai: ek fully muted, percussive hit jo strum pattern mein mix hua hai, bina ringing pitch ke rhythm add karte hue.',
    },

    simple: `**The chuck technique, step by step:**

1. Form any chord shape with your fretting hand, but relax the pressure so the strings are damped/deadened (don't press hard enough for a clean note — this is a "ghost" chord shape, not a fully pressed one).
2. Strum through all the strings normally with your strumming hand.
3. The result: a percussive "thunk" with no clear pitch — rhythm without melody.

**Where it fits in a pattern:** a chuck typically replaces one specific strum in an otherwise normal pattern, usually right before a downbeat, adding a rhythmic "push" into the next strong beat.

\`\`\`
Beat:   1  &  2  &  3  &  4  &
Strum:  D  -  D  U  X  U  D  U     (X = chuck, replacing what would be an upstroke)
\`\`\``,
    simpleHi: `**Chuck technique, step by step:**

1. Apni fretting hand se koi bhi chord shape banao, lekin pressure relax karo taaki strings damped/deadened hon (itna hard mat dabao ki clean note bane — ye ek "ghost" chord shape hai, ek poori tarah pressed shape nahi).
2. Apni strumming hand se saari strings ko normally strum karo.
3. Result: ek percussive "thunk" bina kisi clear pitch ke — rhythm bina melody ke.

**Ye ek pattern mein kahan fit hota hai:** ek chuck typically ek otherwise normal pattern mein ek specific strum ko replace karta hai, usually agle downbeat se bilkul pehle, agle strong beat mein ek rhythmic "push" add karte hue.

\`\`\`
Beat:   1  &  2  &  3  &  4  &
Strum:  D  -  D  U  X  U  D  U     (X = chuck, ek upstroke ki jagah)
\`\`\``,

    content: `**Two distinct ways to mute for a chuck — fretting hand or strumming hand, and why both are worth knowing.** The version described above (relaxing fretting pressure) is often easier for beginners since it doesn't require repositioning the strumming hand mid-pattern. The alternative — keeping the chord fully fretted but using Module 7's palm-muting technique for that one strum instead — is what many experienced players default to, since the strumming hand is already positioned for the surrounding strums. Both produce a similar percussive effect; try both and use whichever fits more smoothly into your specific pattern.

**Why the chuck is specifically a "modern" technique worth calling out.** It's less commonly taught in traditional beginner method books, which tend to focus purely on clean ringing chords, but it's everywhere in contemporary pop, funk-influenced pop-rock, and acoustic singer-songwriter arrangements — this is exactly the kind of "sounds like a real, current recording" technique that separates a strictly by-the-book beginner sound from a more contemporary one.

**Timing precision matters more here than for a normal strum.** Because a chuck has no pitch to "cover" for a slightly-off timing (a normal strum's ringing chord partially masks small timing errors), a chuck that lands even slightly early or late is more noticeable than a slightly mistimed regular strum. This makes the chuck a genuinely good advanced test of the timing skills Module 9 (next) will formalize with a metronome.`,
    contentHi: `**Chuck ke liye mute karne ke do distinct tareeke — fretting hand ya strumming hand, aur dono jaanne layak kyun hain.** Upar describe kiya gaya version (fretting pressure relax karna) beginners ke liye often easier hai kyunki isme mid-pattern strumming hand ko reposition karne ki zaroorat nahi. Alternative — chord ko poori tarah fretted rakhna lekin us ek strum ke liye Module 7 ki palm-muting technique use karna — wahi hai jo bahut saare experienced players default se karte hain, kyunki strumming hand already surrounding strums ke liye positioned hai. Dono ek similar percussive effect produce karte hain; dono try karo aur jo bhi tumhare specific pattern mein zyada smoothly fit ho wo use karo.

**Chuck specifically ek "modern" technique kyun hai jise call out karna worth hai.** Ye traditional beginner method books mein kam commonly sikhaya jaata hai, jo purely clean ringing chords par focus karte hain, lekin ye contemporary pop, funk-influenced pop-rock, aur acoustic singer-songwriter arrangements mein har jagah hai — ye exactly wo tarah ki "ek real, current recording jaisa sound karta hai" technique hai jo ek strictly by-the-book beginner sound ko ek zyada contemporary sound se separate karti hai.

**Timing precision yahan ek normal strum se zyada matter karti hai.** Kyunki ek chuck ke paas koi pitch nahi hai ek slightly-off timing ko "cover" karne ke liye (ek normal strum ka ringing chord chhoti timing errors ko partially mask karta hai), ek chuck jo thoda bhi early ya late land kare wo ek thodi si mistimed regular strum se zyada noticeable hai. Ye chuck ko un timing skills ka ek genuinely good advanced test banata hai jinhe Module 9 (agla) ek metronome ke saath formalize karega.`,

    examples: [
      {
        title: 'A pattern with one chuck added',
        titleHi: 'Ek chuck add kiya hua pattern',
        code: `Beat:   1  &  2  &  3  &  4  &
Strum:  D  -  D  U  X  U  D  U`,
        previewHeight: 200,
        preview: diagramPreviewHtml(
          strumPatternSvg([
            { symbol: 'D', label: '1' },
            { symbol: '-', label: '&' },
            { symbol: 'D', label: '2' },
            { symbol: 'U', label: '&' },
            { symbol: 'X', label: '3' },
            { symbol: 'U', label: '&' },
            { symbol: 'D', label: '4' },
            { symbol: 'U', label: '&' },
          ]),
          'The chuck (X) on beat 3 replaces what would otherwise be a downstroke — a percussive hit instead of a ringing chord, right in the middle of the pattern.',
        ),
        explain:
          'This is Lesson 2\'s exact DDU UDU pattern with a single strum swapped for a chuck — a concrete illustration that adding this technique to a pattern you already know is a small modification, not a new pattern to learn from scratch.',
        explainHi:
          'Ye Lesson 2 ka exact DDU UDU pattern hai jismein ek single strum ko chuck se swap kiya gaya hai — ek concrete illustration ki is technique ko ek already-known pattern mein add karna ek small modification hai, scratch se seekhne wala ek naya pattern nahi.',
      },
    ],

    mistakes: [
      {
        wrong: 'Pressing the fretting hand down hard enough for a clean note when attempting a chuck, producing a normal chord sound instead of a percussive one.',
        right: 'Relax fretting pressure deliberately (or use strumming-hand palm muting instead) so the strings are genuinely damped, not clearly pitched.',
        why: "A chuck's entire character comes from having no clear pitch — if a clean note rings through, it's just a normal strum with extra effort, not the percussive effect being aimed for.",
        whyHi: 'Ek chuck ka poora character bina clear pitch ke hone se aata hai — agar ek clean note ring karta hai, ye bas extra effort wala ek normal strum hai, wo percussive effect nahi jiske liye aim kiya ja raha tha.',
      },
    ],

    realWorld: [
      {
        en: 'Listen for this technique in modern acoustic pop and singer-songwriter recordings — that rhythmic "thunk" mixed into an otherwise clean strum pattern is almost always exactly this chuck technique, not a separate percussion instrument.',
        hi: 'Modern acoustic pop aur singer-songwriter recordings mein ye technique sunne ki koshish karo — otherwise clean strum pattern mein mix hua wo rhythmic "thunk" almost hamesha exactly yahi chuck technique hai, koi separate percussion instrument nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'Can I use the chuck technique with any chord, or only specific ones?',
        qHi: 'Kya main chuck technique kisi bhi chord ke saath use kar sakta hoon, ya sirf specific ones ke saath?',
        a: "Any chord shape works, since the whole point is deliberately NOT producing that chord's clear pitch — you're using the shape as a convenient hand position, not for its actual harmonic content, during the chuck itself.",
        aHi: 'Koi bhi chord shape kaam karta hai, kyunki poora point hai deliberately us chord ki clear pitch produce NA karna — tum shape ko ek convenient hand position ki tarah use kar rahe ho, uske actual harmonic content ke liye nahi, chuck ke dauraan.',
      },
    ],

    exercises: [
      {
        task: 'Take the DDU UDU pattern from Lesson 2 on any chord, and practice replacing the upstroke right before beat 3 with a chuck, using the relaxed-fretting-hand method first.',
        taskHi: 'Lesson 2 ka DDU UDU pattern kisi bhi chord par lo, aur beat 3 se bilkul pehle wale upstroke ko chuck se replace karne ki practice karo, pehle relaxed-fretting-hand method use karke.',
        hint: 'If the chuck still rings with some pitch, relax the fretting hand pressure even further — there\'s more room between "fully pressed" and "not touching at all" than it might seem.',
        hintHi: 'Agar chuck abhi bhi kuch pitch ke saath ring kare, fretting hand pressure ko aur bhi relax karo — "fully pressed" aur "bilkul touch nahi" ke beech jitna lagta hai usse zyada room hai.',
      },
    ],

    keyTakeaways: [
      'The chuck: a deliberately muted, percussive strum mixed into a pattern — rhythm without ringing pitch.',
      'Two valid methods: relax fretting-hand pressure, or use strumming-hand palm muting (Module 7) on that one strum.',
      'A modern technique common in contemporary pop/acoustic arrangements, less emphasized in traditional method books.',
      'Timing precision matters more for a chuck than a normal strum, since there\'s no ringing pitch to mask small timing errors.',
    ],
    keyTakeawaysHi: [
      'Chuck: ek deliberately muted, percussive strum jo ek pattern mein mix hua hai — rhythm bina ringing pitch ke.',
      'Do valid methods: fretting-hand pressure relax karo, ya us ek strum par strumming-hand palm muting (Module 7) use karo.',
      'Ek modern technique jo contemporary pop/acoustic arrangements mein common hai, traditional method books mein kam emphasized.',
      'Ek chuck ke liye timing precision ek normal strum se zyada matter karti hai, kyunki small timing errors ko mask karne ke liye koi ringing pitch nahi hai.',
    ],
  },
];
