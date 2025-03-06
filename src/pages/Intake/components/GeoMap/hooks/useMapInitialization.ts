
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

  // Initialize country layers
  useEffect(() => {
    if (!mapInitialized || !map.current || !mapboxToken || layersInitialized) {
      return;
    }

    try {
      console.log("Waiting for map to be ready before initializing layers...");
      
      // Wait for map style to be fully loaded
      if (map.current.isStyleLoaded()) {
        console.log("Map style already loaded, initializing layers now");
        initializeLayers(map.current);
      } else {
        // If style not loaded yet, wait for it
        console.log("Map style not loaded yet, setting up style.load event handler");
        map.current.on('style.load', () => {
          console.log("Map style loaded event fired, initializing layers now");
          if (map.current) {
            initializeLayers(map.current);
          }
        });
      }
    } catch (err) {
      console.error('Error initializing country layers:', err);
      setMapError(`Failed to initialize countries: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [map, mapboxToken, mapInitialized, initializeLayers, layersInitialized]);

  // Effect to highlight the selected country when it changes
  useEffect(() => {
    if (selectedCountry && mapInitialized && layersInitialized && map.current) {
      console.log(`Selected country changed to: ${selectedCountry}, highlighting on map`);
      highlightCountry(map.current, selectedCountry);
    }
  }, [selectedCountry, mapInitialized, layersInitialized, map]);

  return { 
    mapError, 
    initialized: mapInitialized && layersInitialized, 
    setSelectedCountryId: highlightCountryFn 
  };
};
