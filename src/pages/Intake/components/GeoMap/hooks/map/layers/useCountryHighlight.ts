
import mapboxgl from 'mapbox-gl';
import { convertToIsoCode } from './utils/countryIdUtils';
import { getSelectedFeatureId, getSelectedCountryCode, setSelectedFeature } from './useCountryClickEvents';

/**
 * Highlights a country on the map
 * @param map Mapbox GL map instance
 * @param countryCode Country ID or ISO code to highlight
 */
export const highlightCountry = (map: mapboxgl.Map, countryCode: string) => {
  if (!map || !map.isStyleLoaded()) {
    console.log("Map style not loaded yet, can't highlight country");
    return;
  }
  
  console.log(`Attempting to highlight country with code: ${countryCode}`);
  
  // Clear previous selection first, regardless of new selection
  const previousFeatureId = getSelectedFeatureId();
  if (previousFeatureId) {
    try {
      console.log(`Clearing previous highlight for country ID: ${previousFeatureId}`);
      map.setFeatureState(
        { source: 'countries', sourceLayer: 'country_boundaries', id: previousFeatureId },
        { selected: false }
      );
      setSelectedFeature(null, null);
    } catch (error) {
      console.error("Error clearing previous country selection:", error);
    }
  }
  
  // If no country code provided or empty string, we're just clearing selection
  if (!countryCode || countryCode === '') {
    console.log("Country selection cleared, no new country to highlight");
    return;
  }
  
  // Function to query and highlight the country
  const findAndHighlightCountry = async () => {
    // Get ISO code if needed
    const isoCode = await convertToIsoCode(countryCode);
    
    console.log(`Searching for country features with ISO code: ${isoCode}`);
    
    // Query features directly using ISO code filter
    const features = map.querySourceFeatures('countries', {
      sourceLayer: 'country_boundaries',
      filter: ['==', 'iso_3166_1', isoCode]
    });
    
    console.log(`Found ${features.length} features for country code ${isoCode}`);
    
    if (features.length > 0) {
      let foundValidFeature = false;
      
      // Try to find a feature with a valid ID
      for (const feature of features) {
        if (feature.id !== undefined && feature.id !== null) {
          const featureId = feature.id as string;
          
          console.log(`Setting feature state for ID: ${featureId}`);
          
          try {
            map.setFeatureState(
              { source: 'countries', sourceLayer: 'country_boundaries', id: featureId },
              { selected: true }
            );
            
            // Store selection for future reference
            setSelectedFeature(featureId, isoCode);
            
            foundValidFeature = true;
            break; // Exit the loop once we've found and highlighted a feature
          } catch (error) {
            console.error(`Error setting feature state for country ${isoCode}:`, error);
          }
        }
      }
      
      if (!foundValidFeature) {
        console.log(`No valid feature found for country ${isoCode}`);
      }
    } else {
      console.log(`No features found for country code ${isoCode}. Will retry shortly...`);
      
      // Retry after a delay to allow the map to fully load
      setTimeout(() => {
        retryHighlightCountry(map, isoCode);
      }, 500);
    }
  };
  
  // Execute the function
  findAndHighlightCountry();
};

/**
 * Retry highlighting a country after a delay
 * @param map Mapbox GL map instance
 * @param isoCode ISO code to highlight
 */
const retryHighlightCountry = (map: mapboxgl.Map, isoCode: string) => {
  const delayedFeatures = map.querySourceFeatures('countries', {
    sourceLayer: 'country_boundaries',
    filter: ['==', 'iso_3166_1', isoCode]
  });
  
  console.log(`Retry: Found ${delayedFeatures.length} features for country ${isoCode}`);
  
  if (delayedFeatures.length > 0) {
    for (const feature of delayedFeatures) {
      if (feature.id !== undefined && feature.id !== null) {
        const featureId = feature.id as string;
        
        try {
          map.setFeatureState(
            { source: 'countries', sourceLayer: 'country_boundaries', id: featureId },
            { selected: true }
          );
          
          // Store selection for future reference
          setSelectedFeature(featureId, isoCode);
          break;
        } catch (error) {
          console.error(`Error setting feature state for country ${isoCode} on retry:`, error);
        }
      }
    }
  } else {
    // Last attempt with a longer delay
    setTimeout(() => {
      finalRetryHighlightCountry(map, isoCode);
    }, 1500);
  }
};

/**
 * Final attempt to highlight a country
 * @param map Mapbox GL map instance
 * @param isoCode ISO code to highlight
 */
const finalRetryHighlightCountry = (map: mapboxgl.Map, isoCode: string) => {
  console.log(`Final attempt to find country ${isoCode}`);
  
  // Try a different approach: get all features and filter client-side
  const allFeatures = map.querySourceFeatures('countries', {
    sourceLayer: 'country_boundaries'
  });
  
  const matchingFeatures = allFeatures.filter(f => 
    f.properties?.iso_3166_1 === isoCode
  );
  
  console.log(`Final attempt found ${matchingFeatures.length} features for ${isoCode}`);
  
  if (matchingFeatures.length > 0 && matchingFeatures[0].id !== undefined) {
    const featureId = matchingFeatures[0].id as string;
    
    try {
      map.setFeatureState(
        { source: 'countries', sourceLayer: 'country_boundaries', id: featureId },
        { selected: true }
      );
      
      // Store selection for future reference
      setSelectedFeature(featureId, isoCode);
    } catch (error) {
      console.error(`Error in final attempt for country ${isoCode}:`, error);
    }
  }
};
