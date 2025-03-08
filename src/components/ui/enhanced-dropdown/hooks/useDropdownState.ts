
import { useState, useEffect, RefObject } from "react";
import { DropdownOption } from "../types";

interface UseDropdownStateProps {
  options: DropdownOption[];
  selectedItems: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  multiSelect: boolean;
  contentRef: RefObject<HTMLDivElement>;
  triggerRef: RefObject<HTMLButtonElement>;
}

export const useDropdownState = ({
  options,
  selectedItems,
  onSelectionChange,
  multiSelect,
  contentRef,
  triggerRef
}: UseDropdownStateProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [contentPosition, setContentPosition] = useState({ top: 0, left: 0, width: 0 });
  
  // Filter options based on search term
  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (option.secondary && option.secondary.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Get selected option details for display
  const selectedOptionLabels = selectedItems
    .map(id => options.find(opt => opt.id === id))
    .filter(Boolean)
    .map(opt => opt as DropdownOption);
  
  // Update dropdown position when it opens
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setContentPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isOpen, triggerRef]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        contentRef.current &&
        !contentRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, contentRef, triggerRef]);

  const toggleDropdown = (disabled: boolean) => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (isOpen) {
        setSearchTerm("");
        setHighlightedIndex(-1);
      }
    }
  };

  const handleSelect = (id: string) => {
    if (multiSelect) {
      // Toggle selection - if already selected, remove it, otherwise add it
      const newSelection = selectedItems.includes(id)
        ? selectedItems.filter(item => item !== id)
        : [...selectedItems, id];
      
      onSelectionChange(newSelection);
      // Don't close dropdown in multi-select mode
    } else {
      // For single select, replace the current selection
      onSelectionChange([id]);
      setIsOpen(false); // Close dropdown after selection in single-select mode
      setSearchTerm("");
    }
  };

  const handleClearSelection = () => {
    onSelectionChange([]); // Clear the selection
    if (!multiSelect) {
      setIsOpen(false); // Only close for single-select
    }
    setSearchTerm("");
  };

  return {
    isOpen,
    setIsOpen,
    searchTerm,
    setSearchTerm,
    highlightedIndex,
    setHighlightedIndex,
    filteredOptions,
    selectedOptionLabels,
    contentPosition,
    toggleDropdown,
    handleSelect,
    handleClearSelection
  };
};
