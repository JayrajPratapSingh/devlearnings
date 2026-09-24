/**
 * Guitar Course — Module 22: Minor Pentatonic & Blues Scale, lessons 1-3.
 * Opens Part VIII (Soloing & Improvisation). Applies Module 21's
 * "one pattern, five connected neck positions" structure to scales
 * instead of chords, exactly as Module 21 Lesson 3 previewed.
 */

import type { CourseLesson } from './course-js-module1';
import { diagramPreviewHtml, fretboardMapSvg } from './guitar-diagrams';

export const GUITAR_MODULE_22: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'what-is-the-minor-pentatonic-scale',
    title: 'What Is the Minor Pentatonic Scale?',
    titleHi: 'Minor Pentatonic Scale Kya Hai?',
    description: 'Five notes, one formula, and the single most-used scale in guitar soloing across nearly every genre.',
    descriptionHi: 'Paanch notes, ek formula, aur guitar soloing mein almost har genre mein sabse zyada use hone wala ek single scale.',
    difficulty: 'HARD',
    duration: 20,
    order: 1,

    analogy: {
      en: '**A curated 5-color palette instead of the full 64-crayon box.** Give a beginner painter every possible color and clashing combinations are easy to stumble into. Give them 5 carefully chosen, mutually compatible colors and almost anything they combine looks intentional. The minor pentatonic scale is exactly this for improvising: 5 notes chosen specifically because they rarely clash with each other, so reaching for "any note in the scale" over a chord progression is a genuinely safe, near-foolproof starting point.',
      hi: '**Full 64-crayon box ke bajaye ek curated 5-color palette.** Ek beginner painter ko har possible color de do aur clashing combinations mein stumble karna easy hai. Unhe 5 carefully chosen, mutually compatible colors do aur almost kuch bhi jo wo combine karte hain intentional lagta hai. Minor pentatonic scale improvising ke liye exactly yahi hai: 5 notes specifically isliye chosen kiye gaye kyunki wo ek doosre se rarely clash karte hain, isliye ek chord progression ke upar "scale mein koi bhi note" ke liye reach karna ek genuinely safe, near-foolproof starting point hai.',
    },

    simple: `**The formula, in Module 19's interval language:** root, minor 3rd (+3 semitones), perfect 4th (+5), perfect 5th (+7), minor 7th (+10). Five notes, five specific interval distances from the root — nothing more.

**Worked for A minor pentatonic:** A (root), C (+3, minor 3rd), D (+5, perfect 4th), E (+7, perfect 5th), G (+10, minor 7th) → A-C-D-E-G.

**Why "pentatonic" (5 notes) specifically, and why it\'s the most forgiving scale to improvise with:** a full scale most instruments use has 7 notes; pentatonic scales remove the 2 notes most likely to sound tense or clash against the underlying chord. What\'s left is 5 notes that combine well in almost any order — which is exactly why beginning improvisers are taught this scale first, and why experienced players still lean on it constantly.

**"Box 1," the shape almost every guitarist learns first:** for A minor pentatonic, a single connected hand position starting at fret 5 contains all 5 notes across all 6 strings, playable without shifting hand position at all.`,
    simpleHi: `**Formula, Module 19 ki interval language mein:** root, minor 3rd (+3 semitones), perfect 4th (+5), perfect 5th (+7), minor 7th (+10). Paanch notes, root se paanch specific interval distances — aur kuch nahi.

**A minor pentatonic ke liye worked out:** A (root), C (+3, minor 3rd), D (+5, perfect 4th), E (+7, perfect 5th), G (+10, minor 7th) → A-C-D-E-G.

**"Pentatonic" (5 notes) specifically kyun, aur ye improvise karne ke liye sabse forgiving scale kyun hai:** zyadatar instruments jo full scale use karte hain uske 7 notes hote hain; pentatonic scales un 2 notes ko hata dete hain jo underlying chord ke against tense sound karne ya clash karne ki sabse zyada possibility rakhte hain. Jo bachta hai wo 5 notes hain jo almost kisi bhi order mein achhe se combine hote hain — isliye hi beginning improvisers ko ye scale pehle sikhaayi jaati hai, aur isliye hi experienced players bhi ispar constantly lean karte hain.

**"Box 1," wo shape jo almost har guitarist pehle seekhta hai:** A minor pentatonic ke liye, fret5 se shuru hone wali ek single connected hand position saari 6 strings ke across saari 5 notes contain karti hai, bina hand position shift kiye bajaane layak.`,

    content: `**Why this lesson derives the scale from intervals rather than presenting "Box 1" as a shape to memorize first.** Every scale-shape diagram you\'ll ever see is downstream of the interval formula, the same relationship chord SHAPES have to the triad recipe (Module 19). Learning the formula first means you could, in principle, work out a pentatonic scale in ANY key from scratch, the same independence Module 19\'s triad recipe gave you for chords.

**Why removing exactly 2 notes (out of a hypothetical 7) produces such a forgiving result — an honest, appropriately-scoped explanation.** The 2 notes a full 7-note scale has that pentatonic removes are the ones most likely to create a harsh, unstable-sounding clash against a chord underneath (a deeper topic — scale-against-chord harmonic tension — beyond this course\'s scope). Removing them doesn\'t make the remaining 5 "more correct," it makes them more UNIVERSALLY safe — a genuinely useful trade-off for confident improvising, even if it means giving up some of the more colorful, tension-filled notes a full scale offers.

**Why Box 1 specifically starts where it does for A minor (fret 5), connecting directly to Module 21\'s CAGED positions.** Fret 5 is exactly where the CAGED E-shape sits for an A-rooted chord (Module 21\'s method: find A on the low-E string using Module 18\'s anchor method — fret 5). This isn\'t a coincidence: Box 1's pentatonic shape is built around the same E-shape CAGED position, which is exactly the connection Lesson 2 makes explicit.`,
    contentHi: `**Ye lesson scale ko intervals se kyun derive karta hai, "Box 1" ko pehle memorize karne wali shape ki tarah present karne ke bajaye.** Har scale-shape diagram jo tum kabhi dekhoge interval formula ka downstream hai, wahi relationship jo chord SHAPES ka triad recipe (Module 19) se hai. Formula pehle seekhna matlab hai tum, principle mein, KISI BHI key mein ek pentatonic scale scratch se work out kar sakte ho, wahi independence jo Module 19 ke triad recipe ne tumhe chords ke liye di thi.

**Exactly 2 notes hataana (ek hypothetical 7 mein se) itna forgiving result kyun produce karta hai — ek honest, appropriately-scoped explanation.** Ek full 7-note scale ke jo 2 notes pentatonic hataata hai wo hain jo neeche ke chord ke against ek harsh, unstable-sounding clash create karne ki sabse zyada possibility rakhte hain (ek deeper topic — scale-against-chord harmonic tension — is course ke scope se pare). Unhe hataana bachi hui 5 ko "zyada correct" nahi banaata, ye unhe zyada UNIVERSALLY safe banaata hai — confident improvising ke liye ek genuinely useful trade-off, chahe iska matlab ho ki full scale ke kuch zyada colorful, tension-filled notes chhodne padein.

**Box1 A minor ke liye specifically wahin kyun shuru hota hai jahan ye hota hai (fret5), directly Module 21 ki CAGED positions se connect karte hue.** Fret5 exactly wahan hai jahan A-rooted chord ke liye CAGED E-shape baithti hai (Module 21 ka method: low-E string par Module 18 ke anchor method use karke A dhoondo — fret5). Ye coincidence nahi hai: Box1 ki pentatonic shape usi E-shape CAGED position ke around bani hai, jo exactly wo connection hai jo Lesson 2 explicit banaata hai.`,

    examples: [
      {
        title: 'A minor pentatonic, Box 1 — every note verified against Module 18\'s fretboard map',
        titleHi: 'A minor pentatonic, Box 1 — har note Module 18 ke fretboard map ke against verified',
        previewHeight: 340,
        code: `Box 1 (frets 5-8, low-E to high-e):
low-E: 5(A,root), 8(C,m3)
A:     5(D,4th),  7(E,5th)
D:     5(G,m7),   7(A,root)
G:     5(C,m3),   7(D,4th)
B:     5(E,5th),  8(G,m7)
e:     5(A,root), 8(C,m3)

Only 5 distinct note names appear anywhere in this shape: A, C, D, E, G.`,
        preview: diagramPreviewHtml(
          fretboardMapSvg(8, [
            [0, 5],
            [0, 8],
            [1, 5],
            [1, 7],
            [2, 5],
            [2, 7],
            [3, 5],
            [3, 7],
            [4, 5],
            [4, 8],
            [5, 5],
            [5, 8],
          ]),
          'Every note in A minor pentatonic Box 1, highlighted — check for yourself that only A, C, D, E, and G ever appear, nowhere else on this section of the neck.',
        ),
        explain:
          'Twelve highlighted cells, but only five distinct letter names among them — a direct, checkable demonstration that this hand-shape is exactly the 5-note formula from this lesson, not a separately memorized pattern with its own independent logic.',
        explainHi:
          'Barah highlighted cells, lekin unmein sirf paanch distinct letter names — ek direct, checkable demonstration ki ye hand-shape exactly is lesson ka 5-note formula hai, apni independent logic wala ek separately memorized pattern nahi.',
      },
    ],

    mistakes: [
      {
        wrong: 'Memorizing "Box 1" as a fixed pattern of finger positions without connecting it to the 5-note formula underneath it.',
        right: 'Understand Box 1 as one physical layout of the same root-m3-4-5-m7 formula that defines the scale in any key or position.',
        why: 'A shape memorized without its underlying formula can\'t be transposed to a new key or connected to the other pentatonic boxes — exactly the same "understand the mechanism" principle this course has followed since Module 2.',
        whyHi: 'Ek shape jo apne underlying formula ke bina memorize ki gayi ho use ek nayi key mein transpose nahi kiya ja sakta ya doosre pentatonic boxes se connect nahi kiya ja sakta — exactly wahi "mechanism samjho" principle jo ye course Module 2 se follow kar raha hai.',
      },
    ],

    realWorld: [
      {
        en: 'From blues and rock to pop and country, the minor pentatonic scale is the single most commonly reached-for improvising tool across genres — it\'s not a beginner scale that gets "outgrown," it\'s a permanent, professional-level tool.',
        hi: 'Blues aur rock se lekar pop aur country tak, minor pentatonic scale genres ke across sabse zyada reach-for kiya jaane wala improvising tool hai — ye ek beginner scale nahi hai jo "outgrow" ho jaata hai, ye ek permanent, professional-level tool hai.',
      },
    ],

    interviewQA: [
      {
        q: 'If the minor pentatonic scale is missing 2 notes compared to a full scale, doesn\'t that mean it\'s "less complete" or lower quality for soloing?',
        qHi: 'Agar minor pentatonic scale ek full scale ke comparison mein 2 notes miss karta hai, toh kya iska matlab ye nahi ki ye soloing ke liye "less complete" ya lower quality hai?',
        a: 'No — "fewer notes" and "lower quality" aren\'t the same thing here. The 5 remaining notes were specifically chosen for maximum compatibility, which is a genuine design strength, not a limitation. Full 7-note scales have their own uses (and their own added risk of clashing notes), but neither is objectively "better" — they\'re different tools for different moments.',
        aHi: 'Nahi — "kam notes" aur "lower quality" yahan same cheez nahi hain. Bachi hui 5 notes specifically maximum compatibility ke liye chosen ki gayi thi, jo ek genuine design strength hai, ek limitation nahi. Full 7-note scales ke apne uses hain (aur clashing notes ka apna added risk), lekin dono mein se koi bhi objectively "better" nahi hai — wo alag moments ke liye alag tools hain.',
      },
    ],

    exercises: [
      {
        task: 'Using Module 19\'s interval-counting method, work out the 5 notes of E minor pentatonic (root E) from the formula alone, without looking at any reference shape.',
        taskHi: 'Module 19 ke interval-counting method use karke, E minor pentatonic (root E) ke 5 notes formula se hi work out karo, kisi bhi reference shape ko dekhe bina.',
        hint: 'E + 3 semitones, E + 5, E + 7, E + 10 — the same four calculations this lesson did for A, just starting from a different root.',
        hintHi: 'E + 3 semitones, E + 5, E + 7, E + 10 — wahi chaar calculations jo is lesson ne A ke liye ki thi, bas ek alag root se shuru hote hue.',
      },
    ],

    keyTakeaways: [
      'Minor pentatonic formula: root, minor 3rd (+3), perfect 4th (+5), perfect 5th (+7), minor 7th (+10) — five notes, calculable in any key.',
      'Removing 2 notes from a full 7-note scale leaves 5 that combine safely in almost any order — the reason it\'s the most reached-for improvising scale across genres.',
      '"Box 1" is simply this formula\'s physical layout, not a separate thing to memorize — and its starting fret is directly determined by Module 18\'s note-finding method.',
    ],
    keyTakeawaysHi: [
      'Minor pentatonic formula: root, minor 3rd (+3), perfect 4th (+5), perfect 5th (+7), minor 7th (+10) — paanch notes, kisi bhi key mein calculable.',
      'Ek full 7-note scale se 2 notes hataana 5 chhodta hai jo almost kisi bhi order mein safely combine hote hain — isliye ye genres ke across sabse zyada reach-for kiya jaane wala improvising scale hai.',
      '"Box 1" simply is formula ka physical layout hai, ek separate cheez memorize karne wali nahi — aur uska starting fret directly Module 18 ke note-finding method se determined hota hai.',
    ],
    guitarPractice: { sequences: [{"title":"A minor pentatonic, Box 1","titleHi":"A minor pentatonic, Box 1","defaultBpm":90,"notes":[{"string":0,"fret":5,"beat":0},{"string":0,"fret":8,"beat":1},{"string":1,"fret":5,"beat":2},{"string":1,"fret":7,"beat":3},{"string":2,"fret":5,"beat":4},{"string":2,"fret":7,"beat":5},{"string":3,"fret":5,"beat":6},{"string":3,"fret":7,"beat":7},{"string":4,"fret":5,"beat":8},{"string":4,"fret":8,"beat":9},{"string":5,"fret":5,"beat":10},{"string":5,"fret":8,"beat":11}]}], earTraining: [{"string":0,"fret":5},{"string":0,"fret":8},{"string":1,"fret":5},{"string":1,"fret":7},{"string":2,"fret":5}] },
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'connecting-pentatonic-boxes-to-caged',
    title: 'Connecting the Boxes: Pentatonic Shapes Are CAGED Again',
    titleHi: 'Boxes Ko Connect Karna: Pentatonic Shapes Phir Se CAGED Hain',
    description: 'Module 21\'s five connected chord positions and this scale\'s five connected boxes turn out to be the exact same structure.',
    descriptionHi: 'Module 21 ki paanch connected chord positions aur is scale ke paanch connected boxes exactly wahi structure nikalte hain.',
    difficulty: 'HARD',
    duration: 20,
    order: 2,

    analogy: {
      en: '**The same subway map, with a different overlay turned on.** Module 21\'s CAGED chord positions and this scale\'s 5 boxes are drawn on the exact same underlying neck geometry, like a transit map that can show either the bus routes or the train lines depending on which overlay is active — different information, same map, same stations.',
      hi: '**Wahi subway map, ek different overlay on kiya hua.** Module 21 ki CAGED chord positions aur is scale ke 5 boxes exact same underlying neck geometry par drawn hain, ek transit map ki tarah jo ya to bus routes ya train lines dikha sakta hai jis overlay active hai uske hisaab se — different information, same map, same stations.',
    },

    simple: `**The direct connection, stated precisely:** Box 1 of A minor pentatonic (fret 5) sits in the exact same neck position as the CAGED E-shape for an A-rooted chord (Module 21\'s method locates this at fret 5 too). This isn\'t approximate — it\'s the same underlying root position, viewed through two different lenses (chord shape vs. scale shape).

**Why there are 5 pentatonic boxes, not just 1 — the same reason there were 5 CAGED shapes:** just as Module 21\'s five chord shapes climb the neck in the fixed C-A-G-E-D order, the five pentatonic boxes climb the neck in an order tied to those same five CAGED positions. Box 1 (this lesson\'s focus) corresponds to the E-shape position; the other four boxes correspond to the other four CAGED positions, continuing up the neck exactly the way Module 21\'s chord shapes did.

**A genuinely honest note on scope:** fully mapping and connecting all 5 pentatonic boxes is a substantial, ongoing practice project — this lesson\'s job is showing you that the connection to CAGED exists and why, giving you a mental map for where the OTHER four boxes must be, even without diagramming every single one here.`,
    simpleHi: `**Direct connection, precisely stated:** A minor pentatonic ka Box1 (fret5) exact same neck position par baithta hai jahan ek A-rooted chord ke liye CAGED E-shape baithti hai (Module 21 ka method ise fret5 par bhi locate karta hai). Ye approximate nahi hai — ye same underlying root position hai, do alag lenses se dekha gaya (chord shape vs. scale shape).

**5 pentatonic boxes kyun hain, sirf 1 nahi — wahi reason jo 5 CAGED shapes tha:** jaise Module 21 ki paanch chord shapes neck ko fixed C-A-G-E-D order mein chadhti hain, waise hi paanch pentatonic boxes neck ko un same paanch CAGED positions se tied ek order mein chadhte hain. Box1 (is lesson ka focus) E-shape position se corresponds karta hai; baaki chaar boxes baaki chaar CAGED positions se correspond karte hain, exactly wahi tareeke se neck upar continue karte hue jaise Module 21 ki chord shapes ne kiya tha.

**Scope par ek genuinely honest note:** saare 5 pentatonic boxes ko fully map aur connect karna ek substantial, ongoing practice project hai — is lesson ka kaam ye dikhaana hai ki CAGED se connection exist karta hai aur kyun, tumhe ek mental map dete hue ki BAAKI chaar boxes kahan hone chahiye, yahan har ek ko diagram kiye bina bhi.`,

    content: `**Why this connection is genuinely useful, not just a neat coincidence to note and forget.** Once you know Box 1 sits at the E-shape CAGED position, you automatically know WHERE to look for the other four boxes — at the A-shape, G-shape, C-shape, and D-shape positions respectively — without needing separate memorization for "where scale boxes live" versus "where chord shapes live." One positional mental map now serves double duty.

**Why this also explains a genuinely practical playing technique: soloing over your own chord.** If you\'re playing an A-rooted chord using the E-shape CAGED position (Module 21), Box 1\'s pentatonic notes are RIGHT THERE, in the same hand position — meaning you can move fluidly between playing the chord and improvising a solo around it without relocating your hand. This is a real, common technique, not a theoretical curiosity.

**An honest, forward-looking note on how far this module goes versus how far the topic actually goes.** Complete pentatonic fluency (all 5 boxes, connected, in every key, used fluently in real time) is a genuinely long-term skill — realistically, months to years of practice, not something this or any single module can hand you fully formed. What this module gives you is the CORRECT mental model to build that fluency around, which is a very different (and more valuable) thing than a shortcut to instant mastery.`,
    contentHi: `**Ye connection genuinely useful kyun hai, sirf note karke bhoolne wala ek neat coincidence nahi.** Ek baar jab tumhe pata ho ki Box1 E-shape CAGED position par baithta hai, tumhe automatically pata hai ki baaki chaar boxes KAHAN dhoondhne hain — A-shape, G-shape, C-shape, aur D-shape positions par respectively — "scale boxes kahan rehte hain" versus "chord shapes kahan rehte hain" ke liye separate memorization ki zaroorat ke bina. Ek positional mental map ab double duty serve karta hai.

**Ye ek genuinely practical playing technique ko bhi kaise explain karta hai: apne khud ke chord ke upar soloing karna.** Agar tum E-shape CAGED position use karke ek A-rooted chord bajaa rahe ho (Module 21), Box1 ke pentatonic notes WAHIN hain, same hand position mein — matlab tum chord bajaane aur uske around ek solo improvise karne ke beech fluidly move kar sakte ho apna hand relocate kiye bina. Ye ek real, common technique hai, ek theoretical curiosity nahi.

**Ye module kitni door tak jaata hai versus topic actually kitni door tak jaata hai iske baare mein ek honest, forward-looking note.** Complete pentatonic fluency (saare 5 boxes, connected, har key mein, real time mein fluently used) ek genuinely long-term skill hai — realistically, practice ke mahine se saal, kuch aisa nahi jo ye ya koi bhi single module tumhe fully formed de sake. Ye module tumhe jo deta hai wo CORRECT mental model hai us fluency ke around build karne ke liye, jo ek bahut alag (aur zyada valuable) cheez hai instant mastery ke shortcut se.`,

    examples: [
      {
        title: 'Box 1 (E-shape position) and the CAGED E-shape chord it shares a position with',
        titleHi: 'Box1 (E-shape position) aur wo CAGED E-shape chord jiske saath ye ek position share karta hai',
        previewHeight: 340,
        code: `A-rooted CAGED E-shape chord: root on low-E string, fret 5 (Module 21's method).
A minor pentatonic Box 1: also centered at fret 5 on the low-E string.

Same root position, two different, complementary uses of it.`,
        preview: diagramPreviewHtml(
          fretboardMapSvg(8, [[0, 5]]),
          'Fret 5 on the low-E string — the single shared anchor point between the CAGED E-shape chord position and pentatonic Box 1, both rooted on A.',
        ),
        explain:
          'Highlighting just the one shared anchor point makes the CAGED-to-pentatonic connection as simple and checkable as possible — everything else in both systems is built outward from this single shared root position.',
        explainHi:
          'Sirf us ek shared anchor point ko highlight karna CAGED-to-pentatonic connection ko jitna possible ho utna simple aur checkable banata hai — dono systems mein baaki sab kuch is single shared root position se outward banaya gaya hai.',
      },
    ],

    mistakes: [
      {
        wrong: 'Treating CAGED chord positions and pentatonic scale boxes as two unrelated systems that happen to both exist on the guitar.',
        right: 'Recognize they share the exact same 5 root positions on the neck — one mental map serves both.',
        why: 'Believing these are unrelated doubles the amount of positional information you think you need to memorize, when in reality one shared structure explains both.',
        whyHi: 'Ye believe karna ki ye unrelated hain positional information ki amount double kar deta hai jo tumhe lagta hai memorize karni hai, jabki reality mein ek shared structure dono explain karti hai.',
      },
    ],

    realWorld: [
      {
        en: 'A guitarist comping chords and then launching into a solo without missing a beat, in the same area of the neck, is directly relying on this CAGED-to-pentatonic positional overlap — it\'s what makes that transition physically seamless.',
        hi: 'Ek guitarist jo chords comp kar raha hai aur phir bina beat miss kiye ek solo mein launch ho jaata hai, neck ke same area mein, directly is CAGED-to-pentatonic positional overlap par rely kar raha hai — yahi hai jo us transition ko physically seamless banaata hai.',
      },
    ],

    interviewQA: [
      {
        q: 'If Box 1 corresponds to the E-shape position, does that mean Box 1 is somehow "the best" or "the most important" box?',
        qHi: 'Agar Box1 E-shape position se corresponds karta hai, toh kya iska matlab hai ki Box1 kisi tarah "sabse best" ya "sabse important" box hai?',
        a: 'No — Box 1 is simply the most commonly TAUGHT first, often because it\'s frequently anchored to open-position-adjacent frets for common keys, making it convenient to introduce early. All 5 boxes are equally valid and equally "correct"; which one a player reaches for in the moment depends on where their hand already is, the same practical logic Module 21 Lesson 3 taught for choosing CAGED chord positions.',
        aHi: 'Nahi — Box1 simply sabse commonly pehle TAUGHT hota hai, often kyunki ye frequently common keys ke liye open-position-adjacent frets se anchored hota hai, ise jaldi introduce karne ke liye convenient banata hai. Saare 5 boxes equally valid aur equally "correct" hain; ek player moment mein kaunsa reach karta hai ye is baat par depend karta hai ki unka hand already kahan hai, wahi practical logic jo Module 21 Lesson 3 ne CAGED chord positions choose karne ke liye sikhaayi thi.',
      },
    ],

    exercises: [
      {
        task: 'Using Module 21\'s method, find the fret where the CAGED A-shape sits for an A-rooted chord, and predict where pentatonic "Box 2" (the next box after Box 1) is most likely centered, based on this lesson\'s connection.',
        taskHi: 'Module 21 ka method use karke, dhoondo ki A-rooted chord ke liye CAGED A-shape kaunsi fret par baithti hai, aur predict karo ki pentatonic "Box 2" (Box1 ke baad ka agla box) most likely kahan centered hai, is lesson ke connection ke basis par.',
        hint: 'The A-shape for an A-rooted chord is at the open position itself (A is A-shape\'s own open root) — think about what that implies for how Box 1 and Box 2 might be adjacent rather than far apart.',
        hintHi: 'Ek A-rooted chord ke liye A-shape open position par hi hai (A hi A-shape ka apna open root hai) — socho ki iska matlab kya hai is baat ke liye ki Box1 aur Box2 kaise ek doosre se door hone ke bajaye adjacent ho sakte hain.',
      },
    ],

    keyTakeaways: [
      'Pentatonic Box 1 shares its exact root position with the CAGED E-shape chord — the same underlying neck geometry, two complementary uses.',
      'This means one mental map (Module 21\'s five CAGED positions) tells you where to look for all five pentatonic boxes too.',
      'Full 5-box pentatonic fluency is a genuine long-term practice project — this lesson gives the correct mental model to build it on, not instant mastery.',
    ],
    keyTakeawaysHi: [
      'Pentatonic Box1 apna exact root position CAGED E-shape chord ke saath share karta hai — wahi underlying neck geometry, do complementary uses.',
      'Iska matlab hai ek mental map (Module 21 ki paanch CAGED positions) tumhe ye bhi bataata hai ki saare paanch pentatonic boxes kahan dhoondhne hain.',
      'Full 5-box pentatonic fluency ek genuine long-term practice project hai — ye lesson use build karne ke liye correct mental model deta hai, instant mastery nahi.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'the-blues-scale-one-note-added',
    title: 'The Blues Scale: One Note Added, a Whole New Character',
    titleHi: 'Blues Scale: Ek Note Add Hua, Ek Poori Nayi Character',
    description: 'The single "blue note" that turns the safe, consonant pentatonic scale into something deliberately tense and expressive.',
    descriptionHi: 'Wo single "blue note" jo safe, consonant pentatonic scale ko kuch deliberately tense aur expressive mein badal deta hai.',
    difficulty: 'HARD',
    duration: 15,
    order: 3,

    analogy: {
      en: '**A single drop of a sharp spice added to an otherwise mild, balanced dish.** The minor pentatonic scale (Lesson 1) is deliberately consonant and safe. The blues scale takes that exact same safe base and adds ONE deliberately tense, unstable note — like a single drop of a sharp spice that doesn\'t belong to the base recipe, added specifically because its clash creates character the mild version doesn\'t have.',
      hi: '**Ek otherwise mild, balanced dish mein ek sharp spice ki ek single drop add ki hui.** Minor pentatonic scale (Lesson 1) deliberately consonant aur safe hai. Blues scale wahi exact safe base leta hai aur EK deliberately tense, unstable note add karta hai — ek sharp spice ki ek single drop ki tarah jo base recipe se belong nahi karti, specifically isliye add ki gayi kyunki uska clash wo character create karta hai jo mild version mein nahi hai.',
    },

    simple: `**The blues scale, precisely:** take the minor pentatonic scale (root, m3, 4, 5, m7) and add exactly one note — the flat 5th (+6 semitones, exactly halfway between the perfect 4th and perfect 5th). For A: A-C-D-D#-E-G (six notes total).

**Why this one note, specifically, out of every possible addition:** the flat 5th sits deliberately between two of the pentatonic scale's own notes (the 4th and 5th), creating a genuine half-step clash against both neighbors — this instability is the entire point, giving the scale its distinctive "blue," unresolved-sounding character.

**Where it falls in Box 1, concretely:** on the G-string, one fret above the perfect-4th note already in the shape (fret 8, immediately next to Box 1's existing fret-7 note on that string). A single new note, added to a shape you already know.

**How it\'s typically used, honestly:** the blue note is almost always used as a quick passing tone (briefly touched, often bent, rather than held) between the surrounding pentatonic notes, not as a note to linger on — Module 25\'s bending technique is exactly the tool most commonly paired with it.`,
    simpleHi: `**Blues scale, precisely:** minor pentatonic scale lo (root, m3, 4, 5, m7) aur exactly ek note add karo — flat 5th (+6 semitones, exactly perfect 4th aur perfect 5th ke beech mein). A ke liye: A-C-D-D#-E-G (total chhah notes).

**Ye ek note, specifically, har possible addition mein se kyun:** flat 5th deliberately pentatonic scale ke apne do notes (4th aur 5th) ke beech baithta hai, dono neighbors ke against ek genuine half-step clash create karte hue — ye instability hi poora point hai, scale ko uska distinctive "blue," unresolved-sounding character deta hua.

**Ye Box1 mein concretely kahan padta hai:** G-string par, shape mein already maujood perfect-4th note se ek fret upar (fret8, us string par Box1 ke existing fret-7 note ke immediately next). Ek single naya note, ek shape mein add hua jo tumhe already pata hai.

**Ye typically kaise use hota hai, honestly:** blue note almost hamesha ek quick passing tone ki tarah use hota hai (briefly touched, often bent, hold karne ke bajaye) surrounding pentatonic notes ke beech, linger karne wala note nahi — Module 25 ki bending technique exactly wo tool hai jo isके saath sabse commonly paired hota hai.`,

    content: `**Why the flat 5th sitting "exactly halfway between" two existing notes is what makes it work, not a random extra note.** A note that clashed with the WHOLE scale, everywhere, would just sound like a mistake. A note that clashes specifically against its two immediate neighbors, while the rest of the scale remains fully consonant, creates a controlled, deliberate moment of tension inside an otherwise stable structure — precisely why it\'s musically useful rather than simply "wrong."

**Why this note is called the "blue" note, connecting to genre history honestly.** This flattened 5th (and related flattened notes in the same family) is a defining characteristic of blues music\'s harmonic vocabulary, which is why it carries this specific name — its use spread from blues into rock, jazz, and many other genres precisely because of the expressive tension this lesson describes.

**A closing, honest note on Module 22 and Part VIII as a whole.** This module deliberately introduced ONE scale (with its blues variant) in depth, rather than surveying many scales shallowly — matching this course\'s consistent choice throughout (depth over breadth) since Module 1. Module 23 (Modes Explained Simply) will introduce additional scale concepts, but everything there builds on the same interval-formula thinking this module established, not a new, unrelated way of thinking about scales.`,
    contentHi: `**Flat 5th ka do existing notes ke "exactly beech mein" baithna use kyun kaam karwaata hai, ek random extra note nahi.** Ek note jo POORE scale se clash karta, har jagah, bas ek mistake jaisa sound karta. Ek note jo specifically apne do immediate neighbors ke against clash karta hai, jabki baaki scale poori tarah consonant rehta hai, ek controlled, deliberate moment of tension create karta hai ek otherwise stable structure ke andar — precisely isliye ye musically useful hai, simply "galat" nahi.

**Ye note "blue" note kyun kehlaata hai, genre history se honestly connect karte hue.** Ye flattened 5th (aur related flattened notes usi family mein) blues music ki harmonic vocabulary ki ek defining characteristic hai, isliye ye specific naam carry karta hai — iska use blues se rock, jazz, aur bahut saare doosre genres mein spread hua exactly is expressive tension ki wajah se jo ye lesson describe karta hai.

**Module 22 aur poore Part VIII par ek closing, honest note.** Ye module deliberately EK scale introduce karta hai (uske blues variant ke saath) depth mein, bahut saare scales ko shallowly survey karne ke bajaye — is course ki consistent choice ko match karte hue poore raaste (depth over breadth) Module 1 se. Module 23 (Modes Explained Simply) additional scale concepts introduce karega, lekin wahan sab kuch usi interval-formula thinking par build karta hai jo is module ne establish ki, scales ke baare mein sochne ka ek naya, unrelated tareeka nahi.`,

    examples: [
      {
        title: 'The blue note added to Box 1 — a single new highlighted cell',
        titleHi: 'Box1 mein add hua blue note — ek single naya highlighted cell',
        previewHeight: 340,
        code: `Box 1's existing G-string note: fret 7 (D, perfect 4th).
Blues scale adds: fret 8 on the same string (D#/Eb, the flat 5th).

One fret over from a note you already had — the smallest possible addition.`,
        preview: diagramPreviewHtml(
          fretboardMapSvg(8, [
            [3, 7],
            [3, 8],
          ]),
          'The perfect 4th (fret 7, already in Box 1) and the blue note right beside it (fret 8) — the entire blues-scale addition, in one place.',
        ),
        explain:
          'Seeing the blue note sitting immediately next to a note you already knew makes the "one small addition" framing concrete rather than abstract — this is literally one fret away from familiar territory.',
        explainHi:
          'Blue note ko ek aise note ke immediately next baithe dekhna jo tumhe already pata tha "ek chhota addition" framing ko concrete banata hai, abstract nahi — ye literally familiar territory se ek fret door hai.',
      },
    ],

    mistakes: [
      {
        wrong: 'Treating the blue note as a fully equal 6th member of the scale, to be used as freely and as often as the other 5 notes.',
        right: 'Use it deliberately and sparingly as a passing tone, typically bent or quickly passed through rather than held.',
        why: 'The blue note\'s entire musical value comes from its deliberate instability — overusing it or holding it like a stable note undermines the exact tension that makes it effective.',
        whyHi: 'Blue note ki poori musical value uski deliberate instability se aati hai — ise overuse karna ya ek stable note ki tarah hold karna exactly us tension ko undermine karta hai jo ise effective banaata hai.',
      },
    ],

    realWorld: [
      {
        en: 'That instantly recognizable "bluesy" sound in classic rock and blues guitar solos is, in a large number of cases, this exact one added note being bent into and out of — a small, precise technique responsible for a very distinctive genre signature.',
        hi: 'Classic rock aur blues guitar solos mein wo instantly recognizable "bluesy" sound, bahut saare cases mein, exactly yahi ek added note hai jise bend karke andar-baahar kiya ja raha hai — ek chhoti, precise technique jo ek bahut distinctive genre signature ke liye responsible hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Is the "blues scale" a completely different scale from the minor pentatonic, requiring separate memorization?',
        qHi: 'Kya "blues scale" minor pentatonic se ek poori tarah alag scale hai, jise separately memorize karne ki zaroorat hai?',
        a: 'No — it\'s the exact same 5-note shape plus one additional, specific note. Anyone who already knows a pentatonic box shape is one small addition away from the blues scale version of the same shape, not starting from zero.',
        aHi: 'Nahi — ye exact same 5-note shape hai plus ek additional, specific note. Jise bhi ek pentatonic box shape already pata hai wo usi shape ke blues scale version se ek chhota addition door hai, zero se shuru nahi kar raha.',
      },
    ],

    exercises: [
      {
        task: 'Using Module 19\'s interval-counting method, confirm that the flat 5th of A (a semitone count of +6 from the root) is indeed D#, and check that this matches the fret 8 G-string position this lesson identified.',
        taskHi: 'Module 19 ke interval-counting method use karke, confirm karo ki A ka flat 5th (root se +6 semitones ka count) genuinely D# hai, aur check karo ki ye is lesson ne identify ki hui fret8 G-string position se match karta hai.',
        hint: 'A is 5 semitones above the low-E string\'s open note; count 6 semitones up from A itself using the chromatic sequence, then verify against the G-string\'s own note-naming from Module 18.',
        hintHi: 'A low-E string ke open note se 5 semitones upar hai; A se hi chromatic sequence use karke 6 semitones upar count karo, phir Module 18 se G-string ke apne note-naming ke against verify karo.',
      },
    ],

    keyTakeaways: [
      'The blues scale = minor pentatonic + one added note, the flat 5th (+6 semitones), sitting deliberately between the scale\'s own 4th and 5th.',
      'That single note\'s value comes from its deliberate instability — used as a quick, often-bent passing tone, not held like a stable note.',
      'This closes the "one scale, deeply understood" approach of Module 22 — Module 23 builds on the same interval-formula thinking for modes.',
    ],
    keyTakeawaysHi: [
      'Blues scale = minor pentatonic + ek added note, flat 5th (+6 semitones), scale ke apne 4th aur 5th ke beech deliberately baithta hua.',
      'Us single note ki value uski deliberate instability se aati hai — ek quick, often-bent passing tone ki tarah use hota hai, ek stable note ki tarah hold nahi.',
      'Ye Module 22 ke "ek scale, deeply understood" approach ko close karta hai — Module 23 modes ke liye usi interval-formula thinking par build karta hai.',
    ],
    guitarPractice: { sequences: [{"title":"The 4th and the blue note on the G string","titleHi":"G string par 4th aur blue note","defaultBpm":80,"notes":[{"string":3,"fret":7,"beat":0},{"string":3,"fret":8,"beat":1}]}] },
  },
];
