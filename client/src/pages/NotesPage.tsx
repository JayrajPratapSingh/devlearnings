import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi, useDebounced } from '../hooks/useApi';
import { endpoints } from '../services/endpoints';
import {
  Button,
  EmptyState,
  ErrorState,
  Input,
  Textarea,
} from '../components/ui';
import { SkeletonCards } from '../components/ui/Skeleton';
import { Stagger } from '../components/motion';

export function NotesPage() {
  const [search, setSearch] = useState('');
  const debounced = useDebounced(search, 250);
  const { data, loading, error, reload } = useApi(
    () => endpoints.notes.list(debounced ? { search: debounced } : {}),
    [debounced],
  );

  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState({ title: '', content: '' });

  const create = async () => {
    if (!title.trim() || !content.trim()) {
      setFormError('Both a title and some content are required');
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      await endpoints.notes.create({ title: title.trim(), content: content.trim() });
      setTitle('');
      setContent('');
      setCreating(false);
      reload();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not save the note');
    } finally {
      setSaving(false);
    }
  };

  const saveEdit = async (id: string) => {
    setSaving(true);
    try {
      await endpoints.notes.update(id, editDraft);
      setEditing(null);
      reload();
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    await endpoints.notes.remove(id);
    reload();
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[22px] font-semibold tracking-[-0.01em] text-content">Notes</h1>
          <p className="mt-1 text-sm text-content-muted">
            Everything you have written, across topics and problems.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setCreating((c) => !c)}>
          {creating ? 'Cancel' : 'New note'}
        </Button>
      </div>

      {creating && (
        <div className="card animate-fade-up mb-4 space-y-3 p-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            aria-label="Note title"
          />
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            placeholder="Write it in your own words — that is what makes it stick."
          />
          {formError && <p className="text-xs text-hard">{formError}</p>}
          <Button variant="primary" size="sm" onClick={() => void create()} loading={saving}>
            Save note
          </Button>
        </div>
      )}

      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search notes…"
        className="mb-4 h-9 max-w-xs text-[13px]"
        aria-label="Search notes"
      />

      {loading ? (
        <SkeletonCards count={4} />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : !data || data.notes.length === 0 ? (
        <EmptyState
          title={debounced ? 'No notes match that search' : 'No notes yet'}
          description={
            debounced
              ? 'Try a different word.'
              : 'Add a note from any topic or DSA problem, or create a standalone one here.'
          }
        />
      ) : (
        <Stagger className="space-y-2">
          {data.notes.map((note) => (
            <div key={note.id} className="card animate-fade-up p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[15px] font-medium text-content">{note.title}</p>
                  <p className="mt-0.5 text-[11px] text-content-subtle">
                    {new Date(note.updatedAt).toLocaleDateString()}
                    {note.topic && (
                      <>
                        {' · '}
                        <Link to={`/topic/${note.topic.slug}`} className="hover:text-brand">
                          {note.topic.title}
                        </Link>
                      </>
                    )}
                    {note.problem && (
                      <>
                        {' · '}
                        <Link to={`/dsa/${note.problem.slug}`} className="hover:text-brand">
                          {note.problem.title}
                        </Link>
                      </>
                    )}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => {
                      setEditing(note.id);
                      setEditDraft({ title: note.title, content: note.content });
                    }}
                    className="text-[12px] text-content-subtle hover:text-content"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => void remove(note.id)}
                    className="text-[12px] text-content-subtle hover:text-hard"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {editing === note.id ? (
                <div className="space-y-2">
                  <Input
                    value={editDraft.title}
                    onChange={(e) => setEditDraft((d) => ({ ...d, title: e.target.value }))}
                    aria-label="Edit title"
                  />
                  <Textarea
                    value={editDraft.content}
                    onChange={(e) => setEditDraft((d) => ({ ...d, content: e.target.value }))}
                    rows={5}
                  />
                  <div className="flex gap-1.5">
                    <Button size="sm" variant="primary" onClick={() => void saveEdit(note.id)} loading={saving}>
                      Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditing(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="whitespace-pre-wrap text-[13px] leading-7 text-content-muted">{note.content}</p>
              )}
            </div>
          ))}
        </Stagger>
      )}
    </div>
  );
}
