
import mapboxgl from 'mapbox-gl';
import { getCountryIdFromIsoCode } from './utils/countryIdUtils';

// Track current selection
let selectedCountryId: string | null = null;
let selectedCountryCode: string | null = null;

/**
 * Sets up click events on the map for country selection
 * @param map Mapbox GL map instance
 * @param onCountryClick Callback to invoke when a country is selected
 */
export const setupClickEvents = (map: mapboxgl.Map, onCountryClick: (countryId: string) => void) => {
  console.log("Setting up map click events");
  
  // Remove any existing click event to prevent duplicates
  map.off('click', 'countries-fill');
  
  // Define the event handler function with proper typing
  const clickHandler = (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
    console.log("Map click detected on countries-fill layer");
    
    if (e.features && e.features.length > 0) {
      const countryFeatureId = e.features[0].id as string;
      const isoCode = e.features[0].properties?.iso_3166_1 || '';
      
      console.log(`Map click: Selected country ${isoCode} (feature id: ${countryFeatureId})`);
      
      // Check if we're clicking on the already selected country
      if (selectedCountryCode === isoCode) {
        console.log('Deselecting current country');
        // Deselect the country
        onCountryClick('');
        
        // Clear the visual highlight immediately here
        try {
          if (selectedCountryId) {
            map.setFeatureState(
              { source: 'countries', sourceLayer: 'country_boundaries', id: selectedCountryId },
              { selected: false }
            );
            console.log(`Cleared visual highlight for country ID: ${selectedCountryId}`);
            selectedCountryId = null;
            selectedCountryCode = null;
          }
        } catch (error) {
          console.error("Error clearing country selection on click:", error);
        }
      } else {
        // Find the country_id from the ISO code
        getCountryIdFromIsoCode(isoCode).then(countryId => {
          if (countryId) {
            console.log(`Found country_id ${countryId} for ISO code ${isoCode}`);
            // Select the new country by its UUID
            onCountryClick(countryId);
          } else {
            // Fallback to using the ISO code directly if we can't find the UUID
            console.log(`Could not find country_id for ISO code ${isoCode}, using ISO code`);
            onCountryClick(isoCode);
          }
          
          // Store map feature ID for highlight clearing
          selectedCountryId = countryFeatureId;
          selectedCountryCode = isoCode;
        });
      }
    }
  };
  
  // Using the correct Mapbox API syntax: map.on(event, layer, listener)
  map.on('click', 'countries-fill', clickHandler);
};

/**
 * Get the currently selected country code
 * @returns The ISO code of the currently selected country
 */
export const getSelectedCountryCode = (): string | null => {
  return selectedCountryCode;
};

/**
 * Get the currently selected feature ID
 * @returns The feature ID of the currently selected country
 */
export const getSelectedFeatureId = (): string | null => {
  return selectedCountryId;
};

/**
 * Set the selected feature ID (used for syncing between files)
 * @param featureId The new feature ID
 * @param isoCode The ISO code for the feature
 */
export const setSelectedFeature = (featureId: string | null, isoCode: string | null): void => {
  selectedCountryId = featureId;
  selectedCountryCode = isoCode;
};
