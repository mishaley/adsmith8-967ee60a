
import { useEffect, useRef, useState } from "react";
import mapboxgl from 'mapbox-gl';

interface UseMapInitializationProps {
  mapboxToken: string;
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
        zoom: 1.2,  // Lower zoom level to show more of the world
        center: [0, 20],  // Centered to show more landmass
        projection: 'mercator',
        minZoom: 1,  // Prevent zooming out too far
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

      let hoveredPolygonId: string | number | null = null;
      
      map.current.on('load', () => {
        console.log("Map loaded event fired");
        if (!map.current) return;
        
        try {
          // Add country boundaries source and layer
          map.current.addSource('countries', {
            type: 'vector',
            url: 'mapbox://mapbox.country-boundaries-v1'
          });
          
          map.current.addLayer({
            id: 'countries-fills',
            type: 'fill',
            source: 'countries',
            'source-layer': 'country_boundaries',
            paint: {
              'fill-color': [
                'case',
                ['==', ['get', 'name_en'], selectedCountry],
                '#154851', // Selected country color (matches app theme)
                '#EAEAEA'  // Default color
              ],
              'fill-opacity': [
                'case',
                ['==', ['get', 'name_en'], selectedCountry],
                0.8,
                ['boolean', ['feature-state', 'hover'], false],
                0.5,
                0.2
              ]
            }
          });
          
          map.current.addLayer({
            id: 'countries-borders',
            type: 'line',
            source: 'countries',
            'source-layer': 'country_boundaries',
            paint: {
              'line-color': '#666666',
              'line-width': 0.5
            }
          });
          
          // Handle hover states
          map.current.on('mousemove', 'countries-fills', (e) => {
            if (!map.current || !e.features || e.features.length === 0) return;
            
            if (hoveredPolygonId !== null) {
              map.current.setFeatureState(
                { source: 'countries', sourceLayer: 'country_boundaries', id: hoveredPolygonId },
                { hover: false }
              );
            }
            
            hoveredPolygonId = e.features[0].id;
            
            map.current.setFeatureState(
              { source: 'countries', sourceLayer: 'country_boundaries', id: hoveredPolygonId },
              { hover: true }
            );
            
            // Change cursor to pointer on hover - fixed with proper null checking
            const canvas = map.current.getCanvas();
            if (canvas) {
              canvas.style.cursor = 'pointer';
            }
          });
          
          // Handle mouse leave
          map.current.on('mouseleave', 'countries-fills', () => {
            if (!map.current) return;
            
            if (hoveredPolygonId !== null) {
              map.current.setFeatureState(
                { source: 'countries', sourceLayer: 'country_boundaries', id: hoveredPolygonId },
                { hover: false }
              );
            }
            hoveredPolygonId = null;
            
            // Reset cursor - fixed with proper null checking
            const canvas = map.current.getCanvas();
            if (canvas) {
              canvas.style.cursor = '';
            }
          });
          
          // Handle country selection on click
          map.current.on('click', 'countries-fills', (e) => {
            if (!map.current || !e.features || e.features.length === 0) return;
            
            const countryName = e.features[0].properties?.name_en;
            if (countryName) {
              setSelectedCountry(countryName);
              
              // Update the fill color based on selection
              map.current.setPaintProperty('countries-fills', 'fill-color', [
                'case',
                ['==', ['get', 'name_en'], countryName],
                '#154851', // Selected country color
                '#EAEAEA'  // Default color
              ]);
            }
          });
          
          // Make sure we fit to bounds
          map.current.fitBounds([
            [-160, -60], // Southwest coordinates
            [160, 70]    // Northeast coordinates
          ], {
            padding: { top: 20, bottom: 20, left: 20, right: 20 },
            animate: false
          });
          
          setInitialized(true);
          console.log("Map fully initialized and configured");
        } catch (layerErr) {
          console.error("Error setting up map layers:", layerErr);
          setMapError(`Error setting up map layers: ${layerErr instanceof Error ? layerErr.message : String(layerErr)}`);
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
  }, [mapboxToken, selectedCountry, setSelectedCountry, mapContainer]);

  return { mapError, initialized };
};
