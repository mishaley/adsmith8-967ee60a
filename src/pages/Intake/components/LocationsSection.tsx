import React, { useState, useEffect } from "react";
import GeoMapSection from "./GeoMap/GeoMapSection";
import { Input } from "@/components/ui/input";
import { saveToLocalStorage, loadFromLocalStorage, STORAGE_KEYS } from "../utils/localStorageUtils";
import CollapsibleSection from "./CollapsibleSection";
import { useLanguages } from "./Languages/hooks/useLanguages";
import { useCountryLanguage } from "./Languages/hooks/useCountryLanguage";
import { Button } from "@/components/ui/button";
interface LocationsSectionProps {
  selectedCountry: string;
  setSelectedCountry: (value: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (value: string) => void;
}
const LocationsSection: React.FC<LocationsSectionProps> = ({
  selectedCountry,
  setSelectedCountry,
  selectedLanguage,
  setSelectedLanguage
}) => {
  const [locationGroupName, setLocationGroupName] = useState(() => loadFromLocalStorage<string>(STORAGE_KEYS.LOCATION + "_groupName", ""));
  const {
    languages,
    isLoading: isLoadingLanguages
  } = useLanguages();
  const {
    primaryLanguageId,
    countryName,
    isLoading: isLoadingCountry
  } = useCountryLanguage(selectedCountry);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filter languages based on search term
  const filteredLanguages = languages.filter(lang => lang.language_name.toLowerCase().includes(searchTerm.toLowerCase()) || lang.language_native.toLowerCase().includes(searchTerm.toLowerCase()));

  // Effect to set the language based on the selected country
  useEffect(() => {
    if (primaryLanguageId) {
      setSelectedLanguage(primaryLanguageId);
      console.log(`Auto-selecting language: ${primaryLanguageId} based on country: ${countryName}`);
    } else if (!selectedCountry) {
      // Clear language selection when no country is selected
      setSelectedLanguage("");
    }
  }, [primaryLanguageId, selectedCountry, setSelectedLanguage, countryName]);

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

  // Save location group name when it changes
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.LOCATION + "_groupName", locationGroupName);
  }, [locationGroupName]);
  return <CollapsibleSection title="LOCATIONS">
      <div className="max-w-full mx-auto">
        <GeoMapSection selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} />
      </div>
      
      <div className="w-full md:w-1/2 mt-6 ml-auto">
        <div className="bg-[#f5f9ff] rounded-lg p-4 border border-[#d0e1f9]">
          <div className="font-bold text-lg mb-4">Language</div>
          
          <div className="relative">
            <Input id="language" type="text" placeholder="Search languages..." value={searchTerm} onChange={handleInputChange} onKeyDown={handleInputKeyDown} onFocus={() => setIsDropdownOpen(true)} onClick={() => setIsDropdownOpen(true)} autoComplete="off" className="w-full" />
            
            {selectedLanguageObject && searchTerm === "" && <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-sm text-gray-700 pointer-events-none">
                <span>{selectedLanguageObject.language_flag}</span>
                <span>{selectedLanguageObject.language_name}</span>
              </div>}
            
            {isDropdownOpen && <div className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg">
                {isLoadingLanguages ? <div className="p-2 text-center">Loading languages...</div> : filteredLanguages.length > 0 ? filteredLanguages.map(language => <Button key={language.language_id} type="button" variant="ghost" className={`w-full flex items-center justify-between px-4 py-2 text-left ${selectedLanguage === language.language_id ? "bg-gray-100" : ""}`} onClick={() => {
              setSelectedLanguage(language.language_id);
              setSearchTerm("");
              setIsDropdownOpen(false);
            }}>
                      <div className="flex items-center gap-2">
                        <span>{language.language_flag}</span>
                        <span>{language.language_name}</span>
                      </div>
                      <span className="text-gray-500">{language.language_native}</span>
                    </Button>) : <div className="p-2 text-center">No languages found</div>}
              </div>}
          </div>
          
          {isLoadingCountry && selectedCountry && <div className="mt-2 text-sm text-gray-500">
              Loading language for selected country...
            </div>}
          
          {countryName && primaryLanguageId && <div className="mt-2 text-sm text-gray-500">
              Primary language for {countryName} selected
            </div>}
        </div>
      </div>

      <div className="mt-8 max-w-md mx-auto">
        
        
        
      </div>
    </CollapsibleSection>;
};
export default LocationsSection;