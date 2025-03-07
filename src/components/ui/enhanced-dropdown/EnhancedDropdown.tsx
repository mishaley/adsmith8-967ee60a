
import React, { useRef } from "react";
import TriggerButton from "./TriggerButton";
import SearchBar from "./SearchBar";
import OptionList from "./OptionList";
import ClearButton from "./ClearButton";
import DropdownContent from "./DropdownContent";
import { EnhancedDropdownProps } from "./types";
import { useDropdownState } from "./hooks/useDropdownState";
import { useKeyboardNavigation } from "./hooks/useKeyboardNavigation";

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
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  
  const {
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
  } = useDropdownState({
    options,
    selectedItems,
    onSelectionChange,
    multiSelect,
    contentRef,
    triggerRef
  });

  const { handleKeyDown } = useKeyboardNavigation({
    isOpen,
    filteredOptions,
    highlightedIndex,
    setHighlightedIndex,
    setIsOpen,
    handleSelect,
    setSearchTerm,
    listRef
  });

  // Focus search input when dropdown opens
  React.useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
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
        onToggle={() => toggleDropdown(disabled)}
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
