
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

  useEffect(() => {
    if (!mapContainer.current) return;
    
    const updateDimensions = () => {
      if (mapContainer.current) {
        const width = mapContainer.current.offsetWidth;
        setContainerWidth(width);
        
        if (map.current) {
          map.current.resize();
          adjustMapView(map.current, width);
        }
      }
    };

    updateDimensions();
    
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
      setMapError(null);
      
      mapboxgl.accessToken = mapboxToken;
      
      console.log("Creating map instance");
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        zoom: 1,
        center: [0, 8], // Center point at latitude 8
        projection: {
          name: 'mercator',
          center: [0, 8], // Matching center point with the map center
          parallels: [0, 60]
        },
        minZoom: 0.5,
        maxZoom: 8,
        maxBounds: [
          [-182, -56], // Updated Southwest corner - extended by 2 degrees
          [182, 81]    // Updated Northeast corner - extended by 2 degrees
        ],
        renderWorldCopies: false,
        attributionControl: false,
        preserveDrawingBuffer: true
      });

      map.current.addControl(
        new mapboxgl.AttributionControl({ compact: true }),
        'bottom-right'
      );

      map.current.addControl(
        new mapboxgl.NavigationControl({ showCompass: false }),
        'top-right'
      );

      map.current.on('load', () => {
        console.log("Map loaded event fired");
        setInitialized(true);

        if (map.current) {
          map.current.setPaintProperty('water', 'fill-color', '#e9f2fe');
          console.log("Water color updated to #e9f2fe");
        }

        if (map.current && mapContainer.current) {
          adjustMapView(map.current, mapContainer.current.offsetWidth);
        }
      });

      map.current.on('error', (e) => {
        console.error("Mapbox error:", e.error);
        setMapError(`Map error: ${e.error?.message || 'Unknown error'}`);
      });
      
    } catch (err) {
      console.error('Error initializing map:', err);
      setMapError(`Failed to initialize map: ${err instanceof Error ? err.message : String(err)}`);
    }

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

function adjustMapView(map: mapboxgl.Map, width: number) {
  console.log("Adjusting map view for container width:", width);
  
  let zoom = 0.5;
  if (width >= 300 && width < 400) {
    zoom = 0.6;
  } else if (width >= 400 && width < 600) {
    zoom = 0.7;
  } else if (width >= 600) {
    zoom = 0.8;
  }
  
  map.setZoom(zoom);
  
  const padding = {
    top: 5,
    bottom: 5,
    left: 10,
    right: 10
  };
  
  map.fitBounds([
    [-182, -56], // Updated Southwest corner - showing less of the south, extended by 2 degrees
    [182, 81]    // Updated Northeast corner - showing less of the north, extended by 2 degrees
  ], {
    padding,
    linear: true,
    duration: 0
  });
}
