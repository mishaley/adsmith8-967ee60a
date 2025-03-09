
import React, { useRef } from "react";
import 'mapbox-gl/dist/mapbox-gl.css';
import SelectionDisplay from "./components/SelectionDisplay";

interface GeoMapSectionProps {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  // Add multi-select props
  selectedCountries?: string[];
  setSelectedCountries?: (countries: string[]) => void;
  selectedLanguages?: string[];
  setSelectedLanguages?: (languages: string[]) => void;
  // Add excluded countries props
  excludedCountries?: string[];
  setExcludedCountries?: (countries: string[]) => void;
}

const GeoMapSection: React.FC<GeoMapSectionProps> = ({
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

  // Removed the effect that was enforcing English for worldwide selection

  // Commented out map-related variables and functionality
  const loading = false;
  const error = null;
  const setSelectedCountryId = null;
  const setExcludedCountryId = null;

  return (
    <div className="flex flex-col" style={{ position: 'static', overflow: 'visible' }}>
      <div className="w-full max-w-md mx-auto" style={{ position: 'static', overflow: 'visible' }}>
        <SelectionDisplay 
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          setSelectedCountryId={setSelectedCountryId}
          setExcludedCountryId={setExcludedCountryId}
          selectedCountries={selectedCountries}
          setSelectedCountries={setSelectedCountries}
          selectedLanguages={selectedLanguages}
          setSelectedLanguages={setSelectedLanguages}
          excludedCountries={excludedCountries}
          setExcludedCountries={setExcludedCountries}
        />
      </div>
      
      {/* Map completely removed from the UI */}
    </div>
  );
};

export default GeoMapSection;
