# Psychology for Developers — noob to pro, production grade

20 modules / 60 lessons (3 lessons per module — the pacing this platform has
settled on for its recent courses), bilingual EN/Hinglish, JS/TS code examples
wherever a lesson's principle naturally produces a concrete implementation
(debounced choice architecture, accessible React patterns, A/B-test helpers) —
reusing the platform's existing JS/TS toggle. Lessons that are inherently
conceptual (a cognitive bias, a team-psychology finding) stay prose-heavy with
a still-real, runnable example wherever one exists, the same standard DevOps
and Databases used for their conceptual modules.

Course record: slug `psychology-for-developers`, icon `Brain` (lucide-react —
no single brand logo applies, same reasoning as Databases/DevOps/Gen AI),
color `#14B8A6` (teal, unused by any other course, calming/cognitive
association), `order: 15`.

Rationale for this course's existence: every other course on this platform
teaches how to build something correctly. This one teaches why the humans
using and building that software behave the way they do — the psychology
that actually determines whether a well-built feature gets adopted, whether
a form gets abandoned, whether a team ships reliably, and whether a design
choice is persuasive or manipulative. This is "for developers" specifically:
every module ties a real finding from cognitive/behavioral psychology
directly to a concrete engineering or product decision, not psychology as an
abstract science.

## Part I — Cognitive Foundations for Building Software
1. **How the Mind Actually Processes Information** — working memory limits
   (Miller's 7±2, the modern ~4-item revision), attention as a genuinely
   limited resource, cognitive load theory (intrinsic/extraneous/germane)
   and why it's the single most load-bearing concept for UI and API design.
2. **Perception & Visual Processing** — Gestalt principles (proximity,
   similarity, closure) as the actual mechanism behind "this UI feels
   organized," how eyes scan a screen (F-pattern/Z-pattern, eye-tracking
   findings), color perception and why it's inseparable from accessibility.
3. **Memory Systems & Learning** — short-term vs long-term memory, why
   recognition (menus) is easier than recall (command lines) and what that
   means for interface design, the forgetting curve and its direct
   implications for onboarding and documentation design.

## Part II — Decision-Making & Cognitive Biases
4. **Heuristics & Cognitive Biases That Shape User Behavior** — anchoring,
   loss aversion, default bias, confirmation bias — each demonstrated with a
   real product decision it explains.
5. **Cognitive Biases That Affect Developers & Teams** — the sunk cost
   fallacy in technical-debt decisions, confirmation bias while debugging,
   overconfidence in estimation (the planning fallacy).
6. **Decision Fatigue & Choice Architecture** — Hick's Law, the paradox of
   choice, concrete patterns for designing forms/settings/menus that respect
   genuinely limited decision-making capacity.

## Part III — Motivation & Behavior Design
7. **Motivation Psychology** — intrinsic vs extrinsic motivation
   (Self-Determination Theory: autonomy/competence/relatedness), why naive
   gamification (points/badges bolted on) reliably backfires.
8. **Habit Formation & Behavior Design** — habit loops (cue-routine-reward),
   the Hook Model, and the explicit line between ethical engagement design
   and manipulative dark-pattern engagement.
9. **Persuasion Principles & Dark Patterns** — Cialdini's principles of
   influence, where legitimate persuasive design ends and a dark pattern
   begins, the real legal/regulatory risk of crossing that line.

## Part IV — UX Psychology in Practice
10. **Cognitive Load in Interface Design** — reducing extraneous load,
    progressive disclosure, chunking — concrete, implementable patterns
    derived directly from Module 1's cognitive load theory.
11. **Error Psychology** — why users reflexively blame themselves for bad
    error messages, Norman's slips-vs-mistakes model, designing error states
    that actually help instead of shaming.
12. **Trust & First Impressions** — the aesthetic-usability effect, how a
    visitor's trust judgment forms in milliseconds, concrete trust signals
    in checkout/auth/payment flows specifically.

## Part V — Accessibility & Inclusive Cognition
13. **Cognitive Accessibility** — designing for ADHD, dyslexia, anxiety, and
    cognitive disabilities with concrete, implementable patterns, not just
    awareness.
14. **Designing for Stress & High-Stakes Contexts** — how cognition genuinely
    degrades under stress, and what that means for medical/financial/
    emergency interface design specifically.

## Part VI — Psychology of Engineering Teams
15. **Psychological Safety & High-Performing Teams** — Amy Edmondson's
    research, blameless postmortems, what actually makes code review
    feedback land instead of trigger defensiveness.
16. **Cognitive Biases in Code Review & Estimation** — the planning fallacy
    revisited at the team level, anchoring on story points, groupthink in
    architecture decisions.
17. **Burnout, Flow State & Sustainable Engineering** — Csikszentmihalyi's
    flow state, the real cost of context-switching, designing a team's
    actual workflow around cognitive sustainability rather than against it.

## Part VII — Applying This at Scale
18. **A/B Testing & Behavioral Data** — actually testing a psychological
    assumption instead of asserting it, statistical significance pitfalls
    specific to behavioral experiments.
19. **The Ethics of Behavioral Design** — informed consent, the persuasion/
    manipulation boundary revisited with teeth, the current regulatory
    landscape around dark patterns.
20. **Capstone — Auditing a Real Product Through a Psychology Lens** —
    assembling every module into one practical audit checklist, applied to
    a small real feature end to end.

## Verification approach

Where a lesson's principle produces genuinely runnable code (debounce/
throttle implementations, an A/B-test statistical helper, an accessible
React component pattern), that code is real and offline-executable, same
standard as this platform's other courses. Purely conceptual findings (a
cognitive bias, a team-psychology result) are precise, clearly-sourced prose
— the same treatment DevOps gave its cloud-fundamentals and observability
modules.

## Progress

- [x] Course shell in seed.ts (`seedPsychologyCourse`, Course record) — commit `51f310d`
- [x] M1 How the Mind Actually Processes Information — 3/3 lessons, commit `51f310d`
- [ ] M2 Perception & Visual Processing
- [ ] M3 Memory Systems & Learning
- [ ] M4 Heuristics & Cognitive Biases That Shape User Behavior
- [ ] M5 Cognitive Biases That Affect Developers & Teams
- [ ] M6 Decision Fatigue & Choice Architecture
- [ ] M7 Motivation Psychology
- [ ] M8 Habit Formation & Behavior Design
- [ ] M9 Persuasion Principles & Dark Patterns
- [ ] M10 Cognitive Load in Interface Design
- [ ] M11 Error Psychology
- [ ] M12 Trust & First Impressions
- [ ] M13 Cognitive Accessibility
- [ ] M14 Designing for Stress & High-Stakes Contexts
- [ ] M15 Psychological Safety & High-Performing Teams
- [ ] M16 Cognitive Biases in Code Review & Estimation
- [ ] M17 Burnout, Flow State & Sustainable Engineering
- [ ] M18 A/B Testing & Behavioral Data
- [ ] M19 The Ethics of Behavioral Design
- [ ] M20 Capstone — Auditing a Real Product Through a Psychology Lens
