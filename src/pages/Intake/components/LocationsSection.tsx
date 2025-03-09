
import React, { useState, useEffect } from "react";
import GeoMapSection from "./GeoMap/GeoMapSection";
import { saveToLocalStorage, loadFromLocalStorage, STORAGE_KEYS } from "../utils/localStorageUtils";
import CollapsibleSection from "./CollapsibleSection";
import { useCountryLanguage } from "./Languages/hooks/useCountryLanguage";

interface LocationsSectionProps {
  selectedCountry: string;
  setSelectedCountry: (value: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (value: string) => void;
  // Add multi-select props
  selectedCountries?: string[];
  setSelectedCountries?: (values: string[]) => void;
  selectedLanguages?: string[];
  setSelectedLanguages?: (values: string[]) => void;
  // Add excluded countries props
  excludedCountries?: string[];
  setExcludedCountries?: (values: string[]) => void;
}

const LocationsSection: React.FC<LocationsSectionProps> = ({
  selectedCountry,
  setSelectedCountry,
  selectedLanguage,
  setSelectedLanguage,
  selectedCountries = [],
  setSelectedCountries,
  selectedLanguages = [],
  setSelectedLanguages,
  excludedCountries = [],
  setExcludedCountries
}) => {
  const [locationGroupName, setLocationGroupName] = useState(() => 
    loadFromLocalStorage<string>(STORAGE_KEYS.LOCATION + "_groupName", "")
  );
  
  const {
    primaryLanguageId,
    countryName
  } = useCountryLanguage(selectedCountry);

  // Remove the effect that sets language based on country selection
  // This was the automatic behavior we want to remove

  // Save location group name when it changes
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.LOCATION + "_groupName", locationGroupName);
  }, [locationGroupName]);

  return (
    <CollapsibleSection title="LOCATIONS">
      <div className="max-w-md mx-auto">
        <GeoMapSection 
          selectedCountry={selectedCountry} 
          setSelectedCountry={setSelectedCountry}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          selectedCountries={selectedCountries}
          setSelectedCountries={setSelectedCountries}
          selectedLanguages={selectedLanguages}
          setSelectedLanguages={setSelectedLanguages}
          excludedCountries={excludedCountries}
          setExcludedCountries={setExcludedCountries}
        />
      </div>
    </CollapsibleSection>
  );
};

export default LocationsSection;
