
import React from "react";
import LocationsSection from "../LocationsSection";

interface LocationsContainerProps {
  // Remove single-select props from interface
  selectedCountries: string[];
  setSelectedCountries: (values: string[]) => void;
  selectedLanguages: string[];
  setSelectedLanguages: (values: string[]) => void;
  excludedCountries: string[];
  setExcludedCountries: (values: string[]) => void;
}

const LocationsContainer: React.FC<LocationsContainerProps> = ({
  selectedCountries,
  setSelectedCountries,
  selectedLanguages,
  setSelectedLanguages,
  excludedCountries,
  setExcludedCountries
}) => {
  return (
    <LocationsSection
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
