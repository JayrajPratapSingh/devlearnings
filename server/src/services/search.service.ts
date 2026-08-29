import { prisma } from '../config/prisma';

export interface SearchHit {
  type: 'topic' | 'problem' | 'question' | 'note';
  id: string;
  title: string;
  subtitle: string;
  href: string;
  /** Higher is a better match. Not sent to the client, used only for ordering. */
  score?: number;
}

/**
 * Powers the Ctrl+K palette.
 *
 * Three things the first version got wrong, all fixed here:
 *
 *  1. **It only searched titles.** Searching "jsonb" found nothing even though
 *     the word appears throughout the topic bodies. Now the body, tags and
 *     answer text are searched too.
 *  2. **Hyphens and slugs matched nothing.** People type "two-sum" because that
 *     is what the URL says. The query is now tokenised, so punctuation stops
 *     mattering.
 *  3. **No ranking.** Every hit was equal, so a body mention outranked an exact
 *     title. Hits are now scored and sorted, which is what makes a palette feel
 *     like it read your mind rather than grepped.
 */

/**
 * Words that appear in almost every sentence. Left in, they dominate a natural
 * question like "what is an API?" — every topic contains "is" and "an", so the
 * scorer would rank a body mention above the exact question.
 */
const STOP_WORDS = new Set([
  'the', 'is', 'an', 'and', 'or', 'of', 'to', 'in', 'on', 'for', 'with',
  'what', 'why', 'how', 'when', 'does', 'do', 'are', 'be', 'it', 'that',
  'this', 'from', 'by', 'at', 'as', 'can', 'you', 'your', 'me', 'my',
  'kya', 'hai', 'ka', 'ki', 'ke', 'ko', 'se', 'mein', 'aur',
]);

/**
 * "two-sum" → ["two","sum"], "$set" → ["$set"].
 *
 * `$` and `_` survive because Mongo operators and SQL identifiers are things
 * people genuinely search for; everything else is a separator, so punctuation
 * and case stop mattering.
 */
function tokenise(query: string): string[] {
  const raw = query
    .toLowerCase()
    .split(/[^a-z0-9+#.$_]+/i)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2);

  const meaningful = raw.filter((t) => !STOP_WORDS.has(t));

  // If the query was ONLY stop words ("what is the"), fall back to them rather
  // than returning nothing — an odd result beats an empty palette.
  return meaningful.length > 0 ? meaningful : raw;
}

/**
 * Scores a hit so an exact title beats a passing mention in the body.
 * Every token must appear somewhere, otherwise "react hooks" would match every
 * topic that merely says "react".
 */
function score(tokens: string[], title: string, tags: string[], body: string): number {
  const t = title.toLowerCase();
  const tagText = tags.join(' ').toLowerCase();
  const b = body.toLowerCase();

  let total = 0;

  for (const token of tokens) {
    if (t === token) total += 120;
    else if (t.startsWith(token)) total += 70;
    else if (t.includes(token)) total += 45;
    else if (tagText.includes(token)) total += 25;
    else if (b.includes(token)) total += 8;
    else return 0; // a token matched nothing at all — not a hit
  }

  // Prefer shorter titles: "Closures" is a better hit than a long sentence
  // that happens to contain the word.
  return total + Math.max(0, 20 - Math.floor(title.length / 6));
}

export const searchService = {
  async global(userId: string, query: string, limit = 8): Promise<{ results: SearchHit[] }> {
    const tokens = tokenise(query);
    if (tokens.length === 0) return { results: [] };

    // One OR per token so a row matching ANY token is a candidate; the scorer
    // then discards anything that does not match EVERY token. Doing the strict
    // check in SQL would need a query per token.
    const contains = (fields: string[]) => ({
      OR: tokens.flatMap((token) =>
        fields.map((field) => ({ [field]: { contains: token, mode: 'insensitive' as const } })),
      ),
    });

    const [topics, problems, questions, notes] = await Promise.all([
      prisma.topic.findMany({
        where: contains(['title', 'summary', 'content', 'slug']),
        select: { id: true, slug: true, title: true, summary: true, content: true, tags: true, category: { select: { name: true } } },
        take: 40,
      }),
      prisma.dSAProblem.findMany({
        where: contains(['title', 'description', 'slug', 'category']),
        select: { id: true, slug: true, title: true, category: true, difficulty: true, description: true },
        take: 40,
      }),
      prisma.interviewQuestion.findMany({
        where: contains(['question', 'shortAnswer', 'detailedAnswer', 'slug', 'category']),
        select: { id: true, slug: true, question: true, shortAnswer: true, category: true, difficulty: true, tags: true },
        take: 40,
      }),
      prisma.note.findMany({
        where: { userId, ...contains(['title', 'content']) },
        select: { id: true, title: true, content: true },
        take: 20,
      }),
    ]);

    const hits: SearchHit[] = [];

    for (const t of topics) {
      const s = score(tokens, t.title, [...t.tags, t.slug], `${t.summary} ${t.content}`);
      if (s > 0) {
        hits.push({
          type: 'topic',
          id: t.id,
          title: t.title,
          subtitle: t.category.name,
          href: `/topic/${t.slug}`,
          score: s,
        });
      }
    }

    for (const p of problems) {
      const s = score(tokens, p.title, [p.slug, p.category], p.description);
      if (s > 0) {
        hits.push({
          type: 'problem',
          id: p.id,
          title: p.title,
          subtitle: `${p.category} · ${p.difficulty}`,
          href: `/dsa/${p.slug}`,
          score: s,
        });
      }
    }

    for (const q of questions) {
      const s = score(tokens, q.question, [...q.tags, q.slug, q.category], q.shortAnswer);
      if (s > 0) {
        hits.push({
          type: 'question',
          id: q.id,
          title: q.question,
          subtitle: `${q.category} · ${q.difficulty}`,
          href: `/questions?q=${encodeURIComponent(q.slug)}`,
          score: s,
        });
      }
    }

    for (const n of notes) {
      const s = score(tokens, n.title, [], n.content);
      if (s > 0) {
        // Your own note about something usually beats reference material.
        hits.push({ type: 'note', id: n.id, title: n.title, subtitle: 'Your note', href: `/notes?id=${n.id}`, score: s + 15 });
      }
    }

    hits.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

    return {
      results: hits.slice(0, limit).map(({ score: _score, ...hit }) => hit),
    };
  },
};
