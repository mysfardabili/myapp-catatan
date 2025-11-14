import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  value: string;
  selectedTags?: string[];
  onTagsChange?: (tags: string[]) => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export function SearchBar({ onSearch, value, selectedTags = [], onTagsChange, inputRef }: SearchBarProps) {
  const [query, setQuery] = useState(value);

  const handleSearch = () => {
    onSearch(query);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (onTagsChange) {
      onTagsChange(selectedTags.filter(tag => tag !== tagToRemove));
    }
  };

  const handleClearAllTags = () => {
    if (onTagsChange) {
      onTagsChange([]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            placeholder="Search notes... (Ctrl+F)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-9"
          />
        </div>
        {query && (
          <Button variant="ghost" size="icon" onClick={handleClear}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {selectedTags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Filtering by:</span>
          {selectedTags.map((tag) => (
            <Button
              key={tag}
              variant="secondary"
              size="sm"
              onClick={() => handleRemoveTag(tag)}
              className="h-7 gap-1"
            >
              {tag}
              <X className="h-3 w-3" />
            </Button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAllTags}
            className="h-7 text-xs"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
