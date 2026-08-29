import { prisma } from '../config/prisma';
import { dsaRepository } from '../repositories/dsa.repository';

/**
 * The daily challenge.
 *
 * Picked deterministically from the date, not stored in a table. That means
 * everyone sees the same problem on the same day, yesterday's pick can always
 * be recomputed, and there is no scheduler to run or drift out of sync.
 *
 * The rotation walks a fixed permutation rather than hashing the date into an
 * index — see `rotationOrder` for why that difference matters.
 */

/** Local calendar day as YYYY-MM-DD. Using UTC would flip the day mid-evening in IST. */
export function dayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Days since epoch — a stable, monotonically increasing index for the rotation. */
function dayNumber(key: string): number {
  return Math.floor(new Date(`${key}T00:00:00Z`).getTime() / 86_400_000);
}

/** Small integer hash, used to seed the shuffle. */
function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/** mulberry32 — a tiny deterministic PRNG, so the shuffle is reproducible. */
function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * A fixed, scrambled ordering of the problem list.
 *
 * The obvious approach — hashing the date into an index — looks random and is:
 * it repeats a problem within about nine days, because random-with-replacement
 * collides fast (the birthday problem). Walking a *permutation* instead
 * guarantees every problem appears exactly once before any repeats, while the
 * seeded shuffle keeps the order from being visibly sequential.
 */
function rotationOrder(count: number): number[] {
  const order = Array.from({ length: count }, (_, i) => i);
  const rand = seededRandom(hash('devprep-daily-v1'));
  for (let i = order.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    const a = order[i]!;
    const b = order[j]!;
    order[i] = b;
    order[j] = a;
  }
  return order;
}

/** The index of the problem for a given day. */
function pickIndex(key: string, count: number): number {
  const order = rotationOrder(count);
  // Modulo the day number so the cycle restarts cleanly after `count` days.
  return order[((dayNumber(key) % count) + count) % count]!;
}

export const dailyService = {
  async today(userId: string, key = dayKey()) {
    const problems = await dsaRepository.list({});
    if (problems.length === 0) return null;

    const problem = problems[pickIndex(key, problems.length)]!;

    const [progress, solvedToday] = await Promise.all([
      dsaRepository.findProgress(userId, problem.id),
      prisma.submission.findFirst({
        where: {
          userId,
          problemId: problem.id,
          status: 'ACCEPTED',
          createdAt: { gte: new Date(`${key}T00:00:00`) },
        },
        select: { id: true },
      }),
    ]);

    // A streak of consecutive days on which the daily was actually solved.
    const streak = await this.dailyStreak(userId);

    return {
      day: key,
      problem: {
        slug: problem.slug,
        title: problem.title,
        category: problem.category,
        difficulty: problem.difficulty,
      },
      solvedToday: Boolean(solvedToday),
      /** Solved before, but not today — worth showing so it does not feel unfair. */
      solvedPreviously: Boolean(progress?.solved) && !solvedToday,
      attempts: progress?.attempts ?? 0,
      streak,
    };
  },

  /**
   * How many consecutive days ending today (or yesterday) the daily was solved.
   *
   * Walks backwards day by day and stops at the first gap. Capped at 60 so a
   * long-running account cannot turn this into 365 queries.
   */
  async dailyStreak(userId: string, maxLookback = 60): Promise<number> {
    const since = new Date(Date.now() - maxLookback * 86_400_000);

    const accepted = await prisma.submission.findMany({
      where: { userId, status: 'ACCEPTED', createdAt: { gte: since } },
      select: { problemId: true, createdAt: true },
    });
    if (accepted.length === 0) return 0;

    // Which problems were accepted on which local day.
    const byDay = new Map<string, Set<string>>();
    for (const s of accepted) {
      const k = dayKey(s.createdAt);
      if (!byDay.has(k)) byDay.set(k, new Set());
      byDay.get(k)!.add(s.problemId);
    }

    const problems = await dsaRepository.list({});
    if (problems.length === 0) return 0;

    const dailyFor = (k: string) => problems[pickIndex(k, problems.length)]!.id;

    let streak = 0;
    // Today not being done yet must not break a streak mid-morning, so start
    // from today but allow the first day to be a miss.
    for (let back = 0; back < maxLookback; back += 1) {
      const k = dayKey(new Date(Date.now() - back * 86_400_000));
      const solved = byDay.get(k)?.has(dailyFor(k)) ?? false;

      if (solved) streak += 1;
      else if (back === 0) continue; // today is still in progress
      else break;
    }

    return streak;
  },
};
