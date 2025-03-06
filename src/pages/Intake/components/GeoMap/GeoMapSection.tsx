
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
  const [initializationComplete, setInitializationComplete] = useState(false);
  
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

  // Track when initialization is fully complete
  useEffect(() => {
    if (initialized && !initializationComplete) {
      console.log("Map initialization is now complete");
      setInitializationComplete(true);
      
      // Apply initial selection if one exists
      if (selectedCountry && setSelectedCountryId) {
        console.log(`Applying initial country selection: ${selectedCountry}`);
        setSelectedCountryId(selectedCountry);
        setLastHighlightAttempt(selectedCountry);
      }
    }
  }, [initialized, initializationComplete, selectedCountry, setSelectedCountryId]);

  // Sync map selection when selectedCountry changes (e.g., from dropdown)
  useEffect(() => {
    if (initialized && setSelectedCountryId) {
      console.log(`GeoMapSection: Syncing country selection to map: ${selectedCountry}`);
      
      // Always attempt to highlight/unhighlight when the country changes
      setSelectedCountryId(selectedCountry);
      setLastHighlightAttempt(selectedCountry);
    }
  }, [selectedCountry, initialized, setSelectedCountryId]);

  // Enhanced retry mechanism for highlighting countries
  useEffect(() => {
    let retryTimer: NodeJS.Timeout;
    
    if (initialized && selectedCountry) {
      // Initial retry after a delay
      retryTimer = setTimeout(() => {
        if (setSelectedCountryId) {
          console.log(`Retry 1: Ensuring country selection for ${selectedCountry}`);
          setSelectedCountryId(selectedCountry);
        }
      }, 1000);
      
      // Secondary retry with a longer delay
      const secondaryRetryTimer = setTimeout(() => {
        if (setSelectedCountryId && initialized) {
          console.log(`Retry 2: Final attempt for country selection ${selectedCountry}`);
          setSelectedCountryId(selectedCountry);
          
          // Show a toast for user feedback
          toast.info("Refreshing map selection...", {
            duration: 2000,
          });
        }
      }, 3000);
      
      return () => {
        clearTimeout(retryTimer);
        clearTimeout(secondaryRetryTimer);
      };
    }
    
    return () => {
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [initialized, selectedCountry, setSelectedCountryId]);

  // Combine errors from both hooks
  const error = tokenError || mapError;

  // Debug logging
  console.log("GeoMapSection state:", {
    loading,
    hasToken: !!mapboxToken,
    tokenLength: mapboxToken ? mapboxToken.length : 0,
    error,
    initialized,
    initializationComplete,
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
