
import { useState, useEffect, RefObject } from "react";
import { DropdownOption } from "../types";
import { logDebug } from "@/utils/logging";

interface UseDropdownStateProps {
  options: DropdownOption[];
  selectedItems: string[] | string | null | undefined;
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
  
  // Ensure selectedItems is always an array
  const normalizedSelectedItems = Array.isArray(selectedItems) 
    ? selectedItems 
    : (selectedItems ? [selectedItems] : []);
  
  // Filter options based on search term
  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (option.secondary && option.secondary.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Get selected option details for display
  const selectedOptionLabels = normalizedSelectedItems
    .map(id => options.find(opt => opt.id === id))
    .filter(Boolean)
    .map(opt => opt as DropdownOption);
  
  // Log state changes for debugging
  useEffect(() => {
    logDebug(`DropdownState - selectedItems: ${JSON.stringify(selectedItems)}`, 'ui');
    logDebug(`DropdownState - normalizedSelectedItems: ${JSON.stringify(normalizedSelectedItems)}`, 'ui');
    logDebug(`DropdownState - selectedOptionLabels count: ${selectedOptionLabels.length}`, 'ui');
  }, [selectedItems, normalizedSelectedItems, selectedOptionLabels]);
  
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
      const newSelection = normalizedSelectedItems.includes(id)
        ? normalizedSelectedItems.filter(item => item !== id)
        : [...normalizedSelectedItems, id];
      
      logDebug(`Multi-select - new selection: ${JSON.stringify(newSelection)}`, 'ui');
      onSelectionChange(newSelection);
      // Don't close dropdown in multi-select mode
    } else {
      // For single select, replace the current selection with just this item
      logDebug(`Single-select - selected: ${id}`, 'ui');
      onSelectionChange([id]);
      setIsOpen(false); // Close dropdown after selection in single-select mode
      setSearchTerm("");
    }
  };

  const handleClearSelection = () => {
    logDebug(`Clearing selection`, 'ui');
    onSelectionChange([]); // Clear the selection completely
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
    handleClearSelection,
    normalizedSelectedItems
  };
};
