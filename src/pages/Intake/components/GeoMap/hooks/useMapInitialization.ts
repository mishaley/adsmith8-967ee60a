
import { useState, useEffect, useCallback } from "react";
import { useMapInstance } from "./map/useMapInstance";
import mapboxgl from 'mapbox-gl';
import { 
  addCountrySource, 
  addCountryFillLayer, 
  addCountryBorderLayer,
  setupHoverEvents,
  setupClickEvents,
  highlightCountry
} from './map/layers';

interface UseMapInitializationProps {
  mapboxToken: string | null;
  mapContainer: React.RefObject<HTMLDivElement>;
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
}

export const useMapInitialization = ({
  mapboxToken,
  mapContainer,
  selectedCountry,
  setSelectedCountry
}: UseMapInitializationProps) => {
  const [mapError, setMapError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [highlightCountryFn, setHighlightCountryFn] = useState<((id: string) => void) | null>(null);
  const [layersInitialized, setLayersInitialized] = useState(false);

  const {
    map,
    mapError: instanceError,
    initialized: mapInitialized
  } = useMapInstance({
    mapboxToken: mapboxToken || "",
    mapContainer
  });

  useEffect(() => {
    if (instanceError) {
      setMapError(instanceError);
    }
    setInitialized(mapInitialized);
  }, [instanceError, mapInitialized]);

  // Function to highlight a country
  const highlightCountryOnMap = useCallback((countryId: string) => {
    if (!map.current || !mapInitialized) {
      console.log("Map not ready yet for highlighting countries");
      return;
    }
    
    console.log(`Highlighting country: ${countryId}`);
    highlightCountry(map.current, countryId);
  }, [map, mapInitialized]);

  // Set the highlight function
  useEffect(() => {
    if (mapInitialized) {
      setHighlightCountryFn(() => highlightCountryOnMap);
    }
  }, [mapInitialized, highlightCountryOnMap]);

  // Initialize country layers
  useEffect(() => {
    if (!mapInitialized || !map.current || !mapboxToken || layersInitialized) {
      return;
    }

    try {
      // Add source and layers
      console.log("Initializing country layers...");
      
      // Wait for map style to be fully loaded before adding layers
      const initializeLayers = () => {
        if (map.current) {
          // Add the source
          addCountrySource(map.current);
          
          // Add the fill layer
          addCountryFillLayer(map.current);
          
          // Add the border layer
          addCountryBorderLayer(map.current);
          
          // Setup hover events
          setupHoverEvents(map.current);
          
          // Setup click events
          setupClickEvents(map.current, setSelectedCountry);
          
          // Mark layers as initialized
          setLayersInitialized(true);
          
          console.log("Country layers initialized successfully");
        }
      };
      
      // Check if style is already loaded
      if (map.current.isStyleLoaded()) {
        console.log("Map style already loaded, initializing layers now");
        initializeLayers();
      } else {
        // If not, wait for the style.load event
        console.log("Waiting for map style to load before initializing layers");
        map.current.on('style.load', initializeLayers);
      }
    } catch (err) {
      console.error('Error initializing country layers:', err);
      setMapError(`Failed to initialize countries: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [map, mapboxToken, mapInitialized, setSelectedCountry, layersInitialized]);

  // Effect to highlight the selected country when it changes
  useEffect(() => {
    if (selectedCountry && mapInitialized && layersInitialized && map.current) {
      console.log(`Selected country changed to: ${selectedCountry}, highlighting on map`);
      highlightCountry(map.current, selectedCountry);
    }
  }, [selectedCountry, mapInitialized, layersInitialized, map]);

  // Add a listener for the map's style.load event to ensure country data is available
  useEffect(() => {
    if (!map.current || !mapInitialized) return;
    
    const currentMap = map.current;
    
    const handleStyleLoad = () => {
      console.log("Map style fully loaded, checking if country layers need to be initialized");
      
      // Try to ensure the layers are initialized
      if (!layersInitialized) {
        try {
          addCountrySource(currentMap);
          addCountryFillLayer(currentMap);
          addCountryBorderLayer(currentMap);
          setupHoverEvents(currentMap);
          setupClickEvents(currentMap, setSelectedCountry);
          setLayersInitialized(true);
          console.log("Country layers initialized on style.load");
        } catch (err) {
          console.error('Error initializing country layers on style.load:', err);
        }
      }
      
      // Try to highlight the country again if one is selected
      if (selectedCountry) {
        console.log(`Re-highlighting country ${selectedCountry} after style.load`);
        highlightCountry(currentMap, selectedCountry);
      }
    };
    
    // Add the event listener
    currentMap.on('style.load', handleStyleLoad);
    
    // If the style is already loaded, call the handler directly
    if (currentMap.isStyleLoaded()) {
      console.log("Map style already loaded, running handler directly");
      handleStyleLoad();
    }
    
    // Clean up on unmount
    return () => {
      currentMap.off('style.load', handleStyleLoad);
    };
  }, [map, mapInitialized, selectedCountry, layersInitialized, setSelectedCountry]);

  return { 
    mapError, 
    initialized: mapInitialized && layersInitialized, 
    setSelectedCountryId: highlightCountryFn 
  };
};
