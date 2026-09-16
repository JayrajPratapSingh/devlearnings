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
- [x] M2 Talking About Yourself — 3/3 lessons (where you're from, job/
      study & the missing article, a full self-introduction). Reseeded
      locally, API-verified, server + client build clean.
- [x] M3 Family, Numbers, Time & Daily Routine — 3/3 lessons (family &
      the possessive 's, numbers/telling time & the teen/ty stress
      pair, daily routine & simple-present-for-habits vs. continuous-
      tense overuse). **Part I (Foundations) now COMPLETE.** Reseeded
      locally, API-verified, server + client build clean.
- [x] M4 Talking About the Past — 3/3 lessons (regular past tense &
      its three "-ed" sounds, irregular past tense's ten most frequent
      verbs, telling a short story without drifting back to present
      tense). **Part II (Building Real Sentences) begins.** Reseeded
      locally, API-verified, server + client build clean.
- [x] M5 Talking About the Future — 3/3 lessons ("going to" for
      pre-made plans, "will" for predictions/offers/in-the-moment
      decisions, present continuous for fixed arrangements).
- [x] M6 Asking Questions Naturally — 3/3 lessons (yes/no questions
      and the missing do/does/did, wh-questions and the inversion that
      still applies underneath them, softer/politer question framings).
      **Part II (Building Real Sentences) now COMPLETE.** Reseeded
      locally, API-verified, server + client build clean.
- [x] M7 Requests, Offers & Suggestions — 3/3 lessons (could/can/would
      you for requests, shall I/would you like for offers, let's/why
      don't we/how about for suggestions). **Part III begins.**
- [x] M8 Describing People, Places & Things — 3/3 lessons (adjective
      order — a real rule native speakers never consciously learned,
      there is/there are and the singular/plural agreement trap,
      comparisons with -er/more and the irregular good/bad set).
- [x] M9 Small Talk & Social Situations — 3/3 lessons (what small talk
      actually is and isn't, weather/weekend universal openers, the
      "share something back" reflex that keeps a conversation alive).
      **Part III (Everyday Communication) now COMPLETE — 27/60
      lessons.** Reseeded locally, API-verified, server + real client
      `npm run build` both clean.
- [x] M10 Opinions — Agreeing & Disagreeing — 3/3 lessons (I think/in my
      opinion/I feel like, agreeing beyond a flat "yes", disagreeing
      politely by attacking the idea not the person). **Part IV
      begins.**
- [x] M11 Feelings & Emotions — 3/3 lessons (specific emotion words
      beyond good/bad, I feel vs. I am plus the bored/boring -ed/-ing
      trap, empathy — acknowledging a feeling before responding to it).
- [x] M12 Comparing, Contrasting & Giving Reasons — 3/3 lessons
      (because/so and their fixed directions, but/although/however
      across three registers, combining connectors into fluent
      multi-clause sentences). **Part IV (Expressing Yourself) now
      COMPLETE — 36/60 lessons.** Reseeded locally, API-verified,
      server + real client `npm run build` both clean.
- [x] M13 Phone Calls, Emails & Messages — 3/3 lessons (phone-specific
      phrases like "speaking"/"you're breaking up", email's written
      register and structure, texting's relaxed register and where
      abbreviations don't belong). **Part V begins.**
- [x] M14 Shopping, Travel & Directions — 3/3 lessons ("just browsing"
      and shop vocabulary, directions and the prepositions that carry
      the real meaning, airport/hotel/taxi travel phrases).
- [x] M15 Job Interviews & Professional English — 3/3 lessons ("tell me
      about yourself" via present-past-future, the STAR method for
      behavioral questions, professional register — precise verbs vs.
      vague ones, kept honest). **Part V (Real-World English) now
      COMPLETE — 45/60 lessons, 3/4 of the whole course.** Reseeded
      locally, API-verified, server + real client `npm run build` both
      clean.
- [x] M16 Complex Sentences — 3/3 lessons (if — real vs. unreal
      conditionals with the "were" exception, since's two unrelated
      jobs, relative clauses who/which/that). **Part VI begins.**
- [x] M17 Reported Speech & Storytelling — 3/3 lessons (the tense-shift
      rule and why it happens, reporting questions/requests by reusing
      Module 6's embedded-question skill, narrating a full story with
      dialogue by combining M3+M4+this module).
- [x] M18 Idioms, Phrasal Verbs & Natural Rhythm — 3/3 lessons (phrasal
      verbs as new-meaning compounds, fixed-form idioms, gonna/wanna/
      gotta as the concrete evidence of Module 1's stress-timed rhythm
      rule). **Part VI (Advanced Fluency) now COMPLETE — 54/60
      lessons.** Reseeded locally, API-verified, server + real client
      `npm run build` both clean.
- [ ] M19-M20 — not started (Part VII, the FINAL part: Debate/
      Persuasion/Presenting, then Confident Conversation — the
      capstone that closes the whole course)

## Pronunciation playback feature (added after M9, mid-M12)

Jay asked, after seeing a mistake example like `wrong: '"dis" instead
of "this"'`, whether audio could be generated so the difference is
actually audible, not just implied by respelling. Built
`client/src/components/SpeakButton.tsx` using the browser's native
**Web Speech API** (`speechSynthesis` + `SpeechSynthesisUtterance`) —
zero backend, zero audio files, zero cost. Wired into:
- Every vocabulary card (word + example sentence get their own 🔊).
- The Common Mistakes section's wrong/right text, gated behind
  `isLanguageLesson = !!topic.vocabulary?.length` so it never appears
  next to a code snippet on a programming course's mistake block —
  confirmed 0 buttons on a JS course lesson vs. 14 on an English
  lesson (5 vocab words × 2 + 2 mistakes × 2).

This genuinely demonstrates the target contrast for free: `"dis" and
"dat" instead of "this" and "that"` read aloud by TTS pronounces "dis"
exactly as spelled (approximating the real mispronunciation) right next
to a correctly-pronounced "this" — no need for real contrastive audio
recording. Verified live: intercepted `speechSynthesis.speak()` calls
and confirmed the exact text, `en-US` lang, and rate (0.9 vocab / 0.85
mistakes) reaching the API on click, zero console errors.

## Bug found and fixed while building M5/M6

While running the client's real `npm run build` (not just `tsc
--noEmit`, which missed it) before this push, caught a genuine leftover
bug in `Teleprompter.tsx`: `handleReset()` still referenced the OLD ref
name `lastTsRef` from before the rAF→setInterval rewrite (see the
"Two real findings" entry above) — `tsc --noEmit` alone did not catch
this even though `tsc -b` (the project's real build, via `npm run
build`) did. This means the reset button was silently throwing a
`ReferenceError` on every click since that rewrite, which explains the
confusing, inconsistent reset-button test results from the original
verification pass. Fixed (`lastTsRef` → `lastTickRef`) and **specifically
re-verified the reset button** in a clean browser tab: play → 300ms →
reset correctly returns `translateY(0px)` with zero console errors.
**Lesson for this project going forward: `tsc --noEmit` run ad hoc
against a single file or an isolated invocation is not a reliable
substitute for the project's own `npm run build` — always run the real
build command before considering a client change verified.**

## Local dev environment note (for resuming this course later)

`.claude/launch.json` now defines a `devprep-web` config (`npm run dev`
→ vite on 5173) for the Browser pane's `preview_start`. That config only
starts the **client**; the API server (port 4000) needs
`cd server && npm run dev` running separately — it is not part of the
root `npm run dev` concurrently command when launched through
`preview_start` from a non-root cwd. Check `docker ps` for
`devprep-postgres` before reseeding.
