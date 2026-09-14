# Next.js Complete Course — noob to pro, production grade

20 modules / 120 lessons, same shape as the DevOps/Databases courses (6 lessons per
module, bilingual EN/Hinglish, `LessonExample.codeJs`/`codeTs` pair on every code
example so each one has a JS ⇄ TS toggle — the feature already exists for the React
course, just reused here).

Course record: slug `nextjs-complete`, icon ⬛ (or a real icon client-side via
`courseIcons.tsx` — reuse `SiNodedotjs`-style `SiNextdotjs` from react-icons/si),
color `#000000` (Next.js brand black), level progresses beginner → advanced across
the course the way the DevOps course's `maxDifficulty` does.

Explicit asks from Jay covered below: payments (M10), websockets/real-time (M11),
"all security" (M12-14, three modules), large data + large forms (M6), every
example in both JS and TS.

## Part I — Foundations
1. **Why Next.js & Project Setup** — what a framework buys you over raw React,
   App Router vs Pages Router, file-system routing, project structure, RSC
   mental model (server-first, opt into client), dev environment.
2. **Routing Deep Dive** — nested layouts, dynamic segments (`[id]`, `[...slug]`,
   `[[...slug]]`), route groups `(marketing)`, parallel routes `@slot`,
   intercepting routes, `loading.tsx`/`error.tsx`/`not-found.tsx`.
3. **Rendering Strategies** — Server vs Client Components (the actual rule for
   choosing), SSR/SSG/ISR/streaming, `generateStaticParams`, Suspense boundaries,
   when each strategy is the right one (with real cost tradeoffs).
4. **Data Fetching & Caching** — `fetch` caching semantics, `revalidatePath`/
   `revalidateTag`, Server Actions basics, mutating data, request memoization,
   parallel vs sequential fetching (the waterfall trap).

## Part II — Forms & Data at Scale
5. **Forms Done Right** — Server Actions forms, Zod validation (client + server,
   same schema), `useActionState`/`useFormStatus`, progressive enhancement
   (works before JS loads), optimistic UI with `useOptimistic`.
6. **Large Forms & Large Datasets** — multi-step/wizard forms with state
   preservation, dynamic field arrays, virtualized long lists (windowing),
   pagination vs cursor-based infinite scroll, bulk/CSV import at scale,
   debounced server-side search, avoiding re-render storms on big forms.
7. **File Uploads & Media** — presigned S3 URLs (never proxy big files through
   your server), streaming multipart uploads, `next/image` optimization,
   video/large asset delivery via CDN.

## Part III — Identity & Money
8. **Authentication** — Auth.js (NextAuth) v5, sessions vs JWT tradeoffs, OAuth
   providers, credentials provider done safely (hashing, timing attacks),
   middleware-based route protection, role-based access control.
9. **Database Integration at Production Scale** — Prisma with Next.js,
   connection pooling on serverless (the exhaustion problem + Accelerate/
   PgBouncer), edge-compatible clients, avoiding N+1, transactions in Server
   Actions.
10. **Payments with Stripe** — Checkout Sessions, webhooks + signature
    verification (why raw body matters), subscriptions & the billing portal,
    idempotency keys, refunds, test mode → live mode checklist, PCI scope
    (why you never touch card numbers directly).

## Part IV — Real-time & Security
11. **WebSockets & Real-time** — why Next.js's serverless functions can't hold
    a persistent connection, a separate realtime layer (Socket.IO on a Node
    server / Pusher / Ably), Server-Sent Events as the simpler alternative,
    presence & live-cursor patterns, real-time + optimistic UI together.
12. **Security Fundamentals** — XSS (and why `dangerouslySetInnerHTML` is the
    one to fear), CSRF in a Server Actions world, secure headers & CSP,
    secrets management (never in `NEXT_PUBLIC_*`), input validation at every
    trust boundary, dependency/supply-chain audits.
13. **API & Auth Security Hardening** — rate limiting (and where — edge vs
    origin), CORS done correctly, IDOR, session fixation, mapping the OWASP
    Top 10 onto Next.js concretely, bot/abuse protection (Turnstile/hCaptcha).
14. **Server Actions & Data Security** — the mistake of assuming a Server
    Action is automatically authorized, mass assignment, re-checking auth
    inside every mutation (not just middleware), zod-parsing untrusted input
    even from your own client.

## Part V — Performance & Scale
15. **Performance Optimization** — bundle analysis, dynamic imports/code
    splitting, font optimization, Core Web Vitals (LCP/INP/CLS) and what
    actually moves each one.
16. **Caching & Scaling Large Data** — `unstable_cache`/React `cache`, a Redis
    layer, CDN edge caching, database query optimization, read replicas, the
    N+1 problem revisited at scale.
