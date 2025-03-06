import mapboxgl from 'mapbox-gl';
import { calculateFeatureBbox } from './utils/bboxUtils';

let selectedCountryId: string | null = null;
let selectedCountryCode: string | null = null;

export const setupClickEvents = (map: mapboxgl.Map, onCountryClick: (countryId: string) => void) => {
  // On click
  map.on('click', 'countries-fill', (e) => {
    if (e.features && e.features.length > 0) {
      const countryId = e.features[0].id as string;
      const countryName = e.features[0].properties?.iso_3166_1 || '';
      
      console.log(`Map click: Selected country ${countryName} (id: ${countryId})`);
      
      // Check if we're clicking on the already selected country
      if (selectedCountryCode === countryName) {
        console.log('Deselecting current country');
        // Deselect the country
        onCountryClick('');
      } else {
        // Select the new country
        onCountryClick(countryName);
      }
    }
  });
};

export const highlightCountry = (map: mapboxgl.Map, countryCode: string) => {
  if (!map || !map.isStyleLoaded()) {
    console.log("Map style not loaded yet, can't highlight country");
    return;
  }
  
  // Store the currently highlighted country code
  selectedCountryCode = countryCode;
  
  if (!countryCode) {
    // Clear previous selection
    if (selectedCountryId) {
      try {
        map.setFeatureState(
          { source: 'countries', sourceLayer: 'country_boundaries', id: selectedCountryId },
          { selected: false }
        );
        selectedCountryId = null;
        console.log("Successfully cleared country selection on map");
      } catch (error) {
        console.error("Error clearing previous country selection:", error);
      }
    }
    return;
  }
  
  console.log(`Attempting to highlight country with code: ${countryCode}`);
  
  // Find the ISO code from the country code (assuming it might be a UUID in some cases)
  let isoCode = countryCode;
  
  // Clear previous selection if any
  if (selectedCountryId) {
    try {
      map.setFeatureState(
        { source: 'countries', sourceLayer: 'country_boundaries', id: selectedCountryId },
        { selected: false }
      );
    } catch (error) {
      console.error("Error clearing previous country selection:", error);
    }
  }
  
  // Function to query and highlight the country
  const findAndHighlightCountry = () => {
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
