/**
 * Courses Page - List all available courses
 * Shows course cards with progress, difficulty, and enrollment
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/courses.css';

interface Course {
  id: string;
  slug: string;
  name: string;
  nameHi: string;
  description: string;
  icon: string;
  color: string;
  level: string;
  totalXpReward: number;
  estimatedHours: number;
  stats: {
    modulesCount: number;
    topicsCount: number;
    problemsCount: number;
    userProgress?: {
      solvedProblems: number;
      totalXpEarned: number;
      completedAt?: string;
    };
  };
}

export default function CoursesPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCourses();
  }, [filter]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const url = new URL('/api/courses', window.location.origin);
      if (filter !== 'all') url.searchParams.set('level', filter);

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch courses');

      const data = await response.json();
      setCourses(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading courses');
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(search.toLowerCase()) ||
    course.description.toLowerCase().includes(search.toLowerCase())
  );

  const getDifficultyBadge = (level: string) => {
    const badges: Record<string, { color: string; label: string }> = {
      beginner: { color: '#10B981', label: '🟢 Beginner' },
      intermediate: { color: '#F59E0B', label: '🟡 Intermediate' },
      advanced: { color: '#EF4444', label: '🔴 Advanced' },
    };
    return badges[level] || badges.beginner;
  };

  const getProgressPercentage = (progress?: any) => {
    if (!progress) return 0;
    return Math.round((progress.solvedProblems / 100) * 100);
  };

  return (
    <div className="courses-page">
      <div className="courses-header">
        <div className="header-content">
          <h1>📚 Learning Paths</h1>
          <p>Choose your learning journey and master JavaScript</p>
        </div>

        <div className="courses-controls">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="filter-buttons">
            {['all', 'beginner', 'intermediate', 'advanced'].map(level => (
              <button
                key={level}
                className={`filter-btn ${filter === level ? 'active' : ''}`}
                onClick={() => setFilter(level as any)}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading courses...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>❌ {error}</p>
          <button onClick={fetchCourses} className="retry-btn">
            Retry
          </button>
        </div>
      ) : (
        <div className="courses-grid">
          {filteredCourses.length === 0 ? (
            <div className="no-courses">
              <p>No courses found</p>
            </div>
          ) : (
            filteredCourses.map(course => {
              const difficulty = getDifficultyBadge(course.level);
              const progress = course.stats.userProgress;
              const progressPercent = getProgressPercentage(progress);

              return (
                <div
                  key={course.id}
                  className="course-card"
                  onClick={() => navigate(`/courses/${course.slug}`)}
                >
                  <div className="card-header" style={{ borderColor: course.color }}>
                    <div className="course-icon">{course.icon}</div>
                    <div className="course-meta">
                      <h2>{course.name}</h2>
                      <span
                        className="difficulty-badge"
                        style={{ backgroundColor: difficulty.color }}
                      >
                        {difficulty.label}
                      </span>
                    </div>
                  </div>

                  <div className="card-body">
                    <p className="description">{course.description}</p>

                    <div className="stats">
                      <div className="stat">
                        <span className="stat-icon">📦</span>
                        <div>
                          <p className="stat-label">Modules</p>
                          <p className="stat-value">{course.stats.modulesCount}</p>
                        </div>
                      </div>
                      <div className="stat">
                        <span className="stat-icon">📖</span>
                        <div>
                          <p className="stat-label">Topics</p>
                          <p className="stat-value">{course.stats.topicsCount}</p>
                        </div>
                      </div>
                      <div className="stat">
                        <span className="stat-icon">🎯</span>
                        <div>
                          <p className="stat-label">Problems</p>
                          <p className="stat-value">{course.stats.problemsCount}</p>
                        </div>
                      </div>
                    </div>

                    {progress && (
                      <div className="progress-section">
                        <div className="progress-header">
                          <span>Progress</span>
                          <span className="progress-percent">{progressPercent}%</span>
                        </div>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${progressPercent}%` }}
                          ></div>
                        </div>
                        <p className="progress-text">
                          {progress.solvedProblems} problems solved • {progress.totalXpEarned} XP earned
                        </p>
                      </div>
                    )}

                    <div className="course-info">
                      <span>⏱️ ~{course.estimatedHours}h</span>
                      <span>⭐ {course.totalXpReward} XP</span>
                    </div>
                  </div>

                  <button className="card-action">
                    {progress ? 'Continue' : 'Start Course'} →
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
