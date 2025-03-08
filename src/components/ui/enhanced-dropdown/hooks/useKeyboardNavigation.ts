
import { RefObject } from "react";
import { DropdownOption } from "../types";

interface UseKeyboardNavigationProps {
  isOpen: boolean;
  filteredOptions: DropdownOption[];
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;
  setIsOpen: (isOpen: boolean) => void;
  handleSelect: (id: string) => void;
  setSearchTerm: (term: string) => void;
  listRef: RefObject<HTMLDivElement>;
}

export const useKeyboardNavigation = ({
  isOpen,
  filteredOptions,
  highlightedIndex,
  setHighlightedIndex,
  setIsOpen,
  handleSelect,
  setSearchTerm,
  listRef
}: UseKeyboardNavigationProps) => {
  const ensureHighlightedVisible = () => {
    setTimeout(() => {
      if (highlightedIndex >= 0 && listRef.current) {
        const listItems = listRef.current.querySelectorAll('[role="option"]');
        if (listItems.length > highlightedIndex) {
          listItems[highlightedIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
          });
        }
      }
    }, 10);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex(
          highlightedIndex < filteredOptions.length - 1 ? highlightedIndex + 1 : 0
        );
        ensureHighlightedVisible();
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex(
          highlightedIndex > 0 ? highlightedIndex - 1 : filteredOptions.length - 1
        );
        ensureHighlightedVisible();
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          handleSelect(filteredOptions[highlightedIndex].id);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setSearchTerm("");
        break;
    }
  };

  return {
    handleKeyDown
  };
};
