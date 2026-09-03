# DevPrep IDE

A private Full Stack interview preparation platform — study topics, drill interview questions, solve DSA problems, **run code in the browser**, take timed mock interviews, and track what you actually know.

Built as a monorepo: React + TypeScript frontend, Express + Prisma + PostgreSQL API, and a **separate isolated execution service** that is the only component allowed to run submitted code.

Every explanation is written twice — **English and Hinglish** — with a toggle in the top bar.

---

## Quick start (local)

Prerequisites: **Node 20+**, and either **Docker Desktop** or nothing extra (there is a no-Docker path for both the database and code execution).

```bash
git clone https://github.com/JayrajPratapSingh/devlearnings.git
cd devlearnings          # repo root is the devprep-ide monorepo
cp .env.example .env
```

Open `.env` and fill in `POSTGRES_PASSWORD`, `DATABASE_URL`, and two **different** random secrets (`JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`). Generate a secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Then, from the repo root:

```bash
npm install

# start Postgres — pick ONE:
npm run db:local          # portable Postgres, no Docker (runs in its own terminal)
#   or
npm run db:up             # Docker Postgres container

# in another terminal: create the schema and load all content
npm run db:push
npm run seed              # idempotent — safe to re-run after editing content

# start everything (frontend + API + execution service)
npm run dev
```

Open **http://localhost:5173**, create an account, and start. Code execution needs Docker running; without it, set `SANDBOX_DRIVER=local` in `.env` for a dev-only local runner.

