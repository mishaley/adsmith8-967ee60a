
import React, { useState, useEffect } from "react";
import GeoMapSection from "./GeoMap/GeoMapSection";
import { saveToLocalStorage, loadFromLocalStorage, STORAGE_KEYS } from "../utils/localStorageUtils";
import CollapsibleSection from "./CollapsibleSection";
import { useCountryLanguage } from "./Languages/hooks/useCountryLanguage";
import { useCountries } from "./GeoMap/hooks/useCountries";

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

  // Get country names for display in collapsed section title
  const { countries } = useCountries();
  
  // Generate a display string for selected countries
  const getSelectedCountriesDisplay = (): string => {
    if (selectedCountries.length === 0) {
      return "";
    }
    
    // Handle worldwide selection
    if (selectedCountries.includes("worldwide")) {
      return "Worldwide";
    }
    
    // Get country names from their IDs
    const countryNames = selectedCountries.map(countryId => {
      const country = countries.find(c => c.country_id === countryId);
      return country?.country_name || countryId;
    });
    
    // Join the first 2 country names and add "..." if there are more
    if (countryNames.length <= 2) {
      return countryNames.join(", ");
    } else {
      return `${countryNames.slice(0, 2).join(", ")} + ${countryNames.length - 2} more`;
    }
  };

  // Save location group name when it changes
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.LOCATION + "_groupName", locationGroupName);
  }, [locationGroupName]);

  // Get the display value for selected countries
  const selectedValue = getSelectedCountriesDisplay();

  return (
    <CollapsibleSection title="LOCATIONS" selectedValue={selectedValue}>
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
