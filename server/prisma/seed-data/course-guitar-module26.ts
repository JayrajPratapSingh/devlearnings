/**
 * Guitar Course — Module 26 (FINAL MODULE): The Pro's Toolkit & Where
 * To Go Next, lessons 1-3. Closes Part IX and the entire 26-module,
 * noob-to-pro course.
 */

import type { CourseLesson } from './course-js-module1';

export const GUITAR_MODULE_26: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'standard-notation-basics',
    title: 'Standard Notation Basics: Reading the Universal System',
    titleHi: 'Standard Notation Basics: Universal System Padhna',
    description: 'Tab tells you where to put your fingers. Standard notation tells you exactly what to play — and why guitarists usually need both.',
    descriptionHi: 'Tab tumhe bataata hai apni fingers kahan rakhein. Standard notation tumhe bataata hai exactly kya bajaana hai — aur guitarists ko usually dono kyun chahiye.',
    difficulty: 'HARD',
    duration: 20,
    order: 1,

    analogy: {
      en: '**A local street map versus a universal set of GPS coordinates.** Tab (Module 2) is like a hyper-specific local map: "walk to this exact building on this exact street" — perfect for THIS instrument, meaningless to anyone using a different map system. Standard notation is like GPS coordinates: usable by any instrument, anywhere, but it doesn\'t tell you which specific "street" (string) or "building" (fret) to use to get there on a guitar specifically.',
      hi: '**Ek local street map versus ek universal set of GPS coordinates.** Tab (Module 2) ek hyper-specific local map jaisa hai: "is exact street par is exact building tak chalo" — is INSTRUMENT ke liye perfect, kisi aur map system use karne wale ke liye meaningless. Standard notation GPS coordinates jaisa hai: kisi bhi instrument se, kahin bhi usable, lekin ye tumhe nahi bataata ki wahan pahunchne ke liye guitar par specifically kaunsi "street" (string) ya "building" (fret) use karni hai.',
    },

    simple: `**The staff, the basic reading surface:** 5 lines and 4 spaces. From bottom to top, the lines spell E-G-B-D-F (a common memory phrase: "Every Good Boy Does Fine"); the spaces spell F-A-C-E (simply the word "FACE"). Each line or space represents one specific pitch.

**A genuinely surprising, real fact about guitar notation specifically:** guitar is written in treble clef, but SOUNDS one octave lower than the written pitch — a "transposing instrument," the same category as several orchestral instruments. This isn\'t an error or inconsistency; it\'s a standard convention that keeps guitar music from needing constant extra ledger lines below the staff.

**Basic rhythm notation, connecting directly to Module 8\'s beat-counting:** a quarter note = 1 beat, a half note = 2 beats, a whole note = 4 beats, an eighth note = half a beat — the exact same beat-counting logic Module 8 used for strum patterns (counting "1-2-3-4" or "1-&-2-&"), just written with symbols instead of letters.

**Why guitarists often need tab AND standard notation together:** notation alone tells you the exact pitch and rhythm, but (unlike piano, where one key produces one specific pitch) that same pitch often exists in several different places on a guitar\'s fretboard (Module 18\'s octave shapes) — notation alone can\'t tell you WHICH one to use. That\'s exactly what tab adds back.`,
    simpleHi: `**Staff, basic reading surface:** 5 lines aur 4 spaces. Neeche se upar, lines E-G-B-D-F spell karti hain (ek common memory phrase: "Every Good Boy Does Fine"); spaces F-A-C-E spell karti hain (simply word "FACE"). Har line ya space ek specific pitch represent karti hai.

**Guitar notation ke baare mein ek genuinely surprising, real fact specifically:** guitar treble clef mein likha jaata hai, lekin written pitch se ek octave neeche SOUND karta hai — ek "transposing instrument," wahi category jismein kai orchestral instruments hain. Ye ek error ya inconsistency nahi hai; ye ek standard convention hai jo guitar music ko staff ke neeche constant extra ledger lines ki zaroorat se bachaata hai.

**Basic rhythm notation, directly Module 8 ke beat-counting se connect karte hue:** ek quarter note = 1 beat, ek half note = 2 beats, ek whole note = 4 beats, ek eighth note = aadha beat — exact same beat-counting logic jo Module 8 ne strum patterns ke liye use ki thi ("1-2-3-4" ya "1-&-2-&" count karte hue), bas letters ke bajaye symbols ke saath likhi hui.

**Guitarists ko often tab AUR standard notation saath mein kyun chahiye:** notation akela exact pitch aur rhythm bataata hai, lekin (piano ke unlike, jahan ek key ek specific pitch produce karti hai) wahi pitch often guitar ke fretboard par kai alag jagah exist karti hai (Module 18 ke octave shapes) — notation akela nahi bata sakta ki kaunsi use karni hai. Yahi exactly hai jo tab wapas add karta hai.`,

    content: `**Why the "same pitch, multiple positions" ambiguity is specifically a guitar problem, connecting directly back to Module 18.** On a piano, one written pitch maps to exactly one physical key — no ambiguity possible. On guitar, Module 18\'s octave shapes and Module 21\'s CAGED system both demonstrated, extensively and concretely, that the SAME pitch is deliberately reachable in multiple places. This is precisely why guitar music so often needs tab layered underneath standard notation, while piano sheet music never does — it\'s a direct structural consequence of a fact this course spent four modules (18-21) establishing.

**Why learning to read notation, even at a basic level, is genuinely useful beyond reading guitar-specific sheet music.** Standard notation is how musicians of every instrument communicate — a bandmate on piano or violin, a music theory textbook, a film score, all default to this system. Even basic fluency lets you participate in conversations and read resources tab-only players are excluded from entirely.

**An honest scope statement for this lesson.** This lesson gives genuine reading fundamentals — enough to identify pitches and basic rhythms on a staff. Full sight-reading fluency (instantly reading complex, fast passages) is a separate, substantial skill built over extended practice, similar to how Module 25 honestly scoped sweep picking and tapping — a real skill worth pursuing, not something this one lesson claims to complete.`,
    contentHi: `**"Same pitch, multiple positions" ambiguity specifically ek guitar problem kyun hai, directly Module 18 se wapas connect karte hue.** Piano par, ek written pitch exactly ek physical key se map hoti hai — koi ambiguity possible nahi. Guitar par, Module 18 ke octave shapes aur Module 21 ke CAGED system dono ne extensively aur concretely demonstrate kiya ki SAME pitch deliberately kai jagah reachable hai. Yahi exactly hai kyun guitar music ko itni baar standard notation ke neeche tab layered chahiye hoti hai, jabki piano sheet music ko kabhi nahi — ye ek fact ka direct structural consequence hai jise ye course chaar modules (18-21) mein establish karne mein bitaata hai.

**Notation padhna seekhna, basic level par bhi, guitar-specific sheet music padhne se aage genuinely useful kyun hai.** Standard notation wo hai jis se har instrument ke musicians communicate karte hain — piano ya violin par ek bandmate, ek music theory textbook, ek film score, sab default is system par jaate hain. Basic fluency bhi tumhe un conversations aur resources mein participate karne deti hai jinse tab-only players poori tarah excluded hain.

**Is lesson ke liye ek honest scope statement.** Ye lesson genuine reading fundamentals deta hai — ek staff par pitches aur basic rhythms identify karne ke liye kaafi. Full sight-reading fluency (complex, fast passages ko instantly padhna) ek separate, substantial skill hai jo extended practice se build hoti hai, similar to jaise Module 25 ne honestly sweep picking aur tapping ko scope kiya tha — ek real skill jo pursue karne layak hai, kuch aisa nahi jo ye ek lesson complete karne ka claim kare.`,

    examples: [
      {
        title: 'Reading the staff: lines and spaces, bottom to top',
        titleHi: 'Staff padhna: lines aur spaces, neeche se upar',
        code: `Lines (bottom to top):  E - G - B - D - F   ("Every Good Boy Does Fine")
Spaces (bottom to top): F - A - C - E          ("FACE")

Rhythm values (Module 8's beat-counting, in symbols):
Whole note = 4 beats.  Half note = 2 beats.
Quarter note = 1 beat. Eighth note = half a beat.`,
        output: 'A staff-reading reference like this is meant to be memorized through repeated use, not from a single lesson — treat the two mnemonics as a starting anchor, the same anchor-point approach Module 18 used for fretboard notes.',
        explain:
          'Presenting both mnemonics together, right next to the rhythm values already familiar from Module 8\'s counting system, ties the one genuinely new piece of information (pitch-reading) to something already comfortable (rhythm-counting).',
        explainHi:
          'Dono mnemonics ko saath present karna, Module 8 ke counting system se already familiar rhythm values ke bilkul next, ek genuinely nayi piece of information (pitch-reading) ko kisi aisi cheez se tie karta hai jo already comfortable hai (rhythm-counting).',
      },
    ],

    mistakes: [
      {
        wrong: 'Assuming standard notation and tab are competing systems where you should pick one and ignore the other.',
        right: 'Recognize they solve different problems (universal pitch/rhythm vs. guitar-specific finger position) and are frequently used together for exactly that reason.',
        why: 'Treating them as competitors misses why published guitar music routinely shows both — each covers a genuine gap the other has, specifically because of how guitar (uniquely among common instruments) allows the same pitch in several places.',
        whyHi: 'Unhe competitors ki tarah treat karna ye miss karta hai ki published guitar music routinely dono kyun dikhaata hai — har ek doosre ka ek genuine gap cover karta hai, specifically isliye kyunki guitar (common instruments mein uniquely) same pitch ko kai jagah allow karta hai.',
      },
    ],

    realWorld: [
      {
        en: 'A guitarist joining a band with a horn or string section, or working from a film composer\'s score, needs standard notation literacy simply to communicate with musicians whose instruments have no equivalent to tab at all.',
        hi: 'Ek guitarist jo ek horn ya string section wale band mein join karta hai, ya ek film composer ke score se kaam karta hai, use standard notation literacy chahiye simply un musicians ke saath communicate karne ke liye jinke instruments mein tab ke equivalent kuch bhi nahi hai.',
      },
    ],

    interviewQA: [
      {
        q: 'If tab already tells me exactly where to put my fingers, is there any real reason to bother learning standard notation at all?',
        qHi: 'Agar tab already mujhe exactly bataata hai ki apni fingers kahan rakhoon, kya standard notation seekhne ki koi real reason hai?',
        a: 'For playing tab-available guitar music alone, not urgently — but the moment you need to communicate with non-guitarists, read non-guitar sheet music, or work from any source that only provides notation (which is most of the music world), tab alone leaves you stuck.',
        aHi: 'Sirf tab-available guitar music bajaane ke liye, urgently nahi — lekin jis moment tumhe non-guitarists ke saath communicate karna hai, non-guitar sheet music padhni hai, ya kisi bhi source se kaam karna hai jo sirf notation provide karta hai (jo music world ka zyadatar hissa hai), tab akela tumhe stuck chhod deta hai.',
      },
    ],

    exercises: [
      {
        task: 'Using the line and space mnemonics from this lesson, identify the note name for the 3rd line from the bottom and the 2nd space from the bottom of the treble clef staff, without looking back at the reference.',
        taskHi: 'Is lesson ke line aur space mnemonics use karke, treble clef staff ki neeche se 3rd line aur neeche se 2nd space ke liye note name identify karo, reference ko wapas dekhe bina.',
        hint: 'Lines: E-G-B-D-F (3rd line = B). Spaces: F-A-C-E (2nd space = A).',
        hintHi: 'Lines: E-G-B-D-F (3rd line = B). Spaces: F-A-C-E (2nd space = A).',
      },
    ],

    keyTakeaways: [
      'The staff\'s lines spell E-G-B-D-F and spaces spell F-A-C-E, bottom to top — guitar is written in treble clef but sounds one octave lower.',
      'Rhythm notation (whole/half/quarter/eighth notes) maps directly onto Module 8\'s beat-counting system, just with symbols instead of numbers.',
      'Tab and standard notation solve different problems and are frequently used together — a direct consequence of guitar allowing the same pitch in multiple fretboard positions (Module 18).',
    ],
    keyTakeawaysHi: [
      'Staff ki lines E-G-B-D-F spell karti hain aur spaces F-A-C-E, neeche se upar — guitar treble clef mein likha jaata hai lekin ek octave neeche sound karta hai.',
      'Rhythm notation (whole/half/quarter/eighth notes) directly Module 8 ke beat-counting system par map karta hai, bas numbers ke bajaye symbols ke saath.',
      'Tab aur standard notation alag problems solve karte hain aur frequently saath use hote hain — guitar ke ek pitch ko multiple fretboard positions mein allow karne ka ek direct consequence (Module 18).',
    ],
    guitarPractice: { earTraining: [{"string":0,"fret":0},{"string":1,"fret":0},{"string":2,"fret":0},{"string":3,"fret":0},{"string":4,"fret":0},{"string":5,"fret":0}] },
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'recording-gear-and-tone',
    title: 'Recording, Gear, and Tone: The Practical Side of Sounding Good',
    titleHi: 'Recording, Gear, Aur Tone: Achha Sound Karne Ka Practical Side',
    description: 'What actually shapes your sound, and a realistic, low-cost way to start recording yourself for real practice feedback.',
    descriptionHi: 'Kya actually tumhaari sound shape karta hai, aur khud ko record karne ka ek realistic, low-cost tareeka real practice feedback ke liye.',
    difficulty: 'MEDIUM',
    duration: 15,
    order: 2,

    analogy: {
      en: '**A photograph\'s composition matters more than the camera that took it.** A skilled photographer with a basic phone camera reliably outperforms an unskilled one with expensive gear. Tone and recording quality work the same way: technique and setup fundamentals (this lesson\'s focus) matter more than expensive equipment — genuinely good gear helps, but it amplifies existing skill rather than replacing it.',
      hi: '**Ek photograph ki composition us camera se zyada matter karti hai jisne use liya.** Ek basic phone camera wala skilled photographer reliably ek expensive gear wale unskilled photographer se behtar perform karta hai. Tone aur recording quality bhi waise hi kaam karte hain: technique aur setup fundamentals (is lesson ka focus) expensive equipment se zyada matter karte hain — genuinely achha gear help karta hai, lekin ye existing skill ko amplify karta hai, replace nahi.',
    },

    simple: `**A genuinely usable, low-cost recording setup, right now:** a smartphone\'s built-in microphone, placed a foot or two away from the guitar (not directly on top of it, which distorts the sound), in a quiet room, is a completely sufficient starting point for Module 24\'s "record and critically listen back" practice — no special equipment purchase required to start.

**Tone, broken into four practical categories most gear and settings fall into:**
- **EQ (equalization):** boosting or cutting specific frequency ranges (bass, mid, treble) to shape overall brightness or warmth.
- **Gain/distortion:** how "clean" versus "overdriven/crunchy" a signal sounds — a spectrum, not just an on/off switch.
- **Time-based effects (delay, reverb):** adding echo or a sense of space to a sound.
- **Modulation effects (chorus, phaser):** subtly varying pitch or tone over time for movement and texture.

**Why understanding these four categories matters more than owning specific gear:** any piece of gear — an amp, a pedal, a recording app\'s built-in effects — is doing SOME combination of these four things. Understanding the categories lets you make informed choices with whatever gear you actually have access to, rather than needing a specific expensive setup to have any control over your sound.`,
    simpleHi: `**Ek genuinely usable, low-cost recording setup, abhi:** ek smartphone ka built-in microphone, guitar se ek-do feet door rakha gaya (directly uske upar nahi, jo sound ko distort karta hai), ek quiet room mein, Module 24 ke "record karo aur critically wapas suno" practice ke liye ek completely sufficient starting point hai — shuru karne ke liye koi special equipment purchase ki zaroorat nahi.

**Tone, chaar practical categories mein toda hua jinmein zyadatar gear aur settings aate hain:**
- **EQ (equalization):** specific frequency ranges (bass, mid, treble) ko boost ya cut karna overall brightness ya warmth shape karne ke liye.
- **Gain/distortion:** ek signal kitna "clean" versus "overdriven/crunchy" sound karta hai — ek spectrum, sirf ek on/off switch nahi.
- **Time-based effects (delay, reverb):** ek sound mein echo ya space ka sense add karna.
- **Modulation effects (chorus, phaser):** movement aur texture ke liye time ke saath pitch ya tone ko subtly vary karna.

**Ye chaar categories samajhna specific gear own karne se zyada kyun matter karta hai:** koi bhi gear ka piece — ek amp, ek pedal, ek recording app ke built-in effects — in chaar cheezon mein se KUCH combination kar raha hai. Categories samajhna tumhe jo bhi gear tumhare paas actually access hai uske saath informed choices banane deta hai, apne sound par kisi bhi control ke liye ek specific expensive setup ki zaroorat ke bina.`,

    content: `**Why placing a phone microphone a foot or two away, rather than directly against the guitar, genuinely matters and isn\'t just a minor preference.** A microphone placed too close to any single point on the guitar\'s body captures a distorted, unbalanced snapshot of the sound (overemphasizing whatever is nearest), rather than the more natural, blended sound a listener a small distance away actually hears — a small, concrete adjustment with a real, noticeable effect on recording quality, at zero additional cost.

**Why the "four categories" framing is more durable knowledge than memorizing specific pedal or amp models.** Specific gear goes out of production, gets replaced, and varies enormously in price — but EQ, gain, time-based effects, and modulation are the fundamental categories nearly all tone-shaping tools fall into, regardless of brand, price, or decade. This is the same "understand the underlying structure, not just the specific instance" principle this course applied to chords (Module 19\'s triads), scales (Module 22-23), and technique (Module 25) — now applied to gear and tone.

**An honest, direct note on gear\'s actual role relative to everything else in this course.** Every single technique, chord, scale, and improvisation skill taught in Modules 1-25 works on genuinely basic, inexpensive equipment. Gear can refine and enhance an already-developed sound, but it has never been, and isn\'t now, a substitute for the fundamentals — a message worth stating explicitly, this late in the course, as directly as possible.`,
    contentHi: `**Ek phone microphone ko ek-do feet door rakhna, guitar ke directly against ke bajaye, genuinely kyun matter karta hai aur sirf ek minor preference nahi hai.** Ek microphone jo guitar ki body par kisi single point ke bahut close rakha gaya ho ek distorted, unbalanced snapshot capture karta hai sound ka (jo bhi nearest hai use overemphasize karte hue), us zyada natural, blended sound ke bajaye jo ek listener thodi distance par actually sunta hai — ek chhota, concrete adjustment jiska recording quality par ek real, noticeable effect hai, zero additional cost par.

**"Chaar categories" framing specific pedal ya amp models memorize karne se zyada durable knowledge kyun hai.** Specific gear production se bahar ho jaata hai, replace ho jaata hai, aur price mein enormously vary karta hai — lekin EQ, gain, time-based effects, aur modulation wo fundamental categories hain jinmein almost saare tone-shaping tools aate hain, brand, price, ya decade ki parwaah kiye bina. Ye wahi "underlying structure samjho, sirf specific instance nahi" principle hai jo ye course ne chords (Module 19 ke triads), scales (Module 22-23), aur technique (Module 25) par apply kiya, ab gear aur tone par apply hota hua.

**Gear ke baaki course ke relative actual role ke baare mein ek honest, direct note.** Modules 1-25 mein sikhaayi gayi har single technique, chord, scale, aur improvisation skill genuinely basic, inexpensive equipment par kaam karti hai. Gear ek already-developed sound ko refine aur enhance kar sakta hai, lekin ye kabhi fundamentals ka substitute nahi raha, aur abhi bhi nahi hai — ek message jo explicitly state karne layak hai, course mein itni late, jitna directly possible ho.`,

    examples: [
      {
        title: 'A zero-cost recording setup, ready to use today',
        titleHi: 'Ek zero-cost recording setup, aaj use karne ke liye ready',
        code: `Equipment: any smartphone.
Placement: 1-2 feet from the guitar's soundhole (acoustic) or amp
speaker (electric), not pressed directly against it.
Environment: any reasonably quiet room.

This setup is completely sufficient for Module 24's "record and
critically listen back" practice habit — no purchase required.`,
        output: 'This baseline setup is intentionally the simplest possible starting point — any upgrade beyond it (a dedicated microphone, an audio interface) is a genuine improvement but never a prerequisite for starting the practice habit itself.',
        explain:
          'Making the zero-cost baseline explicit and concrete removes any implicit barrier to actually starting Module 24\'s recording habit — the single most impactful habit that lesson recommended.',
        explainHi:
          'Zero-cost baseline ko explicit aur concrete banaana Module 24 ke recording habit ko actually shuru karne mein koi bhi implicit barrier hataata hai — us lesson ne recommend kiya sabse impactful habit.',
      },
    ],

    mistakes: [
      {
        wrong: 'Believing meaningful progress or good-sounding recordings require expensive gear first.',
        right: 'Start recording and practicing with whatever is already available (a smartphone), treating gear upgrades as a later refinement, not a prerequisite.',
        why: 'This belief is a common, genuine barrier that delays the high-value recording habit Module 24 recommended — removing it is worth stating explicitly rather than assuming it\'s obvious.',
        whyHi: 'Ye belief ek common, genuine barrier hai jo Module 24 ke recommend kiye hue high-value recording habit ko delay karta hai — ise explicitly state karna worth hai, obvious assume karne ke bajaye.',
      },
    ],

    realWorld: [
      {
        en: 'Countless widely-shared and professionally-regarded home recordings and demos were made on basic, inexpensive equipment — the actual determining factor was consistently the playing and the room, not the price of the gear.',
        hi: 'Countless widely-shared aur professionally-regarded home recordings aur demos basic, inexpensive equipment par banaayi gayi thin — actual determining factor consistently playing aur room tha, gear ki price nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'At what point does it actually make sense to invest in better recording gear or a pedal for tone shaping?',
        qHi: 'Kaunse point par better recording gear ya tone shaping ke liye ek pedal mein invest karna actually sense banaata hai?',
        a: 'Once the fundamentals from this course are solid enough that specific, identifiable limitations of basic gear (not skill) are the main thing holding a recording or sound back — at that point, an upgrade addresses a genuine, specific gap rather than being purchased on the assumption that gear alone improves playing.',
        aHi: 'Ek baar jab is course ke fundamentals itne solid ho jaayein ki basic gear ki specific, identifiable limitations (skill nahi) ek recording ya sound ko peeche rakhne wali main cheez hon — us point par, ek upgrade ek genuine, specific gap address karta hai, is assumption par purchase hone ke bajaye ki akela gear playing improve karta hai.',
      },
    ],

    exercises: [
      {
        task: 'Record yourself playing a short practice loop (as recommended in Module 24) using only a smartphone, at 1-2 feet distance. Listen back and identify one thing about the RECORDING setup itself (not your playing) you\'d adjust next time.',
        taskHi: 'Apne aap ko ek short practice loop bajaate hue record karo (jaisa Module 24 mein recommend kiya gaya), sirf ek smartphone use karke, 1-2 feet distance par. Wapas suno aur ek cheez identify karo RECORDING setup ke baare mein (apni playing nahi) jise tum next time adjust karoge.',
        hint: 'Common first findings: too close (distorted/boomy), too far (too quiet/roomy), or background noise not initially noticed while playing.',
        hintHi: 'Common pehli findings: bahut close (distorted/boomy), bahut door (too quiet/roomy), ya background noise jo bajaate waqt initially notice nahi hua.',
      },
    ],

    keyTakeaways: [
      'A smartphone microphone, placed 1-2 feet away in a quiet room, is a completely sufficient starting recording setup — no purchase required.',
      'Nearly all tone-shaping gear falls into four categories: EQ, gain/distortion, time-based effects, and modulation — understanding these outlasts any specific gear\'s lifespan.',
      'Every technique in this entire course works on basic, inexpensive equipment — gear refines an already-developed sound, it never substitutes for fundamentals.',
    ],
    keyTakeawaysHi: [
      'Ek smartphone microphone, ek quiet room mein 1-2 feet door rakha gaya, ek completely sufficient starting recording setup hai — koi purchase ki zaroorat nahi.',
      'Almost saara tone-shaping gear chaar categories mein aata hai: EQ, gain/distortion, time-based effects, aur modulation — inhe samajhna kisi bhi specific gear ke lifespan se zyada chalta hai.',
      'Is poore course ki har technique basic, inexpensive equipment par kaam karti hai — gear ek already-developed sound ko refine karta hai, ye kabhi fundamentals ka substitute nahi hota.',
    ],
  },

  /* ══════════════════════ Lesson 3 (FINAL LESSON) ══════════════════════ */
  {
    slug: 'where-to-go-next',
    title: 'Where to Go Next: A Long-Term Roadmap',
    titleHi: 'Aage Kahan Jaayein: Ek Long-Term Roadmap',
    description: 'The course closes, honestly, by naming what comes after it — and the three ideas that ran through every one of the last 26 modules.',
    descriptionHi: 'Course honestly close hota hai, ye naam dete hue ki iske baad kya aata hai — aur wo teen ideas jo pichhle 26 modules mein se har ek mein chale.',
    difficulty: 'MEDIUM',
    duration: 15,
    order: 3,

    analogy: {
      en: '**Graduating from a foundational course of study into a lifelong field, not finishing a fixed-length book.** Reaching the last page of a novel means the story is complete. Reaching the last lesson of this course means something different: the foundation is genuinely complete, but the field itself — music, this specific instrument, your own developing voice on it — keeps going for as long as you choose to keep playing.',
      hi: '**Ek foundational course of study se graduate hona ek lifelong field mein, ek fixed-length book khatam karna nahi.** Ek novel ke last page tak pahunchna matlab story complete hai. Is course ke last lesson tak pahunchna kuch alag means karta hai: foundation genuinely complete hai, lekin field khud — music, ye specific instrument, ispar tumhaari apni developing voice — jab tak tum bajaate rehne ka choose karo tab tak chalti rehti hai.',
    },

    simple: `**What this course genuinely completed, stated plainly:** a real noob-to-pro foundation — physical technique (Parts I-III), rhythm and repertoire (Parts IV-VI), the theory that explains why it all works (Part VII), improvisation (Part VIII), and advanced technique plus the practical toolkit (Part IX). This is complete, not partial.

**What was deliberately left for later, honestly named rather than hidden:** full chord-scale theory and jazz harmony, deep ear-training, sweep picking and tapping fluency (Module 25 named these explicitly), additional alternate tunings beyond drop D, sight-reading fluency beyond the basics (Module 26 Lesson 1), and — perhaps most importantly — playing regularly with other musicians, which teaches things no solo practice routine can.

**A concrete way to keep growing, using this course\'s own practice principles one final time:** pick ONE deferred topic at a time (not all of them at once — Module 1\'s "depth over breadth" principle, applied to your own ongoing learning), give it focused, dedicated practice time (Module 3\'s scheduling approach), and periodically revisit fundamentals from earlier in this course — Module 9\'s "slow is smooth, smooth is fast" principle applies just as much to review as it did to first learning.`,
    simpleHi: `**Ye course ne genuinely kya complete kiya, plainly stated:** ek real noob-to-pro foundation — physical technique (Parts I-III), rhythm aur repertoire (Parts IV-VI), theory jo explain karti hai ki sab kuch kyun kaam karta hai (Part VII), improvisation (Part VIII), aur advanced technique plus practical toolkit (Part IX). Ye complete hai, partial nahi.

**Kya deliberately baad ke liye chhoda gaya, honestly named, hidden nahi:** full chord-scale theory aur jazz harmony, deep ear-training, sweep picking aur tapping fluency (Module 25 ne inhe explicitly naam diya), drop D se aage additional alternate tunings, basics se aage sight-reading fluency (Module 26 Lesson 1), aur — shayad sabse important — doosre musicians ke saath regularly bajaana, jo kuch aisa sikhaata hai jo koi bhi solo practice routine nahi sikha sakta.

**Grow karte rehne ka ek concrete tareeka, is course ke apne practice principles ko ek final baar use karte hue:** ek time mein EK deferred topic pick karo (sab ek saath nahi — Module 1 ka "depth over breadth" principle, tumhaari apni ongoing learning par apply hota hua), use focused, dedicated practice time do (Module 3 ka scheduling approach), aur periodically is course mein pehle ke fundamentals revisit karo — Module 9 ka "slow is smooth, smooth is fast" principle review par utna hi apply hota hai jitna pehli baar seekhne par hua tha.`,

    content: `**The first throughline worth naming explicitly: understand the mechanism, don\'t just memorize the shape.** From Module 2\'s fret physics through the CAGED system (Module 21), pentatonic boxes (Module 22), and modes (Module 23), this course consistently chose to explain WHY a shape or pattern works rather than presenting it as an arbitrary fact to memorize. This isn\'t just a teaching style choice — it\'s what makes new, unfamiliar musical situations solvable later using tools already in hand, rather than requiring an external reference every time.

**The second throughline: verify claims against real data, don\'t just assert them.** Modules 18 onward repeatedly cross-checked theoretical claims against actual fretboard note math — and this course-writing process caught several genuine errors this way (Module 5\'s chord mix-up, Module 6\'s anchor-finger claims, Module 21\'s note-labeling slip, Module 23\'s Lydian formula and fret-number error), each one fixed specifically because it was checked rather than assumed. The same discipline — check your own claims against ground truth before trusting them — is worth carrying into your own playing and understanding, not just something this course did behind the scenes.

**The third throughline: honest scope, every time.** From Module 3\'s realistic practice-frequency guidance through Module 25\'s honest treatment of sweep picking and tapping to this very lesson\'s roadmap, this course consistently separated what it could genuinely teach from what requires longer, ongoing practice — never overclaiming instant mastery. That same honesty is the right way to evaluate your own progress from here: real skill, built consistently, at a realistic pace, is a genuinely sufficient and complete way to keep going. This course\'s job — a real, honest, complete foundation — is done. What you build on it from here is yours.`,
    contentHi: `**Pehla throughline jo explicitly naam dene layak hai: mechanism samjho, sirf shape memorize mat karo.** Module 2 ke fret physics se CAGED system (Module 21), pentatonic boxes (Module 22), aur modes (Module 23) tak, ye course consistently ye explain karna choose karta raha ki ek shape ya pattern WHY kaam karta hai, use memorize karne layak ek arbitrary fact ki tarah present karne ke bajaye. Ye sirf ek teaching style choice nahi hai — ye wahi hai jo naye, unfamiliar musical situations ko baad mein solvable banaata hai already haath mein maujood tools use karke, har baar ek external reference maangne ke bajaye.

**Doosra throughline: claims ko real data ke against verify karo, sirf assert mat karo.** Module 18 se aage baar baar theoretical claims ko actual fretboard note math ke against cross-check kiya gaya — aur is course-writing process ne is tareeke se kai genuine errors pakde (Module 5 ka chord mix-up, Module 6 ke anchor-finger claims, Module 21 ka note-labeling slip, Module 23 ka Lydian formula aur fret-number error), har ek specifically isliye fix hua kyunki use check kiya gaya, assume nahi. Wahi discipline — apne khud ke claims ko trust karne se pehle ground truth ke against check karo — apni khud ki playing aur understanding mein carry karne layak hai, sirf kuch aisa nahi jo ye course behind the scenes karta raha.

**Teesra throughline: har baar, honest scope.** Module 3 ki realistic practice-frequency guidance se Module 25 ke sweep picking aur tapping ke honest treatment se lekar isi lesson ke roadmap tak, ye course consistently ye separate karta raha ki wo genuinely kya sikha sakta hai us se jise longer, ongoing practice chahiye — kabhi instant mastery ka overclaim nahi kiya. Wahi honesty yahan se apni progress evaluate karne ka sahi tareeka hai: real skill, consistently build ki hui, ek realistic pace par, aage badhte rehne ka ek genuinely sufficient aur complete tareeka hai. Is course ka kaam — ek real, honest, complete foundation — ho chuka hai. Yahan se tum ispar jo banaate ho wo tumhaara hai.`,

    examples: [
      {
        title: 'A concrete next-6-months plan, built from this course\'s own practice principles',
        titleHi: 'Ek concrete next-6-months plan, is course ke apne practice principles se bana',
        code: `Month 1-2: Pick ONE deferred topic (e.g. ear training). Practice it
alongside regular review of Modules 1-26's fundamentals.

Month 3-4: Find at least one opportunity to play with another
musician, even informally -- a genuinely different skill from solo practice.

Month 5-6: Pick a SECOND deferred topic. Revisit and re-verify your
own understanding of an early theory module (e.g. Module 19) --
does it still make sense, calculated fresh, without looking it up?`,
        output: 'This is a template, not a prescription — the specific topics and timeline should flex to individual interest and available time, but the underlying shape (one focus at a time, regular review, real playing with others) is a genuinely sound structure borrowed directly from this course\'s own teaching approach.',
        explain:
          'Ending the entire course with a concrete, actionable plan rather than a vague "keep practicing" closes the noob-to-pro arc the way it opened — with specific, usable guidance rather than an abstract goal.',
        explainHi:
          'Poore course ko ek concrete, actionable plan ke saath khatam karna, ek vague "practice karte raho" ke bajaye, noob-to-pro arc ko usi tareeke se close karta hai jaise ye khula tha — specific, usable guidance ke saath, ek abstract goal ke bajaye.',
      },
    ],

    mistakes: [
      {
        wrong: 'Trying to tackle every deferred topic (ear training, jazz theory, sweep picking, new tunings) simultaneously right after finishing this course.',
        right: 'Pick one deferred topic at a time, giving it real, focused attention, the same depth-over-breadth principle this entire course has modeled.',
        why: 'Splitting focus across many new, substantial skills at once is a direct violation of the depth-over-breadth and isolation-before-integration principles this course used successfully throughout — the same failure mode, just applied to planning your future learning instead of a single practice session.',
        whyHi: 'Ek saath bahut saari nayi, substantial skills ke across focus split karna direct violation hai depth-over-breadth aur isolation-before-integration principles ka jo ye poora course successfully use karta raha — wahi failure mode, bas apni future learning plan karne par apply hoti hui, ek single practice session ke bajaye.',
      },
    ],

    realWorld: [
      {
        en: 'Professional musicians at every career stage describe their development as an ongoing series of focused, sequential learning phases (a period focused on theory, then a period focused on a new technique, then a period focused on ensemble playing) rather than trying to improve at everything simultaneously forever.',
        hi: 'Har career stage par professional musicians apne development ko focused, sequential learning phases ki ek ongoing series ki tarah describe karte hain (ek period theory par focused, phir ek period ek nayi technique par focused, phir ek period ensemble playing par focused), hamesha ek saath sab kuch improve karne ki koshish karne ke bajaye.',
      },
    ],

    interviewQA: [
      {
        q: 'Of everything deferred in this course, what\'s the single highest-value next step for someone who just finished all 26 modules?',
        qHi: 'Is course mein deferred sab kuch mein se, ek aise insaan ke liye jisne abhi 26 modules khatam kiye hain sabse highest-value next step kya hai?',
        a: 'Playing regularly with other musicians, even informally — it exposes gaps (timing under real pressure, listening while playing, adjusting on the fly) that no amount of solo practice, however well-structured, can fully substitute for, and it does so faster than almost any other single next step.',
        aHi: 'Regularly doosre musicians ke saath bajaana, informally bhi — ye un gaps ko expose karta hai (real pressure ke neeche timing, bajaate waqt sunna, on the fly adjust karna) jinke liye koi bhi amount of solo practice, chahe kitni bhi well-structured ho, poori tarah substitute nahi kar sakti, aur ye almost kisi bhi doosre single next step se faster aisa karta hai.',
      },
    ],

    exercises: [
      {
        task: 'Write down your own specific next-3-months plan, naming exactly one deferred topic from this lesson to focus on, one fundamental from earlier in the course to periodically revisit, and one concrete opportunity (even informal) to play with someone else.',
        taskHi: 'Apna khud ka specific next-3-months plan likho, is lesson se exactly ek deferred topic naam dete hue focus karne ke liye, course mein pehle se ek fundamental periodically revisit karne ke liye, aur kisi aur ke saath bajaane ka ek concrete opportunity (informal bhi).',
        hint: 'Be specific rather than general — "practice ear training" is vaguer and less actionable than "spend 10 minutes after each practice session identifying intervals by ear."',
        hintHi: 'General ke bajaye specific raho — "ear training practice karo" "har practice session ke baad 10 minutes intervals ko kaan se identify karne mein bitaao" se zyada vague aur kam actionable hai.',
      },
    ],

    keyTakeaways: [
      'This course completed a real, full noob-to-pro foundation — technique, rhythm, theory, improvisation, and practical advanced skills — and honestly named what comes after it (deep ear-training, jazz harmony, further technique fluency, and especially playing with others).',
      'Three throughlines ran through every module: understand the mechanism rather than memorize the shape, verify claims against real data rather than assert them, and honest scope over instant-mastery claims.',
      'Growth continues the same way this course built it: one focused topic at a time, regular review of fundamentals, and — most valuably — real playing with other musicians.',
    ],
    keyTakeawaysHi: [
      'Ye course ne ek real, poori noob-to-pro foundation complete ki — technique, rhythm, theory, improvisation, aur practical advanced skills — aur honestly naam diya ki iske baad kya aata hai (deep ear-training, jazz harmony, further technique fluency, aur especially doosron ke saath bajaana).',
      'Teen throughlines har module mein se guzre: mechanism samjho shape memorize karne ke bajaye, claims ko real data ke against verify karo assert karne ke bajaye, aur instant-mastery claims par honest scope.',
      'Growth wahi tareeke se continue hoti hai jaise is course ne use build kiya: ek time mein ek focused topic, fundamentals ka regular review, aur — sabse valuably — doosre musicians ke saath real playing.',
    ],
    guitarPractice: { earTraining: [{"string":0,"fret":0},{"string":1,"fret":0},{"string":2,"fret":0},{"string":0,"fret":5},{"string":0,"fret":8},{"string":3,"fret":5},{"string":3,"fret":7},{"string":5,"fret":0}] },
  },
];
