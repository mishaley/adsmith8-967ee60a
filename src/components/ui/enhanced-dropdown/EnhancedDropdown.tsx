
import React, { useState, useRef, useEffect } from "react";
import TriggerButton from "./TriggerButton";
import SearchBar from "./SearchBar";
import OptionList from "./OptionList";
import ClearButton from "./ClearButton";
import DropdownContent from "./DropdownContent";
import { EnhancedDropdownProps, DropdownOption } from "./types";

export type { DropdownOption } from "./types";

export const EnhancedDropdown: React.FC<EnhancedDropdownProps> = ({
  options,
  selectedItems,
  onSelectionChange,
  placeholder = "Select...",
  buttonIcon,
  multiSelect = false,
  searchPlaceholder = "Search...",
  clearButtonText = "Clear selection",
  renderOption,
  className = "",
  buttonClassName = "",
  contentClassName = "",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  
  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (option.secondary && option.secondary.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Get selected option details for display
  const selectedOptionLabels = selectedItems
    .map(id => options.find(opt => opt.id === id))
    .filter(Boolean)
    .map(opt => opt as DropdownOption);
  
  useEffect(() => {
    // Focus search input when dropdown opens
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    // Handle click outside to close dropdown
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
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        ensureHighlightedVisible();
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
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

  const toggleDropdown = () => {
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
      const newSelection = selectedItems.includes(id)
        ? selectedItems.filter(item => item !== id)
        : [...selectedItems, id];
      onSelectionChange(newSelection);
      
      // Don't close dropdown in multi-select mode
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    } else {
      // For single select, just replace the current selection
      onSelectionChange([id]);
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  const handleClearSelection = () => {
    onSelectionChange([]);
    if (!multiSelect) {
      setIsOpen(false);
    }
    setSearchTerm("");
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Calculate position for the dropdown content
  const [contentPosition, setContentPosition] = useState({ top: 0, left: 0, width: 0 });
  
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setContentPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isOpen]);

  return (
    <div className={`relative ${className}`}>
      {/* Trigger button */}
      <TriggerButton 
        ref={triggerRef}
        placeholder={placeholder}
        buttonIcon={buttonIcon}
        selectedOptionLabels={selectedOptionLabels}
        multiSelect={multiSelect}
        onToggle={toggleDropdown}
        disabled={disabled}
        buttonClassName={buttonClassName}
      />

      {/* Dropdown content */}
      {isOpen && (
        <DropdownContent
          contentRef={contentRef}
          contentPosition={contentPosition}
          onKeyDown={handleKeyDown}
          contentClassName={contentClassName}
        >
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={(term) => {
              setSearchTerm(term);
              setHighlightedIndex(-1);
            }}
            searchPlaceholder={searchPlaceholder}
            inputRef={searchInputRef}
          />
          
          <OptionList
            filteredOptions={filteredOptions}
            selectedItems={selectedItems}
            highlightedIndex={highlightedIndex}
            setHighlightedIndex={setHighlightedIndex}
            onSelect={handleSelect}
            multiSelect={multiSelect}
            renderOption={renderOption}
            listRef={listRef}
          />
          
          <ClearButton
            selectedItems={selectedItems}
            onClear={handleClearSelection}
            clearButtonText={clearButtonText}
          />
        </DropdownContent>
      )}
    </div>
  );
};

export default EnhancedDropdown;
