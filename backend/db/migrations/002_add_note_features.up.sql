ALTER TABLE notes
ADD COLUMN is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN is_archived BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN tags TEXT[] NOT NULL DEFAULT '{}';

CREATE INDEX idx_notes_pinned ON notes(is_pinned DESC, updated_at DESC);
CREATE INDEX idx_notes_archived ON notes(is_archived);
CREATE INDEX idx_notes_tags ON notes USING GIN(tags);
