
import React, { useRef, useEffect, useState } from "react";
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
  const [lastHighlightAttempt, setLastHighlightAttempt] = useState<string | null>(null);
  
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

  // Sync map selection when selectedCountry changes (e.g., from dropdown)
  useEffect(() => {
    if (initialized && setSelectedCountryId) {
      console.log(`GeoMapSection: Syncing country selection to map: ${selectedCountry}`);
      
      // Avoid redundant highlight attempts for the same country
      if (lastHighlightAttempt !== selectedCountry) {
        setSelectedCountryId(selectedCountry);
        setLastHighlightAttempt(selectedCountry);
      }
    }
  }, [selectedCountry, initialized, setSelectedCountryId, lastHighlightAttempt]);

  // If the map gets initialized later, try to highlight the selected country
  useEffect(() => {
    if (initialized && setSelectedCountryId && selectedCountry && !lastHighlightAttempt) {
      console.log(`Map initialized, highlighting previously selected country: ${selectedCountry}`);
      setSelectedCountryId(selectedCountry);
      setLastHighlightAttempt(selectedCountry);
    }
  }, [initialized, selectedCountry, setSelectedCountryId, lastHighlightAttempt]);

  // Retry country selection if initialization happened after country was selected
  useEffect(() => {
    let retryTimer: NodeJS.Timeout;
    
    if (initialized && selectedCountry && lastHighlightAttempt === selectedCountry) {
      // After a delay, check if we need to retry
      retryTimer = setTimeout(() => {
        console.log(`Retry country selection for ${selectedCountry}`);
        if (setSelectedCountryId) {
          setSelectedCountryId(selectedCountry);
          
          // Show a toast if we're having to retry
          toast.info("Refreshing map selection...", {
            duration: 2000,
          });
        }
      }, 2000);
    }
    
    return () => {
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [initialized, selectedCountry, setSelectedCountryId, lastHighlightAttempt]);

  // Combine errors from both hooks
  const error = tokenError || mapError;

  // Debug logging
  console.log("GeoMapSection state:", {
    loading,
    hasToken: !!mapboxToken,
    tokenLength: mapboxToken ? mapboxToken.length : 0,
    error,
    initialized,
    selectedCountry,
    lastHighlightAttempt
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
