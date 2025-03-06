
import mapboxgl from 'mapbox-gl';
import { convertToIsoCode } from './utils/countryIdUtils';
import { clearPreviousHighlight, findAndHighlightFeature } from './utils/highlightUtils';
import { retryHighlightCountry } from './utils/retryUtils';

/**
 * Highlights a country on the map with enhanced reliability
 * @param map Mapbox GL map instance
 * @param countryCode Country ID or ISO code to highlight
 */
export const highlightCountry = (map: mapboxgl.Map, countryCode: string) => {
  if (!map) {
    console.log("Map not available for highlighting");
    return;
  }
  
  if (!map.isStyleLoaded()) {
    console.log("Map style not loaded yet, setting up a delayed highlight attempt");
    const retryHighlight = () => {
      console.log("Retrying country highlight...");
      highlightCountry(map, countryCode);
    };
    
    // Try again when the style loads
    map.once('style.load', retryHighlight);
    
    // Also set a timeout as backup
    setTimeout(retryHighlight, 1000);
    return;
  }
  
  console.log(`Attempting to highlight country with code: ${countryCode}`);
  
  // Clear previous selection first, regardless of new selection
  clearPreviousHighlight(map);
  
  // If no country code provided or empty string, we're just clearing selection
  if (!countryCode || countryCode === '') {
    console.log("Country selection cleared, no new country to highlight");
    return;
  }
  
  // Function to query and highlight the country
  const findAndHighlightCountry = async () => {
    try {
      // Get ISO code if needed
      const isoCode = await convertToIsoCode(countryCode);
      
      console.log(`Searching for country features with ISO code: ${isoCode}`);
      
      // Check that the countries source exists
      if (!map.getSource('countries')) {
        console.error("Countries source not found for highlighting");
        
        // Try to recover by waiting a moment and trying again
        setTimeout(() => {
          if (map.getSource('countries')) {
            findAndHighlightCountry();
          } else {
            console.error("Countries source still missing after delay");
          }
        }, 500);
        return;
      }
      
      // Attempt to find and highlight the country
      const highlighted = findAndHighlightFeature(map, isoCode);
      
      // If not found on first attempt, try retry strategies
      if (!highlighted) {
        console.log(`Initial highlight attempt failed for ${isoCode}, will retry shortly...`);
        setTimeout(() => {
          retryHighlightCountry(map, isoCode);
        }, 500);
      }
    } catch (error) {
      console.error("Error in findAndHighlightCountry:", error);
    }
  };
  
  // Execute the function
  findAndHighlightCountry();
};
