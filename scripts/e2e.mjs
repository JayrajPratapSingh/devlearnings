/**
 * End-to-end API regression.
 *
 * Exercises the real HTTP surface against a running dev stack, using a throwaway
 * account it registers and then deletes, so it can be re-run any number of times
 * without leaving residue or depending on seeded user state.
 *
 *   npm run dev          # in another terminal
 *   npm run e2e
 *
 * Deliberately not a unit-test suite: the value here is catching the wiring
 * failures — a route that never got mounted, an auth guard on the wrong side of
 * a handler, a response shape the client does not expect, hidden test data
 * leaking to the browser — that pass typecheck and only surface at runtime.
 */
const API = process.env.API_URL ?? 'http://localhost:4000/api';

let passed = 0;
const failures = [];

function check(name, ok, detail = '') {
  if (ok) {
    passed += 1;
    console.log(`  \x1b[32m✓\x1b[0m ${name}`);
  } else {
    failures.push(name + (detail ? ` — ${detail}` : ''));
    console.log(`  \x1b[31m✗\x1b[0m ${name}${detail ? ` \x1b[2m— ${detail}\x1b[0m` : ''}`);
  }
}

const section = (title) => console.log(`\n\x1b[1m${title}\x1b[0m`);

/** Holds the access token and refresh cookie across calls, like the browser does. */
const session = { token: null, cookie: null };

async function call(method, path, body, opts = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (session.token && !opts.anon) headers['Authorization'] = `Bearer ${session.token}`;
  if (session.cookie) headers['Cookie'] = session.cookie;

  const res = await fetch(API + path, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const setCookie = res.headers.get('set-cookie');
  if (setCookie) session.cookie = setCookie.split(';')[0];

  const raw = await res.text();
  let json = null;
  try {
    json = raw ? JSON.parse(raw) : null;
  } catch {
    /* non-JSON body — the status still tells us what we need */
  }
  return { status: res.status, body: json, raw };
}

const get = (p, o) => call('GET', p, undefined, o);
const post = (p, b, o) => call('POST', p, b, o);
const patch = (p, b) => call('PATCH', p, b);
const del = (p, b) => call('DELETE', p, b);

/* ============================================================================ */

const email = `e2e-${Date.now()}@devprep.test`;
const password = 'e2e-Password-123';

console.log(`\n\x1b[1mDevPrep end-to-end regression\x1b[0m  →  ${API}`);

/* ------------------------------- reachability ------------------------------- */
section('Service reachability');
{
  const health = await fetch(API.replace(/\/api$/, '') + '/health')
    .then((r) => r.json())
    .catch(() => null);
  check('API responds to /health', health?.ok === true);
  if (!health?.ok) {
    console.error('\nAPI is not running. Start it with `npm run dev` and retry.\n');
    process.exit(1);
  }
}

/* ---------------------------------- auth ---------------------------------- */
section('Authentication');
{
  const r = await post('/auth/register', { email, password, name: 'E2E Runner' }, { anon: true });
  check('register returns 201', r.status === 201, `got ${r.status} ${r.raw.slice(0, 120)}`);
  check('register returns an access token', typeof r.body?.accessToken === 'string');
  check('register never returns the password hash', !r.raw.includes('passwordHash'));
  session.token = r.body?.accessToken ?? null;
}
check('me returns the current user', (await get('/auth/me')).body?.user?.email === email);
{
  // The anon flag drops the bearer header but still sends the refresh cookie —
  // exactly the browser's state. The guard must reject on the header alone.
  const r = await get('/topics/categories', { anon: true });
  check('protected route rejects a missing bearer token', r.status === 401, `got ${r.status}`);
}
{
  const r = await post('/auth/login', { email, password: 'wrong-password-9' }, { anon: true });
  check('wrong password is rejected', r.status === 401, `got ${r.status}`);
  check(
    'login error does not reveal which field was wrong',
    !/email (not found|does not exist|unknown)/i.test(r.raw),
  );
}
{
  const r = await post('/auth/refresh', undefined, { anon: true });
  check('refresh issues a new access token', typeof r.body?.accessToken === 'string', `got ${r.status}`);
  if (r.body?.accessToken) session.token = r.body.accessToken;
}

/* --------------------------------- topics --------------------------------- */
section('Learning topics');
let sampleTopic = null;
{
  const r = await get('/topics/categories');
  const cats = r.body?.categories ?? [];
  check('topic categories load', cats.length >= 14, `${cats.length} categories`);
  check('categories carry completion counts', cats.every((c) => typeof c.percent === 'number'));

  const list = await get(`/topics/categories/${cats[0].slug}`);
  const topics = list.body?.topics ?? [];
  sampleTopic = topics[0]?.slug ?? null;
  check('topics load for a category', topics.length > 0, `${topics.length} topics`);
  check('list carries Hinglish summaries', topics.every((t) => typeof t.summaryHi === 'string'));
}
{
  const r = await get(`/topics/${sampleTopic}`);
  const t = r.body?.topic;
  check('topic detail loads', !!t, `got ${r.status}`);
  check('topic carries Hinglish content', typeof t?.contentHi === 'string' && t.contentHi.length > 0);
  check('topic carries a beginner explanation', typeof t?.simple === 'string' && t.simple.length > 0);
}
{
  const r = await patch(`/topics/${sampleTopic}/status`, { status: 'KNOWN' });
  check('topic can be marked known', r.status === 200, `got ${r.status} ${r.raw.slice(0, 100)}`);
  const after = await get(`/topics/${sampleTopic}`);
  check('known status persists', after.body?.topic?.status === 'KNOWN' || after.body?.status === 'KNOWN');
}

/* ---------------------------------- DSA ----------------------------------- */
section('DSA problems');
{
  const r = await get('/dsa');
  const problems = r.body?.problems ?? [];
  check('problem list loads', problems.length >= 41, `${problems.length} problems`);
  check('list never carries test data', !r.raw.includes('expectedOutput'));
  check('list reports aggregate stats', typeof r.body?.stats?.total === 'number');
}
{
  const r = await get('/dsa/two-sum');
  const p = r.body?.problem;
  check('problem detail loads', !!p, `got ${r.status}`);
  check('sample test cases are present', (p?.sampleTestCases ?? []).length > 0);
  check('hidden test cases are never serialised', (p?.sampleTestCases ?? []).length < (p?.totalTestCases ?? 99));
  check('reference solution stays locked until solved', p?.solutions === null);
  const starters = p?.starterCode ?? {};
  check(
    'starter code exists for both languages',
    !!starters.JAVASCRIPT && !!starters.PYTHON,
    Object.keys(starters).join(', '),
  );
}
{
  const r = await get('/dsa/daily');
  const slug = r.body?.daily?.problem?.slug;
  check('daily challenge resolves', !!slug, `got ${r.status}`);
  const again = await get('/dsa/daily');
  check('daily challenge is stable within a day', again.body?.daily?.problem?.slug === slug);
  check('daily reports its own streak', typeof r.body?.daily?.streak === 'number');
}
check('difficulty breakdown loads', Array.isArray((await get('/dsa/stats/difficulty')).body?.breakdown));

/* ------------------------------ code execution ----------------------------- */
section('Code execution');
{
  const exec = await get('/code/health');
  check('execution service is reachable', exec.status === 200, `got ${exec.status}`);
}
{
  const r = await post('/code/run', { language: 'JAVASCRIPT', code: 'console.log("ok")', input: '' });
  check('javascript runs', /ok/.test(r.body?.stdout ?? ''), `got ${r.status} ${r.raw.slice(0, 160)}`);
}
{
  const r = await post('/code/run', { language: 'PYTHON', code: 'print("ok")', input: '' });
  check('python runs', /ok/.test(r.body?.stdout ?? ''), `got ${r.status} ${r.raw.slice(0, 160)}`);
}
{
  const r = await post('/code/run', {
    language: 'JAVASCRIPT',
    code: 'const n=require("fs").readFileSync(0,"utf8").trim();console.log(Number(n)*2)',
    input: '21',
  });
  check('stdin reaches the program', /42/.test(r.body?.stdout ?? ''), r.raw.slice(0, 160));
}
{
  const r = await post('/code/run', { language: 'JAVASCRIPT', code: 'throw new Error("boom")', input: '' });
  check('a thrown error is reported, not swallowed', r.status === 200 && /boom/.test(r.raw), `got ${r.status}`);
}
{
  const r = await post('/code/run', {
    language: 'JAVASCRIPT',
    code: 'console.log(process.env.DATABASE_URL ?? "unset", process.env.JWT_SECRET ?? "unset")',
    input: '',
  });
  check(
    'sandbox cannot read server secrets',
    /unset unset/.test(r.body?.stdout ?? ''),
    (r.body?.stdout ?? r.raw).slice(0, 120),
  );
}
{
  const r = await post('/code/run', { language: 'JAVASCRIPT', code: 'while(true){}', input: '' });
  check('an infinite loop is killed by the timeout', r.status === 200 && !!r.body, `got ${r.status}`);
}

/* -------------------------------- questions -------------------------------- */
section('Interview questions');
{
  const r = await get('/questions/categories');
  const cats = (r.body?.categories ?? []).map((c) => c.category ?? c.name ?? c);
  check('question categories load', cats.length >= 12, `${cats.length} categories`);
  check('PostgreSQL category has questions', cats.includes('PostgreSQL'), cats.join(', '));
  check('WebSockets category has questions', cats.includes('WebSockets'), cats.join(', '));
}
for (const category of ['PostgreSQL', 'WebSockets']) {
  const r = await get(`/questions?category=${category}`);
  const qs = r.body?.questions ?? [];
  check(`${category} questions are retrievable`, qs.length >= 4, `${qs.length} questions`);
  check(
    `${category} answers exist in both languages`,
    qs.every((q) => q.shortAnswer?.length > 0 && q.shortAnswerHi?.length > 0),
  );
}
{
  const list = await get('/questions');
  const first = (list.body?.questions ?? [])[0];
  const r = await patch(`/questions/${first.id}/status`, { status: 'KNOWN' });
  check('question can be marked known', r.status === 200, `got ${r.status} ${r.raw.slice(0, 100)}`);
}

/* ---------------------------------- search --------------------------------- */
section('Global search');
{
  const r = await get('/search?q=closure');
  check('search finds closures', (r.body?.results ?? []).length > 0, `${r.body?.results?.length} results`);
}
{
  const r = await get('/search?q=event%20loop%20kya%20hai');
  check(
    'search tolerates Hinglish stop words',
    (r.body?.results ?? []).length > 0,
    `${r.body?.results?.length} results`,
  );
}
{
  const r = await get('/search?q=zzzznotarealthing');
  check('search returns nothing for nonsense', (r.body?.results ?? []).length === 0);
}
{
  const r = await get('/search?q=two%20sum');
  const hit = (r.body?.results ?? [])[0];
  check('a multi-word query ranks the exact title first', hit?.title === 'Two Sum', hit?.title);
  check('results carry a navigable href', typeof hit?.href === 'string' && hit.href.startsWith('/'));
}

/* ------------------------------ notes/bookmarks ----------------------------- */
section('Notes and bookmarks');
let noteId = null;
{
  const r = await post('/notes', { title: 'E2E note', content: 'body text' });
  noteId = r.body?.note?.id ?? r.body?.id ?? null;
  check('note is created', !!noteId, `got ${r.status} ${r.raw.slice(0, 120)}`);
  const list = await get('/notes');
  check('note appears in the list', (list.body?.notes ?? []).some((n) => n.id === noteId));
}
{
  const r = await post('/bookmarks/toggle', {
    kind: 'TOPIC',
    refId: sampleTopic,
    label: 'E2E bookmark',
    href: `/topic/${sampleTopic}`,
  });
  check('bookmark toggles on', r.status === 200 || r.status === 201, `got ${r.status} ${r.raw.slice(0, 120)}`);
  const list = await get('/bookmarks');
  check('bookmark appears in the list', (list.body?.bookmarks ?? []).length === 1);
  await post('/bookmarks/toggle', {
    kind: 'TOPIC',
    refId: sampleTopic,
    label: 'E2E bookmark',
    href: `/topic/${sampleTopic}`,
  });
  const after = await get('/bookmarks');
  check('the same call toggles it back off', (after.body?.bookmarks ?? []).length === 0);
}
{
  const r = await del(`/notes/${noteId}`);
  check('note is deleted', r.status === 200 || r.status === 204, `got ${r.status}`);
}

/* --------------------------------- revision -------------------------------- */
section('Spaced revision');
check('due queue loads', Array.isArray((await get('/revision/due')).body?.items));

/* ------------------------------ mock interview ------------------------------ */
section('Mock interview');
{
  const start = await post('/mock-interview', { durationMin: 15, questionCount: 3 });
  const id = start.body?.id;
  const questions = start.body?.questions ?? [];
  check('mock interview starts', !!id, `got ${start.status} ${start.raw.slice(0, 140)}`);
  check('mock interview has the requested question count', questions.length === 3, `${questions.length}`);
  check('the model answer is not sent up front', !start.raw.includes('shortAnswer'));

  const a = await post(`/mock-interview/${id}/answer`, { questionId: questions[0].id, selfScore: 2 });
  check('answer is recorded', a.status === 200, `got ${a.status} ${a.raw.slice(0, 140)}`);
  check('the model answer is revealed only after scoring', typeof a.body?.shortAnswer === 'string');

  const fin = await post(`/mock-interview/${id}/finish`);
  check('mock interview finishes', fin.status === 200, `got ${fin.status}`);
  check('finish reports a score', typeof (fin.body?.score ?? fin.body?.interview?.score) === 'number');

  const hist = await get('/mock-interview');
  check('finished interview appears in history', (hist.body?.interviews ?? []).length >= 1);
}

/* --------------------------------- progress -------------------------------- */
section('Progress tracking');
{
  const d = (await get('/progress/dashboard')).body;
  check('dashboard loads', typeof d?.overall === 'number');
  check('activity strip is 28 days', (d?.activity ?? []).length === 28, `${d?.activity?.length} entries`);
  check('marking a topic known moved the counter', (d?.topics?.completed ?? 0) >= 1);
  check('per-category breakdown is present', (d?.byCategory ?? []).length >= 14);
}
{
  const d = (await get('/progress')).body;
  check('progress detail loads', !!d);
  check('year activity is present for the heatmap', Array.isArray(d?.yearActivity));
  check('difficulty breakdown is present', Array.isArray(d?.difficulty));
}

/* ------------------------------ account removal ----------------------------- */
section('Account deletion');
{
  const wrong = await del('/auth/me', { password: 'not-the-password-1' });
  check('deletion refuses the wrong password', wrong.status === 401, `got ${wrong.status}`);

  const r = await del('/auth/me', { password });
  check('account deletes with the correct password', r.status === 200 || r.status === 204, `got ${r.status}`);

  const login = await post('/auth/login', { email, password }, { anon: true });
  check('deleted account can no longer log in', login.status === 401, `got ${login.status}`);
}

/* ---------------------------------- report ---------------------------------- */
const total = passed + failures.length;
console.log(`\n${'─'.repeat(64)}`);
if (failures.length) {
  console.log(`\x1b[31m${passed}/${total} checks passed\x1b[0m\n\nFailures:`);
  for (const f of failures) console.log(`  · ${f}`);
  console.log();
  process.exit(1);
}
console.log(`\x1b[32m${passed}/${total} checks passed.\x1b[0m\n`);
