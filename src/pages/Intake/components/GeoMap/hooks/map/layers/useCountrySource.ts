
import mapboxgl from 'mapbox-gl';

export const addCountrySource = (map: mapboxgl.Map) => {
  try {
    if (!map.getSource('countries')) {
      console.log("Adding countries source to map...");
      
      // Make sure the style is loaded before adding the source
      if (!map.isStyleLoaded()) {
        console.log("Map style not fully loaded yet, waiting for style load event...");
        map.once('style.load', () => {
          console.log("Style loaded, now adding countries source");
          addCountrySource(map); // Retry after style is loaded
        });
        return;
      }
      
      try {
        // First try the primary country boundaries source
        map.addSource('countries', {
          type: 'vector',
          url: 'mapbox://mapbox.country-boundaries-v1',
          promoteId: 'iso_3166_1' // This helps with feature state management
        });
        console.log("Countries source added successfully");
        
        // Verify the source was added
        if (map.getSource('countries')) {
          console.log("Verified: countries source exists in the map");
        } else {
          console.error("Source addition verification failed: countries source not found after adding");
          throw new Error("Source verification failed");
        }
      } catch (error) {
        console.error("Error adding countries source:", error);
        
        // If first attempt failed, try again with a different source after a short delay
        setTimeout(() => {
          try {
            if (!map.getSource('countries')) {
              console.log("Attempting fallback source addition...");
              map.addSource('countries', {
                type: 'vector',
                url: 'mapbox://mapbox.boundaries-adm0-v3',
                promoteId: 'iso_3166_1_alpha_3' // Different ID field in this dataset
              });
              console.log("Fallback countries source added");
            }
          } catch (fallbackError) {
            console.error("Fallback source addition failed:", fallbackError);
            
            // Third attempt with different options
            setTimeout(() => {
              try {
                if (!map.getSource('countries')) {
                  console.log("Attempting second fallback source addition...");
                  map.addSource('countries', {
                    type: 'vector',
                    url: 'mapbox://mapbox.country-boundaries-v1',
                    maxzoom: 8
                  });
                  console.log("Second fallback countries source added");
                }
              } catch (thirdError) {
                console.error("Second fallback source addition failed:", thirdError);
              }
            }, 500);
          }
        }, 500);
      }
    } else {
      console.log("Countries source already exists");
    }
  } catch (outerError) {
    console.error("Unexpected error in addCountrySource:", outerError);
  }
};
