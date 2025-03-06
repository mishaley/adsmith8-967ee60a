
import { useState, useEffect, useCallback } from 'react';
import { applyMapStyling } from '../../utils/mapStylingUtils';

interface UseDirectLayerInitializationProps {
  map: React.MutableRefObject<mapboxgl.Map | null>;
  setupInteractions: () => void;
}

export const useDirectLayerInitialization = ({
  map,
  setupInteractions
}: UseDirectLayerInitializationProps) => {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Setup map layers and sources
  const setupLayers = useCallback(async () => {
    if (!map.current) {
      console.log("Map not initialized, cannot setup layers");
      return;
    }

    try {
      console.log("Setting up direct GeoJSON layers and sources");
      
      // Wait until the style is loaded
      if (!map.current.isStyleLoaded()) {
        console.log("Map style not loaded yet, setting up style.load event");
        map.current.once('style.load', () => {
          console.log("Style loaded, now setting up sources and layers");
          setupLayers();
        });
        return;
      }
      
      // Check if the source already exists
      if (!map.current.getSource('countries-geojson')) {
        console.log("Adding countries-geojson source");
        
        // Fetch GeoJSON data from Supabase Edge Function
        let geoJsonData;
        try {
          console.log("Fetching countries GeoJSON from edge function");
          const response = await fetch('/functions/v1/get-countries-geojson');
          
          if (!response.ok) {
            throw new Error(`Failed to fetch countries GeoJSON: ${response.statusText}`);
          }
          
          geoJsonData = await response.json();
          console.log(`Fetched GeoJSON with ${geoJsonData.features.length} countries`);
        } catch (fetchError) {
          console.error("Error fetching GeoJSON:", fetchError);
          throw new Error(`Failed to load countries GeoJSON: ${fetchError.message}`);
        }
        
        // Add the GeoJSON source
        map.current.addSource('countries-geojson', {
          type: 'geojson',
          data: geoJsonData,
          generateId: true
        });
      }
      
      // Add fill layer for countries
      if (!map.current.getLayer('countries-fill')) {
        console.log("Adding countries-fill layer");
        map.current.addLayer({
          id: 'countries-fill',
          type: 'fill',
          source: 'countries-geojson',
          layout: {},
          paint: {
            'fill-color': [
              'case',
              ['boolean', ['feature-state', 'excluded'], false], '#990000',  // Red for excluded
              ['boolean', ['feature-state', 'selected'], false], '#4264fb',  // Blue for selected
              ['boolean', ['feature-state', 'hover'], false], '#627BC1',     // Light blue for hover
              '#d1d9e6'  // Default color
            ],
            'fill-opacity': [
              'case',
              ['boolean', ['feature-state', 'excluded'], false], 0.8,        // Higher opacity for excluded
              ['boolean', ['feature-state', 'selected'], false], 0.5,        // Medium opacity for selected
              ['boolean', ['feature-state', 'hover'], false], 0.5,           // Medium opacity for hover
              0.2  // Low opacity for default
            ]
          }
        });
      }
      
      // Add outline layer for country borders
      if (!map.current.getLayer('countries-outline')) {
        console.log("Adding countries-outline layer");
        map.current.addLayer({
          id: 'countries-outline',
          type: 'line',
          source: 'countries-geojson',
          layout: {},
          paint: {
            'line-color': [
              'case',
              ['boolean', ['feature-state', 'excluded'], false], '#990000',  // Red for excluded
              ['boolean', ['feature-state', 'selected'], false], '#4264fb',  // Blue for selected
              ['boolean', ['feature-state', 'hover'], false], '#627BC1',     // Light blue for hover
              '#627BC1'  // Default border color
            ],
            'line-width': [
              'case',
              ['boolean', ['feature-state', 'excluded'], false], 2,          // Thicker for excluded
              ['boolean', ['feature-state', 'selected'], false], 2,          // Thicker for selected
              ['boolean', ['feature-state', 'hover'], false], 1.5,           // Medium for hover
              0.75  // Thin for default
            ]
          }
        });
      }
      
      // Apply map styling after layers are added
      applyMapStyling(map.current);
      
      // Setup interactions (hover, click, etc.)
      setupInteractions();
      
      console.log("Layers setup complete, marking as initialized");
      setInitialized(true);
    } catch (err) {
      console.error("Error setting up map layers:", err);
      setError(`Failed to initialize map layers: ${err.message}`);
    }
  }, [map, setupInteractions]);

  // Initialize when the map is ready
  useEffect(() => {
    if (map.current && !initialized && !error) {
      console.log("Map is ready, setting up layers");
      setupLayers();
    }
  }, [map, initialized, error, setupLayers]);

  return {
    initialized,
    error
  };
};
