
import mapboxgl from 'mapbox-gl';
import { getCountryIdFromFeature } from './countryIdUtils';
import { getSelectedCountryCode } from './selectionState';

/**
 * Sets up click event handler for a map layer
 * @param map Mapbox GL map instance
 * @param layerId ID of the layer to attach click handler to
 * @param onCountrySelected Callback when a country is selected
 */
export const setupLayerClickHandler = (
  map: mapboxgl.Map,
  layerId: string,
  onCountrySelected: (countryId: string) => void
): void => {
  map.on('click', layerId, (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
    if (e.features && e.features.length > 0) {
      const countryId = getCountryIdFromFeature(e.features[0]);
      if (countryId) {
        console.log(`Country ${layerId} clicked: ${countryId}`);
        
        // Check if clicked on the same country that's already selected
        if (countryId === getSelectedCountryCode()) {
          console.log(`Clicked on already selected country in ${layerId}, deselecting it`);
          // Call with empty string to clear selection
          onCountrySelected('');
        } else {
          // Select the new country
          onCountrySelected(countryId);
        }
      }
    }
  });
};

/**
 * Sets up hover effects for cursor on map layers
 * @param map Mapbox GL map instance
 * @param layerId ID of the layer to attach hover handler to
 */
export const setupHoverHandler = (
  map: mapboxgl.Map,
  layerId: string
): void => {
  // Change cursor to pointer when hovering over a country
  map.on('mouseenter', layerId, () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  // Change cursor back when leaving a country
  map.on('mouseleave', layerId, () => {
    map.getCanvas().style.cursor = '';
  });
};
