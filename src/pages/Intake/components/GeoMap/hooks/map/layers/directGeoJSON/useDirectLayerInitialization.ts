
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
  const [geoJsonData, setGeoJsonData] = useState<any>(null);

  // Pre-fetch GeoJSON data as early as possible
  useEffect(() => {
    let isMounted = true;
    
    const fetchGeoJSON = async () => {
      try {
        console.log("Pre-fetching GeoJSON data...");
        const data = await getCountriesGeoJSON();
        if (isMounted) {
          console.log("GeoJSON data pre-fetched successfully");
          setGeoJsonData(data);
        }
      } catch (err) {
        console.error("Error pre-fetching GeoJSON:", err);
        if (isMounted) {
          setError(`Failed to fetch GeoJSON: ${err instanceof Error ? err.message : String(err)}`);
        }
      }
    };
    
    fetchGeoJSON();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Add GeoJSON source and layers to the map
  useEffect(() => {
    let isMounted = true;
    
    const initializeLayers = async () => {
      if (!map.current || initialized || !geoJsonData) return;
      
      try {
        console.log("Adding direct GeoJSON layers to map");
        
        // Check if the map style is loaded before proceeding
        if (!map.current.isStyleLoaded()) {
          console.log("Map style not loaded yet, waiting...");
          
          const checkStyleAndInitialize = () => {
            if (map.current && map.current.isStyleLoaded()) {
              console.log("Style now loaded, proceeding with layer initialization");
              setupGeoJSONLayers();
            } else {
              console.log("Style still loading, checking again soon...");
              setTimeout(checkStyleAndInitialize, 200);
            }
          };
          
          // Start checking
          checkStyleAndInitialize();
          return;
        }
        
        // If style is already loaded, proceed directly
        setupGeoJSONLayers();
        
      } catch (err) {
        console.error("Error initializing GeoJSON layers:", err);
        if (isMounted) {
          setError(`Failed to initialize map: ${err instanceof Error ? err.message : String(err)}`);
        }
      }
    };
    
    // Helper function to setup GeoJSON layers
    const setupGeoJSONLayers = () => {
      if (!map.current || !isMounted || !geoJsonData) return;
      
      try {
        // Add the GeoJSON source with the direct data
        console.log("Adding countries GeoJSON source");
        
        // Check if source already exists
        if (!map.current.getSource('countries-geojson')) {
          map.current.addSource('countries-geojson', {
            type: 'geojson',
            data: geoJsonData,
            generateId: true  // Auto-generate feature IDs for state
          });
          console.log("Added countries-geojson source");
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
        
        setInitialized(true);
        console.log("GeoJSON layers successfully initialized");
        
        // Notify user
        toast.success("Map loaded successfully", {
          duration: 2000,
        });
      } catch (layerError) {
        console.error("Error setting up GeoJSON layers:", layerError);
        setError(`Failed to setup map layers: ${layerError instanceof Error ? layerError.message : String(layerError)}`);
      }
    };
    
    // Start the initialization process
    initializeLayers();
    
    return () => {
      isMounted = false;
    };
  }, [map, initialized, setupInteractions, geoJsonData]);

  return { initialized, error };
};
