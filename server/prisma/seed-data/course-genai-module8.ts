/**
 * Generative AI Complete Course — Module 8: RAG Part 2 — Vector Databases in Production, lessons 1-3.
 *
 * Lesson 1: pgvector vs a dedicated vector database, and indexing (HNSW/IVF) conceptually.
 * Lesson 2: Hybrid search — combining keyword and vector search.
 * Lesson 3: Re-ranking and assembling a complete production RAG pipeline end-to-end.
 */

import type { CourseLesson } from './course-js-module1';

export const GENAI_MODULE_8: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'genai-vector-databases-and-indexing',
    title: 'pgvector vs a Dedicated Vector Database, and Indexing',
    titleHi: 'pgvector vs Ek Dedicated Vector Database, Aur Indexing',
    description:
      "Module 7's pairwise cosine-similarity comparison doesn't scale past a handful of documents. This lesson covers the actual production answer: where embeddings are stored (pgvector vs. a dedicated vector database) and how an index makes comparing against millions of them fast.",
    descriptionHi:
      'Module 7 ki pairwise cosine-similarity comparison muthi bhar documents se aage scale nahi karti. Ye lesson actual production answer cover karta hai: embeddings kahan store hote hain (pgvector vs. ek dedicated vector database) aur ek index millions ke against compare karne ko fast kaise banata hai.',
    difficulty: 'HARD',
    duration: 22,
    order: 1,

    analogy: {
      en: "**A librarian checking every single book on every shelf to find ones about a topic, versus using a library's actual card catalog organized so you can walk almost directly to the relevant section.** Checking every book individually genuinely works — it's guaranteed to find every actually-relevant book — but it becomes hopelessly slow the moment a library has more than a few hundred books, since the time it takes scales directly with the collection's size. A library organized with a real indexing system lets you narrow down to roughly the right section almost immediately, checking only a small, highly-likely-relevant subset in detail rather than the entire collection — trading a small amount of \"might occasionally miss the single most obscure exact match\" for an enormous, necessary speed gain at real scale. Module 7's approach — computing cosine similarity against every single document one at a time — is checking every book on every shelf: correct, but it doesn't scale. An index (HNSW/IVF) is the card catalog: an upfront investment in organization that makes finding approximately-the-most-relevant items dramatically faster at the cost of a small, usually acceptable, chance of missing the single most obscure best match.",
      hi: 'Ek librarian jo ek topic ke baare mein books dhundhne ke liye har shelf pe har single book check karta hai, versus ek library ke actual card catalog use karna is tarike se organized ki aap almost directly relevant section tak walk kar sako. Har book ko individually check karna genuinely kaam karta hai — ye guaranteed hai ki har actually-relevant book mil jaayegi — par ye hopelessly slow ho jaata hai jis moment ek library mein kuch sau books se zyada hoti hain, kyunki lagne wala time collection ke size ke saath directly scale karta hai. Ek library jo ek real indexing system ke saath organized hai aapko almost immediately roughly sahi section tak narrow down karne deti hai, poori collection ke bajaye sirf ek chhote, highly-likely-relevant subset ko detail mein check karte hue — thodi si "kabhi kabhi single sabse obscure exact match miss ho sakta hai" ko real scale pe ek enormous, necessary speed gain ke liye trade karte hue. Module 7 ka approach — har single document ke against ek time pe ek cosine similarity compute karna — har shelf pe har book check karna hai: correct, par ye scale nahi karta. Ek index (HNSW/IVF) card catalog hai: organization mein ek upfront investment jo approximately-the-most-relevant items dhundhne ko dramatically faster banata hai ek chhoti, usually acceptable, single sabse obscure best match miss hone ki chance ke cost pe.',
    },

    simple: `**Why pairwise comparison (Module 7) genuinely breaks down at
scale:**

\`\`\`
Comparing a query against N documents one at a time (Module 7's
approach) takes time proportional to N — fine for 20 documents
(milliseconds), noticeably slow for 100,000 documents, and genuinely
impractical for millions. This isn't a minor inefficiency to optimize
later; it's a fundamental scaling problem that needs a different
approach entirely, not a faster version of the same approach.
\`\`\`

**Where to store embeddings — pgvector vs a dedicated vector
database:**

\`\`\`sql
-- pgvector: adds vector storage and similarity search AS AN EXTENSION
-- to a database you likely already run (PostgreSQL)
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  content TEXT,
  embedding VECTOR(1536) -- matches your embedding model's dimension
);

-- Cosine similarity search, using the same SQL you already know
SELECT content, 1 - (embedding <=> '[0.02, -0.31, ...]') AS similarity
FROM documents
ORDER BY embedding <=> '[0.02, -0.31, ...]'
LIMIT 5;
\`\`\`

\`\`\`ts
// A dedicated vector database (e.g. Pinecone): a separate, specialized
// system whose ENTIRE job is storing and searching vectors at scale
import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pinecone.index('documents');

await index.upsert([{ id: 'doc1', values: embedding, metadata: { content: text } }]);

const results = await index.query({ vector: queryEmbedding, topK: 5 });
\`\`\`

**When each is the right choice:**

\`\`\`
pgvector fits when:
  - You already run PostgreSQL for your application's normal data
  - Your scale is moderate (up to low millions of vectors, roughly)
  - You want vector search alongside normal relational queries in ONE
    system, avoiding the operational overhead of running two databases

A dedicated vector database fits when:
  - You're operating at very large scale (tens of millions+ vectors)
    where specialized infrastructure genuinely outperforms a
    general-purpose database with a vector extension
  - You need vector-search-specific features a general database
    doesn't offer as maturely (certain advanced indexing/filtering
    combinations)
  - Your team is fine with the added operational complexity of a
    second, specialized system
\`\`\`

**What an index actually does, conceptually (HNSW/IVF):**

\`\`\`
An index pre-organizes embeddings into a structure that lets a search
skip comparing against most of the collection, checking only a small,
carefully-chosen subset genuinely likely to contain the best matches —
the exact same underlying idea as a library's card catalog letting you
skip most of the shelves entirely.

HNSW (Hierarchical Navigable Small World): builds a layered graph
  connecting similar vectors, letting a search "hop" through the graph
  toward increasingly close matches rather than checking everything —
  generally fast with strong accuracy, at the cost of more memory.

IVF (Inverted File Index): pre-clusters vectors into groups ("buckets"),
  and a search first identifies the most likely-relevant bucket(s), then
  only compares against vectors within those — fewer resources than
  HNSW, at some cost to accuracy for a given speed.

Both trade a small, usually acceptable chance of missing the single
absolute best match (approximate nearest-neighbor search) for a
dramatic, often 100x-or-more speedup over checking every vector
exhaustively — the same practical trade Module 6 made between a soft
guarantee and structural cost, applied here to search completeness vs.
speed.
\`\`\`

**Why this lesson matters even if you never implement an index
yourself:** every managed vector database and pgvector's own indexing
options handle the actual implementation — but understanding that an
index trades a small amount of exactness for a large amount of speed
lets you correctly reason about a real production symptom ("why did
this obviously-relevant document not show up in the top 5 results?")
rather than treating vector search as an opaque, always-perfect black
box.`,

    simpleHi: `**Pairwise comparison (Module 7) scale pe genuinely kyun break
hota hai:**

\`\`\`
Ek query ko N documents ke against ek time pe ek compare karna (Module
7 ka approach) N ke proportional time leta hai — 20 documents ke liye
theek hai (milliseconds), 100,000 documents ke liye noticeably slow,
aur millions ke liye genuinely impractical. Ye ek minor inefficiency
nahi hai jise baad mein optimize karna hai; ye ek fundamental scaling
problem hai jise poori tarah alag approach chahiye, wahi approach ka
ek faster version nahi.
\`\`\`

**Embeddings kahan store karein — pgvector vs ek dedicated vector
database:**

\`\`\`sql
-- pgvector: vector storage aur similarity search ko EK EXTENSION ki
-- tarah add karta hai ek database mein jo aap likely already chalate ho
-- (PostgreSQL)
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  content TEXT,
  embedding VECTOR(1536) -- aapke embedding model ki dimension se match karta hai
);

-- Cosine similarity search, wahi SQL use karte hue jo aap already jaante ho
SELECT content, 1 - (embedding <=> '[0.02, -0.31, ...]') AS similarity
FROM documents
ORDER BY embedding <=> '[0.02, -0.31, ...]'
LIMIT 5;
\`\`\`

\`\`\`ts
// Ek dedicated vector database (jaise Pinecone): ek separate,
// specialized system jiska POORA kaam scale pe vectors store aur
// search karna hai
import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pinecone.index('documents');

await index.upsert([{ id: 'doc1', values: embedding, metadata: { content: text } }]);

const results = await index.query({ vector: queryEmbedding, topK: 5 });
\`\`\`

**Har ek kab sahi choice hai:**

\`\`\`
pgvector fit hota hai jab:
  - Aap already apne application ke normal data ke liye PostgreSQL
    chalate ho
  - Aapka scale moderate hai (roughly low millions of vectors tak)
  - Aap normal relational queries ke saath EK system mein vector search
    chahte ho, do databases chalane ke operational overhead se bachte
    hue

Ek dedicated vector database fit hota hai jab:
  - Aap bahut bade scale pe operate kar rahe ho (tens of millions+
    vectors) jahan specialized infrastructure genuinely ek
    general-purpose database se ek vector extension ke saath outperform
    karta hai
  - Aapko vector-search-specific features chahiye jo ek general
    database itni maturely offer nahi karta (certain advanced
    indexing/filtering combinations)
  - Aapki team ek second, specialized system ki added operational
    complexity ke saath theek hai
\`\`\`

**Ek index actually conceptually kya karta hai (HNSW/IVF):**

\`\`\`
Ek index embeddings ko pehle se ek structure mein organize karta hai jo
ek search ko collection ke zyadatar hisse ke against compare karna skip
karne deta hai, sirf ek chhota, carefully-chosen subset check karte hue
jisme genuinely best matches hone ki likelihood hai — exactly wahi
underlying idea jo ek library ka card catalog hai jo aapko zyadatar
shelves poori tarah skip karne deta hai.

HNSW (Hierarchical Navigable Small World): similar vectors ko connect
  karne wala ek layered graph banata hai, ek search ko graph ke through
  "hop" karne deta hai increasingly close matches ki taraf sab kuch
  check karne ke bajaye — generally fast strong accuracy ke saath,
  zyada memory ke cost pe.

IVF (Inverted File Index): vectors ko groups ("buckets") mein pre-
  cluster karta hai, aur ek search pehle sabse likely-relevant bucket(s)
  identify karta hai, phir sirf un buckets ke andar vectors ke against
  compare karta hai — HNSW se kam resources, ek given speed ke liye
  accuracy ko kuch cost pe.

Dono ek chhoti, usually acceptable chance ko trade karte hain single
absolute best match miss karne ki (approximate nearest-neighbor search)
ek dramatic, aksar 100x-or-more speedup ke liye har vector ko exhaustively
check karne ke comparison mein — wahi practical trade jo Module 6 ne
ek soft guarantee aur structural cost ke beech kiya, yahan search
completeness vs. speed pe applied.
\`\`\`

**Ye lesson kyun matter karta hai chahe aap khud kabhi ek index
implement na karo:** har managed vector database aur pgvector ke apne
indexing options actual implementation handle karte hain — par ye
samajhna ki ek index thodi si exactness ko bahut zyada speed ke liye
trade karta hai aapko ek real production symptom ke baare mein
correctly reason karne deta hai ("ye obviously-relevant document top 5
results mein kyun nahi dikha?") vector search ko ek opaque, hamesha-
perfect black box ki tarah treat karne ke bajaye.`,

    content: `## Why pairwise comparison is a fundamental scaling problem, not
a minor inefficiency

Module 7's approach — computing cosine similarity against every single
document — has cost that grows linearly with the collection's size:
double the documents, double the search time. This isn't something a
faster machine or a cleverer loop meaningfully fixes at real scale;
querying a knowledge base of millions of documents this way would take
seconds or longer per search, entirely impractical for an interactive
feature. This is a structural limit that requires a genuinely different
approach — pre-organizing the data so a search doesn't need to touch
most of it — not an optimized version of the same linear-scan approach.

## Why the pgvector-vs-dedicated-database choice is about
operational fit, not raw capability

Both approaches ultimately provide vector storage and approximate
similarity search — the underlying comparison mechanism (Module 7's
cosine similarity) is the same regardless of where it's implemented.
The real decision is operational: pgvector keeps vector search inside a
database you likely already operate, avoiding the cost and complexity of
running a second specialized system, and is genuinely sufficient for
many production scales. A dedicated vector database becomes worth its
added operational overhead specifically at very large scale, or when a
team needs vector-search-specific capabilities a general-purpose
database's extension doesn't yet mature match — the same "does this
specific case actually need the more complex tool" judgment call this
course applied to schema-constrained generation in Module 6.

## Why an index is fundamentally a speed-for-completeness trade, and
why that trade is usually the right one

An index like HNSW or IVF works by pre-organizing vectors so a search
only needs to examine a small, carefully-chosen subset rather than the
entire collection — the mechanism differs between the two (a navigable
graph vs. pre-clustered buckets), but both share the same underlying
trade: giving up a guarantee of finding the mathematically exact best
match, in exchange for an enormous speedup by not exhaustively checking
everything. This is called approximate nearest-neighbor search
specifically because of this tradeoff, and in practice the tiny loss in
exactness is almost always acceptable — a search returning the 2nd-best
match instead of the 1st-best, among results a human or model will
review anyway, rarely matters, while the speed difference between
exhaustive and indexed search at real scale is the difference between a
usable feature and an unusable one.

## Why understanding this mechanism matters even when a managed
service handles the implementation

Nearly every production RAG system uses a managed vector database or
pgvector's built-in indexing rather than implementing HNSW or IVF from
scratch — but a developer who understands that indexing trades
exactness for speed can correctly diagnose a real, recurring production
symptom: a document that should obviously match a query sometimes
doesn't appear in the top results, not because retrieval is broken, but
because approximate search genuinely doesn't guarantee finding every
possible match. This understanding also informs Lesson 2 and Lesson 3's
techniques (hybrid search, re-ranking) for improving result quality on
top of an inherently approximate retrieval step.`,

    contentHi: `## Pairwise comparison ek fundamental scaling problem kyun hai, ek minor inefficiency nahi

Module 7 ka approach — har single document ke against cosine similarity
compute karna — ka cost collection ke size ke saath linearly grow karta
hai: documents double karo, search time double ho jaata hai. Ye kuch
aisa nahi hai jise ek faster machine ya ek cleverer loop real scale pe
meaningfully fix karti hai; millions of documents ki ek knowledge base
ko is tareeke se query karna per search seconds ya zyada lega, ek
interactive feature ke liye poori tarah impractical. Ye ek structural
limit hai jise genuinely ek alag approach chahiye — data ko pre-organize
karna taaki ek search ko iska zyadatar hissa touch karne ki zaroorat na
ho — wahi linear-scan approach ka ek optimized version nahi.

## pgvector-vs-dedicated-database choice operational fit ke baare mein kyun hai, raw capability ke baare mein nahi

Dono approaches ultimately vector storage aur approximate similarity
search provide karte hain — underlying comparison mechanism (Module 7
ki cosine similarity) wahi hai chahe ye kahin bhi implement ki jaaye.
Real decision operational hai: pgvector vector search ko ek database ke
andar rakhta hai jise aap likely already operate karte ho, ek second
specialized system chalane ke cost aur complexity se bachte hue, aur
kai production scales ke liye genuinely sufficient hai. Ek dedicated
vector database apni added operational overhead deserve karta hai
specifically bahut bade scale pe, ya jab ek team ko vector-search-
specific capabilities chahiye jo ek general-purpose database ka
extension abhi tak maturely match nahi karta — wahi "kya is specific
case ko actually zyada complex tool chahiye" judgment call jo is course
ne Module 6 mein schema-constrained generation pe apply ki.

## Ek index fundamentally ek speed-for-completeness trade kyun hai, aur wo trade usually sahi kyun hai

HNSW ya IVF jaisa ek index vectors ko pre-organize karke kaam karta hai
taaki ek search ko sirf ek chhota, carefully-chosen subset examine
karne ki zaroorat ho poori collection ke bajaye — mechanism dono ke
beech alag hai (ek navigable graph vs. pre-clustered buckets), par dono
wahi underlying trade share karte hain: mathematically exact best match
dhundhne ki ek guarantee chhodte hue, ek enormous speedup ke badle mein
sab kuch exhaustively check na karke. Ise specifically is tradeoff ki
wajah se approximate nearest-neighbor search kaha jaata hai, aur
practically exactness mein ye tiny loss almost hamesha acceptable hai —
ek search 1st-best ke bajaye 2nd-best match return karti hai, un
results mein jinhe ek insaan ya model anyway review karega, rarely
matter karta hai, jabki exhaustive aur indexed search ke beech speed
difference real scale pe ek usable feature aur ek unusable wale ke beech
ka difference hai.

## Ye mechanism samajhna kyun matter karta hai chahe ek managed service implementation handle kare

Almost har production RAG system ek managed vector database ya
pgvector ki built-in indexing use karta hai HNSW ya IVF ko scratch se
implement karne ke bajaye — par ek developer jo samajhta hai ki
indexing speed ke liye exactness trade karti hai ek real, recurring
production symptom ko correctly diagnose kar sakta hai: ek document jo
obviously ek query ko match karna chahiye kabhi kabhi top results mein
appear nahi hota, is wajah se nahi ki retrieval broken hai, balki is
wajah se ki approximate search genuinely har possible match dhundhne ki
guarantee nahi deta. Ye understanding Lesson 2 aur Lesson 3 ki
techniques (hybrid search, re-ranking) ko bhi inform karti hai ek
inherently approximate retrieval step ke upar result quality improve
karne ke liye.`,

    examples: [
      {
        title: 'A complete pgvector setup — schema, indexing, and a similarity query',
        titleHi: 'Ek complete pgvector setup — schema, indexing, aur ek similarity query',
        codeJs: `// migration.sql
// CREATE EXTENSION IF NOT EXISTS vector;
// CREATE TABLE documents (
//   id SERIAL PRIMARY KEY,
//   content TEXT NOT NULL,
//   embedding VECTOR(1536)
// );
// -- An HNSW index: pre-organizes embeddings for fast approximate search
// CREATE INDEX ON documents USING hnsw (embedding vector_cosine_ops);

import { Pool } from 'pg';
import OpenAI from 'openai';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function embed(text) {
  const res = await openai.embeddings.create({ model: 'text-embedding-3-small', input: text });
  return res.data[0].embedding;
}

async function insertDocument(content) {
  const embedding = await embed(content);
  await pool.query(
    'INSERT INTO documents (content, embedding) VALUES ($1, $2)',
    [content, JSON.stringify(embedding)],
  );
}

async function searchDocuments(query, topK = 5) {
  const queryEmbedding = await embed(query);
  // The HNSW index makes this fast even against millions of rows —
  // without it, this would be a full table scan comparing every row
  const { rows } = await pool.query(
    \`SELECT content, 1 - (embedding <=> $1) AS similarity
     FROM documents
     ORDER BY embedding <=> $1
     LIMIT $2\`,
    [JSON.stringify(queryEmbedding), topK],
  );
  return rows;
}`,
        codeTs: `// migration.sql
// CREATE EXTENSION IF NOT EXISTS vector;
// CREATE TABLE documents (
//   id SERIAL PRIMARY KEY,
//   content TEXT NOT NULL,
//   embedding VECTOR(1536)
// );
// -- An HNSW index: pre-organizes embeddings for fast approximate search
// CREATE INDEX ON documents USING hnsw (embedding vector_cosine_ops);

import { Pool } from 'pg';
import OpenAI from 'openai';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function embed(text: string): Promise<number[]> {
  const res = await openai.embeddings.create({ model: 'text-embedding-3-small', input: text });
  return res.data[0].embedding;
}

async function insertDocument(content: string): Promise<void> {
  const embedding = await embed(content);
  await pool.query(
    'INSERT INTO documents (content, embedding) VALUES ($1, $2)',
    [content, JSON.stringify(embedding)],
  );
}

interface SearchResult {
  content: string;
  similarity: number;
}

async function searchDocuments(query: string, topK = 5): Promise<SearchResult[]> {
  const queryEmbedding = await embed(query);
  // The HNSW index makes this fast even against millions of rows —
  // without it, this would be a full table scan comparing every row
  const { rows } = await pool.query<SearchResult>(
    \`SELECT content, 1 - (embedding <=> $1) AS similarity
     FROM documents
     ORDER BY embedding <=> $1
     LIMIT $2\`,
    [JSON.stringify(queryEmbedding), topK],
  );
  return rows;
}`,
        code: `// CREATE INDEX ON documents USING hnsw (embedding vector_cosine_ops);
const { rows } = await pool.query(
  \`SELECT content, 1 - (embedding <=> $1) AS similarity FROM documents ORDER BY embedding <=> $1 LIMIT $2\`,
  [JSON.stringify(queryEmbedding), topK],
);`,
        output:
          "Against a table of 2 million documents, this query returns the top 5 most similar results in roughly milliseconds thanks to the HNSW index — without the index, the same query (a full table scan computing similarity against every row) would take seconds or longer, making it unusable for an interactive feature.",
        explain:
          "The <=> operator computes cosine distance directly in SQL, and the HNSW index (created once, maintained automatically as rows are inserted) is what makes ORDER BY ... LIMIT fast at scale — without it, PostgreSQL would have to compute the distance for every single row before it could sort and limit, exactly the linear-scan problem this lesson identifies.",
        explainHi:
          "<=> operator directly SQL mein cosine distance compute karta hai, aur HNSW index (ek baar create kiya gaya, rows insert hote hue automatically maintained) wo hai jo ORDER BY ... LIMIT ko scale pe fast banata hai — iske bina, PostgreSQL ko sort aur limit karne se pehle har single row ke liye distance compute karni padti, exactly wo linear-scan problem jise ye lesson identify karta hai.",
      },
    ],

    mistakes: [
      {
        wrong: `// Storing embeddings in a plain column with no vector index at all,
// then wondering why search gets slower as the table grows
// CREATE TABLE documents (id SERIAL PRIMARY KEY, content TEXT, embedding JSONB);

async function searchDocuments(query) {
  const queryEmbedding = await embed(query);
  const { rows } = await pool.query('SELECT content, embedding FROM documents');
  // Computing cosine similarity in APPLICATION CODE against every row
  // fetched from the database — no index, full linear scan every time,
  // and the entire table transferred over the network on every search
  return rows
    .map((r) => ({ content: r.content, score: cosineSimilarity(queryEmbedding, r.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}`,
        right: `// Using pgvector's native type and an HNSW index
// CREATE EXTENSION IF NOT EXISTS vector;
// CREATE TABLE documents (id SERIAL PRIMARY KEY, content TEXT, embedding VECTOR(1536));
// CREATE INDEX ON documents USING hnsw (embedding vector_cosine_ops);

async function searchDocuments(query) {
  const queryEmbedding = await embed(query);
  const { rows } = await pool.query(
    \`SELECT content FROM documents ORDER BY embedding <=> $1 LIMIT 5\`,
    [JSON.stringify(queryEmbedding)],
  );
  return rows; // the index does the heavy lifting inside the database
}`,
        why: "Storing embeddings as plain JSON and computing similarity in application code means every search transfers the ENTIRE table over the network and performs a full linear scan — exactly the scaling problem this lesson identifies, with the added cost of network transfer on top. pgvector's native type and index push the comparison into the database, where an index can actually accelerate it.",
        whyHi:
          "Embeddings ko plain JSON ki tarah store karna aur similarity ko application code mein compute karna matlab hai har search POORI table ko network pe transfer karti hai aur ek full linear scan perform karti hai — exactly wo scaling problem jise ye lesson identify karta hai, network transfer ke added cost ke saath. pgvector ka native type aur index comparison ko database ke andar push karta hai, jahan ek index ise actually accelerate kar sakta hai.",
      },
    ],

    realWorld: [
      {
        en: "A production SaaS product with a few hundred thousand support documents runs pgvector inside its existing PostgreSQL database, avoiding a second specialized system, while a company with hundreds of millions of embeddings across a massive document corpus uses a dedicated vector database specifically because specialized infrastructure genuinely handles that scale of indexed search more efficiently than a general-purpose database's extension.",
        hi: 'Ek production SaaS product jiske paas kuch sau hazaar support documents hain apne existing PostgreSQL database ke andar pgvector chalata hai, ek second specialized system se bachte hue, jabki ek company jiske paas ek massive document corpus ke across hundreds of millions of embeddings hain ek dedicated vector database use karti hai specifically kyunki specialized infrastructure genuinely us scale ke indexed search ko ek general-purpose database ke extension se zyada efficiently handle karta hai.',
      },
    ],

    interviewQA: [
      {
        q: "Why does comparing a query embedding against every document's embedding one at a time (Module 7's approach) genuinely fail to scale?",
        qHi: 'Ek query embedding ko har document ke embedding ke against ek time pe ek compare karna (Module 7 ka approach) genuinely scale karne mein kyun fail hota hai?',
        a: "The cost grows linearly with the collection's size — double the documents, double the search time. At a collection of millions of documents, this linear scan takes seconds or longer per search, which is impractical for an interactive feature. This is a fundamental scaling limit requiring a different approach (indexing), not something a faster implementation of the same linear scan meaningfully fixes.",
        aHi: 'Cost collection ke size ke saath linearly grow karta hai — documents double karo, search time double ho jaata hai. Millions of documents ki ek collection pe, ye linear scan per search seconds ya zyada leta hai, jo ek interactive feature ke liye impractical hai. Ye ek fundamental scaling limit hai jise ek alag approach (indexing) chahiye, wahi linear scan ka ek faster implementation ise meaningfully fix nahi karta.',
      },
      {
        q: "What tradeoff does a vector index like HNSW or IVF fundamentally make, and why is it usually acceptable in practice?",
        qHi: 'HNSW ya IVF jaisa ek vector index fundamentally kya tradeoff karta hai, aur ye practically usually acceptable kyun hai?',
        a: "It trades a small, usually acceptable chance of missing the mathematically exact best match for a dramatic speedup by only examining a carefully-chosen subset of the collection rather than everything (approximate nearest-neighbor search). In practice, returning the 2nd-best match instead of the 1st-best among results a human or model reviews anyway rarely matters, while the speed difference at real scale is the difference between a usable and unusable feature.",
        aHi: 'Ye ek chhoti, usually acceptable chance trade karta hai mathematically exact best match miss karne ki ek dramatic speedup ke liye sirf collection ka ek carefully-chosen subset examine karke sab kuch ke bajaye (approximate nearest-neighbor search). Practically, un results mein jinhe ek insaan ya model anyway review karta hai 1st-best ke bajaye 2nd-best match return karna rarely matter karta hai, jabki real scale pe speed difference ek usable aur unusable feature ke beech ka difference hai.',
      },
    ],

    exercises: [
      {
        task: "A team stores document embeddings as plain JSON columns and computes cosine similarity in their application's JavaScript code, fetching every row from the database on every search. Their search feature works fine in testing (500 documents) but times out in production (2 million documents). Diagnose the cause and describe the fix using this lesson's concepts.",
        taskHi: 'Ek team document embeddings ko plain JSON columns ki tarah store karti hai aur apni application ke JavaScript code mein cosine similarity compute karti hai, har search pe database se har row fetch karte hue. Unka search feature testing mein theek kaam karta hai (500 documents) par production mein timeout hota hai (2 million documents). Is lesson ke concepts use karke cause diagnose karo aur fix describe karo.',
        hint: "Identify where the linear-scan cost is actually happening (application code vs. database) and what specifically would push that comparison into a system capable of indexing it.",
        hintHi: 'Identify karo ki linear-scan cost actually kahan ho rahi hai (application code vs. database) aur specifically kya us comparison ko ek aise system mein push karega jo ise index karne mein capable hai.',
      },
    ],

    keyTakeaways: [
      "Comparing a query against every document one at a time (Module 7) has cost that scales linearly with collection size — a fundamental scaling problem at real scale, not a minor inefficiency.",
      "pgvector adds vector storage and search to a database you likely already run, sufficient for many production scales; a dedicated vector database earns its added operational complexity at very large scale or for vector-specific features a general database doesn't yet match.",
      "An index (HNSW/IVF) pre-organizes vectors so a search examines only a small, likely-relevant subset instead of everything — trading a small, usually acceptable chance of missing the exact best match for a dramatic speedup (approximate nearest-neighbor search).",
      "Understanding that indexing trades exactness for speed explains a real production symptom: an obviously-relevant document occasionally not appearing in top results isn't necessarily broken retrieval, but the expected behavior of approximate search.",
    ],
    keyTakeawaysHi: [
      'Ek query ko har document ke against ek time pe ek compare karna (Module 7) ka cost collection size ke saath linearly scale karta hai — real scale pe ek fundamental scaling problem, ek minor inefficiency nahi.',
      'pgvector vector storage aur search ko ek database mein add karta hai jise aap likely already chalate ho, kai production scales ke liye sufficient; ek dedicated vector database apni added operational complexity bahut bade scale pe ya vector-specific features ke liye deserve karta hai jo ek general database abhi tak match nahi karta.',
      'Ek index (HNSW/IVF) vectors ko pre-organize karta hai taaki ek search sab kuch ke bajaye sirf ek chhota, likely-relevant subset examine kare — ek chhoti, usually acceptable chance ko trade karte hue exact best match miss karne ki ek dramatic speedup ke liye (approximate nearest-neighbor search).',
      'Ye samajhna ki indexing speed ke liye exactness trade karti hai ek real production symptom explain karta hai: ek obviously-relevant document occasionally top results mein appear na hona necessarily broken retrieval nahi hai, balki approximate search ka expected behavior hai.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'genai-hybrid-search',
    title: 'Hybrid Search — Combining Keyword and Vector Search',
    titleHi: 'Hybrid Search — Keyword Aur Vector Search Ko Combine Karna',
    description:
      "Semantic search (Module 7) finds meaning, but genuinely struggles with exact identifiers, acronyms, and rare terms where the precise characters matter more than the concept. This lesson covers combining it with traditional keyword search to cover both categories reliably.",
    descriptionHi:
      'Semantic search (Module 7) meaning dhundhta hai, par genuinely exact identifiers, acronyms, aur rare terms ke saath struggle karta hai jahan precise characters concept se zyada matter karte hain. Ye lesson ise traditional keyword search ke saath combine karna cover karta hai dono categories ko reliably cover karne ke liye.',
    difficulty: 'HARD',
    duration: 20,
    order: 2,

    analogy: {
      en: "**A detective who understands motive and context brilliantly, paired with a forensic analyst who matches physical evidence exactly, character for character.** A detective reasoning about motive and relationships can brilliantly connect a case to a suspect even when the surface details don't obviously match — but ask them to confirm an exact serial number, a precise license plate, or a specific case-file reference number, and general reasoning about \"what seems likely\" is the wrong tool; you need someone checking the literal characters match, exactly. A forensic analyst matching physical evidence exactly is the reverse: unbeatable at confirming \"this exact fingerprint, this exact serial number,\" but useless at reasoning about motive or which suspects are plausible given the broader context. Neither approach alone solves every case — a real investigation uses both, and knows which one to lean on for which specific question. Semantic (vector) search is the detective, brilliant at conceptual relevance even with completely different wording; keyword search is the forensic analyst, unbeatable at exact matches (a product SKU, an error code, a legal citation) that vector search's meaning-focused comparison can actually miss. Hybrid search runs both and combines their results, because a real knowledge base contains both kinds of query.",
      hi: 'Ek detective jo motive aur context ko brilliantly samajhta hai, ek forensic analyst ke saath paired jo physical evidence ko exactly, character for character match karta hai. Motive aur relationships ke baare mein reason karne wala ek detective ek case ko ek suspect se brilliantly connect kar sakta hai chahe surface details obviously match na karein — par unse ek exact serial number, ek precise license plate, ya ek specific case-file reference number confirm karne ko kaho, aur "kya likely lagta hai" ke baare mein general reasoning galat tool hai; aapko koi chahiye jo check kare ki literal characters exactly match karte hain. Physical evidence ko exactly match karne wala ek forensic analyst reverse hai: "ye exact fingerprint, ye exact serial number" confirm karne mein unbeatable, par motive ke baare mein reason karne ya broader context ke given kaunse suspects plausible hain iske baare mein useless. Akela koi bhi approach har case solve nahi karta — ek real investigation dono use karta hai, aur jaanta hai kaunse specific question ke liye kispe lean karna hai. Semantic (vector) search wo detective hai, poori tarah alag wording ke saath bhi conceptual relevance mein brilliant; keyword search wo forensic analyst hai, exact matches (ek product SKU, ek error code, ek legal citation) mein unbeatable jinhe vector search ka meaning-focused comparison actually miss kar sakta hai. Hybrid search dono chalata hai aur unke results ko combine karta hai, kyunki ek real knowledge base mein dono kism ki query hoti hai.',
    },

    simple: `**Why semantic search alone genuinely misses some queries — not a
minor edge case:**

\`\`\`
Query: "error code E4021"

Semantic search embeds this query and compares by MEANING — but a
specific alphanumeric code like "E4021" doesn't carry rich semantic
meaning the way a sentence does. A document mentioning "E4021" might
not score as the top semantic match if its surrounding text happens to
be phrased very differently from the query, even though the EXACT code
match is obviously what the searcher actually needs.

Other categories semantic search struggles with: product SKUs, legal
citation numbers, exact proper nouns/names, acronyms, and anything
where the precise characters ARE the point, not a paraphrasable concept.
\`\`\`

**Keyword search (BM25/full-text search) — precise, exact-match
strength, the complementary weakness:**

\`\`\`sql
-- PostgreSQL's built-in full-text search — exact and near-exact term
-- matching, the traditional keyword-search strength
SELECT content, ts_rank(search_vector, query) AS rank
FROM documents, to_tsquery('E4021') AS query
WHERE search_vector @@ query
ORDER BY rank DESC
LIMIT 5;
-- Reliably finds the exact "E4021" mention — but would completely
-- miss a document phrased as "error four thousand twenty-one" with no
-- literal character overlap, the exact case semantic search handles well
\`\`\`

**Combining both — hybrid search, taking the best of each:**

\`\`\`ts
async function hybridSearch(query, topK = 5) {
  const [semanticResults, keywordResults] = await Promise.all([
    semanticSearch(query, topK), // Module 7/Lesson 1's vector search
    keywordSearch(query, topK),   // traditional full-text search
  ]);

  // Combine and re-rank both result sets — commonly via Reciprocal
  // Rank Fusion (RRF), which rewards documents appearing near the top
  // of EITHER list, without needing the two scores to be on the same scale
  const combined = reciprocalRankFusion([semanticResults, keywordResults]);
  return combined.slice(0, topK);
}

function reciprocalRankFusion(resultLists, k = 60) {
  const scores = new Map();
  for (const results of resultLists) {
    results.forEach((doc, rank) => {
      const current = scores.get(doc.id) ?? 0;
      scores.set(doc.id, current + 1 / (k + rank + 1));
    });
  }
  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id);
}
\`\`\`

**Why Reciprocal Rank Fusion specifically, rather than averaging raw
scores:** a semantic search's cosine similarity score (0 to 1) and a
keyword search's relevance score (an unbounded ts_rank value) are on
completely different, incomparable scales — directly averaging them
would let whichever score happens to have a larger numeric range
dominate, regardless of actual relevance. RRF sidesteps this entirely by
only using each result's RANK POSITION (1st, 2nd, 3rd...) within its own
list, which is always comparable across different scoring systems.

**Why this is the practical default for a production RAG system, not
an optional enhancement:** a real knowledge base almost always contains
both kinds of content — conceptual explanations semantic search excels
at, and precise identifiers/codes keyword search excels at. A system
using only one approach has a real, predictable category of query it
will handle poorly, which is exactly why hybrid search — not pure
semantic search — is the production standard for a knowledge base of
any real diversity.`,

    simpleHi: `**Semantic search akele genuinely kuch queries kyun miss karta hai —
ek minor edge case nahi:**

\`\`\`
Query: "error code E4021"

Semantic search is query ko embed karta hai aur MEANING se compare
karta hai — par ek specific alphanumeric code jaise "E4021" utna rich
semantic meaning nahi carry karta jitna ek sentence karta hai. "E4021"
mention karne wala ek document top semantic match ki tarah score nahi
kar sakta agar uska surrounding text query se bahut differently phrase
hua ho, chahe EXACT code match obviously wo hai jo searcher ko actually
chahiye.

Doosri categories jinse semantic search struggle karta hai: product
SKUs, legal citation numbers, exact proper nouns/names, acronyms, aur
kuch bhi jahan precise characters HI point hain, ek paraphrasable
concept nahi.
\`\`\`

**Keyword search (BM25/full-text search) — precise, exact-match
strength, complementary weakness:**

\`\`\`sql
-- PostgreSQL ka built-in full-text search — exact aur near-exact term
-- matching, traditional keyword-search strength
SELECT content, ts_rank(search_vector, query) AS rank
FROM documents, to_tsquery('E4021') AS query
WHERE search_vector @@ query
ORDER BY rank DESC
LIMIT 5;
-- Exact "E4021" mention reliably dhundhta hai — par ek document jo
-- "error four thousand twenty-one" ki tarah phrase hua hai use poori
-- tarah miss karega koi literal character overlap ke bina, exactly wo
-- case jise semantic search achhi tarah handle karta hai
\`\`\`

**Dono ko combine karna — hybrid search, har ek ka best lete hue:**

\`\`\`ts
async function hybridSearch(query, topK = 5) {
  const [semanticResults, keywordResults] = await Promise.all([
    semanticSearch(query, topK), // Module 7/Lesson 1 ka vector search
    keywordSearch(query, topK),   // traditional full-text search
  ]);

  // Dono result sets ko combine aur re-rank karo — commonly Reciprocal
  // Rank Fusion (RRF) ke through, jo un documents ko reward karta hai
  // jo EITHER list ke top ke paas appear karte hain, do scores ko
  // wahi scale pe hone ki zaroorat ke bina
  const combined = reciprocalRankFusion([semanticResults, keywordResults]);
  return combined.slice(0, topK);
}

function reciprocalRankFusion(resultLists, k = 60) {
  const scores = new Map();
  for (const results of resultLists) {
    results.forEach((doc, rank) => {
      const current = scores.get(doc.id) ?? 0;
      scores.set(doc.id, current + 1 / (k + rank + 1));
    });
  }
  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id);
}
\`\`\`

**Reciprocal Rank Fusion specifically kyun, raw scores ko average
karne ke bajaye:** ek semantic search ka cosine similarity score (0
se 1) aur ek keyword search ka relevance score (ek unbounded ts_rank
value) poori tarah alag, incomparable scales pe hain — inhe directly
average karna jo bhi score ka numeric range bada hota use dominate karne
deta, chahe actual relevance kuch bhi ho. RRF ise poori tarah sidestep
karta hai sirf har result ki RANK POSITION (1st, 2nd, 3rd...) use karke
apni khud ki list ke andar, jo alag scoring systems ke across hamesha
comparable hai.

**Ye ek production RAG system ke liye practical default kyun hai, ek
optional enhancement nahi:** ek real knowledge base almost hamesha dono
kism ka content contain karta hai — conceptual explanations jinme
semantic search excel karta hai, aur precise identifiers/codes jinme
keyword search excel karta hai. Ek system jo sirf ek approach use karta
hai ek real, predictable category ki query rakhta hai jise ye poorly
handle karega, yahi exactly wajah hai hybrid search — pure semantic
search nahi — kisi bhi real diversity wali knowledge base ke liye
production standard hai.`,

    content: `## Why semantic search's meaning-focused strength is also its
specific weakness

Module 7 established that embeddings capture semantic meaning by
learning from context — this is precisely what makes semantic search
excel at conceptual matches with different wording. But that same
mechanism means an embedding model doesn't give special weight to exact
character sequences that carry little semantic meaning on their own — a
specific product code, error identifier, or legal citation isn't
"about" anything conceptually; its value is entirely in being exactly
that specific string. Semantic search's core strength (understanding
concepts) is structurally the same reason it under-performs on exact
identifiers — this isn't a bug to patch, it's the direct, predictable
consequence of what the mechanism is actually optimized for.

## Why keyword search's weakness is semantic search's exact strength

Traditional keyword/full-text search (commonly using an algorithm like
BM25) excels at exactly what semantic search struggles with — precise
term matching — but has the complementary limitation: it has no
awareness of meaning, so a query and a document expressing the same
concept in completely different words produce no match at all, the
exact case Module 7 demonstrated semantic search handling correctly.
Neither approach is objectively better; they have precisely
complementary strengths and weaknesses, which is the direct motivation
for combining them rather than choosing one.

## Why Reciprocal Rank Fusion, specifically, is the right way to
combine two incomparable scoring systems

A semantic search's cosine similarity score and a keyword search's
relevance score are measured on fundamentally different, non-comparable
scales — there's no principled way to add or average them directly
without one system's arbitrary numeric range dominating the other's.
RRF avoids this problem entirely by discarding the actual score values
and using only each result's RANK POSITION within its own list — a
concept that means the same thing (how good is this result relative to
others found by the SAME method) regardless of the underlying scoring
system, making it a robust way to merge results from genuinely different
search mechanisms.

## Why hybrid search is the practical default, not an optional
enhancement, for a production knowledge base

A real knowledge base — technical documentation, support articles,
product catalogs — almost always contains both conceptual content
(where semantic search excels) and precise identifiers (where keyword
search excels), often within the same document. A RAG system built on
pure semantic search has a predictable, recurring category of query it
handles poorly (exact codes, specific names, acronyms); one built on
pure keyword search has the opposite predictable weakness (paraphrased
or conceptually-related queries). This lesson establishes hybrid search
as the production-standard default specifically because most real
knowledge bases genuinely need both, not as an advanced technique to
reach for only in unusual cases.`,

    contentHi: `## Semantic search ki meaning-focused strength uski specific weakness bhi kyun hai

Module 7 ne establish kiya ki embeddings context se seekhkar semantic
meaning capture karte hain — yahi exactly wo hai jo semantic search ko
alag wording ke saath conceptual matches mein excel karata hai. Par
wahi mechanism ka matlab hai ek embedding model exact character
sequences ko special weight nahi deta jo apne aap mein kam semantic
meaning carry karte hain — ek specific product code, error identifier,
ya legal citation conceptually kisi cheez ke "baare mein" nahi hai;
iski value poori tarah us specific string hone mein hai. Semantic
search ki core strength (concepts samajhna) structurally wahi wajah hai
ki ye exact identifiers pe under-perform karta hai — ye ek bug nahi hai
jise patch karna hai, ye us cheez ka direct, predictable consequence hai
jiske liye mechanism actually optimized hai.

## Keyword search ki weakness semantic search ki exact strength kyun hai

Traditional keyword/full-text search (commonly ek algorithm jaise BM25
use karte hue) exactly usme excel karta hai jisme semantic search
struggle karta hai — precise term matching — par complementary
limitation rakhta hai: ise meaning ka koi awareness nahi hai, isliye ek
query aur ek document jo wahi concept poori tarah alag words mein
express karte hain koi match produce nahi karte, exactly wo case jise
Module 7 ne demonstrate kiya ki semantic search correctly handle karta
hai. Koi bhi approach objectively better nahi hai; unme precisely
complementary strengths aur weaknesses hain, jo unhe combine karne ki
direct motivation hai, ek choose karne ke bajaye.

## Reciprocal Rank Fusion, specifically, do incomparable scoring systems ko combine karne ka sahi tareeka kyun hai

Ek semantic search ka cosine similarity score aur ek keyword search ka
relevance score fundamentally alag, non-comparable scales pe measure
kiye jaate hain — inhe directly add ya average karne ka koi principled
tareeka nahi hai bina ek system ke arbitrary numeric range ke doosre pe
dominate kiye. RRF is problem ko poori tarah avoid karta hai actual
score values ko discard karke aur sirf har result ki RANK POSITION apni
khud ki list ke andar use karke — ek concept jiska matlab wahi hai (ye
result doosron ke comparison mein kitna achha hai jo WAHI method dwara
find kiye gaye) underlying scoring system se independently, ise
genuinely alag search mechanisms se results merge karne ka ek robust
tareeka banate hue.

## Hybrid search ek production knowledge base ke liye practical default kyun hai, ek optional enhancement nahi

Ek real knowledge base — technical documentation, support articles,
product catalogs — almost hamesha dono conceptual content (jahan
semantic search excel karta hai) aur precise identifiers (jahan keyword
search excel karta hai) contain karta hai, aksar wahi document ke andar.
Ek RAG system jo pure semantic search pe built hai ek predictable,
recurring category ki query rakhta hai jise ye poorly handle karta hai
(exact codes, specific names, acronyms); ek jo pure keyword search pe
built hai opposite predictable weakness rakhta hai (paraphrased ya
conceptually-related queries). Ye lesson hybrid search ko production-
standard default ki tarah establish karta hai specifically kyunki
zyadatar real knowledge bases ko genuinely dono chahiye, ek advanced
technique nahi jise sirf unusual cases mein reach karna hai.`,

    examples: [
      {
        title: 'A complete hybrid search combining pgvector semantic search with PostgreSQL full-text search via Reciprocal Rank Fusion',
        titleHi: 'Ek complete hybrid search jo pgvector semantic search ko PostgreSQL full-text search ke saath Reciprocal Rank Fusion ke through combine karta hai',
        codeJs: `import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function semanticSearch(queryEmbedding, topK) {
  const { rows } = await pool.query(
    \`SELECT id, content FROM documents ORDER BY embedding <=> $1 LIMIT $2\`,
    [JSON.stringify(queryEmbedding), topK],
  );
  return rows;
}

async function keywordSearch(queryText, topK) {
  const { rows } = await pool.query(
    \`SELECT id, content, ts_rank(search_vector, plainto_tsquery($1)) AS rank
     FROM documents
     WHERE search_vector @@ plainto_tsquery($1)
     ORDER BY rank DESC LIMIT $2\`,
    [queryText, topK],
  );
  return rows;
}

function reciprocalRankFusion(resultLists, k = 60) {
  const scores = new Map();
  const docsById = new Map();
  for (const results of resultLists) {
    results.forEach((doc, rank) => {
      scores.set(doc.id, (scores.get(doc.id) ?? 0) + 1 / (k + rank + 1));
      docsById.set(doc.id, doc);
    });
  }
  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => docsById.get(id));
}

async function hybridSearch(queryText, queryEmbedding, topK = 5) {
  const [semantic, keyword] = await Promise.all([
    semanticSearch(queryEmbedding, topK * 2), // fetch more than needed from each
    keywordSearch(queryText, topK * 2),        // to give RRF a richer set to fuse
  ]);
  return reciprocalRankFusion([semantic, keyword]).slice(0, topK);
}`,
        codeTs: `import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

interface Doc { id: number; content: string; }

async function semanticSearch(queryEmbedding: number[], topK: number): Promise<Doc[]> {
  const { rows } = await pool.query<Doc>(
    \`SELECT id, content FROM documents ORDER BY embedding <=> $1 LIMIT $2\`,
    [JSON.stringify(queryEmbedding), topK],
  );
  return rows;
}

async function keywordSearch(queryText: string, topK: number): Promise<Doc[]> {
  const { rows } = await pool.query<Doc>(
    \`SELECT id, content, ts_rank(search_vector, plainto_tsquery($1)) AS rank
     FROM documents
     WHERE search_vector @@ plainto_tsquery($1)
     ORDER BY rank DESC LIMIT $2\`,
    [queryText, topK],
  );
  return rows;
}

function reciprocalRankFusion(resultLists: Doc[][], k = 60): Doc[] {
  const scores = new Map<number, number>();
  const docsById = new Map<number, Doc>();
  for (const results of resultLists) {
    results.forEach((doc, rank) => {
      scores.set(doc.id, (scores.get(doc.id) ?? 0) + 1 / (k + rank + 1));
      docsById.set(doc.id, doc);
    });
  }
  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => docsById.get(id)!);
}

async function hybridSearch(queryText: string, queryEmbedding: number[], topK = 5): Promise<Doc[]> {
  const [semantic, keyword] = await Promise.all([
    semanticSearch(queryEmbedding, topK * 2), // fetch more than needed from each
    keywordSearch(queryText, topK * 2),        // to give RRF a richer set to fuse
  ]);
  return reciprocalRankFusion([semantic, keyword]).slice(0, topK);
}`,
        code: `const [semantic, keyword] = await Promise.all([
  semanticSearch(queryEmbedding, topK * 2),
  keywordSearch(queryText, topK * 2),
]);
return reciprocalRankFusion([semantic, keyword]).slice(0, topK);`,
        output:
          "For the query 'error code E4021', keyword search reliably surfaces a document containing that exact string even if pure semantic search ranked it poorly; for the query 'my payment failed to go through,' semantic search surfaces a relevant document phrased entirely differently ('transaction could not be completed') that keyword search alone would miss. RRF blends both result sets into one ranked list that handles both query types well.",
        explain:
          "Fetching topK * 2 from each individual search before fusing gives RRF a richer pool to work with — a document that ranks, say, 8th in keyword search but 1st in semantic search still gets fused in and can rank highly overall, which wouldn't happen if each search only returned its top 5 in isolation.",
        explainHi:
          "Fuse karne se pehle har individual search se topK * 2 fetch karna RRF ko kaam karne ke liye ek richer pool deta hai — ek document jo keyword search mein 8th rank karta hai par semantic search mein 1st abhi bhi fused ho jata hai aur overall highly rank kar sakta hai, jo nahi hota agar har search isolation mein sirf apna top 5 return karta.",
      },
    ],

    mistakes: [
      {
        wrong: `// Directly averaging semantic and keyword scores, which are on
// completely different, incomparable scales
function combineScores(semanticResults, keywordResults) {
  return semanticResults.map((doc, i) => ({
    ...doc,
    combinedScore: (doc.cosineSimilarity + keywordResults[i].tsRank) / 2,
    // cosineSimilarity is 0-1; tsRank is an unbounded, differently-
    // scaled value — averaging them lets whichever happens to have a
    // larger numeric range dominate, regardless of actual relevance
  }));
}`,
        right: `// Using Reciprocal Rank Fusion, which only uses rank position —
// always comparable across different scoring systems
function reciprocalRankFusion(resultLists, k = 60) {
  const scores = new Map();
  for (const results of resultLists) {
    results.forEach((doc, rank) => {
      scores.set(doc.id, (scores.get(doc.id) ?? 0) + 1 / (k + rank + 1));
    });
  }
  return [...scores.entries()].sort((a, b) => b[1] - a[1]);
}`,
        why: "A semantic search's cosine similarity and a keyword search's relevance score are measured on fundamentally different, non-comparable scales. Directly averaging them lets whichever score happens to have a larger numeric range dominate the combined result, regardless of which result is actually more relevant — RRF avoids this by using only rank position, which is comparable regardless of the underlying scoring system.",
        whyHi:
          "Ek semantic search ka cosine similarity aur ek keyword search ka relevance score fundamentally alag, non-comparable scales pe measure kiye jaate hain. Inhe directly average karna jo bhi score ka numeric range bada hota use combined result mein dominate karne deta hai, chahe actual relevance kuch bhi ho — RRF ise sirf rank position use karke avoid karta hai, jo underlying scoring system se independently comparable hai.",
      },
    ],

    realWorld: [
      {
        en: "A production e-commerce product search combines semantic search (a customer searching 'warm winter jacket' finds relevant products even without those exact words in the listing) with keyword search (a customer searching an exact model number like 'XJ-4400' reliably finds that specific product), since neither approach alone would satisfy both kinds of real customer query.",
        hi: 'Ek production e-commerce product search semantic search (ek customer \'warm winter jacket\' search karta hai relevant products dhundhta hai un exact words ke listing mein hue bina) ko keyword search (ek customer ek exact model number jaise \'XJ-4400\' search karta hai reliably wo specific product dhundhta hai) ke saath combine karta hai, kyunki akela koi bhi approach dono kism ki real customer query satisfy nahi karega.',
      },
    ],

    interviewQA: [
      {
        q: "Why does semantic search's core strength (understanding meaning) also explain its weakness with exact identifiers like product codes or error numbers?",
        qHi: 'Semantic search ki core strength (meaning samajhna) exact identifiers jaise product codes ya error numbers ke saath uski weakness bhi kyun explain karti hai?',
        a: "An embedding model learns to represent semantic meaning from context, which means it doesn't give special weight to exact character sequences that carry little semantic meaning on their own — a specific code's value is entirely in being that exact string, not in what it conceptually represents. This isn't a separate bug; it's a direct, predictable consequence of what the underlying mechanism is optimized for.",
        aHi: 'Ek embedding model context se semantic meaning represent karna seekhta hai, jiska matlab hai ye exact character sequences ko special weight nahi deta jo apne aap mein kam semantic meaning carry karte hain — ek specific code ki value poori tarah us exact string hone mein hai, ye conceptually kya represent karta hai usme nahi. Ye ek separate bug nahi hai; ye us cheez ka ek direct, predictable consequence hai jiske liye underlying mechanism optimized hai.',
      },
      {
        q: 'Why is Reciprocal Rank Fusion used to combine semantic and keyword search results, rather than simply averaging their scores?',
        qHi: 'Semantic aur keyword search results ko combine karne ke liye Reciprocal Rank Fusion kyun use kiya jata hai, sirf unke scores average karne ke bajaye?',
        a: "The two scores are on fundamentally different, incomparable scales (a bounded cosine similarity vs. an unbounded relevance score), so directly averaging them would let whichever happens to have a larger numeric range dominate regardless of actual relevance. RRF sidesteps this by using only each result's rank position within its own list, which is meaningful and comparable regardless of the underlying scoring system.",
        aHi: 'Do scores fundamentally alag, incomparable scales pe hain (ek bounded cosine similarity vs. ek unbounded relevance score), isliye inhe directly average karna jo bhi score ka numeric range bada hota use dominate karne dega chahe actual relevance kuch bhi ho. RRF ise sirf har result ki apni khud ki list ke andar rank position use karke sidestep karta hai, jo underlying scoring system se independently meaningful aur comparable hai.',
      },
    ],

    exercises: [
      {
        task: "A support knowledge-base search built on pure semantic search reliably answers conceptual questions ('how do I get a refund') but consistently fails to find documents when a user searches an exact order number or error code. Using this lesson's reasoning, explain the root cause and the fix.",
        taskHi: 'Ek support knowledge-base search jo pure semantic search pe built hai reliably conceptual questions answer karta hai (\'mujhe refund kaise milega\') par consistently documents dhundhne mein fail hota hai jab ek user ek exact order number ya error code search karta hai. Is lesson ki reasoning use karke, root cause aur fix explain karo.',
        hint: "Consider what category of query semantic search structurally under-performs on, and what technique this lesson introduces specifically to cover that category.",
        hintHi: 'Consider karo ki semantic search structurally kis category ki query pe under-perform karta hai, aur ye lesson specifically us category ko cover karne ke liye kaunsi technique introduce karta hai.',
      },
    ],

    keyTakeaways: [
      "Semantic search structurally under-performs on exact identifiers (codes, SKUs, citations) because embeddings capture conceptual meaning, not literal character matching — this is a direct consequence of the mechanism, not a bug.",
      "Keyword search has the complementary weakness: it can't find conceptually-relevant content expressed in different words, exactly the case semantic search handles well.",
      "Reciprocal Rank Fusion combines results from incomparable scoring systems by using only each result's rank position within its own list, avoiding the problem of one score's numeric range dominating a direct average.",
      "Hybrid search is the practical production default for any real knowledge base, since most contain both conceptual content and precise identifiers — not an optional enhancement reserved for unusual cases.",
    ],
    keyTakeawaysHi: [
      'Semantic search exact identifiers (codes, SKUs, citations) pe structurally under-perform karta hai kyunki embeddings conceptual meaning capture karte hain, literal character matching nahi — ye mechanism ka ek direct consequence hai, ek bug nahi.',
      'Keyword search mein complementary weakness hai: ye conceptually-relevant content ko alag words mein express kiya gaya nahi dhundh sakta, exactly wo case jise semantic search achhi tarah handle karta hai.',
      'Reciprocal Rank Fusion incomparable scoring systems se results ko combine karta hai sirf har result ki apni khud ki list ke andar rank position use karke, ek score ke numeric range ke ek direct average ko dominate karne ki problem se bachte hue.',
      'Hybrid search kisi bhi real knowledge base ke liye practical production default hai, kyunki zyadatar mein dono conceptual content aur precise identifiers hote hain — koi optional enhancement nahi unusual cases ke liye reserved.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'genai-reranking-and-full-rag-pipeline',
    title: 'Re-Ranking & Assembling a Complete RAG Pipeline',
    titleHi: 'Re-Ranking Aur Ek Complete RAG Pipeline Assemble Karna',
    description:
      "Closing this module: re-ranking as a final precision pass over retrieved candidates, and assembling every piece from Modules 7-8 — chunking, embedding, indexed retrieval, hybrid search, and re-ranking — into one coherent, production-shaped RAG pipeline end-to-end.",
    descriptionHi:
      'Is module ko close karte hue: retrieved candidates ke upar ek final precision pass ki tarah re-ranking, aur Modules 7-8 ke har piece ko assemble karna — chunking, embedding, indexed retrieval, hybrid search, aur re-ranking — ek coherent, production-shaped RAG pipeline mein end-to-end.',
    difficulty: 'HARD',
    duration: 22,
    order: 3,

    analogy: {
      en: "**A large retail warehouse's initial, fast bulk-picking pass to grab roughly the right items, followed by a careful, slower quality-control check on just that smaller pulled set before anything ships.** A warehouse fulfilling an order doesn't have one worker carefully, precisely inspect every single item in the entire warehouse for every order — that would be far too slow. Instead, a fast initial pass (guided by rough location data) quickly pulls a small set of roughly-right candidate items, and only THEN does a more careful, slower quality-control step examine that small set precisely before anything actually ships. The fast pass optimizes for speed across an enormous space; the careful pass optimizes for precision across a small, already-narrowed space — running the careful, slow inspection on the ENTIRE warehouse would be correct but far too slow, while skipping it entirely on the small picked set would ship more mistakes. Re-ranking is exactly this second, careful pass: retrieval (Lessons 1-2) quickly narrows millions of documents down to a small candidate set using fast, somewhat-approximate methods, and a re-ranker then applies a slower, more precise model to just that small set, improving the final ordering before it reaches the model — a two-stage design that gets both speed AND precision, neither of which a single stage alone could provide at real scale.",
      hi: 'Ek large retail warehouse ka initial, fast bulk-picking pass roughly sahi items grab karne ke liye, uske baad ek careful, slower quality-control check sirf us chhote pulled set pe kisi bhi cheez ke ship hone se pehle. Ek order fulfill karta warehouse ek worker se poore warehouse mein har single item ko har order ke liye carefully, precisely inspect nahi karwata — ye bahut zyada slow hoga. Iske bajaye, ek fast initial pass (rough location data se guided) jaldi se roughly-right candidate items ka ek chhota set pull karta hai, aur sirf TAB ek zyada careful, slower quality-control step us chhote set ko precisely examine karta hai kisi bhi cheez ke actually ship hone se pehle. Fast pass ek enormous space ke across speed ke liye optimize karta hai; careful pass ek chhote, already-narrowed space ke across precision ke liye optimize karta hai — POORE warehouse pe careful, slow inspection chalana correct hoga par bahut zyada slow, jabki chhote picked set pe ise poori tarah skip karna zyada mistakes ship karega. Re-ranking exactly ye doosra, careful pass hai: retrieval (Lessons 1-2) jaldi se millions of documents ko fast, somewhat-approximate methods use karke ek chhote candidate set tak narrow karta hai, aur ek re-ranker phir us chhote set pe ek slower, zyada precise model apply karta hai, model tak pahunchne se pehle final ordering improve karte hue — ek two-stage design jo dono speed AUR precision paata hai, jinme se koi bhi ek stage akela real scale pe provide nahi kar sakta.',
    },

    simple: `**Why re-ranking exists — retrieval optimizes for speed across a
huge space, re-ranking optimizes for precision across a small one:**

\`\`\`
Retrieval (Lessons 1-2) is deliberately FAST and APPROXIMATE at scale —
an index trades some exactness for speed (Lesson 1), and even hybrid
search's fusion is a relatively cheap combination step. This is the
right tradeoff for narrowing millions of documents down to, say, the
top 20 candidates quickly.

But "top 20 from a fast, approximate method" isn't necessarily the
BEST possible ordering of those 20 — a more expensive, more precise
model applied to just those 20 (not all millions) can meaningfully
improve the final ranking, and doing so is now computationally cheap
because the candidate set is small.
\`\`\`

**A re-ranker in practice — a specialized model built specifically for
scoring query-document relevance, not for generation:**

\`\`\`ts
import { CohereClient } from 'cohere-ai';

const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });

async function rerank(query, candidates, topK = 5) {
  const response = await cohere.rerank({
    model: 'rerank-english-v3.0',
    query,
    documents: candidates.map((c) => c.content),
    topN: topK,
  });
  // Returns candidates RE-ORDERED by a model specifically trained to
  // judge query-document relevance more precisely than the fast
  // retrieval methods that produced the initial candidate set
  return response.results.map((r) => candidates[r.index]);
}
\`\`\`

**Why a re-ranker model is different from, and complementary to, the
embedding model used for retrieval:** an embedding model (Module 7)
computes each document's representation INDEPENDENTLY of any specific
query — this is precisely what makes it fast enough to pre-compute and
index (Lesson 1). A re-ranker instead looks at the query AND a candidate
document TOGETHER, in one pass, which is more computationally expensive
per pair but produces a more precise relevance judgment — exactly why
it's applied only to a small, already-narrowed candidate set rather than
the entire knowledge base.

**The complete, assembled RAG pipeline — every piece from Modules 7-8
in one coherent flow:**

\`\`\`ts
async function ragPipeline(userQuestion) {
  // 1. CHUNKING (Module 7, Lesson 3) — done once, upfront, when
  //    documents are indexed, not at query time
  // 2. EMBEDDING (Module 7, Lesson 2) — the query is embedded now
  const queryEmbedding = await embed(userQuestion);

  // 3. RETRIEVAL — hybrid search (Lesson 2) over the indexed,
  //    pre-chunked, pre-embedded knowledge base (Lesson 1)
  const candidates = await hybridSearch(userQuestion, queryEmbedding, 20);

  // 4. RE-RANKING (this lesson) — a precise pass over the small
  //    candidate set
  const topResults = await rerank(userQuestion, candidates, 5);

  // 5. GENERATION — the retrieved, re-ranked content becomes part of
  //    the sequence the model reasons from (Module 1)
  const context = topResults.map((r) => r.content).join('\\n\\n---\\n\\n');
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1000,
    system: 'Answer the question using ONLY the provided context. If the answer is not in the context, say so.',
    messages: [{ role: 'user', content: \`Context:\\n\${context}\\n\\nQuestion: \${userQuestion}\` }],
  });

  return response.content[0].text;
}
\`\`\`

**Why every stage in this pipeline traces back to a specific concept
already established:** chunking respects document structure (Module 7,
Lesson 3), embeddings capture meaning (Module 7, Lesson 2), indexing
makes retrieval fast at scale (Lesson 1), hybrid search covers both
conceptual and exact-match queries (Lesson 2), re-ranking adds a precise
final pass (this lesson), and the model's generation is grounded in real
retrieved content rather than implicit training-time knowledge (Module
7, Lesson 1's original hallucination-mitigation argument). Nothing in
this pipeline is an arbitrary implementation detail — each stage is a
direct, deliberate answer to a specific, identifiable problem this
module and the previous one worked through in order.`,

    simpleHi: `**Re-ranking kyun exist karta hai — retrieval ek huge space ke
across speed ke liye optimize karta hai, re-ranking ek chhote wale ke
across precision ke liye optimize karta hai:**

\`\`\`
Retrieval (Lessons 1-2) scale pe deliberately FAST aur APPROXIMATE hai
— ek index kuch exactness ko speed ke liye trade karta hai (Lesson 1),
aur even hybrid search ka fusion ek relatively cheap combination step
hai. Ye millions of documents ko, jaise, top 20 candidates tak jaldi se
narrow karne ke liye sahi tradeoff hai.

Par "fast, approximate method se top 20" necessarily un 20 ka BEST
possible ordering nahi hai — un 20 pe applied ek zyada expensive, zyada
precise model (sab millions pe nahi) final ranking ko meaningfully
improve kar sakta hai, aur aisa karna ab computationally cheap hai
kyunki candidate set chhota hai.
\`\`\`

**Practically ek re-ranker — query-document relevance score karne ke
liye specifically banaya gaya ek specialized model, generation ke liye
nahi:**

\`\`\`ts
import { CohereClient } from 'cohere-ai';

const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });

async function rerank(query, candidates, topK = 5) {
  const response = await cohere.rerank({
    model: 'rerank-english-v3.0',
    query,
    documents: candidates.map((c) => c.content),
    topN: topK,
  });
  // Candidates ko ek model dwara RE-ORDERED return karta hai jo
  // specifically query-document relevance judge karne ke liye trained
  // hai un fast retrieval methods se zyada precisely jinhone initial
  // candidate set produce kiya
  return response.results.map((r) => candidates[r.index]);
}
\`\`\`

**Ek re-ranker model retrieval ke liye use kiye gaye embedding model se
alag, aur complementary, kyun hai:** ek embedding model (Module 7) har
document ki representation kisi bhi specific query se INDEPENDENTLY
compute karta hai — yahi exactly wo hai jo ise pre-compute aur index
karne ke liye kaafi fast banata hai (Lesson 1). Ek re-ranker iske
bajaye query AUR ek candidate document ko EK SAATH dekhta hai, ek pass
mein, jo per pair zyada computationally expensive hai par ek zyada
precise relevance judgment produce karta hai — exactly wajah hai ki ise
sirf ek chhote, already-narrowed candidate set pe apply kiya jata hai
poori knowledge base pe nahi.

**Complete, assembled RAG pipeline — Modules 7-8 ka har piece ek
coherent flow mein:**

\`\`\`ts
async function ragPipeline(userQuestion) {
  // 1. CHUNKING (Module 7, Lesson 3) — ek baar, upfront kiya gaya, jab
  //    documents index kiye jaate hain, query time pe nahi
  // 2. EMBEDDING (Module 7, Lesson 2) — query ab embed ki jaati hai
  const queryEmbedding = await embed(userQuestion);

  // 3. RETRIEVAL — hybrid search (Lesson 2) indexed, pre-chunked,
  //    pre-embedded knowledge base ke upar (Lesson 1)
  const candidates = await hybridSearch(userQuestion, queryEmbedding, 20);

  // 4. RE-RANKING (ye lesson) — chhote candidate set ke upar ek
  //    precise pass
  const topResults = await rerank(userQuestion, candidates, 5);

  // 5. GENERATION — retrieved, re-ranked content us sequence ka hissa
  //    ban jata hai jisse model reason karta hai (Module 1)
  const context = topResults.map((r) => r.content).join('\\n\\n---\\n\\n');
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1000,
    system: 'Answer the question using ONLY the provided context. If the answer is not in the context, say so.',
    messages: [{ role: 'user', content: \`Context:\\n\${context}\\n\\nQuestion: \${userQuestion}\` }],
  });

  return response.content[0].text;
}
\`\`\`

**Is pipeline ka har stage ek specific already established concept
tak kyun wapas trace hota hai:** chunking document structure ko respect
karta hai (Module 7, Lesson 3), embeddings meaning capture karte hain
(Module 7, Lesson 2), indexing retrieval ko scale pe fast banata hai
(Lesson 1), hybrid search dono conceptual aur exact-match queries cover
karta hai (Lesson 2), re-ranking ek precise final pass add karta hai
(ye lesson), aur model ka generation real retrieved content mein
grounded hai implicit training-time knowledge ke bajaye (Module 7,
Lesson 1 ka original hallucination-mitigation argument). Is pipeline
mein kuch bhi arbitrary implementation detail nahi hai — har stage ek
specific, identifiable problem ka ek direct, deliberate answer hai jise
is module aur pichhle wale ne order mein work through kiya.`,

    content: `## Why re-ranking's two-stage design is necessary rather than
just "use the precise method everywhere"

A precise, query-document-aware relevance model is genuinely more
accurate than fast retrieval methods (Lessons 1-2), but it's also far
more computationally expensive — it has to process the query and each
candidate document together, in one pass, rather than comparing
pre-computed independent representations (Lesson 1's key property that
makes indexing possible at all). Running this expensive precise method
against an entire knowledge base of millions of documents would be far
too slow, exactly the scaling problem Lesson 1 identified for pairwise
comparison. The two-stage design — fast, approximate retrieval to
narrow the field, followed by a precise re-rank of only that small
result — gets the benefit of precision without paying its cost across
the entire collection.

## Why a re-ranker model is architecturally different from an
embedding model, not just "a better version of the same thing"

An embedding model computes a representation of a document entirely
independently of any specific query — this independence is exactly what
lets embeddings be pre-computed once and indexed (Lesson 1), since the
document's vector doesn't change based on what's later searched for. A
re-ranker instead processes the query and a candidate document jointly,
in one model pass, letting it capture interactions between the specific
query and the specific document that an independently-computed
embedding structurally cannot — this joint processing is what makes a
re-ranker more precise, and also exactly why it can't be pre-computed or
indexed the way embeddings can, which is why it's applied only to a
small post-retrieval candidate set.

## Why assembling the full pipeline matters as a learning goal, not
just introducing re-ranking as an isolated technique

Modules 7-8 introduced chunking, embeddings, cosine similarity,
indexing, hybrid search, and re-ranking as individually-motivated
techniques, each solving a specific, identifiable problem. Seeing them
assembled into one coherent pipeline demonstrates that a production RAG
system isn't a collection of arbitrary tricks bolted together — every
stage exists because of a concrete problem the previous stage alone
didn't solve, in a deliberate sequence: chunking makes embedding
meaningful, embedding makes semantic comparison possible, indexing makes
that comparison fast at scale, hybrid search covers what semantic
search alone misses, and re-ranking improves precision on the final
small set before it reaches the model.

## How this connects forward to agents and the rest of the course

Module 9's agents frequently use RAG as one of several tools available
within a larger tool loop (Module 5) — an agent might decide, based on
the specific question, whether retrieval is even needed (Module 7,
Lesson 1's judgment call about when RAG applies), then invoke this same
retrieval-and-re-rank pipeline as one step among several. Every piece
this module assembled — the retrieval quality this pipeline achieves —
directly determines how reliable an agent's RAG-based reasoning can be,
making this pipeline's correctness a real dependency for much of what
the rest of this course builds on top of it.`,

    contentHi: `## Re-ranking ka two-stage design zaroori kyun hai sirf "har jagah precise method use karo" ke bajaye

Ek precise, query-document-aware relevance model genuinely fast
retrieval methods (Lessons 1-2) se zyada accurate hai, par ye kaafi
zyada computationally expensive bhi hai — ise query aur har candidate
document ko ek saath, ek pass mein process karna padta hai, pre-computed
independent representations compare karne ke bajaye (Lesson 1 ki key
property jo indexing ko bilkul possible banati hai). Is expensive
precise method ko millions of documents ki ek poori knowledge base ke
against chalana bahut zyada slow hoga, exactly wo scaling problem jise
Lesson 1 ne pairwise comparison ke liye identify kiya. Two-stage design
— field ko narrow karne ke liye fast, approximate retrieval, uske baad
sirf us chhote result ka ek precise re-rank — precision ka benefit
paata hai poori collection ke across uska cost pay kiye bina.

## Ek re-ranker model ek embedding model se architecturally alag kyun hai, sirf "wahi cheez ka ek better version" nahi

Ek embedding model ek document ki representation kisi bhi specific
query se poori tarah independently compute karta hai — ye independence
exactly wo hai jo embeddings ko ek baar pre-computed aur indexed hone
deta hai (Lesson 1), kyunki document ka vector baad mein kya search
kiya jaata hai uske basis pe nahi badalta. Ek re-ranker iske bajaye
query aur ek candidate document ko jointly process karta hai, ek model
pass mein, ise specific query aur specific document ke beech
interactions capture karne deta hai jo ek independently-computed
embedding structurally nahi kar sakta — ye joint processing wo hai jo
ek re-ranker ko zyada precise banata hai, aur exactly wo wajah bhi hai
ki ise embeddings ki tarah pre-compute ya index nahi kiya ja sakta,
yahi wajah hai isse sirf ek chhote post-retrieval candidate set pe
apply kiya jata hai.

## Poori pipeline assemble karna ek learning goal ki tarah kyun matter karta hai, sirf re-ranking ko ek isolated technique ki tarah introduce karna nahi

Modules 7-8 ne chunking, embeddings, cosine similarity, indexing,
hybrid search, aur re-ranking ko individually-motivated techniques ki
tarah introduce kiya, har ek ek specific, identifiable problem solve
karte hue. Inhe ek coherent pipeline mein assembled dekhna demonstrate
karta hai ki ek production RAG system arbitrary tricks ka ek collection
nahi hai ek saath bolt kiya gaya — har stage ek concrete problem ki
wajah se exist karta hai jise previous stage akela solve nahi karta
tha, ek deliberate sequence mein: chunking embedding ko meaningful
banata hai, embedding semantic comparison ko possible banata hai,
indexing us comparison ko scale pe fast banata hai, hybrid search us
cheez ko cover karta hai jise semantic search akela miss karta hai, aur
re-ranking final chhote set pe precision improve karta hai model tak
pahunchne se pehle.

## Ye forward agents aur baaki course se kaise connect karta hai

Module 9 ke agents aksar RAG ko ek bade tool loop (Module 5) ke andar
available kai tools mein se ek ki tarah use karte hain — ek agent
decide kar sakta hai, specific question ke basis pe, ki kya retrieval
bhi chahiye (Module 7, Lesson 1 ka judgment call ki RAG kab apply hota
hai), phir wahi retrieval-and-re-rank pipeline ko kai steps mein se ek
ki tarah invoke kar sakta hai. Is module ne jo bhi assemble kiya — is
pipeline ki retrieval quality — directly determine karta hai ki ek
agent ka RAG-based reasoning kitna reliable ho sakta hai, is pipeline
ki correctness ko baaki course ke liye ek real dependency banate hue jo
iske upar build karta hai.`,

    examples: [
      {
        title: 'A complete production RAG pipeline combining every technique from Modules 7-8',
        titleHi: 'Ek complete production RAG pipeline jo Modules 7-8 ki har technique combine karta hai',
        codeJs: `import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { CohereClient } from 'cohere-ai';
import { Pool } from 'pg';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function embed(text) {
  const res = await openai.embeddings.create({ model: 'text-embedding-3-small', input: text });
  return res.data[0].embedding;
}

async function hybridSearch(queryText, queryEmbedding, topK) {
  const [{ rows: semantic }, { rows: keyword }] = await Promise.all([
    pool.query('SELECT id, content FROM documents ORDER BY embedding <=> $1 LIMIT $2', [JSON.stringify(queryEmbedding), topK]),
    pool.query(
      \`SELECT id, content FROM documents WHERE search_vector @@ plainto_tsquery($1)
       ORDER BY ts_rank(search_vector, plainto_tsquery($1)) DESC LIMIT $2\`,
      [queryText, topK],
    ),
  ]);
  return reciprocalRankFusion([semantic, keyword]);
}

function reciprocalRankFusion(resultLists, k = 60) {
  const scores = new Map(), docsById = new Map();
  for (const results of resultLists) {
    results.forEach((doc, rank) => {
      scores.set(doc.id, (scores.get(doc.id) ?? 0) + 1 / (k + rank + 1));
      docsById.set(doc.id, doc);
    });
  }
  return [...scores.entries()].sort((a, b) => b[1] - a[1]).map(([id]) => docsById.get(id));
}

async function ragPipeline(userQuestion) {
  const queryEmbedding = await embed(userQuestion);
  const candidates = await hybridSearch(userQuestion, queryEmbedding, 20);

  const reranked = await cohere.rerank({
    model: 'rerank-english-v3.0',
    query: userQuestion,
    documents: candidates.map((c) => c.content),
    topN: 5,
  });
  const topResults = reranked.results.map((r) => candidates[r.index]);

  const context = topResults.map((r) => r.content).join('\\n\\n---\\n\\n');
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1000,
    system: 'Answer using ONLY the provided context. If the answer is not present, say so explicitly.',
    messages: [{ role: 'user', content: \`Context:\\n\${context}\\n\\nQuestion: \${userQuestion}\` }],
  });

  return response.content[0].text;
}`,
        codeTs: `import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { CohereClient } from 'cohere-ai';
import { Pool } from 'pg';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

interface Doc { id: number; content: string; }

async function embed(text: string): Promise<number[]> {
  const res = await openai.embeddings.create({ model: 'text-embedding-3-small', input: text });
  return res.data[0].embedding;
}

async function hybridSearch(queryText: string, queryEmbedding: number[], topK: number): Promise<Doc[]> {
  const [{ rows: semantic }, { rows: keyword }] = await Promise.all([
    pool.query<Doc>('SELECT id, content FROM documents ORDER BY embedding <=> $1 LIMIT $2', [JSON.stringify(queryEmbedding), topK]),
    pool.query<Doc>(
      \`SELECT id, content FROM documents WHERE search_vector @@ plainto_tsquery($1)
       ORDER BY ts_rank(search_vector, plainto_tsquery($1)) DESC LIMIT $2\`,
      [queryText, topK],
    ),
  ]);
  return reciprocalRankFusion([semantic, keyword]);
}

function reciprocalRankFusion(resultLists: Doc[][], k = 60): Doc[] {
  const scores = new Map<number, number>(), docsById = new Map<number, Doc>();
  for (const results of resultLists) {
    results.forEach((doc, rank) => {
      scores.set(doc.id, (scores.get(doc.id) ?? 0) + 1 / (k + rank + 1));
      docsById.set(doc.id, doc);
    });
  }
  return [...scores.entries()].sort((a, b) => b[1] - a[1]).map(([id]) => docsById.get(id)!);
}

async function ragPipeline(userQuestion: string): Promise<string> {
  const queryEmbedding = await embed(userQuestion);
  const candidates = await hybridSearch(userQuestion, queryEmbedding, 20);

  const reranked = await cohere.rerank({
    model: 'rerank-english-v3.0',
    query: userQuestion,
    documents: candidates.map((c) => c.content),
    topN: 5,
  });
  const topResults = reranked.results.map((r) => candidates[r.index]);

  const context = topResults.map((r) => r.content).join('\\n\\n---\\n\\n');
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1000,
    system: 'Answer using ONLY the provided context. If the answer is not present, say so explicitly.',
    messages: [{ role: 'user', content: \`Context:\\n\${context}\\n\\nQuestion: \${userQuestion}\` }],
  });

  const block = response.content[0];
  if (block.type !== 'text') throw new Error('Expected a text response');
  return block.text;
}`,
        code: `const queryEmbedding = await embed(userQuestion);
const candidates = await hybridSearch(userQuestion, queryEmbedding, 20);
const reranked = await cohere.rerank({ model: 'rerank-english-v3.0', query: userQuestion, documents: candidates.map(c => c.content), topN: 5 });
const topResults = reranked.results.map(r => candidates[r.index]);
const context = topResults.map(r => r.content).join('\\n\\n---\\n\\n');
// ... generate the final answer using context`,
        output:
          "A question is answered grounded in the top 5 most relevant, precisely re-ranked pieces of a knowledge base that may contain millions of documents — retrieved in milliseconds via hybrid search over an indexed, pre-chunked corpus, then precisely reordered by a re-ranker before reaching the model, all traceable to specific techniques from Modules 7-8.",
        explain:
          "Every function call in this pipeline maps to a specific lesson: embed() is Module 7 Lesson 2, hybridSearch()/reciprocalRankFusion() is this module's Lesson 1 (indexing) plus Lesson 2 (hybrid search), cohere.rerank() is this lesson, and the final anthropic.messages.create() call grounds generation in retrieved content exactly as Module 7 Lesson 1 motivated.",
        explainHi:
          "Is pipeline mein har function call ek specific lesson se maps karta hai: embed() Module 7 Lesson 2 hai, hybridSearch()/reciprocalRankFusion() is module ka Lesson 1 (indexing) plus Lesson 2 (hybrid search) hai, cohere.rerank() ye lesson hai, aur final anthropic.messages.create() call generation ko retrieved content mein ground karta hai exactly jaise Module 7 Lesson 1 ne motivate kiya.",
      },
    ],

    mistakes: [
      {
        wrong: `// Applying an expensive re-ranker to the ENTIRE knowledge base
// instead of a small, pre-filtered candidate set
async function ragPipeline(userQuestion) {
  const allDocuments = await getAllDocuments(); // potentially millions
  const reranked = await cohere.rerank({
    model: 'rerank-english-v3.0',
    query: userQuestion,
    documents: allDocuments.map((d) => d.content), // reranking EVERYTHING
    topN: 5,
  });
  // This is prohibitively slow and expensive — re-ranking is designed
  // to run on a SMALL, already-narrowed candidate set, not a full
  // knowledge base, defeating the entire two-stage design's purpose
}`,
        right: `// Using fast retrieval to narrow the field FIRST, then re-ranking
// only the small resulting candidate set
async function ragPipeline(userQuestion) {
  const queryEmbedding = await embed(userQuestion);
  const candidates = await hybridSearch(userQuestion, queryEmbedding, 20); // fast, narrows millions to 20
  const reranked = await cohere.rerank({
    model: 'rerank-english-v3.0',
    query: userQuestion,
    documents: candidates.map((c) => c.content), // reranking only 20
    topN: 5,
  });
}`,
        why: "A re-ranker's precision comes from processing the query and each document jointly, which is computationally expensive per document — running it against an entire knowledge base defeats the purpose of the two-stage design, where fast retrieval narrows the field specifically so the expensive precise step only has to process a small set.",
        whyHi:
          "Ek re-ranker ki precision query aur har document ko jointly process karne se aati hai, jo per document computationally expensive hai — ise poori knowledge base ke against chalana two-stage design ke purpose ko defeat karta hai, jahan fast retrieval field ko specifically isliye narrow karta hai taaki expensive precise step ko sirf ek chhota set process karna pade.",
      },
    ],

    realWorld: [
      {
        en: "A production legal-research RAG system runs hybrid search over a corpus of millions of case documents to quickly narrow to the top 50 candidates, then applies a dedicated re-ranking model to precisely order just those 50 before the top 5 are handed to the generation model — the exact two-stage speed-then-precision pattern this lesson establishes, necessary because running the precise re-ranker against the full corpus would be far too slow for an interactive research tool.",
        hi: 'Ek production legal-research RAG system millions of case documents ke ek corpus ke upar hybrid search chalata hai jaldi se top 50 candidates tak narrow karne ke liye, phir ek dedicated re-ranking model apply karta hai sirf un 50 ko precisely order karne ke liye topP 5 generation model ko diye jaane se pehle — exact two-stage speed-then-precision pattern jise ye lesson establish karta hai, zaroori kyunki poore corpus ke against precise re-ranker chalana ek interactive research tool ke liye bahut zyada slow hoga.',
      },
    ],

    interviewQA: [
      {
        q: "Why is re-ranking applied only to a small, already-retrieved candidate set rather than the entire knowledge base?",
        qHi: 'Re-ranking sirf ek chhote, already-retrieved candidate set pe kyun apply kiya jata hai poori knowledge base pe nahi?',
        a: "A re-ranker processes the query and each candidate document jointly in one pass, which is genuinely more precise but far more computationally expensive per document than the independent, pre-computable comparison embeddings enable. Running it against an entire knowledge base of millions of documents would be prohibitively slow — the two-stage design uses fast retrieval to narrow the field first specifically so the expensive precise step only processes a small set.",
        aHi: 'Ek re-ranker query aur har candidate document ko ek pass mein jointly process karta hai, jo genuinely zyada precise hai par per document embeddings enable karne wale independent, pre-computable comparison se kaafi zyada computationally expensive. Ise millions of documents ki poori knowledge base ke against chalana prohibitively slow hoga — two-stage design fast retrieval use karta hai field ko pehle narrow karne ke liye specifically taaki expensive precise step sirf ek chhota set process kare.',
      },
      {
        q: "How does a re-ranker model differ architecturally from an embedding model, and why does that difference explain why one can be indexed and the other can't?",
        qHi: 'Ek re-ranker model ek embedding model se architecturally kaise alag hai, aur wo difference kyun explain karta hai ki ek index ki ja sakti hai aur doosri nahi?',
        a: "An embedding model computes each document's representation independently of any specific query, which is exactly what allows embeddings to be pre-computed once and indexed for fast lookup. A re-ranker processes the query and a candidate document jointly, in one pass — since its output depends on the specific query, it cannot be pre-computed ahead of time, which is why it's applied at query time to a small candidate set rather than indexed in advance.",
        aHi: 'Ek embedding model har document ki representation kisi bhi specific query se independently compute karta hai, jo exactly wo hai jo embeddings ko ek baar pre-computed aur fast lookup ke liye indexed hone deta hai. Ek re-ranker query aur ek candidate document ko jointly process karta hai, ek pass mein — kyunki iska output specific query pe depend karta hai, ise advance mein pre-compute nahi kiya ja sakta, yahi wajah hai ise query time pe ek chhote candidate set pe apply kiya jata hai advance mein indexed karne ke bajaye.',
      },
    ],

    exercises: [
      {
        task: "Describe, in your own words, why each stage of the full RAG pipeline (chunking, embedding, indexing, hybrid search, re-ranking, generation) exists — specifically what problem the PREVIOUS stage alone didn't solve, that this stage addresses.",
        taskHi: 'Apne khud ke words mein describe karo ki poori RAG pipeline ka har stage (chunking, embedding, indexing, hybrid search, re-ranking, generation) kyun exist karta hai — specifically wo problem jo PREVIOUS stage akela solve nahi karta tha, jise ye stage address karta hai.',
        hint: "Work through the pipeline in order, and for each stage, name the specific limitation of the PRECEDING stage that motivates it, following the sequence this module and the previous one established.",
        hintHi: 'Pipeline ko order mein work through karo, aur har stage ke liye, PRECEDING stage ki specific limitation naam do jo ise motivate karti hai, us sequence follow karte hue jise ye module aur pichhle wale ne establish kiya.',
      },
    ],

    keyTakeaways: [
      "Re-ranking is a second, precise pass over a small candidate set produced by fast retrieval — a two-stage design that achieves both speed (across the full collection) and precision (on the narrowed set), neither of which one stage alone could provide at real scale.",
      "A re-ranker model processes the query and each candidate document jointly, making it more precise than embedding-based comparison but too expensive to run against an entire knowledge base or pre-compute and index.",
      "A complete production RAG pipeline chains chunking (Module 7), embedding (Module 7), indexed retrieval (this module's Lesson 1), hybrid search (Lesson 2), and re-ranking (this lesson) — each stage solving a specific problem the previous stage alone left unsolved.",
      "This pipeline's retrieval quality is a real dependency for Module 9's agents and much of the rest of the course, since RAG is frequently one tool an agent invokes as part of a larger reasoning loop.",
    ],
    keyTakeawaysHi: [
      'Re-ranking fast retrieval se produce hue ek chhote candidate set ke upar ek doosra, precise pass hai — ek two-stage design jo dono speed (poori collection ke across) aur precision (narrowed set pe) achieve karta hai, jinme se koi bhi ek stage akela real scale pe provide nahi kar sakta.',
      'Ek re-ranker model query aur har candidate document ko jointly process karta hai, ise embedding-based comparison se zyada precise banate hue par ise poori knowledge base ke against chalane ya pre-compute aur index karne ke liye bahut expensive.',
      'Ek complete production RAG pipeline chunking (Module 7), embedding (Module 7), indexed retrieval (is module ka Lesson 1), hybrid search (Lesson 2), aur re-ranking (ye lesson) ko chain karta hai — har stage ek specific problem solve karta hai jo previous stage akela unsolved chhod deta tha.',
      'Is pipeline ki retrieval quality Module 9 ke agents aur baaki course ke zyadatar hisse ke liye ek real dependency hai, kyunki RAG aksar ek tool hai jise ek agent ek bade reasoning loop ke hisse ki tarah invoke karta hai.',
    ],
  },
];
