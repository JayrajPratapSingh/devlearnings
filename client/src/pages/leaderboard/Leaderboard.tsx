/**
 * Leaderboard — global and per-course rankings.
 *
 * Rewritten for three real bugs, not just the design system:
 *  1. Auth: read `localStorage.getItem('token')` — the app's token lives in
 *     memory only (see services/api.ts), so this was always `Bearer null`
 *     and every request 401'd. Replaced with the shared `api` client, which
 *     attaches the real token and refreshes it on expiry.
 *  2. Shape: the server sent raw UserStats/CourseLeaderboard rows (no
 *     `user`, no `rank` on the global list) while this page's type expected
 *     `{ rank, user: { name }, xp, problemsSolved, streak, badges }` — every
 *     entry.user.id access threw. The server route now returns exactly this
 *     shape (see server/src/routes/courses.routes.ts); kept the type in sync
 *     rather than defensively working around a contract that should just be
 *     correct.
 *  3. Avatar: `user.avatar` (an image URL) never existed anywhere in this
 *     app's data — accounts only have `avatarColor`, the same initial-letter
 *     circle AppLayout's account button already uses.
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Flame, Globe, Medal, Trophy } from 'lucide-react';
import { api, ApiError } from '../../services/api';
import { usePreferences } from '../../hooks/usePreferences';
import { useStaggerIn } from '../../hooks/useStaggerIn';
import { Button, EmptyState, ErrorState, cx } from '../../components/ui';
import { Skeleton } from '../../components/ui/Skeleton';

interface LeaderboardEntry {
  rank: number;
  user: { id: string; name: string; avatarColor: string };
  xp: number;
  level?: number;
  problemsSolved: number;
  streak: number;
  badges: number;
}

type LeaderboardType = 'global' | 'course';

const MEDAL_TONE: Record<number, string> = {
  1: 'text-medium bg-medium/10 border-medium/25',
  2: 'text-content-muted bg-surface-sunken border-line',
  3: 'text-hard bg-hard/10 border-hard/25',
};

function Avatar({ user }: { user: LeaderboardEntry['user'] }) {
  return (
    <span
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold text-white"
      style={{ backgroundColor: user.avatarColor }}
    >
      {user.name.charAt(0).toUpperCase()}
    </span>
  );
}

export default function Leaderboard() {
  const { courseSlug } = useParams<{ courseSlug?: string }>();
  const navigate = useNavigate();
  const { t } = usePreferences();

  const [leaderboardType, setLeaderboardType] = useState<LeaderboardType>(courseSlug ? 'course' : 'global');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const rootRef = useStaggerIn<HTMLDivElement>([entries, loading]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const path =
          leaderboardType === 'course' && courseSlug
            ? `/courses/${courseSlug}/leaderboard?limit=50`
            : '/leaderboard/global?limit=50';
        const data = await api.get<LeaderboardEntry[]>(path);
        if (!cancelled) {
          setEntries(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? err.message
              : t('Could not load the leaderboard.', 'Leaderboard load nahi hui.'),
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [leaderboardType, courseSlug, t]);

  return (
    <div ref={rootRef} className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <div data-in className="mb-6">
        <h1 className="font-display text-[28px] font-semibold leading-[1.15] tracking-[-0.015em] text-content sm:text-[32px]">
          {t('Leaderboard', 'Leaderboard')}
        </h1>
        <p className="mt-2 text-sm text-content-muted">
          {t("See who's leading the pack.", 'Dekho kaun aage chal raha hai.')}
        </p>
      </div>

      <div data-in className="mb-5 flex gap-1.5">
        <button
          onClick={() => setLeaderboardType('global')}
          className={cx(
            'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors',
            leaderboardType === 'global' ? 'bg-brand text-surface' : 'bg-surface-raised text-content-muted hover:text-content',
          )}
        >
          <Globe size={14} /> {t('Global', 'Global')}
        </button>
        {courseSlug ? (
          <button
            onClick={() => setLeaderboardType('course')}
            className={cx(
              'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors',
              leaderboardType === 'course' ? 'bg-brand text-surface' : 'bg-surface-raised text-content-muted hover:text-content',
            )}
          >
            {t('This course', 'Ye course')}
          </button>
        ) : (
          <Button size="sm" variant="secondary" onClick={() => navigate('/courses')}>
            {t('Browse courses', 'Courses dekho')}
          </Button>
        )}
      </div>

      {loading ? (
        <div className="card divide-y divide-line">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={() => setLeaderboardType((prev) => prev)} />
      ) : entries.length === 0 ? (
        <EmptyState
          title={t('No entries yet', 'Abhi koi entry nahi')}
          description={t(
            'Start solving to be the first name on this board.',
            'Solve karna shuru karo, is board pe pehla naam tum ho sakte ho.',
          )}
        />
      ) : (
        <div data-in className="card divide-y divide-line">
          {entries.map((entry) => (
            <div key={entry.user.id} className="flex items-center gap-3 px-4 py-3">
              <span
                className={cx(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-md border font-mono text-[11px] font-semibold',
                  MEDAL_TONE[entry.rank] ?? 'text-content-subtle bg-surface-sunken border-line',
                )}
              >
                {entry.rank <= 3 ? <Medal size={13} /> : entry.rank}
              </span>

              <Avatar user={entry.user} />

              <span className="min-w-0 flex-1 truncate text-[13.5px] font-medium text-content">
                {entry.user.name}
              </span>

              {entry.level !== undefined && (
                <span className="hidden shrink-0 rounded-md bg-surface-sunken px-1.5 py-0.5 font-mono text-[11px] text-content-subtle sm:inline-block">
                  L{entry.level}
                </span>
              )}

              <span className="shrink-0 font-mono text-[12px] tabular-nums text-content-subtle">
                {entry.problemsSolved} {t('solved', 'solved')}
              </span>

              {entry.streak > 0 && (
                <span className="hidden shrink-0 items-center gap-1 font-mono text-[12px] tabular-nums text-medium sm:flex">
                  <Flame size={12} /> {entry.streak}
                </span>
              )}

              {entry.badges > 0 && (
                <span className="hidden shrink-0 items-center gap-1 font-mono text-[12px] tabular-nums text-content-subtle sm:flex">
                  <Trophy size={12} /> {entry.badges}
                </span>
              )}

              <span className="shrink-0 font-mono text-[13px] font-semibold tabular-nums text-content">
                {entry.xp.toLocaleString()} XP
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
