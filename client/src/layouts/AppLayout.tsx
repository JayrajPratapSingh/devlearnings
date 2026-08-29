import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePreferences } from '../hooks/usePreferences';
import { useApi } from '../hooks/useApi';
import { useSmoothScroll, scrollToTop } from '../hooks/useSmoothScroll';
import { PageTransition } from '../components/motion';
import { endpoints } from '../services/endpoints';
import { CommandPalette } from '../components/CommandPalette';
import { Button, ProgressBar, cx } from '../components/ui';
import { StreakFlame } from '../components/ui/Motion';
import { DeleteAccountDialog } from '../components/DeleteAccountDialog';
import { AccountDialog } from '../components/AccountDialog';
import { Scratchpad } from '../components/Scratchpad';

interface NavItem {
  to: string;
  label: string;
  end?: boolean;
}

interface NavGroup {
  heading: string;
  items: NavItem[];
}

/**
 * The sidebar mirrors how preparation actually happens: a dashboard, the
 * practice surfaces, the reading material, then the review tools.
 *
 * The Learn section is deliberately absent here — it is built from the topic
 * categories the API returns, so adding a category to the seed makes it appear
 * in the sidebar automatically. A hardcoded list silently went stale every time
 * content was added, which is exactly the failure this avoids.
 */
const NAV: NavGroup[] = [
  {
    heading: 'Overview',
    items: [
      { to: '/', label: 'Dashboard', end: true },
      { to: '/tracks', label: 'Tracks' },
    ],
  },
  {
    heading: 'Learning Paths',
    items: [
      { to: '/courses', label: '📚 Courses' },
      { to: '/dashboard/progress', label: '📊 My Progress' },
      { to: '/leaderboard', label: '🏆 Leaderboard' },
    ],
  },
  {
    heading: 'Practice',
    items: [
      { to: '/dsa', label: 'DSA' },
      { to: '/visualise', label: 'Visualiser' },
      { to: '/questions', label: 'Interview Questions' },
      { to: '/recall', label: 'Active Recall' },
      { to: '/blitz', label: 'Blitz' },
      { to: '/mock-interview', label: 'Mock Interview' },
    ],
  },
  {
    heading: 'Review',
    items: [
      { to: '/revision', label: 'Revise Today' },
      { to: '/notes', label: 'Notes' },
      { to: '/bookmarks', label: 'Bookmarks' },
      { to: '/progress', label: 'Progress' },
    ],
  },
];

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand font-mono text-sm font-bold text-white">
        ⌘
      </div>
      <div className="leading-tight">
        <p className="font-display text-[15px] font-semibold tracking-[-0.01em] text-content">DevPrep</p>
        <p className="text-[10px] uppercase tracking-wider text-content-subtle">Interview IDE</p>
      </div>
    </div>
  );
}

