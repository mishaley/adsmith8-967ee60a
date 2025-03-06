
/**
 * State management utilities for country selection
 * Maintains selected feature and country code information
 */

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
