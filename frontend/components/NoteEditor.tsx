import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import backend from "~backend/client";
import type { Note } from "~backend/notes/create";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { TagInput } from "./TagInput";
import { MarkdownEditor } from "./MarkdownEditor";
import { Save, X } from "lucide-react";

interface NoteEditorProps {
  note: Note | null;
  onSave: () => void;
  onCancel: () => void;
}

export function NoteEditor({ note, onSave, onCancel }: NoteEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags || []);
    } else {
      setTitle("");
      setContent("");
      setTags([]);
    }
  }, [note]);

  const createMutation = useMutation({
    mutationFn: async () => {
      await backend.notes.create({ title, content, tags });
    },
    onSuccess: () => {
      toast({
        title: "Note created",
        description: "Your note has been created successfully.",
      });
      onSave();
    },
    onError: (error) => {
      console.error("Failed to create note:", error);
      toast({
        title: "Error",
        description: "Failed to create note. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!note) return;
      await backend.notes.update({ id: note.id, title, content, tags });
    },
    onSuccess: () => {
      toast({
        title: "Note updated",
        description: "Your note has been updated successfully.",
      });
      onSave();
    },
    onError: (error) => {
      console.error("Failed to update note:", error);
      toast({
        title: "Error",
        description: "Failed to update note. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and content are required.",
        variant: "destructive",
      });
      return;
    }

    if (note) {
      updateMutation.mutate();
    } else {
      createMutation.mutate();
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{note ? "Edit Note" : "New Note"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-semibold"
          />
        </div>
        <div className="space-y-2">
          <MarkdownEditor value={content} onChange={setContent} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Tags</label>
          <TagInput tags={tags} onChange={setTags} />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={isSaving} className="flex-1">
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save Note"}
          </Button>
          <Button variant="outline" onClick={onCancel} disabled={isSaving}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
