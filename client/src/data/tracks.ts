/**
 * Interview tracks — ordered plans, not another list.
 *
 * The app already gives you a library. A library answers "what exists"; a track
 * answers "what do I do next, and when am I done". That is the difference
 * between browsing and preparing.
 *
 * Tracks are defined client-side on purpose: they are a *curriculum*, not user
 * data. Progress is derived from what you have already marked known or solved,
 * so a track never needs its own tables and can never disagree with the rest of
 * the app about what you have done.
 */

export interface TrackDay {
  day: number;
  title: string;
  /**
   * The stage this day belongs to. Rendered as a heading above the first day
   * that carries it, so a long track reads as a handful of phases rather than
   * sixty undifferentiated rows — and so "finish this, then start that" is
   * visible rather than implied.
   */
  phase?: string;
  /** Topic slugs to read. */
  topics?: string[];
  /** DSA problem slugs to solve. */
  problems?: string[];
  /** Question categories to drill in recall. */
  recall?: string[];
  /** A mock interview at the end of a phase. */
  mock?: boolean;
  note?: string;
}

export interface Track {
  slug: string;
  name: string;
  role: string;
  days: number;
  blurb: string;
  blurbHi: string;
  plan: TrackDay[];
}

export const TRACKS: Track[] = [
  {
    slug: 'zero-to-fullstack',
    name: 'Zero to Full Stack',
    role: 'Complete beginner to job ready',
    days: 60,
    blurb: 'The long way round, in order. One subject at a time, finished before the next one starts — JavaScript, then TypeScript, then React, then Node, then databases. Two topics a day, not ten.',
    blurbHi: 'Lamba raasta, kram se. Ek waqt mein ek vishay, agla tabhi jab pichhla khatam — JavaScript, phir TypeScript, phir React, phir Node, phir databases. Din ke do topic, das nahi.',
    plan: [
      /* Phase 1 - JavaScript (days 1-12) */
      { day: 1, title: 'How the web works', phase: '1 · JavaScript', recall: ['Web Basics'], note: 'Start here even if it feels obvious. Every later topic assumes it.' },
      { day: 2, title: 'Variables and scope', topics: ['js-variables-and-scope'], note: 'Open the Tricks tab on every topic. Understanding something once is not the same as remembering it in an interview.' },
      { day: 3, title: 'Hoisting', topics: ['js-hoisting'] },
      { day: 4, title: 'Closures — the big one', topics: ['js-closures'], note: 'If one JavaScript topic comes up in every interview, it is this one.' },
      { day: 5, title: 'Arrays and objects in practice', topics: ['js-array-methods'], problems: ['reverse-string', 'move-zeroes'] },
      { day: 6, title: 'Map, Set and modern syntax', topics: ['js-map-set', 'js-es6-features'], problems: ['valid-anagram'] },
      { day: 7, title: 'Catch up and recall', recall: ['JavaScript'], note: 'No new material today. Go back over anything from days 1 to 6 that did not stick.' },
      { day: 8, title: 'this and prototypes', topics: ['js-this-keyword', 'js-prototype-inheritance'], problems: ['two-sum'] },
      { day: 9, title: 'The event loop', topics: ['js-event-loop'], note: 'One doctor, two queues. Do not move on until you can predict the output order.' },
      { day: 10, title: 'Promises', topics: ['js-promises'], problems: ['first-unique-character'] },
      { day: 11, title: 'async/await and errors', topics: ['js-async-await', 'js-error-handling'], problems: ['valid-parentheses'] },
      { day: 12, title: 'Mock: JavaScript only', mock: true, recall: ['JavaScript'] },

      /* Phase 2 - TypeScript (days 13-20) */
      { day: 13, title: 'What TypeScript is, and is not', phase: '2 · TypeScript', topics: ['ts-why-typescript', 'ts-basic-types'], note: 'The labels come off before the food is served. That one image explains nearly everything.' },
      { day: 14, title: 'Inference, interfaces and types', topics: ['ts-inference-and-annotations', 'ts-interfaces-vs-types'] },
      { day: 15, title: 'Functions and object types', topics: ['ts-functions', 'ts-objects-and-optional'], problems: ['longest-common-prefix'] },
      { day: 16, title: 'Unions and narrowing', topics: ['ts-unions-and-narrowing'], note: 'Discriminated unions are the single most useful pattern in TypeScript.' },
      { day: 17, title: 'Null safety and enums', topics: ['ts-null-safety', 'ts-enums-and-literals'], problems: ['remove-duplicates-sorted-array'] },
      { day: 18, title: 'Generics', topics: ['ts-generics'], note: 'Take your time here. Generics unlock everything that comes after.' },
      { day: 19, title: 'Utility types, config, reading errors', topics: ['ts-utility-types', 'ts-tsconfig', 'ts-common-errors'], recall: ['TypeScript'] },
      { day: 20, title: 'Mock: JavaScript and TypeScript', mock: true, recall: ['JavaScript', 'TypeScript'] },

      /* Phase 3 - React (days 21-30) */
      { day: 21, title: 'Components and JSX', phase: '3 · React', topics: ['react-components-and-jsx'] },
      { day: 22, title: 'Props and state', topics: ['react-props-and-state', 'react-usestate'], note: 'Props are post, state is your diary.' },
      { day: 23, title: 'useEffect', topics: ['react-useeffect'], problems: ['best-time-to-buy-and-sell-stock'] },
      { day: 24, title: 'Refs and lists', topics: ['react-useref', 'react-keys-and-lists'], note: 'Index-as-key is the bug you will actually ship. Read the trick.' },
      { day: 25, title: 'Typing React properly', topics: ['ts-react'], note: 'useState([]) infers never[]. Everyone writes it once.' },
      { day: 26, title: 'Catch up and recall', recall: ['React'], note: 'No new material. Rebuild something small from memory instead.' },
      { day: 27, title: 'Context and custom hooks', topics: ['react-context', 'react-custom-hooks'] },
      { day: 28, title: 'Rendering and reconciliation', topics: ['react-rendering-reconciliation'], problems: ['max-sum-subarray-size-k'] },
      { day: 29, title: 'Performance and error boundaries', topics: ['react-usememo-usecallback', 'react-performance', 'react-error-boundaries'] },
      { day: 30, title: 'Mock: frontend', mock: true, recall: ['React', 'JavaScript', 'TypeScript'] },

      /* Phase 4 - Node and Express (days 31-38) */
      { day: 31, title: 'What Node actually is', phase: '4 · Node & Express', topics: ['node-runtime-and-event-loop'], note: 'Great at waiting, terrible at thinking. That is the whole model.' },
      { day: 32, title: 'Modules and streams', topics: ['node-modules-commonjs-esm', 'node-streams-buffers'], problems: ['merge-two-sorted-lists'] },
      { day: 33, title: 'Express and middleware', topics: ['express-middleware'] },
      { day: 34, title: 'Layering your app', topics: ['express-layering'], note: 'Could you swap Express for a CLI without touching the service? That is the test.' },
      { day: 35, title: 'Validation, the boundary rule', topics: ['express-validation'], note: 'Would you trust the label on a parcel from a stranger? Then do not trust req.body.' },
      { day: 36, title: 'TypeScript on the server', topics: ['ts-node-express', 'ts-declarations-and-modules'] },
      { day: 37, title: 'Pagination and caching', topics: ['express-pagination-caching'], problems: ['binary-search'], recall: ['Node.js'] },
      { day: 38, title: 'Mock: Node and Express', mock: true, recall: ['Node.js'] },

      /* Phase 5 - SQL and PostgreSQL (days 39-47) */
      { day: 39, title: 'SELECT, WHERE, ORDER BY', phase: '5 · SQL & Postgres', topics: ['sql-select-where-order'], note: 'SQL runs in a different order than you write it. That one fact explains several confusing errors.' },
      { day: 40, title: 'JOINs', topics: ['sql-joins'], note: 'Filtering the right table in WHERE silently turns a LEFT JOIN into an INNER JOIN.' },
      { day: 41, title: 'Grouping and aggregates', topics: ['sql-group-by-aggregates'], problems: ['top-k-frequent-elements'] },
      { day: 42, title: 'Subqueries and CTEs', topics: ['sql-subqueries-cte'] },
      { day: 43, title: 'Indexes', topics: ['sql-indexes'], note: 'An index is the back of a book. Left to right, no skipping.' },
      { day: 44, title: 'Transactions and injection', topics: ['sql-transactions-acid', 'sql-injection'], recall: ['SQL'] },
      { day: 45, title: 'Schema design', topics: ['db-normalization'], note: 'The key, the whole key, and nothing but the key.' },
      { day: 46, title: 'Postgres specifics', topics: ['pg-why-postgres', 'pg-data-types', 'pg-jsonb'], note: 'TIMESTAMPTZ or regret.' },
      { day: 47, title: 'Query plans and migrations', topics: ['pg-explain-analyze', 'pg-migrations-seeding'], recall: ['PostgreSQL'], problems: ['kth-largest-element'] },

      /* Phase 6 - MongoDB (days 48-51) */
      { day: 48, title: 'Documents and CRUD', phase: '6 · MongoDB', topics: ['mongo-documents', 'mongo-crud'], note: 'Forget $set and the rest of the document is deleted.' },
      { day: 49, title: 'Queries and aggregation', topics: ['mongo-query-operators', 'mongo-aggregation'] },
      { day: 50, title: 'Indexes and schema design', topics: ['mongo-indexes', 'mongo-schema-design'], note: 'Read together, store together. And never embed an unbounded array.' },
      { day: 51, title: 'Mongoose, and choosing a database', topics: ['mongo-mongoose', 'mongo-vs-sql'], recall: ['MongoDB', 'Database'] },

      /* Phase 7 - Auth, REST and real-time (days 52-56) */
      { day: 52, title: 'Sessions and JWTs', phase: '7 · Auth & APIs', topics: ['auth-jwt-vs-sessions'], note: 'Sessions can be cancelled. JWTs cannot. That is the whole trade-off.' },
      { day: 53, title: 'Passwords, properly', topics: ['auth-password-security'], note: 'Fast hash, fast crack.' },
      { day: 54, title: 'XSS, CSRF, CORS', topics: ['auth-xss-csrf-cors'], recall: ['Authentication'], note: 'XSS steals, CSRF forges, CORS restricts. And CORS does not protect your API.' },
      { day: 55, title: 'REST design', topics: ['rest-design-principles', 'rest-idempotency-versioning'], recall: ['REST API'], problems: ['merge-intervals'] },
      { day: 56, title: 'Real-time', topics: ['ws-why-not-http', 'ws-how-it-works', 'ws-socketio', 'ws-auth-and-security'], recall: ['WebSockets'] },

      /* Phase 8 - Scale and finish (days 57-60) */
      { day: 57, title: 'Scaling, caching, queues', phase: '8 · Scale & finish', topics: ['sd-scaling-basics', 'sd-caching-strategies', 'sd-queues-async'], recall: ['System Design'] },
      { day: 58, title: 'Git, Docker, testing', topics: ['git-branching-and-history', 'docker-fundamentals', 'testing-pyramid'], recall: ['Git', 'Docker', 'Testing'] },
      { day: 59, title: 'DSA sweep', problems: ['number-of-islands', 'coin-change', 'climbing-stairs', 'subsets'], note: 'Then run Active Recall on Weak spots and clear the revision queue.' },
      { day: 60, title: 'Full mock interview', mock: true },
    ],
  },

  {
    slug: 'frontend-2-weeks',
    name: 'Frontend in 2 weeks',
    role: 'React / Frontend',
    days: 14,
    blurb: 'JavaScript fundamentals, enough TypeScript to be dangerous, React internals, and the DSA that actually comes up in frontend rounds.',
    blurbHi: 'JavaScript ki jad, kaam bhar ka TypeScript, React ke andar ka kaam, aur wo DSA jo frontend rounds mein sach mein aati hai.',
    plan: [
      { day: 1, title: 'Scope, hoisting, closures', phase: 'JavaScript', topics: ['js-variables-and-scope', 'js-hoisting', 'js-closures'], recall: ['JavaScript'] },
      { day: 2, title: '`this`, prototypes, classes', topics: ['js-this-keyword', 'js-prototype-inheritance'], problems: ['two-sum'] },
      { day: 3, title: 'The event loop', topics: ['js-event-loop'], recall: ['JavaScript'], note: 'The output-order question is near-guaranteed.' },
      { day: 4, title: 'Promises and async/await', topics: ['js-promises', 'js-async-await'], problems: ['valid-parentheses'] },
      { day: 5, title: 'Arrays, Map, Set, modern syntax', topics: ['js-array-methods', 'js-map-set', 'js-es6-features'], problems: ['first-unique-character'] },
      { day: 6, title: 'TypeScript, enough to be useful', phase: 'TypeScript', topics: ['ts-why-typescript', 'ts-basic-types', 'ts-interfaces-vs-types', 'ts-unions-and-narrowing'], recall: ['TypeScript'], note: 'Types are erased at build time — that one fact answers most follow-ups.' },
      { day: 7, title: 'Mock: JavaScript + TypeScript', mock: true, recall: ['JavaScript', 'TypeScript'] },
      { day: 8, title: 'React basics and state', phase: 'React', topics: ['react-components-and-jsx', 'react-props-and-state', 'react-usestate'] },
      { day: 9, title: 'useEffect and its traps', topics: ['react-useeffect', 'react-useref'], note: 'Stale closures and cleanup are the two things they probe.' },
      { day: 10, title: 'Keys, lists, reconciliation', topics: ['react-keys-and-lists', 'react-rendering-reconciliation'], recall: ['React'] },
      { day: 11, title: 'Memoisation and performance, honestly', topics: ['react-usememo-usecallback', 'react-performance'], problems: ['longest-substring-without-repeating'] },
      { day: 12, title: 'Context, custom hooks, boundaries', topics: ['react-context', 'react-custom-hooks', 'react-error-boundaries'], note: 'Typing React props and state is where TypeScript pays off — revisit ts-react.' },
      { day: 13, title: 'DSA that shows up in frontend rounds', phase: 'Practice', problems: ['group-anagrams', 'merge-intervals', 'maximum-subarray'] },
      { day: 14, title: 'Full mock + weak spots', mock: true, recall: ['JavaScript', 'TypeScript', 'React'] },
    ],
  },

  {
    slug: 'backend-3-weeks',
    name: 'Backend in 3 weeks',
    role: 'Node / Backend',
    days: 21,
    blurb: 'Node internals, SQL and Postgres, auth done properly, and the system-design answers that need a trade-off rather than a buzzword.',
    blurbHi: 'Node ke andar ka kaam, SQL aur Postgres, auth theek se, aur wo system-design jawab jinme buzzword nahi trade-off chahiye.',
    plan: [
      { day: 1, title: 'What Node actually is', phase: 'Node & Express', topics: ['node-runtime-and-event-loop'], recall: ['Node.js'] },
      { day: 2, title: 'Modules and streams', topics: ['node-modules-commonjs-esm', 'node-streams-buffers'] },
      { day: 3, title: 'Express middleware and layering', topics: ['express-middleware', 'express-layering'] },
      { day: 4, title: 'Validation, and typing the server', topics: ['express-validation', 'ts-node-express'], recall: ['Node.js', 'TypeScript'], note: 'Types do not validate input. Validate at the door, derive the type from the schema.' },
      { day: 5, title: 'SQL foundations', phase: 'Databases', topics: ['sql-select-where-order', 'sql-joins'], problems: ['two-sum'] },
      { day: 6, title: 'Grouping and subqueries', topics: ['sql-group-by-aggregates', 'sql-subqueries-cte'] },
      { day: 7, title: 'Mock: Node + SQL', mock: true, recall: ['SQL'] },
      { day: 8, title: 'Indexes and query plans', topics: ['sql-indexes', 'pg-explain-analyze'], note: 'Reading a plan is what separates "I know SQL" from "I have fixed a slow query".' },
      { day: 9, title: 'Transactions and ACID', topics: ['sql-transactions-acid', 'pg-mvcc-vacuum'] },
      { day: 10, title: 'Postgres beyond plain SQL', topics: ['pg-jsonb', 'pg-upsert-returning', 'pg-window-functions'] },
      { day: 11, title: 'Schema design and migrations', topics: ['db-normalization', 'pg-migrations-seeding'], recall: ['SQL', 'PostgreSQL'] },
      { day: 12, title: 'MongoDB, and when to choose it', topics: ['mongo-documents', 'mongo-schema-design', 'mongo-vs-sql'] },
      { day: 13, title: 'DSA: hashing and two pointers', problems: ['group-anagrams', 'two-sum-sorted', 'container-with-most-water'] },
      { day: 14, title: 'Mock: databases', mock: true, recall: ['PostgreSQL', 'MongoDB', 'Database'] },
      { day: 15, title: 'Auth done properly', phase: 'Production', topics: ['auth-jwt-vs-sessions', 'auth-password-security'], recall: ['Authentication'] },
      { day: 16, title: 'XSS, CSRF, CORS', topics: ['auth-xss-csrf-cors'], note: 'Knowing CORS does NOT protect your API is the differentiator.' },
      { day: 17, title: 'REST design and idempotency', topics: ['rest-design-principles', 'rest-idempotency-versioning'] },
      { day: 18, title: 'Real-time', topics: ['ws-why-not-http', 'ws-socketio', 'ws-scaling'], recall: ['WebSockets'] },
      { day: 19, title: 'Scaling, caching, queues', topics: ['sd-scaling-basics', 'sd-caching-strategies', 'sd-queues-async'] },
      { day: 20, title: 'DSA: DP and graphs', problems: ['coin-change', 'climbing-stairs', 'number-of-islands'] },
      { day: 21, title: 'Full mock + weak spots', mock: true, recall: ['System Design', 'Node.js'] },
    ],
  },

  {
    slug: 'fullstack-30-days',
    name: 'Full Stack in 30 days',
    role: 'Full Stack',
    days: 30,
    blurb: 'The complete run in order — JavaScript, TypeScript, React, Node, databases, then production concerns. Finish each phase before starting the next.',
    blurbHi: 'Poora course, kram se — JavaScript, TypeScript, React, Node, databases, phir production ki baatein. Ek phase khatam karo, tabhi agla shuru karo.',
    plan: [
      { day: 1, title: 'How the web actually works', phase: 'Foundations', recall: ['Web Basics'], topics: ['js-variables-and-scope'], note: 'If any of the basics feel shaky, this is the day to fix it — nothing later gets easier by skipping it.' },
      { day: 2, title: 'Hoisting and closures', topics: ['js-hoisting', 'js-closures'] },
      { day: 3, title: '`this` and prototypes', topics: ['js-this-keyword', 'js-prototype-inheritance'], problems: ['two-sum'] },
      { day: 4, title: 'The event loop', topics: ['js-event-loop'], recall: ['JavaScript'], note: 'One doctor, two queues. This image answers every output-order question.' },
      { day: 5, title: 'Async JavaScript', topics: ['js-promises', 'js-async-await'], problems: ['valid-parentheses'] },
      { day: 6, title: 'Collections, errors, modern syntax', topics: ['js-array-methods', 'js-map-set', 'js-error-handling', 'js-es6-features'] },
      { day: 7, title: 'Mock: JavaScript', mock: true, recall: ['JavaScript'] },

      { day: 8, title: 'TypeScript basics', phase: 'TypeScript', topics: ['ts-why-typescript', 'ts-basic-types', 'ts-inference-and-annotations', 'ts-interfaces-vs-types'], note: 'Everything follows from one fact: the types are erased before the code runs.' },
      { day: 9, title: 'Narrowing, null safety, generics', topics: ['ts-unions-and-narrowing', 'ts-null-safety', 'ts-generics'], recall: ['TypeScript'], problems: ['maximum-subarray'] },
      { day: 10, title: 'Utility types and TypeScript in React', topics: ['ts-utility-types', 'ts-react'] },

      { day: 11, title: 'React fundamentals', phase: 'React', topics: ['react-components-and-jsx', 'react-props-and-state', 'react-usestate'] },
      { day: 12, title: 'Effects and refs', topics: ['react-useeffect', 'react-useref'], problems: ['two-sum-sorted'] },
      { day: 13, title: 'Rendering, keys and reconciliation', topics: ['react-keys-and-lists', 'react-rendering-reconciliation'] },
      { day: 14, title: 'Context, hooks, performance', topics: ['react-context', 'react-custom-hooks', 'react-usememo-usecallback'], recall: ['React'] },
      { day: 15, title: 'Mock: frontend', mock: true, recall: ['React', 'JavaScript', 'TypeScript'] },

      { day: 16, title: 'Node internals', phase: 'Backend', topics: ['node-runtime-and-event-loop', 'node-modules-commonjs-esm', 'node-streams-buffers'] },
      { day: 17, title: 'Express architecture', topics: ['express-middleware', 'express-layering', 'express-validation'], note: 'Validate at the door, trust inside the house.' },
      { day: 18, title: 'TypeScript on the server', topics: ['ts-node-express', 'ts-declarations-and-modules'], problems: ['longest-substring-without-repeating'] },

      { day: 19, title: 'SQL foundations', phase: 'Databases', topics: ['sql-select-where-order', 'sql-joins', 'sql-group-by-aggregates'] },
      { day: 20, title: 'Indexes and query plans', topics: ['sql-indexes', 'pg-explain-analyze'], problems: ['binary-search'] },
      { day: 21, title: 'Transactions, injection, schema design', topics: ['sql-transactions-acid', 'sql-injection', 'db-normalization'], recall: ['SQL'] },
      { day: 22, title: 'Postgres specifics', topics: ['pg-jsonb', 'pg-window-functions', 'pg-migrations-seeding'], recall: ['PostgreSQL'] },
      { day: 23, title: 'MongoDB', topics: ['mongo-documents', 'mongo-aggregation', 'mongo-schema-design', 'mongo-vs-sql'], recall: ['MongoDB'] },
      { day: 24, title: 'Mock: databases', mock: true, recall: ['SQL', 'PostgreSQL', 'MongoDB'] },

      { day: 25, title: 'Auth and security', phase: 'Production', topics: ['auth-jwt-vs-sessions', 'auth-password-security', 'auth-xss-csrf-cors'], recall: ['Authentication'], note: 'CORS does not protect your API. Knowing that is the differentiator.' },
      { day: 26, title: 'REST and real-time', topics: ['rest-design-principles', 'rest-idempotency-versioning', 'ws-why-not-http', 'ws-socketio'], recall: ['REST API', 'WebSockets'] },
      { day: 27, title: 'System design', topics: ['sd-scaling-basics', 'sd-caching-strategies', 'sd-queues-async'], recall: ['System Design'] },
      { day: 28, title: 'Git, Docker, testing', topics: ['git-branching-and-history', 'docker-fundamentals', 'testing-pyramid'], recall: ['Git', 'Docker', 'Testing'] },

      { day: 29, title: 'DSA sweep + weak spots', phase: 'Final', problems: ['subsets', 'number-of-islands', 'coin-change', 'climbing-stairs'], note: 'Run Active Recall on Weak spots, then clear the revision queue.' },
      { day: 30, title: 'Full mock interview', mock: true },
    ],
  },
];

export const trackBySlug = (slug: string): Track | undefined => TRACKS.find((t) => t.slug === slug);
