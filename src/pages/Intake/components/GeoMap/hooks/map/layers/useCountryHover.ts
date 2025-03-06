
import mapboxgl from 'mapbox-gl';

let hoveredCountryId: string | null = null;

export const setupHoverEvents = (map: mapboxgl.Map) => {
  // On mouse enter
  map.on('mousemove', 'countries-fill', (e) => {
    if (e.features && e.features.length > 0) {
      // Set the cursor to pointer when hovering over a country
      map.getCanvas().style.cursor = 'pointer';
      
      if (hoveredCountryId) {
        map.setFeatureState(
          { source: 'countries', sourceLayer: 'country_boundaries', id: hoveredCountryId },
          { hover: false }
        );
      }
      
      hoveredCountryId = e.features[0].id as string;
      
      map.setFeatureState(
        { source: 'countries', sourceLayer: 'country_boundaries', id: hoveredCountryId },
        { hover: true }
      );
    }
  });

  // On mouse leave
  map.on('mouseleave', 'countries-fill', () => {
    map.getCanvas().style.cursor = '';
    
    if (hoveredCountryId) {
      map.setFeatureState(
        { source: 'countries', sourceLayer: 'country_boundaries', id: hoveredCountryId },
        { hover: false }
      );
    }
    
    hoveredCountryId = null;
  });
};
