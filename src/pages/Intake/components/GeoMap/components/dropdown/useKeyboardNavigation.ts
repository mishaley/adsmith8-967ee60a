
import { useCallback } from "react";

interface UseKeyboardNavigationProps {
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;
  ensureHighlightedItemVisible: (index: number) => void;
  options: string[];
  isExcludeDropdown: boolean;
  onWorldwideSelect: () => void;
  onCountrySelect: (index: number) => void;
  clearSearch: () => void;
}

export const useKeyboardNavigation = ({
  highlightedIndex,
  setHighlightedIndex,
  ensureHighlightedItemVisible,
  options,
  isExcludeDropdown,
  onWorldwideSelect,
  onCountrySelect,
  clearSearch
}: UseKeyboardNavigationProps) => {
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (options.length === 0) return;
    
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex(prevIndex => {
          const nextIndex = prevIndex < options.length - 1 ? prevIndex + 1 : 0;
          ensureHighlightedItemVisible(nextIndex);
          return nextIndex;
        });
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex(prevIndex => {
          const nextIndex = prevIndex > 0 ? prevIndex - 1 : options.length - 1;
          ensureHighlightedItemVisible(nextIndex);
          return nextIndex;
        });
        break;
      case "Enter":
        e.preventDefault();
        if (!isExcludeDropdown && highlightedIndex === 0) {
          // Select worldwide (only if not exclude dropdown)
          onWorldwideSelect();
        } else {
          onCountrySelect(highlightedIndex);
        }
        break;
      case "Escape":
        e.preventDefault();
        clearSearch();
        break;
    }
  }, [
    highlightedIndex,
    options.length,
    isExcludeDropdown,
    setHighlightedIndex,
    ensureHighlightedItemVisible,
    onWorldwideSelect,
    onCountrySelect,
    clearSearch
  ]);

  return { handleKeyDown };
};

export default useKeyboardNavigation;
