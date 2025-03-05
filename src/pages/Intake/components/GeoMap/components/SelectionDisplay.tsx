
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguages } from "../../Languages/hooks/useLanguages";
import { useCountryLanguage } from "../../Languages/hooks/useCountryLanguage";
import CountryDropdown from "./CountryDropdown";
import { ChevronDown } from "lucide-react";

interface SelectionDisplayProps {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  setSelectedCountryId?: ((id: string) => void) | null;
}

const SelectionDisplay: React.FC<SelectionDisplayProps> = ({
  selectedCountry,
  setSelectedCountry,
  selectedLanguage,
  setSelectedLanguage,
  setSelectedCountryId
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  
  const {
    languages,
    isLoading: isLoadingLanguages
  } = useLanguages();
  
  const {
    primaryLanguageId,
    countryName,
    isLoading: isLoadingCountry
  } = useCountryLanguage(selectedCountry);

  // Filter languages based on search term
  const filteredLanguages = languages.filter(lang => 
    lang.language_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    lang.language_native.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get the selected language object from the languages array
  const selectedLanguageObject = languages.find(lang => lang.language_id === selectedLanguage);

  // Get the country object for the selected country
  const selectedCountryObject = selectedCountry ? { country_id: selectedCountry, country_name: countryName } : null;

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle input key events
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsLanguageDropdownOpen(false);
    }
  };

  // Effect for handling clicks outside of the dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Handle country dropdown
      if (isCountryDropdownOpen && 
          countryDropdownRef.current && 
          !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
        setSearchTerm("");
      }
      
      // Handle language dropdown
      if (isLanguageDropdownOpen && 
          languageDropdownRef.current && 
          !languageDropdownRef.current.contains(event.target as Node)) {
        setIsLanguageDropdownOpen(false);
        setSearchTerm("");
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
    
    // Cleanup function
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCountryDropdownOpen, isLanguageDropdownOpen]);

  return (
    <div className="w-full bg-transparent rounded-lg p-4 border-transparent">
      <div className="font-bold text-lg mb-4">Selections</div>
      
      {/* Map Selection Status */}
      {selectedCountry ? (
        <div className="p-3 bg-[#f5f9ff] rounded border border-[#d0e1f9]">
          <p className="font-medium">Selected Country from Map:</p>
          <p className="text-[#0c343d] font-bold">{selectedCountry}</p>
        </div>
      ) : (
        <div className="p-3 bg-gray-50 rounded border border-gray-200 text-gray-500">
          No country selected on map. Click on the map to select a country.
        </div>
      )}
      
      {selectedCountry && (
        <div className="mt-3 flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              setSelectedCountry('');
              if (setSelectedCountryId) {
                setSelectedCountryId('');
              }
            }}
          >
            Clear Selection
          </Button>
        </div>
      )}

      {/* Country Dropdown */}
      <div className="mt-6" ref={countryDropdownRef}>
        <div className="font-bold text-lg mb-4">Country</div>
        
        <div className="relative">
          {/* If a country is selected, show the selection instead of the search input */}
          {selectedCountryObject && !isCountryDropdownOpen ? (
            <Button
              variant="outline"
              className="w-full justify-between font-normal"
              onClick={() => setIsCountryDropdownOpen(true)}
            >
              <span className="flex items-center gap-2 text-left">
                {selectedCountryObject.country_name}
              </span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          ) : (
            <Input 
              type="text" 
              placeholder="Search countries..." 
              value={searchTerm} 
              onChange={handleInputChange} 
              onFocus={() => setIsCountryDropdownOpen(true)} 
              onClick={() => setIsCountryDropdownOpen(true)} 
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setIsCountryDropdownOpen(false);
                }
              }}
              autoComplete="off" 
              className="w-full" 
            />
          )}
          
          {isCountryDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg">
              <Button 
                type="button" 
                variant="ghost" 
                className="w-full text-left text-gray-500 border-b" 
                onClick={() => {
                  setIsCountryDropdownOpen(false);
                  setSearchTerm("");
                }}
              >
                Close
              </Button>
              
              <CountryDropdown 
                selectedCountry={selectedCountry} 
                setSelectedCountry={(country) => {
                  setSelectedCountry(country);
                  setIsCountryDropdownOpen(false);
                  if (setSelectedCountryId) {
                    setSelectedCountryId(country);
                  }
                }}
                setSelectedCountryId={null}
              />
            </div>
          )}
        </div>
      </div>

      {/* Language Selection */}
      <div className="mt-6" ref={languageDropdownRef}>
        <div className="font-bold text-lg mb-4">Language</div>
        
        <div className="relative">
          {/* If a language is selected, show the selection instead of the search input */}
          {selectedLanguageObject && !isLanguageDropdownOpen ? (
            <Button
              variant="outline"
              className="w-full justify-between font-normal"
              onClick={() => setIsLanguageDropdownOpen(true)}
            >
              <span className="flex items-center gap-2 text-left">
                <span>{selectedLanguageObject.language_flag}</span>
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
              onFocus={() => setIsLanguageDropdownOpen(true)} 
              onClick={() => setIsLanguageDropdownOpen(true)} 
              autoComplete="off" 
              className="w-full" 
            />
          )}
          
          {isLanguageDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg">
              <Button 
                type="button" 
                variant="ghost" 
                className="w-full text-left text-gray-500 border-b" 
                onClick={() => {
                  setIsLanguageDropdownOpen(false);
                  setSearchTerm("");
                }}
              >
                Close
              </Button>
              
              {isLoadingLanguages ? (
                <div className="p-2 text-center">Loading languages...</div>
              ) : filteredLanguages.length > 0 ? (
                filteredLanguages.map(language => (
                  <Button 
                    key={language.language_id} 
                    type="button" 
                    variant="ghost" 
                    className={`w-full flex items-center justify-between px-4 py-2 text-left ${selectedLanguage === language.language_id ? "bg-gray-100" : ""}`} 
                    onClick={() => {
                      setSelectedLanguage(language.language_id);
                      setSearchTerm("");
                      setIsLanguageDropdownOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span>{language.language_flag}</span>
                      <span>{language.language_name}</span>
                    </div>
                    <span className="text-gray-500">{language.language_native}</span>
                  </Button>
                ))
              ) : (
                <div className="p-2 text-center">No languages found</div>
              )}
            </div>
          )}
        </div>
        
        {isLoadingCountry && selectedCountry && (
          <div className="mt-2 text-sm text-gray-500">
            Loading language for selected country...
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectionDisplay;
