import { Link, useParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { usePreferences } from '../hooks/usePreferences';
import { endpoints } from '../services/endpoints';
import {
  DifficultyBadge,
  EmptyState,
  ErrorState,
  ProgressBar,
  StatusPill,
  Tag,
} from '../components/ui';
import { SkeletonCards } from '../components/ui/Skeleton';
import { Stagger } from '../components/motion';

export function TopicListPage() {
  const { categorySlug = '' } = useParams();
  const { t } = usePreferences();
  const { data, loading, error, reload } = useApi(
    () => endpoints.topics.byCategory(categorySlug),
    [categorySlug],
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <SkeletonCards count={6} />
      </div>
    );
  }
  if (error) return <div className="p-6"><ErrorState message={error} onRetry={reload} /></div>;
  if (!data) return null;

  const known = data.topics.filter((topic) => topic.status === 'KNOWN').length;
  const percent = data.topics.length ? Math.round((known / data.topics.length) * 100) : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <div className="mb-6">
        <h1 className="font-display text-[22px] font-semibold tracking-[-0.01em] text-content">{data.category.name}</h1>
        <p className="mt-1 text-sm text-content-muted">{data.category.description}</p>
        <div className="mt-4 flex items-center gap-3">
          <ProgressBar percent={percent} className="max-w-xs" tone={percent >= 70 ? 'easy' : 'brand'} />
          <span className="font-mono text-xs tabular-nums text-content-muted">
            {known}/{data.topics.length} known
          </span>
        </div>
      </div>

      {data.topics.length === 0 ? (
        <EmptyState
          title="No topics in this category yet"
          description="Run the seed script, or add topics to the seed-data files and re-run it."
        />
      ) : (
        <Stagger className="space-y-2">
          {data.topics.map((topic) => (
            <Link
              key={topic.id}
              to={`/topic/${topic.slug}`}
              className="card animate-fade-up block p-4 transition-colors hover:border-content-subtle"
            >
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <h2 className="text-[15px] font-medium text-content">{topic.title}</h2>
                <DifficultyBadge level={topic.difficulty} />
                <StatusPill status={topic.status} />
              </div>
              <p className="text-[13px] leading-6 text-content-muted">
                {t(topic.summary, topic.summaryHi)}
              </p>
              {topic.tags.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {topic.tags.slice(0, 5).map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </Stagger>
      )}
    </div>
  );
}
