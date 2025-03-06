
import { useState, useCallback } from "react";
import mapboxgl from 'mapbox-gl';
import { 
  addCountrySource, 
  addCountryFillLayer, 
  addCountryBorderLayer,
  setupHoverEvents,
  setupClickEvents,
  addCoastlineLayer
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
    console.log("Initializing map layers...");
    
    try {
      // Step 1: Add the source first and wait for it to be fully loaded
      console.log("Adding country source...");
      addCountrySource(mapInstance);
      
      // Step 2: Check if the source has been properly added before proceeding
      if (!mapInstance.getSource('countries')) {
        console.error("Failed to add countries source. Checking for style load completion...");
        
        // If we're still loading, set up a listener for the style.load event
        if (!mapInstance.isStyleLoaded()) {
          console.log("Style not fully loaded, setting up style.load listener");
          mapInstance.once('style.load', () => {
            console.log("Style load event triggered, retrying layer initialization");
            initializeLayers(mapInstance);
          });
          return; // Exit and wait for the style to load
        }
      } else {
        console.log("Countries source successfully added");
      }
      
      // Step 3: Add the fill layer (this will be underneath)
      console.log("Adding country fill layer...");
      addCountryFillLayer(mapInstance);
      
      // Step 4: Add the border layer on top for visibility
      console.log("Adding country border layer...");
      addCountryBorderLayer(mapInstance);
      
      // Step 5: Add coastline layer
      console.log("Adding coastline layer...");
      addCoastlineLayer(mapInstance);
      
      // Step 6: Setup hover events
      console.log("Setting up hover events...");
      setupHoverEvents(mapInstance);
      
      // Step 7: Setup click handlers
      console.log("Setting up click events...");
      setupClickEvents(mapInstance, (countryId) => {
        console.log(`Map click detected, setting selected country to: ${countryId}`);
        setSelectedCountry(countryId);
      });
      
      // Mark initialization as complete
      setLayersInitialized(true);
      console.log("Country layers initialized successfully");
      
      // Verify layers were added
      console.log("Layers in map:", mapInstance.getStyle().layers?.map(l => l.id).join(', '));
    } catch (err) {
      console.error("Error initializing layers:", err);
    }
  }, [setSelectedCountry]);

  return { 
    layersInitialized, 
    initializeLayers 
  };
};
