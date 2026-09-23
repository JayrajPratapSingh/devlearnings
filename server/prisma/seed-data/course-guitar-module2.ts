/**
 * Guitar Course — Module 2: Tuning & Reading Diagrams, lessons 1-3.
 *
 * Lesson 1: Standard tuning, tuning by ear (relative tuning) and by
 *           electronic tuner.
 * Lesson 2: Reading TAB notation — a genuinely different skill from chord
 *           diagrams (time-ordered single notes, not a single held shape).
 * Lesson 3: Advanced chord-diagram reading — barre notation and fret-
 *           position labels, so no diagram in this course is unreadable
 *           by the time Module 3 begins.
 */

import type { CourseLesson } from './course-js-module1';
import { chordPreviewHtml, tabExplainerSvg, diagramPreviewHtml } from './guitar-diagrams';
import { CHORDS } from './guitar-chords-data';

export const GUITAR_MODULE_2: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'standard-tuning-by-ear-and-tuner',
    title: 'Standard Tuning — By Ear and By Tuner',
    titleHi: 'Standard Tuning — Kaan Se Aur Tuner Se',
    description: 'Getting to E-A-D-G-B-E reliably, with a tuner (fast, precise) and by ear (slower, but trains a skill you\'ll use forever).',
    descriptionHi: 'E-A-D-G-B-E tak reliably pahunchna, ek tuner se (fast, precise) aur kaan se (slower, lekin ek aisi skill train karta hai jo hamesha kaam aayegi).',
    difficulty: 'EASY',
    duration: 20,
    order: 1,

    analogy: {
      en: '**Tightening the same-sized bolts on a wheel, one at a time.** Tuning is mechanical, not mystical: turn a peg, the string\'s pitch moves up or down, stop exactly at the right spot. A tuner is a torque wrench that tells you the exact number; tuning by ear is doing it by feel and comparison — both get you to the same six correct notes.',
      hi: '**Ek wheel ke same-sized bolts ko ek-ek karke tight karna.** Tuning mechanical hai, mystical nahi: peg ghumao, string ki pitch upar ya neeche move hoti hai, exactly sahi spot par ruk jao. Tuner ek torque wrench hai jo tumhe exact number batata hai; kaan se tuning feel aur comparison se karna hai — dono tumhe same six correct notes tak le jaate hain.',
    },

    simple: `**Tuning with an electronic tuner (do this first, always):**

1. Clip a tuner onto the headstock, or open a tuner app and allow microphone access.
2. Pluck one string at a time. The tuner shows which note it thinks you're closest to (E, A, D, G, B, or e) and whether you're flat (too low, turn the peg to tighten/raise pitch) or sharp (too high, loosen slightly).
3. Turn the correct peg SLOWLY — a little turn moves the pitch a lot. Re-pluck after every small turn.
4. Stop turning exactly when the tuner shows you're centered (usually a green light or a needle dead center).
5. Repeat for all 6 strings, low E to high e.

**Tuning by ear (relative tuning — learn this once you're comfortable with the tuner method):**

The core trick: **the 5th fret of any string sounds the same pitch as the next (thinner) string played open.**

1. Assume your low E string (string 6) is already correctly tuned (check it against a tuner or piano once).
2. Press string 6 at fret 5 and pluck it — that's an A. Compare it to string 5 played open. Tune string 5 until they match.
3. Press string 5 at fret 5 — that's a D. Compare to string 4 open. Tune string 4 to match.
4. Press string 4 at fret 5 — that's a G. Compare to string 3 open. Tune string 3 to match.
5. Press string 3 at fret **4** (not 5 — this is the one exception) — that's a B. Compare to string 2 open. Tune string 2 to match.
6. Press string 2 at fret 5 — that's an e. Compare to string 1 open. Tune string 1 to match.`,
    simpleHi: `**Ek electronic tuner se tuning karna (hamesha ye pehle karo):**

1. Headstock par ek tuner clip karo, ya ek tuner app kholkar microphone access allow karo.
2. Ek time par ek string pluck karo. Tuner dikhata hai ki tum kaunse note ke sabse paas ho (E, A, D, G, B, ya e) aur kya tum flat ho (bahut low, peg ghumakar tight/raise karo) ya sharp (bahut high, thoda loosen karo).
3. Sahi peg ko SLOWLY ghumao — thoda sa turn pitch ko bahut move kar deta hai. Har chhote turn ke baad dobara pluck karo.
4. Exactly tab rukna jab tuner dikhaye ki tum centered ho (usually ek green light ya needle dead center).
5. Saari 6 strings ke liye repeat karo, low E se high e tak.

**Kaan se tuning (relative tuning — tuner method se comfortable hone ke baad ye seekho):**

Core trick: **kisi bhi string ka 5th fret agli (patli) string ke open bajane jaisa hi pitch sound karta hai.**

1. Maan lo tumhari low E string (string 6) already correctly tuned hai (ek baar tuner ya piano se check kar lo).
2. String 6 ko fret 5 par dabao aur pluck karo — wo A hai. Ise string 5 ke open bajane se compare karo. String 5 ko match hone tak tune karo.
3. String 5 ko fret 5 par dabao — wo D hai. String 4 open se compare karo. String 4 ko match karo.
4. String 4 ko fret 5 par dabao — wo G hai. String 3 open se compare karo. String 3 ko match karo.
5. String 3 ko fret **4** par dabao (5 nahi — ye ek exception hai) — wo B hai. String 2 open se compare karo. String 2 ko match karo.
6. String 2 ko fret 5 par dabao — wo e hai. String 1 open se compare karo. String 1 ko match karo.`,

    content: `**Why does string 3 break the pattern (fret 4, not 5)?** Standard tuning isn't perfectly uniform — it's built from mostly-4ths with one 3rd interval (between the G and B strings) specifically so common chord shapes are physically comfortable to finger. That one exception is exactly why this particular tuning became "standard" in the first place, not an arbitrary inconsistency.

**Why tune with a tuner first, ear second?** A tuner gives you an absolute reference (true pitch), while relative tuning only guarantees the strings sound correct RELATIVE TO EACH OTHER — if your starting string 6 is already off, every other string ends up consistently off too, and you'd never know just from the relative method alone. Using a tuner for at least the first string anchors the whole guitar to true pitch; ear training on top of that is what makes you fast and independent of needing a device later (important when you're at a jam, borrowing a friend's guitar, etc.).

**New strings and stretching.** Brand-new strings go out of tune repeatedly for the first several days — this is normal, not a defect. Gently tug/stretch each string away from the fretboard a few times right after installing it (then re-tune) to speed up the settling process; skipping this step means re-tuning constantly for a week instead of a day or two.

**"Flat" and "sharp", precisely:** flat means the pitch is too LOW (needs tightening, turn the peg to raise pitch); sharp means too HIGH (needs loosening). Every tuner uses this exact vocabulary, so it's worth internalizing now rather than re-deriving it every time you glance at a tuner display.`,
    contentHi: `**String 3 pattern kyun todti hai (fret 4, 5 nahi)?** Standard tuning perfectly uniform nahi hai — ye zyadatar 4ths se bana hai ek 3rd interval ke saath (G aur B strings ke beech) specifically taaki common chord shapes physically comfortable finger karne ke liye ho. Wahi ek exception exactly wo reason hai jispe ye particular tuning "standard" bani, koi arbitrary inconsistency nahi.

**Pehle tuner se, phir kaan se tune kyun karein?** Tuner tumhe ek absolute reference deta hai (true pitch), jabki relative tuning sirf guarantee karta hai ki strings EK DOOSRE KE RELATIVE sahi sound karein — agar tumhari starting string 6 already off hai, har doosri string bhi consistently off ho jaati hai, aur sirf relative method se tumhe kabhi pata nahi chalega. Kam se kam pehli string ke liye tuner use karna poori guitar ko true pitch se anchor karta hai; uske upar ear training baad mein tumhe fast aur device-independent banata hai (important jab tum jam par ho, dost ki guitar borrow kar rahe ho, etc.).

**New strings aur stretching.** Bilkul nayi strings pehle kuch dino tak baar-baar out of tune ho jaati hain — ye normal hai, defect nahi. Install karne ke turant baad har string ko fretboard se door gently tug/stretch karo kuch baar (phir re-tune karo) settling process ko speed up karne ke liye; ye step skip karne ka matlab hai ek hafte tak constantly re-tune karna ek-do din ke bajaye.

**"Flat" aur "sharp", precisely:** flat matlab pitch bahut LOW hai (tighten karna zaroori hai, peg ko raise pitch ke liye ghumao); sharp matlab bahut HIGH hai (loosen karna zaroori hai). Har tuner exactly yahi vocabulary use karta hai, isliye ise abhi internalize karna better hai, har baar tuner display dekhte waqt dobara derive karne ke bajaye.`,

    examples: [
      {
        title: 'The relative tuning chain, string by string',
        titleHi: 'Relative tuning chain, string by string',
        code: `String 6 (E) --fret 5--> matches String 5 open (A)
String 5 (A) --fret 5--> matches String 4 open (D)
String 4 (D) --fret 5--> matches String 3 open (G)
String 3 (G) --fret 4--> matches String 2 open (B)   <- the one exception
String 2 (B) --fret 5--> matches String 1 open (e)`,
        explain:
          "This chain only works if you start from a genuinely correct string 6 — errors compound down the chain, so a slightly-off low E produces a guitar that sounds internally 'in tune' with itself but is actually off pitch overall. That's exactly why the simple habit is: tuner for the anchor string, ear for the rest.",
        explainHi:
          "Ye chain sirf tabhi kaam karti hai jab tum ek genuinely correct string 6 se shuru karo — errors chain ke neeche compound hote hain, isliye ek thodi si off low E ek guitar banati hai jo apne aap se internally 'in tune' sound karti hai lekin actually overall pitch se off hai. Yahi exactly wo reason hai ki simple habit ye hai: anchor string ke liye tuner, baaki ke liye kaan.",
      },
    ],

    mistakes: [
      {
        wrong: 'Turning the peg fast and far when a tuner shows you\'re "very flat," overshooting past correct pitch.',
        right: 'Turn slowly in small increments, re-plucking after each small turn, especially as you approach the correct pitch.',
        why: 'A small peg turn changes pitch by a surprisingly large amount — fast, large turns almost always overshoot, and repeatedly overshooting in both directions can fatigue and eventually snap a string.',
        whyHi: 'Ek chhota peg turn pitch ko surprisingly bade amount se badal deta hai — fast, bade turns almost hamesha overshoot karte hain, aur baar-baar dono directions mein overshoot karna string ko fatigue kar sakta hai aur eventually tod sakta hai.',
      },
      {
        wrong: 'Assuming a guitar stays in tune forever once tuned, and only checking when it sounds obviously wrong.',
        right: 'Check tuning at the start of every single practice session, without exception, even if yesterday it was perfect.',
        why: 'Temperature, humidity, and simply playing the strings all shift tuning gradually — a guitar that sounds "fine" can still be enough off-pitch to make chords sound subtly wrong in a way that trains your ear incorrectly if you never check.',
        whyHi: 'Temperature, humidity, aur simply strings bajaana sab gradually tuning shift karte hain — ek guitar jo "fine" sound karti hai phir bhi itni off-pitch ho sakti hai ki chords subtly galat sound karein, jo agar kabhi check na karo to tumhare kaan ko galat train kar deta hai.',
      },
    ],

    realWorld: [
      {
        en: 'Most tuner apps and clip-on tuners default to "chromatic" mode, which detects ANY note, not just the 6 standard ones — useful once you explore alternate tunings later, but for now just confirm the app/tuner is showing you E, A, D, G, B, or E specifically, not some other note entirely (which usually means you\'re tuning the wrong string, or a string is drastically out of range).',
        hi: 'Zyadatar tuner apps aur clip-on tuners default "chromatic" mode mein hote hain, jo KOI BHI note detect karta hai, sirf 6 standard nahi — baad mein alternate tunings explore karte waqt useful hai, lekin abhi bas confirm karo ki app/tuner tumhe specifically E, A, D, G, B, ya E dikha raha hai, koi bilkul doosra note nahi (jo usually matlab hai ki tum galat string tune kar rahe ho, ya ek string drastically range se bahar hai).',
      },
    ],

    interviewQA: [
      {
        q: 'Is it okay to only ever use a tuner app and never learn tuning by ear?',
        qHi: 'Kya sirf hamesha ek tuner app use karna aur kabhi kaan se tuning na seekhna theek hai?',
        a: 'For pure practicality, yes — a tuner app is fast and accurate, and most working musicians rely on one most of the time. But ear tuning trains general pitch-recognition skills that quietly improve your playing in other ways (noticing when a chord sounds "off," for instance), so it\'s worth learning even if you mostly use a tuner day to day.',
        aHi: 'Pure practicality ke liye, haan — ek tuner app fast aur accurate hai, aur zyadatar working musicians zyadatar time ek use karte hain. Lekin ear tuning general pitch-recognition skills train karta hai jo chupke se tumhari playing ko doosre tareekon se improve karta hai (jaise ye notice karna ki ek chord "off" sound kar raha hai), isliye seekhna worth hai chahe tum mostly din-pratidin ek tuner use karo.',
      },
    ],

    exercises: [
      {
        task: 'Tune your guitar fully with a tuner app. Then, without changing anything, try the relative-tuning ear check between strings 6 and 5 (fret 5 on string 6 vs. open string 5) and confirm they sound like the same pitch to you.',
        taskHi: 'Ek tuner app se apni guitar poori tarah tune karo. Phir, kuch badle bina, string 6 aur 5 ke beech relative-tuning ear check try karo (string 6 ka fret 5 vs open string 5) aur confirm karo ki tumhe wo same pitch sound karte hain.',
        hint: 'If they sound clearly different even though the tuner says both are correct, re-check the tuner reading on both strings individually — one may have drifted after you tuned it.',
        hintHi: 'Agar wo clearly alag sound karte hain chahe tuner dono ko correct kahe, dono strings ki tuner reading individually dobara check karo — ho sakta hai unmein se ek tune karne ke baad drift ho gayi ho.',
      },
    ],

    keyTakeaways: [
      'Standard tuning, low to high: E A D G B E.',
      'Tune with an electronic tuner first (absolute pitch); learn relative (by-ear) tuning as a skill on top of that, not a replacement for it.',
      'The 5th-fret-matches-next-open-string trick has one exception: string 3 uses fret 4, not 5.',
      'Turn pegs slowly in small increments — large fast turns overshoot and stress the string.',
      'Check tuning at the start of every practice session, without exception.',
    ],
    keyTakeawaysHi: [
      'Standard tuning, low se high: E A D G B E.',
      'Pehle ek electronic tuner se tune karo (absolute pitch); uske upar ek skill ki tarah relative (kaan se) tuning seekho, uska replacement nahi.',
      '5th-fret-matches-next-open-string trick ka ek exception hai: string 3 fret 4 use karti hai, 5 nahi.',
      'Pegs ko slowly, chhote increments mein ghumao — bade fast turns overshoot karte hain aur string ko stress karte hain.',
      'Har practice session ke shuru mein tuning check karo, bina exception ke.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'reading-guitar-tab',
    title: 'Reading Guitar TAB Notation',
    titleHi: 'Guitar TAB Notation Padhna',
    description: 'A second notation system, for single notes in time — genuinely different from chord diagrams, and just as essential.',
    descriptionHi: 'Ek doosra notation system, time mein single notes ke liye — chord diagrams se genuinely alag, aur utna hi essential.',
    difficulty: 'EASY',
    duration: 20,
    order: 2,

    analogy: {
      en: '**A chord diagram is a photograph; tab is a movie script.** A chord diagram freezes ONE moment — a single shape your hand holds. Tab describes a SEQUENCE of individual notes over time, like a script telling an actor exactly what to do at each moment, one line at a time, left to right.',
      hi: '**Chord diagram ek photograph hai; tab ek movie script hai.** Chord diagram EK moment freeze karta hai — ek single shape jo hand hold karta hai. Tab time ke saath individual notes ki ek SEQUENCE describe karta hai, ek script ki tarah jo ek actor ko batati hai har moment par exactly kya karna hai, ek line at a time, left se right.',
    },

    simple: `**Tab (tablature) has 6 horizontal lines, one per string — and this is the OPPOSITE visual orientation from chord diagrams:**

- The **top** line is string 1 (high e) — this is genuinely easy to forget since chord diagrams put string 6 on the outer edge instead.
- The **bottom** line is string 6 (low E).
- Numbers placed on a line tell you the fret to press on that string.
- **0** means play that string open.
- Reading direction is **left to right, in time** — unlike a chord diagram, which has no time dimension at all (it's just one static shape).
- Numbers stacked directly on top of each other (same left-right position) mean "play these together" — that's how tab represents a chord within an otherwise single-note melody.

**A real short example:**

\`\`\`
e|--0-----3---|
B|----1-------|
G|------0-----|
D|--------2---|
A|------------|
E|------------|
\`\`\`

Read left to right: open high e, then string B fret 1, then string G open, then (at the same moment) string e fret 3 and string D fret 2 together.`,
    simpleHi: `**Tab (tablature) mein 6 horizontal lines hoti hain, ek per string — aur ye chord diagrams se OPPOSITE visual orientation hai:**

- **Top** line string 1 (high e) hai — ise genuinely bhoolna easy hai kyunki chord diagrams string 6 ko outer edge par rakhte hain iske bajaye.
- **Bottom** line string 6 (low E) hai.
- Ek line par rakha gaya number batata hai us string par kaunsa fret dabana hai.
- **0** matlab wo string open bajao.
- Reading direction **left se right, time mein** hai — chord diagram ke ulta, jismein koi time dimension bilkul nahi hota (wo bas ek static shape hai).
- Numbers jo directly ek doosre ke upar stack hote hain (same left-right position) matlab "inhe saath bajao" — isi tarah tab ek single-note melody ke andar ek chord represent karta hai.

**Ek real short example:**

\`\`\`
e|--0-----3---|
B|----1-------|
G|------0-----|
D|--------2---|
A|------------|
E|------------|
\`\`\`

Left se right padho: open high e, phir string B fret 1, phir string G open, phir (same moment par) string e fret 3 aur string D fret 2 saath mein.`,

    content: `**Why does the string order flip between tab and chord diagrams?** It's not an inconsistency for its own sake — tab is meant to mirror what you're LOOKING AT when you hold the guitar normally in playing position and look down: the high e string is physically closest to your face/the floor, appearing "on top" from your view, so tab prints it as the top line. Chord diagrams, by contrast, are typically drawn as if you're facing the guitar head-on from the front (like looking at a picture of it), which puts the low E on the left. Both conventions are internally consistent, just built around two different mental viewpoints — worth knowing explicitly so you never confuse them mid-lesson.

**What tab does NOT tell you:** exact rhythm/timing (how long each note rings, or precisely when in a beat it falls) and finger choice. Tab is a pitch/position map, not a full rhythm notation — you typically learn the rhythm by ear (listening to the actual song) alongside reading the tab for which notes to play. Some tab includes extra symbols for techniques (h = hammer-on, p = pull-off, b = bend, / = slide up, \\ = slide down) which later modules in this course will use directly once those techniques are taught.

**Reading speed comes from chunking, not left-to-right character-by-character scanning** — exactly the same practice-science idea Module 10 covers for physical technique. Experienced players see small recognizable groups (a 3-note pattern, a familiar riff shape) rather than one number at a time, the same way a fluent reader sees whole words instead of sounding out individual letters.`,
    contentHi: `**Tab aur chord diagrams ke beech string order kyun flip hoti hai?** Ye apne liye ek inconsistency nahi hai — tab ka matlab hai wahi mirror karna jo tum DEKH rahe ho jab guitar ko normally playing position mein pakadkar neeche dekhte ho: high e string physically tumhare face/floor ke sabse paas hai, tumhare view se "upar" dikhti hai, isliye tab use top line ki tarah print karta hai. Chord diagrams, iske contrast mein, typically aise draw hote hain jaise tum guitar ke saamne se head-on dekh rahe ho (uski picture dekhne ki tarah), jo low E ko left par rakhta hai. Dono conventions internally consistent hain, bas do alag mental viewpoints ke around bane hain — explicitly jaanna worth hai taaki mid-lesson kabhi confuse na ho.

**Tab kya NAHI batata:** exact rhythm/timing (har note kitni der ring karti hai, ya precisely beat mein kab aati hai) aur finger choice. Tab ek pitch/position map hai, poori rhythm notation nahi — tum typically rhythm kaan se seekhte ho (actual song sunkar) saath mein tab padhte hue ki kaunse notes bajaane hain. Kuch tab mein techniques ke liye extra symbols hote hain (h = hammer-on, p = pull-off, b = bend, / = slide up, \\ = slide down) jo is course ke baad wale modules directly use karenge jab wo techniques sikhaye jaayenge.

**Reading speed chunking se aati hai, left-to-right character-by-character scanning se nahi** — bilkul wahi practice-science idea jo Module 10 physical technique ke liye cover karta hai. Experienced players chhote recognizable groups dekhte hain (ek 3-note pattern, ek familiar riff shape) ek time par ek number ke bajaye, bilkul waise hi jaise ek fluent reader poore words dekhta hai individual letters sound out karne ke bajaye.`,

    examples: [
      {
        title: 'A simple 5-note riff, in tab',
        titleHi: 'Ek simple 5-note riff, tab mein',
        code: `e|--0--------3---------|
B|-----1----------------|
G|--------0--------------|
D|-----------------2----|
A|-----------------------|
E|-----------------------|

Order: e-open, B-fret1, G-open, e-fret3, D-fret2`,
        previewHeight: 300,
        preview: diagramPreviewHtml(
          tabExplainerSvg(
            [
              { string: 0, step: 0, fret: 0 },
              { string: 1, step: 1, fret: 1 },
              { string: 2, step: 2, fret: 0 },
              { string: 0, step: 3, fret: 3 },
              { string: 3, step: 4, fret: 2 },
            ],
            5,
          ),
          'Same riff as a diagram: high e is the TOP line here (opposite of a chord diagram), and reading order is left to right in time.',
        ),
        explain:
          'Notice the string order: e (high, thinnest) is on top, E (low, thickest) is on the bottom — memorize this flip now, since confusing it with chord-diagram order is the single most common tab-reading mistake for someone who already knows chord diagrams.',
        explainHi:
          'String order notice karo: e (high, patli) top par hai, E (low, moti) bottom par hai — ise abhi memorize karo, kyunki ise chord-diagram order se confuse karna us insaan ke liye sabse common tab-reading mistake hai jise already chord diagrams pata hain.',
      },
    ],

    mistakes: [
      {
        wrong: 'Reading tab with the same string order as a chord diagram (assuming the top line is the low E string).',
        right: 'Remember tab flips the order: top line = string 1 (high e), bottom line = string 6 (low E) — opposite of a chord diagram.',
        why: 'This single mix-up silently transposes an entire riff onto the wrong strings, producing a melody that sounds completely wrong even though every finger movement "matches" the tab superficially.',
        whyHi: 'Ye ek single mix-up chupke se poori riff ko galat strings par transpose kar deta hai, ek aisi melody produce karta hai jo bilkul galat sound karti hai chahe har finger movement superficially tab "match" kare.',
      },
      {
        wrong: 'Expecting tab to tell you the rhythm/timing of each note just from its horizontal spacing.',
        right: 'Treat tab as a pitch/position map only — learn the actual rhythm by listening to the real recording alongside reading the tab.',
        why: "Spacing in most plain-text tab isn't rhythmically precise (it's often just visually convenient), so relying on it for timing produces a technically-correct-notes-wrong-rhythm performance that doesn't actually sound like the song.",
        whyHi: 'Zyadatar plain-text tab mein spacing rhythmically precise nahi hota (usually sirf visually convenient hota hai), isliye timing ke liye usपर rely karna ek technically-correct-notes-wrong-rhythm performance deta hai jo actually song jaisa sound nahi karta.',
      },
    ],

    realWorld: [
      {
        en: 'Nearly every song tab you\'ll find online (Ultimate Guitar and similar sites) uses this exact plain-text convention — learning to read it here means you can immediately go find tabs for songs you actually want to learn, not just this course\'s examples.',
        hi: 'Online milne wala lagbhag har song tab (Ultimate Guitar aur similar sites) exactly yahi plain-text convention use karta hai — ise yahan padhna seekhna matlab hai tum turant un songs ke tabs dhoondh sakte ho jo tum actually seekhna chahte ho, sirf is course ke examples nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'Do professional musicians actually read tab, or only standard notation?',
        qHi: 'Kya professional musicians actually tab padhte hain, ya sirf standard notation?',
        a: 'Both are used depending on context — tab dominates guitar-specific learning resources (since it directly shows string/fret, which standard notation doesn\'t), while standard notation is more common for reading with other instrumentalists or formally arranged music. Module 26 covers reading basic standard notation later.',
        aHi: 'Context ke hisaab se dono use hote hain — tab guitar-specific learning resources mein dominate karta hai (kyunki ye directly string/fret dikhata hai, jo standard notation nahi karta), jabki standard notation doosre instrumentalists ke saath ya formally arranged music padhne ke liye zyada common hai. Module 26 baad mein basic standard notation padhna cover karta hai.',
      },
    ],

    exercises: [
      {
        task: 'Without playing yet, just read the 5-note riff example out loud, string name then fret number for each note in order ("high e open, B string fret one, G string open, high e fret three, D string fret two").',
        taskHi: 'Abhi bajaye bina, bas 5-note riff example ko zor se padho, har note ke liye order mein string name phir fret number ("high e open, B string fret one, G string open, high e fret three, D string fret two").',
        hint: 'If you find yourself unsure which physical string a line refers to, go back to the top-line-is-string-1 rule before attempting to play it — reading correctly first prevents practicing a wrong riff into muscle memory.',
        hintHi: 'Agar pata na chale ki ek line kaunsi physical string refer karti hai, bajaane se pehle top-line-is-string-1 rule par wapas jao — pehle correctly padhna ek galat riff ko muscle memory mein practice hone se bachaata hai.',
      },
    ],

    keyTakeaways: [
      'Tab has 6 lines like a chord diagram, but the string order is FLIPPED: top = string 1 (high e), bottom = string 6 (low E).',
      'Tab is read left to right, in time — a sequence of notes, not one frozen shape.',
      'Numbers stacked vertically at the same horizontal position mean "play together."',
      'Tab shows pitch/position, not rhythm — learn timing by ear alongside reading it.',
    ],
    keyTakeawaysHi: [
      'Tab mein chord diagram jaisi 6 lines hoti hain, lekin string order FLIPPED hai: top = string 1 (high e), bottom = string 6 (low E).',
      'Tab left se right, time mein padha jaata hai — notes ki ek sequence, ek frozen shape nahi.',
      'Same horizontal position par vertically stacked numbers matlab "saath bajao."',
      'Tab pitch/position dikhata hai, rhythm nahi — timing kaan se seekho, use padhte hue saath saath.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'advanced-chord-diagram-reading',
    title: 'Advanced Chord-Diagram Reading: Barres & Fret Position',
    titleHi: 'Advanced Chord-Diagram Reading: Barres Aur Fret Position',
    description: 'The two remaining diagram symbols — a thick barre bar and a fret-position label — so nothing in this course is ever unreadable.',
    descriptionHi: 'Baaki bache do diagram symbols — ek thick barre bar aur ek fret-position label — taaki is course mein kuch bhi kabhi unreadable na ho.',
    difficulty: 'EASY',
    duration: 15,
    order: 3,

    analogy: {
      en: '**A capo made of your own finger.** A barre chord uses one finger (almost always the index) laid flat across several strings at once, like pressing a whole row of piano keys down with a ruler instead of individual fingers. Everything else about reading the diagram stays the same — this is one new symbol, not a new system.',
      hi: '**Tumhari apni finger se bana ek capo.** Ek barre chord ek finger use karta hai (almost hamesha index) jo ek saath kai strings ke across flat lagi hoti hai, ek ruler se poori row of piano keys ko individual fingers ke bajaye dabane ki tarah. Diagram padhne ke baare mein baaki sab kuch same rehta hai — ye ek naya symbol hai, ek naya system nahi.',
    },

    simple: `**Two new symbols, both covered fully in Module 17 — here's just how to READ them:**

1. **A thick horizontal bar across several dots** means "lay one finger flat across all these strings at once, at this fret" — a barre. The finger number is usually just shown once (almost always finger 1, the index).

2. **A small "Nfr" label to the left of the grid** (like "3fr") means this diagram is NOT in open position — the top line you see is fret N, not fret 1. This lets a diagram show a chord shape played higher up the neck without needing to draw 12 empty frets to get there.

Nothing else changes: strings are still left-to-right low-to-high, O and X still mean open/muted, dots still show finger positions.`,
    simpleHi: `**Do naye symbols, dono poori tarah Module 17 mein cover honge — yahan bas ye hai ki unhe kaise PADHEIN:**

1. **Kai dots ke across ek thick horizontal bar** ka matlab hai "ek finger flat lagao in saari strings ke across ek saath, is fret par" — ek barre. Finger number usually sirf ek baar dikhaya jaata hai (almost hamesha finger 1, index).

2. **Grid ke left mein ek chhota "Nfr" label** (jaise "3fr") ka matlab hai ye diagram open position mein NAHI hai — jo top line tum dekhte ho wo fret N hai, fret 1 nahi. Ye ek diagram ko neck mein upar bajaya jaane wala chord shape dikhane deta hai bina wahan tak pahunchne ke liye 12 empty frets draw kiye.

Baaki kuch nahi badalta: strings abhi bhi left-to-right low-to-high hain, O aur X abhi bhi open/muted ka matlab rakhte hain, dots abhi bhi finger positions dikhate hain.`,

    content: `**Why does the SAME chord name sometimes show up as two completely different-looking diagrams?** Because of a genuinely useful fact about the guitar: many chord shapes are "movable" — slide the exact same finger shape up or down the neck and you get a different chord name at each fret, following the pattern of notes on that string (covered fully in Module 18's fretboard map). A B major chord, for instance, can be played as an open-ish shape using a barre at fret 2 (an "A-shape" barre, since it borrows the open A chord's finger pattern) — there is no comfortable fully-open B chord, so this is the standard way it's played. You'll see the SAME chord name given multiple diagrams across songs/resources for exactly this reason: different positions on the neck, same resulting pitch.

**Why learn to read this now, months before Module 17 actually teaches barre technique?** So that when Module 6 onward casually shows you a chord you haven't learned to physically play yet (in an example explaining a concept, or a "just so you've seen it" mention), you can still read WHAT the diagram is asking for, even if executing it comes later. Reading and playing are two different skills that don't have to be learned in lockstep.`,
    contentHi: `**Same chord name kabhi kabhi do bilkul different dikhne wale diagrams mein kyun dikhta hai?** Guitar ke baare mein ek genuinely useful fact ki wajah se: bahut saare chord shapes "movable" hain — exact same finger shape ko neck mein upar ya neeche slide karo aur har fret par ek alag chord name milta hai, us string par notes ke pattern ko follow karte hue (Module 18 ke fretboard map mein poori tarah cover hoga). Ek B major chord, for instance, ek open-ish shape ki tarah baja sakte ho fret 2 par ek barre use karke (ek "A-shape" barre, kyunki ye open A chord ka finger pattern borrow karta hai) — koi comfortable fully-open B chord nahi hai, isliye ye use bajaane ka standard tareeka hai. Tum SAME chord name ko songs/resources mein multiple diagrams ke saath dekhoge exactly isi reason se: neck par alag positions, same resulting pitch.

**Module 17 actually barre technique sikhaane se mahino pehle ise abhi kyun seekhein?** Taaki jab Module 6 se aage tumhe casually ek chord dikhaya jaaye jo tumne physically bajaana abhi nahi seekha (ek example mein jo concept explain kar raha hai, ya ek "bas dekh lo" mention), tum phir bhi padh sako ki diagram kya maang raha hai, chahe execute karna baad mein aaye. Reading aur playing do alag skills hain jinhe lockstep mein seekhna zaroori nahi.`,

    examples: [
      {
        title: 'F major — a barre chord, read (not yet played)',
        titleHi: 'F major — ek barre chord, padha gaya (abhi bajaya nahi)',
        code: `F
  E |---1---   finger 1 (barre covers this too)
  A |---3---   finger 3
  D |---3---   finger 4
  G |---2---   finger 2
  B |---1---   finger 1 (barre)
  E |---1---   finger 1 (barre)

The thick bar across the bottom row = one finger flat across all 6 strings at fret 1.`,
        previewHeight: 330,
        preview: chordPreviewHtml(
          CHORDS.F,
          'F major: index finger barres all 6 strings at fret 1, while fingers 2/3/4 add the rest of the shape on top.',
        ),
        explain:
          'You are not expected to play this comfortably yet — Module 17 builds up to it properly. The goal right now is purely to recognize that the thick bar means "one finger, several strings, same fret," so no diagram in the meantime looks alien to you.',
        explainHi:
          'Ise abhi comfortably bajaana expected nahi hai — Module 17 iske liye properly build up karta hai. Abhi ka goal purely ye recognize karna hai ki thick bar ka matlab "ek finger, kai strings, same fret" hai, taaki beech mein koi diagram tumhe alien na lage.',
      },
      {
        title: 'B major — same shape as A, moved up 2 frets with a barre',
        titleHi: 'B major — A jaisa hi shape, barre ke saath 2 frets upar move kiya hua',
        code: `B (A-shape barre)      2fr
  E |---x---
  A |---2---   finger 1 (barre, this row too)
  D |---4---   finger 2
  G |---4---   finger 3
  B |---4---   finger 4
  E |---2---   finger 1 (barre)

"2fr" means the top row shown is fret 2, not fret 1.`,
        previewHeight: 330,
        preview: chordPreviewHtml(
          CHORDS.B,
          'The "2fr" label means this whole shape sits starting at fret 2 — it is the open A-chord finger pattern, barred and slid up.',
        ),
        explain:
          'This is the exact same finger PATTERN as the open A chord from Module 5, just barred with the index finger and slid up 2 frets. Recognizing "I already know this shape, it\'s just moved" is the core insight Module 21\'s CAGED system builds an entire framework around.',
        explainHi:
          'Ye bilkul wahi finger PATTERN hai jo Module 5 ke open A chord ka hai, bas index finger se barred aur 2 frets upar slide kiya hua. "Mujhe ye shape already pata hai, bas ye move hua hai" recognize karna hi wo core insight hai jispar Module 21 ka CAGED system poora framework banata hai.',
      },
    ],

    mistakes: [
      {
        wrong: 'Ignoring an "Nfr" label and assuming the top line of every diagram is always the nut.',
        right: 'Always check for a fret-position label first — if present, every fret number in the diagram is relative to THAT position, not fret 1.',
        why: 'Missing this label means you\'d fret the shape 2+ frets away from where it actually belongs, producing a completely different (and likely dissonant) chord.',
        whyHi: 'Ye label miss karne ka matlab hai tum shape ko uski actual jagah se 2+ frets door fret karoge, ek bilkul alag (aur likely dissonant) chord produce karte hue.',
      },
    ],

    realWorld: [
      {
        en: 'Songwriting/chord-chart apps and sheet-music sites almost always show the easiest available shape for a given chord by default — if a chord you look up shows a barre and seems hard, it\'s worth checking whether an easier open-position alternative exists (not every barre chord has one, but many do).',
        hi: 'Songwriting/chord-chart apps aur sheet-music sites almost hamesha ek given chord ke liye default se sabse easy available shape dikhate hain — agar tum jo chord dekh rahe ho wo barre dikhata hai aur hard lagta hai, check karna worth hai ki kya ek easier open-position alternative exist karta hai (har barre chord ka nahi hota, lekin bahut se ka hota hai).',
      },
    ],

    interviewQA: [
      {
        q: 'If two diagrams for the same chord name look totally different, are they actually the same chord?',
        qHi: 'Agar same chord name ke do diagrams bilkul different dikhte hain, kya wo actually same chord hain?',
        a: 'Yes, assuming both are labeled correctly — they produce the same set of pitches (possibly in a different order/octave across the strings), just via a different physical shape and neck position. This is genuinely one of the guitar\'s most useful properties, covered in full in Module 21.',
        aHi: 'Haan, assuming dono correctly labeled hain — wo same set of pitches produce karte hain (possibly strings ke across ek alag order/octave mein), bas ek alag physical shape aur neck position ke through. Ye genuinely guitar ki sabse useful properties mein se ek hai, Module 21 mein poori tarah cover hoga.',
      },
    ],

    exercises: [
      {
        task: 'Look at the B major diagram above and, without touching a guitar, say out loud which real fret each dot is actually on (remembering the "2fr" offset) — e.g. "the dot on string D is at real fret 4."',
        taskHi: 'Upar wala B major diagram dekho aur, guitar chhue bina, zor se bolo ki har dot actually kaunse real fret par hai ("2fr" offset yaad rakhte hue) — jaise "string D wala dot real fret 4 par hai."',
        hint: 'The numbers printed inside the diagram are already the real fret numbers when a position label is present — the label tells you where the TOP of the grid starts, not an extra amount to add.',
        hintHi: 'Diagram ke andar print hue numbers already real fret numbers hote hain jab ek position label present ho — label batata hai ki grid ka TOP kahan se shuru hota hai, add karne ke liye koi extra amount nahi.',
      },
    ],

    keyTakeaways: [
      'A thick bar across dots = one finger (usually index) pressing multiple strings flat at the same fret — a barre.',
      'An "Nfr" label means the diagram\'s top row is fret N, not fret 1 — every number shown is already the real fret.',
      'The same chord name can have multiple valid diagrams at different neck positions — same pitches, different shape.',
      'Reading a diagram and physically playing it are separate skills — you can read barre chords now, well before Module 17 teaches the technique.',
    ],
    keyTakeawaysHi: [
      'Dots ke across ek thick bar = ek finger (usually index) multiple strings ko same fret par flat dabata hai — ek barre.',
      'Ek "Nfr" label ka matlab hai diagram ki top row fret N hai, fret 1 nahi — dikhaya gaya har number already real fret hai.',
      'Same chord name ke neck par alag positions par multiple valid diagrams ho sakte hain — same pitches, alag shape.',
      'Ek diagram padhna aur use physically bajaana alag skills hain — tum barre chords abhi padh sakte ho, Module 17 technique sikhaane se pehle.',
    ],
  },
];
