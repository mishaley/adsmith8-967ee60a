
import React, { useState } from "react";
import { useCountryLanguage } from "../../Languages/hooks/useCountryLanguage";
import CountryStatusDisplay from "./CountryStatusDisplay";
import CountrySelection from "./CountrySelection";
import LanguageSelection from "./LanguageSelection";
import ExcludeSelection from "./ExcludeSelection";
import { useCountries } from "../hooks/useCountries";

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
  const { countries } = useCountries();
  const [excludedCountry, setExcludedCountry] = useState<string>('');
  
  const {
    primaryLanguageId,
    countryName,
    isLoading: isLoadingCountry
  } = useCountryLanguage(selectedCountry);
  
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
    <div className="w-full bg-transparent rounded-lg p-0 border-transparent">
      {/* Country Selection */}
      <div className="mb-6">
        <CountrySelection 
          selectedCountry={selectedCountry} 
          setSelectedCountry={setSelectedCountry} 
          setSelectedCountryId={setSelectedCountryId} 
          countryName={countryName} 
        />
      </div>

      {/* Language Selection */}
      <div className="mb-6">
        <LanguageSelection 
          selectedLanguage={selectedLanguage} 
          setSelectedLanguage={setSelectedLanguage} 
          isLoadingCountry={isLoadingCountry} 
          primaryLanguageId={primaryLanguageId} 
        />
      </div>

      {/* Exclude Selection */}
      <div>
        <ExcludeSelection 
          selectedCountry={excludedCountry} 
          setSelectedCountry={setExcludedCountry} 
          countryName={countries.find(c => c.country_id === excludedCountry)?.country_name || null} 
        />
      </div>
    </div>
  );
};

export default SelectionDisplay;
