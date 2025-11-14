import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import backend from "~backend/client";
import type { Note } from "~backend/notes/create";
import { NoteList } from "./NoteList";
import { NoteEditor } from "./NoteEditor";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";

export function AppInner() {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const response = await backend.notes.list();
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
        description: "Your note has been deleted successfully.",
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

  const notes = data || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-foreground">My Notes</h1>
          <Button onClick={handleNewNote} size="lg">
            <Plus className="mr-2 h-5 w-5" />
            New Note
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
              All Notes ({notes.length})
            </h2>
            <NoteList
              notes={notes}
              isLoading={isLoading}
              selectedNoteId={selectedNote?.id}
              onNoteSelect={handleNoteSelect}
              onNoteDelete={handleDelete}
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
