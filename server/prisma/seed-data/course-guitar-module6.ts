/**
 * Guitar Course — Module 6: Changing Chords Fast, lessons 1-3.
 *
 * Lesson 1: Anchor fingers — the general principle behind Em/Em7's
 *           "keep finger 2 planted" trick, applied across all six chords.
 * Lesson 2: Minimal-motion technique — why smaller finger movements beat
 *           fully lifting off the fretboard between chords.
 * Lesson 3: The two-chord loop drill — a concrete, timed practice method
 *           for building real chord-change speed.
 */

import type { CourseLesson } from './course-js-module1';
import { chordFamilyHtml } from './guitar-diagrams';
import { CHORDS } from './guitar-chords-data';

export const GUITAR_MODULE_6: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'anchor-fingers',
    title: 'Anchor Fingers: The Real Secret to Fast Chord Changes',
    titleHi: 'Anchor Fingers: Fast Chord Changes Ka Real Secret',
    description: 'Module 4 showed you one example (Em to Em7). Now the general principle, applied across every chord pair you know.',
    descriptionHi: 'Module 4 ne tumhe ek example dikhaya (Em se Em7). Ab wo general principle, tumhare jaante hue har chord pair par apply hota hua.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 1,

    analogy: {
      en: '**Repositioning furniture without emptying the whole room first.** A slow chord change lifts every finger off completely and rebuilds the next shape from nothing — like carrying every piece of furniture out of a room before rearranging it. A fast change identifies which pieces don\'t need to move at all, and only repositions what actually has to.',
      hi: '**Pehle poora room khaali kiye bina furniture reposition karna.** Ek slow chord change har finger ko poori tarah utha leta hai aur agla shape kuch bhi se rebuild karta hai — room ko rearrange karne se pehle uska har furniture bahar carry karne ki tarah. Ek fast change identify karta hai ki kaunse pieces bilkul move hone ki zaroorat nahi, aur sirf wahi reposition karta hai jo actually zaroori hai.',
    },

    simple: `**The anchor-finger method, in general:**

1. Before switching chords, look at BOTH shapes (the one you're leaving and the one you're going to).
2. Find any finger that's on the same string, doing something similar, in both shapes — or a finger that can simply stay put.
3. Keep that finger (or fingers) planted. Move only the fingers that actually need to change position.

**Real examples from chords you already know:**
- **Em -> Em7**: finger 2 stays on A-string fret 2 the whole time (you learned this exact case in Module 4).
- **Em -> G**: finger 2 is on A-string fret 2 in BOTH chords — an exact anchor, easy to miss since the two chords look quite different overall. Fingers 3 and 4 still need real repositioning (D-string fret 2 to low-E fret 3, and adding a new finger 4 on high-e fret 3), but that one anchor alone removes a third of the total motion needed.
- **Am -> C**: check it carefully, finger by finger, and something genuinely useful turns up — finger 1 (B-string, fret 1) and finger 2 (D-string, fret 2) are IDENTICAL in both chords, so both stay perfectly planted; only finger 3 actually moves, from G-string fret 2 over to A-string fret 3. Two full anchors out of three fingers, not zero — a pair that looks unrelated on the surface can hide a strong anchor once you actually check finger by finger instead of guessing from the chord names alone.`,
    simpleHi: `**Anchor-finger method, generally:**

1. Chords switch karne se pehle, DONO shapes dekho (jo chhod rahe ho aur jispe jaa rahe ho).
2. Koi bhi finger dhoondo jo same string par ho, dono shapes mein kuch similar kar raha ho — ya ek finger jo bas apni jagah rah sake.
3. Us finger (ya fingers) ko planted rakho. Sirf un fingers ko move karo jinhe actually position change karni hai.

**Real examples un chords se jo tumhe already pata hain:**
- **Em -> Em7**: finger 2 poori der A-string fret 2 par rehta hai (tumne ye exact case Module 4 mein seekha).
- **Em -> G**: finger 2 dono chords mein A-string fret 2 par hai — ek exact anchor, miss karna easy hai kyunki dono chords overall kaafi alag dikhte hain. Fingers 3 aur 4 ko abhi bhi real repositioning chahiye (D-string fret 2 se low-E fret 3, aur high-e fret 3 par ek nayi finger 4 add karte hue), lekin akela wo ek anchor total zaroori motion ka ek-tihai hata deta hai.
- **Am -> C**: finger by finger carefully check karo, aur kuch genuinely useful milta hai — finger 1 (B-string, fret 1) aur finger 2 (D-string, fret 2) dono chords mein IDENTICAL hain, isliye dono perfectly planted rehte hain; sirf finger 3 actually move karta hai, G-string fret 2 se A-string fret 3 tak. Teen fingers mein se do full anchors, zero nahi — ek pair jo surface par unrelated lagta hai wo ek strong anchor chhupa sakta hai ek baar jab tum guess karne ke bajaye actually finger by finger check karo.`,

    content: `**Why this is a genuine technique, not just "practice more."** Two players with identical finger strength and identical chord knowledge can have dramatically different chord-change speed purely because one of them wastes motion lifting fingers that never needed to move, while the other doesn't. This is a planning skill layered on top of the physical skill — you're deciding, consciously at first, what the MINIMUM required motion is before you execute it.

**The habit to build: look-ahead, not look-back.** Glance at the upcoming chord shape BEFORE you finish strumming the current one, so your brain has already identified the anchor and the required moves before your hand needs to act. This is exactly the kind of look-ahead reading fluent players do constantly, and it's learnable as a deliberate habit rather than something that only comes "naturally" after years.

**Not every pair has a clean anchor, and that's fine.** Some chord transitions genuinely require a near-total hand reset (Em to C, for instance, shares very little). The skill isn't "force an anchor to exist" — it's accurately recognizing which pairs actually have one and exploiting it when it does, while accepting a fuller reset when it doesn't.`,
    contentHi: `**Ye ek genuine technique kyun hai, "aur practice karo" nahi.** Identical finger strength aur identical chord knowledge wale do players ka chord-change speed purely isliye dramatically alag ho sakta hai kyunki unmein se ek un fingers ko lift karne mein motion waste karta hai jinhe kabhi move hone ki zaroorat hi nahi thi, jabki doosra nahi karta. Ye physical skill ke upar layered ek planning skill hai — tum, pehle consciously, decide kar rahe ho ki minimum required motion kya hai use execute karne se pehle.

**Banane wali habit: look-ahead, look-back nahi.** Aane wale chord shape ko current wale ko strum khatam karne SE PEHLE dekh lo, taaki tumhara brain hand ko act karne ki zaroorat se pehle hi anchor aur required moves identify kar chuka ho. Ye exactly wahi tarah ka look-ahead reading hai jo fluent players constantly karte hain, aur ye ek deliberate habit ki tarah learnable hai, kuch aisa nahi jo sirf saalon baad "naturally" aata hai.

**Har pair ka clean anchor nahi hota, aur ye theek hai.** Kuch chord transitions ko genuinely ek near-total hand reset chahiye (Em se C, for instance, bahut kam share karte hain). Skill "anchor ko force karke exist karwana" nahi hai — ye accurately recognize karna hai ki kaunse pairs mein actually ek hai aur jab hai tab use exploit karna, jab nahi hai tab ek fuller reset accept karte hue.`,

    examples: [
      {
        title: 'Em and Em7 — the clearest possible anchor example',
        titleHi: 'Em aur Em7 — sabse clear possible anchor example',
        code: `Em -> Em7:
  finger 2 (A-string, fret 2): STAYS
  finger 3 (D-string, fret 2): LIFTS (only this one moves)`,
        previewHeight: 330,
        preview: chordFamilyHtml([CHORDS.Em, CHORDS.Em7], 'Side by side: one finger differs. The anchor is everything that doesn\'t.'),
        explain:
          "This is Module 4's example again, now framed as the general technique rather than a one-off observation — the skill is applying this SAME kind of comparison to every chord pair you encounter, not just remembering this specific instance.",
        explainHi:
          "Ye Module 4 ka example hai dobara, ab ek one-off observation ke bajaye general technique ki tarah framed — skill yahi SAME tarah ka comparison har chord pair par apply karna hai jo tumhe milta hai, sirf ye specific instance yaad rakhna nahi.",
      },
    ],

    mistakes: [
      {
        wrong: 'Lifting all fingers completely off the fretboard between every chord change, even when an anchor finger is available.',
        right: 'Consciously check for a shared/anchor finger before every change, and keep it planted when one exists.',
        why: 'Every unnecessary full lift-and-replant costs time and re-introduces a chance for finger-placement error — the anchor finger is already correctly positioned, so keeping it there is strictly better.',
        whyHi: 'Har unnecessary full lift-and-replant time cost karta hai aur finger-placement error ka ek chance dobara introduce karta hai — anchor finger already correctly positioned hai, isliye use wahin rakhna strictly better hai.',
      },
    ],

    realWorld: [
      {
        en: 'Watch a fluent player\'s fretting hand during a fast chord progression — you\'ll notice certain fingers barely move between specific chord pairs while others jump. That\'s anchor-finger technique in action, not an illusion of speed.',
        hi: 'Ek fluent player ka fretting hand ek fast chord progression ke dauraan dekho — tum notice karoge ki kuch fingers specific chord pairs ke beech barely move karte hain jabki doosre jump karte hain. Ye anchor-finger technique action mein hai, speed ka illusion nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'How do I find anchor fingers for chord pairs not covered in this lesson?',
        qHi: 'Is lesson mein cover na hue chord pairs ke liye anchor fingers kaise dhoondhoon?',
        a: 'Look at both chord diagrams side by side (exactly like the example above) and check each finger individually: same string, same or nearby fret, in both shapes? That finger is a candidate anchor. Do this deliberately for every new chord pair until it becomes automatic.',
        aHi: 'Dono chord diagrams ko saath saath dekho (bilkul upar wale example jaisa) aur har finger ko individually check karo: same string, same ya nearby fret, dono shapes mein? Wo finger ek candidate anchor hai. Har naye chord pair ke liye ise deliberately karo jab tak automatic na ban jaaye.',
      },
    ],

    exercises: [
      {
        task: 'Take any two chords you know. Write down (or say out loud) which finger, if any, can act as an anchor between them, before physically trying the switch. Then try it and confirm your prediction was correct.',
        taskHi: 'Koi bhi do chords lo jo tumhe pata hain. Likho (ya zor se bolo) ki kaunsi finger, agar koi hai, unke beech anchor ki tarah act kar sakti hai, physically switch try karne se pehle. Phir try karo aur confirm karo ki tumhari prediction correct thi.',
        hint: 'Doing the prediction step BEFORE the physical attempt is what builds the look-ahead habit — skipping straight to trial and error misses the actual skill being trained here.',
        hintHi: 'Physical attempt se PEHLE prediction step karna hi wo hai jo look-ahead habit banata hai — seedha trial and error par jaana yahan actually train ho rahi skill miss kar deta hai.',
      },
    ],

    keyTakeaways: [
      'An anchor finger is any finger that can stay in place (or nearly so) across a chord change — identify it before moving, not during.',
      'Look ahead at the next chord shape before finishing the current strum, so the anchor is already identified when your hand needs to act.',
      'Not every chord pair has a clean anchor — the skill is accurate recognition, not forcing one to exist.',
    ],
    keyTakeawaysHi: [
      'Ek anchor finger koi bhi finger hai jo ek chord change ke across apni jagah (ya lagbhag) rah sakti hai — use move karne se pehle identify karo, dauraan nahi.',
      'Current strum khatam karne se pehle agli chord shape ko dekho, taaki jab hand ko act karna ho tab tak anchor already identify ho chuka ho.',
      'Har chord pair ka clean anchor nahi hota — skill accurate recognition hai, ek ko exist karne ke liye force karna nahi.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'minimal-motion-technique',
    title: 'Minimal-Motion Technique',
    titleHi: 'Minimal-Motion Technique',
    description: 'Why hovering fingers close to the fretboard, instead of lifting them far away, is a real speed multiplier.',
    descriptionHi: 'Fingers ko fretboard ke paas hover karna, unhe door lift karne ke bajaye, ek real speed multiplier kyun hai.',
    difficulty: 'MEDIUM',
    duration: 15,
    order: 2,

    analogy: {
      en: '**A sprinter\'s short, quick steps vs. exaggerated bounding strides.** Counterintuitively, small, controlled motions cover ground faster in short bursts than big dramatic ones — a sprinter takes rapid short steps, not a few giant leaps. Fretting-hand fingers that travel the shortest necessary distance between positions, instead of flying far off the strings, switch chords measurably faster.',
      hi: '**Ek sprinter ke short, quick steps vs exaggerated bounding strides.** Counterintuitively, small, controlled motions short bursts mein bade dramatic motions se zyada fast ground cover karte hain — ek sprinter rapid short steps leta hai, kuch giant leaps nahi. Fretting-hand fingers jo positions ke beech sabse shortest necessary distance travel karte hain, strings se door fly karne ke bajaye, measurably faster chords switch karte hain.',
    },

    simple: `**The technique:** when a finger lifts off a string during a chord change, lift it just barely clear of the string — a few millimeters — not several centimeters into the air. Hover it close, then bring it straight down to its next position.

**Why this feels wrong at first:** it feels like you have "more control" lifting fingers high and clearly, and for absolute beginners focused purely on accuracy, that's a reasonable temporary crutch. But as accuracy solidifies (Module 3's territory), holding onto big lifts purely out of habit actively caps your speed — the finger physically has farther to travel every single time.

**A simple drill:** form Em. Lift finger 3 just 2-3mm off the D string, hold for a second, then replace it in the exact same spot. Repeat 10 times, focusing entirely on keeping the lift small and controlled.`,
    simpleHi: `**Technique:** jab ek chord change ke dauraan ek finger string se lift hoti hai, use bas barely string se clear lift karo — kuch millimeters — hawa mein several centimeters nahi. Use close hover karo, phir seedha apni next position par le aao.

**Ye shuru mein galat kyun feel karta hai:** ye lagta hai ki fingers ko high aur clearly lift karne se "zyada control" milta hai, aur absolute beginners ke liye jo purely accuracy par focused hain, ye ek reasonable temporary crutch hai. Lekin jaise jaise accuracy solidify hoti hai (Module 3 ka territory), sirf habit ki wajah se bade lifts ko pakde rehna actively tumhari speed cap karta hai — finger ko physically har single baar zyada distance travel karni padti hai.

**Ek simple drill:** Em banao. Finger 3 ko D string se bas 2-3mm lift karo, ek second hold karo, phir use exact same spot par wapas rakho. 10 baar repeat karo, lift ko small aur controlled rakhne par poori tarah focus karte hue.`,

    content: `**The physics reasoning, made explicit.** Distance traveled directly costs time, all else being equal — this is just true, not a matter of opinion or style. A finger lifted 5mm off a string and brought back down travels a much shorter round trip than one lifted 4cm off — multiply that difference by every finger, every chord change, across an entire song, and it becomes a very real, measurable speed difference, not a marginal one.

**Why beginners naturally over-lift, and why that's genuinely fine at first.** When accuracy isn't yet reliable, a bigger, more deliberate motion gives more visual and proprioceptive feedback about where the finger is — it's a reasonable scaffold while the buzz-pressure sense (Module 3) and finger-curl habits are still solidifying. The goal isn't to eliminate big lifts on day one; it's to consciously start shrinking them once accuracy is no longer the bottleneck.

**Combining with anchor fingers (Lesson 1):** minimal motion applies MOST directly to the fingers that do need to move, since anchor fingers ideally don't move at all. The two techniques work together: keep what can stay still perfectly still, and move what must move as little as possible.`,
    contentHi: `**Physics reasoning, explicitly banaya gaya.** Travel ki gayi distance directly time cost karti hai, baaki sab equal hote hue — ye bas true hai, opinion ya style ka matter nahi. Ek finger jo string se 5mm lift hoti hai aur wapas neeche aati hai ek bahut chhota round trip travel karti hai us finger se jo 4cm lift hoti hai — us difference ko har finger se, har chord change se, poore song ke across multiply karo, aur ye ek bahut real, measurable speed difference ban jaata hai, marginal nahi.

**Beginners naturally over-lift kyun karte hain, aur ye shuru mein genuinely theek kyun hai.** Jab accuracy abhi reliable nahi hai, ek bada, zyada deliberate motion finger kahan hai iske baare mein zyada visual aur proprioceptive feedback deta hai — ye ek reasonable scaffold hai jab tak buzz-pressure sense (Module 3) aur finger-curl habits abhi solidify ho rahi hain. Goal day one par bade lifts eliminate karna nahi hai; ye consciously unhe shrink karna shuru karna hai ek baar jab accuracy bottleneck na rahe.

**Anchor fingers ke saath combine karna (Lesson 1):** minimal motion sabse directly un fingers par apply hota hai jinhe actually move hona hai, kyunki anchor fingers ideally bilkul move nahi hote. Dono techniques saath kaam karte hain: jo bilkul still rah sakta hai use perfectly still rakho, aur jise move hona hai use kam se kam move karo.`,

    examples: [
      {
        title: 'The 3mm lift drill',
        titleHi: '3mm lift drill',
        code: `1. Form Em.
2. Lift finger 3 barely off the D string (2-3mm).
3. Hold 1 second.
4. Replace finger 3 in the exact same spot.
5. Repeat 10 times.
Then try the same drill with a much bigger lift (several cm) and compare how each feels and how long each takes.`,
        explain:
          "Deliberately comparing a small lift to a large one back to back makes the time/effort difference tangible rather than theoretical — most players are genuinely surprised how much slower the big-lift version feels once they do this side-by-side comparison.",
        explainHi:
          "Ek chhoti lift ko ek badi lift se deliberately back to back compare karna time/effort difference ko theoretical ke bajaye tangible banata hai — zyadatar players genuinely surprised hote hain ki big-lift version kitna slower feel karta hai ek baar jab wo ye side-by-side comparison karte hain.",
      },
    ],

    mistakes: [
      {
        wrong: 'Continuing to lift fingers dramatically high off the strings well after accuracy has become reliable, purely out of ingrained habit.',
        right: 'Once a chord shape feels reliably accurate, deliberately practice shrinking the lift height for that specific transition.',
        why: 'An old habit doesn\'t self-correct just because the reason for it (uncertain accuracy) has resolved — shrinking lift height has to be a deliberate, separate practice step.',
        whyHi: 'Ek purani habit apne aap self-correct nahi hoti sirf isliye kyunki uska reason (uncertain accuracy) resolve ho gaya — lift height shrink karna ek deliberate, separate practice step hona chahiye.',
      },
    ],

    realWorld: [
      {
        en: 'This is a big part of why recordings of fast rhythm guitar parts often look almost lazy or minimal on video — the player isn\'t moving less because they\'re not trying hard, they\'re moving less because it\'s mechanically faster.',
        hi: 'Ye ek bada reason hai ki fast rhythm guitar parts ki recordings video par aksar almost lazy ya minimal dikhti hain — player kam move nahi kar raha kyunki wo hard try nahi kar raha, wo kam move kar raha hai kyunki ye mechanically faster hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Will minimal motion make my chords sound worse or less "confident"?',
        qHi: 'Kya minimal motion mere chords ko worse ya kam "confident" sound karwayega?',
        a: "No — the sound comes from clean fretting and clean strumming, not from how far your fingers travel between chords. If anything, minimal motion tends to produce MORE consistent timing, since there's less variability in how long each transition takes.",
        aHi: 'Nahi — sound clean fretting aur clean strumming se aata hai, fingers chords ke beech kitna travel karte hain usse nahi. Agar kuch hai, minimal motion usually MORE consistent timing produce karta hai, kyunki har transition mein kitna time lagta hai usmein kam variability hoti hai.',
      },
    ],

    exercises: [
      {
        task: 'Pick any two chords you know with no clear anchor finger. Practice switching between them 10 times, deliberately keeping every finger\'s lift height small, timing yourself on the full set of 10 switches.',
        taskHi: 'Koi bhi do chords pick karo jo tumhe pata hain bina kisi clear anchor finger ke. Unke beech 10 baar switch karne ki practice karo, deliberately har finger ki lift height ko small rakhte hue, saare 10 switches ke poore set par khud ko time karte hue.',
        hint: 'Compare your time to a version where you deliberately lift fingers high and dramatically — the difference is usually large enough to be obvious even without precise timing equipment.',
        hintHi: 'Apna time ek aise version se compare karo jahan tum deliberately fingers ko high aur dramatically lift karte ho — difference usually itna bada hota hai ki precise timing equipment ke bina bhi obvious ho.',
      },
    ],

    keyTakeaways: [
      'Lift fingers just clear of the string (a few mm), not far into the air — distance traveled directly costs time.',
      'Big lifts are a reasonable early-accuracy scaffold, but should be deliberately shrunk once a shape feels reliable.',
      'Minimal motion and anchor fingers work together: keep anchors perfectly still, move everything else as little as possible.',
    ],
    keyTakeawaysHi: [
      'Fingers ko string se bas clear lift karo (kuch mm), hawa mein door nahi — travel ki gayi distance directly time cost karti hai.',
      'Bade lifts ek reasonable early-accuracy scaffold hain, lekin ek shape reliable feel karte hi deliberately shrink karne chahiye.',
      'Minimal motion aur anchor fingers saath kaam karte hain: anchors ko perfectly still rakho, baaki sab ko kam se kam move karo.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'two-chord-loop-drill',
    title: 'The Two-Chord Loop Drill',
    titleHi: 'Two-Chord Loop Drill',
    description: 'A concrete, timed, repeatable method for actually building chord-change speed — not just knowing the theory of it.',
    descriptionHi: 'Actually chord-change speed build karne ka ek concrete, timed, repeatable method — sirf iski theory jaanna nahi.',
    difficulty: 'MEDIUM',
    duration: 15,
    order: 3,

    analogy: {
      en: '**Interval training, for your hands.** Athletes build speed with structured, repeated, timed intervals — not by vaguely "trying to go faster" during a normal run. The two-chord loop drill is interval training for chord changes: a specific, measurable, repeatable structure, not vague practice.',
      hi: '**Interval training, apne hands ke liye.** Athletes structured, repeated, timed intervals se speed build karte hain — normal run ke dauraan vaguely "faster jaane ki koshish" karke nahi. Two-chord loop drill chord changes ke liye interval training hai: ek specific, measurable, repeatable structure, vague practice nahi.',
    },

    simple: `**The drill:**

1. Pick two chords you know (start with Em <-> Em7, since it has a clean anchor).
2. Set a timer for 60 seconds.
3. Switch between the two chords repeatedly, strumming once per chord, as cleanly as you can, for the full 60 seconds.
4. Count how many clean switches you completed (a switch only counts if the resulting chord actually rang clean — messy switches don't count).
5. Record that number. Next session, try to beat it, on the same chord pair.

**Progression:** once a pair feels fast and easy, move to a HARDER pair (less anchor overlap) and reset your count for that new pair. Difficulty should increase gradually, chord-pair by chord-pair, not all at once.`,
    simpleHi: `**Drill:**

1. Do chords pick karo jo tumhe pata hain (Em <-> Em7 se start karo, kyunki iska clean anchor hai).
2. 60 seconds ka timer set karo.
3. Dono chords ke beech repeatedly switch karo, har chord par ek baar strum karte hue, jitna clean ho sake, poore 60 seconds ke liye.
4. Count karo kitne clean switches complete kiye (ek switch tabhi count hota hai jab resulting chord actually clean ring kare — messy switches count nahi hote).
5. Wo number record karo. Agle session mein, usi chord pair par, use beat karne ki koshish karo.

**Progression:** ek baar jab ek pair fast aur easy feel kare, ek HARDER pair par jao (kam anchor overlap) aur us naye pair ke liye apna count reset karo. Difficulty gradually badhni chahiye, chord-pair by chord-pair, ek saath nahi.`,

    content: `**Why a hard number (count, not a vague feeling) matters.** "I feel like I'm getting faster" is unfalsifiable and easy to fool yourself about. A literal count of clean switches in 60 seconds is an objective, comparable number across sessions — this is the same practice-science principle Module 10 will formalize (measurable, specific goals beat vague ones), applied concretely here first.

**Why "only clean switches count" is the crucial rule, not an afterthought.** Without this rule, the drill silently rewards rushing and sloppiness — you could "improve" your count by simply playing faster and messier, which is the opposite of the actual goal. Requiring cleanliness keeps speed and accuracy improving together, never trading one for the other.

**Why progress through chord-pair difficulty gradually, one pair at a time.** Jumping straight to a hard, anchor-less pair before an easy anchored pair feels automatic wastes the confidence and clean technique the easy pair was building — sequencing difficulty, the same way this whole course sequences chords, keeps each new challenge appropriately sized rather than overwhelming.`,
    contentHi: `**Ek hard number (count, vague feeling nahi) kyun matter karta hai.** "Mujhe lagta hai main fast ho raha hoon" unfalsifiable hai aur khud ko fool karna easy hai. 60 seconds mein clean switches ka ek literal count sessions ke across ek objective, comparable number hai — ye wahi practice-science principle hai jo Module 10 formalize karega (measurable, specific goals vague ones se better hain), yahan pehle concretely apply hote hue.

**"Sirf clean switches count hote hain" crucial rule kyun hai, afterthought nahi.** Is rule ke bina, drill chupke se rushing aur sloppiness ko reward karta hai — tum apna count sirf faster aur messier bajakar "improve" kar sakte ho, jo actual goal ke ulta hai. Cleanliness require karna speed aur accuracy ko saath improve karte rakhta hai, kabhi ek ko doosre ke liye trade kiye bina.

**Chord-pair difficulty ke through gradually, ek time par ek pair, kyun progress karein.** Ek easy anchored pair ke automatic feel karne se pehle seedha ek hard, anchor-less pair par jump karna us confidence aur clean technique ko waste karta hai jo easy pair bana raha tha — difficulty ko sequence karna, jaise ye poora course chords sequence karta hai, har naye challenge ko appropriately sized rakhta hai, overwhelming nahi.`,

    examples: [
      {
        title: 'A realistic progression of drill pairs, easiest to hardest',
        titleHi: 'Drill pairs ki ek realistic progression, easiest se hardest',
        code: `1. Em <-> Em7   (1 of 2 fingers anchored: finger 2)
2. Em <-> G     (1 of ~3 fingers anchored: finger 2, easy to miss)
3. Am <-> C     (2 of 3 fingers anchored — more than it looks!)
4. C  <-> G     (0 shared fingers — the real speed test)`,
        explain:
          "This isn't a strict difficulty ladder — Am<->C actually has MORE anchor overlap than Em<->G despite sounding like a bigger jump on paper, which is exactly the point of Lesson 1's method: always check finger by finger, never assume from how different or similar two chords sound or look overall.",
        explainHi:
          "Ye ek strict difficulty ladder nahi hai — Am<->C mein actually Em<->G se zyada anchor overlap hai, chahe paper par ye ek bada jump lage, jo exactly Lesson 1 ke method ka point hai: hamesha finger by finger check karo, kabhi assume mat karo do chords kitne different ya similar overall sound ya dikhte hain us se.",
      },
    ],

    mistakes: [
      {
        wrong: 'Counting a switch as successful even when the resulting chord buzzed or had a muted string, just to get a higher number.',
        right: 'Only count switches where the chord actually rang clean — be honest with the count even when it\'s lower than you\'d like.',
        why: 'An inflated, dishonest count defeats the entire purpose of having an objective measurement — you\'d be tracking and "improving" a number that no longer reflects real skill.',
        whyHi: 'Ek inflated, dishonest count ek objective measurement rakhne ka poora purpose defeat karta hai — tum ek aisa number track aur "improve" kar rahe hoge jo ab real skill reflect nahi karta.',
      },
    ],

    realWorld: [
      {
        en: 'This exact drill structure (timed, counted, progressively harder) is used across countless skill domains beyond guitar — typing speed tests, sports drills, even language-learning apps use the same core idea: make progress measurable, then chase the number honestly.',
        hi: 'Ye exact drill structure (timed, counted, progressively harder) guitar se pare countless skill domains ke across use hota hai — typing speed tests, sports drills, yahan tak ki language-learning apps bhi wahi core idea use karte hain: progress ko measurable banao, phir honestly us number ko chase karo.',
      },
    ],

    interviewQA: [
      {
        q: 'What\'s a "good" number of clean switches in 60 seconds for a beginner?',
        qHi: 'Beginner ke liye 60 seconds mein clean switches ka "achha" number kya hai?',
        a: "There's no universal target — what matters is your own number going up over sessions on the same pair, not comparing to someone else's. A wide range is normal depending on chord pair difficulty and individual progress speed.",
        aHi: 'Koi universal target nahi hai — jo matter karta hai wo tumhara apna number hai jo same pair par sessions ke across upar jaata hai, kisi aur se compare karna nahi. Chord pair difficulty aur individual progress speed ke hisaab se ek wide range normal hai.',
      },
    ],

    exercises: [
      {
        task: 'Run the Em <-> Em7 loop drill for a real, timed 60 seconds today. Record your clean-switch count somewhere you\'ll see it again (notes app, or the schedule you wrote in Module 3).',
        taskHi: 'Aaj Em <-> Em7 loop drill ek real, timed 60 seconds ke liye chalao. Apna clean-switch count kahin record karo jahan tum use dobara dekhoge (notes app, ya wo schedule jo tumne Module 3 mein likha tha).',
        hint: 'Writing the number down (not just remembering it) is what makes next session\'s comparison actually happen — an unrecorded number is easy to forget or misremember optimistically.',
        hintHi: 'Number likh kar rakhna (sirf yaad rakhna nahi) hi wo hai jo agle session ka comparison actually hone deta hai — ek unrecorded number bhoolna ya optimistically misremember karna easy hai.',
      },
    ],

    keyTakeaways: [
      'The loop drill: 60 seconds, switch repeatedly between 2 chords, count only clean switches, record the number.',
      'Only clean switches count — an honest, accurate count is what makes the drill meaningful.',
      'Progress through chord pairs from most anchor overlap to least, one pair at a time, not all at once.',
    ],
    keyTakeawaysHi: [
      'Loop drill: 60 seconds, 2 chords ke beech repeatedly switch karo, sirf clean switches count karo, number record karo.',
      'Sirf clean switches count hote hain — ek honest, accurate count hi drill ko meaningful banata hai.',
      'Chord pairs ke through most anchor overlap se least tak progress karo, ek time par ek pair, ek saath nahi.',
    ],
  },
];
