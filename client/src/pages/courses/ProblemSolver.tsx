/**
 * Problem Solver Page
 * Interactive problem solving with code editor and test cases
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MonacoEditor from '@monaco-editor/react';
import { usePreferences } from '../../hooks/usePreferences';
import '../styles/problem-solver.css';

interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isSample: boolean;
  order: number;
}

interface ProblemData {
  id: string;
  slug: string;
  title: string;
  description: string;
  descriptionHi?: string;
  difficulty: string;
  xpReward: number;
  hints: string[];
  approach: string;
  approachHi?: string;
  timeComplexity: string;
  spaceComplexity: string;
  solutionExplanation: string;
  testCases: TestCase[];
  userProgress?: {
    status: string;
    attempts: number;
    solved: boolean;
    hintsUsed: number;
  };
}

export default function ProblemSolver() {
  const { courseSlug, problemSlug } = useParams<{
    courseSlug: string;
    problemSlug: string;
  }>();
  const navigate = useNavigate();

  const [problem, setProblem] = useState<ProblemData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [code, setCode] = useState('// Write your solution here\n');
  const [language, setLanguage] = useState('javascript');
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<any>(null);

  const [showHints, setShowHints] = useState(false);
  const [showApproach, setShowApproach] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);

  const { t } = usePreferences();

  useEffect(() => {
    fetchProblem();
  }, [courseSlug, problemSlug]);

  const fetchProblem = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/courses/${courseSlug}/problems/${problemSlug}`
      );
      if (!response.ok) throw new Error('Problem not found');

      const data = await response.json();
      setProblem(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading problem');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!problem || !code.trim()) {
      alert('Please write some code first');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(
        `/api/courses/${courseSlug}/problems/${problemSlug}/submit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ code, language }),
        }
      );

      const data = await response.json();
      setSubmitResult(data);

      if (response.ok && data.submission.status === 'ACCEPTED') {
        setTimeout(() => {
          navigate(`/courses/${courseSlug}/problems`);
        }, 2000);
      }
    } catch (err) {
      alert('Error submitting solution');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="problem-solver loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="problem-solver error">
        <h2>Error</h2>
        <p>{error || 'Problem not found'}</p>
        <button onClick={() => navigate(`/courses/${courseSlug}`)}>
          Back to Course
        </button>
      </div>
    );
  }

  const progress = problem.userProgress;
  const getDifficultyColor = (diff: string) => {
    const colors: Record<string, string> = {
      EASY: '#10B981',
      MEDIUM: '#F59E0B',
      HARD: '#EF4444',
    };
    return colors[diff] || '#6B7280';
  };

  const description = t(problem.description, problem.descriptionHi);
  const approach = t(problem.approach, problem.approachHi);

  return (
    <div className="problem-solver">
      <div className="solver-header">
        <button className="back-btn" onClick={() => navigate(`/courses/${courseSlug}`)}>
          ← Back
        </button>

        <div className="header-title">
          <h1>{problem.title}</h1>
          <div className="header-badges">
            <span
              className="difficulty"
              style={{ backgroundColor: getDifficultyColor(problem.difficulty) }}
            >
              {problem.difficulty}
            </span>
            <span className="xp-reward">+{problem.xpReward} XP</span>
          </div>
        </div>
      </div>

      <div className="solver-content">
        <div className="problem-panel">
          <div className="problem-description">
            <h3>Problem Description</h3>
            <div className="description-text">{description}</div>
          </div>

          <div className="test-cases">
            <h3>Test Cases</h3>
            <div className="test-cases-list">
              {problem.testCases.map((tc, index) => (
                <div key={tc.id} className="test-case">
                  <div className="tc-header">
                    <span className="tc-number">Example {index + 1}</span>
                    {tc.isSample && <span className="tc-badge">Sample</span>}
                  </div>
                  <div className="tc-content">
                    <div className="tc-input">
                      <p className="tc-label">Input:</p>
                      <pre>{tc.input}</pre>
                    </div>
                    <div className="tc-output">
                      <p className="tc-label">Output:</p>
                      <pre>{tc.expectedOutput}</pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="help-section">
            <div className="help-buttons">
              <button
                className={`help-btn ${showHints ? 'active' : ''}`}
                onClick={() => setShowHints(!showHints)}
              >
                💡 Hints ({problem.hints.length})
              </button>
              <button
                className={`help-btn ${showApproach ? 'active' : ''}`}
                onClick={() => setShowApproach(!showApproach)}
              >
                📝 Approach
              </button>
            </div>

            {showHints && (
              <div className="hints-panel">
                <div className="hint-content">
                  <p className="hint-text">{problem.hints[currentHintIndex]}</p>
                </div>
                <div className="hint-navigation">
                  <button
                    disabled={currentHintIndex === 0}
                    onClick={() => setCurrentHintIndex(i => i - 1)}
                  >
                    ← Previous
                  </button>
                  <span>
                    {currentHintIndex + 1} / {problem.hints.length}
                  </span>
                  <button
                    disabled={currentHintIndex === problem.hints.length - 1}
                    onClick={() => setCurrentHintIndex(i => i + 1)}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

            {showApproach && (
              <div className="approach-panel">
                <h4>Solution Approach</h4>
                <p>{approach}</p>
                <div className="complexity">
                  <span>⏱️ Time: {problem.timeComplexity}</span>
                  <span>💾 Space: {problem.spaceComplexity}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="editor-panel">
          <div className="editor-header">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="language-select"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
            </select>

            {progress && (
              <div className="progress-info">
                <span className="attempts">Attempts: {progress.attempts}</span>
                {progress.solved && (
                  <span className="solved">✅ Solved</span>
                )}
              </div>
            )}
          </div>

          <MonacoEditor
            height="400px"
            language={language}
            value={code}
            onChange={(value) => setCode(value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              wordWrap: 'on',
            }}
          />

          <div className="editor-actions">
            <button
              className="submit-btn"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Solution'}
            </button>
            <button
              className="reset-btn"
              onClick={() => setCode('// Write your solution here\n')}
            >
              Reset Code
            </button>
          </div>

          {submitResult && (
            <div className={`submit-result ${submitResult.submission.status.toLowerCase()}`}>
              <h4>{submitResult.submission.status}</h4>
              <p>{submitResult.message}</p>
              {submitResult.submission.status === 'ACCEPTED' && (
                <p className="success">🎉 Congratulations! Problem solved!</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
