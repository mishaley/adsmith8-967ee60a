
import { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { getCountriesGeoJSON } from '../../data/countriesGeoJSON';
import { toast } from "sonner";

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

  // Add GeoJSON source and layers to the map
  useEffect(() => {
    let isMounted = true;
    
    const initializeLayers = async () => {
      if (!map.current || initialized) return;
      
      try {
        console.log("Adding direct GeoJSON layers to map");
        
        // Wait for the map style to be loaded
        if (!map.current.isStyleLoaded()) {
          console.log("Map style not loaded yet, waiting...");
          map.current.once('style.load', () => {
            // Style loaded, try again
            initializeLayers();
          });
          return;
        }
        
        // Get the GeoJSON data
        const geojsonData = await getCountriesGeoJSON();
        
        if (!isMounted || !map.current) {
          console.log("Component unmounted or map removed during GeoJSON fetch");
          return;
        }
        
        // Add the GeoJSON source with the direct data
        console.log("Adding countries GeoJSON source");
        
        // Check if source already exists
        if (!map.current.getSource('countries-geojson')) {
          map.current.addSource('countries-geojson', {
            type: 'geojson',
            data: geojsonData,
            generateId: true  // Auto-generate feature IDs for state
          });
        }
        
        // Add a fill layer
        if (!map.current.getLayer('countries-fill')) {
          console.log("Adding countries fill layer");
          map.current.addLayer({
            id: 'countries-fill',
            type: 'fill',
            source: 'countries-geojson',
            paint: {
              'fill-color': [
                'case',
                ['boolean', ['feature-state', 'selected'], false],
                '#154851',  // Selected country color
                ['boolean', ['feature-state', 'hover'], false],
                '#8ebdc2',  // Hover color
                'rgba(200, 200, 200, 0.03)'  // Default fill is very light
              ],
              'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'selected'], false],
                0.8,  // Higher opacity for selected country
                ['boolean', ['feature-state', 'hover'], false],
                0.6,  // Medium opacity for hover
                0.4   // Low opacity for default state
              ]
            }
          });
        }
        
        // Add a line layer for borders
        if (!map.current.getLayer('countries-line')) {
          console.log("Adding countries line layer");
          map.current.addLayer({
            id: 'countries-line',
            type: 'line',
            source: 'countries-geojson',
            paint: {
              'line-color': [
                'case',
                ['boolean', ['feature-state', 'selected'], false],
                '#154851',  // Selected country border color
                ['boolean', ['feature-state', 'hover'], false],
                '#8ebdc2',  // Hover color
                '#c8c8c9'   // Default border color
              ],
              'line-width': [
                'case',
                ['boolean', ['feature-state', 'selected'], false],
                2,  // Selected border width
                ['boolean', ['feature-state', 'hover'], false],
                1.5,  // Hover border width
                0.8   // Default border width
              ]
            },
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            }
          });
        }
        
        // Setup click event for country selection
        setupInteractions();
        
        if (isMounted) {
          setInitialized(true);
          console.log("GeoJSON layers successfully initialized");
          
          // Notify user
          toast.success("Map loaded successfully", {
            duration: 2000,
          });
        }
      } catch (err) {
        console.error("Error initializing GeoJSON layers:", err);
        if (isMounted) {
          setError(`Failed to initialize map: ${err instanceof Error ? err.message : String(err)}`);
        }
      }
    };
    
    initializeLayers();
    
    return () => {
      isMounted = false;
    };
  }, [map, initialized, setupInteractions]);

  return { initialized, error };
};
