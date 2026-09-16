/**
 * English Speaking Complete Course — Module 7: Requests, Offers &
 * Suggestions, lessons 1-3. Opens Part III (Everyday Communication).
 *
 * Lesson 1: Making requests politely — could/can/would you, and the
 *           real politeness gradient between them.
 * Lesson 2: Making offers — shall I / would you like / I can, and the
 *           genuine two-way nature of an offer versus a request.
 * Lesson 3: Making suggestions — let's / why don't we / how about, and
 *           softening a suggestion so it doesn't sound like a command.
 */

import type { CourseLesson } from './course-js-module1';

export const ENGLISH_MODULE_7: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'eng-making-requests-politely',
    title: 'Making Requests — Could, Can & Would You',
    titleHi: 'Requests Karna — Could, Can Aur Would You',
    description:
      '"Give me water" works at home with family; "Could you pass the water, please?" is what almost every other situation actually needs.',
    descriptionHi:
      '"Give me water" ghar pe family ke saath kaam karta hai; "Could you pass the water, please?" wo hai jo almost har doosri situation ko actually chahiye.',
    difficulty: 'EASY',
    duration: 20,
    order: 1,

    analogy: {
      en: '**A bare command is a knock with a fist; "could/can/would you" is the same knock with knuckles softened.** "Give me the file" gets the file; "Could you give me the file, please?" gets the same file without anyone feeling ordered around.',
      hi: 'Ek bare command ek fist se knock hai; "could/can/would you" wahi knock hai knuckles soften kiye hue. "Give me the file" file de deta hai; "Could you give me the file, please?" wahi file deta hai bina kisi ko ordered around feel kiye.',
    },

    simple: `**Three common ways to make a polite request, roughly softest to
most direct:**

- "**Could** you pass the salt, please?" (very polite, works
  anywhere)
- "**Would** you mind passing the salt?" (very polite, slightly more
  formal)
- "**Can** you pass the salt?" (polite, slightly more casual — fine
  with people you know)

**The structure:**

Could/Can/Would + you + base verb + ...?

**"Please" makes any request warmer, and works at both the start and
end:**

"Could you please pass the salt?" · "Could you pass the salt,
please?"

**With family or very close friends, a direct request is completely
normal** — "Pass the salt" isn't rude at home the way it might sound
to a stranger or in a formal setting. Context decides how much
softening a request needs.`,
    simpleHi: `**Ek polite request karne ke teen common tareeke, roughly softest se most direct:**

- "**Could** you pass the salt, please?" (very polite, kahin bhi kaam
  karta hai)
- "**Would** you mind passing the salt?" (very polite, thoda zyada
  formal)
- "**Can** you pass the salt?" (polite, thoda zyada casual — un logon
  ke saath fine hai jinhe tum jaante ho)

**Structure:**

Could/Can/Would + you + base verb + ...?

**"Please" kisi bhi request ko warmer banata hai, aur start aur end
dono pe kaam karta hai:**

"Could you please pass the salt?" · "Could you pass the salt,
please?"

**Family ya bahut close friends ke saath, ek direct request completely
normal hai** — "Pass the salt" ghar pe rude nahi hai jaise ye ek
stranger ko ya ek formal setting mein sound kar sakta hai. Context
decide karta hai ek request ko kitni softening chahiye.`,

    content: `**Why "Could you" outranks "Can you" in politeness, even though both
literally ask about ability.**

Both "can" and "could" grammatically ask about capability — "can you
lift this" literally asks if you're physically able to. But "could,"
being the more distant, less certain form, has become the softer,
more polite choice by convention, precisely because it sounds less
like an assumption that you're definitely able and willing, and more
like a gentle, open question. This isn't a logical rule so much as a
social convention worth simply knowing.

**"Would you mind + verb-ing" is a genuinely distinct structure worth
learning as its own shape.** It literally asks whether something would
bother you — "would you mind closing the window?" — and answering
"yes" to it means "yes, it would bother me" (so you'd rather not), while
"no, not at all" means "no, it wouldn't bother me" (so you're happy
to). This yes/no logic is reversed from what it feels like it should
be, and is worth practicing deliberately so the answer doesn't
accidentally come out backward.

**"Please" is not optional decoration — it's doing real social work.**
A request without "please" ("Can you close the door?") is still
polite thanks to "can you," but adding "please" measurably warms the
tone further, especially useful with someone you don't know well or in
a professional context.

**Directness that's completely normal at home can sound abrupt
elsewhere.** The skill here isn't learning one "correct" way to
request something — it's reading the relationship and setting
correctly and choosing the level of softening that actually fits.`,
    contentHi: `**"Could you" "Can you" se politeness mein kyun aage hai, chahe dono
literally ability ke baare mein poochte hain.**

Dono "can" aur "could" grammatically capability ke baare mein poochte
hain — "can you lift this" literally poochta hai ki kya tum physically
able ho. Par "could," zyada distant, kam certain form hone ki wajah
se, convention se softer, zyada polite choice ban gaya hai, precisely
kyunki ye kam ek assumption jaisa sound karta hai ki tum definitely
able aur willing ho, aur zyada ek gentle, open question jaisa. Ye ek
logical rule se zyada ek social convention hai jise simply janna
worth hai.

**"Would you mind + verb-ing" ek genuinely distinct structure hai apne
own shape ki tarah seekhne layak.** Ye literally poochta hai ki kya
kuch tumhe bother karega — "would you mind closing the window?" — aur
ise "yes" answer dena matlab hai "yes, it would bother me" (so tum
nahi karna chahoge), jabki "no, not at all" matlab hai "no, it wouldn't
bother me" (so tum happy ho karne ke liye). Ye yes/no logic reversed
hai jaisa feel hota hai hona chahiye, aur deliberately practice karne
layak hai taaki answer accidentally backward na nikle.

**"Please" optional decoration nahi hai — ye real social work kar raha
hai.** Ek request bina "please" ke ("Can you close the door?") phir bhi
polite hai "can you" ki wajah se, par "please" add karna tone ko
measurably aur warm karta hai, especially useful kisi ke saath jise tum
achhe se nahi jaante ya ek professional context mein.

**Directness jo ghar pe completely normal hai kahin aur abrupt sound
kar sakti hai.** Yahan skill ek "correct" tareeka seekhna nahi hai kuch
request karne ka — ye relationship aur setting ko sahi se read karna
hai aur wo softening level choose karna hai jo actually fit karta hai.`,

    readingPassage: `I need some help at work today. Could you review this document for me, please? Also, would you mind sending it to the client by tomorrow? And one more thing — can you join the meeting at 3pm? Thank you so much for your help.`,
    readingPassageHi: `Aaj mujhe kaam mein kuch help chahiye. Could you review this document for me, please? Also, would you mind sending it to the client by tomorrow? Aur ek aur cheez — can you join the meeting at 3pm? Tumhari help ke liye bahut bahut shukriya.`,

    vocabulary: [
      {
        word: 'request',
        wordHi: 'request (anurodh)',
        meaning: 'a polite way of asking for something',
        meaningHi: 'kisi cheez ke liye poochne ka ek polite tareeka',
        example: 'I have a small request — could you help me?',
        exampleHi: 'I have a small request — could you help me?',
        pronunciation: 'ri-KWEST',
      },
      {
        word: 'mind (would you mind)',
        wordHi: 'mind (bura maanna)',
        meaning: 'to be bothered by something',
        meaningHi: 'kisi cheez se bother hona',
        example: 'Would you mind waiting a few minutes?',
        exampleHi: 'Would you mind waiting a few minutes?',
        pronunciation: 'mynd',
      },
      {
        word: 'review',
        wordHi: 'review (jaanch karna)',
        meaning: 'to look at something carefully to check it',
        meaningHi: 'kisi cheez ko carefully check karne ke liye dekhna',
        example: 'Could you review my report before I send it?',
        exampleHi: 'Could you review my report before I send it?',
        pronunciation: 'ri-VYOO',
      },
      {
        word: 'appreciate',
        wordHi: 'appreciate (aabhari hona)',
        meaning: 'to be grateful for something',
        meaningHi: 'kisi cheez ke liye grateful hona',
        example: "I'd really appreciate your help with this.",
        exampleHi: "I'd really appreciate your help with this.",
        pronunciation: 'uh-PREE-shee-eyt',
      },
    ],

    examples: [
      {
        title: 'Three politeness levels for the same request',
        titleHi: 'Same request ke liye teen politeness levels',
        code: `Could you send me the file, please? (very polite, safest default)
Would you mind sending me the file? (very polite, slightly formal)
Can you send me the file? (polite, more casual — fine with colleagues you know)`,
        output: 'All three get the same file, with a genuinely different feel.',
        explain:
          'Notice all three requests ask for exactly the same thing — practicing all three out loud helps you feel the subtle difference in tone rather than just memorizing a rule.',
        explainHi:
          'Notice karo teeno requests exactly same cheez maangte hain — teeno ko zor se practice karna tone mein subtle difference feel karne mein help karta hai, sirf ek rule memorize karne ke bajaye.',
      },
      {
        title: 'Answering "would you mind" correctly',
        titleHi: '"would you mind" ko sahi se answer karna',
        code: `A: Would you mind opening the window?
B: No, not at all. (= sure, I'll open it, it doesn't bother me)`,
        output: '"No" here means agreement, not refusal.',
        explain:
          'This is the reversed logic worth practicing: "no, not at all" is actually a yes to the request. Answering "yes" here would confusingly suggest it DOES bother you.',
        explainHi:
          'Ye reversed logic hai practice karne layak: "no, not at all" actually request ko ek yes hai. Yahan "yes" answer dena confusingly suggest karega ki ye tumhe bother karta HAI.',
      },
    ],

    mistakes: [
      {
        wrong: '"Give me water." (as your default way of asking anyone, anywhere)',
        right: '"Could you give me some water, please?" (with a stranger, in a restaurant, at work)',
        why: 'A bare command works fine at home with close family, but sounds abrupt or even rude in most other settings. Adding "could you... please" is the safe default outside close relationships.',
        whyHi: 'Ek bare command ghar pe close family ke saath fine kaam karta hai, par zyadatar doosri settings mein abrupt ya even rude sound karta hai. "Could you... please" add karna close relationships ke bahar safe default hai.',
      },
      {
        wrong: '"Yes" in response to "Would you mind helping me?" (when you actually mean you\'re happy to help)',
        right: '"No, not at all!" or "Not at all, I\'d be happy to."',
        why: '"Would you mind" asks if something would bother you — agreeing to help means answering "no" (it wouldn\'t bother me), not "yes". This reversed logic is a common, understandable slip.',
        whyHi: '"Would you mind" poochta hai ki kya kuch tumhe bother karega — help karne ke liye agree karna matlab "no" answer dena hai (mujhe bother nahi karega), "yes" nahi. Ye reversed logic ek common, understandable slip hai.',
      },
    ],

    realWorld: [
      {
        en: '**Asking a colleague, a stranger, or customer service for anything** — from directions to a favor at work — relies almost entirely on this exact politeness structure to sound appropriately courteous.',
        hi: '**Ek colleague, ek stranger, ya customer service se kuch bhi poochna** — directions se leke kaam pe ek favor tak — almost poori tarah is exact politeness structure pe rely karta hai appropriately courteous sound karne ke liye.',
      },
      {
        en: '**Writing a professional email** ("Could you please send me the updated report by Friday?") uses this exact structure in written form, making it doubly useful to master for both speaking and writing.',
        hi: '**Ek professional email likhna** ("Could you please send me the updated report by Friday?") is exact structure ko written form mein use karta hai, ise doubly useful banata hai speaking aur writing dono ke liye master karna.',
      },
    ],

    interviewQA: [
      {
        q: 'Is "Can you" too casual for a professional email or a formal request?',
        qHi: 'Kya "Can you" ek professional email ya ek formal request ke liye too casual hai?',
        a: '"Can you" is generally fine in most professional contexts, especially with colleagues you interact with regularly. For a genuinely formal request, or someone you don\'t know well (a new client, a senior person), "Could you" or "Would you mind" are the safer, more polished choices.',
        aHi: '"Can you" generally zyadatar professional contexts mein fine hai, especially colleagues ke saath jinke saath tum regularly interact karte ho. Ek genuinely formal request ke liye, ya kisi ke saath jise tum achhe se nahi jaante (ek naya client, ek senior person), "Could you" ya "Would you mind" safer, zyada polished choices hain.',
      },
      {
        q: "Why does \"would you mind\" use \"-ing\" (closing, sending) instead of the base verb?",
        qHi: "\"would you mind\" \"-ing\" (closing, sending) kyun use karta hai base verb ke bajaye?",
        a: "\"Mind\" behaves like verbs such as \"enjoy\" or \"avoid\" that are naturally followed by \"-ing\" rather than \"to + verb\" — this is simply how \"mind\" works grammatically, worth learning as a fixed pattern: \"would you mind + verb-ing\".",
        aHi: "\"Mind\" verbs jaise \"enjoy\" ya \"avoid\" ki tarah behave karta hai jo naturally \"-ing\" se follow hote hain \"to + verb\" ke bajaye — ye simply hai kaise \"mind\" grammatically kaam karta hai, ek fixed pattern ki tarah seekhne layak: \"would you mind + verb-ing\".",
      },
    ],

    exercises: [
      {
        task: 'Out loud, make the same request three ways: using "could you," "would you mind," and "can you," asking someone to close a door.',
        taskHi: 'Zor se, same request teen tareekon se banao: "could you," "would you mind," aur "can you" use karke, kisi se door band karne ke liye poochte hue.',
        hint: '"Could you close the door, please?" "Would you mind closing the door?" "Can you close the door?"',
        hintHi: '"Could you close the door, please?" "Would you mind closing the door?" "Can you close the door?"',
      },
      {
        task: 'Out loud, answer "Would you mind helping me carry this?" as if you\'re happy to help — say the full, correct response.',
        taskHi: 'Zor se, "Would you mind helping me carry this?" ka answer do jaise tum help karne ke liye khush ho — poora, correct response bolo.',
        hint: '"No, not at all! Happy to help."',
        hintHi: '"No, not at all! Happy to help."',
      },
    ],

    keyTakeaways: [
      '"Could you," "would you mind," and "can you" are three common ways to make a polite request, from more to slightly less formal.',
      '"Please" measurably warms a request further and works at the start or end of the sentence.',
      '"Would you mind + verb-ing" has reversed yes/no logic: "no, not at all" means agreement, not refusal.',
      'A bare command is completely normal with close family but sounds abrupt in most other settings.',
      'This exact structure works equally well in speaking and in professional written requests like emails.',
    ],
    keyTakeawaysHi: [
      '"Could you," "would you mind," aur "can you" ek polite request karne ke teen common tareeke hain, zyada se thoda kam formal.',
      '"Please" ek request ko measurably aur warm karta hai aur sentence ke start ya end mein kaam karta hai.',
      '"Would you mind + verb-ing" ka reversed yes/no logic hai: "no, not at all" matlab agreement hai, refusal nahi.',
      'Ek bare command close family ke saath completely normal hai par zyadatar doosri settings mein abrupt sound karta hai.',
      'Ye exact structure speaking aur professional written requests jaise emails mein equally achha kaam karta hai.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'eng-making-offers',
    title: 'Making Offers — Shall I, Would You Like, I Can',
    titleHi: 'Offers Karna — Shall I, Would You Like, I Can',
    description:
      'An offer flows the opposite direction from a request — you\'re giving, not asking — and English has its own dedicated phrases for exactly that.',
    descriptionHi:
      'Ek offer request ke opposite direction mein flow karta hai — tum de rahe ho, maang nahi rahe — aur English ke paas exactly usi ke liye apne dedicated phrases hain.',
    difficulty: 'EASY',
    duration: 20,
    order: 2,

    analogy: {
      en: '**A request opens your hand to receive; an offer opens your hand to give.** They can use similar-looking words ("can," "would"), but the direction of the exchange is reversed, and English marks that reversal with its own specific offer phrases.',
      hi: 'Ek request tumhara haath receive karne ke liye kholta hai; ek offer tumhara haath dene ke liye kholta hai. Wo similar-looking words use kar sakte hain ("can," "would"), par exchange ki direction reversed hai, aur English us reversal ko apne specific offer phrases se mark karti hai.',
    },

    simple: `**Common ways to make an offer:**

- "**Shall I** open the window?" (offering to do something, quite
  British in flavor but widely understood)
- "**Would you like** some tea?" (offering something to someone)
- "**I can** help you with that." (a plain, direct offer of ability
  and willingness)
- "**Do you want** me to call him?" (a casual, direct offer)

**The structure varies by phrase:**

Shall I + base verb + ...? · Would you like + noun/to + verb? · I can
+ base verb + ... · Do you want me to + base verb + ...?

**Accepting or declining an offer, naturally:**

"Yes, please!" / "That would be great, thanks." → accepting
"No, thank you, I'm fine." / "I'm okay, thanks." → declining, politely

**"Would you like" is genuinely more polite than "do you want" for
offering something to someone**, even though they ask roughly the same
thing.`,
    simpleHi: `**Ek offer karne ke common tareeke:**

- "**Shall I** open the window?" (kuch karne ka offer, quite British
  in flavor par widely understood)
- "**Would you like** some tea?" (kisi ko kuch offer karna)
- "**I can** help you with that." (ek plain, direct offer ability aur
  willingness ka)
- "**Do you want** me to call him?" (ek casual, direct offer)

**Structure phrase ke hisaab se vary karta hai:**

Shall I + base verb + ...? · Would you like + noun/to + verb? · I can
+ base verb + ... · Do you want me to + base verb + ...?

**Ek offer accept ya decline karna, naturally:**

"Yes, please!" / "That would be great, thanks." → accepting
"No, thank you, I'm fine." / "I'm okay, thanks." → declining, politely

**"Would you like" genuinely zyada polite hai "do you want" se kisi ko
kuch offer karne ke liye**, chahe wo roughly same cheez poochte hain.`,

    content: `**Why offers and requests need genuinely different phrases, not just
the reverse of each other.**

A request asks someone else to act for your benefit; an offer proposes
that you act for someone else's benefit. English keeps these
conceptually separate with dedicated phrases — "could you" is
specifically for requests, while "shall I" and "would you like" are
specifically for offers — rather than using one flexible structure for
both directions. Mixing them up (using a request phrase to make an
offer, or vice versa) usually still communicates, but sounds subtly
backward to a native ear.

**"Shall I" is genuinely useful and worth learning even though it can
feel old-fashioned.** It specifically offers to do an action for the
listener's benefit, checking in before acting: "Shall I turn on the
light?" It\'s common in British English and widely understood
everywhere, occupying a specific, useful niche between a plain
statement ("I\'ll turn on the light") and a full question.

**"Would you like" softens an offer exactly the way "could you"
softens a request — through the same "distance" convention.** "Do you
want tea?" is direct and completely fine with people you know well;
"Would you like some tea?" adds a small, genuine layer of courtesy,
useful with guests, strangers, or in any slightly more formal
interaction.

**Declining an offer gracefully is its own small skill.** A flat "no"
can feel abrupt; "No, thank you, I\'m fine" or "I\'m okay, but thank
you for asking" declines just as clearly while acknowledging the
kindness of the offer itself — a small addition that measurably
changes how the exchange feels to both people.`,
    contentHi: `**Offers aur requests ko genuinely different phrases kyun chahiye, sirf ek doosre ka reverse nahi.**

Ek request kisi doosre se poochti hai tumhare benefit ke liye act karne
ke liye; ek offer propose karta hai ki tum kisi aur ke benefit ke liye
act karo. English inhe conceptually separate rakhti hai dedicated
phrases ke saath — "could you" specifically requests ke liye hai,
jabki "shall I" aur "would you like" specifically offers ke liye hain —
dono directions ke liye ek flexible structure use karne ke bajaye. Inhe
mix up karna (ek request phrase use karna ek offer banane ke liye, ya
vice versa) usually phir bhi communicate karta hai, par ek native ear
ko subtly backward sound karta hai.

**"Shall I" genuinely useful hai seekhne layak chahe ye old-fashioned
feel kar sakta hai.** Ye specifically listener ke benefit ke liye ek
action karne ka offer karta hai, act karne se pehle check in karte
hue: "Shall I turn on the light?" Ye British English mein common hai
aur har jagah widely understood hai, ek specific, useful niche occupy
karte hue ek plain statement ("I'll turn on the light") aur ek poore
question ke beech.

**"Would you like" ek offer ko exactly waise soften karta hai jaise
"could you" ek request ko soften karta hai — same "distance"
convention se.** "Do you want tea?" direct hai aur un logon ke saath
completely fine hai jinhe tum achhe se jaante ho; "Would you like some
tea?" ek chhota, genuine layer courtesy ka add karta hai, useful
guests, strangers, ya kisi bhi thodi zyada formal interaction mein.

**Ek offer ko gracefully decline karna apna ek chhota skill hai.** Ek
flat "no" abrupt feel kar sakta hai; "No, thank you, I'm fine" ya "I'm
okay, but thank you for asking" utna hi clearly decline karta hai jabki
offer ki kindness ko acknowledge karta hai — ek chhota addition jo
measurably change karta hai ki exchange dono logon ko kaisa feel karati
hai.`,

    readingPassage: `You look tired. Shall I make you some tea? Would you like something to eat too? I can order some food if you want. Oh, and do you want me to turn off the lights? Just let me know what you need.`,
    readingPassageHi: `Tum tired lag rahe ho. Shall I make you some tea? Would you like something to eat too? I can order some food if you want. Oh, aur do you want me to turn off the lights? Bas mujhe batao tumhe kya chahiye.`,

    vocabulary: [
      {
        word: 'offer',
        wordHi: 'offer (peshkash)',
        meaning: 'to say you are willing to give or do something for someone',
        meaningHi: 'kehna ki tum kisi ke liye kuch dene ya karne ke liye willing ho',
        example: "I'd like to offer you some tea.",
        exampleHi: "I'd like to offer you some tea.",
        pronunciation: 'OF-er',
      },
      {
        word: 'decline',
        wordHi: 'decline (mana karna)',
        meaning: 'to politely refuse an offer',
        meaningHi: 'ek offer ko politely refuse karna',
        example: 'She kindly declined the offer of tea.',
        exampleHi: 'She kindly declined the offer of tea.',
        pronunciation: 'dee-KLYN',
      },
      {
        word: 'accept',
        wordHi: 'accept (swikaar karna)',
        meaning: 'to agree to take an offer',
        meaningHi: 'ek offer lene ke liye agree karna',
        example: "I'll gladly accept your offer to help.",
        exampleHi: "I'll gladly accept your offer to help.",
        pronunciation: 'ak-SEPT',
      },
      {
        word: 'gladly',
        wordHi: 'gladly (khushi se)',
        meaning: 'in a happy, willing way',
        meaningHi: 'ek happy, willing tareeke se',
        example: "I'll gladly help you with that.",
        exampleHi: "I'll gladly help you with that.",
        pronunciation: 'GLAD-lee',
      },
    ],

    examples: [
      {
        title: 'Offering and accepting naturally',
        titleHi: 'Naturally offer karna aur accept karna',
        code: `A: Would you like some coffee?
B: Yes, please, that would be great.
A: Shall I bring it to your desk?
B: That would be really kind, thank you.`,
        output: 'A warm, natural offer-and-accept exchange.',
        explain:
          'Notice both offers ("Would you like", "Shall I") and both acceptances flow smoothly and warmly — this is a genuinely reusable pattern for offering someone something at work or at home.',
        explainHi:
          'Notice karo dono offers ("Would you like", "Shall I") aur dono acceptances smoothly aur warmly flow karte hain — ye ek genuinely reusable pattern hai kaam pe ya ghar pe kisi ko kuch offer karne ke liye.',
      },
      {
        title: 'Declining an offer gracefully',
        titleHi: 'Ek offer ko gracefully decline karna',
        code: `A: Would you like some more cake?
B: No, thank you, I'm quite full — but it was delicious!`,
        output: 'A clear "no" softened with appreciation.',
        explain:
          'Adding a genuine compliment ("it was delicious") alongside the decline keeps the exchange warm, even though the offer itself is being turned down.',
        explainHi:
          'Decline ke saath ek genuine compliment ("it was delicious") add karna exchange ko warm rakhta hai, chahe offer khud turn down ho raha ho.',
      },
    ],

    mistakes: [
      {
        wrong: '"Could I make you some tea?" (using a request phrase to make an offer)',
        right: '"Shall I make you some tea?" / "Would you like some tea?"',
        why: '"Could I" asks for permission for YOUR OWN benefit (a request), while an offer needs a phrase like "shall I" or "would you like" that\'s specifically built for proposing to act for someone ELSE\'s benefit.',
        whyHi: '"Could I" tumhare APNE benefit ke liye permission maangta hai (ek request), jabki ek offer ko "shall I" ya "would you like" jaisa ek phrase chahiye jo specifically kisi AUR ke benefit ke liye act karne ka propose karne ke liye bana hai.',
      },
      {
        wrong: 'A flat "No" with nothing else when declining an offer',
        right: '"No, thank you, I\'m fine." / "I\'m okay, but thank you for asking."',
        why: 'A bare "no" can feel abrupt or even slightly rude in response to a kind offer. Adding "thank you" acknowledges the gesture even while declining it.',
        whyHi: 'Ek bare "no" abrupt ya even thoda rude feel kar sakta hai ek kind offer ke response mein. "Thank you" add karna gesture ko acknowledge karta hai, use decline karte hue bhi.',
      },
    ],

    realWorld: [
      {
        en: '**Hosting guests at home** — offering food, drinks, or help with something — is one of the most common, culturally important uses of these exact phrases in everyday English.',
        hi: '**Ghar pe guests host karna** — khana, drinks, ya kisi cheez mein help offer karna — everyday English mein in exact phrases ke sabse common, culturally important uses mein se ek hai.',
      },
      {
        en: '**Offering help to a colleague or a customer** ("Would you like me to send you the details?", "Shall I set up a call?") makes you sound proactive and considerate in a professional setting.',
        hi: '**Ek colleague ya ek customer ko help offer karna** ("Would you like me to send you the details?", "Shall I set up a call?") tumhe proactive aur considerate sound karata hai ek professional setting mein.',
      },
    ],

    interviewQA: [
      {
        q: 'Is "Shall I" used much in everyday American English, or mostly British?',
        qHi: 'Kya "Shall I" everyday American English mein zyada use hota hai, ya mostly British?',
        a: '"Shall I" is more common in British English than American English, where "I can" or "do you want me to" are often preferred instead. It\'s still completely understood everywhere, so it\'s worth knowing, but don\'t worry if it feels less natural to you than the alternatives.',
        aHi: '"Shall I" British English mein American English se zyada common hai, jahan "I can" ya "do you want me to" often preferred hote hain iske bajaye. Ye phir bhi har jagah completely understood hai, isliye janne layak hai, par worry mat karo agar ye tumhe alternatives se kam natural feel ho.',
      },
      {
        q: 'How do I offer to do something without sounding like I\'m imposing?',
        qHi: 'Main kaise offer karoon kuch karne ke liye bina aisa sound kiye ki main impose kar raha hoon?',
        a: 'A gentle checking phrase like "Shall I..." or "Would it help if I...?" leaves the other person genuinely free to accept or decline, which reads as considerate rather than pushy — much softer than simply announcing "I\'m going to do this for you."',
        aHi: 'Ek gentle checking phrase jaisa "Shall I..." ya "Would it help if I...?" doosre person ko genuinely free chhodta hai accept ya decline karne ke liye, jo pushy ke bajaye considerate padhta hai — simply "I\'m going to do this for you" announce karne se kahin softer.',
      },
    ],

    exercises: [
      {
        task: 'Out loud, offer someone tea, help carrying something, and a ride home — using a different offer phrase for each.',
        taskHi: 'Zor se, kisi ko tea, kuch carry karne mein help, aur ghar tak ride offer karo — har ek ke liye ek different offer phrase use karke.',
        hint: '"Would you like some tea?" "Shall I help you carry that?" "Can I give you a ride home?"',
        hintHi: '"Would you like some tea?" "Shall I help you carry that?" "Can I give you a ride home?"',
      },
      {
        task: 'Out loud, practice both accepting and declining the same offer: "Would you like some more food?"',
        taskHi: 'Zor se, same offer ko accept aur decline dono practice karo: "Would you like some more food?"',
        hint: 'Accept: "Yes, please, thank you!" Decline: "No, thank you, I\'m quite full."',
        hintHi: 'Accept: "Yes, please, thank you!" Decline: "No, thank you, I\'m quite full."',
      },
    ],

    keyTakeaways: [
      'An offer proposes YOU act for someone else\'s benefit — genuinely different from a request, which asks someone else to act for yours.',
      '"Shall I," "would you like," "I can," and "do you want me to" are the main phrases for making an offer.',
      '"Would you like" is more polite than "do you want" for offering something, the same way "could you" is more polite than "can you" for requesting.',
      'Accepting: "Yes, please" / "That would be great." Declining: "No, thank you, I\'m fine" — always softer with "thank you" attached.',
      'Mixing up request phrases and offer phrases (like "could I" for an offer) usually communicates but sounds subtly backward.',
    ],
    keyTakeawaysHi: [
      'Ek offer propose karta hai ki TUM kisi aur ke benefit ke liye act karo — ek request se genuinely different, jo poochta hai koi aur tumhare liye act kare.',
      '"Shall I," "would you like," "I can," aur "do you want me to" ek offer karne ke main phrases hain.',
      '"Would you like" "do you want" se zyada polite hai kuch offer karne ke liye, same tareeke se jaise "could you" "can you" se zyada polite hai request karne ke liye.',
      'Accepting: "Yes, please" / "That would be great." Declining: "No, thank you, I\'m fine" — hamesha "thank you" ke saath softer.',
      'Request phrases aur offer phrases ko mix up karna (jaise "could I" ek offer ke liye) usually communicate karta hai par subtly backward sound karta hai.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'eng-making-suggestions',
    title: "Making Suggestions — Let's, Why Don't We, How About",
    titleHi: "Suggestions Karna — Let's, Why Don't We, How About",
    description:
      'A suggestion proposes an idea for both of you to decide on together — softer than a command, and structurally its own thing.',
    descriptionHi:
      'Ek suggestion ek idea propose karta hai dono ke saath milkar decide karne ke liye — ek command se softer, aur structurally apni ek alag cheez.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: '**A suggestion is an idea placed on the table for everyone to look at, not an order handed down.** "Let\'s go for a walk" puts the idea in the middle for both people to consider — nobody has been told what to do, only invited to agree.',
      hi: 'Ek suggestion ek idea hai jo table pe rakha gaya hai sabke dekhne ke liye, ek order nahi jo handed down kiya gaya hai. "Let\'s go for a walk" idea ko beech mein rakhta hai dono logon ke consider karne ke liye — kisi ko nahi bataya gaya kya karna hai, sirf agree karne ke liye invite kiya gaya hai.',
    },

    simple: `**Common ways to make a suggestion:**

- "**Let's** go for a walk." (includes you both — "let us")
- "**Why don't we** try that new restaurant?" (a gentle, open
  suggestion, phrased as a question)
- "**How about** we watch a movie tonight?" / "**How about** a
  movie tonight?" (casual, flexible — works with a full sentence or
  just a noun)
- "**Maybe we could** ask for directions." (soft, tentative)

**The structure varies:**

Let's + base verb · Why don't we + base verb...? · How about +
verb-ing/noun...? · Maybe we could + base verb...

**Responding to a suggestion:**

"That sounds great!" / "Good idea, let's do that." → accepting
"I'm not sure about that — how about [alternative] instead?" →
politely offering a different idea

**"Let's" specifically includes the speaker too** — it's short for
"let us," proposing something you'll do together, which is genuinely
different from telling someone else what they should do.`,
    simpleHi: `**Ek suggestion karne ke common tareeke:**

- "**Let's** go for a walk." (dono ko include karta hai — "let us")
- "**Why don't we** try that new restaurant?" (ek gentle, open
  suggestion, ek question ki tarah phrase kiya gaya)
- "**How about** we watch a movie tonight?" / "**How about** a
  movie tonight?" (casual, flexible — ek full sentence ya sirf ek
  noun ke saath kaam karta hai)
- "**Maybe we could** ask for directions." (soft, tentative)

**Structure vary karta hai:**

Let's + base verb · Why don't we + base verb...? · How about +
verb-ing/noun...? · Maybe we could + base verb...

**Ek suggestion ko respond karna:**

"That sounds great!" / "Good idea, let's do that." → accepting
"I'm not sure about that — how about [alternative] instead?" →
politely ek different idea offer karna

**"Let's" specifically speaker ko bhi include karta hai** — ye "let
us" ka short form hai, kuch propose karte hue jo tum saath mein karoge,
jo genuinely different hai kisi aur ko batane se ki unhe kya karna
chahiye.`,

    content: `**Why "let's" is genuinely different from a command, structurally
and socially.**

"Let's go" literally means "let us go" — it includes the speaker as
part of the action, not just the listener. This is precisely why it
feels collaborative rather than commanding: "Go" tells someone else
what to do; "Let's go" proposes something the speaker is joining in
on too. This small structural difference is the entire reason "let's"
sounds like an invitation rather than an instruction.

**"Why don't we" is grammatically a question but functions as a
gentle suggestion, not a real request for reasons.** Nobody answering
"Why don't we try that restaurant?" is expected to explain reasons why
they haven't already gone there — the question form is simply a
softer container for the idea, similar in spirit to "I was wondering"
from an earlier lesson.

**"How about" is unusually flexible in what can follow it.** It
accepts a full clause with "we" ("how about we leave early"), a
gerund alone ("how about leaving early"), or even just a noun ("how
about the 6pm show?") — this flexibility makes it one of the most
casual, quick tools for floating an idea without much grammatical
overhead.

**Disagreeing with a suggestion works best paired with an
alternative, not a bare refusal.** "That doesn't sound great" without
anything else stalls the conversation; "I'm not sure about that — how
about [something else] instead?" keeps the collaborative spirit alive
by offering a new idea in the same breath as declining the old one.`,
    contentHi: `**"Let's" ek command se genuinely different kyun hai, structurally
aur socially.**

"Let's go" literally matlab hai "let us go" — ye speaker ko action ka
part ki tarah include karta hai, sirf listener nahi. Yahi precisely
reason hai ki ye commanding ke bajaye collaborative feel karta hai:
"Go" kisi aur ko batata hai kya karna hai; "Let's go" kuch propose
karta hai jismein speaker khud bhi join kar raha hai. Ye chhota
structural difference poori reason hai ki "let's" ek instruction ki
jagah ek invitation jaisa sound karta hai.

**"Why don't we" grammatically ek question hai par ek gentle
suggestion ki tarah function karta hai, reasons ki ek real request
nahi.** "Why don't we try that restaurant?" ko answer karne wale se
expect nahi kiya jaata ki wo reasons explain kare ki wo abhi tak wahan
kyun nahi gaye — question form simply idea ke liye ek softer container
hai, "I was wondering" jaise ek earlier lesson se similar spirit mein.

**"How about" unusually flexible hai ki uske baad kya aa sakta hai.**
Ye ek full clause "we" ke saath accept karta hai ("how about we leave
early"), akela ek gerund ("how about leaving early"), ya even sirf ek
noun ("how about the 6pm show?") — ye flexibility ise sabse casual,
quick tools mein se ek banati hai ek idea float karne ke liye bina
zyada grammatical overhead ke.

**Ek suggestion se disagree karna best kaam karta hai ek alternative
ke saath paired, ek bare refusal nahi.** "That doesn't sound great"
kisi aur cheez ke bina conversation ko stall kar deta hai; "I'm not
sure about that — how about [something else] instead?" collaborative
spirit ko alive rakhta hai ek naya idea offer karke usi breath mein jab
purana decline kiya ja raha ho.`,

    readingPassage: `We have a free evening. Let's do something fun. Why don't we try that new restaurant downtown? Or how about a movie instead? Actually, maybe we could just relax at home. What do you think sounds best?`,
    readingPassageHi: `Humara ek free evening hai. Let's do something fun. Why don't we try that new restaurant downtown? Ya how about a movie instead? Actually, maybe we could just relax at home. Tumhe kya lagta hai sabse best sound karta hai?`,

    vocabulary: [
      {
        word: 'suggestion',
        wordHi: 'suggestion (sujhav)',
        meaning: 'an idea offered for others to consider',
        meaningHi: 'ek idea jo doosron ke consider karne ke liye offer kiya gaya hai',
        example: 'I have a suggestion for the weekend.',
        exampleHi: 'I have a suggestion for the weekend.',
        pronunciation: 'suh-JES-chun',
      },
      {
        word: 'downtown',
        wordHi: 'downtown (sheher ka kendra)',
        meaning: 'the central or main area of a city',
        meaningHi: 'ek city ka central ya main area',
        example: "There's a great cafe downtown.",
        exampleHi: "There's a great cafe downtown.",
        pronunciation: 'DOWN-town',
      },
      {
        word: 'alternative',
        wordHi: 'alternative (vikalp)',
        meaning: 'a different option or choice',
        meaningHi: 'ek different option ya choice',
        example: "If that doesn't work, here's an alternative.",
        exampleHi: "If that doesn't work, here's an alternative.",
        pronunciation: 'awl-TER-nuh-tiv',
      },
      {
        word: 'relax',
        wordHi: 'relax (aaram karna)',
        meaning: 'to rest and stop worrying or working',
        meaningHi: 'rest karna aur worry ya kaam karna band karna',
        example: "Let's just relax at home tonight.",
        exampleHi: "Let's just relax at home tonight.",
        pronunciation: 'ri-LAKS',
      },
    ],

    examples: [
      {
        title: 'Floating several suggestions in one conversation',
        titleHi: 'Ek conversation mein kayi suggestions float karna',
        code: `A: Let's do something different this weekend.
B: Why don't we go hiking?
A: How about the beach instead? It's closer.
B: That sounds great, let's do that!`,
        output: 'Multiple suggestions offered casually, one accepted at the end.',
        explain:
          'Notice how naturally suggestions get proposed and swapped here — nobody rejects an idea harshly, they simply offer another one, and the conversation flows smoothly to an agreement.',
        explainHi:
          'Notice karo kaise naturally yahan suggestions propose aur swap hoti hain — koi bhi idea ko harshly reject nahi karta, wo simply ek aur offer karte hain, aur conversation smoothly ek agreement tak flow karta hai.',
      },
      {
        title: 'Declining a suggestion with an alternative',
        titleHi: 'Ek alternative ke saath ek suggestion decline karna',
        code: `A: How about we start the meeting at 9am?
B: I'm not sure I can make it that early — how about 10 instead?
A: 10 works for me too.`,
        output: 'A polite decline immediately paired with a workable alternative.',
        explain:
          'This keeps the conversation moving productively — B doesn\'t just say "no," they immediately offer a solution, which is the more collaborative, natural way to disagree with a suggestion.',
        explainHi:
          'Ye conversation ko productively move karta rehta hai — B sirf "no" nahi kehta, wo immediately ek solution offer karta hai, jo ek suggestion se disagree karne ka zyada collaborative, natural tareeka hai.',
      },
    ],

    mistakes: [
      {
        wrong: '"Let\'s you go to the store." (adding "you" after "let\'s")',
        right: '"Let\'s go to the store." / "You should go to the store."',
        why: '"Let\'s" already means "let us" and includes the speaker — adding "you" contradicts that meaning. If you specifically mean only the other person should go, use a different structure like "you should" instead.',
        whyHi: '"Let\'s" already "let us" matlab hai aur speaker ko include karta hai — "you" add karna us meaning ko contradict karta hai. Agar tumhara matlab specifically sirf doosra person jaaye, "you should" jaisa ek different structure use karo.',
      },
      {
        wrong: 'Responding to a suggestion with a flat "No" and nothing else',
        right: '"I\'m not sure about that — how about [alternative] instead?"',
        why: 'A bare refusal can feel dismissive and stalls the conversation. Pairing a decline with an alternative keeps the exchange collaborative and moving forward.',
        whyHi: 'Ek bare refusal dismissive feel kar sakta hai aur conversation ko stall karta hai. Ek decline ko ek alternative ke saath pair karna exchange ko collaborative aur aage badhta rakhta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Planning anything with friends or family** — where to eat, what to do this weekend, which movie to watch — depends almost entirely on this exact suggestion-and-response pattern.',
        hi: '**Friends ya family ke saath kuch bhi plan karna** — kahan khana khaana hai, is weekend kya karna hai, kaunsi movie dekhni hai — almost poori tarah is exact suggestion-and-response pattern pe depend karta hai.',
      },
      {
        en: '**Proposing an approach in a meeting** ("Why don\'t we try a different strategy?", "How about we split the task into two parts?") lets you contribute ideas without sounding like you\'re dictating to the team.',
        hi: '**Ek meeting mein ek approach propose karna** ("Why don\'t we try a different strategy?", "How about we split the task into two parts?") tumhe ideas contribute karne deta hai bina team ko dictate karte hue sound kiye.',
      },
    ],

    interviewQA: [
      {
        q: 'Is there a difference between "let\'s" and "why don\'t we" — do they mean the same thing?',
        qHi: 'Kya "let\'s" aur "why don\'t we" mein farak hai — kya inka matlab same hai?',
        a: 'They\'re very close in meaning, but "let\'s" sounds slightly more decided and enthusiastic ("Let\'s go now!"), while "why don\'t we" sounds a bit more tentative and open to discussion ("Why don\'t we go now?"). Both are genuinely interchangeable in most everyday situations.',
        aHi: 'Meaning mein ye bahut close hain, par "let\'s" thoda zyada decided aur enthusiastic sound karta hai ("Let\'s go now!"), jabki "why don\'t we" thoda zyada tentative aur discussion ke liye open sound karta hai ("Why don\'t we go now?"). Dono genuinely interchangeable hain zyadatar everyday situations mein.',
      },
      {
        q: 'Can "how about" be used with just a single word or short phrase, without a full sentence?',
        qHi: 'Kya "how about" ek single word ya short phrase ke saath use ho sakta hai, bina ek full sentence ke?',
        a: 'Yes, this is one of "how about"\'s most useful features — "How about pizza?" or "How about Friday?" work perfectly as complete, casual suggestions on their own, without needing a full clause.',
        aHi: 'Haan, ye "how about" ki sabse useful features mein se ek hai — "How about pizza?" ya "How about Friday?" perfectly kaam karte hain complete, casual suggestions ki tarah apne aap mein, ek full clause ki zaroorat ke bina.',
      },
    ],

    exercises: [
      {
        task: 'Out loud, suggest three different weekend activities using "let\'s," "why don\'t we," and "how about" — one each.',
        taskHi: 'Zor se, teen alag weekend activities suggest karo "let\'s," "why don\'t we," aur "how about" use karke — ek-ek.',
        hint: '"Let\'s go for a hike." "Why don\'t we visit the museum?" "How about a picnic?"',
        hintHi: '"Let\'s go for a hike." "Why don\'t we visit the museum?" "How about a picnic?"',
      },
      {
        task: 'Out loud, practice declining a suggestion while offering an alternative: respond to "How about we meet at 8am?"',
        taskHi: 'Zor se, ek suggestion decline karna practice karo ek alternative offer karte hue: "How about we meet at 8am?" ka respond karo.',
        hint: '"I\'m not sure I can make it that early — how about 9:30 instead?"',
        hintHi: '"I\'m not sure I can make it that early — how about 9:30 instead?"',
      },
    ],

    keyTakeaways: [
      '"Let\'s" (= "let us") includes the speaker as part of the action, which is why it feels collaborative, not commanding.',
      '"Why don\'t we" is grammatically a question but functions as a gentle suggestion, not a real request for reasons.',
      '"How about" is unusually flexible — it works with a full clause, a gerund, or just a noun.',
      'Accepting: "That sounds great!" Declining well: pair it with an alternative, don\'t just say "no."',
      'A suggestion proposes an idea for mutual agreement, genuinely different in spirit from a request or a command.',
    ],
    keyTakeawaysHi: [
      '"Let\'s" (= "let us") speaker ko action ka part ki tarah include karta hai, isi liye ye collaborative feel karta hai, commanding nahi.',
      '"Why don\'t we" grammatically ek question hai par ek gentle suggestion ki tarah function karta hai, reasons ki ek real request nahi.',
      '"How about" unusually flexible hai — ye ek full clause, ek gerund, ya sirf ek noun ke saath kaam karta hai.',
      'Accepting: "That sounds great!" Achhe se declining: ise ek alternative ke saath pair karo, sirf "no" mat kaho.',
      'Ek suggestion ek idea propose karta hai mutual agreement ke liye, ek request ya command se genuinely different spirit mein.',
    ],
  },
];
