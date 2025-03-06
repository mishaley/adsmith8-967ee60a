
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
      
      console.log("Using built-in minimal GeoJSON data");
      
      // Create a more comprehensive built-in fallback with major countries
      const minimalGeoJSON = {
        type: "FeatureCollection",
        features: [
          // United States
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
            id: 1
          },
          // Canada
          {
            type: "Feature",
            properties: {
              NAME: "Canada",
              ISO_A2: "CA",
              ISO_A3: "CAN"
            },
            geometry: {
              type: "MultiPolygon",
              coordinates: [[[[-140, 70], [-140, 48], [-55, 48], [-55, 70], [-140, 70]]]]
            },
            id: 2
          },
          // Mexico
          {
            type: "Feature",
            properties: {
              NAME: "Mexico",
              ISO_A2: "MX",
              ISO_A3: "MEX"
            },
            geometry: {
              type: "Polygon",
              coordinates: [[[-118, 32], [-118, 15], [-86, 15], [-86, 32], [-118, 32]]]
            },
            id: 3
          },
          // Brazil
          {
            type: "Feature",
            properties: {
              NAME: "Brazil",
              ISO_A2: "BR",
              ISO_A3: "BRA"
            },
            geometry: {
              type: "Polygon",
              coordinates: [[[-70, 5], [-70, -30], [-35, -30], [-35, 5], [-70, 5]]]
            },
            id: 4
          },
          // United Kingdom
          {
            type: "Feature",
            properties: {
              NAME: "United Kingdom",
              ISO_A2: "GB",
              ISO_A3: "GBR"
            },
            geometry: {
              type: "MultiPolygon",
              coordinates: [[[[-5, 58], [-5, 50], [2, 50], [2, 58], [-5, 58]]]]
            },
            id: 5
          },
          // France
          {
            type: "Feature",
            properties: {
              NAME: "France",
              ISO_A2: "FR",
              ISO_A3: "FRA"
            },
            geometry: {
              type: "Polygon",
              coordinates: [[[0, 51], [0, 42], [8, 42], [8, 51], [0, 51]]]
            },
            id: 6
          },
          // Germany
          {
            type: "Feature",
            properties: {
              NAME: "Germany",
              ISO_A2: "DE",
              ISO_A3: "DEU"
            },
            geometry: {
              type: "Polygon",
              coordinates: [[[6, 55], [6, 47], [15, 47], [15, 55], [6, 55]]]
            },
            id: 7
          },
          // India
          {
            type: "Feature",
            properties: {
              NAME: "India",
              ISO_A2: "IN",
              ISO_A3: "IND"
            },
            geometry: {
              type: "Polygon",
              coordinates: [[[70, 35], [70, 8], [90, 8], [90, 35], [70, 35]]]
            },
            id: 8
          },
          // China
          {
            type: "Feature",
            properties: {
              NAME: "China",
              ISO_A2: "CN",
              ISO_A3: "CHN"
            },
            geometry: {
              type: "Polygon",
              coordinates: [[[75, 45], [75, 20], [130, 20], [130, 45], [75, 45]]]
            },
            id: 9
          },
          // Australia
          {
            type: "Feature",
            properties: {
              NAME: "Australia",
              ISO_A2: "AU",
              ISO_A3: "AUS"
            },
            geometry: {
              type: "Polygon",
              coordinates: [[[115, -10], [115, -40], [155, -40], [155, -10], [115, -10]]]
            },
            id: 10
          },
          // Japan
          {
            type: "Feature",
            properties: {
              NAME: "Japan",
              ISO_A2: "JP",
              ISO_A3: "JPN"
            },
            geometry: {
              type: "MultiPolygon",
              coordinates: [[[[130, 45], [130, 30], [145, 30], [145, 45], [130, 45]]]]
            },
            id: 11
          },
          // South Africa
          {
            type: "Feature",
            properties: {
              NAME: "South Africa",
              ISO_A2: "ZA",
              ISO_A3: "ZAF"
            },
            geometry: {
              type: "Polygon",
              coordinates: [[[15, -25], [15, -35], [32, -35], [32, -25], [15, -25]]]
            },
            id: 12
          }
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
