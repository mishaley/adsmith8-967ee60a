
import React from "react";
import LocationsSection from "../LocationsSection";

interface LocationsContainerProps {
  selectedCountry: string;
  setSelectedCountry: (value: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (value: string) => void;
}

const LocationsContainer: React.FC<LocationsContainerProps> = ({
  selectedCountry,
  setSelectedCountry,
  selectedLanguage,
  setSelectedLanguage
}) => {
  return (
    <LocationsSection
      selectedCountry={selectedCountry}
      setSelectedCountry={setSelectedCountry}
      selectedLanguage={selectedLanguage}
      setSelectedLanguage={setSelectedLanguage}
    />
  );
};

export default LocationsContainer;
