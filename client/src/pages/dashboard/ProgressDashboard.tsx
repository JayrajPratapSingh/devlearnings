/**
 * Progress Dashboard
 * Shows user's overall statistics, badges, and course progress
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

interface UserStats {
  id: string;
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
  badge: {
    slug: string;
    name: string;
    description: string;
    icon: string;
    xpReward: number;
  };
  earnedAt: string;
}

export default function ProgressDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const [statsRes, badgesRes] = await Promise.all([
        fetch('/api/user/stats', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch('/api/user/badges', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
      ]);

      if (!statsRes.ok || !badgesRes.ok) throw new Error('Failed to fetch data');

      const [statsData, badgesData] = await Promise.all([
        statsRes.json(),
        badgesRes.json(),
      ]);

      setStats(statsData);
      setBadges(badgesData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="dashboard error">
        <h2>Error</h2>
        <p>{error || 'Failed to load dashboard'}</p>
        <button onClick={fetchData}>Retry</button>
      </div>
    );
  }

  const levelProgress = stats.totalXp % 1000;
  const levelProgressPercent = (levelProgress / 1000) * 100;
  const nextLevelXp = stats.nextLevelXp - stats.totalXp;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>📊 Your Learning Dashboard</h1>
        <p>Track your progress and celebrate your achievements</p>
      </div>

      <div className="stats-grid">
        {/* Level Card */}
        <div className="stat-card level-card">
          <div className="level-display">
            <span className="level-number">Level {stats.level}</span>
          </div>
          <div className="level-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${levelProgressPercent}%` }}
              ></div>
            </div>
            <p className="progress-text">
              {stats.totalXp} XP • {nextLevelXp} XP to level {stats.level + 1}
            </p>
          </div>
        </div>

        {/* XP Card */}
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <p className="stat-label">Total XP</p>
            <p className="stat-value">{stats.totalXp.toLocaleString()}</p>
          </div>
        </div>

        {/* Problems Solved */}
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <p className="stat-label">Problems Solved</p>
            <p className="stat-value">{stats.totalProblems}</p>
          </div>
        </div>

        {/* Courses */}
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <p className="stat-label">Courses Started</p>
            <p className="stat-value">{stats.totalCourses}</p>
          </div>
        </div>

        {/* Streak */}
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <p className="stat-label">Longest Streak</p>
            <p className="stat-value">{stats.longestCodeStreak} days</p>
          </div>
        </div>

        {/* Time */}
        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <p className="stat-label">Total Time</p>
            <p className="stat-value">{Math.floor(stats.totalTimeMin / 60)}h {stats.totalTimeMin % 60}m</p>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        {/* Badges Section */}
        <section className="badges-section">
          <h2>🏆 Earned Badges ({badges.length})</h2>
          {badges.length === 0 ? (
            <p className="empty-state">
              Start solving problems to earn badges!
            </p>
          ) : (
            <div className="badges-grid">
              {badges.map(badge => (
                <div key={badge.id} className="badge-item">
                  <div className="badge-icon">{badge.badge.icon}</div>
                  <div className="badge-info">
                    <h4>{badge.badge.name}</h4>
                    <p className="badge-desc">{badge.badge.description}</p>
                    <p className="badge-xp">+{badge.badge.xpReward} XP</p>
                    <p className="earned-date">
                      Earned {new Date(badge.earnedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section className="actions-section">
          <h2>🚀 Quick Actions</h2>
          <div className="actions-grid">
            <button
              className="action-btn"
              onClick={() => navigate('/courses')}
            >
              <span className="action-icon">📚</span>
              <div>
                <p className="action-title">Browse Courses</p>
                <p className="action-desc">Start a new learning path</p>
              </div>
              <span className="arrow">→</span>
            </button>
            <button
              className="action-btn"
              onClick={() => navigate('/leaderboard')}
            >
              <span className="action-icon">🏆</span>
              <div>
                <p className="action-title">Leaderboard</p>
                <p className="action-desc">See global rankings</p>
              </div>
              <span className="arrow">→</span>
            </button>
            <button
              className="action-btn"
              onClick={() => navigate('/achievements')}
            >
              <span className="action-icon">⭐</span>
              <div>
                <p className="action-title">Achievements</p>
                <p className="action-desc">View all achievements</p>
              </div>
              <span className="arrow">→</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
