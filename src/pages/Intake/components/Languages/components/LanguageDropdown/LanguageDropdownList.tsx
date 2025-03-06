
import React, { useRef, useEffect } from "react";
import LanguageDropdownItem from "./LanguageDropdownItem";
import type { Language } from "../../../Languages/hooks/useLanguages";

interface LanguageDropdownListProps {
  filteredLanguages: Language[];
  selectedLanguage: string;
  highlightedIndex: number;
  isLoading: boolean;
  onSelect: (languageId: string) => void;
  setHighlightedIndex: (index: number) => void;
}

const LanguageDropdownList: React.FC<LanguageDropdownListProps> = ({
  filteredLanguages,
  selectedLanguage,
  highlightedIndex,
  isLoading,
  onSelect,
  setHighlightedIndex
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Ensure the highlighted item is visible in the scrollable area
  useEffect(() => {
    if (highlightedIndex < 0 || !dropdownRef.current) return;
    
    const listItems = dropdownRef.current.querySelectorAll("button");
    if (highlightedIndex >= listItems.length) return;
    
    const item = listItems[highlightedIndex];
    const container = dropdownRef.current;
    
    if (item) {
      const itemTop = item.offsetTop;
      const itemBottom = itemTop + item.offsetHeight;
      const containerTop = container.scrollTop;
      const containerBottom = containerTop + container.offsetHeight;
      
      if (itemTop < containerTop) {
        // Scroll up to show the item at the top
        container.scrollTop = itemTop;
      } else if (itemBottom > containerBottom) {
        // Scroll down to show the item at the bottom
        container.scrollTop = itemBottom - container.offsetHeight;
      }
    }
  }, [highlightedIndex]);

  if (isLoading) {
    return <div className="p-4 text-center text-gray-500">Loading languages...</div>;
  }

  if (filteredLanguages.length === 0) {
    return <div className="p-4 text-center text-gray-500">No languages found</div>;
  }

  return (
    <div className="max-h-60 overflow-y-auto" ref={dropdownRef}>
      {filteredLanguages.map((language, index) => (
        <LanguageDropdownItem
          key={language.language_id}
          language={language}
          isSelected={selectedLanguage === language.language_id}
          isHighlighted={highlightedIndex === index}
          onSelect={onSelect}
          onMouseEnter={() => setHighlightedIndex(index)}
        />
      ))}
    </div>
  );
};

export default LanguageDropdownList;
