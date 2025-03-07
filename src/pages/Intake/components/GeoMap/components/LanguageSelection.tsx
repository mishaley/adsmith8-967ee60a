
import React from "react";
import { useLanguageSelection } from "../../Languages/hooks/useLanguageSelection";
import { LanguageDropdown, LanguageSelectButton } from "../../Languages/components/LanguageDropdown";

interface LanguageSelectionProps {
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  isLoadingCountry: boolean;
  primaryLanguageId: string | null;
}

const LanguageSelection: React.FC<LanguageSelectionProps> = ({
  selectedLanguage,
  setSelectedLanguage,
  isLoadingCountry,
  primaryLanguageId
}) => {
  const {
    searchTerm,
    isDropdownOpen,
    highlightedIndex,
    selectedLanguageObject,
    filteredLanguages,
    isLoading,
    containerRef,
    setSearchTerm,
    setHighlightedIndex,
    handleLanguageSelect,
    handleClearSelection,
    handleKeyDown,
    toggleDropdown
  } = useLanguageSelection({
    selectedLanguage,
    setSelectedLanguage
  });

  return (
    <div className="mt-6">
      <div className="font-bold text-lg mb-4">Language</div>
      
      <div className="relative" ref={containerRef}>
        <LanguageSelectButton
          selectedLanguage={selectedLanguageObject}
          onClick={toggleDropdown}
        />
        
        {isDropdownOpen && (
          <LanguageDropdown
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedLanguage={selectedLanguage}
            filteredLanguages={filteredLanguages}
            isLoading={isLoading}
            highlightedIndex={highlightedIndex}
            setHighlightedIndex={setHighlightedIndex}
            handleLanguageSelect={handleLanguageSelect}
            handleClearSelection={handleClearSelection}
            handleKeyDown={handleKeyDown}
          />
        )}
      </div>
      
      {isLoadingCountry && primaryLanguageId && (
        <div className="mt-2 text-sm text-gray-500">
          Loading language for selected country...
        </div>
      )}
    </div>
  );
};

export default LanguageSelection;
