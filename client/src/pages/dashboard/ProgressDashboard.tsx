/**
 * Progress Dashboard ("My Progress") — level, XP, and earned badges.
 *
 * Real bug fixed here, not just a redesign: this page read
 * `localStorage.getItem('token')` for auth, but the app's access token
 * lives in memory only (see services/api.ts) — nothing ever writes to that
 * localStorage key, so every request went out as `Bearer null` and 401'd,
 * surfacing as "Failed to fetch data". Switched to the shared `api` client.
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Flame, Target, Trophy } from 'lucide-react';
import { api, ApiError } from '../../services/api';
import { usePreferences } from '../../hooks/usePreferences';
import { useStaggerIn } from '../../hooks/useStaggerIn';
import { Button, EmptyState, ErrorState, ProgressBar, SectionHeading } from '../../components/ui';
import { Skeleton } from '../../components/ui/Skeleton';

interface UserStats {
  totalXp: number;
  level: number;
  nextLevelXp: number;
  totalProblems: number;
  totalCourses: number;
  longestCodeStreak: number;
  totalTimeMin: number;
}

interface Badge {
  id: string;
  badge: { slug: string; name: string; description: string; icon: string; xpReward: number };
  earnedAt: string;
}

export default function ProgressDashboard() {
  const navigate = useNavigate();
  const { t } = usePreferences();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const rootRef = useStaggerIn<HTMLDivElement>([stats]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, badgesData] = await Promise.all([
        api.get<UserStats>('/user/stats'),
        api.get<Badge[]>('/user/badges'),
      ]);
      setStats(statsData);
      setBadges(badgesData);
      setError(null);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : t('Could not load your progress.', 'Progress load nahi hua.'),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <Skeleton className="h-7 w-56" />
        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <ErrorState message={error ?? t('No progress yet', 'Abhi koi progress nahi')} onRetry={fetchData} />
      </div>
    );
  }

  const levelProgress = stats.totalXp % 1000;
  const levelProgressPercent = Math.min(100, Math.round((levelProgress / 1000) * 100));
  const xpToNextLevel = Math.max(0, stats.nextLevelXp - stats.totalXp);

  return (
    <div ref={rootRef} className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <div data-in className="mb-6">
        <h1 className="font-display text-[28px] font-semibold leading-[1.15] tracking-[-0.015em] text-content sm:text-[32px]">
          {t('My progress', 'Mera progress')}
        </h1>
        <p className="mt-2 text-sm text-content-muted">
          {t('Level, XP, and every badge you have earned so far.', 'Level, XP, aur ab tak ke saare earned badges.')}
        </p>
      </div>

      {/* Level — the headline card, same weight as the Dashboard hero */}
      <div data-in className="card mb-6 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="font-display text-[22px] font-semibold text-content">
            {t('Level', 'Level')} {stats.level}
          </span>
          <span className="font-mono text-[13px] text-content-muted">
            {stats.totalXp.toLocaleString()} XP · {xpToNextLevel.toLocaleString()} {t('to next level', 'agle level tak')}
          </span>
        </div>
        <div className="mt-3">
          <ProgressBar percent={levelProgressPercent} />
        </div>
      </div>

      {/* Headline numbers */}
      <div data-in className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="card p-4">
          <Target size={16} className="text-brand" />
          <p className="mt-2 font-mono text-xl font-semibold tabular-nums text-content">{stats.totalProblems}</p>
          <p className="text-[11px] text-content-subtle">{t('Problems solved', 'Problems solve hue')}</p>
        </div>
        <div className="card p-4">
          <BookOpen size={16} className="text-brand" />
          <p className="mt-2 font-mono text-xl font-semibold tabular-nums text-content">{stats.totalCourses}</p>
          <p className="text-[11px] text-content-subtle">{t('Courses started', 'Courses shuru hue')}</p>
        </div>
        <div className="card p-4">
          <Flame size={16} className="text-medium" />
          <p className="mt-2 font-mono text-xl font-semibold tabular-nums text-content">{stats.longestCodeStreak}</p>
          <p className="text-[11px] text-content-subtle">{t('Longest streak (days)', 'Sabse lambi streak (din)')}</p>
        </div>
        <div className="card p-4">
          <Clock size={16} className="text-brand" />
          <p className="mt-2 font-mono text-xl font-semibold tabular-nums text-content">
            {Math.floor(stats.totalTimeMin / 60)}h {stats.totalTimeMin % 60}m
          </p>
          <p className="text-[11px] text-content-subtle">{t('Time spent', 'Bitaya gaya time')}</p>
        </div>
      </div>

      {/* Badges */}
      <section data-in>
        <SectionHeading title={`${t('Earned badges', 'Earned badges')} (${badges.length})`} />
        {badges.length === 0 ? (
          <EmptyState
            title={t('No badges yet', 'Abhi koi badge nahi')}
            description={t('Solve a few problems and the first one shows up here.', 'Kuch problems solve karo, pehla badge yahin dikhega.')}
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {badges.map((b) => (
              <div key={b.id} className="card flex items-start gap-3 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-medium/10 text-lg text-medium">
                  <Trophy size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-semibold text-content">{b.badge.name}</p>
                  <p className="mt-0.5 text-[12px] leading-4 text-content-muted">{b.badge.description}</p>
                  <div className="mt-1.5 flex items-center gap-2 font-mono text-[11px] text-content-subtle">
                    <span>+{b.badge.xpReward} XP</span>
                    <span>·</span>
                    <span>{new Date(b.earnedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div data-in className="mt-6 flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => navigate('/courses')}>
          {t('Browse courses', 'Courses dekho')}
        </Button>
        <Button variant="secondary" onClick={() => navigate('/leaderboard')}>
          {t('View leaderboard', 'Leaderboard dekho')}
        </Button>
      </div>
    </div>
  );
}
