import { api } from "encore.dev/api";
import db from "../db";

export interface CreateNoteRequest {
  title: string;
  content: string;
  tags?: string[];
}

export interface Note {
  id: number;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Creates a new note.
export const create = api<CreateNoteRequest, Note>(
  { expose: true, method: "POST", path: "/notes" },
  async (req) => {
    const row = await db.queryRow<{
      id: number;
      title: string;
      content: string;
      tags: string[];
      is_pinned: boolean;
      is_archived: boolean;
      created_at: Date;
      updated_at: Date;
    }>`
      INSERT INTO notes (title, content, tags)
      VALUES (${req.title}, ${req.content}, ${req.tags || []})
      RETURNING id, title, content, tags, is_pinned, is_archived, created_at, updated_at
    `;

    if (!row) {
      throw new Error("Failed to create note");
    }

    return {
      id: row.id,
      title: row.title,
      content: row.content,
      tags: row.tags,
      isPinned: row.is_pinned,
      isArchived: row.is_archived,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
);
