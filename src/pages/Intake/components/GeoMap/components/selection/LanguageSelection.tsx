
import React from "react";
import { useLanguageSelection } from "../../../Languages/hooks/useLanguageSelection";
import { LanguageDropdown, LanguageSelectButton } from "../../../Languages/components/LanguageDropdown";
import SelectionHeader from "./SelectionHeader";

interface LanguageSelectionProps {
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  isLoadingCountry: boolean;
  primaryLanguageId: string | null;
  hideLabel?: boolean;
}

const LanguageSelection: React.FC<LanguageSelectionProps> = ({
  selectedLanguage,
  setSelectedLanguage,
  isLoadingCountry,
  primaryLanguageId,
  hideLabel = false
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
    <div>
      {!hideLabel && <SelectionHeader title="Language" />}
      
      <div className="relative" ref={containerRef} style={{ zIndex: 30 }}>
        <LanguageSelectButton
          selectedLanguage={selectedLanguageObject}
          onClick={toggleDropdown}
          emptyPlaceholder=""
        />
        
        {isDropdownOpen && (
          <div style={{ position: 'relative', zIndex: 50 }}>
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
          </div>
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
