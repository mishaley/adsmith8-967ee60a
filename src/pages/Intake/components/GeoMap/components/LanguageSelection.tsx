
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, X } from "lucide-react";
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    languages,
    isLoading: isLoadingLanguages
  } = useLanguages();

  // Filter languages based on search term
  const filteredLanguages = languages.filter(lang => 
    lang.language_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    lang.language_native.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get the selected language object from the languages array
  const selectedLanguageObject = languages.find(lang => lang.language_id === selectedLanguage);

  // Effect for handling clicks outside of the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen && 
          dropdownRef.current && 
          !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle input key events
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsDropdownOpen(false);
    }
  };

  const handleClearSelection = () => {
    setSelectedLanguage("");
    setSearchTerm("");
    setIsDropdownOpen(false);
  };

  return (
    <div className="mt-6" ref={dropdownRef}>
      <div className="font-bold text-lg mb-4">Language</div>
      
      <div className="relative">
        {/* If a language is selected, show the selection instead of the search input */}
        {selectedLanguageObject && !isDropdownOpen ? (
          <Button
            variant="outline"
            className="w-full justify-between font-normal"
            onClick={() => setIsDropdownOpen(true)}
          >
            <span className="flex items-center gap-2 text-left">
              <span className="inline-block w-6 text-center">{selectedLanguageObject.language_flag}</span>
              <span>{selectedLanguageObject.language_name}</span>
            </span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        ) : (
          <Input 
            id="language" 
            type="text" 
            placeholder="Search languages..." 
            value={searchTerm} 
            onChange={handleInputChange} 
            onKeyDown={handleInputKeyDown} 
            onFocus={() => setIsDropdownOpen(true)} 
            onClick={() => setIsDropdownOpen(true)} 
            autoComplete="off" 
            className="w-full" 
          />
        )}
        
        {isDropdownOpen && (
          <div className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg">
            <Button 
              type="button" 
              variant="ghost" 
              className="w-full text-left text-gray-500 border-b" 
              onClick={() => {
                setIsDropdownOpen(false);
                setSearchTerm("");
              }}
            >
              Close
            </Button>
            
            <div className="max-h-52 overflow-auto">
              {isLoadingLanguages ? (
                <div className="p-2 text-center">Loading languages...</div>
              ) : filteredLanguages.length > 0 ? (
                filteredLanguages.map((language: Language) => (
                  <Button 
                    key={language.language_id} 
                    type="button" 
                    variant="ghost" 
                    className={`w-full flex items-center justify-between px-4 py-2 text-left ${selectedLanguage === language.language_id ? "bg-gray-100" : ""}`} 
                    onClick={() => {
                      setSelectedLanguage(language.language_id);
                      setSearchTerm("");
                      setIsDropdownOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-6 text-center">{language.language_flag}</span>
                      <span>{language.language_name}</span>
                    </div>
                    <span className="text-gray-500">{language.language_native}</span>
                  </Button>
                ))
              ) : (
                <div className="p-2 text-center">No languages found</div>
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
