
import { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { applyMapStyling } from './utils/mapStylingUtils';
import { adjustMapView } from './utils/viewportUtils';

interface UseMapSetupProps {
  mapboxToken: string;
  mapContainer: React.RefObject<HTMLDivElement>;
  map: React.MutableRefObject<mapboxgl.Map | null>;
  containerWidth: number;
  setInitialized: (value: boolean) => void;
  setMapError: (error: string | null) => void;
}

/**
 * Hook to handle map initialization setup with enhanced reliability
 */
export const useMapSetup = ({
  mapboxToken,
  mapContainer,
  map,
  containerWidth,
  setInitialized,
  setMapError
}: UseMapSetupProps) => {
  // Track initialization attempts
  const [attemptCount, setAttemptCount] = useState(0);
  
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
      
      // Validate token format before attempting to set it
      if (!mapboxToken.match(/^pk\..+/)) {
        throw new Error("Invalid Mapbox token format. Token should start with 'pk.'");
      }
      
      mapboxgl.accessToken = mapboxToken;
      
      console.log("Creating map instance");
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        zoom: 1.5,
        center: [0, 20], // More centered view of the world
        preserveDrawingBuffer: true,
        pitchWithRotate: false,
        attributionControl: false,
        minZoom: 1,
        maxZoom: 8,
        interactive: true,
        doubleClickZoom: false
      });

      // Add controls
      map.current.addControl(
        new mapboxgl.AttributionControl({ compact: true }),
        'bottom-right'
      );

      map.current.addControl(
        new mapboxgl.NavigationControl({ showCompass: false }),
        'top-right'
      );

      // Enhanced load handling
      map.current.on('load', () => {
        console.log("Map loaded event fired");
        
        if (map.current) {
          // Apply styling after a short delay to ensure the style is fully loaded
          setTimeout(() => {
            if (map.current) {
              applyMapStyling(map.current);
              
              // Force a repaint to ensure everything renders
              map.current.resize();
              
              setInitialized(true);
              console.log("Map fully initialized via load event");
            }
          }, 200);
        }
      });

      // Set up a backup timer in case the load event doesn't fire
      const loadTimer = setTimeout(() => {
        if (map.current && !map.current.loaded()) {
          console.log("Map load event timeout - forcing initialization");
          
          // Force completion even if the event didn't fire
          if (map.current) {
            applyMapStyling(map.current);
            setInitialized(true);
            console.log("Map forcibly initialized via timeout");
            
            if (mapContainer.current) {
              adjustMapView(map.current, mapContainer.current.offsetWidth);
            }
          }
        }
      }, 4000);

      // Error handling
      map.current.on('error', (e) => {
        console.error("Mapbox error:", e.error);
        setMapError(`Map error: ${e.error?.message || 'Unknown error'}`);
        
        // If we haven't tried too many times, attempt to reinitialize
        if (attemptCount < 2) {
          setAttemptCount(count => count + 1);
          
          // Clean up the current map instance
          if (map.current) {
            map.current.remove();
            map.current = null;
          }
          
          // Re-render will trigger a new initialization attempt
        }
      });
      
      // Debug clicks
      map.current.on('click', (e) => {
        console.log("Map click detected at coordinates:", e.lngLat);
      });
      
      return () => {
        clearTimeout(loadTimer);
        if (map.current) {
          console.log("Cleaning up map instance");
          map.current.remove();
          map.current = null;
        }
      };
      
    } catch (err) {
      console.error('Error initializing map:', err);
      setMapError(`Failed to initialize map: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [mapboxToken, mapContainer, containerWidth, setInitialized, setMapError, attemptCount]);
};
