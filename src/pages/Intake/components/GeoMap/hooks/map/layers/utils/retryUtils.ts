
import mapboxgl from 'mapbox-gl';
import { findAndHighlightFeature, findCountryByVariousProperties } from './highlightUtils';

/**
 * Retry highlighting a country after a delay with expanded query options
 * @param map Mapbox GL map instance
 * @param isoCode ISO code to highlight
 */
export const retryHighlightCountry = (map: mapboxgl.Map, isoCode: string): void => {
  try {
    console.log(`Retrying highlight for country: ${isoCode}`);
    
    // Try with different source layer names that might exist
    const sourceLayers = ['country_boundaries', 'boundaries_admin_0'];
    let highlighted = false;
    
    // Try each source layer
    for (const sourceLayer of sourceLayers) {
      highlighted = findAndHighlightFeature(map, isoCode, sourceLayer);
      
      if (highlighted) {
        console.log(`Successfully highlighted ${isoCode} in layer ${sourceLayer} on retry`);
        return;
      }
    }
    
    // If direct query failed, try broader search with property matching
    if (!highlighted) {
      for (const sourceLayer of sourceLayers) {
        highlighted = findCountryByVariousProperties(map, isoCode, sourceLayer);
        
        if (highlighted) {
          console.log(`Successfully highlighted ${isoCode} using property search in layer ${sourceLayer}`);
          return;
        }
      }
    }
    
    // If still not highlighted, schedule final retry
    if (!highlighted) {
      console.log(`Could not highlight ${isoCode} in retry, scheduling final attempt`);
      setTimeout(() => {
        finalRetryHighlightCountry(map, isoCode);
      }, 1500);
    }
  } catch (error) {
    console.error("Error in retryHighlightCountry:", error);
  }
};

/**
 * Final attempt to highlight a country with map manipulation
 * @param map Mapbox GL map instance
 * @param isoCode ISO code to highlight
 */
export const finalRetryHighlightCountry = (map: mapboxgl.Map, isoCode: string): void => {
  try {
    console.log(`Final attempt to find country ${isoCode}`);
    
    // Try to refresh the map to ensure everything is loaded
    const center = map.getCenter();
    map.setCenter([center.lng + 0.1, center.lat]);
    
    setTimeout(() => {
      map.setCenter(center);
      
      // Try a more aggressive search, looking through all features
      const highlighted = findCountryByVariousProperties(map, isoCode);
      
      if (!highlighted) {
        console.log(`Could not highlight country ${isoCode} after all retry attempts`);
      }
    }, 300);
  } catch (error) {
    console.error("Error in finalRetryHighlightCountry:", error);
  }
};
