import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useRef } from "react";
import backend from "~backend/client";
import type { Note } from "~backend/notes/create";
import { NoteList } from "./NoteList";
import { NoteEditor } from "./NoteEditor";
import { SearchBar } from "./SearchBar";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { exportAllNotesToMarkdown } from "../utils/exportNotes";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { Plus, Archive, Download } from "lucide-react";

export function AppInner() {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showArchived, setShowArchived] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const saveCallbackRef = useRef<(() => void) | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["notes", searchQuery, selectedTags, showArchived],
    queryFn: async () => {
      const response = await backend.notes.list({ 
        search: searchQuery || undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        archived: showArchived 
      });
      return response.notes;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await backend.notes.remove({ id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      if (selectedNote) {
        setSelectedNote(null);
      }
      toast({
        title: "Note deleted",
        description: "Your note has been deleted permanently.",
      });
    },
    onError: (error) => {
      console.error("Failed to delete note:", error);
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive",
      });
    },
  });

  const pinMutation = useMutation({
    mutationFn: async ({ id, pinned }: { id: number; pinned: boolean }) => {
      await backend.notes.pin({ id, pinned });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast({
        title: "Note updated",
        description: "Note pin status updated.",
      });
    },
    onError: (error) => {
      console.error("Failed to pin note:", error);
      toast({
        title: "Error",
        description: "Failed to update note. Please try again.",
        variant: "destructive",
      });
    },
  });

  const archiveMutation = useMutation({
    mutationFn: async ({ id, archived }: { id: number; archived: boolean }) => {
      await backend.notes.archive({ id, archived });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      if (selectedNote) {
        setSelectedNote(null);
      }
      toast({
        title: variables.archived ? "Note archived" : "Note unarchived",
        description: variables.archived 
          ? "Your note has been moved to archive."
          : "Your note has been restored.",
      });
    },
    onError: (error) => {
      console.error("Failed to archive note:", error);
      toast({
        title: "Error",
        description: "Failed to update note. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleNoteSelect = (note: Note) => {
    setSelectedNote(note);
    setIsCreating(false);
  };

  const handleNewNote = () => {
    setIsCreating(true);
    setSelectedNote(null);
  };

  const handleSaveComplete = () => {
    queryClient.invalidateQueries({ queryKey: ["notes"] });
    setIsCreating(false);
    setSelectedNote(null);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handlePin = (id: number, pinned: boolean) => {
    pinMutation.mutate({ id, pinned });
  };

  const handleArchive = (id: number, archived: boolean) => {
    archiveMutation.mutate({ id, archived });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleTagClick = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleTagsChange = (tags: string[]) => {
    setSelectedTags(tags);
  };

  const handleExportAll = () => {
    if (notes.length === 0) {
      toast({
        title: "No notes to export",
        description: "Create some notes first.",
        variant: "destructive",
      });
      return;
    }
    exportAllNotesToMarkdown(notes);
    toast({
      title: "Notes exported",
      description: `${notes.length} notes have been downloaded as a markdown file.`,
    });
  };

  useKeyboardShortcuts({
    onNew: handleNewNote,
    onSave: () => {
      if (saveCallbackRef.current) {
        saveCallbackRef.current();
      }
    },
    onSearch: () => {
      searchInputRef.current?.focus();
    },
  });

  const notes = data || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-foreground">My Notes</h1>
            <div className="flex gap-2">
              <ThemeToggle />
              <Button 
                variant="outline"
                onClick={handleExportAll}
                disabled={notes.length === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                Export All
              </Button>
              <Button 
                variant={showArchived ? "default" : "outline"}
                onClick={() => setShowArchived(!showArchived)}
              >
                <Archive className="mr-2 h-4 w-4" />
                {showArchived ? "Show Active" : "Show Archived"}
              </Button>
              <Button onClick={handleNewNote} size="lg">
                <Plus className="mr-2 h-5 w-5" />
                New Note
                <span className="ml-2 text-xs opacity-70">(Ctrl+N)</span>
              </Button>
            </div>
          </div>
          <SearchBar 
            onSearch={handleSearch} 
            value={searchQuery} 
            selectedTags={selectedTags}
            onTagsChange={handleTagsChange}
            inputRef={searchInputRef}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
              {showArchived ? "Archived Notes" : "Active Notes"} ({notes.length})
            </h2>
            <NoteList
              notes={notes}
              isLoading={isLoading}
              selectedNoteId={selectedNote?.id}
              onNoteSelect={handleNoteSelect}
              onNoteDelete={handleDelete}
              onNotePin={handlePin}
              onNoteArchive={handleArchive}
              onTagClick={handleTagClick}
            />
          </div>

          <div>
            {(isCreating || selectedNote) && (
              <NoteEditor
                note={selectedNote}
                onSave={handleSaveComplete}
                onCancel={() => {
                  setIsCreating(false);
                  setSelectedNote(null);
                }}
                setSaveCallback={(callback) => {
                  saveCallbackRef.current = callback;
                }}
              />
            )}
            {!isCreating && !selectedNote && (
              <div className="flex h-[400px] items-center justify-center rounded-lg border-2 border-dashed border-border">
                <div className="text-center">
                  <p className="text-lg text-muted-foreground">
                    Select a note to view or edit
                  </p>
                  <p className="text-sm text-muted-foreground">
                    or create a new one
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
