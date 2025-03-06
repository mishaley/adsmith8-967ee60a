
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Search, X } from "lucide-react";
import { useLanguages } from "../../Languages/hooks/useLanguages";
import type { Language } from "../../Languages/hooks/useLanguages";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const {
    languages,
    isLoading: isLoadingLanguages
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
          dropdownRef.current && 
          !dropdownRef.current.contains(event.target as Node)) {
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

  // Focus the search input when the dropdown is opened
  useEffect(() => {
    if (isDropdownOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isDropdownOpen]);

  // Handle language selection
  const handleLanguageSelect = (languageId: string) => {
    setSelectedLanguage(languageId);
    setIsDropdownOpen(false);
    setSearchTerm("");
    setHighlightedIndex(-1);
  };

  // Clear selection
  const handleClearSelection = () => {
    setSelectedLanguage("");
    setSearchTerm("");
    setIsDropdownOpen(false);
    setHighlightedIndex(-1);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setHighlightedIndex(-1);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (filteredLanguages.length === 0) return;
    
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex(prevIndex => {
          const nextIndex = prevIndex < filteredLanguages.length - 1 ? prevIndex + 1 : 0;
          ensureHighlightedItemVisible(nextIndex);
          return nextIndex;
        });
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex(prevIndex => {
          const nextIndex = prevIndex > 0 ? prevIndex - 1 : filteredLanguages.length - 1;
          ensureHighlightedItemVisible(nextIndex);
          return nextIndex;
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

  // Ensure the highlighted item is visible in the scrollable area
  const ensureHighlightedItemVisible = (index: number) => {
    if (index < 0 || !dropdownRef.current) return;
    
    const listItems = dropdownRef.current.querySelectorAll("button");
    if (index >= listItems.length) return;
    
    const item = listItems[index];
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
  };

  return (
    <div className="mt-6" ref={dropdownRef}>
      <div className="font-bold text-lg mb-4">Language</div>
      
      <div className="relative">
        {/* If a language is selected, show the selection instead of the search input */}
        <Button
          variant="outline"
          className="w-full justify-between font-normal"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span className="flex items-center gap-2 text-left truncate">
            {selectedLanguageObject ? (
              <>
                <span className="inline-block w-6 text-center">{selectedLanguageObject.language_flag}</span>
                <span>{selectedLanguageObject.language_name}</span>
              </>
            ) : (
              <span></span>
            )}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0" />
        </Button>
        
        {isDropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
            {/* Search bar */}
            <div className="sticky top-0 bg-white z-10 p-2 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search languages..."
                  value={searchTerm}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  className="pl-8 pr-8 w-full"
                  autoComplete="off"
                />
                {searchTerm && (
                  <button 
                    className="absolute right-2 top-2.5"
                    onClick={() => setSearchTerm("")}
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto" ref={dropdownRef}>
              {isLoadingLanguages ? (
                <div className="p-4 text-center text-gray-500">Loading languages...</div>
              ) : filteredLanguages.length > 0 ? (
                filteredLanguages.map((language: Language, index) => (
                  <Button 
                    key={language.language_id} 
                    type="button" 
                    variant="ghost" 
                    className={`w-full flex items-center justify-between px-4 py-2 text-left h-auto ${
                      selectedLanguage === language.language_id ? "bg-gray-100" : ""
                    } ${
                      highlightedIndex === index ? "bg-gray-100" : ""
                    }`}
                    onClick={() => handleLanguageSelect(language.language_id)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-6 text-center">{language.language_flag}</span>
                      <span className="truncate">{language.language_name}</span>
                    </div>
                    <span className="text-gray-500 truncate">{language.language_native}</span>
                  </Button>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">No languages found</div>
              )}
            </div>
            
            <div className="sticky bottom-0 w-full border-t border-gray-200 bg-white">
              <Button 
                type="button" 
                variant="ghost" 
                className="w-full text-gray-500 flex items-center justify-center py-2"
                onClick={handleClearSelection}
                disabled={!selectedLanguage}
              >
                <X className="h-4 w-4 mr-2" />
                Clear selection
              </Button>
            </div>
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