17. **Edge, Middleware & Multi-tenancy** — edge runtime tradeoffs (what you
    lose), middleware patterns (auth gate, geolocation, A/B bucketing),
    feature flags, multi-tenant architecture (subdomain/path-based).

## Part VI — Shipping It
18. **Testing** — Vitest/Jest unit tests, React Testing Library component
    tests, Playwright E2E, testing Server Actions and route handlers.
19. **Observability, Errors & Deployment** — error boundaries, Sentry,
    structured logging, health checks, Vercel vs self-hosted Docker, CI/CD,
    environment variable management across environments, preview deploys.
20. **SEO, Accessibility & Production Launch** — Metadata API, sitemap/robots,
    structured data (JSON-LD), accessibility audit, the final go-live
    checklist, capstone: reviewing a small app against everything above.

## Verification approach

Where runnable offline: scaffold a real `create-next-app` project in
`scratchpad/`, drop the lesson's code in, run `next build`/`next dev` +
`curl`/Playwright to confirm real output — same standard as the DSA/DevOps
courses. Conceptual modules (WebSockets infra choices, payments webhook
signing, security posture, deployment) verified the way DevOps M13-15/M20
were: precise and accurate, clearly marked prose where a full external
service (real Stripe account, real Pusher account) can't be exercised
offline.

## Progress

- [x] Course shell in seed.ts (`seedNextJsCourse`, Course record) — commit `09a7e92`
- [x] M1 Why Next.js & Project Setup — 6/6 lessons, commit `e236638`
- [x] M2 Routing Deep Dive — 3/3 lessons, commit `76eff62`
- [x] M3 Rendering Strategies — 3/3 lessons, commit `8cc040c`
- [x] M4 Data Fetching & Caching — 3/3 lessons, commit `066ad6b`
- [x] M5 Forms Done Right — 3/3 lessons, commit `cfe8172`
- [x] M6 Large Forms & Large Datasets — 3/3 lessons, commit `df288e2`
- [x] M7 File Uploads & Media — 3/3 lessons, commit `b8f79a8`
- [x] M8 Authentication — 3/3 lessons, commit `f60d011`
- [x] M9 Database Integration at Production Scale — 3/3 lessons, commit `be3615d`
- [x] M10 Payments with Stripe — 3/3 lessons, commit `559e606`
- [x] M11 WebSockets & Real-time — 3/3 lessons, commit `c418750`
- [x] M12 Security Fundamentals — 3/3 lessons, commit `de3f103`
- [x] M13 API & Auth Security Hardening — 3/3 lessons, commit `f7b1e99`
- [x] M14 Server Actions & Data Security — 3/3 lessons, commit `7652629`
- [x] M15 Performance Optimization — 3/3 lessons, commit `583c57f`
- [x] M16 Caching & Scaling Large Data — 3/3 lessons, commit `c56fae9`
- [x] M17 Edge, Middleware & Multi-tenancy — 3/3 lessons, commit `81f0212`
- [x] M18 Testing — 3/3 lessons, commit `473657a`
- [x] M19 Observability, Errors & Deployment — 3/3 lessons, commit `0dc4fc1`
- [x] M20 SEO, Accessibility & Production Launch — 3/3 lessons, commit `0a945aa`

**M1-M20 COMPLETE: 20/20 modules, 63/63 lessons seeded, wired, and deployed to production.**
(M1 has 6 lessons; M2-M20 have 3 lessons each = 6 + 19*3 = 63 total.)

## Gap-fill extension (2026-09-14)

A content-coverage audit against "noob to pro, production-grade, big project,
every possible thing" found 8 real gaps not covered by M1-20 (structural audit
was clean — this was a curriculum-completeness check, not a bug-finding one).
Jay asked to fill all of them. Added as three more modules, same pattern
(3 lessons each, bilingual, codeJs/codeTs):

- [x] M21 Client State, Type-Safe APIs & Hydration — 3/3 lessons, commit `15acf68`,
  deployed
- [ ] M22 Background Jobs, Email & Internationalization — background job
  systems (Inngest/BullMQ) for work outside the request/response cycle;
  transactional email done correctly (Resend/SendGrid, templates,
  deliverability); internationalized routing (locale segments, next-intl)
- [ ] M23 Partial Prerendering, Turbopack & Standalone Builds — PPR (static
  shell + dynamic content on one route, and why it's not just Suspense
  streaming); Turbopack's effect on bundle analysis/build perf; `output:
  "standalone"` for a minimal production Docker image (ties back to this
  course's own Docker deployment)

Course record's `order` (21→23), `totalXpReward` (10000→11500), `estimatedHours`
(200→230), and top-level `description`/`descriptionHi` updated to mention the
new track. Module metadata (name/description, order 21-23) already added to
`seedNextJsCourse()` in seed.ts — only the lesson content files remain.
