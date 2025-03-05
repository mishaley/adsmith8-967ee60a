
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguages } from "../../Languages/hooks/useLanguages";
import { useCountryLanguage } from "../../Languages/hooks/useCountryLanguage";
import CountryDropdown from "./CountryDropdown";

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
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

  return (
    <div className="w-full bg-[#f5f9ff] rounded-lg p-4 border border-[#d0e1f9]">
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

      {/* Country Dropdown - Added here */}
      <div className="mt-6">
        <CountryDropdown 
          selectedCountry={selectedCountry} 
          setSelectedCountry={setSelectedCountry}
          setSelectedCountryId={setSelectedCountryId}
        />
      </div>

      {/* Language Selection */}
      <div className="mt-6">
        <div className="font-bold text-lg mb-4">Language</div>
        
        <div className="relative">
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
          
          {selectedLanguageObject && searchTerm === "" && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-sm text-gray-700 pointer-events-none">
              <span>{selectedLanguageObject.language_flag}</span>
              <span>{selectedLanguageObject.language_name}</span>
            </div>
          )}
          
          {isDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg">
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
                      setIsDropdownOpen(false);
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
        
        {countryName && primaryLanguageId && (
          <div className="mt-2 text-sm text-gray-500">
            Primary language for {countryName} selected
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectionDisplay;
