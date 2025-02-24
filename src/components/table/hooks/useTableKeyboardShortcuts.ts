
import { useEffect, useCallback } from 'react';

interface KeyboardShortcutsParams {
  undo: () => void;
  redo: () => void;
}

export function useTableKeyboardShortcuts({ undo, redo }: KeyboardShortcutsParams) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'z' && !event.shiftKey) {
      event.preventDefault();
      undo();
    } else if (
      ((event.metaKey || event.ctrlKey) && event.key === 'y') ||
      ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key === 'z')
    ) {
      event.preventDefault();
      redo();
    }
  }, [undo, redo]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
