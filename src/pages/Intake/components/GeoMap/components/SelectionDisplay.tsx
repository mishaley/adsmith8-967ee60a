
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
}

const SelectionDisplay: React.FC<SelectionDisplayProps> = ({
  selectedCountry,
  setSelectedCountry,
  selectedLanguage,
  setSelectedLanguage,
  setSelectedCountryId,
  setExcludedCountryId
}) => {
  const {
    primaryLanguageId,
    countryName,
    isLoading: isLoadingCountry
  } = useCountryLanguage(selectedCountry);
  
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
    }
  }, [selectedCountry, selectedLanguage, setSelectedLanguage]);
  
  const handleClearSelection = () => {
    // Clear both the country selection and map highlighting
    setSelectedCountry('');

    // Ensure the map highlight is cleared by explicitly passing empty string
    if (setSelectedCountryId) {
      setSelectedCountryId('');
    }

    // Also clear the language when country is cleared
    setSelectedLanguage('');
  };
  
  return (
    <div className="w-full bg-white rounded-lg p-6 border border-gray-100 shadow-sm flex flex-col space-y-8">
      {/* Top section with Country, Exclude, and Language */}
      <div className="space-y-6">
        {/* Country Selection */}
        <div>
          <CountrySelection 
            selectedCountry={selectedCountry} 
            setSelectedCountry={setSelectedCountry} 
            setSelectedCountryId={setSelectedCountryId} 
            countryName={countryName} 
            onClearSelection={handleClearSelection}
          />
        </div>

        {/* Exclude Selection - moved between Country and Language */}
        <div>
          <ExcludeSelection 
            selectedCountry={excludedCountry} 
            setSelectedCountry={setExcludedCountry}
            selectedCountryFlag={excludedCountryFlag}
            onClearSelection={handleClearExclusion}
            setExcludedCountryId={setExcludedCountryId}
          />
        </div>

        {/* Language Selection */}
        <div>
          <LanguageSelection 
            selectedLanguage={selectedLanguage} 
            setSelectedLanguage={setSelectedLanguage} 
            isLoadingCountry={isLoadingCountry} 
            primaryLanguageId={primaryLanguageId} 
          />
        </div>
      </div>
    </div>
  );
};

export default SelectionDisplay;
