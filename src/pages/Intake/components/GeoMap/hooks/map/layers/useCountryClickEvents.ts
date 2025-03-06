
import mapboxgl from 'mapbox-gl';
import { setupLayerClickHandler, setupHoverHandler } from './utils/clickHandlers';
import { getSelectedFeatureId, getSelectedCountryCode, setSelectedFeature } from './utils/selectionState';

// Re-export the selection state getters and setters for external use
export { getSelectedFeatureId, getSelectedCountryCode, setSelectedFeature };

/**
 * Sets up click event handlers for country selection
 * @param map Mapbox GL map instance
 * @param onCountrySelected Callback to set the selected country
 */
export function setupClickEvents(
  map: mapboxgl.Map, 
  onCountrySelected: (countryId: string) => void
) {
  // Set up click handlers for the fill layer
  setupLayerClickHandler(map, 'country-fills', onCountrySelected);
  
  // Also add click handlers to the border layer for better interaction
  setupLayerClickHandler(map, 'country-borders', onCountrySelected);

  // Set up hover handlers for cursor effects
  setupHoverHandler(map, 'country-fills');
  setupHoverHandler(map, 'country-borders');
}
