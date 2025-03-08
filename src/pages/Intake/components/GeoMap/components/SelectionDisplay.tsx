
import React, { useEffect } from "react";
import { useCountryLanguage } from "../../Languages/hooks/useCountryLanguage";
import CountrySelection from "./selection/CountrySelection";
import LanguageSelection from "./selection/LanguageSelection";
import ExcludeSelection from "./selection/ExcludeSelection";
import { useExcludedCountry } from "../hooks/useExcludedCountry";

interface SelectionDisplayProps {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  setSelectedCountryId?: ((id: string) => void) | null;
  setExcludedCountryId?: ((id: string) => void) | null;
  // Add multi-select props
  selectedCountries?: string[];
  setSelectedCountries?: ((countries: string[]) => void) | null;
  selectedLanguages?: string[];
  setSelectedLanguages?: ((languages: string[]) => void) | null;
  // Add excluded countries multi-select props
  excludedCountries?: string[];
  setExcludedCountries?: ((countries: string[]) => void) | null;
}

const SelectionDisplay: React.FC<SelectionDisplayProps> = ({
  selectedCountry,
  setSelectedCountry,
  selectedLanguage,
  setSelectedLanguage,
  setSelectedCountryId,
  setExcludedCountryId,
  selectedCountries = [],
  setSelectedCountries = null,
  selectedLanguages = [],
  setSelectedLanguages = null,
  excludedCountries = [],
  setExcludedCountries = null
}) => {
  const {
    primaryLanguageId,
    countryName,
    isLoading: isLoadingCountry
  } = useCountryLanguage(selectedCountry);
  
  // We'll continue to use this for backward compatibility
  const {
    excludedCountry,
    setExcludedCountry,
    excludedCountryFlag,
    handleClearExclusion
  } = useExcludedCountry({ setExcludedCountryId });
  
  // Make sure if Worldwide is selected, English is set as the language
  useEffect(() => {
    if (selectedCountry === "worldwide" && selectedLanguage !== "en") {
      console.log("SelectionDisplay: Enforcing English for Worldwide selection");
      setSelectedLanguage("en");
      
      // Also update multi-select languages if available
      if (setSelectedLanguages) {
        setSelectedLanguages(["en"]);
      }
    }
  }, [selectedCountry, selectedLanguage, setSelectedLanguage, setSelectedLanguages]);
  
  const handleClearSelection = () => {
    // Clear both the country selection and map highlighting
    setSelectedCountry('');

    // Also clear multi-select countries if available
    if (setSelectedCountries) {
      setSelectedCountries([]);
    }

    // Ensure the map highlight is cleared by explicitly passing empty string
    if (setSelectedCountryId) {
      setSelectedCountryId('');
    }

    // Also clear the language when country is cleared
    setSelectedLanguage('');
    
    // Also clear multi-select languages if available
    if (setSelectedLanguages) {
      setSelectedLanguages([]);
    }
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
              selectedCountry={selectedCountry} 
              setSelectedCountry={setSelectedCountry} 
              setSelectedCountryId={setSelectedCountryId} 
              countryName={countryName} 
              onClearSelection={handleClearSelection}
              hideLabel={true}
              multiSelect={!!setSelectedCountries}
              selectedCountries={selectedCountries}
              setSelectedCountries={setSelectedCountries}
            />
          </div>
        </div>

        {/* Exclude Selection - Add specific z-index */}
        <div className="flex items-center gap-4" style={{ position: 'relative', zIndex: 20 }}>
          <div className="w-24 font-medium">Exclude</div>
          <div className="flex-1">
            {/* Only render if setExcludedCountries is provided */}
            {setExcludedCountries && (
              <ExcludeSelection 
                excludedCountries={excludedCountries || []}
                setExcludedCountries={setExcludedCountries}
                setExcludedCountryId={setExcludedCountryId}
                hideLabel={true}
              />
            )}
          </div>
        </div>

        {/* Language Selection - Add specific z-index */}
        <div className="flex items-center gap-4" style={{ position: 'relative', zIndex: 10 }}>
          <div className="w-24 font-medium">Language</div>
          <div className="flex-1">
            <LanguageSelection 
              selectedLanguage={selectedLanguage} 
              setSelectedLanguage={setSelectedLanguage} 
              isLoadingCountry={isLoadingCountry} 
              primaryLanguageId={primaryLanguageId}
              hideLabel={true}
              multiSelect={!!setSelectedLanguages}
              selectedLanguages={selectedLanguages}
              setSelectedLanguages={setSelectedLanguages}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectionDisplay;
