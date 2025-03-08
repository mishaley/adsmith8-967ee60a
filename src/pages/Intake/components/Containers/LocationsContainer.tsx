
import React from "react";
import LocationsSection from "../LocationsSection";

interface LocationsContainerProps {
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

const LocationsContainer: React.FC<LocationsContainerProps> = ({
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
  return (
    <LocationsSection
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
  );
};

export default LocationsContainer;
