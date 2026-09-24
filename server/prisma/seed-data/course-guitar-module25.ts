/**
 * Guitar Course — Module 25: Advanced Techniques, lessons 1-3.
 * Opens Part IX (Beyond the Fundamentals), the course's final section.
 */

import type { CourseLesson } from './course-js-module1';
import { diagramPreviewHtml, fretboardMapSvg } from './guitar-diagrams';

export const GUITAR_MODULE_25: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'hammer-ons-pull-offs-slides',
    title: 'Hammer-ons, Pull-offs, and Slides: Connecting Notes Without Picking',
    titleHi: 'Hammer-ons, Pull-offs, Aur Slides: Bina Picking Notes Connect Karna',
    description: 'Three ways to sound a new note using only the fretting hand — the physical foundation of "legato," smooth-sounding playing.',
    descriptionHi: 'Sirf fretting hand use karke ek naya note sound karne ke teen tareeke — "legato," smooth-sounding playing ki physical foundation.',
    difficulty: 'HARD',
    duration: 20,
    order: 1,

    analogy: {
      en: '**Speaking words smoothly connected versus saying each one separately, with a pause.** Picking every single note creates natural separation between them, like pronouncing each word of a sentence individually. Hammer-ons, pull-offs, and slides let the fretting hand alone produce a new note, connecting it seamlessly to the one before it — smooth, flowing speech instead of separated words.',
      hi: '**Words ko smoothly connected bolna versus har ek ko separately, ek pause ke saath kehna.** Har single note ko pick karna unke beech natural separation create karta hai, ek sentence ke har word ko individually pronounce karne jaisa. Hammer-ons, pull-offs, aur slides akele fretting hand ko ek naya note produce karne dete hain, use pehle wale se seamlessly connect karte hue — smooth, flowing speech, separated words ke bajaye.',
    },

    simple: `**Hammer-on:** pick a note, then "hammer" a fretting finger down onto a HIGHER fret on the same string, hard and fast enough that the impact itself sounds the new note — no second pick needed.

**Pull-off:** the reverse. Start with a note already fretted, then pull that finger off the string (with a slight sideways flick, not a straight lift) to sound a LOWER note — either an open string, or another finger already fretting a lower note on the same string — again, no second pick.

**Slide:** pick a note, then slide the same fretting finger along the string to a new fret while keeping pressure applied, so the destination note sounds from the sliding motion itself rather than a fresh pick.

**Why all three exist as one lesson, not three separate topics:** all three do the exact same job — sounding a second note without picking again — just through three different physical motions. Once the underlying goal is clear, the three techniques feel like variations on one idea rather than three unrelated skills.`,
    simpleHi: `**Hammer-on:** ek note pick karo, phir ek fretting finger ko usi string par ek HIGHER fret par "hammer" karo, itni hard aur fast ki impact khud naya note sound kare — doosre pick ki zaroorat nahi.

**Pull-off:** reverse. Ek aisa note se shuru karo jo already fretted hai, phir us finger ko string se pull off karo (ek slight sideways flick ke saath, straight lift nahi) ek LOWER note sound karne ke liye — ya to ek open string, ya usi string par ek lower note fret karta hua koi doosra finger — phir se, doosre pick ki zaroorat nahi.

**Slide:** ek note pick karo, phir usi fretting finger ko string ke saath ek naye fret tak slide karo pressure apply rakhte hue, taaki destination note sliding motion se hi sound kare, ek fresh pick se nahi.

**Ye teeno ek lesson ki tarah kyun exist karte hain, teen separate topics nahi:** teeno exact same kaam karte hain — dobara pick kiye bina ek doosra note sound karna — bas teen alag physical motions ke through. Ek baar underlying goal clear ho jaaye, teeno techniques ek idea ke variations jaisa feel karte hain, teen unrelated skills jaisa nahi.`,

    content: `**Why hammer-ons and pull-offs require genuine finger STRENGTH and speed, connecting back to Module 3\'s finger exercises.** A weak or slow hammer-on produces a quiet, unclear note (or none at all) — the finger needs to strike with enough force and speed to make the string vibrate on its own, which is exactly the kind of finger independence and strength Module 3\'s warm-up exercises were building toward from the very start of this course, long before this specific application existed.

**Why a pull-off\'s "sideways flick" detail matters mechanically, not just stylistically.** Simply lifting a finger straight up off the string tends to produce a weak, muted result, because the string doesn\'t get enough of an active pluck from the release. The slight sideways motion mimics a pick\'s plucking action using the fretting finger itself — a small technical detail with a large effect on whether the technique actually works.

**An honest, practical note on where these three techniques show up immediately, without waiting for later lessons.** These aren\'t exclusively "advanced" techniques reserved for solos — a hammer-on or pull-off connecting two notes within an otherwise ordinary chord-based riff is extremely common in rhythm playing too. Module 26 Lesson 1\'s advanced-technique reference sheet will point back to exactly this lesson as a foundation for reading tab notation that marks these techniques explicitly.`,
    contentHi: `**Hammer-ons aur pull-offs ko genuine finger STRENGTH aur speed ki zaroorat kyun hoti hai, Module 3 ke finger exercises se wapas connect karte hue.** Ek weak ya slow hammer-on ek quiet, unclear note produce karta hai (ya bilkul nahi) — finger ko itni force aur speed se strike karna hai ki string apne aap vibrate kare, jo exactly wo kism ki finger independence aur strength hai jise Module 3 ke warm-up exercises is course ke bilkul shuru se build kar rahe the, is specific application ke exist karne se bahut pehle.

**Ek pull-off ka "sideways flick" detail mechanically kyun matter karta hai, sirf stylistically nahi.** Simply ek finger ko string se straight upar lift karna often ek weak, muted result produce karta hai, kyunki string ko release se kaafi active pluck nahi milta. Slight sideways motion ek pick ke plucking action ko fretting finger se hi mimic karta hai — ek chhota technical detail jiska bada effect hai is baat par ki technique actually kaam karti hai ya nahi.

**In teen techniques ke turant kahan dikhne ke baare mein ek honest, practical note, baad ke lessons ka wait kiye bina.** Ye exclusively "advanced" techniques nahi hain solos ke liye reserved — ek hammer-on ya pull-off jo ek otherwise ordinary chord-based riff ke andar do notes ko connect karta hai rhythm playing mein bhi extremely common hai. Module 26 Lesson 1 ki advanced-technique reference sheet exactly is lesson ki taraf wapas point karegi tab notation padhne ke liye jo in techniques ko explicitly mark karti hai.`,

    examples: [
      {
        title: 'A hammer-on and pull-off between two frets on the same string',
        titleHi: 'Usi string par do frets ke beech ek hammer-on aur pull-off',
        previewHeight: 300,
        code: `Hammer-on: pick low-E string fret 5 (A), then hammer finger onto
fret 7 (B) without picking again. Two notes, one pick.

Pull-off: start with fret 7 fretted (B), pick it, then pull off to
sound fret 5 (A) without a second pick — the reverse motion.`,
        preview: diagramPreviewHtml(
          fretboardMapSvg(8, [[0, 5], [0, 7]]),
          'Fret 5 (A) and fret 7 (B) on the low-E string — the same two notes, connected forward by a hammer-on or backward by a pull-off, using only one pick.',
        ),
        explain:
          'Using two already-familiar notes from Module 22\'s pentatonic Box 1 keeps the focus entirely on the new physical technique, rather than also asking you to learn new note positions at the same time.',
        explainHi:
          'Module 22 ke pentatonic Box1 se do already-familiar notes use karna focus ko poori tarah naye physical technique par rakhta hai, isi samay naye note positions bhi seekhne ko kehne ke bajaye.',
      },
    ],

    mistakes: [
      {
        wrong: 'Lifting a finger straight up for a pull-off, the same motion used to simply release a fretted note.',
        right: 'Add a slight sideways flick as the finger releases, actively plucking the string on the way off.',
        why: 'A straight lift produces a weak or silent result because the string isn\'t actively set into motion — the sideways flick is what makes a pull-off audible at all.',
        whyHi: 'Ek straight lift ek weak ya silent result produce karta hai kyunki string actively motion mein nahi set hoti — sideways flick hi hai jo ek pull-off ko bilkul audible banaata hai.',
      },
    ],

    realWorld: [
      {
        en: 'That smooth, "singing" quality in a well-played guitar melody, where notes flow into each other rather than sounding chopped and separate, is very often these three techniques doing the connecting work, largely unnoticed by a casual listener.',
        hi: 'Ek well-played guitar melody mein wo smooth, "singing" quality, jahan notes ek doosre mein flow karte hain chopped aur separate sound karne ke bajaye, bahut often ye teen techniques hain jo connecting ka kaam kar rahi hain, ek casual listener ke largely unnoticed.',
      },
    ],

    interviewQA: [
      {
        q: 'Do hammer-ons and pull-offs sound quieter than normally picked notes, or should they match in volume?',
        qHi: 'Kya hammer-ons aur pull-offs normally picked notes se quieter sound karte hain, ya unhe volume mein match karna chahiye?',
        a: 'With enough practiced finger strength and speed, they should be nearly indistinguishable in volume from a picked note — a noticeably quieter hammer-on or pull-off is usually a sign the technique needs more force and speed, not an inherent limitation of the technique itself.',
        aHi: 'Kaafi practiced finger strength aur speed ke saath, unhe ek picked note se volume mein nearly indistinguishable hona chahiye — ek noticeably quieter hammer-on ya pull-off usually is baat ka sign hai ki technique ko zyada force aur speed chahiye, technique ki apni koi inherent limitation nahi.',
      },
    ],

    exercises: [
      {
        task: 'Practice a hammer-on from fret 5 to fret 7 on the low-E string, then the reverse pull-off from fret 7 back to fret 5, aiming for both notes to sound equally clear and equally loud.',
        taskHi: 'Low-E string par fret5 se fret7 tak ek hammer-on practice karo, phir reverse pull-off fret7 se wapas fret5 tak, dono notes ko equally clear aur equally loud sound karwaane ka aim rakhte hue.',
        hint: 'If the second note sounds noticeably quieter, focus specifically on the speed and force of the hammering-down or flicking-off motion, not on anything else.',
        hintHi: 'Agar doosra note noticeably quieter sound kare, specifically hammering-down ya flicking-off motion ki speed aur force par focus karo, kisi aur cheez par nahi.',
      },
    ],

    keyTakeaways: [
      'Hammer-ons, pull-offs, and slides all connect two notes using only the fretting hand — no second pick needed.',
      'A pull-off needs an active sideways flick, not a straight lift, to actually sound the lower note clearly.',
      'These techniques appear constantly in ordinary rhythm playing, not only in solos — they are a core physical skill, not an exotic add-on.',
    ],
    keyTakeawaysHi: [
      'Hammer-ons, pull-offs, aur slides teeno sirf fretting hand use karke do notes ko connect karte hain — doosre pick ki zaroorat nahi.',
      'Ek pull-off ko lower note ko actually clearly sound karwaane ke liye ek active sideways flick chahiye, straight lift nahi.',
      'Ye techniques ordinary rhythm playing mein constantly appear hoti hain, sirf solos mein nahi — ye ek core physical skill hain, ek exotic add-on nahi.',
    ],
    guitarPractice: { sequences: [{"title":"Hammer-on / pull-off, fret 5 to fret 7","titleHi":"Hammer-on / pull-off, fret 5 se fret 7","defaultBpm":70,"notes":[{"string":0,"fret":5,"beat":0},{"string":0,"fret":7,"beat":1}]}] },
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'string-bending',
    title: 'String Bending: The Technique Behind the Blue Note',
    titleHi: 'String Bending: Blue Note Ke Peeche Ki Technique',
    description: 'Physically raising a string\'s pitch without moving frets — and a real, checkable way to know if a bend hit its target.',
    descriptionHi: 'Frets move kiye bina ek string ki pitch ko physically raise karna — aur ek real, checkable tareeka ye jaanne ka ki ek bend apna target hit hua ya nahi.',
    difficulty: 'HARD',
    duration: 20,
    order: 2,

    analogy: {
      en: '**Stretching a rubber band to raise the pitch of a hum, without changing where you\'re holding it.** Pushing or pulling a fretted string sideways increases its tension, raising its pitch, the same way stretching a rubber band tighter raises the pitch of a sound made by plucking it — the fretting position (where you\'re "holding" it) doesn\'t change, only the tension does.',
      hi: '**Ek rubber band ko stretch karna ek hum ki pitch raise karne ke liye, use kahan pakda hai ye badle bina.** Ek fretted string ko sideways push ya pull karna uski tension increase karta hai, uski pitch raise karte hue, waisi hi jaise ek rubber band ko tighter stretch karna use pluck karke banaayi gayi sound ki pitch raise karta hai — fretting position (jahan tumne use "pakda" hai) change nahi hoti, sirf tension hoti hai.',
    },

    simple: `**The mechanism:** fret a note normally, then push or pull the string sideways (across the fretboard, not along its length) while it\'s still ringing. Increased tension raises the pitch — the fret stays the same, only the string\'s tension changes.

**The two most common bend sizes, in Module 19\'s interval language:** a half-step bend raises the pitch by 1 semitone; a whole-step bend raises it by 2 semitones. These aren\'t arbitrary amounts — they\'re named for the exact same intervals Module 19 already taught.

**A genuinely useful, checkable technique for hitting a bend accurately:** before bending, play the note you\'re bending TOWARD by fretting it normally (for a whole-step bend, that\'s 2 frets higher on the same string). Listen to and remember that pitch. Then bend the original note up and check whether it matches. This turns "does my bend sound right?" from a vague feeling into a direct, comparable pitch-matching exercise.

**Connecting directly back to Module 22\'s blue note:** the blue note (the flat 5th) is very commonly approached by bending UP into it from the note just below, rather than fretting it directly — exactly the technique Module 22 Lesson 3 flagged as commonly paired with that note.`,
    simpleHi: `**Mechanism:** ek note normally fret karo, phir string ko sideways push ya pull karo (fretboard ke across, uski length ke along nahi) jabki wo abhi bhi ring kar rahi ho. Increased tension pitch raise karti hai — fret same rehti hai, sirf string ki tension change hoti hai.

**Do sabse common bend sizes, Module 19 ki interval language mein:** ek half-step bend pitch ko 1 semitone se raise karta hai; ek whole-step bend use 2 semitones se raise karta hai. Ye arbitrary amounts nahi hain — inka naam exact same intervals par hai jo Module 19 ne already sikhaaye the.

**Ek genuinely useful, checkable technique ek bend ko accurately hit karne ke liye:** bend karne se pehle, us note ko bajaao jis TARAF tum bend kar rahe ho use normally fret karke (ek whole-step bend ke liye, ye usi string par 2 frets upar hai). Us pitch ko suno aur yaad rakho. Phir original note ko bend up karo aur check karo ki kya ye match karta hai. Ye "kya mera bend sahi sound karta hai?" ko ek vague feeling se ek direct, comparable pitch-matching exercise mein badal deta hai.

**Directly Module 22 ke blue note se wapas connect karte hue:** blue note (flat 5th) bahut commonly usse neeche wale note se bend UP karke approach kiya jaata hai, directly fret karne ke bajaye — exactly wo technique jo Module 22 Lesson 3 ne us note ke saath commonly paired hone ki tarah flag ki thi.`,

    content: `**Why the "check against the fretted target note" method is genuinely valuable, not just a beginner\'s crutch.** Bending to the wrong pitch (overbending or underbending) is one of the most common and most noticeable mistakes in guitar playing — an out-of-tune bend is immediately audible even to untrained ears. Checking against a fretted reference note removes the guesswork entirely, turning pitch accuracy into something directly verifiable rather than something to develop purely by feel.

**Why bending requires meaningfully different physical setup than fretting alone, connecting to Module 3\'s hand-position principles.** Effective bending typically involves support from multiple fingers (often the fretting finger reinforced by the fingers behind it) and a slight rotation of the wrist and forearm, rather than isolated finger strength alone — a different physical coordination than the single-finger accuracy Module 3-9 focused on, extending rather than replacing what came before.

**An honest, direct connection to why this lesson exists precisely here, after Modules 22-24.** Bending is most commonly used exactly where Module 22-24\'s pentatonic and blues-scale material lives — soloing and improvisation. Placing this lesson here, rather than earlier, means the technique arrives exactly when its main musical application already makes sense, rather than being taught in a vacuum.`,
    contentHi: `**"Fretted target note ke against check karo" method genuinely valuable kyun hai, sirf ek beginner ki crutch nahi.** Galat pitch par bend karna (overbending ya underbending) guitar playing mein sabse common aur sabse noticeable mistakes mein se ek hai — ek out-of-tune bend untrained ears ko bhi immediately audible hota hai. Ek fretted reference note ke against check karna guesswork ko poori tarah hata deta hai, pitch accuracy ko kuch aisa banaata hai jo directly verifiable hai, purely feel se develop karne wali cheez ke bajaye.

**Bending ko sirf fretting se meaningfully different physical setup ki zaroorat kyun hoti hai, Module 3 ke hand-position principles se connect karte hue.** Effective bending typically multiple fingers se support involve karta hai (often fretting finger jise uske peeche ke fingers reinforce karte hain) aur wrist aur forearm ka ek slight rotation, sirf isolated finger strength ke bajaye — Module 3-9 ne jis single-finger accuracy par focus kiya tha us se ek different physical coordination, jo pehle aaye hue ko replace karne ke bajaye extend karta hai.

**Ye lesson precisely yahan kyun exist karta hai, Modules 22-24 ke baad, iske liye ek honest, direct connection.** Bending sabse commonly exactly wahan use hota hai jahan Module 22-24 ka pentatonic aur blues-scale material rehta hai — soloing aur improvisation. Is lesson ko yahan rakhna, pehle ke bajaye, matlab hai technique exactly tab aati hai jab uska main musical application already sense banaata hai, ek vacuum mein sikhaaye jaane ke bajaye.`,

    examples: [
      {
        title: 'Checking a whole-step bend against its fretted target',
        titleHi: 'Ek whole-step bend ko uske fretted target ke against check karna',
        previewHeight: 300,
        code: `1. Fret and play G-string fret 7 (D) — this is your bend's TARGET pitch. Listen and remember it.
2. Fret G-string fret 5 (C) normally and pick it.
3. Bend that same fret-5 note up by a whole step (2 semitones).
4. Compare: does the bent pitch match the fret-7 target from step 1?`,
        preview: diagramPreviewHtml(
          fretboardMapSvg(8, [[3, 5], [3, 7]]),
          'G-string frets 5 (C, the note you bend FROM) and 7 (D, the pitch you\'re bending TO) — play fret 7 first to memorize the target before attempting the bend.',
        ),
        explain:
          'This method turns bend accuracy from an abstract feeling into a direct comparison against a note you can objectively verify with a normal fretted pitch, using the exact same G-string positions Module 21\'s CAGED lesson already made familiar.',
        explainHi:
          'Ye method bend accuracy ko ek abstract feeling se ek direct comparison mein badal deta hai ek aise note ke against jise tum ek normal fretted pitch se objectively verify kar sakte ho, exact same G-string positions use karte hue jo Module 21 ke CAGED lesson ne already familiar banaayi thin.',
      },
    ],

    mistakes: [
      {
        wrong: 'Bending purely by feel, without ever checking the resulting pitch against a reference note.',
        right: 'Regularly check a bend\'s target pitch against the equivalent fretted note, especially while first learning a new bend size.',
        why: 'Pitch inaccuracy in bending is common even among players with otherwise solid technique, precisely because there\'s no fret to mechanically guarantee the correct pitch the way normal fretting does — active checking is what closes that gap.',
        whyHi: 'Bending mein pitch inaccuracy common hai un players mein bhi jinki otherwise solid technique hai, precisely isliye kyunki koi fret nahi hai jo mechanically correct pitch guarantee kare jaise normal fretting karta hai — active checking hi hai jo us gap ko close karta hai.',
      },
    ],

    realWorld: [
      {
        en: 'The expressive, vocal-like quality of many iconic guitar solos comes substantially from precisely controlled bends — a technique that, done accurately, can make a guitar genuinely sound like it\'s "singing" a pitch rather than just landing on it.',
        hi: 'Bahut saare iconic guitar solos ki expressive, vocal-like quality substantially precisely controlled bends se aati hai — ek technique jo, accurately ki gayi, ek guitar ko genuinely aisa sound karwa sakti hai jaise wo ek pitch "gaa" rahi ho, sirf uspar land karne ke bajaye.',
      },
    ],

    interviewQA: [
      {
        q: 'Why do half-step and whole-step bends specifically get named after Module 19\'s intervals, rather than having their own separate naming system?',
        qHi: 'Half-step aur whole-step bends specifically Module 19 ke intervals ke naam par kyun named hain, apna alag separate naming system rakhne ke bajaye?',
        a: 'Because a bend genuinely IS the same interval, physically produced by tension instead of by moving to a different fret — there\'s no need for separate terminology since it\'s the exact same pitch-distance concept applied through a different physical mechanism.',
        aHi: 'Kyunki ek bend genuinely WAHI interval hai, physically tension se produce kiya gaya ek alag fret par move karne ke bajaye — separate terminology ki zaroorat nahi hai kyunki ye exact same pitch-distance concept hai ek alag physical mechanism se apply hua.',
      },
    ],

    exercises: [
      {
        task: 'Using G-string frets 5 and 7, practice the full check described in this lesson\'s example: play fret 7 first, remember it, then bend fret 5 up a whole step and compare. Repeat until the two consistently match.',
        taskHi: 'G-string frets 5 aur 7 use karke, is lesson ke example mein describe kiya hua poora check practice karo: pehle fret7 bajaao, use yaad rakho, phir fret5 ko ek whole step upar bend karo aur compare karo. Repeat karo jab tak dono consistently match na karein.',
        hint: 'It\'s normal for early attempts to fall short of the target (underbending) — focus on gradually increasing bend distance rather than forcing it in one attempt.',
        hintHi: 'Early attempts ka target se kam rehna (underbending) normal hai — ek attempt mein force karne ke bajaye gradually bend distance increase karne par focus karo.',
      },
    ],

    keyTakeaways: [
      'Bending raises a fretted note\'s pitch through added string tension, not through changing frets — a half-step bend = +1 semitone, a whole-step bend = +2 semitones (Module 19\'s intervals).',
      'Check bend accuracy by comparing against the equivalent fretted note first — a direct, verifiable method rather than relying purely on feel.',
      'Bending is the technique most commonly used to approach Module 22\'s blue note, connecting directly to this course\'s improvisation material.',
    ],
    keyTakeawaysHi: [
      'Bending ek fretted note ki pitch ko added string tension ke through raise karta hai, frets change karke nahi — ek half-step bend = +1 semitone, ek whole-step bend = +2 semitones (Module 19 ke intervals).',
      'Bend accuracy check karo pehle equivalent fretted note ke against compare karke — purely feel par rely karne ke bajaye ek direct, verifiable method.',
      'Bending wo technique hai jo sabse commonly Module 22 ke blue note ko approach karne ke liye use hoti hai, directly is course ke improvisation material se connect karte hue.',
    ],
    guitarPractice: { sequences: [{"title":"Bend target check — fret 5 vs fret 7 (G string)","titleHi":"Bend target check — fret 5 vs fret 7 (G string)","defaultBpm":60,"notes":[{"string":3,"fret":5,"beat":0},{"string":3,"fret":7,"beat":1}]}] },
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'modern-techniques-and-alternate-tunings',
    title: 'A Look at Modern Techniques and Alternate Tunings',
    titleHi: 'Modern Techniques Aur Alternate Tunings Par Ek Look',
    description: 'Sweep picking, tapping, and drop D — honestly scoped as what they are and why they exist, not full mastery.',
    descriptionHi: 'Sweep picking, tapping, aur drop D — honestly scoped ki wo kya hain aur kyun exist karte hain, full mastery nahi.',
    difficulty: 'HARD',
    duration: 15,
    order: 3,

    analogy: {
      en: '**A tour guide pointing out neighborhoods you haven\'t explored yet, rather than a map that pretends the city ends here.** This lesson\'s job isn\'t to make you fluent in sweep picking, tapping, or alternate tunings — it\'s to make sure you know these neighborhoods exist, roughly what they\'re for, and have one genuinely concrete, practical entry point (drop D) to actually start exploring.',
      hi: '**Ek tour guide jo un neighborhoods point out karta hai jo tumne abhi tak explore nahi kiye, ek map ke bajaye jo pretend kare ki city yahin khatam ho jaati hai.** Is lesson ka kaam tumhe sweep picking, tapping, ya alternate tunings mein fluent banana nahi hai — ye confirm karna hai ki tumhe pata ho ki ye neighborhoods exist karte hain, roughly wo kis liye hain, aur ek genuinely concrete, practical entry point (drop D) ho actually explore karna shuru karne ke liye.',
    },

    simple: `**Sweep picking, briefly:** a picking technique where the pick moves in one continuous, brushing motion across several strings in the same direction, each string fretted for a single note of an arpeggio — producing fast, cascading note runs. Genuinely difficult to execute cleanly; a dedicated skill built over extended, focused practice beyond this course\'s scope.

**Tapping, briefly:** using a picking-hand finger to fret notes directly on the fretboard (essentially "hammering on" with the hand that normally only picks), letting a single player cover a wider pitch range or faster passages than fretting-hand-only technique allows. Also a dedicated, separately-developed skill.

**Drop D tuning — the one alternate tuning genuinely worth trying right now:** lower only the low-E string by a whole step (Module 19\'s interval) to D, leaving all 5 other strings at standard tuning. This single change means the bottom 3 strings, played open, form a D5 power chord (Module 16) — and, more usefully, barring all 3 with ONE finger at any fret produces a movable power chord, replacing the 2-3 finger reach Module 16\'s standard-tuning power chords required.

**An honest scope statement:** this lesson deliberately gives you awareness and one practical tool (drop D), not fluency in sweep picking or tapping — those remain genuine, substantial next steps for whenever you choose to pursue them.`,
    simpleHi: `**Sweep picking, briefly:** ek picking technique jahan pick ek continuous, brushing motion mein kai strings ke across same direction mein move karta hai, har string ek arpeggio ke single note ke liye fretted — fast, cascading note runs produce karte hue. Cleanly execute karna genuinely difficult hai; ek dedicated skill jo extended, focused practice se build hoti hai is course ke scope se pare.

**Tapping, briefly:** picking-hand ke ek finger ko fretboard par directly notes fret karne ke liye use karna (essentially us hand se "hammering on" jo normally sirf pick karta hai), ek single player ko fretting-hand-only technique se zyada wide pitch range ya faster passages cover karne dete hue. Ye bhi ek dedicated, separately-developed skill hai.

**Drop D tuning — ek alternate tuning jo abhi try karne layak genuinely hai:** sirf low-E string ko ek whole step (Module 19 ka interval) se D tak lower karo, baaki 5 strings ko standard tuning par chhodte hue. Ye ek change matlab hai ki neeche ki 3 strings, open bajaayi hui, ek D5 power chord banaati hain (Module 16) — aur, zyada usefully, in teeno ko kisi bhi fret par EK finger se barr karna ek movable power chord produce karta hai, us 2-3 finger reach ko replace karte hue jo Module 16 ke standard-tuning power chords maangte the.

**Ek honest scope statement:** ye lesson deliberately tumhe awareness aur ek practical tool (drop D) deta hai, sweep picking ya tapping mein fluency nahi — wo genuine, substantial next steps rehte hain jab bhi tum unhe pursue karne ka choose karo.`,

    content: `**Why drop D\'s "one finger, any fret" power chord genuinely works, verified rather than just asserted.** In drop D, the low string (D), the A string (unchanged, A), and the D string (unchanged, D) are related by exactly the same intervals as Module 16\'s original power chord shape (root, perfect 5th, root octave) — but because the low string is now ALSO a D, barring straight across all three at any single fret preserves those exact relationships automatically, at every position on the neck simultaneously. This is a direct, checkable consequence of the interval math, not a coincidence.

**Why sweep picking and tapping are appropriately left at "awareness" level rather than taught in depth here.** Both are physically demanding techniques whose PRIMARY difficulty is in extremely precise timing and motion control, refined over dedicated practice specifically targeting them — fundamentally different from theory-heavy topics (like Modules 19-23) that this course can meaningfully teach through explanation and understanding. Naming them honestly, with a correct general understanding of what they are, is more useful than a shallow, incomplete attempt at teaching the physical technique itself.

**A closing, honest note on Module 25 and this course\'s approach to "advanced" content overall.** Consistent with this course\'s promise from Module 1 (real, usable techniques over any content that just sounds impressive), this module gave genuinely learnable techniques (hammer-ons, pull-offs, slides, bends, drop D) full treatment, while being equally honest about which techniques (sweep picking, tapping) need a level of dedicated focus beyond a single lesson\'s scope. Module 26, the course\'s final module, closes with standard notation basics, recording, gear, and a long-term roadmap for continuing to grow past this point.`,
    contentHi: `**Drop D ka "ek finger, kisi bhi fret" power chord genuinely kyun kaam karta hai, verified, sirf asserted nahi.** Drop D mein, low string (D), A string (unchanged, A), aur D string (unchanged, D) exactly wahi intervals se related hain jaise Module 16 ka original power chord shape (root, perfect 5th, root octave) — lekin kyunki low string ab BHI ek D hai, kisi bhi single fret par teeno ke across straight barr karna un exact relationships ko automatically preserve karta hai, neck ki har position par simultaneously. Ye interval math ka ek direct, checkable consequence hai, coincidence nahi.

**Sweep picking aur tapping appropriately "awareness" level par kyun chhode gaye hain, yahan depth mein sikhaaye jaane ke bajaye.** Dono physically demanding techniques hain jinki PRIMARY difficulty extremely precise timing aur motion control mein hai, dedicated practice se refine hoti hui jo specifically unhe target karti hai — theory-heavy topics (jaise Modules 19-23) se fundamentally different jo ye course explanation aur understanding se meaningfully sikha sakta hai. Unhe honestly naam dena, ki wo kya hain iski ek correct general understanding ke saath, ek shallow, incomplete attempt se zyada useful hai physical technique khud sikhaane ka.

**Module 25 aur is course ke "advanced" content ke overall approach par ek closing, honest note.** Is course ke Module 1 ke promise ke consistent (real, usable techniques kisi bhi content se zyada jo bas impressive sound karta hai), is module ne genuinely learnable techniques (hammer-ons, pull-offs, slides, bends, drop D) ko full treatment di, equally honest rehte hue ki kaunsi techniques (sweep picking, tapping) ko ek single lesson ke scope se pare dedicated focus ki zaroorat hai. Module 26, is course ka final module, standard notation basics, recording, gear, aur is point se aage grow karte rehne ke liye ek long-term roadmap ke saath close hota hai.`,

    examples: [
      {
        title: 'Drop D\'s bottom three strings, verified as a power chord shape',
        titleHi: 'Drop D ki neeche ki teen strings, ek power chord shape ki tarah verified',
        code: `Standard tuning, open low-E, A, D strings: E - A - D (not a power chord).

Drop D tuning, open low string, A, D strings: D - A - D.
D (root) - A (perfect 5th, D+7 semitones) - D (root, octave).
That's a D5 power chord, from 3 open strings, zero fretting.

Bar all 3 at fret 2 instead: E - B - E -- an E5 power chord,
using the exact same one-finger shape.`,
        output: 'Note: this course\'s fretboard diagrams are drawn for standard tuning, so a diagram here would mislabel the retuned low string as "E" instead of "D" — this example is intentionally text-only to stay accurate. Try it directly on a real, retuned guitar instead.',
        explain:
          'Showing the open-string version first, before any fretting, makes the underlying interval relationship (root-5th-octave) checkable on its own, before adding the extra idea of barring across a fret.',
        explainHi:
          'Kisi bhi fretting se pehle open-string version pehle dikhaana underlying interval relationship (root-5th-octave) ko apne aap mein checkable banata hai, ek fret ke across barring ka extra idea add karne se pehle.',
      },
    ],

    mistakes: [
      {
        wrong: 'Assuming alternate tunings and advanced techniques like tapping or sweep picking are all roughly equally accessible to try casually.',
        right: 'Recognize drop D as a genuinely easy, low-risk entry point, while treating sweep picking and tapping as substantial, dedicated skills requiring their own focused practice track.',
        why: 'Conflating a simple, high-payoff change (drop D) with genuinely demanding techniques sets unrealistic expectations and risks frustration when the harder techniques don\'t come as quickly.',
        whyHi: 'Ek simple, high-payoff change (drop D) ko genuinely demanding techniques ke saath conflate karna unrealistic expectations set karta hai aur frustration ka risk banaata hai jab harder techniques utni jaldi nahi aatin.',
      },
    ],

    realWorld: [
      {
        en: 'Entire genres (much of hard rock and metal, in particular) are built substantially around drop D and its relatives specifically because of the one-finger power chord efficiency this lesson demonstrated — it\'s a genuinely load-bearing practical technique, not a novelty.',
        hi: 'Poore genres (khaas taur par hard rock aur metal ka bahut saara hissa) substantially drop D aur uske relatives ke around bane hain specifically is one-finger power chord efficiency ki wajah se jo is lesson ne demonstrate ki — ye ek genuinely load-bearing practical technique hai, ek novelty nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'If I retune to drop D, do all the open chords and CAGED shapes from earlier in this course stop working?',
        qHi: 'Agar main drop D mein retune karoon, kya is course mein pehle ke saare open chords aur CAGED shapes kaam karna band kar dete hain?',
        a: 'Any shape that uses the low-E string will sound different (since that string\'s pitch changed), but everything on the other 5 strings is completely unaffected — many players simply avoid the low-E string for standard-tuning shapes while in drop D, or learn small adjustments for the shapes that do use it.',
        aHi: 'Koi bhi shape jo low-E string use karti hai alag sound karegi (kyunki us string ki pitch change ho gayi), lekin baaki 5 strings par sab kuch completely unaffected hai — bahut saare players drop D mein hote hue standard-tuning shapes ke liye simply low-E string avoid kar dete hain, ya un shapes ke liye chhote adjustments seekh lete hain jo ise use karti hain.',
      },
    ],

    exercises: [
      {
        task: 'Retune your low-E string down a whole step to D (using a tuner). Play the open bottom-3-strings power chord, then bar all 3 at fret 2 and fret 5, confirming each still sounds like a clean power chord.',
        taskHi: 'Apni low-E string ko ek whole step neeche D tak retune karo (ek tuner use karke). Open bottom-3-strings power chord bajaao, phir teeno ko fret2 aur fret5 par bar karo, confirm karte hue ki har ek abhi bhi ek clean power chord jaisa sound karta hai.',
        hint: 'Remember to retune back to standard tuning afterward if you plan to continue with the rest of this course\'s standard-tuning content.',
        hintHi: 'Baad mein wapas standard tuning mein retune karna yaad rakho agar tum is course ke baaki standard-tuning content ke saath continue karne ka plan bana rahe ho.',
      },
    ],

    keyTakeaways: [
      'Sweep picking and tapping are genuinely powerful but demanding techniques, appropriately scoped here as "know they exist and roughly how," not full instruction.',
      'Drop D tuning (low-E lowered a whole step) is a genuinely easy, high-payoff entry point: it turns the bottom 3 strings into a one-finger movable power chord shape at any fret.',
      'This module closes Part IX\'s technique arc honestly — real depth where the course can meaningfully teach it, honest scope-setting where a skill needs dedicated practice beyond any single lesson.',
    ],
    keyTakeawaysHi: [
      'Sweep picking aur tapping genuinely powerful lekin demanding techniques hain, yahan appropriately scoped "jaano ki wo exist karte hain aur roughly kaise," full instruction nahi.',
      'Drop D tuning (low-E ek whole step lowered) ek genuinely easy, high-payoff entry point hai: ye neeche ki 3 strings ko kisi bhi fret par ek-finger movable power chord shape mein badal deta hai.',
      'Ye module Part IX ke technique arc ko honestly close karta hai — real depth jahan course meaningfully sikha sakta hai, honest scope-setting jahan ek skill ko kisi bhi single lesson se pare dedicated practice chahiye.',
    ],
  },
];
