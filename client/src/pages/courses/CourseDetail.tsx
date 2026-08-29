/**
 * Course Detail Page
 * Shows course modules, topics, and problems
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePreferences } from '../../hooks/usePreferences';
import '../styles/course-detail.css';

interface Module {
  id: string;
  slug: string;
  name: string;
  nameHi: string;
  description: string;
  order: number;
  topics: Topic[];
}

interface Topic {
  id: string;
  slug: string;
  title: string;
  titleHi?: string;
  description: string;
  descriptionHi?: string;
  difficulty: string;
  duration: number;
  order: number;
  problems: { slug: string }[];
}

interface CourseData {
  id: string;
  slug: string;
  name: string;
  nameHi: string;
  description: string;
  icon: string;
  color: string;
  estimatedHours: number;
  totalXpReward: number;
  modules: Module[];
  userProgress?: {
    solvedProblems: number;
    totalProblems: number;
    totalXpEarned: number;
    currentStreak: number;
    completedAt?: string;
  };
}

export default function CourseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const { t } = usePreferences();

  useEffect(() => {
    fetchCourse();
  }, [slug]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/courses/${slug}`);
      if (!response.ok) throw new Error('Course not found');

      const data = await response.json();
      setCourse(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading course');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="course-detail loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="course-detail error">
        <h2>Error</h2>
        <p>{error || 'Course not found'}</p>
        <button onClick={() => navigate('/courses')}>Back to Courses</button>
      </div>
    );
  }

  const progress = course.userProgress;
  const progressPercent = progress ? (progress.solvedProblems / progress.totalProblems) * 100 : 0;

  return (
    <div className="course-detail">
      <div className="course-header" style={{ borderColor: course.color }}>
        <button className="back-btn" onClick={() => navigate('/courses')}>
          ← Back
        </button>

        <div className="header-content">
          <div className="title-section">
            <h1>
              <span className="course-icon">{course.icon}</span>
              {t(course.name, course.nameHi)}
            </h1>
            <p className="subtitle">{course.nameHi}</p>
          </div>

          {progress && (
            <div className="progress-card">
              <div className="progress-stat">
                <span className="stat-label">Problems Solved</span>
                <p className="stat-value">
                  {progress.solvedProblems}/{progress.totalProblems}
                </p>
              </div>
              <div className="progress-stat">
                <span className="stat-label">XP Earned</span>
                <p className="stat-value">{progress.totalXpEarned}</p>
              </div>
              <div className="progress-stat">
                <span className="stat-label">Streak</span>
                <p className="stat-value">🔥 {progress.currentStreak}</p>
              </div>
            </div>
          )}
        </div>

        {progress && (
          <div className="progress-bar-section">
            <div className="progress-header">
              <span>Course Progress</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <div className="course-description">
        <p>{course.description}</p>
      </div>

      <div className="modules-section">
        <h2>📚 Learning Modules</h2>

        <div className="modules-list">
          {course.modules.map((module, index) => (
            <div key={module.id} className="module-card">
              <button
                className="module-header"
                onClick={() =>
                  setExpandedModule(
                    expandedModule === module.id ? null : module.id
                  )
                }
              >
                <span className="module-number">Module {index + 1}</span>
                <span className="module-title">{module.name}</span>
                <span className={`expand-icon ${expandedModule === module.id ? 'expanded' : ''}`}>
                  ▼
                </span>
              </button>

              {expandedModule === module.id && (
                <div className="module-content">
                  <p className="module-description">{module.description}</p>

                  <div className="topics-list">
                    <h4>Topics ({module.topics.length})</h4>
                    {module.topics.map(topic => (
                      <div key={topic.id} className="topic-item">
                        <div className="topic-info">
                          <h5>{t(topic.title, topic.titleHi)}</h5>
                          <p className="topic-desc">{t(topic.description, topic.descriptionHi)}</p>
                          <div className="topic-meta">
                            <span className="difficulty" data-difficulty={topic.difficulty}>
                              {topic.difficulty}
                            </span>
                            <span className="duration">⏱️ {topic.duration}m</span>
                            {topic.problems?.length > 0 && (
                              <span className="duration">💻 {topic.problems.length} practice</span>
                            )}
                          </div>
                        </div>
                        {/* Lesson first — the editor is reached from the end of it. */}
                        <button
                          className="start-btn"
                          onClick={() => navigate(`/courses/${slug}/topics/${topic.slug}`)}
                        >
                          {t('Learn', 'Seekho')}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="course-stats">
        <div className="stat-box">
          <h4>Course Stats</h4>
          <div className="stats-grid">
            <div>
              <span className="stat-icon">📦</span>
              <p>{course.modules.length} Modules</p>
            </div>
            <div>
              <span className="stat-icon">⏱️</span>
              <p>~{course.estimatedHours}h</p>
            </div>
            <div>
              <span className="stat-icon">⭐</span>
              <p>{course.totalXpReward} XP</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
