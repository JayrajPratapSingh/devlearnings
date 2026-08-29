import { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { PreferencesProvider } from './hooks/usePreferences';
import { AppLayout } from './layouts/AppLayout';
import { AuthPage } from './pages/AuthPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Button, LoadingState } from './components/ui';

// The problem workspace pulls in Monaco, which is by far the largest dependency —
// splitting it keeps the dashboard's initial load small.
const DsaProblemPage = lazy(() =>
  import('./pages/DsaProblemPage').then((m) => ({ default: m.DsaProblemPage })),
);
const DsaListPage = lazy(() => import('./pages/DsaListPage').then((m) => ({ default: m.DsaListPage })));
const TopicListPage = lazy(() => import('./pages/TopicListPage').then((m) => ({ default: m.TopicListPage })));
const TopicDetailPage = lazy(() =>
  import('./pages/TopicDetailPage').then((m) => ({ default: m.TopicDetailPage })),
);
const QuestionsPage = lazy(() => import('./pages/QuestionsPage').then((m) => ({ default: m.QuestionsPage })));
const MockInterviewPage = lazy(() =>
  import('./pages/MockInterviewPage').then((m) => ({ default: m.MockInterviewPage })),
);
const RevisionPage = lazy(() => import('./pages/RevisionPage').then((m) => ({ default: m.RevisionPage })));
const NotesPage = lazy(() => import('./pages/NotesPage').then((m) => ({ default: m.NotesPage })));
const BookmarksPage = lazy(() => import('./pages/BookmarksPage').then((m) => ({ default: m.BookmarksPage })));
const ProgressPage = lazy(() => import('./pages/ProgressPage').then((m) => ({ default: m.ProgressPage })));
const RecallPage = lazy(() => import('./pages/RecallPage').then((m) => ({ default: m.RecallPage })));
const BlitzPage = lazy(() => import('./pages/BlitzPage').then((m) => ({ default: m.BlitzPage })));
const TracksPage = lazy(() => import('./pages/TracksPage').then((m) => ({ default: m.TracksPage })));
const VisualiserPage = lazy(() =>
  import('./pages/VisualiserPage').then((m) => ({ default: m.VisualiserPage })),
);

// Course system pages
const CoursesPage = lazy(() => import('./pages/courses/index').then((m) => ({ default: m.default })));
const CourseDetail = lazy(() => import('./pages/courses/CourseDetail').then((m) => ({ default: m.default })));
const TopicLesson = lazy(() => import('./pages/courses/TopicLesson').then((m) => ({ default: m.default })));
const ProblemSolver = lazy(() => import('./pages/courses/ProblemSolver').then((m) => ({ default: m.default })));
const ProgressDashboard = lazy(() => import('./pages/dashboard/ProgressDashboard').then((m) => ({ default: m.default })));
const Leaderboard = lazy(() => import('./pages/leaderboard/Leaderboard').then((m) => ({ default: m.default })));

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingState label="Restoring your session" />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <>{children}</>;
}

function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 text-center">
      <p className="font-mono text-3xl font-semibold text-content-subtle">404</p>
      <p className="text-sm text-content-muted">That page does not exist.</p>
      <Button variant="primary" size="sm" onClick={() => window.location.assign('/')}>
        Back to dashboard
      </Button>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <PreferencesProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<AuthPage mode="login" />} />
            <Route path="/register" element={<AuthPage mode="register" />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            <Route
              element={
                <RequireAuth>
                  <AppLayout />
                </RequireAuth>
              }
            >
              <Route
                path="/"
                element={
                  <ErrorBoundary>
                    <DashboardPage />
                  </ErrorBoundary>
                }
              />

              {/* Each route gets its own boundary and suspense fallback, so a
                  failure or a slow chunk is contained to the page. */}
              {(
                [
                  ['/dsa', <DsaListPage />],
                  ['/dsa/:slug', <DsaProblemPage />],
                  ['/topics/:categorySlug', <TopicListPage />],
                  ['/topic/:slug', <TopicDetailPage />],
                  ['/questions', <QuestionsPage />],
                  ['/mock-interview', <MockInterviewPage />],
                  ['/revision', <RevisionPage />],
                  ['/notes', <NotesPage />],
                  ['/bookmarks', <BookmarksPage />],
                  ['/progress', <ProgressPage />],
                  ['/visualise', <VisualiserPage />],
                  ['/recall', <RecallPage />],
                  ['/blitz', <BlitzPage />],
                  ['/tracks', <TracksPage />],
                  // Course system routes
                  ['/courses', <CoursesPage />],
                  ['/courses/:slug', <CourseDetail />],
                  ['/courses/:courseSlug/topics/:topicSlug', <TopicLesson />],
                  ['/courses/:courseSlug/problems/:problemSlug', <ProblemSolver />],
                  ['/dashboard/progress', <ProgressDashboard />],
                  ['/leaderboard', <Leaderboard />],
                  ['/leaderboard/:courseSlug', <Leaderboard />],
                ] as const
              ).map(([path, element]) => (
                <Route
                  key={path}
                  path={path}
                  element={
                    <ErrorBoundary>
                      <Suspense fallback={<LoadingState />}>{element}</Suspense>
                    </ErrorBoundary>
                  }
                />
              ))}

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </PreferencesProvider>
    </BrowserRouter>
  );
}
