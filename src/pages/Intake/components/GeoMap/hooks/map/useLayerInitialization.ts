
import { useState, useCallback } from "react";
import mapboxgl from 'mapbox-gl';
import { 
  addCountrySource, 
  addCountryFillLayer, 
  addCountryBorderLayer,
  setupHoverEvents,
  setupClickEvents
} from './layers';

/**
 * Hook to handle map layer initialization
 * @param map Reference to the Mapbox GL map instance
 * @param setSelectedCountry Callback to set the selected country
 * @returns Object with initialization state and functions
 */
export const useLayerInitialization = (
  map: React.MutableRefObject<mapboxgl.Map | null>,
  setSelectedCountry: (country: string) => void
) => {
  const [layersInitialized, setLayersInitialized] = useState(false);

  // Initialize map layers in the correct order
  const initializeLayers = useCallback((mapInstance: mapboxgl.Map) => {
    // Step 1: Add the source first
    addCountrySource(mapInstance);
    
    // Step 2: Add the fill layer (this will be underneath)
    addCountryFillLayer(mapInstance);
    
    // Step 3: Add the border layer on top for visibility
    addCountryBorderLayer(mapInstance);
    
    // Step 4: Setup hover events
    setupHoverEvents(mapInstance);
    
    // Step 5: Setup click handlers
    setupClickEvents(mapInstance, (countryId) => {
      console.log(`Map click detected, setting selected country to: ${countryId}`);
      setSelectedCountry(countryId);
    });
    
    // Mark initialization as complete
    setLayersInitialized(true);
    console.log("Country layers initialized successfully");
  }, [setSelectedCountry]);

  return { 
    layersInitialized, 
    initializeLayers 
  };
};
