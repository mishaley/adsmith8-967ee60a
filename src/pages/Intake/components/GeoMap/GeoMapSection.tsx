
import React, { useRef, useEffect } from "react";
import 'mapbox-gl/dist/mapbox-gl.css';
// import { useMapboxToken } from "./hooks/useMapboxToken";
// import { useMapInitialization } from "./hooks/useMapInitialization";
import SelectionDisplay from "./components/SelectionDisplay";

interface GeoMapSectionProps {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
}

const GeoMapSection: React.FC<GeoMapSectionProps> = ({
  selectedCountry,
  setSelectedCountry,
  selectedLanguage,
  setSelectedLanguage
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  
  // Commented out for now to disable map functionality
  /*
  const {
    loading,
    mapboxToken,
    error: tokenError
  } = useMapboxToken();
  
  const {
    mapError,
    initialized,
    setSelectedCountryId,
    setExcludedCountryId
  } = useMapInitialization({
    mapboxToken,
    mapContainer,
    selectedCountry,
    setSelectedCountry
  });
  */

  // Ensure the language is set properly when country is set to worldwide
  useEffect(() => {
    if (selectedCountry === "worldwide" && selectedLanguage !== "en") {
      console.log("GeoMapSection: Ensuring English is set for Worldwide selection");
      setSelectedLanguage("en");
    }
  }, [selectedCountry, selectedLanguage, setSelectedLanguage]);

  // Commented out map-related variables and functionality
  const loading = false;
  const error = null;
  const setSelectedCountryId = null;
  const setExcludedCountryId = null;

  return (
    <div className="flex flex-col">
      <div className="w-full max-w-md mx-auto">
        <SelectionDisplay 
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          setSelectedCountryId={setSelectedCountryId}
          setExcludedCountryId={setExcludedCountryId}
        />
      </div>
      
      {/* Map completely removed from the UI */}
    </div>
  );
};

export default GeoMapSection;
