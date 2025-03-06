
import mapboxgl from 'mapbox-gl';
import { getCountryIdFromFeature } from './utils/countryIdUtils';

// Variables to track the currently selected feature
let selectedFeatureId: string | null = null;
let selectedCountryCode: string | null = null;

/**
 * Gets the ID of the currently selected feature
 * @returns The feature ID or null if none selected
 */
export const getSelectedFeatureId = (): string | null => {
  return selectedFeatureId;
};

/**
 * Gets the country code of the currently selected country
 * @returns The country code or null if none selected
 */
export const getSelectedCountryCode = (): string | null => {
  return selectedCountryCode;
};

/**
 * Sets the selected feature information
 * @param featureId The feature ID or null to clear
 * @param countryCode The country code or null to clear
 */
export const setSelectedFeature = (featureId: string | null, countryCode: string | null): void => {
  selectedFeatureId = featureId;
  selectedCountryCode = countryCode;
  console.log(`Selected feature set to: ${featureId}, country code: ${countryCode}`);
};

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
        
        // Check if clicked on the same country that's already selected
        if (countryId === selectedCountryCode) {
          console.log('Clicked on already selected country, deselecting it');
          // Call with empty string to clear selection
          onCountrySelected('');
        } else {
          // Select the new country
          onCountrySelected(countryId);
        }
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