The full walkthrough, including the no-Docker details, is in [Setup](#setup) and [Running it](#running-it) below.

---

## Contents

- [Quick start (local)](#quick-start-local)
- [What is in the box](#what-is-in-the-box)
- [Architecture](#architecture)
- [Setup](#setup)
- [Running it](#running-it)
- [Verifying it works](#verifying-it-works)
- [Code execution & the sandbox](#code-execution--the-sandbox)
- [Project structure](#project-structure)
- [Database schema](#database-schema)
- [API reference](#api-reference)
- [Adding your own content](#adding-your-own-content)
- [Environment variables](#environment-variables)
- [Troubleshooting](#troubleshooting)
- [What is built and what is not](#what-is-built-and-what-is-not)

---

## What is in the box

| Area | Detail |
|---|---|
| **DSA** | 41 problems across all 17 categories, each with description, examples, constraints, progressive hints, approach, complexity, a written explanation, per-language starter code, sample + hidden test cases, and a reference solution that unlocks only after you solve it |
| **Learning modules** | 184 topics across 21 categories — JavaScript, TypeScript, Generative AI, Three.js & R3F, Firebase, React, Node/Express, Python, FastAPI, Django, SQL, PostgreSQL, MongoDB, REST, WebSockets, Auth, Schema & Data Modelling, Web Security, System Design, Deployment & Operations, and tooling. Every topic has three views — **Simple** (analogy first), **Tricks** (how to remember it) and **Interview** (full depth) — all in English and Hinglish |
| **Standalone courses** | Long-form, module-by-module courses that go noob → pro: **JavaScript**, **CSS & HTML**, **TypeScript**, **React**, **DSA** (14 modules / 86 lessons), **Node.js**, **Python** (10 modules / 60 lessons), and **Django + DRF** (in progress — 9 modules / 54 lessons). Every lesson follows the same shape — a real-life analogy, a broken example, the fix, a deep dive, worked examples with runnable output, common mistakes, real-world use, interview Q&A, exercises, and key takeaways — in English and Hinglish. Data lives in `server/prisma/seed-data/course-*.ts`; every code sample is executed and diffed against its stated output before it ships |
| **Question bank** | 128 rapid-fire interview questions with short answer, detailed answer, code example and the follow-ups interviewers actually ask |
| **Code execution** | JavaScript, Node.js and Python, run inside a throwaway Docker container with timeout, memory, CPU, PID and output limits |
| **Algorithm visualiser** | 9 step-by-step animations — pointers converging, a hash map filling, a DP table being built, flood fill spreading. Play/pause/scrub/speed, with a plain-language reason for every step in EN and Hinglish |
| **Mock interview** | Timed, one question at a time, self-scored, auto-submits when time runs out, produces weak topics and a retry list |
| **Spaced revision** | SM-2 scheduling fed automatically by failed submissions, low-confidence topics and missed interview questions |
| **Progress** | Overall %, per-technology %, DSA by difficulty, accuracy, streak, 28-day activity, weak areas, mock scores |
| **Active recall** | Type the answer before you see it. The model answer stays hidden until you commit, because recognising an answer and producing one are different skills — and only the second one is tested |
| **Daily challenge** | One problem a day, the same for everyone, on a seeded rotation that visits all 41 before repeating any |
| **Blitz mode** | 60-second rapid-fire rounds, space to reveal, scored at the end, with a weak-spot round that draws only from what you have got wrong |
| **Year heatmap & share card** | A full year of activity as a contribution grid, and a 1200×630 PNG of your stats drawn from the live theme tokens |
| **Memory tricks** | 172 topics carry a mnemonic layer — an image, a rhyme or a contrast pair, each built on a named memory effect (bizarreness, chunking, dual coding, Von Restorff, self-reference) and each stating which one it uses, because knowing why a hook works makes it stick harder |
| **Interview tracks** | Four ordered plans: **Zero to Full Stack** (60 days, complete beginner, one subject finished before the next starts), frontend 2 weeks, backend 3 weeks, full stack 30 days. Long tracks are grouped into phases. Progress is *derived* from what you have already solved, so a track can never disagree with the rest of the app |
| **Scratchpad** | A Monaco editor on every page — hit it any time to test an idea without losing your place |
| **Notes & bookmarks** | On any topic, problem or question; searchable |
| **Search** | `Ctrl` + `K` command palette across topics, problems, questions and notes |

Every seeded reference solution is verified against every test case in **both** JavaScript and Python before it ships — see [`prisma/seed-data/verify.ts`](server/prisma/seed-data/verify.ts).

---

## Architecture

```
Browser (React + Monaco)
        │  fetch, access token in memory + httpOnly refresh cookie
        ▼
API server (Express + Prisma)          ← never executes submitted code
        │  HTTP + shared service token
        ▼
Execution service (bounded job queue)
        │  docker create → docker cp → docker start
        ▼
Throwaway container  (--network none, --read-only, --cap-drop ALL, non-root)
        │  stdout / stderr / exit code
        ▼
back up the chain
```

Three separable pieces, so the blast radius of untrusted code is one disposable container:

- **`client/`** — Vite + React 18 + TypeScript + Tailwind. Monaco is lazy-loaded so the dashboard stays small.
- **`server/`** — Express with route → controller → service → repository layering. Prisma owns all data access. Zod validates every request. One central error handler.
- **`execution-service/`** — the only process that spawns a runtime. Bounded FIFO queue, pluggable `Sandbox` interface, Docker driver plus a clearly-marked dev-only local driver.

---

## Setup

**Prerequisites:** Node 20+. Docker Desktop is optional — it gives you the container sandbox for code execution and a Postgres container, but there is a no-Docker path for both (portable Postgres below, `SANDBOX_DRIVER=local` for execution).

```bash
cd devprep-ide
cp .env.example .env
```

Open `.env` and set real values — at minimum `POSTGRES_PASSWORD`, `DATABASE_URL`, and two **different** random secrets:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Then:

```bash
npm install
```

**Start PostgreSQL.** Two options — pick either:

*Portable (no Docker, no admin rights).* Downloads a self-contained Postgres on first run and keeps its data in `server/.pgdata`. Runs in the foreground, so give it its own terminal:

```bash
npm run db:local
```

*Docker.* Same engine, same schema:

```bash
npm run db:up
```

Then, in another terminal:

```bash
npm run db:push
```

```bash
npm run seed
```

`db:push` creates the schema directly (fastest for local work). For versioned migrations use `npm run db:migrate` instead.

The seed is **idempotent** — it upserts on slugs, so re-running it after editing content updates rows without touching your progress, notes or submissions.

---

## Running it

```bash
npm run dev
```

That starts all three services together:

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| API | http://localhost:4000 |
| Execution service | http://localhost:4001 |

Open http://localhost:5173, create an account, and start. Or run them individually with `npm run dev:api`, `npm run dev:exec`, `npm run dev:web`.

**Keyboard shortcuts**

| Keys | Action |
|---|---|
| `Ctrl` + `K` | Command palette |
| `Ctrl` + `Enter` | Run code |
| `Ctrl` + `Shift` + `Enter` | Submit code |

---

## Verifying it works

Three checks, each aimed at a different class of failure. All of them are safe to
re-run as often as you like.

```bash
npm run e2e
```

Registers a throwaway account, drives the real HTTP API end to end — auth, topics,
DSA, execution, questions, search, notes, bookmarks, revision, mock interviews,
progress — then deletes the account. 75 checks. This is the one that catches
wiring failures: a route that was never mounted, an auth guard on the wrong side
of a handler, a response shape the client does not expect. Several checks are
specifically about what must *not* appear in a response — hidden test cases,
password hashes, a reference solution before you have solved the problem, a mock
interview's model answer before you have scored yourself. Needs `npm run dev`
running in another terminal.

```bash
npm run seed:verify
```

Runs every seeded reference solution against every one of its test cases, in both
JavaScript and Python — 454 executions — and exits non-zero on any mismatch. Run
this after touching problem data. A hand-written answer key is wrong more often
than you would like, and a wrong key is worse than a missing problem: it fails
you for a correct solution.

```bash
npm run verify:tracks
```

Confirms every topic slug, problem slug and recall category an interview track
references actually exists in the seeded content. Tracks are a curriculum defined
in TypeScript on the client, so nothing type-checks them against the database — a
renamed topic or a category with no questions behind it produces a dead link or a
silently empty page, which looks like a working feature until someone clicks it.

```bash
npm run typecheck && npm run build
```

Strict TypeScript across all three workspaces, then a production build.

---

## Code execution & the sandbox

Submitted code is **never** executed in the API process. There is no `eval`, no `new Function`, and no `child_process` call on user input anywhere in `server/`. The API only speaks HTTP to the execution service.

### The Docker driver (default, `SANDBOX_DRIVER=docker`)

Build the runner images once:

```bash
npm run sandbox:build
```

Each execution then:

1. Writes the source to a fresh temp directory
2. `docker create`s a container with every limit applied
3. `docker cp`s the source in — **no host directory is ever mounted**, so the container cannot see your filesystem, your source or your `.env`
4. `docker start`s it, piping stdin and capturing stdout/stderr
5. Kills it on timeout or output overflow
6. `docker rm -f`s the container and deletes the temp directory, on every code path

| Control | Flag | Default |
|---|---|---|
| Network | `--network none` | no egress at all |
| Memory | `--memory` + `--memory-swap` | 256 MB, swap disabled |
| CPU | `--cpus` | 0.5 |
| Processes | `--pids-limit` | 64 (fork-bomb protection) |
| Filesystem | `--read-only` + `--tmpfs /tmp` | immutable root, 32 MB scratch |
| Privileges | `--cap-drop ALL` + `--security-opt no-new-privileges` | no capabilities, no escalation |
| User | `--user 1000:1000` | never root |
| Wall clock | app-level kill | 5 s |
| Output | app-level cap | 64 KB, then the container is killed |
| Concurrency | bounded queue | 4 at a time, depth 100 |

The runner images strip their package managers — `npm`/`npx`/`yarn` are deleted from the Node image and `pip` from the Python image — so a submission cannot install anything even if the network policy were ever relaxed.

The child process inherits only `PATH`, so the service's own token, `DATABASE_URL` and the JWT secrets are unreachable from submitted code. There is a test for exactly this.

### The local driver (`SANDBOX_DRIVER=local`)

For getting started without Docker. It still enforces the timeout, the output cap and a scrubbed environment, and runs from a throwaway temp directory — **but it shares the host kernel, filesystem and network. It is not a security boundary.** `config.ts` refuses to boot with this driver when `NODE_ENV=production`.

Switch to `docker` as soon as your Docker Desktop is running.

### Plugging in something else

Implement the `Sandbox` interface in [`execution-service/src/sandbox/types.ts`](execution-service/src/sandbox/types.ts) — `run(job)` and `preflight()` — and select it in `execution.worker.ts`. Firecracker, gVisor, nsjail or a remote grader all fit without touching the API or the frontend.

### Problem I/O contract

Every problem reads **stdin** and writes **stdout**. That keeps grading completely language-agnostic — no per-language function signatures, no serialisation layer. Starter code parses the input for you so you spend your time on the algorithm:

```
Input                  Your program                Expected stdout
4
2 7 11 15      →       reads stdin, prints    →    0 1
9
```

---

## Project structure

```
devprep-ide/
├── docker-compose.yml          # postgres, execution-service, runner image builder
├── .env.example                # every variable, documented
│
├── client/
│   └── src/
│       ├── components/         # ui primitives, Markdown, CommandPalette, NotesPanel, ErrorBoundary
│       ├── editor/             # Monaco wrapper with run/submit keybindings
│       ├── hooks/              # useAuth, usePreferences (theme + EN/Hinglish), useApi
│       ├── layouts/            # AppLayout — sidebar, topbar, palette
│       ├── pages/              # one file per route
│       ├── services/           # api client (token refresh) + endpoints
│       └── types/              # shared response types
│
├── server/
│   ├── prisma/
│   │   ├── schema.prisma       # 15 models
│   │   ├── seed.ts             # idempotent upserts
│   │   └── seed-data/          # DSA problems, topics, questions + verify.ts
│   └── src/
│       ├── config/             # env validation, prisma client
│       ├── controllers/        # HTTP in, service out
│       ├── services/           # business logic (no req/res below this line)
│       ├── repositories/       # the only place that touches Prisma
│       ├── routes/             # paths, auth guards, Zod schemas
│       ├── middleware/         # auth, validate, error handler, asyncHandler
│       ├── validators/         # Zod schemas
│       └── utils/              # typed errors, logger
│
└── execution-service/
    ├── runners/{node,python}/  # minimal Dockerfiles for the sandbox images
    └── src/
        ├── runners/            # language → image + command
        ├── sandbox/            # Sandbox interface, Docker driver, local driver
        ├── queue/              # bounded concurrency-limited FIFO
        └── workers/            # queue + sandbox wiring
```

---

## Database schema

15 models with indexes on every column used for filtering or joining.

**Content:** `TopicCategory` → `Topic`, `InterviewQuestion`, `DSAProblem` → `TestCase`

**Per-user:** `User`, `RefreshToken`, `UserTopicProgress`, `UserQuestionProgress`, `UserProblemProgress`, `Submission`, `Note`, `Bookmark`, `MockInterview` → `MockInterviewQuestion`, `Revision`, `StudySession`

Notable choices:

- Hidden test cases live in the same table behind an `isHidden` flag, and the repository has a **separate method** for the graded path — the problem-page query physically cannot return them.
- Progress tables use a compound unique `@@unique([userId, problemId])` so upserts are race-free.
- `StudySession` is one row per user per day, which makes streaks and the activity chart a single indexed range scan.
- `Revision` carries the SM-2 state (`intervalDays`, `easeFactor`, `repetitions`, `dueAt`).

Inspect it with `npm run db:studio`.

---

## API reference

All routes are under `/api`. Everything except `/auth/*` requires a bearer token.

| Method | Path | Purpose |
|---|---|---|
| POST | `/auth/register`, `/auth/login` | returns access token + sets refresh cookie |
| POST | `/auth/refresh`, `/auth/logout` | rotating refresh, revocation |
| POST | `/auth/password/forgot`, `/auth/password/reset`, `/auth/password/change` | recovery by email or SMS, 6-digit code |
| PATCH/DELETE | `/auth/phone`, `/auth/me` | set recovery phone; delete account (re-checks password) |
| GET | `/auth/me` | current user |
| GET | `/topics/categories`, `/topics/categories/:slug`, `/topics/:slug` | learning content |
| GET | `/topics/titles?slugs=a,b,c` | slug → title lookup, for places that only hold slugs |
| PATCH | `/topics/:slug/status` | mark known / learning / needs revision |
| GET | `/dsa`, `/dsa/categories`, `/dsa/:slug`, `/dsa/stats/difficulty` | problems (never returns hidden tests) |
| GET | `/dsa/daily` | today's challenge — same for everyone, plus your daily streak |
| POST | `/code/run/:slug` | sample cases or custom stdin |
| POST | `/code/submit/:slug` | graded run over every case |
| GET | `/code/health` | sandbox driver + limits |
| GET/PATCH | `/questions`, `/questions/:id/status` | question bank |
| GET/POST/PATCH/DELETE | `/notes` | notes CRUD |
| GET/POST | `/bookmarks`, `/bookmarks/toggle` | bookmarks |
| GET | `/progress`, `/progress/dashboard` | analytics; `/progress` also carries a year of activity for the heatmap |
| GET/POST/DELETE | `/revision/due`, `/revision/:id/grade` | spaced repetition |
| GET/POST | `/mock-interview`, `/mock-interview/:id/answer`, `/:id/finish` | mock interviews |
| GET | `/search?q=` | command palette |

**Run/submit request**

```json
{ "language": "PYTHON", "code": "...", "input": "1 2 3" }
```

**Run response**

```json
{
  "status": "success",
  "stdout": "6\n",
  "stderr": "",
  "executionTime": 120,
  "memoryUsage": 32
}
```

**Submit response** — hidden cases report pass/fail only, never their input or expected output:

```json
{
  "status": "WRONG_ANSWER",
  "passed": 8,
  "total": 10,
  "wrongAnswers": 2,
  "results": [{ "index": 0, "hidden": false, "passed": true, "input": "...", "expectedOutput": "...", "actualOutput": "..." }]
}
```

Errors are always shaped `{ error: { code, message, details? } }`.

---

## Adding your own content

All content is plain TypeScript in `server/prisma/seed-data/`. Add an entry, re-run `npm run seed`.

**A DSA problem** — append to `dsa-core.ts` or `dsa-advanced.ts`:

```ts
{
  slug: 'my-problem',
  title: 'My Problem',
  category: 'Arrays',
  difficulty: 'EASY',
  description: '...', descriptionHi: '...',
  examples: [{ input: '...', output: '...' }],
  constraints: [], hints: [],
  approach: '...', approachHi: '...',
  timeComplexity: 'O(n)', spaceComplexity: 'O(1)',
  solutionExplanation: '...', solutionExplanationHi: '...',
  starter: starter(`// js`, `# py`),
  solution: solution(`// js`, `# py`),
  testCases: [sample('input', 'output'), hidden('input', 'output')],
}
```

Then **verify your answer key actually passes**:

```bash
npm run seed:verify
```

It runs every reference solution against every test case in both languages and exits non-zero on any mismatch.

**A topic** goes in the matching `topics-*.ts` file; **a question** in `questions.ts`. The `*Hi` fields are optional everywhere — the UI falls back to English and tells the reader when it does.

**A standalone course lesson** goes in `server/prisma/seed-data/course-<name>-moduleN[-partK].ts`, each file exporting `<NAME>_MODULE_N: CourseLesson[]`. A new course also needs a `seed<Name>Course()` function in `seed.ts` (copy `seedDsaCourse()`, change the `courseData` slug/name/icon/order, the `modules` array, and the `topics` spread blocks) plus a call in `main()`. The `CourseLesson` shape (`analogy`, `simple`/`content`, `examples`, `mistakes`, `realWorld`, `interviewQA`, `exercises`, `keyTakeaways`, all with `*Hi` twins) is defined in `course-js-module1.ts`. Two rules that bite: inside the `simple`/`content` template-literal fields every backtick — including inline-code spans inside ` ``` ` blocks — must be escaped as `` \` ``; and every `examples[].code` sample must be run (`python` / `node`) and its real output pasted into `examples[].output` verbatim.

**An interview track** lives in `client/src/data/tracks.ts`. A track is a curriculum, not user data, so it stays on the client and stores nothing: progress is derived from the problems you have already solved, which means a track can never disagree with the rest of the app about what you have done. Days reference topics, problems and question categories **by slug**, and nothing type-checks those against the database — so after editing, run:

```bash
npm run verify:tracks
```

A recall category only works if questions actually carry that category. Referencing one that nothing uses produces a link to an empty page, which looks like a working feature until you click it.

**A visualiser** lives in `client/src/visualiser/algorithms/index.ts`. Write a function that replays the algorithm and pushes a `Frame` at each decision point, then add an entry to `DEMOS` listing which problem slugs it teaches. Frames are full snapshots rather than diffs, which is what makes scrubbing backwards free — and the player never needs to know what your algorithm is, so no UI changes are required. The existing panels (array track, hash map, stack, DP table, grid) compose; a new algorithm usually needs none of its own.

---

## Environment variables

See [`.env.example`](.env.example) for the annotated list. The API and the execution service both read the **repo-root `.env`**, so the shared token can never drift between them. `server/src/config/env.ts` validates everything with Zod and refuses to boot on a bad value.

| Variable | Notes |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | ≥16 chars, must be **different** values |
| `ACCESS_TOKEN_TTL` / `REFRESH_TOKEN_TTL_DAYS` | `15m` / `30` |
| `EXECUTION_SERVICE_TOKEN` | shared secret between API and execution service |
| `SANDBOX_DRIVER` | `docker` or `local` |
| `EXECUTION_TIMEOUT_MS`, `MEMORY_LIMIT_MB`, `CPU_LIMIT`, `MAX_CONCURRENT_EXECUTIONS` | sandbox limits |
| `VITE_API_URL` | only `VITE_*` reaches the browser |

Secrets are never committed — `.env` is gitignored, `.env.example` holds placeholders.

**Why there is a `with-env.mjs` wrapper.** The Prisma CLI only looks for `.env` in the schema directory and the cwd — it cannot reach a parent. Since the single source of truth is the *root* `.env`, every Prisma script runs through [`server/scripts/with-env.mjs`](server/scripts/with-env.mjs), which loads that file and then execs the real command. The alternative would be duplicating `DATABASE_URL` into `server/.env`, which is exactly the drift the single root file is there to prevent. It adds no dependency — `dotenv` was already installed.

---

## Troubleshooting

**`Code execution service is not running`** — start it with `npm run dev:exec`, then check http://localhost:4001/health.

**`Missing runner images`** on `/code/health` — run `npm run sandbox:build`. Until then set `SANDBOX_DRIVER=local` in `.env`.

**`Docker daemon is not reachable`** — start Docker Desktop and wait until the whale icon stops animating. If launching it does nothing, check WSL: `wsl --list --verbose` should eventually show `docker-desktop` as `Running`. When it stays `Stopped`, start Docker Desktop from the Start menu (it may need to prompt for elevation, which it cannot do when launched non-interactively) or run `wsl --shutdown` and try again.

**`Environment variable not found: DATABASE_URL`** — you are invoking the Prisma CLI directly instead of through the npm scripts. Use `npm run db:push` / `npm run seed`, or prefix manually: `node scripts/with-env.mjs prisma studio`.

**Port 5433 already in use** — change `POSTGRES_PORT` in `.env` and update the port in `DATABASE_URL` to match.

**"Invalid email or password" but you're sure the password is right** — the API returns the *same* message whether the email is unregistered or the password is wrong, so it cannot be used to discover which emails have accounts. Check which accounts exist, then reset if needed:

```bash
npm run --workspace @devprep/server user:list
```

```bash
npm run --workspace @devprep/server user:password -- you@example.com newpassword123
```

There is no self-service password reset yet — it needs an email provider.

**Prisma cannot connect** — confirm the container is healthy with `docker compose ps`; `db:up` returns before Postgres finishes its first-boot initialisation, so give it a few seconds. On the portable path, make sure `npm run db:local` is still running in its own terminal — it holds the server in the foreground.

**`character ... has no equivalent in encoding "WIN1252"` while seeding** — the cluster was initialised with the Windows system locale instead of UTF-8. The portable script forces `--encoding=UTF8`, so this means an older data directory: `npm run db:local:reset`.

**Python "Downloading… Extracting…" on the local driver** — you have the PEP-514 Python install manager shim. It is already handled by the driver's environment allowlist; make sure you are on the current `execution-service` build.

---

## What is built and what is not

**Working end to end:** authentication with rotating refresh tokens, password reset by email or SMS, account deletion, dashboard, topic system, DSA list and workspace, Monaco editor, JavaScript/Node/Python execution with full sandbox limits, run and submit with hidden test cases, algorithm visualiser, progress tracking, interview questions, active recall, daily challenge, blitz mode, year heatmap, share card, interview tracks, scratchpad, notes, bookmarks, spaced revision, mock interviews, command-palette search, dark/light themes, EN/Hinglish toggle, responsive layout.

**Deliberately not built yet:**

- **SQL playground** — the schema and UI have room for it, but running arbitrary SQL needs its own sandbox (a disposable database per query, not a container). Keeping it out of the general code-execution path was the point.
- **Real code formatting** — the Format button normalises indentation and trailing whitespace. A true formatter means bundling Prettier plus a Python formatter, which is a large dependency for a cosmetic feature.
- **Memory measurement** — `memoryUsage` is reported as 0 on successful runs. Docker gives a reliable OOM signal (which *is* handled) but not a cheap peak-RSS reading without cgroup polling.
- **Content depth** — 184 topics cover the highest-value items in each category, not every bullet in every syllabus. The seed files are plain TypeScript arrays designed to be extended.
- **Unit tests** — the API is covered by an end-to-end suite (`npm run e2e`, 75 checks against the real HTTP surface) and the seed data by `npm run seed:verify`, but there is no unit-level suite. The e2e suite is the higher-value one for this codebase — the bugs that actually appeared here were wiring and contract mismatches, which unit tests with mocked boundaries would have passed straight through.
