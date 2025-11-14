import type { Note } from "~backend/notes/create";

export function exportNoteToMarkdown(note: Note) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  let markdown = `# ${note.title}\n\n`;
  
  if (note.tags && note.tags.length > 0) {
    markdown += `**Tags:** ${note.tags.join(", ")}\n\n`;
  }
  
  markdown += `**Created:** ${formatDate(note.createdAt)}\n`;
  markdown += `**Updated:** ${formatDate(note.updatedAt)}\n\n`;
  markdown += `---\n\n`;
  markdown += note.content;

  const blob = new Blob([markdown], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${note.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportAllNotesToMarkdown(notes: Note[]) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  let markdown = `# My Notes\n\n`;
  markdown += `**Exported:** ${formatDate(new Date())}\n`;
  markdown += `**Total Notes:** ${notes.length}\n\n`;
  markdown += `---\n\n`;

  notes.forEach((note, index) => {
    markdown += `## ${index + 1}. ${note.title}\n\n`;
    
    if (note.tags && note.tags.length > 0) {
      markdown += `**Tags:** ${note.tags.join(", ")}\n\n`;
    }
    
    markdown += `**Created:** ${formatDate(note.createdAt)}\n`;
    markdown += `**Updated:** ${formatDate(note.updatedAt)}\n\n`;
    markdown += note.content;
    markdown += `\n\n---\n\n`;
  });

  const blob = new Blob([markdown], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `all_notes_${new Date().toISOString().split("T")[0]}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
