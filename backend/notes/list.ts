import { api } from "encore.dev/api";
import db from "../db";
import type { Note } from "./create";

export interface ListNotesResponse {
  notes: Note[];
}

// Retrieves all notes, ordered by last updated (latest first).
export const list = api<void, ListNotesResponse>(
  { expose: true, method: "GET", path: "/notes" },
  async () => {
    const rows = await db.queryAll<{
      id: number;
      title: string;
      content: string;
      created_at: Date;
      updated_at: Date;
    }>`
      SELECT id, title, content, created_at, updated_at
      FROM notes
      ORDER BY updated_at DESC
    `;

    const notes = rows.map(row => ({
      id: row.id,
      title: row.title,
      content: row.content,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return { notes };
  }
);
