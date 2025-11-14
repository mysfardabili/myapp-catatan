import { api, APIError } from "encore.dev/api";
import db from "../db";

export interface DeleteNoteRequest {
  id: number;
}

export const remove = api<DeleteNoteRequest, void>(
  { expose: true, method: "DELETE", path: "/notes/:id" },
  async (req) => {
    const row = await db.queryRow<{ id: number }>`
      DELETE FROM notes
      WHERE id = ${req.id} AND is_archived = true
      RETURNING id
    `;

    if (!row) {
      throw APIError.notFound("note not found or not archived");
    }
  }
);
