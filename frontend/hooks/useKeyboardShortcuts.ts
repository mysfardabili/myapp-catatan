import { useEffect } from "react";

interface KeyboardShortcutHandlers {
  onNew?: () => void;
  onSave?: () => void;
  onSearch?: () => void;
}

export function useKeyboardShortcuts(handlers: KeyboardShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "n") {
        e.preventDefault();
        handlers.onNew?.();
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handlers.onSave?.();
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        handlers.onSearch?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlers]);
}
