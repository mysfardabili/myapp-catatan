import { api } from "encore.dev/api";
import db from "../db";
import type { Note } from "./create";

export interface ListNotesRequest {
  search?: string;
  tags?: string[];
  archived?: boolean;
}

export interface ListNotesResponse {
  notes: Note[];
}

export const list = api<ListNotesRequest, ListNotesResponse>(
  { expose: true, method: "GET", path: "/notes" },
  async (req) => {
    const archived = req.archived ?? false;
    
    let rows;
    
    if (req.search && req.tags && req.tags.length > 0) {
      const searchPattern = `%${req.search}%`;
      rows = await db.queryAll<{
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
        WHERE is_archived = ${archived}
          AND (title ILIKE ${searchPattern} OR content ILIKE ${searchPattern})
          AND tags && ${req.tags}
        ORDER BY is_pinned DESC, updated_at DESC
      `;
    } else if (req.search) {
      const searchPattern = `%${req.search}%`;
      rows = await db.queryAll<{
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
        WHERE is_archived = ${archived}
          AND (title ILIKE ${searchPattern} OR content ILIKE ${searchPattern})
        ORDER BY is_pinned DESC, updated_at DESC
      `;
    } else if (req.tags && req.tags.length > 0) {
      rows = await db.queryAll<{
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
        WHERE is_archived = ${archived}
          AND tags && ${req.tags}
        ORDER BY is_pinned DESC, updated_at DESC
      `;
    } else {
      rows = await db.queryAll<{
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
        WHERE is_archived = ${archived}
        ORDER BY is_pinned DESC, updated_at DESC
      `;
    }

    const notes = rows.map(row => ({
      id: row.id,
      title: row.title,
      content: row.content,
      tags: row.tags,
      isPinned: row.is_pinned,
      isArchived: row.is_archived,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return { notes };
  }
);
