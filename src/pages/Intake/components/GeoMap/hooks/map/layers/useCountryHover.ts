
import mapboxgl from 'mapbox-gl';
import { useRef } from 'react';

export const useCountryHover = (map: mapboxgl.Map) => {
  const hoveredCountryId = useRef<string | null>(null);

  const setupHoverEvents = () => {
    // On mouse enter
    map.on('mousemove', 'countries-fill', (e) => {
      if (e.features && e.features.length > 0) {
        // Set the cursor to pointer when hovering over a country
        map.getCanvas().style.cursor = 'pointer';
        
        if (hoveredCountryId.current) {
          map.setFeatureState(
            { source: 'countries', sourceLayer: 'country_boundaries', id: hoveredCountryId.current },
            { hover: false }
          );
        }
        
        hoveredCountryId.current = e.features[0].id as string;
        
        map.setFeatureState(
          { source: 'countries', sourceLayer: 'country_boundaries', id: hoveredCountryId.current },
          { hover: true }
        );
      }
    });

    // On mouse leave
    map.on('mouseleave', 'countries-fill', () => {
      map.getCanvas().style.cursor = '';
      
      if (hoveredCountryId.current) {
        map.setFeatureState(
          { source: 'countries', sourceLayer: 'country_boundaries', id: hoveredCountryId.current },
          { hover: false }
        );
      }
      
      hoveredCountryId.current = null;
    });
  };

  return { setupHoverEvents };
};
