import { api, APIError } from "encore.dev/api";
import db from "../db";
import type { Note } from "./create";

export interface UpdateNoteRequest {
  id: number;
  title: string;
  content: string;
}

// Updates an existing note.
export const update = api<UpdateNoteRequest, Note>(
  { expose: true, method: "PUT", path: "/notes/:id" },
  async (req) => {
    const row = await db.queryRow<{
      id: number;
      title: string;
      content: string;
      created_at: Date;
      updated_at: Date;
    }>`
      UPDATE notes
      SET title = ${req.title},
          content = ${req.content},
          updated_at = NOW()
      WHERE id = ${req.id}
      RETURNING id, title, content, created_at, updated_at
    `;

    if (!row) {
      throw APIError.notFound("note not found");
    }

    return {
      id: row.id,
      title: row.title,
      content: row.content,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
);
