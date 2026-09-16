/**
 * English Speaking Complete Course — Module 15: Job Interviews &
 * Professional English, lessons 1-3. Closes Part V (Real-World
 * English).
 *
 * Lesson 1: "Tell me about yourself" — the interview's opening
 *           question, and the structure that answers it well.
 * Lesson 2: Answering behavioral questions with the STAR structure —
 *           a real, learnable shape for "tell me about a time you...".
 * Lesson 3: Professional register — the vocabulary shift from everyday
 *           speech to how you describe your own work.
 */

import type { CourseLesson } from './course-js-module1';

export const ENGLISH_MODULE_15: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'eng-tell-me-about-yourself',
    title: '"Tell Me About Yourself" — The Opening Question',
    titleHi: '"Tell Me About Yourself" — Opening Question',
    description:
      'Present, past, future — the three-part shape almost every strong answer to this question actually follows underneath.',
    descriptionHi:
      'Present, past, future — three-part shape jise almost har strong answer is question ka actually follow karta hai underneath.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 1,

    analogy: {
      en: '**A good answer to "tell me about yourself" is a short trailer for a movie, not the whole film.** A trailer shows just enough — where you are now, a key moment from your past, what you\'re looking for next — to make someone want to ask a follow-up question, without trying to tell the entire story in one breath.',
      hi: '"tell me about yourself" ka ek achha answer ek movie ka ek short trailer hai, poori film nahi. Ek trailer bas itna dikhata hai — tum abhi kahan ho, tumhare past se ek key moment, tum aage kya dhoondh rahe ho — kisi ko ek follow-up question poochne ke liye chahne ke liye, ek breath mein poori story batane ki koshish kiye bina.',
    },

    simple: `**A reliable three-part structure: present → past → future.**

1. **Present**: what you currently do. "I'm currently a marketing
   coordinator at a mid-size retail company."
2. **Past**: a brief, relevant path to here. "Before that, I studied
   business and did an internship in social media marketing."
3. **Future**: what you're looking for next, connecting to this job.
   "Now I'm looking for a role where I can lead bigger campaigns,
   which is why this position caught my attention."

**Keep it to about 60-90 seconds spoken — roughly four to six
sentences.**

**End by connecting back to the job or company you're interviewing
for** — this makes the answer feel purposeful rather than a generic,
recycled speech used for every interview.

**This is not the moment for your full life story.** Personal details
unrelated to your professional path (family, hobbies, unless directly
relevant) usually don't belong in this specific answer.`,
    simpleHi: `**Ek reliable three-part structure: present → past → future.**

1. **Present**: tum currently kya karte ho. "I'm currently a marketing
   coordinator at a mid-size retail company."
2. **Past**: ek brief, relevant path yahan tak. "Before that, I studied
   business and did an internship in social media marketing."
3. **Future**: tum aage kya dhoondh rahe ho, is job se connect karte
   hue. "Now I'm looking for a role where I can lead bigger campaigns,
   which is why this position caught my attention."

**Ise around 60-90 seconds spoken tak rakho — roughly char se chhe
sentences.**

**Us job ya company se wapas connect karke end karo jiske liye tum
interview de rahe ho** — ye answer ko purposeful feel karata hai, ek
generic, recycled speech ki jagah jo har interview ke liye use hoti
hai.

**Ye tumhari poori life story ka moment nahi hai.** Personal details
jo tumhare professional path se unrelated hain (family, hobbies, jab
tak directly relevant na hon) usually is specific answer mein belong
nahi karte.`,

    content: `**Why the present-past-future shape works so reliably for this
specific question.**

"Tell me about yourself" is intentionally open-ended, which makes it
genuinely hard to answer without some structure to lean on. The
present-past-future shape solves this by giving the interviewer
exactly the three things they actually want to know — where you are,
how you got here, and where you're headed — in an order that mirrors
how a story naturally unfolds, without you having to invent a
structure on the spot.

**Ending with a connection to the specific job is what separates a
strong answer from a generic one.** An answer that ends with "...and
I'm looking for new challenges" could apply to literally any
interview anywhere. An answer that ends with "...which is why this
particular role, with its focus on X, really caught my attention"
demonstrates you've actually thought about why THIS job fits your
trajectory specifically.

**Time discipline matters more than it might seem.** An answer that
runs past 90 seconds risks losing the interviewer's attention or
eating into time for other important questions; an answer that's too
short (under 30 seconds) can seem underprepared or disengaged. The
present-past-future shape naturally produces an answer in the right
range without needing to watch a clock.

**Deciding what to leave out is as important as deciding what to
include.** With limited time, only the most relevant past experiences
and the most directly connected future goals belong in this answer —
a full chronological work history belongs in a resume and later,
more specific interview questions, not in this opening answer.`,
    contentHi: `**Present-past-future shape is specific question ke liye itna reliably kyun kaam karti hai.**

"Tell me about yourself" intentionally open-ended hai, jo ise bina
kisi structure ke lean karne ke genuinely answer karna hard bana deta
hai. Present-past-future shape ise solve karti hai interviewer ko
exactly wo teen cheezein deke jo wo actually janna chahte hain — tum
kahan ho, tum yahan kaise pahunche, aur tum kahan ja rahe ho — ek
order mein jo mirror karta hai ki ek story naturally kaise unfold
hoti hai, tumhe spot pe ek structure invent karne ki zaroorat ke
bina.

**Specific job se ek connection ke saath end karna hi ek strong answer
ko ek generic wale se separate karta hai.** Ek answer jo "...and I'm
looking for new challenges" pe end hota hai literally kisi bhi
interview kahin bhi apply ho sakta hai. Ek answer jo "...which is why
this particular role, with its focus on X, really caught my
attention" pe end hota hai demonstrate karta hai ki tumne actually
socha hai ki ye job specifically tumhari trajectory mein kyun fit
karti hai.

**Time discipline waise se zyada matter karta hai jaisa lag sakta
hai.** Ek answer jo 90 seconds se aage jaata hai interviewer ka
attention lose karne ya doosre important questions ke liye time khane
ka risk uthata hai; ek answer jo bahut short hai (30 seconds se kam)
underprepared ya disengaged lag sakta hai. Present-past-future shape
naturally ek answer sahi range mein produce karti hai bina ek clock
dekhne ki zaroorat ke.

**Kya chhodna hai decide karna utna hi important hai jitna kya include
karna hai decide karna.** Limited time ke saath, sirf sabse relevant
past experiences aur sabse directly connected future goals is answer
mein belong karte hain — ek full chronological work history ek resume
mein aur baad ke, zyada specific interview questions mein belong karti
hai, is opening answer mein nahi.`,

    readingPassage: `Sure, I'd be happy to tell you about myself. I'm currently working as a customer support specialist at a software company. Before that, I studied communications and worked part-time in retail, which really taught me how to handle difficult situations calmly. Now, I'm looking to move into a role with more responsibility, which is exactly what drew me to this position.`,
    readingPassageHi: `Sure, I'd be happy to tell you about myself. Main currently ek customer support specialist ke roop mein ek software company mein kaam kar raha hoon. Before that, maine communications padhi aur part-time retail mein kaam kiya, jisne mujhe really sikhaya difficult situations ko calmly kaise handle karna hai. Now, main zyada responsibility wali ek role mein move karna dhoondh raha hoon, jo exactly wo hai jisne mujhe is position ki taraf khincha.`,

    vocabulary: [
      {
        word: 'currently',
        wordHi: 'currently (abhi/vartaman mein)',
        meaning: 'at this present time',
        meaningHi: 'is present time pe',
        example: "I'm currently working in sales.",
        exampleHi: "I'm currently working in sales.",
        pronunciation: 'KUR-ent-lee',
      },
      {
        word: 'trajectory',
        wordHi: 'trajectory (disha/pragati path)',
        meaning: 'the general path or direction of your career or life',
        meaningHi: 'tumhari career ya life ka general path ya direction',
        example: "This role fits my career trajectory well.",
        exampleHi: "This role fits my career trajectory well.",
        pronunciation: 'truh-JEK-tuh-ree',
      },
      {
        word: 'responsibility',
        wordHi: 'responsibility (zimmedaari)',
        meaning: 'a duty or task you are expected to handle',
        meaningHi: 'ek duty ya task jo tumse expect kiya jaata hai handle karna',
        example: "I'm looking for more responsibility in my next role.",
        exampleHi: "I'm looking for more responsibility in my next role.",
        pronunciation: 'ri-spon-si-BIL-i-tee',
      },
      {
        word: 'drew me to',
        wordHi: 'drew me to (mujhe kheencha)',
        meaning: 'attracted or interested me in something',
        meaningHi: 'mujhe kisi cheez mein attract ya interested kiya',
        example: "The company's mission is what drew me to this job.",
        exampleHi: "The company's mission is what drew me to this job.",
        pronunciation: 'droo mee too',
      },
    ],

    examples: [
      {
        title: 'A complete present-past-future answer',
        titleHi: 'Ek complete present-past-future answer',
        code: `I'm currently a junior developer at a fintech startup, mostly working on the mobile app. Before this, I studied computer science and did a couple of internships focused on backend development. I'm now looking to grow into a role with more ownership over a full product, which is what excites me most about this opportunity.`,
        output: 'Present role, relevant past, future goal connected to the specific job.',
        explain:
          'Notice each of the three parts is brief — this entire answer takes well under 90 seconds to say out loud, which is exactly the target length.',
        explainHi:
          'Notice karo teeno parts brief hain — ye poora answer 90 seconds se kaafi kam mein zor se bolne mein lagta hai, jo exactly target length hai.',
      },
      {
        title: 'A weak, unconnected ending vs. a strong, connected one',
        titleHi: 'Ek weak, unconnected ending vs. ek strong, connected wala',
        code: `Weak: "...and I'm just looking for new opportunities."
Strong: "...and this role's focus on mentoring junior developers is exactly the kind of responsibility I'm ready for."`,
        output: 'The strong version could only apply to this specific interview.',
        explain:
          'The weak ending is generic enough to fit literally any job posting — the strong ending demonstrates genuine, specific research and interest in this particular role.',
        explainHi:
          'Weak ending itna generic hai ki literally kisi bhi job posting mein fit ho sakta hai — strong ending genuine, specific research aur interest dikhata hai is particular role mein.',
      },
    ],

    mistakes: [
      {
        wrong: 'Reciting your entire resume chronologically, job by job, from your very first position onward',
        right: 'Use present → past → future, keeping only the most relevant past experience.',
        why: 'A full chronological history is too long for this specific question and buries the information the interviewer actually wants — where you are, briefly how you got here, where you\'re headed.',
        whyHi: 'Ek full chronological history is specific question ke liye too long hai aur us information ko bury kar deta hai jo interviewer actually chahta hai — tum kahan ho, briefly tum yahan kaise pahunche, tum kahan ja rahe ho.',
      },
      {
        wrong: 'Ending the answer with something generic that could apply to any interview: "...and I\'m a hard worker looking for new opportunities."',
        right: 'Connect explicitly to this specific role or company at the end.',
        why: 'A generic ending signals a recycled, unprepared answer, while a specific connection to the job shows genuine thought and interest.',
        whyHi: 'Ek generic ending ek recycled, unprepared answer signal karta hai, jabki job se ek specific connection genuine thought aur interest dikhata hai.',
      },
    ],

    realWorld: [
      {
        en: '**Virtually every job interview**, in almost any industry, opens with some version of this exact question — it\'s one of the highest-value single answers to prepare thoroughly in advance.',
        hi: '**Virtually har job interview**, almost kisi bhi industry mein, is exact question ke kisi version se open hota hai — ye advance mein thoroughly prepare karne ke liye single sabse highest-value answers mein se ek hai.',
      },
      {
        en: '**Networking events and introductions in a professional context** often call for a shorter version of the same present-past-future structure, adapted for a more casual setting.',
        hi: '**Networking events aur ek professional context mein introductions** often same present-past-future structure ka ek shorter version call karte hain, ek zyada casual setting ke liye adapted.',
      },
    ],

    interviewQA: [
      {
        q: 'Should my answer to "tell me about yourself" be exactly the same for every job I interview for?',
        qHi: 'Kya "tell me about yourself" ka mera answer har job ke liye exactly same hona chahiye jiske liye main interview deta hoon?',
        a: 'The present and past parts can stay largely the same, but the future part — and especially the connection at the end — should genuinely change for each specific role, tailored to why that particular job fits your goals.',
        aHi: 'Present aur past parts largely same reh sakte hain, par future part — aur especially end ka connection — har specific role ke liye genuinely change hona chahiye, tailored is baat ke liye ki wo particular job tumhare goals ke saath kyun fit hoti hai.',
      },
      {
        q: 'What if I\'m a student or recent graduate with limited work experience?',
        qHi: 'Agar main ek student ya recent graduate hoon limited work experience ke saath?',
        a: 'The same structure still works — "present" can be your current studies or final project, "past" can include internships or relevant coursework, and "future" states what kind of role and growth you\'re seeking. Experience level doesn\'t change the underlying shape.',
        aHi: 'Same structure phir bhi kaam karta hai — "present" tumhari current studies ya final project ho sakta hai, "past" internships ya relevant coursework include kar sakta hai, aur "future" state karta hai tum kis tarah ki role aur growth dhoondh rahe ho. Experience level underlying shape change nahi karta.',
      },
    ],

    exercises: [
      {
        task: 'Out loud, give your own "tell me about yourself" answer using the present-past-future structure, keeping it under 90 seconds.',
        taskHi: 'Zor se, apna khud ka "tell me about yourself" answer do present-past-future structure use karke, ise 90 seconds ke andar rakhte hue.',
        hint: 'Time yourself once to check the length, then practice again without watching the clock.',
        hintHi: 'Ek baar apna time check karo length ke liye, phir bina clock dekhe phir se practice karo.',
      },
      {
        task: 'Rewrite a generic ending out loud into a specific one connected to a real or imagined job you\'d like.',
        taskHi: 'Ek generic ending ko zor se ek specific ek mein rewrite karo ek real ya imagined job se connected jo tumhe pasand ho.',
        hint: '"...and I\'m looking for new challenges" → "...and this role\'s focus on [specific thing] is exactly what I\'m looking for next."',
        hintHi: '"...and I\'m looking for new challenges" → "...and this role\'s focus on [specific thing] is exactly what I\'m looking for next."',
      },
    ],

    keyTakeaways: [
      'A reliable structure for "tell me about yourself": present (what you do now) → past (brief relevant path) → future (what you\'re looking for, connected to this job).',
      'Keep the answer to roughly 60-90 seconds — about four to six sentences.',
      'Ending with a specific connection to the job or company separates a strong answer from a generic, recycled one.',
      'This is not the moment for a full chronological resume — include only the most relevant past experience.',
      'The same structure works regardless of experience level, including for students with limited work history.',
    ],
    keyTakeawaysHi: [
      '"Tell me about yourself" ke liye ek reliable structure: present (tum abhi kya karte ho) → past (brief relevant path) → future (tum kya dhoondh rahe ho, is job se connected).',
      'Answer ko roughly 60-90 seconds tak rakho — around char se chhe sentences.',
      'Job ya company se ek specific connection ke saath end karna ek strong answer ko ek generic, recycled wale se separate karta hai.',
      'Ye ek full chronological resume ka moment nahi hai — sirf sabse relevant past experience include karo.',
      'Same structure experience level ki parwah kiye bina kaam karti hai, limited work history wale students ke liye bhi.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'eng-star-method-behavioral-questions',
    title: 'The STAR Method — Answering "Tell Me About a Time..."',
    titleHi: 'STAR Method — "Tell Me About a Time..." Answer Karna',
    description:
      'Situation, Task, Action, Result — a real, learnable shape for the interview question that trips up more people than any other.',
    descriptionHi:
      'Situation, Task, Action, Result — ek real, learnable shape us interview question ke liye jo kisi bhi doosre se zyada logon ko trip up karta hai.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: '**STAR is a story\'s four acts, compressed into thirty seconds each.** Every good story has a setting, a goal, what the character actually did, and how it turned out — STAR just makes that structure explicit and quick enough for an interview answer instead of a novel.',
      hi: 'STAR ek story ke four acts hain, har ek tees seconds mein compress kiya gaya. Har achhi story mein ek setting, ek goal, character ne actually kya kiya, aur ye kaise nikla hota hai — STAR bas us structure ko explicit aur ek interview answer ke liye kaafi quick banata hai, ek novel ke bajaye.',
    },

    simple: `**STAR stands for four parts, in order:**

- **Situation**: brief context. "In my last role, our team was
  behind schedule on a major project."
- **Task**: what needed to happen, specifically your part in it. "As
  the project lead, I needed to get us back on track within two
  weeks."
- **Action**: what YOU specifically did — the most important, most
  detailed part. "I reorganized our priorities, delegated two tasks to
  teammates with more capacity, and set up daily short check-ins."
- **Result**: what happened, ideally with a concrete outcome. "We
  delivered the project only two days late, and the client was
  satisfied with the quality."

**Spend the most time on Action** — this is where the interviewer
learns how you actually think and work, not just what happened around
you.

**Use "I," not "we," for the Action step** — even in a team effort,
the interviewer specifically wants to know YOUR individual
contribution.`,
    simpleHi: `**STAR char parts ke liye stand karta hai, order mein:**

- **Situation**: brief context. "In my last role, our team was
  behind schedule on a major project."
- **Task**: kya hona zaroori tha, specifically usme tumhara part. "As
  the project lead, I needed to get us back on track within two
  weeks."
- **Action**: tumne specifically kya kiya — sabse important, sabse
  detailed part. "I reorganized our priorities, delegated two tasks to
  teammates with more capacity, and set up daily short check-ins."
- **Result**: kya hua, ideally ek concrete outcome ke saath. "We
  delivered the project only two days late, and the client was
  satisfied with the quality."

**Action pe sabse zyada time spend karo** — yahin hai jahan interviewer
seekhta hai ki tum actually kaise sochte aur kaam karte ho, sirf tumhare
around kya hua wo nahi.

**Action step ke liye "I" use karo, "we" nahi** — even ek team effort
mein, interviewer specifically janna chahta hai tumhara individual
contribution.`,

    content: `**Why STAR specifically fixes the most common way this question
type goes wrong.**

Without a structure, answers to "tell me about a time you..." tend to
drift in one of two directions: either far too much background detail
about the situation with barely any mention of what the person
actually did, or a vague generality ("I'm good at solving problems")
with no concrete example at all. STAR forces a balance: enough
situation to make sense of the story, but the majority of the answer
spent on the specific actions taken.

**"Action" deserves the most airtime because it's the only part that
reveals YOUR individual judgment and skills.** The situation and task
could happen to anyone in that role; the result depends partly on
factors outside your control (a client's mood, market conditions).
The action — the specific choices you made — is the one part that's
genuinely, entirely about you, which is exactly why interviewers care
about it most.

**Using "I" instead of "we" during the Action step is a deliberate,
important choice, not selfishness.** Even in a genuinely collaborative
team effort, the interviewer is evaluating YOU specifically for this
role — "we decided to reorganize priorities" tells them nothing about
your individual contribution, while "I proposed reorganizing our
priorities, and the team agreed" makes your specific role clear
without denying the team's involvement.

**Having two or three STAR stories prepared in advance, each flexible
enough to answer several different possible questions, is far more
practical than trying to prepare one for every conceivable question.**
A strong story about overcoming a deadline crunch can often be
reframed to answer questions about teamwork, problem-solving, or
handling pressure, depending on which part you emphasize.`,
    contentHi: `**STAR specifically is question type ke sabse common galat hone ke tareeke ko kaise fix karta hai.**

Bina ek structure ke, "tell me about a time you..." ke answers do
directions mein se ek mein drift karte hain: ya to far too much
background detail situation ke baare mein bina barely mention kiye ki
person ne actually kya kiya, ya ek vague generality ("I'm good at
solving problems") bina kisi concrete example ke bilkul. STAR ek
balance force karta hai: enough situation story ko sense mein banane
ke liye, par answer ka majority specific actions pe spend hota hai jo
li gayin.

**"Action" sabse zyada airtime deserve karta hai kyunki ye sirf ek part
hai jo TUMHARA individual judgment aur skills reveal karta hai.**
Situation aur task us role mein kisi ke saath bhi ho sakte hain;
result partly tumhare control se bahar factors pe depend karta hai (ek
client ka mood, market conditions). Action — specific choices jo
tumne banayi — wo ek part hai jo genuinely, poori tarah tumhare baare
mein hai, yahi exactly reason hai ki interviewers isse sabse zyada
care karte hain.

**Action step ke dauran "I" ki jagah "we" use karna ek deliberate,
important choice hai, selfishness nahi.** Even ek genuinely
collaborative team effort mein, interviewer specifically tumhe is role
ke liye evaluate kar raha hai — "we decided to reorganize priorities"
unhe tumhare individual contribution ke baare mein kuch nahi batata,
jabki "I proposed reorganizing our priorities, and the team agreed"
tumhara specific role clear karta hai bina team ke involvement ko deny
kiye.

**Advance mein do ya teen STAR stories prepare karna, har ek flexible
enough kayi alag possible questions answer karne ke liye, har
conceivable question ke liye ek prepare karne ki koshish karne se
kahin zyada practical hai.** Ek strong story ek deadline crunch ko
overcome karne ke baare mein often reframe ho sakti hai teamwork,
problem-solving, ya pressure handle karne ke questions answer karne ke
liye, depending on tum kaunsa part emphasize karte ho.`,

    readingPassage: `Let me answer using a real example. Situation: our team was launching a new feature with a tight deadline. Task: I needed to make sure the testing was thorough despite the time pressure. Action: I created a prioritized testing checklist and asked two teammates to help test the highest-risk areas first. Result: we caught two major bugs before launch, and the release went smoothly.`,
    readingPassageHi: `Main ek real example use karke answer deta hoon. Situation: humari team ek tight deadline ke saath ek naya feature launch kar rahi thi. Task: mujhe ye sure karna tha ki testing thorough ho time pressure ke bawajood. Action: I created a prioritized testing checklist and asked two teammates to help test the highest-risk areas first. Result: humne launch se pehle do major bugs catch kiye, aur release smoothly gaya.`,

    vocabulary: [
      {
        word: 'delegate',
        wordHi: 'delegate (sonpna)',
        meaning: 'to give a task or responsibility to someone else',
        meaningHi: 'ek task ya responsibility kisi aur ko dena',
        example: 'I delegated part of the report to a teammate.',
        exampleHi: 'I delegated part of the report to a teammate.',
        pronunciation: 'DEL-i-geyt',
      },
      {
        word: 'prioritize',
        wordHi: 'prioritize (prathmikta dena)',
        meaning: 'to decide what is most important and should be done first',
        meaningHi: 'decide karna kya sabse important hai aur pehle karna chahiye',
        example: 'I had to prioritize the most urgent tasks first.',
        exampleHi: 'I had to prioritize the most urgent tasks first.',
        pronunciation: 'pry-OR-i-tyz',
      },
      {
        word: 'outcome',
        wordHi: 'outcome (parinaam)',
        meaning: 'the result of an action or event',
        meaningHi: 'ek action ya event ka result',
        example: 'The outcome of the project was very positive.',
        exampleHi: 'The outcome of the project was very positive.',
        pronunciation: 'OWT-kuhm',
      },
      {
        word: 'contribution',
        wordHi: 'contribution (yogdaan)',
        meaning: 'the part someone plays in achieving a result',
        meaningHi: 'wo part jo koi ek result achieve karne mein play karta hai',
        example: 'My contribution was leading the testing process.',
        exampleHi: 'My contribution was leading the testing process.',
        pronunciation: 'kon-tri-BYOO-shun',
      },
    ],

    examples: [
      {
        title: 'A complete STAR answer',
        titleHi: 'Ek complete STAR answer',
        code: `Situation: A key client was unhappy with a delayed delivery.
Task: I needed to address their concerns and rebuild trust.
Action: I called them directly, acknowledged the delay honestly, and proposed a revised timeline with weekly updates.
Result: The client stayed with us, and later became one of our most loyal accounts.`,
        output: 'All four parts present, with Action getting the most detail.',
        explain:
          'Notice Action is the longest, most specific part — this is deliberate, since it\'s the section that shows the interviewer exactly how the candidate thinks and acts under pressure.',
        explainHi:
          'Notice karo Action sabse lamba, sabse specific part hai — ye deliberate hai, kyunki ye wo section hai jo interviewer ko exactly dikhata hai candidate pressure ke neeche kaise sochta aur act karta hai.',
      },
      {
        title: '"We" vs. "I" in the Action step',
        titleHi: 'Action step mein "We" vs. "I"',
        code: `Weak: "We decided to change our approach and it worked out."
Strong: "I proposed changing our approach, presented the idea to the team, and we agreed to try it."`,
        output: 'The second version clarifies exactly what the candidate personally did.',
        explain:
          'The weak version could describe literally anyone on the team — the strong version makes the candidate\'s specific initiative and role unmistakably clear.',
        explainHi:
          'Weak version literally team ke kisi ko bhi describe kar sakta hai — strong version candidate ki specific initiative aur role ko unmistakably clear banata hai.',
      },
    ],

    mistakes: [
      {
        wrong: 'Spending most of the answer describing the situation and barely mentioning what you actually did',
        right: 'Keep Situation and Task brief; spend the most time and detail on Action.',
        why: 'The situation could happen to anyone — Action is the only part that reveals your specific judgment, decisions, and skills, which is what the interviewer actually wants to evaluate.',
        whyHi: 'Situation kisi ke saath bhi ho sakta hai — Action ek sirf part hai jo tumhara specific judgment, decisions, aur skills reveal karta hai, jo interviewer actually evaluate karna chahta hai.',
      },
      {
        wrong: 'Using "we" throughout the entire answer, never clarifying your individual contribution',
        right: 'Use "I" specifically during the Action step, even for a team effort.',
        why: 'The interviewer is evaluating you individually for this role — "we" alone leaves your specific contribution unclear, even in a genuinely collaborative situation.',
        whyHi: 'Interviewer tumhe individually is role ke liye evaluate kar raha hai — sirf "we" tumhara specific contribution unclear chhod deta hai, ek genuinely collaborative situation mein bhi.',
      },
    ],

    realWorld: [
      {
        en: '**Behavioral interview questions** ("Tell me about a time you faced a conflict," "Describe a time you failed") are extremely common across almost every industry and role, making STAR one of the highest-value structures to master.',
        hi: '**Behavioral interview questions** ("Tell me about a time you faced a conflict," "Describe a time you failed") almost har industry aur role mein extremely common hain, STAR ko master karne layak sabse highest-value structures mein se ek banate hue.',
      },
      {
        en: '**Performance reviews and promotion discussions at work** often call for the same structure when describing your own accomplishments — situation, what needed doing, what you did, and the measurable result.',
        hi: '**Performance reviews aur promotion discussions kaam pe** often same structure call karte hain apne khud ke accomplishments describe karte waqt — situation, kya karna zaroori tha, tumne kya kiya, aur measurable result.',
      },
    ],

    interviewQA: [
      {
        q: 'What if my example doesn\'t have a clearly positive result?',
        qHi: 'Agar mere example ka koi clearly positive result nahi hai?',
        a: 'A story about a failure or a mixed outcome can still work well with STAR — the Result section can honestly describe what happened AND what you learned or changed afterward, which often demonstrates self-awareness and growth just as effectively as a pure success story.',
        aHi: 'Ek failure ya ek mixed outcome ke baare mein ek story phir bhi STAR ke saath achha kaam kar sakti hai — Result section honestly describe kar sakta hai kya hua AUR tumne baad mein kya seekha ya change kiya, jo often self-awareness aur growth ko utni hi effectively demonstrate karta hai ek pure success story jitna.',
      },
      {
        q: 'How many STAR stories should I prepare before an interview?',
        qHi: 'Interview se pehle mujhe kitni STAR stories prepare karni chahiye?',
        a: "Two or three strong, flexible stories are usually enough — a story about overcoming a challenge, one about teamwork or conflict, and one about a mistake or failure covers most common behavioral question categories with room to adapt each one slightly.",
        aHi: "Do ya teen strong, flexible stories usually kaafi hain — ek challenge overcome karne ke baare mein ek story, teamwork ya conflict ke baare mein ek, aur ek mistake ya failure ke baare mein ek zyadatar common behavioral question categories cover karti hai har ek ko thoda adapt karne ki room ke saath.",
      },
    ],

    exercises: [
      {
        task: 'Out loud, tell a real story from your own life using the full STAR structure, spending the most time on the Action step.',
        taskHi: 'Zor se, apni khud ki zindagi se ek real story batao poora STAR structure use karke, Action step pe sabse zyada time spend karte hue.',
        hint: 'Situation (1 sentence) → Task (1 sentence) → Action (2-3 sentences) → Result (1 sentence).',
        hintHi: 'Situation (1 sentence) → Task (1 sentence) → Action (2-3 sentences) → Result (1 sentence).',
      },
      {
        task: 'Rewrite this out loud to clarify individual contribution: "We worked really hard and the project succeeded."',
        taskHi: 'Ise zor se rewrite karo individual contribution clarify karne ke liye: "We worked really hard and the project succeeded."',
        hint: '"I took ownership of the timeline, and after the team worked hard together, the project succeeded."',
        hintHi: '"I took ownership of the timeline, and after the team worked hard together, the project succeeded."',
      },
    ],

    keyTakeaways: [
      'STAR: Situation (brief context) → Task (what needed to happen) → Action (what YOU specifically did) → Result (the outcome).',
      'Spend the most time and detail on Action — it\'s the only part that reveals your individual judgment and skills.',
      'Use "I," not "we," during the Action step, even in a team effort — the interviewer is evaluating you specifically.',
      'A story with a mixed or negative result can still work well if the Result section honestly includes what you learned.',
      'Prepare two or three flexible STAR stories in advance rather than trying to prepare one for every possible question.',
    ],
    keyTakeawaysHi: [
      'STAR: Situation (brief context) → Task (kya hona zaroori tha) → Action (TUMNE specifically kya kiya) → Result (outcome).',
      'Action pe sabse zyada time aur detail spend karo — ye ek sirf part hai jo tumhara individual judgment aur skills reveal karta hai.',
      'Action step ke dauran "I" use karo, "we" nahi, even ek team effort mein — interviewer tumhe specifically evaluate kar raha hai.',
      'Ek mixed ya negative result wali story phir bhi achhi kaam kar sakti hai agar Result section honestly include kare tumne kya seekha.',
      'Advance mein do ya teen flexible STAR stories prepare karo har possible question ke liye ek prepare karne ki koshish karne ke bajaye.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'eng-professional-register',
    title: 'Professional Register — Describing Your Work Precisely',
    titleHi: 'Professional Register — Apna Kaam Precisely Describe Karna',
    description:
      '"I helped with the project" and "I led cross-functional coordination on the project" describe the same work — professional register is choosing the second one honestly.',
    descriptionHi:
      '"I helped with the project" aur "I led cross-functional coordination on the project" same kaam describe karte hain — professional register honestly doosra choose karna hai.',
    difficulty: 'HARD',
    duration: 20,
    order: 3,

    analogy: {
      en: '**Professional register is wearing the right outfit for the room, not becoming a different person.** The same honest facts about your work can be dressed in everyday, casual words or in precise, professional ones — the content doesn\'t change, but the outfit changes how seriously it\'s taken.',
      hi: 'Professional register room ke liye sahi outfit pehenna hai, ek different person banna nahi. Tumhare kaam ke baare mein same honest facts everyday, casual words mein ya precise, professional words mein dress ho sakte hain — content change nahi hota, par outfit change karta hai ki ise kitni seriously liya jaata hai.',
    },

    simple: `**Everyday phrase → more precise, professional phrase:**

- "I helped with..." → "I contributed to..." / "I supported..."
- "I was in charge of..." → "I led..." / "I managed..." / "I
  oversaw..."
- "I did a lot of..." → "I was responsible for..."
- "I fixed a problem with..." → "I resolved an issue with..." / "I
  troubleshot..."
- "I made things better..." → "I improved..." / "I optimized..."

**Precise verbs make a real difference in how an achievement lands:**

"I led a team of five" is more precise and confident than "I worked
with a team of five" — precision, not exaggeration, is the goal.

**Numbers and specifics strengthen almost any professional
description:**

"I improved the process" → "I improved the process, reducing turnaround
time by about 20%."

**A genuinely important limit: precision should stay honest.** Using
a stronger verb than what actually happened ("led" when you were
genuinely just one contributor among equals) crosses from professional
register into overstatement, which can backfire if questioned further
in an interview.`,
    simpleHi: `**Everyday phrase → zyada precise, professional phrase:**

- "I helped with..." → "I contributed to..." / "I supported..."
- "I was in charge of..." → "I led..." / "I managed..." / "I
  oversaw..."
- "I did a lot of..." → "I was responsible for..."
- "I fixed a problem with..." → "I resolved an issue with..." / "I
  troubleshot..."
- "I made things better..." → "I improved..." / "I optimized..."

**Precise verbs ek real difference banate hain ki ek achievement kaise
land karta hai:**

"I led a team of five" zyada precise aur confident hai "I worked with
a team of five" se — precision, exaggeration nahi, goal hai.

**Numbers aur specifics almost kisi bhi professional description ko
strengthen karte hain:**

"I improved the process" → "I improved the process, reducing turnaround
time by about 20%."

**Ek genuinely important limit: precision honest rehni chahiye.** Ek
stronger verb use karna us se jo actually hua ("led" jab tum genuinely
sirf ek contributor the equals mein se), professional register se
overstatement mein cross ho jaata hai, jo backfire kar sakta hai agar
interview mein further poocha jaaye.`,

    content: `**Why professional register genuinely matters beyond just
"sounding fancy."**

The same underlying fact — you did something at work — can be
described with vague, casual verbs ("helped," "did stuff with") or
precise, specific ones ("coordinated," "implemented," "streamlined").
The precise version isn't inflating the truth; it's giving the listener
an accurate, specific picture of exactly what role you played, which
is genuinely more useful information for someone deciding whether to
hire or promote you.

**Specific verbs carry real information that vague ones don't.**
"Helped with the launch" could mean almost anything from making coffee
to leading the entire effort. "Coordinated the launch across three
teams" tells the listener something concrete and specific about the
actual scope of your role — the precision itself is the value, not
just the impressiveness.

**Adding a number or measurable detail, when genuinely available,
strengthens a description significantly** — "improved the process" is
vague, "reduced processing time by 20%" gives a concrete, verifiable
sense of scale. This doesn't need to be a large or dramatic number;
even a modest, honest figure is more convincing than no figure at all.

**The line between professional register and dishonest exaggeration is
real and worth respecting carefully.** Calling yourself the "lead" on
a project you merely contributed to, or claiming sole credit for a
team effort, crosses from precise language into misrepresentation —
and a good interviewer's follow-up questions will often reveal the gap
between the claim and the reality, which damages credibility far more
than a modestly phrased but accurate answer would have.`,
    contentHi: `**Professional register genuinely "sounding fancy" se aage kyun matter karta hai.**

Same underlying fact — tumne kaam pe kuch kiya — vague, casual verbs
("helped," "did stuff with") ya precise, specific wale ("coordinated,"
"implemented," "streamlined") se describe ho sakta hai. Precise version
truth ko inflate nahi kar raha; ye listener ko ek accurate, specific
picture de raha hai exactly tumne kaunsa role play kiya, jo genuinely
zyada useful information hai kisi ke liye jo decide kar raha hai
tumhe hire ya promote karna hai ya nahi.

**Specific verbs real information carry karte hain jo vague wale nahi
karte.** "Helped with the launch" almost kuch bhi mean kar sakta hai
coffee banane se leke poore effort ko lead karne tak. "Coordinated the
launch across three teams" listener ko kuch concrete aur specific
batata hai tumhare actual role ke scope ke baare mein — precision khud
value hai, sirf impressiveness nahi.

**Ek number ya measurable detail add karna, jab genuinely available
ho, ek description ko significantly strengthen karta hai** —
"improved the process" vague hai, "reduced processing time by 20%" ek
concrete, verifiable sense of scale deta hai. Ise bada ya dramatic
number hone ki zaroorat nahi; even ek modest, honest figure koi figure
na hone se zyada convincing hai.

**Professional register aur dishonest exaggeration ke beech line real
hai aur carefully respect karne layak hai.** Apne aap ko ek project ka
"lead" kehna jispe tumne merely contribute kiya, ya ek team effort ka
sole credit claim karna, precise language se misrepresentation mein
cross ho jaata hai — aur ek achhe interviewer ke follow-up questions
often claim aur reality ke beech gap reveal kar denge, jo credibility
ko ek modestly phrased par accurate answer se kahin zyada damage karta
hai.`,

    readingPassage: `Let me describe my last project more precisely. I coordinated communication between our design and engineering teams, and I implemented a new tracking system that reduced delays by about 15%. I also resolved several client concerns during the rollout. Overall, I contributed significantly to the project's success, though it was very much a team effort.`,
    readingPassageHi: `Main apna last project zyada precisely describe karta hoon. I coordinated communication between our design and engineering teams, and I implemented a new tracking system that reduced delays by about 15%. Maine rollout ke dauran kayi client concerns bhi resolve kiye. Overall, maine project ki success mein significantly contribute kiya, though ye bahut hi ek team effort tha.`,

    vocabulary: [
      {
        word: 'implement',
        wordHi: 'implement (lagoo karna)',
        meaning: 'to put a plan or system into action',
        meaningHi: 'ek plan ya system ko action mein rakhna',
        example: 'I implemented a new filing system.',
        exampleHi: 'I implemented a new filing system.',
        pronunciation: 'IM-pluh-ment',
      },
      {
        word: 'coordinate',
        wordHi: 'coordinate (samanvay karna)',
        meaning: 'to organize different people or parts so they work well together',
        meaningHi: 'different logon ya parts ko organize karna taaki wo achhe se saath kaam karein',
        example: 'I coordinated the schedule for three departments.',
        exampleHi: 'I coordinated the schedule for three departments.',
        pronunciation: 'koh-OR-di-neyt',
      },
      {
        word: 'streamline',
        wordHi: 'streamline (susangat/saral banana)',
        meaning: 'to make a process simpler and more efficient',
        meaningHi: 'ek process ko simpler aur zyada efficient banana',
        example: 'We streamlined the approval process.',
        exampleHi: 'We streamlined the approval process.',
        pronunciation: 'STREEM-lyn',
      },
      {
        word: 'contribute',
        wordHi: 'contribute (yogdaan dena)',
        meaning: 'to give a part of the effort toward a shared result',
        meaningHi: 'ek shared result ki taraf effort ka ek part dena',
        example: 'I contributed to the report by writing the analysis section.',
        exampleHi: 'I contributed to the report by writing the analysis section.',
        pronunciation: 'kuhn-TRIB-yoot',
      },
    ],

    examples: [
      {
        title: 'Everyday phrasing upgraded to professional register',
        titleHi: 'Everyday phrasing professional register mein upgrade',
        code: `Everyday: "I did a lot of work on the website and fixed some bugs."
Professional: "I led the redesign of the website and resolved several critical bugs before launch."`,
        output: 'The same true facts, described with precise, specific verbs.',
        explain:
          'Neither version invents anything — the professional version simply uses more precise words for the exact same real work, which paints a clearer picture for the listener.',
        explainHi:
          'Koi bhi version kuch invent nahi karta — professional version simply exact same real work ke liye zyada precise words use karta hai, jo listener ke liye ek clearer picture paint karta hai.',
      },
      {
        title: 'Adding a number to strengthen a description',
        titleHi: 'Ek description ko strengthen karne ke liye ek number add karna',
        code: `Vague: "I improved our customer response time."
Specific: "I improved our customer response time by about 30%, from two days to under 14 hours."`,
        output: 'A concrete, verifiable sense of scale replaces a vague claim.',
        explain:
          'Even an approximate number ("about 30%") is far more convincing and memorable than a vague claim with no measurable detail at all.',
        explainHi:
          'Even ek approximate number ("about 30%") ek vague claim se kahin zyada convincing aur memorable hai bina kisi measurable detail ke bilkul.',
      },
    ],

    mistakes: [
      {
        wrong: '"I led the project" when you were genuinely one of several equal contributors, with no leadership role',
        right: '"I was a key contributor to the project" or "I contributed significantly to the project."',
        why: 'Overstating your role crosses from professional register into inaccurate exaggeration — a good interviewer\'s follow-up questions can reveal the gap, damaging credibility more than an honest, precise answer would have.',
        whyHi: 'Apne role ko overstate karna professional register se inaccurate exaggeration mein cross ho jaata hai — ek achhe interviewer ke follow-up questions gap reveal kar sakte hain, credibility ko ek honest, precise answer se zyada damage karte hue.',
      },
      {
        wrong: 'Using only vague verbs throughout an entire professional description: "I did stuff with the team and things went well."',
        right: '"I coordinated with the team to implement the new process, and it went smoothly."',
        why: 'Vague verbs give the listener almost no real information about your specific role — precise verbs communicate exactly what you actually did.',
        whyHi: 'Vague verbs listener ko tumhare specific role ke baare mein almost koi real information nahi dete — precise verbs exactly communicate karte hain tumne actually kya kiya.',
      },
    ],

    realWorld: [
      {
        en: '**Resumes, LinkedIn profiles, and interview answers** all rely heavily on this exact skill — precise, honest verbs and specific numbers are what separate a memorable, credible professional description from a forgettable, vague one.',
        hi: '**Resumes, LinkedIn profiles, aur interview answers** sab heavily is exact skill pe rely karte hain — precise, honest verbs aur specific numbers wo hain jo ek memorable, credible professional description ko ek forgettable, vague wale se separate karte hain.',
      },
      {
        en: '**Performance review self-assessments** benefit enormously from precise, quantified language ("reduced errors by 15%") over vague self-praise ("I did a great job this year").',
        hi: '**Performance review self-assessments** enormously benefit hote hain precise, quantified language se ("reduced errors by 15%") vague self-praise ke upar ("I did a great job this year").',
      },
    ],

    interviewQA: [
      {
        q: 'What if I genuinely don\'t have exact numbers to describe my impact?',
        qHi: 'Agar mere paas genuinely exact numbers nahi hain mera impact describe karne ke liye?',
        a: 'An honest approximation ("roughly," "about," "a noticeable improvement in...") is far better than no detail at all, and is completely acceptable — precision doesn\'t require a perfectly exact figure, just genuine, thoughtful specificity.',
        aHi: 'Ek honest approximation ("roughly," "about," "a noticeable improvement in...") bina kisi detail ke se kahin behtar hai, aur completely acceptable hai — precision ko ek perfectly exact figure ki zaroorat nahi, sirf genuine, thoughtful specificity chahiye.',
      },
      {
        q: 'Is it dishonest to use a stronger, more professional-sounding verb than I would naturally use in casual conversation?',
        qHi: 'Kya ek stronger, zyada professional-sounding verb use karna dishonest hai jo main casually naturally use nahi karunga?',
        a: 'Not at all, as long as it accurately describes what you actually did — "coordinated" instead of "helped with" is more precise language, not dishonesty. The line is crossed only when the word claims a role, scope, or credit that didn\'t genuinely happen.',
        aHi: 'Bilkul nahi, jab tak ye accurately describe kare ki tumne actually kya kiya — "coordinated" ki jagah "helped with" zyada precise language hai, dishonesty nahi. Line sirf tab cross hoti hai jab word ek role, scope, ya credit claim karta hai jo genuinely nahi hua.',
      },
    ],

    exercises: [
      {
        task: 'Out loud, upgrade three everyday descriptions of your own work into more precise, professional phrasing.',
        taskHi: 'Zor se, apne khud ke kaam ki teen everyday descriptions ko zyada precise, professional phrasing mein upgrade karo.',
        hint: '"I helped with..." → "I contributed to..." "I did a lot of..." → "I was responsible for..."',
        hintHi: '"I helped with..." → "I contributed to..." "I did a lot of..." → "I was responsible for..."',
      },
      {
        task: 'Out loud, describe one real achievement of yours, adding a specific number or measurable detail if you genuinely have one, or an honest approximation if you don\'t.',
        taskHi: 'Zor se, apni ek real achievement describe karo, ek specific number ya measurable detail add karte hue agar tumhare paas genuinely ek hai, ya ek honest approximation agar nahi hai.',
        hint: '"I improved [something], reducing/increasing [measurable thing] by roughly [number]."',
        hintHi: '"I improved [something], reducing/increasing [measurable thing] by roughly [number]."',
      },
    ],

    keyTakeaways: [
      'Professional register describes the same honest facts with more precise verbs (coordinated, implemented, streamlined) instead of vague ones (helped, did stuff).',
      'Precise language gives real, specific information about your role — it isn\'t inflation, it\'s clarity.',
      'Adding a number or measurable detail, even an honest approximation, significantly strengthens a professional description.',
      'There is a real line between precise language and dishonest exaggeration — never claim a role, scope, or credit you didn\'t genuinely have.',
      'An honest, modestly phrased answer holds up far better under follow-up questions than an overstated one.',
    ],
    keyTakeawaysHi: [
      'Professional register same honest facts ko zyada precise verbs se describe karta hai (coordinated, implemented, streamlined) vague wale ke bajaye (helped, did stuff).',
      'Precise language tumhare role ke baare mein real, specific information deti hai — ye inflation nahi hai, ye clarity hai.',
      'Ek number ya measurable detail add karna, even ek honest approximation, ek professional description ko significantly strengthen karta hai.',
      'Precise language aur dishonest exaggeration ke beech ek real line hai — kabhi ek role, scope, ya credit claim mat karo jo tumhare paas genuinely nahi tha.',
      'Ek honest, modestly phrased answer follow-up questions ke neeche ek overstated wale se kahin behtar hold up karta hai.',
    ],
  },
];
