
import React, { useRef } from "react";
import 'mapbox-gl/dist/mapbox-gl.css';
import SelectionDisplay from "./components/SelectionDisplay";

interface GeoMapSectionProps {
  // Remove single-select props since we'll only use multi-select
  selectedCountries: string[];
  setSelectedCountries: (countries: string[]) => void;
  selectedLanguages: string[];
  setSelectedLanguages: (languages: string[]) => void;
  excludedCountries: string[];
  setExcludedCountries: (countries: string[]) => void;
}

const GeoMapSection: React.FC<GeoMapSectionProps> = ({
  selectedCountries,
  setSelectedCountries,
  selectedLanguages,
  setSelectedLanguages,
  excludedCountries,
  setExcludedCountries
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

  // Commented out map-related variables and functionality
  const loading = false;
  const error = null;
  const setSelectedCountryId = null;
  const setExcludedCountryId = null;

  return (
    <div className="flex flex-col" style={{ position: 'static', overflow: 'visible' }}>
      <div className="w-full max-w-md mx-auto" style={{ position: 'static', overflow: 'visible' }}>
        <SelectionDisplay 
          selectedCountries={selectedCountries}
          setSelectedCountries={setSelectedCountries}
          selectedLanguages={selectedLanguages}
          setSelectedLanguages={setSelectedLanguages}
          setSelectedCountryId={setSelectedCountryId}
          setExcludedCountryId={setExcludedCountryId}
          excludedCountries={excludedCountries}
          setExcludedCountries={setExcludedCountries}
        />
      </div>
      
      {/* Map completely removed from the UI */}
    </div>
  );
};

export default GeoMapSection;
