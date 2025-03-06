
import mapboxgl from 'mapbox-gl';
import { convertToIsoCode } from './utils/countryIdUtils';
import { getSelectedFeatureId, getSelectedCountryCode, setSelectedFeature } from './useCountryClickEvents';

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
      
      // Use both query methods to increase chance of finding the country
      let features: mapboxgl.MapboxGeoJSONFeature[] = [];
      
      // First try: Query specific layer
      features = map.querySourceFeatures('countries', {
        sourceLayer: 'country_boundaries',
        filter: ['==', 'iso_3166_1', isoCode]
      });
      
      // If no features found, try alternative approaches
      if (features.length === 0) {
        // Try different source layers
        const sourceLayers = ['country_boundaries', 'boundaries_admin_0', 'admin'];
        
        for (const sourceLayer of sourceLayers) {
          const layerFeatures = map.querySourceFeatures('countries', {
            sourceLayer: sourceLayer,
            filter: ['==', 'iso_3166_1', isoCode]
          });
          
          if (layerFeatures.length > 0) {
            features = layerFeatures;
            console.log(`Found ${layerFeatures.length} features in layer ${sourceLayer}`);
            break;
          }
        }
        
        // If still no features, try a more general query
        if (features.length === 0) {
          // Get all features and filter client-side
          const allFeatures = map.querySourceFeatures('countries', {
            sourceLayer: 'country_boundaries'
          });
          
          features = allFeatures.filter(f => 
            (f.properties?.iso_3166_1 === isoCode) ||
            (f.properties?.ISO_A2 === isoCode) ||
            (f.properties?.ISO_A3 === isoCode)
          );
        }
      }
      
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
          console.log(`No valid feature found for country ${isoCode}, will retry...`);
          setTimeout(() => retryHighlightCountry(map, isoCode), 300);
        }
      } else {
        console.log(`No features found for country code ${isoCode}. Will retry shortly...`);
        
        // Retry after a delay to allow the map to fully load
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

/**
 * Retry highlighting a country after a delay with expanded query options
 * @param map Mapbox GL map instance
 * @param isoCode ISO code to highlight
 */
const retryHighlightCountry = (map: mapboxgl.Map, isoCode: string) => {
  try {
    // Try with different source layer names that might exist
    let sourceLayers = ['country_boundaries', 'boundaries_admin_0'];
    let foundFeatures: mapboxgl.MapboxGeoJSONFeature[] = [];
    
    // Try each source layer
    for (const sourceLayer of sourceLayers) {
      const layerFeatures = map.querySourceFeatures('countries', {
        sourceLayer: sourceLayer,
        filter: ['==', 'iso_3166_1', isoCode]
      });
      
      if (layerFeatures.length > 0) {
        foundFeatures = layerFeatures;
        console.log(`Retry: Found ${layerFeatures.length} features for country ${isoCode} in layer ${sourceLayer}`);
        break;
      }
    }
    
    // If no features found with direct query, try getting all features
    if (foundFeatures.length === 0) {
      // Try a broader search with all features
      console.log("Trying broader search for country features...");
      
      for (const sourceLayer of sourceLayers) {
        const allFeatures = map.querySourceFeatures('countries', {
          sourceLayer: sourceLayer
        });
        
        console.log(`Found ${allFeatures.length} total features in layer ${sourceLayer}`);
        
        const matchingFeatures = allFeatures.filter(f => 
          f.properties?.iso_3166_1 === isoCode || 
          f.properties?.ISO_A2 === isoCode ||
          f.properties?.ISO_A3 === isoCode
        );
        
        if (matchingFeatures.length > 0) {
          foundFeatures = matchingFeatures;
          console.log(`Found ${matchingFeatures.length} matching features for ${isoCode}`);
          break;
        }
      }
    }
    
    // Process any found features
    if (foundFeatures.length > 0) {
      for (const feature of foundFeatures) {
        if (feature.id !== undefined && feature.id !== null) {
          const featureId = feature.id as string;
          
          try {
            // Determine the correct source layer
            const sourceLayer = feature.sourceLayer || 'country_boundaries';
            
            map.setFeatureState(
              { source: 'countries', sourceLayer: sourceLayer, id: featureId },
              { selected: true }
            );
            
            console.log(`Successfully highlighted feature ${featureId} for country ${isoCode}`);
            
            // Store selection for future reference
            setSelectedFeature(featureId, isoCode);
            return; // Exit after successful highlight
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
  } catch (error) {
    console.error("Error in retryHighlightCountry:", error);
  }
};

/**
 * Final attempt to highlight a country with forceful methods
 * @param map Mapbox GL map instance
 * @param isoCode ISO code to highlight
 */
const finalRetryHighlightCountry = (map: mapboxgl.Map, isoCode: string) => {
  try {
    console.log(`Final attempt to find country ${isoCode}`);
    
    // One last refresh of the map to ensure everything is loaded
    const center = map.getCenter();
    map.setCenter([center.lng + 0.1, center.lat]);
    setTimeout(() => {
      map.setCenter(center);
      
      // Try a different approach: get all features and filter client-side
      const allFeatures = map.querySourceFeatures('countries', {
        sourceLayer: 'country_boundaries'
      });
      
      console.log(`Final attempt found ${allFeatures.length} total features`);
      
      // Try to find matches with various property names
      const matchingFeatures = allFeatures.filter(f => 
        (f.properties?.iso_3166_1 === isoCode) ||
        (f.properties?.ISO_A2 === isoCode) ||
        (f.properties?.ISO_A3 === isoCode) ||
        (f.properties?.adm0_a3 === isoCode)
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
          console.log(`Successfully highlighted country ${isoCode} on final attempt`);
        } catch (error) {
          console.error(`Error in final attempt for country ${isoCode}:`, error);
        }
      } else {
        console.log(`Could not find any features with ID for country ${isoCode} in final attempt`);
      }
    }, 300);
  } catch (error) {
    console.error("Error in finalRetryHighlightCountry:", error);
  }
};
