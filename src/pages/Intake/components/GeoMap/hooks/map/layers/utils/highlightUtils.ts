
import mapboxgl from 'mapbox-gl';
import { getSelectedFeatureId, setSelectedFeature } from '../useCountryClickEvents';

/**
 * Attempts to find and highlight a country feature on the map
 * @param map Mapbox GL map instance
 * @param isoCode ISO code to highlight
 * @param sourceLayer Source layer to query
 */
export const findAndHighlightFeature = (
  map: mapboxgl.Map, 
  isoCode: string,
  sourceLayer: string = 'country_boundaries'
): boolean => {
  try {
    // Try to find features with the given ISO code
    const features = map.querySourceFeatures('countries', {
      sourceLayer: sourceLayer,
      filter: ['==', 'iso_3166_1', isoCode]
    });
    
    console.log(`Found ${features.length} features for country code ${isoCode} in layer ${sourceLayer}`);
    
    if (features.length > 0) {
      for (const feature of features) {
        if (feature.id !== undefined && feature.id !== null) {
          const featureId = feature.id as string;
          
          try {
            map.setFeatureState(
              { source: 'countries', sourceLayer: sourceLayer, id: featureId },
              { selected: true }
            );
            
            // Store selection for future reference
            setSelectedFeature(featureId, isoCode);
            console.log(`Successfully highlighted feature ${featureId} for country ${isoCode}`);
            return true;
          } catch (error) {
            console.error(`Error setting feature state for country ${isoCode}:`, error);
          }
        }
      }
    }
    
    return false;
  } catch (error) {
    console.error(`Error finding and highlighting feature for ${isoCode}:`, error);
    return false;
  }
};

/**
 * Tries to find a country using various property fields for matching
 * @param map Mapbox GL map instance
 * @param isoCode ISO code to find
 * @param sourceLayer Source layer to query
 */
export const findCountryByVariousProperties = (
  map: mapboxgl.Map, 
  isoCode: string,
  sourceLayer: string = 'country_boundaries'
): boolean => {
  try {
    // Get all features and filter client-side for various property names
    const allFeatures = map.querySourceFeatures('countries', {
      sourceLayer: sourceLayer
    });
    
    console.log(`Searching through ${allFeatures.length} total features for ${isoCode}`);
    
    // Try to find matches with various property names
    const matchingFeatures = allFeatures.filter(f => 
      (f.properties?.iso_3166_1 === isoCode) ||
      (f.properties?.ISO_A2 === isoCode) ||
      (f.properties?.ISO_A3 === isoCode) ||
      (f.properties?.adm0_a3 === isoCode)
    );
    
    console.log(`Found ${matchingFeatures.length} features matching ${isoCode} through property search`);
    
    if (matchingFeatures.length > 0) {
      for (const feature of matchingFeatures) {
        if (feature.id !== undefined && feature.id !== null) {
          const featureId = feature.id as string;
          
          try {
            map.setFeatureState(
              { source: 'countries', sourceLayer: sourceLayer, id: featureId },
              { selected: true }
            );
            
            // Store selection for future reference
            setSelectedFeature(featureId, isoCode);
            return true;
          } catch (error) {
            console.error(`Error setting feature state for country ${isoCode}:`, error);
          }
        }
      }
    }
    
    return false;
  } catch (error) {
    console.error(`Error finding country by various properties for ${isoCode}:`, error);
    return false;
  }
};

/**
 * Clears the highlight from the previously selected country
 * @param map Mapbox GL map instance
 */
export const clearPreviousHighlight = (map: mapboxgl.Map): boolean => {
  try {
    const previousFeatureId = getSelectedFeatureId();
    if (previousFeatureId) {
      console.log(`Clearing previous highlight for country ID: ${previousFeatureId}`);
      
      map.setFeatureState(
        { source: 'countries', sourceLayer: 'country_boundaries', id: previousFeatureId },
        { selected: false }
      );
      
      setSelectedFeature(null, null);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error clearing previous country selection:", error);
    return false;
  }
};
