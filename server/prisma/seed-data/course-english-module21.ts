/**
 * English Speaking Complete Course — Module 21: Present Perfect &
 * Used To. GAP-FILL module, added after a post-completion audit found
 * this course relied on present perfect throughout (most explicitly,
 * Module 16's "since" lesson says "this connects back to the
 * present-perfect structure this course builds toward") without ever
 * teaching it directly — a genuine inconsistency worth fixing rather
 * than leaving unaddressed. Framed as supplementary grammar
 * foundations (Part VIII), not a continuation of the Part VII
 * fluency arc — a learner can use these lessons any time, even
 * alongside Part I-II.
 *
 * Lesson 1: Present perfect — formation and its two core jobs (life
 *           experience, and a past action with present relevance).
 * Lesson 2: Present perfect vs. simple past — the single most common
 *           point of confusion this tense creates for a Hindi
 *           speaker, since Hindi doesn't force this distinction.
 * Lesson 3: "Used to" — a real, separate structure for past habits
 *           that have since changed.
 */

import type { CourseLesson } from './course-js-module1';

export const ENGLISH_MODULE_21: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'eng-present-perfect-intro',
    title: 'Present Perfect — "Have You Ever...?"',
    titleHi: 'Present Perfect — "Have You Ever...?"',
    description:
      '"I have visited Japan" connects a past action to right now, in a way simple past genuinely cannot — have/has + past participle, one of English\'s most-used tenses.',
    descriptionHi:
      '"I have visited Japan" ek past action ko abhi tak connect karta hai, ek tareeke se jo simple past genuinely nahi kar sakta — have/has + past participle, English ke sabse zyada use hone wale tenses mein se ek.',
    difficulty: 'HARD',
    duration: 25,
    order: 1,

    analogy: {
      en: '**Simple past is a photo from a specific day; present perfect is a stamp already in your passport.** "I visited Japan in 2019" names the exact day the photo was taken. "I have visited Japan" doesn\'t name a day at all — it simply shows the stamp is there, in your passport, right now, which is precisely why present perfect connects to the present moment in a way simple past never does.',
      hi: 'Simple past ek specific din ki ek photo hai; present perfect tumhare passport mein already ek stamp hai. "I visited Japan in 2019" wo exact din naam deta hai jab photo li gayi thi. "I have visited Japan" koi din naam hi nahi deta — ye simply dikhata hai ki stamp abhi, is moment, tumhare passport mein hai, jo precisely reason hai ki present perfect present moment se connect karta hai ek tareeke se jo simple past kabhi nahi karta.',
    },

    simple: `**Present perfect = have/has + past participle:**

I/you/we/they **have** visited · he/she/it **has** visited

**Two core jobs of present perfect:**

1. **Life experience, with no specific time mentioned**: "I have
   visited Japan." (at some point in your life, when isn't the
   point)
2. **A past action with a result or relevance right now**: "I have
   lost my keys." (the losing happened in the past, but the effect —
   no keys — is true right now)

**"Ever" and "never" pair naturally with present perfect for asking
about life experience:**

"Have you ever tried sushi?" · "I have never been to Australia."

**"Already" and "yet" mark present perfect statements and
questions:**

"I have already finished." · "Have you finished yet?"

**A genuinely useful contrast**: "I have finished" (no time given, the
result matters now) vs. "I finished at 3pm" (a specific time, simple
past) — both are correct, but they answer different questions.`,
    simpleHi: `**Present perfect = have/has + past participle:**

I/you/we/they **have** visited · he/she/it **has** visited

**Present perfect ke do core jobs:**

1. **Life experience, koi specific time mention kiye bina**: "I have
   visited Japan." (life mein kisi point pe, kab wo point nahi hai)
2. **Ek past action ek result ya relevance ke saath abhi**: "I have
   lost my keys." (losing past mein hui, par effect — no keys — abhi
   true hai)

**"Ever" aur "never" naturally present perfect ke saath pair hote hain
life experience ke baare mein poochne ke liye:**

"Have you ever tried sushi?" · "I have never been to Australia."

**"Already" aur "yet" present perfect statements aur questions ko mark
karte hain:**

"I have already finished." · "Have you finished yet?"

**Ek genuinely useful contrast**: "I have finished" (koi time nahi diya
gaya, result abhi matter karta hai) vs. "I finished at 3pm" (ek
specific time, simple past) — dono correct hain, par wo different
questions answer karte hain.`,

    content: `**Why this tense exists at all — English needed a way to talk about
the past without naming a time, and to link a past event to right
now.**

Simple past always implies (or states) a finished time — "I visited"
happened at some specific, closed point, even if unstated. Present
perfect deliberately avoids naming a time at all, which is precisely
what makes it perfect for two situations: talking about your life
experience in general ("I have traveled a lot") and describing a past
action whose result still matters right now ("I have lost my keys" —
I still don't have them). This is a genuine grammatical tool English
has that Hindi expresses differently, which is exactly why it needs
direct attention rather than being picked up by accident.

**The past participle is the third form of a verb, and it's worth
learning alongside the past tense forms from Module 4.** Regular
verbs use the same "-ed" form for both simple past and the past
participle (walked, walked). Irregular verbs often have three
genuinely different forms: go → went → **gone**, see → saw → **seen**,
eat → ate → **eaten**. This third form is what present perfect always
needs after have/has.

**"Ever" and "never" specifically ask about or state life experience,
independent of time.** "Have you ever tried sushi?" asks about your
entire life up to now, not a specific occasion — this is a genuinely
different question from "Did you try sushi?" (which usually implies a
specific, known occasion, like a particular dinner).

**"Already" and "yet" are the present perfect's specific markers for
completion — "already" in positive statements, "yet" in negatives and
questions.** "I have already finished" emphasizes it's done, possibly
sooner than expected. "Have you finished yet?" asks whether something
expected has happened by now. Both words specifically belong with
present perfect far more often than with simple past.`,
    contentHi: `**Ye tense bilkul kyun exist karta hai — English ko past ke baare mein baat karne ka ek tareeka chahiye tha bina ek time naam diye, aur ek past event ko abhi se link karne ka.**

Simple past hamesha ek finished time imply karta hai (ya state karta
hai) — "I visited" kisi specific, closed point pe hua, chahe unstated
ho. Present perfect deliberately koi time naam nahi deta bilkul, jo
precisely wo hai jo ise do situations ke liye perfect banata hai:
apni life experience ke baare mein generally baat karna ("I have
traveled a lot") aur ek past action describe karna jiska result abhi
bhi matter karta hai ("I have lost my keys" — mere paas abhi bhi nahi
hain). Ye ek genuine grammatical tool hai jo English ke paas hai jise
Hindi differently express karti hai, yahi exactly reason hai ki ise
direct attention chahiye, accident se pick up hone ke bajaye.

**Past participle ek verb ka third form hai, aur ise Module 4 se past
tense forms ke saath seekhna worth hai.** Regular verbs same "-ed"
form use karte hain dono simple past aur past participle ke liye
(walked, walked). Irregular verbs often teen genuinely different forms
rakhte hain: go → went → **gone**, see → saw → **seen**, eat → ate →
**eaten**. Ye third form wo hai jo present perfect ko hamesha have/has
ke baad chahiye.

**"Ever" aur "never" specifically life experience ke baare mein
poochte hain ya state karte hain, time se independent.** "Have you
ever tried sushi?" tumhari poori life ke baare mein poochta hai ab
tak, ek specific occasion nahi — ye "Did you try sushi?" se ek
genuinely different question hai (jo usually ek specific, known
occasion imply karta hai, jaise ek particular dinner).

**"Already" aur "yet" present perfect ke specific markers hain
completion ke liye — "already" positive statements mein, "yet"
negatives aur questions mein.** "I have already finished" emphasize
karta hai ki ye done hai, possibly expected se sooner. "Have you
finished yet?" poochta hai ki kya kuch expected abhi tak hua hai. Dono
words specifically present perfect ke saath belong karte hain simple
past se kahin zyada often.`,

    readingPassage: `Let me tell you about my life so far. I have traveled to five countries, and I have never been to Australia — that's still on my list. I have already learned a lot of English, but I haven't mastered it yet. Have you ever felt proud of how far you've come? I certainly have.`,
    readingPassageHi: `Main tumhe apni zindagi ke baare mein batata hoon ab tak. I have traveled to five countries, and I have never been to Australia — wo abhi bhi meri list pe hai. I have already learned a lot of English, but I haven't mastered it yet. Have you ever feel kiya ki tum kitni door aa gaye ho iske baare mein proud? I certainly have.`,

    vocabulary: [
      {
        word: 'have visited',
        wordHi: 'have visited (dekha/gaya hai)',
        meaning: 'present perfect of "visit" — describes life experience, no specific time given',
        meaningHi: '"visit" ka present perfect — life experience describe karta hai, koi specific time nahi diya',
        example: 'I have visited three different countries.',
        exampleHi: 'I have visited three different countries.',
        pronunciation: 'hav VIZ-i-tid',
      },
      {
        word: 'already',
        wordHi: 'already (pehle se)',
        meaning: 'before now, often sooner than expected',
        meaningHi: 'ab se pehle, often expected se sooner',
        example: 'I have already eaten, thanks.',
        exampleHi: 'I have already eaten, thanks.',
        pronunciation: 'awl-RED-ee',
      },
      {
        word: 'yet',
        wordHi: 'yet (abhi tak)',
        meaning: 'until now — used in negatives and questions about something expected',
        meaningHi: 'ab tak — negatives aur questions mein use hota hai kisi expected cheez ke baare mein',
        example: "I haven't finished the report yet.",
        exampleHi: "I haven't finished the report yet.",
        pronunciation: 'yet',
      },
      {
        word: 'experience',
        wordHi: 'experience (anubhav)',
        meaning: 'knowledge or skill gained from things you have done in your life',
        meaningHi: 'knowledge ya skill jo tumhari zindagi mein kiye gaye cheezon se mili',
        example: 'I have a lot of experience with public speaking now.',
        exampleHi: 'I have a lot of experience with public speaking now.',
        pronunciation: 'ik-SPEER-ee-uhns',
      },
    ],

    examples: [
      {
        title: 'Present perfect for life experience',
        titleHi: 'Life experience ke liye present perfect',
        code: `A: Have you ever tried Thai food?
B: Yes, I have! I've had it a few times. Have you?
A: No, I never have, actually.`,
        output: 'No specific time is mentioned anywhere — the focus is life experience.',
        explain:
          'Notice nobody says when — that\'s exactly the point of using present perfect here. If a specific time became relevant ("last night"), the conversation would naturally switch to simple past.',
        explainHi:
          'Notice karo koi nahi kehta kab — yahan present perfect use karne ka exactly yahi point hai. Agar ek specific time relevant ban jaaye ("last night"), conversation naturally simple past mein switch ho jaayegi.',
      },
      {
        title: 'Present perfect for a result that matters now',
        titleHi: 'Ek result ke liye present perfect jo abhi matter karta hai',
        code: `I have lost my phone. I can't find it anywhere.`,
        output: 'The losing happened in the past, but "I don\'t have it now" is the real point.',
        explain:
          'This isn\'t really about when the phone was lost — it\'s about the current, ongoing situation of not having it, which is exactly what present perfect is built to express.',
        explainHi:
          'Ye really iske baare mein nahi hai ki phone kab lost hua — ye current, ongoing situation ke baare mein hai use na hone ka, jo exactly wo hai jo present perfect express karne ke liye bana hai.',
      },
    ],

    mistakes: [
      {
        wrong: '"I have visited Japan in 2019." (adding a specific time to a present perfect sentence)',
        right: '"I visited Japan in 2019." (simple past) or "I have visited Japan." (present perfect, no time)',
        why: 'Present perfect and a specific past time word ("in 2019," "yesterday," "last week") don\'t combine — a specific time signals simple past is needed instead.',
        whyHi: 'Present perfect aur ek specific past time word ("in 2019," "yesterday," "last week") combine nahi hote — ek specific time signal karta hai ki simple past chahiye iske bajaye.',
      },
      {
        wrong: '"I have go to the market." (using the base form instead of the past participle)',
        right: '"I have gone to the market." / "I have been to the market."',
        why: 'Present perfect needs the past participle form specifically ("gone," not "go") — this is the third form of the verb, distinct from both the base form and the simple past form.',
        whyHi: 'Present perfect ko specifically past participle form chahiye ("gone," "go" nahi) — ye verb ka third form hai, base form aur simple past form dono se distinct.',
      },
    ],

    realWorld: [
      {
        en: '**Describing your experience in a job interview** ("I have worked with several teams," "I have led two major projects") relies almost entirely on present perfect to summarize your career without naming every date.',
        hi: '**Ek job interview mein apna experience describe karna** ("I have worked with several teams," "I have led two major projects") almost poori tarah present perfect pe rely karta hai apna career summarize karne ke liye har date naam diye bina.',
      },
      {
        en: '**Talking about travel or life experiences with friends** ("Have you ever been to...?", "I\'ve never tried...") is one of the most common everyday uses of this exact tense.',
        hi: '**Friends ke saath travel ya life experiences ke baare mein baat karna** ("Have you ever been to...?", "I\'ve never tried...") is exact tense ke sabse common everyday uses mein se ek hai.',
      },
    ],

    interviewQA: [
      {
        q: 'How do I know if I should use present perfect or simple past?',
        qHi: 'Mujhe kaise pata chalega ki present perfect use karoon ya simple past?',
        a: 'Ask: am I naming a specific time, or focusing on a result/experience without one? A specific time ("yesterday," "in 2020") always means simple past. No specific time, focusing on life experience or a current result, means present perfect. The next lesson covers this contrast in full detail.',
        aHi: 'Poocho: kya main ek specific time naam de raha hoon, ya ek result/experience pe focus kar raha hoon bina ek ke? Ek specific time ("yesterday," "in 2020") hamesha simple past matlab hai. Koi specific time nahi, life experience ya ek current result pe focus, present perfect matlab hai. Next lesson is contrast ko poori detail mein cover karta hai.',
      },
      {
        q: 'Why does "has" get used with he/she/it but "have" with everything else?',
        qHi: '"has" he/she/it ke saath kyun use hota hai par "have" baaki sab ke saath?',
        a: 'This mirrors the exact same third-person -s pattern from simple present ("she works," "she has") — he/she/it verbs in English very often take a distinct form, and "has" is simply that pattern applied to "have."',
        aHi: 'Ye exactly same third-person -s pattern ko mirror karta hai simple present se ("she works," "she has") — he/she/it verbs English mein bahut often ek distinct form lete hain, aur "has" simply wo pattern hai "have" pe apply kiya gaya.',
      },
    ],

    exercises: [
      {
        task: 'Out loud, say three true things you have done in your life, using present perfect with no specific time mentioned.',
        taskHi: 'Zor se, teen true cheezein bolo jo tumne apni zindagi mein ki hain, present perfect use karke koi specific time mention kiye bina.',
        hint: '"I have visited..." "I have never tried..." "I have read..."',
        hintHi: '"I have visited..." "I have never tried..." "I have read..."',
      },
      {
        task: 'Out loud, ask someone "Have you ever...?" about three different experiences, using "ever" correctly.',
        taskHi: 'Zor se, kisi se "Have you ever...?" poocho teen alag experiences ke baare mein, "ever" correctly use karke.',
        hint: '"Have you ever traveled alone?" "Have you ever tried [food]?" "Have you ever met someone famous?"',
        hintHi: '"Have you ever traveled alone?" "Have you ever tried [food]?" "Have you ever met someone famous?"',
      },
    ],

    keyTakeaways: [
      'Present perfect = have/has + past participle, and it deliberately never names a specific time.',
      'Two core jobs: describing life experience ("I have visited Japan") and a past action with a present result ("I have lost my keys").',
      'The past participle is a verb\'s third form — regular verbs reuse "-ed," but many irregular verbs have a genuinely distinct form (go → gone, see → seen).',
      '"Ever"/"never" ask about or state life experience; "already"/"yet" mark completion — all four pair naturally with present perfect.',
      'A specific past time word (yesterday, in 2020) always signals simple past is needed instead of present perfect.',
    ],
    keyTakeawaysHi: [
      'Present perfect = have/has + past participle, aur ye deliberately kabhi ek specific time naam nahi deta.',
      'Do core jobs: life experience describe karna ("I have visited Japan") aur ek past action jiska ek present result ho ("I have lost my keys").',
      'Past participle ek verb ka third form hai — regular verbs "-ed" reuse karte hain, par kayi irregular verbs ka ek genuinely distinct form hota hai (go → gone, see → seen).',
      '"Ever"/"never" life experience ke baare mein poochte ya state karte hain; "already"/"yet" completion mark karte hain — sab char naturally present perfect ke saath pair hote hain.',
      'Ek specific past time word (yesterday, in 2020) hamesha signal karta hai ki simple past chahiye present perfect ke bajaye.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'eng-present-perfect-vs-simple-past',
    title: 'Present Perfect vs. Simple Past',
    titleHi: 'Present Perfect Vs. Simple Past',
    description:
      '"I lost my keys" and "I have lost my keys" describe the same event but answer genuinely different questions — this is where the two tenses actually collide.',
    descriptionHi:
      '"I lost my keys" aur "I have lost my keys" same event describe karte hain par genuinely different questions answer karte hain — yahin hai jahan dono tenses actually collide karte hain.',
    difficulty: 'HARD',
    duration: 25,
    order: 2,

    analogy: {
      en: '**Simple past points at a moment on a timeline; present perfect points at the timeline itself, up to now.** "I finished at 3pm" places a pin at 3pm. "I have finished" doesn\'t place a pin anywhere — it simply says the whole stretch of time up to right now includes this being done.',
      hi: 'Simple past ek timeline pe ek moment ki taraf point karta hai; present perfect timeline khud ki taraf point karta hai, ab tak. "I finished at 3pm" ek pin 3pm pe rakhta hai. "I have finished" kahin pin nahi rakhta — ye simply kehta hai ki abhi tak ka poora stretch of time isme ye done hona include karta hai.',
    },

    simple: `**Use simple past when a specific time is mentioned or clearly
implied:**

"I finished the report yesterday." · "She called me this morning." ·
"We visited Goa last year."

**Use present perfect when no specific time is mentioned, and the
focus is life experience or a current result:**

"I have finished the report." (no time — the focus is that it's
done, now) · "She has called me before." (life experience, not one
specific call) · "We have visited Goa." (experience, not a specific
trip)

**A genuinely useful test**: can you naturally add "yesterday," "last
week," or "in 2020" to the sentence? If yes, simple past. If adding a
specific time would feel odd or contradictory, present perfect.

**Both tenses can describe the same real event — the choice is about
what you want to emphasize:**

"I called her at 5pm" (emphasizing when) vs. "I have called her three
times today" (emphasizing the count/pattern, up to now)`,
    simpleHi: `**Simple past use karo jab ek specific time mention ho ya clearly
implied ho:**

"I finished the report yesterday." · "She called me this morning." ·
"We visited Goa last year."

**Present perfect use karo jab koi specific time mention na ho, aur
focus life experience ya ek current result ho:**

"I have finished the report." (koi time nahi — focus ye hai ki ye
done hai, ab) · "She has called me before." (life experience, ek
specific call nahi) · "We have visited Goa." (experience, ek specific
trip nahi)

**Ek genuinely useful test**: kya tum naturally "yesterday," "last
week," ya "in 2020" sentence mein add kar sakte ho? Agar haan, simple
past. Agar ek specific time add karna odd ya contradictory feel kare,
present perfect.

**Dono tenses same real event describe kar sakte hain — choice is
baare mein hai ki tum kya emphasize karna chahte ho:**

"I called her at 5pm" (kab emphasize karte hue) vs. "I have called
her three times today" (count/pattern emphasize karte hue, ab tak)`,

    content: `**Why this distinction is genuinely the hardest part of present
perfect for a Hindi speaker, specifically.**

Hindi doesn't force this same choice — a single past-tense form
comfortably covers both "I finished it" (a specific moment) and "I
have finished it" (a current state resulting from a past action).
English requires choosing between two grammatically different tenses
depending on whether a specific time matters to the sentence, which is
a genuinely new mental habit to build, not just a new set of verb
endings to memorize.

**The reliable test — can a specific time word be added naturally —
works because it reflects the real underlying logic, not just a
memorized rule.** Simple past is fundamentally about a closed, specific
point; present perfect is fundamentally about an open span of time
reaching up to now. Trying to add "yesterday" to "I have finished"
creates a genuine contradiction (an open span suddenly closed by a
specific point), which is exactly why the test works reliably.

**Once a specific time is introduced into a conversation, English
switches to simple past for the rest of that topic, even if it started
in present perfect.** "Have you ever been to Paris?" "Yes, I have! I
went there in 2019." Notice the reply starts in present perfect
(matching the question's life-experience framing) but switches to
simple past the moment a specific time ("2019") becomes part of the
conversation — this switch is completely natural and expected, not
inconsistent.

**Both tenses can be true and correct for the exact same real-world
event — the "right" one depends entirely on what point you're making,
not on some fixed fact about the event itself.** "I called her" and "I
have called her" can both describe a phone call that happened this
morning — the first frames it as a specific, located event; the
second frames it as part of an ongoing pattern or current situation.
Neither is more "correct" independent of what you're actually trying
to say.`,
    contentHi: `**Ye distinction genuinely ek Hindi speaker ke liye present perfect ka sabse hard part kyun hai, specifically.**

Hindi ye same choice force nahi karti — ek single past-tense form
comfortably dono cover karta hai "I finished it" (ek specific moment)
aur "I have finished it" (ek current state jo ek past action se result
hui). English do grammatically different tenses ke beech choose karna
require karti hai depending on ki kya ek specific time sentence ke
liye matter karta hai, jo ek genuinely naya mental habit hai build
karne ke liye, sirf verb endings ka ek naya set memorize karna nahi.

**Reliable test — kya ek specific time word naturally add ho sakta hai
— kaam karta hai kyunki ye real underlying logic reflect karta hai,
sirf ek memorized rule nahi.** Simple past fundamentally ek closed,
specific point ke baare mein hai; present perfect fundamentally ek
open span of time ke baare mein hai jo ab tak pahunchta hai.
"Yesterday" ko "I have finished" mein add karne ki koshish karna ek
genuine contradiction create karta hai (ek open span achanak ek
specific point se close ho gaya), jo exactly reason hai ki test
reliably kaam karta hai.

**Ek baar conversation mein ek specific time introduce ho jaaye,
English us topic ke baaki ke liye simple past pe switch ho jaati hai,
even agar ye present perfect mein start hui thi.** "Have you ever been
to Paris?" "Yes, I have! I went there in 2019." Notice karo reply
present perfect mein start hoti hai (question ke life-experience
framing ko match karte hue) par simple past mein switch ho jaati hai
jis pal ek specific time ("2019") conversation ka part ban jaata hai —
ye switch completely natural aur expected hai, inconsistent nahi.

**Dono tenses exact same real-world event ke liye true aur correct ho
sakte hain — "right" wala poori tarah is baat pe depend karta hai ki
tum kya point bana rahe ho, event ke baare mein kisi fixed fact pe
nahi.** "I called her" aur "I have called her" dono ek phone call
describe kar sakte hain jo aaj morning hua — pehla ise ek specific,
located event ki tarah frame karta hai; doosra ise ek ongoing pattern
ya current situation ka part ki tarah frame karta hai. Koi bhi "more
correct" nahi hai independent of jo tum actually kehna chahte ho.`,

    readingPassage: `Have you ever been to Kerala? I have! I went there two years ago with my family. We have traveled to a few places together, actually, but Kerala was my favorite. I haven't been back since, but I have already started planning another trip for next year.`,
    readingPassageHi: `Have you ever been to Kerala? I have! Main do saal pehle apni family ke saath wahan gaya tha. Hum saath mein kuch jagah travel kar chuke hain, actually, but Kerala mera favorite tha. Main tab se wapas nahi gaya, but I have already started planning another trip for next year.`,

    vocabulary: [
      {
        word: 'specific',
        wordHi: 'specific (vishisht)',
        meaning: 'particular and clearly identified, not general',
        meaningHi: 'particular aur clearly identified, general nahi',
        example: 'She mentioned a specific date for the meeting.',
        exampleHi: 'She mentioned a specific date for the meeting.',
        pronunciation: 'spi-SIF-ik',
      },
      {
        word: 'span',
        wordHi: 'span (avadhi)',
        meaning: 'a stretch or period of time',
        meaningHi: 'time ka ek stretch ya period',
        example: 'This covers a span of about five years.',
        exampleHi: 'This covers a span of about five years.',
        pronunciation: 'span',
      },
      {
        word: 'pattern',
        wordHi: 'pattern (paitarn)',
        meaning: 'a repeated way something happens over time',
        meaningHi: 'ek repeated tareeka jismein kuch time ke saath hota hai',
        example: "I've noticed a pattern in how she responds.",
        exampleHi: "I've noticed a pattern in how she responds.",
        pronunciation: 'PAT-ern',
      },
      {
        word: 'actually',
        wordHi: 'actually (asal mein)',
        meaning: 'used to add a small correction or extra true detail',
        meaningHi: 'ek chhota correction ya extra true detail add karne ke liye use hota hai',
        example: "We've traveled together before, actually.",
        exampleHi: "We've traveled together before, actually.",
        pronunciation: 'AK-choo-uh-lee',
      },
    ],

    examples: [
      {
        title: 'Starting in present perfect, switching to simple past',
        titleHi: 'Present perfect mein start karna, simple past mein switch karna',
        code: `A: Have you ever tried skydiving?
B: Yes, I have! I did it last summer, actually. It was terrifying but amazing.`,
        output: 'The question uses present perfect; the specific answer switches to simple past.',
        explain:
          'This switch is completely natural — once "last summer" enters the conversation, simple past takes over for the specific details, even though the exchange started in present perfect.',
        explainHi:
          'Ye switch completely natural hai — ek baar "last summer" conversation mein aata hai, simple past specific details ke liye le leta hai, chahe exchange present perfect mein start hui ho.',
      },
      {
        title: 'The same event, two tenses, two different points',
        titleHi: 'Same event, do tenses, do different points',
        code: `Simple past: I called the client at 2pm.
Present perfect: I have called the client three times today.`,
        output: 'Both are true and correct — they simply emphasize different things.',
        explain:
          'The first pins down exactly when; the second emphasizes a pattern building up to right now — neither is more correct, they answer different implicit questions.',
        explainHi:
          'Pehla exactly kab pin down karta hai; doosra ek pattern emphasize karta hai jo abhi tak build ho raha hai — koi zyada correct nahi hai, wo different implicit questions answer karte hain.',
      },
    ],

    mistakes: [
      {
        wrong: '"I have seen that movie last week." (present perfect with a specific time word)',
        right: '"I saw that movie last week." (simple past)',
        why: '"Last week" is a specific time word — once it appears, the sentence needs simple past, not present perfect, regardless of how the idea might feel in Hindi.',
        whyHi: '"Last week" ek specific time word hai — ek baar ye appear hota hai, sentence ko simple past chahiye, present perfect nahi, chahe idea Hindi mein kaisa bhi feel kare.',
      },
      {
        wrong: '"I finished it." as an answer to "Have you finished it yet?" (dropping present perfect once it\'s established in the question)',
        right: '"Yes, I have finished it." / "Yes, I have." (matching the question\'s tense when no new specific time is introduced)',
        why: 'Without a new specific time being introduced, the answer should match the question\'s present perfect framing — switching to simple past here isn\'t justified by anything new in the conversation.',
        whyHi: 'Bina ek naye specific time ke introduce hue, answer ko question ke present perfect framing ko match karna chahiye — yahan simple past mein switch karna conversation mein kisi nayi cheez se justified nahi hai.',
      },
    ],

    realWorld: [
      {
        en: '**Job interviews moving from general experience into specifics** ("Have you managed a team before?" "Yes, I have — I led a team of six at my last job") rely on exactly this natural switch from present perfect to simple past.',
        hi: '**Job interviews general experience se specifics mein move karna** ("Have you managed a team before?" "Yes, I have — I led a team of six at my last job") exactly is natural switch pe rely karte hain present perfect se simple past tak.',
      },
      {
        en: '**Status updates at work** ("Have you sent the email yet?" "Yes, I sent it this morning.") depend on correctly choosing between the two tenses based on whether a specific time is relevant to the answer.',
        hi: '**Kaam pe status updates** ("Have you sent the email yet?" "Yes, I sent it this morning.") correctly do tenses ke beech choose karne pe depend karte hain is baat pe based ki kya ek specific time answer ke liye relevant hai.',
      },
    ],

    interviewQA: [
      {
        q: 'If someone asks "Have you eaten?" should I answer with present perfect or simple past?',
        qHi: 'Agar koi poochta hai "Have you eaten?" mujhe present perfect ya simple past se answer karna chahiye?',
        a: '"Yes, I have" matches the question and works perfectly if you don\'t need to add a specific time. If you want to add when, switching to simple past is natural: "Yes, I have — I ate about an hour ago." Both are correct; it depends on how much detail you want to give.',
        aHi: '"Yes, I have" question ko match karta hai aur perfectly kaam karta hai agar tumhe ek specific time add karne ki zaroorat nahi. Agar tum kab add karna chahte ho, simple past mein switch karna natural hai: "Yes, I have — I ate about an hour ago." Dono correct hain; ye depend karta hai tum kitna detail dena chahte ho.',
      },
      {
        q: 'Is this distinction really necessary for everyday spoken English, or is it mostly a written-grammar rule?',
        qHi: 'Kya ye distinction really everyday spoken English ke liye zaroori hai, ya ye mostly ek written-grammar rule hai?',
        a: "It's genuinely used constantly in spoken English, not just writing — native speakers make this switch automatically and would immediately notice if a specific time were paired incorrectly with present perfect. It's worth the effort specifically because it comes up in nearly every conversation about experience or recent events.",
        aHi: "Ye genuinely spoken English mein constantly use hoti hai, sirf writing mein nahi — native speakers automatically ye switch karte hain aur turant notice karenge agar ek specific time present perfect ke saath incorrectly paired ho. Ye effort ke layak hai specifically kyunki ye almost har conversation mein aata hai experience ya recent events ke baare mein.",
      },
    ],

    exercises: [
      {
        task: 'Out loud, say a present perfect sentence about your life experience, then add a specific time and switch it correctly to simple past.',
        taskHi: 'Zor se, apni life experience ke baare mein ek present perfect sentence bolo, phir ek specific time add karo aur ise correctly simple past mein switch karo.',
        hint: '"I have visited Goa." → "I visited Goa in 2022."',
        hintHi: '"I have visited Goa." → "I visited Goa in 2022."',
      },
      {
        task: 'Out loud, answer "Have you ever cooked a new recipe?" first in present perfect, then add a specific detail that naturally switches to simple past.',
        taskHi: 'Zor se, "Have you ever cooked a new recipe?" ko pehle present perfect mein answer karo, phir ek specific detail add karo jo naturally simple past mein switch ho.',
        hint: '"Yes, I have! I tried a new pasta recipe last weekend, actually."',
        hintHi: '"Yes, I have! I tried a new pasta recipe last weekend, actually."',
      },
    ],

    keyTakeaways: [
      'Use simple past when a specific time is mentioned or implied; use present perfect when no specific time matters, focusing on experience or a current result.',
      'The reliable test: can you naturally add "yesterday" or "in 2020"? If yes, simple past; if it feels contradictory, present perfect.',
      'Once a specific time enters a conversation, English naturally switches to simple past for that detail, even mid-exchange.',
      'The same real event can correctly use either tense — the choice reflects what point you\'re making, not a fixed fact about the event.',
      'This distinction is genuinely used constantly in spoken English, not just a formal writing rule.',
    ],
    keyTakeawaysHi: [
      'Simple past use karo jab ek specific time mention ya implied ho; present perfect use karo jab koi specific time matter na kare, experience ya ek current result pe focus karte hue.',
      'Reliable test: kya tum naturally "yesterday" ya "in 2020" add kar sakte ho? Agar haan, simple past; agar contradictory feel kare, present perfect.',
      'Ek baar ek specific time conversation mein enter hoti hai, English naturally us detail ke liye simple past mein switch ho jaati hai, mid-exchange bhi.',
      'Same real event correctly dono tenses use kar sakta hai — choice reflect karti hai tum kya point bana rahe ho, event ke baare mein ek fixed fact nahi.',
      'Ye distinction genuinely spoken English mein constantly use hoti hai, sirf ek formal writing rule nahi.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'eng-used-to-past-habits',
    title: '"Used To" — Past Habits That Have Changed',
    titleHi: '"Used To" — Past Habits Jo Change Ho Chuki Hain',
    description:
      '"I used to live in Delhi" says two things at once: I lived there, and I don\'t anymore — a single structure that\'s genuinely useful and easy to get wrong.',
    descriptionHi:
      '"I used to live in Delhi" ek saath do cheezein kehta hai: main wahan raha, aur ab nahi rehta — ek single structure jo genuinely useful hai aur galat karna aasan hai.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: '**"Used to" is a "closed" sign hung on a past habit — it announces both that the shop was open once and that it isn\'t anymore, in one phrase.** "I used to play cricket every weekend" tells you both facts at once: it genuinely happened regularly, and it genuinely doesn\'t happen now.',
      hi: '"Used to" ek "closed" sign hai jo ek past habit pe latka hai — ye announce karta hai dono ki shop ek baar open thi aur ab nahi hai, ek phrase mein. "I used to play cricket every weekend" tumhe dono facts ek saath batata hai: ye genuinely regularly hota tha, aur ye genuinely ab nahi hota.',
    },

    simple: `**"Used to" + base verb describes a past habit or state that is no
longer true:**

"I used to live in Delhi." (I lived there before; I don't now) · "She
used to smoke, but she quit." · "We used to be close friends."

**The structure:**

used to + base verb (never "used to" + "-ing" or a past-tense verb)

**Negative and question forms use "did":**

"I didn't use to like coffee." (note: "use to," not "used to," after
"didn't") · "Did you use to live here?"

**"Used to" vs. simple past — a genuine, useful difference:**

"I lived in Delhi for two years." (simple past — states a fact about
duration, doesn't emphasize the change) · "I used to live in Delhi."
(emphasizes this is no longer true now)

**A separate, easy-to-confuse phrase: "be used to" + "-ing" means
being accustomed to something, a completely different meaning:**

"I'm used to waking up early." (I'm accustomed to it, and it's still
true now) — this is NOT the same structure as "used to" for past
habits.`,
    simpleHi: `**"Used to" + base verb ek past habit ya state describe karta hai jo ab true nahi hai:**

"I used to live in Delhi." (main wahan pehle raha tha; ab nahi) · "She
used to smoke, but she quit." · "We used to be close friends."

**Structure:**

used to + base verb (kabhi "used to" + "-ing" ya ek past-tense verb
nahi)

**Negative aur question forms "did" use karte hain:**

"I didn't use to like coffee." (note: "did" ke baad "use to," "used
to" nahi) · "Did you use to live here?"

**"Used to" vs. simple past — ek genuine, useful difference:**

"I lived in Delhi for two years." (simple past — duration ke baare
mein ek fact state karta hai, change ko emphasize nahi karta) · "I
used to live in Delhi." (emphasize karta hai ki ye ab true nahi hai)

**Ek separate, easy-to-confuse phrase: "be used to" + "-ing" ka matlab
hai kisi cheez ka accustomed hona, ek completely different meaning:**

"I'm used to waking up early." (main accustomed hoon, aur ye abhi bhi
true hai) — ye "used to" past habits ke liye same structure NAHI hai.`,

    content: `**Why "used to" earns its own lesson rather than just being a
variant of simple past.**

Simple past ("I lived in Delhi for two years") states a fact without
commenting on whether it's still true. "Used to" does something simple
past cannot: it explicitly signals contrast with the present — that
this was true once, and specifically isn't anymore. This makes "used
to" genuinely more informative than simple past for describing a habit
or state that has changed, which is exactly why it deserves to be
learned as its own structure rather than assumed to be interchangeable
with plain past tense.

**"Used to" only ever takes the base verb — never "-ing," never a
tensed verb form.** "I used to going" and "I used to went" are both
incorrect; only "I used to go" is right. This is a fixed, simple rule
worth locking in early, since the base-verb requirement never changes.

**The negative and question forms genuinely trip up learners because
"used" quietly drops its "d" once "did" appears.** "I didn't use to
like spicy food" (not "didn't used to") and "Did you use to play an
instrument?" (not "did you used to") — "did" already carries the past
tense, so "use" stays in its plain base form, exactly the same logic
Module 6 established for do/does/did with any other verb.

**"Be used to" + "-ing" is a genuinely separate structure that happens
to share two words with "used to," and confusing the two changes the
meaning completely.** "I'm used to waking up early" means I'm
accustomed to it NOW, an ongoing present state — the opposite kind of
claim from "I used to wake up early," which means I did that in the
past and don't anymore. Reading each phrase's surrounding grammar
(is/am + used to + "-ing" versus a bare "used to" + base verb) is the
reliable way to tell them apart.`,
    contentHi: `**"Used to" apna khud ka lesson kyun deserve karta hai, sirf simple past ka ek variant hone ke bajaye.**

Simple past ("I lived in Delhi for two years") ek fact state karta hai
bina comment kiye ki ye abhi bhi true hai ya nahi. "Used to" kuch aisa
karta hai jo simple past nahi kar sakta: ye explicitly present ke saath
contrast signal karta hai — ki ye ek baar true tha, aur specifically
ab nahi hai. Ye "used to" ko genuinely simple past se zyada informative
banata hai ek habit ya state describe karne ke liye jo change ho chuki
hai, yahi exactly reason hai ki ye apni own structure ki tarah seekhne
layak hai, plain past tense ke saath interchangeable assume kiye jaane
ke bajaye.

**"Used to" hamesha sirf base verb leta hai — kabhi "-ing" nahi, kabhi
ek tensed verb form nahi.** "I used to going" aur "I used to went"
dono incorrect hain; sirf "I used to go" right hai. Ye ek fixed, simple
rule hai jaldi lock in karne layak, kyunki base-verb requirement kabhi
change nahi hoti.

**Negative aur question forms genuinely learners ko trip up karte hain
kyunki "used" chupke se apna "d" drop kar deta hai ek baar "did" appear
hota hai.** "I didn't use to like spicy food" ("didn't used to" nahi)
aur "Did you use to play an instrument?" ("did you used to" nahi) —
"did" already past tense carry karta hai, so "use" apne plain base
form mein rehta hai, exactly same logic jo Module 6 ne do/does/did ke
liye kisi bhi doosre verb ke saath establish ki thi.

**"Be used to" + "-ing" ek genuinely separate structure hai jo "used
to" ke saath do words share karta hai, aur dono ko confuse karna
meaning ko completely change kar deta hai.** "I'm used to waking up
early" matlab hai main abhi isse accustomed hoon, ek ongoing present
state — "I used to wake up early" se opposite tarah ka claim, jiska
matlab hai maine wo past mein kiya tha aur ab nahi karta. Har phrase ki
surrounding grammar padhna (is/am + used to + "-ing" versus ek bare
"used to" + base verb) inhe alag batane ka reliable tareeka hai.`,

    readingPassage: `I used to be really nervous about speaking English. I used to avoid conversations completely. But I didn't give up, and now I'm used to speaking every day. I used to think fluency was impossible for me, but I don't think that anymore. Did you use to feel the same way?`,
    readingPassageHi: `I used to be really nervous about speaking English. I used to avoid conversations completely. But maine give up nahi kiya, aur ab I'm used to speaking every day. I used to think fluency mere liye impossible hai, but ab main aisa nahi sochta. Did you use to feel the same way?`,

    vocabulary: [
      {
        word: 'used to',
        wordHi: 'used to (pehle karta tha)',
        meaning: 'describes a past habit or state that is no longer true',
        meaningHi: 'ek past habit ya state describe karta hai jo ab true nahi hai',
        example: 'I used to live in a small town.',
        exampleHi: 'I used to live in a small town.',
        pronunciation: 'YOOST too',
      },
      {
        word: 'be used to',
        wordHi: 'be used to (aadi hona)',
        meaning: 'to be accustomed to something, in the present',
        meaningHi: 'kisi cheez ka accustomed hona, present mein',
        example: "I'm used to the noise now.",
        exampleHi: "I'm used to the noise now.",
        pronunciation: 'bee YOOST too',
      },
      {
        word: 'avoid',
        wordHi: 'avoid (bachna)',
        meaning: 'to stay away from something on purpose',
        meaningHi: 'jaan-boojh kar kisi cheez se door rehna',
        example: 'I used to avoid public speaking.',
        exampleHi: 'I used to avoid public speaking.',
        pronunciation: 'uh-VOYD',
      },
      {
        word: 'fluency',
        wordHi: 'fluency (pravaah)',
        meaning: 'the ability to speak a language smoothly and easily',
        meaningHi: 'ek language ko smoothly aur easily bolne ki ability',
        example: "Fluency comes with consistent practice.",
        exampleHi: "Fluency comes with consistent practice.",
        pronunciation: 'FLOO-uhn-see',
      },
    ],

    examples: [
      {
        title: '"Used to" contrasted directly with the present',
        titleHi: '"Used to" directly present ke saath contrasted',
        code: `I used to hate vegetables, but now I actually enjoy them.
She used to live alone, but now she lives with her sister.`,
        output: 'Each sentence explicitly names both the past state and the present contrast.',
        explain:
          'Notice how naturally these sentences pair a "used to" clause with a "but now..." clause — this is the exact shape that makes the contrast explicit and clear.',
        explainHi:
          'Notice karo kaise naturally ye sentences ek "used to" clause ko ek "but now..." clause ke saath pair karte hain — ye exact shape hai jo contrast ko explicit aur clear banata hai.',
      },
      {
        title: '"Used to" vs. "be used to" side by side',
        titleHi: '"Used to" vs. "be used to" side by side',
        code: `Used to (past habit, changed): I used to wake up at 10am.
Be used to (present, accustomed): Now I'm used to waking up at 6am.`,
        output: 'Two genuinely different structures, describing two different points in time.',
        explain:
          'The first describes an old habit that\'s gone; the second describes comfort with a current one — reading the surrounding grammar (is/am vs. bare "used to") is what tells them apart.',
        explainHi:
          'Pehla ek old habit describe karta hai jo gaya; doosra ek current wale ke saath comfort describe karta hai — surrounding grammar padhna (is/am vs. bare "used to") hi hai jo inhe alag batata hai.',
      },
    ],

    mistakes: [
      {
        wrong: '"I used to going to the gym every day." (using "-ing" after "used to")',
        right: '"I used to go to the gym every day."',
        why: '"Used to" always takes the plain base verb, never "-ing" — this is a fixed rule with no exceptions.',
        whyHi: '"Used to" hamesha plain base verb leta hai, kabhi "-ing" nahi — ye ek fixed rule hai bina kisi exception ke.',
      },
      {
        wrong: '"I didn\'t used to like coffee." (keeping "used" after "didn\'t")',
        right: '"I didn\'t use to like coffee."',
        why: '"Did" already carries the past tense in the negative and question forms, so "use" stays in its plain base form without the "-d" — the same logic as do/does/did with any other verb.',
        whyHi: '"Did" already past tense carry karta hai negative aur question forms mein, so "use" apne plain base form mein rehta hai bina "-d" ke — same logic jo do/does/did kisi bhi doosre verb ke saath follow karta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Describing how you\'ve changed over time** ("I used to be shy, but now I\'m much more confident") is one of the most natural, common uses of this structure in personal storytelling.',
        hi: '**Ye describe karna ki tum time ke saath kaise change hue** ("I used to be shy, but now I\'m much more confident") is structure ke sabse natural, common uses mein se ek hai personal storytelling mein.',
      },
      {
        en: '**Talking about a place, job, or relationship that\'s no longer part of your life** ("I used to work there," "We used to be neighbors") relies directly on "used to" to mark that clear contrast with now.',
        hi: '**Ek jagah, job, ya relationship ke baare mein baat karna jo ab tumhari zindagi ka part nahi hai** ("I used to work there," "We used to be neighbors") directly "used to" pe rely karta hai wo clear contrast ab ke saath mark karne ke liye.',
      },
    ],

    interviewQA: [
      {
        q: 'What\'s the real difference between "I used to live there" and "I lived there"?',
        qHi: '"I used to live there" aur "I lived there" mein real farak kya hai?',
        a: '"I lived there" is a neutral fact about the past, with no comment on now. "I used to live there" explicitly emphasizes that this is no longer the case — it carries a built-in sense of contrast with the present that plain simple past doesn\'t have.',
        aHi: '"I lived there" past ke baare mein ek neutral fact hai, ab ke baare mein koi comment nahi. "I used to live there" explicitly emphasize karta hai ki ye ab case nahi hai — ye ek built-in sense of contrast carry karta hai present ke saath jo plain simple past ke paas nahi hai.',
      },
      {
        q: 'Can I use "used to" for something that only happened once, not repeatedly?',
        qHi: 'Kya main "used to" kisi aisi cheez ke liye use kar sakta hoon jo sirf ek baar hui, repeatedly nahi?',
        a: '"Used to" fits best for habits or ongoing states (repeated actions, or a state that lasted a while), not a single one-time event. For a single past event, simple past is the natural choice: "I visited Paris once" rather than "I used to visit Paris."',
        aHi: '"Used to" habits ya ongoing states ke liye best fit karta hai (repeated actions, ya ek state jo kuch time chali), ek single one-time event ke liye nahi. Ek single past event ke liye, simple past natural choice hai: "I visited Paris once" "I used to visit Paris" ke bajaye.',
      },
    ],

    exercises: [
      {
        task: 'Out loud, describe one real habit or state from your past that has changed, using "used to" and a "but now..." contrast.',
        taskHi: 'Zor se, apne past se ek real habit ya state describe karo jo change ho chuki hai, "used to" aur ek "but now..." contrast use karke.',
        hint: '"I used to [old habit], but now I [current situation]."',
        hintHi: '"I used to [old habit], but now I [current situation]."',
      },
      {
        task: 'Out loud, correctly form a negative and a question using "use to" (not "used to") after "didn\'t"/"did."',
        taskHi: 'Zor se, correctly ek negative aur ek question banao "use to" use karke ("used to" nahi) "didn\'t"/"did" ke baad.',
        hint: '"I didn\'t use to enjoy reading." "Did you use to play any sports?"',
        hintHi: '"I didn\'t use to enjoy reading." "Did you use to play any sports?"',
      },
    ],

    keyTakeaways: [
      '"Used to" + base verb describes a past habit or state that is no longer true, explicitly signaling contrast with now.',
      '"Used to" only ever takes the base verb — never "-ing," never a tensed form.',
      'In negatives and questions, "did" carries the past tense, so it\'s "use to" (no "-d"), not "used to."',
      '"Be used to" + "-ing" is a genuinely separate structure meaning "accustomed to, right now" — not the same as "used to" for past habits.',
      '"Used to" fits habits and ongoing past states, not a single one-time event, which uses plain simple past instead.',
    ],
    keyTakeawaysHi: [
      '"Used to" + base verb ek past habit ya state describe karta hai jo ab true nahi hai, explicitly ab ke saath contrast signal karte hue.',
      '"Used to" hamesha sirf base verb leta hai — kabhi "-ing" nahi, kabhi ek tensed form nahi.',
      'Negatives aur questions mein, "did" past tense carry karta hai, so ye "use to" hai (koi "-d" nahi), "used to" nahi.',
      '"Be used to" + "-ing" ek genuinely separate structure hai jiska matlab hai "accustomed to, abhi" — "used to" past habits ke liye same nahi hai.',
      '"Used to" habits aur ongoing past states ke liye fit karta hai, ek single one-time event ke liye nahi, jo plain simple past use karta hai iske bajaye.',
    ],
  },
];
