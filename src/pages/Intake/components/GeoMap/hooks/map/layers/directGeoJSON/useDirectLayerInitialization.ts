
import { useState, useEffect, useRef } from 'react';
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
  const initializationAttempted = useRef(false);

  // Add GeoJSON source and layers to the map
  useEffect(() => {
    let isMounted = true;
    let retryTimeout: NodeJS.Timeout;
    
    const initializeLayers = async () => {
      if (!map.current || initialized || initializationAttempted.current) return;
      
      initializationAttempted.current = true;
      
      try {
        console.log("Adding direct GeoJSON layers to map");
        
        // Check if the map is fully loaded
        if (!map.current.isStyleLoaded()) {
          console.log("Map style not loaded yet, waiting for style.load event");
          
          // Set up an event listener for style.load
          const styleLoadHandler = () => {
            console.log("Style load event fired, initializing layers");
            initializeLayers();
          };
          
          map.current.once('style.load', styleLoadHandler);
          
          // Also set a backup timeout in case the event doesn't fire
          retryTimeout = setTimeout(() => {
            console.log("Timeout reached, forcing layer initialization");
            if (map.current) {
              map.current.off('style.load', styleLoadHandler);
              initializeLayers();
            }
          }, 3000);
          
          return;
        }
        
        // Get the GeoJSON data
        console.log("Fetching GeoJSON data");
        const geojsonData = await getCountriesGeoJSON();
        
        if (!isMounted || !map.current) {
          console.log("Component unmounted or map removed during GeoJSON fetch");
          return;
        }
        
        console.log("Adding countries GeoJSON source");
        
        // Remove existing source and layers if they exist (cleanup)
        try {
          if (map.current.getLayer('countries-fill')) {
            map.current.removeLayer('countries-fill');
          }
          if (map.current.getLayer('countries-line')) {
            map.current.removeLayer('countries-line');
          }
          if (map.current.getSource('countries-geojson')) {
            map.current.removeSource('countries-geojson');
          }
        } catch (e) {
          console.log("Error during cleanup:", e);
        }
        
        // Add the GeoJSON source with the direct data
        map.current.addSource('countries-geojson', {
          type: 'geojson',
          data: geojsonData,
          generateId: true  // Auto-generate feature IDs for state
        });
        
        // Add a fill layer
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
        
        // Add a line layer for borders
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
        
        // Force a repaint to ensure layers are visible
        const center = map.current.getCenter();
        map.current.setCenter([center.lng + 0.0001, center.lat]);
        setTimeout(() => {
          if (map.current) {
            map.current.setCenter(center);
          }
        }, 100);
        
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
          
          // Retry after delay if there was an error
          retryTimeout = setTimeout(() => {
            console.log("Retrying layer initialization after error");
            initializationAttempted.current = false;
            initializeLayers();
          }, 3000);
        }
      }
    };
    
    // Start initialization process
    initializeLayers();
    
    return () => {
      isMounted = false;
      clearTimeout(retryTimeout);
    };
  }, [map, initialized, setupInteractions]);

  return { initialized, error };
};
