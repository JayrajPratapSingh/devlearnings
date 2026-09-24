/**
 * Guitar Course — Module 9: Timing & the Metronome, lessons 1-3.
 *
 * Lesson 1: Why timing beats speed — reframing what "good rhythm playing"
 *           actually means.
 * Lesson 2: Practicing with a metronome/click without hating it — concrete
 *           technique for making click-practice productive, not miserable.
 * Lesson 3: Common beginner timing mistakes, named and fixed.
 */

import type { CourseLesson } from './course-js-module1';

export const GUITAR_MODULE_9: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'why-timing-beats-speed',
    title: 'Why Timing Beats Speed',
    titleHi: 'Timing Speed Se Better Kyun Hai',
    description: 'Reframing the actual goal — a slower, perfectly steady player sounds better than a faster, wobbly one, every time.',
    descriptionHi: 'Actual goal ko reframe karna — ek slower, perfectly steady player ek faster, wobbly player se better sound karta hai, har baar.',
    difficulty: 'EASY',
    duration: 15,
    order: 1,

    analogy: {
      en: '**A metronome-steady walk vs. a sprint that keeps tripping.** A person walking at a perfectly steady pace looks more capable and controlled than someone sprinting in bursts and stumbling. Listeners react to guitar playing the same way — steady, even timing at a modest speed sounds more skilled than fast playing that speeds up and slows down unpredictably.',
      hi: '**Ek metronome-steady walk vs ek sprint jo baar-baar trip karta hai.** Perfectly steady pace par chalta hua insaan bursts mein sprint karke stumble karne wale se zyada capable aur controlled dikhta hai. Listeners guitar playing par bhi waise hi react karte hain — modest speed par steady, even timing fast playing se zyada skilled sound karti hai jo unpredictably speed up aur slow down karti hai.',
    },

    simple: `**The reframe this lesson asks you to make:** "good rhythm guitar" means STEADY timing, not fast timing. A slow, perfectly even strum pattern genuinely sounds more musical and more skilled than a fast one that rushes and drags unpredictably.

**Why beginners chase speed instead of steadiness by default:** speed is the more visible, more easily bragged-about metric ("I can play this at 120 bpm!"), while steadiness is invisible until it's missing — you notice bad timing immediately but rarely consciously praise good timing, so it's easy to under-value while learning.

**A genuinely useful mental model:** imagine every practice session has an invisible metronome running whether or not you're using a real one. Your goal isn't to beat that invisible clock, it's to match it exactly, every single strum — speed is just what happens naturally once matching is reliable at a given tempo.`,
    simpleHi: `**Ye lesson jo reframe karne ko kehta hai:** "achhi rhythm guitar" ka matlab hai STEADY timing, fast timing nahi. Ek slow, perfectly even strum pattern genuinely ek fast pattern se zyada musical aur zyada skilled sound karta hai jo unpredictably rush aur drag karta hai.

**Beginners default se steadiness ke bajaye speed kyun chase karte hain:** speed zyada visible, zyada easily bragged-about metric hai ("Main ise 120 bpm par bajaa sakta hoon!"), jabki steadiness tab tak invisible hai jab tak missing na ho — bad timing turant notice hoti hai lekin achhi timing ki consciously rarely tareef hoti hai, isliye seekhte waqt ise under-value karna easy hai.

**Ek genuinely useful mental model:** imagine karo ki har practice session mein ek invisible metronome chal raha hai chahe tum ek real use kar rahe ho ya nahi. Tumhara goal us invisible clock ko beat karna nahi hai, use exactly match karna hai, har single strum — speed bas wo hai jo naturally hota hai ek baar jab ek given tempo par matching reliable ho jaaye.`,

    content: `**The concrete cost of unsteady timing, made explicit.** When timing wobbles, every OTHER musician (or backing track, or singer) has to either fight against your drift or give up trying to play together with you — unsteady timing isn't just a personal imperfection, it actively breaks the ability to play with anyone else. Clean technique with wobbly timing is far less usable in a real musical context than simpler technique with rock-solid timing.

**Why "slow it down until it's perfect" is the correct response to a timing struggle**, not a failure to admit. If a pattern falls apart at a given tempo, that tempo is temporarily too fast for reliable execution — slowing down until it IS reliable, then gradually increasing tempo, is the standard, correct progression, not a consolation prize for not being "good enough" yet. Every experienced player built speed this exact way.

**This connects directly to Module 3's practice-schedule material.** Just as consistent short sessions build calluses better than marathon ones, consistent practice AT A TEMPO YOU CAN ACTUALLY HOLD STEADY builds real timing skill better than occasionally attempting a too-fast tempo and mostly failing at it. Slower-but-steady practice reps are simply more valuable reps than faster-but-wobbly ones.`,
    contentHi: `**Unsteady timing ka concrete cost, explicitly banaya gaya.** Jab timing wobble karti hai, har DOOSRE musician (ya backing track, ya singer) ko ya to tumhare drift ke against fight karna padta hai ya tumhare saath bajaane ki koshish chhodni padti hai — unsteady timing sirf ek personal imperfection nahi hai, ye actively kisi aur ke saath bajaane ki ability ko break kar deti hai. Wobbly timing ke saath clean technique ek real musical context mein rock-solid timing ke saath simpler technique se kahin kam usable hai.

**"Isse tab tak slow karo jab tak perfect na ho" ek timing struggle ka correct response kyun hai**, ek admission of failure nahi. Agar ek pattern ek given tempo par gir jaata hai, wo tempo temporarily reliable execution ke liye bahut fast hai — tab tak slow karna jab tak wo reliable NA ho jaaye, phir gradually tempo badhana, standard, correct progression hai, abhi tak "achha nahi" hone ka ek consolation prize nahi. Har experienced player ne speed exactly is tarah build ki.

**Ye directly Module 3 ke practice-schedule material se connect hota hai.** Bilkul jaise consistent short sessions marathon sessions se better calluses build karte hain, ek TEMPO PAR CONSISTENT PRACTICE JISE TUM ACTUALLY STEADY HOLD KAR SAKO real timing skill ko kabhi kabhi ek bahut-fast tempo try karne aur zyadatar usmein fail hone se better build karta hai. Slower-but-steady practice reps simply faster-but-wobbly reps se zyada valuable reps hain.`,

    examples: [
      {
        title: 'The self-test: is your timing actually steady?',
        titleHi: 'Self-test: kya tumhari timing actually steady hai?',
        code: `1. Play any strum pattern you know for 8 full rounds, at a comfortable tempo.
2. Record yourself (phone voice memo is fine).
3. Listen back — does the tempo stay constant, or does it speed up/slow down anywhere?
4. Most beginners are surprised by drift they didn't feel while playing but can clearly hear on playback.`,
        explain:
          'Recording yourself is worth calling out specifically here because timing drift is genuinely hard to perceive in the moment (you\'re focused on chord shapes and strum motion) but very easy to hear on playback — this is a real, actionable diagnostic tool, not a vague suggestion.',
        explainHi:
          'Khud ko record karna yahan specifically call out karne layak hai kyunki timing drift moment mein genuinely perceive karna hard hai (tum chord shapes aur strum motion par focused ho) lekin playback par sunna bahut easy hai — ye ek real, actionable diagnostic tool hai, ek vague suggestion nahi.',
      },
    ],

    mistakes: [
      {
        wrong: 'Practicing a pattern at the fastest tempo you can almost-but-not-quite hold together, treating occasional success as "close enough."',
        right: 'Practice at the fastest tempo you can hold PERFECTLY steady, every single time, and only increase tempo once that\'s reliable.',
        why: '"Almost holding together" reinforces exactly the wobbly timing this lesson is trying to eliminate — the tempo you actually practice at should be one where success is the norm, not the exception.',
        whyHi: '"Almost hold together" hona exactly wahi wobbly timing reinforce karta hai jise ye lesson eliminate karne ki koshish kar raha hai — jis tempo par tum actually practice karte ho wahan success norm hona chahiye, exception nahi.',
      },
    ],

    realWorld: [
      {
        en: 'Session musicians and backing musicians are hired primarily for reliable timing, often more than for flashy technique — being the player everyone else can lock into confidently is a genuinely valuable, in-demand skill on its own.',
        hi: 'Session musicians aur backing musicians primarily reliable timing ke liye hire hote hain, aksar flashy technique se bhi zyada — wo player hona jispe baaki sab confidently lock ho sakein ek genuinely valuable, in-demand skill hai apne aap mein.',
      },
    ],

    interviewQA: [
      {
        q: 'If I slow everything down to stay perfectly steady, will I ever actually get fast?',
        qHi: 'Agar main sab kuch slow kar doon perfectly steady rehne ke liye, kya main kabhi actually fast ho paaunga?',
        a: "Yes — steady practice at a manageable tempo, with gradual tempo increases once each level is solid, is precisely how speed is built correctly. It feels slower in the short term but is dramatically faster in the long term than repeatedly practicing sloppy, unreliable fast playing.",
        aHi: 'Haan — ek manageable tempo par steady practice, har level solid hone par gradual tempo increases ke saath, exactly wahi tareeka hai jisse speed correctly build hoti hai. Ye short term mein slower feel karta hai lekin long term mein sloppy, unreliable fast playing baar-baar practice karne se dramatically faster hai.',
      },
    ],

    exercises: [
      {
        task: 'Record yourself playing any pattern you know for 30 seconds. Listen back specifically for timing drift (not for mistakes in chords or strum accuracy — just tempo consistency).',
        taskHi: 'Koi bhi pattern jo tumhe pata hai 30 seconds ke liye bajaate hue khud ko record karo. Playback specifically timing drift ke liye suno (chords ya strum accuracy ki mistakes ke liye nahi — bas tempo consistency).',
        hint: 'If you hear drift, that\'s valuable, actionable information, not a discouraging result — it tells you exactly what Module 9\'s remaining lessons need to help you fix.',
        hintHi: 'Agar drift suno, ye valuable, actionable information hai, ek discouraging result nahi — ye tumhe exactly batata hai ki Module 9 ke baaki lessons ko tumhe fix karne mein help karne ke liye kya chahiye.',
      },
    ],

    keyTakeaways: [
      'Steady timing at a modest tempo sounds more skilled than fast, wobbly timing — this is the actual goal, not raw speed.',
      'Unsteady timing breaks the ability to play with other musicians, regardless of how clean your individual technique is.',
      'Practice at the fastest tempo you can hold PERFECTLY, not the fastest you can almost hold — speed follows from reliable steadiness.',
    ],
    keyTakeawaysHi: [
      'Ek modest tempo par steady timing fast, wobbly timing se zyada skilled sound karti hai — ye actual goal hai, raw speed nahi.',
      'Unsteady timing doosre musicians ke saath bajaane ki ability break karti hai, chahe individual technique kitni bhi clean ho.',
      'Us fastest tempo par practice karo jise tum PERFECTLY hold kar sako, jise tum almost hold kar sako wo nahi — speed reliable steadiness se follow karti hai.',
    ],
    guitarPractice: { sequences: [{"title":"Four steady clicks","titleHi":"Chaar steady clicks","defaultBpm":80,"notes":[{"string":0,"fret":0,"beat":0},{"string":0,"fret":0,"beat":1},{"string":0,"fret":0,"beat":2},{"string":0,"fret":0,"beat":3}]}] },
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'practicing-with-a-metronome',
    title: 'Practicing With a Metronome Without Hating It',
    titleHi: 'Metronome Ke Saath Practice Karna Bina Use Hate Kiye',
    description: 'Concrete technique for making click-practice actually productive, since most beginners quietly avoid it because they do it wrong.',
    descriptionHi: 'Click-practice ko actually productive banane ki concrete technique, kyunki zyadatar beginners chupke se ise avoid karte hain kyunki wo ise galat karte hain.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: '**A dance partner who never speeds up or slows down for you.** A metronome is an unforgiving, perfectly honest dance partner — it will never subtly adjust to cover for you the way a patient human might. That\'s exactly what makes it useful: it reveals real timing problems instead of politely hiding them.',
      hi: '**Ek dance partner jo tumhare liye kabhi speed up ya slow down nahi karta.** Ek metronome ek unforgiving, perfectly honest dance partner hai — ye kabhi subtly adjust nahi karega tumhe cover karne ke liye jaise ek patient human kar sakta hai. Yahi exactly wo hai jo ise useful banata hai: ye real timing problems reveal karta hai unhe politely chhupane ke bajaye.',
    },

    simple: `**Why most beginners quietly hate metronome practice, and the actual fix.** Setting a metronome to a "normal-sounding" tempo and immediately trying a full pattern usually fails repeatedly, which feels discouraging — the fix isn't more willpower, it's starting at a genuinely, almost embarrassingly slow tempo where success is easy and automatic.

**The step-down method:**
1. Pick a pattern you can already play reasonably well without a click.
2. Set the metronome to a tempo noticeably SLOWER than you'd naturally play it — slow enough that it feels almost too easy.
3. Play the pattern along with the click for several rounds, focused purely on landing exactly on each click.
4. Only once that feels completely automatic, increase tempo by a small amount (5-10 bpm) and repeat.

**A practical tip: use just a click for the first sessions**, not a full backing track or song — an isolated click is easier to lock onto than a click buried in other sound, especially while this skill is new.`,
    simpleHi: `**Zyadatar beginners chupke se metronome practice kyun hate karte hain, aur actual fix.** Metronome ko ek "normal-sounding" tempo par set karna aur turant ek poora pattern try karna usually baar-baar fail hota hai, jo discouraging feel karta hai — fix zyada willpower nahi hai, ye ek genuinely, almost embarrassingly slow tempo par shuru karna hai jahan success easy aur automatic ho.

**Step-down method:**
1. Ek pattern pick karo jo tum already bina click ke reasonably well bajaa sakte ho.
2. Metronome ko ek tempo par set karo jo tum naturally bajaate usse noticeably SLOWER ho — itna slow ki almost bahut easy feel kare.
3. Pattern ko click ke saath kai rounds ke liye bajao, purely har click par exactly land karne par focused.
4. Sirf ek baar jab wo completely automatic feel kare, tempo ko thoda (5-10 bpm) badhao aur repeat karo.

**Ek practical tip: pehle sessions ke liye bas ek click use karo**, ek poora backing track ya song nahi — ek isolated click ek aise click se lock karna easier hai jo doosre sound mein buried ho, especially jab ye skill nayi hai.`,

    content: `**Why starting "embarrassingly slow" is a real technique, not just reassurance.** The goal of early metronome practice isn't to prove you can play at a target tempo — it's to build the specific neural/muscular skill of landing exactly on a click, which is a different skill from playing the pattern itself. Practicing that landing-precision skill at a trivially easy tempo builds it cleanly; practicing it at a tempo that's simultaneously testing your chord/pattern skill AND your click-precision skill conflates two different things and typically fails at both.

**The small-increment rule (5-10 bpm), and why bigger jumps backfire.** A large tempo jump (say, 20+ bpm) often crosses from "comfortable" straight to "unreliable" with nothing in between to practice at — small increments ensure there's always a tempo just slightly harder than your current comfortable one, which is exactly the productive difficulty zone for building tempo tolerance gradually rather than repeatedly hitting a wall.

**What "landing exactly on the click" actually means, precisely.** It's not just "close" — a downstroke that consistently lands a fraction of a beat early or late, even if it FEELS close, is still measurably off. Recording yourself (Lesson 1's technique) against a click track makes this precisely checkable, since playback reveals exactly how your strums line up against the click's regular pulses.`,
    contentHi: `**"Embarrassingly slow" shuru karna ek real technique kyun hai, sirf reassurance nahi.** Early metronome practice ka goal ye prove karna nahi hai ki tum ek target tempo par bajaa sakte ho — ye ek click par exactly land karne ki specific neural/muscular skill build karna hai, jo pattern khud bajaane se alag skill hai. Us landing-precision skill ko ek trivially easy tempo par practice karna use cleanly build karta hai; ise ek aise tempo par practice karna jo simultaneously tumhari chord/pattern skill AUR tumhari click-precision skill test kare do alag cheezon ko conflate karta hai aur typically dono mein fail hota hai.

**Small-increment rule (5-10 bpm), aur bade jumps backfire kyun karte hain.** Ek bada tempo jump (say, 20+ bpm) often "comfortable" se seedha "unreliable" tak cross karta hai beech mein practice karne ke liye kuch bhi nahi — small increments ensure karte hain ki hamesha ek tempo ho jo tumhare current comfortable tempo se thoda harder ho, jo exactly wo productive difficulty zone hai gradually tempo tolerance build karne ke liye, baar-baar ek wall hit karne ke bajaye.

**"Click par exactly land karna" actually precisely kya matlab hai.** Ye sirf "close" nahi hai — ek downstroke jo consistently ek beat ka ek fraction early ya late land karta hai, chahe wo CLOSE feel kare, phir bhi measurably off hai. Khud ko record karna (Lesson 1 ki technique) ek click track ke against ise precisely checkable banata hai, kyunki playback exactly dikhata hai ki tumhare strums click ke regular pulses ke against kaise line up karte hain.`,

    examples: [
      {
        title: 'A realistic first metronome session',
        titleHi: 'Ek realistic first metronome session',
        code: `1. Pick the DDU UDU pattern (Module 8) on Em.
2. Set metronome to 60 bpm (likely slower than you'd naturally play).
3. Play the pattern for 8 full rounds, focused on landing beat 1 exactly on each click.
4. If solid, bump to 65 bpm. If not, stay at 60 and repeat.
5. Stop the session once you've gained 10-15 bpm from where you started — that's real, measurable progress for one session.`,
        explain:
          "Defining a concrete session-end condition (gained 10-15 bpm) rather than an open-ended \"practice until tired\" goal makes progress trackable and gives a genuine sense of completion — the same measurable-goal principle Module 6's loop drill used.",
        explainHi:
          "Ek concrete session-end condition define karna (10-15 bpm gain kiya) ek open-ended \"tab tak practice karo jab tak thak na jao\" goal ke bajaye progress ko trackable banata hai aur ek genuine sense of completion deta hai — wahi measurable-goal principle jo Module 6 ke loop drill ne use kiya tha.",
      },
    ],

    mistakes: [
      {
        wrong: 'Starting metronome practice at the tempo you\'d normally play a song, getting frustrated when it falls apart immediately.',
        right: 'Start noticeably slower than feels necessary — the goal early on is landing precision, not testing your top speed.',
        why: 'Starting too fast conflates two different skills (playing the pattern, and landing on a click) and typically fails at both simultaneously, which is exactly the frustrating experience that makes people quietly avoid metronome practice.',
        whyHi: 'Bahut fast shuru karna do alag skills ko conflate karta hai (pattern bajaana, aur click par land karna) aur typically dono ko simultaneously fail kar deta hai, jo exactly wahi frustrating experience hai jo logon ko chupke se metronome practice avoid karwaata hai.',
      },
    ],

    realWorld: [
      {
        en: 'Every recording studio session runs to a click track for exactly this reason — the discipline of landing precisely on a click, built through practice like this, is a literal professional requirement, not just a beginner exercise.',
        hi: 'Har recording studio session exactly isi reason se ek click track ke saath chalta hai — click par precisely land karne ki discipline, is tarah ki practice se build hui, ek literal professional requirement hai, sirf ek beginner exercise nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'What tempo should I ultimately be able to play at?',
        qHi: 'Mujhe ultimately kis tempo par bajaa paana chahiye?',
        a: "There's no universal target — real songs range enormously in tempo. The actual skill worth building is the PROCESS of reliably increasing your steady tempo over time, not hitting one specific number.",
        aHi: 'Koi universal target nahi hai — real songs tempo mein enormously range karte hain. Actual skill jo build karne layak hai wo time ke saath apne steady tempo ko reliably badhaane ka PROCESS hai, ek specific number hit karna nahi.',
      },
    ],

    exercises: [
      {
        task: 'Run the realistic first metronome session from the example above, today, with a real metronome app or website. Record your starting and ending tempo.',
        taskHi: 'Upar wale example ka realistic first metronome session aaj, ek real metronome app ya website ke saath chalao. Apna starting aur ending tempo record karo.',
        hint: 'If you don\'t gain any tempo in the first session, that\'s fine — the habit of starting a session this way matters more than any single session\'s numeric result.',
        hintHi: 'Agar pehle session mein koi tempo gain na karo, ye theek hai — session ko is tareeke se start karne ki habit kisi single session ke numeric result se zyada matter karti hai.',
      },
    ],

    keyTakeaways: [
      'Start metronome practice noticeably slower than feels necessary — the early goal is landing precision, not speed.',
      'Increase tempo in small increments (5-10 bpm) only once the current tempo feels completely automatic.',
      'Use an isolated click (not a full song) for early practice — it\'s easier to lock onto.',
    ],
    keyTakeawaysHi: [
      'Metronome practice ko jitna necessary feel kare usse noticeably slower start karo — early goal landing precision hai, speed nahi.',
      'Tempo ko small increments (5-10 bpm) mein badhao sirf ek baar jab current tempo completely automatic feel kare.',
      'Early practice ke liye ek isolated click use karo (poora song nahi) — isse lock karna easier hai.',
    ],
    guitarPractice: { sequences: [{"title":"Steady clicks on the low E string","titleHi":"Low E string par steady clicks","defaultBpm":80,"notes":[{"string":0,"fret":0,"beat":0},{"string":0,"fret":0,"beat":1},{"string":0,"fret":0,"beat":2},{"string":0,"fret":0,"beat":3},{"string":0,"fret":0,"beat":4},{"string":0,"fret":0,"beat":5},{"string":0,"fret":0,"beat":6},{"string":0,"fret":0,"beat":7}]}] },
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'common-timing-mistakes',
    title: 'Common Beginner Timing Mistakes, Named and Fixed',
    titleHi: 'Common Beginner Timing Mistakes, Named Aur Fixed',
    description: 'Three specific, recognizable timing problems — rushing, dragging, and the "chord-change stumble" — and their concrete fixes.',
    descriptionHi: 'Teen specific, recognizable timing problems — rushing, dragging, aur "chord-change stumble" — aur unke concrete fixes.',
    difficulty: 'MEDIUM',
    duration: 15,
    order: 3,

    analogy: {
      en: '**A doctor naming a symptom before treating it.** "Something feels off with my timing" is hard to fix directly. "I\'m rushing through easy sections and dragging through hard ones" is a precisely named, treatable problem — naming the specific pattern is most of the diagnostic work.',
      hi: '**Ek doctor treat karne se pehle symptom ka naam leta hai.** "Meri timing mein kuch off feel hota hai" directly fix karna hard hai. "Main easy sections mein rush karta hoon aur hard sections mein drag karta hoon" ek precisely named, treatable problem hai — specific pattern ka naam lena diagnostic work ka zyadatar hissa hai.',
    },

    simple: `**Three specific, common timing problems:**

1. **Rushing** — speeding up unconsciously, usually during easy/familiar sections of a pattern or song. Fix: metronome practice (Lesson 2) specifically through the sections you find easy, not just the hard ones — easy sections are exactly where rushing sneaks in unnoticed.

2. **Dragging** — slowing down unconsciously, usually during a physically difficult moment (like Module 4's G chord stretch). Fix: isolate the specific difficult transition and metronome-practice THAT transition alone at a slow enough tempo that it doesn't need to slow down to succeed.

3. **The chord-change stumble** — a tiny but real pause right at a chord change, even when each chord individually is solid. Fix: this is almost always an anchor-finger (Module 6) or minimal-motion (Module 6) problem in disguise — re-analyze the specific chord pair's anchor fingers.

**Why naming which specific problem you have matters:** each has a different root cause and a different fix — generically "practicing more" without identifying which of these three (or which combination) is happening wastes practice time on the wrong target.`,
    simpleHi: `**Teen specific, common timing problems:**

1. **Rushing** — unconsciously speed up hona, usually ek pattern ya song ke easy/familiar sections ke dauraan. Fix: metronome practice (Lesson 2) specifically un sections ke through jo tumhe easy lagte hain, sirf hard wale nahi — easy sections exactly wahi jagah hain jahan rushing unnoticed sneak in karti hai.

2. **Dragging** — unconsciously slow down hona, usually ek physically difficult moment ke dauraan (jaise Module 4 ka G chord stretch). Fix: specific difficult transition ko isolate karo aur us TRANSITION ko akele itne slow tempo par metronome-practice karo ki success ke liye slow hone ki zaroorat na pade.

3. **Chord-change stumble** — chord change par bilkul ek tiny lekin real pause, chahe har chord individually solid ho. Fix: ye almost hamesha ek anchor-finger (Module 6) ya minimal-motion (Module 6) problem hai disguise mein — specific chord pair ke anchor fingers ko re-analyze karo.

**Kaunsi specific problem tumhe hai naam lena kyun matter karta hai:** har ek ka alag root cause aur alag fix hai — generically "zyada practice karna" bina identify kiye ki in teen (ya inka kaunsa combination) mein se kya ho raha hai wrong target par practice time waste karta hai.`,

    content: `**Why rushing and dragging are, mechanically, the SAME underlying phenomenon with opposite symptoms.** Both come from tempo unconsciously adapting to how hard the current moment feels — rushing through easy parts is your hand unconsciously "relaxing" toward a faster pace when it can, dragging through hard parts is your hand unconsciously buying itself extra time when it needs it. Recognizing both as instances of the same "tempo silently follows difficulty" tendency, rather than two unrelated problems, means the metronome fix (Lesson 2) applies to both, just aimed at different specific sections.

**Why the chord-change stumble specifically deserves its own category, separate from rushing/dragging.** It isn't really a TEMPO problem at all — it's a technique problem (an inefficient anchor/motion) that manifests AS a timing symptom. Trying to fix it with more metronome practice alone, without going back to Module 6's anchor-finger analysis for that specific chord pair, treats a symptom without addressing its actual mechanical cause.

**A genuinely useful diagnostic habit: metronome-test different SECTIONS of something separately**, not just the whole thing at once. Playing a full song or pattern with a click reveals THAT there's a timing problem; testing individual 2-4 beat sections in isolation reveals WHERE specifically it lives — the second, more granular test is what actually points to rushing vs. dragging vs. a stumble, rather than leaving you with a vague overall sense that "something" is off.`,
    contentHi: `**Rushing aur dragging, mechanically, opposite symptoms ke saath SAME underlying phenomenon kyun hain.** Dono tempo se aate hain jo unconsciously adapt karta hai ki current moment kitna hard feel karta hai — easy parts ke through rushing tumhari hand ka unconsciously ek faster pace ki taraf "relax" karna hai jab wo kar sakti hai, hard parts ke through dragging tumhari hand ka unconsciously apne liye extra time kharidna hai jab use zaroorat ho. Dono ko same "tempo silently difficulty follow karta hai" tendency ke instances ki tarah recognize karna, do unrelated problems ke bajaye, matlab hai metronome fix (Lesson 2) dono par apply hota hai, bas alag specific sections par aimed.

**Chord-change stumble specifically apni khud ki category kyun deserve karta hai, rushing/dragging se separate.** Ye actually bilkul ek TEMPO problem nahi hai — ye ek technique problem hai (ek inefficient anchor/motion) jo ek timing symptom ki tarah manifest hota hai. Ise sirf zyada metronome practice se fix karne ki koshish karna, us specific chord pair ke liye Module 6 ke anchor-finger analysis par wapas gaye bina, ek symptom ko treat karta hai uske actual mechanical cause ko address kiye bina.

**Ek genuinely useful diagnostic habit: kisi cheez ke alag SECTIONS ko separately metronome-test karo**, sirf poori cheez ko ek saath nahi. Ek poora song ya pattern click ke saath bajaana reveal karta hai KI ek timing problem hai; individual 2-4 beat sections ko isolation mein test karna reveal karta hai KAHAN specifically wo rehti hai — doosra, zyada granular test hai jo actually rushing vs dragging vs ek stumble ki taraf point karta hai, tumhe ek vague overall sense ke saath chhodne ke bajaye ki "kuch" off hai.`,

    examples: [
      {
        title: 'The section-isolation diagnostic',
        titleHi: 'Section-isolation diagnostic',
        code: `1. Play a full 4-chord progression with a metronome. Note if it feels shaky anywhere, even vaguely.
2. Isolate just the 2 chords around the shaky spot. Loop just that pair with the metronome (Module 6's loop drill).
3. If the pair is solid at a slow tempo, the issue was likely rushing/dragging elsewhere, not this specific change.
4. If the pair itself falls apart even slow, it's a chord-change stumble — go re-analyze its anchor fingers.`,
        explain:
          'This process of elimination — testing progressively smaller sections — is a general debugging strategy that shows up constantly in skill-building of any kind, not just guitar: isolate the smallest reproducible instance of a problem before trying to fix it.',
        explainHi:
          'Ye process of elimination — progressively chhote sections test karna — ek general debugging strategy hai jo kisi bhi tarah ke skill-building mein constantly dikhti hai, sirf guitar mein nahi: ek problem ke sabse chhote reproducible instance ko isolate karo use fix karne ki koshish karne se pehle.',
      },
    ],

    mistakes: [
      {
        wrong: 'Responding to "my timing feels off somewhere" by generically practicing the whole song/pattern more, without isolating where specifically the problem lives.',
        right: 'Use the section-isolation diagnostic to find the specific spot and specific problem type (rushing, dragging, or stumble) before choosing a fix.',
        why: "Generic 'practice more' wastes time on sections that are already fine and under-targets the actual problem spot — a precise diagnosis makes practice time dramatically more efficient.",
        whyHi: "Generic 'zyada practice karo' un sections par time waste karta hai jo already fine hain aur actual problem spot ko under-target karta hai — ek precise diagnosis practice time ko dramatically zyada efficient banata hai.",
      },
    ],

    realWorld: [
      {
        en: 'Music teachers use exactly this section-isolation approach when a student says a piece "doesn\'t feel right" — narrowing down to the specific measure or transition is standard diagnostic practice across virtually all instruments, not a guitar-specific trick.',
        hi: 'Music teachers exactly ye section-isolation approach use karte hain jab ek student kehta hai ki ek piece "sahi feel nahi karta" — specific measure ya transition tak narrow down karna virtually saare instruments ke across standard diagnostic practice hai, koi guitar-specific trick nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'I can\'t tell if I\'m rushing, dragging, or both at different points — is that normal?',
        qHi: 'Mujhe pata nahi chalta ki main rush kar raha hoon, drag kar raha hoon, ya alag points par dono — kya ye normal hai?',
        a: "Very normal, especially early on. The section-isolation diagnostic is exactly the tool for teasing apart mixed symptoms — test small chunks individually rather than trying to diagnose the whole piece by feel alone.",
        aHi: 'Bahut normal hai, especially early mein. Section-isolation diagnostic exactly wo tool hai mixed symptoms ko tease apart karne ke liye — poore piece ko sirf feel se diagnose karne ki koshish karne ke bajaye chhote chunks ko individually test karo.',
      },
    ],

    exercises: [
      {
        task: 'Pick any 4-chord sequence you can play. Run the section-isolation diagnostic from the example, identifying (if any) which of the three named problems shows up and where.',
        taskHi: 'Koi bhi 4-chord sequence pick karo jo tum bajaa sakte ho. Example ka section-isolation diagnostic chalao, identify karte hue (agar koi hai) ki teen named problems mein se kaunsi dikhti hai aur kahan.',
        hint: 'It\'s completely fine to find no problems at all — this diagnostic is equally useful for confirming solid timing as it is for finding a specific issue.',
        hintHi: 'Bilkul koi problem na milna completely theek hai — ye diagnostic solid timing confirm karne ke liye utna hi useful hai jitna ek specific issue dhoondhne ke liye.',
      },
    ],

    keyTakeaways: [
      'Rushing (speeding through easy parts) and dragging (slowing through hard parts) are the same underlying tendency: tempo silently following difficulty.',
      'A chord-change stumble is usually a technique problem (anchor/motion, Module 6) manifesting as a timing symptom, not a pure tempo issue.',
      'Isolate specific sections with a metronome to find exactly where and what the problem is before choosing a fix.',
    ],
    keyTakeawaysHi: [
      'Rushing (easy parts ke through speed up) aur dragging (hard parts ke through slow down) same underlying tendency hain: tempo silently difficulty follow karta hai.',
      'Ek chord-change stumble usually ek technique problem hai (anchor/motion, Module 6) jo ek timing symptom ki tarah manifest hota hai, ek pure tempo issue nahi.',
      'Ek fix choose karne se pehle exactly ye dhoondhne ke liye ki problem kahan aur kya hai, metronome se specific sections isolate karo.',
    ],
    guitarPractice: { sequences: [{"title":"Steady beat check","titleHi":"Steady beat check","defaultBpm":80,"notes":[{"string":0,"fret":0,"beat":0},{"string":0,"fret":0,"beat":1},{"string":0,"fret":0,"beat":2},{"string":0,"fret":0,"beat":3}]}] },
  },
];
