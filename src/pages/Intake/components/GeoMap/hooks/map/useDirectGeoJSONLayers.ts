
import { useState } from 'react';
// Commented out imports that aren't needed when map is disabled
// import { useDirectLayerInitialization } from './layers/directGeoJSON/useDirectLayerInitialization';
// import { useDirectMapInteractions } from './layers/directGeoJSON/useDirectMapInteractions';
// import { useDirectCountryHighlighting } from './layers/directGeoJSON/useDirectCountryHighlighting';

interface UseDirectGeoJSONLayersProps {
  map: React.MutableRefObject<mapboxgl.Map | null>;
  onCountrySelected: (countryId: string) => void;
}

export const useDirectGeoJSONLayers = ({ 
  map, 
  onCountrySelected 
}: UseDirectGeoJSONLayersProps) => {
  const [error] = useState<string | null>(null);
  const [layersInitialized] = useState(false);

  // All functionality is disabled to prevent background processes
  /*
  // Setup country highlighting capabilities
  const {
    selectedCountryId,
    setSelectedCountryId,
    excludedCountryId,
    setExcludedCountryId,
    highlightCountry,
    highlightExcludedCountry,
    clearCountrySelection,
    clearExcludedCountry
  } = useDirectCountryHighlighting({
    map,
    initialized: layersInitialized
  });

  // Setup map interactions (hover, click, etc.)
  const { setupInteractions } = useDirectMapInteractions({
    map,
    onCountrySelected,
    clearCountrySelection,
    selectedCountryId,
    setSelectedCountryId
  });

  // Initialize map layers
  const {
    initialized,
    error: initError
  } = useDirectLayerInitialization({
    map,
    setupInteractions
  });

  // Update internal state when layers are initialized
  useEffect(() => {
    if (initialized && !layersInitialized) {
      console.log("Layers initialized, updating internal state");
      setLayersInitialized(true);
    }
  }, [initialized, layersInitialized]);

  // Update error state when initialization error occurs
  useEffect(() => {
    if (initError) {
      setError(initError);
    }
  }, [initError]);
  */

  // Return empty/dummy implementations of the functions
  return {
    initialized: false,
    error,
    highlightCountry: (countryId: string) => {},
    highlightExcludedCountry: (countryId: string) => {},
    clearCountrySelection: () => {},
    clearExcludedCountry: () => {},
    selectedCountryId: null,
    excludedCountryId: null
  };
};
