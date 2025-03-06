
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
      // Only proceed if map is initialized, not already set up, and we have the GeoJSON data
      if (!map.current || initialized || !geoJsonData) {
        console.log("Layer initialization skipped:", { 
          mapExists: !!map.current, 
          alreadyInitialized: initialized,
          hasGeoJsonData: !!geoJsonData 
        });
        return;
      }
      
      try {
        console.log("Adding direct GeoJSON layers to map");
        
        // Wait for map style to load completely before adding layers
        const waitForStyleAndInitialize = () => {
          if (!map.current || !isMounted) return;
          
          if (map.current.isStyleLoaded()) {
            console.log("Map style loaded, proceeding with layer initialization");
            setupGeoJSONLayers();
          } else {
            console.log("Map style not fully loaded yet, retrying...");
            // Use both event listener and timeout for redundancy
            map.current.once('style.load', () => {
              console.log("Style.load event fired");
              if (isMounted && map.current) setupGeoJSONLayers();
            });
            
            setTimeout(waitForStyleAndInitialize, 200);
          }
        };
        
        waitForStyleAndInitialize();
        
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
        console.log("Setting up GeoJSON layers - data points:", geoJsonData.features?.length || 0);
        
        // Force map to redraw if needed
        map.current.resize();
        
        // Check if source already exists
        if (!map.current.getSource('countries-geojson')) {
          console.log("Adding countries-geojson source");
          map.current.addSource('countries-geojson', {
            type: 'geojson',
            data: geoJsonData,
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
        
        // Mark initialization as complete
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
    
    // Start the initialization process if we have GeoJSON data
    if (geoJsonData && map.current && !initialized) {
      console.log("Starting layer initialization with GeoJSON data");
      initializeLayers();
    }
    
    return () => {
      isMounted = false;
    };
  }, [map, initialized, setupInteractions, geoJsonData]);

  return { initialized, error };
};
