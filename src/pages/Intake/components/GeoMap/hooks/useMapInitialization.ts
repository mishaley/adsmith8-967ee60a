
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
    if (!mapContainer.current || !mapboxToken || map.current) return;
    
    console.log("Initializing map with token:", mapboxToken ? "Token exists" : "No token");
    
    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        zoom: 1.2,
        center: [0, 20],
        projection: 'mercator'
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl(),
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
          
          setInitialized(true);
          console.log("Map fully initialized and configured");
        } catch (layerErr) {
          console.error("Error setting up map layers:", layerErr);
          setMapError("Error setting up map layers");
        }
      });
      
      // Error handling for map load
      map.current.on('error', (e) => {
        console.error("Mapbox error:", e.error);
        setMapError(`Map error: ${e.error?.message || 'Unknown error'}`);
      });
      
    } catch (err) {
      console.error('Error initializing map:', err);
      setMapError('Failed to initialize map');
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
