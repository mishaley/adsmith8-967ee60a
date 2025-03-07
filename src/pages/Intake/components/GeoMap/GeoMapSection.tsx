
import React, { useRef, useEffect } from "react";
import 'mapbox-gl/dist/mapbox-gl.css';
// import { useMapboxToken } from "./hooks/useMapboxToken";
// import { useMapInitialization } from "./hooks/useMapInitialization";
import MapDisplay from "./components/MapDisplay";
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
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-1/3">
        <SelectionDisplay 
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          setSelectedCountryId={setSelectedCountryId}
          setExcludedCountryId={setExcludedCountryId}
        />
      </div>
      <div className="w-full lg:w-2/3">
        {/* Map display is commented out and replaced with a message */}
        <div className="h-[600px] bg-gray-100 rounded flex items-center justify-center">
          <div className="text-center p-6">
            <h3 className="font-medium text-lg text-gray-700">Map Temporarily Disabled</h3>
            <p className="text-gray-500 mt-2">
              The map feature has been temporarily disabled. Country selection is still available using the dropdown menu.
            </p>
          </div>
        </div>
        
        {/* Original map component (commented out)
        <MapDisplay 
          loading={loading} 
          error={error} 
          mapContainerRef={mapContainer} 
          selectedCountry={selectedCountry} 
          setSelectedCountry={setSelectedCountry} 
        />
        */}
      </div>
    </div>
  );
};

export default GeoMapSection;
