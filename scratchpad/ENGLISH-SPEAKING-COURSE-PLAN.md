# English Speaking — noob to pro, spoken-fluency training

20 modules / 60 lessons (3 lessons per module, this platform's settled
pacing). Every lesson carries the same sections as every other course
(analogy, simple explanation, deeper content, examples, mistakes,
real-world use, practice Q&A, exercises, key takeaways, bilingual
throughout) PLUS two fields unique to this course: a `readingPassage`
(EN + Hinglish) read aloud through a real interactive teleprompter, and a
`vocabulary` list of words introduced in that lesson.

Course record: slug `english-speaking-complete`, order `18`, DB `icon`
field (emoji) `🎤`, color `#0EA5E9` (sky blue — unused by any other
course; evokes voice/communication without colliding with GenAI's indigo,
Psychology's teal, or React Native's orange). Client-side card icon
(`client/src/pages/courses/courseIcons.tsx`): `Mic` from `lucide-react`.

Rationale for this course's existence: triggered directly by two user
messages — a request to build "the best english speaking course for
human mind training," and, immediately before that, a real critique of
the React Native course ("is it useful how can a noob can learn with
this if there is no visible things") that the user chose to set aside
("skip for now") rather than have retrofitted. This course is content +
new product surface, not verified-by-execution the way a programming
course is — see Verification approach below.

## The teleprompter (new engineering, not just content)

Built at `client/src/components/Teleprompter.tsx` +
`client/src/components/teleprompter.css`, embedded in
`TopicLesson.tsx`'s new "Read It Out Loud" section (renders only when a
lesson has `readingPassage`/`readingPassageHi`).

- Auto-scrolls the passage using `requestAnimationFrame`, computing a
  px/second rate from a **words-per-minute** control (60-220 wpm, default
  130) rather than an abstract "speed" — wpm is a unit a learner can
  reason about against their own real speaking pace.
- Play / pause, and a restart button (a finished passage swaps the play
  icon for ↻ and restarting resets scroll position to the top).
- A thin progress bar under the viewport tracks fraction scrolled.
- Top/bottom gradient fades on the scroll viewport, the standard
  teleprompter look, so text doesn't hard-clip at the edges.
- User's explicit, confirmed choice from this session's clarifying
  question: "Build a real interactive teleprompter feature
  (Recommended)" — i.e. genuine frontend engineering, not a static
  block of text with an instruction to read it aloud.

## Difficulty ramp (user's explicit choice: options 1 AND 3, combined)

Every module advances on three axes together, not just one:

1. **Vocabulary tier** — everyday/concrete words (Part I) → situational
   vocabulary for specific contexts (Part III, V) → opinion/emotion
   vocabulary (Part IV) → idiomatic and professional vocabulary
   (Part VI-VII).
2. **Sentence complexity** — single-clause present-tense statements
   (Part I) → past/future tense and questions (Part II) → connectors
   (because, so, but, although) and comparisons (Part III-IV) → complex
   subordinate clauses and reported speech (Part VI) → extended,
   multi-sentence persuasive/narrative discourse (Part VII).
3. **Structural/conversational fluency** — isolated phrases → short
   exchanges → small talk → storytelling with dialogue → debate and
   presentation-length spoken structure.

The reading passages embody this directly: each is a short first-person
narrative or dialogue using only the vocabulary and grammar introduced
up to that lesson, growing in length and structural complexity module by
module — never grammar the learner hasn't met yet.

## Module list

### Part I — Foundations (everyday basics, single-clause sentences)
1. **How English Sounds & Meeting People** — basic phonetics (why some
   sounds trip up a learner — TH, short vowels, word stress), greetings,
   and first introductions.
2. **Talking About Yourself** — name, country, job/study, simple present
   tense for facts about you.
3. **Family, Numbers, Time & Daily Routine** — simple present for habits
   and routines, telling time, counting.

### Part II — Building Real Sentences (past/future, questions)
4. **Talking About the Past** — regular/irregular past tense, telling
   what happened.
5. **Talking About the Future** — going to / will, plans and
   predictions.
6. **Asking Questions Naturally** — wh-questions, yes/no questions,
   natural question rhythm (not textbook-stiff word order panic).

### Part III — Everyday Communication (connectors, situational vocab)
7. **Requests, Offers & Suggestions** — could/can/would you, let's,
   why don't we.
8. **Describing People, Places & Things** — adjectives, comparisons,
   there is/are.
9. **Small Talk & Social Situations** — weather, weekend plans, casual
   chat structure.

### Part IV — Expressing Yourself (opinion/emotion vocab, reasons)
10. **Opinions — Agreeing & Disagreeing** — I think, in my opinion,
    polite disagreement.
11. **Feelings & Emotions** — naming emotions precisely, not just
    "good"/"bad."
12. **Comparing, Contrasting & Giving Reasons** — because/so, more...
    than, on the other hand.