export function AppLayout() {
  const { user, logout, clearSession } = useAuth();
  const { theme, toggleTheme, lang, setLang } = usePreferences();
  const location = useLocation();
  const navigate = useNavigate();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [scratchOpen, setScratchOpen] = useState(false);

  useSmoothScroll();

  // Lightweight: the topbar only needs the headline numbers.
  const { data: dashboard, reload } = useApi(() => endpoints.progress.dashboard(), []);

  // The Learn section is derived, not listed. Seed a new category and it
  // appears here without anyone remembering to edit this file.
  const { data: categoryData } = useApi(() => endpoints.topics.categories(), []);
  const learnGroup: NavGroup = {
    heading: 'Learn',
    items: (categoryData?.categories ?? []).map((c) => ({
      to: `/topics/${c.slug}`,
      label: c.name,
    })),
  };

  // Refresh the streak/progress chips whenever the route changes, so solving a
  // problem is reflected as soon as the user navigates away from it.
  useEffect(() => {
    reload();
    setSidebarOpen(false);
    // A smooth-scrolled page keeps its offset across navigation, so a new page
    // would open halfway down without this.
    scrollToTop();
  }, [location.pathname, reload]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
      // Ctrl+J for the scratchpad — near Ctrl+K, and not taken by the browser.
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setScratchOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Mobile scrim */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          role="presentation"
        />
      )}

      <aside
        className={cx(
          'fixed inset-y-0 left-0 z-40 flex w-60 shrink-0 flex-col border-r border-line bg-surface-raised',
          'transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-14 shrink-0 items-center border-b border-line px-4">
          <Logo />
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4" data-lenis-prevent>
          {[NAV[0]!, NAV[1]!, learnGroup, NAV[2]!]
            .filter((group) => group.items.length > 0)
            .map((group) => (
            <div key={group.heading} className="mb-5">
              <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-wider text-content-subtle">
                {group.heading}
              </p>
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cx(
                      'mb-0.5 flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] transition-colors',
                      isActive
                        ? 'bg-brand/10 font-medium text-brand'
                        : 'text-content-muted hover:bg-surface-sunken hover:text-content',
                    )
                  }
                >
                  {item.label}
                  {item.to === '/revision' && (dashboard?.revisionDue ?? 0) > 0 && (
                    <span className="ml-auto inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-hard/15 px-1 text-[10px] font-semibold text-hard">
                      {dashboard?.revisionDue}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="shrink-0 border-t border-line p-3">
          <div className="mb-2 flex items-center justify-between text-[11px] text-content-subtle">
            <span>Overall preparation</span>
            <span className="font-mono font-semibold text-content">{dashboard?.overall ?? 0}%</span>
          </div>
          <ProgressBar percent={dashboard?.overall ?? 0} />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-line bg-surface/85 px-4 backdrop-blur">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-1.5 text-content-muted hover:bg-surface-raised lg:hidden"
            aria-label="Open navigation"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
          </button>

          {/* Back — the app is deep (topic → problem → visualiser) and browsers
              hide their own back button in installed/PWA contexts. */}
          <button
            onClick={() => navigate(-1)}
            className="rounded-lg p-1.5 text-content-muted transition-colors hover:bg-surface-raised hover:text-content"
            aria-label="Go back"
            title="Back"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            onClick={() => setPaletteOpen(true)}
            className="flex h-9 flex-1 items-center gap-2 rounded-lg border border-line bg-surface-raised px-3 text-left text-[13px] text-content-subtle transition-colors hover:border-content-subtle sm:max-w-sm"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
            <span className="flex-1 truncate">Search everything</span>
            <span className="kbd hidden sm:inline-flex">Ctrl K</span>
          </button>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden sm:block">
              <StreakFlame days={dashboard?.streak ?? 0} />
            </div>

            <div
              className="hidden items-center gap-1.5 rounded-lg bg-surface-raised px-2.5 py-1.5 md:flex"
              title="DSA problems solved"
            >
              <span className="text-[11px] text-content-subtle">Solved</span>
              <span className="font-mono text-[13px] font-semibold tabular-nums text-content">
                {dashboard?.dsa.solved ?? 0}/{dashboard?.dsa.total ?? 0}
              </span>
            </div>

            {/* Language toggle — every seeded explanation exists in both. */}
            <div className="flex overflow-hidden rounded-lg border border-line" role="group" aria-label="Explanation language">
              {(['en', 'hi'] as const).map((code) => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  className={cx(
                    'px-2 py-1.5 text-[11px] font-semibold transition-colors',
                    lang === code ? 'bg-brand text-white' : 'text-content-muted hover:bg-surface-raised',
                  )}
                  title={code === 'en' ? 'English' : 'Hinglish — Hindi in Roman script'}
                >
                  {code === 'en' ? 'EN' : 'HI'}
                </button>
              ))}
            </div>

            <button
              onClick={() => setScratchOpen((o) => !o)}
              className={cx(
                'rounded-lg p-2 transition-colors hover:bg-surface-raised',
                scratchOpen ? 'text-brand' : 'text-content-muted hover:text-content',
              )}
              aria-label="Toggle scratchpad"
              title="Scratchpad — Ctrl+J"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m8 9 3 3-3 3M13 15h3" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="3" y="4" width="18" height="16" rx="2" />
              </svg>
            </button>

            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-content-muted transition-colors hover:bg-surface-raised hover:text-content"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" strokeLinejoin="round" />
                </svg>
              )}
            </button>

            <div className="group relative">
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-semibold text-white"
                style={{ backgroundColor: user?.avatarColor ?? '#6366f1' }}
                aria-label="Account"
              >
                {user?.name?.[0]?.toUpperCase() ?? '?'}
              </button>
              <div className="invisible absolute right-0 top-full z-30 mt-1 w-52 rounded-xl border border-line bg-surface-raised p-1 opacity-0 shadow-xl transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <div className="border-b border-line px-3 py-2">
                  <p className="truncate text-sm font-medium text-content">{user?.name}</p>
                  <p className="truncate text-xs text-content-subtle">{user?.email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-1 w-full justify-start"
                  onClick={() => void logout()}
                >
                  Sign out
                </Button>
                <button
                  onClick={() => setAccountOpen(true)}
                  className="mt-0.5 w-full rounded-lg px-3 py-1.5 text-left text-[13px] text-content-muted transition-colors hover:bg-surface-sunken hover:text-content"
                >
                  Account settings
                </button>
                <button
                  onClick={() => setDeleteOpen(true)}
                  className="mt-0.5 w-full rounded-lg px-3 py-1.5 text-left text-[13px] text-content-subtle transition-colors hover:bg-hard/10 hover:text-hard"
                >
                  Delete account
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />

      <Scratchpad open={scratchOpen} onClose={() => setScratchOpen(false)} />

      <AccountDialog open={accountOpen} onClose={() => setAccountOpen(false)} />

      <DeleteAccountDialog
        email={user?.email ?? ''}
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onDeleted={() => {
          setDeleteOpen(false);
          clearSession();
        }}
      />
    </div>
  );
}
