
import { useState, useRef, useEffect } from "react";
import { useLanguages } from "./useLanguages";
import type { Language } from "./useLanguages";

interface UseLanguageSelectionProps {
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
}

export const useLanguageSelection = ({
  selectedLanguage,
  setSelectedLanguage
}: UseLanguageSelectionProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    languages,
    isLoading
  } = useLanguages();

  // Get the selected language object from the languages array
  const selectedLanguageObject = languages.find(lang => lang.language_id === selectedLanguage);

  // Filter languages based on search term
  const filteredLanguages = languages.filter(lang => 
    lang.language_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    lang.language_native.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Effect for handling clicks outside of the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen && 
          containerRef.current && 
          !containerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Debug log for language selection
  useEffect(() => {
    console.log("LanguageSelection rendered with:", {
      selectedLanguage,
      selectedLanguageName: selectedLanguageObject?.language_name,
      languagesLoaded: languages.length > 0
    });
  }, [selectedLanguage, selectedLanguageObject, languages]);

  // Handle language selection
  const handleLanguageSelect = (languageId: string) => {
    console.log(`LanguageSelection: Selected language ${languageId}`);
    setSelectedLanguage(languageId);
    setIsDropdownOpen(false);
    setSearchTerm("");
    setHighlightedIndex(-1);
  };

  // Clear selection
  const handleClearSelection = () => {
    console.log("LanguageSelection: Clearing language selection");
    setSelectedLanguage("");
    setSearchTerm("");
    setIsDropdownOpen(false);
    setHighlightedIndex(-1);
  };

  // Handle input change
  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    setHighlightedIndex(-1);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (filteredLanguages.length === 0) return;
    
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex(prevIndex => {
          return prevIndex < filteredLanguages.length - 1 ? prevIndex + 1 : 0;
        });
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex(prevIndex => {
          return prevIndex > 0 ? prevIndex - 1 : filteredLanguages.length - 1;
        });
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredLanguages.length) {
          const language = filteredLanguages[highlightedIndex];
          handleLanguageSelect(language.language_id);
        }
        break;
      case "Escape":
        e.preventDefault();
        setSearchTerm("");
        setIsDropdownOpen(false);
        break;
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return {
    searchTerm,
    isDropdownOpen,
    highlightedIndex,
    selectedLanguageObject,
    filteredLanguages,
    isLoading,
    containerRef,
    setSearchTerm: handleInputChange,
    setHighlightedIndex,
    handleLanguageSelect,
    handleClearSelection,
    handleKeyDown,
    toggleDropdown
  };
};
