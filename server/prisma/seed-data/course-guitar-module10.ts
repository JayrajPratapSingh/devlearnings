/**
 * Guitar Course — Module 10: How To Practice, Not Just Play, lessons 1-3.
 *
 * Lesson 1: Spaced repetition and chunking — the two biggest levers for
 *           learning guitar fast, borrowed from general learning science.
 * Lesson 2: The slow-then-fast principle, formalized (building on hints
 *           dropped since Module 3 and Module 9).
 * Lesson 3: Structuring an actual practice session, start to finish.
 */

import type { CourseLesson } from './course-js-module1';

export const GUITAR_MODULE_10: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'spaced-repetition-and-chunking',
    title: 'Spaced Repetition and Chunking',
    titleHi: 'Spaced Repetition Aur Chunking',
    description: 'The two biggest levers for learning guitar fast, borrowed directly from general learning science, not guitar-specific folklore.',
    descriptionHi: 'Guitar fast seekhne ke do sabse bade levers, general learning science se directly borrowed, guitar-specific folklore nahi.',
    difficulty: 'EASY',
    duration: 15,
    order: 1,

    analogy: {
      en: '**Watering a plant a little every day vs. flooding it once a month.** A plant watered consistently, in small amounts, thrives. The same amount of water dumped once a month either overflows uselessly or barely helps before the plant dries out again. Skill-building works the same way: distributed, moderate practice beats occasional binges of the exact same total time.',
      hi: '**Ek plant ko roz thoda paani dena vs mahine mein ek baar flood karna.** Consistently, small amounts mein watered ek plant thrive karta hai. Wahi amount of water mahine mein ek baar dumped ya to uselessly overflow karta hai ya barely help karta hai plant ke dobara dry hone se pehle. Skill-building bilkul waise hi kaam karta hai: distributed, moderate practice occasional binges of the exact same total time se better hai.',
    },

    simple: `**Spaced repetition, in plain terms:** revisiting something repeatedly with TIME GAPS in between beats reviewing it repeatedly all at once. This is already baked into Module 3\'s practice schedule (short daily sessions instead of one long weekly one) — this lesson explains WHY that structure works, not just that it does.

**Chunking, in plain terms:** breaking a big skill into small, independently-practiceable pieces, mastering each piece, then combining them — rather than attempting the whole big thing at once from day one. Module 3\'s chromatic exercise (isolating finger independence from chord-shape memory) and Module 6\'s two-chord loop drill (isolating one chord CHANGE from a whole song) are both chunking in action, even though neither lesson used that word explicitly.

**Why this course has been using both principles since Module 1, even before naming them here:** naming them now, retroactively, turns a set of individual techniques you\'ve already experienced into one coherent framework you can apply to ANY new skill this course introduces later, not just the specific examples already covered.`,
    simpleHi: `**Spaced repetition, plain terms mein:** kisi cheez ko baar-baar TIME GAPS ke saath revisit karna, use ek saath baar-baar review karne se better hai. Ye already Module 3 ke practice schedule mein baked in hai (short daily sessions ek lambe weekly session ke bajaye) — ye lesson explain karta hai ki wo structure WHY kaam karta hai, sirf ye nahi ki karta hai.

**Chunking, plain terms mein:** ek badi skill ko chhote, independently-practiceable pieces mein todna, har piece ko master karna, phir unhe combine karna — day one se poori badi cheez try karne ke bajaye. Module 3 ka chromatic exercise (finger independence ko chord-shape memory se isolate karna) aur Module 6 ka two-chord loop drill (ek chord CHANGE ko poore song se isolate karna) dono chunking action mein hain, chahe kisi bhi lesson ne wo word explicitly use nahi kiya.

**Ye course Module 1 se hi dono principles kyun use kar raha hai, yahan unhe naam dene se pehle bhi:** ab unhe retroactively naam dena individual techniques ka ek set jo tumne already experience kiya hai ek coherent framework mein badal deta hai jise tum is course ke baad introduce hone wali KISI BHI nayi skill par apply kar sakte ho, sirf already-covered specific examples par nahi.`,

    content: `**Why spaced repetition works, biologically speaking (in plain terms).** Memory consolidation — the process that turns a fresh, fragile attempt into durable, automatic skill — happens significantly during REST, not just during active practice. A gap between sessions gives that consolidation process time to actually happen; back-to-back cramming skips the consolidation window entirely, which is why a 3-hour single session produces less durable learning than the same 3 hours spread across a week (the exact same reasoning Module 3 used for calluses, now applied to motor-skill memory instead of skin).

**Why chunking works: cognitive load.** A human brain can only actively juggle a small number of new, unautomated things at once. Attempting a full song on day one means juggling chord shapes, chord changes, strumming pattern, AND timing simultaneously — four unautomated skills at once, which overwhelms working memory and produces slow, error-riddled practice. Isolating just one of those four (a chunk) lets that one thing become automatic through focused reps, after which it stops consuming active attention and can be combined with the next chunk.

**A genuinely important nuance: chunks need to be reassembled eventually.** Chunking isn\'t "only ever practice tiny isolated pieces forever" — it\'s "master pieces individually, THEN deliberately practice combining them." Module 13\'s actual songs are exactly that combination step, applied to everything chunked separately across Modules 1-12.`,
    contentHi: `**Spaced repetition biologically kaise kaam karta hai (plain terms mein).** Memory consolidation — wo process jo ek fresh, fragile attempt ko durable, automatic skill mein badalta hai — significantly REST ke dauraan hota hai, sirf active practice ke dauraan nahi. Sessions ke beech ek gap us consolidation process ko actually hone ka time deta hai; back-to-back cramming consolidation window ko poori tarah skip kar deta hai, yahi reason hai ki ek 3-hour single session ek hafte mein spread hui usi 3 hours se kam durable learning produce karta hai (bilkul wahi reasoning jo Module 3 ne calluses ke liye use ki thi, ab motor-skill memory par apply hote hue skin ke bajaye).

**Chunking kyun kaam karta hai: cognitive load.** Ek human brain ek time par sirf thodi si new, unautomated cheezein actively juggle kar sakta hai. Day one par ek poora song attempt karna matlab hai chord shapes, chord changes, strumming pattern, AUR timing ko simultaneously juggle karna — ek saath char unautomated skills, jo working memory ko overwhelm karta hai aur slow, error-riddled practice produce karta hai. Un char mein se sirf ek ko (ek chunk) isolate karna us ek cheez ko focused reps ke through automatic banne deta hai, jiske baad wo active attention consume karna band kar deti hai aur agle chunk ke saath combine ho sakti hai.

**Ek genuinely important nuance: chunks ko eventually reassemble hona hai.** Chunking "hamesha sirf tiny isolated pieces practice karo" nahi hai — ye "pieces ko individually master karo, PHIR deliberately unhe combine karne ki practice karo" hai. Module 13 ke real songs exactly wahi combination step hain, jo Modules 1-12 mein separately chunk ki gayi har cheez par apply hota hai.`,

    examples: [
      {
        title: 'Chunking a new song, hypothetically',
        titleHi: 'Ek naye song ko hypothetically chunk karna',
        code: `Instead of: attempt the whole song at full speed on day 1.

Chunk it:
1. Learn each individual chord shape needed (if any are new).
2. Loop-drill (Module 6) each chord CHANGE the song requires, separately.
3. Practice the strum pattern alone, on a single chord, with a metronome.
4. Only then, combine: chords + changes + pattern + timing, together, slowly.
5. Gradually increase tempo once the combination is solid.`,
        explain:
          "This is the general chunking template this course will implicitly follow for every future skill — recognizing this pattern means you can apply it to material beyond this course too, not just what's explicitly chunked for you here.",
        explainHi:
          "Ye general chunking template hai jise ye course implicitly har future skill ke liye follow karega — is pattern ko recognize karna matlab hai tum ise is course se pare material par bhi apply kar sakte ho, sirf wahi nahi jo yahan explicitly tumhare liye chunk kiya gaya hai.",
      },
    ],

    mistakes: [
      {
        wrong: 'Attempting a full new song or complex skill all at once, getting overwhelmed, and concluding "I\'m just not ready for this yet."',
        right: 'Break it into chunks (chord shapes, then changes, then pattern, then combination) and master each piece before combining.',
        why: 'Feeling overwhelmed by a non-chunked skill is a predictable, universal cognitive-load response, not a sign of personal unreadiness — the fix is restructuring HOW you practice it, not waiting until you\'re somehow magically ready for the unchunked version.',
        whyHi: 'Ek non-chunked skill se overwhelmed feel karna ek predictable, universal cognitive-load response hai, personal unreadiness ka sign nahi — fix ye hai ki tum use kaise practice karte ho use restructure karna, kisi tarah magically unchunked version ke liye ready hone ka wait karna nahi.',
      },
    ],

    realWorld: [
      {
        en: 'Spaced repetition is the exact same principle behind flashcard apps used for language learning and medical school memorization — it\'s a general learning-science finding, not something specific to music, which is exactly why it transfers so directly here.',
        hi: 'Spaced repetition exactly wahi principle hai jo language learning aur medical school memorization ke liye use hone wale flashcard apps ke peeche hai — ye ek general learning-science finding hai, music ke liye specific kuch nahi, exactly yahi reason hai ki ye yahan itni directly transfer hoti hai.',
      },
    ],

    interviewQA: [
      {
        q: 'How small should a "chunk" actually be?',
        qHi: 'Ek "chunk" actually kitna small hona chahiye?',
        a: "Small enough that you can focus on it without also juggling something else unautomated at the same time. If you notice yourself struggling with two different things simultaneously (a chord shape AND a strum pattern, say), that's usually a sign to chunk smaller, not push through.",
        aHi: 'Itna small ki tum kuch aur unautomated saath mein juggle kiye bina uspe focus kar sako. Agar tum khud ko ek saath do alag cheezon se struggle karte hue paao (ek chord shape AUR ek strum pattern, say), ye usually ek chota chunk banane ka sign hai, through push karne ka nahi.',
      },
    ],

    exercises: [
      {
        task: 'Pick any skill from this course you\'re still shaky on. Write down how you\'d break it into 3-4 smaller chunks, in the order you\'d master them.',
        taskHi: 'Is course se koi bhi skill pick karo jismein tum abhi bhi shaky ho. Likho ki tum use 3-4 chhote chunks mein kaise todoge, us order mein jismein tum unhe master karoge.',
        hint: 'If you can\'t think of a way to break something down further, that itself might already be an appropriately-sized chunk — not everything needs subdividing.',
        hintHi: 'Agar tumhe kisi cheez ko aur todne ka tareeka na sooje, ho sakta hai wo khud already ek appropriately-sized chunk ho — sab kuch subdivide hone ki zaroorat nahi.',
      },
    ],

    keyTakeaways: [
      'Spaced repetition: short, repeated sessions with rest between them build durable skill better than occasional long sessions — the same principle behind Module 3\'s callus timeline.',
      'Chunking: isolate one unautomated skill at a time rather than juggling several at once, then deliberately recombine them once each is solid.',
      'Both principles have been used implicitly since Module 1 — this lesson names them so you can apply them to any future skill deliberately.',
    ],
    keyTakeawaysHi: [
      'Spaced repetition: unke beech rest ke saath short, repeated sessions occasional long sessions se better durable skill build karte hain — wahi principle jo Module 3 ke callus timeline ke peeche hai.',
      'Chunking: ek time par ek saath kai juggle karne ke bajaye ek unautomated skill ko isolate karo, phir har ek solid hone par deliberately unhe recombine karo.',
      'Dono principles Module 1 se implicitly use ho rahe hain — ye lesson unhe naam deta hai taaki tum unhe kisi bhi future skill par deliberately apply kar sako.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'the-slow-then-fast-principle',
    title: 'The Slow-Then-Fast Principle, Formalized',
    titleHi: 'Slow-Then-Fast Principle, Formalized',
    description: 'Bringing together the "start embarrassingly slow" idea from Module 9 into a general, named principle you can apply everywhere.',
    descriptionHi: '"Embarrassingly slow shuru karo" idea ko Module 9 se ek general, named principle mein saath laana jise tum har jagah apply kar sakte ho.',
    difficulty: 'EASY',
    duration: 10,
    order: 2,

    analogy: {
      en: '**Learning a dance routine at half-speed before performing it live.** No dancer learns a fast, complex routine by immediately attempting it at full performance speed — they walk through it slowly first, build the correct pattern into muscle memory, then gradually speed up. Guitar technique follows the exact same arc.',
      hi: '**Ek dance routine half-speed par seekhna use live perform karne se pehle.** Koi dancer ek fast, complex routine turant full performance speed par attempt karke nahi seekhta — wo pehle use slowly walk through karte hain, correct pattern ko muscle memory mein build karte hain, phir gradually speed up karte hain. Guitar technique exact same arc follow karta hai.',
    },

    simple: `**The principle, stated generally:** for any new physical skill, practice slowly enough that you can execute it CORRECTLY every single time, then increase speed only in small steps, only once the current speed is fully reliable.

**Why this course has been teaching this same idea repeatedly, in different clothes:** Module 3\'s "slow, clean motion over speed" for the chromatic exercise, Module 6\'s minimal-motion drill, and Module 9\'s metronome step-down method are all this exact same principle, applied to three different specific skills. Recognizing the common thread means you don\'t need a brand-new explanation every time a new skill needs this treatment — you already know the move.

**A simple test for "am I going too fast, too soon":** if you're making the same specific mistake repeatedly at a given speed, that's the signal to slow down, not push through. Repeating a mistake doesn't "burn it off" — it reinforces it.`,
    simpleHi: `**Principle, generally stated:** kisi bhi new physical skill ke liye, itna slowly practice karo ki tum ise har single baar CORRECTLY execute kar sako, phir speed ko sirf small steps mein badhao, sirf ek baar jab current speed fully reliable ho.

**Ye course ye same idea baar-baar, alag clothes mein kyun sikha raha hai:** Module 3 ka chromatic exercise ke liye "slow, clean motion speed se zyada," Module 6 ka minimal-motion drill, aur Module 9 ka metronome step-down method sab exactly yahi same principle hain, teen alag specific skills par apply hue. Common thread recognize karna matlab hai tumhe har baar ek nayi skill ko is treatment ki zaroorat hone par ek brand-new explanation ki zaroorat nahi — tumhe already move pata hai.

**"Kya main bahut jaldi, bahut fast ja raha hoon" ke liye ek simple test:** agar tum ek given speed par baar-baar wahi specific mistake kar rahe ho, ye slow down karne ka signal hai, through push karne ka nahi. Ek mistake repeat karna use "burn off" nahi karta — ye use reinforce karta hai.`,

    content: `**Why naming a recurring principle explicitly has real value, beyond just tidiness.** Once you recognize "oh, this is another slow-then-fast situation" the moment a new challenging skill appears, you skip the initial confusion/frustration phase entirely — you already know the correct response (slow down, get it clean, speed up gradually) instead of needing to rediscover it through frustration each time.

**The precise definition of "too fast," restated cleanly.** A speed is too fast specifically when your error rate at that speed is meaningfully higher than at a slightly slower one — not when it merely feels effortful or slightly uncomfortable (effort and discomfort while learning are normal; a rising error rate is the actual warning sign). This distinction matters because avoiding all discomfort would mean never progressing at all, while ignoring a rising error rate means reinforcing mistakes.

**How this principle will show up again later in the course**, so you recognize it on sight: barre chords (Module 17) are notoriously tempting to rush because the payoff (a whole new category of chords) feels close — resist that, and apply slow-then-fast there too. Lead guitar techniques (Modules 22-25) are built almost entirely on this principle, since clean fast lead playing is fundamentally clean slow playing sped up correctly.`,
    contentHi: `**Ek recurring principle ko explicitly naam dena tidiness se pare genuinely value kyun rakhta hai.** Ek baar jab tum recognize karte ho "oh, ye ek aur slow-then-fast situation hai" jis moment ek nayi challenging skill appear hoti hai, tum initial confusion/frustration phase ko poori tarah skip kar dete ho — tumhe already correct response pata hai (slow down karo, clean karo, gradually speed up karo) use har baar frustration ke through rediscover karne ki zaroorat ke bajaye.

**"Bahut fast" ki precise definition, cleanly restated.** Ek speed specifically tab bahut fast hai jab us speed par tumhara error rate ek thodi si slower speed se meaningfully zyada ho — sirf tab nahi jab ye effortful ya thoda uncomfortable feel kare (seekhte waqt effort aur discomfort normal hain; ek rising error rate actual warning sign hai). Ye distinction matter karta hai kyunki saare discomfort ko avoid karna matlab hoga kabhi progress na karna, jabki rising error rate ignore karna matlab hai mistakes ko reinforce karna.

**Ye principle course mein baad mein dobara kaise dikhega**, taaki tum ise sight par recognize karo: barre chords (Module 17) notoriously rush karne ke liye tempting hote hain kyunki payoff (chords ki ek poori nayi category) close feel karta hai — us se resist karo, aur wahan bhi slow-then-fast apply karo. Lead guitar techniques (Modules 22-25) almost poori tarah is principle par bane hain, kyunki clean fast lead playing fundamentally clean slow playing hai jo correctly speed up hui hai.`,

    examples: [
      {
        title: 'The error-rate test for "too fast"',
        titleHi: '"Bahut fast" ke liye error-rate test',
        code: `At tempo A: 8/10 attempts clean.
At tempo B (slightly faster): 3/10 attempts clean.

Tempo B is currently too fast — not because it feels hard,
but because the error rate jumped sharply. Stay at tempo A
(or between A and B) until error rate improves, then retry B.`,
        explain:
          "Quantifying this with an actual ratio, even roughly, removes the guesswork and emotional judgment from the decision — \"too fast\" becomes a measurable fact about your error rate, not a feeling you have to interpret.",
        explainHi:
          "Ise ek actual ratio ke saath quantify karna, roughly bhi, decision se guesswork aur emotional judgment hata deta hai — \"bahut fast\" tumhare error rate ke baare mein ek measurable fact ban jaata hai, ek feeling nahi jise tumhe interpret karna padta hai.",
      },
    ],

    mistakes: [
      {
        wrong: 'Pushing through a speed where mistakes keep happening, assuming repetition alone will eventually smooth it out.',
        right: 'Drop back to a speed with a low error rate, solidify there, then increase in smaller steps.',
        why: 'Repeating a mistake at a too-fast speed reinforces the mistake itself as muscle memory, making it genuinely harder to unlearn later than if you\'d simply practiced correctly at a slower speed from the start.',
        whyHi: 'Ek bahut-fast speed par ek mistake repeat karna mistake ko khud muscle memory ki tarah reinforce karta hai, jo baad mein use unlearn karna genuinely harder bana deta hai us se jo hota agar tumne shuru se ek slower speed par correctly practice kiya hota.',
      },
    ],

    realWorld: [
      {
        en: 'This exact principle is standard across sports coaching, dance, martial arts, and music education alike — it\'s not a guitar-specific trick, it\'s how motor skills reliably get built in every physical discipline.',
        hi: 'Ye exact principle sports coaching, dance, martial arts, aur music education ke across equally standard hai — ye koi guitar-specific trick nahi hai, ye hai ki motor skills har physical discipline mein reliably kaise build hoti hain.',
      },
    ],

    interviewQA: [
      {
        q: 'Is there ever a case where "just push through at full speed" is actually the right call?',
        qHi: 'Kya kabhi ek case hai jahan "bas full speed par push through karo" actually sahi call hai?',
        a: "Rarely, and generally not while a skill is still new. Once something is already deeply automatic, occasional high-intensity pushes can have a place — but that's a refinement for already-solid skills, not a substitute for building the skill correctly in the first place.",
        aHi: 'Rarely, aur generally nahi jab ek skill abhi bhi nayi ho. Ek baar jab kuch already deeply automatic ho, occasional high-intensity pushes ki ek jagah ho sakti hai — lekin ye already-solid skills ke liye ek refinement hai, pehli jagah skill ko correctly build karne ka substitute nahi.',
      },
    ],

    exercises: [
      {
        task: 'Pick any drill from Modules 3, 6, or 9. Run the error-rate test from the example above at two nearby tempos and identify your current honest "too fast" threshold.',
        taskHi: 'Modules 3, 6, ya 9 se koi bhi drill pick karo. Upar wale example ka error-rate test do nearby tempos par chalao aur apna current honest "bahut fast" threshold identify karo.',
        hint: 'Writing down the actual threshold you find (not just a vague impression) makes Module 9\'s tempo-increase tracking more concrete going forward.',
        hintHi: 'Actual threshold jo tumhe mile use likhna (sirf ek vague impression nahi) Module 9 ke tempo-increase tracking ko aage badhte hue zyada concrete banata hai.',
      },
    ],

    keyTakeaways: [
      'Slow-then-fast: practice correctly at a speed with a low error rate, increase speed only in small steps once solid.',
      '"Too fast" means a meaningfully higher error rate, not just effort or discomfort — effort while learning is normal.',
      'This principle recurs throughout the rest of the course (barre chords, lead guitar) — recognizing it saves re-learning the response each time.',
    ],
    keyTakeawaysHi: [
      'Slow-then-fast: ek low error rate wali speed par correctly practice karo, sirf solid hone par small steps mein speed badhao.',
      '"Bahut fast" ka matlab hai meaningfully higher error rate, sirf effort ya discomfort nahi — seekhte waqt effort normal hai.',
      'Ye principle course ke baaki hisse mein recur hota hai (barre chords, lead guitar) — ise recognize karna har baar response ko re-learn karne se bachaata hai.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'structuring-a-practice-session',
    title: 'Structuring an Actual Practice Session',
    titleHi: 'Ek Actual Practice Session Structure Karna',
    description: 'Putting spaced repetition, chunking, and slow-then-fast together into one concrete session template, start to finish.',
    descriptionHi: 'Spaced repetition, chunking, aur slow-then-fast ko saath mein ek concrete session template mein daalna, start se finish tak.',
    difficulty: 'EASY',
    duration: 15,
    order: 3,

    analogy: {
      en: '**A workout with a warm-up, main sets, and a cool-down — not just randomly lifting things.** An effective gym session has structure: warm up, work the main goal, wind down. An unstructured session — just picking up weights randomly until tired — wastes time and risks injury. Guitar practice benefits from the exact same shape.',
      hi: '**Ek workout jismein warm-up, main sets, aur ek cool-down ho — sirf randomly cheezein na uthana.** Ek effective gym session mein structure hota hai: warm up karo, main goal par kaam karo, wind down karo. Ek unstructured session — bas randomly weights uthaana jab tak thak na jao — time waste karta hai aur injury risk karta hai. Guitar practice ko exact same shape se benefit milta hai.',
    },

    simple: `**A concrete session template (adjust timing to your own Module 3 schedule):**

1. **Warm-up (3-5 min):** Module 3's chromatic run and spider walk. Every session, no exceptions.
2. **Review (5 min):** play through something you already know solidly — a chord, a pattern, a short progression. This is spaced repetition in action, not wasted time.
3. **New material (10-15 min):** the actual focus of this session — one chunk (Lesson 1) of a new skill, practiced slow-then-fast (Lesson 2).
4. **Cool-down / fun (2-5 min):** play something you enjoy, with no performance pressure — just for the sake of playing.

**Why the order matters, briefly:** warming up before new material prevents forcing cold, stiff fingers into your hardest work of the session; reviewing known material before new material primes successful motor patterns first, which measurably helps new-material acquisition right after.`,
    simpleHi: `**Ek concrete session template (apne khud ke Module 3 schedule ke hisaab se timing adjust karo):**

1. **Warm-up (3-5 min):** Module 3 ka chromatic run aur spider walk. Har session, bina exception ke.
2. **Review (5 min):** kuch bajao jo tumhe already solidly pata hai — ek chord, ek pattern, ek short progression. Ye spaced repetition action mein hai, wasted time nahi.
3. **New material (10-15 min):** is session ka actual focus — ek naye skill ka ek chunk (Lesson 1), slow-then-fast (Lesson 2) practice kiya hua.
4. **Cool-down / fun (2-5 min):** kuch bajao jo tumhe enjoy ho, bina kisi performance pressure ke — bas bajaane ke liye.

**Order briefly kyun matter karta hai:** naye material se pehle warm up karna cold, stiff fingers ko session ke hardest kaam mein force karne se rokta hai; naye material se pehle known material review karna successful motor patterns ko pehle prime karta hai, jo turant baad new-material acquisition mein measurably help karta hai.`,

    content: `**Why a fixed template beats "just practice whatever feels right that day."** An unstructured approach reliably drifts toward practicing what's already comfortable (since it feels more rewarding moment to moment) and avoiding what's genuinely still difficult — exactly backwards from where practice time is most valuable. A template with a dedicated "new material" slot forces confronting the actually-useful hard stuff, every session, rather than only when motivation happens to be high.

**Why the cool-down step is not optional fluff.** Ending every single session on effortful new material, with no unpressured playing at all, is a reliable way to make practice feel like a chore over time — which threatens the whole practice-schedule habit from Module 3 far more than any single skipped technical drill would. A few minutes of pure enjoyment closes the loop on why you\'re doing this in the first place.

**How this template scales with the 15-20 minute minimum from Module 3.** On a tight 15-minute day: 3 min warm-up, 3 min review, 7 min new material, 2 min cool-down — the proportions matter more than the exact minute counts, and every session should still touch all four phases even when compressed, rather than dropping a phase entirely to save time.`,
    contentHi: `**Ek fixed template "us din jo sahi feel kare bas wahi practice karo" se kyun better hai.** Ek unstructured approach reliably us cheez ki taraf drift karta hai jo already comfortable hai (kyunki ye moment to moment zyada rewarding feel karta hai) aur us cheez ko avoid karta hai jo genuinely abhi bhi difficult hai — exactly ulta wahan se jahan practice time sabse valuable hai. Ek dedicated "new material" slot wala template actually-useful hard stuff ko confront karne ke liye force karta hai, har session, sirf tab nahi jab motivation high ho.

**Cool-down step optional fluff kyun nahi hai.** Har single session ko effortful new material par khatam karna, bina kisi unpressured playing ke, practice ko time ke saath ek chore jaisa feel karwaane ka ek reliable tareeka hai — jo Module 3 ki poori practice-schedule habit ko kisi bhi single skipped technical drill se kahin zyada threaten karta hai. Kuch minutes ka pure enjoyment loop close karta hai ki tum ye pehli jagah kyun kar rahe ho.

**Ye template Module 3 ke 15-20 minute minimum ke saath kaise scale karta hai.** Ek tight 15-minute din par: 3 min warm-up, 3 min review, 7 min new material, 2 min cool-down — exact minute counts se zyada proportions matter karte hain, aur har session ko phir bhi saare char phases touch karne chahiye chahe compressed ho, time bachaane ke liye ek phase ko poori tarah drop karne ke bajaye.`,

    examples: [
      {
        title: 'Two versions of the template, 20-minute and 15-minute',
        titleHi: 'Template ke do versions, 20-minute aur 15-minute',
        code: `20-minute session:
  5 min warm-up | 5 min review | 8 min new material | 2 min cool-down

15-minute session (compressed, same proportions, nothing dropped):
  3 min warm-up | 3 min review | 7 min new material | 2 min cool-down`,
        explain:
          "Keeping all four phases even under time pressure, just shorter, is the key design choice here — it's tempting to just cut warm-up or cool-down entirely on a tight day, but that erodes the habit structure Module 3 built, for the sake of a couple of extra minutes on new material.",
        explainHi:
          "Time pressure ke neeche bhi saare char phases ko rakhna, bas shorter, yahan key design choice hai — ek tight din par warm-up ya cool-down ko poori tarah cut karna tempting hai, lekin ye Module 3 ke bana hue habit structure ko erode karta hai, new material par kuch extra minutes ke liye.",
      },
    ],

    mistakes: [
      {
        wrong: 'Spending an entire practice session only on whatever feels fun or already comfortable that day.',
        right: 'Follow the four-phase template, ensuring a dedicated slot specifically for new, still-difficult material every session.',
        why: 'Comfortable material feels more immediately rewarding, which reliably crowds out the harder, more valuable practice unless a fixed structure specifically protects time for it.',
        whyHi: 'Comfortable material zyada immediately rewarding feel karta hai, jo reliably harder, zyada valuable practice ko crowd out karta hai jab tak ek fixed structure specifically uske liye time protect na kare.',
      },
    ],

    realWorld: [
      {
        en: 'This four-phase structure (warm-up, review, new material, cool-down) mirrors how effective practice is structured across sports, academic study, and other instruments — it\'s a general high-value-practice pattern, not a guitar-specific invention.',
        hi: 'Ye four-phase structure (warm-up, review, new material, cool-down) mirror karta hai ki sports, academic study, aur doosre instruments ke across effective practice kaise structured hoti hai — ye ek general high-value-practice pattern hai, koi guitar-specific invention nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'What if I only have 10 minutes some days — should I skip practice entirely?',
        qHi: 'Agar kuch dino mujhe sirf 10 minutes milein — kya mujhe practice poori tarah skip kar deni chahiye?',
        a: "No — compress the template further rather than skipping (even 2 min warm-up, 2 min review, 4 min new material, 2 min cool-down keeps the structure intact). Module 3's consistency principle values showing up regularly over any single session's length.",
        aHi: 'Nahi — skip karne ke bajaye template ko aur compress karo (2 min warm-up, 2 min review, 4 min new material, 2 min cool-down bhi structure ko intact rakhta hai). Module 3 ka consistency principle kisi bhi single session ki length se zyada regularly show up karne ko value karta hai.',
      },
    ],

    exercises: [
      {
        task: 'Run one full session today using the four-phase template, timing each phase roughly. Note afterward whether the structure felt helpful or got in the way.',
        taskHi: 'Aaj four-phase template use karke ek poora session chalao, har phase ko roughly time karte hue. Baad mein note karo ki structure helpful feel hua ya raste mein aaya.',
        hint: 'If the structure felt rigid rather than helpful, adjust the specific minute allocations rather than abandoning the four phases entirely — the phases themselves are the important part, not the exact timing.',
        hintHi: 'Agar structure helpful ke bajaye rigid feel hua, specific minute allocations adjust karo poore char phases ko abandon karne ke bajaye — phases khud important part hain, exact timing nahi.',
      },
    ],

    keyTakeaways: [
      'A four-phase session template: warm-up, review (spaced repetition), new material (chunked, slow-then-fast), cool-down.',
      'A dedicated new-material slot protects the hardest, most valuable practice from being crowded out by comfortable material.',
      'The cool-down phase isn\'t optional — it protects long-term motivation and the practice habit itself.',
      'Compress proportionally on short days rather than dropping a phase entirely.',
    ],
    keyTakeawaysHi: [
      'Ek four-phase session template: warm-up, review (spaced repetition), new material (chunked, slow-then-fast), cool-down.',
      'Ek dedicated new-material slot sabse hard, sabse valuable practice ko comfortable material se crowd out hone se protect karta hai.',
      'Cool-down phase optional nahi hai — ye long-term motivation aur practice habit ko khud protect karta hai.',
      'Short din par ek phase poori tarah drop karne ke bajaye proportionally compress karo.',
    ],
  },
];
