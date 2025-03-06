
import { supabase } from "@/integrations/supabase/client";

// Cache for the GeoJSON data to avoid multiple fetches
let cachedGeoJSON: any = null;

/**
 * Fetch countries GeoJSON data with caching and multiple fallback sources
 */
export const getCountriesGeoJSON = async (): Promise<any> => {
  // Return cached data if available
  if (cachedGeoJSON) {
    console.log("Using cached GeoJSON data");
    return cachedGeoJSON;
  }
  
  try {
    console.log("Fetching countries GeoJSON from primary source");
    
    // First attempt: Try to fetch from Supabase function
    const { data: geoJSONData, error } = await supabase.functions.invoke('get-countries-geojson');
    
    if (error) {
      throw new Error(`Supabase function error: ${error.message}`);
    }
    
    if (geoJSONData && typeof geoJSONData === 'object') {
      console.log("Successfully loaded GeoJSON data from Supabase function");
      cachedGeoJSON = geoJSONData;
      return geoJSONData;
    }
    
    throw new Error("Invalid GeoJSON data from Supabase function");
  } catch (primaryError) {
    console.error("Error fetching from primary source:", primaryError);
    
    try {
      // Fallback: Try to fetch from public URL (Natural Earth data)
      console.log("Attempting to fetch from fallback source");
      const response = await fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson');
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      
      const geoJSONData = await response.json();
      console.log("Successfully loaded GeoJSON data from fallback source");
      cachedGeoJSON = geoJSONData;
      return geoJSONData;
    } catch (fallbackError) {
      console.error("Error fetching from fallback source:", fallbackError);
      
      // Last resort: Use minimal built-in GeoJSON with major countries only
      console.log("Using built-in minimal GeoJSON data");
      
      // This is a simplified GeoJSON with just a few major countries
      // In a real implementation, embed a complete but simplified world GeoJSON here
      const minimalGeoJSON = {
        type: "FeatureCollection",
        features: [
          // Just a few example countries - in a real implementation this would include all countries
          // but with simplified geometries
          {
            type: "Feature",
            properties: {
              NAME: "United States of America",
              ISO_A2: "US",
              ISO_A3: "USA"
            },
            geometry: {
              type: "MultiPolygon",
              coordinates: [[[[-125, 48], [-125, 32], [-110, 32], [-110, 48], [-125, 48]]]]
            },
            id: "USA"
          },
          {
            type: "Feature",
            properties: {
              NAME: "Brazil",
              ISO_A2: "BR",
              ISO_A3: "BRA"
            },
            geometry: {
              type: "Polygon",
              coordinates: [[[-60, 5], [-60, -30], [-40, -30], [-40, 5], [-60, 5]]]
            },
            id: "BRA"
          }
          // In a real implementation, add more countries here
        ]
      };
      
      cachedGeoJSON = minimalGeoJSON;
      return minimalGeoJSON;
    }
  }
};

/**
 * Clear the cached GeoJSON data
 */
export const clearGeoJSONCache = (): void => {
  cachedGeoJSON = null;
};
