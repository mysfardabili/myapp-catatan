import type { Note } from "~backend/notes/create";
import { NoteCard } from "./NoteCard";

interface NoteListProps {
  notes: Note[];
  isLoading: boolean;
  selectedNoteId?: number;
  onNoteSelect: (note: Note) => void;
  onNoteDelete: (id: number) => void;
  onNotePin: (id: number, pinned: boolean) => void;
  onNoteArchive: (id: number, archived: boolean) => void;
}

export function NoteList({
  notes,
  isLoading,
  selectedNoteId,
  onNoteSelect,
  onNoteDelete,
  onNotePin,
  onNoteArchive,
}: NoteListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-lg bg-muted"
          />
        ))}
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">No notes yet</p>
        <p className="text-sm text-muted-foreground">
          Create your first note to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          isSelected={note.id === selectedNoteId}
          onSelect={() => onNoteSelect(note)}
          onDelete={() => onNoteDelete(note.id)}
          onPin={() => onNotePin(note.id, !note.isPinned)}
          onArchive={() => onNoteArchive(note.id, !note.isArchived)}
        />
      ))}
    </div>
  );
}
