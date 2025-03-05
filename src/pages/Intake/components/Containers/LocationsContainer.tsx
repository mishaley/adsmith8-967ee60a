
import React from "react";
import LocationsSection from "../LocationsSection";

interface LocationsContainerProps {
  selectedCountry: string;
  setSelectedCountry: (value: string) => void;
}

const LocationsContainer: React.FC<LocationsContainerProps> = ({
  selectedCountry,
  setSelectedCountry
}) => {
  return (
    <LocationsSection
      selectedCountry={selectedCountry}
      setSelectedCountry={setSelectedCountry}
    />
  );
};

export default LocationsContainer;
