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
    setSelectedCountry('');
    if (setSelectedCountryId) {
      setSelectedCountryId('');
    }
  };
  return <div className="w-full bg-transparent rounded-lg p-4 border-transparent">
      
      
      {/* Country Selection */}
      <CountrySelection selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} setSelectedCountryId={setSelectedCountryId} countryName={countryName} />

      {/* Language Selection */}
      <LanguageSelection selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} isLoadingCountry={isLoadingCountry} primaryLanguageId={primaryLanguageId} />
      
      {/* Map Selection Status - moved below the dropdowns */}
      <div className="mt-6">
        <div className="font-bold text-lg mb-4">Selected from Map</div>
        <CountryStatusDisplay selectedCountry={selectedCountry} countryName={countryName} onClearSelection={handleClearSelection} />
      </div>
    </div>;
};
export default SelectionDisplay;