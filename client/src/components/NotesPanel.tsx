import { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { endpoints } from '../services/endpoints';
import { Button, EmptyState, ErrorState, Input, LoadingState, Textarea } from './ui';
import type { Note } from '../types';

interface NotesPanelProps {
  topicId?: string;
  problemId?: string;
  /** Used to prefill a sensible note title. */
  title: string;
}

/** Inline note editor reused by both the topic page and the DSA problem page. */
export function NotesPanel({ topicId, problemId, title }: NotesPanelProps) {
  const { data, loading, error, reload } = useApi(
    () => endpoints.notes.list({ ...(topicId ? { topicId } : {}), ...(problemId ? { problemId } : {}) }),
    [topicId, problemId],
  );

  const [draft, setDraft] = useState('');
  const [noteTitle, setNoteTitle] = useState(`Notes — ${title}`);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState('');
  const [saveError, setSaveError] = useState<string | null>(null);

  const create = async () => {
    if (!draft.trim()) return;
    setSaving(true);
    setSaveError(null);
    try {
      await endpoints.notes.create({
        title: noteTitle.trim() || `Notes — ${title}`,
        content: draft.trim(),
        ...(topicId ? { topicId } : {}),
        ...(problemId ? { problemId } : {}),
      });
      setDraft('');
      reload();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Could not save the note');
    } finally {
      setSaving(false);
    }
  };

  const saveEdit = async (note: Note) => {
    setSaving(true);
    try {
      await endpoints.notes.update(note.id, { content: editDraft });
      setEditing(null);
      reload();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Could not update the note');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    await endpoints.notes.remove(id);
    reload();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Input
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
          placeholder="Note title"
          className="h-9 text-[13px]"
          aria-label="Note title"
        />
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={4}
          placeholder="What do you want to remember about this? e.g. 'Closure = function + lexical environment.'"
          className="text-[13px]"
        />
        {saveError && <p className="text-xs text-hard">{saveError}</p>}
        <Button size="sm" variant="primary" onClick={() => void create()} loading={saving} disabled={!draft.trim()}>
          Save note
        </Button>
      </div>

      <div className="border-t border-line pt-4">
        {loading ? (
          <LoadingState label="Loading notes" />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : !data || data.notes.length === 0 ? (
          <EmptyState title="No notes yet" description="Your notes for this item will show up here." />
        ) : (
          <div className="space-y-2">
            {data.notes.map((note) => (
              <div key={note.id} className="rounded-lg border border-line bg-surface-sunken p-3">
                <div className="mb-1.5 flex items-start justify-between gap-2">
                  <p className="text-[13px] font-medium text-content">{note.title}</p>
                  <div className="flex shrink-0 gap-1">
                    <button
                      onClick={() => {
                        setEditing(note.id);
                        setEditDraft(note.content);
                      }}
                      className="text-[11px] text-content-subtle hover:text-content"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => void remove(note.id)}
                      className="text-[11px] text-content-subtle hover:text-hard"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {editing === note.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editDraft}
                      onChange={(e) => setEditDraft(e.target.value)}
                      rows={4}
                      className="text-[13px]"
                    />
                    <div className="flex gap-1.5">
                      <Button size="sm" variant="primary" onClick={() => void saveEdit(note)} loading={saving}>
                        Save
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditing(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap text-[13px] leading-6 text-content-muted">{note.content}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
