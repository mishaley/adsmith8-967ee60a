
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, ChevronDown } from "lucide-react";
import { Portal } from "@radix-ui/react-portal";

export interface DropdownOption {
  id: string;
  label: string;
  icon?: string | React.ReactNode;
  secondary?: string;
}

interface EnhancedDropdownProps {
  options: DropdownOption[];
  selectedItems: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  placeholder?: string;
  buttonIcon?: React.ReactNode;
  multiSelect?: boolean;
  searchPlaceholder?: string;
  clearButtonText?: string;
  renderOption?: (option: DropdownOption, isSelected: boolean, isHighlighted: boolean) => React.ReactNode;
  className?: string;
  buttonClassName?: string;
  contentClassName?: string;
  disabled?: boolean;
}

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

  // Default option renderer
  const defaultRenderOption = (option: DropdownOption, isSelected: boolean, isHighlighted: boolean) => (
    <div className="flex items-center justify-between px-4 py-2">
      <div className="flex items-center gap-2">
        {typeof option.icon === 'string' ? (
          <span className="inline-block w-6 text-center">{option.icon}</span>
        ) : option.icon ? (
          option.icon
        ) : null}
        <span className="truncate">{option.label}</span>
      </div>
      {option.secondary && (
        <span className="text-gray-500 truncate">{option.secondary}</span>
      )}
    </div>
  );

  return (
    <div className={`relative ${className}`}>
      {/* Trigger button */}
      <Button
        ref={triggerRef}
        variant="outline"
        className={`w-full justify-between font-normal ${buttonClassName} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={toggleDropdown}
        disabled={disabled}
        type="button"
      >
        <span className="flex items-center gap-2 text-left truncate">
          {selectedOptionLabels.length > 0 ? (
            <>
              {selectedOptionLabels[0].icon && typeof selectedOptionLabels[0].icon === 'string' && (
                <span className="inline-block w-6 text-center">
                  {selectedOptionLabels[0].icon}
                </span>
              )}
              {multiSelect && selectedOptionLabels.length > 1 ? (
                <span>{selectedOptionLabels.length} selected</span>
              ) : (
                <span>{selectedOptionLabels[0].label}</span>
              )}
            </>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </span>
        {buttonIcon || <ChevronDown className="h-4 w-4 shrink-0" />}
      </Button>

      {/* Dropdown content - using Portal to render outside of any containers */}
      {isOpen && (
        <Portal>
          <div 
            ref={contentRef}
            className={`fixed bg-white border border-gray-200 rounded-md shadow-lg z-50 ${contentClassName}`}
            style={{
              top: `${contentPosition.top}px`,
              left: `${contentPosition.left}px`,
              width: `${contentPosition.width}px`,
              maxHeight: '400px'
            }}
            onKeyDown={handleKeyDown}
          >
            {/* Search bar */}
            <div className="sticky top-0 bg-white z-10 p-2 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setHighlightedIndex(-1);
                  }}
                  className="pl-8 pr-8 w-full"
                  autoComplete="off"
                />
                {searchTerm && (
                  <button 
                    className="absolute right-2 top-2.5"
                    onClick={() => {
                      setSearchTerm("");
                      if (searchInputRef.current) {
                        searchInputRef.current.focus();
                      }
                    }}
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>

            {/* Options list */}
            <div 
              ref={listRef}
              className="overflow-y-auto"
              style={{ maxHeight: '250px' }}
              role="listbox"
              aria-multiselectable={multiSelect}
            >
              {filteredOptions.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No options found</div>
              ) : (
                filteredOptions.map((option, index) => (
                  <div
                    key={option.id}
                    className={`
                      cursor-pointer
                      ${selectedItems.includes(option.id) ? 'bg-gray-100' : ''}
                      ${highlightedIndex === index ? 'bg-gray-100' : ''}
                      hover:bg-gray-100
                    `}
                    onClick={() => handleSelect(option.id)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    role="option"
                    aria-selected={selectedItems.includes(option.id)}
                  >
                    {renderOption 
                      ? renderOption(option, selectedItems.includes(option.id), highlightedIndex === index) 
                      : defaultRenderOption(option, selectedItems.includes(option.id), highlightedIndex === index)}
                  </div>
                ))
              )}
            </div>

            {/* Clear selection button */}
            <div className="sticky bottom-0 w-full border-t border-gray-200 bg-white">
              <Button 
                type="button" 
                variant="ghost" 
                className="w-full text-gray-500 flex items-center justify-center py-2"
                onClick={handleClearSelection}
                disabled={selectedItems.length === 0}
              >
                <X className="h-4 w-4 mr-2" />
                {clearButtonText}
              </Button>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
};

export default EnhancedDropdown;
