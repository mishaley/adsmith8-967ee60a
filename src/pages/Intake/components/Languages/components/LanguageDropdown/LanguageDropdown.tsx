
import React from "react";
import LanguageSearchInput from "./LanguageSearchInput";
import LanguageDropdownList from "./LanguageDropdownList";
import LanguageClearButton from "./LanguageClearButton";

interface LanguageDropdownProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedLanguage: string;
  filteredLanguages: any[];
  isLoading: boolean;
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;
  handleLanguageSelect: (languageId: string) => void;
  handleClearSelection: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const LanguageDropdown: React.FC<LanguageDropdownProps> = ({
  searchTerm,
  setSearchTerm,
  selectedLanguage,
  filteredLanguages,
  isLoading,
  highlightedIndex,
  setHighlightedIndex,
  handleLanguageSelect,
  handleClearSelection,
  handleKeyDown
}) => {
  return (
    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
      {/* Search bar */}
      <LanguageSearchInput
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onKeyDown={handleKeyDown}
        isDropdownOpen={true}
      />

      {/* Language list */}
      <LanguageDropdownList
        filteredLanguages={filteredLanguages}
        selectedLanguage={selectedLanguage}
        highlightedIndex={highlightedIndex}
        isLoading={isLoading}
        onSelect={handleLanguageSelect}
        setHighlightedIndex={setHighlightedIndex}
      />
      
      {/* Clear selection button */}
      <div className="sticky bottom-0 w-full border-t border-gray-200 bg-white">
        <LanguageClearButton
          onClick={handleClearSelection}
          disabled={!selectedLanguage}
        />
      </div>
    </div>
  );
};

export default LanguageDropdown;
