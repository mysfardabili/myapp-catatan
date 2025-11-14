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
      created_at: Date;
      updated_at: Date;
    }>`
      SELECT id, title, content, created_at, updated_at
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
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
);
