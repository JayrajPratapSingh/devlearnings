/**
 * Guitar Course — Module 1: Meet the Guitar, lessons 1-3.
 *
 * Lesson 1: Anatomy of the guitar and, physically, why a plucked string
 *           makes a sound loud enough to hear.
 * Lesson 2: How to actually hold the instrument and the pick — the two
 *           physical habits every later lesson assumes you already have.
 * Lesson 3: String numbering, fret numbering, and open vs. fretted notes —
 *           the vocabulary every chord diagram in this course depends on.
 *
 * This is the opening module of the whole course (see
 * scratchpad/GUITAR-COURSE-PLAN.md for the full 26-module arc). Every
 * fretboard/chord visual is generated through `guitar-diagrams.ts`, never
 * hand-typed, so it stays pixel-consistent with every later module.
 */

import type { CourseLesson } from './course-js-module1';
import { chordPreviewHtml, guitarAnatomySvg, fingerNumberingSvg, diagramPreviewHtml } from './guitar-diagrams';
import { CHORDS } from './guitar-chords-data';

export const GUITAR_MODULE_1: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'anatomy-of-the-guitar',
    title: 'Anatomy of the Guitar (and Why a String Makes Sound)',
    titleHi: 'Guitar Ki Anatomy (Aur String Se Sound Kaise Banta Hai)',
    description: 'Every part of the guitar, named once and for all, plus the physics of why plucking a string is audible across a room.',
    descriptionHi: 'Guitar ka har part, ek baar mein naam ke saath, aur physics ki wo baat ki ek string pluck karna poore room mein sunai kyun deta hai.',
    difficulty: 'EASY',
    duration: 15,
    order: 1,

    analogy: {
      en: '**A rubber band stretched over a shoebox.** Stretch a rubber band across an open shoebox and pluck it — you hear a faint twang. Now stretch it across the SAME shoebox but tighter, or shorter — the pitch changes. The guitar is exactly this, engineered properly: strings (rubber bands) stretched over a hollow, resonant box (the body), with a long ruled neck attached so you can shorten the vibrating length of the string with a finger, changing the pitch on demand.',
      hi: '**Ek khaali shoebox par tana hua rubber band.** Ek khuli shoebox par rubber band khींचकर pluck karo — halki si twang sunai degi. Ab usi shoebox par usi rubber band ko aur tight, ya chhota karke khींचo — pitch badal jaata hai. Guitar bilkul yahi hai, properly engineer kiya hua: strings (rubber bands) ek khaali, resonant box (body) ke upar tani hui, ek lambi ruled neck ke saath attached taaki finger se string ki vibrating length chhoti kar sako, pitch ko on-demand badalte hue.',
    },

    simple: `**Think of the shoebox-and-rubber-band trick, built properly.**

A guitar has three big pieces:

1. **The body** — the resonant box. It doesn't make the sound louder by magic; it makes the string's tiny vibration move a lot more air, the same way shouting into an empty room sounds bigger than shouting into a pillow.
2. **The neck** — a long ruler with metal strips (**frets**) embedded across it. Pressing a string down against a fret shortens the vibrating length of that string, which raises the pitch.
3. **The headstock** — holds the **tuning pegs**, which you turn to tighten or loosen each string (tighter = higher pitch).

The string itself runs from a **tuning peg**, over the **nut** (a thin grooved strip at the top of the neck), down the whole neck, over the **soundhole** (acoustic) or **pickups** (electric), and anchors at the **bridge**.

Six strings, numbered **1 to 6** — but backwards from what you'd guess: **string 1 is the thinnest** (highest-pitched), **string 6 is the thickest** (lowest-pitched). You will use this numbering in every chord diagram from here on, so it's worth getting used to now.`,
    simpleHi: `**Shoebox-aur-rubber-band trick ko properly socho.**

Guitar mein teen bade parts hote hain:

1. **Body** — resonant box. Ye sound ko magic se loud nahi karta; ye string ki chhoti si vibration ko bahut zyada air move karwata hai, bilkul waise jaise khaali room mein chillana pillow mein chillane se zyada bada sunai deta hai.
2. **Neck** — ek lambi ruler jispe metal strips (**frets**) laगी hoti hain. Ek string ko fret ke against dabana us string ki vibrating length chhoti kar deta hai, jo pitch ko upar utha deta hai.
3. **Headstock** — **tuning pegs** hold karta hai, jinhe ghumakar har string tight ya loose karte ho (tight = higher pitch).

String khud ek **tuning peg** se shuru hoti hai, **nut** (neck ke top par ek patli grooved strip) ke upar se, puri neck ke neeche se, **soundhole** (acoustic) ya **pickups** (electric) ke upar se, aur **bridge** par anchor hoti hai.

Chhe strings, **1 se 6** number hoti hain — lekin ulte tareeke se jo tum guess karoge: **string 1 sabse patli** hai (highest-pitched), **string 6 sabse moti** hai (lowest-pitched). Ye numbering tum is course ke har chord diagram mein use karoge, isliye abhi se aadat daal lo.`,

    content: `**Why does a bigger, hollow body matter?**

A single vibrating string, on its own, barely moves any air — you'd have to put your ear right up to it to hear anything. The guitar's body isn't decorative: it's an acoustic amplifier with no batteries. The string's vibration transfers through the bridge into the top of the body (the "soundboard"), which is thin and springy enough to vibrate along with the string, and its much larger surface area pushes far more air than the string alone ever could. That's the entire trick, and it's why a solid-body electric guitar is nearly silent unplugged — no resonant chamber, no free amplification, all the sound comes from the pickups and an actual amplifier instead.

**Acoustic vs. electric, the practical difference for you right now:**
- **Acoustic**: plays on its own, no amp needed, strings are usually a bit higher off the neck (slightly harder on young fingers at first), a very forgiving "learn anywhere" instrument.
- **Electric**: needs an amp to be heard properly (though it's audible faintly unplugged), strings sit lower and are easier to press down, and most players find it slightly gentler on the fingertips while learning.

Neither is "better" for a beginner — pick based on what music you actually want to play, since the chord shapes and technique in this whole course transfer directly between the two.

**The neck's frets, briefly (Module 3 goes deep on this):** each fret is a raised metal strip. Pressing a string down just BEHIND a fret (not on top of it) shortens the vibrating string length to exactly that fret's position, and every fret raises the pitch by the same fixed musical step (a "semitone"). You don't need to know why yet — just that frets are numbered starting from 1 near the headstock, counting up as you move toward the body.`,
    contentHi: `**Bada, khaali body kyun matter karta hai?**

Ek akeli vibrating string, apne aap, bahut kam air move karti hai — sunne ke liye ear ko bilkul paas rakhna padega. Guitar ki body decorative nahi hai: ye bina batteries wala ek acoustic amplifier hai. String ki vibration bridge ke through body ke top (the "soundboard") mein transfer hoti hai, jo itni thin aur springy hoti hai ki string ke saath vibrate kar sake, aur uska bahut bada surface area akeli string se kahin zyada air push karta hai. Yahi poora trick hai, aur isliye ek solid-body electric guitar unplugged hone par lagbhag silent hoti hai — koi resonant chamber nahi, koi free amplification nahi, poora sound pickups aur ek actual amplifier se aata hai.

**Acoustic vs electric, tumhare liye practical difference:**
- **Acoustic**: apne aap bajta hai, amp ki zaroorat nahi, strings usually neck se thodi upar hoti hain (shuru mein young fingers ke liye thoda harder), ek bahut forgiving "kahin bhi seekho" instrument.
- **Electric**: properly sunne ke liye amp chahiye (halka sa unplugged bhi sunai deta hai), strings neeche baithi hoti hain aur press karna easier hai, aur zyadatar players ko lagta hai ki fingertips ke liye seekhte waqt thoda gentle hai.

Beginner ke liye koi "better" nahi hai — us music ke basis par choose karo jo actually bajana chahte ho, kyunki poore is course ke chord shapes aur technique dono ke beech directly transfer hote hain.

**Neck ke frets, briefly (Module 3 isme deep jaata hai):** har fret ek raised metal strip hai. String ko fret ke bilkul PEECHE dabana (upar nahi) us string ki vibrating length ko exactly us fret ki position tak chhota kar deta hai, aur har fret pitch ko same fixed musical step ("semitone") se upar uthaता hai. Abhi ye jaanna zaroori nahi ki kyun — bas itna ki frets headstock ke paas 1 se number hoti hain, aur body ki taraf jaate hue ginti badhti hai.`,

    examples: [
      {
        title: 'Every part of the guitar, labeled',
        titleHi: 'Guitar ka har part, labeled',
        code: `String numbering (thin to thick):
  1 = high e   (thinnest, highest pitch)
  2 = B
  3 = G
  4 = D
  5 = A
  6 = low E    (thickest, lowest pitch)

Mnemonic (low to high, string 6 -> 1):
  Eddie Ate Dynamite, Good Bye Eddie
  E     A   D         G    B    E`,
        previewHeight: 400,
        preview: diagramPreviewHtml(guitarAnatomySvg(), 'Every part named — refer back to this whenever a later lesson mentions "the nut" or "the bridge."'),
        explain:
          'This diagram is the reference point for every part name used from here on. The string numbering (1=thinnest to 6=thickest) is the single most important detail on it — it is backwards from what most beginners guess on their own, and getting comfortable with it now prevents confusion in every chord diagram later.',
        explainHi:
          'Ye diagram yahan se aage use hone wale har part name ka reference point hai. String numbering (1=patli se 6=moti) usmein sabse important detail hai — ye zyadatar beginners ke apne guess se ulti hai, aur abhi ismein comfortable hona baad ke har chord diagram mein confusion se bachaata hai.',
      },
      {
        title: 'Fretting-hand finger numbers — used in every chord diagram from here on',
        titleHi: 'Fretting-hand finger numbers — yahan se har chord diagram mein use honge',
        code: `1 = index finger
2 = middle finger
3 = ring finger
4 = pinky finger
T = thumb (stays behind the neck, never presses strings for now)`,
        previewHeight: 300,
        preview: diagramPreviewHtml(fingerNumberingSvg()),
        explain:
          'Every colored dot on a chord diagram in this course has a small number inside it — that number is exactly this finger numbering, not a step order or a priority ranking. Memorize it now so Module 4 onward reads instantly instead of needing a lookup every time.',
        explainHi:
          'Is course ke har chord diagram ke colored dot ke andar ek chhota number hota hai — wo number exactly yahi finger numbering hai, koi step order ya priority ranking nahi. Ise abhi memorize kar lo taaki Module 4 se aage instantly padh sako, har baar lookup ki zaroorat na pade.',
      },
    ],

    mistakes: [
      {
        wrong: 'Assuming string 1 is the thick one because it\'s "first" — then pressing the wrong string entirely when a diagram says "string 1."',
        right: 'String 1 is always the THINNEST, highest-pitched string (the one closest to the floor when you hold the guitar in playing position). String 6 is the thickest, lowest, closest to the ceiling.',
        why: 'This numbering is backwards from intuition, and it is used in literally every chord diagram, tab, and lesson from here forward — get it wrong once early and it silently wrecks every chord you try to learn after.',
        whyHi: 'Ye numbering intuition se ulti hai, aur ye literally har chord diagram, tab, aur lesson mein aage use hoti hai — ise ek baar shuru mein galat samjho to har baad wala chord chupke se galat ban jaata hai.',
      },
      {
        wrong: 'Believing a bigger/more expensive guitar body will make learning easier or faster.',
        right: 'Body size affects comfort and tone, not how fast you learn. A smaller-bodied guitar that fits your frame comfortably will get MORE practice time out of you than an oversized "better" one you keep putting down.',
        why: 'Comfort drives practice consistency, and consistency is the entire game in the first few months — an instrument you enjoy picking up beats a technically superior one you avoid.',
        whyHi: 'Comfort practice consistency drive karta hai, aur pehle kuch mahino mein consistency hi poora game hai — ek instrument jo utha kar achha lage, ek technically superior instrument se behtar hai jise tum avoid karte ho.',
      },
    ],

    realWorld: [
      {
        en: 'When you eventually shop for a guitar, "action" (how high the strings sit above the frets) matters more for beginner comfort than brand or price — high action makes every single chord physically harder to press, and a $150 guitar with good action will feel easier than an $800 one with bad action.',
        hi: 'Jab tum eventually guitar shop karoge, "action" (strings frets se kitni upar baithi hain) beginner comfort ke liye brand ya price se zyada matter karta hai — high action har single chord ko physically press karna harder bana deta hai, aur good action wali $150 ki guitar bad action wali $800 ki guitar se easier lagegi.',
      },
    ],

    interviewQA: [
      {
        q: 'Do I need to know which wood the body is made of to start learning?',
        qHi: 'Kya mujhe shuru karne ke liye pata hona chahiye body kis wood ki bani hai?',
        a: 'No — wood affects tone subtly, a topic for much later (if ever). For the first many months, technique matters orders of magnitude more than the instrument\'s tonewood.',
        aHi: 'Nahi — wood tone ko subtly affect karta hai, ye ek bahut baad ka topic hai (agar kabhi zaroorat pade). Pehle bahut mahinon ke liye, technique instrument ke tonewood se orders of magnitude zyada matter karta hai.',
      },
      {
        q: 'My guitar has no soundhole and doesn\'t need an amp — what is it?',
        qHi: 'Meri guitar mein soundhole nahi hai aur amp ki zaroorat nahi — ye kya hai?',
        a: 'That\'s likely a "classical" or "electro-acoustic" nylon/steel string guitar, or you may be confusing a solid-body electric (which DOES need an amp to be heard well, it\'s just faintly audible unplugged) with an acoustic. If it visibly has magnetic pickups near the bridge, it\'s electric.',
        aHi: 'Ye likely ek "classical" ya "electro-acoustic" nylon/steel string guitar hai, ya ho sakta hai tum ek solid-body electric (jise achhe se sunne ke liye amp CHAHIYE, unplugged sirf halka sa sunai deta hai) ko acoustic samajh rahe ho. Agar bridge ke paas visibly magnetic pickups hain, to ye electric hai.',
      },
    ],

    exercises: [
      {
        task: 'Pick up your guitar (or picture one) and physically point to, and name out loud, all 8 labeled parts from the diagram above, without looking.',
        taskHi: 'Apni guitar uthao (ya ek imagine karo) aur upar wale diagram ke saare 8 labeled parts ko bina dekhe, zor se naam lekar point karo.',
        hint: 'If you get stuck on one, that\'s the part to review again before moving to Lesson 2 — the whole course assumes you know these names cold.',
        hintHi: 'Agar kisi ek par atak jao, wahi part hai jise Lesson 2 par jaane se pehle dobara review karna hai — poora course maanta hai ki tumhe ye naam pakke se pata hain.',
      },
    ],

    keyTakeaways: [
      'The body is a free acoustic amplifier — no electronics needed on an acoustic guitar.',
      'Strings are numbered 1 (thinnest/highest) to 6 (thickest/lowest) — backwards from intuition, but universal.',
      'Frets are pressed just behind (not on top of) the metal strip, shortening the vibrating string length to raise pitch.',
      'Acoustic vs. electric is a preference, not a "better/worse" choice — technique transfers directly either way.',
    ],
    keyTakeawaysHi: [
      'Body ek free acoustic amplifier hai — acoustic guitar par koi electronics ki zaroorat nahi.',
      'Strings 1 (patli/highest) se 6 (moti/lowest) tak number hoti hain — intuition se ulti, lekin universal.',
      'Frets ko metal strip ke bilkul peeche (upar nahi) dabaya jaata hai, jo vibrating string length chhoti karke pitch upar uthata hai.',
      'Acoustic vs electric ek preference hai, "better/worse" choice nahi — technique dono taraf directly transfer hoti hai.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'posture-and-pick-grip',
    title: 'How to Hold It — Posture & Pick Grip',
    titleHi: 'Kaise Pakde — Posture Aur Pick Grip',
    description: 'The two physical habits every later lesson quietly assumes you already have, built correctly from day one.',
    descriptionHi: 'Do physical habits jo har baad wala lesson chupke se assume karta hai ki tumhare paas already hain, day one se sahi banaye hue.',
    difficulty: 'EASY',
    duration: 15,
    order: 2,

    analogy: {
      en: '**Holding a pen for the first time, again.** If a child learns to grip a pen wrong, every letter they write afterward is harder than it needs to be — the fix later takes far longer than getting it right on day one would have. Guitar posture and pick grip work exactly the same way: a bad habit formed in week one costs you months to unlearn in month six.',
      hi: '**Pehli baar pen pakadna, phir se.** Agar ek bachcha pen galat pakadna seekh le, to uske baad likha gaya har letter zaroorat se zyada hard ho jaata hai — baad mein fix karna shuru mein sahi karne se kahin zyada time leta hai. Guitar posture aur pick grip bilkul waise hi kaam karte hain: week one mein bani ek bad habit month six mein unlearn karne mein mahino le leti hai.',
    },

    simple: `**Sitting posture (the fastest way to start):**

1. Sit on a chair with no arms, feet flat on the floor.
2. Rest the guitar's waist (the narrow curve) on your right leg if you're right-handed (left leg for left-handed players holding it the mirrored way), body angled slightly toward you.
3. The neck should point slightly upward, not flat/parallel to the floor — a flat neck forces your wrist into an awkward bend.
4. Both shoulders stay relaxed and level. If your shoulder is creeping up toward your ear, the guitar is positioned wrong, not your posture "needing more practice."

**Pick grip:**

1. Hold the pick between your thumb and the side of your index finger, not gripped inside a full fist.
2. Only about 3-5mm of the pick's tip should stick out past your fingers — more than that and it flops around and catches strings unpredictably.
3. The pick's point aims roughly perpendicular to the strings, not sideways.
4. Grip firmly enough that a light tug won't pull it free, but loosely enough that your hand doesn't cramp within a minute.`,
    simpleHi: `**Sitting posture (shuru karne ka fastest tareeka):**

1. Bina arms wali chair par baitho, feet floor par flat.
2. Guitar ki waist (narrow curve) ko apni right leg par rakho agar right-handed ho (left-handed players ke liye left leg, mirrored tareeke se), body thoda tumhari taraf angled.
3. Neck thoda upward point karna chahiye, floor ke parallel/flat nahi — ek flat neck wrist ko ek awkward bend mein force karta hai.
4. Dono shoulders relaxed aur level rehne chahiye. Agar shoulder ear ki taraf creep kar raha hai, guitar galat position mein hai, tumhari posture ko "aur practice" ki zaroorat nahi hai.

**Pick grip:**

1. Pick ko thumb aur index finger ke side ke beech pakdo, poori fist ke andar nahi.
2. Pick ki tip ka sirf 3-5mm fingers ke aage nikalna chahiye — usse zyada nikla to wo flop karega aur strings ko unpredictably catch karega.
3. Pick ka point roughly strings ke perpendicular aim karta hai, sideways nahi.
4. Itni firmly pakdo ki ek light tug se na nikle, lekin itni loosely ki hand ek minute mein cramp na kare.`,

    content: `**Why the neck angle matters more than it seems.** If the neck lies flat (parallel to the floor), your left wrist (fretting hand) has to bend sharply outward to reach around and press strings — this is exactly the wrist position that causes fatigue and, over years, repetitive strain. Angling the neck up roughly 30-45 degrees lets your wrist stay closer to neutral (straight), which is both more comfortable immediately and healthier long-term. This is the single most common posture mistake self-taught beginners carry for years without noticing.

**Standing posture**, once you get there (a strap is required): adjust the strap so the guitar sits at roughly the SAME height and angle it does when you're sitting correctly. A guitar that hangs too low forces your fretting wrist into a bad angle just like a flat neck does — "rockstar low" looks cool and teaches bad habits simultaneously; adjust it higher while learning, and lower it later once your technique is solid enough to compensate.

**Why pick grip precision matters early:** a pick held too deep (a lot sticking out) flexes and wobbles when it hits a string, producing an inconsistent, scratchy tone and making fast strumming or picking much harder to control. A pick held too shallow (barely any tip exposed) is hard to keep hold of and tends to slip out mid-strum. The 3-5mm range is the sweet spot nearly every teacher converges on for exactly these mechanical reasons — it isn't an arbitrary rule.`,
    contentHi: `**Neck angle itna kyun matter karta hai.** Agar neck flat leti hai (floor ke parallel), left wrist (fretting hand) ko sharply outward bend karna padta hai strings tak pahunchne aur press karne ke liye — yahi wrist position hai jo fatigue cause karti hai aur, saalon mein, repetitive strain bhi. Neck ko roughly 30-45 degrees upar angle karna wrist ko neutral (straight) ke zyada paas rakhta hai, jo turant zyada comfortable hai aur long-term mein healthier bhi. Ye woh sabse common posture mistake hai jo self-taught beginners saalon tak bina notice kiye carry karte hain.

**Standing posture**, jab wahan pahuncho (strap zaroori hai): strap ko adjust karo taaki guitar roughly WAHI height aur angle par baithe jaise sahi se baithe hue hoti hai. Bahut neeche latakti guitar fretting wrist ko ek bad angle mein force karti hai bilkul flat neck ki tarah — "rockstar low" cool dikhta hai aur simultaneously bad habits sikhata hai; seekhte waqt use higher adjust karo, aur baad mein neeche karo jab technique compensate karne layak solid ho jaaye.

**Pick grip precision shuru mein kyun matter karta hai:** bahut deep pakda hua pick (bahut sara nikla hua) string se takraane par flex aur wobble karta hai, ek inconsistent, scratchy tone banata hai aur fast strumming ya picking control karna kahin zyada hard banata hai. Bahut shallow pakda hua pick (bahut kam tip exposed) pakadna hard hai aur mid-strum slip out hone ki tendency rakhta hai. 3-5mm range wahi sweet spot hai jispe lagbhag har teacher exactly inhi mechanical reasons se converge karta hai — ye ek arbitrary rule nahi hai.`,

    examples: [
      {
        title: 'Correct sitting posture, side view',
        titleHi: 'Sahi sitting posture, side view',
        code: `Checklist before every practice session:
[ ] Feet flat on the floor
[ ] Guitar waist resting on right leg (mirrored if left-handed)
[ ] Neck angled up ~30-45°, not flat
[ ] Both shoulders relaxed and level
[ ] Pick: 3-5mm of tip exposed past thumb+index`,
        explain:
          'Run through this checklist out loud before every practice session for the first couple of weeks, until it becomes automatic. It takes ten seconds and it is the cheapest insurance against building the two most common bad habits this early.',
        explainHi:
          'Pehle kuch hafton tak har practice session se pehle ye checklist zor se bolkar check karo, jab tak ye automatic na ban jaaye. Ismein das seconds lagte hain aur ye is early stage ki do sabse common bad habits ke against sabse sasta insurance hai.',
      },
    ],

    mistakes: [
      {
        wrong: 'Letting the neck lie flat/horizontal "because it feels stable" while you\'re still getting used to holding the guitar.',
        right: 'Angle the neck up roughly 30-45 degrees from the start — brace it against your body/leg for stability instead of flattening it.',
        why: 'A flat neck forces a sharp, unnatural wrist bend on your fretting hand that causes fatigue quickly and is a known contributor to long-term wrist strain if it becomes habit.',
        whyHi: 'Flat neck fretting hand par ek sharp, unnatural wrist bend force karta hai jo jaldi fatigue cause karta hai aur agar habit ban jaaye to long-term wrist strain ka ek known contributor hai.',
      },
      {
        wrong: 'Gripping the pick deep inside a closed fist, like holding a knife.',
        right: 'Hold the pick lightly between the pad of your thumb and the side of your index finger, with only the tip peeking out.',
        why: 'A fist grip removes all the wrist flexibility strumming needs and makes the pick strike strings at an inconsistent angle every time, producing scratchy, uneven tone.',
        whyHi: 'Fist grip strumming ke liye zaroori saari wrist flexibility hata deta hai aur pick ko har baar ek inconsistent angle par strings strike karwata hai, jo scratchy, uneven tone banata hai.',
      },
    ],

    realWorld: [
      {
        en: 'Professional guitar teachers check posture and grip before they check anything about chords or theory, in the very first lesson — because every technical problem a student has months later usually traces back to one of these two habits, formed and never corrected on day one.',
        hi: 'Professional guitar teachers chords ya theory ke baare mein kuch bhi check karne se pehle, bilkul pehle lesson mein, posture aur grip check karte hain — kyunki mahino baad student ki har technical problem usually in do habits mein se ek tak trace hoti hai, jo day one par bani aur kabhi correct nahi hui.',
      },
    ],

    interviewQA: [
      {
        q: 'Can I learn lying down or with the guitar flat on my lap like a table?',
        qHi: 'Kya main leti hui ya guitar ko lap par table ki tarah flat rakhkar seekh sakta hoon?',
        a: 'You can experiment, but it will make correct fretting-hand and picking-hand mechanics noticeably harder to build, since both the wrist angles and your view of the fretboard change. Build the habit correctly seated first; you can adapt to other positions later once the mechanics are solid.',
        aHi: 'Experiment kar sakte ho, lekin ye correct fretting-hand aur picking-hand mechanics banana noticeably harder bana dega, kyunki wrist angles aur fretboard ka view dono badal jaate hain. Pehle correctly seated habit banao; ek baar mechanics solid ho jaayein to baad mein doosri positions mein adapt kar sakte ho.',
      },
    ],

    exercises: [
      {
        task: 'Sit down, get into correct posture using the checklist, and hold that position (guitar resting, no playing) for 60 seconds while breathing normally. Notice any shoulder or wrist tension and adjust until there is none.',
        taskHi: 'Baitho, checklist use karke correct posture mein aao, aur us position ko (guitar resting, kuch bajaye bina) 60 seconds tak hold karo, normally breathe karte hue. Kisi bhi shoulder ya wrist tension ko notice karo aur tab tak adjust karo jab tak koi na bache.',
        hint: 'If your shoulder rises toward your ear within those 60 seconds, the guitar\'s resting position — not your muscles — is what needs to change.',
        hintHi: 'Agar 60 seconds ke andar shoulder ear ki taraf uthe, guitar ki resting position — muscles nahi — hai jise badalna hai.',
      },
    ],

    keyTakeaways: [
      'Angle the neck up ~30-45° from horizontal — never flat — to keep your fretting wrist in a healthy, neutral position.',
      'Grip the pick between thumb and index finger, with only 3-5mm of the tip exposed.',
      'A bad posture or grip habit formed in week one is expensive to unlearn later — fix it now, not eventually.',
    ],
    keyTakeawaysHi: [
      'Neck ko horizontal se ~30-45° upar angle karo — kabhi flat nahi — fretting wrist ko ek healthy, neutral position mein rakhne ke liye.',
      'Pick ko thumb aur index finger ke beech pakdo, sirf 3-5mm tip exposed ke saath.',
      'Week one mein bani ek bad posture ya grip habit baad mein unlearn karna expensive hai — abhi fix karo, eventually nahi.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'strings-frets-and-notes',
    title: 'String Numbers, Fret Numbers & How Notes Work',
    titleHi: 'String Numbers, Fret Numbers Aur Notes Kaise Kaam Karte Hain',
    description: 'The exact vocabulary — which finger, which string, which fret — that every chord diagram in this course speaks in.',
    descriptionHi: 'Exact vocabulary — kaunsi finger, kaunsi string, kaunsa fret — jismein is course ka har chord diagram baat karta hai.',
    difficulty: 'EASY',
    duration: 20,
    order: 3,

    analogy: {
      en: '**A grid map, like a spreadsheet.** Think of the fretboard as a spreadsheet: strings are the ROWS (numbered 1-6), frets are the COLUMNS (numbered 1, 2, 3... starting near the headstock). Any single note is just "row 3, column 2" — string 3, fret 2. Every chord diagram you will ever see is just a filled-in version of this same tiny spreadsheet.',
      hi: '**Ek grid map, spreadsheet ki tarah.** Fretboard ko ek spreadsheet ki tarah socho: strings ROWS hain (1-6 number), frets COLUMNS hain (1, 2, 3... headstock ke paas se shuru). Koi bhi single note bas "row 3, column 2" hai — string 3, fret 2. Jo bhi chord diagram tum kabhi dekhoge wo bas isi chhoti spreadsheet ka ek filled-in version hai.',
    },

    simple: `**Reading a chord diagram, piece by piece:**

- The 6 vertical lines are the 6 strings — string 6 (thick, low E) on the left, string 1 (thin, high e) on the right, exactly matching how you look down at the guitar in playing position.
- The horizontal lines are frets. The thick top line is the **nut** (fret "0" — an open string).
- A colored dot means "press this string down at this fret." The number inside is WHICH FINGER to use (1=index, 2=middle, 3=ring, 4=pinky — from Module 1's finger diagram).
- A green **O** above a string means "play it open" (don't press anything).
- A red **X** above a string means "don't play this string at all."

**Fretting technique, the one rule that fixes 90% of beginner buzz:** press JUST BEHIND the fret wire (on the headstock side of it), not on top of it and not in the middle of the gap. Pressing right behind the fret needs the least force and gives the cleanest tone — pressing in the middle of the gap needs much more finger strength and often still buzzes.`,
    simpleHi: `**Ek chord diagram padhna, piece by piece:**

- 6 vertical lines 6 strings hain — string 6 (moti, low E) left mein, string 1 (patli, high e) right mein, exactly waise hi jaise tum playing position mein guitar ko neeche dekhte ho.
- Horizontal lines frets hain. Thick top line **nut** hai (fret "0" — ek open string).
- Ek colored dot ka matlab hai "is string ko is fret par dabao." Andar wala number batata hai KAUNSI FINGER use karni hai (1=index, 2=middle, 3=ring, 4=pinky — Module 1 ke finger diagram se).
- Ek string ke upar green **O** ka matlab hai "ise open bajao" (kuch mat dabao).
- Ek string ke upar red **X** ka matlab hai "is string ko bilkul mat bajao."

**Fretting technique, wo ek rule jo 90% beginner buzz fix karta hai:** fret wire ke bilkul PEECHE dabao (uske headstock wali side par), na ki uske upar aur na ki gap ke beech mein. Fret ke bilkul peeche dabane mein sabse kam force lagti hai aur sabse clean tone milti hai — gap ke beech mein dabane ke liye kahin zyada finger strength chahiye aur usually phir bhi buzz karta hai.`,

    content: `**Open strings, named.** Standard tuning, low to high: **E A D G B E**. Notice the low and high strings are BOTH "E" — two octaves apart (an octave is the same note name, just higher or lower). The mnemonic from Lesson 1 — "Eddie Ate Dynamite, Good Bye Eddie" — gives you this exact sequence, one word per string, low to high.

**Why frets get closer together as you go up the neck.** Each fret raises the pitch by a fixed musical ratio, not a fixed physical distance — and a fixed RATIO applied to a shrinking remaining string length produces a shrinking physical gap. You don't need the math to play, just the pattern recognition: frets 1-5 are noticeably wide, frets 12+ are noticeably narrow, and that's normal, not a manufacturing defect.

**Fret 12 is special:** it's exactly one octave above the open string (same note name, double the pitch). Guitars usually have a distinct inlay marker there (often a double-dot) specifically because it's a genuinely useful reference point, not decoration.

**"Fretting" vs. "picking/strumming" hands, named clearly from here on:** your **fretting hand** presses strings against frets (left hand for right-handed players). Your **picking hand** (or **strumming hand**) strikes the strings with a pick or fingers (right hand for right-handed players). This course will always use these two terms instead of "left hand / right hand," since left-handed players hold the guitar mirrored — "fretting hand" and "picking hand" stay correct regardless of which physical hand that is for you.`,
    contentHi: `**Open strings, named.** Standard tuning, low se high: **E A D G B E**. Notice karo low aur high strings DONO "E" hain — do octaves apart (octave same note name hai, bas higher ya lower). Lesson 1 ka mnemonic — "Eddie Ate Dynamite, Good Bye Eddie" — tumhe exactly ye sequence deta hai, ek word per string, low se high.

**Neck ke upar jaate hue frets kyun paas aate jaate hain.** Har fret pitch ko ek fixed musical ratio se upar uthata hai, ek fixed physical distance se nahi — aur ek shrinking remaining string length par apply hua fixed RATIO ek shrinking physical gap produce karta hai. Bajaane ke liye math ki zaroorat nahi, bas pattern recognition: frets 1-5 noticeably wide hote hain, frets 12+ noticeably narrow hote hain, aur ye normal hai, manufacturing defect nahi.

**Fret 12 special hai:** ye open string se exactly ek octave upar hai (same note name, double pitch). Guitars mein usually wahan ek distinct inlay marker hota hai (often ek double-dot) specifically kyunki ye ek genuinely useful reference point hai, decoration nahi.

**"Fretting" vs "picking/strumming" hands, yahan se clearly named:** tumhari **fretting hand** strings ko frets ke against dabati hai (right-handed players ke liye left hand). Tumhari **picking hand** (ya **strumming hand**) pick ya fingers se strings strike karti hai (right-handed players ke liye right hand). Ye course "left hand / right hand" ke bajaye hamesha ye do terms use karega, kyunki left-handed players guitar ko mirrored pakadte hain — "fretting hand" aur "picking hand" hamesha correct rehte hain chahe tumhare liye ye physically koi bhi hand ho.`,

    examples: [
      {
        title: 'Your first chord: E minor (Em) — only 2 fretted notes',
        titleHi: 'Tumhara pehla chord: E minor (Em) — sirf 2 fretted notes',
        code: `Em
  E |---0---   open
  A |---2---   finger 2
  D |---2---   finger 3
  G |---0---   open
  B |---0---   open
  E |---0---   open

Only strings A and D are fretted. Everything else rings open.`,
        previewHeight: 330,
        preview: chordPreviewHtml(
          CHORDS.Em,
          'Em: press string A (5th) at fret 2 with finger 2, string D (4th) at fret 2 with finger 3. Every other string rings open.',
        ),
        explain:
          "Em only needs two fingers, which is exactly why it's traditionally the first chord ever taught — it lets you focus entirely on fretting-hand mechanics (pressing behind the fret, one finger per string) without also juggling four different finger positions at once.",
        explainHi:
          "Em ko sirf do fingers chahiye, aur exactly isi wajah se ye traditionally sabse pehla sikhaya jaane wala chord hai — ye tumhe poori tarah fretting-hand mechanics par focus karne deta hai (fret ke peeche dabana, ek finger per string) bina ek saath char alag finger positions bhi juggle kiye.",
      },
    ],

    mistakes: [
      {
        wrong: 'Pressing a string down in the middle of the gap between two frets.',
        right: 'Press just behind (on the headstock side of) the fret wire, as close to it as comfortably possible.',
        why: 'Pressing in the middle of the gap requires much more finger force to get a clean sound, and often still produces a buzz — pressing right behind the fret gives a clean note with minimum effort, since the fret wire itself does most of the work of stopping the string.',
        whyHi: 'Gap ke beech mein dabane ke liye clean sound ke liye kahin zyada finger force chahiye, aur usually phir bhi buzz karta hai — fret ke bilkul peeche dabana minimum effort mein clean note deta hai, kyunki fret wire khud string ko rokne ka zyadatar kaam kar deta hai.',
      },
      {
        wrong: 'Reading a chord diagram top-to-bottom as if it were a list, and losing track of which vertical line is which string.',
        right: 'Always orient by the string names printed along the bottom (or top) of the diagram — low E on the left, high e on the right — before reading any finger positions.',
        why: 'Every chord diagram in this course (and everywhere else) uses this exact left-to-right string order; anchoring on it first prevents pressing the wrong string entirely.',
        whyHi: 'Is course (aur har jagah) ka har chord diagram exactly ye left-to-right string order use karta hai; pehle isi par anchor karna bilkul galat string press karne se bachata hai.',
      },
    ],

    realWorld: [
      {
        en: 'Tuner apps and clip-on tuners both show you a note name (like "E" or "A") and whether you\'re sharp/flat of it — being fluent in the E-A-D-G-B-E string names from this lesson is what makes tuning fast instead of a guessing game.',
        hi: 'Tuner apps aur clip-on tuners dono tumhe ek note name dikhate hain (jaise "E" ya "A") aur ye ki tum uske sharp/flat ho ya nahi — is lesson ke E-A-D-G-B-E string names mein fluent hona hi tuning ko ek guessing game ke bajaye fast banata hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Do the fret numbers reset if I use a capo?',
        qHi: 'Agar main capo use karoon to kya fret numbers reset ho jaate hain?',
        a: "No — fret numbers are physical positions on the neck and never change. A capo just creates a new \"open\" position higher up; chord shapes are then counted relative to the capo, which Module 14 covers in full.",
        aHi: 'Nahi — fret numbers neck par physical positions hain aur kabhi nahi badalte. Ek capo bas upar ek nayi "open" position create karta hai; chord shapes phir capo ke relative count hote hain, jo Module 14 mein poori tarah cover hota hai.',
      },
    ],

    exercises: [
      {
        task: 'Fret string A at fret 2 with finger 2 alone, pluck it, and listen for buzz. Move your finger slightly toward the fret wire (not away from it) and pluck again — the buzz should reduce or disappear.',
        taskHi: 'String A ko fret 2 par akele finger 2 se dabao, pluck karo, aur buzz sunno. Finger ko thoda fret wire ki taraf move karo (usse door nahi) aur dobara pluck karo — buzz kam ya khatam ho jaana chahiye.',
        hint: 'If it still buzzes right against the fret, the string likely isn\'t being pressed all the way down — increase pressure slightly before assuming your finger position is wrong.',
        hintHi: 'Agar fret ke bilkul against bhi buzz karta hai, likely string poori tarah neeche press nahi ho rahi — apni finger position galat maanne se pehle thoda pressure badhao.',
      },
    ],

    keyTakeaways: [
      'A chord diagram is a spreadsheet: strings are rows (6=left/thick to 1=right/thin), frets are columns.',
      'Standard tuning, low to high: E A D G B E — "Eddie Ate Dynamite, Good Bye Eddie."',
      'Press just BEHIND the fret wire, never in the middle of the gap or on top of the wire.',
      '"Fretting hand" and "picking hand" are used instead of "left/right" throughout this course, since they stay correct for left-handed players too.',
    ],
    keyTakeawaysHi: [
      'Ek chord diagram ek spreadsheet hai: strings rows hain (6=left/moti se 1=right/patli), frets columns hain.',
      'Standard tuning, low se high: E A D G B E — "Eddie Ate Dynamite, Good Bye Eddie."',
      'Fret wire ke bilkul PEECHE dabao, kabhi gap ke beech mein ya wire ke upar nahi.',
      '"Fretting hand" aur "picking hand" is poore course mein "left/right" ke bajaye use hote hain, kyunki ye left-handed players ke liye bhi correct rehte hain.',
    ],
    guitarPractice: { earTraining: [{"string":0,"fret":0},{"string":1,"fret":0},{"string":2,"fret":0},{"string":3,"fret":0},{"string":4,"fret":0},{"string":5,"fret":0}] },
  },
];
