
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

const useKeyboardNavigation = ({
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
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        // Fix: Cast the new index to number
        const nextIndex = Math.min(
          highlightedIndex === -1 ? 0 : highlightedIndex + 1,
          options.length - 1
        );
        setHighlightedIndex(nextIndex);
        ensureHighlightedItemVisible(nextIndex);
        break;
      case "ArrowUp":
        e.preventDefault();
        // Fix: Cast the new index to number
        const prevIndex = Math.max(highlightedIndex - 1, -1);
        setHighlightedIndex(prevIndex);
        if (prevIndex >= 0) {
          ensureHighlightedItemVisible(prevIndex);
        }
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          // For non-exclude dropdown with worldwide option
          if (!isExcludeDropdown && highlightedIndex === 0) {
            onWorldwideSelect();
          } else {
            onCountrySelect(highlightedIndex);
          }
        }
        break;
      case "Escape":
        e.preventDefault();
        clearSearch();
        break;
      default:
        break;
    }
  }, [
    highlightedIndex,
    options.length,
    setHighlightedIndex,
    ensureHighlightedItemVisible,
    isExcludeDropdown,
    onWorldwideSelect,
    onCountrySelect,
    clearSearch
  ]);

  return { handleKeyDown };
};

export default useKeyboardNavigation;
