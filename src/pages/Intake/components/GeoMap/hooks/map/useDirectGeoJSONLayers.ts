
import { useState, useEffect } from 'react';
import { useDirectLayerInitialization } from './layers/directGeoJSON/useDirectLayerInitialization';
import { useDirectMapInteractions } from './layers/directGeoJSON/useDirectMapInteractions';
import { useDirectCountryHighlighting } from './layers/directGeoJSON/useDirectCountryHighlighting';

interface UseDirectGeoJSONLayersProps {
  map: React.MutableRefObject<mapboxgl.Map | null>;
  onCountrySelected: (countryId: string) => void;
}

export const useDirectGeoJSONLayers = ({ 
  map, 
  onCountrySelected 
}: UseDirectGeoJSONLayersProps) => {
  const [error, setError] = useState<string | null>(null);

  // Setup country highlighting capabilities
  const {
    selectedCountryId,
    setSelectedCountryId,
    highlightCountry,
    clearCountrySelection
  } = useDirectCountryHighlighting({
    map,
    initialized: false // We'll update this after initialization
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

  // Update error state when initialization error occurs
  useEffect(() => {
    if (initError) {
      setError(initError);
    }
  }, [initError]);

  return {
    initialized,
    error,
    highlightCountry,
    clearCountrySelection,
    selectedCountryId
  };
};
