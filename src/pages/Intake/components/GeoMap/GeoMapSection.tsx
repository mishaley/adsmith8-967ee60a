
import React, { useRef, useEffect } from "react";
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapboxToken } from "./hooks/useMapboxToken";
import { useMapInitialization } from "./hooks/useMapInitialization";
import MapDisplay from "./components/MapDisplay";
import SelectionDisplay from "./components/SelectionDisplay";
import { toast } from "sonner";

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
  
  const {
    loading,
    mapboxToken,
    error: tokenError
  } = useMapboxToken();
  
  const {
    mapError,
    initialized,
    setSelectedCountryId
  } = useMapInitialization({
    mapboxToken,
    mapContainer,
    selectedCountry,
    setSelectedCountry
  });

  // Apply initial selection when map is ready
  useEffect(() => {
    if (initialized && selectedCountry && setSelectedCountryId) {
      console.log(`Applying stored country selection: ${selectedCountry}`);
      setSelectedCountryId(selectedCountry);
    }
  }, [initialized, selectedCountry, setSelectedCountryId]);

  // Manual refresh function for debugging
  const forceMapRefresh = () => {
    toast.info("Manually refreshing map...", { duration: 2000 });
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  // Combine errors from both hooks
  const error = tokenError || mapError;

  // Debug logging
  console.log("GeoMapSection state:", {
    loading,
    hasToken: !!mapboxToken,
    tokenLength: mapboxToken ? mapboxToken.length : 0,
    error,
    initialized,
    selectedCountry
  });

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-1/3">
        <SelectionDisplay 
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          setSelectedCountryId={setSelectedCountryId}
        />
      </div>
      <div className="w-full lg:w-2/3">
        <MapDisplay 
          loading={loading} 
          error={error} 
          mapContainerRef={mapContainer} 
          selectedCountry={selectedCountry} 
          setSelectedCountry={setSelectedCountry} 
        />
      </div>
    </div>
  );
};

export default GeoMapSection;
