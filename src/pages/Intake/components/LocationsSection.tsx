
import React, { useState, useEffect } from "react";
import GeoMapSection from "./GeoMap/GeoMapSection";
import { saveToLocalStorage, loadFromLocalStorage, STORAGE_KEYS } from "../utils/localStorageUtils";
import CollapsibleSection from "./CollapsibleSection";
import { useCountryLanguage } from "./Languages/hooks/useCountryLanguage";

interface LocationsSectionProps {
  // Remove single-select props from interface
  selectedCountries: string[];
  setSelectedCountries: (values: string[]) => void;
  selectedLanguages: string[];
  setSelectedLanguages: (values: string[]) => void;
  excludedCountries: string[];
  setExcludedCountries: (values: string[]) => void;
}

const LocationsSection: React.FC<LocationsSectionProps> = ({
  selectedCountries,
  setSelectedCountries,
  selectedLanguages,
  setSelectedLanguages,
  excludedCountries,
  setExcludedCountries
}) => {
  const [locationGroupName, setLocationGroupName] = useState(() => 
    loadFromLocalStorage<string>(STORAGE_KEYS.LOCATION + "_groupName", "")
  );

  // Save location group name when it changes
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.LOCATION + "_groupName", locationGroupName);
  }, [locationGroupName]);

  return (
    <CollapsibleSection title="LOCATIONS">
      <div className="max-w-md mx-auto">
        <GeoMapSection 
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
