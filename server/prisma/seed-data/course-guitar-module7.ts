/**
 * Guitar Course — Module 7: Your Strumming Hand, lessons 1-3.
 *
 * Lesson 1: Wrist vs. arm motion — where strumming power actually comes
 *           from, and why the common beginner instinct is backwards.
 * Lesson 2: Pick angle and attack — the difference between a clean strum
 *           and a scratchy one.
 * Lesson 3: Muting unwanted strings with the strumming hand — a second,
 *           complementary muting technique to Module 5's fretting-hand mutes.
 */

import type { CourseLesson } from './course-js-module1';
import { diagramPreviewHtml, strumPatternSvg } from './guitar-diagrams';

export const GUITAR_MODULE_7: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'wrist-vs-arm-motion',
    title: 'Wrist vs. Arm Motion — Where Strumming Power Comes From',
    titleHi: 'Wrist vs Arm Motion — Strumming Power Kahan Se Aati Hai',
    description: 'The single biggest strumming-hand habit correction most beginners need, and why the instinct to "swing from the shoulder" is backwards.',
    descriptionHi: 'Sabse bada strumming-hand habit correction jo zyadatar beginners ko chahiye, aur "shoulder se swing karo" wala instinct backwards kyun hai.',
    difficulty: 'EASY',
    duration: 15,
    order: 1,

    analogy: {
      en: '**Flicking water off your fingers, not waving your whole arm.** Strumming motion should come from a relaxed wrist pivot, the same small, quick motion as flicking water droplets off your fingertips — not a big shoulder-driven swing like waving at someone across a room. The wrist is fast and precise; the whole arm is slow and clumsy for this specific job.',
      hi: '**Apni fingers se paani jhaadna, poora arm hilana nahi.** Strumming motion ek relaxed wrist pivot se aani chahiye, wahi small, quick motion jaisa fingertips se paani ki drops jhaadna — kisi ko room ke across wave karne jaisa ek bada shoulder-driven swing nahi. Wrist is specific job ke liye fast aur precise hai; poora arm slow aur clumsy hai.',
    },

    simple: `**The correction most beginners need:** strumming motion comes primarily from the WRIST pivoting, with the forearm staying relatively still and relaxed. The whole-arm swing that feels natural at first is actually working against you.

**Quick self-check:** hold your strumming arm loosely, elbow relaxed near your side (not flapping outward). If your elbow is moving a large, visible distance with every strum, you're arm-driving. If mostly your wrist and hand rotate while your forearm stays roughly still, that's the target motion.

**Why the instinct is backwards:** a bigger motion FEELS more powerful and controlled, but it's actually slower to execute repeatedly, harder to keep consistent in timing, and more tiring to sustain — the opposite of what you want for something you'll do hundreds of times per song.`,
    simpleHi: `**Correction jo zyadatar beginners ko chahiye:** strumming motion primarily WRIST pivot se aati hai, forearm relatively still aur relaxed rehte hue. Whole-arm swing jo shuru mein natural feel karta hai actually tumhare against kaam karta hai.

**Quick self-check:** apna strumming arm loosely hold karo, elbow relaxed apni side ke paas (outward flap nahi karta). Agar tumhari elbow har strum ke saath ek large, visible distance move kar rahi hai, tum arm-driving kar rahe ho. Agar mostly tumhari wrist aur hand rotate karte hain jabki forearm roughly still rehta hai, wahi target motion hai.

**Instinct backwards kyun hai:** ek bada motion zyada powerful aur controlled FEEL karta hai, lekin ye actually repeatedly execute karne mein slower hai, timing mein consistent rakhna harder hai, aur sustain karna zyada tiring hai — us cheez ka ulta jo tum chahte ho ek aise kaam ke liye jo tum ek song mein saikdon baar karoge.`,

    content: `**Why wrist motion wins on every metric that matters for strumming.** Speed: a wrist pivot covers its short arc much faster than an arm swing covers its longer one, purely due to the physics of a shorter lever arm. Consistency: a small, repeatable wrist motion is mechanically easier to keep identical strum after strum than a large arm motion, which has more room for variation. Endurance: a relaxed wrist motion uses small muscles suited to repetitive fine motion, while sustained arm swinging fatigues larger muscles not really built for that kind of repetition.

**This doesn't mean the arm does nothing.** The forearm provides overall positioning and a small amount of supporting motion — it's not rigidly frozen. The correction is about where the PRIMARY motion originates, not eliminating all arm involvement entirely.

**A genuinely common failure mode: tension.** Beginners correcting toward wrist motion sometimes overcorrect into a stiff, tense wrist, which defeats the purpose just as much as arm-driving did. The wrist should stay loose and relaxed throughout — tension anywhere in the chain (shoulder, elbow, wrist) slows you down and tires you out faster.`,
    contentHi: `**Wrist motion strumming ke liye har matter karne wale metric par kyun jeetta hai.** Speed: ek wrist pivot apni short arc ko ek arm swing ki longer arc se kahin zyada fast cover karta hai, purely ek shorter lever arm ki physics ki wajah se. Consistency: ek small, repeatable wrist motion ko strum after strum identical rakhna mechanically ek large arm motion se easier hai, jismein variation ke liye zyada room hai. Endurance: ek relaxed wrist motion chhoti muscles use karta hai jo repetitive fine motion ke liye suited hain, jabki sustained arm swinging badi muscles ko fatigue karta hai jo us tarah ki repetition ke liye really nahi bani.

**Iska matlab ye nahi ki arm kuch nahi karta.** Forearm overall positioning aur thodi si supporting motion provide karta hai — ye rigidly frozen nahi hai. Correction ye hai ki PRIMARY motion kahan se originate hoti hai, poori tarah arm involvement eliminate karna nahi.

**Ek genuinely common failure mode: tension.** Wrist motion ki taraf correct karte hue beginners kabhi kabhi ek stiff, tense wrist mein overcorrect kar dete hain, jo purpose ko utna hi defeat karta hai jitna arm-driving karta tha. Wrist poori der loose aur relaxed rehni chahiye — chain mein kahin bhi tension (shoulder, elbow, wrist) tumhe slow karti hai aur jaldi thakaati hai.`,

    examples: [
      {
        title: 'The self-check drill',
        titleHi: 'Self-check drill',
        code: `1. Rest strumming-hand elbow loosely near your side.
2. Strum an open chord (any chord, doesn't matter which) 10 times slowly.
3. Watch/feel: is the elbow moving a large, visible distance? Or mostly the wrist?
4. If elbow-driven, consciously reduce arm swing and let the wrist do more of the work.
5. Repeat, checking again after a few tries.`,
        explain:
          "This kind of deliberate, observed self-check is how a subconscious habit (arm-driving usually isn't a conscious choice) becomes a conscious, correctable one — you can't fix a habit you haven't first noticed clearly.",
        explainHi:
          "Is tarah ka deliberate, observed self-check hi wo tareeka hai jisse ek subconscious habit (arm-driving usually ek conscious choice nahi hai) ek conscious, correctable habit ban jaati hai — tum ek aisi habit fix nahi kar sakte jise tumne pehle clearly notice nahi kiya.",
      },
    ],

    mistakes: [
      {
        wrong: 'Swinging the whole forearm and elbow with each strum, "for power."',
        right: 'Keep the elbow relatively still and relaxed, letting the wrist provide the primary motion.',
        why: 'Arm-driven strumming is slower, less consistent, and more tiring than wrist-driven strumming — it feels powerful but measurably underperforms on every practical metric.',
        whyHi: 'Arm-driven strumming wrist-driven strumming se slower, less consistent, aur zyada tiring hai — ye powerful feel karta hai lekin har practical metric par measurably underperform karta hai.',
      },
      {
        wrong: 'Overcorrecting into a stiff, tense wrist while trying to strum "from the wrist."',
        right: 'Keep the wrist loose and relaxed even while it does most of the motion — tension anywhere defeats the purpose.',
        why: 'A tense wrist is just as slow and tiring as arm-driving, for the same underlying reason: unnecessary muscular effort resisting the natural motion instead of enabling it.',
        whyHi: 'Ek tense wrist arm-driving jitni hi slow aur tiring hai, usi underlying reason ke liye: unnecessary muscular effort jo natural motion ko enable karne ke bajaye resist karta hai.',
      },
    ],

    realWorld: [
      {
        en: 'Watch any experienced rhythm guitarist play a fast strumming pattern — their forearm looks almost stationary while their hand blurs. That visual is the wrist-vs-arm distinction made completely obvious.',
        hi: 'Kisi experienced rhythm guitarist ko ek fast strumming pattern bajaate hue dekho — unka forearm almost stationary dikhta hai jabki unka hand blur karta hai. Wo visual wrist-vs-arm distinction ko poori tarah obvious bana deta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Does this apply to slow strumming too, or only fast patterns?',
        qHi: 'Kya ye slow strumming par bhi apply hota hai, ya sirf fast patterns par?',
        a: "Build the habit at slow speed from the very start — it's much harder to retrain an arm-driven habit after it's ingrained than to build wrist-driven motion correctly from the first slow practice session.",
        aHi: 'Habit ko bilkul shuru se slow speed par banao — ek arm-driven habit ko retrain karna, ek baar ingrained hone ke baad, pehle slow practice session se hi wrist-driven motion ko correctly banane se kahin zyada hard hai.',
      },
    ],

    exercises: [
      {
        task: 'Strum a chord you know 20 times, alternating: 10 deliberately arm-driven (exaggerated), then 10 deliberately wrist-driven. Notice the difference in effort and consistency between the two sets.',
        taskHi: 'Ek chord jo tumhe pata hai 20 baar strum karo, alternate karte hue: 10 deliberately arm-driven (exaggerated), phir 10 deliberately wrist-driven. Dono sets ke beech effort aur consistency mein difference notice karo.',
        hint: 'Exaggerating the "wrong" motion deliberately, briefly, is a legitimate way to feel the contrast clearly — you\'re not practicing the bad habit, you\'re using it as a one-time comparison point.',
        hintHi: '"Galat" motion ko deliberately, briefly exaggerate karna contrast ko clearly feel karne ka ek legitimate tareeka hai — tum bad habit practice nahi kar rahe, use ek one-time comparison point ki tarah use kar rahe ho.',
      },
    ],

    keyTakeaways: [
      'Strumming power and speed come primarily from a relaxed wrist pivot, not a whole-arm swing.',
      'The forearm stays relatively still and relaxed, providing positioning rather than primary motion.',
      'Avoid overcorrecting into a tense, stiff wrist — looseness matters as much as the motion source.',
    ],
    keyTakeawaysHi: [
      'Strumming power aur speed primarily ek relaxed wrist pivot se aati hai, poore-arm swing se nahi.',
      'Forearm relatively still aur relaxed rehta hai, primary motion ke bajaye positioning provide karte hue.',
      'Ek tense, stiff wrist mein overcorrect karne se bacho — looseness utni hi matter karti hai jitna motion ka source.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'pick-angle-and-attack',
    title: 'Pick Angle & Attack — Clean vs. Scratchy',
    titleHi: 'Pick Angle Aur Attack — Clean vs Scratchy',
    description: 'The difference between a full, clean strum sound and a thin, scratchy one usually comes down to one adjustable angle.',
    descriptionHi: 'Ek full, clean strum sound aur ek thin, scratchy sound ke beech ka difference usually ek adjustable angle tak aata hai.',
    difficulty: 'EASY',
    duration: 15,
    order: 2,

    analogy: {
      en: '**A knife cutting through bread at a slight angle vs. straight down.** A knife dragged straight down through crusty bread tends to catch and tear; angled slightly, it glides through cleanly. A pick striking strings works the same way — a slight angle glides across the strings, a pick held dead flat tends to catch and produce a thin, scratchy attack.',
      hi: '**Ek knife jo bread ko thode angle par cut karti hai vs straight down.** Crusty bread ke through seedha neeche drag kiya gaya knife catch aur tear karta hai; thoda angled hoke, ye cleanly glide karta hai. Ek pick strings strike karte waqt bilkul waise hi kaam karta hai — thoda angle strings ke across glide karta hai, dead flat pakda gaya pick catch karta hai aur ek thin, scratchy attack produce karta hai.',
    },

    simple: `**The adjustment:** angle the pick slightly (roughly 10-20 degrees) relative to the strings, rather than holding it perfectly perpendicular/flat. The exact angle isn't a fixed rule — it's a small tilt you adjust by ear.

**How to hear the difference directly:** strum a chord with the pick held dead flat/perpendicular, listen to the tone. Then strum the same chord with a slight angle. The angled version should sound fuller and smoother; the flat version thinner and scratchier.

**This connects directly to Lesson 1's wrist motion:** a natural wrist pivot tends to introduce a slight, correct pick angle automatically, while a stiff, flat wrist tends to keep the pick perpendicular. Getting the wrist motion right (Lesson 1) often fixes pick angle (this lesson) as a side effect — they're related, not two totally separate skills.`,
    simpleHi: `**Adjustment:** pick ko strings ke relative thoda angle karo (roughly 10-20 degrees), use perfectly perpendicular/flat pakadne ke bajaye. Exact angle koi fixed rule nahi hai — ye ek chhota tilt hai jo tum kaan se adjust karte ho.

**Difference ko directly kaise suno:** ek chord ko pick dead flat/perpendicular pakadkar strum karo, tone suno. Phir wahi chord ek slight angle ke saath strum karo. Angled version fuller aur smoother sound karna chahiye; flat version thinner aur scratchier.

**Ye directly Lesson 1 ki wrist motion se connect hota hai:** ek natural wrist pivot automatically ek slight, correct pick angle introduce karta hai, jabki ek stiff, flat wrist pick ko perpendicular rakhta hai. Wrist motion ko sahi karna (Lesson 1) often pick angle (ye lesson) ko side effect ki tarah fix kar deta hai — wo related hain, do totally separate skills nahi.`,

    content: `**Why does a slight angle sound fuller?** A perpendicular pick strikes the full width/edge of the string all at once, which produces a harder, more percussive transient (the very start of the sound) with more high-frequency scratch in it. An angled pick contacts the string more like a glancing blow, spreading the same energy over a slightly longer moment — this softens the harsh transient without reducing the note's actual volume, producing a rounder, fuller-sounding attack.

**This is adjustable, not fixed, and genuinely context-dependent.** Some styles and songs actually WANT a sharper, more percussive attack (aggressive rock rhythm parts, for instance) — the angled technique is the more broadly useful DEFAULT for clean rhythm playing, not a universal rule with zero exceptions. Once the clean version is reliable, deliberately experimenting with a flatter angle for a specific harder-edged sound is a legitimate stylistic choice, not a mistake.

**A related factor worth knowing about: pick thickness.** Thinner picks flex more on contact and naturally produce a softer, warmer attack even at a flatter angle; thicker/stiffer picks produce a sharper, more defined attack even when angled. If your strum still sounds thin after adjusting angle, pick thickness is worth experimenting with too — the two factors interact.`,
    contentHi: `**Slight angle fuller kyun sound karta hai?** Ek perpendicular pick string ki poori width/edge ko ek saath strike karta hai, jo ek harder, zyada percussive transient (sound ki bilkul shuruaat) produce karta hai usmein zyada high-frequency scratch ke saath. Ek angled pick string ko zyada ek glancing blow ki tarah touch karta hai, same energy ko ek thodi lambi moment mein spread karte hue — ye harsh transient ko soften karta hai bina note ka actual volume kam kiye, ek rounder, fuller-sounding attack produce karte hue.

**Ye adjustable hai, fixed nahi, aur genuinely context-dependent hai.** Kuch styles aur songs actually ek sharper, zyada percussive attack CHAHTE hain (aggressive rock rhythm parts, for instance) — angled technique clean rhythm playing ke liye zyada broadly useful DEFAULT hai, zero exceptions wala universal rule nahi. Ek baar clean version reliable ho jaaye, ek specific harder-edged sound ke liye deliberately flatter angle experiment karna ek legitimate stylistic choice hai, mistake nahi.

**Ek related factor jaanne layak: pick thickness.** Thinner picks contact par zyada flex karte hain aur naturally ek softer, warmer attack produce karte hain flatter angle par bhi; thicker/stiffer picks ek sharper, zyada defined attack produce karte hain angled hone par bhi. Agar tumhara strum angle adjust karne ke baad bhi thin sound kare, pick thickness bhi experiment karne layak hai — dono factors interact karte hain.`,

    examples: [
      {
        title: 'The flat-vs-angled A/B comparison',
        titleHi: 'Flat-vs-angled A/B comparison',
        code: `1. Strum G major, pick held perfectly flat/perpendicular. Listen.
2. Strum G major again, pick angled ~15 degrees. Listen.
3. Repeat both a few times, alternating, focused purely on the tonal difference.`,
        explain:
          "A direct A/B comparison, repeated a few times, trains your ear to recognize the difference far faster than a single side-by-side attempt — this is the same repeated-comparison principle used in Module 6's minimal-motion drill.",
        explainHi:
          "Ek direct A/B comparison, kuch baar repeat kiya hua, tumhare kaan ko ye difference recognize karna ek single side-by-side attempt se kahin zyada fast train karta hai — ye wahi repeated-comparison principle hai jo Module 6 ke minimal-motion drill mein use hua tha.",
      },
    ],

    mistakes: [
      {
        wrong: 'Holding the pick perfectly flat/perpendicular to the strings by default, then wondering why strums sound thin or scratchy.',
        right: 'Angle the pick slightly (adjust by ear, roughly 10-20 degrees) as your default rhythm-playing technique.',
        why: 'A flat pick angle produces a harsher, thinner-sounding transient by the physical nature of the contact — this is a mechanical sound-quality issue fixable with a small, specific adjustment.',
        whyHi: 'Ek flat pick angle contact ki physical nature ki wajah se ek harsher, thinner-sounding transient produce karta hai — ye ek mechanical sound-quality issue hai jo ek small, specific adjustment se fixable hai.',
      },
    ],

    realWorld: [
      {
        en: 'Recording engineers and experienced players routinely adjust pick angle mid-session for exactly this reason — it\'s one of the fastest, most impactful tone adjustments available with zero gear changes needed.',
        hi: 'Recording engineers aur experienced players routinely mid-session pick angle adjust karte hain exactly isi reason se — ye sabse fast, sabse impactful tone adjustments mein se ek hai jo bina kisi gear change ke available hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Is there one universally "correct" pick angle I should memorize?',
        qHi: 'Kya ek universally "correct" pick angle hai jo mujhe memorize karna chahiye?',
        a: "No fixed number — it's a small adjustable tilt you dial in by ear for the sound you want, and it can legitimately change by song or style. Treat the ~10-20 degree range as a useful starting reference, not a strict rule.",
        aHi: 'Koi fixed number nahi — ye ek chhota adjustable tilt hai jo tum us sound ke liye kaan se dial in karte ho jo tum chahte ho, aur ye song ya style ke hisaab se legitimately badal sakta hai. ~10-20 degree range ko ek useful starting reference ki tarah treat karo, ek strict rule nahi.',
      },
    ],

    exercises: [
      {
        task: 'Play through the six campfire chords (Module 4-5) once with a flat pick angle, then again with a slight angle. Note which one sounds better to you on each individual chord — it may not be perfectly uniform across all six.',
        taskHi: 'Six campfire chords (Module 4-5) ke through ek baar flat pick angle ke saath bajao, phir dobara ek slight angle ke saath. Note karo kaunsa tumhe har individual chord par better lagta hai — ho sakta hai saare six par ye perfectly uniform na ho.',
        hint: 'Small differences in string gauge and chord voicing can make the "ideal" angle shift slightly chord to chord — this is normal, not a sign of inconsistent technique.',
        hintHi: 'String gauge aur chord voicing mein small differences "ideal" angle ko chord to chord slightly shift kar sakte hain — ye normal hai, inconsistent technique ka sign nahi.',
      },
    ],

    keyTakeaways: [
      'A slight pick angle (roughly 10-20 degrees, adjusted by ear) produces a fuller, cleaner attack than a flat/perpendicular pick.',
      'This connects to Lesson 1: a natural wrist pivot tends to introduce correct pick angle automatically.',
      'Pick thickness also affects attack sound — worth experimenting with alongside angle.',
    ],
    keyTakeawaysHi: [
      'Ek slight pick angle (roughly 10-20 degrees, kaan se adjusted) ek fuller, cleaner attack produce karta hai flat/perpendicular pick se.',
      'Ye Lesson 1 se connect hota hai: ek natural wrist pivot automatically correct pick angle introduce karta hai.',
      'Pick thickness bhi attack sound ko affect karti hai — angle ke saath experiment karne layak.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'muting-with-the-strumming-hand',
    title: 'Muting With the Strumming Hand',
    titleHi: 'Strumming Hand Se Muting',
    description: 'A second muting technique, complementary to Module 5\'s fretting-hand mutes — and the foundation for Module 8\'s chuck/chunk technique.',
    descriptionHi: 'Ek doosri muting technique, Module 5 ke fretting-hand mutes ko complement karti hui — aur Module 8 ki chuck/chunk technique ki foundation.',
    difficulty: 'MEDIUM',
    duration: 15,
    order: 3,

    analogy: {
      en: '**A hand resting lightly on a ringing bell.** Resting the side of your strumming hand\'s palm lightly against the strings near the bridge doesn\'t stop them from being struck — it just damps the ring, the same way resting a hand on a bell after striking it shortens the ring without preventing the strike sound itself.',
      hi: '**Ek hand jo ek bajti hui bell par lightly rest kar raha hai.** Apne strumming hand ki palm ki side ko bridge ke paas strings par lightly rest karna unhe strike hone se nahi rokta — ye bas ring ko damp karta hai, bilkul waise jaise ek bell ko strike karne ke baad uspe hand rest karna strike sound ko rokte bina ring ko chhota kar deta hai.',
    },

    simple: `**Palm muting, the basic technique:**

1. Rest the fleshy edge of your strumming hand's palm lightly on the strings, right near the bridge.
2. Strum normally — the strings still get struck and make sound, but the ring is damped/shortened.
3. Adjust pressure to taste: more pressure = shorter, more muted/percussive sound; less pressure = closer to a normal ring.

**This is different from Module 5's fretting-hand mutes** (like C's low-E mute), which prevent a string from sounding meaningfully AT ALL. Palm muting lets the string sound, just with a shorter, more controlled decay — a texture choice, not an avoidance technique.`,
    simpleHi: `**Palm muting, basic technique:**

1. Apne strumming hand ki palm ka fleshy edge strings par lightly rest karo, bridge ke bilkul paas.
2. Normally strum karo — strings abhi bhi strike hoti hain aur sound banati hain, lekin ring damped/shortened hoti hai.
3. Pressure ko taste ke hisaab se adjust karo: zyada pressure = chhota, zyada muted/percussive sound; kam pressure = normal ring ke zyada paas.

**Ye Module 5 ke fretting-hand mutes se alag hai** (jaise C ka low-E mute), jo ek string ko meaningfully AT ALL sound karne se rokte hain. Palm muting string ko sound karne deta hai, bas ek chhota, zyada controlled decay ke saath — ek texture choice, avoidance technique nahi.`,

    content: `**Why position matters so much — right near the bridge, not in the middle of the strings.** Muting too far from the bridge (closer to the middle of the string's vibrating length) deadens the string almost completely, producing a dull thud instead of a controlled, articulate mute. Right at the bridge, there's enough string length still free to vibrate for a genuine (if shortened) pitch to come through — position is what separates "muted texture" from "accidentally killed the note."

**Palm muting is a genuine spectrum, not an on/off switch.** Light pressure gives a subtle warmth and slight shortening; heavy pressure gives the tight, percussive "chugging" sound associated with rock rhythm playing. Both are legitimate, useful settings for different musical moments — this lesson is building the physical control to access the whole range, not just one fixed amount of pressure.

**Why this lesson sets up Module 8's "chuck."** The percussive chuck/chunk strum Module 8 teaches is built directly on this palm-muting foundation — it's essentially a fully-muted strum used as a deliberate rhythmic hit rather than as a texture on ringing chords. Getting comfortable with the muting mechanism itself now makes that next technique a small addition rather than an entirely new skill.`,
    contentHi: `**Position itna kyun matter karta hai — bridge ke bilkul paas, strings ke beech mein nahi.** Bridge se bahut door mute karna (string ki vibrating length ke beech ke zyada paas) string ko almost completely deaden kar deta hai, ek dull thud produce karte hue ek controlled, articulate mute ke bajaye. Bilkul bridge par, kaafi string length abhi bhi free hoti hai vibrate karne ke liye ek genuine (chahe shortened) pitch aane ke liye — position hi wo cheez hai jo "muted texture" ko "accidentally killed the note" se separate karti hai.

**Palm muting ek genuine spectrum hai, on/off switch nahi.** Light pressure subtle warmth aur slight shortening deta hai; heavy pressure tight, percussive "chugging" sound deta hai jo rock rhythm playing se associated hai. Dono legitimate, useful settings hain alag alag musical moments ke liye — ye lesson poori range tak access karne ki physical control bana raha hai, sirf ek fixed amount of pressure nahi.

**Ye lesson Module 8 ka "chuck" kyun set up karta hai.** Module 8 jo percussive chuck/chunk strum sikhata hai wo directly is palm-muting foundation par bana hai — ye essentially ek fully-muted strum hai jo ringing chords par ek texture ke bajaye ek deliberate rhythmic hit ki tarah use hota hai. Ab khud muting mechanism ke saath comfortable hona us agli technique ko ek poori nayi skill ke bajaye ek chhota addition banata hai.`,

    examples: [
      {
        title: 'The pressure spectrum, felt directly',
        titleHi: 'Pressure spectrum, directly feel kiya hua',
        code: `1. Strum G with no palm contact at all — full ring.
2. Strum G with very light palm contact near the bridge — slight warmth/shortening.
3. Strum G with firm palm contact near the bridge — tight, percussive "chug."
4. Strum G with palm contact too far from the bridge (middle of strings) — dull thud, not useful.`,
        explain:
          'Step 4 is deliberately included as a "what NOT to do" comparison — feeling the dull, over-muted result directly makes the correct bridge-adjacent position\'s value obvious in a way just being told the rule doesn\'t.',
        explainHi:
          'Step 4 deliberately ek "kya NAHI karna hai" comparison ki tarah include kiya gaya hai — dull, over-muted result ko directly feel karna correct bridge-adjacent position ki value ko obvious banata hai us tareeke se jo sirf rule bataye jaane se nahi hota.',
      },
    ],

    mistakes: [
      {
        wrong: 'Resting the palm in the middle of the strings\' length rather than right at the bridge, producing a dull thud instead of a controlled mute.',
        right: 'Keep palm contact right at the bridge edge — close enough that plenty of string length remains free to vibrate.',
        why: 'Position determines how much of the string is still free to produce genuine pitch — too far from the bridge kills too much of that free length, over-deadening the note.',
        whyHi: 'Position determine karta hai ki string ka kitna hissa abhi bhi genuine pitch produce karne ke liye free hai — bridge se bahut door us free length ka bahut zyada hissa kill kar deta hai, note ko over-deaden karte hue.',
      },
    ],

    realWorld: [
      {
        en: 'Palm-muted rhythm parts are all over popular rock, pop-punk, and metal — that tight "chugging" sound under a verse, then a full open-ring release into the chorus, is this exact technique used deliberately as a dynamic/arrangement tool.',
        hi: 'Palm-muted rhythm parts popular rock, pop-punk, aur metal mein har jagah hain — verse ke neeche wo tight "chugging" sound, phir chorus mein ek full open-ring release, exactly yahi technique hai jo deliberately ek dynamic/arrangement tool ki tarah use hoti hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Does palm muting work the same way on all six strings at once, or can I mute selectively?',
        qHi: 'Kya palm muting saari six strings par ek saath same tarah kaam karta hai, ya main selectively mute kar sakta hoon?',
        a: "As described here, it's a full-hand technique affecting whichever strings your palm contacts, usually most or all of them during a strum. Selectively muting individual strings while others ring fully is a more advanced, separate technique beyond this lesson's scope.",
        aHi: 'Yahan describe kiye tareeke se, ye ek full-hand technique hai jo un strings ko affect karta hai jinhe tumhara palm touch karta hai, usually strum ke dauraan zyadatar ya saari. Individual strings ko selectively mute karna jabki doosri poori tarah ring karein is lesson ke scope se pare ek zyada advanced, separate technique hai.',
      },
    ],

    exercises: [
      {
        task: 'Practice the 4-step pressure spectrum from the example above on 3 different chords you know, noting how the "sweet spot" pressure might differ slightly per chord.',
        taskHi: 'Upar wale example ka 4-step pressure spectrum 3 alag chords par practice karo jo tumhe pata hain, note karte hue ki "sweet spot" pressure har chord ke liye thoda alag ho sakta hai.',
        hint: 'Chords with more open strings (like Em) may feel different under palm muting than chords with fewer open strings (like G) — this variation is normal and worth simply noticing, not something to "fix."',
        hintHi: 'Zyada open strings wale chords (jaise Em) palm muting ke neeche un chords se alag feel kar sakte hain jinmein kam open strings hain (jaise G) — ye variation normal hai aur bas notice karne layak hai, "fix" karne wali cheez nahi.',
      },
    ],

    keyTakeaways: [
      'Palm muting: rest the strumming hand\'s palm edge lightly on the strings, right at the bridge, while strumming normally.',
      'Position matters — right at the bridge gives controlled muting, too far toward the middle gives a dull, over-deadened thud.',
      'Pressure is a spectrum from subtle warmth to tight percussive "chugging," not an on/off setting.',
      'This is the direct foundation for Module 8\'s percussive "chuck" strumming technique.',
    ],
    keyTakeawaysHi: [
      'Palm muting: strumming hand ki palm edge ko strings par lightly rest karo, bilkul bridge par, normally strum karte hue.',
      'Position matter karta hai — bilkul bridge par controlled muting deta hai, beech ki taraf bahut door ek dull, over-deadened thud deta hai.',
      'Pressure subtle warmth se tight percussive "chugging" tak ek spectrum hai, on/off setting nahi.',
      'Ye Module 8 ki percussive "chuck" strumming technique ki direct foundation hai.',
    ],
  },
];
