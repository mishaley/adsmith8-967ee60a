
import React from "react";
import { useCountryLanguage } from "../../Languages/hooks/useCountryLanguage";
import CountryStatusDisplay from "./CountryStatusDisplay";
import CountrySelection from "./CountrySelection";
import LanguageSelection from "./LanguageSelection";

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
      <div>
        <LanguageSelection 
          selectedLanguage={selectedLanguage} 
          setSelectedLanguage={setSelectedLanguage} 
          isLoadingCountry={isLoadingCountry} 
          primaryLanguageId={primaryLanguageId} 
        />
      </div>
    </div>
  );
};

export default SelectionDisplay;
