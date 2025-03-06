
import mapboxgl from 'mapbox-gl';
import { calculateFeatureBbox } from './utils/bboxUtils';
import { supabase } from "@/integrations/supabase/client";

let selectedCountryId: string | null = null;
let selectedCountryCode: string | null = null;

// Helper function to find country_id from ISO code
const getCountryIdFromIsoCode = async (isoCode: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('y3countries')
      .select('country_id')
      .or(`country_iso2.eq.${isoCode},country_iso3.eq.${isoCode}`)
      .maybeSingle();
      
    if (error) {
      console.error("Error finding country ID from ISO code:", error);
      return null;
    }
    
    return data?.country_id || null;
  } catch (error) {
    console.error("Exception finding country ID from ISO code:", error);
    return null;
  }
};

export const setupClickEvents = (map: mapboxgl.Map, onCountryClick: (countryId: string) => void) => {
  console.log("Setting up map click events");
  
  // Remove any existing click event to prevent duplicates
  map.off('click', 'countries-fill');
  
  // On click
  map.on('click', 'countries-fill', async (e) => {
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
        const countryId = await getCountryIdFromIsoCode(isoCode);
        
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
      }
    }
  });
};

export const highlightCountry = (map: mapboxgl.Map, countryCode: string) => {
  if (!map || !map.isStyleLoaded()) {
    console.log("Map style not loaded yet, can't highlight country");
    return;
  }
  
  console.log(`Attempting to highlight country with code: ${countryCode}`);
  
  // Clear previous selection first, regardless of new selection
  if (selectedCountryId) {
    try {
      console.log(`Clearing previous highlight for country ID: ${selectedCountryId}`);
      map.setFeatureState(
        { source: 'countries', sourceLayer: 'country_boundaries', id: selectedCountryId },
        { selected: false }
      );
      selectedCountryId = null;
    } catch (error) {
      console.error("Error clearing previous country selection:", error);
    }
  }
  
  // If no country code provided or empty string, we're just clearing selection
  if (!countryCode || countryCode === '') {
    selectedCountryCode = null;
    console.log("Country selection cleared, no new country to highlight");
    return;
  }
  
  // Store the currently highlighted country code
  selectedCountryCode = countryCode;
  
  // Convert country_id to ISO code if needed
  const findAndConvertToIso = async () => {
    // Check if this is a UUID (typical format for country_id)
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(countryCode);
    
    let isoCode = countryCode;
    
    // If it's a UUID, we need to find the ISO code
    if (isUuid) {
      try {
        const { data, error } = await supabase
          .from('y3countries')
          .select('country_iso2')
          .eq('country_id', countryCode)
          .maybeSingle();
          
        if (error) {
          console.error("Error finding ISO code:", error);
        } else if (data?.country_iso2) {
          isoCode = data.country_iso2;
          console.log(`Converted country_id ${countryCode} to ISO code ${isoCode}`);
        }
      } catch (error) {
        console.error("Exception finding ISO code:", error);
      }
    }
    
    return isoCode;
  };
  
  // Function to query and highlight the country
  const findAndHighlightCountry = async () => {
    // Get ISO code if needed
    const isoCode = await findAndConvertToIso();
    
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
          selectedCountryId = feature.id as string;
          
          console.log(`Setting feature state for ID: ${selectedCountryId}`);
          
          try {
            map.setFeatureState(
              { source: 'countries', sourceLayer: 'country_boundaries', id: selectedCountryId },
              { selected: true }
            );
            
            // Removed the map.fitBounds() call to prevent zooming/panning
            
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
        const delayedFeatures = map.querySourceFeatures('countries', {
          sourceLayer: 'country_boundaries',
          filter: ['==', 'iso_3166_1', isoCode]
        });
        
        console.log(`Retry: Found ${delayedFeatures.length} features for country ${isoCode}`);
        
        if (delayedFeatures.length > 0) {
          for (const feature of delayedFeatures) {
            if (feature.id !== undefined && feature.id !== null) {
              selectedCountryId = feature.id as string;
              
              try {
                map.setFeatureState(
                  { source: 'countries', sourceLayer: 'country_boundaries', id: selectedCountryId },
                  { selected: true }
                );
                
                // Removed the map.fitBounds() call to prevent zooming/panning
                
                break;
              } catch (error) {
                console.error(`Error setting feature state for country ${isoCode} on retry:`, error);
              }
            }
          }
        } else {
          // Last attempt with a longer delay
          setTimeout(() => {
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
              selectedCountryId = matchingFeatures[0].id as string;
              
              try {
                map.setFeatureState(
                  { source: 'countries', sourceLayer: 'country_boundaries', id: selectedCountryId },
                  { selected: true }
                );
                
                // Removed the map.fitBounds() call to prevent zooming/panning
                
              } catch (error) {
                console.error(`Error in final attempt for country ${isoCode}:`, error);
              }
            }
          }, 1500);
        }
      }, 500);
    }
  };
  
  // Execute the function
  findAndHighlightCountry();
};
