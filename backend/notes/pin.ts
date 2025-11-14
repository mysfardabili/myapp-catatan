import { api, APIError } from "encore.dev/api";
import db from "../db";
import type { Note } from "./create";

export interface PinNoteRequest {
  id: number;
  pinned: boolean;
}

export const pin = api<PinNoteRequest, Note>(
  { expose: true, method: "PUT", path: "/notes/:id/pin" },
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
      UPDATE notes
      SET is_pinned = ${req.pinned},
          updated_at = NOW()
      WHERE id = ${req.id}
      RETURNING id, title, content, tags, is_pinned, is_archived, created_at, updated_at
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