### Part V — Real-World English (situational, semi-professional)
13. **Phone Calls, Emails & Messages** — spoken phone phrases vs.
    written register.
14. **Shopping, Travel & Directions** — transactional English, asking
    for and giving directions.
15. **Job Interviews & Professional English** — self-presentation,
    professional register, common interview questions.

### Part VI — Advanced Fluency (complex clauses, idiom, narrative)
16. **Complex Sentences** — because, although, if, since; joining ideas
    like a fluent speaker, not a list of short sentences.
17. **Reported Speech & Storytelling** — she said that..., narrating an
    event with dialogue.
18. **Idioms, Phrasal Verbs & Natural Rhythm** — sounding like a native
    speaker, not a textbook.

### Part VII — Mastery (rhetorical vocab, extended discourse)
19. **Debate, Persuasion & Presenting** — structuring an argument,
    presentation openings/closings.
20. **Confident Conversation — Capstone** — sustained natural
    conversation combining everything: opinions, stories, questions,
    idiom, under real conversational pressure (interruptions, changing
    topic, disagreement).

## Verification approach

This course is language-learning content, not executable code — the
"run it and confirm the output" verification model every prior course
used does not apply the same way. Verification here means:

- **Linguistic accuracy**: every example sentence, dialogue, and reading
  passage is genuinely natural, grammatically correct spoken English
  (not textbook-stiff), and Hinglish translations are genuinely accurate
  renderings, not machine-literal word swaps.
- **Grammar-gating**: a reading passage never uses a tense, connector, or
  structure the learner has not yet met in an earlier lesson — checked
  lesson by lesson as the course is written, module by module.
- **The teleprompter feature itself IS verified the standard way this
  project verifies UI**: built, then genuinely exercised in the Browser
  pane (play/pause, speed slider, scroll behavior, restart-on-finish)
  before being considered done — this is real engineering, not prose.

## Progress

- [x] Prisma schema: `readingPassage`, `readingPassageHi`, `vocabulary`
      added to `CourseTopic`, pushed to local DB, client regenerated.
- [x] `CourseLesson` interface + new `LessonVocabWord` interface
      (`course-js-module1.ts`).
- [x] Teleprompter component + CSS, wired into `TopicLesson.tsx`
      ("Read It Out Loud" + "Vocabulary" sections), client typecheck
      clean.
- [x] Course shell in seed.ts (`seedEnglishSpeakingCourse`, Course
      record order 18, all 20 module metadata records), course icon
      registered in `courseIcons.tsx` (`Mic`).
- [x] M1 How English Sounds & Meeting People — 3/3 lessons (sounds &
      pronunciation basics, greetings, first introductions). Reseeded
      locally, server + client build clean.
- [x] **Teleprompter genuinely verified live** (Browser pane, not just
      built): play/pause/resume/restart all confirmed via direct DOM
      measurement of scroll position over time at a controlled wpm —
      not just "it rendered." **Real, important finding along the way**:
      `requestAnimationFrame` genuinely never fires in this project's
      preview-browser tooling even though `document.hasFocus()` and
      `visibilityState` both report the tab as focused/visible — a
      30-frame rAF probe over 1 full second produced exactly 0 callbacks.
      `setInterval` at the same site fired exactly on schedule (20 ticks
      in 1000ms at a 50ms interval). Rewrote the component's scroll loop
      from rAF to a `setInterval` tick using real elapsed-time deltas
      (`Date.now()`), which then measured correctly proportional to wpm
      (e.g. ~1.26px in 300ms at 60wpm, matching the computed ~4.95px/s
      rate) and paused with zero drift while stopped. A real Chrome tab
      would very likely run rAF fine, but the fix is strictly better
      either way — a teleprompter has no need for 60fps precision, and
      an interval has no dependency on the compositor at all. **Second,
      separate gotcha hit during this same verification pass**: after
      renaming refs inside the component (`rafRef`→`intervalRef`,
      `lastTsRef`→`lastTickRef`), Vite's dependency pre-bundle cache
      (`node_modules/.vite`) went stale and threw
      `ReferenceError: lastTsRef is not defined` from its own cached
      chunk on every click — invisible until checking
      `read_console_messages`, and NOT fixed by a plain page reload;
      required stopping the dev server, deleting `node_modules/.vite`,
      and restarting. A brand-new tab (not just a reload of the old one)
      was also needed to clear a stale React Fast Refresh closure before
      clicks behaved correctly.
- [ ] M2 Talking About Yourself — not started
- [ ] M3-M20 — not started

## Local dev environment note (for resuming this course later)

`.claude/launch.json` now defines a `devprep-web` config (`npm run dev`
→ vite on 5173) for the Browser pane's `preview_start`. That config only
starts the **client**; the API server (port 4000) needs
`cd server && npm run dev` running separately — it is not part of the
root `npm run dev` concurrently command when launched through
`preview_start` from a non-root cwd. Check `docker ps` for
`devprep-postgres` before reseeding.
