
import { useEffect, useRef, useState } from "react";
import mapboxgl from 'mapbox-gl';

interface UseMapInstanceProps {
  mapboxToken: string;
  mapContainer: React.RefObject<HTMLDivElement>;
}

export const useMapInstance = ({
  mapboxToken,
  mapContainer
}: UseMapInstanceProps) => {
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Only initialize if we have all requirements and map isn't already initialized
    if (!mapContainer.current || !mapboxToken || map.current) {
      console.log("Map initialization skipped:", {
        containerExists: !!mapContainer.current,
        tokenExists: !!mapboxToken,
        tokenLength: mapboxToken ? mapboxToken.length : 0,
        mapAlreadyInitialized: !!map.current
      });
      return;
    }
    
    console.log("Initializing map with token:", 
      mapboxToken.length > 10 
        ? `${mapboxToken.substring(0, 5)}...${mapboxToken.substring(mapboxToken.length - 5)}`
        : "Invalid token (too short)");
    
    try {
      // Clear any previous errors
      setMapError(null);
      
      // Set the Mapbox access token
      mapboxgl.accessToken = mapboxToken;
      
      console.log("Creating map instance");
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        zoom: 1,  // Lower zoom level to show entire world
        center: [0, 20],  // Centered more on populated areas
        projection: 'mercator',
        minZoom: 0.8,  // Allow zooming out further
        maxZoom: 8,    // Limit how far users can zoom in
        maxBounds: [
          [-180, -85], // Southwest coordinates
          [180, 85]    // Northeast coordinates
        ],
        attributionControl: false  // Hide attribution for cleaner look
      });

      // Add attribution control in a more discrete position
      map.current.addControl(
        new mapboxgl.AttributionControl({ compact: true }),
        'bottom-right'
      );

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({ showCompass: false }),
        'top-right'
      );

      // Handle map load event
      map.current.on('load', () => {
        console.log("Map loaded event fired");
        setInitialized(true);

        // Set custom water color to #e9f2fe
        if (map.current) {
          map.current.setPaintProperty('water', 'fill-color', '#e9f2fe');
          console.log("Water color updated to #e9f2fe");
        }

        // Ensure the map fits to the container width
        if (map.current && mapContainer.current) {
          map.current.resize();
          fitMapToContainer(map.current, mapContainer.current);
        }
      });
      
      // Error handling for map load
      map.current.on('error', (e) => {
        console.error("Mapbox error:", e.error);
        setMapError(`Map error: ${e.error?.message || 'Unknown error'}`);
      });
      
    } catch (err) {
      console.error('Error initializing map:', err);
      setMapError(`Failed to initialize map: ${err instanceof Error ? err.message : String(err)}`);
    }

    // Cleanup on unmount
    return () => {
      if (map.current) {
        console.log("Cleaning up map instance");
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken, mapContainer]);

  return { map, mapError, initialized, setMapError };
};

// Helper function to ensure the map fits within the container width
function fitMapToContainer(map: mapboxgl.Map, container: HTMLDivElement) {
  // Get the container dimensions
  const containerWidth = container.offsetWidth;
  
  // Calculate the appropriate zoom level based on container width
  // Adjust these values based on testing
  const idealZoom = containerWidth < 400 ? 0.8 : 
                     containerWidth < 600 ? 0.9 : 
                     containerWidth < 800 ? 1.0 : 1.1;
  
  map.setZoom(idealZoom);
  
  // Make sure the entire world is visible
  map.fitBounds([
    [-180, -65], // Southwest coordinates
    [180, 75]    // Northeast coordinates
  ], {
    padding: { top: 10, bottom: 10, left: 10, right: 10 },
    animate: false
  });
}
