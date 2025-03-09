
import React from "react";
import { useCountryLanguage } from "../../Languages/hooks/useCountryLanguage";
import CountrySelection from "./selection/CountrySelection";
import LanguageSelection from "./selection/LanguageSelection";
import ExcludeSelection from "./selection/ExcludeSelection";
import { useExcludedCountry } from "../hooks/useExcludedCountry";

interface SelectionDisplayProps {
  // Remove single-select props from interface since we'll only use multi-select
  selectedCountries: string[];
  setSelectedCountries: (countries: string[]) => void;
  selectedLanguages: string[];
  setSelectedLanguages: (languages: string[]) => void;
  setSelectedCountryId?: ((id: string) => void) | null;
  setExcludedCountryId?: ((id: string) => void) | null;
  excludedCountries: string[];
  setExcludedCountries: (countries: string[]) => void;
}

const SelectionDisplay: React.FC<SelectionDisplayProps> = ({
  selectedCountries,
  setSelectedCountries,
  selectedLanguages,
  setSelectedLanguages,
  setSelectedCountryId,
  setExcludedCountryId,
  excludedCountries,
  setExcludedCountries
}) => {
  // Use the first selected country for backward compatibility with useCountryLanguage
  const selectedCountry = selectedCountries.length > 0 ? selectedCountries[0] : "";
  
  const {
    primaryLanguageId,
    countryName,
    isLoading: isLoadingCountry
  } = useCountryLanguage(selectedCountry);
  
  const handleClearSelection = () => {
    // Clear the countries selection
    setSelectedCountries([]);
    
    // Ensure the map highlight is cleared
    if (setSelectedCountryId) {
      setSelectedCountryId('');
    }
    
    // Also clear the languages when countries are cleared
    setSelectedLanguages([]);
  };
  
  return (
    <div className="w-full bg-transparent rounded-lg p-6 border border-gray-100 shadow-sm flex flex-col space-y-8" style={{ zIndex: 10, position: 'static' }}>
      {/* All selections with labels on the left */}
      <div className="space-y-4">
        {/* Country Selection - Add specific z-index */}
        <div className="flex items-center gap-4" style={{ position: 'relative', zIndex: 30 }}>
          <div className="w-24 font-medium">Country</div>
          <div className="flex-1">
            <CountrySelection 
              selectedCountries={selectedCountries} 
              setSelectedCountries={setSelectedCountries} 
              setSelectedCountryId={setSelectedCountryId} 
              countryName={countryName} 
              onClearSelection={handleClearSelection}
              hideLabel={true}
            />
          </div>
        </div>

        {/* Exclude Selection - Add specific z-index */}
        <div className="flex items-center gap-4" style={{ position: 'relative', zIndex: 20 }}>
          <div className="w-24 font-medium">Exclude</div>
          <div className="flex-1">
            <ExcludeSelection 
              excludedCountries={excludedCountries}
              setExcludedCountries={setExcludedCountries}
              setExcludedCountryId={setExcludedCountryId}
              hideLabel={true}
            />
          </div>
        </div>

        {/* Language Selection - Add specific z-index */}
        <div className="flex items-center gap-4" style={{ position: 'relative', zIndex: 10 }}>
          <div className="w-24 font-medium">Language</div>
          <div className="flex-1">
            <LanguageSelection 
              selectedLanguages={selectedLanguages}
              setSelectedLanguages={setSelectedLanguages}
              isLoadingCountry={isLoadingCountry} 
              primaryLanguageId={primaryLanguageId}
              hideLabel={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectionDisplay;
