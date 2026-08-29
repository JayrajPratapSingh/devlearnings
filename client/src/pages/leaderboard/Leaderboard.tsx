/**
 * Leaderboard Page
 * Global and course-specific rankings with user achievements
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/leaderboard.css';

interface LeaderboardEntry {
  rank: number;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  xp: number;
  level: number;
  problemsSolved: number;
  streak: number;
  badges: number;
}

type LeaderboardType = 'global' | 'course';

export default function Leaderboard() {
  const { courseSlug } = useParams<{ courseSlug?: string }>();
  const navigate = useNavigate();

  const [leaderboardType, setLeaderboardType] = useState<LeaderboardType>(
    courseSlug ? 'course' : 'global'
  );
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [leaderboardType, courseSlug]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      let url = '/api/leaderboard/global?limit=50';
      if (leaderboardType === 'course' && courseSlug) {
        url = `/api/courses/${courseSlug}/leaderboard?limit=50`;
      }

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch leaderboard');

      const data = await response.json();
      setEntries(data.entries || data);
      setUserRank(data.userRank || null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const getMedalEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  const getXpColor = (xp: number) => {
    if (xp >= 10000) return '#FF6B6B';
    if (xp >= 5000) return '#FFB84D';
    if (xp >= 1000) return '#51CF66';
    return '#868E96';
  };

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-header">
        <h1>🏆 Leaderboard</h1>
        <p>See who's leading the learning challenge</p>

        <div className="leaderboard-tabs">
          <button
            className={`tab ${leaderboardType === 'global' ? 'active' : ''}`}
            onClick={() => setLeaderboardType('global')}
          >
            🌍 Global Rankings
          </button>
          {courseSlug && (
            <button
              className={`tab ${leaderboardType === 'course' ? 'active' : ''}`}
              onClick={() => setLeaderboardType('course')}
            >
              📚 Course Rankings
            </button>
          )}
          {!courseSlug && (
            <button
              className="tab"
              onClick={() => navigate('/courses')}
            >
              📚 Browse Courses
            </button>
          )}
        </div>
      </div>

      {userRank && (
        <div className="your-rank-card">
          <div className="rank-badge">
            <span className="medal">#{userRank.rank}</span>
          </div>
          <div className="rank-info">
            <p className="rank-title">Your Current Rank</p>
            <h3>{userRank.user.name}</h3>
            <div className="rank-stats">
              <span>⭐ {userRank.xp} XP</span>
              <span>🎯 {userRank.problemsSolved} Problems</span>
              <span>🏆 {userRank.badges} Badges</span>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>❌ {error}</p>
          <button onClick={fetchLeaderboard} className="retry-btn">
            Retry
          </button>
        </div>
      ) : (
        <div className="leaderboard-table">
          <div className="table-header">
            <div className="col-rank">Rank</div>
            <div className="col-user">User</div>
            <div className="col-level">Level</div>
            <div className="col-xp">XP</div>
            <div className="col-problems">Problems</div>
            <div className="col-streak">Streak</div>
            <div className="col-badges">Badges</div>
          </div>

          {entries.length === 0 ? (
            <div className="no-entries">
              <p>No entries yet. Start solving to climb the leaderboard!</p>
            </div>
          ) : (
            <div className="table-body">
              {entries.map((entry) => (
                <div
                  key={entry.user.id}
                  className={`table-row ${entry.rank <= 3 ? `top-${entry.rank}` : ''}`}
                >
                  <div className="col-rank">
                    <span className="medal">{getMedalEmoji(entry.rank)}</span>
                  </div>

                  <div className="col-user">
                    <div className="user-info">
                      <div className="avatar">
                        {entry.user.avatar ? (
                          <img src={entry.user.avatar} alt={entry.user.name} />
                        ) : (
                          <span>{entry.user.name.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <p className="user-name">{entry.user.name}</p>
                    </div>
                  </div>

                  <div className="col-level">
                    <span className="level-badge">L{entry.level}</span>
                  </div>

                  <div className="col-xp">
                    <span
                      className="xp-badge"
                      style={{ backgroundColor: getXpColor(entry.xp) }}
                    >
                      {entry.xp.toLocaleString()} XP
                    </span>
                  </div>

                  <div className="col-problems">
                    <span className="problems-badge">🎯 {entry.problemsSolved}</span>
                  </div>

                  <div className="col-streak">
                    {entry.streak > 0 ? (
                      <span className="streak-badge">🔥 {entry.streak}</span>
                    ) : (
                      <span className="streak-badge empty">-</span>
                    )}
                  </div>

                  <div className="col-badges">
                    <span className="badges-badge">🏅 {entry.badges}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="leaderboard-info">
        <h3>📊 How Ranking Works</h3>
        <div className="info-grid">
          <div className="info-card">
            <h4>XP Points</h4>
            <p>Primary ranking metric. Earn XP by solving problems and completing courses.</p>
          </div>
          <div className="info-card">
            <h4>Level</h4>
            <p>Increases automatically as you earn XP. Each level requires 1000 XP.</p>
          </div>
          <div className="info-card">
            <h4>Problems Solved</h4>
            <p>Shows your problem-solving activity. More problems = more experience.</p>
          </div>
          <div className="info-card">
            <h4>Streak</h4>
            <p>Consecutive days of solving problems. Maintain your streak for bonus rewards.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
