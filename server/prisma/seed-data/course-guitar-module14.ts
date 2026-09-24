/**
 * Guitar Course — Module 14: The Capo & Transposing, lessons 1-3.
 *
 * Lesson 1: What a capo actually does, mechanically.
 * Lesson 2: Transposing — singing "Roadside" (Module 13) in a different
 *           key using a capo, without learning new chord shapes.
 * Lesson 3: Capo chord-shape shortcuts — using easy open shapes to fake
 *           harder chords elsewhere on the neck.
 */

import type { CourseLesson } from './course-js-module1';
import { chordPreviewHtml, diagramPreviewHtml } from './guitar-diagrams';
import { CHORDS } from './guitar-chords-data';

export const GUITAR_MODULE_14: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'what-a-capo-actually-does',
    title: 'What a Capo Actually Does',
    titleHi: 'Ek Capo Actually Kya Karta Hai',
    description: 'A small clamp with an outsized reputation for mystery — the mechanism is simpler than it seems.',
    descriptionHi: 'Ek chhota clamp jiski mystery ke liye ek outsized reputation hai — mechanism jitna lagta hai usse simpler hai.',
    difficulty: 'EASY',
    duration: 15,
    order: 1,

    analogy: {
      en: '**A capo is a movable, artificial nut.** Module 1 introduced the nut — the thin strip at the top of the neck that open strings ring against. A capo clamps across all 6 strings at some fret and simply acts as a NEW nut at that position — every "open" string now actually starts at the capo\'s fret instead of fret 0.',
      hi: '**Ek capo ek movable, artificial nut hai.** Module 1 ne nut introduce kiya tha — neck ke top par wo thin strip jiske against open strings ring karti hain. Ek capo kisi fret par saari 6 strings ke across clamp karta hai aur bas us position par ek NAYA nut ki tarah act karta hai — har "open" string ab actually capo ke fret se shuru hoti hai, fret 0 se nahi.',
    },

    simple: `**The mechanism, precisely:** clamp a capo across all 6 strings at, say, fret 2. Every chord shape you play works EXACTLY as before (same fingers, same relative frets) — but because the capo has replaced fret 0 with fret 2 as the effective "open" position, every chord now sounds 2 frets\' worth higher in pitch than it would without the capo.

**Why this matters practically:** the exact same Em shape you\'ve known since Module 4 produces a genuinely different, higher-pitched chord with a capo on — without you needing to learn a single new finger position. The shape stays identical; only the resulting pitch changes.

**A capo does NOT change which strings ring open vs. muted, or which fingers you use** — Module 5\'s C chord still mutes the low E string, capo on or off. The capo only shifts the reference point every measurement is taken from.`,
    simpleHi: `**Mechanism, precisely:** ek capo ko saari 6 strings ke across clamp karo, say, fret 2 par. Tum jo bhi chord shape bajaate ho EXACTLY pehle jaisa kaam karta hai (same fingers, same relative frets) — lekin kyunki capo ne fret 0 ko fret 2 se replace kar diya hai effective "open" position ki tarah, har chord ab bina capo ke jitni pitch hoti usse 2 frets zyada high pitch mein sound karta hai.

**Ye practically kyun matter karta hai:** wahi exact Em shape jo tumhe Module 4 se pata hai capo on hone par ek genuinely different, higher-pitched chord produce karta hai — bina tumhe ek bhi nayi finger position seekhne ki zaroorat ke. Shape identical rehta hai; sirf resulting pitch badalti hai.

**Capo ye NAHI badalta ki kaunsi strings open vs muted ring karti hain, ya kaunsi fingers use hoti hain** — Module 5 ka C chord abhi bhi low E string mute karta hai, capo on ya off. Capo sirf us reference point ko shift karta hai jahan se har measurement li jaati hai.`,

    content: `**Why the capo idea connects directly back to Module 2's fret-position labels.** A "3fr" label on a chord diagram (Module 2 Lesson 3) means "the whole shape starts at fret 3" — a capo does exactly the same thing to EVERY open chord simultaneously, by physically relocating the effective nut. If you understood fret-position labels, you already understand the core capo mechanism; this lesson is applying a concept you already have to a new physical tool.

**Why guitarists use a capo at all, when they could just learn different chord shapes higher up the neck instead.** Open-position chords (Modules 4-5) are mechanically easier than the barre/movable shapes (Module 17) that would otherwise be needed to play in many keys — a capo lets a player keep using the EASY open shapes while still landing on whatever actual pitch a song needs, trading a small piece of hardware for a large amount of technical difficulty avoided.

**A precise, useful fact: each fret the capo moves up raises pitch by exactly one semitone** (the same fixed musical step from Module 2\'s fret explanation). This is what makes capo positions precisely calculable rather than trial-and-error — Lesson 2 uses this fact directly to transpose a real piece to a specific target key.`,
    contentHi: `**Capo idea directly Module 2 ke fret-position labels se kaise connect hota hai.** Ek chord diagram par "3fr" label (Module 2 Lesson 3) ka matlab hai "poora shape fret 3 se shuru hota hai" — ek capo exactly wahi cheez HAR open chord ke saath simultaneously karta hai, effective nut ko physically relocate karke. Agar tumhe fret-position labels samajh aaye, tumhe already core capo mechanism samajh aa gaya; ye lesson ek concept apply kar raha hai jo tumhare paas already hai ek naye physical tool par.

**Guitarists capo bilkul use hi kyun karte hain, jab wo bajaye neck mein upar alag chord shapes seekh sakte hain.** Open-position chords (Modules 4-5) barre/movable shapes (Module 17) se mechanically easier hain jo otherwise bahut saari keys mein bajaane ke liye chahiye hote — ek capo ek player ko EASY open shapes use karte rehne deta hai jabki phir bhi wo actual pitch land karte hue jo ek song ko chahiye, hardware ke ek chhote piece ko technical difficulty ke ek bade amount ke against trade karte hue jo avoid ho gaya.

**Ek precise, useful fact: capo jitna ek fret upar move karta hai utna hi pitch exactly ek semitone se raise hoti hai** (wahi fixed musical step Module 2 ki fret explanation se). Yahi hai jo capo positions ko precisely calculable banata hai trial-and-error ke bajaye — Lesson 2 is fact ko directly use karta hai ek real piece ko ek specific target key mein transpose karne ke liye.`,

    examples: [
      {
        title: 'Em with and without a capo at fret 2',
        titleHi: 'Em with aur without capo fret 2 par',
        code: `No capo: Em shape, fingers press the same as always, sounds as "Em."
Capo at fret 2: SAME Em shape, SAME fingers — but the capo has
  moved the effective nut, so the resulting chord actually sounds
  2 semitones higher (a different chord name entirely, "F#m").`,
        previewHeight: 330,
        preview: chordPreviewHtml(CHORDS.Em, 'This exact shape and fingering never changes — only where the capo sits changes what pitch it actually produces.'),
        explain:
          'The diagram itself looks completely identical with or without a capo — the capo\'s effect is invisible to the chord diagram (which only shows relative finger positions) and only audible in the actual resulting pitch, which is precisely the point.',
        explainHi:
          'Diagram khud capo ke saath ya bina bilkul identical dikhta hai — capo ka effect chord diagram ke liye invisible hai (jo sirf relative finger positions dikhata hai) aur sirf actual resulting pitch mein audible hai, jo precisely point hai.',
      },
    ],

    mistakes: [
      {
        wrong: 'Assuming a capo changes which fingers or fret numbers you use within a chord shape.',
        right: 'Understand that a capo shifts the reference point (the effective nut); every chord shape and fingering stays exactly the same relative to the capo.',
        why: 'The whole value of a capo comes from shapes staying identical — if you found yourself needing different fingerings with a capo on, something about the setup (likely capo placement) is wrong.',
        whyHi: 'Capo ki poori value shapes ke identical rehne se aati hai — agar tumhe capo on hone par alag fingerings ki zaroorat mehsoos ho, setup ke baare mein kuch (likely capo placement) galat hai.',
      },
    ],

    realWorld: [
      {
        en: 'Singer-songwriters use a capo constantly to match a song\'s chords to their own comfortable vocal range without needing to learn the song in a technically harder key — Lesson 2 covers exactly this use case.',
        hi: 'Singer-songwriters ek capo constantly use karte hain ek song ke chords ko apni comfortable vocal range se match karne ke liye, ek technically harder key mein song seekhne ki zaroorat ke bina — Lesson 2 exactly ye use case cover karta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Does a capo make a guitar sound worse or "fake" compared to playing higher up the neck normally?',
        qHi: 'Kya ek capo guitar ko worse ya "fake" sound karwaata hai neck mein normally upar bajaane ke comparison mein?',
        a: "Not at all — a capo is standard, widely used equipment across professional recordings and live performances, not a beginner crutch. It produces a genuinely different, often brighter tonal character (open strings ringing at a higher pitch) that many players and producers specifically prefer for certain songs.",
        aHi: 'Bilkul nahi — ek capo standard, widely used equipment hai professional recordings aur live performances ke across, ek beginner crutch nahi. Ye ek genuinely different, often brighter tonal character produce karta hai (open strings higher pitch par ringing) jo bahut saare players aur producers specifically kuch songs ke liye prefer karte hain.',
      },
    ],

    exercises: [
      {
        task: 'If you have access to a capo, clamp it at fret 2 and play through the six campfire chords (Modules 4-5) exactly as always. Notice the fingerings feel identical even though the sound is higher.',
        taskHi: 'Agar tumhare paas ek capo tak access hai, use fret 2 par clamp karo aur six campfire chords (Modules 4-5) ke through bilkul hamesha jaisa bajao. Notice karo fingerings identical feel karte hain chahe sound higher ho.',
        hint: 'If you don\'t have a capo yet, this concept still makes sense purely conceptually — Lesson 2\'s transposition table works the same way whether or not you can physically test it right now.',
        hintHi: 'Agar tumhare paas abhi capo nahi hai, ye concept phir bhi purely conceptually sense banata hai — Lesson 2 ka transposition table waise hi kaam karta hai chahe tum ise abhi physically test kar sako ya nahi.',
      },
    ],

    keyTakeaways: [
      'A capo is a movable, artificial nut — it relocates the effective "fret 0" for every string simultaneously.',
      'Every chord shape and fingering stays exactly the same with a capo on — only the resulting pitch changes.',
      'Each fret the capo moves up raises the pitch of every chord by exactly one semitone.',
    ],
    keyTakeawaysHi: [
      'Ek capo ek movable, artificial nut hai — ye har string ke liye effective "fret 0" ko simultaneously relocate karta hai.',
      'Capo on hone par har chord shape aur fingering bilkul same rehti hai — sirf resulting pitch badalti hai.',
      'Capo jitna ek fret upar move karta hai utni hi har chord ki pitch exactly ek semitone se raise hoti hai.',
    ],
    guitarPractice: { sequences: [{"title":"Em root, open vs. capo at fret 2","titleHi":"Em root, open vs. capo fret 2","defaultBpm":60,"notes":[{"string":0,"fret":0,"beat":0},{"string":0,"fret":2,"beat":2}]}] },
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'transposing-with-a-capo',
    title: 'Transposing — Singing "Roadside" in Your Own Key',
    titleHi: 'Transposing — "Roadside" Ko Apni Key Mein Gaana',
    description: 'Using Module 13\'s final piece to demonstrate exactly how a capo changes what key you\'re playing in, precisely and predictably.',
    descriptionHi: 'Module 13 ke final piece ko use karke exactly dikhana ki ek capo kaise badalta hai ki tum kis key mein bajaa rahe ho, precisely aur predictably.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: '**Sliding an entire printed page up a photocopier, unchanged, to shift where it lands on new paper.** The content of the page (the chord shapes) never changes — only its position (the resulting pitch) shifts, by an amount you control precisely, sliding the same unchanged original by a known, deliberate distance.',
      hi: '**Ek poore printed page ko ek photocopier par upar slide karna, unchanged, ye shift karne ke liye ki wo naye paper par kahan land karta hai.** Page ka content (chord shapes) kabhi nahi badalta — sirf uski position (resulting pitch) shift hoti hai, ek amount se jo tum precisely control karte ho, wahi unchanged original ko ek known, deliberate distance se slide karte hue.',
    },

    simple: `**Why you'd want to transpose at all:** a song might be written/charted in a key that's genuinely uncomfortable for your singing voice (too high or too low) — transposing lets you shift the WHOLE song's pitch up or down while keeping every relative chord relationship identical.

**Applying it to "Roadside" (Module 13):** the original chords were Em, C, G, D, Am. Adding a capo at fret 2 and playing those EXACT SAME shapes now actually sounds like a song in a different key, roughly 2 semitones higher — without changing a single finger position from what you already know cold.

**The general rule:** capo at fret N means "everything you play sounds N semitones higher than the shapes alone would suggest." If a song as written is too low for your voice, add a capo (higher fret = higher pitch) and keep playing the identical shapes — no new chords to learn, just a clamp position to choose.`,
    simpleHi: `**Tum transpose bilkul kyun karna chahoge:** ek song genuinely tumhari singing voice ke liye ek uncomfortable key mein likha/charted ho sakta hai (bahut high ya bahut low) — transposing tumhe poore song ki pitch upar ya neeche shift karne deta hai jabki har relative chord relationship identical rakhte hue.

**Ise "Roadside" (Module 13) par apply karna:** original chords the Em, C, G, D, Am. Fret 2 par ek capo add karna aur wahi EXACT SAME shapes bajaana ab actually ek song jaisa sound karta hai ek alag key mein, roughly 2 semitones higher — bina us se ek bhi finger position badle jo tumhe already pakka pata hai.

**General rule:** capo at fret N ka matlab hai "tum jo bhi bajaate ho wo N semitones higher sound karta hai us se jo akele shapes suggest karte." Agar likha hua song tumhari voice ke liye bahut low hai, ek capo add karo (higher fret = higher pitch) aur wahi identical shapes bajaate raho — koi naye chords seekhne nahi, bas ek clamp position choose karna hai.`,

    content: `**Why transposing with a capo is strictly easier than transposing by learning new chord shapes in a new key.** The alternative approach — actually playing "Roadside" in a genuinely different key without a capo — would require learning entirely different chord shapes (likely involving barre chords, Module 17, which don't exist yet in your vocabulary at this point in the course). A capo achieves the identical pitch result using only shapes you already have solid.

**The precise math, made usable.** Each capo fret = +1 semitone from the open-position sound. Moving from no capo to capo-fret-2 is +2 semitones total. This is exactly why Module 2's fret explanation (each fret is a fixed musical step) wasn't just trivia — it's the literal mechanism that makes capo position calculations precise rather than approximate.

**A genuinely important distinction: transposing changes the ACTUAL pitch, but chord NAMES on a chart conventionally stay written relative to the shapes played, not the capo'd sound.** A chart might say "capo 2, play Em-C-G-D-Am" — the chord names refer to the SHAPES (what your hands do), while the capo annotation tells you the actual resulting pitch is higher. This convention, once understood, prevents a common confusion when reading real capo\'d chord charts online.`,
    contentHi: `**Ek capo se transpose karna naye key mein naye chord shapes seekh kar transpose karne se strictly easier kyun hai.** Alternative approach — bina capo ke genuinely ek alag key mein "Roadside" actually bajaana — poori tarah alag chord shapes seekhne ki zaroorat hoti (likely barre chords involve karte hue, Module 17, jo is course mein abhi tak tumhari vocabulary mein exist nahi karte). Ek capo identical pitch result achieve karta hai sirf un shapes se jo tumhare paas already solid hain.

**Precise math, usable banaya gaya.** Har capo fret = open-position sound se +1 semitone. Bina capo se capo-fret-2 tak move karna total +2 semitones hai. Yahi exactly reason hai ki Module 2 ki fret explanation (har fret ek fixed musical step hai) sirf trivia nahi thi — ye literal mechanism hai jo capo position calculations ko precise banata hai, approximate nahi.

**Ek genuinely important distinction: transposing ACTUAL pitch badalta hai, lekin ek chart par chord NAMES conventionally bajaaye gaye shapes ke relative likhe rehte hain, capo'd sound ke nahi.** Ek chart keh sakta hai "capo 2, play Em-C-G-D-Am" — chord names SHAPES ko refer karte hain (tumhare hands kya karte hain), jabki capo annotation tumhe batata hai ki actual resulting pitch higher hai. Ye convention, ek baar samajh aane par, real capo'd chord charts online padhte waqt ek common confusion se bachaata hai.`,

    examples: [
      {
        title: '"Roadside," capo\'d at different positions',
        titleHi: '"Roadside," alag positions par capo\'d',
        code: `No capo:      shapes as written, original pitch.
Capo fret 1:  same shapes, +1 semitone higher.
Capo fret 2:  same shapes, +2 semitones higher.
Capo fret 3:  same shapes, +3 semitones higher.

In every case: still Em, C, G, D, Am shapes — your hands never change.`,
        explain:
          'This table is the entire lesson in one place: the LEFT side (capo position) is the only thing that changes; the RIGHT side (chord shapes, finger positions) is constant across every row — that constancy is the whole value proposition of using a capo at all.',
        explainHi:
          'Ye table poora lesson ek jagah hai: LEFT side (capo position) hi wo cheez hai jo badalti hai; RIGHT side (chord shapes, finger positions) har row ke across constant hai — wahi constancy capo bilkul use karne ka poora value proposition hai.',
      },
    ],

    mistakes: [
      {
        wrong: 'Trying to learn different chord shapes to change a song\'s key instead of reaching for a capo, when the shapes you already know would work fine with one.',
        right: 'Default to a capo for key changes when your existing open-shape vocabulary can achieve the target key that way.',
        why: 'Learning new shapes when a capo would achieve the identical pitch result with zero new technique is strictly more work for no additional benefit.',
        whyHi: 'Naye shapes seekhna jab ek capo zero new technique ke saath identical pitch result achieve kar sakta ho strictly zyada kaam hai bina kisi additional benefit ke.',
      },
    ],

    realWorld: [
      {
        en: 'When you see "Capo 3" written at the top of an online chord chart, this is exactly what it means — play the listed chord shapes exactly as shown, with a capo at fret 3, and the actual sound will match the original recording\'s key.',
        hi: 'Jab tum ek online chord chart ke top par "Capo 3" likha dekho, exactly yahi iska matlab hai — listed chord shapes ko exactly jaisa dikhaya hai bajao, fret 3 par ek capo ke saath, aur actual sound original recording ki key se match karega.',
      },
    ],

    interviewQA: [
      {
        q: 'If I don\'t own a capo, is there any way to transpose?',
        qHi: 'Agar mere paas capo nahi hai, kya transpose karne ka koi tareeka hai?',
        a: 'Yes — you can transpose by learning the chord shapes for the actual target key directly (which may include barre chords, covered in Module 17), it just requires more new technique than a capo does. A capo is the shortcut, not the only method.',
        aHi: 'Haan — tum actual target key ke chord shapes directly seekhkar transpose kar sakte ho (jismein barre chords shaamil ho sakte hain, Module 17 mein covered), isse bas capo se zyada new technique chahiye. Capo shortcut hai, sirf method nahi.',
      },
    ],

    exercises: [
      {
        task: 'Write out the transposition table (capo position -> semitones higher) for capo positions 0 through 5, using Lesson 1\'s "+1 semitone per fret" rule.',
        taskHi: 'Transposition table likho (capo position -> semitones higher) capo positions 0 se 5 tak ke liye, Lesson 1 ke "+1 semitone per fret" rule use karke.',
        hint: 'This is pure arithmetic (fret number = semitones), not something to memorize by rote — being able to derive it on the spot is more useful than memorizing a fixed table.',
        hintHi: 'Ye pure arithmetic hai (fret number = semitones), rote se memorize karne wali cheez nahi — ise spot par derive kar paana ek fixed table memorize karne se zyada useful hai.',
      },
    ],

    keyTakeaways: [
      'A capo lets you transpose a whole song\'s pitch while keeping every chord shape you already know identical.',
      'Capo fret number = semitones higher than the open-position sound — a precise, calculable relationship.',
      'On a real chord chart, chord names refer to the shapes played; the capo annotation separately tells you the actual resulting pitch.',
    ],
    keyTakeawaysHi: [
      'Ek capo tumhe poore song ki pitch transpose karne deta hai jabki har chord shape jo tumhe already pata hai identical rakhte hue.',
      'Capo fret number = open-position sound se semitones higher — ek precise, calculable relationship.',
      'Ek real chord chart par, chord names bajaaye gaye shapes ko refer karte hain; capo annotation separately tumhe actual resulting pitch batata hai.',
    ],
    guitarPractice: { sequences: [{"title":"Roadside roots, no capo vs. capo 2","titleHi":"Roadside roots, no capo vs. capo 2","defaultBpm":65,"notes":[{"string":0,"fret":0,"beat":0},{"string":0,"fret":8,"beat":1},{"string":0,"fret":2,"beat":3},{"string":0,"fret":10,"beat":4}]}] },
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'capo-chord-shape-shortcuts',
    title: 'Capo Chord-Shape Shortcuts',
    titleHi: 'Capo Chord-Shape Shortcuts',
    description: 'Using an easy open shape plus a capo to "fake" a harder chord elsewhere on the neck — a genuinely practical trick, not a gimmick.',
    descriptionHi: 'Ek easy open shape plus ek capo use karke neck mein kahin aur ek harder chord "fake" karna — ek genuinely practical trick, gimmick nahi.',
    difficulty: 'MEDIUM',
    duration: 15,
    order: 3,

    analogy: {
      en: '**A universal remote programmed to mimic a specific device.** A universal remote doesn\'t need to BE the original device to control it — it just needs to send the right signal. A capo\'d open shape doesn\'t need to physically be a barre chord to produce that chord\'s actual pitch — it just needs to land on the right fret.',
      hi: '**Ek universal remote jo ek specific device ko mimic karne ke liye programmed hai.** Ek universal remote ko use control karne ke liye original device HONA zaroori nahi — use bas sahi signal bhejna hai. Ek capo\'d open shape ko physically ek barre chord hone ki zaroorat nahi us chord ka actual pitch produce karne ke liye — use bas sahi fret par land karna hai.',
    },

    simple: `**The shortcut, concretely:** instead of learning Module 17\'s F barre chord (genuinely one of the hardest early chords, note-perfect same pitch as an open E shape with a capo at fret 1), you can play the easy open E shape with a capo at fret 1 and get the identical actual pitch.

\`\`\`
Open E shape (easy, Module 4) + capo at fret 1 = sounds like F.
Open G shape (easy, Module 4) + capo at fret 2 = sounds like A.
Open A shape (easy, Module 6) + capo at fret 2 = sounds like B.
\`\`\`

**Why this isn\'t "cheating":** the resulting pitch is genuinely, acoustically identical to the harder version — there\'s no asterisk on the sound itself. This is a legitimate technique real players use constantly, not a beginner-only workaround to eventually "graduate" past.`,
    simpleHi: `**Shortcut, concretely:** Module 17 ka F barre chord seekhne ke bajaye (genuinely early chords mein se sabse hard mein se ek, note-perfect same pitch jitna ek open E shape with capo fret 1), tum easy open E shape ko fret 1 par capo ke saath bajaa sakte ho aur identical actual pitch pa sakte ho.

\`\`\`
Open E shape (easy, Module 4) + capo fret 1 par = F jaisa sound karta hai.
Open G shape (easy, Module 4) + capo fret 2 par = A jaisa sound karta hai.
Open A shape (easy, Module 6) + capo fret 2 par = B jaisa sound karta hai.
\`\`\`

**Ye "cheating" kyun nahi hai:** resulting pitch genuinely, acoustically identical hai harder version se — sound khud par koi asterisk nahi hai. Ye ek legitimate technique hai jo real players constantly use karte hain, ek beginner-only workaround nahi jise eventually "graduate" karna hai.`,

    content: `**Why this technique doesn\'t make Module 17\'s barre chords pointless to learn.** A capo needs to be physically repositioned to shift key, which takes a moment and requires carrying the hardware — a barre chord shape is instantly movable anywhere on the neck with zero repositioning delay, and works when you don\'t have a capo on hand at all. Each approach has genuine advantages; knowing both gives you more actual flexibility than either alone.

**Why this specific shortcut is worth knowing about now, well before Module 17 teaches barre technique properly.** Recognizing that "a hard chord is often just an easy shape plus a capo" reframes barre chords from "mandatory next hurdle" to "one of two valid approaches, with real trade-offs" — this context makes Module 17\'s eventual barre-chord work feel like gaining an additional option, not merely suffering through a difficulty spike, because you\'ll already know a working alternative exists.

**The honest limitation, stated clearly.** This trick only works when you're already open to using a capo at all (some playing contexts or personal preferences skip capos entirely), and only produces ONE specific chord's pitch at a time — a song genuinely requiring several different hard chords in the same song, at different points, may still need real barre-chord technique regardless. This is a genuinely useful tool, not a universal replacement for Module 17\'s content.`,
    contentHi: `**Ye technique Module 17 ke barre chords ko seekhna pointless kyun nahi banati.** Key shift karne ke liye ek capo ko physically reposition karna padta hai, jismein ek moment lagta hai aur hardware carry karna padta hai — ek barre chord shape instantly neck mein kahin bhi movable hai zero repositioning delay ke saath, aur tab kaam karta hai jab tumhare paas bilkul capo na ho. Har approach ke genuine advantages hain; dono jaanna tumhe akele se zyada actual flexibility deta hai.

**Ye specific shortcut abhi jaanne layak kyun hai, Module 17 ke barre technique properly sikhaane se bahut pehle.** Ye recognize karna ki "ek hard chord often bas ek easy shape plus ek capo hai" barre chords ko "mandatory next hurdle" se "do valid approaches mein se ek, real trade-offs ke saath" mein reframe karta hai — ye context Module 17 ke eventual barre-chord kaam ko ek additional option gain karne jaisa feel karwaata hai, sirf ek difficulty spike ke through suffer karne ke bajaye, kyunki tumhe already pata hoga ki ek working alternative exist karta hai.

**Honest limitation, clearly stated.** Ye trick sirf tabhi kaam karta hai jab tum already ek capo bilkul use karne ke liye open ho (kuch playing contexts ya personal preferences capos ko poori tarah skip karte hain), aur ek time par sirf EK specific chord ki pitch produce karta hai — ek song jise genuinely same song mein, alag points par, kai alag hard chords chahiye, phir bhi real barre-chord technique chahiye ho sakti hai regardless. Ye ek genuinely useful tool hai, Module 17 ke content ka ek universal replacement nahi.`,

    examples: [
      {
        title: 'The open-E-shape-as-F trick, side by side with the real barre',
        titleHi: 'Open-E-shape-as-F trick, real barre ke saath saath',
        previewHeight: 330,
        code: `Open E shape + capo fret 1 = F (acoustically identical to the barre F).
Both produce the exact same pitch; the open-E+capo version uses
fingers you already have solid since Module 4.`,
        preview: chordPreviewHtml(CHORDS.E, 'This exact open E shape, with a capo at fret 1, sounds identical to the F barre chord Module 17 will teach.'),
        explain:
          'This is literally the same diagram from Module 4\'s E chord lesson — the shortcut requires learning nothing new at all, which is precisely what makes it a genuine shortcut rather than a different-but-comparable amount of work.',
        explainHi:
          'Ye literally Module 4 ke E chord lesson ka wahi diagram hai — shortcut ke liye bilkul kuch naya seekhne ki zaroorat nahi, jo precisely wahi hai jo ise ek different-but-comparable amount of work ke bajaye ek genuine shortcut banata hai.',
      },
    ],

    mistakes: [
      {
        wrong: 'Believing a capo+easy-shape chord is a lesser or "fake" version of the real chord.',
        right: 'Recognize the resulting pitch is genuinely, acoustically identical — this is a legitimate technique, not a workaround to feel apologetic about.',
        why: 'The physical technique used to produce a pitch has no bearing on the pitch\'s legitimacy — a chord sounds like a chord regardless of which valid method produced it.',
        whyHi: 'Ek pitch produce karne ke liye use hui physical technique ka pitch ki legitimacy par koi bearing nahi hai — ek chord ek chord jaisa sound karta hai regardless ki kaunsa valid method use hua.',
      },
    ],

    realWorld: [
      {
        en: 'Professional session guitarists routinely choose between a capo\'d easy shape and a movable barre shape based purely on practical convenience for the specific song — this is a genuine, active decision experienced players make, not something only beginners rely on.',
        hi: 'Professional session guitarists routinely ek capo\'d easy shape aur ek movable barre shape ke beech choose karte hain purely specific song ke liye practical convenience ke basis par — ye ek genuine, active decision hai jo experienced players lete hain, sirf beginners jispar rely karte hain wo cheez nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'How do I know which capo fret + open shape combination produces a specific chord I want?',
        qHi: 'Mujhe kaise pata chalega ki kaunsa capo fret + open shape combination ek specific chord produce karta hai jo main chahta hoon?',
        a: "This requires knowing the fretboard's actual note layout, which Module 18 (The Fretboard Map) covers in full — for now, treat the specific examples in this lesson as illustrations of the general principle, and revisit this shortcut with full calculating power once Module 18 is complete.",
        aHi: 'Isके liye fretboard ka actual note layout jaanna zaroori hai, jo Module 18 (Fretboard Map) poori tarah cover karta hai — abhi ke liye, is lesson ke specific examples ko general principle ke illustrations ki tarah treat karo, aur Module 18 complete hone ke baad is shortcut ko full calculating power ke saath revisit karo.',
      },
    ],

    exercises: [
      {
        task: 'Without a guitar, explain out loud (or write down) why an open E shape with a capo at fret 1 produces the same pitch as a barre chord at fret 1 with the same underlying shape — connect it back to Lesson 1\'s "capo relocates the nut" explanation.',
        taskHi: 'Bina guitar ke, zor se explain karo (ya likho) ki ek open E shape with capo fret 1 par barre chord fret 1 par same underlying shape ke saath same pitch kyun produce karta hai — ise Lesson 1 ki "capo nut relocate karta hai" explanation se wapas connect karo.',
        hint: 'If you can explain this connection clearly without looking back at Lesson 1, that\'s strong evidence the capo mechanism itself (not just this specific trick) is genuinely understood, not just memorized as a fact.',
        hintHi: 'Agar tum ye connection clearly explain kar sako bina Lesson 1 ko wapas dekhe, ye strong evidence hai ki capo mechanism khud (sirf ye specific trick nahi) genuinely samajh aaya hai, sirf ek fact ki tarah memorize nahi kiya.',
      },
    ],

    keyTakeaways: [
      'An easy open shape plus a capo can produce the identical pitch of a harder chord elsewhere on the neck — a genuine, legitimate technique.',
      'This doesn\'t make barre chords (Module 17) pointless — each approach has real trade-offs (repositioning delay vs. instant movability).',
      'The resulting pitch is acoustically identical regardless of which valid technique produced it — there\'s no "lesser" version.',
    ],
    keyTakeawaysHi: [
      'Ek easy open shape plus ek capo neck mein kahin aur ek harder chord ki identical pitch produce kar sakta hai — ek genuine, legitimate technique.',
      'Ye barre chords (Module 17) ko pointless nahi banata — har approach ke real trade-offs hain (repositioning delay vs instant movability).',
      'Resulting pitch acoustically identical hai regardless ki kaunsi valid technique ne use produce kiya — koi "lesser" version nahi hai.',
    ],
    guitarPractice: { sequences: [{"title":"Same G shape, open vs. capo 2","titleHi":"Wahi G shape, open vs. capo 2","defaultBpm":70,"notes":[{"string":0,"fret":3,"beat":0,"finger":3},{"string":0,"fret":5,"beat":2,"finger":3}]}] },
  },
];
