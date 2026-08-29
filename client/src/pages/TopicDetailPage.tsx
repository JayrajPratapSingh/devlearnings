import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { usePreferences } from '../hooks/usePreferences';
import { endpoints } from '../services/endpoints';
import { Markdown, CodeBlock } from '../components/Markdown';
import { NotesPanel } from '../components/NotesPanel';
import {
  Button,
  DifficultyBadge,
  ErrorState,
  LoadingState,
  SectionHeading,
  StatusPill,
  Tag,
  cx,
} from '../components/ui';
import type { LearningStatus } from '../types';

const STATUS_ACTIONS: { status: LearningStatus; label: string; variant: 'success' | 'secondary' | 'danger' }[] = [
  { status: 'KNOWN', label: 'I know this', variant: 'success' },
  { status: 'LEARNING', label: 'Still learning', variant: 'secondary' },
  { status: 'NEEDS_REVISION', label: 'Needs revision', variant: 'danger' },
];

export function TopicDetailPage() {
  const { slug = '' } = useParams();
  const { t, lang } = usePreferences();
  const { data, loading, error, reload } = useApi(() => endpoints.topics.detail(slug), [slug]);

  const [status, setStatus] = useState<LearningStatus>('NEW');
  const [saving, setSaving] = useState<LearningStatus | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [tab, setTab] = useState<'learn' | 'questions' | 'notes'>('learn');
  // Beginners land on the simple version; one click reveals the interview depth,
  // and a third gives the memory hooks — understanding and recall are separate
  // jobs, so they get separate views rather than one long page.
  const [depth, setDepth] = useState<'simple' | 'tricks' | 'deep'>('simple');

  useEffect(() => {
    if (data) setStatus(data.topic.status);
  }, [data]);

  const topic = data?.topic;

  const setLearningStatus = async (next: LearningStatus) => {
    if (!topic) return;
    setSaving(next);
    try {
      await endpoints.topics.setStatus(topic.slug, next, next === 'KNOWN' ? 5 : next === 'LEARNING' ? 3 : 1);
      setStatus(next);
    } finally {
      setSaving(null);
    }
  };

  const toggleBookmark = async () => {
    if (!topic) return;
    const res = await endpoints.bookmarks.toggle({
      kind: 'TOPIC',
      refId: topic.id,
      label: topic.title,
      href: `/topic/${topic.slug}`,
    });
    setBookmarked(res.bookmarked);
  };

  if (loading) return <LoadingState label="Loading topic" />;
  if (error) return <div className="p-6"><ErrorState message={error} onRetry={reload} /></div>;
  if (!topic) return null;

  // Hinglish is optional per field; tell the user when they are seeing the fallback.
  const hinglishMissing = lang === 'hi' && !topic.contentHi;
  const hasSimple = Boolean(topic.simple);
  const hasTricks = Boolean(topic.tricks);
  // Falling back to the deep version is better than showing an empty tab.
  const showSimple = depth === 'simple' && hasSimple;
  const showTricks = depth === 'tricks' && hasTricks;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <Link
        to={`/topics/${topic.category.slug}`}
        className="mb-4 inline-flex items-center gap-1.5 text-[13px] text-content-muted transition-colors hover:text-content"
      >
        ← {topic.category.name}
      </Link>

      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-[22px] font-semibold tracking-[-0.01em] text-content">{topic.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <DifficultyBadge level={topic.difficulty} />
            <StatusPill status={status} />
            {topic.tags.slice(0, 4).map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        </div>
        <button
          onClick={() => void toggleBookmark()}
          className={cx(
            'shrink-0 rounded-lg p-2 transition-colors',
            bookmarked ? 'text-medium' : 'text-content-subtle hover:text-content',
          )}
          aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this topic'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M6 4h12v16l-6-4-6 4V4Z" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="mb-5 flex gap-1 border-b border-line">
        {([
          ['learn', 'Explanation'],
          ['questions', 'Interview practice'],
          ['notes', 'My notes'],
        ] as const).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cx(
              '-mb-px border-b-2 px-3 py-2 text-[13px] transition-colors',
              tab === id
                ? 'border-brand font-medium text-content'
                : 'border-transparent text-content-muted hover:text-content',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'learn' && (
        <div className="space-y-6">
          {hinglishMissing && (
            <p className="rounded-lg border border-line bg-surface-sunken px-3 py-2 text-xs text-content-subtle">
              Hinglish version not written for this topic yet — showing English.
            </p>
          )}

          <p className="text-[15px] leading-7 text-content">{t(topic.summary, topic.summaryHi)}</p>

          {(hasSimple || hasTricks) && (
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex overflow-hidden rounded-lg border border-line">
                {([
                  ['simple', 'Simple', 'Bilkul basic — analogy ke saath'],
                  ['tricks', '🧠 Tricks', 'Yaad rakhne ke tareeke — mnemonics aur hooks'],
                  ['deep', 'Interview', 'Poori depth, jaisa interview mein chahiye'],
                ] as const)
                  .filter(([id]) => (id === 'tricks' ? hasTricks : id === 'simple' ? hasSimple : true))
                  .map(([id, label, title]) => (
                  <button
                    key={id}
                    onClick={() => setDepth(id)}
                    title={title}
                    className={cx(
                      'px-3 py-1.5 text-[12px] font-medium transition-colors',
                      depth === id
                        ? 'bg-brand text-white'
                        : 'text-content-muted hover:bg-surface-sunken hover:text-content',
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-content-subtle">
                {showSimple
                  ? 'Pehle ye samjho. Phir Interview par switch karo.'
                  : showTricks
                    ? 'Samajh aa gaya? Ab ise yaad rakhne ka tareeka.'
                    : 'Interview-level depth.'}
              </span>
            </div>
          )}

          <Markdown
            content={
              showSimple
                ? t(topic.simple ?? topic.content, topic.simpleHi)
                : showTricks
                  ? t(topic.tricks ?? topic.content, topic.tricksHi)
                  : t(topic.content, topic.contentHi)
            }
          />

          {topic.codeExample && (
            <div className="space-y-3">
              <SectionHeading title="Example" />
              <CodeBlock code={topic.codeExample} label="Code" />
              {topic.expectedOutput && <CodeBlock code={topic.expectedOutput} label="Output" />}
            </div>
          )}

          {topic.commonMistakes.length > 0 && (
            <div>
              <SectionHeading title="Common mistakes" />
              <ul className="space-y-2">
                {topic.commonMistakes.map((mistake, i) => (
                  <li key={i} className="flex gap-2.5 text-[13px] leading-6 text-content-muted">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-hard" />
                    {mistake}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {topic.relatedProblemSlugs.length > 0 && (
            <div>
              <SectionHeading title="Related DSA problems" />
              <div className="flex flex-wrap gap-2">
                {topic.relatedProblemSlugs.map((problemSlug) => (
                  <Link
                    key={problemSlug}
                    to={`/dsa/${problemSlug}`}
                    className="rounded-lg border border-line bg-surface-raised px-3 py-1.5 text-[13px] text-content-muted transition-colors hover:border-brand hover:text-brand"
                  >
                    {problemSlug.replace(/-/g, ' ')}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Self-assessment drives the spaced-revision queue. */}
          <div className="card p-4">
            <p className="mb-3 text-[13px] font-medium text-content">How well do you know this?</p>
            <div className="flex flex-wrap gap-2">
              {STATUS_ACTIONS.map((action) => (
                <Button
                  key={action.status}
                  size="sm"
                  variant={status === action.status ? 'primary' : action.variant}
                  loading={saving === action.status}
                  onClick={() => void setLearningStatus(action.status)}
                >
                  {action.label}
                </Button>
              ))}
            </div>
            <p className="mt-2.5 text-xs text-content-subtle">
              Marking something as needing revision schedules it in Revise Today.
            </p>
          </div>
        </div>
      )}

      {tab === 'questions' && (
        <div className="space-y-6">
          {topic.interviewQuestions.length > 0 && (
            <div>
              <SectionHeading title="Interview questions" />
              <ol className="space-y-2">
                {topic.interviewQuestions.map((question, i) => (
                  <li key={i} className="card flex gap-3 p-3 text-[13px] leading-6 text-content-muted">
                    <span className="font-mono text-xs text-content-subtle">{i + 1}</span>
                    {question}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {topic.practiceQuestions.length > 0 && (
            <div>
              <SectionHeading title="Practice tasks" />
              <ul className="space-y-2">
                {topic.practiceQuestions.map((question, i) => (
                  <li key={i} className="card flex gap-3 p-3 text-[13px] leading-6 text-content-muted">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                    {question}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {topic.interviewQuestions.length === 0 && topic.practiceQuestions.length === 0 && (
            <p className="text-sm text-content-muted">No practice material for this topic yet.</p>
          )}
        </div>
      )}

      {tab === 'notes' && <NotesPanel topicId={topic.id} title={topic.title} />}
    </div>
  );
}
