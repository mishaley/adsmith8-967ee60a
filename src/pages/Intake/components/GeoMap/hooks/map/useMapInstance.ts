
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
  const [containerWidth, setContainerWidth] = useState(0);

  // Track container width changes
  useEffect(() => {
    if (!mapContainer.current) return;
    
    const updateDimensions = () => {
      if (mapContainer.current) {
        const width = mapContainer.current.offsetWidth;
        setContainerWidth(width);
        
        // If map is already initialized, resize it
        if (map.current) {
          map.current.resize();
          adjustMapView(map.current, width);
        }
      }
    };

    // Initial measurement
    updateDimensions();
    
    // Set up resize observer
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(mapContainer.current);
    
    return () => {
      if (mapContainer.current) {
        resizeObserver.unobserve(mapContainer.current);
      }
      resizeObserver.disconnect();
    };
  }, [mapContainer]);

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
        zoom: 1,
        center: [0, 20],
        projection: {
          name: 'equirectangular',  // Changed to equirectangular to prevent world repetition
          center: [0, 20],
        },
        minZoom: 0.5,
        maxZoom: 8,
        maxBounds: [
          [-180, -85],  // Southwest coordinates (exact world bounds)
          [180, 85]     // Northeast coordinates (exact world bounds)
        ],
        renderWorldCopies: false,  // Important: prevent world copies from rendering
        attributionControl: false,
        preserveDrawingBuffer: true
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
          adjustMapView(map.current, mapContainer.current.offsetWidth);
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
  }, [mapboxToken, mapContainer, containerWidth]);

  return { map, mapError, initialized, setMapError };
};

// Helper function to adjust map view based on container width
function adjustMapView(map: mapboxgl.Map, width: number) {
  console.log("Adjusting map view for container width:", width);
  
  // Calculate optimal zoom level based on container width
  // This ensures the entire world fits without duplicating
  let zoom = 0.5;
  if (width >= 400 && width < 600) {
    zoom = 0.6;
  } else if (width >= 600 && width < 800) {
    zoom = 0.7;
  } else if (width >= 800) {
    zoom = 0.8;
  }
  
  map.setZoom(zoom);
  
  // Calculate padding
  const padding = {
    top: 40,
    bottom: 40,
    left: 20,
    right: 20
  };
  
  // Ensure the world map is visible without repeating
  map.fitBounds([
    [-179, -60], // Southwest coordinates
    [179, 75]    // Northeast coordinates 
  ], {
    padding,
    linear: true,
    duration: 0
  });
}
