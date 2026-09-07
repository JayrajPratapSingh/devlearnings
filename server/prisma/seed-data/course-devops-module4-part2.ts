/**
 * DevOps Complete Course — Module 4: Version Control & Trunk-Based Delivery, lessons 4-6.
 *
 * Lesson 4: Pull requests, code review & protected branches — what review is for,
 *           small PRs, branch protection rules, CODEOWNERS, merge methods. PROSE.
 * Lesson 5: Conventional commits, semantic versioning, tags & releases — message
 *           discipline, SemVer, annotated vs lightweight tags, changelogs, release
 *           automation. VERIFIED against a real git (tags, describe, version bump).
 * Lesson 6: Monorepo vs polyrepo, git hooks & git as the source of truth —
 *           trade-offs, tooling, hook types, the pre-commit framework, GitOps's
 *           reliance on git. Hook demo VERIFIED; the rest prose.
 */

import type { CourseLesson } from './course-js-module1';

export const DEVOPS_MODULE_4_PART2: CourseLesson[] = [
  {
    slug: 'ops-pull-requests-code-review-and-protected-branches',
    title: 'Pull Requests, Code Review & Protected Branches',
    titleHi: 'Pull Requests, Code Review Aur Protected Branches',
    description: 'A pull request is a gate: a proposed change plus the automated checks and human review it must pass before it joins the mainline. Branch protection turns the informal norms — "run the tests", "get a review", "do not force-push main" — into rules the platform enforces for everyone, every time.',
    descriptionHi: 'Ek pull request ek gate hai: ek proposed change plus automated checks aur human review jo ise mainline mein join karने se pehle pass karना chahiye. Branch protection informal norms ko — "tests chalाओ", "ek review lो", "main ko force-push mat karो" — un rules mein badalता hai jo platform sabke liye, har baar enforce karता hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 4,

    analogy: {
      en: '**A change entering a building through a security checkpoint instead of an unlocked side door.** The checkpoint has two parts: an automatic scanner every item passes through (the CI checks — tests, lint, build, type-check, security scan) and a guard who looks at what the scanner cannot judge (the reviewer — is this the right design, is it readable, does it fit the system, what did the author not think of). Branch protection is the rule that the side door is welded shut: nobody, however senior or however urgent, gets into the mainline except through the checkpoint. The smaller the bag you bring, the faster the guard can actually check it — which is why a 40-line change gets a real review and a 2,000-line one gets waved through.',
      hi: '**Ek change ek building mein ek security checkpoint ke through ghusता hai ek unlocked side door ke bजaay.** Checkpoint ke do parts hain: ek automatic scanner jismें se har item guzarता hai (CI checks — tests, lint, build, type-check, security scan) aur ek guard jo dekhता hai jo scanner judge nahi kar sakта (reviewer — kya ye sahi design hai, kya ye readable hai, kya ye system mein fit hoता hai, author ne kya nahi socha). Branch protection wo rule hai ki side door weld ho gaya hai: koi bhi, chahे kitna senior ya kitna urgent, mainline mein nahi ghusता checkpoint ke bina. Jitna chhoटा bag aap laते ho, guard utni actually check kar sakта hai — isliye ek 40-line change ek real review paता hai aur ek 2,000-line ek wave through.',
    },

    simple: `**A PULL REQUEST (a.k.a. merge request) bundles:**
\`\`\`
- a branch of proposed commits, targeting a base branch (usually main)
- a description: what + why + how to test + screenshots / links to the issue
- automated CHECKS (CI): tests, lint, type-check, build, security scan, coverage
- human REVIEW: one or more approvals from people other than the author
- a discussion thread anchored to specific lines
\`\`\`

**WHAT REVIEW IS FOR (and NOT for):**
\`\`\`
FOR:   correctness the tests miss · design fit · readability / naming · edge cases the
       author didn't consider · security & data concerns · knowledge sharing · "is there
       a simpler way" · does the PR match its stated intent
NOT FOR: style a linter/formatter should enforce · re-running what CI already checked ·
       rewriting it the way you'd have done it · gatekeeping for its own sake
\`\`\`

**SMALL PRs. The single biggest lever on review quality.**
\`\`\`
< ~200-400 lines changed  -> a real, careful review in one sitting; fast turnaround
> ~1000 lines             -> "LGTM" rubber stamp; defects sail through; sits for days
huge PR? -> split it: refactor-only PR, then behaviour PR. stacked PRs. feature flags.
\`\`\`

**BRANCH PROTECTION (rules the platform enforces on main / release branches):**
\`\`\`
- require a PR — NO direct pushes to main
- require STATUS CHECKS to pass (name the exact CI jobs; "up to date with base" optional)
- require N approving reviews; dismiss stale approvals on new commits
- require review from CODEOWNERS for the touched paths
- require conversations resolved
- require linear history (no merge commits) — or not, your call
- restrict who can push / who can merge
- NO force-push, NO branch deletion
- (often) apply the rules to admins too — "include administrators"
- signed commits / signed tags (higher-security repos)
\`\`\`

**CODEOWNERS:** a file mapping path globs -> teams/people who must review changes there.
\`/payments/  @org/payments-team\` · \`*.tf  @org/platform\`. Auto-requests them; can be required.

**MERGE METHOD (set per repo):**
\`\`\`
MERGE COMMIT     keeps all branch commits + a merge node. non-linear.
SQUASH           one commit per PR on main. linear, clean, easy revert/bisect. most common.
REBASE & MERGE   branch commits replayed onto main, linear, hashes change.
\`\`\`
Pick one; enforce it; make the PR title/description the squash commit message.

**AUTO-MERGE:** queue the PR to merge itself the moment checks pass + approvals are in.
**MERGE QUEUE:** serializes merges, re-running CI on the *combined* result so main never
goes red from two individually-green PRs that conflict semantically.`,

    simpleHi: `**Ek PULL REQUEST bundle karता hai:**
\`\`\`
- ek base branch (usually main) ko target karता proposed commits ka ek branch
- ek description: kya + kyun + kaise test karें + screenshots / issue ke links
- automated CHECKS (CI): tests, lint, type-check, build, security scan, coverage
- human REVIEW: author ke alawa logon se ek ya zyada approvals
- ek discussion thread specific lines par anchored
\`\`\`

**REVIEW KIS LIYE HAI (aur KIS LIYE NAHI):**
\`\`\`
FOR:   correctness jo tests miss karте hain · design fit · readability / naming · edge cases
       jo author ne nahi socha · security & data concerns · knowledge sharing · "kya ek simpler way hai"
NOT FOR: style jo ek linter/formatter enforce karे · CI jo already check karता hai wo re-run karना ·
       ise us tarah rewrite karना jaise aap karते · apne khatir gatekeeping
\`\`\`

**SMALL PRs. Review quality par single biggest lever.**
\`\`\`
< ~200-400 lines changed  -> ek real, careful review ek baithक mein; fast turnaround
> ~1000 lines             -> "LGTM" rubber stamp; defects sail through
huge PR? -> split karो: refactor-only PR, phir behaviour PR. stacked PRs. feature flags.
\`\`\`

**BRANCH PROTECTION (rules jo platform main / release branches par enforce karता hai):**
\`\`\`
- ek PR require karो — main ko KOI direct pushes nahi
- STATUS CHECKS pass honा require karो (exact CI jobs name karो)
- N approving reviews require karो; naye commits par stale approvals dismiss karो
- touched paths ke liye CODEOWNERS se review require karो
- conversations resolved require karो
- linear history require karो — ya nahi, aapki call
- KOI force-push nahi, KOI branch deletion nahi
- (aksar) rules admins par bhi apply karो
- signed commits / signed tags (higher-security repos)
\`\`\`

**CODEOWNERS:** ek file jo path globs -> teams/people jo wahaan changes review karें map karती hai.
\`/payments/  @org/payments-team\`. Auto-request karता hai; required ho sakта hai.

**MERGE METHOD:** MERGE COMMIT (saare branch commits + ek merge node) · SQUASH (per PR ek commit,
linear, most common) · REBASE & MERGE (replayed, linear, hashes change). Ek pick karो; enforce karो.

**AUTO-MERGE:** PR ko queue karो jaise hi checks pass + approvals aa jाते hain khud merge karे.
**MERGE QUEUE:** merges serialize karता hai, *combined* result par CI re-run karके taki main kabhi
do individually-green PRs se red na jाए jo semantically conflict karते hain.`,

    content: `## What a pull request is

A **pull request** (GitHub, Azure DevOps) or **merge request** (GitLab) is a proposal to merge a branch into a base branch, wrapped in the process that must complete first:

- the **diff** — the commits being proposed;
- a **description** — what changed, why, how to verify, links to the issue or design;
- **automated checks** — the CI pipeline runs against the branch (or the branch merged with the base): tests, linting, type-checking, build, security and dependency scans, coverage thresholds;
- **human review** — one or more approvals from people who are not the author;
- a **conversation** — comments anchored to specific lines and to the PR as a whole.

The PR is where the branching model, CI, and review meet. It is also the unit of change for the changelog, for reverts, and often for deployment.

## What code review is for

Review is worth doing for the things a machine cannot check:

- **Correctness the tests miss** — a case the author did not test, an off-by-one, a race, a missing null path.
- **Design fit** — does this belong here, does it follow the patterns the codebase already uses, is it introducing a second way to do something that already has one.
- **Readability** — will the next person understand this; are the names right; is the control flow clear.
- **Edge cases and failure modes** — what happens on empty input, on a timeout, on a partial failure, at scale.
- **Security and data** — injection, authz checks, PII handling, secrets, log hygiene.
- **Simplicity** — is there a smaller solution; can something be deleted instead of added.
- **Intent match** — does the diff do what the description says, and only that.
- **Knowledge sharing** — the reviewer learns this area exists and how it works.

Review is **not** for: style a formatter should normalise (run the formatter in CI and stop discussing it); re-verifying what CI already checked; rewriting the change into the reviewer's preferred style when the author's is fine; or blocking to demonstrate diligence. A review that only ever produces nitpicks is training authors to ignore reviews.

## Small pull requests

The size of a PR is the biggest single factor in how good its review is. A change under a few hundred lines can be reviewed carefully in one sitting, gets a fast response, and produces specific, useful comments. A change over a thousand lines gets a cursory pass and an approval, because a thorough review would take hours the reviewer does not have; defects pass through, and the PR often sits for days waiting for someone to find the time.

When a change is unavoidably large, split it:

- a **pure refactor** PR (no behaviour change, easy to review by confirming behaviour is unchanged), then a **behaviour** PR on top;
- **stacked PRs** — a chain of small PRs each based on the previous, reviewed and merged in order;
- merge the scaffolding **behind a feature flag** first, then the feature in small pieces (Lesson 3).

## Branch protection

Branch protection makes the platform enforce, for a branch, the rules that would otherwise be conventions people occasionally skip. Typical rules for \`main\` and release branches:

- **Require a pull request** — direct pushes to the branch are rejected; every change goes through a PR.
- **Require status checks to pass** — name the specific CI jobs (e.g. \`test\`, \`lint\`, \`build\`) that must be green. Optionally require the branch to be **up to date with the base** before merging, so checks ran against the latest base (at the cost of more rebasing; a merge queue solves this better).
- **Require approvals** — at least N reviewers must approve. **Dismiss stale approvals** when new commits are pushed, so an approval always reflects the current diff.
- **Require review from Code Owners** — if the PR touches a path with an owner, an owner must approve.
- **Require conversation resolution** — all review threads must be resolved before merge.
- **Require linear history** — disallow merge commits (forces squash or rebase). Optional.
- **Require signed commits** — every commit must carry a valid signature. Higher-security repos.
- **Restrict who can push / merge** — limit to certain teams.
- **Block force-pushes and deletions** — the branch cannot be rewritten or removed.
- **Include administrators** — the rules apply to admins too, not just everyone else. Recommended; the point of the rules is undermined if the people most able to cause damage are exempt.

## CODEOWNERS

A \`CODEOWNERS\` file maps path patterns to the teams or people responsible for reviewing changes there:

\`\`\`
# path pattern            owner(s)
*                         @org/maintainers
/services/payments/       @org/payments-team
/infra/                    @org/platform
*.tf                      @org/platform
/docs/                     @org/docs-team @alice
\`\`\`

When a PR touches a matching path, the owners are automatically requested for review, and if branch protection requires Code Owner review, an approval from one of them is mandatory to merge. It is how a large repo ensures the people who understand a subsystem see every change to it, without everyone having to watch everything.

## Merge method

Set one merge method for the repo and enforce it (Lesson 2 covered the history shapes):

- **Merge commit** — preserves branch commits and topology; non-linear history.
- **Squash** — one commit per PR on the base branch; linear, clean, one revert per feature, easy \`git bisect\`. The most common choice; configure the PR title and description to become the commit message.
- **Rebase and merge** — branch commits replayed onto the base; linear, individual commits kept, hashes change.

## Auto-merge and merge queues

- **Auto-merge** — mark a PR to merge itself automatically the moment all required checks pass and all required approvals are in. Removes the "checks went green while I was at lunch, now I have to come back and click merge" delay.
- **Merge queue** — when many PRs merge per day, two PRs that are each green against the current \`main\` can break \`main\` when combined (a semantic conflict the diffs did not show). A merge queue serialises merges: it takes PRs in order, builds the prospective combined result, runs CI on *that*, and only merges if it passes — so \`main\` stays green even under high merge throughput. Essential for large trunk-based teams.`,

    contentHi: `## Ek pull request kya hai

Ek **pull request** ya **merge request** ek branch ko ek base branch mein merge karने ka ek proposal hai, us process mein wrapped jo pehle complete honा chahiye: **diff** (proposed commits); ek **description** (kya badla, kyun, kaise verify karें); **automated checks** (CI pipeline — tests, linting, type-checking, build, security scans, coverage); **human review** (author ke alawa logon se ek ya zyada approvals); ek **conversation** (specific lines par anchored comments).

## Code review kis liye hai

Review un cheezों ke liye worth hai jo ek machine check nahi kar sakती: **correctness jo tests miss karते hain**; **design fit**; **readability**; **edge cases aur failure modes**; **security aur data**; **simplicity** (kya ek smaller solution hai); **intent match** (kya diff wo karता hai jo description kehти hai); **knowledge sharing**.

Review **nahi** hai: style ke liye jo ek formatter normalise karे; CI jo already check karता hai wo re-verify karने ke liye; change ko reviewer ki preferred style mein rewrite karने ke liye; ya diligence demonstrate karने ke liye block karने ke liye.

## Small pull requests

Ek PR ka size iski review kitni achhी hai iska sabse baड़ा single factor hai. Ek few hundred lines se kम ka change ek baithक mein carefully review ho sakта hai. Ek thousand lines se zyada ka change ek cursory pass aur ek approval paता hai; defects pass through.

Jab ek change unavoidably large hai, ise split karो: ek **pure refactor** PR, phir ek **behaviour** PR; **stacked PRs**; scaffolding ko pehle **ek feature flag ke peeche** merge karो.

## Branch protection

Branch protection platform ko un rules ko enforce karवाता hai jo warna conventions hote. \`main\` ke liye typical rules: **ek pull request require karो** (koi direct pushes nahi); **status checks pass honा require karो** (specific CI jobs name karो); **approvals require karो** (kम se kम N reviewers; naye commits par **stale approvals dismiss karो**); **Code Owners se review require karो**; **conversation resolution require karो**; **linear history require karो** (optional); **signed commits require karो**; **force-pushes aur deletions block karो**; **administrators include karो** (rules admins par bhi apply hote hain).

## CODEOWNERS

Ek \`CODEOWNERS\` file path patterns ko un teams ya people par map karती hai jo wahaan changes review karने ke liye responsible hain. Jab ek PR ek matching path touch karता hai, owners automatically review ke liye requested hote hain.

## Merge method

Repo ke liye ek merge method set karो aur enforce karो: **Merge commit** (branch commits aur topology preserve karता hai); **Squash** (per PR base branch par ek commit; linear, most common choice); **Rebase and merge** (replayed, linear, hashes change).

## Auto-merge aur merge queues

- **Auto-merge** — ek PR ko mark karो khud automatically merge karने ke liye jaise hi saare required checks pass aur approvals aa jाते hain.
- **Merge queue** — jab din mein bahut se PRs merge hote hain, do PRs jo har ek current \`main\` ke against green hain combined hone par \`main\` toड़ sakते hain. Ek merge queue merges serialise karता hai: ye PRs ko order mein leता hai, prospective combined result build karता hai, *us* par CI chalाता hai, aur sirf tab merge karता hai agar ye pass hoता hai.`,

    examples: [
      {
        title: 'A branch protection ruleset for main (GitHub-style)',
        titleHi: 'Main ke liye ek branch protection ruleset',
        code: `# .github/rulesets or the branch-protection UI, expressed as intent:

branch: main
rules:
  require_pull_request:
    required_approving_reviews: 1
    dismiss_stale_reviews: true          # new commit -> prior approvals cleared
    require_code_owner_review: true      # if a CODEOWNERS path is touched
    require_last_push_approval: true     # the person who pushed last can't self-approve it
  require_status_checks:
    strict: false                        # not forcing "up to date with base" (merge queue handles it)
    checks: [ "test", "lint", "typecheck", "build" ]   # exact job names, all must pass
  require_conversation_resolution: true
  require_linear_history: true           # squash or rebase merges only
  block_force_pushes: true
  block_deletions: true
  enforce_admins: true                   # the rules apply to admins too

# CODEOWNERS (repo root or .github/):
#   *                      @org/maintainers
#   /services/payments/    @org/payments-team
#   /infra/                @org/platform
#   *.tf                   @org/platform`,
        output: `This ruleset means: no commit reaches main except via a PR that has passed the four named CI jobs, has at least one approving review from someone other than the last pusher, has a Code Owner approval if an owned path was touched, has all review threads resolved, and produces linear history. main cannot be force-pushed or deleted, and admins are not exempt.`,
        explain: 'Each rule closes a specific gap between the informal norm and what actually happens under pressure. Requiring a pull request removes the ability to push straight to the mainline, so every change is visible and gated. Naming the exact status checks means a merge is blocked until those specific jobs are green, not merely until CI has "mostly" run. Dismissing stale reviews ensures an approval always corresponds to the code as it is now, not as it was three commits ago; requiring last-push approval stops someone approving their own final change. Requiring Code Owner review routes changes in sensitive areas to the people who own them. Requiring conversation resolution prevents merging over unaddressed review comments. Linear history keeps the mainline a simple sequence, which makes bisecting and reverting straightforward. Blocking force-pushes and deletions makes the mainline\'s history immutable and the branch itself permanent. Enforcing the rules on admins is the one that people most often skip and most need: an exemption for the most privileged users is an exemption for exactly the accounts whose mistakes or compromise would be most damaging.',
        explainHi: 'Har rule informal norm aur jo actually pressure ke under hoता hai ke beech ek specific gap band karता hai. Ek pull request require karना mainline ko seedha push karने ki ability remove karता hai. Exact status checks name karना matlab ek merge tab tak blocked hai jab tak wo specific jobs green nahi. Stale reviews dismiss karना ensure karता hai ki ek approval hamesha code ko as it is now correspond karता hai. Code Owner review require karना sensitive areas mein changes ko un logon tak route karता hai jo unhe own karते hain. Conversation resolution require karना unaddressed review comments ke over merge karने se rokता hai. Linear history mainline ko ek simple sequence rakhती hai. Force-pushes aur deletions block karना mainline ki history ko immutable banаता hai. Rules ko admins par enforce karना wo hai jise log sabse aksar skip karते hain aur sabse zyada need karте hain.',
      },
      {
        title: 'Splitting a 1,400-line PR into reviewable pieces',
        titleHi: 'Ek 1,400-line PR ko reviewable pieces mein split karna',
        code: `# THE PROBLEM PR:
#   "Migrate the reporting module from the old query builder to the new one"
#   47 files, +1,400 / -900. reviewer opens it, scrolls for 2 minutes, writes "LGTM".
#   -> a real review is impossible; whatever's wrong ships.

# SPLIT INTO A STACK (each PR based on the previous, reviewed + merged in order):

# PR 1  "reporting: introduce QueryPort interface + adapt old builder to it"
#       +180 / -60. NO behaviour change. reviewer verifies: same queries produced.
# PR 2  "reporting: add NewBuilder adapter behind QueryPort (not wired)"
#       +240 / -10. new code, unreachable. reviewer checks it in isolation.
# PR 3  "reporting: move the daily-summary report to NewBuilder (flag: reporting-newqb)"
#       +90 / -70. ONE report switched, behind a flag, off by default.
# PR 4-8  one report each, same shape. flip the flag per report after prod metrics look good.
# PR 9  "reporting: remove old query builder + QueryPort (all reports migrated)"
#       +40 / -520. pure deletion. reviewer confirms nothing else imports it.

# each PR: < 300 lines, reviewable in one sitting, individually revertable,
# and main is releasable after every merge.`,
        output: `The monolithic PR that would get rubber-stamped becomes a stack of nine small PRs, each under ~300 lines and each reviewable in one sitting: first a no-op refactor introducing a seam, then the new implementation in isolation, then one report at a time switched behind a flag, then a pure-deletion cleanup. Every merge leaves main releasable, and any single step can be reverted alone.`,
        explain: 'A single very large pull request cannot be reviewed properly because the effort required exceeds what a reviewer can give in a normal working context, so it receives a superficial pass and an approval regardless of what it contains. Splitting it into a sequence of small pull requests, each building on the last, makes each one reviewable in a single focused sitting and makes the review comments specific and actionable. The particular split here follows the branch-by-abstraction shape from Lesson three: the first change introduces an interface in front of the thing being replaced and adapts the existing implementation to it, with no behavioural change, which the reviewer can verify by confirming the same output is produced. The next adds the new implementation behind the same interface but not yet used, so it can be examined on its own. Then each consumer is moved to the new implementation one at a time, behind a feature flag so the switch is controlled and reversible, and the flag is flipped per consumer only after production metrics confirm the new path is sound. The final change is a pure deletion of the now-unused old code. Every merge in the sequence leaves the mainline in a releasable state, and any individual step can be reverted without touching the others.',
        explainHi: 'Ek single bahut baड़ा pull request properly review nahi ho sakта kyunki required effort us se zyada hai jo ek reviewer ek normal working context mein de sakта hai, to ye ek superficial pass aur ek approval paता hai chahे ismें kुछ bhi ho. Ise small pull requests ke ek sequence mein split karना, har ek pichle par building, har ek ko ek single focused baithक mein reviewable banаता hai. Yahaan particular split Lesson teen ke branch-by-abstraction shape follow karता hai: pehla change ek interface introduce karता hai, koi behavioural change nahi. Agla naya implementation add karता hai same interface ke peeche par abhi use nahi kiya. Phir har consumer ek-ek karके naye implementation par move hoता hai, ek feature flag ke peeche. Final change ab-unused purane code ka ek pure deletion hai. Sequence mein har merge mainline ko ek releasable state mein chhoड़ता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# a review culture that's all nitpicks and no substance
# comments on a 300-line auth change:
#   "nit: single quotes here"      (a formatter should do this)
#   "nit: trailing comma"           (a formatter should do this)
#   "prefer const over let L44"     (a lint rule should do this)
# NOT commented on: the change checks the role AFTER doing the DB write.
# -> author learns "reviews = style noise", starts ignoring them. real bugs ship.`,
        right: `# automate the mechanical stuff so review can be about what matters:
#   - a FORMATTER (prettier/black/gofmt) in CI + a pre-commit hook — zero style debate
#   - a LINTER for the const/let/unused-var class of thing
#   - then human review focuses on: is the authz check in the right place? what
//      happens on a partial failure? is this the simplest design? edge cases?
# a review comment should mostly be something a machine COULDN'T have caught.`,
        why: 'Review attention is a limited resource, and every comment spent on something a tool should handle is attention not spent on the substance of the change. When reviews consist mainly of formatting and style preferences, two things happen: the important issues — a security check in the wrong order, an unhandled failure mode, a design that will not scale — get less scrutiny or none, and authors learn from experience that review feedback is low-value noise and begin to discount it, so that even the occasional substantive comment is skimmed past. The fix is to move everything mechanical into automation that runs before or during CI: a formatter that rewrites style so there is nothing to debate, and a linter that catches the class of trivial correctness issues that follow fixed rules. That clears the review to be about the things that genuinely require human judgement, and it keeps authors engaged with review because the comments they receive are ones that a machine could not have produced and that are worth acting on.',
        whyHi: 'Review attention ek limited resource hai, aur har comment jo kisi cheez par kharch hoता hai jise ek tool handle karना chahiye wo attention hai jo change ke substance par kharch nahi hui. Jab reviews mainly formatting aur style preferences se consist karती hain, do cheezें hoती hain: important issues — ek security check galat order mein, ek unhandled failure mode — ko kम scrutiny milती hai, aur authors experience se seekhते hain ki review feedback low-value noise hai aur ise discount karना shuru karते hain. Fix har mechanical cheez ko automation mein move karना hai jo CI se pehle ya ke dauран chalती hai: ek formatter jo style rewrite karता hai, aur ek linter jo trivial correctness issues ki class catch karता hai. Wo review ko un cheezों ke baare mein hone ke liye clear karता hai jo genuinely human judgement require karती hain.',
      },
      {
        wrong: `# branch protection on main, but "enforce for administrators" is OFF
# normal devs: PR + checks + review, always.
# an admin under deadline pressure: pushes straight to main, force-pushes to
//   "fix" a bad commit, merges their own unreviewed PR by clicking past the block.
# -> the rules protect against everyone EXCEPT the accounts that can do the most damage.
#    and now "well, X bypassed it last week" erodes the rule for everyone.`,
        right: `# turn on "include administrators" / "enforce for admins". the rules apply to
# everyone. if an admin genuinely needs an emergency bypass:
#   - a documented break-glass procedure (temporarily lift protection, logged,
//      with a follow-up review), NOT a standing exemption
#   - or a separate emergency path with its own audited controls
# the more privileged the account, the MORE it should be constrained, not less.`,
        why: 'Branch protection rules exist to ensure that every change to an important branch has been reviewed and has passed its checks, and the value of that guarantee depends on it having no exceptions. Exempting administrators removes the guarantee precisely for the accounts that can cause the most harm, whether through a mistake made under pressure or through compromise, and those are the accounts where the checks matter most. It also damages the rule socially: once people see that the constraints do not apply to everyone, the constraints stop being treated as absolute, and pressure to make further exceptions grows. The correct configuration applies the rules to administrators as well. Genuine emergencies are handled not by a permanent exemption but by an explicit, logged break-glass procedure — protection is lifted deliberately for a short, recorded window, the emergency change is made, and it is reviewed retroactively — or by a separate emergency deployment path that has its own controls and audit trail. The principle is that a more powerful account should operate under more constraint, not less.',
        whyHi: 'Branch protection rules ensure karने ke liye exist karते hain ki ek important branch mein har change review hua hai aur apne checks pass kiye hain, aur us guarantee ki value iske koi exceptions na hone par depend karती hai. Administrators ko exempt karना guarantee ko exactly un accounts ke liye remove karता hai jo sabse zyada harm cause kar sakते hain. Ye rule ko socially bhi damage karता hai: ek baar log dekhते hain ki constraints sabpar apply nahi hote, constraints absolute treat honा band ho jाते hain. Correct configuration rules ko administrators par bhi apply karता hai. Genuine emergencies ek permanent exemption se nahi balki ek explicit, logged break-glass procedure se handle kiye jाते hain. Principle ye hai ki ek zyada powerful account zyada constraint ke under operate karे, kम nahi.',
      },
      {
        wrong: `# two PRs, each green against main, merged minutes apart
# PR A: renames  getUser()  ->  fetchUser()  across the codebase. green. merged.
# PR B (branched before A): adds a new caller  getUser(id)  in a new file. green. merged.
# -> main is now BROKEN: B's new code calls getUser(), which A deleted. neither
//    PR's CI caught it because neither ran against the OTHER's changes.`,
        right: `# a MERGE QUEUE: merges are serialized, and CI re-runs on the COMBINED result.
#   - PR A enters the queue, CI runs on (main + A), passes, merges.
#   - PR B enters, the queue rebases it on the new main, CI runs on (main + A + B),
//      FAILS (getUser is gone) -> B is kicked back to the author, main stays green.
# without a merge queue, "up to date with base required" partly helps but forces
# constant manual rebasing; the queue automates it and scales.`,
        why: 'A status check verifies a pull request against the state of the base branch at the time the check ran, so two pull requests created from the same base can each pass their checks while being mutually incompatible in a way that only appears when both are applied. One removes or renames something the other newly depends on; one changes a function\'s contract while the other adds a call to the old contract; one alters shared configuration the other assumes. Because neither pull request\'s CI ever ran against the other\'s changes, both merge green and the mainline breaks. Requiring each branch to be fully up to date with the base before merging catches this but forces every author to rebase and re-run CI every time any other pull request merges, which does not scale past a low merge rate. A merge queue solves it by serialising merges and testing the actual combined result: it takes queued pull requests in order, constructs the state that would exist if they were merged, runs CI against that, and merges only what passes, sending anything that fails in combination back to its author. The mainline stays green regardless of how many pull requests are merging.',
        whyHi: 'Ek status check ek pull request ko base branch ki us state ke against verify karता hai jab check chala, to same base se banाye do pull requests har ek apne checks pass kar sakते hain jabki mutually incompatible honा ek aisे tarike se jo sirf tab appear hoता hai jab dono apply hote hain. Ek doosरे ke naye dependency ko remove ya rename karता hai; ek ek function ka contract change karता hai jabki doosरा purane contract ko ek call add karता hai. Kyunki kisi bhi pull request ka CI kabhi doosरे ke changes ke against nahi chala, dono green merge hote hain aur mainline toड़ता hai. Ek merge queue ise merges serialise karके aur actual combined result test karके solve karता hai: ye queued pull requests ko order mein leता hai, wo state construct karता hai jo exist karती agar wo merge hote, us ke against CI chalाता hai, aur sirf jo pass hoता hai merge karता hai.',
      },
    ],

    realWorld: [
      {
        en: '**A team\'s review turnaround dropped from ~1.5 days to ~3 hours** after capping PRs at 400 lines and moving all formatting to a CI check + pre-commit hook. Defect-escape rate fell too — small PRs got real reviews.',
        hi: '**Ek team ka review turnaround ~1.5 din se ~3 ghante par gira** PRs ko 400 lines par cap karके aur saara formatting ek CI check par move karके.',
      },
      {
        en: '**A prod outage from two green PRs merged 10 minutes apart** — one deleted a helper, the other added a caller of it. Installing a merge queue that re-runs CI on the combined result ended that class of incident.',
        hi: '**Do green PRs se ek prod outage jo 10 minutes apart merged** — ek ne ek helper delete kiya, doosरे ne iska ek caller add kiya. Ek merge queue install karना.',
      },
      {
        en: '**A `CODEOWNERS` entry for `/migrations/` + `*.tf` requiring platform-team review** — added after an unreviewed migration locked a hot table for 8 minutes in peak traffic. Now every schema/infra change gets a second set of eyes that knows the blast radius.',
        hi: '**`/migrations/` + `*.tf` ke liye ek `CODEOWNERS` entry jo platform-team review require karती hai** — ek unreviewed migration ke ek hot table ko 8 minutes lock karने ke baad add kiya.',
      },
    ],

    interviewQA: [
      {
        q: 'What is code review good at, what should it not be doing, and why do small PRs matter so much?',
        qHi: 'Code review kismें achha hai, ise kya nahi karना chahiye, aur small PRs itने kyun matter karते hain?',
        a: 'Code review is valuable for the things automation cannot judge: correctness that the tests do not cover, such as an untested edge case or a race; whether the change fits the system\'s existing design or introduces a redundant second way of doing something; readability and naming; failure modes and behaviour at scale; security and data-handling concerns; whether there is a simpler solution; and whether the diff actually matches its stated intent. It also spreads knowledge of the codebase. It should not be spent on style that a formatter should normalise, on re-verifying what CI already checked, or on a reviewer rewriting a perfectly acceptable change into their own preferred form. A review that produces only nitpicks trains authors to ignore review feedback. Small pull requests matter because PR size is the single biggest determinant of review quality. A change of a few hundred lines can be reviewed carefully in one sitting, gets a fast response, and yields specific useful comments. A change of a thousand-plus lines gets a superficial pass and an approval because a real review would take hours the reviewer does not have, so defects pass through and the PR stalls waiting for attention. When a change must be large, it is split: a no-op refactor followed by the behaviour change, or a stack of small dependent PRs, or scaffolding merged behind a feature flag and then filled in incrementally.',
        aHi: 'Code review un cheezों ke liye valuable hai jo automation judge nahi kar sakती: correctness jo tests cover nahi karते; kya change system ke existing design mein fit hoता hai; readability aur naming; failure modes aur scale par behaviour; security concerns; kya ek simpler solution hai; aur kya diff apni stated intent se match karता hai. Ise style par kharch nahi honा chahiye jo ek formatter normalise karे, CI jo already check karता hai wo re-verify karने par, ya ek reviewer ek acceptable change ko apni preferred form mein rewrite karने par. Small pull requests matter karते hain kyunki PR size review quality ka single biggest determinant hai. Ek few hundred lines ka change ek baithक mein carefully review ho sakта hai. Ek thousand-plus lines ka change ek superficial pass paता hai. Jab ek change baड़ा honा chahiye, ise split kiya jाता hai.',
      },
      {
        q: 'What does branch protection enforce, and why does a merge queue exist on top of it?',
        qHi: 'Branch protection kya enforce karता hai, aur iske upar ek merge queue kyun exist karта hai?',
        a: 'Branch protection makes the hosting platform enforce, for a specific branch, rules that would otherwise be conventions. Typically for the mainline: every change must come through a pull request, so direct pushes are rejected; named CI checks must be green; a minimum number of reviewers must approve, with approvals dismissed when new commits are pushed so an approval always reflects the current code; a Code Owner must approve if an owned path is touched; all review conversations must be resolved; history must stay linear; the branch cannot be force-pushed or deleted; and the rules apply to administrators too, not just everyone else. Together these guarantee that whatever is on the mainline has been reviewed and has passed its checks. A merge queue exists because those checks verify each pull request against the mainline as it was when the check ran, not against other pull requests merging around the same time. Two pull requests can each be green against the current mainline and yet break it when both land, because one removes something the other started using, or changes a contract the other now calls. A merge queue serialises merges and runs CI against the prospective combined state: it processes queued PRs in order, builds what the mainline would look like with the next PR applied, tests that, and merges only if it passes, bouncing anything that fails in combination. This keeps the mainline green even at a high merge rate, which requiring "up to date with base" does only at the cost of constant manual rebasing.',
        aHi: 'Branch protection hosting platform ko ek specific branch ke liye un rules ko enforce karवाता hai jo warna conventions hote. Typically mainline ke liye: har change ek pull request ke through aana chahiye; named CI checks green honा chahiye; ek minimum sankhya ke reviewers approve karें, naye commits par approvals dismiss ke saath; ek Code Owner approve karे agar ek owned path touch hua; saari review conversations resolved honी chahiye; history linear rehनी chahiye; branch force-pushed ya deleted nahi ho sakती; aur rules administrators par bhi apply hote hain. Ek merge queue exist karता hai kyunki wo checks har pull request ko mainline ke against verify karते hain jaisा ye check chalने par tha. Do pull requests har ek current mainline ke against green ho sakते hain phir bhi ise toड़ sakते hain jab dono land hote hain. Ek merge queue merges serialise karता hai aur prospective combined state ke against CI chalाता hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, list six things code review IS for and three things it is NOT for, and explain the rule "a review comment should mostly be something a machine couldn\'t have caught".',
        taskHi: 'Ek comment mein, chhह cheezें list karो jinके liye code review HAI aur teen jinके liye NAHI.',
        hint: 'IS for: correctness the tests miss (untested edge case, race, missing null path); design fit (does it belong here, does it duplicate an existing pattern); readability/naming; edge cases & failure modes (empty input, timeout, partial failure, scale); security & data (injection, authz order, PII, secrets, logs); simplicity ("is there a smaller solution / can we delete instead"); intent match (does the diff do what the description says, only that); knowledge sharing. NOT for: style a formatter should normalise; re-verifying what CI already ran; rewriting acceptable code into the reviewer\'s preferred style; blocking to look diligent. The rule: mechanical issues → automate (formatter + linter in CI/pre-commit) so human attention (a limited resource) goes to judgement calls; a review that\'s all nitpicks trains authors to ignore reviews and real bugs then ship.',
        hintHi: 'HAI: correctness jo tests miss karते hain; design fit; readability/naming; edge cases & failure modes; security & data; simplicity; intent match; knowledge sharing. NAHI: style jo ek formatter normalise karे; CI jo already chala wo re-verify karना; acceptable code ko reviewer ki style mein rewrite karना; diligent dikhने ke liye block karना. Rule: mechanical issues → automate karो taki human attention judgement calls par jाए.',
      },
      {
        task: 'In a comment, write a branch-protection ruleset for `main` for a trunk-based team (list at least 7 rules), and explain specifically why "enforce for administrators" must be on.',
        taskHi: 'Ek comment mein, ek trunk-based team ke liye `main` ke liye ek branch-protection ruleset likho.',
        hint: 'Rules: (1) require a PR — no direct pushes; (2) require named status checks green (test, lint, typecheck, build); (3) require ≥1 approving review; (4) dismiss stale approvals on new commits; (5) require last-push approval (no self-approving your own final change); (6) require CODEOWNERS review for touched owned paths; (7) require conversation resolution; (8) require linear history (squash/rebase only); (9) block force-pushes; (10) block branch deletion; (11) optionally require signed commits. "Enforce for administrators" must be ON because the rules guarantee every change to main was reviewed + checked, and that guarantee is worthless if the highest-privilege accounts — exactly the ones whose mistakes or compromise are most damaging — are exempt. It also erodes socially: "X bypassed it last week" kills the rule for everyone. Emergencies use a documented, logged break-glass procedure, not a standing exemption.',
        hintHi: 'Rules: (1) ek PR require karो; (2) named status checks green; (3) ≥1 approving review; (4) naye commits par stale approvals dismiss; (5) last-push approval; (6) CODEOWNERS review; (7) conversation resolution; (8) linear history; (9) force-pushes block; (10) branch deletion block; (11) signed commits (optional). "Enforce for administrators" ON honा chahiye kyunki rules guarantee karते hain har change review + checked tha, aur wo guarantee worthless hai agar highest-privilege accounts exempt hain. Emergencies ek logged break-glass procedure istemal karते hain.',
      },
      {
        task: 'Two PRs each pass CI against the current `main` and are merged 5 minutes apart; `main` is now broken. In a comment, explain how that happens, why neither PR\'s CI caught it, and how a merge queue prevents it.',
        taskHi: 'Do PRs har ek current `main` ke against CI pass karते hain aur 5 minutes apart merged hote hain; `main` ab broken hai. Kaise?',
        hint: 'Each PR\'s CI verified it against `main` AS IT WAS when the check ran — not against the other PR. So PR A can delete/rename `getUser()` while PR B (branched earlier) adds a new call to `getUser()`; both are green against the old `main`; merged together, B\'s code calls a function A deleted → `main` breaks. Neither CI run ever saw the other\'s changes. A MERGE QUEUE serializes merges and re-runs CI on the COMBINED result: A enters, CI on (main+A) passes, merges; B enters, the queue rebases it on the new `main` and runs CI on (main+A+B), which FAILS → B is bounced back to its author and `main` stays green. "Require branch up to date with base" partly helps but forces constant manual rebasing; the queue automates it and scales.',
        hintHi: 'Har PR ka CI use `main` ke against verify kiya JAISA ye tha jab check chala — doosरे PR ke against nahi. To PR A `getUser()` delete kar sakта hai jabki PR B ek naya call add karता hai; dono purane `main` ke against green; saath merged, B ka code ek function call karता hai jo A ne delete kiya → `main` breaks. Ek MERGE QUEUE merges serialize karта hai aur COMBINED result par CI re-run karता hai: B (main+A+B) par CI FAIL karता hai → B wapas bheja jाता hai aur `main` green rehता hai.',
      },
    ],

    keyTakeaways: [
      'A PULL REQUEST bundles: a branch of proposed commits targeting a base; a description (what/why/how to test/links); automated CHECKS (tests, lint, type-check, build, security/dependency scan, coverage); human REVIEW (≥1 approval from someone other than the author); a line-anchored discussion. It\'s where the branching model, CI, and review meet — and the unit for the changelog, reverts, and often deployment.',
      'CODE REVIEW IS FOR what a machine can\'t judge: correctness the tests miss, design fit, readability/naming, edge cases & failure modes, security & data handling, simplicity ("is there a smaller solution / can we delete instead"), intent match (diff does what the description says, only that), knowledge sharing. It is NOT for: style a formatter should normalise, re-verifying what CI already ran, rewriting acceptable code into the reviewer\'s style, or blocking to look diligent. A review comment should MOSTLY be something a machine couldn\'t have caught — automate the mechanical stuff (formatter + linter in CI/pre-commit) or authors learn to ignore reviews.',
      'SMALL PRs are the single biggest lever on review quality: < ~200-400 lines → a real careful review in one sitting, fast turnaround, specific comments; > ~1000 lines → an "LGTM" rubber stamp, defects sail through, it sits for days. Split a big change: a pure-REFACTOR PR (no behaviour change) then a BEHAVIOUR PR; STACKED PRs (a chain each based on the previous); or merge scaffolding BEHIND A FEATURE FLAG then fill in incrementally.',
      'BRANCH PROTECTION makes the platform enforce (for `main`/release branches) what would otherwise be skippable conventions: require a PR (NO direct pushes); require named STATUS CHECKS green; require N approvals + DISMISS STALE approvals on new commits + require last-push approval; require CODEOWNERS review for touched owned paths (a file mapping path globs → teams, e.g. `/payments/ @org/payments-team`, `*.tf @org/platform`); require conversations resolved; require linear history; block force-pushes + deletions; and INCLUDE ADMINISTRATORS — the rules must apply to the highest-privilege accounts too (their mistakes/compromise are the most damaging; a standing exemption erodes the rule for everyone). Emergencies → a documented, logged break-glass procedure, not a permanent bypass.',
      'MERGE METHOD (set per repo, enforce it): MERGE COMMIT (keeps branch commits + a merge node, non-linear), SQUASH (one commit per PR on main, linear, easy revert/bisect — most common; make the PR title/description the commit message), REBASE & MERGE (replayed onto main, linear, new hashes). AUTO-MERGE = the PR merges itself the moment checks pass + approvals are in. MERGE QUEUE = serialises merges and re-runs CI on the COMBINED result, so `main` never goes red from two individually-green PRs that conflict semantically (one deletes what the other starts calling) — essential for large trunk-based teams; "require up to date with base" only half-solves it and forces constant manual rebasing.',
    ],
    keyTakeawaysHi: [
      'Ek PULL REQUEST bundle karता hai: ek base ko target karता proposed commits ka branch; ek description; automated CHECKS (tests, lint, type-check, build, security scan, coverage); human REVIEW (author ke alawa ≥1 approval); ek line-anchored discussion. Ye wo jagah hai jahaan branching model, CI, aur review milते hain — aur changelog, reverts, aur aksar deployment ki unit.',
      'CODE REVIEW un cheezों KE LIYE HAI jo ek machine judge nahi kar sakती: correctness jo tests miss karते hain, design fit, readability/naming, edge cases & failure modes, security & data, simplicity, intent match, knowledge sharing. NAHI: style jo ek formatter normalise karे, CI jo already chala wo re-verify karना, acceptable code ko reviewer ki style mein rewrite karना, diligent dikhने ke liye block karना. Ek review comment MOSTLY kुछ aisा honा chahiye jo ek machine catch nahi kar sakती thi.',
      'SMALL PRs review quality par single biggest lever hain: < ~200-400 lines → ek real careful review ek baithक mein; > ~1000 lines → ek "LGTM" rubber stamp, defects sail through. Ek baड़े change ko split karो: ek pure-REFACTOR PR phir ek BEHAVIOUR PR; STACKED PRs; ya scaffolding ko ek FEATURE FLAG KE PEECHE merge karो.',
      'BRANCH PROTECTION platform ko enforce karवाता hai (`main`/release branches ke liye): ek PR require karो (KOI direct pushes nahi); named STATUS CHECKS green; N approvals + naye commits par STALE approvals DISMISS + last-push approval; touched owned paths ke liye CODEOWNERS review (ek file jo path globs → teams map karती hai); conversations resolved; linear history; force-pushes + deletions block; aur ADMINISTRATORS INCLUDE karो — rules highest-privilege accounts par bhi apply honा chahiye. Emergencies → ek logged break-glass procedure.',
      'MERGE METHOD (per repo set karो, enforce karो): MERGE COMMIT (branch commits + ek merge node, non-linear), SQUASH (main par per PR ek commit, linear — most common), REBASE & MERGE (replayed, linear, naye hashes). AUTO-MERGE = PR khud merge hoता hai jaise hi checks pass + approvals aa jाते hain. MERGE QUEUE = merges serialise karता hai aur COMBINED result par CI re-run karता hai, taki `main` kabhi do individually-green PRs se red na jाए jo semantically conflict karते hain — baड़ी trunk-based teams ke liye essential.',
    ],
  },

  {
    slug: 'ops-conventional-commits-semver-tags-and-releases',
    title: 'Conventional Commits, SemVer, Tags & Releases',
    titleHi: 'Conventional Commits, SemVer, Tags Aur Releases',
    description: 'A disciplined commit message format lets tools derive the next version number, generate the changelog, and cut the release automatically. Semantic versioning communicates, in three numbers, whether an upgrade is safe. Tags are the immutable markers that tie a version to an exact commit.',
    descriptionHi: 'Ek disciplined commit message format tools ko agla version number derive karने, changelog generate karने, aur release automatically cut karने deता hai. Semantic versioning teen numbers mein communicate karता hai ki ek upgrade safe hai ya nahi. Tags wo immutable markers hain jo ek version ko ek exact commit se tie karते hain.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 5,

    analogy: {
      en: '**Labelling moving boxes so a machine can pack the truck.** If every box is scrawled "stuff", someone has to open all of them to plan the load. If each box is labelled to a fixed scheme — "KITCHEN / fragile / 12kg" — a machine can sort them, compute the total weight, and print a manifest. Conventional Commits is that fixed scheme for commit messages: "feat", "fix", "feat!" — and from a pile of them a tool computes the next version (a "feat!" means the truck needs a bigger licence — a major bump), writes the manifest (the changelog), and seals it with a numbered tag that will always point at exactly this load.',
      hi: '**Moving boxes label karना taki ek machine truck pack kar sakे.** Agar har box par "stuff" scrawl hai, kisi ko sab kholना padता hai load plan karने ke liye. Agar har box ek fixed scheme se labelled hai — "KITCHEN / fragile / 12kg" — ek machine unhe sort kar sakती hai, total weight compute kar sakती hai, aur ek manifest print kar sakती hai. Conventional Commits commit messages ke liye wo fixed scheme hai: "feat", "fix", "feat!" — aur unke ek dher se ek tool agla version compute karта hai (ek "feat!" matlab truck ko ek bada licence chahiye — ek major bump), manifest likhता hai (changelog), aur ise ek numbered tag se seal karता hai jo hamesha exactly is load par point karega.',
    },

    simple: `**CONVENTIONAL COMMITS — a message grammar:**
\`\`\`
<type>[optional (scope)][optional !]: <summary>

[optional body]

[optional footer(s), e.g. "BREAKING CHANGE: ...", "Refs: #123"]
\`\`\`
types:  feat  fix  docs  style  refactor  perf  test  build  ci  chore  revert
examples:
  feat(auth): add passwordless login
  fix: guard against null cart in checkout
  refactor(api)!: drop the v1 response envelope        <- "!" = breaking
  feat: new export format

  BREAKING CHANGE: the CSV column order changed         <- footer also = breaking

**SEMANTIC VERSIONING —  MAJOR.MINOR.PATCH  (e.g. 3.4.1):**
\`\`\`
MAJOR  incompatible / breaking change      -> consumers must read release notes before upgrading
MINOR  new functionality, backward-compatible
PATCH  backward-compatible bug fix only
pre-release:  1.0.0-rc.1 , 1.0.0-beta.2   (sorts BEFORE 1.0.0)
build metadata: 1.0.0+20240115  (ignored for precedence)
0.y.z  =  "anything may change" — pre-1.0 has no stability promise
\`\`\`
Map: feat! / BREAKING CHANGE -> MAJOR ; feat -> MINOR ; fix / perf -> PATCH.

**TAGS — an immutable name for one commit:**
\`\`\`
LIGHTWEIGHT   git tag v1.4.0          just a ref file with a sha. no metadata.
ANNOTATED     git tag -a v1.4.0 -m    a real object: tagger, date, message, (GPG sig).
              -> USE ANNOTATED for releases. 'git describe' and many tools need it.
git push --tags   (or  git push origin v1.4.0 )    tags don't push automatically
git tag -v v1.4.0    verify a signature
\`\`\`
Tags DON'T MOVE. Re-tagging (\`git tag -f\`) after people have pulled = confusion. Cut a new one.

**RELEASE = a tagged commit + notes + built artifacts:**
\`\`\`
1. commits land on main (conventional messages)
2. a tool reads commits since the last tag -> decides MAJOR/MINOR/PATCH -> new version
3. it updates the CHANGELOG (grouped: Features / Fixes / Breaking), bumps version files
4. it creates an ANNOTATED TAG  vX.Y.Z  and a GitHub/GitLab Release with the notes
5. CI builds artifacts FROM THAT TAG and publishes (registry, image, binaries)
\`\`\`
Tools: semantic-release, release-please, changesets, git-cliff, goreleaser.

**\`git describe --tags\`  ->  \`v1.4.0-7-gA1B2C3D\`**  = "7 commits past v1.4.0, at commit a1b2c3d".
A clean release build shows exactly \`v1.4.0\`. Great as a build-stamp / \`--version\` string.`,

    simpleHi: `**CONVENTIONAL COMMITS — ek message grammar:**
\`\`\`
<type>[optional (scope)][optional !]: <summary>
[optional body]
[optional footer(s), e.g. "BREAKING CHANGE: ...", "Refs: #123"]
\`\`\`
types:  feat  fix  docs  style  refactor  perf  test  build  ci  chore  revert
examples:
  feat(auth): add passwordless login
  fix: guard against null cart in checkout
  refactor(api)!: drop the v1 response envelope        <- "!" = breaking
  BREAKING CHANGE: the CSV column order changed         <- footer bhi = breaking

**SEMANTIC VERSIONING —  MAJOR.MINOR.PATCH:**
\`\`\`
MAJOR  incompatible / breaking change      -> consumers ko upgrade se pehle release notes padhने chahiye
MINOR  new functionality, backward-compatible
PATCH  backward-compatible bug fix only
pre-release:  1.0.0-rc.1  (1.0.0 se PEHLE sort hoता hai)
0.y.z  =  "kुछ bhi change ho sakта hai" — pre-1.0 ka koi stability promise nahi
\`\`\`
Map: feat! / BREAKING CHANGE -> MAJOR ; feat -> MINOR ; fix / perf -> PATCH.

**TAGS — ek commit ke liye ek immutable naam:**
\`\`\`
LIGHTWEIGHT   git tag v1.4.0          bस ek ref file ek sha ke saath. koi metadata nahi.
ANNOTATED     git tag -a v1.4.0 -m    ek real object: tagger, date, message, (GPG sig).
              -> releases ke liye ANNOTATED USE karो. 'git describe' aur bahut tools ise need karते hain.
git push --tags       tags automatically push nahi hote
\`\`\`
Tags MOVE NAHI karते. Re-tagging (\`git tag -f\`) logon ke pull karने ke baad = confusion. Ek naya cut karो.

**RELEASE = ek tagged commit + notes + built artifacts:**
\`\`\`
1. commits main par land karते hain (conventional messages)
2. ek tool last tag se commits padhता hai -> MAJOR/MINOR/PATCH decide karता hai -> new version
3. ye CHANGELOG update karता hai (grouped: Features / Fixes / Breaking), version files bump karता hai
4. ye ek ANNOTATED TAG  vX.Y.Z  aur ek Release notes ke saath banаता hai
5. CI US TAG se artifacts build karता hai aur publish karता hai
\`\`\`
Tools: semantic-release, release-please, changesets, git-cliff, goreleaser.

**\`git describe --tags\`  ->  \`v1.4.0-7-gA1B2C3D\`**  = "v1.4.0 se 7 commits aage, commit a1b2c3d par".`,

    content: `## Conventional Commits

A convention for the **first line** of a commit message (and optional structured footers) that a machine can parse:

\`\`\`
<type>(<optional scope>)<optional !>: <summary>

<optional body — the why, wrapped>

<optional footers>
\`\`\`

**Types** in common use: \`feat\` (a new feature), \`fix\` (a bug fix), \`perf\` (a performance improvement), \`refactor\` (neither fixes a bug nor adds a feature), \`docs\`, \`test\`, \`build\` (build system or dependencies), \`ci\` (CI config), \`style\` (formatting only), \`chore\` (everything else), \`revert\`.

**Breaking changes** are marked two ways, either is sufficient: a \`!\` before the colon (\`feat(api)!: ...\`), or a footer \`BREAKING CHANGE: <description>\`.

**Footers** carry metadata: \`BREAKING CHANGE: ...\`, \`Refs: #123\`, \`Reviewed-by: ...\`, \`Co-authored-by: ...\`.

Examples:

\`\`\`
feat(auth): add passwordless email login
fix: prevent a null cart from crashing checkout
perf(search): cache the facet counts for 60s
refactor(billing)!: remove the deprecated invoice_v1 field

BREAKING CHANGE: clients reading invoice.invoice_v1 must switch to invoice.lines
\`\`\`

The payoff: tooling can read the commits since the last release and mechanically decide the next version number, group the changes into a changelog, and flag breaking changes prominently. It also makes \`git log\` scannable by humans. The cost is discipline, usually enforced with a \`commit-msg\` hook (Lesson 6) and a CI check.

## Semantic Versioning

**SemVer** gives a release a version \`MAJOR.MINOR.PATCH\` where each number has a defined meaning **relative to the public API/behaviour**:

- **PATCH** (\`1.4.0 → 1.4.1\`) — backward-compatible bug fixes only. Safe to take without reading anything.
- **MINOR** (\`1.4.1 → 1.5.0\`) — new backward-compatible functionality. Existing usage keeps working; there is just more available. Safe to take.
- **MAJOR** (\`1.5.0 → 2.0.0\`) — an incompatible change. Something that worked before may not now. **Read the release notes / migration guide before upgrading.**

Extra syntax:

- **Pre-release**: \`2.0.0-rc.1\`, \`2.0.0-beta.3\` — a suffix after a hyphen. These sort **before** the plain \`2.0.0\` and signal "not yet stable".
- **Build metadata**: \`1.4.1+build.5678\` — after a plus; **ignored** when comparing precedence.
- **\`0.y.z\`** — the "initial development" range. Anything may change at any time; there is no compatibility promise until \`1.0.0\`. Many libraries stay on \`0.x\` deliberately.

The mapping from Conventional Commits: a breaking change → **MAJOR**; a \`feat\` → **MINOR**; a \`fix\` or \`perf\` → **PATCH**. Take the highest-impact change since the last release.

SemVer is a **communication contract**, not a law of nature — its usefulness depends on the maintainer classifying changes honestly. For an internal continuously-deployed service with no external consumers, strict SemVer often does not apply; a date-based or monotonic build number can be enough. It matters most for **libraries and APIs other people depend on**.

## Tags

A **tag** marks one commit with a name, by convention a version:

- **Lightweight tag** — \`git tag v1.4.0\`. Just a ref file containing the commit sha. No date, no author, no message.
- **Annotated tag** — \`git tag -a v1.4.0 -m "Release 1.4.0"\`. A full object with a tagger name and email, a timestamp, a message, and optionally a GPG/SSH signature. **Use annotated tags for releases**: \`git describe\` only considers annotated tags by default, and release tooling and package managers expect the metadata.

Key facts:

- **Tags are not pushed automatically.** \`git push\` sends commits and branches, not tags. Use \`git push origin v1.4.0\` or \`git push --tags\`.
- **Tags are meant to be immutable.** Once \`v1.4.0\` exists and others have fetched it, moving it with \`git tag -f\` gives different people different ideas of what \`v1.4.0\` is. If a release is wrong, cut \`v1.4.1\`, do not re-tag.
- **Signed tags** — \`git tag -s\` signs, \`git tag -v\` verifies. Used where the provenance of a release must be cryptographically checkable.
- \`git describe --tags\` produces \`v1.4.0-7-g<sha>\` — "seven commits after \`v1.4.0\`, currently at commit \`<sha>\`". On the exact tagged commit it prints just \`v1.4.0\`. This is an excellent \`--version\` string and build stamp because it precisely locates any build in history.

## The release process

A **release** ties together: a tagged commit, human-readable notes, and the built, published artifacts for that version.

Automated, it looks like:

1. Commits land on \`main\` with conventional messages, through PRs.
2. A release tool (run on a schedule, on every merge, or on demand) reads all commits **since the last release tag**.
3. It determines the version bump — MAJOR if any breaking change, else MINOR if any \`feat\`, else PATCH — and computes the new version.
4. It updates the **CHANGELOG** (a new section, changes grouped as Features / Bug Fixes / Breaking Changes, each linked to its commit and PR), and bumps the version in \`package.json\` / \`pyproject.toml\` / \`Cargo.toml\` / etc.
5. It commits those changes, creates an **annotated tag** \`vX.Y.Z\`, and opens a **GitHub/GitLab Release** with the generated notes.
6. A CI workflow triggered **by the tag** builds the artifacts from that exact commit and publishes them — to a package registry, a container registry, a binary store, an app store.

Common tools: **semantic-release** (fully automatic, npm-centric but general), **release-please** (Google; opens a "release PR" you merge to cut the release), **changesets** (monorepo-friendly, contributor writes an intent file per change), **git-cliff** / **cocogitto** (changelog from conventional commits, language-agnostic), **goreleaser** (Go binaries + packages + images).

## For internal services

A service you deploy continuously and nobody imports does not need SemVer or hand-written release notes. What is still worth having: an **immutable identifier for every deployable build** — a tag, a monotonic build number, or the commit sha — stamped into the artifact and exposed at a \`/version\` endpoint, so you can always answer "what exactly is running here" and correlate an incident to a specific commit. \`git describe\` or \`<branch>-<short-sha>-<timestamp>\` both work.`,

    contentHi: `## Conventional Commits

Ek commit message ki **pehli line** ke liye ek convention jo ek machine parse kar sakती hai:

\`\`\`
<type>(<optional scope>)<optional !>: <summary>
<optional body>
<optional footers>
\`\`\`

**Types**: \`feat\`, \`fix\`, \`perf\`, \`refactor\`, \`docs\`, \`test\`, \`build\`, \`ci\`, \`style\`, \`chore\`, \`revert\`.

**Breaking changes** do tarike se marked: colon se pehle ek \`!\` (\`feat(api)!: ...\`), ya ek footer \`BREAKING CHANGE: <description>\`.

Payoff: tooling last release se commits padh sakта hai aur mechanically agla version number decide kar sakта hai, changes ko ek changelog mein group kar sakта hai. Cost discipline hai, usually ek \`commit-msg\` hook aur ek CI check se enforced.

## Semantic Versioning

**SemVer** ek release ko ek version \`MAJOR.MINOR.PATCH\` deता hai jahaan har number ka ek defined meaning hai **public API/behaviour ke relative**:

- **PATCH** — sirf backward-compatible bug fixes. Bina kुछ padhे safe.
- **MINOR** — new backward-compatible functionality. Existing usage kaam karता rehता hai. Safe.
- **MAJOR** — ek incompatible change. **Upgrade se pehle release notes padhो.**

Extra: **Pre-release** (\`2.0.0-rc.1\` — \`2.0.0\` se PEHLE sort hoता hai); **Build metadata** (\`1.4.1+build.5678\` — precedence ke liye ignored); **\`0.y.z\`** (initial development — koi compatibility promise nahi jab tak \`1.0.0\`).

Conventional Commits se mapping: ek breaking change → **MAJOR**; ek \`feat\` → **MINOR**; ek \`fix\`/\`perf\` → **PATCH**. Last release se highest-impact change lo.

SemVer ek **communication contract** hai, prakृति ka niyam nahi. Ek internal continuously-deployed service ke liye jiske koi external consumers nahi, strict SemVer aksar apply nahi hoती.

## Tags

Ek **tag** ek commit ko ek naam se mark karता hai:
- **Lightweight tag** — \`git tag v1.4.0\`. Bस ek ref file. Koi metadata nahi.
- **Annotated tag** — \`git tag -a v1.4.0 -m "..."\`. Ek full object ek tagger, timestamp, message, aur optionally ek signature ke saath. **Releases ke liye annotated tags USE karो.**

Key facts: **Tags automatically push nahi hote** (\`git push --tags\`). **Tags immutable honे chahiye** — agar ek release galat hai, \`v1.4.1\` cut karो, re-tag mat karो. \`git describe --tags\` \`v1.4.0-7-g<sha>\` produce karता hai.

## Release process

Ek **release** tie karता hai: ek tagged commit, human-readable notes, aur us version ke built, published artifacts.

Automated: (1) commits conventional messages ke saath \`main\` par land karते hain; (2) ek release tool **last release tag se** saare commits padhता hai; (3) version bump determine karता hai; (4) **CHANGELOG** update karता hai aur version files bump karता hai; (5) ek **annotated tag** aur ek **Release** banаता hai; (6) ek CI workflow **tag dwara** triggered artifacts build aur publish karता hai.

Tools: **semantic-release**, **release-please**, **changesets**, **git-cliff**, **goreleaser**.

## Internal services ke liye

Ek service jo aap continuously deploy karते ho aur koi import nahi karता ko SemVer ya hand-written release notes ki zaroorat nahi. Jo abhi bhi worth hai: **har deployable build ke liye ek immutable identifier** — ek tag, ek monotonic build number, ya commit sha — artifact mein stamped aur ek \`/version\` endpoint par exposed.`,

    examples: [
      {
        title: 'Deriving the next version from conventional commits',
        titleHi: 'Conventional commits se agla version derive karna',
        code: `# VERIFY
set -e
export GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_SYSTEM=/dev/null
export GIT_AUTHOR_NAME=dev GIT_AUTHOR_EMAIL=dev@example.com
export GIT_COMMITTER_NAME=dev GIT_COMMITTER_EMAIL=dev@example.com
export GIT_AUTHOR_DATE='2024-01-01T00:00:00Z' GIT_COMMITTER_DATE='2024-01-01T00:00:00Z'
git init -b main -q
echo 0 > f && git add f && git commit -qm "chore: initial"
git tag -a v1.2.3 -m "Release 1.2.3"

for m in "fix: guard null cart" "feat(export): add CSV export" "docs: tidy readme"; do
  echo "$m" >> f && git commit -qam "$m"
done

last=$(git describe --tags --abbrev=0)
echo "last release:  $last"
echo "--- commits since $last ---"
git log --format='  %s' "$last..HEAD"

msgs=$(git log --format='%s%n%b' "$last..HEAD")
IFS=. read -r major minor patch <<< "\${last#v}"
bump=patch
if printf '%s\\n' "$msgs" | grep -qE '^[a-z]+(\\(.+\\))?!:|^BREAKING CHANGE'; then bump=major
elif printf '%s\\n' "$msgs" | grep -qE '^feat(\\(.+\\))?:'; then bump=minor
fi
case $bump in
  major) major=$((major+1)); minor=0; patch=0 ;;
  minor) minor=$((minor+1)); patch=0 ;;
  patch) patch=$((patch+1)) ;;
esac
echo "highest-impact change: $bump"
echo "next version: v$major.$minor.$patch"`,
        output: `last release:  v1.2.3
--- commits since v1.2.3 ---
  docs: tidy readme
  feat(export): add CSV export
  fix: guard null cart
highest-impact change: minor
next version: v1.3.0`,
        explain: 'This is exactly what a release tool does, in a few lines of shell. It finds the most recent annotated tag, which marks the last release, then collects every commit made since that tag. It scans the messages of those commits for the two markers that indicate a breaking change — an exclamation mark before the colon in the type prefix, or a BREAKING CHANGE line in the body — and if either is present the bump is major. Otherwise, if any commit is a feat, the bump is minor. Otherwise it is a patch. Here the commits since v1.2.3 are one fix, one feat, and one docs; there is no breaking marker but there is a feat, so the bump is minor, and 1.2.3 becomes 1.3.0 with the patch number reset to zero. A real tool additionally groups the commits into changelog sections, writes the new version into the project\'s manifest files, creates the annotated tag, and opens a release, but the version decision itself is this simple rule applied to well-formed commit messages. This is the entire reason the commit convention is worth enforcing: it turns "what should the next version be" from a judgement call into a computation.',
        explainHi: 'Ye exactly wo hai jo ek release tool karता hai, shell ki kुछ lines mein. Ye most recent annotated tag dhoondता hai, jo last release mark karта hai, phir us tag ke baad kiye gaye har commit ko collect karता hai. Ye un commits ke messages ko do markers ke liye scan karता hai jo ek breaking change indicate karте hain — type prefix mein colon se pehle ek exclamation mark, ya body mein ek BREAKING CHANGE line — aur agar koi bhi present hai bump major hai. Warna, agar koi commit ek feat hai, bump minor hai. Warna ye ek patch hai. Yahaan v1.2.3 se commits ek fix, ek feat, aur ek docs hain; koi breaking marker nahi par ek feat hai, to bump minor hai, aur 1.2.3 1.3.0 ban jата hai. Ek real tool additionally commits ko changelog sections mein group karता hai, par version decision khud ye simple rule hai.',
      },
      {
        title: 'Annotated vs lightweight tags, and git describe as a build stamp',
        titleHi: 'Annotated vs lightweight tags, aur git describe ek build stamp ke roop mein',
        code: `# VERIFY
exec 2>&1
export GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_SYSTEM=/dev/null
export GIT_AUTHOR_NAME=dev GIT_AUTHOR_EMAIL=dev@example.com
export GIT_COMMITTER_NAME=dev GIT_COMMITTER_EMAIL=dev@example.com
export GIT_AUTHOR_DATE='2024-01-01T00:00:00Z' GIT_COMMITTER_DATE='2024-01-01T00:00:00Z'
git init -b main -q
echo a > f && git add f && git commit -qm "feat: first"

git tag v0.9.0                                   # lightweight
git tag -a v1.0.0 -m "Release 1.0.0"             # annotated

echo "--- object types ---"
echo "v0.9.0 -> $(git cat-file -t v0.9.0)"       # a commit (the tag is just a pointer)
echo "v1.0.0 -> $(git cat-file -t v1.0.0)"       # a tag object

echo "--- annotated tag carries metadata ---"
git for-each-ref refs/tags/v1.0.0 --format='%(objecttype) %(taggername) %(contents:subject)'

echo b > f && git commit -qam "fix: second"
echo c > f && git commit -qam "fix: third"

echo "--- git describe: locate any build in history ---"
git describe --tags | sed -E 's/-g[0-9a-f]+$/-g<sha>/'      # 2 commits past v1.0.0
git describe --tags --abbrev=0                               # nearest tag only
git checkout -q v1.0.0
git describe --tags                                          # exactly on the tag -> clean`,
        output: `--- object types ---
v0.9.0 -> commit
v1.0.0 -> tag
--- annotated tag carries metadata ---
tag dev Release 1.0.0
--- git describe: locate any build in history ---
v1.0.0-2-g<sha>
v1.0.0
v1.0.0`,
        explain: 'The two tag forms are different kinds of thing. A lightweight tag is only a reference file holding a commit hash, so asking git for the type of the object it names returns commit — there is no tag object, just a pointer with a name. An annotated tag is a real object in the store with its own hash, containing the tagger identity, a timestamp, a message, and optionally a signature; asking for its type returns tag, and its metadata can be read out. Release tooling and git describe rely on this metadata, which is why releases should use annotated tags. The describe command locates the current commit relative to the nearest tag: when the working position is two commits beyond the last tag it reports the tag name, the number of commits since, and an abbreviated hash of the current commit, which together uniquely identify the build and where it sits in history. Asking only for the nearest tag drops the offset. When the current commit is exactly the tagged one, describe prints just the clean version string with no offset, which is how a release build gets a version number like v1.0.0 while any other build gets v1.0.0-N-g<sha> telling you precisely how far past the release it is.',
        explainHi: 'Do tag forms alag kinds of thing hain. Ek lightweight tag sirf ek reference file hai jo ek commit hash rakhती hai, to git se us object ke type ke liye poochना jise ye name karता hai commit return karता hai — koi tag object nahi, bस ek naam ke saath ek pointer. Ek annotated tag store mein ek real object hai apne hash ke saath, jismें tagger identity, ek timestamp, ek message, aur optionally ek signature hai; iske type ke liye poochना tag return karता hai. Release tooling aur git describe is metadata par rely karते hain, isliye releases ko annotated tags use karना chahiye. Describe command current commit ko nearest tag ke relative locate karता hai: jab working position last tag se do commits aage hai ye tag name, tab se commits ki sankhya, aur current commit ka ek abbreviated hash report karता hai. Jab current commit exactly tagged wala hai, describe sirf clean version string print karता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# calling a breaking change a minor bump because "it's just a small change"
# 2.3.0 -> 2.4.0 : "removed the deprecated 'username' field, everyone should use 'handle' by now"
# -> every consumer on ^2.3.0 auto-upgrades to 2.4.0 (SemVer says minor is safe)
//    and breaks in production. you violated the contract SemVer *is*.`,
        right: `# the size of the diff is irrelevant. SemVer is about COMPATIBILITY:
#   does any previously-working usage stop working?  -> MAJOR. no exceptions.
#   removing/renaming a field, changing a default, tightening validation,
#   changing an error type, dropping a platform  -> all MAJOR.
# 2.3.0 -> 3.0.0, with a migration note. consumers opt in deliberately.
# if you truly can't do a major bump, keep the old field working (deprecate, don't remove).`,
        why: 'Semantic versioning is a promise to consumers about what an upgrade will do: a patch or minor increment asserts that everything which worked before still works, so tooling and people upgrade within a major version automatically and without checking. The promise is about compatibility, not about how large or how justified the change is. Removing a field, renaming one, changing a default value, making validation stricter, or altering the type of an error are all changes that can break code which depended on the previous behaviour, regardless of how small the diff looks or how reasonable the change seems. Releasing such a change as a minor bump means every consumer who allowed automatic minor upgrades receives it without warning and breaks, and the breakage appears in their production rather than in a deliberate upgrade step. The correct response is either to increment the major version and provide migration notes, so consumers adopt it intentionally, or, if a major bump is not acceptable, to preserve the old behaviour alongside the new — deprecate the field but keep it working — so that nothing that previously worked stops working within the major version.',
        whyHi: 'Semantic versioning consumers ko ek promise hai ki ek upgrade kya karega: ek patch ya minor increment assert karता hai ki jo kुछ pehle kaam karता tha abhi bhi kaam karता hai, to tooling aur log ek major version ke andar automatically upgrade karते hain bina check kiye. Promise compatibility ke baare mein hai, na ki change kitna baड़ा ya justified hai. Ek field remove karना, ek rename karना, ek default value change karना, validation stricter banाना — sab aisे changes hain jo code toड़ sakते hain jo previous behaviour par depend karता tha. Aisा change ek minor bump ke roop mein release karना matlab har consumer jisne automatic minor upgrades allow kiye ise bina warning ke receive karता hai aur toड़ता hai. Correct response ya to major version increment karना hai, ya, agar ek major bump acceptable nahi hai, purane behaviour ko naye ke saath preserve karना hai.',
      },
      {
        wrong: `# re-tagging a release after finding a bug
$ git tag -f v1.4.0 HEAD          # "fixed" v1.4.0 to point at the fix
$ git push -f origin v1.4.0
# -> anyone who pulled v1.4.0 yesterday has DIFFERENT code than someone who
//    pulls it today, both called "v1.4.0". CI caches keyed on the tag are now
//    stale. released artifacts already say 1.4.0. "which v1.4.0?" forever.`,
        right: `# a tag is immutable once it's been pushed / fetched. found a bug in v1.4.0?
#   -> commit the fix, cut v1.4.1 (a normal patch release).
# the only safe re-tag is one you created seconds ago and NOBODY has fetched
# (and even then, prefer not to build the habit).
# releases are historical facts; you add to the history, you don't edit it.`,
        why: 'A version tag is meant to be a permanent, unambiguous name for one specific commit, and everything downstream relies on that: people who fetched the tag, CI systems that cache build results keyed by tag, published artifacts stamped with the version, and documentation that refers to it. Moving the tag to a different commit after it has been distributed means the same name now refers to two different states of the code depending on when someone fetched it, so there is no longer a single answer to what that version contains. Caches that assumed the tag was stable serve outdated results, artifacts already published under the version do not match the retagged source, and any later investigation into that version has to account for the ambiguity. The correct way to fix a defect found in a release is the same as fixing any other bug: commit the fix and cut the next patch release, adding a new immutable point to the history. Retagging is only safe in the narrow case where the tag was created moments ago and has not left the local repository, and even then it is better not to rely on it.',
        whyHi: 'Ek version tag ek specific commit ke liye ek permanent, unambiguous naam honा chahiye, aur har downstream cheez us par rely karती hai: log jinhone tag fetch kiya, CI systems jo tag se keyed build results cache karते hain, published artifacts jo version se stamped hain, aur documentation jo ise refer karती hai. Tag ko ek alag commit par move karना iske distributed hone ke baad matlab same naam ab code ke do alag states ko refer karता hai. Caches jinhone assume kiya tag stable tha outdated results serve karते hain, version ke under already published artifacts retagged source se match nahi karते. Ek release mein mile defect ko fix karने ka correct tarika kisi doosरे bug ko fix karने jaisा hai: fix commit karो aur agला patch release cut karो, history mein ek naya immutable point add karके.',
      },
      {
        wrong: `# a codebase with 6 months of "wip", "fix", "更新", "asdf", "address review"
# commit messages
# -> can't generate a changelog. can't auto-version. 'git log' tells you nothing.
#    every release, someone hand-writes notes by diffing and guessing.
#    "what changed between 3.2 and 3.4?" -> an afternoon of git archaeology.`,
        right: `# adopt Conventional Commits and ENFORCE it (cheap):
#   - a commit-msg git hook (or commitlint) rejects non-conforming messages locally
#   - a CI check on the PR (lint the PR title if you squash-merge)
#   - a short team convention doc: the ~10 types, when to use '!', scopes you use
# now: 'git log --oneline' is a changelog draft, versioning is automatic, and
# "what changed" is 'git log v3.2.0..v3.4.0'.`,
        why: 'Commit messages are the only per-change record that travels with the code forever, and when they carry no consistent information the history becomes unusable for anything except line-by-line diffing. Release notes then have to be reconstructed by hand every time, by examining diffs and remembering context, which is slow and error-prone and gets worse as the gap between releases grows. Version numbers cannot be derived automatically because nothing distinguishes a bug fix from a feature from a breaking change. Answering what changed between two versions becomes an investigation rather than a query. Adopting a parseable commit convention fixes all of this at once, and enforcing it is inexpensive: a local hook rejects a malformed message before the commit is created, a CI check catches anything that slips through, and a brief written convention keeps the team consistent about which type to use and how breaking changes are marked. With that in place the log itself is a draft changelog, versioning is a computation, and the history is queryable.',
        whyHi: 'Commit messages ek per-change record hain jo code ke saath hamesha travel karता hai, aur jab wo koi consistent information carry nahi karते history line-by-line diffing ke alawa kisi cheez ke liye unusable ban jати hai. Release notes phir har baar hand se reconstruct karने padते hain, diffs examine karके aur context yaad karके, jo slow aur error-prone hai. Version numbers automatically derive nahi ho sakते kyunki kुछ bhi ek bug fix ko ek feature se ek breaking change se distinguish nahi karता. Do versions ke beech kya badla answer karना ek query ke bजaay ek investigation ban jата hai. Ek parseable commit convention adopt karना ye sab ek saath fix karता hai, aur ise enforce karना inexpensive hai: ek local hook, ek CI check, aur ek brief written convention.',
      },
    ],

    realWorld: [
      {
        en: '**A library that broke half its users** by removing a config option in a minor release — it was "deprecated for a year". Post-mortem action: a CI check that fails any PR removing a public export unless the PR title has `!`, forcing a conscious major-bump decision.',
        hi: '**Ek library jisne apne aadhे users toड़ diye** ek minor release mein ek config option remove karके. Post-mortem: ek CI check jo koi bhi PR fail karता hai jo ek public export remove karта hai jab tak PR title mein `!` na ho.',
      },
      {
        en: '**"Which v2.1.0 do you have?"** — a maintainer had force-moved the tag twice during a bad release day. Three different artifacts existed as "2.1.0". The team banned `git tag -f` on pushed tags and switched to `release-please`.',
        hi: '**"Aapके paas kaunसा v2.1.0 hai?"** — ek maintainer ne ek bad release day ke dauran tag ko do baar force-move kiya tha. Teen alag artifacts "2.1.0" ke roop mein exist karते thे.',
      },
      {
        en: '**A `/version` endpoint returning `git describe` output (`v4.7.2-13-gc4f1a90`)** made incident triage instant — the value pasted straight into `git log` / `git checkout` to see exactly what was running. Adopted service-wide.',
        hi: '**Ek `/version` endpoint jo `git describe` output return karता hai** ne incident triage instant banाya — value seedha `git log` mein paste hoती hai exactly dekhने ke liye ki kya chal raha tha.',
      },
    ],

    interviewQA: [
      {
        q: 'Explain semantic versioning and how it maps to Conventional Commits.',
        qHi: 'Semantic versioning samjhाओ aur ye Conventional Commits par kaise map hoता hai.',
        a: 'Semantic versioning gives a release a three-part number, major dot minor dot patch, where each part communicates the compatibility impact of the change relative to the last release. A patch increment means only backward-compatible bug fixes, safe to adopt without reading anything. A minor increment means new backward-compatible functionality was added; existing usage is unaffected, there is just more available, also safe to adopt. A major increment means something incompatible changed, so code that worked before might not, and a consumer should read the migration notes before upgrading. There is extra syntax: a hyphenated suffix like rc.1 or beta.2 marks a pre-release that sorts before the plain version and is not considered stable, a plus suffix carries build metadata that is ignored for ordering, and the entire zero-dot-y-dot-z range is initial development with no compatibility guarantee at all. The key point is that SemVer describes compatibility, not the size or importance of a change. Conventional Commits maps onto it directly: any commit marked breaking, by an exclamation mark before the colon or a BREAKING CHANGE footer, forces a major bump; otherwise any feat commit makes it a minor bump; otherwise a fix or perf commit makes it a patch. A release tool takes the highest-impact change among all commits since the last release tag and computes the new version from that.',
        aHi: 'Semantic versioning ek release ko ek three-part number deता hai, major dot minor dot patch, jahaan har part last release ke relative change ka compatibility impact communicate karता hai. Ek patch increment matlab sirf backward-compatible bug fixes, bina kुछ padhे adopt karना safe. Ek minor increment matlab new backward-compatible functionality add hui; existing usage unaffected. Ek major increment matlab kुछ incompatible badla, to code jo pehle kaam karता tha shायद nahi. Extra syntax: ek hyphenated suffix jaisे rc.1 ek pre-release mark karता hai jo plain version se pehle sort hoता hai; ek plus suffix build metadata carry karता hai jo ordering ke liye ignored hai; aur poora zero-dot-y-dot-z range initial development hai. Key point: SemVer compatibility describe karता hai, size nahi. Conventional Commits ise directly map karता hai: koi breaking commit → major; warna koi feat → minor; warna ek fix/perf → patch.',
      },
      {
        q: 'What is the difference between a lightweight and an annotated tag, and why do releases need annotated tags?',
        qHi: 'Ek lightweight aur ek annotated tag ke beech kya difference hai, aur releases ko annotated tags kyun chahिए?',
        a: 'A lightweight tag is just a named reference: a small file under refs/tags containing a commit hash, with nothing else — no author, no date, no message. It is essentially a branch that is not expected to move. An annotated tag is a full object in the git object store, with its own hash, that contains the identity and email of the person who created it, a timestamp, a message, and optionally a cryptographic signature, and which in turn points at the commit being tagged. Releases should use annotated tags for several reasons. The git describe command, which is the standard way to produce a version string that locates a build in history, only considers annotated tags by default. Release automation and package managers expect the metadata an annotated tag carries. A signature on the tag lets consumers verify that a release genuinely came from the maintainer. And the message on the tag is a natural place for a short release summary. Separately from the tag type, tags are meant to be immutable once pushed: moving a tag after others have fetched it means the same version name refers to different code for different people and invalidates any caching or published artifact keyed to it, so a defect in a release is fixed by cutting the next patch version, not by retagging.',
        aHi: 'Ek lightweight tag bस ek named reference hai: refs/tags ke under ek small file jismें ek commit hash hai, aur kुछ nahi — koi author nahi, koi date nahi, koi message nahi. Ek annotated tag git object store mein ek full object hai, apne hash ke saath, jismें ise create karने wale ki identity aur email, ek timestamp, ek message, aur optionally ek signature hai. Releases ko annotated tags use karना chahiye kई reasons ke liye. git describe command, jo ek version string produce karने ka standard tarika hai, default se sirf annotated tags consider karता hai. Release automation aur package managers metadata expect karते hain. Tag par ek signature consumers ko verify karने deता hai ki ek release genuinely maintainer se aayी. Tag type se alag, tags push hone ke baad immutable honे chahiye.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, write 5 conventional-commit messages: a feature with a scope, a bug fix, a breaking change using `!`, a breaking change using the footer, and a docs change. Then state which of the 5 forces a MAJOR bump, which forces MINOR, and which forces PATCH.',
        taskHi: 'Ek comment mein, 5 conventional-commit messages likho.',
        hint: 'e.g. `feat(search): add fuzzy matching` (MINOR); `fix: handle empty result set in pagination` (PATCH); `refactor(api)!: remove v1 response envelope` (MAJOR — the `!`); `feat: switch date fields to ISO 8601` + body line `BREAKING CHANGE: consumers parsing the old d/m/y format must update` (MAJOR — the footer); `docs: document the retry-backoff config` (PATCH, or no bump at all — docs-only). MAJOR is forced by either breaking marker; MINOR by any `feat` with no breaking marker; PATCH by `fix`/`perf`.',
        hintHi: 'e.g. `feat(search): add fuzzy matching` (MINOR); `fix: handle empty result set` (PATCH); `refactor(api)!: remove v1 envelope` (MAJOR — `!`); `feat: switch to ISO 8601` + `BREAKING CHANGE: ...` footer (MAJOR — footer); `docs: document retry config` (PATCH/no bump). MAJOR = koi bhi breaking marker; MINOR = koi `feat` bina breaking marker; PATCH = `fix`/`perf`.',
      },
      {
        task: 'In a comment, explain why removing a deprecated-for-a-year field is still a MAJOR bump, not MINOR — and the two options if you "can\'t" do a major bump.',
        taskHi: 'Ek comment mein, samjhाओ kyun ek deprecated-for-a-year field remove karना abhi bhi ek MAJOR bump hai.',
        hint: 'SemVer is about COMPATIBILITY, not the size or age of the change. If any previously-working usage stops working, it\'s MAJOR — no exceptions. Consumers on `^2.x` auto-upgrade across minors *without checking*, trusting the contract that minor = safe; shipping a removal as minor breaks them silently in their production. How long it was deprecated doesn\'t change that a consumer might still be using it. Options if you can\'t do a major: (1) don\'t remove it — keep the deprecated field working (log a warning, document the replacement) until the next planned major; (2) if there\'s genuinely a major coming, batch the removal into it with a migration guide. "Deprecated" is a signal, not permission to remove in a minor.',
        hintHi: 'SemVer COMPATIBILITY ke baare mein hai, change ke size ya age ke baare mein nahi. Agar koi previously-working usage kaam karना band karता hai, ye MAJOR hai — koi exceptions nahi. `^2.x` par consumers minors ke across auto-upgrade karते hain BINA check kiye. Kितने samay deprecated tha ye nahi badalता ki ek consumer abhi bhi use kar raha ho. Options: (1) ise remove mat karो — deprecated field ko kaam karता rakhо agले planned major tak; (2) agला major aane par removal ise mein batch karो ek migration guide ke saath.',
      },
      {
        task: 'In a comment, describe the 6 steps of an automated release, and explain what `git describe --tags` returns for (a) a build exactly on tag v2.0.0 and (b) a build 5 commits later — and why that\'s a good `/version` value.',
        taskHi: 'Ek comment mein, ek automated release ke 6 steps describe karो.',
        hint: 'Steps: (1) commits land on `main` with conventional messages via PRs; (2) a release tool reads all commits since the last release tag; (3) it picks the bump — MAJOR if any breaking, else MINOR if any feat, else PATCH — and computes the version; (4) it updates the CHANGELOG (grouped Features/Fixes/Breaking, linked to commits/PRs) and bumps version files (package.json etc); (5) it commits that, creates an ANNOTATED tag `vX.Y.Z`, opens a Release with the notes; (6) a CI workflow triggered BY THE TAG builds artifacts from that exact commit and publishes them. `git describe --tags`: (a) exactly on v2.0.0 → `v2.0.0`; (b) 5 commits later → `v2.0.0-5-g<short-sha>`. Good `/version` value because it uniquely and precisely locates the running build in history — paste it into `git log`/`git checkout` to see exactly what\'s deployed during an incident.',
        hintHi: 'Steps: (1) commits conventional messages ke saath `main` par land; (2) tool last release tag se commits padhता hai; (3) bump pick karता hai — MAJOR/MINOR/PATCH; (4) CHANGELOG update + version files bump; (5) commit, ANNOTATED tag `vX.Y.Z`, Release; (6) TAG dwara triggered CI us commit se artifacts build + publish. `git describe --tags`: (a) v2.0.0 par → `v2.0.0`; (b) 5 commits baad → `v2.0.0-5-g<sha>`. Achha `/version` value kyunki ye running build ko history mein precisely locate karता hai.',
      },
    ],

    keyTakeaways: [
      'CONVENTIONAL COMMITS: `<type>(<scope>)<!>: <summary>` + optional body + optional footers. Types: feat, fix, perf, refactor, docs, test, build, ci, style, chore, revert. BREAKING marked two ways (either suffices): a `!` before the colon (`feat(api)!: ...`) OR a `BREAKING CHANGE: ...` footer. The payoff: tooling reads commits since the last release and MECHANICALLY decides the version, groups the changelog, and flags breaking changes; `git log` becomes human-scannable. Cost: discipline — enforce with a `commit-msg` hook / commitlint + a CI check (lint the PR title if you squash-merge).',
      'SEMANTIC VERSIONING `MAJOR.MINOR.PATCH` communicates COMPATIBILITY (not diff size!): PATCH = backward-compatible bug fixes only (safe, read nothing); MINOR = new backward-compatible functionality (safe); MAJOR = an incompatible change — something that worked may not; READ the migration notes. Pre-release `2.0.0-rc.1` sorts BEFORE `2.0.0`; build metadata `1.4.1+build.5` is ignored for precedence; `0.y.z` = initial development, NO stability promise until `1.0.0`. Map from Conventional Commits: any breaking → MAJOR; any `feat` → MINOR; `fix`/`perf` → PATCH — take the highest-impact change since the last release. Removing/renaming a field, changing a default, tightening validation, changing an error type = ALL MAJOR regardless of how small or how long deprecated.',
      'TAGS name one commit. LIGHTWEIGHT (`git tag v1.4.0`) = just a ref file with a sha, no metadata (`git cat-file -t` says `commit`). ANNOTATED (`git tag -a v1.4.0 -m ...`) = a real object with tagger, date, message, optional GPG/SSH signature (`git cat-file -t` says `tag`). USE ANNOTATED for releases — `git describe` only considers them by default and release tooling expects the metadata. Tags do NOT push automatically (`git push --tags` or `git push origin v1.4.0`). Tags are IMMUTABLE once fetched — re-tagging with `git tag -f` means "which v1.4.0?" forever (stale caches, mismatched published artifacts); a bug in a release → cut the next PATCH, never re-tag.',
      'A RELEASE ties together a tagged commit + human-readable notes + built/published artifacts. Automated: (1) commits land on `main` (conventional messages) via PRs; (2) a tool reads all commits since the last release tag; (3) it picks MAJOR/MINOR/PATCH and computes the version; (4) it updates the CHANGELOG (grouped Features/Fixes/Breaking, linked to commits+PRs) and bumps version files; (5) it commits that, creates an ANNOTATED tag `vX.Y.Z`, opens a Release; (6) a CI workflow triggered BY THE TAG builds artifacts from that exact commit and publishes (registry/image/binaries). Tools: semantic-release, release-please, changesets, git-cliff, goreleaser.',
      '`git describe --tags` → `v1.4.0-7-g<sha>` = "7 commits past v1.4.0, at commit <sha>"; on the exact tagged commit it prints just `v1.4.0`. It\'s an excellent `--version` string / build stamp and `/version` endpoint value because it PRECISELY locates any build in history — paste it into `git log`/`git checkout` during an incident. FOR INTERNAL continuously-deployed services with no external consumers, strict SemVer + hand-written notes often don\'t apply — but you STILL want an immutable identifier for every deployable build (a tag, a monotonic build number, or the commit sha) stamped into the artifact and exposed at `/version`, so you can always answer "what exactly is running here" and correlate an incident to a commit.',
    ],
    keyTakeawaysHi: [
      'CONVENTIONAL COMMITS: `<type>(<scope>)<!>: <summary>` + optional body + footers. Types: feat, fix, perf, refactor, docs, test, build, ci, style, chore, revert. BREAKING do tarike se marked: colon se pehle ek `!` YA ek `BREAKING CHANGE: ...` footer. Payoff: tooling last release se commits padhता hai aur MECHANICALLY version decide karता hai, changelog group karता hai. Cost: discipline — ek `commit-msg` hook + ek CI check se enforce karो.',
      'SEMANTIC VERSIONING `MAJOR.MINOR.PATCH` COMPATIBILITY communicate karता hai (diff size nahi!): PATCH = sirf backward-compatible bug fixes; MINOR = new backward-compatible functionality; MAJOR = ek incompatible change — migration notes PADHО. Pre-release `2.0.0-rc.1` `2.0.0` se PEHLE sort hoता hai; `0.y.z` = koi stability promise nahi. Map: koi breaking → MAJOR; koi `feat` → MINOR; `fix`/`perf` → PATCH. Ek field remove/rename karना, ek default change karना = SAB MAJOR chahे kitna chhoटा ya kitna lamba deprecated.',
      'TAGS ek commit ko name karते hain. LIGHTWEIGHT (`git tag v1.4.0`) = bस ek ref file, koi metadata nahi. ANNOTATED (`git tag -a v1.4.0 -m ...`) = ek real object tagger, date, message, optional signature ke saath. Releases ke liye ANNOTATED USE karो — `git describe` sirf unhe default se consider karता hai. Tags automatically push NAHI hote (`git push --tags`). Tags fetch hone ke baad IMMUTABLE hain — re-tagging matlab "kaunसा v1.4.0?" hamesha ke liye; ek release mein bug → agला PATCH cut karो, kabhi re-tag nahi.',
      'Ek RELEASE tie karता hai: ek tagged commit + human-readable notes + built/published artifacts. Automated: (1) commits `main` par land (conventional messages) via PRs; (2) ek tool last release tag se commits padhता hai; (3) MAJOR/MINOR/PATCH pick karता hai; (4) CHANGELOG update + version files bump; (5) commit, ANNOTATED tag `vX.Y.Z`, Release; (6) TAG dwara triggered CI workflow us commit se artifacts build + publish karता hai. Tools: semantic-release, release-please, changesets, git-cliff, goreleaser.',
      '`git describe --tags` → `v1.4.0-7-g<sha>` = "v1.4.0 se 7 commits aage, commit <sha> par"; exact tagged commit par ye sirf `v1.4.0` print karता hai. Ye ek excellent `--version` string / `/version` endpoint value hai kyunki ye kisi bhi build ko history mein PRECISELY locate karता hai. INTERNAL continuously-deployed services ke liye jiske koi external consumers nahi, strict SemVer aksar apply nahi hoता — par aap ABHI BHI har deployable build ke liye ek immutable identifier chाहते ho (ek tag, ek monotonic build number, ya commit sha) artifact mein stamped aur `/version` par exposed.',
    ],
  },

  {
    slug: 'ops-monorepo-polyrepo-hooks-and-git-as-source-of-truth',
    title: 'Monorepo vs Polyrepo, Hooks & Git as the Source of Truth',
    titleHi: 'Monorepo vs Polyrepo, Hooks Aur Git As Source Of Truth',
    description: 'Whether all your code lives in one repository or many is a trade-off between atomic cross-cutting changes and independent team autonomy, and it shapes your tooling. Git hooks run your checks at commit and push time. And treating git as the authoritative record of desired state is the idea GitOps is built on.',
    descriptionHi: 'Kya aapका saara code ek repository mein rehता hai ya kई ek atomic cross-cutting changes aur independent team autonomy ke beech ek trade-off hai, aur ye aapki tooling shape karता hai. Git hooks aapke checks ko commit aur push time par chalाते hain. Aur git ko desired state ke authoritative record ke roop mein treat karना wo idea hai jispar GitOps banा hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 6,

    analogy: {
      en: '**One big workshop versus a street of separate workshops.** In the one big workshop (monorepo), if you change the design of a part, you can update every machine that uses it in the same motion, and everyone sees the same version of every blueprint — but you need a serious organising system or people trip over each other. On the street of workshops (polyrepo), each shop runs itself, sets its own hours, and keeps its own tidy space — but changing a shared part means walking a new spec down the street and hoping each shop adopts it, and no two shops are quite in sync. **Hooks** are the checklist taped by the door that you run through before a part leaves the bench. And **git as source of truth** is the rule that the master blueprint cabinet — not what happens to be bolted to the floor right now — defines what the workshop is supposed to look like.',
      hi: '**Ek baड़ी workshop versus separate workshops ki ek street.** Ek baड़ी workshop (monorepo) mein, agar aap ek part ka design change karते ho, aap same motion mein har machine update kar sakते ho jo ise use karती hai — par aapको ek serious organising system chahiye. Workshops ki street (polyrepo) par, har shop khud ko chalाती hai, apne hours set karती hai — par ek shared part change karना matlab ek naya spec street ke neeche walk karना. **Hooks** wo checklist hai jo door par tape ki hui hai jise aap ek part bench se jaane se pehle run karते ho. Aur **git as source of truth** wo rule hai ki master blueprint cabinet — na ki jo abhi floor par bolted hai — define karता hai workshop kaisी honी chahiye.',
    },

    simple: `**MONOREPO — many projects, ONE repository:**
\`\`\`
+ ONE commit can change a shared lib AND every consumer atomically (no version dance)
+ one version of everything; find-all-references actually works; shared tooling/CI config
+ easy large-scale refactors; visible cross-team impact
- needs scale tooling: sparse checkout, a build system that only builds what changed
  (Bazel/Nx/Turborepo/Pants), CODEOWNERS, path-filtered CI, maybe a virtual filesystem
- clone/checkout size; CI must be smart or every push builds the world
- looser blast-radius isolation; one bad commit can wedge everyone
\`\`\`

**POLYREPO — one repository per project/service:**
\`\`\`
+ team autonomy: own release cadence, own CI, own access control, small clones
+ hard module boundaries; a service's blast radius is its repo
- a cross-cutting change = N PRs across N repos, coordinated, landing at different times
- diamond-dependency / version-skew hell; "which version of the shared lib?" everywhere
- tooling/config drift between repos; duplicated CI
\`\`\`
Neither is "correct". Big product companies often trend monorepo; loosely-coupled orgs, polyrepo.

**GIT HOOKS — scripts git runs at lifecycle points (in .git/hooks/, or core.hooksPath):**
\`\`\`
CLIENT-SIDE (local, bypassable with --no-verify — advisory, not security):
  pre-commit      before the commit is created — format, lint, quick tests, secret scan
  commit-msg      gets the message file — enforce Conventional Commits
  pre-push        before a push — run the test suite, block pushing to protected branches
SERVER-SIDE (on the remote — actually enforced):
  pre-receive / update   reject pushes that violate policy (but branch protection usually
                         does this on hosted git)
\`\`\`
Manage them with a framework (pre-commit, Husky, Lefthook) so they're versioned + installed
for everyone — not hand-copied into .git/hooks.

**HOOKS ARE A FAST FEEDBACK LOOP, NOT A GATE.** \`--no-verify\` bypasses them. The real gate
is CI + branch protection. Keep hooks FAST (< a few seconds) or people disable them.

**GIT AS THE SINGLE SOURCE OF TRUTH:**
\`\`\`
- the repo is the authoritative record of what the code + config + infra SHOULD be
- every change is a commit: reviewed, attributed, reversible, audited — no out-of-band edits
- IaC (Module 12) puts infrastructure in git; GitOps (Module 20) puts the DEPLOYED STATE
  in git and a controller continuously makes reality match the repo
- "what's in prod?" = "what's the SHA on the deploy branch" — not "let me SSH in and look"
\`\`\``,

    simpleHi: `**MONOREPO — kई projects, ONE repository:**
\`\`\`
+ ONE commit ek shared lib AUR har consumer ko atomically change kar sakта hai
+ sab кुछ ka ek version; find-all-references actually kaam karता hai; shared tooling/CI config
+ easy large-scale refactors; visible cross-team impact
- scale tooling chahिए: sparse checkout, ek build system jo sirf changed build karता hai
  (Bazel/Nx/Turborepo/Pants), CODEOWNERS, path-filtered CI
- clone/checkout size; CI smart honा chahिए warna har push world build karता hai
- looser blast-radius isolation; ek bad commit sabको wedge kar sakта hai
\`\`\`

**POLYREPO — per project/service ek repository:**
\`\`\`
+ team autonomy: apna release cadence, apna CI, apna access control, small clones
+ hard module boundaries; ek service ka blast radius iska repo hai
- ek cross-cutting change = N repos ke across N PRs, coordinated, alag times par landing
- diamond-dependency / version-skew hell; "shared lib ka kaunसा version?" har jagah
- repos ke beech tooling/config drift; duplicated CI
\`\`\`
Koi bhi "correct" nahi. Big product companies aksar monorepo trend karती hain.

**GIT HOOKS — scripts jo git lifecycle points par chalाता hai (.git/hooks/ mein, ya core.hooksPath):**
\`\`\`
CLIENT-SIDE (local, --no-verify se bypassable — advisory, security nahi):
  pre-commit      commit banने se pehle — format, lint, quick tests, secret scan
  commit-msg      message file paता hai — Conventional Commits enforce karो
  pre-push        ek push se pehle — test suite chalाओ, protected branches ko push block karो
SERVER-SIDE (remote par — actually enforced):
  pre-receive / update   policy violate karने wale pushes reject karो
\`\`\`
Unhe ek framework se manage karो (pre-commit, Husky, Lefthook) taki wo versioned + sabke liye installed hain.

**HOOKS EK FAST FEEDBACK LOOP HAIN, EK GATE NAHI.** \`--no-verify\` unhe bypass karता hai. Real gate CI + branch protection hai. Hooks FAST rakhо.

**GIT AS THE SINGLE SOURCE OF TRUTH:**
\`\`\`
- repo authoritative record hai ki code + config + infra kya HONA chahिए
- har change ek commit hai: reviewed, attributed, reversible, audited — koi out-of-band edits nahi
- IaC infrastructure ko git mein rakhता hai; GitOps DEPLOYED STATE ko git mein rakhता hai aur ek
  controller continuously reality ko repo se match karवाता hai
- "prod mein kya hai?" = "deploy branch par SHA kya hai" — na ki "SSH karके dekhता hoon"
\`\`\``,

    content: `## Monorepo versus polyrepo

The question is whether an organisation's code lives in one large repository or is split across many, one per service or library or team.

### Monorepo

**Advantages:**

- **Atomic cross-cutting changes.** A change to a shared library and every consumer of it is one commit, one PR, one review, merged together. There is no publishing a new library version and then chasing consumers to adopt it, and no window where consumers are on different versions.
- **One version of everything.** At any commit there is exactly one version of every internal library. "Which version does this service use" is not a question.
- **Global tooling.** One CI configuration, one set of lint rules, one formatter, one dependency policy, applied everywhere.
- **Large-scale refactors and visibility.** Renaming an API across fifty services is mechanical; the impact of a change is visible in one place; find-all-references is exhaustive.

**Costs:**

- **Scale tooling is mandatory.** Beyond a certain size you need: **sparse checkout** or a virtual filesystem so a clone is not enormous; a **build system that builds and tests only what a change affects** (Bazel, Buck, Pants, or Nx / Turborepo for JS); **path-filtered CI** so a docs change does not run every test; and \`CODEOWNERS\` to route reviews.
- **CI must be smart or slow.** Without affected-target detection, every push tries to build and test the entire repository.
- **Weaker isolation.** A broken commit, a bad shared dependency, or a CI outage can block every team at once. Access control is coarser (though sub-tree permissions exist).

### Polyrepo

**Advantages:**

- **Team autonomy.** Each team owns its repository's release cadence, CI, branch rules, and access. Clones are small and fast.
- **Hard boundaries.** A service's blast radius is its repository. Dependencies between services are explicit, versioned artifacts.

**Costs:**

- **Cross-cutting changes are painful.** A change touching N services is N pull requests across N repositories, coordinated by hand, reviewed separately, and merged at different times — so there is always a period where some services have the change and some do not.
- **Version skew.** Services depend on different versions of shared libraries; a diamond dependency (A and B both used by C, both depending on different versions of D) has to be resolved; upgrading a shared library everywhere is a long campaign.
- **Drift.** CI configuration, tooling versions, and conventions diverge between repositories unless actively synchronised.

Neither model is correct in general. Large product companies with heavy code sharing often trend toward monorepos; organisations built from loosely coupled services and autonomous teams often prefer polyrepos. Many run a hybrid — a monorepo per broad domain.

## Git hooks

A **hook** is a script git executes automatically at a point in its workflow. Hooks live in \`.git/hooks/\` by default, or in a directory pointed to by \`core.hooksPath\` (which is how frameworks install shared hooks). A non-zero exit from a hook aborts the operation.

### Client-side hooks (local, advisory)

- **\`pre-commit\`** — runs before the commit object is created. Format staged files, run the linter, run fast unit tests for the changed area, scan for secrets and large files. The most-used hook.
- **\`prepare-commit-msg\` / \`commit-msg\`** — \`commit-msg\` receives the path to the message file and can validate or reject it; this is where Conventional Commits is enforced.
- **\`pre-push\`** — runs before a push. Run the full test suite, block pushes to protected branches from local, check that you are not pushing WIP commits.
- **\`post-checkout\` / \`post-merge\`** — run after switching branches or merging; commonly used to reinstall dependencies if the lockfile changed.

Client-side hooks are **bypassable with \`git commit --no-verify\`** (and \`push --no-verify\`). They are a **fast local feedback loop**, not an enforcement mechanism — treat them as "catch it before you even push", not "this cannot get through".

### Server-side hooks (enforced)

- **\`pre-receive\` / \`update\`** — run on the remote when it receives a push, and can reject it: enforce commit-message policy, block force-pushes, require signatures, reject large files. On hosted platforms (GitHub, GitLab) this role is largely filled by branch protection rules and push rules in the UI, but self-hosted git and Gerrit use these hooks directly.

### Managing hooks

Hooks in \`.git/hooks/\` are **not version-controlled and not shared** — a hand-placed hook exists only in one clone. Use a framework so hooks are defined in a committed config file and installed for everyone:

- **pre-commit** (the Python tool, language-agnostic) — a \`.pre-commit-config.yaml\` listing hooks from a registry; \`pre-commit install\` wires it up.
- **Husky** (JS ecosystem) — hooks committed under \`.husky/\`, installed on \`npm install\`.
- **Lefthook** (Go, fast, parallel) — one YAML config, language-agnostic.

Keep hooks **fast** — a pre-commit hook that takes thirty seconds gets disabled. Run the slow, thorough checks in CI.

## Git as the single source of truth

The deeper principle underneath version control, CI, and everything that builds on them: **the repository is the authoritative statement of what the system should be.**

- Every change to the code — and, with Infrastructure as Code, to the infrastructure; and, with GitOps, to what is deployed — is a **commit**: reviewed, attributed to a person, timestamped, reversible, and part of an audit trail. There are no changes made "out of band" by editing a server directly or clicking in a console, because those changes are invisible to the repository and will be overwritten or lost.
- The question "what is running in production" is answered by "what commit is the deploy branch on", not by inspecting the running system. The running system is expected to **match** the repository; a difference is a bug (drift) to be corrected, not a source of truth.
- **Infrastructure as Code** (Module 12) brings servers, networks, and databases under this model — the Terraform or CloudFormation in the repo defines the infrastructure, and \`terraform plan\` shows any drift.
- **GitOps** (Module 20) extends it to deployment: a repository holds the desired state of what should be running (the Kubernetes manifests, the image tags), and a controller in the cluster **continuously reconciles** the actual state to match it. Deploying is merging a commit; rolling back is reverting one; the cluster's state is always traceable to a specific commit.

This is why the branching model, review, protected branches, and commit discipline from this module matter beyond the code itself: once git is the source of truth for infrastructure and deployment too, the controls on the repository are the controls on production.`,

    contentHi: `## Monorepo versus polyrepo

Sawaal ye hai ki ek organisation ka code ek baड़े repository mein rehता hai ya kई ke across split hai, per service/library/team ek.

**Monorepo advantages:** **Atomic cross-cutting changes** (ek shared library aur iske har consumer ka ek change ek commit hai); **sab кुछ ka ek version**; **global tooling** (ek CI configuration, ek set of lint rules); **large-scale refactors aur visibility**.

**Monorepo costs:** **Scale tooling mandatory hai** (sparse checkout, ek build system jo sirf affected build karता hai — Bazel/Nx/Turborepo, path-filtered CI, CODEOWNERS); **CI smart ya slow honा chahिए**; **weaker isolation** (ek broken commit har team ko block kar sakта hai).

**Polyrepo advantages:** **Team autonomy** (har team apna release cadence, CI, branch rules own karती hai; small clones); **hard boundaries** (ek service ka blast radius iska repository hai).

**Polyrepo costs:** **Cross-cutting changes painful hain** (N services ko touch karता ek change N repositories ke across N pull requests hai); **version skew** (services shared libraries ke alag versions par depend karती hain); **drift** (CI configuration, conventions repositories ke beech diverge karते hain).

Koi bhi model general mein correct nahi. Heavy code sharing wali baड़ी product companies aksar monorepos ki taraf trend karती hain; loosely coupled services se banी organisations aksar polyrepos prefer karती hain.

## Git hooks

Ek **hook** ek script hai jo git apne workflow mein ek point par automatically execute karता hai. Hooks \`.git/hooks/\` mein rehते hain default se, ya \`core.hooksPath\` dwara pointed ek directory mein. Ek hook se ek non-zero exit operation abort karता hai.

**Client-side hooks (local, advisory):** **\`pre-commit\`** (commit object banने se pehle — format, lint, fast tests, secret scan); **\`commit-msg\`** (message file paता hai — Conventional Commits enforce karता hai); **\`pre-push\`** (ek push se pehle — full test suite chalाओ). Client-side hooks **\`--no-verify\` se bypassable hain**. Wo ek **fast local feedback loop** hain, ek enforcement mechanism nahi.

**Server-side hooks (enforced):** **\`pre-receive\` / \`update\`** (remote par chalте hain jab ye ek push receive karता hai, aur ise reject kar sakते hain). Hosted platforms par ye role largely branch protection rules dwara filled hai.

**Hooks manage karना:** \`.git/hooks/\` mein hooks **version-controlled aur shared nahi** hain. Ek framework istemal karो (pre-commit, Husky, Lefthook) taki hooks ek committed config file mein defined aur sabke liye installed hain. Hooks **fast** rakhо.

## Git as the single source of truth

Version control ke neeche deeper principle: **repository authoritative statement hai ki system kya honा chahिए.**

- Code ke har change — aur, IaC ke saath, infrastructure ke; aur, GitOps ke saath, jo deployed hai uske — ek **commit** hai: reviewed, ek person ko attributed, reversible, aur ek audit trail ka part. Koi changes "out of band" nahi kiye jाते.
- Sawaal "production mein kya chal raha hai" "deploy branch kaunसे commit par hai" se answer hoता hai, running system inspect karके nahi.
- **Infrastructure as Code** (Module 12) servers, networks, databases ko is model ke under laता hai.
- **GitOps** (Module 20) ise deployment tak extend karता hai: ek repository desired state rakhता hai, aur cluster mein ek controller **continuously reconcile** karता hai. Deploy karना ek commit merge karना hai; rollback karना ek revert karना hai.

Isliye is module se branching model, review, protected branches, aur commit discipline code ke alawa matter karते hain: ek baar git infrastructure aur deployment ke liye bhi source of truth hai, repository par controls production par controls hain.`,

    examples: [
      {
        title: 'A commit-msg hook enforcing Conventional Commits',
        titleHi: 'Ek commit-msg hook jo Conventional Commits enforce karta hai',
        code: `# VERIFY
exec 2>&1
export GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_SYSTEM=/dev/null
export GIT_AUTHOR_NAME=dev GIT_AUTHOR_EMAIL=dev@example.com
export GIT_COMMITTER_NAME=dev GIT_COMMITTER_EMAIL=dev@example.com
export GIT_AUTHOR_DATE='2024-01-01T00:00:00Z' GIT_COMMITTER_DATE='2024-01-01T00:00:00Z'
git init -b main -q

# hooks live in a COMMITTED dir so the whole team gets them:
mkdir -p .githooks
cat > .githooks/commit-msg <<'HOOK'
#!/bin/sh
# $1 = path to the file holding the commit message
pattern='^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\\(.+\\))?!?: .+'
if ! grep -qE "$pattern" "$1"; then
  echo "commit-msg: message must be '<type>[(scope)][!]: <summary>'" >&2
  echo "  types: feat fix docs style refactor perf test build ci chore revert" >&2
  exit 1
fi
HOOK
chmod +x .githooks/commit-msg
git config core.hooksPath .githooks       # point git at the committed hooks

echo x > f && git add f

echo "--- a non-conforming message is REJECTED ---"
git commit -m "fixed the login bug"; echo "exit: $?"

echo "--- a conforming message is ACCEPTED ---"
git commit -qm "fix(auth): handle expired session token"; echo "exit: $?"

echo "--- ...but --no-verify bypasses it entirely ---"
echo y >> f && git commit -a --no-verify -qm "whatever i want"; echo "exit: $?"

git log --oneline | sed -E 's/^[0-9a-f]+/<sha>/'`,
        output: `--- a non-conforming message is REJECTED ---
commit-msg: message must be '<type>[(scope)][!]: <summary>'
  types: feat fix docs style refactor perf test build ci chore revert
exit: 1
--- a conforming message is ACCEPTED ---
exit: 0
--- ...but --no-verify bypasses it entirely ---
exit: 0
<sha> whatever i want
<sha> fix(auth): handle expired session token`,
        explain: 'The hook is a script named for the event it handles, placed in a directory that is part of the repository so it travels with every clone, with git pointed at that directory by the hooks-path setting. When a commit is made, git runs the commit-msg hook and passes it the path to a temporary file containing the proposed message. The script checks that message against a pattern for the conventional format and exits non-zero if it does not match, which causes git to abort the commit and show the script\'s error output. A message that does match passes through and the commit succeeds. This gives an author immediate, local feedback the moment they write a bad message, rather than discovering it in CI minutes later. The final step shows the essential limitation: passing the no-verify flag tells git to skip all hooks, and the malformed commit goes through. Client-side hooks are therefore a convenience that catches mistakes early for people who have them installed and do not bypass them; they are not a control that guarantees anything about what reaches the shared branch. That guarantee has to come from a check that runs on the server or in CI, where the author cannot opt out.',
        explainHi: 'Hook ek script hai jo us event ke liye named hai jise ye handle karता hai, ek directory mein rakhा jo repository ka part hai to ye har clone ke saath travel karता hai, git ko us directory par hooks-path setting se pointed. Jab ek commit banता hai, git commit-msg hook chalाता hai aur ise proposed message wali ek temporary file ka path pass karता hai. Script us message ko conventional format ke ek pattern ke against check karता hai aur non-zero exit karता hai agar ye match nahi karता, jo git ko commit abort karवाता hai. Ye ek author ko immediate, local feedback deता hai. Final step essential limitation dikhता hai: no-verify flag pass karना git ko saare hooks skip karने ke liye kehта hai. Client-side hooks isliye ek convenience hain jo mistakes jaldi catch karती hai; wo ek control nahi hai jo kुछ guarantee karता hai. Wo guarantee ek check se aana chahिए jo server par ya CI mein chalता hai.',
      },
      {
        title: 'Monorepo vs polyrepo: the same change, both ways',
        titleHi: 'Monorepo vs polyrepo: same change, dono tarike',
        code: `# CHANGE: the shared 'auth' library adds a required 'tenantId' arg to verifyToken().
#         3 services call it: web-api, billing-worker, admin-portal.

# ===== MONOREPO =====
# one branch, one PR:
#   /libs/auth/verify.ts            + tenantId param
#   /services/web-api/...           pass tenantId
#   /services/billing-worker/...    pass tenantId
#   /services/admin-portal/...      pass tenantId
# CI (affected-targets): builds+tests auth, web-api, billing-worker, admin-portal (not the rest).
# review: one PR, CODEOWNERS auto-adds @auth-team + the 3 service owners.
# merge: atomic. at NO commit does a service call the old signature. done.

# ===== POLYREPO =====
# repo: shared-auth      PR #1: add tenantId (backward-compatible: make it optional first!)
#                        release v3.4.0
# repo: web-api          PR: bump shared-auth ^3.3 -> ^3.4, pass tenantId. merge. deploy.
# repo: billing-worker   PR: bump + pass tenantId. merge. deploy.
# repo: admin-portal     PR: bump + pass tenantId. merge. deploy.   <- 2 days later
# repo: shared-auth      PR #2: make tenantId REQUIRED, release v4.0.0 (breaking)
#                        ...then bump each of the 3 services AGAIN to ^4.0.
# for ~a week, different services run different shared-auth versions.`,
        output: `In a monorepo the change is one atomic PR: the library and all three callers change together, CI builds only the affected targets, and at no point does any service call the old signature. In a polyrepo it is a sequence of coordinated PRs across four repositories with a deliberately backward-compatible intermediate step, several independent deploys landing at different times, and a window of version skew - the same change, spread over a week.`,
        explain: 'The two repository models turn the same logical change into very different amounts of work. In the single-repository model the shared library and every caller are in one place, so the change is a single branch that modifies the library and updates all three services together, reviewed as one unit with the owners of each affected area automatically included, and merged atomically - meaning there is no moment in the repository\'s history where a service calls the library with the old signature. The build system runs only the parts of the repository the change touches. In the multiple-repository model the library is a separately versioned artifact, so the change must first be released from the library repository in a backward-compatible form, then each consuming service updated in its own repository to depend on the new version and use the new parameter, each of those merged and deployed independently and therefore at different times, and only once every consumer has adopted it can the library make the parameter mandatory in a new major version, after which every consumer must be updated again. Throughout that period the services are running different versions of the shared library. Neither outcome is universally better; the monorepo makes this class of change cheap at the cost of the tooling required to operate at scale, and the polyrepo keeps repositories small and teams independent at the cost of coordination on anything shared.',
        explainHi: 'Do repository models same logical change ko bahut alag amounts of work mein badalते hain. Single-repository model mein shared library aur har caller ek jagah hain, to change ek single branch hai jo library modify karता hai aur teenों services ko saath update karता hai, ek unit ke roop mein reviewed, aur atomically merged - matlab repository ki history mein koi moment nahi hai jahaan ek service library ko purane signature ke saath call karती hai. Multiple-repository model mein library ek separately versioned artifact hai, to change ko pehle library repository se ek backward-compatible form mein release honा chahिए, phir har consuming service ko apne repository mein update honा chahिए, har ek independently merged aur deployed. Us poore period mein services shared library ke alag versions chalा rahी hain. Koi bhi outcome universally better nahi.',
      },
    ],

    mistakes: [
      {
        wrong: `# relying on a pre-commit hook as a SECURITY control
# "we have a pre-commit hook that scans for AWS keys, so secrets can't get in"
# -> a dev in a hurry: git commit --no-verify. or their hook isn't installed
//    (new machine, fresh clone, never ran the setup script). the key lands on
//    main. the hook gave everyone false confidence.`,
        right: `# hooks = FAST LOCAL FEEDBACK (catch it before you push). NOT a gate.
# the actual controls, which a developer can't bypass:
#   - a CI job that scans the diff for secrets and FAILS the PR (gitleaks/trufflehog)
#   - branch protection requiring that job to pass
#   - a server-side push rule / secret-scanning on the platform
#   - and: rotate any secret that ever touched git — it's in history + clones forever`,
        why: 'A client-side git hook runs in the developer\'s own repository, under the developer\'s control, and can be skipped with a command-line flag or simply never installed, because hooks placed in the standard hooks directory are not part of the repository and each clone starts without them unless a setup step adds them. Treating such a hook as the thing that prevents secrets, or any other prohibited content, from reaching the shared branch means the protection is absent exactly when someone is in a hurry and bypasses it, or when someone is on a fresh clone that never ran the setup. Worse, believing the hook is a reliable barrier discourages adding the real one. The enforcement has to happen where the developer cannot opt out: a CI job that inspects the change and fails the pull request, made mandatory by branch protection, and ideally a scan on the hosting platform itself. The hook still has value as a fast local check that catches the mistake before it is even pushed, but it is a convenience layered on top of the real control, not the control. And any secret that has been committed at all must be rotated, because it persists in the repository history and in every clone regardless of later removal.',
        whyHi: 'Ek client-side git hook developer ke apne repository mein chalता hai, developer ke control ke under, aur ek command-line flag se skip kiya ja sakта hai ya simply kabhi install nahi kiya jाता, kyunki standard hooks directory mein rakhे hooks repository ka part nahi hain aur har clone unke bina shuru hoता hai. Aisे hook ko wo cheez treat karना jo secrets ko shared branch tak pahunchने se rokती hai matlab protection exactly tab absent hai jab koi hurry mein hai aur ise bypass karता hai. Enforcement wahaan honा chahिए jahaan developer opt out nahi kar sakта: ek CI job jo change inspect karता hai aur pull request fail karता hai, branch protection dwara mandatory. Hook abhi bhi ek fast local check ke roop mein value rakhता hai. Aur koi bhi secret jo committed hua hai rotate honा chahिए.',
      },
      {
        wrong: `# choosing polyrepo for 30 microservices, then fighting version skew forever
# - a security fix in the shared 'http-client' lib -> 30 PRs to bump it, done
//   over 3 weeks, some services never updated
# - "prod incident: which services are on the vulnerable http-client version?"
//   -> a spreadsheet, manually maintained, already stale
# - every repo's CI config has drifted; 6 different Node versions in play`,
        right: `# the repo model is a real trade-off — decide deliberately:
#   heavy code sharing, cross-cutting changes common, want atomic refactors,
#   willing to invest in monorepo tooling (affected-build, sparse checkout) -> MONOREPO
#   loosely-coupled services, strong team autonomy, independent release cadences,
#   few shared libs -> POLYREPO, but then INVEST in: a shared-lib update bot
//   (Renovate/Dependabot), a service catalogue, and templated/synced CI config
# a hybrid (monorepo per domain) is common and often right.`,
        why: 'Splitting code into many repositories gives each team independence but makes anything shared between them expensive to change, because a change to a shared library is a separate versioned release followed by a separate update in every consumer, each on its own schedule. For a small number of services this is manageable; for many services with real shared dependencies it becomes a persistent drag: a fix to a common library propagates slowly and unevenly, there is no single place to see which services are on which version, answering that question during an incident means consulting a manually maintained and usually stale record, and the per-repository configuration drifts so that services end up on different toolchain versions. Choosing this model is reasonable when services genuinely are loosely coupled and share little, but it then requires deliberate investment to counter the downsides: automated dependency-update pull requests so shared-library upgrades propagate without manual effort, a service catalogue that records what each service depends on, and templated or centrally synchronised CI configuration to prevent drift. The single-repository model trades this coordination cost for the tooling cost of operating a large repository. A hybrid, with one repository per broad domain, often balances the two.',
        whyHi: 'Code ko kई repositories mein split karना har team ko independence deता hai par unke beech kuch bhi shared change karना mehnga banаता hai, kyunki ek shared library ka ek change ek separate versioned release hai jiske baad har consumer mein ek separate update hai. Kुछ services ke liye ye manageable hai; real shared dependencies wali bahut si services ke liye ye ek persistent drag ban jата hai: ek common library ka ek fix slowly aur unevenly propagate hoता hai, ye dekhने ki koi single jagah nahi ki kaunसी services kaunसे version par hain. Is model ko choose karना reasonable hai jab services genuinely loosely coupled hain, par phir ye downsides counter karने ke liye deliberate investment require karता hai: automated dependency-update pull requests, ek service catalogue, aur templated CI configuration.',
      },
      {
        wrong: `# making production changes outside git and wondering why nothing matches
# - hotfix applied by SSHing in and editing a config file on the box
# - a security-group rule added by clicking in the AWS console
# - an env var changed directly in the container platform's UI
# -> the repo says one thing, prod is another. next deploy from git SILENTLY
//    reverts the hotfix. the console change is undocumented and lost when the
//    instance is replaced. nobody can reconstruct "why is prod like this?"`,
        right: `# git is the SOURCE OF TRUTH. every change to code, config, and infra is a commit:
#   - the hotfix -> a PR to the repo, reviewed, merged, deployed (fast-tracked if urgent)
#   - the security-group rule -> a change to the Terraform, planned + applied
#   - the env var -> a change to the committed config / manifest
# then prod is expected to MATCH the repo; a difference (drift) is a bug to fix,
# not a state to accept. "what's in prod" = "the SHA on the deploy branch".`,
        why: 'When the repository is treated as the definition of what the system should be, the system is expected to match it, and every deployment brings the system back into line with the repository. A change made directly to the running system — editing a file on a server, adjusting a setting in a cloud console, changing a value in a platform UI — is not in the repository, so it is invisible to review and audit, it will be undone the next time the system is deployed or the instance is replaced, and it leaves the actual state and the recorded state disagreeing with no way to tell from the repository that they do. Over time these undocumented divergences accumulate and it becomes impossible to reconstruct why production is configured the way it is or to recreate the environment. The discipline that avoids this is that every change of any kind goes through the repository as a commit, including urgent fixes, which are handled by a fast-tracked pull request rather than by bypassing the process. Infrastructure changes go through the infrastructure-as-code definition; deployment and configuration changes go through the committed manifests. The running system is then always traceable to a specific commit, and any difference between it and the repository is treated as drift to be corrected rather than as a legitimate state.',
        whyHi: 'Jab repository ko system kya honा chahिए ke definition ke roop mein treat kiya jाता hai, system ko ise match karना expected hai, aur har deployment system ko repository ke saath line mein wapas laता hai. Running system ka ek direct change — ek server par ek file edit karना, ek cloud console mein ek setting adjust karना — repository mein nahi hai, to ye review aur audit ko invisible hai, ye agli baar undone ho jaega jab system deploy hoता hai, aur ye actual state aur recorded state ko disagree karता chhoड़ता hai. Samay ke saath ye undocumented divergences accumulate hote hain aur ye reconstruct karना impossible ho jата hai ki production kyun aise configured hai. Jo discipline ise avoid karती hai wo ye hai ki kisi bhi kind ka har change repository ke through ek commit ke roop mein jाता hai, urgent fixes included.',
      },
    ],

    realWorld: [
      {
        en: '**A 30-service polyrepo where a critical `log4j`-style shared-lib CVE took 3 weeks to fully patch** — no single view of versions, 30 manual PRs. They added Renovate + a service catalogue; the next shared-lib CVE was patched everywhere in a day.',
        hi: '**Ek 30-service polyrepo jahaan ek critical shared-lib CVE ko poori tarah patch karने mein 3 hafte lage** — versions ka koi single view nahi. Unhone Renovate + ek service catalogue add kiya.',
      },
      {
        en: '**A monorepo CI that took 45 min on every push** because it built everything — adding Nx affected-target detection dropped the median to 6 min (most PRs touch one project). The repo model was fine; the CI was naive.',
        hi: '**Ek monorepo CI jo har push par 45 min leता tha** kyunki ye sab кुछ build karता tha — Nx affected-target detection add karके median 6 min par gira.',
      },
      {
        en: '**A prod config that drifted for months** via console edits — the eventual git-based redeploy silently reverted a load-balancer timeout someone had hand-tuned, causing an outage. Everything moved to Terraform + a "no console changes" rule enforced by drift detection in CI.',
        hi: '**Ek prod config jo mahinों drift hua** console edits ke through — eventual git-based redeploy ne silently ek load-balancer timeout revert kiya jise kisi ne hand-tune kiya tha.',
      },
    ],

    interviewQA: [
      {
        q: 'What are the trade-offs between a monorepo and a polyrepo?',
        qHi: 'Ek monorepo aur ek polyrepo ke beech trade-offs kya hain?',
        a: 'A monorepo keeps all of an organisation\'s code in one repository. Its main advantage is atomic cross-cutting change: a modification to a shared library and every service that uses it is a single commit and pull request, merged together, so there is never a moment where consumers are on inconsistent versions, and large refactors across many services are mechanical. There is exactly one version of every internal dependency, tooling and CI configuration is defined once for everything, and the impact of a change is visible in one place. The cost is that operating a large monorepo requires specific tooling: a build system that determines and runs only the targets a change affects, path-filtered CI, sparse checkout or a virtual filesystem so clones stay manageable, and code-owner routing for reviews. Isolation is also weaker, since a broken commit or a CI problem can block every team. A polyrepo puts each service or library in its own repository. Teams get full autonomy over release cadence, CI, and access, clones are small, and a service\'s blast radius is its repository with dependencies as explicit versioned artifacts. The cost is that cross-cutting changes become a coordinated sequence of pull requests across many repositories landing at different times, shared libraries drift into version skew that is hard to see and slow to resolve, and per-repository configuration diverges. Large companies with heavy code sharing tend toward monorepos; organisations of loosely coupled autonomous services tend toward polyrepos; a hybrid of one repository per domain is common.',
        aHi: 'Ek monorepo ek organisation ka saara code ek repository mein rakhता hai. Iska main advantage atomic cross-cutting change hai: ek shared library aur iske har consumer ka ek modification ek single commit aur pull request hai, saath merged, to kabhi ek moment nahi hai jahaan consumers inconsistent versions par hain. Har internal dependency ka exactly ek version hai, tooling aur CI configuration ek baar defined hai. Cost ye hai ki ek baड़े monorepo ko operate karने ke liye specific tooling chahिए: ek build system jo sirf affected targets chalाता hai, path-filtered CI, sparse checkout. Ek polyrepo har service ko apne repository mein rakhता hai. Teams ko full autonomy milती hai, clones small hain. Cost ye hai ki cross-cutting changes ek coordinated sequence ban jाते hain, shared libraries version skew mein drift karती hain. Baड़ी companies monorepos ki taraf trend karती hain; loosely coupled services polyrepos ki taraf.',
      },
      {
        q: 'What are git hooks good for, what are their limits, and what does "git as the source of truth" mean?',
        qHi: 'Git hooks kismें achhे hain, unki limits kya hain, aur "git as the source of truth" ka kya matlab hai?',
        a: 'Git hooks are scripts git runs automatically at points in its workflow, such as before creating a commit, when validating a commit message, or before a push. Client-side hooks give a developer fast local feedback: a pre-commit hook can format staged files and run the linter and quick tests, a commit-msg hook can enforce the commit-message convention, a pre-push hook can run the test suite. Their limit is that they run in the developer\'s own repository and can be skipped with a no-verify flag, and hooks placed in the default hooks directory are not part of the repository so a fresh clone has none until a setup step installs them. That means a client-side hook is a convenience that catches mistakes early, not a control that guarantees anything about what reaches the shared branch; real enforcement has to be a CI check made mandatory by branch protection, or a server-side rule, where the developer cannot opt out. Hooks should be managed with a framework so they are defined in a committed config and installed consistently, and kept fast or people disable them. Git as the source of truth is the principle that the repository is the authoritative statement of what the system should be. Every change to code, and with infrastructure as code and GitOps also to infrastructure and to what is deployed, is a reviewed, attributed, reversible commit, with no changes made out of band by editing servers or clicking in consoles. The running system is expected to match the repository, the question of what is in production is answered by which commit the deploy branch is on, and any difference between reality and the repository is drift to be corrected rather than a state to accept.',
        aHi: 'Git hooks scripts hain jo git apne workflow mein points par automatically chalाता hai. Client-side hooks ek developer ko fast local feedback dete hain: ek pre-commit hook staged files format kar sakта hai aur linter chalा sakта hai, ek commit-msg hook commit-message convention enforce kar sakта hai. Unki limit ye hai ki wo developer ke apne repository mein chalते hain aur ek no-verify flag se skip kiye ja sakते hain. Iska matlab ek client-side hook ek convenience hai, ek control nahi jo kuch guarantee karता hai; real enforcement ek CI check honा chahिए jo branch protection dwara mandatory hai. Git as the source of truth wo principle hai ki repository authoritative statement hai ki system kya honा chahिए. Code ke har change — aur IaC aur GitOps ke saath infrastructure aur jo deployed hai uske bhi — ek reviewed, attributed, reversible commit hai. Running system ko repository ko match karना expected hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, list 3 advantages and 3 costs of a monorepo, and 3 advantages and 3 costs of a polyrepo. Then name the tooling a large monorepo requires and the tooling a large polyrepo requires.',
        taskHi: 'Ek comment mein, ek monorepo ke 3 advantages aur 3 costs list karो, aur ek polyrepo ke.',
        hint: 'MONOREPO +: atomic cross-cutting changes (lib + all consumers in one PR); one version of everything (no "which version?"); global tooling/CI/lint config; easy large refactors + visible impact. MONOREPO −: needs affected-build tooling (Bazel/Nx/Turborepo) or CI builds the world; clone/checkout size (needs sparse checkout / VFS); weaker isolation (one bad commit blocks everyone); coarser access control. POLYREPO +: team autonomy (own cadence/CI/access); small fast clones; hard blast-radius boundaries. POLYREPO −: cross-cutting change = N coordinated PRs landing at different times; version skew / diamond deps; CI + tooling drift between repos. Large monorepo tooling: affected-target build system, path-filtered CI, sparse checkout/VFS, CODEOWNERS. Large polyrepo tooling: a dependency-update bot (Renovate/Dependabot), a service catalogue, templated/synced CI config.',
        hintHi: 'MONOREPO +: atomic cross-cutting changes; sab kुछ ka ek version; global tooling; easy large refactors. MONOREPO −: affected-build tooling chahिए warna CI world build karता hai; clone size; weaker isolation. POLYREPO +: team autonomy; small clones; hard boundaries. POLYREPO −: cross-cutting change = N coordinated PRs; version skew; CI drift. Monorepo tooling: affected-target build system, path-filtered CI, sparse checkout, CODEOWNERS. Polyrepo tooling: dependency-update bot, service catalogue, templated CI.',
      },
      {
        task: 'In a comment, name the three client-side hooks (pre-commit, commit-msg, pre-push) and what each is for, explain why `--no-verify` means hooks are not a security control, and where the real enforcement lives.',
        taskHi: 'Ek comment mein, teen client-side hooks name karो aur har ek kis liye hai.',
        hint: 'pre-commit: runs before the commit object is created — format staged files, lint, fast tests for the changed area, scan for secrets/large files (most-used). commit-msg: gets the path to the message file — validate/reject it (enforce Conventional Commits). pre-push: runs before a push — run the full test suite, block pushing WIP or to a protected branch. Not a security control because: they run in the dev\'s own repo, `git commit --no-verify` / `push --no-verify` skips ALL of them, and hooks in `.git/hooks/` aren\'t version-controlled so a fresh clone has none until a setup step runs. Real enforcement: a CI job that inspects the diff and FAILS the PR + branch protection requiring that job + (optionally) server-side push rules / platform secret-scanning — places the developer can\'t opt out of. Hooks are a fast local feedback loop, not a gate.',
        hintHi: 'pre-commit: commit banने se pehle — format, lint, fast tests, secret scan. commit-msg: message file ka path paता hai — validate/reject (Conventional Commits enforce). pre-push: ek push se pehle — full test suite, WIP/protected branch block. Security control nahi kyunki: wo dev ke apne repo mein chalते hain, `--no-verify` SAB skip karता hai, aur `.git/hooks/` mein hooks version-controlled nahi. Real enforcement: ek CI job jo diff inspect karता hai aur PR FAIL karता hai + branch protection + server-side push rules.',
      },
      {
        task: 'In a comment, explain "git as the single source of truth", give three examples of changes that must NOT be made out-of-band, and connect it to IaC and GitOps.',
        taskHi: 'Ek comment mein, "git as the single source of truth" samjhाओ.',
        hint: 'The repo is the authoritative statement of what code + config + infra SHOULD be; every change is a commit (reviewed, attributed, timestamped, reversible, audited). "What\'s in prod?" = "what SHA is the deploy branch on", not "let me SSH in and look" — the running system is expected to MATCH the repo, and a difference is DRIFT (a bug to fix), not a source of truth. Must NOT be out-of-band: (1) an urgent hotfix SSH-edited onto a box (next deploy silently reverts it); (2) a security-group / firewall rule clicked into the cloud console (undocumented, lost on instance replacement); (3) an env var changed in the platform UI. IaC (Terraform/CloudFormation in the repo) brings infra under this model — `terraform plan` shows drift. GitOps puts the DEPLOYED state (manifests, image tags) in a repo and a controller CONTINUOUSLY reconciles reality to it — deploy = merge a commit, rollback = revert one. So the branch protection / review / commit discipline on the repo become the controls on production itself.',
        hintHi: 'Repo authoritative statement hai ki code + config + infra kya HONA chahिए; har change ek commit hai (reviewed, attributed, reversible, audited). "Prod mein kya hai?" = "deploy branch kaunसे SHA par hai" — running system ko repo ko MATCH karना expected hai, ek difference DRIFT hai. Out-of-band NAHI: (1) ek hotfix SSH-edited; (2) ek security-group rule console mein clicked; (3) ek env var platform UI mein changed. IaC infra ko is model ke under laता hai. GitOps DEPLOYED state ko ek repo mein rakhता hai aur ek controller CONTINUOUSLY reconcile karता hai.',
      },
    ],

    keyTakeaways: [
      'MONOREPO (all code in ONE repo) +: ATOMIC cross-cutting changes (a shared lib + every consumer in one commit/PR — no version dance, no skew window); one version of every internal dep; global tooling/CI/lint config; mechanical large refactors + visible impact. −: MANDATORY scale tooling (an affected-target build system — Bazel/Buck/Pants/Nx/Turborepo — or CI builds the whole repo every push; path-filtered CI; sparse checkout or a VFS for clone size; CODEOWNERS); weaker isolation (one bad commit / CI outage blocks every team); coarser access control.',
      'POLYREPO (one repo per service/library) +: team AUTONOMY (own release cadence, CI, branch rules, access); small fast clones; a service\'s blast radius IS its repo, deps are explicit versioned artifacts. −: a cross-cutting change = N coordinated PRs across N repos landing at DIFFERENT times (always a version-skew window); diamond-dependency / version-skew hell, no single view of "which version is where"; CI + tooling + convention DRIFT between repos. Counter the downsides with: a dependency-update bot (Renovate/Dependabot), a service catalogue, templated/synced CI config. Neither model is "correct" — heavy code-sharing → monorepo; loosely-coupled autonomous teams → polyrepo; a hybrid (monorepo per domain) is common.',
      'GIT HOOKS = scripts git runs at lifecycle points (`.git/hooks/` or `core.hooksPath`; non-zero exit aborts the op). CLIENT-SIDE (local, advisory): `pre-commit` (before the commit — format, lint, fast tests, secret/large-file scan — most used); `commit-msg` (gets the message-file path — enforce Conventional Commits); `pre-push` (before a push — full test suite, block WIP / protected branches). SERVER-SIDE (enforced): `pre-receive`/`update` (reject non-compliant pushes — but hosted git does this via branch protection). Manage with a FRAMEWORK (pre-commit / Husky / Lefthook) so hooks are in committed config + installed for everyone — NOT hand-copied into `.git/hooks/` (which isn\'t version-controlled). Keep hooks FAST (< a few s) or people disable them.',
      'HOOKS ARE A FAST LOCAL FEEDBACK LOOP, NOT A GATE — `git commit/push --no-verify` skips ALL of them, and a fresh clone has none until a setup step runs. NEVER rely on a client-side hook as a security control (e.g. secret-scanning). The REAL enforcement, which a developer can\'t opt out of: a CI job that inspects the diff and FAILS the PR (gitleaks/trufflehog for secrets) + branch protection requiring it + optionally server-side push rules / platform secret-scanning. And rotate any secret that ever touched git — it\'s in history + every clone forever.',
      'GIT AS THE SINGLE SOURCE OF TRUTH: the repo is the AUTHORITATIVE statement of what code + config + infra SHOULD be; every change is a commit (reviewed, attributed, timestamped, reversible, audited) — NO out-of-band edits (SSH-ing in to edit a config, clicking a rule into the cloud console, changing an env var in a UI — the next git deploy silently reverts them and they\'re lost on instance replacement). "What\'s in prod?" = "what SHA is the deploy branch on", not "let me SSH in and look"; a difference between reality and the repo is DRIFT (a bug to fix), not a state to accept. IaC (Module 12) brings infra under this model (`terraform plan` shows drift); GitOps (Module 20) puts the DEPLOYED state (manifests, image tags) in a repo and a controller CONTINUOUSLY reconciles reality to it — deploy = merge a commit, rollback = revert one. So this module\'s branch protection / review / commit discipline become the controls on PRODUCTION itself.',
    ],
    keyTakeawaysHi: [
      'MONOREPO (saara code ONE repo mein) +: ATOMIC cross-cutting changes (ek shared lib + har consumer ek commit/PR mein — koi version dance nahi); har internal dep ka ek version; global tooling; mechanical large refactors. −: MANDATORY scale tooling (ek affected-target build system — Bazel/Nx/Turborepo — warna CI har push par poora repo build karता hai; path-filtered CI; sparse checkout; CODEOWNERS); weaker isolation; coarser access control.',
      'POLYREPO (per service/library ek repo) +: team AUTONOMY (apna release cadence, CI, access); small fast clones; ek service ka blast radius iska repo HAI. −: ek cross-cutting change = N coordinated PRs alag times par landing; version-skew hell; CI + tooling DRIFT. Downsides counter karो: ek dependency-update bot (Renovate), ek service catalogue, templated CI. Koi model "correct" nahi — heavy code-sharing → monorepo; loosely-coupled teams → polyrepo; hybrid (per domain monorepo) common.',
      'GIT HOOKS = scripts jo git lifecycle points par chalाता hai (`.git/hooks/` ya `core.hooksPath`). CLIENT-SIDE (local, advisory): `pre-commit` (commit se pehle — format, lint, fast tests, secret scan); `commit-msg` (message-file path paта hai — Conventional Commits enforce); `pre-push` (push se pehle — full test suite). SERVER-SIDE (enforced): `pre-receive`/`update`. Ek FRAMEWORK se manage karो (pre-commit / Husky / Lefthook) taki hooks committed config mein + sabke liye installed hain. Hooks FAST rakhо.',
      'HOOKS EK FAST LOCAL FEEDBACK LOOP HAIN, EK GATE NAHI — `--no-verify` SAB skip karता hai, aur ek fresh clone mein koi nahi jab tak ek setup step na chale. KABHI ek client-side hook par ek security control ke roop mein rely mat karो. REAL enforcement: ek CI job jo diff inspect karता hai aur PR FAIL karता hai (gitleaks/trufflehog) + branch protection + server-side push rules. Aur koi bhi secret jo git ko touch kiya rotate karो.',
      'GIT AS THE SINGLE SOURCE OF TRUTH: repo AUTHORITATIVE statement hai ki code + config + infra kya HONA chahिए; har change ek commit hai (reviewed, attributed, reversible, audited) — KOI out-of-band edits nahi (SSH karके ek config edit karना, ek rule console mein click karना — agला git deploy silently unhe revert karता hai). "Prod mein kya hai?" = "deploy branch kaunसे SHA par hai"; reality aur repo ke beech ek difference DRIFT hai (ek bug to fix). IaC infra ko is model ke under laता hai; GitOps DEPLOYED state ko ek repo mein rakhता hai aur ek controller CONTINUOUSLY reconcile karता hai — deploy = ek commit merge, rollback = ek revert. To is module ka branch protection / review / commit discipline PRODUCTION par controls ban jाते hain.',
    ],
  },
];
