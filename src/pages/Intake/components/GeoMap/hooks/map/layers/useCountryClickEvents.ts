
import mapboxgl from 'mapbox-gl';
import { getCountryIdFromFeature } from './utils/countryIdUtils';

/**
 * Sets up click event handlers for country selection
 */
export function setupClickEvents(
  map: mapboxgl.Map, 
  onCountrySelected: (countryId: string) => void
) {
  // Add click behavior for country selection
  // Note: The proper syntax for Mapbox GL is map.on(event, layerId, callback)
  map.on('click', 'country-fills', (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
    if (e.features && e.features.length > 0) {
      const countryId = getCountryIdFromFeature(e.features[0]);
      if (countryId) {
        console.log(`Country clicked: ${countryId}`);
        onCountrySelected(countryId);
      }
    }
  });

  // Change cursor to pointer when hovering over a country
  map.on('mouseenter', 'country-fills', () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  // Change cursor back when leaving a country
  map.on('mouseleave', 'country-fills', () => {
    map.getCanvas().style.cursor = '';
  });
}
