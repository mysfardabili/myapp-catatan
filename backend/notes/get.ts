import { api, APIError } from "encore.dev/api";
import db from "../db";
import type { Note } from "./create";

export interface GetNoteRequest {
  id: number;
}

// Retrieves a single note by ID.
export const get = api<GetNoteRequest, Note>(
  { expose: true, method: "GET", path: "/notes/:id" },
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
      SELECT id, title, content, tags, is_pinned, is_archived, created_at, updated_at
      FROM notes
      WHERE id = ${req.id}
    `;

    if (!row) {
      throw APIError.notFound("note not found");
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
